import './app.css';

import { AudioProvider } from '@/context/AudioContext.tsx';
import { TaskSidebarProvider } from '@/context/TaskSidebarContext';

import Router from './Router';

export default function App() {
  return (
    <AudioProvider>
      <TaskSidebarProvider>
        <Router />
      </TaskSidebarProvider>
    </AudioProvider>
  );
}
