import { Plus } from 'lucide-react';
import { useState } from 'react';

import { AppHeader } from '@/components/ui/app-header.tsx';
import { CoinPill } from '@/components/ui/CoinPill.tsx';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog.tsx';
import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import { useAuth } from '@/context/AuthContext.tsx';
import { useTeam } from '@/context/TeamContext.tsx';
import { RewardDetailSidebar } from '@/features/shop/components/RewardDetailSidebar.tsx';
import { RewardEmptyState } from '@/features/shop/components/RewardEmptyState.tsx';
import { RewardFormSidebar } from '@/features/shop/components/RewardFormSidebar.tsx';
import { RewardGrid } from '@/features/shop/components/RewardGrid.tsx';
import { ShopFilterTabs } from '@/features/shop/components/ShopFilterTabs.tsx';
import { useDeleteReward } from '@/features/shop/hooks/useDeleteReward.ts';
import { usePurchaseReward } from '@/features/shop/hooks/usePurchaseReward.ts';
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
  const [rewardToDelete, setRewardToDelete] = useState<Reward | null>(null);
  const [rewardToBuy, setRewardToBuy] = useState<Reward | null>(null);

  const deleteReward = useDeleteReward();
  const purchase = usePurchaseReward();

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

  const handleDeleteConfirm = async () => {
    if (!rewardToDelete) return;
    try {
      await deleteReward.mutateAsync({ teamId, rewardId: rewardToDelete.id });
      toastSuccess('Recompensa eliminada', `"${rewardToDelete.name}" fue eliminada.`);
      if (detailReward?.id === rewardToDelete.id) setIsDetailOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar';
      toastError('Error', msg);
    } finally {
      setRewardToDelete(null);
    }
  };

  const handleBuyConfirm = async () => {
    if (!rewardToBuy) return;
    try {
      await purchase.mutateAsync({ teamId, reward: rewardToBuy });
      toastSuccess(
        '¡Compra exitosa!',
        rewardToBuy.type === 'team'
          ? 'La recompensa fue obtenida para el equipo. ¡Todos reciben XP!'
          : `¡Obtuviste "${rewardToBuy.name}"!`,
      );
      if (detailReward?.id === rewardToBuy.id) setIsDetailOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al comprar';
      toastError('Error al comprar', msg);
    } finally {
      setRewardToBuy(null);
    }
  };

  const getBuyState = (reward: Reward) => {
    if (reward.type === 'equpo') return { canBuy: false, disabledReason: null, showBuy: false };

    const isLeader = myRole === 'leader';
    const isSpectator = myRole === 'spectator';
    const teamRewardLocked =
      reward.type === 'team' && !!reward.teamRewardObtainedAt && !reward.teamRewardRedeemedAt;

    if (reward.type === 'team') {
      if (!isLeader) return { canBuy: false, disabledReason: null, showBuy: false };
      if (teamRewardLocked)
        return { canBuy: false, disabledReason: 'Ya obtenida, canjéala primero', showBuy: true };
      if (teamVirtualCurrency < reward.cost)
        return {
          canBuy: false,
          disabledReason: 'El equipo no tiene suficientes monedas',
          showBuy: true,
        };
      return { canBuy: true, disabledReason: null, showBuy: true };
    }

    // member type
    if (isSpectator) return { canBuy: false, disabledReason: null, showBuy: false };
    if (myMembershipCurrency !== null && myMembershipCurrency < reward.cost)
      return {
        canBuy: false,
        disabledReason: 'No tienes suficientes monedas de membresía',
        showBuy: true,
      };
    return { canBuy: true, disabledReason: null, showBuy: true };
  };

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  if (isLoading) {
    return (
      <>
        <AppHeader title="Tienda" variant="orange" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div
            className="w-8 h-8 rounded-full border-4 border-grey-200 animate-spin"
            style={{ borderTopColor: '#60AFFF' }}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Tienda" variant="orange" />

      <div className="flex flex-col gap-5 px-4 md:px-8 py-5">
        {/* Wallets + add button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-1.5 w-10 h-10 sm:w-auto sm:h-auto justify-center rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
                style={{ background: accent }}
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Agregar recompensa</span>
              </button>
            )}
            <CoinPill amount={teamVirtualCurrency} label="Equipo" variant="team" />
            {myMembershipCurrency !== null && (
              <CoinPill amount={myMembershipCurrency} label="Mi billetera" variant="member" />
            )}
          </div>
        </div>

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
            onDelete={(r) => setRewardToDelete(r)}
            onBuy={(r) => setRewardToBuy(r)}
            getBuyState={getBuyState}
          />
        )}
      </div>

      <RewardFormSidebar
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={formReward !== 'new' ? formReward : null}
      />

      <RewardDetailSidebar
        reward={detailReward}
        teamId={teamId}
        myRole={myRole}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <ConfirmDialog
        open={rewardToDelete !== null}
        title="¿Eliminar recompensa?"
        description={
          rewardToDelete
            ? `"${rewardToDelete.name}" será eliminada permanentemente. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        variant="destructive"
        isPending={deleteReward.isPending}
        onConfirm={() => void handleDeleteConfirm()}
        onCancel={() => setRewardToDelete(null)}
      />

      <ConfirmDialog
        open={rewardToBuy !== null}
        title="¿Confirmar compra?"
        description={
          rewardToBuy
            ? `"${rewardToBuy.name}" — ${rewardToBuy.cost.toLocaleString()} monedas${rewardToBuy.type === 'team' ? ' del equipo' : ' de membresía'}.`
            : undefined
        }
        confirmLabel="Comprar"
        variant="default"
        isPending={purchase.isPending}
        onConfirm={() => void handleBuyConfirm()}
        onCancel={() => setRewardToBuy(null)}
      />
    </>
  );
}
