import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';
import { Question } from '../entities/question.entity';
import { ReponseCandidat } from '../entities/reponse-candidat.entity';
import { AiService } from '../ai/ai.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EntrepriseService {
    private readonly logger = new Logger(EntrepriseService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(ReponseCandidat)
        private readonly reponseRepo: Repository<ReponseCandidat>,
        private readonly aiService: AiService,
        private readonly configService: ConfigService,
        private readonly notificationsService: NotificationsService,
    ) { }

    /** Helper: fetch an offre by UUID with optional relations, throws NotFoundException if not found */
    private async findOffreOrFail(offreId: string, relations: string[] = []): Promise<OffreEmploi> {
        // Strip out any non-UUID characters to prevent weird path parsing issues or hidden characters
        const cleanId = String(offreId || '').replace(/[^a-fA-F0-9-]/g, '');
        this.logger.log(`findOffreOrFail: looking for offre id="${cleanId}"`);
        const offre = await this.offreRepo.findOne({
            where: { id: cleanId },
            relations,
        });
        if (!offre) {
            this.logger.warn(`Offre "${cleanId}" NOT FOUND in DB`);
            throw new NotFoundException(`Offre ${cleanId} introuvable.`);
        }
        return offre;
    }

    /** Helper: assert that the given userId owns the offre */
    private assertOwner(offre: OffreEmploi, userId: number): void {
        if (Number(offre.entreprise?.id) !== Number(userId)) {
            throw new ForbiddenException("Vous n'êtes pas autorisé à modifier cette offre.");
        }
    }

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
            select: ['id', 'nom', 'email', 'secteur', 'avatar'],
        });
        if (!user) throw new NotFoundException('Profil entreprise introuvable.');
        return user;
    }

    async updateAvatarUrl(userId: number, avatarUrl: string): Promise<void> {
        await this.userRepo.update({ id: userId }, { avatar: avatarUrl });
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
            .leftJoinAndSelect('c.offre', 'o')
            .leftJoin('o.entreprise', 'ent')
            .where('ent.id = :userId', { userId })
            .andWhere('c.score IS NOT NULL')
            .orderBy('c.score', 'DESC')
            .limit(5)
            .getMany();

        const meilleursCandidats = topCandidats.map((c) => {
            const score = c.score;
            const seuil = c.offre?.seuilMinimal ?? 50;
            let statut: string;
            if (c.statut === 'Entretien') {
                statut = 'Entretien';
            } else if (score === null || score === undefined) {
                statut = 'En attente';
            } else if (score >= seuil) {
                statut = 'Accepté';
            } else {
                statut = 'Refusé';
            }
            return {
                candidatId: c.candidat?.id ?? 0,
                name: c.candidat
                    ? `${c.candidat.nom}${c.candidat.prenom ? ' ' + c.candidat.prenom : ''}`
                    : 'Inconnu',
                score,
                role: c.offre?.TitreDePost ?? 'Poste inconnu',
                statut,
                email: c.candidat?.email,
                avatar: c.candidat?.avatar || null, // Add avatar
            };
        });

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
                    dateLancementQcm: o.dateLancementQcm,
                    typeDeContrat: o.TypeDeContrat,
                    modeDeTravail: o.ModeDeTravail,
                    salaire: o.Salaire,
                    localisation: o.Localisation,
                    experienceRequise: o.ExperienceRequise,
                    nbPost: o.NbPost,
                    seuilMinimal: o.seuilMinimal ?? 50,
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
            dateLancementQcm: dto.dateLancementQcm ? new Date(dto.dateLancementQcm) : undefined,
            TypeDeContrat: dto.typeDeContrat,
            ModeDeTravail: dto.modeDeTravail,
            Salaire: dto.salaire ? parseFloat(dto.salaire) : undefined,
            Localisation: dto.localisation,
            ExperienceRequise: dto.experienceRequise,
            NbPost: dto.nbPost ?? 1,
            competences: dto.competences,
            icon: dto.icon,
            iconColor: dto.iconColor,
            seuilMinimal: dto.seuilMinimal ?? 50,
            entreprise: dto.userId ? { id: dto.userId } : undefined,
        } as any);
        return await this.offreRepo.save(offre);
    }

    /** PUT update offre (Owner only) */
    async updateOffre(id: string, userId: number, dto: any) {
        const offre = await this.findOffreOrFail(id, ['entreprise']);
        this.assertOwner(offre, userId);

        Object.assign(offre, {
            TitreDePost: dto.titre ?? offre.TitreDePost,
            Description: dto.description ?? offre.Description,
            Categorie: dto.categorie ?? offre.Categorie,
            DateLimite: dto.dateLimite ? new Date(dto.dateLimite) : offre.DateLimite,
            dateLancementQcm: dto.dateLancementQcm ? new Date(dto.dateLancementQcm) : offre.dateLancementQcm,
            TypeDeContrat: dto.typeDeContrat ?? offre.TypeDeContrat,
            ModeDeTravail: dto.modeDeTravail ?? offre.ModeDeTravail,
            Salaire: dto.salaire !== undefined ? parseFloat(dto.salaire) : offre.Salaire,
            Localisation: dto.localisation ?? offre.Localisation,
            ExperienceRequise: dto.experienceRequise ?? offre.ExperienceRequise,
            NbPost: dto.nbPost ?? offre.NbPost,
            competences: dto.competences ?? offre.competences,
            icon: dto.icon ?? offre.icon,
            iconColor: dto.iconColor ?? offre.iconColor,
            seuilMinimal: dto.seuilMinimal ?? offre.seuilMinimal,
        });

        return await this.offreRepo.save(offre);
    }

    /** DELETE offre (Owner only) */
    async deleteOffre(id: string, userId: number) {
        const offre = await this.findOffreOrFail(id, ['entreprise']);
        this.assertOwner(offre, userId);

        await this.offreRepo.remove(offre);
        return { message: 'Offre supprimée avec succès.' };
    }

    /** GET questions for a specific offre (Owner only) */
    async getQuestionsByOffre(offreId: string, userId: number) {
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

        const questions = await this.questionRepo.find({
            where: { offre: { id: offre.id } },
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
    async genererQuestionsIA(offreId: string, userId: number) {
        // 1. Check ownership
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

        if (offre.qcmPublie) {
            throw new BadRequestException("Ce QCM a déjà été publié. Il n'est plus possible de le regénérer entièrement.");
        }
        
        // Remove old questions if not published to avoid piling up duplicates
        const existingCount = await this.questionRepo.count({ where: { offre: { id: offreId } }});
        if (existingCount > 0) {
            await this.questionRepo.delete({ offre: { id: offreId }});
        }

        // 2. Build job description
        const jobDescription = [
            `Titre du poste: ${offre.TitreDePost}`,
            offre.Categorie ? `Categorie: ${offre.Categorie}` : '',
            offre.Description ? `Description: ${offre.Description.substring(0, 400)}` : '',
            offre.ExperienceRequise ? `Experience: ${offre.ExperienceRequise}` : '',
        ].filter(Boolean).join('\n');

        // 3. Generate questions — always returns 5 (with fallback if AI fails)
        const aiQuestions = await this.aiService.generateQuestions(
            jobDescription,
            null, // do not persist yet — recruiter must validate first
            offre.competences || ''
        );

        // 4. Normalize for frontend — handle both QuizQuestion and Question entity formats
        const normalizedQuestions = aiQuestions.map((q: any) => {
            const questionText = q.contenu?.question ?? q.question ?? '';
            const opts: any[] = q.contenu?.options ?? q.options ?? [];
            const normalizedOpts = opts.map((o: any) => ({
                text: typeof o === 'string' ? o : (o.text ?? ''),
                isCorrect: typeof o === 'object' ? !!o.isCorrect : false,
            }));
            return {
                question: questionText,
                options: normalizedOpts,
                category: q.category || q.contenu?.category || 'Compétence Technique',
                correctAnswer: normalizedOpts.find((o: any) => o.isCorrect)?.text || '',
                chronometre: q.chronometre ?? 30,
            };
        });

        return {
            message: 'Questions générées avec succès (non sauvegardées).',
            totalQuestions: normalizedQuestions.length,
            offre: { id: offre.id, TitreDePost: offre.TitreDePost },
            questions: normalizedQuestions,
        };
    }

    /** POST regenerer-questions-ia */
    async regenererQuestionsIA(offreId: string, userId: number, previousQuestions: string[] = []) {
        // 1. Check ownership
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

        if (offre.qcmPublie) {
            throw new BadRequestException("Ce QCM a déjà été publié. Impossible de le regénérer.");
        }

        // 2. Build description
        const jobDescription = [
            `Titre du poste: ${offre.TitreDePost}`,
            offre.Description ? offre.Description.substring(0, 400) : '',
        ].filter(Boolean).join('\n');

        // 3. Generate new questions — always returns 5 (with fallback if needed)
        const aiQuestions = await this.aiService.regenerateQuestions(
            jobDescription,
            previousQuestions,
            offre.competences || ''
        );

        // 4. Normalize for frontend
        const normalizedQuestions = aiQuestions.map((q: any) => {
            const questionText = q.contenu?.question ?? q.question ?? '';
            const opts: any[] = q.contenu?.options ?? q.options ?? [];
            const normalizedOpts = opts.map((o: any) => ({
                text: typeof o === 'string' ? o : (o.text ?? ''),
                isCorrect: typeof o === 'object' ? !!o.isCorrect : false,
            }));
            return {
                question: questionText,
                options: normalizedOpts,
                category: q.category || q.contenu?.category || 'Compétence Technique',
                correctAnswer: normalizedOpts.find((o: any) => o.isCorrect)?.text || '',
                chronometre: q.chronometre ?? 30,
            };
        });

        return {
            message: 'Questions régénérées avec succès (non sauvegardées).',
            totalQuestions: normalizedQuestions.length,
            offre: { id: offre.id, TitreDePost: offre.TitreDePost },
            questions: normalizedQuestions,
        };
    }


    /** POST sauvegarder-questions-ia */
    async sauvegarderQuestionsIA(offreId: string, userId: number, questions: any[]) {
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

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
                    category: q.category || 'Compétence Technique',
                },
                chronometre: q.chronometre || 30,
                isCorrectVerified: false,
                offre: { id: offre.id } as OffreEmploi,
            });
        });

        // Implement Retry logic for DB Save to avoid timeouts due to connection pool issues
        let savedQuestions: any[] = [];
        let attempt = 0;
        const MAX_RETRIES = 3;

        while (attempt < MAX_RETRIES) {
            try {
                this.logger.log(`[EntrepriseService] Saving ${questionsEntities.length} questions to DB (Attempt ${attempt + 1}/${MAX_RETRIES})`);
                savedQuestions = await this.questionRepo.save(questionsEntities);
                break; // Save successful
            } catch (dbError: any) {
                attempt++;
                this.logger.error(`[EntrepriseService] DB Save Error on attempt ${attempt}: ${dbError.message}`);
                if (attempt >= MAX_RETRIES) {
                    throw new BadRequestException('La sauvegarde en base a échoué suite à une surcharge du serveur. Veuillez réessayer (Détail: ' + dbError.message + ')');
                }
                // Attente courte avant retry
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        // (L'envoi des emails a été retiré d'ici car ce n'est pas le rôle de "sauvegarder". Cela appartient à "publierQCM")

        return {
            message: 'Questions sauvegardées avec succès.',
            totalQuestions: savedQuestions.length,
            questions: this.mapQuestionsResponse(savedQuestions)
        };
    }

    /** POST publier-qcm */
    async publierQCM(offreId: string, userId: number) {
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

        // Check questions exist
        const count = await this.questionRepo.count({ where: { offre: { id: offreId } } });
        if (count === 0) throw new BadRequestException('Aucune question QCM pour cette offre. Veuillez générer et sauvegarder le QCM d\'abord.');

        const candidatures = await this.candidatureRepo.find({
            where: { offre: { id: offreId } },
            relations: ['candidat'],
        });

        let notified = 0;
        
        await Promise.all(candidatures.map(async (cand) => {
            if (!cand.qcmDisponible && cand.score === null) {
                cand.qcmDisponible = true;
                await this.candidatureRepo.save(cand);

                if (cand.candidat?.email) {
                    const name = [cand.candidat.prenom, cand.candidat.nom].filter(Boolean).join(' ') || 'Candidat';
                    // send email async without blocking others
                    this.sendQcmAvailableEmail(cand.candidat.email, name, offre.TitreDePost).catch(err => {
                        this.logger.error(`Erreur email QCM pour ${cand.candidat.email}: ${err.message}`);
                    });
                }
                notified++;
            }
        }));

        // Mark the offer as published
        offre.qcmPublie = true;
        await this.offreRepo.save(offre);

        return { message: `QCM publié. ${notified} candidat(s) notifié(s).`, notified };
    }

    /** POST recommandation-ia */
    async recommandationIA(offreId: string, userId: number, results: any[]) {
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);

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

        return candidatures.map((c) => {
            const score = c.score; // keep null as null
            const seuil = c.offre?.seuilMinimal ?? 50;
            // Compute display status based on score (unless manually set to Entretien)
            let displayStatut: string;
            if (c.statut === 'Entretien') {
                displayStatut = 'Entretien';
            } else if (score === null || score === undefined) {
                displayStatut = 'En attente'; // not evaluated yet
            } else if (score >= seuil) {
                displayStatut = 'Accepté';
            } else {
                displayStatut = 'Refusé'; // includes score = 0
            }

            return {
                id: c.id,
                candidatId: c.candidat?.id,
                name: c.candidat
                    ? `${c.candidat.nom}${c.candidat.prenom ? ' ' + c.candidat.prenom : ''}`
                    : 'Inconnu',
                email: c.candidat?.email,
                role: c.offre?.TitreDePost ?? 'Poste inconnu',
                score: score ?? null, // keep null, don't default to 0
                statut: displayStatut,
                decision: c.decision,
                datePostulation: c.datePostulation,
                avatar: c.candidat?.avatar || null, // Use real avatar if exists, otherwise null
            };
        });
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

    /** DELETE candidature (entreprise owner only) */
    async deleteCandidature(candidatureId: number, userId: number) {
        const candidature = await this.candidatureRepo.findOne({
            where: { id: candidatureId },
            relations: ['offre', 'offre.entreprise'],
        });
        if (!candidature) throw new NotFoundException(`Candidature ${candidatureId} introuvable.`);
        if (Number(candidature.offre?.entreprise?.id) !== Number(userId))
            throw new ForbiddenException('Vous n\'êtes pas autorisé à supprimer cette candidature.');
        await this.candidatureRepo.remove(candidature);
        return { message: 'Candidature supprimée avec succès.' };
    }

    /** POST contact-candidat — send interview invitation email + notification */
    async contactCandidat(candidatEmail: string, subject: string, message: string, userId: number, candidatureId?: number) {
        const entreprise = await this.userRepo.findOneBy({ id: userId });
        if (!entreprise) throw new NotFoundException('Entreprise introuvable.');

        // Find the candidat by email to create a notification
        const candidat = await this.userRepo.findOneBy({ email: candidatEmail });

        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>('SMTP_HOST'),
            port: this.configService.get<number>('SMTP_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('SMTP_USER'),
                pass: this.configService.get<string>('SMTP_PASS'),
            },
        });

        const senderName = entreprise.nom || entreprise.email;

        // Send email
        await transporter.sendMail({
            from: `"${senderName} via Skillvia" <${this.configService.get<string>('SMTP_FROM')}>`,
            to: candidatEmail,
            subject,
            html: `
                <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
                    <div style="background:linear-gradient(135deg,#1e40af,#1e3a8a);padding:28px 32px;">
                        <h1 style="color:#fff;font-size:20px;margin:0;font-weight:800;">Skillvia</h1>
                        <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:4px 0 0;">Plateforme de recrutement par compétences</p>
                    </div>
                    <div style="padding:32px;">
                        <h2 style="font-size:18px;font-weight:700;color:#0f172a;margin:0 0 16px;">${subject}</h2>
                        <div style="font-size:14px;color:#475569;line-height:1.7;white-space:pre-line;">${message}</div>
                    </div>
                    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;">
                        Ce message vous a été envoyé via la plateforme Skillvia par ${senderName}.
                    </div>
                </div>
            `,
        });

        // Create in-app notification + auto-update candidature status
        if (candidat) {
            await this.notificationsService.createForUser(
                candidat.id,
                `Message de ${senderName}`,
                message.length > 200 ? message.substring(0, 200) + '...' : message,
                'MESSAGE_ENTREPRISE',
            );

            // Find the specific candidature by id if provided, otherwise fall back to latest
            let candidature: Candidature | null = null;
            if (candidatureId) {
                candidature = await this.candidatureRepo.findOne({
                    where: { id: candidatureId, candidat: { id: candidat.id } },
                    relations: ['candidat', 'offre', 'offre.entreprise'],
                });
            }
            if (!candidature) {
                candidature = await this.candidatureRepo.findOne({
                    where: { candidat: { id: candidat.id }, offre: { entreprise: { id: userId } } },
                    relations: ['candidat', 'offre', 'offre.entreprise'],
                    order: { datePostulation: 'DESC' },
                });
            }

            // Only promote to 'Entretien' if current status is 'Accepté'
            if (candidature && candidature.statut === 'Accepté') {
                candidature.statut = 'Entretien';
                await this.candidatureRepo.save(candidature);
            }
        }

        return { message: 'Email et notification envoyés avec succès.' };
    }

    private mapQuestionsResponse(questions: Question[]) {
        return questions.map(q => ({
            id: q.id,
            question: q.contenu?.question ?? '',
            options: (q.contenu?.options ?? []).map((opt: any) => ({
                text: typeof opt === 'string' ? opt : (opt.text ?? ''),
                isCorrect: typeof opt === 'object' && opt !== null ? !!opt.isCorrect : false,
            })),
            difficulty: q.contenu?.difficulty ?? 'Intermédiaire',
            category: q.contenu?.category ?? 'Spécialisation',
            chronometre: q.chronometre,
            isCorrectVerified: q.isCorrectVerified,
            createdAt: q.createdAt
        }));
    }

    /** GET analytics-qcm */
    async getQcmAnalytics(offreId: string, userId: number) {
        const offre = await this.findOffreOrFail(offreId, ['entreprise']);
        this.assertOwner(offre, userId);

        const questions = await this.questionRepo.find({
            where: { offre: { id: offre.id } }
        });

        const analytics = await Promise.all(questions.map(async (q) => {
            const reponses = await this.reponseRepo.find({
                where: { question: { id: q.id } }
            });
            const totalReponses = reponses.length;
            const bonnesReponses = reponses.filter(r => r.est_correct).length;
            const tauxReussite = totalReponses > 0 ? (bonnesReponses / totalReponses) * 100 : 0;
            
            return {
                questionId: q.id,
                texteQuestion: q.contenu?.question || '',
                difficulte: q.contenu?.difficulty || 'Intermédiaire',
                categorie: q.contenu?.category || 'Compétence Technique',
                totalReponses,
                bonnesReponses,
                tauxReussite: Math.round(tauxReussite)
            };
        }));
        
        return {
            offreId: offre.id,
            titre: offre.TitreDePost,
            analytics
        };
    }
}
