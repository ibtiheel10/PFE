import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidature } from '../entities/candidature.entity';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Question } from '../entities/question.entity';
import { ReponseCandidat } from '../entities/reponse-candidat.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CandidaturesService {
    private readonly logger = new Logger(CandidaturesService.name);
    constructor(
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(ReponseCandidat)
        private readonly reponseCandidatRepo: Repository<ReponseCandidat>,
        private readonly notificationsService: NotificationsService,
        private readonly aiService: AiService,
    ) { }

    // ─── GET /api/candidatures/:id/evaluation ─────────────────────────────────
    async getEvaluationQuestions(candidatureId: number, userId: number) {
        const candidature = await this.candidatureRepo.findOne({
            where: { id: candidatureId },
            relations: ['candidat', 'offre'],
        });
        if (!candidature) throw new NotFoundException(`Candidature introuvable.`);
        if (Number(candidature.candidat.id) !== Number(userId)) throw new ConflictException('Accès refusé.');
        if (candidature.offre.dateLancementQcm) {
            const now = new Date();
            const launchDate = new Date(candidature.offre.dateLancementQcm);
            if (now < launchDate) {
                throw new ConflictException(`Le QCM ne sera disponible qu'à partir du ${launchDate.toLocaleString()}.`);
            }

            const expirationDate = new Date(launchDate.getTime() + 1 * 60000);
            if (now > expirationDate) {
                throw new ConflictException(`Le délai pour commencer ce QCM est dépassé (expiration après 1 minute).`);
            }
        }

        if (candidature.score !== null) throw new ConflictException('Vous avez déjà passé cette évaluation.');

        const questions = await this.questionRepo.find({
            where: { offre: { id: candidature.offre.id } },
            order: { createdAt: 'ASC' },
        });

        return {
            candidatureId: candidature.id,
            offreTitle: candidature.offre.TitreDePost,
            // La durée totale du QCM est fixée strictement à 3 minutes (180 secondes)
            totalDurationSeconds: 180,
            questions: questions.map(q => ({
                id: q.id,
                text: q.contenu?.question ?? '',
                options: (q.contenu?.options ?? []).map((opt: any) => ({
                    text: typeof opt === 'string' ? opt : (opt.text ?? ''),
                })),
                timer: q.chronometre,
            }))
        };
    }

    // ─── POST /api/candidatures/:id/evaluation ────────────────────────────────
    async submitEvaluation(candidatureId: number, userId: number, rawAnswers: Record<string | number, number>, tempsEcoule?: string) {
        console.log('[DEBUG] normalized answers-------------------------------------------------------------------------');
        const candidature = await this.candidatureRepo.findOne({
            where: { id: candidatureId },
            relations: ['candidat', 'offre'],
        });
        if (!candidature) throw new NotFoundException(`Candidature introuvable.`);
        if (Number(candidature.candidat.id) !== Number(userId)) throw new ConflictException('Accès refusé.');
        if (candidature.score !== null) throw new ConflictException('Vous avez déjà passé cette évaluation.');

        const questions = await this.questionRepo.find({
            where: { offre: { id: candidature.offre.id } },
            order: { createdAt: 'ASC' },
        });

        // ⚠️ JSON always serializes keys as strings — normalize to numbers for matching
        const answers: Record<number, number> = {};
        console.log('[DEBUG] rawAnswers received:', JSON.stringify(rawAnswers));
        console.log('[DEBUG] typeof rawAnswers:', typeof rawAnswers);
        if (rawAnswers) {
            for (const k of Object.keys(rawAnswers)) {
                const val = rawAnswers[k];
                if (val !== undefined && val !== null) {
                    answers[Number(k)] = Number(val);
                }
            }
        }
        console.log('[DEBUG] normalized answers:', JSON.stringify(answers));
        console.log('[DEBUG] question IDs:', questions.map(q => q.id));

        // Track stats per competency dynamically based on question tags
        const statsPerComp: Record<string, { total: number; correct: number }> = {};

        let correctCount = 0;
        const reponsesToSave: ReponseCandidat[] = [];
        const testResults: any[] = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            // Extract competency tag added during generation
            let compName = q.contenu?.category || (candidature.offre?.TitreDePost ? candidature.offre.TitreDePost : 'Spécialité');
            if (!statsPerComp[compName]) {
                statsPerComp[compName] = { total: 0, correct: 0 };
            }
            statsPerComp[compName].total++;

            let isCorrect = false;
            let reponseText = 'Non répondu';

            const chosenIndex = answers[Number(q.id)];
            console.log(`[EVAL] Q ${q.id} → chosenIndex: ${chosenIndex}`);

            if (chosenIndex !== undefined && chosenIndex !== null) {
                const options: any[] = q.contenu?.options || [];
                const chosen = options[chosenIndex];

                if (chosen !== undefined) {
                    const isObj = typeof chosen === 'object' && chosen !== null;
                    reponseText = isObj ? (chosen.text || 'Option sélectionnée') : String(chosen);

                    // Prefer isCorrect flag on the object; fall back to correctAnswer text comparison
                    if (isObj && chosen.isCorrect === true) {
                        isCorrect = true;
                    } else if (!isObj) {
                        const correctAnswerText: string = ((q.contenu as any)?.correctAnswer || '').trim().toLowerCase();
                        const chosenText = reponseText.toLowerCase().trim();
                        if (correctAnswerText && (chosenText === correctAnswerText ||
                            chosenText.includes(correctAnswerText) ||
                            correctAnswerText.includes(chosenText))) {
                            isCorrect = true;
                        }
                    }
                    if (isCorrect) {
                        correctCount++;
                        statsPerComp[compName].correct++;
                    }
                }
            }

            const correctAnswerText = ((q.contenu as any)?.correctAnswer || 
                ((q.contenu as any)?.options?.find((o: any) => o.isCorrect)?.text || 'Non spécifié'));

            const rep = new ReponseCandidat();
            rep.candidature = candidature;
            rep.question = q;
            rep.reponse = reponseText;
            rep.est_correct = isCorrect;
            rep.scoreFinal = isCorrect ? 1 : 0;
            reponsesToSave.push(rep);
            
            testResults.push({
                question: q.contenu?.question || `Question ${q.id}`,
                selectedAnswer: reponseText,
                correctAnswer: correctAnswerText,
                isCorrect: isCorrect
            });
        }

        const totalQuestions = questions.length;
        const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        const ScoreParCompetence: Record<string, number> = {};
        
        for (let [compName, stats] of Object.entries(statsPerComp)) {
            // Failsafe normalization: strip descriptive prefixes
            compName = compName.replace(/^(Bon niveau en|Connaissances en|Notions en|Maîtrise de|Introduction à|Bases de)\s+/i, '').trim();
            compName = compName.charAt(0).toUpperCase() + compName.slice(1);

            const rawScore = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            ScoreParCompetence[compName] = rawScore; // Pourcentage exact
        }

        candidature.score = scorePercent;
        candidature.nbReponsesCorrectes = correctCount;
        candidature.totalQuestions = totalQuestions;
        candidature.tempsEcoule = tempsEcoule || candidature.tempsEcoule;
        
        await this.candidatureRepo.save(candidature);

        // Dynamic ranking for this offer: Re-evaluate ALL candidates
        const allCandidatesForOffer = await this.candidatureRepo.find({
            where: { offre: { id: candidature.offre.id } },
        });

        const seuil = candidature.offre.seuilMinimal ?? 0;
        const evaluatedCandidates = allCandidatesForOffer.filter(c => c.score !== null);

        const candidaturesToSave: Candidature[] = [];

        for (const c of evaluatedCandidates) {
            const expectedStatut = (c.score ?? 0) >= seuil ? 'Accepté' : 'Refusé';

            if (c.statut !== expectedStatut) {
                c.statut = expectedStatut;
                candidaturesToSave.push(c);
            }
            if (c.id === candidature.id) {
                candidature.statut = expectedStatut;
            }
        }

        if (candidaturesToSave.length > 0) {
            await this.candidatureRepo.save(candidaturesToSave);
        }
        // Wrap AI call so a model failure never blocks submission
        let aiRecommendation: any = null;
        try {
            aiRecommendation = await this.aiService.generateRecommendation(
                candidature.offre.Description || candidature.offre.TitreDePost,
                testResults
            );
        } catch (aiErr) {
            this.logger.warn('[AI] generateRecommendation failed, continuing without recommendation:', aiErr?.message);
            aiRecommendation = { text: 'Recommandation IA indisponible.', error: true };
        }

        candidature.nbReponsesCorrectes = correctCount;
        candidature.totalQuestions = totalQuestions;
        candidature.score = scorePercent;
        candidature.tempsEcoule = tempsEcoule || candidature.tempsEcoule || '0:00';
        
        let finalScoreParCompetence = { ...ScoreParCompetence };
        if (
            aiRecommendation?.detailedSkills?.detailedSkills?.length > 0 ||
            aiRecommendation?.detailedSkills?.behavioralSkills?.length > 0
        ) {
            finalScoreParCompetence = {}; // override generic ones with granular AI skills
            const ds = aiRecommendation.detailedSkills.detailedSkills || [];
            const bs = aiRecommendation.detailedSkills.behavioralSkills || [];
            ds.forEach((s: any) => { if (s.skill) finalScoreParCompetence[s.skill] = Number(s.score) || 0; });
            bs.forEach((s: any) => { if (s.skill) finalScoreParCompetence[s.skill] = Number(s.score) || 0; });
            
            // Failsafe: Si jamais l'IA génère 0 skill même si length > 0 semblait dire le contraire
            if (Object.keys(finalScoreParCompetence).length === 0) {
                 finalScoreParCompetence = { ...ScoreParCompetence };
            }
        }

        candidature.evaluationDetails = JSON.stringify({
            TotalQuestions: totalQuestions,
            CorrectAnswers: correctCount,
            Temps: candidature.tempsEcoule,
            TopPercent: Math.max(1, 100 - scorePercent),
            ScoreParCompetence: finalScoreParCompetence,
            skillsAnalysis: aiRecommendation?.detailedSkills || { technicalSkills: [], behavioralSkills: [] },
            aiRecommendation,
            answers: testResults
        });

        const savedCandidature = await this.candidatureRepo.save(candidature);
        if (reponsesToSave.length > 0) {
            await this.reponseCandidatRepo.save(reponsesToSave);
        }

        // Recompute ranks excluding any forfeited candidates
        await this._recomputeRanks(candidature.offre.id);

        return { message: 'Évaluation soumise avec succès.', score: scorePercent };
    }

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

        if (offre.DateLimite) {
            const now = new Date();
            const dateLimite = new Date(offre.DateLimite);
            if (now > dateLimite) {
                throw new ConflictException('La date limite pour postuler à cette offre est dépassée.');
            }
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
        const all = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre', 'offre.entreprise'],
            order: { datePostulation: 'DESC' },
        });

        const now = new Date();

        // ── Dynamically override statut for expired sessions ──
        for (const c of all) {
            if (c.score === null || c.score === undefined) {
                if (c.offre?.dateLancementQcm) {
                    const expiry = new Date(new Date(c.offre.dateLancementQcm).getTime() + 4 * 60_000); // 1 min connection + 3 min QCM
                    if (now >= expiry) {
                        c.statut = 'Expirée';
                    }
                }
            }
        }

        return all;
    }

    async getMyStats(userId: number) {
        const all = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'ASC' },
        });

        const now = new Date();
        for (const c of all) {
            if (c.score === null || c.score === undefined) {
                if (c.offre?.dateLancementQcm) {
                    // Délai = 1 min pour se connecter + 3 minutes pour le QCM
                    const expiry = new Date(new Date(c.offre.dateLancementQcm).getTime() + 4 * 60_000);
                    if (now >= expiry) {
                        c.statut = 'Expirée';
                    }
                }
            }
        }

        // Do NOT exclude expired from stats, the user wants 'toutes les candidatures' represented.
        const activeCands = all;

        const progression = activeCands.filter(c => c.score !== null).map(c => ({
            date: c.datePostulation,
            score: c.score || 0,
        }));

        const stats = {
            total: activeCands.length,
            enAttente: activeCands.filter(c => c.statut === 'En attente' || c.statut === 'Évalué' || c.statut === 'En cours').length,
            entretiens: activeCands.filter(c => c.statut === 'Entretien').length,
            acceptées: activeCands.filter(c => c.statut === 'Accepté' || c.statut === 'Acceptée').length,
            refusées: activeCands.filter(c => c.statut === 'Refusé' || c.statut === 'Non retenu').length,
            expirees: activeCands.filter(c => c.statut === 'Expirée').length,
            reussis: activeCands.filter(c => (c.score || 0) >= 70).length,
            echoues: activeCands.filter(c => c.score !== null && (c.score || 0) < 40).length,
            moyenne: activeCands.length > 0
                ? Number((activeCands.reduce((acc, curr) => acc + (curr.score || 0), 0) / activeCands.length).toFixed(2))
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

        if (Number(candidature.candidat.id) !== Number(userId)) {
            throw new ConflictException('Vous n\'êtes pas autorisé à annuler cette candidature.');
        }

        if (candidature.statut !== 'En attente') {
            throw new ConflictException('Seules les candidatures "En attente" peuvent être annulées.');
        }

        // Hard delete: supprime la candidature → elle n'apparaît plus dans l'historique ni l'évaluation
        await this.candidatureRepo.remove(candidature);
    }

    // ─── POST /api/candidatures/:id/forfeit ──────────────────────────────────
    async forfeitEvaluation(candidatureId: number, userId: number, reason: string) {
        const candidature = await this.candidatureRepo.findOne({
            where: { id: candidatureId },
            relations: ['candidat', 'offre'],
        });
        if (!candidature) throw new NotFoundException(`Candidature introuvable.`);
        if (Number(candidature.candidat.id) !== Number(userId)) throw new ConflictException('Accès refusé.');

        // If already scored, do nothing (idempotent)
        if (candidature.score !== null) {
            return { message: 'Évaluation déjà soumise.', score: candidature.score };
        }

        // Force score = 0, statut = Refusé, rank = NULL, isForfeit = true
        candidature.score = 0;
        candidature.nbReponsesCorrectes = 0;
        candidature.totalQuestions = candidature.totalQuestions || 0;
        candidature.statut = 'Refusé';
        candidature.rank = null as any;
        candidature.isForfeit = true;
        candidature.evaluationDetails = JSON.stringify({
            TotalQuestions: candidature.totalQuestions || 0,
            CorrectAnswers: 0,
            Temps: '0:00',
            TopPercent: null,
            ScoreParCompetence: {},
            forfeit: true,
            forfeitReason: reason || 'Comportement frauduleux détecté',
            aiRecommendation: { text: 'Évaluation annulée pour fraude.', error: false },
            answers: [],
        });

        await this.candidatureRepo.save(candidature);

        // Re-compute ranks for remaining honest candidates on this offer
        await this._recomputeRanks(candidature.offre.id);

        return { message: 'Évaluation annulée pour fraude. Score: 0.', score: 0 };
    }
    async resyncAllStatuses(): Promise<{ updated: number }> {
        const evaluated = await this.candidatureRepo
            .createQueryBuilder('c')
            .select('DISTINCT c."offreId"', 'offreId')
            .where('c.score IS NOT NULL')
            .getRawMany();

        let updatedTotal = 0;
        for (const row of evaluated) {
            const offreId = row.offreId;
            const cands = await this.candidatureRepo.find({
                where: { offre: { id: offreId } },
                relations: ['offre'],
            });

            const seuil = cands[0]?.offre?.seuilMinimal ?? 0;
            const withScore = cands.filter(c => c.score !== null && c.score !== undefined);

            const toSave: Candidature[] = [];
            for (const c of withScore) {
                const expected = (c.score ?? 0) >= seuil ? 'Accepté' : 'Refusé';
                if (c.statut !== expected) {
                    c.statut = expected;
                    toSave.push(c);
                }
            }
            if (toSave.length > 0) {
                await this.candidatureRepo.save(toSave);
                updatedTotal += toSave.length;
            }

            // Recompute ranks excluding forfeits
            await this._recomputeRanks(offreId);
        }
        this.logger.log(`[resyncAllStatuses] Updated ${updatedTotal} candidature(s).`);
        return { updated: updatedTotal };
    }

    /** Recompute rank for all honest (non-forfeit) evaluated candidates on an offer.
     *  Forfeited candidates get rank = NULL and are excluded from the ranking pool. */
    private async _recomputeRanks(offreId: string): Promise<void> {
        const all = await this.candidatureRepo.find({
            where: { offre: { id: offreId } },
        });

        // Only honest candidates with a score participate in ranking
        const eligible = all
            .filter(c => c.score !== null && !c.isForfeit)
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

        const toSave: Candidature[] = [];

        for (const c of all) {
            if (c.isForfeit || c.score === null) {
                // Forfeited or unevaluated → rank stays NULL
                if (c.rank !== null) {
                    c.rank = null as any;
                    toSave.push(c);
                }
                continue;
            }
            const newRank = eligible.findIndex(e => e.id === c.id) + 1; // 1-based
            if (c.rank !== newRank) {
                c.rank = newRank;
                toSave.push(c);
            }
        }

        if (toSave.length > 0) {
            await this.candidatureRepo.save(toSave);
        }
    }
}
