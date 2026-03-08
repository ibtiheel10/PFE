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
        // 1. Récupérer les 3 dernières candidatures
        const recentApplications = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'DESC' },
            take: 3,
        });

        // 2. Récupérer les 3 derniers résultats (ceux avec un score)
        const recentResults = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
            order: { datePostulation: 'DESC' },
            take: 3,
        });

        // 3. Suggestions d'offres (simulées basées sur les catégories déjà postulées)
        const userApps = await this.candidatureRepo.find({
            where: { candidat: { id: userId } },
            relations: ['offre'],
        });
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

        // 4. Analyse des compétences (Moyenne par catégorie)
        const skillsAnalysis = categories.map(cat => {
            const appsInCat = userApps.filter(a => a.offre.Categorie === cat);
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
            select: ['id', 'nom', 'prenom', 'email', 'dateNaissance'],
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
