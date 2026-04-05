import React, { useEffect, useRef } from 'react';
import { ZEGO_CONFIG } from './components/zego-config';

export default function VideoCallPage() {
    const containerRef = useRef(null);
    const zpRef = useRef(null);

    useEffect(() => {
        // Cargar el script de Zego si no está cargado
        if (!window.ZegoUIKitPrebuilt) {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js';
            script.async = true;
            script.onload = () => {
                initializeZegoCall();
            };
            document.body.appendChild(script);
        } else {
            initializeZegoCall();
        }

        return () => {
            // Limpiar la sesión de video si existe
            if (zpRef.current) {
                zpRef.current.destroy();
            }
        };
    }, []);

    const initializeZegoCall = () => {
        if (!containerRef.current || !window.ZegoUIKitPrebuilt) {
            return;
        }

        try {
            const roomID = getUrlParams(window.location.href)['roomID'] || 
                          (Math.floor(Math.random() * 10000) + '');
            const userID = Math.floor(Math.random() * 10000) + '';
            const userName = 'Usuario_' + userID;

            // Generar token para la sesión
            const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
                ZEGO_CONFIG.APP_ID,
                ZEGO_CONFIG.SERVER_SECRET,
                roomID,
                userID,
                userName
            );

            // Crear la instancia de Zego
            const zp = window.ZegoUIKitPrebuilt.create(kitToken);
            zpRef.current = zp;

            // Configurar y unirse a la sala
            zp.joinRoom({
                container: containerRef.current,
                sharedLinks: [{
                    name: 'Compartir Enlace',
                    url: window.location.protocol + '//' + 
                         window.location.host + 
                         window.location.pathname + 
                         '?roomID=' + roomID,
                }],
                scenario: {
                    mode: window.ZegoUIKitPrebuilt.VideoConference,
                },
                turnOnMicrophoneWhenJoining: true,
                turnOnCameraWhenJoining: true,
                showMyCameraToggleButton: true,
                showMyMicrophoneToggleButton: true,
                showAudioVideoSettingsButton: true,
                showScreenSharingButton: true,
                showTextChat: true,
                showUserList: true,
                maxUsers: 2,
                layout: 'Auto',
                showLayoutButton: false,
            });
        } catch (error) {
            console.error('Error al inicializar Zego:', error);
        }
    };

    const getUrlParams = (url) => {
        const urlStr = url.split('?')[1];
        if (!urlStr) return {};
        const urlSearchParams = new URLSearchParams(urlStr);
        return Object.fromEntries(urlSearchParams.entries());
    };

    return (
        <div className="w-full h-screen bg-black rounded-lg overflow-hidden">
            <div ref={containerRef} className="w-full h-full" />
            {!window.ZegoUIKitPrebuilt && (
                <div className="flex items-center justify-center h-full">
                    <div className="text-white text-xl">Cargando componente de video...</div>
                </div>
            )}
        </div>
    );
}
