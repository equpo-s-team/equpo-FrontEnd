import {
  Check,
  Clock,
  Copy,
  Crown,
  Eye,
  Link as LinkIcon,
  Loader2,
  Share2,
  User,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

import { useGenerateInviteCode } from '@/features/team/hooks/useGenerateInviteCode';
import { toastError, toastSuccess } from '@/lib/toast';

interface InviteMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  accent: string;
}

type RoleOption = 'member' | 'collaborator' | 'spectator';

const ROLE_OPTIONS: { value: RoleOption; label: string; icon: React.ReactNode; desc: string; color: string; bg: string }[] = [
  {
    value: 'member',
    label: 'Miembro',
    icon: <User size={18} />,
    desc: 'Acceso completo al equipo',
    color: '#908E88',
    bg: 'rgba(144,142,136,0.12)',
  },
  {
    value: 'collaborator',
    label: 'Colaborador',
    icon: <Crown size={18} />,
    desc: 'Puede gestionar miembros',
    color: '#9b7fe1',
    bg: 'rgba(155,127,225,0.12)',
  },
  {
    value: 'spectator',
    label: 'Espectador',
    icon: <Eye size={18} />,
    desc: 'Solo puede observar',
    color: '#B0ADA7',
    bg: 'rgba(176,173,167,0.12)',
  },
];

const EXPIRY_OPTIONS = [
  { label: '1 día', hours: 24 },
  { label: '7 días', hours: 168 },
  { label: '30 días', hours: 720 },
];

const USES_OPTIONS = [
  { label: '1 uso', value: 1 },
  { label: '5 usos', value: 5 },
  { label: '10 usos', value: 10 },
  { label: '50 usos', value: 50 },
  { label: 'Sin límite', value: 1000 },
];

