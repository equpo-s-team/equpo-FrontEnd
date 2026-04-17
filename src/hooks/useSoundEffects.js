import { useAudio } from '@/context/AudioContext';

export const useSoundEffects = () => {
  const { playSoundEffect } = useAudio();

  const sounds = {
    // Efectos de tarea
    taskCreated: '/sounds/task-created.mp3',
    taskCompleted: '/sounds/task-completed.mp3',
    taskUpdated: '/sounds/task-updated.mp3',
    taskDeleted: '/sounds/task-deleted.mp3',
    
    // Efectos de UI
    click: '/sounds/click.mp3',
    hover: '/sounds/hover.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    notification: '/sounds/notification.mp3',
    
    // Efectos de arrastrar y soltar
    dragStart: '/sounds/drag-start.mp3',
    dragEnd: '/sounds/drag-end.mp3',
    drop: '/sounds/drop.mp3',
    
    // Efectos de navegación
    pageLoad: '/sounds/page-load.mp3',
    modalOpen: '/sounds/modal-open.mp3',
    modalClose: '/sounds/modal-close.mp3',
    
    // Efectos de chat
    messageSent: '/sounds/message-sent.mp3',
    messageReceived: '/sounds/message-received.mp3',
  };

  const play = (soundName) => {
    const soundFile = sounds[soundName];
    if (soundFile) {
      playSoundEffect(soundFile);
    } else {
      console.warn(`Sound effect "${soundName}" not found`);
    }
  };

  return {
    play,
    sounds
  };
};
