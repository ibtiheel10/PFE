import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id?: number;
  question: string;
  options: QuizOption[];
  niveauDifficulte?: string;
  chronometre?: number;
  createdAt?: string;
  competence?: string;
}

export interface TestResult {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  competence?: string;
}

export interface AIRecommendation {
  score: number;
  totalQuestions: number;
  percentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  detailedSkills?: any;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  // Cascade de modèles : du plus puissant au plus rapide/léger
  private readonly modelCascade = [
    'llama-3.3-70b-versatile',   // 1er choix : meilleure qualité d'analyse
    'llama-3.1-8b-instant',      // 2ème choix : rapide, léger
    'gemma2-9b-it',              // 3ème choix : fallback ultime
  ];

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('AI_API_KEY') || '';
    if (!this.apiKey) {
      this.logger.error('AI_API_KEY is not defined in environment variables');
    }
  }

  private async callAI(prompt: string, maxTokens = 1200): Promise<string> {
    let lastError: any;

    for (const model of this.modelCascade) {
      try {
        this.logger.log(`[AI] Trying model: ${model}`);
        const response = await axios.post(
          this.apiUrl,
          {
            model,
            messages: [
              {
                role: 'system',
                content: 'Tu es un expert en recrutement technique et analyse de compétences.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.5,
            max_tokens: maxTokens,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 40000,
          },
        );

        if (model !== this.modelCascade[0]) {
          this.logger.warn(`[AI] ⚡ Bascule réussie vers le modèle: ${model}`);
        }
        return response.data.choices[0].message.content;

      } catch (err: any) {
        const errMsg = err.response?.data?.error?.message || err.message;
        this.logger.warn(`[AI] Modèle "${model}" indisponible: ${errMsg} — passage au suivant...`);
        lastError = err;
      }
    }

    this.logger.error('[AI] Tous les modèles de la cascade ont échoué.');
    throw lastError;
  }

  async generateQuestions(jobDescription: string, unused: any, competences: string): Promise<QuizQuestion[]> {
    return this.generateWithRetry(jobDescription, competences, [], jobDescription);
  }

  async regenerateQuestions(jobDescription: string, previousQuestions: string[], competences: string): Promise<QuizQuestion[]> {
    return this.generateWithRetry(jobDescription, competences, previousQuestions, jobDescription);
  }

  private async generateWithRetry(
    jobTitle: string,
    topic: string,
    previous: string[],
    desc: string,
  ): Promise<any[]> {
    const prompt = `Génère 5 questions QCM pour le poste : "${jobTitle}".
Compétences : ${topic || 'Développement informatique'}.
Description : ${desc.substring(0, 500)}.
${previous.length > 0 ? `Évite : ${previous.join(', ')}.` : ''}

RÈGLES :
1. 4 options par question.
2. 1 seule correcte (isCorrect: true).
3. JSON uniquement.
4. Champ "competence" inclus.

Format :
[
  {
    "question": "...",
    "options": [
      { "text": "...", "isCorrect": true },
      { "text": "...", "isCorrect": false },
      { "text": "...", "isCorrect": false },
      { "text": "...", "isCorrect": false }
    ],
    "competence": "...",
    "niveauDifficulte": "Moyen"
  }
]`;

    try {
      const raw = await this.callAI(prompt);
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = cleaned.indexOf('[');
      const end = cleaned.lastIndexOf(']');
      return JSON.parse(cleaned.substring(start, end + 1));
    } catch (err) {
      this.logger.error(`[AI] Question generation failed: ${err.message}`);
      return [];
    }
  }

  async generateRecommendation(
    jobDescription: string,
    results: TestResult[],
  ): Promise<AIRecommendation> {
    const totalQuestions = results.length;
    const correctCount = results.filter(r => r.isCorrect).length;
    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const correctItems = results.filter(r => r.isCorrect);
    const wrongItems = results.filter(r => !r.isCorrect);

    const baseStrengths = correctItems.length > 0
      ? Array.from(new Set(correctItems.map(r => `Maîtrise validée sur : ${r.competence || 'Concept technique'}`)))
      : ['Continuez vos efforts.'];

    const baseWeaknesses = wrongItems.length > 0
      ? Array.from(new Set(wrongItems.map(r => `Point à améliorer : ${r.competence || 'Concept technique'}`)))
      : ['Aucune erreur majeure.'];

    const baseRecommendations = wrongItems.length > 0
      ? Array.from(new Set(wrongItems.map(r => `Réviser : ${r.competence || 'La technologie concernée'}`)))
      : ['Veille technologique active conseillée.'];

    try {
      const detailedAnalysis = await this.analyzeDetailedSkills(jobDescription, results);

      return {
        score,
        totalQuestions,
        percentage: score,
        strengths: detailedAnalysis.strengths?.length > 0 ? detailedAnalysis.strengths : baseStrengths,
        weaknesses: detailedAnalysis.weaknesses?.length > 0 ? detailedAnalysis.weaknesses : baseWeaknesses,
        recommendations: detailedAnalysis.generalRecommendations?.length > 0 ? detailedAnalysis.generalRecommendations : baseRecommendations,
        detailedSkills: detailedAnalysis
      } as any;
    } catch (err: any) {
      this.logger.warn(`[AI] Recommendation enrichment failed: ${err.message}`);
    }

    return {
      score,
      totalQuestions,
      percentage: score,
      strengths: baseStrengths,
      weaknesses: baseWeaknesses,
      recommendations: baseRecommendations,
    } as any;
  }

  async analyzeDetailedSkills(jobDescription: string, results: TestResult[]): Promise<{ detailedSkills: any[], behavioralSkills: any[], generalRecommendations: string[], strengths: string[], weaknesses: string[] }> {
    const prompt = `Analyze the following technical quiz results and generate a professional assessment in French.

RÈGLES CRITIQUES :
- NE PAS utiliser de templates répétitifs.
- Rédige l'INTÉGRALITÉ des phrases de manière naturelle et humaine.
- Explique PRÉCISÉMENT les erreurs en comparant userAnswer et correctAnswer.
- Style expert, concis et constructif.

DONNÉES :
Poste : ${jobDescription.substring(0, 300)}
Résultats : ${JSON.stringify(results.map(r => ({
  question: r.question,
  userAnswer: r.selectedAnswer,
  correctAnswer: r.correctAnswer,
  topic: r.competence
})))}

📦 RÉPONDS UNIQUEMENT EN JSON VALIDE :
{
  "strengths": ["Phrase naturelle sur une maîtrise démontrée..."],
  "weaknesses": ["Phrase naturelle expliquant une incompréhension technique précise..."],
  "generalRecommendations": ["Conseil professionnel pour progresser..."],
  "detailedSkills": [
    { "skill": "Compétence", "score": 85, "justification": "Synthèse du niveau." }
  ],
  "behavioralSkills": [
    { "skill": "Soft Skill", "score": 90, "justification": "Observation." }
  ]
}`;

    try {
      const raw = await this.callAI(prompt, 1500);
      const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      const parsed = JSON.parse(cleaned.substring(start, end + 1));

      return {
        detailedSkills: Array.isArray(parsed.detailedSkills) ? parsed.detailedSkills : [],
        behavioralSkills: Array.isArray(parsed.behavioralSkills) ? parsed.behavioralSkills : [],
        generalRecommendations: Array.isArray(parsed.generalRecommendations) ? parsed.generalRecommendations : [],
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : []
      };
    } catch (err) {
      this.logger.error(`[AI] Detailed analysis failed: ${err.message}`);
    }

    return { detailedSkills: [], behavioralSkills: [], generalRecommendations: [], strengths: [], weaknesses: [] };
  }

  async generateQCM(topic: string): Promise<any[]> {
    return this.generateWithRetry(topic, topic, [], topic);
  }
}
