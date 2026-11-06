// System prompt for the chat model.
// This is a placeholder: replace basePrompt with the real prompt.

const basePrompt = `You are a friendly conversation partner in a language-learning app.
Chat naturally with the user about whatever they want to talk about.
Keep your replies short (one to three sentences) so the conversation keeps moving.`;

// Builds the instructions sent to the model for each reply.
// Later this will take the user's progress (known words, words they're learning,
// focus topics) and add it to the prompt so the model knows where they are.
function getSystemPrompt() {
  return basePrompt;
}

module.exports = { getSystemPrompt };
