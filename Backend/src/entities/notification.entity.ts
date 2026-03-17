import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export type NotificationType =
    | 'CANDIDATURE_ENVOYEE'
    | 'CANDIDATURE_RECUE'
    | 'CANDIDATURE_ACCEPTEE'
    | 'CANDIDATURE_REFUSEE'
    | 'CANDIDATURE_EN_ATTENTE'
    | 'NOUVEAU_MESSAGE_CONTACT'
    | 'OFFRE_RECOMMANDEE'
    | 'EVALUATION_DISPONIBLE'
    | 'EVALUATION_COMMENCEE'
    | 'EVALUATION_TERMINEE'
    | 'EVALUATION_EXPIREE'
    | 'EVALUATION_RAPPEL'
    | 'EVALUATION_FERMEE'
    | 'RESULTAT_DISPONIBLE'
    | 'SCORE_OBTENU'
    | 'CANDIDAT_SELECTIONNE'
    | 'CANDIDAT_NON_RETENU'
    | 'MOT_DE_PASSE_MODIFIE'
    | 'PROFIL_MIS_A_JOUR'
    | 'MESSAGE_ADMIN';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    titre: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'varchar', default: 'MESSAGE_ADMIN' })
    type: NotificationType;

    @Column({ default: false })
    lu: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE', eager: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;
}
