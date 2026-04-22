import { useAudio } from '@/context/AudioContext.tsx';

export const SOUND_EFFECTS = {
  taskCreated: '/sounds/task-created.mp3',
  taskCompleted: '/sounds/task-completed.mp3',
  taskUpdated: '/sounds/task-updated.mp3',
  taskDeleted: '/sounds/task-deleted.mp3',

  messageSent: '/sounds/message-sent.mp3',
  messageReceived: '/sounds/message-received.mp3',

  ring: '/sounds/ring_tone.mp3',
} as const;

export type SoundEffectName = keyof typeof SOUND_EFFECTS;

interface AudioContextType {
  playSoundEffect: (soundFile: string) => void;
}

export const useSoundEffects = () => {
  const { playSoundEffect } = useAudio() as AudioContextType;

  const play = (soundName: SoundEffectName) => {
    const soundFile = SOUND_EFFECTS[soundName];
    if (soundFile) {
      playSoundEffect(soundFile);
    } else {
      console.warn(`Sound effect "${soundName}" not found`);
    }
  };

  return {
    play,
    sounds: SOUND_EFFECTS,
  };
};