export default function InviteMembersModal({ isOpen, onClose, teamId, teamName, accent }: InviteMembersModalProps) {
  const generateInviteCode = useGenerateInviteCode();

  const [role, setRole] = useState<RoleOption>('member');
  const [expiresHours, setExpiresHours] = useState(24);
  const [maxUses, setMaxUses] = useState(10);
  const [generated, setGenerated] = useState<{ code: string; link: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    generateInviteCode.mutate(
      { teamId, role, expiresInHours: expiresHours, maxUses },
      {
        onSuccess: (data) => {
          const link = `${window.location.origin}/join/${data.code}`;
          setGenerated({ code: data.code, link });
          toastSuccess('¡Invitación creada!', 'Comparte el código o el link con tu equipo');
        },
        onError: (err) => toastError('Error', err instanceof Error ? err.message : 'No se pudo generar la invitación'),
      }
    );
  };

  const copyToClipboard = async (text: string, type: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
      toastSuccess('Copiado', type === 'code' ? 'Código copiado al portapapeles' : 'Link copiado al portapapeles');
    } catch {
      toastError('Error', 'No se pudo copiar al portapapeles');
    }
  };

  const shareViaWhatsApp = () => {
    if (!generated) return;
    const text = `¡Únete a ${teamName} en Equpo!\n\nCódigo: ${generated.code}\nLink: ${generated.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const reset = () => {
    setGenerated(null);
    setRole('member');
    setExpiresHours(24);
    setMaxUses(10);
    setCopiedCode(false);
    setCopiedLink(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm font-body">
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-grey-100">
          <div>
            <h2 className="text-lg font-bold text-grey-800">Invitar miembros</h2>
            <p className="text-xs text-grey-400 mt-0.5">{teamName}</p>
          </div>
          <button
            onClick={() => { reset(); onClose(); }}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-grey-400 hover:text-grey-600 hover:bg-grey-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {!generated ? (
          <div className="px-6 py-6 space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 flex items-center gap-2">
                <Crown size={12} />
                Rol del invitado
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setRole(opt.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                      role === opt.value
                        ? 'border-current shadow-sm'
                        : 'border-grey-150 hover:border-grey-200 bg-grey-50'
                    }`}
                    style={role === opt.value ? { borderColor: opt.color, background: opt.bg } : undefined}
                  >
                    <span style={{ color: role === opt.value ? opt.color : '#908E88' }}>{opt.icon}</span>
                    <span className={`text-xs font-medium ${role === opt.value ? 'text-grey-800' : 'text-grey-600'}`}>{opt.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-grey-400">{ROLE_OPTIONS.find((r) => r.value === role)?.desc}</p>
            </div>

            {/* Expiry Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 flex items-center gap-2">
                <Clock size={12} />
                Válido por
              </label>
              <div className="flex gap-2">
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.hours}
                    onClick={() => setExpiresHours(opt.hours)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all ${
                      expiresHours === opt.hours
                        ? 'text-grey-800 border-grey-300 bg-grey-100'
                        : 'text-grey-600 border-grey-150 bg-white hover:bg-grey-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Uses Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-widest text-grey-400 flex items-center gap-2">
                <Share2 size={12} />
                Usos máximos
              </label>
              <div className="flex gap-2 flex-wrap">
                {USES_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMaxUses(opt.value)}
                    className={`py-2 px-4 rounded-xl text-sm font-medium border transition-all ${
                      maxUses === opt.value
                        ? 'text-grey-800 border-grey-300 bg-grey-100'
                        : 'text-grey-600 border-grey-150 bg-white hover:bg-grey-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generateInviteCode.isPending}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: accent, boxShadow: '0 4px 20px rgba(96,175,255,0.4)' }}
            >
              {generateInviteCode.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generando...
                </>
              ) : (
                <>
                  <LinkIcon size={16} />
                  Generar invitación
                </>
              )}
            </button>
          </div>
        ) : (
          /* Result View */
          <div className="px-6 py-6 space-y-5">
            <div className="text-center">
              <div
                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(101, 210, 149, 0.15)' }}
              >
                <Check size={24} className="text-green" />
              </div>
              <h3 className="text-lg font-bold text-grey-800">¡Invitación lista!</h3>
              <p className="text-xs text-grey-400 mt-1">Comparte el código o el link con quien quieras invitar</p>
            </div>

            {/* Code Card */}
            <div className="bg-grey-50 rounded-xl p-4 space-y-3 border border-grey-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-grey-400">Código de invitación</span>
                <button
                  onClick={() => void copyToClipboard(generated.code, 'code')}
                  className="flex items-center gap-1.5 text-xs font-medium text-grey-500 hover:text-grey-700 transition-colors"
                >
                  {copiedCode ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  {copiedCode ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white rounded-lg border border-grey-150 px-4 py-3 text-center">
                <span className="text-2xl font-bold tracking-[0.15em] text-grey-800 font-mono">
                  {generated.code}
                </span>
              </div>
            </div>

            {/* Link Card */}
            <div className="bg-grey-50 rounded-xl p-4 space-y-3 border border-grey-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-grey-400">Link de invitación</span>
                <button
                  onClick={() => void copyToClipboard(generated.link, 'link')}
                  className="flex items-center gap-1.5 text-xs font-medium text-grey-500 hover:text-grey-700 transition-colors"
                >
                  {copiedLink ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                  {copiedLink ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white rounded-lg border border-grey-150 px-4 py-3">
                <p className="text-xs text-grey-600 break-all font-mono leading-relaxed">{generated.link}</p>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => void copyToClipboard(generated.link, 'link')}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-grey-800 text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
              >
                <Copy size={16} />
                Copiar link
              </button>
              <button
                onClick={shareViaWhatsApp}
                className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-all active:scale-95"
                style={{ background: '#25D366' }}
              >
                <Share2 size={16} />
                WhatsApp
              </button>
            </div>

            {/* Create Another */}
            <button
              onClick={reset}
              className="w-full py-3 rounded-xl border border-grey-150 text-sm font-medium text-grey-600 hover:bg-grey-50 transition-all"
            >
              Crear otra invitación
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
