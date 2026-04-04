import React, { useState } from 'react';
import {EditTeamPayload, Team} from "@/features/team/index.ts";

interface EditTeamModalProps {
  team: Team;
  onClose: () => void;
  onSave: (id: string, payload: EditTeamPayload) => void;
}

const COLOR_CONFIG = {
  blue:   { gradient: 'linear-gradient(135deg,#60AFFF,#86F0FD)', glow: 'rgba(96,175,255,0.5)' },
  purple: { gradient: 'linear-gradient(135deg,#9b7fe1,#5961F9)', glow: 'rgba(155,127,225,0.5)' },
  green:  { gradient: 'linear-gradient(135deg,#9CEDC1,#CEFB7C)', glow: 'rgba(156,237,193,0.5)' },
  red:    { gradient: 'linear-gradient(135deg,#F65A70,#FFAF93)', glow: 'rgba(246,90,112,0.5)' },
  orange: { gradient: 'linear-gradient(135deg,#FF94AE,#FCE98D)', glow: 'rgba(255,148,174,0.5)' },
};

export const EditTeamModal: React.FC<EditTeamModalProps> = ({ team, onClose, onSave }) => {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const cfg = COLOR_CONFIG[team.color];

  const handleSave = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (!description.trim()) errs.description = 'La descripción es obligatoria';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(team.id, { name: name.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-grey-900/20 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-2xl p-[1px] shadow-2xl"
        style={{ background: cfg.gradient }}
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-grey-800" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
                Editar equipo
              </h2>
              <p className="text-xs text-grey-400 mt-0.5">{team.name}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-500 transition-colors text-sm">
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
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all"
              style={{ borderColor: errors.name ? '#F65A70' : 'rgba(0,0,0,0.1)', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
            {errors.name && <p className="text-[11px] text-red mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">Descripción *</label>
            <textarea
              value={description}
              onChange={e => { setDescription(e.target.value); setErrors(p => ({ ...p, description: undefined })); }}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all resize-none"
              style={{ borderColor: errors.description ? '#F65A70' : 'rgba(0,0,0,0.1)', fontFamily: 'DM Sans, sans-serif' }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.glow}`}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
            {errors.description && <p className="text-[11px] text-red mt-1">{errors.description}</p>}
          </div>

          {/* Members list (read-only for now) */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-2 block">Miembros actuales</label>
            <div className="flex flex-col gap-2">
              {team.members.map(m => (
                <div key={m.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-grey-50 border border-grey-100">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ background: cfg.gradient }}
                  >
                    {m.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-grey-700 truncate">{m.name}</p>
                    <p className="text-[11px] text-grey-400 truncate">{m.email}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: m.role === 'owner' ? cfg.glow.replace('0.5','0.12') : 'transparent',
                      color: m.role === 'owner' ? '#524F4A' : '#908E88',
                      border: `1px solid ${m.role === 'owner' ? cfg.glow.replace('0.5','0.3') : 'transparent'}`,
                    }}
                  >
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-grey-200 text-sm font-medium text-grey-500 hover:bg-grey-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: cfg.gradient, boxShadow: `0 6px 20px ${cfg.glow}` }}
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
