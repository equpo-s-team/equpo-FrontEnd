import { PhoneCall } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';

import { useActiveCalls } from '../hooks/useActiveCalls';
import { useChatContext } from './ChatContext';

export default function CallNotification() {
  const { teamId } = useTeam();
  const activeCalls = useActiveCalls(teamId || '');
  const { rooms, activeVideoCall, startVideoCallSession } = useChatContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [notifiedCalls, setNotifiedCalls] = useState<Set<string>>(new Set());

  // Only notify if user is NOT already in a video call and hasn't dismissed/joined this specific call yet
  const pendingCallsToNotify = activeCalls.filter(
    (c) => !notifiedCalls.has(c.roomId) && c.roomId !== activeVideoCall?.roomId,
  );

  // Reproducir sonido si hay una llamada nueva
  useEffect(() => {
    const playAudio = async () => {
      if (pendingCallsToNotify.length > 0) {
        if (!audioRef.current) {
          audioRef.current = new Audio('/sounds/ring_tone.mp3');
          audioRef.current.loop = true;
        }

        try {
          // Si ya estÃ¡ pausado o es nuevo, intentamos reproducir
          await audioRef.current.play();
        } catch (err) {
          console.warn('[CallNotification] Autoplay blocked or audio error:', err);
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    };

    void playAudio();

    return () => {
      // Cleanup on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [pendingCallsToNotify.length]);

  if (pendingCallsToNotify.length === 0) return null;

  const handleJoin = (roomId: string) => {
    // Note: startVideoCallSession will navigate to the video call page
    // and set activeVideoCall, which will stop the ringtone via the filter
    startVideoCallSession({ roomId, mode: 'join' });
    setNotifiedCalls((prev) => new Set(prev).add(roomId));
  };

  const handleDismiss = (roomId: string) => {
    setNotifiedCalls((prev) => new Set(prev).add(roomId));
  };

  return (
    <div className="fixed top-20 right-8 z-[100] flex flex-col gap-3">
      {pendingCallsToNotify.map((call) => {
        const roomInfo = rooms.find((r) => r.id === call.roomId);
        const roomName = call.roomName || roomInfo?.name || 'Sala desconocida';

        return (
          <div
            key={call.roomId}
            className="bg-white rounded-2xl shadow-2xl p-4 border border-grey-100 flex items-center gap-4 w-[320px] animate-in slide-in-from-right-8 duration-300"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green/20 to-green/5 flex items-center justify-center text-green shrink-0 animate-pulse">
              <PhoneCall size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-grey-900 text-sm truncate">{call.callerName}</h4>
              <p className="text-xs text-grey-500 truncate mt-0.5">
                Te invita a una videollamada en {roomName}
              </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => handleJoin(call.roomId)}
                className="bg-green text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green/90 transition-colors"
              >
                Unirse
              </button>
              <button
                onClick={() => handleDismiss(call.roomId)}
                className="bg-grey-100 text-grey-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-grey-200 transition-colors"
              >
                Ignorar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
