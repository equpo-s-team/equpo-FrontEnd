import React, { useState } from 'react';
import {CreateTeamPayload, TeamColor} from "@/features/team/index.ts";

interface CreateTeamModalProps {
  onClose: () => void;
  onCreate: (payload: CreateTeamPayload & { color: TeamColor }) => void;
}

const COLORS: { value: TeamColor; label: string; gradient: string; glow: string }[] = [
  { value: 'blue',   label: 'Azul',    gradient: 'linear-gradient(135deg,#60AFFF,#86F0FD)', glow: 'rgba(96,175,255,0.5)' },
  { value: 'purple', label: 'Morado',  gradient: 'linear-gradient(135deg,#9b7fe1,#5961F9)', glow: 'rgba(155,127,225,0.5)' },
  { value: 'green',  label: 'Verde',   gradient: 'linear-gradient(135deg,#9CEDC1,#CEFB7C)', glow: 'rgba(156,237,193,0.5)' },
  { value: 'red',    label: 'Rojo',    gradient: 'linear-gradient(135deg,#F65A70,#FFAF93)', glow: 'rgba(246,90,112,0.5)' },
  { value: 'orange', label: 'Rosa',    gradient: 'linear-gradient(135deg,#FF94AE,#FCE98D)', glow: 'rgba(255,148,174,0.5)' },
];

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [color, setColor] = useState<TeamColor>('blue');
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const addEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && !emails.includes(trimmed)) {
      setEmails(prev => [...prev, trimmed]);
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => setEmails(prev => prev.filter(e => e !== email));

  const handleSubmit = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'El nombre es obligatorio';
    if (!description.trim()) errs.description = 'La descripción es obligatoria';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onCreate({ name: name.trim(), description: description.trim(), memberEmails: emails, color });
  };

  const selectedCfg = COLORS.find(c => c.value === color)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-grey-900/20 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-2xl p-[1px] shadow-2xl"
        style={{ background: selectedCfg.gradient }}
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-5">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-grey-800" style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}>
                Nuevo equipo
              </h2>
              <p className="text-xs text-grey-400 mt-0.5">Configura tu equipo en segundos</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-500 transition-colors text-sm">
              ✕
            </button>
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-2 block">Color del equipo</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className="w-8 h-8 rounded-full transition-all duration-200"
                  style={{
                    background: c.gradient,
                    boxShadow: color === c.value ? `0 0 0 3px white, 0 0 0 5px ${c.glow.replace('0.5','0.8')}` : 'none',
                    transform: color === c.value ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={c.label}
                />
              ))}
            </div>
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
                boxShadow: `0 0 0 0px ${selectedCfg.glow}`,
              }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${selectedCfg.glow}`}
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
              placeholder="¿De qué trata este equipo?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border text-sm text-grey-800 outline-none transition-all resize-none"
              style={{
                borderColor: errors.description ? '#F65A70' : 'rgba(0,0,0,0.1)',
                fontFamily: 'DM Sans, sans-serif',
              }}
              onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${selectedCfg.glow}`}
              onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            />
            {errors.description && <p className="text-[11px] text-red mt-1">{errors.description}</p>}
          </div>

          {/* Members */}
          <div>
            <label className="text-xs font-semibold text-grey-500 uppercase tracking-wider mb-1.5 block">Invitar miembros (opcional)</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addEmail()}
                placeholder="email@empresa.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-grey-200 text-sm text-grey-800 outline-none"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
                onFocus={e => e.currentTarget.style.boxShadow = `0 0 0 3px ${selectedCfg.glow}`}
                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
              />
              <button
                onClick={addEmail}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: selectedCfg.gradient, boxShadow: `0 4px 12px ${selectedCfg.glow}` }}
              >
                + Agregar
              </button>
            </div>
            {emails.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {emails.map(e => (
                  <span
                    key={e}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
                    style={{ background: `${selectedCfg.glow.replace('0.5','0.08')}`, borderColor: selectedCfg.glow.replace('0.5','0.3'), color: '#524F4A' }}
                  >
                    {e}
                    <button onClick={() => removeEmail(e)} className="text-grey-400 hover:text-red transition-colors">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-grey-200 text-sm font-medium text-grey-500 hover:bg-grey-50 transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: selectedCfg.gradient, boxShadow: `0 6px 20px ${selectedCfg.glow}` }}
            >
              Crear equipo ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
