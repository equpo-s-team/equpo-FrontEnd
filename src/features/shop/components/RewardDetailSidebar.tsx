import { Coins, Loader2, ShieldCheck, ShoppingCart, X, Zap } from 'lucide-react';

import { SidebarSheet } from '@/components/ui/sidebar-sheet.tsx';
import { toastError, toastSuccess } from '@/components/ui/toast.ts';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { renderRewardIcon } from '@/features/shop/components/IconOrPhotoPicker.tsx';
import { usePurchaseReward } from '@/features/shop/hooks/usePurchaseReward.ts';
import { useRedeemReward } from '@/features/shop/hooks/useRedeemReward.ts';
import type { MemberLedgerEntry, Reward } from '@/features/shop/types/rewardTypes.ts';

type MyRole = 'leader' | 'collaborator' | 'member' | 'spectator' | null;

interface RewardDetailSidebarProps {
  reward: Reward | null;
  teamId: string;
  myRole: MyRole;
  teamVirtualCurrency: number;
  myMembershipCurrency: number | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function RewardDetailSidebar({
  reward,
  teamId,
  myRole,
  teamVirtualCurrency,
  myMembershipCurrency,
  isOpen,
  onClose,
}: RewardDetailSidebarProps) {
  const purchase = usePurchaseReward();
  const redeem = useRedeemReward();

  if (!reward) return null;

  const isAdmin = myRole === 'leader' || myRole === 'collaborator';
  const isLeader = myRole === 'leader';
  const isSpectator = myRole === 'spectator';

  const canBuyTeam = isLeader && reward.type === 'team';
  const canBuyMember = !isSpectator && reward.type === 'member';

  const insufficientTeamFunds = teamVirtualCurrency < reward.cost;
  const insufficientMemberFunds =
    myMembershipCurrency !== null && myMembershipCurrency < reward.cost;

  // Team reward is "locked" if already obtained and not yet redeemed
  const teamRewardLocked =
    reward.type === 'team' && !!reward.teamRewardObtainedAt && !reward.teamRewardRedeemedAt;

  const handlePurchase = async () => {
    try {
      await purchase.mutateAsync({ teamId, reward });
      toastSuccess(
        '¡Compra exitosa!',
        reward.type === 'team'
          ? 'La recompensa fue obtenida para el equipo. ¡Todos reciben XP!'
          : `¡Obtuviste "${reward.name}"!`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al comprar';
      toastError('Error al comprar', msg);
    }
  };

  const handleRedeemTeam = async () => {
    try {
      await redeem.mutateAsync({ teamId, reward });
      toastSuccess('Recompensa canjeada', `"${reward.name}" marcada como canjeada.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al canjear';
      toastError('Error', msg);
    }
  };

  const handleRedeemMember = async (entry: MemberLedgerEntry) => {
    try {
      await redeem.mutateAsync({ teamId, reward, userUid: entry.userUid });
      toastSuccess(
        'Recompensa canjeada',
        `La recompensa de ${entry.displayName ?? entry.userUid} fue marcada como canjeada.`,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al canjear';
      toastError('Error', msg);
    }
  };

  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <SidebarSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      side="right"
      overlayClassName="z-[60]"
      contentClassName="z-[60] h-full w-full sm:w-[440px] bg-white dark:bg-gray-800 border-l border-grey-150 dark:border-gray-600 shadow-card-lg flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-grey-150 dark:border-gray-600">
        <h2 className="font-maxwell text-base font-bold text-grey-800 dark:text-grey-200 tracking-wide truncate pr-2">
          {reward.name}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-grey-400 dark:text-grey-500 hover:text-grey-700 dark:hover:text-grey-300 hover:bg-secondary dark:hover:bg-gray-700 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Icon + meta */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-secondary dark:bg-gray-700 flex items-center justify-center text-blue shrink-0 overflow-hidden">
            {reward.iconURL ? (
              renderRewardIcon(reward.iconURL, 32, 'text-blue')
            ) : (
              <Zap size={28} className="text-grey-300" />
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            {reward.description && (
              <p className="text-sm text-grey-500 dark:text-grey-400 leading-relaxed">
                {reward.description}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-yellow-50 border border-orange-200 dark:bg-yellow-900/20 dark:border-orange-700">
                <Coins size={12} className="text-orange-400" />
                <span className="text-xs font-bold text-orange-500 dark:text-orange-400">
                  {reward.cost.toLocaleString()} monedas
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary dark:bg-gray-700">
                <Zap size={12} className="text-yellow-500" />
                <span className="text-xs font-semibold text-grey-500 dark:text-grey-400">
                  +{reward.experienceGranted} XP
                  {reward.type === 'team' ? ' (a todos)' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team reward status */}
        {reward.type === 'team' && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500">
              Estado del equipo
            </p>
            {reward.teamRewardObtainedAt ? (
              <div className="p-3 rounded-xl border border-grey-100 dark:border-gray-700 bg-secondary/50 dark:bg-gray-700/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-grey-500 dark:text-grey-400">
                    Obtenida el {formatDate(reward.teamRewardObtainedAt)}
                  </span>
                </div>
                {reward.teamRewardRedeemedAt ? (
                  <span className="text-xs font-semibold text-green-500">
                    Canjeada el {formatDate(reward.teamRewardRedeemedAt)}
                  </span>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-yellow-500">
                      Pendiente de canjear
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => void handleRedeemTeam()}
                        disabled={redeem.isPending}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {redeem.isPending ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <ShieldCheck size={10} />
                        )}
                        Canjear
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-grey-400 dark:text-grey-500 italic">
                El equipo aún no ha obtenido esta recompensa.
              </p>
            )}
          </div>
        )}

        {/* Member ledger */}
        {reward.type === 'member' && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-grey-400 dark:text-grey-500">
              Miembros con esta recompensa
            </p>
            {(reward.memberLedger?.length ?? 0) === 0 ? (
              <p className="text-xs text-grey-400 dark:text-grey-500 italic">
                Nadie ha obtenido esta recompensa aún.
              </p>
            ) : (
              <div className="space-y-2">
                {reward.memberLedger!.map((entry) => (
                  <div
                    key={entry.userUid}
                    className="flex items-center gap-3 p-3 rounded-xl border border-grey-100 dark:border-gray-700 bg-secondary/50 dark:bg-gray-700/50"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      <UserAvatar
                        src={entry.photoUrl}
                        alt={entry.displayName ?? entry.userUid}
                        className="w-full h-full"
                        fallbackClassName="text-white text-xs"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-grey-800 dark:text-grey-200 truncate">
                        {entry.displayName ?? entry.userUid}
                      </p>
                      <p className="text-[10px] text-grey-400 dark:text-grey-500">
                        {formatDate(entry.dateObtained)}
                      </p>
                    </div>
                    {entry.redeemedAt ? (
                      <span className="text-[10px] font-bold text-green-500 shrink-0">
                        Canjeado
                      </span>
                    ) : isAdmin ? (
                      <button
                        type="button"
                        onClick={() => void handleRedeemMember(entry)}
                        disabled={redeem.isPending}
                        className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-all cursor-pointer"
                      >
                        {redeem.isPending ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <ShieldCheck size={10} />
                        )}
                        Canjear
                      </button>
                    ) : (
                      <span className="text-[10px] text-yellow-500 font-semibold shrink-0">
                        Pendiente
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spectator notice */}
        {isSpectator && (
          <p className="text-xs text-grey-400 dark:text-grey-500 text-center italic">
            Los espectadores pueden ver la tienda pero no comprar recompensas.
          </p>
        )}
      </div>

      {/* Footer — buy button */}
      {(canBuyTeam || canBuyMember) && (
        <div className="px-6 py-4 border-t border-grey-150 dark:border-gray-600">
          {canBuyTeam && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => void handlePurchase()}
                disabled={purchase.isPending || insufficientTeamFunds || teamRewardLocked}
                title={
                  teamRewardLocked
                    ? 'Ya obtenida, canjéala primero'
                    : insufficientTeamFunds
                      ? 'El equipo no tiene suficientes monedas'
                      : undefined
                }
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: accent }}
              >
                {purchase.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShoppingCart size={14} />
                )}
                Comprar con monedas del equipo ({reward.cost.toLocaleString()})
              </button>
              {insufficientTeamFunds && (
                <p className="text-[10px] text-red text-center">
                  El equipo no tiene suficientes monedas.
                </p>
              )}
            </div>
          )}

          {canBuyMember && (
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => void handlePurchase()}
                disabled={purchase.isPending || insufficientMemberFunds}
                title={insufficientMemberFunds ? 'No tienes suficientes monedas' : undefined}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: accent }}
              >
                {purchase.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ShoppingCart size={14} />
                )}
                Comprar ({reward.cost.toLocaleString()} monedas)
              </button>
              {insufficientMemberFunds && (
                <p className="text-[10px] text-red text-center">
                  No tienes suficientes monedas de membresía.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </SidebarSheet>
  );
}
