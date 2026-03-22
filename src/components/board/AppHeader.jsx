import {Bell, Settings, Search} from 'lucide-react';
import {USER_GRADIENT} from './columnConfig';

export default function AppHeader() {
    return (
        <header className="
      sticky top-0 z-50
      bg-primary border-b border-grey-200
      shadow-[0_1px_8px_rgba(0,0,0,0.06)]
      h-14 md:h-[62px]
      flex items-center justify-between
      px-4 md:px-8
    ">
            {/* Logo */}
            <div
                className="flex items-center gap-2.5 font-maxwell tracking-tight text-grey-900 text-base md:text-lg font-bold select-none">
        <span
            className="w-2.5 h-2.5 rounded-full bg-blue animate-pulse-neon"
            style={{boxShadow: '0 0 8px #60AFFF, 0 0 18px rgba(96,175,255,0.4)'}}
        />
                Misiones Grupales
            </div>

        </header>
    );
}
