import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Roles('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('Admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('seed-admin')
    @ApiOperation({ summary: 'Seed the admin user' })
    async seedAdmin() {
        return this.adminService.seedAdmin();
    }

    /**
     * GET /api/Admin/mon-profil
     * Returns the profile of the currently logged-in admin.
     * Requires: Bearer JWT with role = Admin.
     */
    @Get('mon-profil')
    @ApiOperation({ summary: 'Get current admin profile' })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Profile not found.' })
    async getMonProfil(@Request() req: any) {
        return this.adminService.getMonProfil(req.user.userId);
    }

    /**
     * GET /api/Admin/dashboard/stats
     * Returns statistics for the admin dashboard.
     * Requires: Bearer JWT with role = Admin.
     */
    @Get('dashboard/stats')
    @ApiOperation({ summary: 'Get admin dashboard statistics' })
    @ApiResponse({ status: 200, description: 'Stats retrieved successfully.' })
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    /**
     * GET /api/Admin/users
     * Returns list of all registered users for admin dashboard.
     */
    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }

    /**
     * POST /api/Admin/users
     * Creates a new user from the admin dashboard.
     */
    @Post('users')
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nom: { type: 'string', example: 'sassi' },
                prenom: { type: 'string', example: 'ali' },
                email: { type: 'string', example: 'sassiali@yopmail.com' },
                password: { type: 'string', example: 'Password123!' },
                role: { type: 'string', example: 'Candidat' },
                secteur: { type: 'string', }
            }
        }
    })
    async createUser(@Body() createUserDto: any) {
        if (!createUserDto || !createUserDto.email || !createUserDto.password) {
            throw new BadRequestException('Email et mot de passe sont requis');
        }
        return this.adminService.createUser(createUserDto);
    }

    /**
     * PUT /api/Admin/users/:id/statut
     * Toggles the active/suspended status of a user.
     */
    @Put('users/:id/statut')
    @ApiOperation({ summary: 'Toggle user active status' })
    async toggleUserStatus(@Param('id') id: string) {
        return this.adminService.toggleUserStatus(+id);
    }

    /**
     * DELETE /api/Admin/users/:id
     * Deletes a user.
     */
    @Delete('users/:id')
    @ApiOperation({ summary: 'Delete user by ID' })
    async deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(+id);
    }

    /**
     * GET /api/Admin/entreprises
     * Returns list of all companies for admin dashboard.
     */
    @Get('entreprises')
    @ApiOperation({ summary: 'Get all companies' })
    async getCompanies() {
        return this.adminService.getCompanies();
    }

    /**
     * GET /api/Admin/logs
     * Returns a list of mocked system logs.
     */
    @Get('logs')
    @ApiOperation({ summary: 'Get system logs (mocked)' })
    async getLogs() {
        return this.adminService.getLogs();
    }

    /**
     * DELETE /api/Admin/logs
     * Clears all system logs.
     */
    @Delete('logs')
    @ApiOperation({ summary: 'Clear all system logs' })
    async clearLogs() {
        return this.adminService.clearLogs();
    }
}
