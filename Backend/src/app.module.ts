import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './auth/auth.module';
import { CandidatModule } from './candidat/candidat.module';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { AdminModule } from './admin/admin.module';
import { AiModule } from './ai/ai.module';
import { ContactModule } from './contact/contact.module';

import { User } from './entities/user.entity';
import { OtpCode } from './entities/otp-code.entity';
import { OffreEmploi } from './entities/offre-emploi.entity';
import { Candidature } from './entities/candidature.entity';
import { Question } from './entities/question.entity';
import { ReponseCandidat } from './entities/reponse-candidat.entity';
import { Notification } from './entities/notification.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { OffresModule } from './offres/offres.module';
import { CandidaturesModule } from './candidatures/candidatures.module';
import { QuestionsModule } from './questions/questions.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    // Load .env
    ConfigModule.forRoot({ isGlobal: true }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'admin123'),
        database: configService.get<string>('DB_NAME', 'skillvia_db_2'),
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
        synchronize: true, // Auto-creates tables — disable in production!
        logging: true, // Enabled logging as required to monitor slow queries
        extra: {
          max: 10,                     // Max connections in pool
          min: 1,                      // Min connections kept open
          idleTimeoutMillis: 10000,    // Close idle connections after 10s
          connectionTimeoutMillis: 10000, // Augmented timeout 10s
        },
      }),
    }),

    AuthModule,
    CandidatModule,
    EntrepriseModule,
    AdminModule,
    OffresModule,
    CandidaturesModule,
    AiModule,
    QuestionsModule,
    NotificationsModule,
    ContactModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule { }
