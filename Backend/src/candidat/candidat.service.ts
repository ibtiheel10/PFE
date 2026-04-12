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
         * or recent-applications widget — only in Mes Évaluations.
         */
        const isExpired = (c: any): boolean => {
            if (c.score !== null && c.score !== undefined) return false;
            if (!c.offre?.dateLancementQcm) return false;
            const launch = new Date(c.offre.dateLancementQcm);
            const expiry = new Date(launch.getTime() + 4 * 60000); // 1 minute window to connect + 3 minutes max test
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

        // ── Dynamically compute status based on seuil ──────────────────────────
        for (const app of recentApplications) {
            if (app.score !== null && app.score !== undefined) {
                const seuil = app.offre?.seuilMinimal ?? 0;
                app.statut = app.score >= seuil ? 'Accepté' : 'Refusé';
            }
        }

        // 2. Récupérer les derniers résultats (uniquement les candidatures avec un score)
        const recentResults = allApplications
            .filter(c => c.score !== null && c.score !== undefined)
            .slice(0, 3);

        // 3. Analyse des compétences (Moyenne par catégorie, sur candidatures évaluées)
        const competenceMap: Record<string, { originalName: string; total: number; count: number }> = {};
        const granularSkills: Array<{ category: string; score: number; justification?: string; type: 'technical' | 'behavioral' }> = [];

        for (const app of allApplications) {
            if (!app.evaluationDetails) continue;
            try {
                const details = JSON.parse(app.evaluationDetails);
                
                // Prioritize new granular analysis if available
                if (details.skillsAnalysis) {
                    const sa = details.skillsAnalysis;
                    if (Array.isArray(sa.detailedSkills)) {
                        sa.detailedSkills.forEach((s: any) => {
                            granularSkills.push({ category: s.skill, score: s.score, justification: s.justification, type: 'technical' });
                        });
                    }
                    if (Array.isArray(sa.behavioralSkills)) {
                        sa.behavioralSkills.forEach((s: any) => {
                            granularSkills.push({ category: s.skill, score: s.score, justification: s.justification, type: 'behavioral' });
                        });
                    }
                }

                // Fallback / legacy aggregation for ScoreParCompetence
                if (details.ScoreParCompetence) {
                    for (let [key, val] of Object.entries(details.ScoreParCompetence)) {
                        // Failsafe: Strip descriptive prefixes if they leaked through
                        key = key.replace(/^(Bon niveau en|Connaissances en|Notions en|Maîtrise de|Compétence en|Introduction à|Bases de)\s+/i, '').trim();
                        key = key.charAt(0).toUpperCase() + key.slice(1);

                        // Skip if we already have a granular match to avoid duplication
                        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9+#]/g, '');
                        if (!normalizedKey || ['expertise', 'basique', 'technique', 'niveau'].includes(normalizedKey)) continue;
                        
                        if (!competenceMap[normalizedKey]) {
                            competenceMap[normalizedKey] = { originalName: key.trim(), total: 0, count: 0 };
                        } else {
                            if (key.length > competenceMap[normalizedKey].originalName.length) {
                                competenceMap[normalizedKey].originalName = key.trim();
                            }
                        }
                        competenceMap[normalizedKey].total += Number(val);
                        competenceMap[normalizedKey].count += 1;
                    }
                }
            } catch { /* ignore malformed JSON */ }
        }

        // Merge legacy map into skills analysis if no granular skills were found or to complement them
        const legacySkills = Object.values(competenceMap).map(({ originalName, total, count }) => ({
            category: originalName,
            score: Math.round(total / count),
        }));

        // Final skills analysis for dashboard: merge granular AI analysis with legacy question stats
        const skillsAnalysis = [...granularSkills];

        // Add any legacy skills that aren't already represented in granularSkills
        for (const legacy of legacySkills) {
            const alreadyExists = skillsAnalysis.some(s => s.category.toLowerCase() === legacy.category.toLowerCase());
            if (!alreadyExists) {
                skillsAnalysis.push({ 
                  category: legacy.category, 
                  score: legacy.score,
                  justification: `Évalué lors du test QCM.`,
                  type: 'technical'
                });
            }
        }



        // 4. Obtenir les suggestions en appelant la méthode getSuggestions
        const suggestionsResult = await this.getSuggestions(userId);

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
    async getSuggestions(userId: number, maxResults = 6) {
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
        const skillScores: Record<string, { originalName: string; scores: number[] }> = {};

        for (const c of candidatures) {
            if (!c.evaluationDetails) continue;
            try {
                const details = JSON.parse(c.evaluationDetails);
                const scoreMap: Record<string, number> = details.ScoreParCompetence || {};
                for (let [skill, score] of Object.entries(scoreMap)) {
                    // Failsafe normalization
                    skill = skill.replace(/^(Bon niveau en|Connaissances en|Notions en|Maîtrise de|Compétence en|Introduction à|Bases de)\s+/i, '').trim();
                    skill = skill.charAt(0).toUpperCase() + skill.slice(1);

                    // Normalisation stricte
                    const normalizedKey = skill.toLowerCase().replace(/[^a-z0-9+#]/g, '');
                    if (!normalizedKey || ['expertise', 'basique', 'technique', 'niveau'].includes(normalizedKey)) continue;

                    if (!skillScores[normalizedKey]) {
                        skillScores[normalizedKey] = { originalName: skill.trim(), scores: [] };
                    } else if (skill.length > skillScores[normalizedKey].originalName.length) {
                        skillScores[normalizedKey].originalName = skill.trim();
                    }
                    skillScores[normalizedKey].scores.push(Number(score));
                }
            } catch {
                // Skip malformed evaluationDetails
            }
        }

        // 3. Build list of ALL identified skills (no score threshold required anymore)
        const identifiedSkills: Array<{ name: string; avgScore: number }> = [];
        for (const { originalName, scores } of Object.values(skillScores)) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            identifiedSkills.push({ name: originalName, avgScore: Math.round(avg) });
        }

        const now = new Date();

        // 4. If no identified skills, fall back to category-based suggestions
        if (identifiedSkills.length === 0) {
            const categories = [...new Set(candidatures.map(c => c.offre?.Categorie).filter(Boolean))];
            
            let qb = this.offreRepo.createQueryBuilder('offre')
                .where('(offre.DateLimite IS NULL OR offre.DateLimite >= :now)', { now });

            if (categories.length > 0) {
                qb = qb.andWhere('offre.Categorie IN (:...categories)', { categories });
            }
            if (appliedOfferIds.length > 0) {
                qb = qb.andWhere('offre.id NOT IN (:...excluded)', { excluded: appliedOfferIds });
            }
            
            const fallbackOffers = await qb.take(MAX_SUGGESTIONS).getMany();

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
                }))
            };
        }

        // 5. Find ACTIVE offers matching at least one identified skill
        const identifiedSkillNames = identifiedSkills.map(s => s.name);

        let query = this.offreRepo.createQueryBuilder('offre')
            .where('(offre.DateLimite IS NULL OR offre.DateLimite >= :now)', { now });

        if (appliedOfferIds.length > 0) {
            query = query.andWhere('offre.id NOT IN (:...excluded)', { excluded: appliedOfferIds });
        }

        // ILIKE match: at least one identified skill must appear in competences or title
        const skillConditions = identifiedSkillNames.map((_, i) => `(LOWER(offre.competences) LIKE LOWER(:skill${i}) OR LOWER(offre."TitreDePost") LIKE LOWER(:skill${i}))`);
        const skillParams: Record<string, string> = {};
        identifiedSkillNames.forEach((skill, i) => {
            skillParams[`skill${i}`] = `%${skill}%`;
        });

        query = query.andWhere(`(${skillConditions.join(' OR ')})`, skillParams);
        query = query.take(MAX_SUGGESTIONS * 2); // fetch more to allow ranking

        const matchingOffers = await query.getMany();

        // 6. Rank offers by number of matched identified skills
        const rankedOffers = matchingOffers.map(o => {
            const competencesText = ((o.competences || '') + ' ' + (o.TitreDePost || '')).toLowerCase();
            const matched = identifiedSkills.filter(s => competencesText.includes(s.name.toLowerCase()));
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
            strongSkills: identifiedSkills,
            suggestions: rankedOffers.slice(0, MAX_SUGGESTIONS)
        };
    }
}
