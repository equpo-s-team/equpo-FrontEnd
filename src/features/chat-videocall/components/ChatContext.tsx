import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { Conversation, Message, CallSession, CallState } from '../types/chat';

const GRADIENT_MAP: Record<string, string> = {
  'JL': 'from-blue-DEFAULT to-purple-DEFAULT',
  'MG': 'from-red-DEFAULT to-orange-DEFAULT',
  'ED': 'from-purple-DEFAULT to-blue-DEFAULT',
  'AN': 'from-green-DEFAULT to-blue-DEFAULT',
  'CR': 'from-orange-DEFAULT to-red-DEFAULT',
};

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'user_1',
    name: 'Juan López',
    initials: 'JL',
    avatarGradient: 'from-[#60AFFF] to-[#5961F9]',
    lastMessage: 'Claro, te veo mañana entonces 👍',
    timestamp: '14:30',
    unread: 2,
    isOnline: true,
    lastMessageTime: new Date(Date.now() - 30 * 60000),
    messages: [
      { id: 'm1', senderId: 'user_1', content: '¡Hola! ¿Cómo va el proyecto?', timestamp: new Date(Date.now() - 60 * 60000), status: 'seen', type: 'text' },
      { id: 'm2', senderId: 'me', content: 'Todo bien, avanzando bastante bien', timestamp: new Date(Date.now() - 55 * 60000), status: 'seen', type: 'text' },
      { id: 'm3', senderId: 'user_1', content: 'Perfecto. ¿Nos vemos mañana para revisar el avance?', timestamp: new Date(Date.now() - 40 * 60000), status: 'seen', type: 'text' },
      { id: 'm4', senderId: 'me', content: 'Sí, a las 10am está perfecto', timestamp: new Date(Date.now() - 35 * 60000), status: 'seen', type: 'text' },
      { id: 'm5', senderId: 'user_1', content: 'Claro, te veo mañana entonces 👍', timestamp: new Date(Date.now() - 30 * 60000), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: 'user_2',
    name: 'María García',
    initials: 'MG',
    avatarGradient: 'from-[#F65A70] to-[#FF94AE]',
    lastMessage: 'Te envié los archivos del diseño',
    timestamp: '10:15',
    unread: 0,
    isOnline: false,
    lastMessageTime: new Date(Date.now() - 4 * 60 * 60000),
    messages: [
      { id: 'm6', senderId: 'user_2', content: 'Te envié los archivos del diseño', timestamp: new Date(Date.now() - 4 * 60 * 60000), status: 'seen', type: 'text' },
      { id: 'm7', senderId: 'me', content: '¡Gracias! Los revisaré hoy', timestamp: new Date(Date.now() - 3.5 * 60 * 60000), status: 'seen', type: 'text' },
    ],
  },
  {
    id: 'user_3',
    name: 'Equipo Dev',
    initials: 'ED',
    avatarGradient: 'from-[#9b7fe1] to-[#5961F9]',
    lastMessage: 'Juan: Listo, ya está deployado ✅',
    timestamp: 'Ayer',
    unread: 5,
    isOnline: true,
    lastMessageTime: new Date(Date.now() - 24 * 60 * 60000),
    messages: [
      { id: 'm8', senderId: 'user_3', content: 'El build falló en staging', timestamp: new Date(Date.now() - 25 * 60 * 60000), status: 'seen', type: 'text' },
      { id: 'm9', senderId: 'me', content: 'Revisando ahora mismo', timestamp: new Date(Date.now() - 24.5 * 60 * 60000), status: 'seen', type: 'text' },
      { id: 'm10', senderId: 'user_3', content: 'Listo, ya está deployado ✅', timestamp: new Date(Date.now() - 24 * 60 * 60000), status: 'delivered', type: 'text' },
    ],
  },
  {
    id: 'user_4',
    name: 'Ana Ruiz',
    initials: 'AN',
    avatarGradient: 'from-[#9CEDC1] to-[#86F0FD]',
    lastMessage: '¿Tienes un momento para revisar esto?',
    timestamp: 'Lun',
    unread: 0,
    isOnline: true,
    lastMessageTime: new Date(Date.now() - 3 * 24 * 60 * 60000),
    messages: [
      { id: 'm11', senderId: 'user_4', content: '¿Tienes un momento para revisar esto?', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000), status: 'seen', type: 'text' },
    ],
  },
];

interface ChatContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  callState: CallState;
  callSession: CallSession | null;
  searchQuery: string;
  isMuted: boolean;
  isCameraOff: boolean;
  selectConversation: (conv: Conversation) => void;
  sendMessage: (content: string) => void;
  startCall: (isVideo: boolean) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  setSearchQuery: (q: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [callState, setCallState] = useState<CallState>('idle');
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const callTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectConversation = useCallback((conv: Conversation) => {
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unread: 0 } : c
    ));
    setActiveConversation({ ...conv, unread: 0 });
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: 'me',
      content: content.trim(),
      timestamp: new Date(),
      status: 'sending',
      type: 'text',
    };

    const updatedConv: Conversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastMessage: content.trim(),
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }),
      lastMessageTime: new Date(),
    };

    setActiveConversation(updatedConv);
    setConversations(prev => prev.map(c => c.id === updatedConv.id ? updatedConv : c));

    // Simulate sent status
    setTimeout(() => {
      setActiveConversation(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: prev.messages.map(m => m.id === newMessage.id ? { ...m, status: 'sent' } : m),
        };
      });
    }, 600);
  }, [activeConversation]);

  const startCall = useCallback((isVideo: boolean) => {
    if (!activeConversation) return;
    setCallState('calling');
    const session: CallSession = {
      type: isVideo ? 'video' : 'audio',
      remotePeerID: activeConversation.id,
      remotePeerName: activeConversation.name,
      startTime: new Date(),
      isActive: true,
      isMuted: false,
      isVideoEnabled: isVideo,
    };
    setCallSession(session);
    // Simulate answer after 3s
    callTimerRef.current = setTimeout(() => setCallState('in-call'), 3000);
  }, [activeConversation]);

  const endCall = useCallback(() => {
    if (callTimerRef.current) clearTimeout(callTimerRef.current);
    setCallState('idle');
    setCallSession(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted(p => !p), []);
  const toggleCamera = useCallback(() => setIsCameraOff(p => !p), []);

  useEffect(() => () => { if (callTimerRef.current) clearTimeout(callTimerRef.current); }, []);

  const filteredConversations = searchQuery
    ? conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  return (
    <ChatContext.Provider value={{
      conversations: filteredConversations,
      activeConversation,
      callState,
      callSession,
      searchQuery,
      isMuted,
      isCameraOff,
      selectConversation,
      sendMessage,
      startCall,
      endCall,
      toggleMute,
      toggleCamera,
      setSearchQuery,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
