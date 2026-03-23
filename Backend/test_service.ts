import axios from 'axios';

async function testApi() {
    const CAND_ID = 8;
    const BASE_URL = 'http://localhost:5000/api';

    // We need a token to test, but I can't easily get one.
    // Instead, I'll write a script that calls the SERVICE directly.
    // That's more reliable for internal testing.
}

async function testService() {
    const { createConnection } = require('typeorm');
    const { User } = require('./src/entities/user.entity');
    const { OtpCode } = require('./src/entities/otp-code.entity');
    const { OffreEmploi } = require('./src/entities/offre-emploi.entity');
    const { Candidature } = require('./src/entities/candidature.entity');
    const { Question } = require('./src/entities/question.entity');
    const { ReponseCandidat } = require('./src/entities/reponse-candidat.entity');
    const { Notification } = require('./src/entities/notification.entity');
    const { ContactMessage } = require('./src/entities/contact-message.entity');
    const { CandidaturesService } = require('./src/candidatures/candidatures.service');

    const connection = await createConnection({
        type: 'postgres', host: 'localhost', port: 5432,
        username: 'postgres', password: 'admin123', database: 'skillvia_db_2',
        entities: [User, OtpCode, OffreEmploi, Candidature, Question, ReponseCandidat, Notification, ContactMessage],
        synchronize: false,
    });

    const candRepo = connection.getRepository(Candidature);
    const questRepo = connection.getRepository(Question);
    const repRepo = connection.getRepository(ReponseCandidat);

    // Mock the service
    const service = new CandidaturesService(candRepo, questRepo, repRepo);

    const CAND_ID = 8;
    const USER_ID = 5; // From previous logs

    // TEST 1: The real data the user provided
    const userAnswers = { "43": 1, "44": 1, "45": 1, "46": 1 };

    console.log(`\n--- TRACING SUBMISSION FOR CANDIDATURE ${CAND_ID} ---`);
    try {
        const result = await service.submitEvaluation(CAND_ID, USER_ID, userAnswers, "0:30");
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Submission failed:', e.message);
    }

    await connection.close();
}

testService().catch(console.error);
