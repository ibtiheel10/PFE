import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OffresCronService {
    private readonly logger = new Logger(OffresCronService.name);
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        private readonly notificationsService: NotificationsService,
        private readonly configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
    }

    /**
     * Launch QCMs that have reached their scheduled time.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async launchScheduledQCMs() {
        const now = new Date();

        const offres = await this.offreRepo.createQueryBuilder('offre')
            .where('offre.dateLancementQcm IS NOT NULL')
            .andWhere('offre.dateLancementQcm <= :now', { now })
            .andWhere('offre.qcmPublie = false')
            .getMany();

        if (offres.length > 0) {
            this.logger.log(`Vérification des lancements QCM: ${offres.length} offre(s) à publier.`);
        }

        for (const offre of offres) {
            const candidatures = await this.candidatureRepo.find({
                where: { offre: { id: offre.id } },
                relations: ['candidat'],
            });

            for (const cand of candidatures) {
                if (!cand.qcmDisponible && cand.score === null) {
                    cand.qcmDisponible = true;
                    // Auto-unlock the QCM for candidates
                    await this.candidatureRepo.save(cand);

                    if (cand.candidat?.email) {
                        const name = [cand.candidat.prenom, cand.candidat.nom].filter(Boolean).join(' ') || 'Candidat';
                        await this.sendQcmLaunchedEmail(cand.candidat.email, name, offre.TitreDePost);
                    }
                    
                    if (cand.candidat?.id) {
                        await this.notificationsService.notifyEvaluationDisponible(cand.candidat.id, offre.TitreDePost);
                    }
                }
            }

            offre.qcmPublie = true;
            await this.offreRepo.save(offre);
            this.logger.log(`QCM publié automatiquement pour l'offre ${offre.id}`);
        }
    }

    /**
     * Send reminders exactly 1 hour before QCM launch.
     */
    @Cron(CronExpression.EVERY_MINUTE)
    async send1HourQCMReminders() {
        const now = new Date();
        const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

        const offres = await this.offreRepo.createQueryBuilder('offre')
            .where('offre.dateLancementQcm IS NOT NULL')
            .andWhere('offre.dateLancementQcm > :now', { now })
            .andWhere('offre.dateLancementQcm <= :inOneHour', { inOneHour })
            .andWhere('offre.qcmNotification1hEnvoyee = false')
            .getMany();

        if (offres.length > 0) {
            this.logger.log(`Vérification des rappels 1h: ${offres.length} offre(s) avec QCM imminent.`);
        }

        for (const offre of offres) {
            const candidatures = await this.candidatureRepo.find({
                where: { offre: { id: offre.id } },
                relations: ['candidat'],
            });

            for (const cand of candidatures) {
                // Remind candidates who haven't passed the QCM yet
                if (cand.score === null && cand.candidat) {
                    // Send In-App Notification
                    await this.notificationsService.notifyEvaluationRappel(cand.candidat.id, offre.TitreDePost);

                    // Send Email
                    if (cand.candidat.email) {
                        const name = [cand.candidat.prenom, cand.candidat.nom].filter(Boolean).join(' ') || 'Candidat';
                        await this.sendQcmReminderEmail(cand.candidat.email, name, offre.TitreDePost, offre.dateLancementQcm);
                    }
                }
            }

            offre.qcmNotification1hEnvoyee = true;
            await this.offreRepo.save(offre);
            this.logger.log(`Rappel 1h automatique envoyé pour l'offre ${offre.id}`);
        }
    }

    private async sendQcmLaunchedEmail(email: string, candidateName: string, offreTitle: string) {
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
            <h2 style="color: #4f46e5;">SkillVia — QCM Disponible !</h2>
            <p>Bonjour <strong>${candidateName}</strong>,</p>
            <p>Le questionnaire de recrutement pour le poste <strong>"${offreTitle}"</strong> a démarré et est désormais ouvert aux candidats inscrits.</p>
            <p>Connectez-vous à votre espace pour passer l'évaluation dès maintenant.</p>
            <a href="http://localhost:5173/candidat/evaluations"
               style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
              Accéder à mon évaluation
            </a>
            <p style="color:#888;font-size:12px;margin-top:24px;">Si vous n'attendiez pas cet email, merci de l'ignorer.</p>
          </div>
        `;
        try {
            await this.transporter.sendMail({
                from: `"SkillVia" <${this.configService.get('SMTP_FROM')}>`,
                to: email,
                subject: `[SkillVia] Le QCM pour "${offreTitle}" est ouvert !`,
                html,
            });
        } catch (err) {
            this.logger.error('Erreur d\'envoi d\'email (QCM lancé) vers ' + email, err);
        }
    }

    private async sendQcmReminderEmail(email: string, candidateName: string, titrePoste: string, dateLancement: Date) {
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Paris'
        });
        const timeStr = formatter.format(dateLancement);
        
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
            <h2 style="color: #eab308;">SkillVia — Rappel QCM Imminent !</h2>
            <p>Bonjour <strong>${candidateName}</strong>,</p>
            <p>Ceci est un rappel vous informant que le QCM pour le poste <strong>"${titrePoste}"</strong> sera disponible dans moins d'une heure.</p>
            <p>Lancement prévu à <strong>${timeStr}</strong>.</p>
            <p>Assurez-vous d'avoir une connexion internet stable et de vous connecter à temps afin de le passer dans de bonnes conditions.</p>
            <br/>
            <p>L'équipe SkillVia</p>
          </div>
        `;
        try {
            await this.transporter.sendMail({
                from: `"SkillVia" <${this.configService.get('SMTP_FROM')}>`,
                to: email,
                subject: `[SkillVia] Rappel urgent : QCM pour "${titrePoste}" dans moins d'une heure`,
                html,
            });
        } catch (err) {
            this.logger.error('Erreur d\'envoi d\'email de rappel 1h vers ' + email, err);
        }
    }
}
