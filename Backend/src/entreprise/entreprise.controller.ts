import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateOffreDto {
    @ApiProperty({ example: 'Développeur Full Stack' })
    @IsString()
    @IsNotEmpty()
    titre: string;

    @ApiProperty({ example: 'Description détaillée de l\'offre...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Informatique' })
    @IsString()
    @IsNotEmpty()
    categorie: string;

    @ApiProperty({ example: '2026-12-31T23:59:59Z', required: false })
    @IsOptional()
    dateLimite?: string;

    @ApiProperty({ example: 'CDI', required: false })
    @IsOptional()
    @IsString()
    typeDeContrat?: string;

    @ApiProperty({ example: 'Hybride', required: false })
    @IsOptional()
    @IsString()
    modeDeTravail?: string;

    @ApiProperty({ example: 3000, required: false })
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Le salaire ne peut pas être négatif.' })
    salaire?: number;

    @ApiProperty({ example: 'Paris', required: false })
    @IsOptional()
    @IsString()
    localisation?: string;

    @ApiProperty({ example: '3 ans', required: false })
    @IsOptional()
    @IsString()
    experienceRequise?: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    nbPost?: number;

    @ApiProperty({ example: 'Vue.js, TypeScript...', required: false })
    @IsOptional()
    @IsString()
    competences?: string;
}

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
    async getMesOffres(@Request() req: any) {
        return this.entrepriseService.getMesOffres(req.user.userId);
    }

    /**
     * POST /api/Entreprise/offres
     * Crée une nouvelle offre d'emploi.
     */
    @Post('offres')
    @ApiOperation({ summary: 'Create a new job offer' })
    @ApiBody({ type: CreateOffreDto })
    @ApiResponse({ status: 201, description: 'Offre created.' })
    async createOffre(@Body() body: CreateOffreDto, @Request() req: any) {
        return this.entrepriseService.createOffre({ ...body, userId: req.user.userId });
    }

    /**
     * PUT /api/Entreprise/offres/:id
     * Met à jour une offre existante.
     */
    @Put('offres/:id')
    @ApiOperation({ summary: 'Update a job offer' })
    @ApiParam({ name: 'id', description: 'UUID of the offre' })
    @ApiBody({ type: CreateOffreDto })
    @ApiResponse({ status: 200, description: 'Offre updated.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async updateOffre(@Param('id') id: string, @Body() body: any, @Request() req: any) {
        return this.entrepriseService.updateOffre(id, req.user.userId, body);
    }

    /**
     * DELETE /api/Entreprise/offres/:id
     * Supprime une offre (seulement si propriétaire).
     */
    @Delete('offres/:id')
    @ApiOperation({ summary: 'Delete job offer (Owner only)' })
    @ApiParam({ name: 'id', description: 'ID of the offre to delete' })
    @ApiResponse({ status: 200, description: 'Offre deleted.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the owner.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async deleteOffre(@Param('id') id: string, @Request() req: any) {
        return this.entrepriseService.deleteOffre(id, req.user.userId);
    }

    /**
     * GET /api/Entreprise/offres/:id/questions
     * Récupère les questions générées pour une offre spécifique.
     */
    @Get('offres/:id/questions')
    @ApiOperation({ summary: 'Get generated questions for a specific job offer' })
    @ApiParam({ name: 'id', description: 'ID of the offre' })
    @ApiResponse({ status: 200, description: 'Questions retrieved successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the owner.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async getQuestionsByOffre(@Param('id') id: string, @Request() req: any) {
        return this.entrepriseService.getQuestionsByOffre(id, req.user.userId);
    }

    // ─── Génération IA pour une offre ─────────────────────────────────────────

    /**
     * POST /api/Entreprise/offres/:id/generer-questions-ia
     * Génère et sauvegarde des questions pour l'offre spécifiée.
     */
    @Post('offres/:id/generer-questions-ia')
    @ApiOperation({ summary: 'Generate and save AI questions for a job offer' })
    @ApiParam({ name: 'id', description: 'ID of the offre' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                difficulte: { type: 'string', enum: ['Facile', 'Moyen', 'Difficile'], default: 'Moyen' }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'Questions generated and saved successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the owner.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async genererQuestionsIA(
        @Param('id') id: string,
        @Body() body: { difficulte?: 'Facile' | 'Moyen' | 'Difficile' },
        @Request() req: any
    ) {
        return this.entrepriseService.genererQuestionsIA(id, req.user.userId, body.difficulte || 'Moyen');
    }

    /**
     * POST /api/Entreprise/offres/:id/regenerer-questions-ia
     * Régénère de nouvelles questions (qui remplacent les anciennes) pour l'offre spécifiée.
     */
    @Post('offres/:id/regenerer-questions-ia')
    @ApiOperation({ summary: 'Regenerate and replace AI questions for a job offer' })
    @ApiParam({ name: 'id', description: 'ID of the offre' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                difficulte: { type: 'string', enum: ['Facile', 'Moyen', 'Difficile'], default: 'Moyen' },
                previousQuestions: { type: 'array', items: { type: 'string' } },
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Questions regenerated successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not the owner.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async regenererQuestionsIA(
        @Param('id') id: string,
        @Body() body: { difficulte?: 'Facile' | 'Moyen' | 'Difficile', previousQuestions?: string[] },
        @Request() req: any
    ) {
        return this.entrepriseService.regenererQuestionsIA(
            id,
            req.user.userId,
            body.difficulte || 'Moyen',
            body.previousQuestions || []
        );
    }

    /**
     * PATCH /api/Entreprise/questions/:id/verifier-reponse
     * Permet au recruteur de corriger manuellement la bonne reponse et de valider la question.
     * Body: { correctAnswer: string }
     */
    @Patch('questions/:id/verifier-reponse')
    @ApiOperation({ summary: 'Manually verify and set the correct answer for a generated question' })
    @ApiParam({ name: 'id', description: 'ID of the question to verify' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['correctAnswer'],
            properties: {
                correctAnswer: { type: 'string', description: 'The correct answer text (must match one of the 4 options)' }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Question verified successfully.' })
    @ApiResponse({ status: 404, description: 'Question not found.' })
    async verifierReponseQuestion(
        @Param('id') id: string,
        @Body() body: { correctAnswer: string }
    ) {
        return this.entrepriseService.verifierReponseQuestion(+id, body.correctAnswer);
    }

    /**
     * POST /api/Entreprise/offres/:id/recommandation-ia
     * Génère une recommandation (forces, faiblesses, conseils) basée sur les résultats d'un test pour cette offre.
     */
    @Post('offres/:id/recommandation-ia')
    @ApiOperation({ summary: 'Generate AI recommendation from test results on an offer' })
    @ApiParam({ name: 'id', description: 'ID of the offre' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                results: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            question: { type: 'string' },
                            selectedAnswer: { type: 'string' },
                            correctAnswer: { type: 'string' },
                            isCorrect: { type: 'boolean' }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Recommendation generated.' })
    @ApiResponse({ status: 404, description: 'Offre not found.' })
    async recommandationIA(
        @Param('id') id: string,
        @Body() body: { results: any[] },
        @Request() req: any
    ) {
        return this.entrepriseService.recommandationIA(id, req.user.userId, body.results || []);
    }

    // ─── Candidats ────────────────────────────────────────────────────────────

    /**
     * GET /api/Entreprise/candidats
     * Liste tous les candidats ayant postulé à une offre, avec leur score et statut.
     */
    @Get('candidats')
    @ApiOperation({ summary: 'Get all candidates who applied to this entreprise offers' })
    @ApiResponse({ status: 200, description: 'List of candidates returned.' })
    async getAllCandidats(@Request() req: any) {
        return this.entrepriseService.getAllCandidats(req.user.userId);
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
