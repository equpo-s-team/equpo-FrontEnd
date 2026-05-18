import { useQuery } from '@tanstack/react-query';

interface UserPreview {
  uid: string;
  displayName?: string;
  photoURL?: string;
}

export function useUserSearch(userUid: string) {
  return useQuery({
    queryKey: ['user', userUid],
    queryFn: (): Promise<UserPreview | null> => {
      if (!userUid || userUid.length < 10) return Promise.resolve(null);

      // Simulación: si el UID parece válido, retornamos información básica
      if (userUid.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(userUid)) {
        // Crear un nombre más descriptivo basado en el UID
        const uidPrefix = userUid.substring(0, 6);
        const uidSuffix = userUid.substring(userUid.length - 4);

        return Promise.resolve({
          uid: userUid,
          displayName: `Usuario ${uidPrefix}...${uidSuffix}`,
          photoURL: undefined,
        });
      }

      return Promise.resolve(null);
    },
    enabled: !!userUid && userUid.length >= 10,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1, // Solo reintentar una vez
  });
}
