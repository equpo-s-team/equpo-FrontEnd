import { Bolt, Clipboard, Coins} from 'lucide-react';
import React, { useState } from 'react';

import { AppProgress } from '@/components/ui/AppProgress';
import { AppTooltip } from '@/components/ui/AppTooltip';
import { toastSuccess } from '@/components/ui/toast';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import {type Rank, ranks} from "@/features/team/types/rankTypes.ts";

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
  virtualCurrency: number;
}

interface UserProfileCardProps {
  user: UserProfile;
  onOpenSettings: () => void;
}

export function levelToRank(nivel: number): Rank {
  const rankProgress = Math.max(0, Math.floor((nivel - 1) / 5));

  switch (rankProgress) {
    case 0:
      return ranks[0];
    case 1:
      return ranks[1];
    case 2:
      return ranks[2];
    case 3:
      return ranks[3];
    case 4:
      return ranks[4];
    case 5:
      return ranks[5];
    case 6:
      return ranks[6];
    case 7:
      return ranks[7];
    case 8:
      return ranks[8];
    default:
      return ranks[9];
  }
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onOpenSettings }) => {
  const [isCopied, setIsCopied] = useState(false);
  const xpPercent = Math.min(100, Math.round((user.experience / user.experienceToNextLevel) * 100));

  const handleCopyUid = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setIsCopied(true);
      toastSuccess('¡UID copiado!', 'El UID ha sido copiado al portapapeles');

      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = user.uid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setIsCopied(true);
      toastSuccess('¡UID copiado!', 'El UID ha sido copiado al portapapeles');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const rankName:string = levelToRank(user.level).name;
  const rankColor:string = levelToRank(user.level).color;
  const rankBgColor:string = levelToRank(user.level).bgColor;
  const rankIcon:React.ElementType = levelToRank(user.level).icon;

  return (
    <div className="relative w-full">
      <div className="backdrop-blur-md p-5 flex items-start gap-4">
        {/* Left Column: Avatar & Mobile Settings */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative">
            <UserAvatar
              src={user.photoURL}
              alt={user.displayName}
              className="w-14 h-14"
              style={{ boxShadow: '0 4px 14px rgba(96,175,255,0.35)' }}
              fallbackClassName="text-white text-lg"
              loading="eager"
            />
            {/* Level badge */}
            <div
              className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold border-2 border-white"
              style={{ background: 'linear-gradient(135deg, #9b7fe1, #5961F9)' }}
            >
              {user.level}
            </div>
          </div>

          {/* Mobile Settings Button - Only visible on mobile */}
          <button
            onClick={onOpenSettings}
            className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all"
            aria-label="Configuración de perfil"
          >
            <Bolt size={18} />
          </button>
        </div>

        {/* Right Column: Name, Desktop Settings, UID, Stats, Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-grey-800 dark:text-white text-xl leading-tight"
                style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
              >
                {user.displayName}
              </h3>

              {/* UID display */}
              <div className="flex items-center gap-2 mt-1 mb-2">
                <p
                  className={`text-xs font-mono transition-colors duration-200 truncate ${
                    isCopied ? 'text-green-600' : 'text-grey-400'
                  }`}
                  title={user.uid}
                >
                  {user.uid}
                </p>
                <button
                  onClick={() => void handleCopyUid()}
                  className={`p-1 rounded-lg transition-all duration-200 transform hover:scale-105 shrink-0 ${
                    isCopied
                      ? 'bg-green-100 text-green-600'
                      : 'text-grey-400 hover:text-grey-600 dark:hover:text-gray-300 hover:bg-grey-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Clipboard size={14} />
                </button>
              </div>
            </div>

            {/* Desktop Settings Button - Hidden on mobile */}
            <AppTooltip content="Configuración de perfil">
              <button
                onClick={onOpenSettings}
                className="hidden lg:flex w-10 h-10 rounded-xl items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all shrink-0"
              >
                <Bolt size={20} />
              </button>
            </AppTooltip>
          </div>

          {/* Stats: Coins & Rank */}
          <div className="flex flex-row items-center gap-2 mb-3">
            {/* Coins */}
            <div className="flex h-7 px-2.5 rounded-lg text-orange-400 border border-orange-200 bg-yellow-100/90 items-center gap-1.5">
              <Coins size={14} />
              <span className="text-xs font-bold">{user.virtualCurrency}</span>
            </div>

            {/* Rank */}
            <div
              className={`px-2.5 h-7 rounded-lg ${rankBgColor} ${rankColor} flex items-center gap-1.5 text-xs font-bold`}
            >
              {React.createElement(rankIcon, { size: 14 })}
              {rankName}
            </div>
          </div>

          {/* XP Progress Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold text-grey-500 uppercase tracking-wider">
                Nivel {user.level} → {user.level + 1}
              </span>
              <span className="text-[10px] sm:text-xs font-bold" style={{ color: '#9b7fe1' }}>
                {user.experience.toLocaleString()} / {user.experienceToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <AppProgress
              value={xpPercent}
              gradientStyle="linear-gradient(90deg, #60AFFF 0%, #9b7fe1 100%)"
              glow="0 0 8px rgba(155,127,225,0.4)"
              height="h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
