import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, IsNull, DataSource } from 'typeorm';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Question } from '../entities/question.entity';
import { Candidature } from '../entities/candidature.entity';
import { ReponseCandidat } from '../entities/reponse-candidat.entity';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';

@Injectable()
export class OffresService {
    constructor(
        @InjectRepository(OffreEmploi)
        private readonly offreEmploiRepository: Repository<OffreEmploi>,
        private readonly dataSource: DataSource,
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
            relations: ['entreprise', 'candidatures', 'questions']
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
        
        await this.dataSource.transaction(async transactionalEntityManager => {
            // Delete questions associated with the offer
            await transactionalEntityManager.delete(Question, { offre: { id: offre.id } });
            
            // Delete candidatures associated with the offer
            const candidatures = await transactionalEntityManager.find(Candidature, {
                where: { offre: { id: offre.id } },
                select: ['id']
            });
            
            if (candidatures.length > 0) {
                const candidatureIds = candidatures.map(c => c.id);
                // Delete responses
                await transactionalEntityManager.createQueryBuilder()
                    .delete()
                    .from(ReponseCandidat)
                    .where('candidature_id IN (:...ids)', { ids: candidatureIds })
                    .execute();
                    
                // Delete candidatures
                await transactionalEntityManager.delete(Candidature, { offre: { id: offre.id } });
            }
            
            // Finally delete the offer
            await transactionalEntityManager.remove(offre);
        });

        return { message: `L'offre d'emploi a été supprimée avec succès.` };
    }
}
