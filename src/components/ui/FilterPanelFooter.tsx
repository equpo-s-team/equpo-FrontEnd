import { type panelFooterProp } from '@/features/board/types';

export function FilterPanelFooter({ onClear, onApply }: panelFooterProp) {
  return (
    <div className="px-3 py-2 border-t border-grey-100 flex justify-between items-center">
      <button
        onClick={onClear}
        className="text-[12px] text-grey-400 hover:text-red transition-colors font-body cursor-pointer"
      >
        Limpiar
      </button>
      <button
        onClick={onApply}
        className="text-[12px] font-semibold text-blue bg-blue/8 border border-blue/25 px-3 py-1 rounded-lg hover:bg-blue/14 transition-colors font-body cursor-pointer"
      >
        Aplicar
      </button>
    </div>
  );
}
