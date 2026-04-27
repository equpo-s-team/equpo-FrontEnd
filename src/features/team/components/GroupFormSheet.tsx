import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Camera, Loader2, Plus, Users, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { useCreateGroup } from '@/features/team/hooks/useCreateGroup';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import type { TeamMember } from '@/features/team/types/teamSchemas';
import { storage } from '@/firebase';
import { toastError, toastSuccess } from '@/lib/toast';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #60AFFF, #5961F9)',
  'linear-gradient(135deg, #9CEDC1, #86F0FD)',
  'linear-gradient(135deg, #F65A70, #FF94AE)',
  'linear-gradient(135deg, #9b7fe1, #5961F9)',
  'linear-gradient(135deg, #FF94AE, #FCE98D)',
  'linear-gradient(135deg, #86F0FD, #60AFFF)',
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function memberGradient(uid: string): string {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) | 0;
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
}

interface GroupFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GroupFormSheet({ isOpen, onClose }: GroupFormSheetProps) {
  const { teamId: rawTeamId } = useTeam();
  const teamId = rawTeamId ?? '';
  const { data: members = [] } = useTeamMembers(teamId);
  const createGroup = useCreateGroup();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [selectedUids, setSelectedUids] = useState<Set<string>>(new Set());
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Filter out spectators — they cannot be added to work groups
  const assignableMembers = members.filter((m) => m.role !== 'spectator');

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSelectedUids(new Set());
      setPhotoPreview(null);
      setPhotoFile(null);
      setIsUploading(false);
      setNameError(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [isOpen]);

  const toggleMember = (uid: string) => {
    setSelectedUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) {
        next.delete(uid);
      } else {
        next.add(uid);
      }
      return next;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('El nombre del grupo es obligatorio');
      return;
    }
    if (trimmedName.length > 100) {
      setNameError('Máximo 100 caracteres');
      return;
    }
    setNameError(null);

    setIsUploading(true);
    try {
      let photoUrl: string | undefined;

      // Upload photo to Firebase Storage if provided
      if (photoFile && teamId) {
        const tempId = crypto.randomUUID();
        const storageRef = ref(storage, `teams/${teamId}/groups/${tempId}/profile`);
        await uploadBytes(storageRef, photoFile, { contentType: photoFile.type });
        photoUrl = await getDownloadURL(storageRef);
      }

      await createGroup.mutateAsync({
        teamId,
        payload: {
          name: trimmedName,
          memberUids: Array.from(selectedUids),
          ...(photoUrl ? { photoUrl } : {}),
        },
      });

      toastSuccess('Grupo creado', `El grupo "${trimmedName}" fue creado correctamente.`);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear el grupo';
      toastError('Error al crear grupo', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';
  const accentGlow = 'rgba(96,175,255,0.3)';

  return (
    <>
      {/* Backdrop */}
      <div
        role="button"
        aria-label="Cerrar panel"
        tabIndex={-1}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        className={`
          fixed inset-0 z-[60] bg-grey-900/40 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Panel */}
      <aside
        className={`
          fixed top-0 right-0 z-[60] h-full w-full sm:w-[420px]
          bg-white border-l border-grey-150
          shadow-card-lg flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-150">
          <h2 className="font-maxwell text-base font-bold text-grey-800 tracking-wide">
            Nuevo Grupo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-grey-400 hover:text-grey-700 hover:bg-secondary transition-all duration-150 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Group Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-bold shadow-md"
                style={{ background: photoPreview ? undefined : accent }}
              >
                <TeamAvatar
                  src={photoPreview}
                  name={name || 'G'}
                  className="w-full h-full rounded-2xl"
                  fallbackClassName="w-full h-full rounded-2xl text-white text-2xl"
                  fallbackStyle={{ background: accent }}
                  loading="eager"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-60 cursor-pointer"
                style={{ background: accent, boxShadow: `0 3px 10px ${accentGlow}` }}
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <p className="text-xs text-grey-400">JPG, PNG, GIF — máx. 5 MB</p>
          </div>

          {/* Group Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-1.5 block">
              Nombre del grupo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              maxLength={100}
              placeholder="Ej: Backend, Diseño, Marketing..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all font-body ${
                nameError
                  ? 'border-red'
                  : 'border-grey-150 focus:border-blue'
              }`}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
            {nameError && <p className="mt-1 text-xs text-red">{nameError}</p>}
          </div>

          {/* Members Selection */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 mb-2 block">
              <Users size={12} className="inline mr-1 -mt-0.5" />
              Miembros · {selectedUids.size} seleccionados
            </label>
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
              {assignableMembers.map((member: TeamMember) => {
                const isSelected = selectedUids.has(member.uid);
                const grad = memberGradient(member.uid);

                return (
                  <button
                    key={member.uid}
                    type="button"
                    onClick={() => toggleMember(member.uid)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue/40 bg-blue/5'
                        : 'border-grey-100 bg-grey-50 hover:bg-grey-100/60'
                    }`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-blue bg-blue'
                          : 'border-grey-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path
                            d="M1 3.5L3.5 6L9 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      <UserAvatar
                        src={member.photoUrl}
                        alt={member.displayName ?? member.uid}
                        initials={getInitials(member.displayName ?? member.uid)}
                        className="w-full h-full"
                        fallbackClassName="text-white text-xs"
                        fallbackStyle={{ background: grad }}
                      />
                    </div>

                    {/* Name */}
                    <span className="text-sm font-semibold text-grey-800 truncate">
                      {member.displayName ?? member.uid}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-grey-150 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-grey-500 border border-grey-200 hover:border-grey-300 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={!name.trim() || isUploading || createGroup.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: accent, boxShadow: `0 4px 16px ${accentGlow}` }}
          >
            {isUploading || createGroup.isPending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Plus size={14} />
            )}
            Crear grupo
          </button>
        </div>
      </aside>
    </>
  );
}
