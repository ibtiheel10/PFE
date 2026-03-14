import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';
import { Question, QuestionNiveau } from '../entities/question.entity';
import { AiService } from '../ai/ai.service';

@Injectable()
export class EntrepriseService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        private readonly aiService: AiService,
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

    async updateProfil(userId: number, dto: any) {
        const user = await this.userRepo.findOne({ where: { id: userId, role: 'Entreprise' } });
        if (!user) throw new NotFoundException('Profil entreprise introuvable.');

        if (dto.nom) user.nom = dto.nom;
        if (dto.email) user.email = dto.email;

        if (dto.currentPassword && dto.newPassword) {
            const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
            if (!isMatch) {
                throw new BadRequestException('Mot de passe actuel incorrect.');
            }
            user.password = await bcrypt.hash(dto.newPassword, 10);
        } else if (dto.newPassword && !dto.currentPassword) {
            throw new BadRequestException('Le mot de passe actuel est requis pour le modifier.');
        }

        await this.userRepo.save(user);

        return {
            message: 'Profil mis à jour avec succès.',
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
            }
        };
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
                    typeDeContrat: o.TypeDeContrat,
                    modeDeTravail: o.ModeDeTravail,
                    salaire: o.Salaire,
                    localisation: o.Localisation,
                    experienceRequise: o.ExperienceRequise,
                    nbPost: o.NbPost,
                    competences: o.competences,
                    icon: o.icon,
                    iconColor: o.iconColor,
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
            icon: dto.icon ?? offre.icon,
            iconColor: dto.iconColor ?? offre.iconColor,
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

    /** GET questions for a specific offre (Owner only) */
    async getQuestionsByOffre(offreId: string, userId: number) {
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);

        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à consulter ces questions.");
        }

        const questions = await this.questionRepo.find({
            where: { offre: { id: offreId } },
            order: { dateEvaluation: 'ASC' },
        });

        return questions;
    }

    // ─── Génération IA ────────────────────────────────────────────────────────

    /** POST generer-questions-ia */
    async genererQuestionsIA(offreId: string, userId: number, difficulte: QuestionNiveau = 'Moyen') {
        // 1. Check ownership
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
        }

        // 2. Prepare description context
        const safeDescription = offre.Description ? offre.Description.substring(0, 800) + (offre.Description.length > 800 ? '...' : '') : '';
        const context = `
Titre du poste: ${offre.TitreDePost}
Description: ${safeDescription}
Catégorie: ${offre.Categorie}
Expérience Requise: ${offre.ExperienceRequise || 'Non spécifié'}
Compétences: ${offre.competences || 'Non spécifié'}
        `.trim();

        // 3. Call AI Service
        const diffMap: Record<QuestionNiveau, 'facile' | 'moyen' | 'difficile'> = {
            Facile: 'facile',
            Moyen: 'moyen',
            Difficile: 'difficile'
        };

        const savedQuestions = await this.aiService.generateQuestions(
            context, 
            diffMap[difficulte] || 'moyen', 
            offre
        );

        return {
            message: 'Questions generees et sauvegardees avec succes.',
            count: savedQuestions.length,
            questions: savedQuestions
        };
    }

    /** POST regenerer-questions-ia */
    async regenererQuestionsIA(offreId: string, userId: number, difficulte: QuestionNiveau = 'Moyen', previousQuestions: string[] = []) {
        // 1. Check ownership
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
        }

        // 2. Prepare context
        const safeDescription = offre.Description ? offre.Description.substring(0, 800) + (offre.Description.length > 800 ? '...' : '') : '';
        const context = `
Titre du poste: ${offre.TitreDePost}
Description: ${safeDescription}
Catégorie: ${offre.Categorie}
Expérience Requise: ${offre.ExperienceRequise || 'Non spécifié'}
Compétences: ${offre.competences || 'Non spécifié'}
        `.trim();

        const diffMap: Record<QuestionNiveau, 'facile'|'moyen'|'difficile'> = {
            Facile: 'facile',
            Moyen: 'moyen',
            Difficile: 'difficile'
        };

        // 3. Generate new questions, avoiding previous ones
        const newAiQuestions = await this.aiService.regenerateQuestions(
            context,
            diffMap[difficulte],
            previousQuestions
        );

        // 4. (Optionnel) Delete existing questions for this offer if we want a fresh batch:
        await this.questionRepo.delete({ offre: { id: offreId } });

        // 5. Save new questions
        const questionsEntities = newAiQuestions.map(q => {
            return this.questionRepo.create({
                contenu: {
                    question: q.question,
                    options: q.options,
                },
                chronometre: 2,
                reponses: [q.correctAnswer],
                dateEvaluation: new Date(),
                niveauDifficulte: difficulte,
                isCorrectVerified: false,
                offre: { id: offre.id } as OffreEmploi,
            });
        });

        const savedQuestions = await this.questionRepo.save(questionsEntities);

        return {
            message: 'Questions regenerees et remplacees avec succes.',
            count: savedQuestions.length,
            questions: savedQuestions,
        };
    }

    /** POST recommandation-ia */
    async recommandationIA(offreId: string, userId: number, results: any[]) {
        // 1. Check ownership (or allow candidate? Let's assume this is for Entreprise review for now)
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);

        const safeDescription = offre.Description ? offre.Description.substring(0, 800) + (offre.Description.length > 800 ? '...' : '') : '';
        const context = `
Titre du poste: ${offre.TitreDePost}
Description: ${safeDescription}
Compétences: ${offre.competences || 'Non spécifié'}
        `.trim();

        return this.aiService.generateRecommendation(context, results);
    }

    /** PATCH verify correct answer for a question (recruiter manual review) */
    async verifierReponseQuestion(questionId: number, correctAnswer: string) {
        const question = await this.questionRepo.findOneBy({ id: questionId });
        if (!question) throw new NotFoundException(`Question ${questionId} introuvable.`);

        // Update correct answer and mark as verified
        question.reponses = [correctAnswer];
        question.isCorrectVerified = true;
        await this.questionRepo.save(question);
        return {
            message: 'Reponse correcte mise a jour et question verifiee.',
            questionId,
            correctAnswer,
            isCorrectVerified: true,
        };
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
