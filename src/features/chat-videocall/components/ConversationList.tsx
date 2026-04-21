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
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer
        transition-all duration-200 group relative
        ${isActive ? 'bg-grey-150 shadow-card' : 'hover:bg-grey-100'}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <GroupAvatar src={room.photoUrl} name={room.name} className="w-11 h-11 shadow-card" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span
            className={`
              font-body font-semibold text-sm truncate
              ${isActive ? 'text-grey-900' : 'text-grey-700'}
            `}
          >
            {room.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users size={10} className="text-grey-400" />
          <p className="text-grey-500 font-body text-xs truncate">Grupo</p>
        </div>
      </div>
    </button>
  );
}

export default function ConversationList() {
  const { rooms, activeRoom, selectRoom, searchQuery, setSearchQuery } = useChatContext();

  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-grey-150 bg-primary h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-purple" />
          <h2 className="font-body font-bold text-grey-900 text-base">Mensajes</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar sala..."
            className="
              w-full pl-8 pr-3 py-2 rounded-xl
              bg-grey-100 border border-transparent
              focus:outline-none focus:border-grey-200 focus:bg-grey-50
              font-body text-sm text-grey-800 placeholder:text-grey-400
              transition-all duration-200
            "
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-0.5 scrollbar-hide">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-grey-400">
            <MessageCircle size={32} strokeWidth={1.5} />
            <p className="mt-2 font-body text-sm">Sin salas disponibles</p>
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
