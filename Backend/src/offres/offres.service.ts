import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, IsNull } from 'typeorm';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';

@Injectable()
export class OffresService {
    constructor(
        @InjectRepository(OffreEmploi)
        private readonly offreEmploiRepository: Repository<OffreEmploi>,
    ) { }

    async create(createOffreDto: CreateOffreDto): Promise<OffreEmploi> {
        const newOffre = this.offreEmploiRepository.create(createOffreDto);
        return await this.offreEmploiRepository.save(newOffre);
    }


    async findAll(): Promise<OffreEmploi[]> {
        const now = new Date();

        return await this.offreEmploiRepository.find({
            where: [
                { DateLimite: MoreThanOrEqual(now) },
                { DateLimite: IsNull() }
            ],
            relations: ['entreprise'],
            order: { DatePublication: 'DESC' },
        });
    }

    async findOne(id: string): Promise<OffreEmploi> { // Original findOne for OffreEmploi
        const offre = await this.offreEmploiRepository.findOne({ 
            where: { id },
            relations: ['entreprise']
        });
        if (!offre) {
            throw new NotFoundException(`L'offre d'emploi avec l'ID ${id} n'a pas été trouvée.`);
        }
        return offre;
    }

    async update(id: string, updateOffreDto: UpdateOffreDto): Promise<OffreEmploi> {
        const offre = await this.findOne(id);
        Object.assign(offre, updateOffreDto);
        return await this.offreEmploiRepository.save(offre);
    }

    async remove(id: string): Promise<{ message: string }> {
        const offre = await this.findOne(id);
        await this.offreEmploiRepository.remove(offre);
        return { message: `L'offre d'emploi a été supprimée avec succès.` };
    }
}
