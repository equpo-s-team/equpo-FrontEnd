import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';
import { useSidebar } from '@/features/layout/components/navbar/SidebarContext.jsx';

import { chatApi } from './api/chatApi';

function getUrlParams(url) {
  const urlStr = url.split('?')[1];
  if (!urlStr) return {};
  const urlSearchParams = new URLSearchParams(urlStr);
  return Object.fromEntries(urlSearchParams.entries());
}

export default function VideoCallPage({ roomID: roomIDProp, onLeave }) {
  const containerRef = useRef(null);
  const zpRef = useRef(null);

  const { user } = useAuth();
  const { teamId } = useTeam();
  const { activeVideoCall, endVideoCallSession, rtcStatus } = useChatContext();
  const { setActiveItem } = useSidebar();
  const [error, setError] = useState(null);

  const roomIdFromQuery = useMemo(() => getUrlParams(window.location.href).roomID, []);
  const roomID = roomIDProp || activeVideoCall?.roomId || roomIdFromQuery;
  const userID = user?.uid || '';

  const handleLeave = useCallback(() => {
    if (zpRef.current) {
      zpRef.current.destroy();
      zpRef.current = null;
    }
    endVideoCallSession();
    setActiveItem('chat');
    onLeave?.();
  }, [endVideoCallSession, onLeave, setActiveItem]);

  useEffect(() => {
    if (!roomID || !userID || !teamId) return;

    let cancelled = false;

    const initializeZegoCall = async () => {
      try {
        // Fetch token from backend (validates group membership)
        const tokenResponse = await chatApi.getZegoToken(teamId, roomID);

        if (cancelled) return;

        // Load ZEGO script if not already loaded
        if (!window.ZegoUIKitPrebuilt) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src =
              'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        if (cancelled || !containerRef.current || !window.ZegoUIKitPrebuilt) return;

        const zp = window.ZegoUIKitPrebuilt.create(tokenResponse.token);
        zpRef.current = zp;

        zp.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: window.ZegoUIKitPrebuilt.VideoConference,
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
          const message = err?.message || '';
          if (message.includes('403') || message.includes('Forbidden')) {
            setError('forbidden');
          } else {
            setError('error');
          }
        }
      }
    };

    initializeZegoCall();

    return () => {
      cancelled = true;
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [handleLeave, roomID, userID, teamId]);

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
          <p className="font-body text-lg text-yellow-400 font-semibold mb-2">
            Error de conexión
          </p>
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
