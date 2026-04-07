import { Paperclip, Send,Smile } from 'lucide-react';
import React, { useCallback,useRef, useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext';

export default function MessageInput() {
  const { activeRoom, sendMessage } = useChatContext();
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (!value.trim()) return;
    sendMessage(value);
    setValue('');
    inputRef.current?.focus();
  }, [value, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = Boolean(value.trim() && activeRoom);

  return (
    <div className="px-4 py-3 border-t border-grey-150 bg-primary flex-shrink-0">
      <div className="flex items-center gap-2 bg-grey-100 rounded-2xl px-3 py-2 border border-transparent focus-within:border-grey-200 focus-within:bg-grey-50 transition-all duration-200">
        {/* Attach */}
        <button
          disabled={!activeRoom}
          className="w-7 h-7 flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors disabled:opacity-40"
          title="Adjuntar archivo"
        >
          <Paperclip size={16} />
        </button>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!activeRoom}
          placeholder={activeRoom ? 'Escribe un mensaje...' : 'Selecciona una sala'}
          className="
            flex-1 bg-transparent outline-none
            font-body text-sm text-grey-800 placeholder:text-grey-400
            disabled:cursor-not-allowed
          "
          autoComplete="off"
        />

        {/* Emoji */}
        <button
          disabled={!activeRoom}
          className="w-7 h-7 flex items-center justify-center text-grey-400 hover:text-grey-700 transition-colors disabled:opacity-40"
          title="Emojis"
        >
          <Smile size={16} />
        </button>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          title="Enviar"
          className={`
            w-8 h-8 rounded-xl flex items-center justify-center
            transition-all duration-200
            ${
              canSend
                ? 'bg-gradient-to-br from-purple-DEFAULT to-[#5961F9] text-white shadow-neonPurple hover:shadow-neonBlue hover:scale-105 active:scale-95'
                : 'bg-grey-200 text-grey-400 cursor-not-allowed'
            }
          `}
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
