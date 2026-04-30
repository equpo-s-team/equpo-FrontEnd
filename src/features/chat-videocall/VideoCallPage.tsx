import { ref, remove, set } from 'firebase/database';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useSidebar } from '@/features/navbar/SidebarContext.jsx';
import { rtdb } from '@/firebase';
import type { ZegoUIKitPrebuiltInstance } from '@/types/zego';

import { chatApi } from './api/chatApi';

function getUrlParams(url: string) {
  const urlStr = url.split('?')[1];
  if (!urlStr) return {};
  const urlSearchParams = new URLSearchParams(urlStr);
  return Object.fromEntries(urlSearchParams.entries());
}

export default function VideoCallPage({
  roomID: roomIDProp,
  onLeave,
}: {
  roomID?: string;
  onLeave?: () => void;
}) {
  const containerRef = useRef(null);
  const zpRef = useRef<ZegoUIKitPrebuiltInstance | null>(null);

  const { user } = useAuth();
  const { teamId } = useTeam();
  const { activeVideoCall, endVideoCallSession, rtcStatus, rooms } = useChatContext();
  const { setActiveItem } = useSidebar();
  const [error, setError] = useState<string | null>(null);
  const usersInRoomRef = useRef(new Set());
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const roomIdFromQuery = useMemo(() => getUrlParams(window.location.href).roomID, []);
  const roomID = roomIDProp || activeVideoCall?.roomId || roomIdFromQuery;
  const userID = user?.uid || '';

  const handleLeave = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    if (usersInRoomRef.current.size <= 1 && teamId && roomID) {
      remove(ref(rtdb, `teams/${teamId}/activeCalls/${roomID}`)).catch(() => {});
    }

    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }
    endVideoCallSession();
    setActiveItem('chat');
    onLeave?.();
  }, [endVideoCallSession, onLeave, setActiveItem, teamId, roomID]);

  useEffect(() => {
    if (!roomID || !userID || !teamId) return;

    let cancelled = false;

    const initializeZegoCall = async () => {
      try {
        const tokenResponse = await chatApi.getZegoToken(teamId, roomID);

        if (cancelled) return;

        if (!window.ZegoUIKitPrebuilt) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (cancelled || !containerRef.current || !window.ZegoUIKitPrebuilt) return;

        const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForProduction(
          tokenResponse.appId,
          tokenResponse.token,
          roomID,
          userID,
          user?.displayName || 'Usuario',
        );

        const zp = window.ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: window.ZegoUIKitPrebuilt.VideoConference,
          },
          onJoinRoom: () => {
            usersInRoomRef.current.add(userID);
            const roomName = rooms.find((r) => r.id === roomID)?.name || 'Sala de video';
            set(ref(rtdb, `teams/${teamId}/activeCalls/${roomID}`), {
              callerId: userID,
              callerName: user?.displayName || 'Usuario',
              roomName,
              startedAt: Date.now(),
            }).catch(() => {});

            if (usersInRoomRef.current.size <= 1) {
              inactivityTimerRef.current = setTimeout(() => {
                alert('Por inactividad la videollamada se ha cerrado.');
                handleLeave();
              }, 120000);
            }
          },
          onUserJoin: (users) => {
            users.forEach((u) => usersInRoomRef.current.add(u.userID));
            if (inactivityTimerRef.current) {
              clearTimeout(inactivityTimerRef.current);
              inactivityTimerRef.current = null;
            }
          },
          onUserLeave: (users) => {
            users.forEach((u) => usersInRoomRef.current.delete(u.userID));
            if (usersInRoomRef.current.size <= 1) {
              inactivityTimerRef.current = setTimeout(() => {
                alert('Por inactividad la videollamada se ha cerrado.');
                handleLeave();
              }, 120000);
            }
          },
          onLeaveRoom: handleLeave,
          showPreJoinView: false,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 40,
          layout: 'Auto',
          showLayoutButton: false,
        });
      } catch (err) {
        console.error('Error al inicializar Zego:', err);
        if (!cancelled) {
          const message: string = err instanceof Error ? err.message : String(err);
          if (message.includes('403') || message.includes('Forbidden')) {
            setError('forbidden');
          } else {
            setError('error');
          }
        }
      }
    };

    void initializeZegoCall();

    return () => {
      cancelled = true;
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [handleLeave, roomID, userID, teamId, rooms, user?.displayName]);

  if (error === 'forbidden' || rtcStatus === 'forbidden') {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-grey-900 text-white">
        <div className="text-center">
          <p className="font-body text-lg text-red-400 font-semibold mb-2">Acceso denegado</p>
          <p className="font-body text-sm text-grey-300">
            No tienes acceso a esta sala. Contacta al líder del equipo.
          </p>
        </div>
      </div>
    );
  }

  if (!roomID) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-grey-900 text-white">
        <p className="font-body text-sm text-grey-300">No hay una llamada activa desde el chat.</p>
      </div>
    );
  }

  if (error === 'error') {
    return (
      <div className="flex h-full items-center justify-center rounded-lg bg-grey-900 text-white">
        <div className="text-center">
          <p className="font-body text-lg text-yellow-400 font-semibold mb-2">Error de conexión</p>
          <p className="font-body text-sm text-grey-300">
            No se pudo conectar a la videollamada. Intenta de nuevo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={handleLeave}
        className="absolute top-4 right-4 z-10 rounded-lg bg-black/60 px-3 py-2 text-white"
      >
        Salir
      </button>
      <div ref={containerRef} className="w-full h-full" />
      {!window.ZegoUIKitPrebuilt && (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Cargando componente de video...</div>
        </div>
      )}
    </div>
  );
}
