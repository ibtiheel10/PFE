const axios = require('axios');

async function testOllama() {
    const prompt = `Tu es un générateur de QCM.

Génère 5 questions QCM techniques pour ce poste:
Développeur Full Stack React/NodeJS

Répond uniquement en JSON valide.

Format STRICT OBLIGATOIRE:
[
  {
    "question": "...",
    "options": [
      { "text": "...", "isCorrect": true, "explication": "..." },
      { "text": "...", "isCorrect": false, "explication": "..." },
      { "text": "...", "isCorrect": false, "explication": "..." },
      { "text": "...", "isCorrect": false, "explication": "..." }
    ]
  }
]

RÈGLES:
- Aucun texte avant ou après
- Pas d'explication en dehors de l'objet JSON
- JSON valide uniquement
- Exactement 4 options par question
- Une seule option "isCorrect": true par question`;

    try {
        console.log("Sending request to Ollama...");
        const response = await axios.post(
            'http://127.0.0.1:11434/api/generate',
            {
                model: 'phi3',
                prompt,
                stream: false,
                options: { temperature: 0.2, num_predict: 1200 },
            },
            { timeout: 120000 }
        );
        console.log("Raw Response:");
        console.log(response.data.response);
    } catch(err) {
        console.error("Error:", err.message);
    }
}

testOllama();
