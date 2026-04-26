import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';
import { useSidebar } from '@/features/navbar/SidebarContext.jsx';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useAuth } from '@/hooks/useAuth';

import { useChatRooms } from '../hooks/useChatRooms';
import { useDeleteMessage } from '../hooks/useDeleteMessage';
import { useEditMessage } from '../hooks/useEditMessage';
import { useRoomMessages } from '../hooks/useRoomMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { useZegoToken } from '../hooks/useZegoToken';
import type {
  CallSession,
  CallState,
  ChatMessage,
  ChatRoom,
  RtcConnectionStatus,
} from '../types/chat';

type VideoCallJoinMode = 'new' | 'join';

interface VideoCallSession {
  roomId: string;
  joinMode: VideoCallJoinMode;
}

interface ChatContextType {
  teamId: string;
  myRole: string;
  /* rooms */
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  selectRoom: (room: ChatRoom) => void;

  /* messages (driven by activeRoom) */
  messages: ChatMessage[];
  sendMessage: (
    text: string,
    type?: 'text' | 'system' | 'image' | 'file',
    fileUrl?: string,
    fileName?: string,
  ) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;

  replyingTo: ChatMessage | null;
  setReplyingTo: (msg: ChatMessage | null) => void;

  /* search */
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  /* legacy call UI (inline) */
  callState: CallState;
  callSession: CallSession | null;
  startCall: (isVideo: boolean) => void;
  endCall: () => void;
  isMuted: boolean;
  isCameraOff: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;

  /* video call (full-page ZEGO) */
  activeVideoCall: VideoCallSession | null;
  rtcStatus: RtcConnectionStatus;
  startVideoCallSession: (options: { roomId?: string; mode: VideoCallJoinMode }) => void;
  endVideoCallSession: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return '';
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const getTeamContext = useTeam as () => { teamId?: string };
  const teamContext = getTeamContext();
  const teamId = teamContext.teamId ?? '';

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const { setActiveItem } = useSidebar();

  // ── Role ─────────────────────────────────────────────────────────────────
  const { user } = useAuth();
  const { data: teamMembers = [] } = useTeamMembers(teamId);
  const myRole = useMemo(() => {
    if (!user?.uid || !teamMembers.length) return 'member';
    return teamMembers.find((m) => m.uid === user.uid)?.role ?? 'member';
  }, [user?.uid, teamMembers]);

  // ── Groups → ChatRooms ──────────────────────────────────────────────────────
  const { data: groups = [] } = useTeamGroups(teamId);
  const { data: rooms = [] } = useChatRooms(teamId, groups);

  // ── Active Room ─────────────────────────────────────────────────────────────
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const { data: messages = [] } = useRoomMessages(teamId, activeRoom?.id ?? null);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const sendMutation = useSendMessage();
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const zegoTokenMutation = useZegoToken();

  // ── Search & Reply ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // ── Call State ──────────────────────────────────────────────────────────────
  const [callState, setCallState] = useState<CallState>('idle');
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [activeVideoCall, setActiveVideoCall] = useState<VideoCallSession | null>(null);
  const [rtcStatus, setRtcStatus] = useState<RtcConnectionStatus>('idle');

  // ── Handlers ────────────────────────────────────────────────────────────────

  const selectRoom = useCallback((room: ChatRoom) => {
    setActiveRoom(room);
    setReplyingTo(null);
  }, []);

  const sendMessage = useCallback(
    (
      text: string,
      type: 'text' | 'system' | 'image' | 'file' = 'text',
      fileUrl?: string,
      fileName?: string,
    ) => {
      if (!activeRoom) return;
      if (type === 'text' && !text.trim()) return;

      sendMutation.mutate({
        teamId,
        roomId: activeRoom.id,
        text: text.trim(),
        type,
        fileUrl,
        fileName,
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text || 'Archivo multimedia',
              senderName: replyingTo.senderName,
            }
          : undefined,
      });
      setReplyingTo(null);
    },
    [activeRoom, sendMutation, teamId, replyingTo],
  );

  const editMessage = useCallback(
    (messageId: string, newText: string) => {
      if (!activeRoom || !newText.trim()) return;
      editMutation.mutate({
        teamId,
        roomId: activeRoom.id,
        messageId,
        newText: newText.trim(),
      });
    },
    [activeRoom, editMutation, teamId],
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!activeRoom) return;
      deleteMutation.mutate({ teamId, roomId: activeRoom.id, messageId });
    },
    [activeRoom, deleteMutation, teamId],
  );

  const startCall = useCallback(
    (isVideo: boolean) => {
      if (!activeRoom) return;
      setCallState('calling');
      setCallSession({
        type: isVideo ? 'video' : 'audio',
        roomId: activeRoom.id,
        startTime: new Date(),
        isActive: true,
        isMuted: false,
        isVideoEnabled: isVideo,
      });
      // Simulate answer after 3s (for inline call UI)
      setTimeout(() => setCallState('in-call'), 3000);
    },
    [activeRoom],
  );

  const startVideoCallSession = useCallback(
    (options: { roomId?: string; mode: VideoCallJoinMode }) => {
      const roomId = options.roomId?.trim() || activeRoom?.id;
      if (!roomId) {
        console.warn(
          '[ChatContext] Cannot start video call session: No roomId provided and no activeRoom selected.',
        );
        return;
      }

      setRtcStatus('requesting-token');
      setActiveVideoCall({ roomId, joinMode: options.mode });

      // Navigate to the video call page
      setActiveItem('video-call');

      // The token will be fetched when VideoCallPage mounts
      // via the chatApi.getZegoToken call. Here we just set the state.
      zegoTokenMutation.mutate(
        { teamId, roomId },
        {
          onSuccess: () => setRtcStatus('connecting'),
          onError: (error) => {
            const message = getErrorMessage(error);
            if (message.includes('403') || message.includes('Forbidden')) {
              setRtcStatus('forbidden');
            } else {
              setRtcStatus('error');
            }
          },
        },
      );
    },
    [activeRoom, teamId, zegoTokenMutation, setActiveItem],
  );

  const endVideoCallSession = useCallback(() => {
    setActiveVideoCall(null);
    setRtcStatus('idle');
  }, []);

  const endCall = useCallback(() => {
    setCallState('idle');
    setCallSession(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, []);

  const toggleMute = useCallback(() => setIsMuted((p) => !p), []);
  const toggleCamera = useCallback(() => setIsCameraOff((p) => !p), []);

  // ── Filter rooms by search ─────────────────────────────────────────────────
  const filteredRooms = searchQuery
    ? rooms.filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : rooms;

  return (
    <ChatContext.Provider
      value={{
        teamId,
        myRole,
        rooms: filteredRooms,
        activeRoom,
        selectRoom,
        messages,
        sendMessage,
        editMessage,
        deleteMessage,
        replyingTo,
        setReplyingTo,
        searchQuery,
        setSearchQuery,
        callState,
        callSession,
        startCall,
        endCall,
        isMuted,
        isCameraOff,
        toggleMute,
        toggleCamera,
        activeVideoCall,
        rtcStatus,
        startVideoCallSession,
        endVideoCallSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatContext must be used within ChatProvider');
  return ctx;
}
