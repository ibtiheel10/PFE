import axios from './axios';

export interface Notification {
    id: number;
    titre: string;
    message: string;
    type: string;
    lu: boolean;
    createdAt: string;
    userId: number;
}

export async function getNotifications(): Promise<Notification[]> {
    const res = await axios.get<Notification[]>('/notifications');
    return res.data;
}

export async function getUnreadCount(): Promise<number> {
    const res = await axios.get<{ count: number }>('/notifications/unread-count');
    return res.data.count;
}

export async function markAsRead(id: number): Promise<void> {
    await axios.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
    await axios.patch('/notifications/mark-all-read');
}

/**
 * Returns a display icon (emoji) for each notification type.
 */
export function getNotifIcon(type: string): string {
    const icons: Record<string, string> = {
        CANDIDATURE_ENVOYEE: '📤',
        CANDIDATURE_RECUE: '📬',
        CANDIDATURE_ACCEPTEE: '🎉',
        CANDIDATURE_REFUSEE: '❌',
        CANDIDATURE_EN_ATTENTE: '⏳',
        OFFRE_RECOMMANDEE: '💡',
        EVALUATION_DISPONIBLE: '📝',
        EVALUATION_COMMENCEE: '▶️',
        EVALUATION_TERMINEE: '✔️',
        EVALUATION_EXPIREE: '⌛',
        EVALUATION_RAPPEL: '⏰',
        EVALUATION_FERMEE: '🔒',
        RESULTAT_DISPONIBLE: '📊',
        SCORE_OBTENU: '🏆',
        CANDIDAT_SELECTIONNE: '⭐',
        CANDIDAT_NON_RETENU: '😔',
        MOT_DE_PASSE_MODIFIE: '🔑',
        PROFIL_MIS_A_JOUR: '👤',
        MESSAGE_ADMIN: '📢',
    };
    return icons[type] ?? '🔔';
}

/**
 * Returns a Tailwind bg class for the icon badge.
 */
export function getNotifBgClass(type: string): string {
    if (type.startsWith('CANDIDATURE_ACCEPTEE') || type.startsWith('CANDIDAT_SELECTIONNE')) return 'bg-green-50';
    if (type.startsWith('CANDIDATURE_REFUSEE') || type.startsWith('CANDIDAT_NON_RETENU')) return 'bg-red-50';
    if (type.startsWith('EVALUATION') || type.startsWith('SCORE') || type.startsWith('RESULTAT')) return 'bg-purple-50';
    if (type === 'MESSAGE_ADMIN') return 'bg-orange-50';
    return 'bg-blue-50';
}

/**
 * Formats createdAt date into a human-readable French relative time.
 */
export function formatNotifTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'À l\'instant';
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD < 7) return `Il y a ${diffD}j`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}
