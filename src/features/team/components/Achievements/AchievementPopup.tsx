import React, { useEffect, useState } from 'react';

import type { Achievement } from '@/features/team/types/achievementTypes';

function isImageSource(value: string): boolean {
  return /^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/)/i.test(value);
}

function resolveAchievementImage(achievement: Achievement): string | null {
  if (achievement.iconUrl) return achievement.iconUrl;
  if (achievement.icon && isImageSource(achievement.icon)) return achievement.icon;
  return null;
}

const POPUP_COLORS = [
  { gradient: 'linear-gradient(135deg, #60AFFF, #86F0FD)', glow: 'rgba(96,175,255,0.4)' },
  { gradient: 'linear-gradient(135deg, #9b7fe1, #5961F9)', glow: 'rgba(155,127,225,0.4)' },
  { gradient: 'linear-gradient(135deg, #9CEDC1, #CEFB7C)', glow: 'rgba(156,237,193,0.4)' },
  { gradient: 'linear-gradient(135deg, #F65A70, #FFAF93)', glow: 'rgba(246,90,112,0.4)' },
  { gradient: 'linear-gradient(135deg, #FF94AE, #FCE98D)', glow: 'rgba(255,148,174,0.4)' },
];

function hashToIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % POPUP_COLORS.length;
}

interface AchievementPopupProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export const AchievementPopup: React.FC<AchievementPopupProps> = ({ achievement, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const cfg = POPUP_COLORS[hashToIndex(achievement.id)];
  const imageSrc = resolveAchievementImage(achievement);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 10000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClick = () => {
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 pointer-events-auto"
        style={{
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(6px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={handleClick}
        role="button"
        tabIndex={-1}
        aria-label="Cerrar logro"
        onKeyDown={(e) => e.key === 'Escape' && handleClick()}
      />

      {/* Card */}
      <div
        className="relative pointer-events-auto aspect-square"
        style={{
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
          opacity: visible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        }}
      >
        {/* Glow ring */}
        <div
          className="absolute -inset-1 rounded-3xl"
          style={{
            background: cfg.gradient,
            filter: 'blur(16px)',
            opacity: 0.5,
          }}
        />

        <div
          className="relative rounded-3xl p-0.5 w-[320px]"
          style={{
            background: cfg.gradient,
            boxShadow: `0 24px 64px ${cfg.glow}, 0 8px 32px rgba(0,0,0,0.15)`,
          }}
        >
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-5">
            <span
              className="text-xs font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full"
              style={{
                background: cfg.gradient,
                color: '#fff',
                boxShadow: `0 2px 12px ${cfg.glow}`,
              }}
            >
              Logro Desbloqueado
            </span>

            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center "
              style={{
                boxShadow: `0 8px 24px ${cfg.glow}`,
              }}
            >
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={achievement.name}
                  className="h-20 w-20 rounded-xl object-contain"
                />
              ) : (
                <span className="text-3xl text-white">{achievement.name.slice(0, 2)}</span>
              )}
            </div>

            <h3
              className="text-xl font-bold text-grey-800 text-center leading-tight"
              style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
            >
              {achievement.name}
            </h3>

            {achievement.description && (
              <p
                className="text-sm text-grey-500 text-center leading-relaxed px-2"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {achievement.description}
              </p>
            )}

            <button
              onClick={handleClick}
              className="mt-2 px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: cfg.gradient,
                boxShadow: `0 4px 16px ${cfg.glow}`,
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes achievementShimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};
