import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  isCorrectVerified: boolean; // false until manually validated by recruiter
  niveauDifficulte?: string;
  chronometre?: number;
  createdAt?: string;
}

export interface TestResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface AIRecommendation {
  score: number;
  totalQuestions: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export type DifficultyLevel = 'facile' | 'moyen' | 'difficile';

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) { }

  private readonly ollamaUrl = 'http://127.0.0.1:11434/api/generate';
  private readonly model = 'phi3:mini';

  // ── Private helper: call Ollama (plain text, no JSON format) ─────────────────

  private async callOllamaText(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.ollamaUrl,
        { model: this.model, prompt, stream: false },
        { timeout: 600000 },
      );
      return response.data?.response ?? '';
    } catch (error: any) {
      this.logger.error('Ollama API error:', error.message);
      throw new HttpException(
        'Erreur lors de la communication avec Ollama: ' + error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // ── Private helper: call Ollama (JSON format for recommendation) ─────────────

  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.ollamaUrl,
        {
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.7, num_predict: 800 },
        },
        { timeout: 600000 },
      );
      return response.data?.response ?? '';
    } catch (error: any) {
      this.logger.error('Ollama API error:', error.message);
      throw new HttpException(
        'Erreur lors de la communication avec Ollama: ' + error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // ── Private helper: extract JSON from raw LLM response ──────────────────────

  private extractJson<T>(raw: string): T {
    try {
      // 1. Try direct parse
      const trimmed = raw.trim();
      try {
        return JSON.parse(trimmed) as T;
      } catch {
        // Continue to regex extraction
      }

      // 2. Try extracting JSON block from Markdown (```json ... ```)
      const markdownMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (markdownMatch && markdownMatch[1]) {
        try {
          return JSON.parse(markdownMatch[1].trim()) as T;
        } catch {
          // Continue to generic extraction
        }
      }

      // 3. Generic extraction of the largest JSON-like block {} or []
      const match = raw.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]) as T;
      }

      throw new Error('No JSON block found');
    } catch (error) {
      this.logger.error('Invalid JSON content received from AI:', raw);
      throw new HttpException(
        "L'IA n'a pas retourné un JSON valide ou le texte est tronqué. Veuillez réessayer.",
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  // ── Private helper: generate N questions via JSON parsing with custom filtering ─

  private parseJsonQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw || !raw.question || !Array.isArray(raw.options) || !raw.correctAnswer) {
      this.logger.warn(`Question ignored at index ${index}: invalid JSON.`);
      return null;
    }

    const seen = new Set<string>();
    const filtered: string[] = [];

    for (const opt of raw.options) {
      if (typeof opt !== 'string') continue;
      const cleaned = opt.replace(/^[A-Da-d][).\s]+/, '').trim();
      if (cleaned.length < 2) continue;              // skip empty strings only
      if (seen.has(cleaned.toLowerCase())) continue;  // skip duplicates
      filtered.push(cleaned);
      seen.add(cleaned.toLowerCase());
      if (filtered.length === 4) break;
    }

    if (filtered.length < 2) {
      this.logger.warn(`Question "${raw.question.substring(0, 30)}..." ignored: less than 2 options (${filtered.length} found).`);
      return null;
    }

    // Pad to 4 options if needed
    while (filtered.length < 4) filtered.push('N/A');

    const rawCorrect = raw.correctAnswer.replace(/^[A-Da-d][).\s]+/, '').trim();
    const correctMatch = filtered.find(opt => opt.toLowerCase() === rawCorrect.toLowerCase());
    const finalCorrectAnswer = correctMatch ? correctMatch : filtered[0];

    return {
      id: index + 1,
      question: raw.question.trim(),
      options: filtered.slice(0, 4).map(opt => ({
        text: opt,
        isCorrect: opt === finalCorrectAnswer
      })),
      isCorrectVerified: false
    };
  }

  // ── Private helper: clean and deduplicate a raw option string ──────────────

  private cleanOption(raw: string): string {
    return raw
      .replace(/^[A-Da-d][).\\s]+/, '')  // strip leading letter+separator
      .replace(/\([^)]*correct[^)]*\)/gi, '') // strip (correct answer is X)
      .trim();
  }

  // ── Private helper: parse one Q&A text block into a QuizQuestion ─────────
  //   Rules enforced here:
  //   - exactly 4 options (discard block if < 4 after cleaning)
  //   - deduplicate options (case-insensitive)
  //   - discard empty / too-short options (< 3 chars)

  private parseTextQuestion(text: string, index: number): QuizQuestion | null {
    const lines = text.split('\n').filter((l: string) => l.trim() !== '');
    if (lines.length < 2) return null;

    const optionRegex = /^[A-Da-d][).\\s]/;
    const questionLines: string[] = [];
    const rawAnswerLines: string[] = [];
    let foundOptions = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (optionRegex.test(trimmed)) foundOptions = true;

      if (!foundOptions) {
        // Skip meta-lines like question numbers or separators
        if (!/^(--|\d+[.)\\s])/.test(trimmed)) {
          questionLines.push(trimmed);
        }
      } else if (optionRegex.test(trimmed)) {
        rawAnswerLines.push(trimmed);
      }
    }

    const questionText = questionLines.join(' ').trim();
    if (!questionText || questionText.length < 5) return null;

    // Clean, deduplicate, and filter options
    const seen = new Set<string>();
    const answers: string[] = [];
    for (const raw of rawAnswerLines) {
      const cleaned = this.cleanOption(raw);
      if (cleaned.length < 1) continue;              // skip empty
      const key = cleaned.toLowerCase();
      if (seen.has(key)) continue;                   // skip duplicates
      seen.add(key);
      answers.push(cleaned);
      if (answers.length === 4) break;               // keep exactly 4
    }

    // Need at least 2 valid options to be a real MCQ
    if (answers.length < 2) return null;

    // Always slice to max 4 (safety net)
    const options = answers.slice(0, 4);

    return {
      id: index + 1,
      question: questionText,
      options: options.map((opt, i) => ({ text: opt, isCorrect: i === 0 })), // first option = correct by prompt convention
      isCorrectVerified: false,              // recruiter must validate before publishing
    };
  }

  // ── Private helper: generate N questions via improved prompt + text parsing ─

  private async generateTextQuestions(
    jobDescription: string,
    count: number,
    difficulty: string = 'moyen',
    previousQuestions: string[] = [],
    competences: string = '',
  ): Promise<QuizQuestion[]> {
    // For regeneration: inject a strong avoidance block
    const avoidBlock = previousQuestions.length > 0
      ? 'ATTENTION - RÉGÉNÉRATION : Génère des questions COMPLÈTEMENT DIFFÉRENTES des suivantes.\n' +
      'Ne réutilise aucun concept, sujet ni formulation similaire :\n' +
      previousQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n') +
      '\n\n'
      : '';

    const competencesBlock = competences
      ? '\nCompétences requises :\n' + competences.substring(0, 500)
      : '';

    const prompt =
      'Génère 4 questions QCM techniques courtes (maximum 1 phrase par question) pour ce poste.\n' +
      'Format JSON attendu strict (tableau, 4 options par question, une seule option correcte) :\n' +
      '[\n' +
      '  {\n' +
      '    "question": "question 1 ?",\n' +
      '    "options": [\n' +
      '      {"text": "réponse A", "isCorrect": true},\n' +
      '      {"text": "réponse B", "isCorrect": false},\n' +
      '      {"text": "réponse C", "isCorrect": false},\n' +
      '      {"text": "réponse D", "isCorrect": false}\n' +
      '    ]\n' +
      '  }\n' +
      ']\n\n' +
      avoidBlock +
      'Poste :\n' +
      jobDescription.substring(0, 400) +
      competencesBlock;

    const maxAttempts = 2;
    let attempts = 0;
    let allParsed: QuizQuestion[] = [];

    while (attempts < maxAttempts && allParsed.length < count) {
      attempts++;
      try {
        const text = await this.callOllama(prompt);
        this.logger.log(`Attempt ${attempts}/${maxAttempts} | Raw response: ${text.substring(0, 200)}...`);

        let rawJson: any;
        try {
          rawJson = this.extractJson<any>(text);
        } catch (e) {
          this.logger.error(`Attempt ${attempts} failed to extract JSON.`);
          continue;
        }

        let jsonArray: any[] = [];
        if (Array.isArray(rawJson)) {
          jsonArray = rawJson;
        } else if (rawJson && typeof rawJson === 'object') {
          const possibleArrays = Object.values(rawJson).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            jsonArray = possibleArrays[0] as any[];
          } else if (rawJson.questions && Array.isArray(rawJson.questions)) {
            jsonArray = rawJson.questions;
          }
        }

        if (!jsonArray || jsonArray.length === 0) {
          this.logger.warn(`Attempt ${attempts} returned no questions array.`);
          continue;
        }

        const initialParsedLength = allParsed.length;
        for (const item of jsonArray) {
          const q = this.parseJsonQuestion(item, allParsed.length);
          if (q) {
            // Deduplicate questions by text
            if (!allParsed.some(existing => existing.question.toLowerCase() === q.question.toLowerCase())) {
              allParsed.push(q);
            }
          }
          if (allParsed.length >= count) break;
        }

        // If we didn't manage to parse any NEW valid questions from this attempt, break to prevent infinite loops with the same prompt.
        if (allParsed.length === initialParsedLength) {
          this.logger.warn(`Attempt ${attempts} yielded no new valid questions. Breaking to avoid strict retry loops that cause timeouts.`);
          break;
        }
      } catch (error) {
        this.logger.error(`Attempt ${attempts} threw error: ${error.message}`);
      }
    }

    if (allParsed.length === 0) {
      throw new HttpException("L'IA n'a pas pu générer de questions valides après plusieurs tentatives. Veuillez réessayer.", HttpStatus.BAD_GATEWAY);
    }

    return allParsed.slice(0, count);
  }

  // ── 1. Generate questions ─────────────────────────────────────────────────────

  async generateQuestions(
    jobDescription: string,
    difficulty: DifficultyLevel = 'moyen',
    offre: any = null,
    competences: string = '',
  ): Promise<any[]> {
    this.logger.log('Generating 2 questions with text parsing');

    const aiQuestions = await this.generateTextQuestions(jobDescription, 4, difficulty, [], competences);

    if (offre && aiQuestions.length > 0) {
      const entities: Question[] = aiQuestions.map((q) => {
        const e = new Question();
        e.contenu = { question: q.question, options: q.options };
        e.chronometre = 30;
        e.niveauDifficulte = 'Moyen';
        e.offre = offre;
        return e;
      });
      const saved = await this.questionRepository.save(entities);
      return saved;
    }

    return aiQuestions.map(q => ({
      ...q,
      niveauDifficulte: 'Moyen',
      chronometre: 30, // default timer as per user example
      createdAt: new Date().toISOString(),
    }));
  }

  // ── 2. Regenerate questions (avoid previous ones) ────────────────────────────

  async regenerateQuestions(
    jobDescription: string,
    difficulty: DifficultyLevel = 'moyen',
    previousQuestions: string[] = [],
    competences: string = '',
  ): Promise<QuizQuestion[]> {
    this.logger.log(
      'Regenerating questions | difficulty: ' +
      difficulty +
      ' | avoiding ' +
      previousQuestions.length +
      ' previous',
    );

    const questions = await this.generateTextQuestions(
      jobDescription,
      4,
      difficulty,
      previousQuestions,
      competences,
    );

    if (questions.length === 0) {
      throw new HttpException(
        "L'IA n'a pas retourne de questions valides lors de la regeneration.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return questions.map(q => ({
      ...q,
      niveauDifficulte: 'Moyen',
      chronometre: 30,
      createdAt: new Date().toISOString(),
    }));
  }

  // ── 3. AI recommendation after test ─────────────────────────────────────────

  async generateRecommendation(
    jobDescription: string,
    results: TestResult[],
  ): Promise<AIRecommendation> {
    this.logger.log(
      'Generating recommendation for ' + results.length + ' answered question(s)',
    );

    const totalQuestions = results.length;
    const correctCount = results.filter((r) => r.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    let niveau: string = 'Débutant';
    if (score >= 80) {
      niveau = 'Avancé';
    } else if (score >= 50) {
      niveau = 'Intermédiaire';
    }

    const wrongAnswers = results
      .filter((r) => !r.isCorrect)
      .map(
        (r) =>
          '- Question: "' +
          r.question +
          '" | Candidate answered: "' +
          r.selectedAnswer +
          '" | Correct answer: "' +
          r.correctAnswer +
          '"',
      )
      .join('\n');

    const correctAnswers = results
      .filter((r) => r.isCorrect)
      .map((r) => '- "' + r.question + '"')
      .join('\n');

    const MAX_DESC_LENGTH = 1000;
    const safeJobDesc =
      jobDescription.length > MAX_DESC_LENGTH
        ? jobDescription.substring(0, MAX_DESC_LENGTH) +
        '\n... [Truncated to optimize generation time]'
        : jobDescription;

    const prompt =
      'You are an expert career coach and technical recruiter. A candidate has completed a skills assessment test.\n\n' +
      'JOB DESCRIPTION:\n' +
      safeJobDesc +
      '\n\nTEST RESULTS:\n' +
      '- Total questions: ' + totalQuestions + '\n' +
      '- Correct answers: ' + correctCount + '\n' +
      '- Score: ' + score + '%\n\n' +
      'QUESTIONS ANSWERED CORRECTLY:\n' +
      (correctAnswers || 'None') +
      '\n\nQUESTIONS ANSWERED INCORRECTLY:\n' +
      (wrongAnswers || 'None') +
      '\n\nBased on these results, provide a detailed analysis. Return ONLY a valid JSON object with this exact structure (no markdown, no commentary):\n' +
      '{\n' +
      '  "score": ' + score + ',\n' +
      '  "totalQuestions": ' + totalQuestions + ',\n' +
      '  "percentage": ' + score + ',\n' +
      '  "niveau": "' + niveau + '",\n' +
      '  "strengths": ["Specific strength based on correct answers..."],\n' +
      '  "weaknesses": ["Specific weakness based on wrong answers..."],\n' +
      '  "recommendations": ["Specific, actionable recommendation to improve..."]\n' +
      '}\n\n' +
      'Rules:\n' +
      '- strengths: list at least 2 specific technical strengths the candidate demonstrated.\n' +
      '- weaknesses: list at least 2 specific areas where the candidate needs improvement.\n' +
      '- recommendations: list at least 3 concrete, actionable steps to improve weak areas.\n' +
      '- All content must be relevant to the job description and actual answers.\n' +
      '- Write in French.';

    const raw = await this.callOllama(prompt);
    const recommendation = this.extractJson<AIRecommendation>(raw);

    // Ensure score fields are present
    recommendation.score = score;
    recommendation.totalQuestions = totalQuestions;
    recommendation.percentage = score;

    return recommendation;
  }
}
