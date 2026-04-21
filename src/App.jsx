import './app.css';

import { AudioProvider } from '@/context/AudioContext.tsx';

import Router from './Router';

export default function App() {
  return (
    <AudioProvider>
      <Router />
    </AudioProvider>
  );
}
