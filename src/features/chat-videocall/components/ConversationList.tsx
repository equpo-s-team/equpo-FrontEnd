import { MessageCircle, Search, Users } from 'lucide-react';

import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';

import type { ChatRoom } from '../types/chat';

const ROOM_GRADIENTS = [
  'from-[#60AFFF] to-[#5961F9]',
  'from-[#F65A70] to-[#FF94AE]',
  'from-[#9b7fe1] to-[#5961F9]',
  'from-[#9CEDC1] to-[#86F0FD]',
  'from-[#FFB347] to-[#FF6B6B]',
  'from-[#667EEA] to-[#764BA2]',
];

function getGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ROOM_GRADIENTS[Math.abs(hash) % ROOM_GRADIENTS.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function RoomItem({
  room,
  isActive,
  onClick,
}: {
  room: ChatRoom;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-3 sm:py-2.5 rounded-lg sm:rounded-xl text-left
        transition-all duration-200 group relative
        ${isActive ? 'bg-grey-150 shadow-card' : 'hover:bg-grey-100'}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className={`
          w-10 sm:w-11 h-10 sm:h-11 rounded-lg sm:rounded-2xl bg-gradient-to-br ${getGradient(room.id)}
          flex items-center justify-center
          text-white font-body font-semibold text-xs sm:text-sm
          shadow-card
        `}
        >
          {getInitials(room.name)}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`
            font-body font-semibold text-sm sm:text-sm truncate
            ${isActive ? 'text-grey-900' : 'text-grey-700'}
          `}
          >
            {room.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={10} className="text-grey-400" />
          <p className="text-grey-500 font-body text-xs sm:text-xs truncate">Grupo</p>
        </div>
      </div>
    </button>
  );
}

export default function ConversationList() {
  const { rooms, activeRoom, selectRoom, searchQuery, setSearchQuery } = useChatContext();

  const handleRoomClick = (room: ChatRoom) => {
    selectRoom(room);
  };

  return (
    <aside className="w-[160px] sm:w-[220px] md:w-[280px] flex-shrink-0 flex flex-col border-r border-grey-150 bg-primary h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-4 sm:pt-5 pb-3 sm:pb-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-purple" />
          <h2 className="font-body font-bold text-grey-900 text-base sm:text-base">Mensajes</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 sm:px-4 pb-3 sm:pb-3 flex-shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sala..."
            className="
              w-full pl-8 pr-3 py-2 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm
              bg-grey-100 border border-transparent
              focus:outline-none focus:border-grey-200 focus:bg-grey-50
              font-body text-grey-800 placeholder:text-grey-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 py-2 sm:py-3 flex flex-col gap-1 scrollbar-hide">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-grey-400">
            <MessageCircle size={32} strokeWidth={1.5} />
            <p className="mt-3 font-body text-sm">Sin salas disponibles</p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              isActive={activeRoom?.id === room.id}
              onClick={() => handleRoomClick(room)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
