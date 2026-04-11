import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EntrepriseProfile {
    id: number;
    nom: string;
    email: string;
    secteur: string;
}

export interface EntrepriseUpdateDto {
    id: number;
    secteur: string;
}

export interface OffreEmploiCreateDto {
    titre: string;
    description: string;
    categorie: string;
    dateLimite: string;        // ISO date string
    typeDeContact: string;     // ex: "CDI", "CDD", "Stage"
    modeDeTravail: string;     // ex: "Remote", "Hybride", "Présentiel"
    salaire?: string;
    localisation: string;
    experienceRequise?: string;
    nbPost?: number;
}

export interface OffreEmploiUpdateDto extends OffreEmploiCreateDto {
    id: number;
}

export interface OffreEmploiResponse {
    id: number;
    titre: string;
    description: string;
    categorie: string;
    datePublication: string;
    dateLimite: string;
    typeDeContact: string;
    modeDeTravail: string;
    salaire?: string;
    localisation: string;
    experienceRequise?: string;
    nbPost?: number;
    entreprise?: {
        id: number;
        nom: string;
        secteur: string;
    };
}

export interface PagedOffresResponse {
    items: OffreEmploiResponse[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export interface CandidatureResponse {
    id: number;
    candidatId: number;
    offreEmploiId: number;
    datePostulation: string;
    statut: string;
    decision?: string;
    candidat?: {
        id: number;
        nom: string;
        prenom: string;
        email: string;
    };
    offreEmploi?: {
        id: number;
        titre: string;
    };
}

// ─── Offres emploi publiques ──────────────────────────────────────────────────

/**
 * Liste paginée des offres (public, tout le monde).
 * Paramètres optionnels : categorie, localisation, secteurEntreprise
 */
export const getOffresPubliques = async (params?: {
    page?: number;
    pageSize?: number;
    categorie?: string;
    localisation?: string;
    secteurEntreprise?: string;
}): Promise<PagedOffresResponse> => {
    const response = await api.get<PagedOffresResponse>('/OffreEmploi', { params });
    return response.data;
};

/**
 * Détail d'une offre (public).
 */
export const getOffreById = async (id: number): Promise<OffreEmploiResponse> => {
    const response = await api.get<OffreEmploiResponse>(`/OffreEmploi/${id}`);
    return response.data;
};

// ─── Profil entreprise ────────────────────────────────────────────────────────

/**
 * Récupère le profil de l'entreprise connectée (nécessite role Entreprise).
 */
export const getMonProfil = async (): Promise<EntrepriseProfile> => {
    const response = await api.get<EntrepriseProfile>('/Entreprise/mon-profil');
    return response.data;
};

/**
 * Récupère un profil entreprise par ID.
 */
export const getEntrepriseById = async (id: number): Promise<EntrepriseProfile> => {
    const response = await api.get<EntrepriseProfile>(`/Entreprise/${id}`);
    return response.data;
};

/**
 * Met à jour le profil de l'entreprise connectée.
 * Seul le champ `secteur` est modifiable.
 */
export const updateMonProfil = async (id: number, secteur: string): Promise<void> => {
    await api.put(`/Entreprise/${id}`, { id, secteur } as EntrepriseUpdateDto);
};

// ─── Mes offres d'emploi ──────────────────────────────────────────────────────

/**
 * Toutes les offres de l'entreprise connectée.
 */
export const getMesOffres = async (): Promise<OffreEmploiResponse[]> => {
    const response = await api.get<OffreEmploiResponse[]>('/Entreprise/mes-offres');
    return response.data;
};

/**
 * Crée une nouvelle offre d'emploi (l'entrepriseId est lu du JWT côté serveur).
 */
export const createOffre = async (dto: OffreEmploiCreateDto): Promise<OffreEmploiResponse> => {
    const response = await api.post<OffreEmploiResponse>('/Entreprise/offres', dto);
    return response.data;
};

/**
 * Modifie une offre existante.
 */
export const updateOffre = async (id: number, dto: OffreEmploiCreateDto): Promise<void> => {
    await api.put(`/Entreprise/offres/${id}`, { ...dto, id } as OffreEmploiUpdateDto);
};

/**
 * Supprime une offre d'emploi.
 */
export const deleteOffre = async (id: number): Promise<void> => {
    await api.delete(`/Entreprise/offres/${id}`);
};

// ─── Candidatures reçues ──────────────────────────────────────────────────────

/**
 * Liste des candidatures pour une offre de l'entreprise connectée.
 */
export const getCandidaturesParOffre = async (offreId: number): Promise<CandidatureResponse[]> => {
    const response = await api.get<CandidatureResponse[]>(`/Candidature/offre/${offreId}`);
    return response.data;
};

// ─── IA Endpoints (par ID d'offre) ─────────────────────────────────────────────

export interface AiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

const handleAiError = (error: any): AiResponse<any> => {
    console.error('AI Service Error:', error);
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return { success: false, error: "Le délai d'attente a été dépassé. L'IA prend trop de temps." };
    }
    if (error.response) {
        const status = error.response.status;
        if (status === 422 || status === 400)
            return { success: false, error: 'Les données fournies sont invalides ou incomplètes.' };
        if (status === 503)
            return { success: false, error: "Le moteur d'IA (Groq) est temporairement indisponible." };
        return { success: false, error: error.response.data?.message || `Erreur IA (Code ${status}).` };
    }
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: "Impossible de joindre le service IA." };
};

