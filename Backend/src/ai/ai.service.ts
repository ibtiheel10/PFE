import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question, QuestionNiveau } from '../entities/question.entity';
import axios from 'axios';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  isCorrectVerified: boolean;
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

@Injectable()
export class AiService {

  private readonly logger = new Logger(AiService.name);

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) { }

  private readonly ollamaUrl = 'http://localhost:11434/api/generate';
  private readonly model = 'llama3'; // ou 'phi3'

  private async callOllama(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.ollamaUrl,
        {
          model: this.model,
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.7, num_predict: 1024 }
        },
        { timeout: 600000 }
      );
      return response.data?.response ?? '';
    } catch (error: any) {
      this.logger.error('Ollama error: ' + error.message);
      throw new HttpException('Erreur communication IA', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }

  private extractJson<T>(raw: string): T {
    try {
      const match = raw.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!match) throw new Error('JSON introuvable');
      return JSON.parse(match[0]);
    } catch {
      this.logger.error('JSON invalide IA : ' + raw);
      throw new HttpException("Réponse IA invalide", HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  private cleanOption(option: string): string {
    return option.replace(/^[A-Da-d][).\s]+/, '').trim();
  }

  private parseQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw.question || !raw.options || !raw.correctAnswer) return null;
    const options: string[] = [];
    for (const opt of raw.options) {
      const clean = this.cleanOption(opt);
      if (clean.length < 2) continue; // Autoriser des options courtes mais pas vides
      options.push(clean);
      if (options.length === 4) break;
    }
    if (options.length !== 4) return null;

    // Robustesse pour correctAnswer : si c'est "A", "B", "C", "D" ou un index
    let finalCorrect = raw.correctAnswer;
    const cleanCorrect = finalCorrect.toString().trim().toUpperCase();
    
    if (["A", "B", "C", "D"].includes(cleanCorrect)) {
      const idx = cleanCorrect.charCodeAt(0) - 65;
      finalCorrect = options[idx];
    } else if (/^[0-3]$/.test(cleanCorrect)) {
      finalCorrect = options[parseInt(cleanCorrect)];
    }

    return {
      id: index + 1,
      question: raw.question.trim(),
      options,
      correctAnswer: finalCorrect,
      isCorrectVerified: false
    };
  }

  private processQuestionArray(json: any): QuizQuestion[] {
    let array: any[] = [];
    if (Array.isArray(json)) array = json;
    else if (json && typeof json === 'object' && json.questions && Array.isArray(json.questions)) array = json.questions;

    const parsed: QuizQuestion[] = [];
    for (const item of array) {
      const q = this.parseQuestion(item, parsed.length);
      if (q) parsed.push(q);
    }
    return parsed;
  }

  async generateQuestions(jobDescription: string, difficulty: DifficultyLevel = 'moyen', offre: any = null): Promise<any[]> {
    this.logger.log('Generating AI questions');
    const prompt = `
Génère 4 questions à choix multiples (QCM) en FRANÇAIS basées sur cette description de poste.
Chaque question doit être technique et évaluer une compétence réelle du rôle.
Retourne UNIQUEMENT un objet JSON. 
Format attendu:
{
 "questions":[
  {
   "question": "Texte de la question",
   "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
   "correctAnswer": "Texte exact de l'option correcte"
  }
 ]
}
DESCRIPTION DU POSTE:
${jobDescription.substring(0, 1000)}
`;
    const raw = await this.callOllama(prompt);
    const json = this.extractJson<any>(raw);
    const parsed = this.processQuestionArray(json);

    if (parsed.length === 0) throw new HttpException("Aucune question valide générée", HttpStatus.UNPROCESSABLE_ENTITY);

    const difficultyMap: Record<DifficultyLevel, QuestionNiveau> = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };
    const niveau: QuestionNiveau = difficultyMap[difficulty] || 'Moyen';

    if (offre) {
      const entities = parsed.map(q => this.questionRepository.create({
        contenu: { question: q.question, options: q.options },
        reponses: [q.correctAnswer],
        chronometre: 2,
        niveauDifficulte: niveau,
        dateEvaluation: new Date(),
        offre: offre
      }));
      return await this.questionRepository.save(entities);
    }

    return parsed;
  }

  async regenerateQuestions(jobDescription: string, difficulty: DifficultyLevel = 'moyen', previousQuestions: string[] = []): Promise<QuizQuestion[]> {
    const avoid = previousQuestions.join('\n');
    const prompt = `
Génère 4 nouvelles questions QCM différentes des précédentes en FRANÇAIS.
Évite ces sujets/questions:
${avoid}
DESCRIPTION DU POSTE:
${jobDescription}
Retourne UNIQUEMENT le JSON avec la clé "questions".
`;
    const raw = await this.callOllama(prompt);
    const json = this.extractJson<any>(raw);
    return this.processQuestionArray(json);
  }

  async generateRecommendation(jobDescription: string, results: TestResult[]): Promise<AIRecommendation> {
    const total = results.length;
    const correct = results.filter(r => r.isCorrect).length;
    const score = Math.round((correct / total) * 100);

    const detailedResults = results.map(r => 
      `- Question: "${r.question}" | Réponse candidat: "${r.selectedAnswer}" | Correcte: "${r.isCorrect ? 'OUI' : 'NON (Attendu: ' + r.correctAnswer + ')'}"`
    ).join('\n');

    const prompt = `
Analyse les résultats du test du candidat pour ce poste en FRANÇAIS.
Score obtenu: ${score}% (${correct}/${total})

RÉSULTATS DÉTAILLÉS :
${detailedResults}

Donne une analyse professionnelle. Identifie les points forts techniques prouvés par les bonnes réponses et les lacunes basées sur les erreurs.
Retourne UNIQUEMENT un objet JSON structure:
{
 "score": ${score},
 "totalQuestions": ${total},
 "strengths": ["Analyse force 1", "Analyse force 2"],
 "weaknesses": ["Analyse lacune 1", "Analyse lacune 2"],
 "recommendations": ["Conseil précis 1", "Conseil précis 2", "Conseil précis 3"]
}
DESCRIPTION DU POSTE:
${jobDescription}
`;
    const raw = await this.callOllama(prompt);
    const recommendation = this.extractJson<AIRecommendation>(raw);
    recommendation.score = score;
    recommendation.totalQuestions = total;
    return recommendation;
  }

}