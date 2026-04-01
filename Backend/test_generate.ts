import axios from 'axios';
import * as fs from 'fs';

const OFFRE_ID = '2d49f509-adc5-410a-be88-cd26c2131db5';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidGFraW5lcnJpQHlvcG1haWwuY29tIiwicm9sZSI6IkNhbmRpZGF0IiwiaWF0IjoxNzc0MjIxMDY3LCJleHAiOjE3NzQ4MjU4Njd9.xRkrYaBAlHrneg3rOI79kOMUjHV6V7iioI8Lp9Sh0X8';

async function testGeneration() {
    try {
        const res = await axios.post(
            `http://localhost:3333/api/Entreprise/offres/${OFFRE_ID}/generer-questions-ia`,
            { difficulte: "Facile" },
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        fs.writeFileSync('test_output.txt', 'SUCCESS:\n' + JSON.stringify(res.data, null, 2));
    } catch (e: any) {
        fs.writeFileSync('test_output.txt', `ERROR Status: ${e.response?.status}\nERROR Body: ${JSON.stringify(e.response?.data, null, 2)}\nERROR Message: ${e.message}`);
    }
}
testGeneration();
