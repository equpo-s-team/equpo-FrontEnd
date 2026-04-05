import { Check, CheckCheck, Clock } from 'lucide-react';
import {Message} from "postcss";

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
  showAvatar?: boolean;
  avatarGradient?: string;
  initials?: string;
}

function StatusIcon({ status }: { status: Message['status'] }) {
  if (status === 'sending') return <Clock size={11} className="text-grey-400" />;
  if (status === 'sent') return <Check size={11} className="text-grey-400" />;
  if (status === 'delivered') return <CheckCheck size={11} className="text-grey-400" />;
  if (status === 'seen') return <CheckCheck size={11} className="text-blue-DEFAULT" />;
  return null;
}

export default function MessageBubble({ message, isSent, showAvatar, avatarGradient, initials }: MessageBubbleProps) {
  const time = message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar (received only) */}
      {!isSent && (
        <div className="flex-shrink-0 mb-1">
          {showAvatar ? (
            <div className={`
              w-7 h-7 rounded-xl bg-gradient-to-br ${avatarGradient}
              flex items-center justify-center
              text-white font-body font-semibold text-[10px]
            `}>
              {initials}
            </div>
          ) : (
            <div className="w-7" />
          )}
        </div>
      )}

      {/* Bubble */}
      <div className={`
        max-w-[68%] relative group
        ${isSent ? 'items-end' : 'items-start'}
        flex flex-col
      `}>
        <div className={`
          px-3.5 py-2.5 rounded-2xl
          font-body text-sm leading-relaxed
          ${isSent
            ? 'bg-gradient-to-br from-purple-DEFAULT to-[#5961F9] text-white rounded-br-sm'
            : 'bg-grey-100 text-grey-800 rounded-bl-sm border border-grey-150'
          }
        `}>
          {message.content}
        </div>

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-grey-400 font-body text-[10px]">{time}</span>
          {isSent && <StatusIcon status={message.status} />}
        </div>
      </div>
    </div>
  );
}
