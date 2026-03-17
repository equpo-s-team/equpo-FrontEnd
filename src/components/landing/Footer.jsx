const NAV_COLS = [
  {
    title: 'Producto',
    links: [
      'Tablero colaborativo',
      'Equipos y espacios virtuales',
      'Chat y llamadas',
      'Niveles y puntos',
      'Historial de desempeño',
    ],
  },
  {
    title: 'Recursos',
    links: [
      'Guía rápida',
      'Plantillas de tableros',
      'Buenas prácticas de colaboración',
      'Soporte',
    ],
  },
];

const LEGAL = ['Términos', 'Privacidad', 'Seguridad'];

export default function Footer() {
  return (
    <footer className="bg-[#0a1209] px-[5vw] pt-16 pb-8">
      <div className="max-w-[1160px] mx-auto">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10 border-b border-white/5 mb-7">

          {/* Brand */}
          <div>
            <div className="font-maxwell text-[1.4rem] text-white mb-4">
              eq<span className="text-green">u</span>po
            </div>
            <p className="font-body text-[.85rem] leading-[1.7] text-white/35 max-w-[260px]">
              Una plataforma para equipos que quieren colaborar bien, crecer juntos y ver el impacto de su trabajo.
            </p>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-[.8rem] font-semibold tracking-[.1em] uppercase text-white/40 mb-4">
                {col.title}
              </h4>
              <ul className="list-none flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-[.87rem] text-white/50 no-underline hover:text-green transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal links */}
        <div className="flex gap-8 mb-6 flex-wrap">
          {LEGAL.map((item) => (
            <a
              key={item}
              href="#"
              className="font-body text-[.82rem] text-white/30 no-underline hover:text-green transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="font-body text-[.82rem] text-white/25">
            <strong className="text-white/45 font-semibold">equpo</strong> — Trabajo real. Impacto compartido.
          </p>
          <p className="font-body text-[.78rem] text-white/20">
            © 2025 equpo. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </footer>
  );
}
