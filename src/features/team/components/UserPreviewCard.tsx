import { CheckCircle, User, XCircle } from 'lucide-react';
import React from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';

interface UserPreview {
  uid: string;
  displayName?: string;
  photoURL?: string;
}

interface UserPreviewCardProps {
  user: UserPreview | null;
  isLoading: boolean;
  isValidFormat: boolean;
  isAlreadyInTeam?: boolean;
}

export const UserPreviewCard: React.FC<UserPreviewCardProps> = ({
  user,
  isLoading,
  isValidFormat,
  isAlreadyInTeam = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-blue-200"></div>
        <div className="flex-1">
          <div className="h-4 bg-blue-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-blue-200 rounded w-32"></div>
        </div>
      </div>
    );
  }

  if (!isValidFormat) {
    return (
      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <XCircle className="w-5 h-5 text-orange-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-orange-800">Formato inválido</p>
          <p className="text-xs text-orange-600">El UID debe tener al menos 10 caracteres</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="w-5 h-5 text-red-500" />
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">Usuario no encontrado</p>
          <p className="text-xs text-red-600">Verifica que el UID sea correcto</p>
        </div>
      </div>
    );
  }

  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${
        isAlreadyInTeam ? 'bg-grey-50 border-grey-200' : 'bg-green-50 border-green-200'
      }`}
    >
      {isAlreadyInTeam ? (
        <User className="w-5 h-5 text-grey-500" />
      ) : (
        <CheckCircle className="w-5 h-5 text-green-500" />
      )}
      <UserAvatar
        src={user.photoURL}
        alt={user.displayName || 'Usuario'}
        initials={initials}
        className="w-10 h-10"
        fallbackClassName="text-white text-sm font-medium"
        fallbackStyle={{
          background: isAlreadyInTeam
            ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
            : 'linear-gradient(135deg, #10b981, #059669)',
        }}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold truncate ${
            isAlreadyInTeam ? 'text-grey-700' : 'text-green-800'
          }`}
        >
          {user.displayName || 'Usuario sin nombre'}
        </p>
        <p
          className={`text-xs font-mono truncate ${
            isAlreadyInTeam ? 'text-grey-500' : 'text-green-600'
          }`}
        >
          {user.uid}
        </p>
        {isAlreadyInTeam && <p className="text-xs text-grey-600 mt-1">Ya es miembro del equipo</p>}
      </div>
    </div>
  );
};
