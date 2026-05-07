import { Plus, ShoppingBag } from 'lucide-react';

import { CoinPill } from '@/components/ui/CoinPill.tsx';

interface ShopHeaderProps {
  teamName: string;
  teamVirtualCurrency: number;
  myMembershipCurrency: number | null;
  isAdmin: boolean;
  onAddReward: () => void;
}

export function ShopHeader({
  teamName,
  teamVirtualCurrency,
  myMembershipCurrency,
  isAdmin,
  onAddReward,
}: ShopHeaderProps) {
  const accent = 'linear-gradient(135deg, #60AFFF, #9b7fe1)';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-grey-100 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
          style={{ background: accent }}
        >
          <ShoppingBag size={18} />
        </div>
        <div>
          <h1 className="font-maxwell text-lg text-grey-800 dark:text-grey-200 leading-tight">
            Tienda
          </h1>
          <p className="text-xs text-grey-400 dark:text-grey-500 font-body">{teamName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <CoinPill amount={teamVirtualCurrency} label="Equipo" variant="team" />
        {myMembershipCurrency !== null && (
          <CoinPill amount={myMembershipCurrency} label="Mi billetera" variant="member" />
        )}
        {isAdmin && (
          <button
            type="button"
            onClick={onAddReward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: accent }}
          >
            <Plus size={13} />
            Agregar
          </button>
        )}
      </div>
    </div>
  );
}
