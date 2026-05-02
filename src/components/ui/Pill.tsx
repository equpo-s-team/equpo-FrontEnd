import { type pillProp } from '@/features/board/types';

export function Pill({ active, children, onClick, className = '' }: pillProp) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-full border-[1.5px]
        font-body text-[12px] cursor-pointer whitespace-nowrap select-none
        transition-all duration-200
        ${active ? 'border-blue text-blue bg-blue/8 dark:bg-blue/90' : 'border-grey-200 dark:border-gray-600 text-grey-500 bg-primary dark:bg-gray-800 hover:border-blue hover:text-blue hover:bg-blue/5'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
