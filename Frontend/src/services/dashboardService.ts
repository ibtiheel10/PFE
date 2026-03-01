import api from './axios';

export interface CandidaturesParMoisDto {
    mois: string;
    count: number;
}

export interface CandidatDashboardDto {
    totalCandidatures: number;
    acceptees: number;
    enAttente: number;
    refusees: number;
    candidaturesParMois: CandidaturesParMoisDto[];
}

export interface TopCandidatDto {
    candidatId: number;
    prenom: string | null;
    score: number | null;
    note: string | null;
    statut: string | null;
}

export interface EntrepriseDashboardDto {
    totalCandidatures: number;
    offresActives: number;
    totalOffres: number;
    candidaturesParMois: CandidaturesParMoisDto[];
    meilleursCandidats: TopCandidatDto[];
}

export const getCandidatDashboard = async (): Promise<CandidatDashboardDto> => {
    const response = await api.get<CandidatDashboardDto>('/Dashboard/candidat');
    return response.data;
};

export const getEntrepriseDashboard = async (): Promise<EntrepriseDashboardDto> => {
    const response = await api.get<EntrepriseDashboardDto>('/Dashboard/entreprise');
    return response.data;
};
