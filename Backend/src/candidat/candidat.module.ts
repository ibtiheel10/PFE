import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatController } from './candidat.controller';
import { CandidatService } from './candidat.service';
import { User } from '../entities/user.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { SuggestionModule } from '../suggestion/suggestion.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Candidature, OffreEmploi]), SuggestionModule],
    controllers: [CandidatController],
    providers: [CandidatService],
})
export class CandidatModule { }
