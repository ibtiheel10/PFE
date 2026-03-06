import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('otp_codes')
export class OtpCode {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ length: 6 })
    code: string;

    @Column()
    expiresAt: Date;

    @Column({ default: false })
    used: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
