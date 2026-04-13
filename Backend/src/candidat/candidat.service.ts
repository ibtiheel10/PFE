import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { SuggestionService } from '../suggestion/suggestion.service';

@Injectable()
export class CandidatService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
        private readonly suggestionService: SuggestionService,
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
                        key = key.replace(/^(Bon niveau en|Connaissances en|Notions en|Maîtrise de|Introduction à|Bases de)\s+/i, '').trim();
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



        // 4. Obtenir les suggestions via le SuggestionService dédié
        const suggestionsResult = await this.suggestionService.getSuggestions(userId);

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

    // ─── GET /api/Candidat/suggestions ─────────────────────────────────────────
    /**
     * Thin delegation wrapper — full logic lives in SuggestionService.
     * Kept here for backward-compatibility with the existing /api/Candidat/suggestions route.
     */
    async getSuggestions(userId: number, maxResults = 6) {
        return this.suggestionService.getSuggestions(userId, maxResults);
    }
}
