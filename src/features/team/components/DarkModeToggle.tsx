
import { useState, useEffect } from 'react';
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
    <button
      onClick={handleToggle}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
