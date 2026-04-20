import { Check, CheckCheck, FileText, Pencil, Reply, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { auth } from '@/firebase';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';

import type { ChatMessage } from '../types/chat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { editMessage, deleteMessage, setReplyingTo, teamId } = useChatContext();
  const { data: teamMembers = [] } = useTeamMembers(teamId || '');
  const currentUid = auth.currentUser?.uid;
  const isSent = message.senderUid === currentUid;

  const senderPhotoUrl =
    teamMembers.find((member) => member.uid === message.senderUid)?.photoUrl ?? null;

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
          <UserAvatar
            src={senderPhotoUrl}
            alt={message.senderName ?? 'Usuario'}
            initials={getInitials(message.senderName ?? 'Usuario', 'U')}
            className="w-7 h-7"
            fallbackClassName="bg-gradient-to-br from-[#60AFFF] to-[#5961F9] text-white text-[10px]"
          />
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
              className="w-7 h-7 rounded-lg bg-green/10 text-green flex items-center justify-center hover:bg-green/20 transition-colors"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-7 h-7 rounded-lg bg-red/10 text-red flex items-center justify-center hover:bg-red/20 transition-colors"
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
                ? 'bg-gradient-purple-bg text-white rounded-br-sm'
                : 'bg-grey-100 text-grey-800 rounded-bl-sm border border-grey-150'
            }
          `}
          >
            {/* Render ReplyTo Reference */}
            {message.replyTo && (
              <div
                className={`mb-2 pl-2 border-l-2 text-xs opacity-75 ${isSent ? 'border-white' : 'border-purple-DEFAULT'}`}
              >
                <div className="font-semibold">{message.replyTo.senderName}</div>
                <div className="truncate max-w-[200px]">{message.replyTo.text}</div>
              </div>
            )}

            {/* Render Media */}
            {message.type === 'image' && message.fileUrl && (
              <a href={message.fileUrl} target="_blank" rel="noreferrer">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || 'Imagen'}
                  className="max-w-full rounded-lg mb-1"
                />
              </a>
            )}
            {message.type === 'file' && message.fileUrl && (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 mb-1 underline"
              >
                <FileText size={16} />
                <span className="truncate">{message.fileName || 'Archivo'}</span>
              </a>
            )}

            {/* Only show text if it's not the file name duplicating the text */}
            {message.type === 'text' && message.text}
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

          {isSent && (
            <span className="text-grey-400">
              {isReadByOthers ? (
                <CheckCheck size={12} className="text-blue-500" />
              ) : (
                <Check size={12} />
              )}
            </span>
          )}

          {/* Actions on Hover */}
          {!isEditing && (
            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
              <button
                onClick={handleReply}
                className="w-6 h-6 rounded flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors"
                title="Responder"
              >
                <Reply size={14} />
              </button>
              {isSent && (
                <>
                  <button
                    onClick={() => {
                      setEditText(message.text);
                      setIsEditing(true);
                    }}
                    className="w-6 h-6 rounded flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-6 h-6 rounded flex items-center justify-center text-grey-400 hover:text-red transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={14} />
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
