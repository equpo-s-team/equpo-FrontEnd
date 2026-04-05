import React, { useState, useEffect, useMemo } from 'react';
import type { Team } from '@/features/team/types/teamsTypes';

interface TeamFormSidebarProps {
  mode: 'create' | 'edit';
  team?: Team;
  onClose: () => void;
  onSubmit: (payload: { name: string; description: string }) => void;
}

const COLORS = [
  { gradient: 'linear-gradient(135deg,#60AFFF,#86F0FD)', glow: 'rgba(96,175,255,0.5)' },
  { gradient: 'linear-gradient(135deg,#9b7fe1,#5961F9)', glow: 'rgba(155,127,225,0.5)' },
  { gradient: 'linear-gradient(135deg,#9CEDC1,#CEFB7C)', glow: 'rgba(156,237,193,0.5)' },
  { gradient: 'linear-gradient(135deg,#F65A70,#FFAF93)', glow: 'rgba(246,90,112,0.5)' },
  { gradient: 'linear-gradient(135deg,#FF94AE,#FCE98D)', glow: 'rgba(255,148,174,0.5)' },
];

function hashToIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % COLORS.length;
}

export const TeamFormSidebar: React.FC<TeamFormSidebarProps> = ({ mode, team, onClose, onSubmit }) => {
  const [name, setName] = useState(team?.name || '');
  const [description, setDescription] = useState(team?.description || '');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
    });
  };

  const cfg = useMemo(
    () => (team ? COLORS[hashToIndex(team.id)] : COLORS[0]),
    [team],
  );

  const isCreate = mode === 'create';

  return (
    <div className="fixed inset-0 z-50 flex h-full" onClick={handleClose}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-grey-900/20 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

      <div
        className={`relative h-full w-full sm:w-1/3 min-w-[320px] max-w-[500px] flex flex-col p-[1px] shadow-2xl transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: cfg.gradient }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-full bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-5 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-grey-800" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
                {isCreate ? 'Nuevo equipo' : 'Editar equipo'}
              </h2>
              <p className="text-xs text-grey-400 mt-0.5">
                {isCreate ? 'Configura tu equipo en segundos' : 'Modifica los detalles de tu equipo'}
              </p>
            </div>
            <button onClick={handleClose} className="w-8 h-8 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-500 transition-colors text-sm shrink-0">
              ✕
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">Nombre del equipo *</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
              placeholder="Ej: Ingeniería Core"
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all"
              style={{
                borderColor: errors.name ? '#F65A70' : 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: `0 0 0 0px ${cfg.glow}`,
              }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
            {errors.name && <p className="text-[11px] text-[#F65A70] mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">Descripción</label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })); }}
              placeholder="¿De qué trata este equipo?"
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all resize-none"
              style={{
                borderColor: errors.description ? '#F65A70' : 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
            {errors.description && <p className="text-[11px] text-[#F65A70] mt-1">{errors.description}</p>}
          </div>

          {/* Members list — only on Edit */}
          {!isCreate && team && team.members.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-2 block">Miembros actuales</label>
              <div className="flex flex-col gap-2">
                {team.members.map(m => (
                  <div key={m.userUid} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-grey-50 border border-grey-100">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                      style={{ background: cfg.gradient }}
                    >
                      {m.userUid.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-grey-700 truncate">{m.userUid}</p>
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize shrink-0"
                      style={{
                        background: m.role === 'leader' ? cfg.glow.replace('0.5', '0.12') : 'transparent',
                        color: m.role === 'leader' ? '#524F4A' : '#908E88',
                        border: `1px solid ${m.role === 'leader' ? cfg.glow.replace('0.5', '0.3') : 'transparent'}`,
                      }}
                    >
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Footer */}
          <div className="flex gap-3 pt-4 pb-2 mt-auto">
            <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-grey-200 text-sm font-medium text-grey-500 hover:bg-grey-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: cfg.gradient, boxShadow: `0 6px 20px ${cfg.glow}` }}
            >
              {isCreate ? 'Crear equipo ✦' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
