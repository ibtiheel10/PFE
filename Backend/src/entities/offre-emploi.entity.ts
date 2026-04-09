import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';
import { Candidature } from './candidature.entity';
import { OneToMany } from 'typeorm';

@Entity('offres_emploi')
export class OffreEmploi {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    TitreDePost: string;

    @Column({ type: 'text' })
    Description: string;

    @Column()
    Categorie: string;

    @CreateDateColumn()
    DatePublication: Date;

    @Column({ type: 'timestamp', nullable: true })
    DateLimite: Date;

    @Column({ type: 'timestamp', nullable: true })
    dateLancementQcm: Date;

    @Column({ nullable: true })
    TypeDeContrat: string;

    @Column({ nullable: true })
    ModeDeTravail: string;

    @Column({ type: 'text', nullable: true })
    competences: string;

    @Column({ type: 'float', nullable: true })
    Salaire: number;

    @Column({ nullable: true })
    Localisation: string;

    @Column({ nullable: true })
    ExperienceRequise: string;

    @Column({ type: 'int', default: 1 })
    NbPost: number;

    @Column({ nullable: true })
    icon: string;

    @Column({ nullable: true })
    iconColor: string;

    @Column({ type: 'boolean', default: false })
    qcmPublie: boolean;

    @Column({ type: 'boolean', default: false })
    qcmNotification1hEnvoyee: boolean;

    @Column({ type: 'int', default: 50 })
    seuilMinimal: number;

    @ManyToOne(() => User, { nullable: true })
    entreprise: User;

    @OneToMany(() => Question, (question) => question.offre)
    questions: Question[];

    @OneToMany(() => Candidature, (candidature) => candidature.offre)
    candidatures: Candidature[];
}
