import axios from 'axios';

// Test the publish endpoint for the offer from the screenshot URL
// URL was: /job-qcm/2d49f509-adc5-410a-be88-cd26c2131db5
const OFFRE_ID = '2d49f509-adc5-410a-be88-cd26c2131db5';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidGFraW5lcnJpQHlvcG1haWwuY29tIiwicm9sZSI6IkNhbmRpZGF0IiwiaWF0IjoxNzc0MjIxMDY3LCJleHAiOjE3NzQ4MjU4Njd9.xRkrYaBAlHrneg3rOI79kOMUjHV6V7iioI8Lp9Sh0X8';

async function test() {
    try {
        const res = await axios.post(
            `http://localhost:3333/api/Entreprise/offres/${OFFRE_ID}/publier-qcm`,
            {},
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        console.log('SUCCESS:', res.data);
    } catch (e: any) {
        console.error('ERROR Status:', e.response?.status);
        console.error('ERROR Body:', JSON.stringify(e.response?.data));
    }
}
test();
