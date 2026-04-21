import Groq from 'groq-sdk';

const GROQ_API_URL =
  import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com';
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'groq/compound';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const groqClient = GROQ_API_KEY
  ? new Groq({
      apiKey: GROQ_API_KEY,
      baseURL: GROQ_API_URL,
      dangerouslyAllowBrowser: true,
    })
  : null;

export async function generateDescription(description: string) {
  if (!groqClient) {
    throw new Error('Falta configurar VITE_GROQ_API_KEY');
  }

  const prompt =
    'You are an AI assistant that generates refined task descriptions for a Kanban board. ' +
    'Do not greet or add introductory text; output only the improved description. ' +
    'Use basic Markdown formatting (bold, italic, and unordered lists with "-"). ' +
    'Expand the description to approximately 300 characters, and if it is already that length, ' +
    'only improve its wording and punctuation.';

  const response = await groqClient.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.4,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: description },
    ],
  });

  const content = response.choices?.[0]?.message?.content;
  const generatedText = (Array.isArray(content) ? '' : content || '').trim();

  if (!generatedText) {
    throw new Error('Groq no devolvio una descripcion valida');
  }

  return generatedText;
}

export { generateDescription as UseGenerateDescription };

