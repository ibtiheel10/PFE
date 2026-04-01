import api from './axios';

export interface OffreEmploi {
    id: string; // UUID
    TitreDePost: string;
    Description: string;
    Categorie: string;
    DatePublication: string;
    DateLimite: string | null;
    TypeDeContrat: string | null;
    ModeDeTravail: string | null;
    Salaire: number | null;
    Localisation: string;
    ExperienceRequise: string | null;
    NbPost: number;
    entreprise?: { id: number; nom: string };
    // Visuel (frontend only)
    icon?: string;
    iconColor?: string;
}

const getVisualMeta = (categorie: string) => {
    const cat = categorie.toLowerCase();
    if (cat.includes('it') || cat.includes('dev') || cat.includes('tech'))
        return { icon: 'fa-solid fa-code', iconColor: '#3b82f6' };
    if (cat.includes('design') || cat.includes('ux'))
        return { icon: 'fa-solid fa-palette', iconColor: '#ec4899' };
    if (cat.includes('marketing') || cat.includes('com'))
        return { icon: 'fa-solid fa-bullhorn', iconColor: '#f59e0b' };
    return { icon: 'fa-solid fa-briefcase', iconColor: '#64748b' };
};

/**
 * Récupère toutes les offres d'emploi publiques.
 */
export const getOffres = async (): Promise<OffreEmploi[]> => {
    const response = await api.get<OffreEmploi[]>('/offres');
    return response.data.map(o => ({
        ...o,
        ...getVisualMeta(o.Categorie)
    }));
};

/**
 * Récupère une offre d'emploi par son ID (UUID).
 */
export const getOffreById = async (id: string): Promise<OffreEmploi> => {
    const response = await api.get<OffreEmploi>(`/offres/${id}`);
    return {
        ...response.data,
        ...getVisualMeta(response.data.Categorie)
    };
};
