import './index.css';

import { QueryClient } from '@tanstack/query-core';
import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { Toaster } from './components/ui/sonner';
import { AchievementProvider } from './context/AchievementContext';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AchievementProvider>
          <App />
          <Toaster position="bottom-right" richColors closeButton />
        </AchievementProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
