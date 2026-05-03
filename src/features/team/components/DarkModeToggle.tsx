import {MoonIcon, SunIcon} from "lucide-react";
import { useEffect, useState } from 'react';

import {AppTooltip} from "@/components/ui/AppTooltip.tsx";
import { darkModeManager } from '@/lib/darkMode';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(darkModeManager.isDarkMode());
  }, []);

  const handleToggle = () => {
    const newDarkState = darkModeManager.toggleDarkMode();
    setIsDark(newDarkState);
  };

  return (
    <AppTooltip content={"Cambiar entre temas"}>


    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gradient-orange-bg text-white  dark:text-white dark:bg-gradient-darkblue-bg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-neonPink dark:shadow-neonBlue"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
    </button>
    </AppTooltip>
  );
}
