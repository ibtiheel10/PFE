import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface QcmOption {
  text: string;
  isCorrect?: boolean;
}

export interface QcmQuestion {
  id: number;
  question: string;
  options: QcmOption[];
  chronometre?: number;
}

export interface QcmScoreDetail {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QcmScoreResult {
  score: number;
  total: number;
  percentage: number;
  details: QcmScoreDetail[];
}

// ─── API Calls ────────────────────────────────────────────────────────────────

/**
 * Génère 5 questions QCM via l'IA pour un ensemble de compétences.
 * POST /api/ai/generate-questions
 */
export async function generateQCM(competences: string): Promise<QcmQuestion[]> {
  const response = await api.post(
    '/ai/generate-questions',
    { jobDescription: competences },
    { timeout: 60000 },
  );
  return response.data?.questions ?? response.data;
}

/**
 * Envoie les réponses du candidat et reçoit le score calculé côté serveur.
 * POST /api/ai/submit-answers
 */
export async function submitAnswers(
  questions: QcmQuestion[],
  answers: string[],
): Promise<QcmScoreResult> {
  const response = await api.post(
    '/ai/submit-answers',
    { questions, answers },
    { timeout: 15000 },
  );
  return response.data;
}
