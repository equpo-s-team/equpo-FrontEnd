import { ArrowLeft, Info, PhoneCall, Users, Video } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import { AppTooltip } from '@/components/ui/AppTooltip';
import { GroupAvatar } from '@/components/ui/GroupAvatar.tsx';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useActiveCalls } from '@/features/chat-videocall/hooks/useActiveCalls';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

import ChatInfoModal from './ChatInfoModal';

export default function ChatHeader() {
  const { activeRoom, startVideoCallSession, startCall, teamId, clearActiveRoom } = useChatContext();
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
    <div className="flex flex-col flex-shrink-0 bg-primary dark:bg-gray-900 border-b border-grey-150 dark:border-gray-800">
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 gap-3">
        {/* Back button for mobile */}
        <button
          onClick={clearActiveRoom}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-grey-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          title="Volver a chats"
        >
          <ArrowLeft size={18} className="text-grey-700 dark:text-gray-300" />
        </button>

        {/* Room avatar + name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <GroupAvatar src={activeRoom.photoUrl} name={activeRoom.name} className="w-8 h-8 sm:w-10 sm:h-10" />
          <div className="min-w-0">
            <h3 className="font-body font-semibold text-grey-900 dark:text-gray-300 text-sm sm:text-base leading-tight truncate">
              {activeRoom.name}
            </h3>
            <p className="font-body text-xs leading-tight text-grey-400 flex items-center gap-1">
              <Users size={10} />
              Grupo
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <ActionButton onClick={() => startCall(true)} tooltipContent="Videollamada">
            <Video size={16} />
          </ActionButton>
          <ActionButton onClick={() => setShowInfo(true)} tooltipContent="Información">
            <Info size={16} />
          </ActionButton>
        </div>
      </div>

      {/* Active Call Banner */}
      {isCallActive && (
        <div className="bg-green/10 text-green px-3 sm:px-5 py-2 text-xs font-semibold flex justify-between items-center animate-in fade-in slide-in-from-top-2 gap-2">
          <span className="flex items-center gap-2 min-w-0">
            <PhoneCall size={14} className="animate-pulse flex-shrink-0" /> 
            <span className="truncate">Videollamada en curso</span>
          </span>
          <button
            onClick={() => startVideoCallSession({ mode: 'join' })}
            className="bg-green text-white px-2 sm:px-3 py-1 rounded-md hover:bg-green/90 transition-colors text-xs whitespace-nowrap flex-shrink-0"
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
  tooltipContent,
  children,
}: {
  onClick: () => void;
  tooltipContent: string;
  children: React.ReactNode;
}) {
  return (
    <AppTooltip content={tooltipContent}>
      <button
        onClick={onClick}
        className="
          w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center
          text-grey-500 hover:text-grey-900 hover:bg-grey-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800
          transition-all duration-200
        "
      >
        {children}
      </button>
    </AppTooltip>
  );
}
