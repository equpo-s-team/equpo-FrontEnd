import { Coins, Pencil, ShoppingCart, Trash2, Users, Zap } from 'lucide-react';

import { renderRewardIcon } from '@/features/shop/components/IconOrPhotoPicker.tsx';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';
import { cn } from '@/lib/utils/utils.ts';

interface RewardCardProps {
  reward: Reward;
  isAdmin: boolean;
  canBuy: boolean;
  disabledBuyReason?: string | null;
  showBuy: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onBuy: () => void;
}

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  team: {
    label: 'Equipo',
    className: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  },
  member: {
    label: 'Miembro',
    className: 'bg-blue/10 text-blue dark:bg-blue/20',
  },
  equpo: {
    label: 'Equpo',
    className: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
};

export function RewardCard({
  reward,
  isAdmin,
  canBuy,
  disabledBuyReason,
  showBuy,
  onClick,
  onEdit,
  onDelete,
  onBuy,
}: RewardCardProps) {
  const badge = TYPE_BADGE[reward.type] ?? TYPE_BADGE.member;
  const isObtained =
    reward.type === 'team' ? !!reward.teamRewardObtainedAt && !reward.teamRewardRedeemedAt : false;

  return (
    <div
      role="button"
      tabIndex={0}
      className="group relative rounded-2xl bg-white dark:bg-gray-800 border border-grey-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden w-full text-left"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Admin actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="w-7 h-7 rounded-lg bg-white/90 dark:bg-gray-700/90 border border-grey-150 dark:border-gray-600 flex items-center justify-center text-grey-400 hover:text-blue hover:border-blue/30 transition-all cursor-pointer"
          >
            <Pencil size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-7 h-7 rounded-lg bg-white/90 dark:bg-gray-700/90 border border-grey-150 dark:border-gray-600 flex items-center justify-center text-grey-400 hover:text-red hover:border-red/30 transition-all cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}

      {/* Obtained indicator */}
      {isObtained && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
          Obtenida
        </div>
      )}

      <div className="p-4 flex flex-col gap-3">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-secondary dark:bg-gray-700 flex items-center justify-center text-grey-500 dark:text-grey-400 overflow-hidden">
          {reward.iconURL ? (
            renderRewardIcon(reward.iconURL, 24, 'text-blue')
          ) : (
            <Zap size={20} className="text-grey-300" />
          )}
        </div>

        {/* Name + badge */}
        <div>
          <span
            className={cn(
              'inline-block mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
              badge.className,
            )}
          >
            {badge.label}
          </span>
          <p className="font-maxwell text-sm text-grey-800 dark:text-grey-200 leading-tight line-clamp-2">
            {reward.name}
          </p>
          {reward.description && (
            <p className="mt-1 text-xs text-grey-400 dark:text-grey-500 line-clamp-2 leading-relaxed">
              {reward.description}
            </p>
          )}
        </div>

        {/* Cost + XP footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-grey-50 dark:border-gray-700">
          <div className="flex items-center gap-1">
            <Coins size={13} className="text-orange-400" />
            <span className="text-xs font-bold text-orange-500 dark:text-orange-400">
              {reward.cost.toLocaleString()}
            </span>
          </div>
          {reward.type === 'member' && (reward.memberLedger?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1 text-grey-400">
              <Users size={11} />
              <span className="text-[10px] font-semibold">{reward.memberLedger!.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Zap size={11} className="text-yellow-500" />
            <span className="text-[10px] font-semibold text-grey-400 dark:text-grey-500">
              +{reward.experienceGranted} XP
            </span>
          </div>
        </div>

        {/* Buy button */}
        {showBuy && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBuy();
            }}
            disabled={!canBuy}
            title={disabledBuyReason ?? undefined}
            className={cn(
              'w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer',
              canBuy ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed',
            )}
            style={{ background: 'linear-gradient(135deg, #60AFFF, #9b7fe1)' }}
          >
            <ShoppingCart size={12} />
            Comprar
          </button>
        )}
      </div>
    </div>
  );
}
