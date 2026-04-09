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

export async function deleteNotification(id: number): Promise<void> {
    await axios.delete(`/notifications/${id}`);
}

export async function deleteAllNotifications(): Promise<void> {
    await axios.delete('/notifications');
}

/**
 * Returns an SVG icon string for each notification type.
 */
export function getNotifIcon(type: string): string {
    if (type === 'MESSAGE_ENTREPRISE' || type === 'MESSAGE_ADMIN' || type === 'NOUVEAU_MESSAGE_CONTACT') {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
    }
    if (type.startsWith('CANDIDATURE_ACCEPTEE') || type.startsWith('CANDIDAT_SELECTIONNE')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    }
    if (type.startsWith('CANDIDATURE_REFUSEE') || type.startsWith('CANDIDAT_NON_RETENU')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    }
    if (type.startsWith('EVALUATION') || type.startsWith('SCORE') || type.startsWith('RESULTAT')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    if (type.startsWith('CANDIDATURE')) {
        return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`;
    }
    // default bell
    return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`;
}

/**
 * Returns color classes for the icon badge.
 */
export function getNotifBgClass(type: string): string {
    if (type === 'MESSAGE_ENTREPRISE') return 'bg-[#eff6ff] text-[#1e40af]';
    if (type === 'MESSAGE_ADMIN' || type === 'NOUVEAU_MESSAGE_CONTACT') return 'bg-orange-50 text-orange-500';
    if (type.startsWith('CANDIDATURE_ACCEPTEE') || type.startsWith('CANDIDAT_SELECTIONNE')) return 'bg-green-50 text-green-600';
    if (type.startsWith('CANDIDATURE_REFUSEE') || type.startsWith('CANDIDAT_NON_RETENU')) return 'bg-red-50 text-red-500';
    if (type.startsWith('EVALUATION') || type.startsWith('SCORE') || type.startsWith('RESULTAT')) return 'bg-purple-50 text-purple-600';
    return 'bg-[#eff6ff] text-[#1e40af]';
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
