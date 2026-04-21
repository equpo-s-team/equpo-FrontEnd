import { Info, PhoneCall, Users, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { GroupAvatar } from '@/components/ui/GroupAvatar.tsx';
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
    () =>
      teamMembers.map((member) => ({
        uid: member.uid,
        displayName: member.displayName,
        photoURL: member.photoUrl,
      })),
    [teamMembers],
  );

  if (!activeRoom) return null;

  const isCallActive = activeCalls.some((c) => c.roomId === activeRoom.id);

  return (
    <>
      <AppHeader
        title={activeRoom.name}
        subtitle="Grupo"
        variant="green"
        actions={
          <div className="flex items-center gap-1">
            <ActionButton onClick={() => startCall(true)} title="Videollamada">
              <Video size={16} />
            </ActionButton>
            <ActionButton onClick={() => setShowInfo(true)} title="Información">
              <Info size={16} />
            </ActionButton>
          </div>
        }
      />

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
    </>
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
