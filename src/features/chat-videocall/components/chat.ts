export interface User {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  type: 'text' | 'image' | 'file';
}

export interface Conversation {
  id: string;
  name: string;
  initials: string;
  avatarGradient: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  lastMessageTime: Date;
  messages: Message[];
}

export interface CallSession {
  type: 'video' | 'audio';
  remotePeerID: string;
  remotePeerName: string;
  startTime: Date;
  isActive: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
  duration?: number;
}

export type CallState = 'idle' | 'calling' | 'in-call';
