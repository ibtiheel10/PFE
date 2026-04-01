const axios = require('axios');

async function testOllamaStream() {
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
- JSON valide uniquement
- Exactement 4 options par question
- Une seule option "isCorrect": true par question`;

    try {
        console.log("Sending streaming request to Ollama...");
        const response = await axios.post(
            'http://127.0.0.1:11434/api/generate',
            {
                model: 'phi3',
                prompt,
                stream: true,
                options: { temperature: 0.2, num_predict: 1000 },
            },
            { responseType: 'stream' }
        );
        
        response.data.on('data', chunk => {
            try {
                const parsed = JSON.parse(chunk.toString());
                process.stdout.write(parsed.response);
            } catch(e) {}
        });

        response.data.on('end', () => {
             console.log("\n--- Generation Complete ---");
        });

    } catch(err) {
        console.error("Error:", err.message);
    }
}

testOllamaStream();
