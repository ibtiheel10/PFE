import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

const VALID_SUBJECTS = [
    'Question générale',
    'Réclamation',
    'Support technique',
    'Partenariat',
    'Autre',
];

export class CreateContactDto {
    @ApiProperty({ example: 'Ahmed' })
    @IsNotEmpty({ message: 'Le prénom est obligatoire.' })
    @IsString()
    @MaxLength(100)
    firstName: string;

    @ApiProperty({ example: 'Benali' })
    @IsNotEmpty({ message: 'Le nom est obligatoire.' })
    @IsString()
    @MaxLength(100)
    lastName: string;

    @ApiProperty({ example: 'ahmed@example.com' })
    @IsEmail({}, { message: 'Adresse email invalide.' })
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Question générale',
        enum: VALID_SUBJECTS,
    })
    @IsIn(VALID_SUBJECTS, {
        message: `Le sujet doit être l'un des suivants : ${VALID_SUBJECTS.join(', ')}.`,
    })
    subject: string;

    @ApiProperty({ example: 'Bonjour, je voudrais en savoir plus sur votre plateforme.' })
    @IsNotEmpty({ message: 'Le message est obligatoire.' })
    @IsString()
    @MinLength(10, { message: 'Le message doit contenir au moins 10 caractères.' })
    @MaxLength(2000)
    message: string;
}
