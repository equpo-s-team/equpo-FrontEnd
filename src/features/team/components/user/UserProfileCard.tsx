import {Bolt} from "lucide-react";
import React from 'react';

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
  const xpPercent = Math.min(
    100,
    Math.round((user.experience / user.experienceToNextLevel) * 100),
  );

  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className="relative w-full"
    >
      <div
        className="backdrop-blur-md p-5 flex items-center gap-4"
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-14 h-14 rounded-2xl object-cover"
              style={{ boxShadow: '0 4px 14px rgba(96,175,255,0.35)' }}
            />
          ) : (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
              style={{
                background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 100%)',
                boxShadow: '0 4px 14px rgba(96,175,255,0.4)',
              }}
            >
              {initials}
            </div>
          )}
          {/* Level badge */}
          <div
            className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
            style={{ background: 'linear-gradient(135deg, #9b7fe1, #5961F9)' }}
          >
            {user.level}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <h3
              className="font-bold text-grey-800 text-md leading-tight truncate"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
            >
              {user.displayName}
            </h3>
            <button
              onClick={onOpenSettings}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-grey-400 hover:text-grey-700 hover:bg-grey-100 transition-all shrink-0"
              title="Configuración de perfil"
            >
              <Bolt/>
            </button>
          </div>

          <p
            className="text-[11px] text-grey-400 font-mono mb-2 truncate"
            title={user.uid}
          >
            {user.uid.length > 20 ? `${user.uid.substring(0, 20)}…` : user.uid}
          </p>

          {/* XP bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-semibold text-grey-500">
                Nivel {user.level} → {user.level + 1}
              </span>
              <span
                className="text-[10px] font-bold"
                style={{ color: '#9b7fe1' }}
              >
                {user.experience.toLocaleString()} / {user.experienceToNextLevel.toLocaleString()} XP
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-grey-150 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${xpPercent}%`,
                  background: 'linear-gradient(90deg, #60AFFF 0%, #9b7fe1 100%)',
                  boxShadow: '0 0 8px rgba(155,127,225,0.5)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
