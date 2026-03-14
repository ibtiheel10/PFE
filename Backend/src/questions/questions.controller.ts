import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, Patch } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Questions')
@ApiBearerAuth()
@Roles('Entreprise')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get('by-offre/:offreId')
  @ApiOperation({ summary: 'Get all questions for a specific job offer' })
  @ApiParam({ name: 'offreId', description: 'ID of the job offer' })
  @ApiResponse({ status: 200, description: 'Questions retrieved.' })
  async getQuestionsByOffre(@Param('offreId') offreId: string, @Request() req: any) {
    return this.questionsService.getQuestionsByOffre(offreId, req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Save an AI-generated question' })
  @ApiResponse({ status: 201, description: 'Question saved.' })
  async createQuestion(@Body() body: any, @Request() req: any) {
    return this.questionsService.createQuestion(body, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a question' })
  @ApiParam({ name: 'id', description: 'ID of the question' })
  @ApiResponse({ status: 200, description: 'Question deleted.' })
  async deleteQuestion(@Param('id') id: string, @Request() req: any) {
    return this.questionsService.deleteQuestion(+id, req.user.userId);
  }

  @Patch('publish/:offreId')
  @ApiOperation({ summary: 'Publish QCM for an offer' })
  @ApiParam({ name: 'offreId', description: 'ID of the job offer' })
  @ApiResponse({ status: 200, description: 'QCM published.' })
  async publishQcm(@Param('offreId') offreId: string, @Request() req: any) {
    return this.questionsService.publishQcm(offreId, req.user.userId);
  }
}
