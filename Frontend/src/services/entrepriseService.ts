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
    const response = await api.get<OffreEmploiResponse[]>('/OffreEmploi/mes-offres');
    return response.data;
};

/**
 * Crée une nouvelle offre d'emploi (l'entrepriseId est lu du JWT côté serveur).
 */
export const createOffre = async (dto: OffreEmploiCreateDto): Promise<OffreEmploiResponse> => {
    const response = await api.post<OffreEmploiResponse>('/OffreEmploi', dto);
    return response.data;
};

/**
 * Modifie une offre existante.
 */
export const updateOffre = async (id: number, dto: OffreEmploiCreateDto): Promise<void> => {
    await api.put(`/OffreEmploi/${id}`, { ...dto, id } as OffreEmploiUpdateDto);
};

/**
 * Supprime une offre d'emploi.
 */
export const deleteOffre = async (id: number): Promise<void> => {
    await api.delete(`/OffreEmploi/${id}`);
};

// ─── Candidatures reçues ──────────────────────────────────────────────────────

/**
 * Liste des candidatures pour une offre de l'entreprise connectée.
 */
export const getCandidaturesParOffre = async (offreId: number): Promise<CandidatureResponse[]> => {
    const response = await api.get<CandidatureResponse[]>(`/Candidature/offre/${offreId}`);
    return response.data;
};
