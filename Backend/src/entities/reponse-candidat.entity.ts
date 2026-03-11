import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Candidature } from './candidature.entity';
import { Question } from './question.entity';

@Entity('reponses_candidat')
export class ReponseCandidat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Candidature, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'candidature_id' })
    candidature: Candidature;

    @ManyToOne(() => Question, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question;

    @Column({ type: 'text' })
    reponse: string;

    @Column({ type: 'boolean', default: false })
    est_correct: boolean;

    @Column({ type: 'float', default: 0 })
    scoreFinal: number;
}
