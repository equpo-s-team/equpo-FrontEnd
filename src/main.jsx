import './index.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { Toaster } from './components/ui/sonner';
import { AchievementProvider } from './context/AchievementContext';
import { AuthProvider } from './context/AuthContext';
import { queryClient } from './lib/queryClient.ts';

createRoot(document.getElementById('root')).render(
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
