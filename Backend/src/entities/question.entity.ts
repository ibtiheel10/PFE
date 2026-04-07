import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OffreEmploi } from './offre-emploi.entity';


@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb' })
    contenu: {
        question: string;
        options: { text: string; isCorrect: boolean }[];
        correctAnswer?: string;
        explanation?: string;
        points?: number;
        questionType?: string;
        difficulty?: string;
        category?: string;
    };

    @Column({ type: 'int' })
    chronometre: number; // seconds (updated from minutes representation)

    /** Set to true once the recruiter has manually verified the correct answer */
    @Column({ type: 'boolean', default: false })
    isCorrectVerified: boolean;

    @ManyToOne(() => OffreEmploi, (offre) => offre.questions, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'offre_id' })
    offre: OffreEmploi;

    @CreateDateColumn()
    createdAt: Date;
}

