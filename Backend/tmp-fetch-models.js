const http = require('http');

http.get('http://127.0.0.1:11434/api/tags', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const tags = JSON.parse(data);
      console.log("AVAILABLE MODELS:", tags.models.map(m => m.name).join(', '));
    } catch(e) { console.log(data); }
  });
}).on('error', (e) => {
  console.log("Error:", e.message);
});
