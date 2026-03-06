import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidatController } from './candidat.controller';
import { CandidatService } from './candidat.service';
import { User } from '../entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [CandidatController],
    providers: [CandidatService],
})
export class CandidatModule { }
