import { ChartColumnBig, Home, MessageCircle, Pause, Play, Settings, Star, UserCheck, Volume2, VolumeX } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useAudio } from '@/context/AudioContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { useTeams } from '@/features/team/hooks/useTeams';

import { useSidebar } from './SidebarContext.jsx';
import SidebarItem from './SidebarItem.jsx';
import SidebarLogo from './SidebarLogo.jsx';
import SidebarSection from './SidebarSection.jsx';
import SidebarToggle from './SidebarToggle.jsx';
import SidebarUser from './SidebarUser.jsx';

export default function Sidebar() {
  const { collapsed } = useSidebar();
  const { user } = useAuth();
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
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

  // Determine the current user's role in the active team
  const currentTeam = teams.find((t) => t.id === teamId);
  const currentUid = user?.uid ?? '';
  const myRole = (() => {
    if (!currentTeam || !currentUid) return null;
    if (currentTeam.leaderUid === currentUid) return 'leader';
    return currentTeam.members.find((m) => m.userUid === currentUid)?.role ?? null;
  })();
  const canAccessSettings = myRole === 'leader' || myRole === 'collaborator';

  return (
    <aside
      className={`
    hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50 rounded-r-2xl
    bg-primary border-r border-secondary transition-all duration-300 ease-in-out
    ${collapsed ? 'w-[68px]' : 'w-[220px]'}
    shadow-neonPurple
  `}
    >
      <SidebarLogo />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5 scrollbar-hide">
        <SidebarSection label="Principal">
          <SidebarItem id="my-space" icon={Home} label="Mi Espacio" />
          <SidebarItem id="missiones" icon={Star} label="Misiones del Equipo" badge="3" />
          <SidebarItem id="my-missions" icon={UserCheck} label="Mis Misiones" />
          <SidebarItem id="chat" icon={MessageCircle} label="Chat" badge="12" />
        </SidebarSection>

        <SidebarSection label="Moderation">
          <SidebarItem id="reports" icon={ChartColumnBig} label="Reportes" badge="2" />
          {canAccessSettings && (
            <SidebarItem id="settings" icon={Settings} label="Ajustes del Equipo" />
          )}
        </SidebarSection>
      </nav>

      {/* Audio Controls Section */}
      <div className={`px-2 py-3 transition-all duration-300 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="space-y-2">
            <div className="text-[10px] font-semibold text-grey-500 uppercase tracking-wider px-1">Audio</div>
            <div className="space-y-2">
              {/* Mute/Volume Control */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-grey-600 hover:text-grey-800 hover:bg-grey-200 transition-all duration-200"
                  title={isMuted ? 'Desmutear audio' : 'Mutear audio'}
                >
                  {isMuted ? <VolumeX size={14} className="text-red-500" /> : <Volume2 size={14} />}
                </button>
                <div className="flex-1 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value);
                      setVolume(newVolume);
                    }}
                    disabled={isMuted}
                    className="w-full h-1 appearance-none cursor-pointer disabled:opacity-30 transition-all duration-200"
                    style={{
                      background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${(isMuted ? 0 : volume) * 100}%, rgb(229, 231, 235) ${(isMuted ? 0 : volume) * 100}%, rgb(229, 231, 235) 100%)`,
                      borderRadius: '0.25rem',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none'
                    }}
                  />
                  <style jsx>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 12px;
                      height: 12px;
                      background: rgb(107, 114, 128);
                      border-radius: 50%;
                      cursor: pointer;
                      border: none;
                      transition: all 0.2s ease;
                    }
                    input[type="range"]::-webkit-slider-thumb:hover {
                      background: rgb(75, 85, 99);
                      transform: scale(1.1);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 12px;
                      height: 12px;
                      background: rgb(107, 114, 128);
                      border-radius: 50%;
                      cursor: pointer;
                      border: none;
                      transition: all 0.2s ease;
                    }
                    input[type="range"]::-moz-range-thumb:hover {
                      background: rgb(75, 85, 99);
                      transform: scale(1.1);
                    }
                    input[type="range"]:disabled::-webkit-slider-thumb {
                      background: rgb(209, 213, 235);
                      cursor: not-allowed;
                      transform: scale(1);
                    }
                    input[type="range"]:disabled::-moz-range-thumb {
                      background: rgb(209, 213, 235);
                      cursor: not-allowed;
                      transform: scale(1);
                    }
                  `}</style>
                </div>
                <span className="text-[10px] text-grey-500 min-w-[28px] text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
              
              {/* Music Play/Pause Control */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50">
                <button
                  onClick={() => {
                    if (!isPlaying) {
                      setMusicEnabled(true);
                      setTimeout(() => playBackgroundMusic(), 200);
                    } else {
                      pauseBackgroundMusic();
                      setMusicEnabled(false);
                    }
                  }}
                  disabled={isMuted}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isMuted 
                      ? 'text-grey-400 cursor-not-allowed opacity-50' 
                      : isPlaying 
                        ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-100' 
                        : 'text-grey-600 hover:text-grey-800 hover:bg-grey-200'
                  }`}
                  title={isMuted ? 'Audio muteado' : (isPlaying ? 'Pausar música' : 'Reproducir música')}
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <span className="text-[10px] text-grey-500">
                  {isPlaying ? 'Música ON' : 'Música OFF'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg text-grey-600 hover:text-grey-800 hover:bg-secondary transition-all duration-200"
              title={isMuted ? 'Desmutear audio' : 'Mutear audio'}
            >
              {isMuted ? <VolumeX size={16} className="text-red-500" /> : <Volume2 size={16} />}
            </button>
            <button
              onClick={() => {
                if (!isPlaying) {
                  setMusicEnabled(true);
                  setTimeout(() => playBackgroundMusic(), 200);
                } else {
                  pauseBackgroundMusic();
                  setMusicEnabled(false);
                }
              }}
              disabled={isMuted}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isMuted 
                  ? 'text-grey-400 cursor-not-allowed opacity-50' 
                  : isPlaying 
                    ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-100' 
                    : 'text-grey-600 hover:text-grey-800 hover:bg-secondary'
              }`}
              title={isMuted ? 'Audio muteado' : (isPlaying ? 'Pausar música' : 'Reproducir música')}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        )}
      </div>

      <SidebarUser />
      <SidebarToggle />
    </aside>
  );
}
