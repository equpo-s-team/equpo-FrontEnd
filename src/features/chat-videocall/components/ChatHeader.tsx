import React from 'react';
import { Video, Info, MoreVertical, Users } from 'lucide-react';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext';

export default function ChatHeader() {
  const { activeRoom, startVideoCallSession } = useChatContext();

  if (!activeRoom) return null;

  const initials = activeRoom.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-grey-150 bg-primary flex-shrink-0">
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
        <ActionButton
          onClick={() => startVideoCallSession({ mode: 'new' })}
          title="Videollamada"
        >
          <Video size={16} />
        </ActionButton>
        <ActionButton onClick={() => {}} title="Información">
          <Info size={16} />
        </ActionButton>
        <ActionButton onClick={() => {}} title="Más opciones">
          <MoreVertical size={16} />
        </ActionButton>
      </div>
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
