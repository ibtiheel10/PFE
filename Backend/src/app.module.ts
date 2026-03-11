import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CandidatModule } from './candidat/candidat.module';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { AdminModule } from './admin/admin.module';

import { User } from './entities/user.entity';
import { OtpCode } from './entities/otp-code.entity';
import { OffreEmploi } from './entities/offre-emploi.entity';
import { Candidature } from './entities/candidature.entity';
import { Question } from './entities/question.entity';
import { ReponseCandidat } from './entities/reponse-candidat.entity';
import { OffresModule } from './offres/offres.module';
import { CandidaturesModule } from './candidatures/candidatures.module';
import { QuestionsModule } from './questions/questions.module';

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
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat],
        synchronize: true, // Auto-creates tables — disable in production!
        logging: true,
      }),
    }),

    AuthModule,
    CandidatModule,
    EntrepriseModule,
    AdminModule,
    OffresModule,
    CandidaturesModule,
    QuestionsModule,
  ],
})
export class AppModule { }
