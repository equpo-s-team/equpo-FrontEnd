import { MessageCircle, Search, Users } from 'lucide-react';

import { GroupAvatar } from '@/components/ui/GroupAvatar.tsx';
import { useChatContext } from '@/features/chat-videocall/components/ChatContext.tsx';

import type { ChatRoom } from '../types/chat';

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
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg sm:rounded-xl cursor-pointer
        transition-all duration-200 group relative
        ${isActive ? 'bg-grey-150 dark:bg-gray-800 shadow-card' : 'hover:bg-grey-100 dark:hover:bg-gray-700'}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <GroupAvatar src={room.photoUrl} name={room.name} className="w-9 h-9 sm:w-11 sm:h-11" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`
              font-body font-semibold text-xs sm:text-sm truncate
              ${isActive ? 'text-grey-900 dark:text-white' : 'text-grey-700 dark:text-gray-300'}
            `}
          >
            {room.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={10} className="text-grey-400 flex-shrink-0" />
          <p className="text-grey-500 font-body text-xs truncate">Grupo</p>
        </div>
      </div>
    </button>
  );
}

export default function ConversationList() {
  const { rooms, activeRoom, selectRoom, searchQuery, setSearchQuery } = useChatContext();

  return (
    <aside className="w-full lg:w-[280px] lg:h-screen flex-shrink-0 flex flex-col border-r border-grey-150 dark:border-gray-700 bg-primary dark:bg-gray-900 h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-5 pb-2 sm:pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} sm:size={18} className="text-purple flex-shrink-0" />
          <h2 className="font-body font-bold text-grey-900 dark:text-white text-sm sm:text-base">Mensajes</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 sm:px-4 pb-2 sm:pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="
              w-full pl-8 pr-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl
              bg-grey-100 dark:bg-gray-800 border border-transparent
              focus:outline-none focus:border-grey-200 focus:bg-grey-50
              font-body text-xs sm:text-sm text-grey-800 placeholder:text-grey-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-1.5 sm:px-2 pb-4 flex flex-col gap-0.5 scrollbar-hide">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-grey-400">
            <MessageCircle size={24} sm:size={32} strokeWidth={1.5} />
            <p className="mt-2 font-body text-xs sm:text-sm">Sin salas disponibles</p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomItem
              key={room.id}
              room={room}
              isActive={activeRoom?.id === room.id}
              onClick={() => selectRoom(room)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
