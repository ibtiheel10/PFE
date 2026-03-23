import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { OffreEmploi } from './offre-emploi.entity';

@Entity('candidatures')
export class Candidature {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    datePostulation: Date;

    @Column({ default: 'En attente' })
    statut: string;

    @Column({ type: 'float', nullable: true })
    score: number;

    @Column({ type: 'boolean', default: false })
    qcmDisponible: boolean;

    @Column({ nullable: true })
    decision: string;

    @Column({ nullable: true })
    tempsEcoule: string;

    @Column({ type: 'int', default: 0 })
    nbReponsesCorrectes: number;

    @Column({ type: 'int', default: 0 })
    totalQuestions: number;

    @Column({ nullable: true })
    rapidite: string;

    @Column({ type: 'text', nullable: true })
    evaluationDetails: string;

    @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
    candidat: User;

    @ManyToOne(() => OffreEmploi, (offre) => offre.id, { onDelete: 'CASCADE' })
    offre: OffreEmploi;
}
