import { Search, Plus, MessageCircle } from 'lucide-react';
import {useChatContext} from "@/features/chat-videocall/components/ChatContext.tsx";
import {Conversation} from "@/features/chat-videocall/components/chat.ts";


function ConversationItem({ conv, isActive, onClick }: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
        transition-all duration-200 group relative
        ${isActive
          ? 'bg-grey-150 shadow-card'
          : 'hover:bg-grey-100'
        }
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className={`
          w-11 h-11 rounded-2xl bg-gradient-to-br ${conv.avatarGradient}
          flex items-center justify-center
          text-white font-body font-semibold text-sm
          shadow-card
        `}>
          {conv.initials}
        </div>
        {conv.isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-DEFAULT rounded-full border-2 border-primary" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`
            font-body font-semibold text-sm truncate
            ${isActive ? 'text-grey-900' : 'text-grey-700'}
          `}>
            {conv.name}
          </span>
          <span className="text-grey-400 font-body text-xs flex-shrink-0 ml-2">
            {conv.timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-grey-500 font-body text-xs truncate pr-2">
            {conv.lastMessage}
          </p>
          {conv.unread > 0 && (
            <span className="flex-shrink-0 w-5 h-5 bg-purple-DEFAULT rounded-full flex items-center justify-center text-white font-body font-bold text-[10px]">
              {conv.unread > 9 ? '9+' : conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function ConversationList() {
  const { conversations, activeConversation, selectConversation, searchQuery, setSearchQuery } = useChatContext();

  return (
    <aside className="w-[280px] flex-shrink-0 flex flex-col border-r border-grey-150 bg-primary h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-purple-DEFAULT" />
          <h2 className="font-body font-bold text-grey-900 text-base">Mensajes</h2>
        </div>
        <button className="w-8 h-8 rounded-xl bg-grey-100 hover:bg-grey-150 transition-colors flex items-center justify-center group">
          <Plus size={15} className="text-grey-500 group-hover:text-grey-900 transition-colors" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar conversación..."
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
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-grey-400">
            <MessageCircle size={32} strokeWidth={1.5} />
            <p className="mt-2 font-body text-sm">Sin resultados</p>
          </div>
        ) : (
          conversations.map(conv => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={activeConversation?.id === conv.id}
              onClick={() => selectConversation(conv)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
