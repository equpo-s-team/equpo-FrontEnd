import { ShoppingBag } from 'lucide-react';

import { EmptyState } from '@/components/ui/EmptyState.tsx';

interface RewardEmptyStateProps {
  isAdmin: boolean;
  onAddReward: () => void;
}

export function RewardEmptyState({ isAdmin, onAddReward }: RewardEmptyStateProps) {
  return (
    <EmptyState
      icon={ShoppingBag}
      title="La tienda está vacía"
      description={
        isAdmin
          ? 'Crea recompensas para motivar a tu equipo.'
          : 'Aún no hay recompensas disponibles. Espera a que el líder las agregue.'
      }
      size="lg"
      action={isAdmin ? { label: 'Agregar recompensa', onClick: onAddReward } : undefined}
    />
  );
}
