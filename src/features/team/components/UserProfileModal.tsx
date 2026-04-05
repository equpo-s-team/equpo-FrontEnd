import React from 'react';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatarInitials: string;
    joinedAt: string;
    teamsCount: number;
    tasksCompleted: number;
  };
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileProps> = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        role="button"
        tabIndex={0}
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-grey-900/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Panel del modal"
        className="relative w-full max-w-sm rounded-2xl p-[1px] shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 50%, #9CEDC1 100%)' }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
          }
        }}
      >
        <div className="rounded-2xl bg-white/96 backdrop-blur-xl overflow-hidden">
          {/* Banner */}
          <div
            className="h-20 w-full"
            style={{
              background: 'linear-gradient(135deg, #60AFFF 0%, #9b7fe1 50%, #9CEDC1 100%)',
              opacity: 0.7,
            }}
          />

          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #60AFFF, #5961F9)',
                  boxShadow: '0 4px 20px rgba(96,175,255,0.4)',
                }}
              >
                {user.avatarInitials}
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-400 text-xs transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Info */}
            <h2
              className="text-lg font-bold text-grey-800"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
            >
              {user.name}
            </h2>
            <p className="text-sm text-grey-400 mb-1">{user.email}</p>
            <span className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue/10 text-blue border border-blue/20 mb-4">
              {user.role}
            </span>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Equipos', value: user.teamsCount, color: '#60AFFF' },
                { label: 'Tareas', value: user.tasksCompleted, color: '#9b7fe1' },
                { label: 'Miembro desde', value: user.joinedAt, color: '#9CEDC1', small: true },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-grey-50 rounded-xl p-3 text-center border border-grey-100"
                >
                  <p
                    className={`font-bold ${stat.small ? 'text-[11px]' : 'text-lg'} text-grey-800 leading-tight`}
                    style={{ color: stat.color, fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-grey-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #60AFFF, #9b7fe1)',
                boxShadow: '0 6px 20px rgba(96,175,255,0.35)',
              }}
            >
              Ver perfil completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
