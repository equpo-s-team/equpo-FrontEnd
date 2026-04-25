import {
  ChartColumnBig,
  Home,
  MessageCircle,
  Pause,
  Play,
  Settings,
  Star,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { useAudio } from '@/context/AudioContext.tsx';
import { useAuth } from '@/context/AuthContext';
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
    isMuted,
    playBackgroundMusic,
    pauseBackgroundMusic,
    setVolume,
    setMusicEnabled,
    toggleMute,
  } = useAudio();

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
    hidden lg:flex flex-col fixed left-0 top-0 h-screen z-50
    bg-primary border-r border-secondary transition-all duration-300 ease-in-out
    ${collapsed ? 'w-[68px]' : 'w-[220px]'}
    shadow-neonPurple
  `}
    >
      <SidebarLogo />

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 flex flex-col gap-5 scrollbar-hide">
        <SidebarSection label="Principal">
          <SidebarItem id="my-space" icon={Home} label="Mi Espacio" />
          <SidebarItem id="missiones" icon={Star} label="Misiones del Equipo" />
          {myRole !== 'spectator' && (
            <SidebarItem id="my-missions" icon={UserCheck} label="Mis Misiones" />
          )}
          <SidebarItem id="chat" icon={MessageCircle} label="Chat" />
        </SidebarSection>

        <SidebarSection label="Moderación">
          <SidebarItem id="reports" icon={ChartColumnBig} label="Reportes" />
          {canAccessSettings && <SidebarItem id="settings" icon={Settings} label="Ajustes" />}
        </SidebarSection>
      </nav>

      <div
        className={`px-2 py-3 transition-all duration-300 ${collapsed ? 'flex justify-center' : ''}`}
      >
        {!collapsed ? (
          <div className="space-y-2">
            <div className="px-3 pt-1 pb-0.5 text-xs font-body font-semibold tracking-widest uppercase text-purple select-none">
              Audio
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2">
                <button
                  onClick={toggleMute}
                  className="p-1.5 rounded-lg text-grey-600 hover:text-grey-800 hover:bg-grey-200 transition-all duration-200"
                  title={isMuted ? 'Desmutear audio' : 'Mutear audio'}
                >
                  {isMuted ? (
                    <VolumeX size={14} className="text-red-500" />
                  ) : (
                    <Volume2 size={14} className="text-grey-600" />
                  )}
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
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    isMuted
                      ? 'text-grey-400 cursor-not-allowed opacity-50'
                      : isPlaying
                        ? 'text-blue-500 hover:text-blue-600 hover:bg-blue-100'
                        : 'text-grey-600 hover:text-grey-800 hover:bg-grey-200'
                  }`}
                  title={
                    isMuted ? 'Audio muteado' : isPlaying ? 'Pausar música' : 'Reproducir música'
                  }
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
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
                      background: `linear-gradient(to right, #60AFFF 0%, #60AFFF ${(isMuted ? 0 : volume) * 100}%, rgba(209, 213, 235, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(209, 213, 235, 0.3) 100%)`,
                      borderRadius: '0.25rem',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      boxShadow:
                        '0 0 8px rgba(96, 175, 255, 0.4), 0 0 18px rgba(96, 175, 255, 0.2)',
                    }}
                  />
                  <style>{`
                    input[type='range']::-webkit-slider-thumb {
                      appearance: none;
                      width: 12px;
                      height: 12px;
                      background: #60afff;
                      border-radius: 50%;
                      cursor: pointer;
                      border: none;
                      transition: all 0.2s ease;
                      box-shadow:
                        0 0 8px rgba(96, 175, 255, 0.6),
                        0 0 18px rgba(96, 175, 255, 0.3);
                    }
                    input[type='range']::-webkit-slider-thumb:hover {
                      background: #4a9fef;
                      transform: scale(1.1);
                      box-shadow:
                        0 0 12px rgba(96, 175, 255, 0.8),
                        0 0 24px rgba(96, 175, 255, 0.4);
                    }
                    input[type='range']::-moz-range-thumb {
                      width: 12px;
                      height: 12px;
                      background: #60afff;
                      border-radius: 50%;
                      cursor: pointer;
                      border: none;
                      transition: all 0.2s ease;
                      box-shadow:
                        0 0 8px rgba(96, 175, 255, 0.6),
                        0 0 18px rgba(96, 175, 255, 0.3);
                    }
                    input[type='range']::-moz-range-thumb:hover {
                      background: #4a9fef;
                      transform: scale(1.1);
                      box-shadow:
                        0 0 12px rgba(96, 175, 255, 0.8),
                        0 0 24px rgba(96, 175, 255, 0.4);
                    }
                    input[type='range']:disabled::-webkit-slider-thumb {
                      background: rgb(209, 213, 235);
                      cursor: not-allowed;
                      transform: scale(1);
                      box-shadow: none;
                    }
                    input[type='range']:disabled::-moz-range-thumb {
                      background: rgb(209, 213, 235);
                      cursor: not-allowed;
                      transform: scale(1);
                      box-shadow: none;
                    }
                  `}</style>
                </div>
                <span className="text-[10px] text-grey-500 min-w-[28px] text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleMute}
            className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl text-primary-foreground hover:text-tertiary-foreground hover:bg-secondary transition-all duration-200"
            title={isMuted ? 'Desmutear audio' : 'Mutear audio'}
          >
            {isMuted ? <VolumeX size={18} className="text-red-500" /> : <Volume2 size={18} />}
          </button>
        )}
      </div>

      <SidebarUser />
      <SidebarToggle />
    </aside>
  );
}
