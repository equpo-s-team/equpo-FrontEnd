/**
 * Chat.js - Funcionalidad de chat y videollamadas
 * Maneja la interacción con ZegoCloud y la UI de chat
 */

class ChatManager {
    constructor() {
        this.currentUser = null;
        this.conversations = [];
        this.activeConversation = null;
        this.messages = [];
        this.isLoading = false;
        this.isCallActive = false;
    }

    /**
     * Inicializa el manager de chat
     */
    async initialize() {
        try {
            // Obtener usuario actual del localStorage
            const user = localStorage.getItem('user');
            const userName = localStorage.getItem('userName');

            if (!user || !userName) {
                window.location.href = '/login.html';
                return;
            }

            this.currentUser = {
                id: user,
                name: userName
            };

            // Inicializar ZegoCloud Manager
            const zegoInitialized = await zegoCloudManager.initialize(user, userName);
            
            if (!zegoInitialized) {
                console.warn('ZegoCloud no inicializado - usando modo local');
            }

            // Registrar manejadores de eventos
            this.setupEventHandlers();

            // Cargar conversaciones
            await this.loadConversations();

            // Cargar contactos
            await this.loadContacts();

            console.log('✓ Chat Manager inicializado para:', userName);

        } catch (error) {
            console.error('Error inicializando Chat Manager:', error);
        }
    }

    /**
     * Configura los manejadores de eventos de ZegoCloud
     */
    setupEventHandlers() {
        // Mensajes recibidos
        zegoCloudManager.on('message-received', (message) => {
            this.handleReceivedMessage(message);
        });

        // Llamada iniciada
        zegoCloudManager.on('call-started', (callInfo) => {
            this.handleCallStarted(callInfo);
        });

        // Llamada terminada
        zegoCloudManager.on('call-ended', (callInfo) => {
            this.handleCallEnded(callInfo);
        });
    }

    /**
     * Carga las conversaciones del usuario
     */
    async loadConversations() {
        try {
            // En desarrollo, crear conversaciones de prueba
            this.conversations = [
                {
                    id: 'user_2',
                    name: 'Juan',
                    avatar: '👤',
                    lastMessage: 'Claro, te veo mañana',
                    timestamp: '14:30',
                    unread: 2,
                    isOnline: true,
                    lastMessageTime: new Date(Date.now() - 30 * 60000)
                },
                {
                    id: 'user_3',
                    name: 'María',
                    avatar: '👩',
                    lastMessage: '¿Cómo estás?',
                    timestamp: 'Ayer',
                    unread: 0,
                    isOnline: false,
                    lastMessageTime: new Date(Date.now() - 24 * 60 * 60000)
                },
                {
                    id: 'user_4',
                    name: 'Carlos',
                    avatar: '👨',
                    lastMessage: 'Perfecto, nos vemos',
                    timestamp: '09:15',
                    unread: 0,
                    isOnline: true,
                    lastMessageTime: new Date(Date.now() - 2 * 60 * 60000)
                }
            ];

            this.renderConversationsList();

        } catch (error) {
            console.error('Error cargando conversaciones:', error);
        }
    }

    /**
     * Carga los contactos disponibles
     */
    async loadContacts() {
        try {
            // Obtener todos los usuarios del backend
            const response = await fetch('/users');
            const users = await response.json();

            // Filtrar el usuario actual y los que ya están en conversaciones
            const conversationIDs = this.conversations.map(c => c.id);
            const availableContacts = users
                .filter(u => u.username !== this.currentUser.name && !conversationIDs.includes(u.username))
                .map(u => ({
                    id: u.username,
                    name: u.username,
                    avatar: u.username.charAt(0).toUpperCase(),
                    isOnline: u.status === 'online'
                }));

            console.log('Contactos disponibles:', availableContacts);

        } catch (error) {
            console.error('Error cargando contactos:', error);
        }
    }

