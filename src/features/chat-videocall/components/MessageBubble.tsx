import { Check, CheckCheck, FileText, Pencil, Reply, Trash2, X } from 'lucide-react';
import { useState } from 'react';

import { AppTooltip } from '@/components/ui/AppTooltip';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { auth } from '@/firebase';

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
            className="w-7 h-7"
            fallbackClassName="bg-gradient-orange-bg text-white text-[10px]"
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
          <span className="text-[10px] font-body font-semibold text-grey-500 dark:text-grey-400 mb-0.5 px-1">
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
              className="flex-1 px-3 py-2 rounded-xl bg-grey-100 dark:bg-gray-800 border border-grey-200 dark:border-gray-700 font-body text-sm text-grey-800 dark:text-gray-300 focus:outline-none focus:border-purple-DEFAULT"
              autoFocus
            />
            <button
              onClick={handleSaveEdit}
              className="w-7 h-7 rounded-lg bg-green/10 dark:bg-green-20 text-green dark:text-green-400 flex items-center justify-center hover:bg-green/20 dark:hover:bg-green-30 transition-colors"
            >
              <Check size={12} />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="w-7 h-7 rounded-lg bg-red/10 dark:bg-red-20 text-red dark:text-red-400 flex items-center justify-center hover:bg-red/20 dark:hover:bg-red-30 transition-colors"
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
                : 'bg-grey-100 dark:bg-gray-900 text-grey-800 dark:text-gray-300 rounded-bl-sm border border-grey-150 dark:border-gray-800'
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
          <span className="text-grey-400 dark:text-grey-500 font-body text-[10px]">{time}</span>
          {message.editedAt && (
            <span className="text-grey-400 dark:text-grey-500 font-body text-[10px] italic">
              editado
            </span>
          )}

          {isSent && (
            <span className="text-grey-400 dark:text-grey-500">
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
              <AppTooltip content="Responder">
                <button
                  onClick={handleReply}
                  className="w-6 h-6 rounded flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-700 dark:hover:text-grey-300 transition-colors"
                >
                  <Reply size={14} />
                </button>
              </AppTooltip>
              {isSent && (
                <>
                  <AppTooltip content="Editar">
                    <button
                      onClick={() => {
                        setEditText(message.text);
                        setIsEditing(true);
                      }}
                      className="w-6 h-6 rounded flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-700 dark:hover:text-grey-300 transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                  </AppTooltip>
                  <AppTooltip content="Eliminar">
                    <button
                      onClick={handleDelete}
                      className="w-6 h-6 rounded flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-red dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </AppTooltip>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
