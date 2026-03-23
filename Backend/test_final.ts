// import { createConnection } from 'typeorm';
// import { User } from './src/entities/user.entity';
// import { OtpCode } from './src/entities/otp-code.entity';
// import { OffreEmploi } from './src/entities/offre-emploi.entity';
// import { Candidature } from './src/entities/candidature.entity';
// import { Question } from './src/entities/question.entity';
// import { ReponseCandidat } from './src/entities/reponse-candidat.entity';
// import { Notification } from './src/entities/notification.entity';
// import { ContactMessage } from './src/entities/contact-message.entity';
// import { CandidaturesService } from './src/candidatures/candidatures.service';

// async function test() {
//     const connection = await createConnection({
//         type: 'postgres', host: 'localhost', port: 5432,
//         username: 'postgres', password: 'admin123', database: 'skillvia_db_2',
//         entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
//         synchronize: false,
//     });

//     const candRepo = connection.getRepository(Candidature);
//     const questRepo = connection.getRepository(Question);
//     const repRepo = connection.getRepository(ReponseCandidat);

//     // Reset cand 8
//     const c = await candRepo.findOne({ where: { id: 8 } });
//     if (c) {
//         await repRepo.delete({ candidature: { id: 8 } });
//         (c as any).score = null;
//         c.statut = 'En attente';
//         await candRepo.save(c);
//         console.log('Candidature 8 RESET.');
//     }

//     const service = new CandidaturesService(candRepo, questRepo, repRepo);
//     const USER_ID = 9; // From JWT "sub": 9
//     const answers = { "43": 1, "44": 1, "45": 1, "46": 1 };

//     console.log('\n--- TESTING SERVICE.submitEvaluation ---');
//     try {
//         const res = await service.submitEvaluation(8, USER_ID, answers, "0:30");
//         console.log('Success:', res.message, 'Score:', res.score);

//         // Final check of reponses saved
//         const saved = await repRepo.find({ where: { candidature: { id: 8 } }, relations: ['question'] });
//         console.log(`Saved ${saved.length} responses:`);
//         saved.forEach(r => {
//             console.log(`  Q${r.question.id}: "${r.reponse}" | correct=${r.est_correct}`);
//         });
//     } catch (e) {
//         console.log('FAILED:', e.message);
//     }

//     await connection.close();
// }
// test().catch(console.error);
