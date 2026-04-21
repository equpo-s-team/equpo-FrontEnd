import './app.css';

import { AudioProvider } from '@/context/AudioContext';

import Router from './Router';

export default function App() {
  return (
    <AudioProvider>
      <Router />
    </AudioProvider>
  );
}
