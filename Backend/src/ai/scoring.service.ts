import { Injectable } from '@nestjs/common';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
}

export interface ScoreResult {
  score: number;
  total: number;
  percentage: number;
  details: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>;
}

@Injectable()
export class ScoringService {
  /**
   * Calcule le score d'un candidat basé sur ses réponses et les questions.
   * @param questions - Liste des questions QCM avec les bonnes réponses
   * @param answers   - Tableau des textes des réponses choisies par le candidat (indexé par position)
   */
  calculateScore(questions: QuizQuestion[], answers: string[]): ScoreResult {
    let score = 0;
    const details: ScoreResult['details'] = [];

    questions.forEach((q, i) => {
      const correctOption = q.options.find(o => o.isCorrect);
      const correctAnswer = correctOption?.text ?? '';
      const selectedAnswer = answers[i] ?? '';
      const isCorrect =
        correctAnswer.trim().toLowerCase() === selectedAnswer.trim().toLowerCase();

      if (isCorrect) score++;

      details.push({
        question: q.question,
        selectedAnswer,
        correctAnswer,
        isCorrect,
      });
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return { score, total, percentage, details };
  }
}
