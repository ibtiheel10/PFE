import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export type UserRole = 'Candidat' | 'Entreprise' | 'Admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  prenom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'Candidat' })
  role: UserRole;

  // Candidat-specific
  @Column({ nullable: true })
  dateNaissance: string;

  // Entreprise-specific
  @Column({ nullable: true })
  secteur: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
