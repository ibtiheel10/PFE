import api from './axios';

// Interfaces
export interface CandidatureResponseDto {
    id: number;
    datePostulation: string;
    statut: string;
    score: number | null;
    decision: string | null;
    note: number | null;
    commentaire: string | null;
    evaluationDetails: string | null; // JSON String
    candidatId: number;
    candidatPrenom: string | null;
    offreEmploiId: number;
    offreTitre: string;
}

export const getMesCandidatures = async (): Promise<CandidatureResponseDto[]> => {
    const response = await api.get<CandidatureResponseDto[]>('/Candidature/mes-candidatures');
    return response.data;
};

export const getCandidatureById = async (id: number): Promise<CandidatureResponseDto> => {
    const response = await api.get<CandidatureResponseDto>(`/Candidature/${id}`);
    return response.data;
};
