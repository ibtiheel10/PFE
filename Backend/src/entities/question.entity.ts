import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { OffreEmploi } from './offre-emploi.entity';


@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', nullable: true })
    qcmId: string; // Identifiant unique du QCM généré (ex: "gen_e3f7a2c1...")

    @Column({ type: 'jsonb' })
    contenu: {
        question: string;
        options: { text: string; isCorrect: boolean }[];
        competence: string;
    };

    @Column({ type: 'int', default: 30 })
    chronometre: number; // seconds

    @Column({ type: 'varchar', nullable: true })
    offreTitle: string; // Titre de l'offre (dénormalisé pour performance)

    @Column({ type: 'int', nullable: true })
    totalQuestions: number; // Nombre total de questions dans ce QCM

    @ManyToOne(() => OffreEmploi, (offre) => offre.questions, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'offre_id' })
    offre: OffreEmploi;

    @CreateDateColumn()
    createdAt: Date;
}

