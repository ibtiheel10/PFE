import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { EntrepriseService } from './entreprise.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Entreprise')
@ApiBearerAuth()
@Roles('Entreprise')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Entreprise')
export class EntrepriseController {
    constructor(private readonly entrepriseService: EntrepriseService) { }

    /**
     * GET /api/Entreprise/mon-profil
     * Returns the profile of the currently logged-in entreprise.
     * Requires: Bearer JWT with role = Entreprise.
     */
    @UseGuards(JwtAuthGuard)
    @Get('mon-profil')
    @ApiOperation({ summary: 'Get current entreprise profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Profile not found.' })
    async getMonProfil(@Request() req: any) {
        return this.entrepriseService.getMonProfil(req.user.userId);
    }
}
