import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useTyping } from '@/features/chat-videocall/hooks/useTyping';
import { auth, db } from '@/firebase';
import { useSoundEffects } from '@/hooks/useSoundEffects';

import type { ChatMessage } from '../types/chat';
import MessageBubble from './MessageBubble';

function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px bg-grey-150 dark: bg-grey-700" />
      <span className="font-body text-xs text-grey-400 font-medium">{label}</span>
      <div className="flex-1 h-px bg-grey-150 dark: bg-grey-700" />
    </div>
  );
}

function SystemMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex justify-center my-2">
      <span className="px-3 py-1 rounded-full bg-grey-100 dark:bg-gray-900 border border-grey-150 dark:border-gray-700 font-body text-xs text-grey-500 dark:text-gray-300">
        {message.text}
      </span>
    </div>
  );
}

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  messages.forEach((msg) => {
    const d = msg.createdAt instanceof Date ? msg.createdAt : new Date(msg.createdAt);
    let label = '';
    if (d.toDateString() === today.toDateString()) label = 'Hoy';
    else if (d.toDateString() === yesterday.toDateString()) label = 'Ayer';
    else
      label = d.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
      });

    const last = groups[groups.length - 1];
    if (!last || last.date !== label) groups.push({ date: label, messages: [msg] });
    else last.messages.push(msg);
  });

  return groups;
}

export default function MessageArea() {
  const { activeRoom, messages, teamId } = useChatContext();
  const { play } = useSoundEffects();
  const bottomRef = useRef<HTMLDivElement>(null);
  const currentUid = auth.currentUser?.uid;
  const messagesRef = useRef<ChatMessage[]>([]);
  const isInitializedRef = useRef(false);

  const { typingUsers } = useTyping(teamId, activeRoom?.id || null);

  useEffect(() => {
    isInitializedRef.current = false;
    messagesRef.current = [];
  }, [activeRoom?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    if (!isInitializedRef.current && messages.length > 0) {
      messagesRef.current = messages;
      isInitializedRef.current = true;
      return;
    }

    const previousMessages = messagesRef.current;
    const newMessages = messages.filter(
      (msg) => !previousMessages.find((prev) => prev.id === msg.id),
    );

    newMessages.forEach((msg) => {
      if (msg.senderUid !== currentUid && msg.type !== 'system') {
        play('messageReceived');
      }
    });

    messagesRef.current = messages;

    if (activeRoom && currentUid && teamId) {
      messages.forEach((msg) => {
        if (msg.senderUid !== currentUid && (!msg.readBy || !msg.readBy.includes(currentUid))) {
          const msgRef = doc(db, 'teams', teamId, 'chatRooms', activeRoom.id, 'messages', msg.id);
          updateDoc(msgRef, {
            readBy: arrayUnion(currentUid),
          }).catch(() => {});
        }
      });
    }
  }, [messages, activeRoom, teamId, currentUid, play]);

  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-3xl bg-grey-100 dark:bg-gray-600 flex items-center justify-center mb-4">
          <MessageCircle size={28} strokeWidth={1.5} className="text-grey-300" />
        </div>
        <h3 className="font-body font-semibold text-grey-700 text-base mb-1">
          Selecciona una sala
        </h3>
        <p className="font-body text-sm text-grey-400 max-w-xs">
          Elige un chat de la lista para comenzar a mensajear
        </p>
      </div>
    );
  }

  const groups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-1 scrollbar-hide">
      {groups.map((group) => (
        <div key={group.date}>
          <DateDivider label={group.date} />
          <div className="flex flex-col gap-1">
            {group.messages.map((msg) => {
              if (msg.type === 'system') {
                return <SystemMessage key={msg.id} message={msg} />;
              }
              return <MessageBubble key={msg.id} message={msg} />;
            })}
          </div>
        </div>
      ))}

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="text-xs text-grey-500 italic mt-2 ml-2">
          {typingUsers.length === 1
            ? `${typingUsers[0].name} está escribiendo...`
            : 'Varios usuarios están escribiendo...'}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
