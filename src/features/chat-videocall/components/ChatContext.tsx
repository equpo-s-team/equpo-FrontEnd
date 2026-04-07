import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ChatRoom, ChatMessage, CallSession, CallState, RtcConnectionStatus } from '../types/chat';
import { useTeam } from '@/context/TeamContext';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useChatRooms } from '../hooks/useChatRooms';
import { useRoomMessages } from '../hooks/useRoomMessages';
import { useSendMessage } from '../hooks/useSendMessage';
import { useEditMessage } from '../hooks/useEditMessage';
import { useDeleteMessage } from '../hooks/useDeleteMessage';
import { useZegoToken } from '../hooks/useZegoToken';

type VideoCallJoinMode = 'new' | 'join';

interface VideoCallSession {
  roomId: string;
  joinMode: VideoCallJoinMode;
}

interface ChatContextType {
  /* rooms */
  rooms: ChatRoom[];
  activeRoom: ChatRoom | null;
  selectRoom: (room: ChatRoom) => void;

  /* messages (driven by activeRoom) */
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  deleteMessage: (messageId: string) => void;

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

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { teamId } = useTeam();

  // ── Groups → ChatRooms ──────────────────────────────────────────────────────
  const { data: groups = [] } = useTeamGroups(teamId);
  const groupIds = groups.map((g) => g.id);
  const { data: rooms = [] } = useChatRooms(teamId, groupIds);

  // ── Active Room ─────────────────────────────────────────────────────────────
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const { data: messages = [] } = useRoomMessages(teamId, activeRoom?.id ?? null);

  // ── Mutations ───────────────────────────────────────────────────────────────
  const sendMutation = useSendMessage();
  const editMutation = useEditMessage();
  const deleteMutation = useDeleteMessage();
  const zegoTokenMutation = useZegoToken();

  // ── Search ──────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');

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
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || !activeRoom) return;
      sendMutation.mutate({ teamId, roomId: activeRoom.id, text: text.trim() });
    },
    [activeRoom, sendMutation, teamId],
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
      if (!activeRoom) return;

      const roomId = options.roomId?.trim() || activeRoom.id;

      setRtcStatus('requesting-token');
      setActiveVideoCall({ roomId, joinMode: options.mode });

      // The token will be fetched when VideoCallPage mounts
      // via the chatApi.getZegoToken call. Here we just set the state.
      zegoTokenMutation.mutate(
        { teamId, roomId },
        {
          onSuccess: () => setRtcStatus('connecting'),
          onError: (error) => {
            if (error.message.includes('403') || error.message.includes('Forbidden')) {
              setRtcStatus('forbidden');
            } else {
              setRtcStatus('error');
            }
          },
        },
      );
    },
    [activeRoom, teamId, zegoTokenMutation],
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
        rooms: filteredRooms,
        activeRoom,
        selectRoom,
        messages,
        sendMessage,
        editMessage,
        deleteMessage,
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
