import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type QuestionNiveau = 'Facile' | 'Moyen' | 'Difficile';

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb' })
    contenu: {
        question: string;
        options: string[];
    };

    @Column({ type: 'int' })
    chronometre: number; // minutes

    @Column({ type: 'simple-array' })
    reponses: string[];

    @Column({ type: 'timestamp' })
    dateEvaluation: Date;

    @Column({ type: 'varchar', default: 'Moyen' })
    niveauDifficulte: QuestionNiveau;

    @CreateDateColumn()
    createdAt: Date;
}
