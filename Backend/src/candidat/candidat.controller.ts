import { Controller, Get, Put, Body, UseGuards, Request, Query } from '@nestjs/common';
import { CandidatService } from './candidat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Candidat')
@ApiBearerAuth()
@Roles('Candidat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Candidat')
export class CandidatController {
    constructor(private readonly candidatService: CandidatService) { }

    /**
     * GET /api/Candidat/mon-profil
     * Returns the profile of the currently logged-in candidat.
     * Requires: Bearer JWT with role = Candidat.
     */
    @Get('mon-profil')
    @ApiOperation({ summary: 'Get current candidat profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden - Role insufficient.' })
    async getMonProfil(@Request() req: any) {
        return this.candidatService.getMonProfil(req.user.userId);
    }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get candidate dashboard data' })
    @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully.' })
    async getDashboard(@Request() req: any) {
        return this.candidatService.getDashboard(req.user.userId);
    }

    /**
     * GET /api/Candidat/suggestions?threshold=50&limit=6
     * Returns job offer suggestions based on the candidate's competency scores
     * obtained from completed QCMs. Skills scoring above `threshold` (default 50%)
     * are used to find matching offers via the `competences` field.
     */
    @Get('suggestions')
    @ApiOperation({ summary: 'Get skill-based job offer suggestions from QCM scores' })
    @ApiResponse({ status: 200, description: 'Suggestions returned.' })
    async getSuggestions(
        @Request() req: any,
        @Query('limit') limit?: string,
    ) {
        const lim = limit ? parseInt(limit, 10) : 6;
        return this.candidatService.getSuggestions(req.user.userId, lim);
    }

    @Put('mon-profil')
    @ApiOperation({ summary: 'Update current candidat profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
    async updateProfil(@Request() req: any, @Body() body: any) {
        return this.candidatService.updateProfil(req.user.userId, body);
    }
}
