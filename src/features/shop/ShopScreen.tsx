import { useState } from 'react';

import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import { useAuth } from '@/context/AuthContext.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { RewardDetailSidebar } from '@/features/shop/components/RewardDetailSidebar.tsx';
import { RewardEmptyState } from '@/features/shop/components/RewardEmptyState.tsx';
import { RewardFormSidebar } from '@/features/shop/components/RewardFormSidebar.tsx';
import { RewardGrid } from '@/features/shop/components/RewardGrid.tsx';
import { ShopFilterTabs } from '@/features/shop/components/ShopFilterTabs.tsx';
import { ShopHeader } from '@/features/shop/components/ShopHeader.tsx';
import { useDeleteReward } from '@/features/shop/hooks/useDeleteReward.ts';
import { useRewards } from '@/features/shop/hooks/useRewards.ts';
import type { Reward, RewardType } from '@/features/shop/types/rewardTypes.ts';
import { useTeams } from '@/features/team/hooks/useTeams.ts';

export default function ShopScreen() {
  const { user } = useAuth();
  const { teamId: rawTeamId } = useTeam();
  const teamId = rawTeamId ?? '';
  const { data: teams = [] } = useTeams();
  const { data, isLoading } = useRewards(teamId);

  const [filterTab, setFilterTab] = useState<RewardType | 'all'>('all');
  const [detailReward, setDetailReward] = useState<Reward | null>(null);
  const [formReward, setFormReward] = useState<Reward | null | 'new'>('new');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const deleteReward = useDeleteReward();

  const activeTeam = teams.find((t) => t.id === teamId);
  const myRole = (() => {
    if (!activeTeam || !user?.uid) return null;
    if (activeTeam.leaderUid === user.uid) return 'leader';
    return activeTeam.members.find((m) => m.userUid === user.uid)?.role ?? null;
  })();

  const isAdmin = myRole === 'leader' || myRole === 'collaborator';
  const rewards = data?.rewards ?? [];
  const myMembershipCurrency = data?.myMembershipCurrency ?? null;
  const teamVirtualCurrency = activeTeam?.virtualCurrency ?? 0;

  const hasEqupo = rewards.some((r) => r.type === 'equpo');
  const filtered = filterTab === 'all' ? rewards : rewards.filter((r) => r.type === filterTab);

  const handleOpenCreate = () => {
    setFormReward('new');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (reward: Reward) => {
    setFormReward(reward);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (reward: Reward) => {
    setDetailReward(reward);
    setIsDetailOpen(true);
  };

  const handleDelete = async (reward: Reward) => {
    if (!confirm(`¿Eliminar "${reward.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteReward.mutateAsync({ teamId, rewardId: reward.id });
      toastSuccess('Recompensa eliminada', `"${reward.name}" fue eliminada.`);
      if (detailReward?.id === reward.id) setIsDetailOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      toastError('Error', msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-8 h-8 rounded-full border-4 border-grey-200 animate-spin"
          style={{ borderTopColor: '#60AFFF' }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-7xl mx-auto">
      <ShopHeader
        teamName={activeTeam?.name ?? ''}
        teamVirtualCurrency={teamVirtualCurrency}
        myMembershipCurrency={myMembershipCurrency}
        isAdmin={isAdmin}
        onAddReward={handleOpenCreate}
      />

      {rewards.length > 0 && (
        <ShopFilterTabs active={filterTab} hasEqupo={hasEqupo} onChange={setFilterTab} />
      )}

      {filtered.length === 0 ? (
        <RewardEmptyState isAdmin={isAdmin} onAddReward={handleOpenCreate} />
      ) : (
        <RewardGrid
          rewards={filtered}
          isAdmin={isAdmin}
          onCardClick={handleOpenDetail}
          onEdit={handleOpenEdit}
          onDelete={(r) => void handleDelete(r)}
        />
      )}

      <RewardFormSidebar
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={formReward !== 'new' ? formReward : null}
      />

      <RewardDetailSidebar
        reward={detailReward}
        teamId={teamId}
        myRole={myRole}
        teamVirtualCurrency={teamVirtualCurrency}
        myMembershipCurrency={myMembershipCurrency}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
