import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
    ) { }

    async findAll() {
        return await this.questionRepo.find({ relations: ['offre'] });
    }

    async findByOffre(offreId: string) {
        return await this.questionRepo.find({
            where: { offre: { id: offreId } },
            relations: ['offre'],
        });
    }

    async findOne(id: number) {
        const question = await this.questionRepo.findOneBy({ id });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return question;
    }

    async create(data: Partial<Question>) {
        const question = this.questionRepo.create(data);
        return await this.questionRepo.save(question);
    }

    async update(id: number, data: Partial<Question>) {
        await this.findOne(id);
        await this.questionRepo.update(id, data);
        return await this.findOne(id);
    }

    async remove(id: number) {
        const question = await this.findOne(id);
        await this.questionRepo.remove(question);
        return { message: 'Question deleted successfully' };
    }
}
