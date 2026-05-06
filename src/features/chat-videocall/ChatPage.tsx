import CallModal from './components/CallModal.tsx';
import CallNotification from './components/CallNotification.tsx';
import { useChatContext } from './components/ChatContext.tsx';
import ChatHeader from './components/ChatHeader.tsx';
import ConversationList from './components/ConversationList.tsx';
import MessageArea from './components/MessageArea.tsx';
import MessageInput from './components/MessageInput.tsx';

function ChatLayout() {
  const { activeRoom, showConversationList } = useChatContext();

  return (
    <div className="flex h-full min-h-0 bg-primary dark:bg-gray-900 flex-col lg:flex-row">
      <CallNotification />
      
      {/* Conversation sidebar - Hidden on mobile if chat is active, always visible on desktop */}
      <div className={`
        ${showConversationList ? 'block' : 'hidden'}
        lg:block
        w-full lg:w-[280px] h-auto lg:h-screen lg:flex-shrink-0
        border-r border-grey-150 dark:border-gray-700
      `}>
        <ConversationList />
      </div>

      {/* Main chat area - Full screen on mobile when active, flex-1 on desktop */}
      <main className={`
        ${activeRoom && !showConversationList ? 'flex' : 'hidden'}
        lg:flex
        flex-1 flex-col min-w-0 min-h-0 h-full max-h-[calc(100vh-var(--bottom-nav-height,56px))] lg:max-h-screen lg:pb-0 bg-grey-50 dark:bg-gray-800
      `}>
        <ChatHeader />
        <MessageArea />
        <MessageInput />
      </main>

      {/* In-call overlay */}
      <CallModal />
    </div>
  );
}

export default function ChatPage() {
  return <ChatLayout />;
}