    /**
     * Renderiza la lista de conversaciones
     */
    renderConversationsList() {
        const conversationsList = document.getElementById('conversations-list');
        if (!conversationsList) return;

        conversationsList.innerHTML = '';

        this.conversations.forEach(conversation => {
            const element = document.createElement('div');
            element.className = 'conversation-item';
            if (this.activeConversation?.id === conversation.id) {
                element.classList.add('active');
            }

            const onlineIndicator = conversation.isOnline 
                ? '<span class="online-indicator"></span>' 
                : '';

            const unreadBadge = conversation.unread > 0 
                ? `<span class="unread-badge">${conversation.unread}</span>` 
                : '';

            element.innerHTML = `
                <div class="conversation-avatar">${conversation.avatar}${onlineIndicator}</div>
                <div class="conversation-info">
                    <div class="conversation-name">${conversation.name}</div>
                    <div class="conversation-preview">${conversation.lastMessage}</div>
                </div>
                <div class="conversation-metadata">
                    <div class="timestamp">${conversation.timestamp}</div>
                    ${unreadBadge}
                </div>
            `;

            element.addEventListener('click', () => this.selectConversation(conversation));
            conversationsList.appendChild(element);
        });
    }

    /**
     * Selecciona una conversación
     */
    selectConversation(conversation) {
        this.activeConversation = conversation;
        this.messages = [];

        // Actualizar UI
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        event.target.closest('.conversation-item')?.classList.add('active');

        // Actualizar encabezado del chat
        this.updateChatHeader(conversation);

        // Cargar mensajes
        this.loadMessages(conversation);

        // Marcar como leído
        conversation.unread = 0;
        this.renderConversationsList();
    }

    /**
     * Actualiza el encabezado del chat
     */
    updateChatHeader(conversation) {
        const chatHeader = document.querySelector('.chat-header');
        if (!chatHeader) return;

        const statusClass = conversation.isOnline ? 'online' : 'offline';
        const statusText = conversation.isOnline ? 'En línea' : 'Desconectado';

        chatHeader.innerHTML = `
            <div class="chat-header-info">
                <div class="chat-header-avatar">${conversation.avatar}</div>
                <div class="chat-header-details">
                    <div class="chat-header-name">${conversation.name}</div>
                    <div class="chat-header-status ${statusClass}">${statusText}</div>
                </div>
            </div>
            <div class="chat-header-actions">
                <button class="btn-call" id="btn-voice-call" title="Llamada de voz">
                    <i class="fas fa-phone"></i>
                </button>
                <button class="btn-video-call" id="btn-video-call" title="Videollamada">
                    <i class="fas fa-video"></i>
                </button>
            </div>
        `;

        // Agregar event listeners a botones de llamada
        document.getElementById('btn-voice-call')?.addEventListener('click', () => {
            this.initiateCall(conversation, false);
        });

        document.getElementById('btn-video-call')?.addEventListener('click', () => {
            this.initiateCall(conversation, true);
        });
    }

    /**
     * Carga los mensajes de una conversación
     */
    async loadMessages(conversation) {
        try {
            // En desarrollo, crear mensajes de prueba
            this.messages = [
                {
                    id: 'msg_1',
                    senderID: this.currentUser.id,
                    senderName: this.currentUser.name,
                    content: 'Hola, ¿cómo estás?',
                    timestamp: new Date(Date.now() - 120 * 60000),
                    type: 'text',
                    status: 'seen'
                },
                {
                    id: 'msg_2',
                    senderID: conversation.id,
                    senderName: conversation.name,
                    content: 'Bien, ¿y tú?',
                    timestamp: new Date(Date.now() - 100 * 60000),
                    type: 'text',
                    status: 'seen'
                },
                {
                    id: 'msg_3',
                    senderID: this.currentUser.id,
                    senderName: this.currentUser.name,
                    content: 'Perfecto, nos vemos mañana',
                    timestamp: new Date(Date.now() - 30 * 60000),
                    type: 'text',
                    status: 'sent'
                },
                {
                    id: 'msg_4',
                    senderID: conversation.id,
                    senderName: conversation.name,
                    content: 'Claro, te veo mañana',
                    timestamp: new Date(Date.now() - 10 * 60000),
                    type: 'text',
                    status: 'seen'
                }
            ];

            this.renderMessages();

        } catch (error) {
            console.error('Error cargando mensajes:', error);
        }
    }

