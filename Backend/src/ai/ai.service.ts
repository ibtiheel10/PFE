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
  isCorrectVerified?: boolean;
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

// ─── Service ──────────────────────────────────────────────────────────────────

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) { }

  private readonly ollamaUrl = 'http://127.0.0.1:11434/api/generate';
  private readonly model = 'phi3';

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Call Ollama with a single-shot request
  // ══════════════════════════════════════════════════════════════════════════════

  private async callOllama(prompt: string, numPredict = 900): Promise<string> {
    this.logger.log(`[Ollama] Calling model ${this.model}, num_predict=${numPredict}`);
    try {
      const response = await axios.post(
        this.ollamaUrl,
        {
          model: this.model,
          prompt,
          stream: false,
          options: {
            temperature: 0.2,
            num_predict: numPredict,
            stop: ['```', '---', 'Note:', 'Explanation:'],
          },
        },
        { timeout: 90000 }, // 90 seconds per call
      );
      const raw: string = response.data?.response ?? '';
      this.logger.log(`[Ollama] Raw response (first 400 chars): ${raw.substring(0, 400)}`);
      return raw;
    } catch (error: any) {
      this.logger.error(`[Ollama] Request failed: ${error.message}`);
      throw new HttpException(
        'Ollama service unavailable: ' + error.message,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Extract the first valid JSON array from raw LLM text
  // ══════════════════════════════════════════════════════════════════════════════

  private extractJsonArray(raw: string): any[] | null {
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // Strategy 1: direct parse
    try {
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.questions)) return parsed.questions;
    } catch { /* continue */ }

    // Strategy 2: find first '[' … last ']'
    const arrStart = cleaned.indexOf('[');
    const arrEnd = cleaned.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd > arrStart) {
      const candidate = cleaned.substring(arrStart, arrEnd + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Strategy 3: repair truncated JSON
        try {
          const repaired = candidate
            .replace(/,\s*$/, '')      // trailing comma
            .replace(/}\s*$/, '}]')   // close last object then array
            .replace(/"\s*$/, '"]')   // close last string then array
            ;
          const parsed = JSON.parse(repaired + ']');
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch { /* continue */ }
      }
    }

    // Strategy 4: find individual JSON objects manually
    const objects: any[] = [];
    const objPattern = /\{[^{}]*"question"[^{}]*\}/g;
    let match: RegExpExecArray | null;
    while ((match = objPattern.exec(cleaned)) !== null) {
      try {
        const obj = JSON.parse(match[0]);
        if (obj.question) objects.push(obj);
      } catch { /* skip malformed */ }
    }
    if (objects.length > 0) return objects;

    return null;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Parse a single raw AI question object into our QuizQuestion format.
  // Accepts any of these correct-answer conventions from the model:
  //   • correctIndex (integer 0-3)
  //   • correctAnswer / correct_answer / answer / reponse_correcte (string)
  //   • isCorrect / correct field on each option object
  //   • correctLetter / correct_letter (A/B/C/D)
  // ══════════════════════════════════════════════════════════════════════════════

  private parseQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw || typeof raw !== 'object') return null;

    // 1. Question text
    const questionText: string =
      raw.question || raw.Question || raw.texte || raw.text || raw.q || '';
    if (!questionText.trim()) return null;

    // 2. Options — accept multiple naming conventions
    let rawOptions: any[] = [];
    if (Array.isArray(raw.options))       rawOptions = raw.options;
    else if (Array.isArray(raw.choices))  rawOptions = raw.choices;
    else if (Array.isArray(raw.answers))  rawOptions = raw.answers;
    else if (Array.isArray(raw.reponses)) rawOptions = raw.reponses;
    else if (Array.isArray(raw.responses)) rawOptions = raw.responses;
    else {
      // Reconstruct from lettered keys: A, B, C, D
      const lettered = ['A', 'B', 'C', 'D']
        .map(l => raw[l] || raw[l.toLowerCase()])
        .filter(Boolean);
      if (lettered.length >= 2) rawOptions = lettered;
    }

    if (rawOptions.length < 2) return null;

    // 3. Resolve correct answer index
    let correctIndex = -1;

    // A: explicit integer
    const ciRaw = raw.correctIndex ?? raw.correct_index ?? raw.answerIndex ?? raw.answer_index;
    if (typeof ciRaw === 'number' && ciRaw >= 0 && ciRaw < rawOptions.length) {
      correctIndex = ciRaw;
    }

    // B: correctAnswer string → match option text
    if (correctIndex === -1) {
      const ca: string =
        raw.correctAnswer ?? raw.correct_answer ?? raw.answer ?? raw.reponse_correcte ?? '';
      if (ca) {
        const idx = rawOptions.findIndex((o: any) => {
          const oText = typeof o === 'string' ? o : o.text ?? o.value ?? '';
          return oText.trim().toLowerCase() === ca.trim().toLowerCase();
        });
        if (idx !== -1) correctIndex = idx;
      }
    }

    // C: isCorrect/correct field on option objects
    if (correctIndex === -1) {
      const idx = rawOptions.findIndex(
        (o: any) => typeof o === 'object' && (o.isCorrect === true || o.correct === true),
      );
      if (idx !== -1) correctIndex = idx;
    }

    // D: letter answer A/B/C/D
    if (correctIndex === -1) {
      const letterAnswer: string = raw.correctLetter ?? raw.correct_letter ?? raw.letter ?? '';
      if (letterAnswer) {
        const idx = ['a', 'b', 'c', 'd'].indexOf(letterAnswer.trim().toLowerCase());
        if (idx !== -1 && idx < rawOptions.length) correctIndex = idx;
      }
    }

    // Fallback to index 0 if nothing resolved
    if (correctIndex === -1) {
      this.logger.warn(
        `[parseQuestion] Could not determine correctIndex for: "${questionText.substring(0, 60)}" — defaulting to 0`,
      );
      correctIndex = 0;
    }

    // 4. Build normalised options
    const options: QuizOption[] = rawOptions.map((o: any, i: number) => {
      const text = typeof o === 'string' ? o : (o.text ?? o.value ?? o.label ?? String(o));
      const cleanText = text.replace(/^[A-Da-d1-4][).:\-]\s*/, '').trim();
      return { text: cleanText, isCorrect: i === correctIndex };
    });

    return {
      id: index + 1,
      question: questionText.trim(),
      options,
      isCorrectVerified: true,
      chronometre: 30,
      createdAt: new Date().toISOString(),
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Core generation — up to 3 attempts, always from competences/description
  // No hardcoded fallback: if the model fails every attempt, an error is thrown.
  // ══════════════════════════════════════════════════════════════════════════════

  private async generateWithRetry(
    jobTitle: string,
    competences: string,
    previousQuestions: string[] = [],
    fullDescription: string = '',
  ): Promise<QuizQuestion[]> {
    const compShort = competences.substring(0, 300);
    const descShort = fullDescription.substring(0, 800);
    const avoidSection = previousQuestions.length > 0
      ? `\nDo NOT repeat these questions:\n${previousQuestions.slice(0, 5).map((q, i) => `${i + 1}. ${q}`).join('\n')}`
      : '';

    const prompt = `Tu es un expert technique en recrutement.

Contexte :
- Titre du poste : ${jobTitle}
- Description du poste : ${descShort}
- Compétences requises : ${compShort || 'non spécifié'}${avoidSection}

IMPORTANT :
Tu dois ABSOLUMENT te baser sur "Description du poste" et "Compétences requises" pour formuler tes questions et les options de réponses.
Ces questions DOIVENT VRAIMENT DÉPENDRE du profil recherché (ne sois pas trop générique).

Tu dois générer EXACTEMENT 5 questions QCM.

Contraintes CRITIQUES :
- Le niveau des questions doit être adapté aux compétences demandées dans la description.
- Les options de réponses (A, B, C, D) doivent être très EXTRÊMEMENT PERTINENTES et réalistes.
- Chaque question doit comporter EXACTEMENT UNE SEULE bonne réponse PARMI LES 4 OPTIONS DISPONIBLES.
- Les 3 autres options doivent être logiques, plausibles, mais TOTALEMENT INCORRECTES dans la réalité.
- Les "options" ne doivent pas comporter de lettres comme "A)", ni "Réponse C", écrivez directement le texte de l'option.

Format JSON obligatoire (tableau contenant 5 objets) :
[
  {
    "question": "Votre question ici...",
    "options": ["Texte Option 1", "Texte Option 2", "Texte Option 3", "Texte Option 4"],
    "correctIndex": 0
  }
]
Génère STRICTEMENT le tableau JSON. Aucun texte ni explication avant ou après le tableau. Le correctIndex doit obligatoirement être un entier entre 0 et 3.`;

    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      this.logger.log(`[AI] Question generation attempt ${attempt}/${MAX_ATTEMPTS}`);
      try {
        const raw = await this.callOllama(prompt, 900);
        const jsonArray = this.extractJsonArray(raw);

        if (jsonArray && jsonArray.length > 0) {
          const parsed: QuizQuestion[] = [];
          for (let i = 0; i < jsonArray.length; i++) {
            const q = this.parseQuestion(jsonArray[i], parsed.length);
            if (q) {
              const isDuplicate = previousQuestions.some(prev =>
                prev.toLowerCase().substring(0, 30) === q.question.toLowerCase().substring(0, 30)
              ) || parsed.some(p =>
                p.question.toLowerCase().substring(0, 30) === q.question.toLowerCase().substring(0, 30)
              );
              if (!isDuplicate) parsed.push(q);
            }
          }

          if (parsed.length > 0) {
            this.logger.log(`[AI] Generated ${parsed.length} valid questions on attempt ${attempt}`);
            return parsed.slice(0, 5);
          }
          this.logger.warn(`[AI] Attempt ${attempt}: questions were all invalid or duplicates`);
        } else {
          this.logger.warn(`[AI] Attempt ${attempt}: no JSON array found in response`);
        }
      } catch (err: any) {
        this.logger.error(`[AI] Attempt ${attempt} error: ${err.message}`);
        // Re-throw immediately on last attempt so the caller gets the real error
        if (attempt === MAX_ATTEMPTS) throw err;
      }
    }

    // All attempts produced no usable questions (no exception was thrown)
    throw new HttpException(
      `Le modèle IA n'a pas réussi à générer des questions valides après ${MAX_ATTEMPTS} tentatives. Veuillez réessayer.`,
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PUBLIC: Generate questions (called from EntrepriseService)
  // ══════════════════════════════════════════════════════════════════════════════

  async generateQuestions(
    jobDescription: string,
    offre: any = null,
    competences: string = '',
  ): Promise<any[]> {
    this.logger.log('[AI] generateQuestions called');

    const firstLine = (jobDescription || '').split('\n')[0].replace(/^Titre du poste:\s*/i, '').trim();
    const jobTitle = firstLine || 'Commercial';

    const questions = await this.generateWithRetry(jobTitle, competences, [], jobDescription);

    if (offre && questions.length > 0) {
      const entities: Question[] = questions.map((q) => {
        const e = new Question();
        e.contenu = { question: q.question, options: q.options };
        e.chronometre = 30;
        e.offre = offre;
        return e;
      });
      const saved = await this.questionRepository.save(entities);
      return saved;
    }

    return questions;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PUBLIC: Regenerate questions (avoids previously seen questions)
  // ══════════════════════════════════════════════════════════════════════════════

  async regenerateQuestions(
    jobDescription: string,
    previousQuestions: string[] = [],
    competences: string = '',
  ): Promise<QuizQuestion[]> {
    this.logger.log(`[AI] regenerateQuestions — avoiding ${previousQuestions.length} previous`);

    const firstLine = (jobDescription || '').split('\n')[0].replace(/^Titre du poste:\s*/i, '').trim();
    const jobTitle = firstLine || 'Commercial';

    const questions = await this.generateWithRetry(jobTitle, competences, previousQuestions, jobDescription);

    return questions.map(q => ({
      ...q,
      chronometre: 30,
      createdAt: new Date().toISOString(),
    }));
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PUBLIC: Generate AI recommendation after a test
  // ══════════════════════════════════════════════════════════════════════════════

  async generateRecommendation(
    jobDescription: string,
    results: TestResult[],
  ): Promise<AIRecommendation> {
    this.logger.log(`[AI] generateRecommendation — ${results.length} results`);

    const totalQuestions = results.length;
    const correctCount = results.filter(r => r.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const correctItems = results.filter(r => r.isCorrect);
    const wrongItems = results.filter(r => !r.isCorrect);

    // ─── Baseline deterministic values (used if AI enrichment fails) ──────────
    const baseStrengths: string[] = correctItems.length > 0
      ? correctItems.map(r => `Bonne maîtrise de la notion : "${r.question.substring(0, 120)}"`)
      : ['Continuez à vous exercer pour développer de nouvelles compétences.'];

    const baseWeaknesses: string[] = wrongItems.length > 0
      ? wrongItems.map(r => `Notion à approfondir : "${r.question.substring(0, 120)}" (répondu : "${r.selectedAnswer}", correct : "${r.correctAnswer}")`)
      : ['Aucune lacune détectée — score parfait !'];

    const baseRecommendations: string[] = wrongItems.length > 0
      ? wrongItems.map(r => `Révisez la notion : "${r.question.substring(0, 100)}" — la bonne réponse était : "${r.correctAnswer}"`)
      : ['Maintenez ce niveau d\'excellence et continuez votre veille technique.'];

    // ─── Attempt Ollama enrichment ────────────────────────────────────────────
    try {
      const correctList = correctItems.map(r => `- Q: "${r.question.substring(0, 150)}" → Réponse correcte choisie: "${r.selectedAnswer}"`).join('\n');
      const wrongList = wrongItems.map(r => `- Q: "${r.question.substring(0, 150)}" → Répondu: "${r.selectedAnswer}", Attendu: "${r.correctAnswer}"`).join('\n');

      const prompt = `Tu es un coach expert RH et technique. Génère UNIQUEMENT un JSON valide, sans aucune explication, introduction, ni texte autour.

Contexte :
Poste : ${jobDescription.substring(0, 350)}
Score : ${score}% (${correctCount}/${totalQuestions})

Réponses CORRECTES du candidat :
${correctList || 'Aucune réponse correcte.'}

Réponses INCORRECTES du candidat :
${wrongList || 'Aucune réponse incorrecte.'}

Règles ABSOLUES :
- "strengths" : transforme CHAQUE réponse correcte en un vrai point fort du candidat (formulation positive, valorisante, liée au poste). ${correctItems.length} éléments attendus.
- "weaknesses" : transforme CHAQUE réponse incorrecte en une lacune identifiée (formulation constructive, précise, cite la notion exacte). ${wrongItems.length} éléments attendus.
- "recommendations" : génère UNE action concrète et personnalisée pour CHAQUE réponse incorrecte (ressources, pratique, cours ciblés sur la notion). ${wrongItems.length} éléments attendus.
- Toutes les réponses doivent être en FRANÇAIS professionnel.
- Ne sois JAMAIS générique. Chaque élément doit référencer une notion ou question spécifique.

Format JSON strict :
{
  "strengths": ["point fort 1", "point fort 2", ...],
  "weaknesses": ["lacune 1", "lacune 2", ...],
  "recommendations": ["action 1", "action 2", ...]
}`;

      for (let attempt = 1; attempt <= 3; attempt++) {
        this.logger.log(`[AI] Recommendation attempt ${attempt}/3`);
        try {
          const raw = await this.callOllama(prompt, 1200);
          let cleanedRaw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
          const objStart = cleanedRaw.indexOf('{');
          const objEnd = cleanedRaw.lastIndexOf('}');
          if (objStart !== -1 && objEnd > objStart) {
            cleanedRaw = cleanedRaw.substring(objStart, objEnd + 1)
              .replace(/,\s*}/g, '}')
              .replace(/,\s*]/g, ']');

            const rec = JSON.parse(cleanedRaw);
            if (
              Array.isArray(rec.strengths) && rec.strengths.length > 0 &&
              Array.isArray(rec.weaknesses) &&
              Array.isArray(rec.recommendations)
            ) {
              this.logger.log(`[AI] Recommendation generated on attempt ${attempt}`);
              return {
                score,
                totalQuestions,
                percentage: score,
                strengths: rec.strengths,
                weaknesses: rec.weaknesses.length > 0 ? rec.weaknesses : baseWeaknesses,
                recommendations: rec.recommendations.length > 0 ? rec.recommendations : baseRecommendations,
              };
            }
          }
        } catch (err: any) {
          this.logger.warn(`[AI] Recommendation attempt ${attempt} failed: ${err.message}`);
        }
      }
    } catch (err: any) {
      this.logger.warn(`[AI] Recommendation generation outer error: ${err.message}`);
    }

    // ─── Fallback: deterministic answers built from actual candidate results ──
    this.logger.warn('[AI] All AI attempts failed — returning deterministic personalized fallback.');
    return {
      score,
      totalQuestions,
      percentage: score,
      strengths: baseStrengths,
      weaknesses: baseWeaknesses,
      recommendations: baseRecommendations,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PUBLIC: Generic QCM endpoint (legacy)
  // ══════════════════════════════════════════════════════════════════════════════

  async generateQCM(topic: string): Promise<any[]> {
    const questions = await this.generateWithRetry(topic, topic, [], topic);
    return questions;
  }
}
