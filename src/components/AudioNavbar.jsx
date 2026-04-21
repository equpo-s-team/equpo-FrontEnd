import {Minimize2, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { useEffect,useState } from 'react';

import { useAudio } from '@/context/AudioContext';

export default function AudioNavbar() {
  const {
    isPlaying,
    volume,
    musicEnabled,
    isMuted,
    playBackgroundMusic,
    pauseBackgroundMusic,
    setVolume,
    setMusicEnabled,
    toggleMute
  } = useAudio();

  const [isCollapsed, setIsCollapsed] = useState(true);

  // Ensure navbar stays visible across all routes
  useEffect(() => {
    const navbar = document.querySelector('[data-audio-navbar]');
    if (navbar) {
      navbar.setAttribute('data-audio-navbar', 'true');
      console.log('AudioNavbar mounted and visible');
    }
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMusic = () => {
    if (!isPlaying) {
      setMusicEnabled(true);
      setTimeout(() => playBackgroundMusic(), 200);
    } else {
      pauseBackgroundMusic();
      setMusicEnabled(false);
    }
  };


  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div
      data-audio-navbar="true"
      className={`fixed z-[9999] top-6 right-4 transition-all duration-700 ease-cubic-bezier(0.4, 0.0, 0.2, 1) transform-gpu ${
        isCollapsed
          ? 'w-12 h-12 rounded-full flex items-center justify-center border-[1.5px] bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:bg-white/85'
          : 'w-auto h-10 rounded-2xl flex items-center gap-2 px-3 bg-white/75 backdrop-blur-md shadow-xl hover:shadow-2xl hover:bg-white/80 border-[1.5px] border-grey-100/50'
      }`}
      style={{
        background: isCollapsed
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.7) 100%)',
        backdropFilter: isCollapsed ? 'blur(10px)' : 'blur(15px)',
        WebkitBackdropFilter: isCollapsed ? 'blur(10px)' : 'blur(15px)',
        border: '1px solid rgba(59, 130, 246, 0.15)',
        boxShadow: isCollapsed
          ? '0 4px 20px rgba(59, 130, 246, 0.1), 0 2px 10px rgba(59, 130, 246, 0.08)'
          : '0 8px 30px rgba(59, 130, 246, 0.08), 0 4px 15px rgba(59, 130, 246, 0.06)',
        transform: isCollapsed ? 'scale(0.95)' : 'scale(1)',
        transformOrigin: 'center'
      }}
    >
      {isCollapsed ? (
        /* Collapsed State */
        <button
          onClick={() => {
            if (isMuted) {
              toggleMute();
            } else {
              toggleMusic();
            }
          }}
          onDoubleClick={() => setIsCollapsed(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (isMuted) {
                toggleMute();
              } else {
                toggleMusic();
              }
            }
          }}
          className="w-full h-full rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          title={isMuted ? 'Desmutear audio (doble clic para expandir)' : (isPlaying ? 'Pausar música (doble clic para expandir)' : 'Reproducir música (doble clic para expandir)')}
          aria-label={isMuted ? 'Desmutear audio' : (isPlaying ? 'Pausar música' : 'Reproducir música')}
        >
          <div className="flex items-center justify-center">
            {isMuted ? (
              <VolumeX size={16} className="text-red-500" />
            ) : isPlaying ? (
              <Pause size={16} className="text-blue-500" />
            ) : (
              <Play size={16} className="text-grey-600" />
            )}
          </div>
        </button>
      ) : (
        /* Expanded State */
        <>
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsCollapsed(true);
              }
            }}
            className="p-1.5 rounded-lg text-grey-500 hover:text-grey-700 hover:bg-grey-100 hover:scale-105 active:scale-95 transition-all duration-200 border border-grey-200/50 hover:border-grey-300/70"
            title="Colapsar controles de audio"
            aria-label="Colapsar controles de audio"
          >
            <Minimize2 size={12} />
          </button>

          {/* Mute/Unmute Global */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            title={isMuted ? 'Desmutear todos los sonidos' : 'Mutear todos los sonidos'}
          >
            <div className="flex items-center justify-center">
              {isMuted ? (
                <VolumeX size={14} className="text-red-500" />
              ) : (
                <Volume2 size={14} className="text-grey-600" />
              )}
            </div>
          </button>

          {/* Music Play/Pause */}
          <button
            onClick={toggleMusic}
            disabled={isMuted}
            className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              isMuted ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={isMuted ? 'Sonidos muteados' : (isPlaying ? 'Pausar música' : 'Reproducir música')}
          >
            <div className="flex items-center justify-center">
              {isPlaying ? (
                <Pause size={14} className="text-blue-500" />
              ) : (
                <Play size={14} className="text-grey-600" />
              )}
            </div>
          </button>

          {/* Expanded Volume Slider */}
          <div className="flex items-center gap-2">
            <div className="relative w-32 group">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className="w-full h-1.5 appearance-none cursor-pointer disabled:opacity-30 transition-all duration-300"
                title="Volumen"
                style={{
                  background: `linear-gradient(to right, rgba(59, 130, 246, 0.7) 0%, rgba(59, 130, 246, 0.7) ${(isMuted ? 0 : volume) * 100}%, rgba(209, 213, 219, 0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(209, 213, 219, 0.2) 100%)`,
                  boxShadow: isMuted
                    ? 'inset 0 1px 2px rgba(0, 0, 0, 0.05)'
                    : '0 1px 4px rgba(59, 130, 246, 0.15), 0 0 0 0.5px rgba(59, 130, 246, 0.08)',
                  borderRadius: '0.75rem'
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
