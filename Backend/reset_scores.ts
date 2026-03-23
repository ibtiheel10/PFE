import { createConnection } from 'typeorm';
import { User } from './src/entities/user.entity';
import { OtpCode } from './src/entities/otp-code.entity';
import { OffreEmploi } from './src/entities/offre-emploi.entity';
import { Candidature } from './src/entities/candidature.entity';
import { Question } from './src/entities/question.entity';
import { ReponseCandidat } from './src/entities/reponse-candidat.entity';
import { Notification } from './src/entities/notification.entity';
import { ContactMessage } from './src/entities/contact-message.entity';

async function reset() {
    const connection = await createConnection({
        type: 'postgres', host: 'localhost', port: 5432,
        username: 'postgres', password: 'admin123', database: 'skillvia_db_2',
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
        synchronize: false,
    });

    const candidatureRepo = connection.getRepository(Candidature);
    const reponseRepo = connection.getRepository(ReponseCandidat);

    // Reset all candidatures that have score=0 (broken evaluation) 
    const broken = await candidatureRepo.find({ where: { score: 0 } });
    console.log(`Found ${broken.length} candidature(s) with score=0 to reset`);

    for (const c of broken) {
        // Delete saved responses
        const responses = await reponseRepo.find({ where: { candidature: { id: c.id } } });
        if (responses.length > 0) {
            await reponseRepo.remove(responses);
            console.log(`  Candidature ${c.id}: Deleted ${responses.length} responses`);
        }
        // Reset score and status
        (c as any).score = null;
        c.statut = 'En attente';
        c.nbReponsesCorrectes = 0;
        c.totalQuestions = 0;
        (c as any).evaluationDetails = null;
        (c as any).tempsEcoule = null;
        await candidatureRepo.save(c);
        console.log(`  Candidature ${c.id}: Reset to En attente`);
    }

    console.log('\n✅ All score=0 candidatures reset. Candidates can retake evaluations.');
    await connection.close();
}

reset().catch(console.error);
