import { ChartColumnBig, Settings, SquareArrowRightExit, Users } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { logOut } from '@/context/AuthContext.tsx';
import { useTeam } from '@/context/TeamContext';

import { useSidebar } from './SidebarContext';

interface UserActionsMenuProps {
  trigger: React.ReactNode;
  variant?: 'mobile' | 'desktop';
  tooltip?: string;
}

export default function UserActionsMenu({
  trigger,
  variant = 'desktop',
  tooltip,
}: UserActionsMenuProps) {
  const { setActiveItem } = useSidebar();
  const { canAccessSettings } = useTeam();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const contentWidth = variant === 'mobile' ? 'w-52' : 'w-44';

  const dropdownTrigger = tooltip ? (
    <TooltipProvider delayDuration={400}>
      <Tooltip open={dropdownOpen ? false : undefined}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 border-0 font-body"
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
  );

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      {dropdownTrigger}
      <DropdownMenuContent
        side="top"
        align={variant === 'mobile' ? 'center' : 'end'}
        sideOffset={8}
        className={`${contentWidth} bg-white dark:bg-gray-700 border border-grey-150 dark:border-gray-600 rounded-xl shadow-card py-1`}
      >
        {variant === 'mobile' && (
          <>
            <DropdownMenuItem
              onClick={() => setActiveItem('reports')}
              className="px-3 py-2.5 text-sm text-grey-700 dark:text-gray-300 hover:bg-grey-50 dark:hover:bg-gray-600 font-medium gap-2 cursor-pointer"
            >
              <ChartColumnBig size={16} className="text-grey-400 dark:text-gray-400" />
              <span>Reportes</span>
            </DropdownMenuItem>

            {canAccessSettings && (
              <DropdownMenuItem
                onClick={() => setActiveItem('settings')}
                className="px-3 py-2.5 text-sm text-grey-700 dark:text-gray-300 hover:bg-grey-50 dark:hover:bg-gray-600 font-medium gap-2 cursor-pointer"
              >
                <Settings size={16} className="text-grey-400 dark:text-gray-400" />
                <span>Ajustes</span>
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuItem
          onClick={() => void navigate('/teams')}
          className="px-3 py-2.5 text-sm text-grey-700 dark:text-gray-300 hover:bg-grey-50 dark:hover:bg-gray-600 font-medium gap-2 cursor-pointer"
        >
          <Users size={16} className="text-grey-400 dark:text-gray-400" />
          <span>Mis Equipos</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-grey-100 dark:bg-gray-600" />

        <DropdownMenuItem
          onClick={() => void logOut()}
          className="px-3 py-2.5 text-sm text-red hover:bg-red-50 dark:hover:bg-gray-600 font-medium gap-2 cursor-pointer"
        >
          <SquareArrowRightExit size={16} />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
