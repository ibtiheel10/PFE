import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  HttpCode,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

// ── File upload config ───────────────────────────────────────────
const fileUploadOptions = {
  storage: diskStorage({
    destination: './uploads/contact',
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req: any, file: any, cb: any) => {
    const allowed = /\.(pdf|doc|docx|png|jpg|jpeg)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non supporté. Utilisez PDF, DOC, PNG ou JPG.'), false);
    }
  },
};

// ── Controller ───────────────────────────────────────────────────
@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  // ── PUBLIC: Submit contact form ──────────────────────────────
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', fileUploadOptions))
  @ApiOperation({ summary: 'Soumettre un message de contact (public)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Message enregistré avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  async create(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) dto: CreateContactDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const saved = await this.contactService.create(dto, file);
    return {
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons sous 24h.',
      id: saved.id,
    };
  }

  // ── ADMIN: Get all messages ──────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer tous les messages de contact (Admin)' })
  @ApiResponse({ status: 200, description: 'Liste des messages.' })
  async findAll() {
    return this.contactService.findAll();
  }

  // ── ADMIN: Stats ─────────────────────────────────────────────
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques des messages de contact (Admin)' })
  async getStats() {
    return this.contactService.getStats();
  }

  // ── ADMIN: Get one message (auto-marks as "Lu") ──────────────
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer un message par ID (Admin) — marque comme Lu' })
  @ApiResponse({ status: 200, description: 'Message trouvé.' })
  @ApiResponse({ status: 404, description: 'Message introuvable.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.findOne(id);
  }

  // ── ADMIN: Mark as "Traité" ──────────────────────────────────
  @Patch(':id/statut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer un message comme "Traité" (Admin)' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Message introuvable.' })
  async markTraite(@Param('id', ParseIntPipe) id: number) {
    return this.contactService.markTraite(id);
  }

  // ── ADMIN: Delete ────────────────────────────────────────────
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Supprimer un message de contact (Admin)' })
  @ApiResponse({ status: 200, description: 'Message supprimé.' })
  @ApiResponse({ status: 404, description: 'Message introuvable.' })
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.contactService.deleteOne(id);
    return { success: true, message: 'Message supprimé avec succès.' };
  }
}
