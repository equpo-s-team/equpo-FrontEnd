import React, { useEffect, useState } from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import {type UserProfileSaveInput} from "@/features/team/types";

import { type UserProfile } from "./UserProfileCard.tsx";

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

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    if (isSaving) return;
    setIsVisible(false);
    setTimeout(onClose, 300);
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
    }
  };

  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const xpPercent = Math.min(
    100,
    Math.round((user.experience / user.experienceToNextLevel) * 100),
  );

  return (
    <div className="fixed inset-0 z-50 flex h-full">
      <button
        type="button"
        aria-label="Cerrar panel de perfil"
        className={`absolute inset-0 bg-grey-900/20 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
      />

      {/* Panel */}
      <div
        className={`relative h-full w-full sm:w-1/3 min-w-[320px] max-w-[460px] flex flex-col p-[1px] shadow-2xl transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(135deg,#60AFFF,#9b7fe1)' }}
      >
        <div className="h-full bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-5 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="text-lg font-bold text-grey-800"
                style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
              >
                Configuración de perfil
              </h2>
              <p className="text-xs text-grey-400 mt-0.5">Personaliza tu identidad en Equpo</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-500 transition-colors text-sm shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Avatar preview */}
          <div className="flex flex-col items-center gap-3 py-4 rounded-2xl border border-grey-150 bg-grey-50/50">
            <UserAvatar
              src={photoURL}
              alt={displayName}
              initials={initials}
              className="w-16 h-16 rounded-full object-cover"
              style={{ boxShadow: '0 4px 14px rgba(96,175,255,0.3)' }}
              fallbackClassName="flex items-center justify-center text-white font-bold text-xl"
              fallbackStyle={{
                background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 100%)',
                boxShadow: '0 4px 14px rgba(96,175,255,0.4)',
              }}
              loading="eager"
            />
            <div className="text-center">
              <p className="text-sm font-bold text-grey-800" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {displayName || 'Sin nombre'}
              </p>
              <p className="text-xs text-grey-400 font-mono mt-0.5 px-4 truncate max-w-[240px]">
                {user.uid}
              </p>
            </div>
          </div>

          {/* Level & XP — read only */}
          <div
            className="rounded-xl p-4 border border-grey-150"
            style={{ background: 'rgba(96,175,255,0.04)' }}
          >
            <p className="text-xs font-semibold text-grey-400 uppercase tracking-wider mb-3">Progreso</p>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#9b7fe1,#5961F9)' }}
                >
                  {user.level}
                </div>
                <div>
                  <p className="text-xs font-bold text-grey-700">Nivel {user.level}</p>
                  <p className="text-xs text-grey-400">
                    {user.experience.toLocaleString()} / {user.experienceToNextLevel.toLocaleString()} XP
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
            <div className="w-full h-1.5 rounded-full bg-grey-150 overflow-hidden">
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
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">
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
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all"
              style={{
                borderColor: errors.displayName ? '#F65A70' : 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(96,175,255,0.25)')
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = 'none')}
            />
            {errors.displayName && (
              <p className="text-xs text-[#F65A70] mt-1">{errors.displayName}</p>
            )}
          </div>

          {/* Photo URL */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mt-4 mb-1.5 block">
              Imagen desde tu dispositivo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.currentTarget.files?.[0] ?? null;
                setPhotoFile(selectedFile);
                setErrors((p) => ({ ...p, form: undefined }));

                if (selectedFile) {
                  setPhotoURL(URL.createObjectURL(selectedFile));
                }
              }}
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-700 bg-white"
              style={{
                borderColor: 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <p className="text-xs text-grey-400 mt-1">
              Se guarda una sola imagen por usuario: cada nueva carga reemplaza la anterior.
            </p>
          </div>

          {/* UID — read only */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">
              UID
            </label>
            <div
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-400 font-mono select-all break-all"
              style={{
                borderColor: 'rgba(0,0,0,0.06)',
                background: 'rgba(250,250,248,0.8)',
                fontFamily: 'monospace',
                fontSize: '11px',
              }}
            >
              {user.uid}
            </div>
            <p className="text-xs text-grey-400 mt-1">El UID no se puede modificar</p>
          </div>

          <div className="flex-grow" />

          {errors.form && (
            <p className="text-xs text-[#F65A70] -mt-2">{errors.form}</p>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 pb-2 mt-auto">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="flex-1 py-2.5 rounded-xl border border-grey-200 text-sm font-medium text-grey-500 hover:bg-grey-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
