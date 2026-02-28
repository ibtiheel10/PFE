import api from './axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginStepOneResponse {
    message: string;
    email: string;
    requiresOtp: boolean;
}

export interface VerifyOtpPayload {
    email: string;
    otpCode: string;
}

export interface AuthResponse {
    token: string;
    email: string;
    nom: string;
    role: string;
}

export interface RegisterPayload {
    nom: string;
    prenom?: string;
    email: string;
    password: string;
    role: 'Candidat' | 'Entreprise';
    secteur?: string;
    dateNaissance?: string;
}

// ─── Helpers localStorage ─────────────────────────────────────────────────────

export const saveSession = (data: AuthResponse) => {
    localStorage.setItem('userToken', data.token);
    localStorage.setItem('userRole', data.role.toLowerCase());
    localStorage.setItem('user_info', JSON.stringify({
        nom: data.nom,
        email: data.email,
        role: data.role.toLowerCase(),
    }));
};

export const clearSession = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user_info');
};

export const getRole = (): string | null => localStorage.getItem('userRole');
export const getToken = (): string | null => localStorage.getItem('userToken');
export const isAuthenticated = (): boolean => !!localStorage.getItem('userToken');

// ─── API calls ────────────────────────────────────────────────────────────────

/**
 * Étape 1 du login : vérifie email+mdp et déclenche l'envoi de l'OTP par email.
 * Retourne { requiresOtp: true, email } si les credentials sont corrects.
 */
export const login = async (payload: LoginPayload): Promise<LoginStepOneResponse> => {
    const response = await api.post<LoginStepOneResponse>('/auth/login', payload);
    return response.data;
};

/**
 * Étape 2 du login : vérifie le code OTP et retourne le JWT + infos utilisateur.
 * Sauvegarde automatiquement la session dans le localStorage.
 */
export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/verify-otp', payload);
    saveSession(response.data);
    return response.data;
};

/**
 * Renvoie un nouveau code OTP par email.
 */
export const resendOtp = async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>('/auth/resend-otp', { email });
    return response.data;
};

/**
 * Inscription : crée un compte Candidat ou Entreprise.
 * Sauvegarde automatiquement la session dans le localStorage.
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    saveSession(response.data);
    return response.data;
};

/**
 * Déconnexion côté client (supprime la session).
 */
export const logout = () => {
    clearSession();
};
