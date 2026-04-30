import {type checkRowProp} from "@/features/board/types";

export function CheckRow({ label, icon, checked, onClick }: checkRowProp) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors duration-150 ${checked ? 'bg-blue/6' : 'hover:bg-grey-50'}`}
    >
      {icon && <span className="text-[13px] shrink-0">{icon}</span>}
      <span className="flex-1 text-left text-[13px] font-medium text-grey-800">{label}</span>
      <div
        className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center text-[10px] shrink-0 transition-all duration-150 ${checked ? 'bg-blue border-blue text-white' : 'border-grey-300'}`}
      >
        {checked && '✓'}
      </div>
    </button>
  );
}
