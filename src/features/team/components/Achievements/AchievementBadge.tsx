import { CircleX } from 'lucide-react';
import React, { useState } from 'react';

import { type Achievement } from '@/features/team/types';
import { cn } from '@/lib/utils/utils.ts';

interface AchievementBadgeProps {
  achievement: Achievement;
}

function isImageSource(value: string): boolean {
  return /^(https?:\/\/|\/|\.\/|\.\.\/|data:image\/)/i.test(value);
}

function resolveAchievementImage(achievement: Achievement): string | null {
  if (achievement.iconUrl) return achievement.iconUrl;
  if (achievement.icon && isImageSource(achievement.icon)) return achievement.icon;
  return null;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const isLocked = !achievement.unlockedAt;
  const imageSrc = resolveAchievementImage(achievement);

  const displayName =
    achievement.name.charAt(0).toUpperCase() + achievement.name.slice(1).replace(/-/g, ' ');

  const subtitle = achievement.unlockedAt
    ? `Desbloqueado ${new Date(achievement.unlockedAt).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })}`
    : 'Aun no desbloqueado';

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
        type="button"
        onClick={openModal}
        className="group flex h-28 sm:h-32 lg:h-36 flex-col items-center gap-1 sm:gap-2 p-1.5 sm:p-2 transition-all duration-200"
        title={displayName}
      >
        <div className="flex-1 w-full overflow-hidden rounded-xl">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={displayName}
              className="h-full w-full object-contain"
              style={{
                filter: isLocked ? 'grayscale(1)' : 'none',
                opacity: isLocked ? 0.55 : 1,
              }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase text-grey-500"
              style={{
                filter: isLocked ? 'grayscale(1)' : 'none',
                opacity: isLocked ? 0.55 : 1,
              }}
            >
              {displayName.slice(0, 2)}
            </div>
          )}
        </div>

        {/* Name */}
        <p
          className={cn(
            'w-full text-center text-xs font-semibold leading-tight font-body line-clamp-2',
            isLocked ? 'text-grey-400' : 'text-secondary-foreground dark:text-white',
          )}
        >
          {displayName}
        </p>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-8">
          <button
            type="button"
            aria-label="Cerrar detalle del logro"
            className={cn(
              'absolute inset-0 bg-grey-900/30 backdrop-blur-sm transition-opacity duration-200',
              modalVisible ? 'opacity-100' : 'opacity-0',
            )}
            onClick={closeModal}
          />

          <section
            className={cn(
              'relative w-full max-w-sm max-h-sm rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card-lg transition-all duration-200',
              modalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
            )}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-grey-100 dark:bg-transparent text-xs text-grey-500 transition-colors hover:bg-grey-200"
            >
              <CircleX size={20} />
            </button>

            <div className="flex flex-col items-center gap-3">
              <div className="h-24 w-24 overflow-hidden rounded-2xl ">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={displayName}
                    className="h-full w-full object-contain"
                    style={{
                      filter: isLocked ? 'grayscale(1)' : 'none',
                      opacity: isLocked ? 0.55 : 1,
                    }}
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center text-base font-semibold uppercase text-grey-500"
                    style={{
                      filter: isLocked ? 'grayscale(1)' : 'none',
                      opacity: isLocked ? 0.55 : 1,
                    }}
                  >
                    {displayName.slice(0, 2)}
                  </div>
                )}
              </div>

              <h3 className="text-center text-base font-bold text-grey-800 dark:text-gray-300 font-body">
                {isLocked ? '???' : displayName}
              </h3>
              <p className="text-center text-xs text-grey-400">{subtitle}</p>
              <p className="px-2 text-center text-xs leading-relaxed text-grey-500">
                {isLocked
                  ? 'Completa el desafio para descubrir este logro.'
                  : achievement.description}
              </p>
            </div>
          </section>
        </div>
      )}
    </>
  );
};
