import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Modal para iniciar una video llamada rápidamente
 * Ideal para ser usado desde cualquier parte de la aplicación
 */
export default function VideoCallModal({ isOpen, onClose, onStartCall }) {
    const [roomId, setRoomId] = useState('');
    const [joinMode, setJoinMode] = useState('new'); // 'new' o 'join'

    const handleStartNewCall = () => {
        const newRoomId = Math.floor(Math.random() * 10000) + '';
        setRoomId(newRoomId);
        onStartCall?.({ roomId: newRoomId, mode: 'new' });
        onClose();
    };

    const handleJoinCall = () => {
        if (!roomId.trim()) {
            alert('Por favor ingresa un Room ID');
            return;
        }
        onStartCall?.({ roomId, mode: 'join' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-primary rounded-lg shadow-lg w-96 p-6">
                {/* Encabezado */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-white font-semibold">Video Llamada</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modo de Selección */}
                <div className="space-y-4 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setJoinMode('new')}
                            className={`flex-1 py-2 rounded transition ${
                                joinMode === 'new'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Nueva Llamada
                        </button>
                        <button
                            onClick={() => setJoinMode('join')}
                            className={`flex-1 py-2 rounded transition ${
                                joinMode === 'join'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            Unirse
                        </button>
                    </div>
                </div>

                {/* Opciones según el modo */}
                {joinMode === 'new' ? (
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">
                            Se creará una nueva sala de video conferencia
                        </p>
                        <button
                            onClick={handleStartNewCall}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition font-semibold"
                        >
                            Iniciar Llamada
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="text-gray-300 text-sm block mb-2">
                                ID de Sala
                            </label>
                            <input
                                type="text"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                placeholder="Ej: 12345"
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded border border-gray-600 focus:border-purple-500 focus:outline-none transition"
                            />
                            <p className="text-gray-500 text-xs mt-1">
                                Pídele el ID a la persona que deseas llamar
                            </p>
                        </div>
                        <button
                            onClick={handleJoinCall}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition font-semibold"
                        >
                            Unirse a Llamada
                        </button>
                    </div>
                )}

                {/* Botón Cancelar */}
                <button
                    onClick={onClose}
                    className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}
