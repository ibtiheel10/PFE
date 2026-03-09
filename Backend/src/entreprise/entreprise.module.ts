import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepriseController } from './entreprise.controller';
import { EntrepriseService } from './entreprise.service';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, OffreEmploi, Candidature])],
    controllers: [EntrepriseController],
    providers: [EntrepriseService],
})
export class EntrepriseModule { }
