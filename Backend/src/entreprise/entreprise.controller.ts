import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('Entreprise')
@ApiBearerAuth()
@Roles('Entreprise')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Entreprise')
export class EntrepriseController {
    constructor(private readonly entrepriseService: EntrepriseService) { }

    // ─── Profil ──────────────────────────────────────────────────────────────

    /**
     * GET /api/Entreprise/mon-profil
     */
    @Get('mon-profil')
    @ApiOperation({ summary: 'Get current entreprise profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved.' })
    async getMonProfil(@Request() req: any) {
        return this.entrepriseService.getMonProfil(req.user.userId);
    }

    // ─── Dashboard ────────────────────────────────────────────────────────────

    /**
     * GET /api/Entreprise/dashboard
     * Returns: totalOffres, offresActives, totalCandidatures, candidaturesParMois, meilleursCandidats
     */
    @Get('dashboard')
    @ApiOperation({ summary: 'Get entreprise dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Dashboard data returned.' })
    async getDashboard(@Request() req: any) {
        return this.entrepriseService.getDashboard(req.user.userId);
    }

    // ─── Mes Postes ───────────────────────────────────────────────────────────

    /**
     * GET /api/Entreprise/mes-offres
     * Liste toutes les offres avec compteur de candidatures et jours restants.
     */
    @Get('mes-offres')
    @ApiOperation({ summary: 'Get all job offers with applicant count and days left' })
    @ApiResponse({ status: 200, description: 'List of offres returned.' })
    async getMesOffres() {
        return this.entrepriseService.getMesOffres();
    }

    /**
     * POST /api/Entreprise/offres
     * Crée une nouvelle offre d'emploi.
     * Body: { titre, description, categorie, dateLimite, typeDeContact, modeDeTravail, salaire?, localisation, experienceRequise?, nbPost? }
     */
    @Post('offres')
    @ApiOperation({ summary: 'Create a new job offer' })
    @ApiResponse({ status: 201, description: 'Offre created.' })
    async createOffre(@Body() body: any) {
        return this.entrepriseService.createOffre(body);
    }

    /**
     * PUT /api/Entreprise/offres/:id
     * Met à jour une offre existante.
     */
    @Put('offres/:id')
    @ApiOperation({ summary: 'Update a job offer' })
    @ApiParam({ name: 'id', description: 'UUID of the offre' })
    @ApiResponse({ status: 200, description: 'Offre updated.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async updateOffre(@Param('id') id: string, @Body() body: any) {
        return this.entrepriseService.updateOffre(id, body);
    }

    /**
     * DELETE /api/Entreprise/offres/:id
     * Supprime une offre d'emploi.
     */
    @Delete('offres/:id')
    @ApiOperation({ summary: 'Delete a job offer' })
    @ApiParam({ name: 'id', description: 'UUID of the offre' })
    @ApiResponse({ status: 200, description: 'Offre deleted.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async deleteOffre(@Param('id') id: string) {
        return this.entrepriseService.deleteOffre(id);
    }

    // ─── Candidats ────────────────────────────────────────────────────────────

    /**
     * GET /api/Entreprise/candidats
     * Liste tous les candidats ayant postulé à une offre, avec leur score et statut.
     */
    @Get('candidats')
    @ApiOperation({ summary: 'Get all candidates who applied to any offer' })
    @ApiResponse({ status: 200, description: 'List of candidates returned.' })
    async getAllCandidats() {
        return this.entrepriseService.getAllCandidats();
    }

    /**
     * PATCH /api/Entreprise/candidats/:id/statut
     * Met à jour le statut d'une candidature (accepter / rejeter).
     * Body: { statut: string, decision?: string }
     */
    @Patch('candidats/:id/statut')
    @ApiOperation({ summary: 'Update candidature status (accept/reject)' })
    @ApiParam({ name: 'id', description: 'Candidature ID' })
    @ApiResponse({ status: 200, description: 'Statut updated.' })
    @ApiResponse({ status: 404, description: 'Candidature not found.' })
    async updateCandidatStatut(@Param('id') id: string, @Body() body: { statut: string; decision?: string }) {
        return this.entrepriseService.updateCandidatStatut(+id, body.statut, body.decision);
    }
}
