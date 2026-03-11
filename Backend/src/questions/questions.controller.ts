import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { Question } from '../entities/question.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('questions')
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) { }

    // ─── Read: All authenticated roles (Admin, Entreprise, Candidat) ────────

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les questions (authentifié)' })
    @ApiResponse({ status: 200, description: 'Liste des questions.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    findAll() {
        return this.questionsService.findAll();
    }

    @Get('by-offre/:offreId')
    @ApiOperation({ summary: 'Récupérer les questions d\'une offre d\'emploi' })
    @ApiParam({ name: 'offreId', description: 'UUID de l\'offre' })
    @ApiResponse({ status: 200, description: 'Questions de l\'offre récupérées.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    findByOffre(@Param('offreId') offreId: string) {
        return this.questionsService.findByOffre(offreId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une question par son ID (authentifié)' })
    @ApiParam({ name: 'id', description: 'ID de la question' })
    @ApiResponse({ status: 200, description: 'Question trouvée.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 404, description: 'Question introuvable.' })
    findOne(@Param('id') id: string) {
        return this.questionsService.findOne(+id);
    }

    // ─── Write: Admin + Entreprise only ─────────────────────────────────────

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Admin', 'Entreprise')
    @ApiOperation({ summary: 'Créer une question (Admin ou Entreprise)' })
    @ApiResponse({ status: 201, description: 'Question créée avec succès.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    create(@Body() data: Partial<Question>) {
        return this.questionsService.create(data);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles('Admin', 'Entreprise')
    @ApiOperation({ summary: 'Mettre à jour une question (Admin ou Entreprise)' })
    @ApiParam({ name: 'id', description: 'ID de la question' })
    @ApiResponse({ status: 200, description: 'Question mise à jour.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    update(@Param('id') id: string, @Body() data: Partial<Question>) {
        return this.questionsService.update(+id, data);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('Admin', 'Entreprise')
    @ApiOperation({ summary: 'Supprimer une question (Admin ou Entreprise)' })
    @ApiParam({ name: 'id', description: 'ID de la question' })
    @ApiResponse({ status: 200, description: 'Question supprimée.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    remove(@Param('id') id: string) {
        return this.questionsService.remove(+id);
    }
}
