import { createConnection } from 'typeorm';
import { User } from './src/entities/user.entity';
import { OtpCode } from './src/entities/otp-code.entity';
import { OffreEmploi } from './src/entities/offre-emploi.entity';
import { Candidature } from './src/entities/candidature.entity';
import { Question } from './src/entities/question.entity';
import { ReponseCandidat } from './src/entities/reponse-candidat.entity';
import { Notification } from './src/entities/notification.entity';
import { ContactMessage } from './src/entities/contact-message.entity';

async function diagnose() {
    const connection = await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin123',
        database: 'skillvia_db_2',
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
        synchronize: false,
    });

    const cand = await connection.getRepository(Candidature).findOne({
        where: { id: 20 },
        relations: ['offre'],
    });

    if (cand) {
        const questions = await connection.getRepository(Question).find({
            where: { offre: { id: cand.offre.id } },
            order: { createdAt: 'ASC' },
        });

        // Simulate what submitEvaluation does
        // Answers: {"27":0,"28":0,"29":1,"30":1}
        const rawAnswers: Record<string, number> = { "27": 0, "28": 0, "29": 1, "30": 1 };
        const answers: Record<number, number> = {};
        for (const k of Object.keys(rawAnswers)) {
            answers[Number(k)] = Number(rawAnswers[k]);
        }

        console.log('\nSimulating answer lookup:');
        console.log('answers map:', answers);

        questions.forEach((q) => {
            const chosenIndex = answers[q.id];
            console.log(`\nQ${q.id}: chosenIndex=${chosenIndex}`);
            console.log('  options type:', typeof q.contenu?.options?.[0]);
            console.log('  option at index:', q.contenu?.options?.[chosenIndex]);
            console.log('  correctAnswer field:', (q.contenu as any)?.correctAnswer);
        });
    }

    await connection.close();
}

diagnose().catch(console.error);
