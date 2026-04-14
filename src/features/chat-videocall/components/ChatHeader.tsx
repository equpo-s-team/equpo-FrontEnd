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
      <div className="flex items-center justify-between px-5 py-3">
        {/* Room info */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9] flex items-center justify-center text-white font-body font-semibold text-sm">
              {initials}
            </div>
          </div>
          <div>
            <h3 className="font-body font-semibold text-grey-900 text-sm leading-tight">
              {activeRoom.name}
            </h3>
            <p className="font-body text-xs leading-tight text-grey-400 flex items-center gap-1">
              <Users size={10} />
              Grupo
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ActionButton onClick={() => startCall(true)} title="Videollamada">
            <Video size={16} />
          </ActionButton>
          <ActionButton onClick={() => setShowInfo(true)} title="Información">
            <Info size={16} />
          </ActionButton>
        </div>
      </div>

      {/* Active Call Banner */}
      {isCallActive && (
        <div className="bg-green/10 text-green px-5 py-2 text-xs font-semibold flex justify-between items-center animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-2">
            <PhoneCall size={14} className="animate-pulse" /> Videollamada en curso
          </span>
          <button
            onClick={() => startVideoCallSession({ mode: 'join' })}
            className="bg-green text-white px-3 py-1 rounded-md hover:bg-green/90 transition-colors"
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
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="
        w-8 h-8 rounded-xl flex items-center justify-center
        text-grey-500 hover:text-grey-900 hover:bg-grey-100
        transition-all duration-200
      "
    >
      {children}
    </button>
  );
}
