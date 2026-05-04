import { AlertCircle, Check, Loader2, Mail, Send, Users, X } from 'lucide-react';
import { useState } from 'react';

import { toastError, toastSuccess } from '@/components/ui/toast';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useDirectInvitation } from '@/features/team/hooks/useDirectInvitation';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useTeams } from '@/features/team/hooks/useTeams';
import { useUserPreview } from '@/features/team/hooks/useUserPreview';

interface UidInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UidInvitationModal({ isOpen, onClose, accent }: UidInvitationModalProps) {
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
  const { data: members = [] } = useTeamMembers(teamId);
  const directInvitation = useDirectInvitation();

  const team = teams.find((t) => t.id === teamId);

  const [inviteInput, setInviteInput] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const trimmed = inviteInput.trim();
  const isEmail = EMAIL_RE.test(trimmed);
  const isUid = !isEmail && trimmed.length >= 20;

  // Only run the UID preview for UID-style inputs
  const {
    data: userPreview,
    isLoading: isUserPreviewLoading,
    error: userPreviewError,
  } = useUserPreview(isUid ? trimmed : undefined);

  const isUserAlreadyInTeam =
    userPreview?.exists &&
    (members.some((m) => m.uid === userPreview.uid) || team?.leaderUid === userPreview.uid);

  const canInviteByUid = isUid && userPreview?.exists && !isUserAlreadyInTeam;
  const canInviteByEmail = isEmail;
  const canInvite = canInviteByUid || canInviteByEmail;

  const handleInvite = async () => {
    if (!teamId || !canInvite) return;
    setIsInviting(true);
    try {
      await directInvitation.mutateAsync({
        teamId,
        ...(isEmail ? { email: trimmed } : { userUid: userPreview!.uid }),
        role: 'member',
      });
      const label = isEmail ? trimmed : (userPreview?.displayName ?? trimmed);
      toastSuccess('Invitación enviada', `${label} se ha unido al equipo`);
      setInviteInput('');
      onClose();
    } catch (error) {
      toastError(
        'Error',
        error instanceof Error ? error.message : 'No se pudo invitar al usuario',
      );
    } finally {
      setIsInviting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-grey-100 dark:border-gray-700 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-grey-800 dark:text-gray-100 font-body">
            Invitar usuario
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300 hover:bg-grey-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-grey-700 dark:text-gray-300 mb-2 font-body">
              UID o correo electrónico
            </label>
            <div className="relative">
              <input
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void handleInvite();
                  }
                }}
                placeholder="UID del usuario o correo@ejemplo.com"
                className="w-full px-3 py-2 text-sm border border-grey-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-grey-800 dark:text-gray-100 placeholder-grey-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                autoFocus
              />
              {isUserPreviewLoading && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 size={14} className="animate-spin text-grey-300 dark:text-grey-600" />
                </div>
              )}
            </div>
          </div>

          {/* Preview area */}
          {trimmed && (
            <div className="bg-grey-50 dark:bg-gray-700 rounded-xl p-3 border border-grey-100 dark:border-gray-600">
              {/* Email path — no preview needed, just confirm it looks valid */}
              {isEmail ? (
                <div className="flex items-center gap-2 py-1">
                  <Mail size={14} className="text-blue flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-grey-800 dark:text-gray-100 truncate">
                      {trimmed}
                    </p>
                    <p className="text-xs text-grey-400 dark:text-grey-500">
                      Se buscará la cuenta por correo electrónico
                    </p>
                  </div>
                  <Check size={14} className="text-green flex-shrink-0" />
                </div>
              ) : /* UID path — show user preview */ isUserPreviewLoading ? (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-grey-200 dark:bg-gray-600 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 bg-grey-200 dark:bg-gray-600 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ) : userPreviewError ? (
                <div className="flex items-center gap-2 py-1">
                  <AlertCircle size={14} className="text-red" />
                  <span className="text-xs text-red dark:text-red-400">
                    Error al buscar usuario
                  </span>
                </div>
              ) : userPreview ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <UserAvatar
                        src={userPreview.photoUrl}
                        alt={userPreview.displayName}
                        className="w-full h-full"
                        fallbackClassName="text-white text-[8px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-grey-800 dark:text-gray-100 truncate">
                        {userPreview.displayName}
                      </p>
                      <p className="text-xs text-grey-400 dark:text-grey-500 truncate">
                        {userPreview.uid}
                      </p>
                    </div>
                    {userPreview.exists ? (
                      isUserAlreadyInTeam ? (
                        <Users size={14} className="text-blue flex-shrink-0" />
                      ) : (
                        <Check size={14} className="text-green flex-shrink-0" />
                      )
                    ) : (
                      <X size={14} className="text-red flex-shrink-0" />
                    )}
                  </div>

                  <div className="px-3 py-2 rounded-xl text-xs font-body">
                    {!userPreview.exists ? (
                      <div className="flex items-center gap-2 text-red">
                        <X size={14} className="flex-shrink-0" />
                        <span className="font-medium dark:text-gray-100">
                          Usuario no encontrado
                        </span>
                      </div>
                    ) : isUserAlreadyInTeam ? (
                      <div className="flex items-center gap-2 text-blue">
                        <Users size={14} className="flex-shrink-0" />
                        <span className="font-medium dark:text-gray-100">Ya está en el equipo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green">
                        <Check size={14} className="flex-shrink-0" />
                        <span className="font-medium dark:text-gray-100">Listo para invitar</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => {
              void handleInvite();
            }}
            disabled={!canInvite || isUserAlreadyInTeam || isInviting}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: accent }}
          >
            {isInviting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isUserAlreadyInTeam ? (
              <Users size={14} />
            ) : (
              <Send size={14} />
            )}
            {isUserAlreadyInTeam ? 'Ya está en el equipo' : 'Invitar usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}
