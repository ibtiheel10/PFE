import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepriseController } from './entreprise.controller';
import { EntrepriseService } from './entreprise.service';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [EntrepriseController],
    providers: [EntrepriseService],
})
export class EntrepriseModule { }
