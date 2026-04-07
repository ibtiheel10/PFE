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

        // 3. Suggestions d'offres (simulées basées sur les catégories déjà postulées)
        const userApps = allApplications;
        const categories = [...new Set(userApps.map(a => a.offre.Categorie))];

        let suggestions: OffreEmploi[] = [];
        if (categories.length > 0) {
            suggestions = await this.offreRepo.createQueryBuilder('offre')
                .where('offre.Categorie IN (:...categories)', { categories })
                .andWhere('offre.id NOT IN (:...excludedIds)', {
                    excludedIds: userApps.map(a => a.offre.id).length > 0 ? userApps.map(a => a.offre.id) : ['']
                })
                .take(3)
                .getMany();
        } else {
            suggestions = await this.offreRepo.find({ take: 3 });
        }

        // 4. Analyse des compétences (Moyenne par catégorie, sur candidatures évaluées)
        const skillsAnalysis = categories.map(cat => {
            const appsInCat = userApps.filter(a => a.offre.Categorie === cat && a.score !== null);
            if (appsInCat.length === 0) return { category: cat, score: 0 };
            const avgScore = appsInCat.reduce((acc, curr) => acc + (curr.score || 0), 0) / appsInCat.length;
            return { category: cat, score: Math.round(avgScore) };
        });

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
