import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OffreEmploi } from './offre-emploi.entity';

export type QuestionNiveau = 'Facile' | 'Moyen' | 'Difficile';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb' })
    contenu: {
        question: string;
        options: { text: string; isCorrect: boolean }[];
        correctAnswer?: string;
    };

    @Column({ type: 'int' })
    chronometre: number; // seconds (updated from minutes representation)

    @Column({ type: 'varchar', default: 'Moyen' })
    niveauDifficulte: QuestionNiveau;

    /** Set to true once the recruiter has manually verified the correct answer */
    @Column({ type: 'boolean', default: false })
    isCorrectVerified: boolean;

    @ManyToOne(() => OffreEmploi, (offre) => offre.questions, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'offre_id' })
    offre: OffreEmploi;

    @CreateDateColumn()
    createdAt: Date;
}

