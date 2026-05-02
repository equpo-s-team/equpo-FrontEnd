import { request } from '@/lib/api/core';

export interface RaccoonQuote {
  quote: string;
  author: string;
  category: string;
}

export const quotesApi = {
  getRandom: () => request<RaccoonQuote>('/quotes/random', 'GET'),
};
