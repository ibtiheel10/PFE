import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ScoringService } from './scoring.service';
import { Question } from '../entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  controllers: [AiController],
  providers: [AiService, ScoringService],
  exports: [AiService, ScoringService],
})
export class AiModule {}
