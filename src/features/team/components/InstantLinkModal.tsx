import { Check, Copy, Loader2, Settings, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { toastError, toastSuccess } from '@/components/ui/toast';
import { useGenerateInviteCode } from '@/features/team/hooks/useGenerateInviteCode';

interface InstantLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  accent: string;
  onOpenConfiguration: () => void;
  initialData?: { code: string; link: string };
}

export function InstantLinkModal({
  isOpen,
  onClose,
  teamId,
  teamName,
  accent,
  onOpenConfiguration,
  initialData,
}: InstantLinkModalProps) {
  const generateInviteCode = useGenerateInviteCode();
  const [generated, setGenerated] = useState<{ code: string; link: string } | null>(
    initialData || null,
  );
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasAttempted, setHasAttempted] = useState(false);

  // Generate link immediately when modal opens, but only once (if no initialData)
  useEffect(() => {
    if (isOpen && !generated && !hasAttempted && !initialData) {
      setHasAttempted(true);
      generateInviteCode.mutate(
        { teamId, role: 'member', expiresInHours: 168, maxUses: 50 }, // 7 days, 50 uses, member
        {
          onSuccess: (data) => {
            const link = `${window.location.origin}/join/${data.code}`;
            setGenerated({ code: data.code, link });
            toastSuccess('¡Enlace generado!', 'Comparte el link con tu equipo');
          },
          onError: (err) => {
            toastError(
              'Error',
              err instanceof Error ? err.message : 'No se pudo generar el enlace',
            );
          },
        },
      );
    }
  }, [isOpen, generated, hasAttempted, teamId, generateInviteCode, initialData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGenerated(null);
      setHasAttempted(false);
      setCopiedCode(false);
      setCopiedLink(false);
    }
  }, [isOpen]);

  // Update generated when initialData changes
  useEffect(() => {
    if (initialData) {
      setGenerated(initialData);
      setHasAttempted(true); // Mark as attempted since we have data
    }
  }, [initialData]);

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
      toastSuccess(
        'Copiado',
        type === 'code' ? 'Código copiado al portapapeles' : 'Link copiado al portapapeles',
      );
    } catch {
      toastError('Error', 'No se pudo copiar al portapapeles');
    }
  };

  const shareViaWhatsApp = () => {
    if (!generated) return;
    const text = `¡Únete a ${teamName} en Equpo!\n\nCódigo: ${generated.code}\nLink: ${generated.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConfiguration = () => {
    onClose();
    onOpenConfiguration();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl border border-grey-100 dark:border-gray-700 transform transition-all duration-300 scale-100 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-grey-100 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-grey-800 dark:text-gray-100 font-body">Enlace de invitación</h2>
            <p className="text-sm text-grey-400 dark:text-grey-500 mt-0.5">{teamName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-600 dark:hover:text-grey-300 hover:bg-grey-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {generateInviteCode.isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-blue mb-4" />
              <p className="text-sm text-grey-500 dark:text-grey-400 font-body">Generando enlace...</p>
            </div>
          ) : generated ? (
            <>
              {/* Success Message */}
              <div className="bg-green/5 dark:bg-green/10 border border-green/20 dark:border-green/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green text-white flex items-center justify-center">
                    <Check size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green dark:text-green-400 font-body">¡Enlace listo!</h3>
                  </div>
                </div>
              </div>

              {/* Link Display */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-gray-300 mb-2 font-body">
                    Enlace de invitación
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-grey-50 dark:bg-gray-700 border border-grey-200 dark:border-gray-600 rounded-lg text-sm text-grey-800 dark:text-gray-100 font-mono truncate">
                      {generated.link}
                    </div>
                    <button
                      onClick={() => {
                        void copyToClipboard(generated.link, 'link');
                      }}
                      className="px-3 py-2 rounded-lg bg-blue text-white hover:bg-blue/90 transition-colors flex items-center gap-2"
                    >
                      {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                      {copiedLink ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-grey-700 dark:text-gray-300 mb-2 font-body">
                    Código de invitación
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-3 py-2 bg-grey-50 dark:bg-gray-700 border border-grey-200 dark:border-gray-600 rounded-lg text-sm text-grey-800 dark:text-gray-100 font-mono text-center">
                      {generated.code}
                    </div>
                    <button
                      onClick={() => {
                        void copyToClipboard(generated.code, 'code');
                      }}
                      className="px-3 py-2 rounded-lg bg-blue text-white hover:bg-blue/90 transition-colors flex items-center gap-2"
                    >
                      {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                      {copiedCode ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={shareViaWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-grey-200 dark:border-gray-600 hover:bg-grey-50 dark:hover:bg-gray-700 transition-colors font-body font-medium text-sm text-grey-700 dark:text-gray-300"
                >
                  <Share2 size={16} />
                  Compartir por WhatsApp
                </button>
                <button
                  onClick={handleConfiguration}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all hover:opacity-90 font-body font-medium text-sm"
                  style={{ background: accent }}
                >
                  <Settings size={16} />
                  Configurar enlace
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-sm text-red dark:text-red-400 font-body mb-4">Error al generar el enlace</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setHasAttempted(false); // Reset to allow retry
                    generateInviteCode.mutate(
                      { teamId, role: 'member', expiresInHours: 168, maxUses: 50 },
                      {
                        onSuccess: (data) => {
                          const link = `${window.location.origin}/join/${data.code}`;
                          setGenerated({ code: data.code, link });
                          toastSuccess('¡Enlace generado!', 'Comparte el link con tu equipo');
                        },
                        onError: (err) => {
                          toastError(
                            'Error',
                            err instanceof Error ? err.message : 'No se pudo generar el enlace',
                          );
                        },
                      },
                    );
                  }}
                  disabled={generateInviteCode.isPending}
                  className="px-4 py-2 rounded-lg bg-blue text-white hover:bg-blue/90 transition-colors text-sm font-body disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateInviteCode.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Reintentar'
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-grey-200 dark:border-gray-600 hover:bg-grey-50 dark:hover:bg-gray-700 transition-colors text-sm font-body text-grey-700 dark:text-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
