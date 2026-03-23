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
        type: 'postgres', host: 'localhost', port: 5432,
        username: 'postgres', password: 'admin123', database: 'skillvia_db_2',
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
        synchronize: false,
    });

    // Check candidature 8 specifically (the one just submitted)
    const CAND_ID = 8;
    const cand = await connection.getRepository(Candidature).findOne({
        where: { id: CAND_ID },
        relations: ['offre'],
    });
    console.log(`Candidature ${CAND_ID}:`, { score: cand?.score, statut: cand?.statut, offre: cand?.offre?.id?.substring(0, 8) });

    if (cand) {
        const questions = await connection.getRepository(Question).find({
            where: { offre: { id: cand.offre.id } },
            order: { createdAt: 'ASC' },
        });
        console.log(`\n${questions.length} questions:`);
        questions.forEach(q => {
            const opts = q.contenu?.options || [];
            const correctAnswer = (q.contenu as any)?.correctAnswer || 'NONE';
            console.log(`  Q${q.id}: correctAnswer="${correctAnswer}"`);
            opts.slice(0, 4).forEach((o: any, i: number) => {
                const t = typeof o === 'object' ? o.text : String(o);
                const ic = typeof o === 'object' ? o.isCorrect : 'N/A';
                console.log(`    [${i}] "${t.substring(0, 40)}" isCorrect=${ic}`);
            });
        });

        // Show what answers were sent (simulate the lookup for answers {"43":0,"44":1,"45":1,"46":1})
        const rawAnswers: Record<string, number> = { "43": 0, "44": 1, "45": 1, "46": 1 };
        const answers: Record<number, number> = {};
        for (const k of Object.keys(rawAnswers)) {
            answers[Number(k)] = Number(rawAnswers[k]);
        }
        console.log('\nSimulated answer lookup:');
        questions.forEach(q => {
            const idx = answers[q.id];
            const opts = q.contenu?.options || [];
            const chosen: any = opts[idx];
            const chosenText: string = typeof chosen === 'string' ? chosen : (chosen?.text || '');
            const isCorrectVal = typeof chosen === 'object' ? chosen?.isCorrect : 'N/A (string)';
            console.log(`  Q${q.id}: idx=${idx}, chosen="${chosenText.substring(0, 30)}", isCorrect=${isCorrectVal}`);
        });

        const responses = await connection.getRepository(ReponseCandidat).find({
            where: { candidature: { id: CAND_ID } },
            relations: ['question'],
        });
        console.log(`\n${responses.length} saved responses:`);
        responses.forEach(r => {
            console.log(`  Q${r.question.id}: "${r.reponse}" correct=${r.est_correct}`);
        });
    }

    await connection.close();
}

diagnose().catch(console.error);
