import { IsString, IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOffreDto {
    @ApiProperty({ description: 'Titre du poste à pourvoir' })
    @IsString()
    @IsNotEmpty()
    TitreDePost: string;

    @ApiProperty({ description: 'Description détaillée de l\'offre' })
    @IsString()
    @IsNotEmpty()
    Description: string;

    @ApiProperty({ description: 'Catégorie professionnelle (ex: IT, Finance)' })
    @IsString()
    @IsNotEmpty()
    Categorie: string;

    @ApiPropertyOptional({ description: 'Date limite pour postuler', type: String, format: 'date-time' })
    @IsOptional()
    @IsDateString()
    DateLimite?: Date;

    @ApiPropertyOptional({ description: 'Date et heure de lancement du QCM', type: String, format: 'date-time' })
    @IsOptional()
    @IsDateString()
    dateLancementQcm?: Date;

    @ApiPropertyOptional({ description: 'Type de contrat (CDI, CDD, Stage, etc.)' })
    @IsOptional()
    @IsString()
    TypeDeContrat?: string;

    @ApiPropertyOptional({ description: 'Mode de travail (Sur site, Hybride, Remote)' })
    @IsOptional()
    @IsString()
    ModeDeTravail?: string;

    @ApiPropertyOptional({ description: 'Salaire proposé pour le poste' })
    @IsOptional()
    @IsNumber()
    Salaire?: number;

    @ApiPropertyOptional({ description: 'Localisation de l\'entreprise ou du poste' })
    @IsOptional()
    @IsString()
    Localisation?: string;

    @ApiPropertyOptional({ description: 'Niveau d\'expérience requis' })
    @IsOptional()
    @IsString()
    ExperienceRequise?: string;

    @ApiPropertyOptional({ description: 'Nombre de postes ouverts', default: 1 })
    @IsOptional()
    @IsNumber()
    NbPost?: number;
}
