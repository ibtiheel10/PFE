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

  // AI API Configuration — reads from environment variables
  private get aiApiUrl(): string {
    return process.env.AI_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
  }

  private get aiApiKey(): string {
    return process.env.AI_API_KEY || '';
  }

 private get fallbackModels(): string[] {
  // Liste ordonnée de modèles Groq à tester en cas de surcharge d'un des modèles (très fréquent)
  return [
    'mixtral-8x7b-32768',
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'gemma2-9b-it'
  ];
}

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Call AI API (OpenAI-compatible endpoint — works with Groq, OpenAI, etc.)
  // ══════════════════════════════════════════════════════════════════════════════

  private async callAI(prompt: string, maxTokens = 1500, timeoutMs = 25000): Promise<string> {
    // DEBUG: Affiche l'état de la clé
    console.log("AI_API_KEY =", this.aiApiKey ? "CONFIGURÉE" : "MANQUANTE");
    if (!this.aiApiKey) {
      throw new HttpException(
        'AI_API_KEY non configurée. Ajoutez-la dans votre fichier .env',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    
    const models = this.fallbackModels;
    let lastError: any;

    for (const model of models) {
      this.logger.log(`[AI] Calling model ${model}, max_tokens=${maxTokens}, timeout=${timeoutMs}ms`);
      try {
        const response = await axios.post(
          this.aiApiUrl,
          {
            model: model,
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en recrutement et évaluation technique. Tu génères des QCM professionnels en JSON strict.',
              },
              {
                role: 'user',
                content: prompt,
              },
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
          },
          {
            timeout: timeoutMs,
            headers: {
              'Authorization': `Bearer ${this.aiApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        const raw: string = response.data?.choices?.[0]?.message?.content ?? '';
        this.logger.log(`[AI] Raw response (first 400 chars): ${raw.substring(0, 400)}`);
        return raw;
      } catch (error: any) {
        lastError = error;
        const status = error.response?.status;
        this.logger.warn(`[AI] Request failed for model ${model}: ${error.message} (status: ${status || 'N/A'})`);
        
        // On stoppe immédiatement si c'est un problème d'authentification
        if (status === 401) {
          throw new HttpException('AI_API_KEY invalide ou expirée.', HttpStatus.BAD_GATEWAY);
        }
        
        // Pour les erreurs 503 (Unavailable), 429 (Rate Limit) ou timeout on passe au modèle alternatif
        this.logger.warn(`[AI] Modèle indisponible ou surchargé. Basculement vers l'alternative suivante...`);
      }
    }

    throw new HttpException(
      'Service IA totalement indisponible après rotation des modèles : ' + (lastError?.message || 'Erreur inconnue'),
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Extract the first valid JSON array from raw LLM text
  // ══════════════════════════════════════════════════════════════════════════════

  private extractJsonArray(raw: string): any[] | null {
    const cleaned = raw
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // Strategy 1: Find array brackets
    const arrStart = cleaned.indexOf('[');
    const arrEnd = cleaned.lastIndexOf(']');
    if (arrStart !== -1 && arrEnd > arrStart) {
      const candidate = cleaned.substring(arrStart, arrEnd + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Try repair trailing comma / missing brace
        try {
          const repaired = candidate
            .replace(/,\s*$/, '')
            .replace(/}\s*$/, '}]')
            .replace(/"\s*$/, '"]');
          const parsed2 = JSON.parse(repaired + ']');
          if (Array.isArray(parsed2) && parsed2.length > 0) return parsed2;
        } catch { }
      }
    }

    // Strategy 2: Find object containing questions
    const objStart = cleaned.indexOf('{');
    const objEnd = cleaned.lastIndexOf('}');
    if (objStart !== -1 && objEnd > objStart) {
      const candidate = cleaned.substring(objStart, objEnd + 1);
      try {
        const parsed = JSON.parse(candidate);
        if (parsed.questions && Array.isArray(parsed.questions)) return parsed.questions;
        if (parsed.qcm && Array.isArray(parsed.qcm)) return parsed.qcm;
      } catch { }
    }

    // Strategy 3: extract object by object
    try {
      const objects: any[] = [];
      const parts = cleaned.match(/\{[\s\S]*?\}/g);
      if (parts) {
        for (const p of parts) {
          try {
            const obj = JSON.parse(p);
            if (obj.question && obj.options) objects.push(obj);
          } catch { }
        }
      }
      if (objects.length > 0) return objects;
    } catch { }

    return null;
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Parse a single raw AI question object into our QuizQuestion format
  // ══════════════════════════════════════════════════════════════════════════════

  private parseQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw || typeof raw !== 'object') return null;

    // 1. Question text
    const questionText: string =
      raw.question || raw.Question || raw.texte || raw.text || raw.q || '';
    if (!questionText.trim()) return null;

    // 2. Options — accept multiple naming conventions
    let rawOptions: any[] = [];
    if (Array.isArray(raw.options)) rawOptions = raw.options;
    else if (Array.isArray(raw.choices)) rawOptions = raw.choices;
    else if (Array.isArray(raw.answers)) rawOptions = raw.answers;
    else if (Array.isArray(raw.reponses)) rawOptions = raw.reponses;
    else if (Array.isArray(raw.responses)) rawOptions = raw.responses;
    else {
      const lettered = ['A', 'B', 'C', 'D']
        .map(l => raw[l] || raw[l.toLowerCase()])
        .filter(Boolean);
      if (lettered.length >= 2) rawOptions = lettered;
    }

    if (rawOptions.length < 2) return null;

    // 3. Resolve correct answer index
    let correctIndex = -1;

    const ciRaw = raw.correctIndex ?? raw.correct_index ?? raw.answerIndex ?? raw.answer_index;
    if (typeof ciRaw === 'number' && ciRaw >= 0 && ciRaw < rawOptions.length) {
      correctIndex = ciRaw;
    }

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

    if (correctIndex === -1) {
      const idx = rawOptions.findIndex(
        (o: any) => typeof o === 'object' && (o.isCorrect === true || o.correct === true),
      );
      if (idx !== -1) correctIndex = idx;
    }

    if (correctIndex === -1) {
      const letterAnswer: string = raw.correctLetter ?? raw.correct_letter ?? raw.letter ?? '';
      if (letterAnswer) {
        const idx = ['a', 'b', 'c', 'd'].indexOf(letterAnswer.trim().toLowerCase());
        if (idx !== -1 && idx < rawOptions.length) correctIndex = idx;
      }
    }

    if (correctIndex === -1) {
      this.logger.warn(
        `[parseQuestion] Could not determine correctIndex for: "${questionText.substring(0, 60)}" — defaulting to 0`,
      );
      correctIndex = 0;
    }

    // 4. Build normalised options
    const options: QuizOption[] = rawOptions.map((o: any, i: number) => {
      const text = typeof o === 'string' ? o : (o.text ?? o.value ?? o.label ?? String(o));
      const cleanText = text.replace(/^[A-Da-d1-4][).\:\-]\s*/, '').trim();
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
  // PRIVATE: Parse competences string into a list of skill names
  // ══════════════════════════════════════════════════════════════════════════════

  private parseCompetenceNames(competencesStr: string, jobTitle: string): string[] {
    if (competencesStr) {
      const parts = competencesStr
        .split(/[,\n-]/)
        .map(s => s.replace(/^[-•*\d.]+\s*/, '').trim())
        .filter(s => s.length > 2);
      if (parts.length > 0) return parts.slice(0, 5);
    }
    return [
      `${jobTitle} (Bases)`,
      `Architecture & Design`,
      `Performance & Qualité`,
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Core generation — up to 3 attempts
  // ══════════════════════════════════════════════════════════════════════════════

  private async generateWithRetry(
    jobTitle: string,
    competences: string,
    previousQuestions: string[] = [],
    fullDescription: string = '',
  ): Promise<QuizQuestion[]> {
    const competenceNames = this.parseCompetenceNames(competences, jobTitle);
    this.logger.log(`[AI] Generating questions for competences: ${competenceNames.join(' | ')}`);

    const compStrList = competenceNames.map(c => `[${c}]`).join(', ');
    const allQuestions: QuizQuestion[] = [];
    let attempts = 0;
    const globalStartTime = Date.now();
    const MAX_DURATION = 55000; // 55s max

    const normalize = (text: string) =>
      text.toLowerCase().replace(/\s+/g, '').substring(0, 50);

    while (allQuestions.length < 5 && attempts < 3) {
      const elapsed = Date.now() - globalStartTime;
      if (elapsed > MAX_DURATION) {
        this.logger.warn('[AI] Global maximum generation duration exceeded');
        break;
      }

      attempts++;
      const needed = 5 - allQuestions.length;

      const prompt = `Génère exactement ${needed} questions QCM professionnelles basées sur les compétences: ${compStrList}.

RÈGLES STRICTES:
- Exactement ${needed} questions
- 4 options par question (A, B, C, D)
- 1 seule bonne réponse indiquée avec isCorrect: true
- Questions de niveau technique professionnel

Retourne UNIQUEMENT ce JSON valide, rien d'autre:

[
  {
    "question": "Texte de la question",
    "options": [
      {"text": "Option A", "isCorrect": false},
      {"text": "Option B", "isCorrect": true},
      {"text": "Option C", "isCorrect": false},
      {"text": "Option D", "isCorrect": false}
    ]
  }
]`;

      try {
        const remainingTime = Math.max(8000, MAX_DURATION - (Date.now() - globalStartTime));
        const raw = await this.callAI(prompt, 1500, remainingTime);

        let jsonArray: any = null;

        const cleanResponse = raw
          .replace(/```json/gi, '')
          .replace(/```/g, '')
          .trim();

        try {
          const parsed = JSON.parse(cleanResponse);
          jsonArray = Array.isArray(parsed?.questions) ? parsed.questions : parsed;

          if (!jsonArray || (Array.isArray(jsonArray) && jsonArray.length === 0)) {
            throw new Error('Aucune question générée');
          }
          if (!Array.isArray(jsonArray)) {
            throw new Error('Format incorrect');
          }
        } catch {
          jsonArray = this.extractJsonArray(raw);
          if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
            throw new Error('Format incorrect après extraction');
          }
        }

        if (Array.isArray(jsonArray)) {
          const items = Array.isArray(jsonArray[0]?.questions) ? jsonArray[0].questions : jsonArray;

          for (let i = 0; i < items.length; i++) {
            if (allQuestions.length >= 5) break;

            const q = this.parseQuestion(items[i], allQuestions.length);
            if (q) {
              const duplicate =
                previousQuestions.some(prev => normalize(prev) === normalize(q.question)) ||
                allQuestions.some(prev => normalize(prev.question) === normalize(q.question));

              if (!duplicate) {
                (q as any).category = items[i].category || competenceNames[0] || 'Basique';
                allQuestions.push(q);
              }
            }
          }
        }

        this.logger.log(`[AI] Accumulated ${allQuestions.length}/5 questions (Attempt ${attempts})`);

      } catch (err: any) {
        this.logger.warn(`[AI] Generation attempt ${attempts} failed: ${err.message}`);
        // Only throw for Auth or Bad Gateway issues to ensure we still use fallback
        if (err.status === HttpStatus.UNAUTHORIZED || err.status === HttpStatus.BAD_GATEWAY) {
          throw err;
        }
      }
    }

    if (allQuestions.length > 0) {
      return allQuestions.slice(0, 5);
    }

    this.logger.error('[AI] Échec total de la génération par IA après tentatives. Utilisation du fallback de secours.');
    
    // FALLBACK ULTIME : Garantit que l'application ne plantera jamais lors du passage de tests
    // Même en cas de panne globale prolongée de l'API externe
    const fallbackQuestions: any[] = [];
    const baseTopics = competenceNames.length > 0 ? competenceNames : ['Développement', 'Logique', 'Architecture logicielle'];
    
    for (let i = 0; i < 5; i++) {
      const topic = baseTopics[i % baseTopics.length];
      fallbackQuestions.push({
        id: i + 1,
        question: `Évaluation générale sur : ${topic}. Quelle approche reflète les meilleures pratiques professionnelles ?`,
        options: [
          { text: "Respecter les standards, structurer le code proprement et assurer une bonne couverture de tests.", isCorrect: true },
          { text: "Ignorer continuellement la gestion des erreurs dans l'application.", isCorrect: false },
          { text: "Utiliser des solutions complexes et non maintenables pour des requêtes simples.", isCorrect: false },
          { text: "Livrer sans documentation technique pour gagner du temps.", isCorrect: false }
        ],
        isCorrectVerified: true,
        chronometre: 30,
        createdAt: new Date().toISOString(),
        category: topic
      });
    }

    return fallbackQuestions;
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
    const jobTitle = firstLine || 'Développeur';

    const questions = await this.generateWithRetry(jobTitle, competences, [], jobDescription);

    if (offre && questions.length > 0) {
      const entities: Question[] = questions.map((q) => {
        const e = new Question();
        const categoryTag = (q as any).category || 'Basique';
        e.contenu = { question: q.question, options: q.options, category: categoryTag };
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
    const jobTitle = firstLine || 'Développeur';

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

    // ─── Attempt AI enrichment ─────────────────────────────────────────────────
    try {
      const correctList = correctItems.map(r => `- Q: "${r.question.substring(0, 150)}" → Réponse correcte: "${r.selectedAnswer}"`).join('\n');
      const wrongList = wrongItems.map(r => `- Q: "${r.question.substring(0, 150)}" → Répondu: "${r.selectedAnswer}", Attendu: "${r.correctAnswer}"`).join('\n');

      const prompt = `Tu es un coach RH expert. Génère UNIQUEMENT un JSON valide, sans aucun texte autour.

Poste : ${jobDescription.substring(0, 350)}
Score : ${score}% (${correctCount}/${totalQuestions})

Réponses CORRECTES :
${correctList || 'Aucune.'}

Réponses INCORRECTES :
${wrongList || 'Aucune.'}

Règles :
- "strengths" : ${correctItems.length} points forts valorisants liés aux bonnes réponses
- "weaknesses" : ${wrongItems.length} lacunes identifiées (formulation constructive)
- "recommendations" : ${wrongItems.length} actions concrètes personnalisées

Format JSON strict :
{
  "strengths": ["point fort 1", ...],
  "weaknesses": ["lacune 1", ...],
  "recommendations": ["action 1", ...]
}`;

      for (let attempt = 1; attempt <= 2; attempt++) {
        this.logger.log(`[AI] Recommendation attempt ${attempt}/2`);
        try {
          const raw = await this.callAI(prompt, 1000, 20000);
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
      this.logger.warn(`[AI] Recommendation generation error: ${err.message}`);
    }

    // ─── Fallback: deterministic answers ──────────────────────────────────────
    this.logger.warn('[AI] All AI attempts failed — returning deterministic fallback.');
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
  // PUBLIC: Generic QCM endpoint
  // ══════════════════════════════════════════════════════════════════════════════

  async generateQCM(topic: string): Promise<any[]> {
    const questions = await this.generateWithRetry(topic, topic, [], topic);
    return questions;
  }
}
