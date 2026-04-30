import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { db } from '@/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRedeemInviteCode } from '@/features/team/hooks/useRedeemInviteCode';
import { TeamAvatar } from '@/components/ui/TeamAvatar.tsx';
import { toastError, toastSuccess } from '@/lib/toast';
import { Loader2, CheckCircle, LogIn } from 'lucide-react';

export default function JoinTeamPage() {
  const { code } = useParams<{ code: string }>();
  const { user, isAuth } = useAuth();
  const navigate = useNavigate();
  const redeemInviteCode = useRedeemInviteCode();

  const [inviteData, setInviteData] = useState<any>(null);
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) {
      setError('Código de invitación no válido.');
      setLoading(false);
      return;
    }

    const fetchInvite = async () => {
      try {
        console.log('Starting to fetch invite with code:', code);

        console.log('Querying invitationCodes collection group...');
        const q = query(collectionGroup(db, 'invitationCodes'), where('code', '==', code));
        const querySnapshot = await getDocs(q);
        console.log('Query invitationCodes result:', querySnapshot.size, 'docs found');

        if (querySnapshot.empty) {
          console.log('No invitation code found for code:', code);
          setError('Este link de invitación no es válido o ha expirado.');
          setLoading(false);
          return;
        }

        const inviteDoc = querySnapshot.docs[0];
        const data = inviteDoc.data();
        console.log('Invitation data retrieved:', data);
        setInviteData(data);

        // Use team data from invite code (no need to fetch team separately)
        console.log('Using team data from invite code:', {
          teamId: data.teamId,
          teamName: data.teamName,
        });
        setTeamData({
          id: data.teamId,
          name: data.teamName || 'Equipo',
          photoUrl: data.teamPhotoUrl,
          description: data.teamDescription,
        });
      } catch (err) {
        console.error('Error fetching invite:', err);
        console.error('Error details:', err instanceof Error ? err.message : JSON.stringify(err));
        setError('Error al cargar la invitación.');
      } finally {
        setLoading(false);
      }
    };

    void fetchInvite();
  }, [code]);

  const handleJoin = () => {
    console.log('handleJoin called', { inviteData, userUid: user?.uid });
    if (!inviteData || !user?.uid) return;

    console.log('Calling mutate...');
    redeemInviteCode.mutate(
      { code: inviteData.code, userUid: user.uid },
      {
        onSuccess: () => {
          console.log('Mutation successful');
          toastSuccess('¡Te has unido al equipo!', 'Bienvenido a ' + (teamData?.name || 'el equipo'));
          void navigate('/teams');
        },
        onError: (err) => {
          console.error('Mutation error:', err);
          toastError('Error al unirse', err instanceof Error ? err.message : 'Intenta de nuevo.');
        },
      },
    );
  };

  const handleLogin = () => {
    // Save code in localStorage or URL for after login
    localStorage.setItem('pendingInviteCode', code || '');
    void navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <CheckCircle size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-grey-800 mb-2">Invitación no válida</h1>
          <p className="text-grey-600 mb-6">{error}</p>
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

  if (!inviteData || !teamData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-grey-600">Cargando...</p>
      </div>
    );
  }

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 border border-grey-100">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden flex items-center justify-center text-white text-2xl font-bold" style={{ background: accent }}>
            <TeamAvatar
              src={teamData.photoUrl}
              name={teamData.name}
              className="w-full h-full rounded-2xl"
              fallbackClassName="w-full h-full rounded-2xl text-white text-2xl"
              fallbackStyle={{ background: accent }}
            />
          </div>
          <h1 className="text-2xl font-bold text-grey-800 mb-2">Únete a {teamData.name}</h1>
          <p className="text-grey-600">{teamData.description || 'Un equipo colaborativo para trabajar juntos.'}</p>
        </div>


        <div className="text-center">
          {isAuth ? (
            <button
              onClick={handleJoin}
              disabled={redeemInviteCode.isPending}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {redeemInviteCode.isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
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
