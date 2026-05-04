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
        explanation?: string;
        points?: number;
        questionType?: string;
        difficulty?: string;
        competence?: string;
    };

    @Column({ type: 'int' })
    chronometre: number; // seconds (updated from minutes representation)


    @ManyToOne(() => OffreEmploi, (offre) => offre.questions, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'offre_id' })
    offre: OffreEmploi;

    @CreateDateColumn()
    createdAt: Date;
}

