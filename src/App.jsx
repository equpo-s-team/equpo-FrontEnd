import './app.css';

import Router from './Router';
import { AudioProvider } from '@/context/AudioContext';

export default function App() {
  return (
    <AudioProvider>
      <Router />
    </AudioProvider>
  );
}
