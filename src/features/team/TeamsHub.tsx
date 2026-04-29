import { signOut } from 'firebase/auth';
import log from 'loglevel';
import { LogOut, Users } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { TeamCard } from '@/features/team/components/TeamCard';
import { TeamFormSidebar } from '@/features/team/components/TeamFormSidebar';
import { UserProfileSidebar } from '@/features/team/components/user/UserProfileSidebar.tsx';
import { useCreateTeam } from '@/features/team/hooks/useCreateTeam';
import { useTeams } from '@/features/team/hooks/useTeams';
import { useUpdateTeam } from '@/features/team/hooks/useUpdateTeam';
import { useUpdateUserProfile } from '@/features/team/hooks/useUpdateUserProfile';
import type { ModalState } from '@/features/team/types/teamsTypes';
import { type UserProfileSaveInput } from '@/features/team/types/userTypes';
import { auth } from '@/firebase';
import { toastError, toastSuccess } from '@/lib/toast';

import { AchievementsSection } from './components/Achievements/AchievementsSection';
import { type UserProfile, UserProfileCard } from './components/user/UserProfileCard';
import { useAchievements } from './hooks/useAchievements';

type AuthContextUser = {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  level?: number | null;
  experiencePoints?: number | null;
  virtualCurrency?: number | null;
};

