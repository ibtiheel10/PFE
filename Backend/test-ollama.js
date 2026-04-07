const axios = require('axios');

async function test() {
  try {
    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'mistral:7b',
      prompt: 'Test prompt',
      stream: false
    });
    console.log("MISTRAL WORKS", response.data.response.substring(0, 50));
  } catch (e) {
    console.log("MISTRAL ERROR", e.message);
  }

  try {
    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'phi3',
      prompt: 'Test prompt',
      stream: false
    });
    console.log("PHI3 WORKS", response.data.response.substring(0, 50));
  } catch (e) {
    console.log("PHI3 ERROR", e.message);
  }
}

test();
