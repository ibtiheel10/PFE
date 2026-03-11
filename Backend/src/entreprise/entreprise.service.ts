import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

    async getDashboard(userId: number) {
        // Only count offers from the connected entreprise
        const totalOffres = await this.offreRepo.count({
            where: { entreprise: { id: userId } },
        });

        const today = new Date();
        const offresActives = await this.offreRepo
            .createQueryBuilder('o')
            .leftJoin('o.entreprise', 'ent')
            .where('ent.id = :userId', { userId })
            .andWhere('(o."DateLimite" IS NULL OR o."DateLimite" >= :today)', { today })
            .getCount();

        // Only count candidatures for this entreprise's offers
        const totalCandidatures = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .where('ent.id = :userId', { userId })
            .getCount();

        const sevenMonthsAgo = new Date();
        sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 6);
        sevenMonthsAgo.setDate(1);

        const rawParMois = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .select(`TO_CHAR(c."datePostulation", 'Mon YY')`, 'mois')
            .addSelect('COUNT(*)', 'count')
            .where('ent.id = :userId', { userId })
            .andWhere('c."datePostulation" >= :from', { from: sevenMonthsAgo })
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
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .where('ent.id = :userId', { userId })
            .andWhere('c.score IS NOT NULL')
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
    async getMesOffres(userId: number) {
        const offres = await this.offreRepo.find({
            where: { entreprise: { id: userId } }, // Filter by the entreprise that created them
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
            TypeDeContrat: dto.typeDeContrat,
            ModeDeTravail: dto.modeDeTravail,
            Salaire: dto.salaire ? parseFloat(dto.salaire) : undefined,
            Localisation: dto.localisation,
            ExperienceRequise: dto.experienceRequise,
            NbPost: dto.nbPost ?? 1,
            competences: dto.competences,
            icon: dto.icon,
            iconColor: dto.iconColor,
            entreprise: dto.userId ? { id: dto.userId } : undefined,
        } as any);
        return await this.offreRepo.save(offre);
    }

    /** PUT update offre (Owner only) */
    async updateOffre(id: string, userId: number, dto: any) {
        const offre = await this.offreRepo.findOne({
            where: { id },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${id} introuvable.`);

        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
        }

        Object.assign(offre, {
            TitreDePost: dto.titre ?? offre.TitreDePost,
            Description: dto.description ?? offre.Description,
            Categorie: dto.categorie ?? offre.Categorie,
            DateLimite: dto.dateLimite ? new Date(dto.dateLimite) : offre.DateLimite,
            TypeDeContrat: dto.typeDeContrat ?? offre.TypeDeContrat,
            ModeDeTravail: dto.modeDeTravail ?? offre.ModeDeTravail,
            Salaire: dto.salaire !== undefined ? parseFloat(dto.salaire) : offre.Salaire,
            Localisation: dto.localisation ?? offre.Localisation,
            ExperienceRequise: dto.experienceRequise ?? offre.ExperienceRequise,
            NbPost: dto.nbPost ?? offre.NbPost,
            competences: dto.competences ?? offre.competences,
        });

        return await this.offreRepo.save(offre);
    }

    /** DELETE offre (Owner only) */
    async deleteOffre(id: string, userId: number) {
        const offre = await this.offreRepo.findOne({
            where: { id },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${id} introuvable.`);

        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cette offre.");
        }

        await this.offreRepo.remove(offre);
        return { message: 'Offre supprimée avec succès.' };
    }

    // ─── Candidats ────────────────────────────────────────────────────────────

    /** GET all candidats who applied to this entreprise's offres */
    async getAllCandidats(userId: number) {
        const candidatures = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.candidat', 'candidat')
            .leftJoinAndSelect('c.offre', 'offre')
            .leftJoin('offre.entreprise', 'ent')
            .where('ent.id = :userId', { userId })
            .orderBy('c.datePostulation', 'DESC')
            .getMany();

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
