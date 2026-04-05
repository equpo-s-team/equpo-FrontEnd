import { useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import {Message} from "postcss";
import {useChatContext} from "@/features/chat-videocall/components/ChatContext.tsx";

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-grey-150" />
      <span className="font-body text-xs text-grey-400 font-medium">{label}</span>
      <div className="flex-1 h-px bg-grey-150" />
    </div>
  );
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  messages.forEach(msg => {
    const d = new Date(msg.timestamp);
    let label = '';
    if (d.toDateString() === today.toDateString()) label = 'Hoy';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Ayer';
    else label = d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

    const last = groups[groups.length - 1];
    if (!last || last.date !== label) groups.push({ date: label, messages: [msg] });
    else last.messages.push(msg);
  });

  return groups;
}

export default function MessageArea() {
  const { activeConversation } = useChatContext();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (!activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-3xl bg-grey-100 flex items-center justify-center mb-4">
          <MessageCircle size={28} strokeWidth={1.5} className="text-grey-300" />
        </div>
        <h3 className="font-body font-semibold text-grey-700 text-base mb-1">
          Selecciona una conversación
        </h3>
        <p className="font-body text-sm text-grey-400 max-w-xs">
          Elige un chat de la lista para comenzar a mensajear
        </p>
      </div>
    );
  }

  const groups = groupMessagesByDate(activeConversation.messages);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 scrollbar-hide">
      {groups.map(group => (
        <div key={group.date}>
          <DateDivider label={group.date} />
          <div className="flex flex-col gap-1">
            {group.messages.map((msg, idx) => {
              const isSent = msg.senderId === 'me';
              const isLast = idx === group.messages.length - 1 || group.messages[idx + 1]?.senderId !== msg.senderId;
              return (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isSent={isSent}
                  showAvatar={!isSent && isLast}
                  avatarGradient={activeConversation.avatarGradient}
                  initials={activeConversation.initials}
                />
              );
            })}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
