import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
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
        private readonly configService: ConfigService,
    ) { }

    private async sendQcmAvailableEmail(email: string, candidateName: string, offreTitle: string) {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });
        const html = `
          <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto;">
            <h2 style="color: #4f46e5;">SkillVia — QCM Disponible !</h2>
            <p>Bonjour <strong>${candidateName}</strong>,</p>
            <p>Le questionnaire QCM pour le poste <strong>"${offreTitle}"</strong> est désormais disponible.</p>
            <p>Connectez-vous à votre espace candidat pour passer l'évaluation dès maintenant.</p>
            <a href="http://localhost:5173/candidat/evaluations"
               style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:bold;">
              Accéder à mon évaluation
            </a>
            <p style="color:#888;font-size:12px;margin-top:24px;">Si vous n'attendiez pas cet email, ignorez-le.</p>
          </div>
        `;
        try {
            await transporter.sendMail({
                from: `"SkillVia" <${this.configService.get('SMTP_FROM')}>`,
                to: email,
                subject: `[SkillVia] Le QCM pour "${offreTitle}" est disponible`,
                html,
            });
        } catch (err) {
            console.error('[EntrepriseService] Failed to send QCM email to', email, err);
        }
    }

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
            period: r.mois,
            count: parseInt(r.count, 10),
        }));

        // Fetch data for 3 Months (by week or month)
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2); // 3 months including current
        threeMonthsAgo.setDate(1);

        const raw3Months = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .select(`TO_CHAR(c."datePostulation", 'Mon YY')`, 'mois')
            .addSelect('COUNT(*)', 'count')
            .where('ent.id = :userId', { userId })
            .andWhere('c."datePostulation" >= :from', { from: threeMonthsAgo })
            .groupBy(`DATE_TRUNC('month', c."datePostulation")`)
            .addGroupBy(`TO_CHAR(c."datePostulation", 'Mon YY')`)
            .orderBy(`DATE_TRUNC('month', c."datePostulation")`, 'ASC')
            .getRawMany();

        const candidaturesLast3Months = raw3Months.map((r) => ({
            period: r.mois,
            count: parseInt(r.count, 10),
        }));

        // Fetch data for 30 days (by week/day chunks)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

        // Group by 5-day intervals or just return daily and group in frontend, 
        // Let's do daily but only return points that have data, or pad.
        // For simplicity, we'll return daily aggregated data
        const raw30Days = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .select(`TO_CHAR(c."datePostulation", 'DD Mon')`, 'jour')
            .addSelect('COUNT(*)', 'count')
            .addSelect(`DATE_TRUNC('day', c."datePostulation")`, 'date_val')
            .where('ent.id = :userId', { userId })
            .andWhere('c."datePostulation" >= :from', { from: thirtyDaysAgo })
            .groupBy(`DATE_TRUNC('day', c."datePostulation")`)
            .addGroupBy(`TO_CHAR(c."datePostulation", 'DD Mon')`)
            .orderBy(`DATE_TRUNC('day', c."datePostulation")`, 'ASC')
            .getRawMany();

        const candidaturesLast30Days = raw30Days.map((r) => ({
            period: r.jour,
            count: parseInt(r.count, 10),
        }));

        // Fetch data for 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

        const raw7Days = await this.candidatureRepo
            .createQueryBuilder('c')
            .leftJoin('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .select(`TO_CHAR(c."datePostulation", 'Dy DD')`, 'jour')
            .addSelect('COUNT(*)', 'count')
            .addSelect(`DATE_TRUNC('day', c."datePostulation")`, 'date_val')
            .where('ent.id = :userId', { userId })
            .andWhere('c."datePostulation" >= :from', { from: sevenDaysAgo })
            .groupBy(`DATE_TRUNC('day', c."datePostulation")`)
            .addGroupBy(`TO_CHAR(c."datePostulation", 'Dy DD')`)
            .orderBy(`DATE_TRUNC('day', c."datePostulation")`, 'ASC')
            .getRawMany();

        const candidaturesLast7Days = raw7Days.map((r) => ({
            period: r.jour,
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

        return {
            totalOffres,
            offresActives,
            totalCandidatures,
            candidaturesParMois,
            candidaturesLast3Months,
            candidaturesLast30Days,
            candidaturesLast7Days,
            meilleursCandidats
        };
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
                const qcmPassesCount = await this.candidatureRepo.count({
                    where: { offre: { id: o.id }, score: require('typeorm').Not(require('typeorm').IsNull()) },
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
                    qcmPasses: qcmPassesCount,
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
            order: { createdAt: 'ASC' },
        });

        return {
            questions: this.mapQuestionsResponse(questions),
            qcmPublie: !!offre.qcmPublie
        };
    }

    /** DELETE a specific question (Owner only) */
    async deleteQuestion(id: number, userId: number) {
        const question = await this.questionRepo.findOne({
            where: { id },
            relations: ['offre', 'offre.entreprise'],
        });
        if (!question) throw new NotFoundException(`Question ${id} introuvable.`);

        if (question.offre?.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à supprimer cette question.");
        }

        await this.questionRepo.remove(question);
        return { message: 'Question supprimée avec succès.' };
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

        // 2. Prepare simple topic for the strict prompt
        const topic = `${offre.TitreDePost} (Compétences: ${offre.competences || 'Générales'})`;

        // 3. Call AI Service with the robust text generator (does NOT save since we pass offre = null)
        const robustQuestions = await this.aiService.generateQuestions(topic, 'moyen', null, offre.competences || '');

        // 4. Normalize the output for the frontend
        const normalizedQuestions = robustQuestions.map(q => ({
            question: q.question,
            options: q.options, // already normalized to { text, isCorrect } in ai.service.ts
            correctAnswer: q.options.find(o => o.isCorrect)?.text || '',
            chronometre: 30, // default
            niveauDifficulte: difficulte
        }));

        return {
            message: 'Questions générées avec succès (non sauvegardées).',
            totalQuestions: normalizedQuestions.length,
            offre: {
                id: offre.id,
                TitreDePost: offre.TitreDePost
            },
            questions: normalizedQuestions
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

        // 2. Prepare simple topic
        const topic = `${offre.TitreDePost} (Compétences: ${offre.competences || 'Générales'})`;

        // 3. Generate new questions, avoiding previous ones (does NOT save)
        const robustQuestions = await this.aiService.regenerateQuestions(
            topic,
            'moyen',
            previousQuestions,
            offre.competences || ''
        );

        // 4. Normalize the output
        const normalizedQuestions = robustQuestions.map(q => ({
            question: q.question,
            options: q.options, // already {text, isCorrect}[]
            correctAnswer: q.options.find(o => o.isCorrect)?.text || '',
            chronometre: 30, // default
            niveauDifficulte: difficulte
        }));

        return {
            message: 'Questions régénérées avec succès (non sauvegardées).',
            totalQuestions: normalizedQuestions.length,
            offre: {
                id: offre.id,
                TitreDePost: offre.TitreDePost
            },
            questions: normalizedQuestions,
        };
    }

    /** POST sauvegarder-questions-ia */
    async sauvegarderQuestionsIA(offreId: string, userId: number, questions: any[], difficulte: QuestionNiveau = 'Moyen') {
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
        }

        // Delete old questions
        await this.questionRepo.delete({ offre: { id: offreId } });

        // Save new questions
        const questionsEntities = questions.map(q => {
            // Normalize options to always be {text, isCorrect} objects
            let normalizedOptions: { text: string; isCorrect: boolean }[] = [];
            const correctAnswerText: string = (q.correctAnswer || '').trim();

            if (Array.isArray(q.options)) {
                normalizedOptions = q.options.map((opt: any) => {
                    if (typeof opt === 'string') {
                        const text = opt.replace(/^[A-Da-d][).:\s]+/, '').trim();
                        return {
                            text,
                            isCorrect: correctAnswerText.length > 0 &&
                                (text.toLowerCase() === correctAnswerText.toLowerCase() ||
                                    correctAnswerText.toLowerCase().includes(text.toLowerCase().substring(0, 10))),
                        };
                    } else {
                        return {
                            text: (opt.text || '').replace(/^[A-Da-d][).:\s]+/, '').trim(),
                            isCorrect: opt.isCorrect === true,
                        };
                    }
                });
            }

            // If no option is marked correct, try to find it by correctAnswer text
            const hasCorrect = normalizedOptions.some(o => o.isCorrect);
            if (!hasCorrect && correctAnswerText) {
                // Mark the first option whose text contains the correctAnswer as correct
                for (const opt of normalizedOptions) {
                    if (opt.text.toLowerCase().includes(correctAnswerText.toLowerCase().substring(0, 15)) ||
                        correctAnswerText.toLowerCase().includes(opt.text.toLowerCase().substring(0, 15))) {
                        opt.isCorrect = true;
                        break;
                    }
                }
            }

            return this.questionRepo.create({
                contenu: {
                    question: q.question,
                    options: normalizedOptions,
                    correctAnswer: correctAnswerText,
                },
                chronometre: q.chronometre || 30,
                niveauDifficulte: difficulte,
                isCorrectVerified: false,
                offre: { id: offre.id } as OffreEmploi,
            });
        });

        const savedQuestions = await this.questionRepo.save(questionsEntities);

        // Notify all candidates for this offer that the QCM is now available
        const candidatures = await this.candidatureRepo.find({
            where: { offre: { id: offreId } },
            relations: ['candidat'],
        });

        for (const cand of candidatures) {
            // Only unlock if not yet done (score null = not yet passed)
            if (!cand.qcmDisponible && cand.score === null) {
                cand.qcmDisponible = true;
                await this.candidatureRepo.save(cand);

                if (cand.candidat?.email) {
                    const name = [cand.candidat.prenom, cand.candidat.nom].filter(Boolean).join(' ') || 'Candidat';
                    await this.sendQcmAvailableEmail(cand.candidat.email, name, offre.TitreDePost);
                }
            }
        }

        return {
            message: 'Questions sauvegardées avec succès.',
            totalQuestions: savedQuestions.length,
            questions: this.mapQuestionsResponse(savedQuestions)
        };
    }

    /** POST publier-qcm */
    async publierQCM(offreId: string, userId: number) {
        const offre = await this.offreRepo.findOne({
            where: { id: offreId },
            relations: ['entreprise'],
        });
        if (!offre) throw new NotFoundException(`Offre ${offreId} introuvable.`);
        if (offre.entreprise?.id !== userId) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à publier le QCM de cette offre.");
        }

        // Check questions exist
        const count = await this.questionRepo.count({ where: { offre: { id: offreId } } });
        if (count === 0) throw new BadRequestException('Aucune question QCM pour cette offre. Veuillez générer et sauvegarder le QCM d\'abord.');

        const candidatures = await this.candidatureRepo.find({
            where: { offre: { id: offreId } },
            relations: ['candidat'],
        });

        let notified = 0;
        for (const cand of candidatures) {
            if (!cand.qcmDisponible && cand.score === null) {
                cand.qcmDisponible = true;
                await this.candidatureRepo.save(cand);

                if (cand.candidat?.email) {
                    const name = [cand.candidat.prenom, cand.candidat.nom].filter(Boolean).join(' ') || 'Candidat';
                    await this.sendQcmAvailableEmail(cand.candidat.email, name, offre.TitreDePost);
                }
                notified++;
            }
        }

        // Mark the offer as published
        offre.qcmPublie = true;
        await this.offreRepo.save(offre);

        return { message: `QCM publié. ${notified} candidat(s) notifié(s).`, notified };
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

        // Update correct answer and mark as verified inside jsonb content
        if (question.contenu && question.contenu.options) {
            question.contenu.options = question.contenu.options.map(opt => ({
                ...opt,
                isCorrect: opt.text === correctAnswer
            }));
        }
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

    private mapQuestionsResponse(questions: Question[]) {
        return questions.map(q => ({
            id: q.id,
            question: q.contenu?.question ?? '',
            options: (q.contenu?.options ?? []).map((opt: any) => ({
                text: typeof opt === 'string' ? opt : (opt.text ?? ''),
                isCorrect: typeof opt === 'object' && opt !== null ? !!opt.isCorrect : false,
            })),
            chronometre: q.chronometre,
            niveauDifficulte: q.niveauDifficulte,
            isCorrectVerified: q.isCorrectVerified,
            createdAt: q.createdAt
        }));
    }
}
