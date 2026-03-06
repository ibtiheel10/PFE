import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    /**
     * GET /api/Admin/mon-profil
     * Returns the profile of the currently logged-in admin.
     * Requires: Bearer JWT with role = Admin.
     */
    @UseGuards(JwtAuthGuard)
    @Get('mon-profil')
    @ApiOperation({ summary: 'Get current admin profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Profile not found.' })
    async getMonProfil(@Request() req: any) {
        return this.adminService.getMonProfil(req.user.userId);
    }
}
