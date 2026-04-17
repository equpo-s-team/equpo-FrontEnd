import {
  BowArrow,
  Flame,
  Globe,
  Goal,
  Handshake,
  Rocket,
  Sparkles,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

import {type Achievement} from "@/features/team/types";


const BADGE_COLORS = [
  { gradient: 'linear-gradient(135deg,#60AFFF,#86F0FD)', glow: 'rgba(96,175,255,0.3)', border: 'rgba(96,175,255,0.25)' },
  { gradient: 'linear-gradient(135deg,#9b7fe1,#5961F9)', glow: 'rgba(155,127,225,0.3)', border: 'rgba(155,127,225,0.25)' },
  { gradient: 'linear-gradient(135deg,#9CEDC1,#CEFB7C)', glow: 'rgba(156,237,193,0.3)', border: 'rgba(156,237,193,0.25)' },
  { gradient: 'linear-gradient(135deg,#F65A70,#FFAF93)', glow: 'rgba(246,90,112,0.3)', border: 'rgba(246,90,112,0.25)' },
  { gradient: 'linear-gradient(135deg,#FF94AE,#FCE98D)', glow: 'rgba(255,148,174,0.3)', border: 'rgba(255,148,174,0.25)' },
];

interface AchievementBadgeProps {
  achievement: Achievement;
}

const LUCIDE_ICON_MAP = {
  rocket: Rocket,
  handshake: Handshake,
  'bow-arrow': BowArrow,
  goal: Goal,
  zap: Zap,
  sparkles: Sparkles,
  globe: Globe,
  flame: Flame,
} as const;

function hashToIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % BADGE_COLORS.length;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const cfg = BADGE_COLORS[hashToIndex(achievement.id)];
  const isLocked = !achievement.unlockedAt;
  const Icon = LUCIDE_ICON_MAP[achievement.icon.toLowerCase() as keyof typeof LUCIDE_ICON_MAP];

  const openModal = () => {
    setShowModal(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setShowModal(false), 200);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="group flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 cursor-pointer"
        style={{
          borderColor: isLocked ? 'rgba(0,0,0,0.06)' : 'transparent',
          background: isLocked ? 'rgba(250,250,248,0.6)' : cfg.gradient,
          boxShadow: isLocked ? 'none' : `0 6px 18px ${cfg.glow}`,
        }}
        onMouseEnter={(e) => {
          if (!isLocked) {
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${cfg.glow}`;
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = isLocked ? 'none' : `0 4px 16px ${cfg.glow}`;
        }}
        title={achievement.name}
      >
        {/* Icon */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform duration-200 group-hover:scale-110"
          style={{
            filter: isLocked ? 'grayscale(1) opacity(0.4)' : 'none',
            color: isLocked ? '#B0ADA7' : '#FFFFFF',
          }}
        >
          {Icon ? <Icon size={48} strokeWidth={2.25} /> : achievement.icon}
        </div>

        {/* Name */}
        <p className={`text-sm font-semibold text-center leading-tight w-full font-body ${
          isLocked ? 'text-grey-400' : 'text-white/95'
        }`}>
          {achievement.name.length > 14 ? `${achievement.name.substring(0, 13)}…` : achievement.name}
        </p>

        {/* Locked indicator */}
        {isLocked && (
          <span className="text-xs text-grey-300">🔒</span>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Cerrar detalle del logro"
            className={`absolute inset-0 bg-grey-900/30 backdrop-blur-sm transition-opacity duration-200 ${modalVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={closeModal}
          />

          {/* Card */}
          <div
            className={`relative rounded-2xl p-[1px] w-full max-w-xs transition-all duration-200 ${modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            style={{
              background: isLocked
                ? 'linear-gradient(135deg,rgba(176,173,167,0.3),rgba(176,173,167,0.1))'
                : cfg.gradient,
              boxShadow: isLocked ? '0 20px 60px rgba(0,0,0,0.12)' : `0 20px 60px ${cfg.glow}, 0 4px 16px rgba(0,0,0,0.08)`,
            }}
          >
            <div className="rounded-2xl bg-white/95 backdrop-blur-xl p-6 flex flex-col gap-4">
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-grey-100 hover:bg-grey-200 flex items-center justify-center text-grey-500 text-xs transition-colors"
              >
                ✕
              </button>

              {/* Icon large */}
              <div className="flex flex-col items-center gap-3 pt-1">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                  style={{
                    background: isLocked
                      ? 'rgba(204,202,197,0.2)'
                      : cfg.gradient,
                    filter: isLocked ? 'grayscale(1) opacity(0.5)' : 'none',
                    boxShadow: isLocked ? 'none' : `0 4px 20px ${cfg.glow}`,
                    color: isLocked ? '#B0ADA7' : '#FFFFFF',
                  }}
                >
                  {Icon ? <Icon size={30} strokeWidth={2.25} /> : achievement.icon}
                </div>

                <div className="text-center">
                  <h3
                    className="font-bold text-grey-800 text-base leading-tight"
                    style={{ fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.02em' }}
                  >
                    {achievement.name}
                  </h3>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-grey-400 mt-0.5">
                      Desbloqueado{' '}
                      {new Date(achievement.unlockedAt).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                  {isLocked && (
                    <p className="text-xs text-grey-300 mt-0.5">Aún no desbloqueado</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <p
                className="text-xs text-grey-500 leading-relaxed text-center px-2"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {achievement.description}
              </p>

              {/* Status badge */}
              <div className="flex justify-center">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: isLocked
                      ? 'rgba(176,173,167,0.15)'
                      : cfg.glow.replace('0.3', '0.12'),
                    color: isLocked ? '#B0ADA7' : '#524F4A',
                    border: `1px solid ${isLocked ? 'rgba(176,173,167,0.2)' : cfg.border}`,
                  }}
                >
                  {isLocked ? '🔒 Bloqueado' : '✦ Conseguido'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
