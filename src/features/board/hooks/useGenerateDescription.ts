import { aiApi } from '../api/aiApi';

export async function generateDescription(description: string): Promise<string> {
  const { content } = await aiApi.generateDescription(description);

  if (!content) {
    throw new Error('No se generó una descripción válida');
  }

  return content;
}

export { generateDescription as UseGenerateDescription };
