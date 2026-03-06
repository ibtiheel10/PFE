import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class EntrepriseService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    /**
     * Returns the profile of the currently logged-in entreprise.
     * @param userId - extracted from the JWT token
     */
    async getMonProfil(userId: number) {
        const user = await this.userRepo.findOne({
            where: { id: userId, role: 'Entreprise' },
            select: ['id', 'nom', 'email', 'secteur'],
        });

        if (!user) {
            throw new NotFoundException('Profil entreprise introuvable.');
        }

        return user;
    }
}
