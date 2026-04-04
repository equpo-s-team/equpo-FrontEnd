import React from 'react';

interface NewTeamCardProps {
  onClick: () => void;
}

export const NewTeamCard: React.FC<NewTeamCardProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl p-[1px] w-full transition-all duration-300 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(96,175,255,0.3) 0%, rgba(156,237,193,0.3) 100%)',
        boxShadow: '0 4px 24px rgba(96,175,255,0.1)',
        minHeight: 220,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 40px rgba(96,175,255,0.25)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(96,175,255,0.5) 0%, rgba(156,237,193,0.5) 100%)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px rgba(96,175,255,0.1)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(96,175,255,0.3) 0%, rgba(156,237,193,0.3) 100%)';
      }}
    >
      <div
        className="rounded-2xl h-full w-full flex flex-col items-center justify-center gap-3 p-8"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)',
          border: '2px dashed rgba(96,175,255,0.35)',
        }}
      >
        {/* Plus icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 group-hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, rgba(96,175,255,0.12), rgba(156,237,193,0.12))',
            border: '1.5px solid rgba(96,175,255,0.3)',
            color: '#60AFFF',
          }}
        >
          +
        </div>

        <div className="text-center">
          <p className="text-sm font-bold text-grey-700 mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            Crear nuevo equipo
          </p>
          <p className="text-xs text-grey-400">Nombre, descripción y miembros</p>
        </div>
      </div>
    </button>
  );
};
