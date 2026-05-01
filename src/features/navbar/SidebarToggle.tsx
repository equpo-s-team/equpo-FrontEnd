import { ChevronsLeft } from 'lucide-react';

import { AppTooltip } from '@/components/ui/AppTooltip.tsx';

import { useSidebar } from './SidebarContext.tsx';

export default function SidebarToggle() {
  const { collapsed, toggle } = useSidebar();

  return (
    <AppTooltip content={collapsed ? 'Expandir menú' : 'Colapsar menú'} side="right">
      <button
        onClick={toggle}
        className="
                group w-full flex items-center justify-center gap-2 px-3 py-2
                text-purple hover:text-purple-foreground
                transition-all duration-200
            "
      >
        <ChevronsLeft
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        />
        <span
          className={`text-xs font-maxwell font-semibold tracking-widest ${collapsed ? 'hidden' : ''} `}
        >
          colapsar
        </span>
      </button>
    </AppTooltip>
  );
}
