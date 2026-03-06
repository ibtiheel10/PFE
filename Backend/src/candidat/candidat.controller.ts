import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
}
