import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];          // always exactly 4 items
  correctAnswer: string;
  isCorrectVerified: boolean; // false until manually validated by recruiter
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

  private readonly ollamaUrl = 'http://localhost:11434/api/generate';
  private readonly model = 'phi3';

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
          options: { temperature: 0.7, num_predict: 512 },
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
      const match = raw.match(/\[.*\]|\{.*\}/s);
      if (match) {
        return JSON.parse(match[0]) as T;
      }
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as T;
    } catch {
      this.logger.error('Invalid JSON from Ollama:', raw);
      throw new HttpException(
        "L'IA n'a pas retourne un JSON valide.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  // ── Private helper: generate N questions via JSON parsing with custom filtering ─

  private isTechnology(option: string): boolean {
    const techKeywords = ["docker", "kubernetes", "aws", "azure", "react", "java", "python", "angular", "node", "sql", "git", "spring"];
    // Return true if the option IS JUST a technology name (very short expression containing the tech)
    // but allow sentences that mention technologies in a broader responsibility context (e.g., "Deploy applications using Docker and AWS")
    // For simplicity following user logic: if option length is short (< 20 chars) and contains tech keyword -> reject
    const isShort = option.length < 30;
    return isShort && techKeywords.some(t => option.toLowerCase().includes(t));
  }

  private parseJsonQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw || !raw.question || !Array.isArray(raw.options) || !raw.correctAnswer) {
      this.logger.warn(`Question ignorée à l'index ${index} : JSON invalide.`);
      return null;
    }

    const seen = new Set<string>();
    const filtered: string[] = [];

    for (const opt of raw.options) {
      if (typeof opt !== 'string') continue;
      const cleaned = opt.replace(/^[A-Da-d][).\s]+/, '').trim();
      if (cleaned.length < 3) continue;          // Ignore trop court
      if (seen.has(cleaned.toLowerCase())) continue; // Ignore doublons
      if (this.isTechnology(cleaned)) continue;      // Ignore technologies seules
      filtered.push(cleaned);
      seen.add(cleaned.toLowerCase());
      if (filtered.length === 4) break;         // Limite a 4 options
    }

    if (filtered.length !== 4) {
      this.logger.warn(`Question "${raw.question.substring(0, 30)}..." ignorée car elle n'a pas exactement 4 options valides après filtrage (${filtered.length} trouvées).`);
      return null; // Ignore question si <4 options
    }

    // Determine correct answer from the filtered list (or fallback to the first)
    const rawCorrect = raw.correctAnswer.replace(/^[A-Da-d][).\s]+/, '').trim();
    const correctMatch = filtered.find(opt => opt.toLowerCase() === rawCorrect.toLowerCase());

    return {
      id: index + 1,
      question: raw.question.trim(),
      options: filtered,
      correctAnswer: correctMatch ? correctMatch : filtered[0],
      isCorrectVerified: false
    };
  }

  // ── Private helper: clean and deduplicate a raw option string ──────────────

  private cleanOption(raw: string): string {
    return raw
      .replace(/^[A-Da-d][).\s]+/, '')  // strip leading letter+separator
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

    const optionRegex = /^[A-Da-d][).\s]/;
    const questionLines: string[] = [];
    const rawAnswerLines: string[] = [];
    let foundOptions = false;

    for (const line of lines) {
      const trimmed = line.trim();
      if (optionRegex.test(trimmed)) foundOptions = true;

      if (!foundOptions) {
        // Skip meta-lines like question numbers or separators
        if (!/^(--|\d+[.)\s])/.test(trimmed)) {
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
      if (cleaned.length < 3) continue;              // skip empty / too short
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
      options,                               // 2–4 options, never more than 4
      correctAnswer: options[0],             // first option = correct by prompt convention
      isCorrectVerified: false,              // recruiter must validate before publishing
    };
  }

  // ── Private helper: generate N questions via improved prompt + text parsing ─

  private async generateTextQuestions(
    jobDescription: string,
    count: number,
    previousQuestions: string[] = [],
  ): Promise<QuizQuestion[]> {
    const avoidPart =
      previousQuestions.length > 0
        ? '\n\nIMPORTANT: Do NOT generate questions similar to:\n' +
        previousQuestions.map((q, i) => (i + 1) + '. ' + q).join('\n') +
        '\nGenerate completely different questions.'
        : '';

    const prompt =
      'Génère un objet JSON contenant exactement ' + count + ' question(s) à choix multiples basé sur ce rôle.' +
      avoidPart +
      '\n\nDESCRIPTION DU POSTE :\n' +
      jobDescription.substring(0, 1000) +
      '\n\nCONSIGNES STRICTES :' +
      '\n- Le JSON doit contenir une clé "questions" avec un tableau des questions.' +
      '\n- Chaque question doit avoir exactement 3 clés : question, options, correctAnswer.' +
      '\n- L\'attribut "options" doit contenir exactement 4 strings.' +
      '\n- Chaque option doit être une RESPONSABILITÉ, ACTION ou COMPÉTENCE du rôle.' +
      '\n- N’inclus jamais de noms de technologies seules (ex: Docker, AWS, React…).' +
      '\n- Évite les doublons ou options trop courtes.' +
      '\n- Marque clairement la bonne réponse dans l\'attribut "correctAnswer".' +
      '\n- Retourne UNIQUEMENT l\'objet JSON, pas de texte supplémentaire.' +
      '\n\nExemple de format attendu :\n' +
      '{\n' +
      '  "questions": [\n' +
      '    {\n' +
      '      "question": "Texte de la question",\n' +
      '      "options": ["Option A", "Option B", "Option C", "Option D"],\n' +
      '      "correctAnswer": "Texte exact de l’option correcte"\n' +
      '    }\n' +
      '  ]\n' +
      '}';

    try {
      const text = await this.callOllama(prompt); // Changed to callOllama for JSON format
      this.logger.log('Raw AI response (first 600): ' + text.substring(0, 600));

      let rawJson: any;
      try {
        rawJson = this.extractJson<any>(text);
      } catch (e) {
        throw new HttpException("L'IA n'a pas pu générer un objet JSON valide. Veuillez réessayer.", HttpStatus.SERVICE_UNAVAILABLE);
      }

      // Extraction du tableau depuis la structure JSON
      let jsonArray: any[] = [];
      if (Array.isArray(rawJson)) {
        jsonArray = rawJson;
      } else if (rawJson && typeof rawJson === 'object') {
        // Llama returning format: "json" prefers objects over arrays.
        // Extract the first array found in the object values (e.g. { "questions": [...] })
        const possibleArrays = Object.values(rawJson).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          jsonArray = possibleArrays[0] as any[];
        }
      }

      if (!jsonArray || jsonArray.length === 0) {
        this.logger.error("Le JSON renvoyé par l'IA ne contient pas de tableau de questions.", rawJson);
        throw new HttpException("Le format renvoyé par l'IA ne contient pas de tableau de questions JSON. Veuillez réessayer.", HttpStatus.SERVICE_UNAVAILABLE);
      }

      const parsed: QuizQuestion[] = [];
      for (const item of jsonArray) {
        const q = this.parseJsonQuestion(item, parsed.length);
        if (q) parsed.push(q);
      }

      if (parsed.length === 0) {
        throw new HttpException("Toutes les questions générées ont été rejetées par les filtres stricts. Veuillez réessayer.", HttpStatus.UNPROCESSABLE_ENTITY);
      }

      return parsed;

    } catch (error: any) {
      throw new HttpException(
        'Erreur IA: ' + error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // ── 1. Generate questions ─────────────────────────────────────────────────────

  async generateQuestions(
    jobDescription: string,
    difficulty: DifficultyLevel = 'moyen',
    offre: any = null,
  ): Promise<any[]> {
    this.logger.log('Generating 4 questions with text parsing');

    const aiQuestions = await this.generateTextQuestions(jobDescription, 4);

    if (offre && aiQuestions.length > 0) {
      const entities: Question[] = aiQuestions.map((q) => {
        const e = new Question();
        e.contenu = { question: q.question, options: q.options };
        e.reponses = [q.correctAnswer];
        e.chronometre = 2;
        e.niveauDifficulte = 'Moyen';
        e.offre = offre;
        return e;
      });
      const saved = await this.questionRepository.save(entities);
      return saved;
    }

    return aiQuestions;
  }

  // ── 2. Regenerate questions (avoid previous ones) ────────────────────────────

  async regenerateQuestions(
    jobDescription: string,
    difficulty: DifficultyLevel = 'moyen',
    previousQuestions: string[] = [],
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
      previousQuestions,
    );

    if (questions.length === 0) {
      throw new HttpException(
        "L'IA n'a pas retourne de questions valides lors de la regeneration.",
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return questions;
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

    return recommendation;
  }
}
