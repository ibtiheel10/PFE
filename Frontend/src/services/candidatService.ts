import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CandidatProfile {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    dateNaissance?: string;
}

export interface SkillItem {
    category: string;
    score: number;
}

export interface DashboardData {
    recentApplications: any[];
    recentResults: any[];
    suggestions: any[];
    skillsAnalysis: SkillItem[];
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
 * Met à jour le profil du candidat connecté.
 */
export const updateMonProfil = async (dto: Partial<CandidatProfile>): Promise<CandidatProfile> => {
    const response = await api.put<CandidatProfile>('/Candidat/mon-profil', dto);
    return response.data;
};

/**
 * Récupère les données du dashboard candidat.
 */
export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await api.get<DashboardData>('/Candidat/dashboard');
    return response.data;
};
