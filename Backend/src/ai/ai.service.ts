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
  // PRIVATE: Extract the first valid JSON array or object from raw LLM text
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
        // Strategy 3: attempt to repair truncated JSON by closing open brackets
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
  // PRIVATE: Parse a single raw AI question object into our QuizQuestion format
  // The AI is asked to use correctIndex (0-3) so we can reliably mark isCorrect
  // ══════════════════════════════════════════════════════════════════════════════

  private parseQuestion(raw: any, idx: number): QuizQuestion | null {
    if (!raw || typeof raw.question !== 'string' || !raw.question.trim()) return null;

    let options: string[] = [];
    if (Array.isArray(raw.options) && raw.options.length >= 2) {
      options = raw.options
        .map((o: any) => (typeof o === 'string' ? o : String(o?.text ?? '')))
        .map((o: string) => o.replace(/^[A-Da-d][).:\- ]+/, '').trim())
        .filter((o: string) => o.length > 0);
    }

    if (options.length < 2) return null;

    // Determine which option is correct
    let correctIdx = 0;
    if (typeof raw.correctIndex === 'number' && raw.correctIndex >= 0 && raw.correctIndex < options.length) {
      correctIdx = raw.correctIndex;
    } else if (typeof raw.answer === 'number' && raw.answer >= 0 && raw.answer < options.length) {
      correctIdx = raw.answer;
    } else if (typeof raw.answer === 'string') {
      const ansLower = raw.answer.toLowerCase().trim();
      // Try: letter "a", "b", "c", "d"
      const letterIdx = ['a', 'b', 'c', 'd'].indexOf(ansLower.charAt(0));
      if (letterIdx >= 0 && letterIdx < options.length) {
        correctIdx = letterIdx;
      } else {
        // Try: text match
        const found = options.findIndex(o => o.toLowerCase().includes(ansLower.substring(0, 20)));
        if (found >= 0) correctIdx = found;
      }
    }

    const mappedOptions: QuizOption[] = options.slice(0, 4).map((text, i) => ({
      text,
      isCorrect: i === correctIdx,
    }));

    // Safety: if somehow nothing is marked correct, force index 0
    if (!mappedOptions.some(o => o.isCorrect)) {
      mappedOptions[0].isCorrect = true;
    }

    return {
      id: idx + 1,
      question: raw.question.trim(),
      options: mappedOptions,
      isCorrectVerified: true,
      chronometre: 30,
    };
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Fallback questions when Ollama fails completely
  // Uses the job title/competences to generate generic but relevant questions
  // so the frontend NEVER gets an error
  // ══════════════════════════════════════════════════════════════════════════════

  private buildFallbackQuestions(jobTitle: string, competences: string): QuizQuestion[] {
    const topic = jobTitle || 'ce poste';
    const compList = competences
      ? competences.split(/[,;\n]+/).map(c => c.trim()).filter(c => c.length > 2).slice(0, 5)
      : [];

    while (compList.length < 5) {
      compList.push(['expertise technique', 'gestion du temps', 'communication', 'adaptabilité', 'résolution de problèmes'][compList.length]);
    }

    return [
      {
        id: 1,
        question: `Dans le cadre du poste "${topic}", quelle est l'importance primordiale de la compétence "${compList[0]}" ?`,
        options: [
          { text: `Elle est indispensable pour mener à bien les missions du poste.`, isCorrect: true },
          { text: `Elle n'a aucune importance pour ce rôle.`, isCorrect: false },
          { text: `Elle sert uniquement pour des tâches administratives.`, isCorrect: false },
          { text: `C'est une compétence complètement obsolète.`, isCorrect: false },
        ],
        isCorrectVerified: true,
      },
      {
        id: 2,
        question: `Parmi les choix suivants, quelle attitude est la plus adaptée pour réussir en tant que "${topic}" ?`,
        options: [
          { text: `Appliquer systématiquement la compétence "${compList[1]}" avec rigueur.`, isCorrect: true },
          { text: `Refuser d'utiliser ses compétences et déléguer systématiquement.`, isCorrect: false },
          { text: `Ignorer les directives et travailler sans méthode.`, isCorrect: false },
          { text: `Ne compter que sur la chance pour réussir.`, isCorrect: false },
        ],
        isCorrectVerified: true,
      },
      {
        id: 3,
        question: `Lors de la mise en pratique de "${compList[2]}", quel est le risque principal à éviter ?`,
        options: [
          { text: `Le manque de précision et la négligence des détails cruciaux.`, isCorrect: true },
          { text: `L'application correcte et réfléchie des bonnes pratiques mondiales.`, isCorrect: false },
          { text: `C'est impossible d'échouer avec cette compétence.`, isCorrect: false },
          { text: `La réussite trop rapide du projet global.`, isCorrect: false },
        ],
        isCorrectVerified: true,
      },
      {
        id: 4,
        question: `Comment la maîtrise de "${compList[3]}" contribue-t-elle à l'objectif global pour ce poste ?`,
        options: [
          { text: `Elle ralentit purement le processus de prise de décision.`, isCorrect: false },
          { text: `Elle garantit une efficacité et une qualité optimale du travail livré.`, isCorrect: true },
          { text: `Elle augmente fortement les risques d'erreurs graves.`, isCorrect: false },
          { text: `Elle n'a aucun impact concret sur les résultats produits.`, isCorrect: false },
        ],
        isCorrectVerified: true,
      },
      {
        id: 5,
        question: `Pour un profil expert en "${topic}", la compétence "${compList[4]}" est souvent rattachée à :`,
        options: [
          { text: `Une incapacité à s'adapter techniquement aux nouveautés.`, isCorrect: false },
          { text: `Une forte capacité d'analyse et d'exécution dans le métier.`, isCorrect: true },
          { text: `Un refus total de collaborer avec ses collègues externes.`, isCorrect: false },
          { text: `Une perte de temps systématique sur chaque projet de long terme.`, isCorrect: false },
        ],
        isCorrectVerified: true,
      },
    ];
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // PRIVATE: Core generation with max 2 attempts + guaranteed fallback
  // ══════════════════════════════════════════════════════════════════════════════

  private async generateWithFallback(
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

    for (let attempt = 1; attempt <= 2; attempt++) {
      this.logger.log(`[AI] Question generation attempt ${attempt}/2`);
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

          this.logger.log(`[AI] Generated ${parsed.length} valid questions on attempt ${attempt}`);
          return parsed.slice(0, 5);
        } else {
          this.logger.warn(`[AI] Attempt ${attempt}: no JSON array found in response`);
        }
      } catch (err: any) {
        this.logger.error(`[AI] Attempt ${attempt} error: ${err.message}`);
        if (attempt === 2) break; // Don't retry after last attempt
      }
    }

    // ━━━ ABSOLUTE FALLBACK — Never return an error to the frontend ━━━
    this.logger.warn('[AI] All attempts failed or filtered — returning fallback questions');
    return this.buildFallbackQuestions(jobTitle, competences);
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

    // Extract job title from jobDescription (first line or full description)
    const firstLine = (jobDescription || '').split('\n')[0].replace(/^Titre du poste:\s*/i, '').trim();
    const jobTitle = firstLine || 'Commercial';

    const questions = await this.generateWithFallback(jobTitle, competences, [], jobDescription);

    // If an offre entity was passed, persist to DB
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

    const questions = await this.generateWithFallback(jobTitle, competences, previousQuestions, jobDescription);

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

    // ─── Step 1: Build deterministic baseline from actual answers ────────────────
    // Each correct question → a strength  
    const baseStrengths: string[] = correctItems.length > 0
      ? correctItems.map(r => `Bonne maîtrise de la notion : "${r.question.substring(0, 120)}"`)
      : ['Continuez à vous exercer pour développer de nouvelles compétences.'];

    // Each wrong question → a weakness
    const baseWeaknesses: string[] = wrongItems.length > 0
      ? wrongItems.map(r => `Notion à approfondir : "${r.question.substring(0, 120)}" (répondu : "${r.selectedAnswer}", correct : "${r.correctAnswer}")`)
      : ['Aucune lacune détectée — score parfait !'];

    // Recommendations only about errors, referencing wrong answers specifically
    const baseRecommendations: string[] = wrongItems.length > 0
      ? wrongItems.map(r => `Révisez la notion : "${r.question.substring(0, 100)}" — la bonne réponse était : "${r.correctAnswer}"`)
      : ['Maintenez ce niveau d\'excellence et continuez votre veille technique.'];

    // ─── Step 2: Attempt Ollama to enrich each section with natural language ─────
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

    // ─── Step 3: Guaranteed deterministic fallback (always correct and personalized) ─
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
    const questions = await this.generateWithFallback(topic, topic, [], topic);
    return questions;
  }
}
