import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { TeamProvider, useTeam } from '@/context/TeamContext.tsx';
import TeamBoard from '@/features/board/TeamBoard.jsx';
import ChatPage from '@/features/chat-videocall/ChatPage.tsx';
import { ChatProvider } from '@/features/chat-videocall/components/ChatContext.tsx';
import VideoCallPage from '@/features/chat-videocall/VideoCallPage.jsx';
import GamePage from '@/features/enviroment/GamePage.tsx';
import MyMissions from '@/features/my-missions/MyMissions.tsx';
import LandingPage from '@/features/presentation/page.jsx';
import Reports from '@/features/reports/Reports.tsx';
import TeamSettings from '@/features/team/components/TeamSettings.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';
import TeamsHub from '@/features/team/TeamsHub.tsx';
import AppLayout from '@/lib/layout/components/AppLayout.jsx';
import { SidebarProvider, useSidebar } from '@/lib/layout/components/navbar/SidebarContext.jsx';

function Dashboard() {
  const { activeItem } = useSidebar();
  const { teamId } = useTeam();
  const { data: teams = [], isLoading } = useTeams();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary">
        <div
          className="w-10 h-10 rounded-full border-4 border-grey-200 animate-spin"
          style={{ borderTopColor: '#60AFFF' }}
        />
      </div>
    );
  }

  const activeTeam = teams.find((t) => t.id === teamId);
  if (!activeTeam) {
    return <Navigate to="/teams" replace />;
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'my-space':
        return <GamePage />;
      case 'missiones':
        return <TeamBoard />;
      case 'my-missions':
        return <MyMissions />;
      case 'chat':
        return <ChatPage />;
      case 'video-call':
        return <VideoCallPage />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <TeamSettings />;
      default:
        return <div>Mi Espacio</div>;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
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
      <SidebarProvider>
        <ChatProvider>{children}</ChatProvider>
      </SidebarProvider>
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

        <Route path="/dashboard" element={<Navigate to="/teams" replace />} />
        <Route
          path="/dashboard/:teamId"
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
