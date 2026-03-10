import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OffresService } from './offres.service';
import { CreateOffreDto } from './dto/create-offre.dto';
import { UpdateOffreDto } from './dto/update-offre.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Offres')
@Controller('offres')
export class OffresController {
    constructor(private readonly offresService: OffresService) { }

    // ─── Public: Candidats can browse offers ────────────────────────────────

    @Get()
    @ApiOperation({ summary: 'Récupérer toutes les offres d\'emploi (public)' })
    @ApiResponse({ status: 200, description: 'Liste de toutes les offres d\'emploi.' })
    findAll() {
        return this.offresService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Récupérer une offre d\'emploi par son ID (public)' })
    @ApiParam({ name: 'id', description: 'ID unique de l\'offre' })
    @ApiResponse({ status: 200, description: 'L\'offre d\'emploi a été trouvée.' })
    @ApiResponse({ status: 404, description: 'L\'offre d\'emploi avec cet ID n\'existe pas.' })
    findOne(@Param('id') id: string) {
        return this.offresService.findOne(id);
    }

    // ─── Protected: Entreprise only ─────────────────────────────────────────

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Entreprise')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Créer une nouvelle offre d\'emploi (Entreprise)' })
    @ApiResponse({ status: 201, description: 'L\'offre a été créée avec succès.' })
    @ApiResponse({ status: 400, description: 'Requête invalide.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createOffreDto: CreateOffreDto) {
        return this.offresService.create(createOffreDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Entreprise')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Mettre à jour une offre d\'emploi existante (Entreprise)' })
    @ApiParam({ name: 'id', description: 'ID unique de l\'offre' })
    @ApiResponse({ status: 200, description: 'L\'offre a été mise à jour avec succès.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    @ApiResponse({ status: 404, description: 'L\'offre d\'emploi n\'existe pas.' })
    update(@Param('id') id: string, @Body() updateOffreDto: UpdateOffreDto) {
        return this.offresService.update(id, updateOffreDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Entreprise')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Supprimer une offre d\'emploi existante (Entreprise)' })
    @ApiParam({ name: 'id', description: 'ID unique de l\'offre' })
    @ApiResponse({ status: 200, description: 'L\'offre a été supprimée avec succès.' })
    @ApiResponse({ status: 401, description: 'Non authentifié.' })
    @ApiResponse({ status: 403, description: 'Rôle insuffisant.' })
    @ApiResponse({ status: 404, description: 'L\'offre d\'emploi n\'existe pas.' })
    remove(@Param('id') id: string) {
        return this.offresService.remove(id);
    }
}
