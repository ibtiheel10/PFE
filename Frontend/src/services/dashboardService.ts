import api from './axios';

export interface CandidaturesParMoisDto {
    period: string;
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
    name: string | null;
    email: string | null;
    avatar: string | null;
    score: number | null;
    note: string | null;
    statut: string | null;
    role?: string | null;
}

export interface CandidaturesParPeriodeDto {
    period: string;
    count: number;
}

export interface EntrepriseDashboardDto {
    totalCandidatures: number;
    offresActives: number;
    totalOffres: number;
    candidaturesParMois: CandidaturesParMoisDto[];
    candidaturesLast3Months: CandidaturesParPeriodeDto[];
    candidaturesLast30Days: CandidaturesParPeriodeDto[];
    candidaturesLast7Days: CandidaturesParPeriodeDto[];
    meilleursCandidats: TopCandidatDto[];
}

export const getCandidatDashboard = async (): Promise<CandidatDashboardDto> => {
    const response = await api.get<CandidatDashboardDto>('/Dashboard/candidat');
    return response.data;
};

export const getEntrepriseDashboard = async (): Promise<EntrepriseDashboardDto> => {
    const response = await api.get<EntrepriseDashboardDto>('/Entreprise/dashboard');
    return response.data;
};
