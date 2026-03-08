import { Controller, Post, Get, Delete, Param, UseGuards, Request, HttpCode, HttpStatus, ConflictException } from '@nestjs/common';
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

    @Get(':id/result')
    @Roles('Candidat')
    @ApiOperation({ summary: 'Récupérer les détails d\'un résultat spécifique' })
    @ApiParam({ name: 'id', description: 'ID de la candidature' })
    async getResult(@Param('id') id: string, @Request() req: any) {
        const candidature = await this.candidaturesService.findOne(+id);
        if (candidature.candidat.id !== req.user.userId) {
            throw new ConflictException('Accès refusé à ce résultat.');
        }
        return candidature;
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
}
