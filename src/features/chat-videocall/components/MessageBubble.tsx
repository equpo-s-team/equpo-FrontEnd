import { Check,Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { auth } from '@/firebase';

import type { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { editMessage, deleteMessage } = useChatContext();
  const currentUid = auth.currentUser?.uid;
  const isSent = message.senderUid === currentUid;

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const time =
    message.createdAt instanceof Date
      ? message.createdAt.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      : '';

  const handleSaveEdit = () => {
    if (editText.trim() && editText.trim() !== message.text) {
      editMessage(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (received only) */}
      {!isSent && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9] flex items-center justify-center text-white font-body font-semibold text-[10px]">
            {message.senderName?.slice(0, 2).toUpperCase() ?? '??'}
          </div>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
        max-w-[68%] relative group
        ${isSent ? 'items-end' : 'items-start'}
        flex flex-col
      `}
      >
        {/* Sender name (for received messages) */}
        {!isSent && (
          <span className="text-[10px] font-body font-semibold text-grey-500 mb-0.5 px-1">
            {message.senderName}
          </span>
        )}

        {isEditing ? (
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="flex-1 px-3 py-2 rounded-xl bg-grey-100 border border-grey-200 font-body text-sm text-grey-800 focus:outline-none focus:border-purple-DEFAULT"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="w-7 h-7 rounded-lg bg-green-DEFAULT/10 text-green-DEFAULT flex items-center justify-center hover:bg-green-DEFAULT/20 transition-colors"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-7 h-7 rounded-lg bg-red-DEFAULT/10 text-red-DEFAULT flex items-center justify-center hover:bg-red-DEFAULT/20 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div
            className={`
            px-3.5 py-2.5 rounded-2xl
            font-body text-sm leading-relaxed
            ${
              isSent
                ? 'bg-gradient-to-br from-purple-DEFAULT to-[#5961F9] text-white rounded-br-sm'
                : 'bg-grey-100 text-grey-800 rounded-bl-sm border border-grey-150'
            }
          `}
          >
            {message.text}
          </div>
        )}

        {/* Timestamp + edit/delete actions */}
        <div
          className={`flex items-center gap-1 mt-1 px-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <span className="text-grey-400 font-body text-[10px]">{time}</span>
          {message.editedAt && (
            <span className="text-grey-400 font-body text-[10px] italic">editado</span>
          )}

          {/* Edit/Delete actions for own messages */}
          {isSent && !isEditing && (
            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
              <button
                onClick={() => {
                  setEditText(message.text);
                  setIsEditing(true);
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors"
                title="Editar"
              >
                <Pencil size={10} />
              </button>
              <button
                onClick={handleDelete}
                className="w-5 h-5 rounded flex items-center justify-center text-grey-400 hover:text-red-DEFAULT transition-colors"
                title="Eliminar"
              >
                <Trash2 size={10} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
