const http = require('http');

const req = http.request('http://localhost:3333/api/Entreprise/offres/1/generer-questions-ia', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    // no auth, probably will get 401 or 403, but let's just test keep-alive
  }
}, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', d => console.log(d.toString()));
});

req.on('error', (e) => {
  console.error('Error:', e);
});

req.write(JSON.stringify({ difficulte: 'Moyen' }));
req.end();
