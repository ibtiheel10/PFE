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
     * Seeds the admin user.
     */
    async seedAdmin() {
        const ADMIN_EMAIL = 'skillvia.recrutement@gmail.com';
        const bcrypt = require('bcrypt');
        let admin = await this.userRepo.findOneBy({ email: ADMIN_EMAIL });
        const hashedPassword = await bcrypt.hash('Admin@Skillvia2026!', 10);
        
        if (admin) {
            admin.password = hashedPassword;
            admin.role = 'Admin';
            admin.nom = 'Skillvia';
            admin.prenom = 'Admin';
            admin.isEmailVerified = true;
            await this.userRepo.save(admin);
            return { message: 'Admin mis à jour' };
        } else {
            const newAdmin = this.userRepo.create({
                email: ADMIN_EMAIL,
                password: hashedPassword,
                nom: 'Skillvia',
                prenom: 'Admin',
                role: 'Admin',
                isEmailVerified: true,
            });
            await this.userRepo.save(newAdmin);
            return { message: 'Admin créé' };
        }
    }

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
     * Get all companies for admin dashboard, enriched with offresCount and candidatsCount.
     */
    async getCompanies() {
        const companies = await this.userRepo.find({
            where: { role: 'Entreprise' },
        });

        const enriched = await Promise.all(companies.map(async (c) => {
            const offresCount = await this.offreRepo.count({
                where: { entreprise: { id: c.id } },
            });

            const candidatsCount = await this.candidatureRepo
                .createQueryBuilder('cand')
                .innerJoin('cand.offre', 'o')
                .innerJoin('o.entreprise', 'ent')
                .where('ent.id = :id', { id: c.id })
                .getCount();

            return {
                id: c.id,
                nom: c.nom || 'Sans nom',
                secteur: c.secteur || null,
                email: c.email,
                ville: (c as any).ville || null,
                taille: (c as any).taille || null,
                estActif: c.isEmailVerified,
                createdAt: c.createdAt,
                offresCount,
                candidatsCount,
            };
        }));

        return enriched;
    }

    /**
     * Get detailed information about a specific company.
     */
    async getCompanyDetails(id: number) {
        const company = await this.userRepo.findOne({
            where: { id, role: 'Entreprise' },
        });

        if (!company) {
            throw new NotFoundException('Entreprise introuvable.');
        }

        // Get published offers count
        const offresCount = await this.offreRepo.count({
            where: { entreprise: { id } },
        });

        // Get total candidates count across all offers
        const candidatsCount = await this.candidatureRepo
            .createQueryBuilder('cand')
            .innerJoin('cand.offre', 'o')
            .innerJoin('o.entreprise', 'ent')
            .where('ent.id = :id', { id })
            .getCount();

        return {
            id: company.id,
            nom: company.nom || 'Sans nom',
            email: company.email,
            secteur: company.secteur || 'Non précisé',
            ville: (company as any).ville || 'Non précisé',
            taille: (company as any).taille || 'Non précisé',
            estActif: company.isEmailVerified,
            dateInscription: company.createdAt,
            offresPubliees: offresCount,
            nombreCandidats: candidatsCount,
        };
    }

    /**
     * Update company information (Admin only).
     */
    async patchEntreprise(id: number, dto: any) {
        const company = await this.userRepo.findOneBy({ id, role: 'Entreprise' });
        if (!company) throw new NotFoundException('Entreprise introuvable.');

        if (dto.nom !== undefined)     company.nom = dto.nom;
        if (dto.email !== undefined)   company.email = dto.email;
        if (dto.secteur !== undefined) company.secteur = dto.secteur;
        if (dto.ville !== undefined)   (company as any).ville = dto.ville;
        if (dto.taille !== undefined)  (company as any).taille = dto.taille;

        await this.userRepo.save(company);
        return { message: 'Entreprise mise à jour avec succès.' };
    }

    /**
     * Delete a company (Admin only).
     */
    async deleteEntreprise(id: number) {
        const company = await this.userRepo.findOneBy({ id, role: 'Entreprise' });
        if (!company) throw new NotFoundException('Entreprise introuvable.');
        await this.userRepo.remove(company);
        return { message: 'Entreprise supprimée avec succès.' };
    }

private systemMockedLogs = [
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

    /**
     * Get system logs (mocked for now).
     */
    async getLogs() {
        return this.systemMockedLogs;
    }

    /**
     * Clears system logs.
     */
    async clearLogs() {
        this.systemMockedLogs.splice(0, this.systemMockedLogs.length);
        return { message: 'Logs nettoyés avec succès' };
    }
}



