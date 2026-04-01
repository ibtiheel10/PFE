import axios from 'axios';

async function runTest() {
    const url = 'http://localhost:3333/api/candidatures/8/evaluation';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoidGFraW5lcnJpQHlvcG1haWwuY29tIiwicm9sZSI6IkNhbmRpZGF0IiwiaWF0IjoxNzc0MjIxMDY3LCJleHAiOjE3NzQ4MjU4Njd9.xRkrYaBAlHrneg3rOI79kOMUjHV6V7iioI8Lp9Sh0X8';

    // This is the EXACT flat JSON the user provided
    const data = {
        "43": 1,
        "44": 1,
        "45": 1,
        "46": 1
    };

    console.log('Sending flat JSON to:', url);
    try {
        const res = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Response Status:', res.status);
        console.log('Response Data:', JSON.stringify(res.data));
    } catch (e: any) {
        console.error('API Call Failed:', e.response?.data || e.message);
    }
}

runTest();
