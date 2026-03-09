import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';

@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    @Get()
    findAll() {
        return this.questionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(+id);
    }

    @Post()
    create(@Body() data: Partial<Question>) {
        return this.questionsService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<Question>) {
        return this.questionsService.update(+id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.questionsService.remove(+id);
    }
}
