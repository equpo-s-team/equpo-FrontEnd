import { CheckCircle, Loader2, LogIn } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { useAuth } from '@/context/AuthContext';
import { useInvitePreview } from '@/features/team/hooks/useInvitePreview';
import { useRedeemInviteCode } from '@/features/team/hooks/useRedeemInviteCode';
import { toastError, toastSuccess } from '@/lib/toast';

export default function JoinTeamPage() {
  const { code } = useParams<{ code: string }>();
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const redeemInviteCode = useRedeemInviteCode();
  const { data: preview, isLoading, error: previewError } = useInvitePreview(code);

  const handleJoin = () => {
    if (!code || !preview?.isValid) return;

    redeemInviteCode.mutate(
      { code },
      {
        onSuccess: () => {
          toastSuccess(
            '¡Te has unido al equipo!',
            'Bienvenido a ' + (preview?.team?.name || 'el equipo'),
          );
          void navigate('/teams');
        },
        onError: (err) => {
          toastError('Error al unirse', err instanceof Error ? err.message : 'Intenta de nuevo.');
        },
      },
    );
  };

  const handleLogin = () => {
    localStorage.setItem('pendingInviteCode', code || '');
    void navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (previewError || !preview?.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <CheckCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-grey-800 mb-2">Invitación no válida</h1>
          <p className="text-grey-600 mb-6">
            {previewError instanceof Error
              ? previewError.message
              : 'Este link de invitación no es válido o ha expirado.'}
          </p>
          <button
            onClick={() => void navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const { team, role } = preview;
  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-grey-100">
        <div className="text-center mb-6">
          <div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: accent }}
          >
            <TeamAvatar
              src={team.photoUrl}
              name={team.name}
              className="w-full h-full rounded-2xl"
              fallbackClassName="w-full h-full rounded-2xl text-white text-2xl"
              fallbackStyle={{ background: accent }}
            />
          </div>
          <h1 className="text-2xl font-bold text-grey-800 mb-2">Únete a {team.name}</h1>
          <p className="text-grey-600">
            {team.description || 'Un equipo colaborativo para trabajar juntos.'}
          </p>
        </div>

        <div className="bg-grey-50 rounded-lg p-4 mb-6 text-sm text-grey-600">
          <div className="flex justify-between items-center">
            <span>Rol asignado:</span>
            <span className="font-medium capitalize">{role}</span>
          </div>
        </div>

        <div className="text-center">
          {isAuth ? (
            <button
              onClick={handleJoin}
              disabled={redeemInviteCode.isPending}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {redeemInviteCode.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle size={16} />
              )}
              Unirme al equipo
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Iniciar sesión para unirte
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
