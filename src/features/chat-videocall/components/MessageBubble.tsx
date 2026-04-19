import { Check, CheckCheck, FileText, Pencil, Reply, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { auth } from '@/firebase';

import type { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { editMessage, deleteMessage, setReplyingTo } = useChatContext();
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

  const handleReply = () => {
    setReplyingTo(message);
  };

  const isReadByOthers = message.readBy && message.readBy.length > 1;

  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (received only) */}
      {!isSent && (
        <div className="flex-shrink-0 mb-1">
          <div className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg sm:rounded-xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9] flex items-center justify-center text-white font-body font-semibold text-[8px] sm:text-[10px]">
            {message.senderName?.slice(0, 2).toUpperCase() ?? '??'}
          </div>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`
        max-w-[85%] sm:max-w-[75%] md:max-w-[68%] relative group
        ${isSent ? 'items-end' : 'items-start'}
        flex flex-col
      `}
      >
        {/* Sender name (for received messages) */}
        {!isSent && (
          <span className="text-[8px] sm:text-[10px] font-body font-semibold text-grey-500 mb-0.5 px-1">
            {message.senderName}
          </span>
        )}

        {isEditing ? (
          <div className="flex items-center gap-0.5 sm:gap-1 w-full">
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-grey-100 border border-grey-200 font-body text-xs sm:text-sm text-grey-800 focus:outline-none focus:border-purple-DEFAULT"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-green/10 text-green flex items-center justify-center hover:bg-green/20 transition-colors flex-shrink-0"
            >
              <Check size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-6 sm:w-7 h-6 sm:h-7 rounded-lg bg-red/10 text-red flex items-center justify-center hover:bg-red/20 transition-colors flex-shrink-0"
            >
              <X size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className={`
            px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-2xl
            font-body text-xs sm:text-sm leading-relaxed
            ${
              isSent
                ? 'bg-gradient-purple-bg text-white rounded-br-sm'
                : 'bg-grey-100 text-grey-800 rounded-bl-sm border border-grey-150'
            }
          `}
          >
            {/* Render ReplyTo Reference */}
            {message.replyTo && (
              <div
                className={`mb-1.5 sm:mb-2 pl-2 border-l-2 text-[9px] sm:text-xs opacity-75 ${isSent ? 'border-white' : 'border-purple-DEFAULT'}`}
              >
                <div className="font-semibold">{message.replyTo.senderName}</div>
                <div className="truncate max-w-[180px] sm:max-w-[200px]">{message.replyTo.text}</div>
              </div>
            )}

            {/* Render Media */}
            {message.type === 'image' && message.fileUrl && (
              <a href={message.fileUrl} target="_blank" rel="noreferrer">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || 'Imagen'}
                  className="max-w-full rounded-lg sm:rounded-xl mb-1"
                />
              </a>
            )}
            {message.type === 'file' && message.fileUrl && (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 mb-1 underline text-xs sm:text-sm"
              >
                <FileText size={12} className="sm:w-4 sm:h-4" />
                <span className="truncate">{message.fileName || 'Archivo'}</span>
              </a>
            )}

            {/* Only show text if it's not the file name duplicating the text */}
            {message.type === 'text' && message.text}
          </div>
        )}

        {/* Timestamp + edit/delete actions */}
        <div
          className={`flex items-center gap-0.5 sm:gap-1 mt-0.5 sm:mt-1 px-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <span className="text-grey-400 font-body text-[8px] sm:text-[10px]">{time}</span>
          {message.editedAt && (
            <span className="text-grey-400 font-body text-[8px] sm:text-[10px] italic">editado</span>
          )}

          {isSent && (
            <span className="text-grey-400">
              {isReadByOthers ? (
                <CheckCheck size={10} className="text-blue-500 sm:w-3 sm:h-3" />
              ) : (
                <Check size={10} className="sm:w-3 sm:h-3" />
              )}
            </span>
          )}

          {/* Actions on Hover */}
          {!isEditing && (
            <div className="hidden group-hover:flex items-center gap-0.5 ml-0.5 sm:ml-1">
              <button
                onClick={handleReply}
                className="w-5 sm:w-6 h-5 sm:h-6 rounded flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors"
                title="Responder"
              >
                <Reply size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
              {isSent && (
                <>
                  <button
                    onClick={() => {
                      setEditText(message.text);
                      setIsEditing(true);
                    }}
                    className="w-5 sm:w-6 h-5 sm:h-6 rounded flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-5 sm:w-6 h-5 sm:h-6 rounded flex items-center justify-center text-grey-400 hover:text-red transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
