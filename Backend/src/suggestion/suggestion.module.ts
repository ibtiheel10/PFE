import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { SuggestionService } from './suggestion.service';
import { SuggestionController } from './suggestion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Candidature, OffreEmploi])],
  controllers: [SuggestionController],
  providers: [SuggestionService],
  exports: [SuggestionService], // exported so CandidatModule can delegate to it
})
export class SuggestionModule {}
