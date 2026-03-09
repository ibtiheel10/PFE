import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';

@Injectable()
export class EntrepriseService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
    ) { }

    // ─── Profil ──────────────────────────────────────────────────────────────

    async getMonProfil(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId, role: 'Entreprise' },
            select: ['id', 'nom', 'email', 'secteur'],
        });
        if (!user) throw new NotFoundException('Profil entreprise introuvable.');
        return user;
    }

    // ─── Dashboard ────────────────────────────────────────────────────────────

    async getDashboard(_userId: number) {
        const totalOffres = await this.offreRepo.count();

        const today = new Date();
        const offresActives = await this.offreRepo
            .createQueryBuilder('o')
            .where('o."DateLimite" IS NULL OR o."DateLimite" >= :today', { today })
            .getCount();

        const totalCandidatures = await this.candidatureRepo.count();

        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
        sevenMonthsAgo.setDate(1);

        const rawParMois = await this.candidatureRepo
            .createQueryBuilder('c')
            .select(`TO_CHAR(c."datePostulation", 'Mon YY')`, 'mois')
            .addSelect('COUNT(*)', 'count')
            .where('c."datePostulation" >= :from', { from: sevenMonthsAgo })
            .groupBy(`DATE_TRUNC('month', c."datePostulation")`)
            .addGroupBy(`TO_CHAR(c."datePostulation", 'Mon YY')`)
            .orderBy(`DATE_TRUNC('month', c."datePostulation")`, 'ASC')
            .getRawMany();

        const candidaturesParMois = rawParMois.map((r) => ({
            mois: r.mois,
            count: parseInt(r.count, 10),
        }));

        const topCandidats = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.candidat', 'user')
            .where('c.score IS NOT NULL')
            .orderBy('c.score', 'DESC')
            .limit(5)
            .getMany();

        const meilleursCandidats = topCandidats.map((c) => ({
            candidatId: c.candidat?.id ?? 0,
            prenom: c.candidat
                ? `${c.candidat.nom}${c.candidat.prenom ? ' ' + c.candidat.prenom : ''}`
                : 'Inconnu',
            score: c.score,
            note: c.decision,
            statut: c.statut,
        }));

        return { totalOffres, offresActives, totalCandidatures, candidaturesParMois, meilleursCandidats };
    }

    // ─── Mes Postes (OffreEmploi CRUD) ───────────────────────────────────────

    /** GET all offres (mes-offres) */
    async getMesOffres() {
        const offres = await this.offreRepo.find({
            order: { DatePublication: 'DESC' },
        });

        // Enrich with candidature count per offre
        const result = await Promise.all(
            offres.map(async (o) => {
                const count = await this.candidatureRepo.count({
                    where: { offre: { id: o.id } },
                });
                const now = new Date();
                const deadline = o.DateLimite ? new Date(o.DateLimite) : null;
                return {
                    id: o.id,
                    titre: o.TitreDePost,
                    description: o.Description,
                    categorie: o.Categorie,
                    datePublication: o.DatePublication,
                    dateLimite: o.DateLimite,
                    typeDeContact: o.TypeDeContrat,
                    modeDeTravail: o.ModeDeTravail,
                    salaire: o.Salaire,
                    localisation: o.Localisation,
                    experienceRequise: o.ExperienceRequise,
                    nbPost: o.NbPost,
                    candidatures: count,
                    status: deadline && deadline < now ? 'EXPIRÉE' : 'ACTIVE',
                    daysLeft: deadline
                        ? Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24)))
                        : null,
                };
            }),
        );
        return result;
    }

    /** POST create offre */
    async createOffre(dto: any) {
        const offre = this.offreRepo.create({
            TitreDePost: dto.titre,
            Description: dto.description,
            Categorie: dto.categorie,
            DateLimite: dto.dateLimite ? new Date(dto.dateLimite) : undefined,
            TypeDeContrat: dto.typeDeContact,
            ModeDeTravail: dto.modeDeTravail,
            Salaire: dto.salaire ? parseFloat(dto.salaire) : undefined,
            Localisation: dto.localisation,
            ExperienceRequise: dto.experienceRequise,
            NbPost: dto.nbPost ?? 1,
        });
        return await this.offreRepo.save(offre);
    }

    /** PUT update offre */
    async updateOffre(id: string, dto: any) {
        const offre = await this.offreRepo.findOneBy({ id });
        if (!offre) throw new NotFoundException(`Offre ${id} introuvable.`);

        Object.assign(offre, {
            TitreDePost: dto.titre ?? offre.TitreDePost,
            Description: dto.description ?? offre.Description,
            Categorie: dto.categorie ?? offre.Categorie,
            DateLimite: dto.dateLimite ? new Date(dto.dateLimite) : offre.DateLimite,
            TypeDeContrat: dto.typeDeContact ?? offre.TypeDeContrat,
            ModeDeTravail: dto.modeDeTravail ?? offre.ModeDeTravail,
            Salaire: dto.salaire !== undefined ? parseFloat(dto.salaire) : offre.Salaire,
            Localisation: dto.localisation ?? offre.Localisation,
            ExperienceRequise: dto.experienceRequise ?? offre.ExperienceRequise,
            NbPost: dto.nbPost ?? offre.NbPost,
        });

        return await this.offreRepo.save(offre);
    }

    /** DELETE offre */
    async deleteOffre(id: string) {
        const offre = await this.offreRepo.findOneBy({ id });
        if (!offre) throw new NotFoundException(`Offre ${id} introuvable.`);
        await this.offreRepo.remove(offre);
        return { message: 'Offre supprimée avec succès.' };
    }

    // ─── Candidats ────────────────────────────────────────────────────────────

    /** GET all candidats who applied to any offre (for the Candidats page) */
    async getAllCandidats() {
        const candidatures = await this.candidatureRepo.find({
            relations: ['candidat', 'offre'],
            order: { datePostulation: 'DESC' },
        });

        return candidatures.map((c) => ({
            id: c.id,
            candidatId: c.candidat?.id,
            name: c.candidat
                ? `${c.candidat.nom}${c.candidat.prenom ? ' ' + c.candidat.prenom : ''}`
                : 'Inconnu',
            email: c.candidat?.email,
            role: c.offre?.TitreDePost ?? 'Poste inconnu',
            score: c.score ?? 0,
            statut: c.statut,
            decision: c.decision,
            datePostulation: c.datePostulation,
            avatar: `https://i.pravatar.cc/150?u=${c.candidat?.id ?? 0}`,
            status: c.statut?.toUpperCase() ?? 'EN ATTENTE',
            statusClass: c.statut?.toLowerCase().includes('rejet') ? 'rejected'
                : c.statut?.toLowerCase().includes('accept') ? 'interview'
                    : c.statut?.toLowerCase().includes('attente') ? 'evaluated'
                        : 'new',
        }));
    }

    /** PATCH update candidature status (accept / reject) */
    async updateCandidatStatut(candidatureId: number, statut: string, decision?: string) {
        const candidature = await this.candidatureRepo.findOneBy({ id: candidatureId });
        if (!candidature) throw new NotFoundException(`Candidature ${candidatureId} introuvable.`);

        candidature.statut = statut;
        if (decision !== undefined) candidature.decision = decision;
        await this.candidatureRepo.save(candidature);
        return { message: 'Statut mis à jour.', statut };
    }
}
