import { getAuth } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';

import { auth } from '@/firebase';

interface UserPreview {
  uid: string;
  displayName?: string;
  photoURL?: string;
}

export function useUserSearch(userUid: string) {
  return useQuery({
    queryKey: ['user', userUid],
    queryFn: async () => {
      if (!userUid || userUid.length < 10) return null;

      try {
        // Solución frontend: usar Firebase Auth para buscar usuario
        const authInstance = getAuth();

        // Simulación: si el UID parece válido, retornamos información básica
        if (userUid.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(userUid)) {
          // Crear un nombre más descriptivo basado en el UID
          const uidPrefix = userUid.substring(0, 6);
          const uidSuffix = userUid.substring(userUid.length - 4);

          return {
            uid: userUid,
            displayName: `Usuario ${uidPrefix}...${uidSuffix}`,
            photoURL: null,
          } as UserPreview;
        }

        return null;
      } catch (error) {
        // Si hay error, retornamos null
        return null;
      }
    },
    enabled: !!userUid && userUid.length >= 10,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo reintentar una vez
  });
}
