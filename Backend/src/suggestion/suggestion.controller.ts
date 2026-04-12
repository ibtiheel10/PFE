import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SuggestionService } from './suggestion.service';

@ApiTags('Suggestions')
@ApiBearerAuth()
@Roles('Candidat')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suggestions')
export class SuggestionController {
  constructor(private readonly suggestionService: SuggestionService) {}

  /**
   * GET /api/suggestions?limit=6
   *
   * Returns ranked job-offer suggestions personalised for the authenticated candidate,
   * based on competency scores obtained during QCM sessions.
   *
   * Response shape:
   *  {
   *    strongSkills:          [{ name, avgScore, type }],
   *    suggestions:           [{ id, titre, matchScore, matchedSkills, missingSkills, reason, … }],
   *    totalSkillsIdentified: number,
   *    message:               string
   *  }
   */
  @Get()
  @ApiOperation({
    summary: 'Get personalised job-offer suggestions based on QCM competency scores',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max suggestions returned (default 6)' })
  @ApiResponse({ status: 200, description: 'Suggestions returned successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getSuggestions(@Request() req: any, @Query('limit') limit?: string) {
    const max = limit ? parseInt(limit, 10) : 6;
    return this.suggestionService.getSuggestions(req.user.userId, max);
  }
}
