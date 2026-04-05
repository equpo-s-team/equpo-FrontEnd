/**
 * EJEMPLO DE USO: VideoCallModal en diferentes componentes
 * 
 * Puedes usar VideoCallModal en cualquier componente para dar a los usuarios
 * la opción de iniciar o unirse a una llamada de video.
 */

import React, { useState } from 'react';
import VideoCallModal from './VideoCallModal';
import VideoCallPage from './VideoCallPage';

// ============================================
// EJEMPLO 1: En un Componente de Perfil de Usuario
// ============================================
function UserProfileExample() {
    const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);

    const handleStartCall = ({ roomId, mode }) => {
        console.log(`${mode === 'new' ? 'Iniciando' : 'Uniéndose a'} llamada con Room ID: ${roomId}`);
        // Aquí puedes navegar a la página de video llamada o hacer otras acciones
        window.location.href = `/dashboard?roomID=${roomId}`;
    };

    return (
        <div className="p-6 bg-primary rounded-lg">
            <h1 className="text-white text-2xl mb-4">Perfil de Usuario</h1>
            
            <button
                onClick={() => setIsVideoCallModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
            >
                Llamar por Video
            </button>

            <VideoCallModal
                isOpen={isVideoCallModalOpen}
                onClose={() => setIsVideoCallModalOpen(false)}
                onStartCall={handleStartCall}
            />
        </div>
    );
}

// ============================================
// EJEMPLO 2: En un Componente de Chat
// ============================================
function ChatComponentExample() {
    const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
    const [activeChatUser] = useState('Juan');

    const handleStartCall = ({ roomId, mode }) => {
        console.log(`Iniciando llamada con ${activeChatUser} en sala: ${roomId}`);
        // Notificar al otro usuario que presionamos un botón de llamada
        // sendChatMessage(`Iniciando llamada, únete aquí: roomID=${roomId}`);
    };

    return (
        <div className="p-6 bg-primary rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white text-xl">Chat con {activeChatUser}</h2>
                
                <button
                    onClick={() => setIsVideoCallModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition text-sm"
                >
                    📞 Video
                </button>
            </div>

            {/* Contenido del chat aquí */}

            <VideoCallModal
                isOpen={isVideoCallModalOpen}
                onClose={() => setIsVideoCallModalOpen(false)}
                onStartCall={handleStartCall}
            />
        </div>
    );
}

// ============================================
// EJEMPLO 3: Botón Flotante Global
// ============================================
function FloatingVideoCallButton() {
    const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);

    const handleStartCall = ({ roomId, mode }) => {
        // Navegar a la página de video llamada con el Room ID
        window.location.hash = `#video-call?roomID=${roomId}`;
    };

    return (
        <>
            {/* Botón flotante en la esquina inferior derecha */}
            <button
                onClick={() => setIsVideoCallModalOpen(true)}
                className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
                title="Iniciar Video Llamada"
            >
                📹
            </button>

            <VideoCallModal
                isOpen={isVideoCallModalOpen}
                onClose={() => setIsVideoCallModalOpen(false)}
                onStartCall={handleStartCall}
            />
        </>
    );
}

// ============================================
// EJEMPLO 4: Uso en el Dashboard
// ============================================
function DashboardExample() {
    const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false);
    const [activeCallPage, setActiveCallPage] = useState(null);

    const handleStartCall = ({ roomId, mode }) => {
        // En lugar de navegar, cambia el contenido del dashboard
        setActiveCallPage({ roomId, mode });
    };

    return (
        <div className="p-6 bg-primary rounded-lg min-h-screen">
            {activeCallPage ? (
                <div>
                    <button
                        onClick={() => setActiveCallPage(null)}
                        className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                        Salir de la Llamada
                    </button>
                    <VideoCallPage roomId={activeCallPage.roomId} />
                </div>
            ) : (
                <div>
                    <h1 className="text-white text-3xl mb-6">Dashboard</h1>
                    
                    <button
                        onClick={() => setIsVideoCallModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded transition text-lg"
                    >
                        Iniciar Video Llamada
                    </button>
                </div>
            )}

            <VideoCallModal
                isOpen={isVideoCallModalOpen}
                onClose={() => setIsVideoCallModalOpen(false)}
                onStartCall={handleStartCall}
            />
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================
export {
    UserProfileExample,
    ChatComponentExample,
    FloatingVideoCallButton,
    DashboardExample
};

export default DashboardExample;
