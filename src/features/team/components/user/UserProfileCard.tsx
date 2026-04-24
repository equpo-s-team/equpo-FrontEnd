import { Bolt, Clipboard } from 'lucide-react';
import React, { useState } from 'react';

import { AppProgress } from '@/components/ui/AppProgress';
import { AppTooltip } from '@/components/ui/AppTooltip';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { toastSuccess } from '@/lib/toast';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string | null;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

interface UserProfileCardProps {
  user: UserProfile;
  onOpenSettings: () => void;
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

  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="relative w-full">
      <div className="backdrop-blur-md p-5 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <UserAvatar
            src={user.photoURL}
            alt={user.displayName}
            initials={initials}
            className="w-20 h-20"
            style={{ boxShadow: '0 6px 20px rgba(96,175,255,0.4)' }}
            fallbackClassName="text-white text-xl"
            fallbackStyle={{
              background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 100%)',
              boxShadow: '0 6px 20px rgba(96,175,255,0.5)',
            }}
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
                className="font-bold text-grey-800 text-xl leading-tight mb-2"
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

          {/* XP bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
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
