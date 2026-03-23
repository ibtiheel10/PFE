import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidature } from '../entities/candidature.entity';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Question } from '../entities/question.entity';
import { ReponseCandidat } from '../entities/reponse-candidat.entity';
import { NotificationsService } from '../notifications/notifications.service';
import * as fs from 'fs';

@Injectable()
export class CandidaturesService {
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
    ) { }

    // ─── GET /api/candidatures/:id/evaluation ─────────────────────────────────
    async getEvaluationQuestions(candidatureId: number, userId: number) {
        const candidature = await this.candidatureRepo.findOne({
            where: { id: candidatureId },
            relations: ['candidat', 'offre'],
        });
        if (!candidature) throw new NotFoundException(`Candidature introuvable.`);
        if (candidature.candidat.id !== userId) throw new ConflictException('Accès refusé.');
        if (!candidature.qcmDisponible) throw new ConflictException('Le QCM n\'est pas encore disponible pour cette offre.');
        if (candidature.score !== null) throw new ConflictException('Vous avez déjà passé cette évaluation.');

        const questions = await this.questionRepo.find({
            where: { offre: { id: candidature.offre.id } },
            order: { createdAt: 'ASC' },
        });

        return {
            candidatureId: candidature.id,
            offreTitle: candidature.offre.TitreDePost,
            questions: questions.map(q => ({
                id: q.id,
                text: q.contenu?.question ?? '',
                options: (q.contenu?.options ?? []).map((opt: any) => ({
                    text: typeof opt === 'string' ? opt : (opt.text ?? ''),
                })),
                difficulty: q.niveauDifficulte,
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
        if (candidature.candidat.id !== userId) throw new ConflictException('Accès refusé.');
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

        // Competency buckets derived from offer's competences field
        let competenceNames = ['Bases & Concepts', 'Logique métier', 'Pratique'];
        if (candidature.offre?.competences) {
            const parts = candidature.offre.competences.split(/[,\n-]/).map(s => s.trim()).filter(s => s.length > 2);
            if (parts.length >= 3) competenceNames = parts.slice(0, 3);
            else if (parts.length > 0) competenceNames = [parts[0], 'Pratique et Implémentation', 'Concepts Clés'];
        } else if (candidature.offre?.TitreDePost) {
            competenceNames = [`${candidature.offre.TitreDePost} (Bases)`, 'Architecture & Design', 'Performance & Qualité'];
        }
        const compBuckets = competenceNames.map(name => ({ name, total: 0, correct: 0 }));

        let correctCount = 0;
        const reponsesToSave: ReponseCandidat[] = [];

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const bucketIdx = i % compBuckets.length;
            compBuckets[bucketIdx].total++;

            let isCorrect = false;
            let reponseText = 'Non répondu';

            const logPath = 'c:/Users/USER/Desktop/Projet_PFE/PFE/Backend/trace.log';
            const logTrace = (msg: string) => fs.appendFileSync(logPath, msg + '\n');
            logTrace(`\n[Q_LOOP] Processing Q ID: ${q.id} (type: ${typeof q.id})`);

            const chosenIndex = answers[Number(q.id)];
            logTrace(`[Q_LOOP] chosenIndex for Q ${q.id}: ${chosenIndex}`);

            if (chosenIndex !== undefined && chosenIndex !== null) {
                const options: any[] = q.contenu?.options || [];
                const chosen = options[chosenIndex];
                logTrace(`[Q_LOOP] option found: ${JSON.stringify(chosen)}`);
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
                        compBuckets[bucketIdx].correct++;
                    }
                }
            }

            const rep = new ReponseCandidat();
            rep.candidature = candidature;
            rep.question = q;
            rep.reponse = reponseText;
            rep.est_correct = isCorrect;
            rep.scoreFinal = isCorrect ? 1 : 0;
            reponsesToSave.push(rep);
        }

        const totalQuestions = questions.length;
        const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        const ScoreParCompetence: Record<string, number> = {};
        for (const b of compBuckets) {
            ScoreParCompetence[b.name] = b.total > 0 ? Math.round((b.correct / b.total) * 100) : scorePercent;
        }

        candidature.score = scorePercent;
        candidature.nbReponsesCorrectes = correctCount;
        candidature.totalQuestions = totalQuestions;
        candidature.tempsEcoule = tempsEcoule || candidature.tempsEcoule;
        candidature.statut = scorePercent >= 50 ? 'Entretiens' : 'Refusée';
        candidature.evaluationDetails = JSON.stringify({
            TotalQuestions: totalQuestions,
            CorrectAnswers: correctCount,
            Temps: tempsEcoule || candidature.tempsEcoule || '15:00',
            TopPercent: Math.max(5, Math.ceil(Math.random() * 20)),
            ScoreParCompetence,
        });

        await this.candidatureRepo.save(candidature);
        if (reponsesToSave.length > 0) {
            await this.reponseCandidatRepo.save(reponsesToSave);
        }

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
