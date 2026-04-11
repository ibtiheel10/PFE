import { Controller, Post, Get, Delete, Param, UseGuards, Request, HttpCode, HttpStatus, ConflictException, ForbiddenException, Body } from '@nestjs/common';
import { CandidaturesService } from './candidatures.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Candidatures')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('candidatures')
export class CandidaturesController {
    constructor(private readonly candidaturesService: CandidaturesService) { }

    @Post('apply/:offreId')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Postuler à une offre d\'emploi' })
    @ApiParam({ name: 'offreId', description: 'ID de l\'offre (UUID)' })
    @ApiResponse({ status: 201, description: 'Candidature envoyée avec succès.' })
    @ApiResponse({ status: 404, description: 'Offre ou candidat introuvable.' })
    @ApiResponse({ status: 409, description: 'Déjà postulé à cette offre.' })
    @HttpCode(HttpStatus.CREATED)
    async apply(@Request() req: any, @Param('offreId') offreId: string) {
        return await this.candidaturesService.apply(req.user.userId, offreId);
    }

    @Get('my-applications')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Récupérer mes candidatures' })
    @ApiResponse({ status: 200, description: 'Liste de vos candidatures.' })
    async getMyApplications(@Request() req: any) {
        return await this.candidaturesService.getMyApplications(req.user.userId);
    }

    @Get('stats')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Récupérer les statistiques de progression (Résultats)' })
    @ApiResponse({ status: 200, description: 'Statistiques récupérées avec succès.' })
    async getMyStats(@Request() req: any) {
        return await this.candidaturesService.getMyStats(req.user.userId);
    }

    @Get(':id/evaluation')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Récupérer les questions d\'une évaluation' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    @ApiResponse({ status: 200, description: 'Questions récupérées avec succès.' })
    async getEvaluationQuestions(@Param('id') id: string, @Request() req: any) {
        return await this.candidaturesService.getEvaluationQuestions(+id, req.user.userId);
    }

    @Post(':id/evaluation')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Soumettre les réponses d\'une évaluation' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    @ApiResponse({ status: 200, description: 'Évaluation soumise avec succès.' })
    async submitEvaluation(
        @Param('id') id: string,
        @Body() body: any,
        @Request() req: any,
    ) {
        console.log("--- [DEBUG] Controller received body:", JSON.stringify(body));

        // Handle both: 
        // 1. { "answers": { "43": 1 }, "tempsEcoule": "0:30" }
        // 2. { "43": 1, "44": 1 } (flat body)
        let answers = body.answers || body;
        const tempsEcoule = body.tempsEcoule;

        // If body represents the answers directly but also has tempsEcoule,
        // we might need to remove tempsEcoule from the answers map if it exists
        if (body.answers) {
            answers = body.answers;
        } else {
            // It's a flat body, answers = body
            // (The service will ignore non-numeric keys like "tempsEcoule" anyway)
        }

        return await this.candidaturesService.submitEvaluation(+id, req.user.userId, answers ?? {}, tempsEcoule);
    }

    @Get(':id/result')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Récupérer les détails d\'un résultat spécifique' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    async getResult(@Param('id') id: string, @Request() req: any) {
        const candidature = await this.candidaturesService.findOne(+id);
        if (candidature.candidat.id !== req.user.userId) {
            throw new ConflictException('Accès refusé à ce résultat.');
        }
        if (candidature.score === null || candidature.score === undefined) {
            throw new ForbiddenException('Le résultat n\'est pas encore disponible. Terminez l\'évaluation d\'abord.');
        }
        return candidature;
    }

    @Post(':id/forfeit')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Annuler une évaluation pour fraude (score 0, statut Refusé)' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    @ApiResponse({ status: 200, description: 'Évaluation annulée.' })
    async forfeitEvaluation(
        @Param('id') id: string,
        @Body() body: { reason?: string },
        @Request() req: any,
    ) {
        return await this.candidaturesService.forfeitEvaluation(+id, req.user.userId, body?.reason || 'Comportement frauduleux détecté');
    }

    @Delete(':id')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Annuler une candidature en attente' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    @ApiResponse({ status: 200, description: 'Candidature annulée avec succès.' })
    @ApiResponse({ status: 409, description: 'Impossible d\'annuler cette candidature.' })
    async deleteApplication(@Param('id') id: string, @Request() req: any) {
        await this.candidaturesService.deleteApplication(+id, req.user.userId);
        return { message: 'Candidature annulée avec succès.' };
    }

    @Post('resync-statuses')
    @Roles('Entreprise', 'Admin')
    @ApiOperation({ summary: 'Resynchroniser tous les statuts selon le classement Top 5' })
    async resyncStatuses() {
        return await this.candidaturesService.resyncAllStatuses();
    }
}
