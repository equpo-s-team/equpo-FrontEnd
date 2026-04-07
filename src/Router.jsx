import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { TeamProvider } from '@/context/TeamContext.jsx';
import TeamBoard from '@/features/board/TeamBoard.jsx';
import GamePage from '@/features/enviroment/GamePage.tsx';
import AppLayout from '@/features/layout/components/AppLayout.jsx';
import {
  SidebarProvider,
  useSidebar,
} from '@/features/layout/components/navbar/SidebarContext.jsx';
import LandingPage from '@/features/presentation/page.jsx';
import { ReportPage } from '@/features/reports/page.tsx';
import VideoCallPage from '@/features/chat-videocall/VideoCallPage.jsx';
import TeamsHub from '@/features/team/TeamsHub.tsx';
import ChatPage from "@/features/chat-videocall/ChatPage.tsx";
import { ChatProvider } from '@/features/chat-videocall/components/ChatContext.tsx';


function Dashboard() {
  const { activeItem } = useSidebar();

  const renderContent = () => {
    switch (activeItem) {
      case 'my-space':
        return <GamePage />;
      case 'missiones':
        return <TeamBoard />;
      case 'chat':
        return <ChatPage />;
      case 'video-call':
        return <VideoCallPage />;
      case 'reports':
        return <ReportPage />;
      case 'settings':
        return <div>Mi Espacio</div>;
      default:
        return <div>Mi Espacio</div>;
    }
  };

  return (
    <ChatProvider>
      <AppLayout>{renderContent()}</AppLayout>
    </ChatProvider>
  );
}

function ProtectedRoute({ children }) {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuth ? (
    <TeamProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </TeamProvider>
  ) : (
    <Navigate to="/" replace />
  );
}

function TeamsRoute({ children }) {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isAuth ? <SidebarProvider>{children}</SidebarProvider> : <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/teams"
          element={
            <TeamsRoute>
              <TeamsHub />
            </TeamsRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
