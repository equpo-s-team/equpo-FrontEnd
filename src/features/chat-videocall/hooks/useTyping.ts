import { useEffect, useState } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';

import { auth, rtdb } from '@/firebase';

export function useTyping(teamId: string, roomId: string | null) {
  const [typingUsers, setTypingUsers] = useState<{ uid: string; name: string }[]>([]);

  // 1. Listener en tiempo real de quién está escribiendo
  useEffect(() => {
    if (!teamId || !roomId) return;

    const typingRef = ref(rtdb, `teams/${teamId}/chatRooms/${roomId}/typing`);
    const unsub = onValue(typingRef, (snapshot) => {
      const currentUid = auth.currentUser?.uid;
      const tUsers: { uid: string; name: string }[] = [];

      snapshot.forEach((child) => {
        if (child.key !== currentUid) {
          const data = child.val();
          // Filtrar entradas muy antiguas (>10 segundos)
          if (data?.timestamp && Date.now() - data.timestamp < 10000) {
            tUsers.push({ uid: child.key!, name: data.name });
          }
        }
      });

      setTypingUsers(tUsers);
    });

    return () => unsub();
  }, [teamId, roomId]);

  // 2. Escribir el estado de typing del usuario actual
  const setTyping = async (isTyping: boolean) => {
    if (!teamId || !roomId || !auth.currentUser) return;

    const uid = auth.currentUser.uid;
    const userTypingRef = ref(rtdb, `teams/${teamId}/chatRooms/${roomId}/typing/${uid}`);

    if (isTyping) {
      await set(userTypingRef, {
        name: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'Usuario',
        timestamp: Date.now(),
      });
    } else {
      await remove(userTypingRef).catch(() => {});
    }
  };

  return { typingUsers, setTyping };
}
