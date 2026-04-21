import { useAudio } from '@/context/AudioContext';

export const useSoundEffects = () => {
  const { playSoundEffect } = useAudio();

  const sounds = {
    // Efectos de tarea (solo los que existen)
    taskCreated: '/sounds/task-created.mp3',
    taskCompleted: '/sounds/task-completed.mp3',
    taskUpdated: '/sounds/task-updated.mp3',
    taskDeleted: '/sounds/task-deleted.mp3',

    // Efectos de chat
    messageSent: '/sounds/message-sent.mp3',
    messageReceived: '/sounds/message-received.mp3',

    // Notificaciones
    ring: '/sounds/ring_tone.mp3',
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
