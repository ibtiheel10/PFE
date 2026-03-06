import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class CandidatService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

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
}
