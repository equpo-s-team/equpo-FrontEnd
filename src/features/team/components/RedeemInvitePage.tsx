import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { useRedeemInviteCode } from '@/features/team/hooks/useRedeemInviteCode';
import { toastError, toastSuccess } from '@/lib/toast';

export default function RedeemInvitePage() {
  const { code: urlCode } = useParams<{ code: string }>();
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const redeemCode = useRedeemInviteCode();

  const [code, setCode] = useState(urlCode || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRedeem = useCallback(async (redeemCodeValue: string) => {
    if (!redeemCodeValue.trim() || !user?.uid) return;

    setIsProcessing(true);
    try {
      // Backend handles adding user to team
      await redeemCode.mutateAsync({ code: redeemCodeValue.trim() });

      toastSuccess('¡Bienvenido!', 'Te has unido al equipo exitosamente.');
      void navigate('/teams');
    } catch (error) {
      toastError('Error', error instanceof Error ? error.message : 'No se pudo canjear el código.');
    } finally {
      setIsProcessing(false);
    }
  }, [user, redeemCode, navigate]);

  useEffect(() => {
    if (urlCode && isAuth && user?.uid) {
      void handleRedeem(urlCode);
    }
  }, [urlCode, isAuth, user, handleRedeem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleRedeem(code);
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red/10 flex items-center justify-center">
            <div className="w-6 h-6 bg-red rounded-full" />
          </div>
          <h1 className="text-xl font-bold text-grey-800 mb-2">Inicia sesión</h1>
          <p className="text-grey-600 mb-4">
            Debes iniciar sesión en Equpo para canjear un código de invitación.
          </p>
          <button
            onClick={() => void navigate('/')}
            className="px-6 py-2 bg-blue text-white rounded-lg hover:bg-blue/90"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-grey-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue/10 flex items-center justify-center">
            <div className="w-6 h-6 bg-blue rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-grey-800 mb-2">Canjear Código de Invitación</h1>
          <p className="text-grey-600">
            Ingresa el código que te compartieron para unirte a un equipo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-grey-700 mb-2">
              Código de Invitación
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123XY"
              className="w-full px-4 py-3 border border-grey-300 rounded-lg focus:ring-2 focus:ring-blue focus:border-transparent outline-none"
              disabled={isProcessing}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing || !code.trim()}
            className="w-full py-3 bg-blue text-white rounded-lg hover:bg-blue/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Canjeando...
              </>
            ) : (
              'Unirme al Equipo'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => void navigate('/teams')}
            className="text-sm text-grey-500 hover:text-grey-700"
          >
            Volver a mis equipos
          </button>
        </div>
      </div>
    </div>
  );
}
