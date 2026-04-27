import { useState } from 'react';
import { Link } from 'react-router-dom';

import AuthSwitch from '@/features/auth/components/AuthSwitch.tsx';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] bg-white/88 backdrop-blur-[18px] border-b border-border">
        <Link to="/" className="font-maxwell text-display-md tracking-tight text-dark no-underline">
          eq
          <span className="bg-gradient-to-r from-[#9CEDC1] via-[#60AFFF] to-[#F65A70] bg-clip-text text-transparent">
            u
          </span>
          po
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <a
            href="#what"
            className="text-sm font-medium text-primary-foreground hover:text-dark transition-colors no-underline"
          >
            Producto
          </a>
          <a
            href="#features"
            className="text-sm font-medium text-primary-foreground hover:text-dark transition-colors no-underline"
          >
            Funciones
          </a>
          <Link
            to="/teams"
            className="text-sm font-medium text-purple-foreground bg-dark px-[1.3rem] py-[.55rem] rounded-lg hover:bg-dark-mid transition-all hover:-translate-y-px no-underline"
          >
            Empezar
          </Link>
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-purple border border-purple px-[1.3rem] py-[.55rem] rounded-lg hover:shadow-neonPurple transition-all hover:-translate-y-px"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-emerald-600 border border-emerald-600 px-[1rem] py-[.4rem] rounded-lg hover:bg-emerald-50 transition-all"
          >
            Login
          </button>
        </div>
      </nav>

      {showAuth && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 md:p-0 overflow-y-auto">
          <button
            onClick={() => setShowAuth(false)}
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/80 hover:text-white text-sm z-10 bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20"
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
