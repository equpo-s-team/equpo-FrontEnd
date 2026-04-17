import './app.css';

import Router from './Router';
import { AudioProvider } from '@/context/AudioContext';
import AudioNavbar from '@/components/AudioNavbar';

export default function App() {
  return (
    <AudioProvider>
      <AudioNavbar />
      <Router />
    </AudioProvider>
  );
}
