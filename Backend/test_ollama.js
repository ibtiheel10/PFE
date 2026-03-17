const axios = require('axios');

async function test() {
  const prompt =
    'Génère 4 questions QCM techniques courtes (maximum 1 phrase par question) pour ce poste.\n' +
    'Format JSON attendu strict (tableau, 4 options par question, une seule option correcte) :\n' +
    '[\n' +
    '  {\n' +
    '    "question": "question 1 ?",\n' +
    '    "options": [\n' +
    '      {"text": "réponse A", "isCorrect": true},\n' +
    '      {"text": "réponse B", "isCorrect": false},\n' +
    '      {"text": "réponse C", "isCorrect": false},\n' +
    '      {"text": "réponse D", "isCorrect": false}\n' +
    '    ]\n' +
    '  }\n' +
    ']\n\n' +
    'Poste :\n' +
    'Développeur web NestJS et VueJS.';

  try {
    const response = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'phi3',
        prompt,
        stream: false,
        format: 'json',
        options: { temperature: 0.7, num_predict: 800 },
      },
      { timeout: 600000 }
    );
    console.dir(response.data.response, { depth: null });
  } catch (err) {
    console.error(err.message);
  }
}

test();
