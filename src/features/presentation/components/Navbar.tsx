import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthSwitch from '@/features/auth/components/AuthSwitch.tsx';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] bg-white/88 dark:bg-gray-900/88 backdrop-blur-[18px] border-b border-border dark:border-gray-700/50">
        <Link to="/" className="font-maxwell text-display-md tracking-tight text-dark dark:text-white no-underline">
          eq
          <span className="bg-gradient-to-r from-[#9CEDC1] via-[#60AFFF] to-[#F65A70] bg-clip-text text-transparent">
            u
          </span>
          po
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#what"
            className="text-sm font-medium text-primary-foreground dark:text-gray-300 hover:text-dark dark:hover:text-white transition-colors no-underline"
          >
            Producto
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-primary-foreground dark:text-gray-300 hover:text-dark dark:hover:text-white transition-colors no-underline"
          >
            Funciones
          </a>
          <Link
            to="/teams"
            className="text-sm font-medium text-purple-foreground dark:text-emerald-400 bg-dark dark:bg-gray-800 px-[1.3rem] py-[.55rem] rounded-lg hover:bg-dark-mid dark:hover:bg-gray-700 transition-all hover:-translate-y-px no-underline"
          >
            Empezar
          </Link>
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-purple dark:text-emerald-500 border border-purple dark:border-emerald-500 px-[1.3rem] py-[.55rem] rounded-lg hover:shadow-neonPurple dark:hover:shadow-neonEmerald transition-all hover:-translate-y-px"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-green dark:text-green border border-emerald-600 dark:border-emerald-400 px-[1rem] py-[.4rem] rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {showAuth && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center md:p-0 overflow-y-auto">
          <button
            onClick={() => setShowAuth(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 dark:text-gray-300 hover:text-white dark:hover:text-gray-100 text-sm z-10 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg border border-white/20 dark:border-gray-600/50"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <AuthSwitch onClose={() => setShowAuth(false)} />
        </div>
      )}
    </>
  );
}
