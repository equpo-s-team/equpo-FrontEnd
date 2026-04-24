import { Bolt, Clipboard, Coins} from 'lucide-react';
import React, { useState } from 'react';

import { AppProgress } from '@/components/ui/AppProgress';
import { AppTooltip } from '@/components/ui/AppTooltip';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { toastSuccess } from '@/lib/toast';
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

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setIsCopied(true);
      toastSuccess('¡UID copiado!', 'El UID ha sido copiado al portapapeles');

      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
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
      <div className="backdrop-blur-md p-5 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-grey-800 dark:text-white text-xl leading-tight mb-2"
                style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
              >
                {user.displayName}
              </h3>

              <div className="flex items-center gap-2">
                <p
                  className={`text-sm font-mono transition-colors duration-200 ${
                    isCopied ? 'text-green-600' : 'text-grey-400'
                  }`}
                  title={user.uid}
                >
                  {user.uid}
                </p>
                <AppTooltip content={isCopied ? '¡Copiado!' : 'Copiar UID'}>
                  <button
                    onClick={handleCopyUid}
                    className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
                      isCopied
                        ? 'bg-green-100 text-green-600'
                        : 'text-grey-400 hover:text-grey-600 hover:bg-grey-100'
                    }`}
                  >
                    <Clipboard size={16} />
                  </button>
                </AppTooltip>
              </div>
            </div>

            <AppTooltip content="Configuración de perfil">
              <button
                onClick={onOpenSettings}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all shrink-0"
              >
                <Bolt size={20} />
              </button>
            </AppTooltip>
          </div>

          <div className="flex flex-row items-center mb-1">
            {/* Coins */}
            <div className="flex h-7 px-2 rounded-lg text-orange-400 border border-orange-200 bg-yellow-100/90 w-14 max-w-16 items-center justify-between mb-1 justify-between">
              <Coins size={14} />
              <span className="text-xs font-semibold">{user.virtualCurrency}</span>
            </div>

            {/* Rank */}
            <div
              className={`px-2 h-7 rounded-lg  ${rankBgColor} ${rankColor} flex max-w-24 items-center justify-center gap-1 text-xs font-bold mx-2`}
            >
              {React.createElement(rankIcon, { size: 14 })}
              {rankName}
            </div>
          </div>

          <p className="text-xs text-grey-400 font-mono mb-2 truncate" title={user.uid}>
            {user.uid.length > 20 ? `${user.uid.substring(0, 20)}…` : user.uid}
          </p>

          {/* XP bar */}
          <div>
            <div className="flex items-left justify-between mb-1">
              <span className="text-xs font-semibold text-grey-500">
                Nivel {user.level} → {user.level + 1}
              </span>
              <span className="text-xs font-bold" style={{ color: '#9b7fe1' }}>
                {user.experience.toLocaleString()} / {user.experienceToNextLevel.toLocaleString()}{' '}
                XP
              </span>
            </div>
            <AppProgress
              value={xpPercent}
              gradientStyle="linear-gradient(90deg, #60AFFF 0%, #9b7fe1 100%)"
              glow="0 0 8px rgba(155,127,225,0.5)"
              height="h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
