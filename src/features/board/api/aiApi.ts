import { request } from '@/lib/api/core.ts';

export const aiApi = {
  generateDescription: (description: string) =>
    request<{ content: string }>('/ai/generate-description', 'POST', { description }),
};
