import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import {
  AlertTriangle,
  Camera,
  Check,
  Crown,
  Loader2,
  Shield,
  Trash2,
  UserMinus,
  UserPlus,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { AppTooltip } from '@/components/ui/AppTooltip';
import { RoleSelect } from '@/components/ui/RoleSelect';
import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import { useAddTeamMember } from '@/features/team/hooks/useAddTeamMember';
import { useDeleteTeam } from '@/features/team/hooks/useDeleteTeam';
import { useRemoveTeamMember } from '@/features/team/hooks/useRemoveTeamMember';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useTeams } from '@/features/team/hooks/useTeams';
import { useUpdateMemberRole } from '@/features/team/hooks/useUpdateMemberRole';
import { useUpdateTeam } from '@/features/team/hooks/useUpdateTeam';
import type { TeamMember } from '@/features/team/types/teamSchemas';
import { storage } from '@/firebase';
import { toastError, toastSuccess } from '@/lib/toast';

// ── Color helpers ──────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  leader: { label: 'Líder', color: '#60AFFF', bg: 'rgba(96,175,255,0.12)' },
  collaborator: { label: 'Colaborador', color: '#9b7fe1', bg: 'rgba(155,127,225,0.12)' },
  member: { label: 'Miembro', color: '#908E88', bg: 'rgba(144,142,136,0.12)' },
  spectator: { label: 'Espectador', color: '#B0ADA7', bg: 'rgba(176,173,167,0.12)' },
};

function getInitials(name: string | null, uid: string): string {
  if (!name) return uid.slice(0, 2).toUpperCase();
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #60AFFF, #5961F9)',
  'linear-gradient(135deg, #9CEDC1, #86F0FD)',
  'linear-gradient(135deg, #F65A70, #FF94AE)',
  'linear-gradient(135deg, #9b7fe1, #5961F9)',
  'linear-gradient(135deg, #FF94AE, #FCE98D)',
  'linear-gradient(135deg, #86F0FD, #60AFFF)',
];

function avatarGradient(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) | 0;
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

