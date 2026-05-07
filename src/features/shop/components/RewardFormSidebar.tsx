import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Check, Loader2, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { SidebarSheet } from '@/components/ui/sidebar-sheet.tsx';
import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import { useTeam } from '@/context/TeamContext.tsx';
import {
  IconOrPhotoPicker,
  LUCIDE_ICON_PREFIX,
} from '@/features/shop/components/IconOrPhotoPicker.tsx';
import { useCreateReward } from '@/features/shop/hooks/useCreateReward.ts';
import { useUpdateReward } from '@/features/shop/hooks/useUpdateReward.ts';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';
import { storage } from '@/firebase.ts';

interface RewardFormSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Reward | null;
}

export function RewardFormSidebar({ isOpen, onClose, initialData }: RewardFormSidebarProps) {
  const { teamId: rawTeamId } = useTeam();
  const teamId = rawTeamId ?? '';
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('0');
  const [xp, setXp] = useState('0');
  const [type, setType] = useState<'team' | 'member'>('member');
  const [iconValue, setIconValue] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name);
        setDescription(initialData.description ?? '');
        setCost(String(initialData.cost));
        setXp(String(initialData.experienceGranted));
        setType(initialData.type === 'team' ? 'team' : 'member');
        setIconValue(initialData.iconURL ?? null);
        setPhotoPreview(
          initialData.iconURL && !initialData.iconURL.startsWith(LUCIDE_ICON_PREFIX)
            ? initialData.iconURL
            : null,
        );
      } else {
        setName('');
        setDescription('');
        setCost('0');
        setXp('0');
        setType('member');
        setIconValue(null);
        setPhotoPreview(null);
      }
      setPhotoFile(null);
      setIsUploading(false);
      setNameError(null);
    }
  }, [isOpen, initialData]);

  const handleFileSelected = (file: File | null) => {
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('El nombre es obligatorio');
      return;
    }
    setNameError(null);
    setIsUploading(true);

    try {
      let resolvedIconURL: string | null | undefined = iconValue;

      if (photoFile && teamId) {
        const rewardId = initialData?.id ?? crypto.randomUUID();
        const storageRef = ref(storage, `teams/${teamId}/rewards/${rewardId}/icon`);
        await uploadBytes(storageRef, photoFile, { contentType: photoFile.type });
        resolvedIconURL = await getDownloadURL(storageRef);
      }

      const costNum = Math.max(0, parseInt(cost, 10) || 0);
      const xpNum = Math.max(0, parseInt(xp, 10) || 0);

      if (initialData) {
        await updateReward.mutateAsync({
          teamId,
          rewardId: initialData.id,
          payload: {
            name: trimmedName,
            description: description.trim() || null,
            cost: costNum,
            experienceGranted: xpNum,
            iconURL: resolvedIconURL,
          },
        });
        toastSuccess('Recompensa actualizada', `"${trimmedName}" fue actualizada.`);
      } else {
        await createReward.mutateAsync({
          teamId,
          payload: {
            name: trimmedName,
            description: description.trim() || undefined,
            cost: costNum,
            experienceGranted: xpNum,
            type,
            iconURL: resolvedIconURL ?? undefined,
          },
        });
        toastSuccess('Recompensa creada', `"${trimmedName}" ya está en la tienda.`);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la recompensa';
      toastError('Error', msg);
    } finally {
      setIsUploading(false);
    }
  };

  const isPending = isUploading || createReward.isPending || updateReward.isPending;
  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';
  const accentGlow = 'rgba(96,175,255,0.3)';

  return (
    <SidebarSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      side="right"
      overlayClassName="z-[60]"
      contentClassName="z-[60] h-full w-full sm:w-[420px] bg-white dark:bg-gray-800 border-l border-grey-150 dark:border-gray-600 shadow-card-lg flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-grey-150 dark:border-gray-600">
        <h2 className="font-maxwell text-base font-bold text-grey-800 dark:text-grey-200 tracking-wide">
          {initialData ? 'Editar recompensa' : 'Nueva recompensa'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-700 dark:hover:text-grey-300 hover:bg-secondary dark:hover:bg-gray-700 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Icon / photo picker */}
        <IconOrPhotoPicker
          value={iconValue}
          onChange={setIconValue}
          onFileSelected={handleFileSelected}
          photoPreview={photoPreview}
        />

        {/* Name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-1.5 block">
            Nombre *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (nameError) setNameError(null);
            }}
            maxLength={120}
            placeholder="Ej: Café gratis, Día libre..."
            className={`w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 dark:text-grey-200 bg-white dark:bg-gray-700 outline-none transition-all font-body ${
              nameError ? 'border-red' : 'border-grey-150 dark:border-gray-600 focus:border-blue'
            }`}
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
          {nameError && <p className="mt-1 text-xs text-red">{nameError}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-1.5 block">
            Descripción
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="Descripción opcional..."
            className="w-full px-4 py-2.5 rounded-xl border border-grey-150 dark:border-gray-600 focus:border-blue text-sm text-grey-800 dark:text-grey-200 bg-white dark:bg-gray-700 outline-none transition-all font-body resize-none"
            onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
            onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
          />
        </div>

        {/* Type — only for create */}
        {!initialData && (
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-2 block">
              Tipo de recompensa
            </label>
            <div className="flex gap-2">
              {(['member', 'team'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    type === t
                      ? 'border-blue bg-blue/10 text-blue'
                      : 'border-grey-150 dark:border-gray-600 text-grey-400 dark:text-grey-500 hover:border-blue/30'
                  }`}
                >
                  {t === 'member' ? 'Miembro' : 'Equipo'}
                </button>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-grey-400 dark:text-grey-500">
              {type === 'member'
                ? 'Cualquier miembro puede comprarla con sus monedas de membresía.'
                : 'Solo el líder puede comprarla con las monedas del equipo. Otorga XP a todos.'}
            </p>
          </div>
        )}

        {/* Cost + XP row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-1.5 block">
              Costo (monedas)
            </label>
            <input
              type="number"
              min={0}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-grey-150 dark:border-gray-600 focus:border-blue text-sm text-grey-800 dark:text-grey-200 bg-white dark:bg-gray-700 outline-none transition-all font-body"
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500 mb-1.5 block">
              XP otorgada
            </label>
            <input
              type="number"
              min={0}
              value={xp}
              onChange={(e) => setXp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-grey-150 dark:border-gray-600 focus:border-blue text-sm text-grey-800 dark:text-grey-200 bg-white dark:bg-gray-700 outline-none transition-all font-body"
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 3px ${accentGlow}`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-grey-150 dark:border-gray-600 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold text-grey-500 dark:text-grey-400 border border-grey-200 dark:border-gray-600 hover:border-grey-300 dark:hover:border-gray-500 transition-all cursor-pointer"
        >
          Cancelar
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!name.trim() || isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: accent, boxShadow: `0 4px 16px ${accentGlow}` }}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : initialData ? (
            <Check size={14} />
          ) : (
            <Plus size={14} />
          )}
          {initialData ? 'Guardar cambios' : 'Crear recompensa'}
        </button>
      </div>
    </SidebarSheet>
  );
}
