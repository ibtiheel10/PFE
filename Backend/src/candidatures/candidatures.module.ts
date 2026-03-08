import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidaturesController } from './candidatures.controller';
import { CandidaturesService } from './candidatures.service';
import { Candidature } from '../entities/candidature.entity';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidature, User, OffreEmploi])],
  controllers: [CandidaturesController],
  providers: [CandidaturesService],
  exports: [CandidaturesService]
})
export class CandidaturesModule { }
