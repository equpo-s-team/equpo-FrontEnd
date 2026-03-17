import { useState } from "react";
import AuthSwitch from "./auth/components/AuthSwitch";

export default function Navbar() {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5vw] h-[68px] bg-white/88 backdrop-blur-[18px] border-b border-border">
                <a href="#" className="font-maxwell text-display-md tracking-tight text-dark no-underline">
                    eq<span className="text-green">u</span>po
                </a>

                <div className="hidden md:flex gap-8 items-center">
                    <a href="#what" className="text-sm font-medium text-muted hover:text-dark transition-colors no-underline">
                        Producto
                    </a>
                    <a href="#features" className="text-sm font-medium text-muted hover:text-dark transition-colors no-underline">
                        Funciones
                    </a>
                    <button
                        onClick={() => setShowAuth(true)}
                        className="text-sm font-medium text-emerald-600 border border-emerald-600 px-[1.3rem] py-[.55rem] rounded-lg hover:bg-emerald-50 transition-all hover:-translate-y-px"
                    >
                        Iniciar sesión
                    </button>
                    <a
                        href="#cta-final"
                        className="text-sm font-medium text-white bg-dark px-[1.3rem] py-[.55rem] rounded-lg hover:bg-dark-mid transition-all hover:-translate-y-px no-underline"
                    >
                        Empezar
                    </a>
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
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <button
                            onClick={() => setShowAuth(false)}
                            className="absolute top-8 right-8 text-white/80 hover:text-white text-sm z-10"
                        >
                        </button>
                        <AuthSwitch />
                    </div>
                </div>
            )}
        </>
    );
}
