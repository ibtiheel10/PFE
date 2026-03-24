import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../entities/user.entity';
import { Candidature } from '../entities/candidature.entity';
import { OffreEmploi } from '../entities/offre-emploi.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Candidature, OffreEmploi])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