/**
 * Générer des questions QCM pour une offre via l'IA.
 * POST /api/Entreprise/offres/{id}/generer-questions-ia
 */
export const generateQuestionsForOffre = async (offreId: string | number): Promise<AiResponse<{ questions: any[] }>> => {
    try {
        const response = await api.post(`/Entreprise/offres/${offreId}/generer-questions-ia`, {}, { timeout: 600000 });
        if (!response.data || !Array.isArray(response.data.questions)) {
            throw new Error("L'IA a renvoyé une réponse invalide.");
        }
        return { success: true, data: response.data as { questions: any[] } };
    } catch (error) {
        return handleAiError(error);
    }
};

/**
 * Régénérer des questions QCM pour une offre via l'IA.
 * POST /api/Entreprise/offres/{id}/regenerer-questions-ia
 */
export const regenerateQuestionsForOffre = async (offreId: string | number, previousQuestions: string[] = []): Promise<AiResponse<{ questions: any[] }>> => {
    try {
        const response = await api.post(`/Entreprise/offres/${offreId}/regenerer-questions-ia`, { previousQuestions }, { timeout: 600000 });
        if (!response.data || !Array.isArray(response.data.questions)) {
            throw new Error("L'IA a renvoyé une réponse invalide.");
        }
        return { success: true, data: response.data as { questions: any[] } };
    } catch (error) {
        return handleAiError(error);
    }
};

/**
 * Sauvegarder des questions générées pour une offre.
 * POST /api/Entreprise/offres/{id}/sauvegarder-questions-ia
 */
export const saveQuestionsForOffre = async (offreId: string | number, questions: any[]): Promise<AiResponse<any>> => {
    try {
        const response = await api.post(`/Entreprise/offres/${offreId}/sauvegarder-questions-ia`, { questions }, { timeout: 120000 });
        return { success: true, data: response.data };
    } catch (error) {
        return handleAiError(error);
    }
};

/**
 * Obtenir des recommandations IA pour une offre après résultats de test.
 * GET /api/Entreprise/offres/{id}/recommandation-ia
 */
export const getRecommandationsForOffre = async (offreId: string | number): Promise<AiResponse<any>> => {
    try {
        const response = await api.post(`/Entreprise/offres/${offreId}/recommandation-ia`, {}, { timeout: 600000 });
        if (!response.data || typeof response.data !== 'object') {
            throw new Error('Format de recommandation IA invalide.');
        }
        return { success: true, data: response.data };
    } catch (error) {
        return handleAiError(error);
    }
};

// Anciennes fonctions génériques (gardées pour rétro-compatibilité)
export const generateQuestions = generateQuestionsForOffre;
export const regenerateQuestions = regenerateQuestionsForOffre;
export const getAIRecommendation = getRecommandationsForOffre;
