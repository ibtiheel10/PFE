import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { CandidatModule } from './candidat/candidat.module';
import { EntrepriseModule } from './entreprise/entreprise.module';
import { AdminModule } from './admin/admin.module';

import { User } from './entities/user.entity';
import { OtpCode } from './entities/otp-code.entity';

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
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'projet_pfe'),
        entities: [User, OtpCode],
        synchronize: true, // Auto-creates tables — disable in production!
        logging: false,
      }),
    }),

    AuthModule,
    CandidatModule,
    EntrepriseModule,
    AdminModule,
  ],
})
export class AppModule { }
