import { Volume2, VolumeX, Play, Pause, Minimize2, Maximize2 } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useState } from 'react';

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

  const [isCollapsed, setIsCollapsed] = useState(false);

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
      className={`fixed z-50 bg-primary border-l-[1.5px] border-grey-200 shadow-card-lg transition-all duration-300 ${
        isCollapsed 
          ? 'w-12 h-12 rounded-full flex items-center justify-center top-4 right-4' 
          : 'top-4 right-4 p-3 flex items-center gap-3'
      }`}
    >
      {isCollapsed ? (
        /* Collapsed State */
        <div className="relative">
          {/* Mute/Play/Pause combined button */}
          <button
            onClick={() => {
              if (isMuted) {
                toggleMute();
              } else {
                toggleMusic();
              }
            }}
            className={`p-2 rounded-full transition-all duration-150 ${
              isMuted 
                ? 'text-red bg-red/8 border border-red/30' 
                : isPlaying 
                  ? 'text-blue bg-blue/8 border border-blue/30' 
                  : 'text-grey-600 hover:text-grey-700 hover:bg-secondary'
            }`}
            title={isMuted ? 'Desmutear' : (isPlaying ? 'Pausar' : 'Reproducir')}
          >
            {isMuted ? <VolumeX size={16} /> : isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          
          {/* Expand button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="absolute -top-1 -right-1 p-1 bg-blue text-white rounded-full text-[10px] hover:bg-blue/80 transition-colors"
            title="Expandir"
          >
            <Maximize2 size={10} />
          </button>
        </div>
      ) : (
        /* Expanded State */
        <>
          {/* Collapse button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-[8px] text-grey-500 hover:text-grey-700 hover:bg-secondary transition-all duration-150"
            title="Colapsar"
          >
            <Minimize2 size={14} />
          </button>
          
          {/* Mute/Unmute Global */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-[10px] transition-all duration-150 ${
              isMuted
                ? 'text-red bg-red/8 border border-red/30'
                : 'text-grey-600 hover:text-grey-700 hover:bg-secondary'
            }`}
            title={isMuted ? 'Desmutear todos los sonidos' : 'Mutear todos los sonidos'}
          >
            {getVolumeIcon()}
          </button>

          {/* Music Play/Pause */}
          <button
            onClick={toggleMusic}
            disabled={isMuted}
            className={`p-2 rounded-[10px] transition-all duration-150 ${
              isMuted
                ? 'text-grey-400 cursor-not-allowed'
                : isPlaying
                  ? 'text-blue bg-blue/8 border border-blue/30'
                  : 'text-grey-600 hover:text-grey-700 hover:bg-secondary'
            }`}
            title={isMuted ? 'Sonidos muteados' : (isPlaying ? 'Pausar música' : 'Reproducir música')}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          {/* Expanded Volume Slider */}
          <div className="flex items-center gap-2">
            <div className="relative w-32">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                disabled={isMuted}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer disabled:opacity-40"
                title="Volumen"
                style={{
                  background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(isMuted ? 0 : volume) * 100}%, rgb(229, 231, 235) ${(isMuted ? 0 : volume) * 100}%, rgb(229, 231, 235) 100%)`
                }}
              />
            </div>
            <span className="text-[11px] text-grey-500 min-w-[28px] font-medium">
              {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
