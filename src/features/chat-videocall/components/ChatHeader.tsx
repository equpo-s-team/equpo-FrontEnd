import React from 'react';
import { Phone, Video, Info, MoreVertical } from 'lucide-react';
import {useChatContext} from "@/features/chat-videocall/components/ChatContext";

export default function ChatHeader() {
  const { activeConversation, startCall } = useChatContext();

  if (!activeConversation) return null;

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-grey-150 bg-primary flex-shrink-0">
      {/* Contact info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={`
            w-10 h-10 rounded-xl bg-gradient-to-br ${activeConversation.avatarGradient}
            flex items-center justify-center
            text-white font-body font-semibold text-sm
          `}>
            {activeConversation.initials}
          </div>
          {activeConversation.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-DEFAULT rounded-full border-2 border-primary" />
          )}
        </div>
        <div>
          <h3 className="font-body font-semibold text-grey-900 text-sm leading-tight">
            {activeConversation.name}
          </h3>
          <p className={`font-body text-xs leading-tight ${activeConversation.isOnline ? 'text-green-DEFAULT' : 'text-grey-400'}`}>
            {activeConversation.isOnline ? 'En línea' : 'Desconectado'}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <ActionButton onClick={() => startCall(false)} title="Llamada de voz">
          <Phone size={16} />
        </ActionButton>
        <ActionButton onClick={() => startCall(true)} title="Videollamada">
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

function ActionButton({ onClick, title, children }: {
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
