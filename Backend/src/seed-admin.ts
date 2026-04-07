/**
 * Seed script: inserts or updates the Skillvia admin account.
 * Run with:  npx ts-node -r tsconfig-paths/register src/seed-admin.ts
 */
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from './entities/user.entity';
import { OtpCode } from './entities/otp-code.entity';
import { OffreEmploi } from './entities/offre-emploi.entity';
import { Candidature } from './entities/candidature.entity';
import { Question } from './entities/question.entity';
import { ReponseCandidat } from './entities/reponse-candidat.entity';
import { Notification } from './entities/notification.entity';
import { ContactMessage } from './entities/contact-message.entity';

const ADMIN_EMAIL    = 'skillvia.recrutement@gmail.com';
const ADMIN_PASSWORD = 'Admin@Skillvia2026!';
const ADMIN_NOM      = 'Skillvia';
const ADMIN_PRENOM   = 'Admin';

async function seed() {
  const ds = new DataSource({
    type: 'postgres',
    host:     process.env.DB_HOST     || 'localhost',
    port:     Number(process.env.DB_PORT)     || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin123',
    database: process.env.DB_NAME     || 'skillvia_db_2',
    entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
    synchronize: false,
  });

  await ds.initialize();
  console.log('✅ Connected to database:', process.env.DB_NAME || 'skillvia_db_2');

  const userRepo = ds.getRepository(User);

  let admin = await userRepo.findOne({ where: { email: ADMIN_EMAIL } });

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (admin) {
    admin.password        = hashedPassword;
    admin.role            = 'Admin';
    admin.nom             = ADMIN_NOM;
    admin.prenom          = ADMIN_PRENOM;
    admin.isEmailVerified = true;
    await userRepo.save(admin);
    console.log('✅ Admin account updated:', ADMIN_EMAIL);
  } else {
    const newAdmin = userRepo.create({
      email:           ADMIN_EMAIL,
      password:        hashedPassword,
      nom:             ADMIN_NOM,
      prenom:          ADMIN_PRENOM,
      role:            'Admin',
      isEmailVerified: true,
    });
    await userRepo.save(newAdmin);
    console.log('✅ Admin account created:', ADMIN_EMAIL);
  }

  await ds.destroy();
  console.log('✅ Done. You can now log in with:');
  console.log('   Email   :', ADMIN_EMAIL);
  console.log('   Password:', ADMIN_PASSWORD);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
