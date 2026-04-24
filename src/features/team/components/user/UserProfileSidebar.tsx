import { Camera, Loader2,Clipboard } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { AppTooltip } from '@/components/ui/AppTooltip.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { toastSuccess } from '@/components/ui/toast';
import { type UserProfileSaveInput } from '@/features/team/types';

import { type UserProfile } from './UserProfileCard.tsx';

interface UserProfileSidebarProps {
  user: UserProfile;
  onClose: () => void;
  onSave: (updated: UserProfileSaveInput) => Promise<void>;
}

export const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [photoURL, setPhotoURL] = useState(user.photoURL || '');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ displayName?: string; form?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const accent = '#60AFFF';
  const accentGlow = 'rgba(96,175,255,0.4)';

  const photoPreview = photoFile ? URL.createObjectURL(photoFile) : photoURL;
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    if (isSaving) return;
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleCopyUid = async () => {
    try {
      await navigator.clipboard.writeText(user.uid);
      setIsCopied(true);
      toastSuccess('¡UID copiado!', 'El UID ha sido copiado al portapapeles');

      // Resetear el estado después de 2 segundos
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = user.uid;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      setIsCopied(true);
      toastSuccess('¡UID copiado!', 'El UID ha sido copiado al portapapeles');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0] ?? null;
    setPhotoFile(selectedFile);
    setErrors((p) => ({ ...p, form: undefined }));

    if (selectedFile) {
      setPhotoURL(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    const errs: typeof errors = {};
    if (!displayName.trim()) errs.displayName = 'El nombre es obligatorio';
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsSaving(true);
    setIsUploading(true);

    try {
      await onSave({
        displayName: displayName.trim(),
        photoURL: photoFile ? null : photoURL.trim() || null,
        photoFile,
      });
      handleClose();
    } catch {
      setErrors({ form: 'No se pudo guardar el perfil. Intenta nuevamente.' });
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  };

  const xpPercent = Math.min(100, Math.round((user.experience / user.experienceToNextLevel) * 100));

  return (
    <div className="fixed inset-0 z-50 flex h-full">
      <button
        type="button"
        aria-label="Cerrar panel de perfil"
        className={`absolute inset-0 bg-grey-900/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative h-full w-full sm:w-1/3 min-w-[320px] max-w-[460px] flex flex-col p-[1px] shadow-2xl transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(135deg,#60AFFF,#9b7fe1)' }}
      >
        <div className="h-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 flex flex-col gap-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-lg font-bold text-grey-800 dark:text-gray-300"
                style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
              >
                Configuración de perfil
              </h2>
              <p className="text-xs text-grey-400 dark:text-grey-500 mt-0.5">
                Personaliza tu identidad en Equpo
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-grey-100 dark:bg-gray-700 hover:bg-grey-200 dark:hover:bg-gray-600 flex items-center justify-center text-grey-500 dark:text-grey-400 transition-colors text-sm shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Avatar preview */}
          <div className="flex justify-center items-end shrink-0">
            <div
              className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold shadow-md"
              style={{ background: photoPreview ? undefined : accent }}
            >
              <UserAvatar
                src={photoPreview}
                alt={displayName || 'User'}
                className="w-full h-full"
                fallbackClassName="w-full h-full text-white text-2xl"

                loading="eager"
              />
            </div>
            <AppTooltip content="Cambiar foto de perfil">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className=" absolute right-48 w-7 h-7 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
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
              onChange={handlePhotoChange}
            />
          </div>

          {/* Level & XP — read only */}
          <div className="rounded-xl p-4 border border-grey-150 dark:border-gray-700 bg-secondary dark:bg-gray-700">
            <p className="text-xs font-semibold text-grey-400 dark:text-grey-500 uppercase tracking-wider mb-3">
              Progreso
            </p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#9b7fe1,#5961F9)' }}
                >
                  {user.level}
                </div>
                <div>
                  <p className="text-xs font-bold text-grey-700 dark:text-gray-300">
                    Nivel {user.level}
                  </p>
                  <p className="text-xs text-grey-400 dark:text-grey-500">
                    {user.experience.toLocaleString()} /{' '}
                    {user.experienceToNextLevel.toLocaleString()} XP
                  </p>
                </div>
              </div>
              <span
                className="text-xs font-bold px-2 py-1 rounded-lg"
                style={{
                  background: 'rgba(155,127,225,0.1)',
                  color: '#9b7fe1',
                  border: '1px solid rgba(155,127,225,0.2)',
                }}
              >
                {xpPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-grey-150 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${xpPercent}%`,
                  background: 'linear-gradient(90deg, #60AFFF 0%, #9b7fe1 100%)',
                  boxShadow: '0 0 8px rgba(155,127,225,0.4)',
                }}
              />
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="text-xs font-semibold text-grey-500 dark:text-grey-400 uppercase tracking-wider mb-1.5 block">
              Nombre visible *
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                setErrors((p) => ({ ...p, displayName: undefined, form: undefined }));
              }}
              placeholder="Ej: Ana García"
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 dark:text-gray-300 dark:bg-gray-700 outline-none transition-all"
              style={{
                borderColor: errors.displayName ? '#F65A70' : 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,175,255,0.25)')}
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
            {errors.displayName && (
              <p className="text-xs text-[#F65A70] mt-1">{errors.displayName}</p>
            )}
          </div>

          {/* UID — read only */}
          <div>
            <label className="text-xs font-semibold text-grey-500 dark:text-grey-700 uppercase tracking-wider mb-1.5 block">
              UID
            </label>
            <div className="flex gap-2">
              <div
                className={`w-full bg-secondary dark:bg-gray-700 px-4 py-2.5 rounded-xl border border-tertiary text-sm text-grey-400 dark:text-grey-500 font-mono font-sm select-all break-all transition-all duration-200 ${
                  isCopied
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'text-grey-400'
                }`}
              >
                {user.uid}
              </div>
              <button
                onClick={handleCopyUid}
                className={`px-3 py-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center ${
                  isCopied
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white border-grey-200 text-grey-600 hover:border-grey-300 hover:bg-grey-50'
                }`}
                title={isCopied ? '¡Copiado!' : 'Copiar UID'}
              >
                <Clipboard
                  size={16}
                  className={isCopied ? 'text-white' : 'text-grey-500'}
                />
              </button>
            </div>
            <p className="text-xs text-grey-400 dark:text-grey-500 mt-1">
              {isCopied ? '¡UID copiado al portapapeles!' : 'El UID no se puede modificar'}
            </p>
          </div>

          <div className="flex-grow" />

          {errors.form && <p className="text-xs text-[#F65A70] -mt-2">{errors.form}</p>}

          {/* Footer */}
          <div className="flex gap-3 pt-4 pb-2 mt-auto">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl border border-grey-200 dark:border-gray-700 text-sm font-medium text-grey-500 dark:text-grey-400 hover:bg-grey-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                void handleSave();
              }}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg,#60AFFF,#9b7fe1)',
                boxShadow: '0 6px 20px rgba(96,175,255,0.35)',
              }}
            >
              {isSaving ? 'Guardando...' : 'Guardar cambios ✦'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
