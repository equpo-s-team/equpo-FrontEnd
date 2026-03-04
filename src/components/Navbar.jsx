export default function Navbar() {
    return (
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
                <a
                    href="#cta-final"
                    className="text-sm font-medium text-white bg-dark px-[1.3rem] py-[.55rem] rounded-lg hover:bg-dark-mid transition-all hover:-translate-y-px no-underline"
                >
                    Empezar
                </a>
            </div>
        </nav>
    );
}
