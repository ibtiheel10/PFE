import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';

@Injectable()
export class QcmReminderService {
    private readonly logger = new Logger(QcmReminderService.name);
    private transporter: nodemailer.Transporter;

    constructor(
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
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

    @Cron(CronExpression.EVERY_HOUR)
    async handleCron() {
        this.logger.log('Vérification des QCM prévus dans 24h...');
        
        const now = new Date();
        const in23Hours = new Date(now.getTime() + 23 * 60 * 60 * 1000);
        const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const offresDeQcmProches = await this.offreRepo.createQueryBuilder('offre')
            .where('offre.dateLancementQcm IS NOT NULL')
            .andWhere('offre.dateLancementQcm >= :in23Hours', { in23Hours })
            .andWhere('offre.dateLancementQcm <= :in24Hours', { in24Hours })
            .getMany();

        for (const offre of offresDeQcmProches) {
            const candidatures = await this.candidatureRepo.find({
                where: { offre: { id: offre.id } },
                relations: ['candidat'],
            });

            for (const candidature of candidatures) {
                if (candidature.score === null && candidature.candidat && candidature.candidat.email) {
                    await this.sendReminderEmail(candidature.candidat.email, offre.TitreDePost, offre.dateLancementQcm);
                }
            }
        }
    }

    private async sendReminderEmail(email: string, titrePoste: string, dateLancement: Date) {
        const subject = `Rappel : Votre test QCM pour le poste ${titrePoste}`;
        const formattedDate = dateLancement.toLocaleString('fr-FR');
        
        const html = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2 style="color: #4f46e5;">SkillVia</h2>
        <p>Bonjour,</p>
        <p>Nous vous rappelons que votre test QCM pour le poste <strong>${titrePoste}</strong> aura lieu le <strong>${formattedDate}</strong>.</p>
        <p>Merci de vous connecter à temps sur la plateforme pour passer votre évaluation.</p>
        <p>Assurez-vous d'avoir une connexion stable et d'être dans un environnement calme avant de commencer.</p>
        <br/>
        <p>Cordialement,</p>
        <p>L'équipe SkillVia</p>
      </div>
    `;

        try {
            await this.transporter.sendMail({
                from: `"SkillVia" <${this.configService.get('SMTP_FROM')}>`,
                to: email,
                subject,
                html,
            });
            this.logger.log(`Email de rappel envoyé à ${email}`);
        } catch (err) {
            this.logger.error(`Erreur lors de l'envoi de l'email à ${email}`, err);
        }
    }
}
