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
    const c = await connection.getRepository(Candidature).findOne({ where: { id: 8 } });
    if (c) {
        await connection.getRepository(ReponseCandidat).delete({ candidature: { id: 8 } });
        (c as any).score = null;
        c.statut = 'En attente';
        c.nbReponsesCorrectes = 0;
        c.totalQuestions = 0;
        (c as any).evaluationDetails = null;
        (c as any).tempsEcoule = null;
        await connection.getRepository(Candidature).save(c);
        console.log('Candidature 8 reset.');
    }
    await connection.close();
}
reset().catch(console.error);
