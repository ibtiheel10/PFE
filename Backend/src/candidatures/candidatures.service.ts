import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidature } from '../entities/candidature.entity';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class CandidaturesService {
    constructor(
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        private readonly notificationsService: NotificationsService,
    ) { }

    async apply(userId: number, offreId: string): Promise<Candidature> {
        // 1. Vérifier si le candidat existe
        const candidat = await this.userRepo.findOne({ where: { id: userId, role: 'Candidat' } });
        if (!candidat) {
            throw new NotFoundException('Candidat introuvable.');
        }

        // 2. Vérifier si l'offre existe et charger l'entreprise
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) {
            throw new NotFoundException('Offre d\'emploi introuvable.');
        }

        // 3. Vérifier si le candidat a déjà postulé à cette offre
        const existing = await this.candidatureRepo.findOne({
            where: {
                candidat: { id: userId },
                offre: { id: offreId },
            },
        });

        if (existing) {
            throw new ConflictException('Vous avez déjà postulé à cette offre.');
        }

        // 4. Créer la candidature
        const candidature = this.candidatureRepo.create({
            candidat,
            offre,
            statut: 'En attente',
            datePostulation: new Date(),
        });

        const saved = await this.candidatureRepo.save(candidature);

        // 5. Créer les notifications automatiques
        await this.notificationsService.notifyCandidatureEnvoyee(userId, offre.TitreDePost);
        await this.notificationsService.notifyCandidatureEnAttente(userId, offre.TitreDePost);

        if (offre.entreprise && offre.entreprise.id) {
            const nomComplet = [candidat.nom, candidat.prenom].filter(Boolean).join(' ') || 'Un candidat';
            await this.notificationsService.notifyCandidatureRecue(offre.entreprise.id, nomComplet, offre.TitreDePost);
        }

        return saved;
    }

    async getMyApplications(userId: number): Promise<Candidature[]> {
        return await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'DESC' },
        });
    }

    async getMyStats(userId: number) {
        const candidatures = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            order: { datePostulation: 'ASC' },
        });

        const progression = candidatures.map(c => ({
            date: c.datePostulation,
            score: c.score || 0,
        }));

        const stats = {
            total: candidatures.length,
            enAttente: candidatures.filter(c => c.statut === 'En attente').length,
            acceptées: candidatures.filter(c => c.statut === 'Acceptée' || c.statut === 'Entretiens').length,
            refusées: candidatures.filter(c => c.statut === 'Refusée').length,
            reussis: candidatures.filter(c => (c.score || 0) >= 50).length,
            echoues: candidatures.filter(c => (c.score || 0) < 50).length,
            moyenne: candidatures.length > 0
                ? Number((candidatures.reduce((acc, curr) => acc + (curr.score || 0), 0) / candidatures.length).toFixed(2))
                : 0
        };

        return { progression, stats };
    }

    async findOne(id: number): Promise<Candidature> {
        const candidature = await this.candidatureRepo.findOne({
            where: { id },
            relations: ['candidat', 'offre'],
        });
        if (!candidature) {
            throw new NotFoundException(`Candidature avec l'ID ${id} introuvable.`);
        }
        return candidature;
    }

    async deleteApplication(id: number, userId: number): Promise<void> {
        const candidature = await this.candidatureRepo.findOne({
            where: { id },
            relations: ['candidat'],
        });

        if (!candidature) {
            throw new NotFoundException(`Candidature introuvable.`);
        }

        if (candidature.candidat.id !== userId) {
            throw new ConflictException('Vous n\'êtes pas autorisé à annuler cette candidature.');
        }

        if (candidature.statut !== 'En attente') {
            throw new ConflictException('Seules les candidatures "En attente" peuvent être annulées.');
        }

        candidature.statut = 'Annulée';
        await this.candidatureRepo.save(candidature);
    }
}
