import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { OffresController } from './offres.controller';
import { OffresService } from './offres.service';

@Module({
  imports: [TypeOrmModule.forFeature([OffreEmploi])],
  controllers: [OffresController],
  providers: [OffresService],
  exports: [OffresService]
})
export class OffresModule { }
