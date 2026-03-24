import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { User } from '../entities/user.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Candidature)
        private readonly candidatureRepo: Repository<Candidature>,
        @InjectRepository(OffreEmploi)
        private readonly offreRepo: Repository<OffreEmploi>,
    ) { }

    /**
     * Returns the profile of the currently logged-in admin.
     * @param userId - extracted from the JWT token
     */
    async getMonProfil(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId, role: 'Admin' },
            select: ['id', 'nom', 'prenom', 'email'],
        });

        if (!user) {
            throw new NotFoundException('Profil admin introuvable.');
        }

        return user;
    }

    /**
     * Returns statistics for the admin dashboard.
     */
    async getDashboardStats() {
        const totalUtilisateurs = await this.userRepo.count();
        const totalCandidats = await this.userRepo.count({ where: { role: 'Candidat' } });
        const totalEntreprises = await this.userRepo.count({ where: { role: 'Entreprise' } });

        const totalTests = await this.candidatureRepo.count({
            where: { score: Not(IsNull()) }
        });
        const totalCandidatures = await this.candidatureRepo.count();
        const totalOffres = await this.offreRepo.count();
        const avgCandidaturesParOffre = totalOffres > 0
            ? Math.round((totalCandidatures / totalOffres) * 10) / 10
            : 0;

        // % of offers that have at least one candidature
        const offresAvecCandidaturesRaw = await this.candidatureRepo
            .createQueryBuilder('c')
            .select('COUNT(DISTINCT c."offreId")', 'cnt')
            .getRawOne();
        const offresAvecCandidatures = parseInt(offresAvecCandidaturesRaw?.cnt ?? '0', 10);
        const tauxCouverture = totalOffres > 0
            ? Math.round((offresAvecCandidatures / totalOffres) * 100)
            : 0;

        // Calculate demographic percentages
        const pctCandidat = totalUtilisateurs > 0 ? Math.round((totalCandidats / totalUtilisateurs) * 100) : 0;
        const pctEntreprise = totalUtilisateurs > 0 ? Math.round((totalEntreprises / totalUtilisateurs) * 100) : 0;

        return {
            totalUtilisateurs,
            totalCandidats,
            totalEntreprises,
            totalOffres,
            totalCandidatures,
            totalTests,
            avgCandidaturesParOffre,
            tauxCouverture,
            revenuTotal: 0,

            // Demographics Data
            demographie: {
                candidatsPct: pctCandidat,
                entreprisesPct: pctEntreprise
            },

            // System Health Data (Mocked real-time metrics)
            santeAcquise: {
                apiResponseTime: 85, // ms
                cpuLoad: 32, // %
                bddUptime: 99.99 // %
            },

            // Traffic Data for Area Chart (Mock array)
            traficData: {
                labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                values: [150, 230, 180, 290, 200, 120, 95]
            }
        };
    }

    /**
     * Get all users for admin dashboard.
     */
    async getAllUsers() {
        const users = await this.userRepo.find({
            select: ['id', 'nom', 'prenom', 'email', 'role', 'isEmailVerified', 'createdAt']
        });

        // Map to format expected by Admin Dashboard frontend
        return users.map(u => ({
            id: u.id,
            nom: u.prenom ? `${u.nom} ${u.prenom}` : u.nom,
            email: u.email,
            roles: [u.role], // Frontend expects 'roles' array
            estActif: u.isEmailVerified, // Mapping verified to active status for now
            dateCreation: u.createdAt
        }));
    }

    /**
     * Create a new user (Admin, Candidat, Entreprise).
     */
    async createUser(dto: any) {
        const existing = await this.userRepo.findOneBy({ email: dto.email });
        if (existing) {
            throw new NotFoundException('Un compte avec cet email existe déjà.');
        }

        // Must manually hash the password (simplified here, normally inject bcrypt)
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const newUser = this.userRepo.create({
            nom: dto.nom,
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
            prenom: dto.prenom,
            dateNaissance: dto.dateNaissance,
            secteur: dto.secteur,
            isEmailVerified: true, // Auto verify admin-created accounts
        });

        await this.userRepo.save(newUser);
        return { message: 'Utilisateur créé avec succès', id: newUser.id };
    }

    /**
     * Toggles whether a user is active or suspended.
     */
    async toggleUserStatus(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('Utilisateur introuvable.');

        user.isEmailVerified = !user.isEmailVerified; // Reusing this field as active status toggle for admin mockup
        await this.userRepo.save(user);
        return { message: 'Statut mis à jour', isActif: user.isEmailVerified };
    }

    /**
     * Deletes a user.
     */
    async deleteUser(id: number) {
        const user = await this.userRepo.findOneBy({ id });
        if (!user) throw new NotFoundException('Utilisateur introuvable.');

        await this.userRepo.remove(user);
        return { message: 'Utilisateur supprimé avec succès' };
    }

    /**
     * Get all companies for admin dashboard.
     */
    async getCompanies() {
        const companies = await this.userRepo.find({
            where: { role: 'Entreprise' },
            select: ['id', 'nom', 'secteur', 'email', 'isEmailVerified', 'createdAt']
        });

        // Map to format expected by Admin Dashboard frontend
        return companies.map(c => ({
            id: c.id,
            nom: c.nom || 'Sans nom',
            secteur: c.secteur || 'Non précisé',
            email: c.email,
            estActif: c.isEmailVerified, // Mapping verified to active status
            dateCreation: c.createdAt
        }));
    }

    /**
     * Get system logs (mocked for now).
     */
    async getLogs() {
        return [
            {
                id: 1,
                action: 'Connexion Admin réussie',
                userId: 'Super Admin',
                dateAction: new Date().toISOString()
            },
            {
                id: 2,
                action: 'Nouvelle entreprise inscrite: TechCorp',
                userId: 'Système',
                dateAction: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: 3,
                action: 'Utilisateur Jean.D suspendu',
                userId: 'Super Admin',
                dateAction: new Date(Date.now() - 7200000).toISOString()
            }
        ];
    }
}