// ── Confirmation Dialog ────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  teamName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmDialog({ teamName, onConfirm, onCancel, isDeleting }: ConfirmDialogProps) {
  const [typed, setTyped] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-grey-900/50 backdrop-blur-sm"
        onClick={onCancel}
        role="presentation"
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-grey-150">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(246,90,112,0.12)' }}
          >
            <AlertTriangle size={20} className="text-red" style={{ color: '#F65A70' }} />
          </div>
          <div>
            <h3 className="font-bold text-grey-800 font-body">¿Eliminar equipo?</h3>
            <p className="text-xs text-grey-400">Esta acción es permanente e irreversible.</p>
          </div>
        </div>

        <p className="text-sm text-grey-600 mb-4 font-body">
          Se eliminarán todas las tareas, grupos, archivos y miembros del equipo. Escribe{' '}
          <span className="font-bold text-grey-800">{teamName}</span> para confirmar.
        </p>

        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={teamName}
          className="w-full px-4 py-2.5 rounded-xl border border-grey-200 text-sm text-grey-800 outline-none mb-4 font-body"
          onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(246,90,112,0.2)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
        />

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-grey-200 text-sm font-medium text-grey-500 hover:bg-grey-50 transition-colors font-body"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={typed !== teamName || isDeleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-body"
            style={{
              background: 'linear-gradient(135deg, #F65A70, #FF94AE)',
              boxShadow: typed === teamName ? '0 4px 16px rgba(246,90,112,0.4)' : 'none',
            }}
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Eliminar equipo
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TeamSettings() {
  const { teamId } = useTeam();
  const { user } = useAuth();
  const { data: teams = [] } = useTeams();
  const { data: members = [], isLoading: membersLoading } = useTeamMembers(teamId);

  const updateTeam = useUpdateTeam();
  const addMember = useAddTeamMember();
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveTeamMember();
  const deleteTeam = useDeleteTeam();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive current team and user's role ──────────────────────────────────────
  const team = teams.find((t) => t.id === teamId);
  const currentUid = user?.uid ?? '';

  const myRole: string | null = (() => {
    if (!team || !currentUid) return null;
    if (team.leaderUid === currentUid) return 'leader';
    return team.members.find((m) => m.userUid === currentUid)?.role ?? null;
  })();

  const isLeader = myRole === 'leader';
  const isCollaborator = myRole === 'collaborator';
  const canEdit = isLeader || isCollaborator;

  // Local form state ─────────────────────────────────────────────────────────
  const [name, setName] = useState(team?.name ?? '');
  const [description, setDescription] = useState(team?.description ?? '');
  const [photoPreview, setPhotoPreview] = useState<string | null>(team?.photoUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Invite state ─────────────────────────────────────────────────────────────
  const [inviteUid, setInviteUid] = useState('');
  const [inviteRole, setInviteRole] = useState<'collaborator' | 'member' | 'spectator'>('member');

  // Delete dialog ────────────────────────────────────────────────────────────
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    setName(team?.name ?? '');
    setDescription(team?.description ?? '');
    setPhotoPreview(team?.photoUrl ?? null);
    setUploadError(null);
    setInviteUid('');
    setInviteRole('member');
    setShowDeleteDialog(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [teamId, team?.id, team?.name, team?.description, team?.photoUrl]);

  if (!team || !teamId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-grey-400 text-sm font-body">Selecciona un equipo para continuar.</p>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: 'rgba(176,173,167,0.15)' }}
        >
          <Shield size={28} className="text-grey-400" />
        </div>
        <h2 className="text-grey-700 font-bold text-lg font-body">Acceso restringido</h2>
        <p className="text-grey-400 text-sm text-center max-w-xs font-body">
          Solo el líder y los colaboradores del equipo pueden acceder a los ajustes.
        </p>
      </div>
    );
  }

  // ── Photo upload ────────────────────────────────────────────────────────────
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Solo se permiten archivos de imagen.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const storageRef = ref(storage, `teams/${teamId}/profile`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const downloadUrl = await getDownloadURL(storageRef);

      setPhotoPreview(downloadUrl);

      // Persist the URL to the backend
      await updateTeam.mutateAsync({
        teamId,
        payload: { photoUrl: downloadUrl },
      });
    } catch {
      setUploadError('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Save info ───────────────────────────────────────────────────────────────
  const handleSave = () => {
    const payload: Record<string, string | null> = {};
    if (name.trim() !== team.name) payload.name = name.trim();
    if (description.trim() !== (team.description ?? ''))
      payload.description = description.trim() || null;
    if (!Object.keys(payload).length) return;

    updateTeam.mutate(
      { teamId, payload },
      {
        onSuccess: () =>
          toastSuccess('Equipo actualizado', 'Los cambios se guardaron correctamente.'),
        onError: (err) =>
          toastError('Error al guardar', err instanceof Error ? err.message : 'Intenta de nuevo.'),
      },
    );
  };

  // ── Invite ─────────────────────────────────────────────────────────────────
  const handleInvite = () => {
    const uid = inviteUid.trim();
    if (!uid) return;

    addMember.mutate(
      { teamId, payload: { userUid: uid, role: inviteRole } },
      {
        onSuccess: () => {
          setInviteUid('');
          toastSuccess(
            'Usuario invitado',
            `El usuario fue añadido al equipo como ${ROLE_CONFIG[inviteRole]?.label ?? inviteRole}.`,
          );
        },
        onError: (err) =>
          toastError(
            'Error al invitar',
            err instanceof Error ? err.message : 'Verifica el UID e intenta de nuevo.',
          ),
      },
    );
  };

  // ── Kick ───────────────────────────────────────────────────────────────────
  const handleKick = (member: TeamMember) => {
    removeMember.mutate(
      { teamId, userUid: member.uid },
      {
        onSuccess: () =>
          toastSuccess(
            'Miembro eliminado',
            `${member.displayName ?? member.uid} fue removido del equipo.`,
          ),
        onError: (err) =>
          toastError('Error al eliminar', err instanceof Error ? err.message : 'Intenta de nuevo.'),
      },
    );
  };

  const canKick = (member: TeamMember): boolean => {
    if (member.role === 'leader') return false;
    if (member.uid === currentUid) return false;
    if (isLeader) return true;
    if (isCollaborator && member.role === 'collaborator') return false;
    return isCollaborator;
  };

  // ── Delete team ─────────────────────────────────────────────────────────────
  const handleDeleteTeam = () => {
    deleteTeam.mutate(teamId, {
      onSuccess: () =>
        toastSuccess('Equipo eliminado', 'El equipo y todos sus datos fueron eliminados.'),
      onError: (err) =>
        toastError(
          'Error al eliminar el equipo',
          err instanceof Error ? err.message : 'Intenta de nuevo.',
        ),
    });
  };

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';
  const accentGlow = 'rgba(96,175,255,0.3)';

  return (
    <div className="relative flex flex-col h-[100dvh] overflow-hidden bg-white font-body text-grey-800">
      {/* Background ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #9b7fe1 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, #60AFFF 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Header */}
      <AppHeader title="Ajustes del Equipo" subtitle={team.name} variant="orange" />

      {/* Scrollable body */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-6 sm:px-8">
        {/* ── TEAM INFO CARD ─────────────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-grey-100 bg-white p-5"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-4">
            Información del equipo
          </p>

          {/* Photo upload */}
          <div className="flex items-center gap-5 mb-5">
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-bold shadow-md"
                style={{ background: photoPreview ? undefined : accent }}
              >
                <TeamAvatar
                  src={photoPreview}
                  name={team.name}
                  className="w-full h-full rounded-2xl"
                  fallbackClassName="w-full h-full rounded-2xl text-white text-2xl"
                  fallbackStyle={{ background: accent }}
                  loading="eager"
                />
              </div>
              <AppTooltip content="Cambiar foto del equipo">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
                  style={{ background: accent, boxShadow: `0 3px 10px ${accentGlow}` }}
                >
                  {isUploading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Camera size={13} />
                  )}
                </button>
              </AppTooltip>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handlePhotoChange(e)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-grey-700 truncate">{team.name}</p>
              <p className="text-xs text-grey-400 mt-0.5">
                {isUploading ? 'Subiendo imagen…' : 'JPG, PNG, GIF — máx. 5 MB'}
              </p>
              {uploadError && (
                <p className="text-xs text-red mt-1" style={{ color: '#F65A70' }}>
                  {uploadError}
                </p>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-1.5 block">
              Nombre del equipo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-grey-150 text-sm text-grey-800 outline-none transition-all"
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-1.5 block">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-grey-150 text-sm text-grey-800 outline-none transition-all resize-none"
              placeholder="¿De qué trata este equipo?"
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={updateTeam.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{ background: accent, boxShadow: `0 4px 16px ${accentGlow}` }}
          >
            {updateTeam.isPending && <Loader2 size={14} className="animate-spin" />}
            {updateTeam.isSuccess && <Check size={14} />}
            Guardar cambios
          </button>
        </section>

        {/* ── MEMBERS CARD ───────────────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-grey-100 bg-white p-5"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-4">
            Miembros · {members.length}
          </p>

          {membersLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin text-grey-300" />
            </div>
          ) : (
            <div className="space-y-2 mb-5">
              {members.map((member) => {
                const roleCfg = ROLE_CONFIG[member.role] ?? ROLE_CONFIG.member;
                const grad = avatarGradient(member.uid);
                const isCurrentUser = member.uid === currentUid;

                return (
                  <div
                    key={member.uid}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-grey-50 border border-grey-100 hover:bg-grey-100/60 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      <UserAvatar
                        src={member.photoUrl}
                        alt={member.displayName ?? member.uid}
                        initials={getInitials(member.displayName, member.uid)}
                        className="w-full h-full"
                        fallbackClassName="text-white text-xs"
                        fallbackStyle={{ background: grad }}
                      />
                    </div>

                    {/* Name + role */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-grey-800 truncate">
                        {member.displayName ?? member.uid}
                        {isCurrentUser && (
                          <span className="ml-1.5 text-xs text-grey-400 font-normal">(tú)</span>
                        )}
                      </p>
                      <span
                        className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5"
                        style={{ background: roleCfg.bg, color: roleCfg.color }}
                      >
                        {roleCfg.label}
                      </span>
                    </div>

                    {/* Role change — leader only */}
                    {isLeader && member.role !== 'leader' && !isCurrentUser && (
                      <RoleSelect
                        value={member.role}
                        onChange={(role) =>
                          updateRole.mutate(
                            {
                              teamId,
                              userUid: member.uid,
                              payload: { role: role as 'collaborator' | 'member' | 'spectator' },
                            },
                            {
                              onSuccess: () =>
                                toastSuccess(
                                  'Rol actualizado',
                                  `${member.displayName ?? member.uid} ahora es ${ROLE_CONFIG[role]?.label ?? role}.`,
                                ),
                              onError: (err) =>
                                toastError(
                                  'Error al cambiar rol',
                                  err instanceof Error ? err.message : 'Intenta de nuevo.',
                                ),
                            },
                          )
                        }
                        roles={[
                          {
                            value: 'collaborator',
                            label: 'Colaborador',
                            color: ROLE_CONFIG.collaborator.color,
                            bg: ROLE_CONFIG.collaborator.bg,
                          },
                          {
                            value: 'member',
                            label: 'Miembro',
                            color: ROLE_CONFIG.member.color,
                            bg: ROLE_CONFIG.member.bg,
                          },
                          {
                            value: 'spectator',
                            label: 'Espectador',
                            color: ROLE_CONFIG.spectator.color,
                            bg: ROLE_CONFIG.spectator.bg,
                          },
                        ]}
                      />
                    )}

                    {/* Kick button */}
                    {canKick(member) && (
                      <AppTooltip content="Eliminar del equipo" side="top">
                        <button
                          onClick={() => handleKick(member)}
                          disabled={removeMember.isPending}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-all text-grey-400 hover:bg-red/10 hover:text-red disabled:opacity-40"
                        >
                          <UserMinus size={15} />
                        </button>
                      </AppTooltip>
                    )}

                    {/* Leader crown icon */}
                    {member.role === 'leader' && (
                      <AppTooltip content="Líder del equipo" side="top">
                        <span className="shrink-0 flex items-center">
                          <Crown size={15} className="text-blue" />
                        </span>
                      </AppTooltip>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Invite section */}
          <div className="border-t border-grey-100 pt-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-2">
              Invitar usuario
            </p>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                value={inviteUid}
                onChange={(e) => setInviteUid(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInvite();
                  }
                }}
                placeholder="UID del usuario"
                className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-grey-150 text-sm text-grey-800 outline-none transition-all"
                onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
                onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
              />
              <RoleSelect
                value={inviteRole}
                onChange={(v) => setInviteRole(v as 'collaborator' | 'member' | 'spectator')}
                roles={[
                  {
                    value: 'collaborator',
                    label: 'Colaborador',
                    color: ROLE_CONFIG.collaborator.color,
                    bg: ROLE_CONFIG.collaborator.bg,
                  },
                  {
                    value: 'member',
                    label: 'Miembro',
                    color: ROLE_CONFIG.member.color,
                    bg: ROLE_CONFIG.member.bg,
                  },
                  {
                    value: 'spectator',
                    label: 'Espectador',
                    color: ROLE_CONFIG.spectator.color,
                    bg: ROLE_CONFIG.spectator.bg,
                  },
                ]}
              />
              <button
                onClick={handleInvite}
                disabled={!inviteUid.trim() || addMember.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 shrink-0"
                style={{ background: accent }}
              >
                {addMember.isPending ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <UserPlus size={13} />
                )}
                Invitar
              </button>
            </div>
          </div>
        </section>

        {/* ── DANGER ZONE ────────────────────────────────────────────────── */}
        {isLeader && (
          <section
            className="rounded-2xl border p-5"
            style={{
              borderColor: 'rgba(246,90,112,0.2)',
              background: 'rgba(246,90,112,0.03)',
              boxShadow: '0 4px 20px rgba(246,90,112,0.06)',
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: '#F65A70' }}
            >
              Zona de peligro
            </p>
            <p className="text-xs text-grey-400 mb-4">
              Eliminar el equipo borrará permanentemente todos los datos, tareas, grupos y archivos.
            </p>

            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #F65A70, #FFAF93)',
                boxShadow: '0 4px 16px rgba(246,90,112,0.35)',
              }}
            >
              <Trash2 size={14} />
              Eliminar equipo
            </button>
          </section>
        )}

        {/* bottom padding for mobile nav */}
        <div className="h-4 lg:hidden" />
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          teamName={team.name}
          onConfirm={handleDeleteTeam}
          onCancel={() => setShowDeleteDialog(false)}
          isDeleting={deleteTeam.isPending}
        />
      )}
    </div>
  );
}
