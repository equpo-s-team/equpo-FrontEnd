/* ── Chat Room (Firestore: teams/{teamId}/chatRooms/{groupId}) ── */

export interface ChatRoom {
  id: string; // === groupId
  name: string;
  type: 'group';
  createdBy: string;
  createdAt: Date;
}

/* ── Chat Room Member (Firestore: .../chatRooms/{groupId}/members/{uid}) ── */

export interface ChatRoomMember {
  uid: string;
  role: string;
  addedAt: Date;
}

/* ── Message (Firestore: .../chatRooms/{groupId}/messages/{msgId}) ── */

export interface ChatMessage {
  id: string;
  senderUid: string;
  senderName: string;
  text: string;
  createdAt: Date;
  type: 'text' | 'system';
  deleted: boolean;
  editedAt?: Date;
}

/* ── ZEGO Token Response (Backend) ── */

export interface ZegoTokenResponse {
  token: string;
  appId: number;
  userId: string;
  roomId: string;
  expiresAt: string;
}

/* ── RTC state machine ── */

export type RtcConnectionStatus =
  | 'idle'
  | 'requesting-token'
  | 'connecting'
  | 'connected'
  | 'forbidden'
  | 'error';

/* ── Call Session (local UI state) ── */

export interface CallSession {
  type: 'video' | 'audio';
  roomId: string;
  startTime: Date;
  isActive: boolean;
  isMuted: boolean;
  isVideoEnabled: boolean;
}

export type CallState = 'idle' | 'calling' | 'in-call';
