import { createContext, type ReactNode,useContext, useEffect, useRef, useState } from 'react';

export interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  isMuted: boolean;
  currentTrack: number;
  tracks: string[];
  playBackgroundMusic: () => void;
  pauseBackgroundMusic: () => void;
  toggleBackgroundMusic: () => void;
  playSoundEffect: (soundFile: string) => void;
  setVolume: (volume: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setMusicEnabled: (enabled: boolean) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  changeTrack: (trackIndex: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  useEffect(() => {
    const savedVolume = localStorage.getItem('audioVolume');
    const savedSoundEnabled = localStorage.getItem('soundEnabled');
    const savedMusicEnabled = localStorage.getItem('musicEnabled');
    const savedIsMuted = localStorage.getItem('isMuted');

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedSoundEnabled) setSoundEnabled(savedSoundEnabled === 'true');
    if (savedMusicEnabled) setMusicEnabled(savedMusicEnabled === 'true');
    if (savedIsMuted) setIsMuted(savedIsMuted === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', musicEnabled.toString());
  }, [musicEnabled]);

  useEffect(() => {
    localStorage.setItem('isMuted', isMuted.toString());
  }, [isMuted]);

  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = isMuted ? 0 : volume;
      backgroundMusicRef.current.loop = true;

      backgroundMusicRef.current.addEventListener('ended', () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.currentTime = 0;
          backgroundMusicRef.current.play().catch((err: unknown) => {
            console.error('Error re-playing background music:', err);
          });
        }
      });
    }
  }, [volume, isMuted]);

  const tracks = [
    '/sounds/guitar-melody-1.mp3',
    '/sounds/guitar-melody-2.mp3',
    '/sounds/guitar-melody-3.mp3'
  ];

  const playBackgroundMusic = () => {
    if (!musicEnabled) return;

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.load();
      backgroundMusicRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err: unknown) => {
        console.error('Error playing background music:', err);
      });
    }
  };

  const pauseBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleBackgroundMusic = () => {
    if (isPlaying) {
      pauseBackgroundMusic();
    } else {
      playBackgroundMusic();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const playSoundEffect = (soundFile: string) => {
    if (!soundEnabled || isMuted) return;

    const audio = new Audio(soundFile);
    audio.volume = Math.min(volume * 1.2, 1.0);

    audio.load();
    audio.play().catch((err: unknown) => {
      console.error('Error playing sound effect:', err);
    });
  };

  const changeTrack = (trackIndex: number) => {
    if (trackIndex >= 0 && trackIndex < tracks.length) {
      const wasPlaying = isPlaying;
      pauseBackgroundMusic();
      setCurrentTrack(trackIndex);

      setTimeout(() => {
        if (wasPlaying) playBackgroundMusic();
      }, 100);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % tracks.length;
    changeTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = currentTrack === 0 ? tracks.length - 1 : currentTrack - 1;
    changeTrack(prevIndex);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        soundEnabled,
        musicEnabled,
        isMuted,
        currentTrack,
        tracks,
        playBackgroundMusic,
        pauseBackgroundMusic,
        toggleBackgroundMusic,
        playSoundEffect,
        setVolume,
        setSoundEnabled,
        setMusicEnabled,
        toggleMute,
        nextTrack,
        prevTrack,
        changeTrack
      }}
    >
      <audio
        ref={backgroundMusicRef}
        src={tracks[currentTrack]}
        onEnded={nextTrack}
      />
      {children}
    </AudioContext.Provider>
  );
};
