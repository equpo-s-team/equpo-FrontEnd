import { Mic, MicOff, PhoneOff,Video, VideoOff } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useSidebar } from '@/lib/layout/components/navbar/SidebarContext.jsx';

function useCallTimer(isActive: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [isActive]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export default function CallModal() {
  const {
    callState,
    callSession,
    activeRoom,
    startVideoCallSession,
    endCall,
    toggleMute,
    toggleCamera,
    isMuted,
    isCameraOff,
  } = useChatContext();
  const { setActiveItem } = useSidebar();
  const hasOpenedVideoRef = useRef(false);
  const timer = useCallTimer(callState === 'in-call');
  const isVideo = callSession?.type === 'video';
  const isCalling = callState === 'calling';

  const roomInitials = activeRoom
    ? activeRoom.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  useEffect(() => {
    if (!isVideo || !isCalling || !activeRoom || hasOpenedVideoRef.current) return;

    hasOpenedVideoRef.current = true;
    startVideoCallSession({ mode: 'new' });
    endCall();
    setActiveItem('video-call');
  }, [isCalling, isVideo, activeRoom, startVideoCallSession, endCall, setActiveItem]);

  useEffect(() => {
    if (!isCalling) hasOpenedVideoRef.current = false;
  }, [isCalling]);

  if (callState === 'idle' || !callSession || !activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-grey-900/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 rounded-3xl overflow-hidden bg-grey-900 shadow-card-lg border border-grey-700">
        {/* Video area */}
        {isVideo && (
          <div className="aspect-video bg-grey-800 relative flex items-center justify-center">
            <div
              className={`
              w-24 h-24 rounded-3xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9]
              flex items-center justify-center
              text-white font-body font-bold text-2xl
              ${isCalling ? 'animate-pulse' : ''}
            `}
            >
              {roomInitials}
            </div>

            <div className="absolute bottom-3 right-3 w-24 h-16 bg-grey-700 rounded-xl border border-grey-600 overflow-hidden flex items-center justify-center">
              {isCameraOff ? (
                <VideoOff size={18} className="text-grey-400" />
              ) : (
                <span className="text-grey-400 text-xs font-body">Tú</span>
              )}
            </div>
          </div>
        )}

        {/* Audio-only call avatar */}
        {!isVideo && (
          <div className="py-12 flex flex-col items-center gap-4">
            <div
              className={`
              w-24 h-24 rounded-3xl bg-gradient-to-br from-[#60AFFF] to-[#5961F9]
              flex items-center justify-center
              text-white font-body font-bold text-2xl
              ${isCalling ? 'animate-pulse' : ''}
            `}
            >
              {roomInitials}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="px-6 py-4 text-center">
          <h3 className="font-body font-bold text-white text-lg">{activeRoom.name}</h3>
          <p className="font-body text-sm text-grey-400 mt-1">
            {isCalling ? (
              <span className="flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-DEFAULT rounded-full animate-pulse" />
                Marcando...
              </span>
            ) : (
              timer
            )}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pb-6">
          <CallControlButton
            onClick={toggleMute}
            active={isMuted}
            label={isMuted ? 'Activar mic' : 'Silenciar'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </CallControlButton>

          {isVideo && (
            <CallControlButton
              onClick={toggleCamera}
              active={isCameraOff}
              label={isCameraOff ? 'Activar cámara' : 'Apagar cámara'}
            >
              {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </CallControlButton>
          )}

          {/* End call */}
          <button
            onClick={endCall}
            title="Terminar llamada"
            className="
              w-14 h-14 rounded-2xl
              bg-gradient-to-br from-[#F65A70] to-[#FF94AE]
              flex items-center justify-center text-white
              shadow-neonRed hover:scale-105 active:scale-95
              transition-all duration-200
            "
          >
            <PhoneOff size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CallControlButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`
        w-12 h-12 rounded-2xl flex items-center justify-center
        transition-all duration-200 hover:scale-105 active:scale-95
        ${
          active
            ? 'bg-grey-600 text-white'
            : 'bg-grey-700 text-grey-300 hover:bg-grey-600 hover:text-white'
        }
      `}
    >
      {children}
    </button>
  );
}
