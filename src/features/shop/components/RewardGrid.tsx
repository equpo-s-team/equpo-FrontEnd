import { RewardCard } from '@/features/shop/components/RewardCard.tsx';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';

export interface BuyState {
  canBuy: boolean;
  disabledReason: string | null;
  showBuy: boolean;
}

interface RewardGridProps {
  rewards: Reward[];
  isAdmin: boolean;
  onCardClick: (reward: Reward) => void;
  onEdit: (reward: Reward) => void;
  onDelete: (reward: Reward) => void;
  onBuy: (reward: Reward) => void;
  getBuyState: (reward: Reward) => BuyState;
}

export function RewardGrid({
  rewards,
  isAdmin,
  onCardClick,
  onEdit,
  onDelete,
  onBuy,
  getBuyState,
}: RewardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {rewards.map((reward) => {
        const { canBuy, disabledReason, showBuy } = getBuyState(reward);
        return (
          <RewardCard
            key={reward.id}
            reward={reward}
            isAdmin={isAdmin}
            canBuy={canBuy}
            disabledBuyReason={disabledReason}
            showBuy={showBuy}
            onClick={() => onCardClick(reward)}
            onEdit={() => onEdit(reward)}
            onDelete={() => onDelete(reward)}
            onBuy={() => onBuy(reward)}
          />
        );
      })}
    </div>
  );
}
