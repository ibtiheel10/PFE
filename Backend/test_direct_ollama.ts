import axios from 'axios';

async function run() {
    const prompt = `Tu es un générateur de QCM.

Génère 5 questions QCM techniques pour ce poste:
Développeur Frontend
Compétences requises :
Vue.js, TypeScript

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
- Pas d'explication
- JSON valide uniquement
- Exactement 4 options par question,
- Une seule option "isCorrect": true par question`;

    try {
        const response = await axios.post(
            'http://127.0.0.1:11434/api/generate',
            {
                model: 'phi3',
                prompt: prompt,
                stream: false,
                options: { temperature: 0.2, num_predict: 1200 }
            },
            { timeout: 120000 }
        );
        console.log("SUCCESS:");
        console.log(response.data.response);
        global.require('fs').writeFileSync('ollama_output.txt', response.data.response);
    } catch (e: any) {
        console.error("ERROR:");
        console.error(e.message);
    }
}
run();
