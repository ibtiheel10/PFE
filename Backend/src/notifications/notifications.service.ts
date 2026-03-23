import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notifRepo: Repository<Notification>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async createForUser(
        userId: number,
        titre: string,
        message: string,
        type: NotificationType,
    ): Promise<Notification> {
        const notif = this.notifRepo.create({ userId, titre, message, type, lu: false });
        return this.notifRepo.save(notif);
    }

    async getUserNotifications(userId: number): Promise<Notification[]> {
        return this.notifRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async getUnreadCount(userId: number): Promise<number> {
        return this.notifRepo.count({ where: { userId, lu: false } });
    }

    async markAsRead(id: number, userId: number): Promise<void> {
        await this.notifRepo.update({ id, userId }, { lu: true });
    }

    async markAllRead(userId: number): Promise<void> {
        await this.notifRepo
            .createQueryBuilder()
            .update(Notification)
            .set({ lu: true })
            .where('userId = :userId AND lu = false', { userId })
            .execute();
    }

    // ── Helpers for common notification scenarios ──────────────────

    async notifyCandidatureEnvoyee(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidature envoyée',
            `Votre candidature pour le poste "${titrePoste}" a bien été envoyée.`,
            'CANDIDATURE_ENVOYEE',
        );
    }

    async notifyCandidatureRecue(userId: number, nomCandidat: string, titrePoste: string) {
        return this.createForUser(
            userId,
            'Nouvelle candidature',
            `${nomCandidat} a postulé à votre offre "${titrePoste}".`,
            'CANDIDATURE_RECUE',
        );
    }

    async notifyCandidatureAcceptee(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidature acceptée',
            `Félicitations ! Votre candidature pour "${titrePoste}" a été acceptée.`,
            'CANDIDATURE_ACCEPTEE',
        );
    }

    async notifyCandidatureRefusee(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidature refusée',
            `Votre candidature pour le poste "${titrePoste}" n'a pas été retenue.`,
            'CANDIDATURE_REFUSEE',
        );
    }

    async notifyCandidatureEnAttente(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidature en attente',
            `Votre candidature pour "${titrePoste}" est en cours d'examen.`,
            'CANDIDATURE_EN_ATTENTE',
        );
    }

    async notifyEvaluationDisponible(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Évaluation disponible',
            `Une évaluation est disponible pour le poste "${titrePoste}". Connectez-vous pour la passer.`,
            'EVALUATION_DISPONIBLE',
        );
    }

    async notifyEvaluationTerminee(userId: number, titrePoste: string, score: number) {
        return this.createForUser(
            userId,
            'Évaluation terminée',
            `Vous avez terminé l'évaluation pour "${titrePoste}". Score obtenu : ${score}%.`,
            'EVALUATION_TERMINEE',
        );
    }

    async notifyScoreObtenu(userId: number, titrePoste: string, score: number) {
        return this.createForUser(
            userId,
            `Score obtenu : ${score}%`,
            `Votre score pour l'évaluation "${titrePoste}" est de ${score}%.`,
            'SCORE_OBTENU',
        );
    }

    async notifyCandidatSelectionne(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidat sélectionné',
            `Félicitations ! Vous avez été sélectionné pour la prochaine étape du processus pour "${titrePoste}".`,
            'CANDIDAT_SELECTIONNE',
        );
    }

    async notifyCandidatNonRetenu(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Candidat non retenu',
            `Nous sommes désolés, vous n'avez pas été retenu pour le poste "${titrePoste}".`,
            'CANDIDAT_NON_RETENU',
        );
    }

    async notifyProfilMisAJour(userId: number) {
        return this.createForUser(
            userId,
            'Profil mis à jour',
            'Votre profil a été mis à jour avec succès.',
            'PROFIL_MIS_A_JOUR',
        );
    }

    async notifyMotDePasseModifie(userId: number) {
        return this.createForUser(
            userId,
            'Mot de passe modifié',
            'Votre mot de passe a été modifié avec succès.',
            'MOT_DE_PASSE_MODIFIE',
        );
    }

    async notifyMessageAdmin(userId: number, message: string) {
        return this.createForUser(userId, 'Message de l\'administrateur', message, 'MESSAGE_ADMIN');
    }

    async notifyResultatDisponible(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Résultat disponible',
            `Votre résultat pour l'évaluation de "${titrePoste}" est maintenant disponible.`,
            'RESULTAT_DISPONIBLE',
        );
    }

    async notifyEvaluationExpiree(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Session expirée',
            `Votre session d'évaluation pour "${titrePoste}" a expiré.`,
            'EVALUATION_EXPIREE',
        );
    }

    async notifyEvaluationRappel(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Rappel d\'évaluation',
            `N'oubliez pas de compléter votre évaluation pour "${titrePoste}" avant la date limite.`,
            'EVALUATION_RAPPEL',
        );
    }

    async notifyOffreRecommandee(userId: number, titrePoste: string) {
        return this.createForUser(
            userId,
            'Nouvelle offre recommandée',
            `Une nouvelle offre qui correspond à votre profil est disponible : "${titrePoste}".`,
            'OFFRE_RECOMMANDEE',
        );
    }

    async notifyNouveauMessageContact(expediteur: string, sujet: string) {
        const admins = await this.userRepo.find({ where: { role: 'Admin' } });
        const notifications = admins.map(admin =>
            this.notifRepo.create({
                userId: admin.id,
                titre: 'Nouveau message de contact',
                message: `Vous avez reçu un nouveau message de ${expediteur} concernant "${sujet}".`,
                type: 'NOUVEAU_MESSAGE_CONTACT',
                lu: false,
            })
        );
        if (notifications.length > 0) {
            await this.notifRepo.save(notifications);
        }
    }
}
