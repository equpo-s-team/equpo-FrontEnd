import React, { useState } from 'react';
import {CreateTeamPayload, EditTeamPayload, ModalState, Team, TeamColor} from "@/features/team/index.ts";
import {CURRENT_USER, MOCK_TEAMS} from "@/features/team/mockData.ts";
import {NewTeamCard} from "@/features/team/NewTeamCard.tsx";
import {CreateTeamModal} from "@/features/team/CreateTeamModal.tsx";
import {TeamCard} from "@/features/team/TeamCard.tsx";
import {EditTeamModal} from "@/features/team/EditTeamModal.tsx";
import {UserProfileModal} from "@/features/team/UserProfileModal.tsx";

export const TeamsHub: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>(MOCK_TEAMS);
  const [modal, setModal] = useState<ModalState>({ mode: null });
  const [search, setSearch] = useState('');

  const openCreate = () => setModal({ mode: 'create' });
  const openEdit = (id: string) => setModal({ mode: 'edit', teamId: id });
  const openProfile = () => setModal({ mode: 'profile' });
  const closeModal = () => setModal({ mode: null });

  const handleCreate = (payload: CreateTeamPayload & { color: TeamColor }) => {
    const newTeam: Team = {
      id: String(Date.now()),
      name: payload.name,
      description: payload.description,
      color: payload.color,
      score: 0,
      createdAt: new Date().toISOString(),
      members: payload.memberEmails.map((email, i) => ({
        id: `new-${i}`,
        name: email.split('@')[0],
        email,
        role: 'member',
        avatarInitials: email.substring(0, 2).toUpperCase(),
        avatarGradient: 'avatar-at',
        joinedAt: new Date().toISOString(),
      })),
    };
    setTeams(prev => [...prev, newTeam]);
    closeModal();
  };

  const handleEdit = (id: string, payload: EditTeamPayload) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...payload } : t));
    closeModal();
  };

  const handleEnter = (id: string) => {
    // Navigate to /dashboard — wire to your router as needed
    console.log('Entering team', id);
    window.location.href = '/dashboard';
  };

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const activeTeam = modal.teamId ? teams.find(t => t.id === modal.teamId) : undefined;

  const totalMembers = new Set(teams.flatMap(t => t.members.map(m => m.id))).size;
  const avgScore = teams.length ? Math.round(teams.reduce((s, t) => s + t.score, 0) / teams.length) : 0;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden" style={{ fontFamily: 'DM Sans, sans-serif' }}>

      {/* ── Background orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #60AFFF 0%, transparent 70%)', filter: 'blur(40px)', animation: 'floatOrb 8s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #9b7fe1 0%, transparent 70%)', filter: 'blur(50px)', animation: 'floatOrb 10s ease-in-out infinite reverse' }} />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #9CEDC1 0%, transparent 70%)', filter: 'blur(40px)', animation: 'floatOrb 12s ease-in-out infinite' }} />
        <div className="absolute top-2/3 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FF94AE 0%, transparent 70%)', filter: 'blur(30px)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-10">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #60AFFF, #9b7fe1)', boxShadow: '0 4px 14px rgba(96,175,255,0.45)' }}
            >
              <span className="text-white text-sm font-bold">✦</span>
            </div>
            <span className="font-bold text-grey-800 text-lg" style={{ letterSpacing: '-0.03em' }}>Orbitly</span>
          </div>

          {/* User avatar + profile trigger */}
          <button
            onClick={openProfile}
            className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-grey-150 bg-white/70 hover:bg-white transition-all backdrop-blur-sm hover:shadow-md group"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #60AFFF, #5961F9)', boxShadow: '0 2px 10px rgba(96,175,255,0.4)' }}
            >
              {CURRENT_USER.avatarInitials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-grey-700 leading-tight">{CURRENT_USER.name}</p>
              <p className="text-[10px] text-grey-400">{CURRENT_USER.role}</p>
            </div>
            <span className="text-grey-300 text-xs group-hover:text-grey-500 transition-colors">›</span>
          </button>
        </div>

        {/* ── Hero section ── */}
        <div className="mb-10">
          <h1
            className="text-grey-800 mb-2"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.035em', fontWeight: 800 }}
          >
            Tus equipos,{' '}
            <span
              className="relative inline-block"
              style={{ backgroundImage: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 50%, #9CEDC1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              en un lugar.
            </span>
          </h1>
          <p className="text-grey-400 text-base max-w-lg">
            Gestiona tus equipos, sigue el progreso y colabora sin fricción.
          </p>
        </div>

        {/* ── Stats bar ── */}
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          {[
            { label: 'Equipos activos', value: teams.length, color: '#60AFFF', glow: 'rgba(96,175,255,0.25)' },
            { label: 'Miembros únicos', value: totalMembers, color: '#9b7fe1', glow: 'rgba(155,127,225,0.25)' },
            { label: 'Score promedio', value: `${avgScore}%`, color: '#9CEDC1', glow: 'rgba(156,237,193,0.25)' },
          ].map(stat => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-grey-150 bg-white/80 backdrop-blur-sm"
              style={{ boxShadow: `0 4px 16px ${stat.glow}` }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
              <div>
                <p className="text-sm font-bold text-grey-800" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[10px] text-grey-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + actions ── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-300 text-sm">⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar equipos…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-grey-150 bg-white/80 text-sm text-grey-700 outline-none backdrop-blur-sm transition-all"
              onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,175,255,0.2)'}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
          </div>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 100%)',
              boxShadow: '0 4px 20px rgba(96,175,255,0.4)',
            }}
          >
            <span className="text-base leading-none">+</span>
            Crear equipo
          </button>
        </div>

        {/* ── Teams grid ── */}
        {filtered.length === 0 && search ? (
          <div className="text-center py-20">
            <p className="text-grey-400 text-sm">No se encontraron equipos para "<strong>{search}</strong>"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onEnter={handleEnter}
                onEdit={openEdit}
              />
            ))}
            {!search && <NewTeamCard onClick={openCreate} />}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {modal.mode === 'create' && (
        <CreateTeamModal onClose={closeModal} onCreate={handleCreate} />
      )}

      {modal.mode === 'edit' && activeTeam && (
        <EditTeamModal team={activeTeam} onClose={closeModal} onSave={handleEdit} />
      )}

      {modal.mode === 'profile' && (
        <UserProfileModal user={CURRENT_USER} onClose={closeModal} />
      )}

      {/* CSS for orb animation (fallback if Tailwind keyframes aren't loaded) */}
      <style>{`
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </div>
  );
};

export default TeamsHub;