    /**
     * Renderiza los mensajes en el chat
     */
    renderMessages() {
        const messagesContainer = document.getElementById('messages-container');
        if (!messagesContainer) return;

        messagesContainer.innerHTML = '';
        
        let currentDate = null;

        this.messages.forEach(message => {
            // Agregar separador de fecha si cambió
            const messageDate = this.formatDate(message.timestamp);
            if (messageDate !== currentDate) {
                currentDate = messageDate;
                const dateSeparator = document.createElement('div');
                dateSeparator.className = 'message-date-separator';
                dateSeparator.innerHTML = `<span>${messageDate}</span>`;
                messagesContainer.appendChild(dateSeparator);
            }

            // Crear elemento de mensaje
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        // Scroll al último mensaje
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Crea un elemento de mensaje
     */
    createMessageElement(message) {
        const isOwn = message.senderID === this.currentUser.id;
        const container = document.createElement('div');
        container.className = `message-group ${isOwn ? 'sent' : 'received'}`;

        const messageTime = this.formatTime(message.timestamp);
        const statusIcon = this.getStatusIcon(message.status);

        container.innerHTML = `
            <div class="message">
                ${!isOwn ? `<div class="message-avatar">${message.senderName.charAt(0)}</div>` : ''}
                <div class="message-content">
                    <div class="message-text">${this.escapeHtml(message.content)}</div>
                    <div class="message-info">
                        <span class="message-time">${messageTime}</span>
                        ${isOwn ? `<span class="message-status">${statusIcon}</span>` : ''}
                    </div>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * Envía un mensaje
     */
    async sendMessage() {
        const input = document.getElementById('message-input');
        if (!input || !input.value.trim() || !this.activeConversation) {
            return;
        }

        const content = input.value.trim();
        input.value = '';
        input.focus();

        try {
            // Enviar mediante ZegoCloud
            const message = await zegoCloudManager.sendMessage(
                content,
                this.activeConversation.id,
                this.activeConversation.name
            );

            // Agregar a mensajes locales
            this.messages.push(message);
            this.renderMessages();

            // Actualizar último mensaje en conversación
            this.activeConversation.lastMessage = content;
            this.renderConversationsList();

        } catch (error) {
            console.error('Error enviando mensaje:', error);
            alert('Error al enviar mensaje: ' + error.message);
        }
    }

    /**
     * Maneja un mensaje recibido
     */
    handleReceivedMessage(message) {
        // Si es de la conversación activa, mostrar
        if (this.activeConversation?.id === message.senderID) {
            this.messages.push(message);
            this.renderMessages();
        }

        // Actualizar conversación
        const conversation = this.conversations.find(c => c.id === message.senderID);
        if (conversation) {
            conversation.lastMessage = message.content;
            conversation.unread = (conversation.unread || 0) + 1;
            conversation.timestamp = 'Ahora';
            this.renderConversationsList();
        }
    }

    /**
     * Inicia una llamada
     */
    async initiateCall(conversation, isVideo) {
        try {
            const callModal = document.getElementById('call-modal');
            if (!callModal) return;

            // Mostrar modal
            callModal.style.display = 'flex';

            // Actualizar información de la llamada
            const callInfo = document.querySelector('.call-info');
            if (callInfo) {
                callInfo.innerHTML = `
                    <div class="call-avatar">${conversation.avatar}</div>
                    <div class="call-details">
                        <div class="call-name">${conversation.name}</div>
                        <div class="call-status" id="call-status">Marcando...</div>
                    </div>
                `;
            }

            // Iniciar llamada en ZegoCloud
            await zegoCloudManager.startCall(
                conversation.id,
                conversation.name,
                isVideo
            );

            this.isCallActive = true;

            // Simular aceptación de llamada después de 3 segundos
            setTimeout(() => {
                const callStatus = document.getElementById('call-status');
                if (callStatus) {
                    callStatus.textContent = isVideo ? 'Videollamada en curso' : 'Llamada en curso';
                }
            }, 3000);

        } catch (error) {
            console.error('Error iniciando llamada:', error);
            alert('Error al iniciar llamada: ' + error.message);
        }
    }

    /**
     * Maneja el inicio de una llamada
     */
    handleCallStarted(callInfo) {
        console.log('Llamada iniciada:', callInfo);
        // Actualizar UI de llamada
    }

    /**
     * Termina la llamada actual
     */
    async endCall() {
        try {
            await zegoCloudManager.endCall();
            
            const callModal = document.getElementById('call-modal');
            if (callModal) {
                callModal.style.display = 'none';
            }

            this.isCallActive = false;
            console.log('Llamada terminada');

        } catch (error) {
            console.error('Error terminando llamada:', error);
        }
    }

    /**
     * Maneja el fin de una llamada
     */
    handleCallEnded(callInfo) {
        console.log('Llamada finalizada:', callInfo);
        this.endCall();
    }

    /**
     * Alterna el micrófono
     */
    toggleMicrophone() {
        if (!this.isCallActive) return;
        
        const isMuted = zegoCloudManager.toggleMicrophone();
        const button = document.getElementById('btn-toggle-mic');
        
        if (button) {
            button.classList.toggle('muted', isMuted);
            button.title = isMuted ? 'Activar micrófono' : 'Desactivar micrófono';
        }
    }

    /**
     * Alterna la cámara
     */
    toggleCamera() {
        if (!this.isCallActive) return;
        
        const isDisabled = !zegoCloudManager.toggleCamera();
        const button = document.getElementById('btn-toggle-camera');
        
        if (button) {
            button.classList.toggle('disabled', isDisabled);
            button.title = isDisabled ? 'Activar cámara' : 'Desactivar cámara';
        }
    }

    /**
     * Utilidades
     */

    formatDate(date) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const messageDate = new Date(date);

        if (messageDate.toDateString() === today.toDateString()) {
            return 'Hoy';
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Ayer';
        } else {
            return messageDate.toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    formatTime(date) {
        const messageDate = new Date(date);
        return messageDate.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    getStatusIcon(status) {
        const icons = {
            'sending': '⏳',
            'sent': '✓',
            'delivered': '✓✓',
            'seen': '✓✓'
        };
        return icons[status] || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Crear instancia global del manager de chat
const chatManager = new ChatManager();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    await chatManager.initialize();

    // Setup event listeners
    setupChatEventListeners();
});

/**
 * Configura los event listeners de chat
 */
function setupChatEventListeners() {
    // Enviar mensaje
    const sendButton = document.getElementById('btn-send-message');
    const messageInput = document.getElementById('message-input');

    if (sendButton) {
        sendButton.addEventListener('click', () => {
            chatManager.sendMessage();
        });
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                chatManager.sendMessage();
            }
        });
    }

    // Buscar conversaciones
    const searchInput = document.getElementById('search-conversations');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterConversations(e.target.value);
        });
    }

    // Botones de llamada
    const endCallButton = document.getElementById('btn-end-call');
    if (endCallButton) {
        endCallButton.addEventListener('click', () => {
            chatManager.endCall();
        });
    }

    const toggleMicButton = document.getElementById('btn-toggle-mic');
    if (toggleMicButton) {
        toggleMicButton.addEventListener('click', () => {
            chatManager.toggleMicrophone();
        });
    }

    const toggleCameraButton = document.getElementById('btn-toggle-camera');
    if (toggleCameraButton) {
        toggleCameraButton.addEventListener('click', () => {
            chatManager.toggleCamera();
        });
    }

    // Cerrar modal de llamada
    const callModal = document.getElementById('call-modal');
    if (callModal) {
        callModal.addEventListener('click', (e) => {
            if (e.target === callModal) {
                chatManager.endCall();
            }
        });
    }
}

/**
 * Filtra las conversaciones por búsqueda
 */
function filterConversations(query) {
    const items = document.querySelectorAll('.conversation-item');
    const lowerQuery = query.toLowerCase();

    items.forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();

        if (name.includes(lowerQuery) || preview.includes(lowerQuery)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

console.log('✓ Chat Manager cargado');
