import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { OffreEmploi } from '../entities/offre-emploi.entity';
import { Candidature } from '../entities/candidature.entity';
import { QcmReminderService } from './qcm-reminder.service';

@Module({
    imports: [TypeOrmModule.forFeature([Notification, User, OffreEmploi, Candidature])],
    providers: [NotificationsService, QcmReminderService],
    controllers: [NotificationsController],
    exports: [NotificationsService, QcmReminderService],
})
export class NotificationsModule { }
