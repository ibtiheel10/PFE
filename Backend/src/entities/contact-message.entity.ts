import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

export type ContactStatut = 'Non lu' | 'Lu' | 'Traité';

@Entity('contact_messages')
export class ContactMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    subject: string;

    @Column({ type: 'text' })
    message: string;

    @Column({ nullable: true, type: 'varchar' })
    fileName: string | null;

    @Column({ nullable: true, type: 'varchar' })
    filePath: string | null;

    @Column({
        type: 'varchar',
        default: 'Non lu',
    })
    statut: ContactStatut;

    @CreateDateColumn()
    createdAt: Date;
}
