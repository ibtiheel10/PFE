import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
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
}
