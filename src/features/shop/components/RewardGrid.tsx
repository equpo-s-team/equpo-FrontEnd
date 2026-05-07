import { RewardCard } from '@/features/shop/components/RewardCard.tsx';
import type { Reward } from '@/features/shop/types/rewardTypes.ts';

interface RewardGridProps {
  rewards: Reward[];
  isAdmin: boolean;
  onCardClick: (reward: Reward) => void;
  onEdit: (reward: Reward) => void;
  onDelete: (reward: Reward) => void;
}

export function RewardGrid({ rewards, isAdmin, onCardClick, onEdit, onDelete }: RewardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {rewards.map((reward) => (
        <RewardCard
          key={reward.id}
          reward={reward}
          isAdmin={isAdmin}
          onClick={() => onCardClick(reward)}
          onEdit={() => onEdit(reward)}
          onDelete={() => onDelete(reward)}
        />
      ))}
    </div>
  );
}
