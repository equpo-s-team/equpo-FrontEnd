import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from '@/components/AppLayout.tsx';
import { useAuth } from '@/context/AuthContext';
import { TeamProvider, useTeam } from '@/context/TeamContext.tsx';
import TeamBoard from '@/features/board/TeamBoard.tsx';
import ChatPage from '@/features/chat-videocall/ChatPage.tsx';
import { ChatProvider } from '@/features/chat-videocall/components/ChatContext.tsx';
import VideoCallPage from '@/features/chat-videocall/VideoCallPage.tsx';
import GamePage from '@/features/enviroment/GamePage.tsx';
import MyMissions from '@/features/my-missions/MyMissions.tsx';
import { SidebarProvider, useSidebar } from '@/features/navbar/SidebarContext.tsx';
import LandingPage from '@/features/presentation/page.tsx';
import Reports from '@/features/reports/Reports.tsx';
import TeamSettings from '@/features/team/components/TeamSettings.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';
import TeamsHub from '@/features/team/TeamsHub.tsx';
import RedeemInvitePage from '@/features/team/components/RedeemInvitePage.tsx';

function Dashboard() {
  const { activeItem } = useSidebar();
  const { teamId } = useTeam();
  const { user } = useAuth();
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

  const myRole = (() => {
    if (!activeTeam || !user?.uid) return null;
    if (activeTeam.leaderUid === user.uid) return 'leader';
    return activeTeam.members.find((m) => m.userUid === user.uid)?.role ?? null;
  })();

  const renderContent = () => {
    switch (activeItem) {
      case 'my-space':
        return <GamePage />;
      case 'missiones':
        return <TeamBoard />;
      case 'my-missions':
        return myRole === 'spectator' ? <TeamBoard /> : <MyMissions />;
      case 'chat':
        return <ChatPage />;
      case 'video-call':
        return <VideoCallPage />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <TeamSettings />;
      default:
        return <TeamBoard />;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
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

function TeamsRoute({ children }: { children: React.ReactNode }) {
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
        <Route path="/invite/:code?" element={<RedeemInvitePage />} />

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
