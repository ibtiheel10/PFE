import {
    IsEmail,
    IsNotEmpty,
    IsIn,
    IsOptional,
    MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Doe' })
    @IsNotEmpty()
    nom: string;

    @ApiProperty({ example: 'John', required: false })
    @IsOptional()
    prenom?: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: ['Candidat', 'Entreprise'] })
    @IsIn(['Candidat', 'Entreprise'])
    role: 'Candidat' | 'Entreprise';

    @ApiProperty({ example: 'Informatique', required: false })
    @IsOptional()
    secteur?: string;

    @ApiProperty({ example: '1990-01-01', required: false })
    @IsOptional()
    dateNaissance?: string;
}
