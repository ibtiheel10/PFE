import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AiService } from './ai.service';
import type {
  QuizQuestion,
  TestResult,
  AIRecommendation,
  DifficultyLevel,
} from './ai.service';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export class GenerateQuestionsDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsEnum(['facile', 'moyen', 'difficile'])
  @IsOptional()
  difficulty?: DifficultyLevel = 'moyen';

  @IsOptional()
  timer?: number;
}

export class RegenerateQuestionsDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsEnum(['facile', 'moyen', 'difficile'])
  @IsOptional()
  difficulty?: DifficultyLevel = 'moyen';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  previousQuestions?: string[] = [];

  @IsOptional()
  timer?: number;
}

export class TestResultItemDto implements TestResult {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsString()
  @IsNotEmpty()
  selectedAnswer: string;

  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @IsBoolean()
  isCorrect: boolean;
}

export class RecommendationDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TestResultItemDto)
  results: TestResultItemDto[];
}

// ─── Controller ───────────────────────────────────────────────────────────────

@ApiTags('AI')
@Controller('ai')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AiController {
  constructor(private readonly aiService: AiService) { }

  // ── POST /ai/generate-questions ──────────────────────────────────────────────
  @Post('generate-questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Générer 5 QCM basés sur une description de poste',
  })
  @ApiBody({ type: GenerateQuestionsDto })
  @ApiResponse({
    status: 200,
    description: 'Questions générées avec succès.',
  })
  async generateQuestions(
    @Body() dto: GenerateQuestionsDto,
  ): Promise<any> {
    const rawQuestions = await this.aiService.generateQuestions(
      dto.jobDescription,
      dto.difficulty ?? 'moyen',
      null,
    );
    return this.formatQuestionsResponse(rawQuestions);
  }

  // ── POST /ai/regenerate-questions ────────────────────────────────────────────
  @Post('regenerate-questions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Régénérer de nouvelles questions différentes des précédentes',
  })
  @ApiBody({ type: RegenerateQuestionsDto })
  @ApiResponse({
    status: 200,
    description: 'Questions régénérées avec succès.',
  })
  async regenerateQuestions(
    @Body() dto: RegenerateQuestionsDto,
  ): Promise<any> {
    const rawQuestions = await this.aiService.regenerateQuestions(
      dto.jobDescription,
      dto.difficulty ?? 'moyen',
      dto.previousQuestions ?? [],
    );
    return this.formatQuestionsResponse(rawQuestions);
  }

  private formatQuestionsResponse(questions: any[]): any {
    const formattedQuestions = questions.map((q) => {
      // Handle both Question entity and QuizQuestion interface
      const questionText = q.contenu ? q.contenu.question : q.question;
      const options = q.contenu ? q.contenu.options : q.options;

      return {
        id: q.id,
        question: questionText,
        options: options.map((opt: any) => ({
          text: typeof opt === 'string' ? opt : opt.text,
          isCorrect: typeof opt === 'object' ? !!opt.isCorrect : false,
        })),
        niveauDifficulte: q.niveauDifficulte || 'Moyen',
        chronometre: q.chronometre || 30,
        createdAt: q.createdAt || new Date().toISOString(),
      };
    });

    return {
      message: 'Questions générées avec succès',
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
    };
  }

  // ── POST /ai/recommendation ──────────────────────────────────────────────────
  @Post('recommendation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtenir une recommandation IA personnalisée après le test',
  })
  @ApiBody({ type: RecommendationDto })
  @ApiResponse({
    status: 200,
    description:
      'Recommandation générée : points forts, points faibles, conseils.',
  })
  async getRecommendation(
    @Body() dto: RecommendationDto,
  ): Promise<AIRecommendation> {
    return this.aiService.generateRecommendation(
      dto.jobDescription,
      dto.results,
    );
  }
}
