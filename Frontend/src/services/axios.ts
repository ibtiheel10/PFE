import axios from 'axios';

// ─── Instance Axios globale ───────────────────────────────────────────────────
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ─── Intercepteur de REQUÊTE : attache le token JWT automatiquement ───────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Intercepteur de RÉPONSE : gestion globale des erreurs ───────────────────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expiré ou invalide → redirection vers login
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        } else if (status === 403) {
            console.error('Accès interdit : vous n\'avez pas les droits nécessaires.');
        } else if (status === 500) {
            console.error('Erreur serveur interne. Veuillez réessayer plus tard.');
        }

        return Promise.reject(error);
    }
);

export default api;
