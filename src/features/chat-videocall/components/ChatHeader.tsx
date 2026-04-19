import { Info, PhoneCall, Users, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useActiveCalls } from '@/features/chat-videocall/hooks/useActiveCalls';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

import ChatInfoModal from './ChatInfoModal';

export default function ChatHeader() {
  const { activeRoom, startVideoCallSession, startCall, teamId } = useChatContext();
  const [showInfo, setShowInfo] = useState(false);
  const activeCalls = useActiveCalls(teamId || '');
  const { data: teamMembers = [] } = useTeamMembers(teamId || '');

  const usersInfo = useMemo(
    () => teamMembers.map((member) => ({ uid: member.uid, displayName: member.displayName })),
    [teamMembers],
  );

  if (!activeRoom) return null;

  const isCallActive = activeCalls.some((c) => c.roomId === activeRoom.id);

  const initials = activeRoom.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col flex-shrink-0 bg-primary border-b border-grey-150">
      <div className="flex items-center justify-between px-3 sm:px-5 py-2 sm:py-3">
        {/* Left: Room info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9] flex items-center justify-center text-white font-body font-semibold text-xs sm:text-sm">
              {initials}
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="font-body font-semibold text-grey-900 text-xs sm:text-sm leading-tight truncate">
              {activeRoom.name}
            </h3>
            <p className="font-body text-[10px] sm:text-xs leading-tight text-grey-400 flex items-center gap-0.5">
              <Users size={8} />
              Grupo
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
          <ActionButton onClick={() => startCall(true)} title="Videollamada" size="sm">
            <Video size={14} />
          </ActionButton>
          <ActionButton onClick={() => setShowInfo(true)} title="Información" size="sm">
            <Info size={14} />
          </ActionButton>
        </div>
      </div>

      {/* Active Call Banner */}
      {isCallActive && (
        <div className="bg-green/10 text-green px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-semibold flex justify-between items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-1.5">
            <PhoneCall size={12} className="animate-pulse" /> Videollamada en curso
          </span>
          <button
            onClick={() => startVideoCallSession({ mode: 'join' })}
            className="bg-green text-white px-2 py-0.5 rounded text-[10px] sm:text-xs hover:bg-green/90 transition-colors whitespace-nowrap"
          >
            Unirse
          </button>
        </div>
      )}

      {showInfo && <ChatInfoModal onClose={() => setShowInfo(false)} usersInfo={usersInfo} />}
    </div>
  );
}

function ActionButton({
  onClick,
  title,
  children,
  size = 'md'
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md'
}) {
  const sizeClasses = size === 'sm' ? 'w-7 h-7' : 'w-8 h-8';
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        ${sizeClasses} rounded-lg flex items-center justify-center
        text-grey-600 hover:bg-grey-100 transition-colors
      `}
    >
      {children}
    </button>
  );
}
