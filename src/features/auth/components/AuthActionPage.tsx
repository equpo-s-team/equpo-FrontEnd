import { applyActionCode, reload } from 'firebase/auth';
import { CheckCircle, XCircle } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { auth } from '@/firebase';
import { cn } from '@/lib/utils/utils.ts';

type PageStatus = 'loading' | 'success' | 'error';

const ERROR_MESSAGES: Record<string, string> = {
  'auth/expired-action-code': 'El enlace de verificación ha expirado. Solicita uno nuevo.',
  'auth/invalid-action-code': 'El enlace de verificación no es válido o ya fue usado.',
};

export const AuthActionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    void (async () => {
      // Wait for Firebase Auth to restore the session from IndexedDB.
      // Without this, auth.currentUser is null at mount time.
      await auth.authStateReady();

      // Firebase's built-in verification handler already consumed the oobCode
      // and redirects to the continueUrl without query params. If the user is
      // already verified when we land here, treat it as a successful verification.
      if (mode !== 'verifyEmail' || !oobCode) {
        if (auth.currentUser) {
          try {
            await reload(auth.currentUser);
            if (auth.currentUser.emailVerified) {
              await auth.currentUser.getIdToken(true);
              setStatus('success');
              return;
            }
          } catch {
            /* fall through to error */
          }
        }
        setStatus('error');
        setErrorMessage('Enlace no reconocido.');
        return;
      }

      try {
        await applyActionCode(auth, oobCode);

        // Refresh the local user so emailVerified updates in this tab.
        if (auth.currentUser) {
          await reload(auth.currentUser);
          await auth.currentUser.getIdToken(true);
        }

        setStatus('success');
      } catch (err: unknown) {
        // Email scanners (Gmail, Outlook, university security gateways) often
        // pre-fetch links and consume the one-use oobCode before the user clicks.
        // If we can confirm the current user is already verified, treat as success.
        if (auth.currentUser) {
          try {
            await reload(auth.currentUser);
            if (auth.currentUser.emailVerified) {
              await auth.currentUser.getIdToken(true);
              setStatus('success');
              return;
            }
          } catch {
            /* fall through to error */
          }
        }

        const code = (err as { code?: string }).code ?? '';
        setErrorMessage(
          ERROR_MESSAGES[code] ?? 'No pudimos verificar tu correo. Intenta de nuevo.',
        );
        setStatus('error');
      }
    })();
  }, [searchParams]);

  return (
    <div className="min-h-screen relative w-full overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 animated-gradient-bg" />

      <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-radial-green opacity-40 animate-pulse" />
      <div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-radial-blue opacity-40 animate-pulse"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        <div className="bg-white/95 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 dark:border-gray-700/20 text-center space-y-6">
          {status === 'loading' && (
            <>
              <div
                className="mx-auto w-10 h-10 rounded-full border-4 border-emerald-100 animate-spin"
                style={{ borderTopColor: '#34d399' }}
              />
              <p className="text-gray-600 dark:text-gray-400">Verificando tu correo...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  ¡Correo verificado!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tu cuenta ha sido activada. Ya puedes acceder a Equpo.
                </p>
              </div>
              <button
                onClick={() => void navigate(auth.currentUser ? '/teams' : '/')}
                className={cn(
                  'w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl',
                  'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all',
                )}
              >
                Continuar
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  Enlace inválido
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{errorMessage}</p>
              </div>
              <button
                onClick={() => void navigate('/')}
                className={cn(
                  'w-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white font-medium py-3 px-6 rounded-xl',
                  'hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-all',
                )}
              >
                Volver al inicio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
