import api from './axios';

// Interfaces
export interface CandidatureResponse {
    id: number;
    datePostulation: string;
    statut: string;
    score: number | null;
    decision: string | null;
    tempsEcoule?: string;
    nbReponsesCorrectes?: number;
    totalQuestions?: number;
    rapidite?: string;
    evaluationDetails?: string;
    rank?: number | null;
    isForfeit?: boolean;
    offre: {
        id: string;
        TitreDePost: string;
        Categorie: string;
        Localisation: string;
        DateLimite?: string | null;
        dateLancementQcm?: string | null;
        seuilMinimal?: number;
    };
}

export interface CandidatureStats {
    progression: { date: string; score: number }[];
    stats: {
        total: number;
        enAttente: number;
        entretiens?: number;
        acceptées: number;
        refusées: number;
        reussis: number;
        echoues: number;
        moyenne: number;
        expirees?: number;
    };
}

/**
 * Postule à une offre d'emploi (UUID).
 */
export const postuler = async (offreId: string): Promise<CandidatureResponse> => {
    const response = await api.post<CandidatureResponse>('/candidatures/apply/' + offreId);
    return response.data;
};

/**
 * Récupère toutes les candidatures du candidat connecté.
 */
export const getMesCandidatures = async (): Promise<CandidatureResponse[]> => {
    const response = await api.get<CandidatureResponse[]>('/candidatures/my-applications');
    return response.data;
};

/**
 * Récupère les statistiques de résultats pour les graphiques.
 */
export const getMesStats = async (): Promise<CandidatureStats> => {
    const response = await api.get<CandidatureStats>('/candidatures/stats');
    return response.data;
};

/**
 * Récupère une candidature par son ID.
 */
export const getCandidatureById = async (id: number): Promise<CandidatureResponse> => {
    const response = await api.get<CandidatureResponse>(`/candidatures/${id}/result`);
    return response.data;
};

/**
 * Annule une candidature.
 */
export const deleteCandidature = async (id: number): Promise<void> => {
    await api.delete(`/candidatures/${id}`);
};

/**
 * Récupère le détail d'un résultat spécifique.
 */
export const getResultById = async (id: number): Promise<CandidatureResponse> => {
    const response = await api.get<CandidatureResponse>(`/candidatures/${id}/result`);
    return response.data;
};