function xpRequiredForLevel(level: number): number {
  if (level <= 0) return 0;
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

const mapAuthUserToProfile = (authUser: AuthContextUser | null): UserProfile => {
  const level = typeof authUser?.level === 'number' && authUser.level > 0 ? authUser.level : 0;
  const totalExperience =
    typeof authUser?.experiencePoints === 'number' && authUser.experiencePoints >= 0
      ? authUser.experiencePoints
      : 0;

  const currentLevelXp = xpRequiredForLevel(level);
  const nextLevelXp = xpRequiredForLevel(level + 1);

  const relativeExperience = Math.max(0, totalExperience - currentLevelXp);
  const relativeExperienceToNextLevel = nextLevelXp - currentLevelXp;

  return {
    uid: authUser?.uid || 'sin-uid',
    displayName: authUser?.displayName || authUser?.email?.split('@')[0] || 'Usuario',
    photoURL: authUser?.photoURL ?? null,
    level,
    experience: relativeExperience,
    experienceToNextLevel: relativeExperienceToNextLevel,
    virtualCurrency: authUser?.virtualCurrency || 0,
  };
};

export const TeamsHub: React.FC = () => {
  const { data: teams = [], isLoading, error } = useTeams();
  const { user: authUser } = useAuth() as { user: AuthContextUser | null };
  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const { saveProfile } = useUpdateUserProfile();

  const [modal, setModal] = useState<ModalState>({ mode: null });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileOverrides, setProfileOverrides] = useState<
    Partial<Pick<UserProfile, 'displayName' | 'photoURL'>>
  >({});
  const [search, setSearch] = useState('');

  const firstTeamId = teams.length > 0 ? teams[0].id : undefined;
  const { data: achievements = [] } = useAchievements(firstTeamId);

  const mappedAchievements = useMemo(
    () =>
      achievements.map((a) => ({
        id: a.id,
        name: a.name,
        icon: a.icon,
        iconUrl: a.iconUrl ?? null,
        description: a.description ?? '',
        unlockedAt: a.unlockedAt ?? null,
      })),
    [achievements],
  );
  const baseUser = mapAuthUserToProfile(authUser);
  const user: UserProfile = {
    ...baseUser,
    ...profileOverrides,
  };

  const openCreate = () => setModal({ mode: 'create' });
  const closeModal = () => setModal({ mode: null });

  const handleCreate = (payload: { name: string; description: string; memberUids: string[] }) => {
    createTeam.mutate(
      {
        name: payload.name,
        description: payload.description || null,
        memberUids: payload.memberUids,
      },
      {
        onSuccess: () => {
          closeModal();
          toastSuccess('Equipo creado', `"${payload.name}" fue creado correctamente.`);
        },
        onError: (err) =>
          toastError(
            'Error al crear equipo',
            err instanceof Error ? err.message : 'Intenta de nuevo.',
          ),
      },
    );
  };

  const handleEdit = (
    teamId: string,
    payload: { name: string; description: string; memberUids: string[] },
  ) => {
    const updatePayload: Record<string, string | null> = {};
    if (activeTeam && payload.name !== activeTeam.name) updatePayload.name = payload.name;
    if (activeTeam && payload.description !== (activeTeam.description || ''))
      updatePayload.description = payload.description || null;
    updateTeam.mutate(
      { teamId, payload: updatePayload, memberUids: payload.memberUids },
      {
        onSuccess: () => {
          closeModal();
          toastSuccess('Equipo actualizado', 'Los cambios se guardaron correctamente.');
        },
        onError: (err) =>
          toastError(
            'Error al actualizar equipo',
            err instanceof Error ? err.message : 'Intenta de nuevo.',
          ),
      },
    );
  };

  const navigate = useNavigate();

  const handleEnter = (id: string) => {
    log.log('Entering team', id);
    void navigate(`/dashboard/${id}`);
  };

  const handleProfileSave = async (updated: UserProfileSaveInput): Promise<void> => {
    const nextDisplayName = updated.displayName || user.displayName;

    try {
      const savedProfile = await saveProfile({
        uid: user.uid,
        displayName: nextDisplayName,
        photoURL: updated.photoURL,
        photoFile: updated.photoFile,
      });

      setProfileOverrides((prev) => ({
        ...prev,
        displayName: savedProfile.displayName,
        photoURL: savedProfile.photoURL,
      }));
    } catch (error) {
      log.error('Error updating user profile', error);
      throw error;
    }
  };

  const filtered = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || '').toLowerCase().includes(search.toLowerCase()),
  );

  const activeTeam = modal.teamId ? teams.find((t) => t.id === modal.teamId) : undefined;

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      void navigate('/');
    } catch {
      toastError('Error al cerrar sesión', 'No se pudo cerrar la sesión. Intenta de nuevo.');
    }
  };

  return (
    <div className="h-[100dvh] bg-white relative overflow-hidden">
      <div className="relative h-full w-full flex flex-col">
        <div className="shrink-0 flex w-full items-center justify-between mb-4 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-equpo">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <span className="font-bold text-grey-800 text-lg">Equpo</span>
          </div>

          <button
            onClick={() => void handleLogout()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

      {/* Main content - Responsive grid */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 lg:p-6 lg:grid-rows-[auto_minmax(0,1fr)]">

          {/* User Profile Card - Full width on mobile, spans 3 cols on desktop */}
          <section className="lg:col-span-3">
            <UserProfileCard user={user} onOpenSettings={() => setIsProfileOpen(true)} />
          </section>

          {/* Teams Section - Main content */}
          <section className="lg:col-span-3 rounded-xl bg-grey-50 p-5 lg:p-6 flex flex-col min-h-0">

            {/* Teams Header with Search and Create */}
            <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-grey-150 bg-white/80 backdrop-blur-sm shrink-0" style={{ boxShadow: '0 4px 16px rgba(96,175,255,0.25)' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#60AFFF', boxShadow: '0 0 8px #60AFFF' }} />
                <div className="flex flex-row gap-2 items-center">
                  <p className="text-sm font-bold" style={{ color: '#60AFFF' }}>
                    {teams.length}
                  </p>
                  <p className="text-xs text-grey-400">Equipos activos</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full lg:flex-row lg:w-auto lg:gap-4">
                {/* Search Input */}
                <div className="relative flex flex-row flex-1 lg:flex-none lg:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-300 text-sm pointer-events-none">
                    ⌕
                  </span>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar equipos…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-grey-150 bg-white/80 text-sm text-grey-700 outline-none backdrop-blur-sm transition-all"
                    onFocus={(e) =>
                      (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,175,255,0.2)')
                    }
                    onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  />
                </div>

                {/* Create Team Button */}
                <button
                  onClick={openCreate}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 100%)',
                    boxShadow: '0 4px 20px rgba(96,175,255,0.4)',
                  }}
                >
                  <span className="text-base leading-none">+</span>
                  <span className="hidden sm:inline">Crear equipo</span>
                </button>

                {/* Redeem Code Button */}
                <button
                  onClick={() => navigate('/invite')}
                  disabled={true}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-grey-700 bg-white border border-grey-200 transition-all hover:bg-grey-50 active:scale-95 shrink-0"
                >
                  <span className="text-base leading-none"></span>
                  <span className="hidden sm:inline">Canjear código</span>
                </button>
              </div>
            </div>

            {/* Teams Grid */}
            <div className="flex-1 min-h-0">
              {isLoading ? (
                <div className="text-center py-20">
                  <div
                    className="inline-block w-10 h-10 rounded-full border-4 border-grey-200 animate-spin"
                    style={{ borderTopColor: '#60AFFF' }}
                  />
                  <p className="text-grey-400 text-sm mt-4">Cargando tus equipos…</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-[#F65A70] text-sm">
                    Error al cargar los equipos. Intenta de nuevo.
                  </p>
                </div>
              ) : filtered.length === 0 && search ? (
                <div className="text-center py-20">
                  <p className="text-grey-400 text-sm">
                    No se encontraron equipos para "<strong>{search}</strong>"
                  </p>
                </div>
              ) : filtered.length === 0 && !search ? (
                <EmptyState
                  icon={Users}
                  title="Aún no tienes equipos"
                  description="Crea tu primer equipo e invita a tus compañeros para empezar a colaborar."
                  action={{ label: '+ Crear equipo', onClick: openCreate }}
                  size="lg"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 overflow-y-auto pr-1">
                  {filtered.map((team) => (
                    <TeamCard key={team.id} team={team} onEnter={handleEnter} />
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Achievements Section - Mobile: full width below with scroll, Desktop: right sidebar */}
          <section className="lg:col-start-4 lg:row-start-1 lg:row-span-2 lg:h-full max-h-[50vh] overflow-y-auto lg:max-h-none lg:overflow-visible">
            <div className="rounded-xl bg-grey-50 p-5 lg:p-6 lg:h-full lg:flex lg:flex-col">
              <AchievementsSection achievements={mappedAchievements} />
            </div>
          </section>
        </div>
      </div>


      {/* Modals */}
      {(modal.mode === 'create' || modal.mode === 'edit') && (
        <TeamFormSidebar
          mode={modal.mode}
          team={modal.mode === 'edit' ? activeTeam : undefined}
          onClose={closeModal}
          onSubmit={(payload) => {
            if (modal.mode === 'create') handleCreate(payload);
            else if (modal.mode === 'edit' && activeTeam) handleEdit(activeTeam.id, payload);
          }}
        />
      )}

      {isProfileOpen && (
        <UserProfileSidebar
          user={user}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleProfileSave}
        />
      )}

      {/* CSS for orb animation */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </div>
    </div>
  );
};

export default TeamsHub;
