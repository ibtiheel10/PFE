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

        // 3. Suggestions d'offres basées sur les compétences réelles du candidat
        const userApps = allApplications;
        const excludedIds = userApps.map(a => a.offre.id);

        // Extract competency scores from evaluationDetails across all evaluated candidatures
        const competenceMap: Record<string, { total: number; count: number }> = {};
        for (const app of userApps) {
            if (!app.evaluationDetails) continue;
            try {
                const details = JSON.parse(app.evaluationDetails);
                if (details.ScoreParCompetence) {
                    for (const [key, val] of Object.entries(details.ScoreParCompetence)) {
                        if (!competenceMap[key]) competenceMap[key] = { total: 0, count: 0 };
                        competenceMap[key].total += Number(val);
                        competenceMap[key].count += 1;
                    }
                }
            } catch { /* ignore malformed JSON */ }
        }

        // Build ranked skill list: [{ name, avg }] sorted by avg desc
        const rankedSkills = Object.entries(competenceMap)
            .map(([name, { total, count }]) => ({ name: name.toLowerCase(), avg: total / count }))
            .sort((a, b) => b.avg - a.avg);

        // No QCM evaluations → no suggestions
        let suggestions: (OffreEmploi & { matchScore: number })[] = [];

        if (rankedSkills.length > 0) {
            // Fetch all non-expired offers not already applied to
            const allOffres = await this.offreRepo.createQueryBuilder('offre')
                .leftJoinAndSelect('offre.entreprise', 'entreprise')
                .where(excludedIds.length > 0 ? 'offre.id NOT IN (:...excludedIds)' : '1=1', { excludedIds })
                .andWhere('(offre.DateLimite IS NULL OR offre.DateLimite >= :now)', { now })
                .getMany();

            // Score each offer by weighted skill keyword matching
            const scoredOffres = allOffres.map(offre => {
                const searchText = [
                    offre.TitreDePost,
                    offre.Categorie,
                    offre.competences || '',
                    offre.Description || '',
                ].join(' ').toLowerCase();

                let weightedSum = 0;
                let weightTotal = 0;
                rankedSkills.forEach((skill, idx) => {
                    const weight = Math.max(1, rankedSkills.length - idx);
                    const skillWords = skill.name.split(/[\s,\-\/]+/).filter(w => w.length > 2);
                    const hits = skillWords.filter(w => searchText.includes(w)).length;
                    const skillMatch = skillWords.length > 0 ? (hits / skillWords.length) * skill.avg : 0;
                    weightedSum += skillMatch * weight;
                    weightTotal += weight;
                });
                const matchScore = weightTotal > 0 ? Math.round(weightedSum / weightTotal) : 0;
                return { offre, matchScore };
            });

            suggestions = scoredOffres
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 6)
                .map(({ offre, matchScore }) => ({ ...offre, matchScore }));
        }

        // 4. Analyse des compétences (Moyenne par catégorie, sur candidatures évaluées)
        const skillsAnalysis = Object.entries(competenceMap).map(([category, { total, count }]) => ({
            category,
            score: Math.round(total / count),
        }));

        return {
            recentApplications,
            recentResults,
            suggestions,
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
}
