import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiService } from './ai.service';
import { Question } from '../entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question])],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
