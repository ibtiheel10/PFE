import api from './axios';

export interface OffreEmploiDto {
    id: number;
    titre: string;
    categorie: string;
    localisation: string;
    modeDeTravail: string | null;
    salaire: string | null;
    datePublication: string;
    dateLimite: string | null;
    competences: string | null;
    icon: string | null;
    iconColor: string | null;
    entrepriseNom: string | null;
    entrepriseSecteur: string | null;
}

export interface PagedOffresDto {
    items: OffreEmploiDto[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export const getOffres = async (page = 1, pageSize = 6): Promise<PagedOffresDto> => {
    const response = await api.get<PagedOffresDto>('/OffreEmploi', {
        params: { page, pageSize }
    });
    return response.data;
};

export const getMesOffres = async (): Promise<OffreEmploiDto[]> => {
    const response = await api.get<OffreEmploiDto[]>('/OffreEmploi/mes-offres');
    return response.data;
};
