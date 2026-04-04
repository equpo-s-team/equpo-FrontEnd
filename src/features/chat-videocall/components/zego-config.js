/**
 * Configuración de ZegoCloud SDK
 * Reemplaza APP_ID y SERVER_SECRET con tus credenciales de ZegoCloud
 * 
 * Para obtener las credenciales:
 * 1. Ve a https://zegocloud.com
 * 2. Crea una cuenta y proyecto
 * 3. Obtén tu APP_ID y SERVER_SECRET del dashboard
 */

// Configuración de ZegoCloud
const ZEGO_CONFIG = {
    // IMPORTANTE: Reemplaza con tus credenciales reales
    APP_ID: 0, // Tu APP ID de ZegoCloud
    SERVER_SECRET: '', // Tu SERVER SECRET de ZegoCloud
    SCENE_ID: 0, // Tu SCENE ID
    
    // Configuración de video/audio
    VIDEO: {
        width: 1280,
        height: 720,
        frameRate: 30,
        bitrate: 1500
    },
    
    AUDIO: {
        bitrate: 32,
        channels: 1
    },
    
    // URL del servidor (si usas servidor proxy)
    SERVER_URL: '',
    
    // Configuración de chat
    CHAT: {
        messageRetentionDays: 30,
        maxMessageLength: 5000
    }
};

/**
 * Clase para manejar la integración con ZegoCloud
 */
