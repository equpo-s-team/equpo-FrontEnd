import ConversationList from '../components/ConversationList';
import ChatHeader from '../components/ChatHeader';
import MessageArea from '../components/MessageArea';
import MessageInput from '../components/MessageInput';
import CallModal from '../components/CallModal';
import {ChatProvider} from "@/features/chat-videocall/components/ChatContext.tsx";

function ChatLayout() {
  return (
    <div className="flex h-full bg-primary">
      {/* Conversation sidebar */}
      <ConversationList />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0 bg-grey-50">
        <ChatHeader />
        <MessageArea />
        <MessageInput />
      </main>

      {/* Call overlay */}
      <CallModal />
    </div>
  );
}

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}
