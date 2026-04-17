import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Paperclip, Send, Smile, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useTyping } from '@/features/chat-videocall/hooks/useTyping';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { storage } from '@/firebase';

export default function MessageInput() {
  const { activeRoom, sendMessage, replyingTo, setReplyingTo, teamId } = useChatContext();
  const { play } = useSoundEffects();
  const [value, setValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target as Node) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  const { setTyping } = useTyping(teamId, activeRoom?.id || null);

  const handleSend = useCallback(() => {
    if (!value.trim()) return;
    sendMessage(value);
    play('messageSent'); // Play sound when sending message
    setValue('');
    setShowEmojiPicker(false);
    inputRef.current?.focus();

    // Clear typing state
    if (typingTimeout) clearTimeout(typingTimeout);
    void setTyping(false);
  }, [value, sendMessage, setTyping, typingTimeout, play]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    // Typing logic
    void setTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      void setTyping(false);
    }, 2000);
    setTypingTimeout(timeout);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRoom) return;

    setIsUploading(true);
    try {
      // 1. Create a hash to deduplicate exact same files
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      const extension = file.name.split('.').pop() || 'bin';
      const uniqueFileName = `${hashHex}.${extension}`;

      const storageRef = ref(
        storage,
        `teams/${teamId}/chatRooms/${activeRoom.id}/${uniqueFileName}`,
      );

      let url: string;
      try {
        // 2. If it already exists, just get the URL
        url = await getDownloadURL(storageRef);
      } catch {
        // 3. Otherwise, upload it
        await uploadBytes(storageRef, file);
        url = await getDownloadURL(storageRef);
      }

      const isImage = file.type.startsWith('image/');
      sendMessage(file.name, isImage ? 'image' : 'file', url, file.name);
      play('messageSent'); // Play sound when sending file
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    setValue((prev) => prev + emoji.native);
  };

  const canSend = Boolean(value.trim() && activeRoom) && !isUploading;

  return (
    <div className="px-4 py-3 border-t border-grey-150 bg-primary flex-shrink-0 relative">
      {/* ReplyTo Indicator */}
      {replyingTo && (
        <div className="mb-2 bg-grey-100 rounded-lg px-3 py-2 flex items-center justify-between border-l-4 border-purple-DEFAULT">
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-purple-DEFAULT font-semibold">
              Respondiendo a {replyingTo.senderName}
            </span>
            <span className="text-xs text-grey-600 truncate">{replyingTo.text}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-grey-400 hover:text-grey-700">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Emoji Picker Popover */}
      {showEmojiPicker && (
        <div ref={emojiPickerRef} className="absolute bottom-full right-4 mb-2 z-50 shadow-2xl">
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
        </div>
      )}

      <div className="flex items-center gap-2 bg-grey-100 rounded-2xl px-3 py-2 border border-transparent focus-within:border-grey-200 focus-within:bg-grey-50 transition-all duration-200">
        {/* Attach */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => void handleFileUpload(e)}
        />
        <button
          disabled={!activeRoom || isUploading}
          onClick={() => fileInputRef.current?.click()}
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
          onChange={handleInputChange}
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
          ref={emojiButtonRef}
          disabled={!activeRoom || isUploading}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
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
                ? 'bg-gradient-purple-bg text-white shadow-neonPurple hover:shadow-neonBlue hover:scale-105 active:scale-95'
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
