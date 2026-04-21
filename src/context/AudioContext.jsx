import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const backgroundMusicRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(0);

  // Cargar preferencias desde localStorage
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

  // Guardar preferencias en localStorage
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

  // Inicializar música de fondo
  useEffect(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = isMuted ? 0 : volume;
      backgroundMusicRef.current.loop = true;

      // Add event listener to ensure loop works
      backgroundMusicRef.current.addEventListener('ended', () => {
        backgroundMusicRef.current.currentTime = 0;
        backgroundMusicRef.current.play();
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
      }).catch(err => {
        console.log('Error playing background music:', err);
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

  const playSoundEffect = (soundFile) => {
    if (!soundEnabled) return;

    const audio = new Audio(soundFile);
    audio.volume = Math.min(volume * 1.2, 1.0); // Efectos un poco más altos, pero máximo 1.0

    audio.load();
    audio.play().catch(err => {
      console.log('Error playing sound effect:', err);
    });
  };

  const changeTrack = (trackIndex) => {
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
