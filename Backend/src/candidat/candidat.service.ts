import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Injectable()
export class CandidatService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
    ) { }

    async getDashboard(userId: number) {
        const now = new Date();

        /**
         * Helper: returns true if a candidature is "expired" (QCM window passed,
         * no score submitted). These should NOT appear in the application history
         * or recent-applications widget — only in Mes Évaluations Techniques.
         */
        const isExpired = (c: any): boolean => {
            if (c.score !== null && c.score !== undefined) return false;
            if (!c.offre?.dateLancementQcm) return false;
            const launch = new Date(c.offre.dateLancementQcm);
            const expiry = new Date(launch.getTime() + 1 * 60000); // 1 minute window
            return now >= expiry;
        };

        // 1. Récupérer toutes les candidatures (pour filtrer les expirées)
        const allApplications = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'DESC' },
        });

        // Exclude expired-session candidatures from the history/dashboard flow
        const activeApplications = allApplications.filter(c => !isExpired(c));

        // Take the 3 most recent non-expired applications for the widget
        const recentApplications = activeApplications.slice(0, 3);

        // ── Dynamically compute rank-based status for each application ──────────
        for (const app of recentApplications) {
            if (app.score !== null && app.score !== undefined) {
                const allForOffer = await this.candidatureRepo.find({
                    where: { offre: { id: app.offre.id } },
                    select: ['id', 'score'],
                });
                const ranked = allForOffer
                    .filter(c => c.score !== null && c.score !== undefined)
                    .sort((a, b) => (b.score || 0) - (a.score || 0));
                const rank = ranked.findIndex(c => c.id === app.id);
                app.statut = rank !== -1 && rank < 5 ? 'Entretien' : 'Non retenu';
            }
        }

        // 2. Récupérer les derniers résultats (uniquement les candidatures avec un score)
        const recentResults = allApplications
            .filter(c => c.score !== null && c.score !== undefined)
            .slice(0, 3);

        // 3. Suggestions d'offres basées sur les compétences fortes du candidat (ScoreParCompetence > 50%)
        const suggestionsResult = await this.getSuggestions(userId, 50, 3);

        // 4. Analyse des compétences (Moyenne par catégorie, sur candidatures évaluées)
        const categories = [...new Set(allApplications.map(a => a.offre?.Categorie).filter(Boolean))];
        const skillsAnalysis = categories.map(cat => {
            const appsInCat = allApplications.filter(a => a.offre?.Categorie === cat && a.score !== null && a.score !== undefined);
            if (appsInCat.length === 0) return { category: cat, score: 0 };
            const avgScore = appsInCat.reduce((acc, curr) => acc + (curr.score || 0), 0) / appsInCat.length;
            return { category: cat, score: Math.round(avgScore) };
        });

        return {
            recentApplications,
            recentResults,
            suggestions: suggestionsResult.suggestions,
            strongSkills: suggestionsResult.strongSkills,
            skillsAnalysis
        };
    }

    /**
     * Returns the profile of the currently logged-in candidat.
     * @param userId - extracted from the JWT token
     */
    async getMonProfil(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId, role: 'Candidat' },
            select: ['id', 'nom', 'prenom', 'email', 'dateNaissance', 'avatar', 'bio'],
        });

        if (!user) {
            throw new NotFoundException('Profil candidat introuvable.');
        }

        return user;
    }

    async updateProfil(userId: number, updateData: Partial<User>) {
        const user = await this.getMonProfil(userId);

        // On empêche la modification de certains champs sensibles ici si nécessaire
        delete updateData.password;
        delete updateData.role;
        delete updateData.id;
        delete updateData.email; // Généralement l'email est géré séparément ou vérifié

        Object.assign(user, updateData);
        return await this.userRepo.save(user);
    }

    // ─── GET /api/Candidat/suggestions ───────────────────────────────────────
    /**
     * Returns job offer suggestions based on the candidate's competency scores obtained during QCMs.
     * Skills with a score > SKILL_THRESHOLD (default 50%) are considered "strong" and used to
     * match against the `competences` field of open job offers.
     *
     * Algorithm:
     * 1. Fetch all the candidate's evaluated candidatures (those with evaluationDetails).
     * 2. Parse ScoreParCompetence from each evaluationDetails JSON blob.
     * 3. Collect all skill names where the score exceeds SKILL_THRESHOLD.
     * 4. Query OffreEmploi whose `competences` text contains at least one of those skill names.
     * 5. Exclude offers the candidate already applied to.
     * 6. Return up to MAX_SUGGESTIONS offers along with the matched skills.
     */
    async getSuggestions(userId: number, threshold = 50, maxResults = 6) {
        const SKILL_THRESHOLD = threshold;
        const MAX_SUGGESTIONS = maxResults;

        // 1. Fetch all evaluated candidatures for this user
        const candidatures = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'DESC' },
        });

        // IDs of offers the candidate has already applied to (to exclude from suggestions)
        const appliedOfferIds = candidatures.map(c => c.offre?.id).filter(Boolean);

        // 2. Extract competency scores from all evaluationDetails
        const skillScores: Record<string, number[]> = {};

        for (const c of candidatures) {
            if (!c.evaluationDetails) continue;
            try {
                const details = JSON.parse(c.evaluationDetails);
                const scoreMap: Record<string, number> = details.ScoreParCompetence || {};
                for (const [skill, score] of Object.entries(scoreMap)) {
                    const normalizedSkill = skill.trim();
                    if (!skillScores[normalizedSkill]) skillScores[normalizedSkill] = [];
                    skillScores[normalizedSkill].push(Number(score));
                }
            } catch {
                // Skip malformed evaluationDetails
            }
        }

        // 3. Build list of "strong" skills (average score > threshold)
        const strongSkills: Array<{ name: string; avgScore: number }> = [];
        for (const [skill, scores] of Object.entries(skillScores)) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (avg >= SKILL_THRESHOLD) {
                strongSkills.push({ name: skill, avgScore: Math.round(avg) });
            }
        }

        // 4. If no strong skills, fall back to category-based suggestions
        if (strongSkills.length === 0) {
            const categories = [...new Set(candidatures.map(c => c.offre?.Categorie).filter(Boolean))];
            let fallbackOffers: OffreEmploi[] = [];

            if (categories.length > 0) {
                fallbackOffers = await this.offreRepo
                    .createQueryBuilder('offre')
                    .where('offre.Categorie IN (:...categories)', { categories })
                    .andWhere(appliedOfferIds.length > 0 ? 'offre.id NOT IN (:...excluded)' : '1=1', {
                        excluded: appliedOfferIds.length > 0 ? appliedOfferIds : undefined,
                    })
                    .take(MAX_SUGGESTIONS)
                    .getMany();
            } else {
                fallbackOffers = await this.offreRepo.find({ take: MAX_SUGGESTIONS });
            }

            return {
                strongSkills: [],
                suggestions: fallbackOffers.map(o => ({
                    id: o.id,
                    titre: o.TitreDePost,
                    categorie: o.Categorie,
                    competences: o.competences,
                    localisation: o.Localisation,
                    typeDeContrat: o.TypeDeContrat,
                    dateLimite: o.DateLimite,
                    matchedSkills: [],
                    matchScore: 0,
                })),
                threshold: SKILL_THRESHOLD,
            };
        }

        // 5. Find offers matching at least one strong skill
        const strongSkillNames = strongSkills.map(s => s.name);

        // Build a query that checks if the offer's competences field contains any strong skill
        let query = this.offreRepo.createQueryBuilder('offre');

        if (appliedOfferIds.length > 0) {
            query = query.where('offre.id NOT IN (:...excluded)', { excluded: appliedOfferIds });
        }

        // ILIKE match: at least one strong skill must appear in competences or title
        const skillConditions = strongSkillNames.map((_, i) => `(LOWER(offre.competences) LIKE LOWER(:skill${i}) OR LOWER(offre."TitreDePost") LIKE LOWER(:skill${i}))`);
        const skillParams: Record<string, string> = {};
        strongSkillNames.forEach((skill, i) => {
            skillParams[`skill${i}`] = `%${skill}%`;
        });

        query = query.andWhere(`(${skillConditions.join(' OR ')})`, skillParams);
        query = query.take(MAX_SUGGESTIONS * 2); // fetch more to allow ranking

        const matchingOffers = await query.getMany();

        // 6. Rank offers by number of matched strong skills
        const rankedOffers = matchingOffers.map(o => {
            const competencesText = ((o.competences || '') + ' ' + (o.TitreDePost || '')).toLowerCase();
            const matched = strongSkills.filter(s => competencesText.includes(s.name.toLowerCase()));
            const matchScore = matched.length > 0
                ? Math.round(matched.reduce((acc, s) => acc + s.avgScore, 0) / matched.length)
                : 0;
            return {
                id: o.id,
                titre: o.TitreDePost,
                categorie: o.Categorie,
                competences: o.competences,
                localisation: o.Localisation,
                typeDeContrat: o.TypeDeContrat,
                dateLimite: o.DateLimite,
                matchedSkills: matched.map(s => ({ name: s.name, score: s.avgScore })),
                matchScore,
            };
        });

        rankedOffers.sort((a, b) => b.matchScore - a.matchScore || b.matchedSkills.length - a.matchedSkills.length);

        return {
            strongSkills,
            suggestions: rankedOffers.slice(0, MAX_SUGGESTIONS),
            threshold: SKILL_THRESHOLD,
        };
    }
}
