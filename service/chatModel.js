const path = require('path');
const OpenAI = require('openai');
const { getSystemPrompt } = require('./chatPrompt');

// Load OPENAI_API_KEY from a .env file if there is one.
// Locally it lives in the project root. On the production server, put it in
// ~/services/.env (one folder above the deployed code), because the deploy
// script deletes and recreates services/<service> on every deploy.
for (const envPath of [path.join(__dirname, '.env'), path.join(__dirname, '..', '.env')]) {
  try {
    process.loadEnvFile(envPath);
    break;
  } catch {
    // no .env file at this path, try the next one
  }
}

const MODEL = 'gpt-5.5';

// How many earlier messages to send with each request, so the model has context
// without the cost growing forever as the chat gets longer.
const HISTORY_LIMIT = 20;

let client;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }
  client = client || new OpenAI(); // reads OPENAI_API_KEY from the environment
  return client;
}

// history: the user's earlier messages, [{ id, from: 'me' | 'them', text }, ...]
// text: the new message from the user
// returns the model's reply as a string
async function getChatResponse(history, text) {
  const input = history.slice(-HISTORY_LIMIT).map((message) => ({
    role: message.from === 'me' ? 'user' : 'assistant',
    content: message.text,
  }));
  input.push({ role: 'user', content: text });

  const response = await getClient().responses.create({
    model: MODEL,
    instructions: getSystemPrompt(),
    input: input,
  });

  return response.output_text;
}

module.exports = { getChatResponse };