class ZegoCloudManager {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.zegoExpressEngine = null;
        this.currentCallSession = null;
        this.messageHandlers = [];
        this.callHandlers = [];
    }

    /**
     * Inicializa el SDK de ZegoCloud
     */
    async initialize(userID, userName) {
        try {
            if (this.isInitialized) {
                console.log('ZegoCloud ya está inicializado');
                return;
            }

            // Validar credenciales
            if (!ZEGO_CONFIG.APP_ID || !ZEGO_CONFIG.SERVER_SECRET) {
                console.warn('⚠️ Credenciales de ZegoCloud no configuradas');
                console.warn('Por favor configura APP_ID y SERVER_SECRET en zego-config.js');
                return false;
            }

            this.currentUser = {
                id: userID,
                name: userName
            };

            // Aquí iría la inicialización real del SDK
            // En producción, cargarías el script de ZegoCloud desde su CDN
            console.log('✓ ZegoCloud Manager inicializado para:', userName);
            
            this.isInitialized = true;
            return true;

        } catch (error) {
            console.error('Error inicializando ZegoCloud:', error);
            return false;
        }
    }

    /**
     * Inicia una videollamada
     */
    async startCall(remotePeerID, remotePeerName, isVideo = true) {
        try {
            if (!this.isInitialized) {
                throw new Error('ZegoCloud no está inicializado');
            }

            console.log(`Iniciando ${isVideo ? 'video' : 'audio'} llamada con ${remotePeerName}`);

            this.currentCallSession = {
                type: isVideo ? 'video' : 'audio',
                remotePeerID,
                remotePeerName,
                startTime: new Date(),
                isActive: true,
                isMuted: false,
                isVideoEnabled: isVideo
            };

            // Disparar evento de llamada iniciada
            this.callHandlers.forEach(handler => {
                if (handler.type === 'call-started') {
                    handler.callback(this.currentCallSession);
                }
            });

            return this.currentCallSession;

        } catch (error) {
            console.error('Error iniciando llamada:', error);
            throw error;
        }
    }

    /**
     * Termina la llamada actual
     */
    async endCall() {
        try {
            if (this.currentCallSession) {
                const duration = Math.floor(
                    (new Date() - this.currentCallSession.startTime) / 1000
                );

                this.currentCallSession.isActive = false;
                this.currentCallSession.duration = duration;

                // Disparar evento de llamada terminada
                this.callHandlers.forEach(handler => {
                    if (handler.type === 'call-ended') {
                        handler.callback(this.currentCallSession);
                    }
                });

                console.log(`Llamada terminada. Duración: ${duration}s`);
                this.currentCallSession = null;
            }
        } catch (error) {
            console.error('Error terminando llamada:', error);
        }
    }

    /**
     * Toggle micrófono
     */
    toggleMicrophone() {
        if (this.currentCallSession) {
            this.currentCallSession.isMuted = !this.currentCallSession.isMuted;
            console.log(`Micrófono ${this.currentCallSession.isMuted ? 'desactivado' : 'activado'}`);
            return this.currentCallSession.isMuted;
        }
    }

    /**
     * Toggle cámara
     */
    toggleCamera() {
        if (this.currentCallSession) {
            this.currentCallSession.isVideoEnabled = !this.currentCallSession.isVideoEnabled;
            console.log(`Cámara ${this.currentCallSession.isVideoEnabled ? 'activada' : 'desactivada'}`);
            return this.currentCallSession.isVideoEnabled;
        }
    }

    /**
     * Envía un mensaje de chat
     */
    async sendMessage(content, receiverID, receiverName) {
        try {
            if (!this.isInitialized) {
                throw new Error('ZegoCloud no está inicializado');
            }

            const message = {
                id: this.generateMessageID(),
                senderID: this.currentUser.id,
                senderName: this.currentUser.name,
                receiverID: receiverID,
                receiverName: receiverName,
                content: content,
                timestamp: new Date(),
                status: 'sent',
                type: 'text'
            };

            console.log('Mensaje enviado:', message);

            // Disparar evento de mensaje enviado
            this.messageHandlers.forEach(handler => {
                if (handler.type === 'message-sent') {
                    handler.callback(message);
                }
            });

            return message;

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            throw error;
        }
    }

    /**
     * Recibe un mensaje
     */
    receiveMessage(message) {
        try {
            message.status = 'received';
            console.log('Mensaje recibido:', message);

            // Disparar evento de mensaje recibido
            this.messageHandlers.forEach(handler => {
                if (handler.type === 'message-received') {
                    handler.callback(message);
                }
            });

            return message;

        } catch (error) {
            console.error('Error recibiendo mensaje:', error);
        }
    }

    /**
     * Registra un manejador de eventos
     */
    on(eventType, callback) {
        if (eventType.includes('message')) {
            this.messageHandlers.push({ type: eventType, callback });
        } else if (eventType.includes('call')) {
            this.callHandlers.push({ type: eventType, callback });
        }
    }

    /**
     * Desregistra un manejador de eventos
     */
    off(eventType, callback) {
        if (eventType.includes('message')) {
            this.messageHandlers = this.messageHandlers.filter(
                h => !(h.type === eventType && h.callback === callback)
            );
        } else if (eventType.includes('call')) {
            this.callHandlers = this.callHandlers.filter(
                h => !(h.type === eventType && h.callback === callback)
            );
        }
    }

    /**
     * Obtiene el estado actual del usuario
     */
    getUserStatus() {
        return {
            isInitialized: this.isInitialized,
            currentUser: this.currentUser,
            hasActiveCall: this.currentCallSession?.isActive || false,
            currentCallInfo: this.currentCallSession
        };
    }

    /**
     * Obtiene el estado de la llamada actual
     */
    getCallStatus() {
        if (!this.currentCallSession) {
            return null;
        }

        const duration = Math.floor(
            (new Date() - this.currentCallSession.startTime) / 1000
        );

        return {
            ...this.currentCallSession,
            duration: duration
        };
    }

    /**
     * Desconecta de ZegoCloud
     */
    async disconnect() {
        try {
            if (this.currentCallSession?.isActive) {
                await this.endCall();
            }

            this.isInitialized = false;
            this.currentUser = null;
            this.messageHandlers = [];
            this.callHandlers = [];

            console.log('ZegoCloud desconectado');
            return true;

        } catch (error) {
            console.error('Error desconectando:', error);
            return false;
        }
    }

    /**
     * Genera un ID único para mensajes
     */
    generateMessageID() {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Formatea duración en HH:MM:SS
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const pad = (num) => String(num).padStart(2, '0');

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
        }
        return `${pad(minutes)}:${pad(secs)}`;
    }
}

// Crear instancia global del manager
const zegoCloudManager = new ZegoCloudManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ZEGO_CONFIG,
        ZegoCloudManager,
        zegoCloudManager
    };
}

console.log('✓ ZegoCloud Manager cargado');
