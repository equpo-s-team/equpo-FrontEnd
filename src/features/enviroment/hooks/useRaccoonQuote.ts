import { useCallback, useState } from 'react';
import { quotesApi, type RaccoonQuote } from '@/features/enviroment/api/quotesApi';

export function useRaccoonQuote() {
  const [quote, setQuote] = useState<RaccoonQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuote = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await quotesApi.getRandom();
      setQuote(data);
    } catch {
      setQuote(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearQuote = useCallback(() => {
    setQuote(null);
  }, []);

  return { quote, isLoading, fetchQuote, clearQuote };
}
