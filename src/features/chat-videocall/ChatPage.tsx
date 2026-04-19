import { useState } from 'react';
import CallModal from './components/CallModal.tsx';
import CallNotification from './components/CallNotification.tsx';
import ChatHeader from './components/ChatHeader.tsx';
import ConversationList from './components/ConversationList.tsx';
import MessageArea from './components/MessageArea.tsx';
import MessageInput from './components/MessageInput.tsx';

function ChatLayout() {
  return (
    <div className="flex w-screen h-[100dvh] bg-primary">
      <CallNotification />
      
      {/* Sidebar - visible on all sizes */}
      <div className="flex flex-col flex-shrink-0">
        <ConversationList />
      </div>

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0 bg-grey-50">
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
