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

export const getCandidatDashboard = async (): Promise<CandidatDashboardDto> => {
    const response = await api.get<CandidatDashboardDto>('/Dashboard/candidat');
    return response.data;
};
