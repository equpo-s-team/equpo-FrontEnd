import { AlertCircle, Check, Loader2, Send, Users, X } from 'lucide-react';
import { useState } from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useDirectInvitation } from '@/features/team/hooks/useDirectInvitation';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useTeams } from '@/features/team/hooks/useTeams';
import { useUserPreview } from '@/features/team/hooks/useUserPreview';
import { toastError, toastSuccess } from '@/lib/toast';

interface UidInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accent: string;
}

export function UidInvitationModal({ isOpen, onClose, accent }: UidInvitationModalProps) {
  const { teamId } = useTeam();
  const { data: teams = [] } = useTeams();
  const { data: members = [] } = useTeamMembers(teamId);
  const directInvitation = useDirectInvitation();

  const team = teams.find((t) => t.id === teamId);

  const [inviteUid, setInviteUid] = useState('');
  const [isInvitingByUid, setIsInvitingByUid] = useState(false);

  // User preview for UID invitation
  const {
    data: userPreview,
    isLoading: isUserPreviewLoading,
    error: userPreviewError,
  } = useUserPreview(inviteUid.trim() || undefined);

  // Check if user is already in team
  const isUserAlreadyInTeam =
    userPreview?.exists &&
    (members.some((m) => m.uid === userPreview.uid) || team?.leaderUid === userPreview.uid);

  const getInitials = (displayName: string | null, uid: string): string => {
    if (displayName) {
      return displayName
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return uid.slice(0, 2).toUpperCase();
  };

  const handleInvite = async () => {
    if (userPreview?.exists && userPreview.uid && !isUserAlreadyInTeam && teamId) {
      setIsInvitingByUid(true);
      try {
        await directInvitation.mutateAsync({
          teamId,
          userUid: userPreview.uid,
          role: 'member',
        });
        toastSuccess('Invitación enviada', `${userPreview.displayName} se ha unido al equipo`);
        setInviteUid('');
        onClose();
      } catch (error) {
        toastError(
          'Error',
          error instanceof Error ? error.message : 'No se pudo invitar al usuario',
        );
      } finally {
        setIsInvitingByUid(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-grey-100 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-100">
          <h2 className="text-lg font-bold text-grey-800 font-body">Invitar por UID</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-grey-400 hover:text-grey-600 hover:bg-grey-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Input */}
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-2 font-body">
              UID del usuario
            </label>
            <div className="relative">
              <input
                type="text"
                value={inviteUid}
                onChange={(e) => setInviteUid(e.target.value)}
                placeholder="Ingresa el UID del usuario"
                className="w-full px-3 py-2 text-sm border border-grey-200 rounded-lg bg-white text-grey-800 placeholder-grey-400 focus:outline-none focus:ring-2 focus:ring-blue focus:border-transparent"
                autoFocus
              />
              {isUserPreviewLoading && (
                <div className="absolute right-3 top-2.5">
                  <Loader2 size={14} className="animate-spin text-grey-300" />
                </div>
              )}
            </div>
          </div>

          {/* User Preview */}
          {inviteUid.trim() && (
            <div className="bg-grey-50 rounded-xl p-3 border border-grey-100">
              {isUserPreviewLoading ? (
                <div className="flex items-center gap-2 py-1">
                  <div className="w-6 h-6 rounded-full bg-grey-200 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 bg-grey-200 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ) : userPreviewError ? (
                <div className="flex items-center gap-2 py-1">
                  <AlertCircle size={14} className="text-red" />
                  <span className="text-xs text-red">Error al buscar usuario</span>
                </div>
              ) : userPreview ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                      <UserAvatar
                        src={userPreview.photoUrl}
                        alt={userPreview.displayName}
                        initials={getInitials(userPreview.displayName, userPreview.uid)}
                        className="w-full h-full"
                        fallbackClassName="text-white text-[8px]"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-grey-800 truncate">
                        {userPreview.displayName}
                      </p>
                      <p className="text-xs text-grey-400 truncate">{userPreview.uid}</p>
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

                  {/* Status Message */}
                  <div className="px-3 py-2 rounded-xl text-xs font-body">
                    {!userPreview.exists ? (
                      <div className="flex items-center gap-2 text-red">
                        <X size={14} className="flex-shrink-0" />
                        <span className="font-medium">Usuario no encontrado</span>
                      </div>
                    ) : isUserAlreadyInTeam ? (
                      <div className="flex items-center gap-2 text-blue">
                        <Users size={14} className="flex-shrink-0" />
                        <span className="font-medium">Ya está en el equipo</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green">
                        <Check size={14} className="flex-shrink-0" />
                        <span className="font-medium">Listo para invitar</span>
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
            disabled={!userPreview?.exists || isUserAlreadyInTeam || isInvitingByUid}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: accent }}
          >
            {isInvitingByUid ? (
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
