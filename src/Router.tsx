import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from '@/components/AppLayout.tsx';
import { useAuth } from '@/context/AuthContext';
import { TeamProvider, useTeam } from '@/context/TeamContext.tsx';
import { AuthActionPage } from '@/features/auth/components/AuthActionPage.tsx';
import TeamBoard from '@/features/board/TeamBoard.tsx';
import ChatPage from '@/features/chat-videocall/ChatPage.tsx';
import { ChatProvider } from '@/features/chat-videocall/components/ChatContext.tsx';
import VideoCallPage from '@/features/chat-videocall/VideoCallPage.tsx';

const GamePage = lazy(() => import('@/features/enviroment/GamePage.tsx'));
import MyMissions from '@/features/my-missions/MyMissions.tsx';
import { SidebarProvider, useSidebar } from '@/features/navbar/SidebarContext.tsx';
import LandingPage from '@/features/presentation/page.tsx';
import Reports from '@/features/reports/Reports.tsx';
import ShopScreen from '@/features/shop/ShopScreen.tsx';
import JoinTeamPage from '@/features/team/components/JoinTeamPage.tsx';
import RedeemInvitePage from '@/features/team/components/RedeemInvitePage.tsx';
import TeamSettings from '@/features/team/components/TeamSettings.tsx';
import { useTeams } from '@/features/team/hooks/useTeams.ts';
import TeamsHub from '@/features/team/TeamsHub.tsx';

function Dashboard() {
  const { activeItem } = useSidebar();
  const { activeTeam, myRole } = useTeam();
  const { isLoading } = useTeams();

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

  if (!activeTeam) {
    return <Navigate to="/teams" replace />;
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'my-space':
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-screen bg-grey-900">
                <div
                  className="w-10 h-10 rounded-full border-4 border-grey-200 animate-spin"
                  style={{ borderTopColor: '#60AFFF' }}
                />
              </div>
            }
          >
            <GamePage />
          </Suspense>
        );
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
      case 'shop':
        return <ShopScreen />;
      default:
        return <TeamBoard />;
    }
  };

  return <AppLayout>{renderContent()}</AppLayout>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isVerified, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isVerified ? (
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
  const { isVerified, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return isVerified ? <SidebarProvider>{children}</SidebarProvider> : <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth/action" element={<AuthActionPage />} />
        <Route path="/invite/:code?" element={<RedeemInvitePage />} />
        <Route path="/join/:code" element={<JoinTeamPage />} />

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
