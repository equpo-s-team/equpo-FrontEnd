import { Mail } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import { useAuth } from '@/context/AuthContext';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth.ts';
import { cn } from '@/lib/utils/utils.ts';

interface VerifyEmailStepProps {
  email: string;
  onVerified: () => void;
}

export const VerifyEmailStep: React.FC<VerifyEmailStepProps> = ({ email, onVerified }) => {
  const { resendVerificationEmail, refreshVerificationStatus } = useFirebaseAuth();
  const { isVerified } = useAuth();
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasNotifiedRef = useRef(false);

  // Source of truth: navigate when AuthContext confirms the verified state.
  // Avoids a race where polling fires navigate() before AuthContext finishes
  // its async upsert, which would trip the TeamsRoute guard.
  useEffect(() => {
    if (isVerified && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toastSuccess('¡Correo verificado! Bienvenido a Equpo.');
      onVerified();
    }
  }, [isVerified, onVerified]);

  // Poll every 5s to nudge Firebase (reload + force token refresh). This
  // triggers onIdTokenChanged in AuthContext, which then flips isVerified.
  // Needed primarily for cross-device verification — same-device clicks sync
  // automatically via Firebase's cross-tab IndexedDB.
  useEffect(() => {
    if (isVerified) return;
    const interval = setInterval(() => {
      void refreshVerificationStatus();
    }, 5000);
    return () => clearInterval(interval);
  }, [refreshVerificationStatus, isVerified]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    const result = await resendVerificationEmail();
    if (result.success) {
      toastSuccess('¡Correo reenviado! Revisa tu bandeja de entrada.');
      setResendCooldown(30);
    } else if (result.error) {
      toastError(result.error);
    }
  };

  return (
    <div className="text-center space-y-6 animate-in fade-in-50 slide-in-from-right-5">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
        <Mail className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Verifica tu correo
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Te enviamos un enlace a{' '}
          <span className="font-medium text-emerald-500 dark:text-emerald-400">{email}</span>.
          Abre el correo y haz clic en el enlace para activar tu cuenta.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void handleResend()}
        disabled={resendCooldown > 0}
        className={cn(
          'text-sm font-medium transition-colors',
          resendCooldown > 0
            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300',
        )}
      >
        {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : 'Reenviar correo'}
      </button>
    </div>
  );
};
