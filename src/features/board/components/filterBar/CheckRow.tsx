import { type checkRowProp } from '@/features/board/types';

export function CheckRow({ label, icon, checked, onClick }: checkRowProp) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors duration-150 ${checked ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-grey-50 dark:hover:bg-gray-700'}`}
    >
      {icon && <span className="text-xs shrink-0">{icon}</span>}
      <span className="flex-1 text-left text-xs font-medium text-grey-800 dark:text-gray-200">{label}</span>
      <div
        className={`w-4 h-4 rounded border flex items-center justify-center text-xs shrink-0 transition-all duration-150 ${checked ? 'bg-blue-500 border-blue-500 text-white' : 'border-grey-300 dark:border-gray-600'}`}
      >
        {checked && '✓'}
      </div>
    </button>
  );
}
