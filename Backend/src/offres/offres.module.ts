import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffresController } from './offres.controller';
import { OffresService } from './offres.service';
import { OffresCronService } from './offres-cron.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OffreEmploi, Candidature]),
    NotificationsModule
  ],
  controllers: [OffresController],
  providers: [OffresService, OffresCronService],
  exports: [OffresService]
})
export class OffresModule { }
