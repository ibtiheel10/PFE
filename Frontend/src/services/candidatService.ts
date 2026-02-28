import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CandidatProfile {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    dateNaissance?: string;
}

export interface CandidatUpdateDto {
    id: number;
    prenom: string;
    dateNaissance?: string;
}

export interface CandidatureCreateDto {
    offreEmploiId: number;
    statut?: string;
}

export interface CandidatureUpdateDto {
    id: number;
    statut: string;
    decision?: string;
}

export interface CandidatureResponse {
    id: number;
    candidatId: number;
    offreEmploiId: number;
    datePostulation: string;
    statut: string;
    decision?: string;
    offreEmploi?: {
        id: number;
        titre: string;
        localisation: string;
        typeDeContact: string;
        entreprise?: {
            id: number;
            nom: string;
        };
    };
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

// ─── Profil candidat ──────────────────────────────────────────────────────────

/**
 * Récupère le profil du candidat connecté.
 */
export const getMonProfil = async (): Promise<CandidatProfile> => {
    const response = await api.get<CandidatProfile>('/Candidat/mon-profil');
    return response.data;
};

/**
 * Récupère un profil candidat par ID (candidat lui-même ou admin).
 */
export const getCandidatById = async (id: number): Promise<CandidatProfile> => {
    const response = await api.get<CandidatProfile>(`/Candidat/${id}`);
    return response.data;
};

/**
 * Met à jour le profil du candidat connecté.
 * Champs modifiables : prenom, dateNaissance.
 */
export const updateMonProfil = async (id: number, dto: Omit<CandidatUpdateDto, 'id'>): Promise<void> => {
    await api.put(`/Candidat/${id}`, { id, ...dto } as CandidatUpdateDto);
};

// ─── Offres d'emploi (visibles par le candidat) ───────────────────────────────

/**
 * Liste paginée des offres publiques avec filtres optionnels.
 */
export const getOffres = async (params?: {
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

// ─── Candidatures ─────────────────────────────────────────────────────────────

/**
 * Récupère toutes les candidatures du candidat connecté (historique).
 */
export const getMesCandidatures = async (): Promise<CandidatureResponse[]> => {
    const response = await api.get<CandidatureResponse[]>('/Candidature/mes-candidatures');
    return response.data;
};

/**
 * Récupère le détail d'une candidature.
 */
export const getCandidatureById = async (id: number): Promise<CandidatureResponse> => {
    const response = await api.get<CandidatureResponse>(`/Candidature/${id}`);
    return response.data;
};

/**
 * Postule à une offre d'emploi.
 */
export const postuler = async (offreEmploiId: number): Promise<CandidatureResponse> => {
    const response = await api.post<CandidatureResponse>('/Candidature', {
        offreEmploiId,
    } as CandidatureCreateDto);
    return response.data;
};

/**
 * Annule / met à jour le statut d'une candidature.
 * Exemple : statut = 'Annulée'
 */
export const updateCandidature = async (id: number, statut: string, decision?: string): Promise<void> => {
    await api.put(`/Candidature/${id}`, { id, statut, decision } as CandidatureUpdateDto);
};

/**
 * Supprime une candidature (le candidat peut retirer sa candidature).
 */
export const deleteCandidature = async (id: number): Promise<void> => {
    await api.delete(`/Candidature/${id}`);
};
