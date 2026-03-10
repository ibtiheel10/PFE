import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

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

    @Column({ type: 'date', nullable: true })
    DateLimite: Date;

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

    @ManyToOne(() => User, { nullable: true })
    entreprise: User;
}
