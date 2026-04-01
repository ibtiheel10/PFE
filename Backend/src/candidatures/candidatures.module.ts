import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidaturesController } from './candidatures.controller';
import { CandidaturesService } from './candidatures.service';
import { Candidature } from '../entities/candidature.entity';
import { User } from '../entities/user.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Question } from '../entities/question.entity';
import { ReponseCandidat } from '../entities/reponse-candidat.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Candidature, User, OffreEmploi, Question, ReponseCandidat]), NotificationsModule, AiModule],
  controllers: [CandidaturesController],
  providers: [CandidaturesService],
  exports: [CandidaturesService]
})
export class CandidaturesModule { }
