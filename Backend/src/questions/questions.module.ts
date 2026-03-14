import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, OffreEmploi])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
