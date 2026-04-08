import CallModal from './components/CallModal.tsx';
import ChatHeader from './components/ChatHeader.tsx';
import ConversationList from './components/ConversationList.tsx';
import MessageArea from './components/MessageArea.tsx';
import MessageInput from './components/MessageInput.tsx';

function ChatLayout() {
  return (
    <div className="flex h-full min-h-0 bg-primary">
      {/* Conversation sidebar */}
      <ConversationList />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen max-h-screen bg-grey-50">
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
