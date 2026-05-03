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
    links: ['Guía rápida', 'Plantillas de tableros', 'Buenas prácticas de colaboración', 'Soporte'],
  },
];

const LEGAL = ['Términos', 'Privacidad', 'Seguridad'];

export default function Footer() {
  return (
    <footer
      className="relative overflow-hidden px-[5vw] pt-16 pb-8"
      style={{ background: 'linear-gradient(160deg, #f5fdf8 0%, #f0f7ff 50%, #fdf5ff 100%)' }}
    >
      {/* Subtle border top */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(156,237,193,0.5), rgba(96,175,255,0.4), rgba(217,154,238,0.4), transparent)',
        }}
      />

      {/* Faint blobs */}
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,175,255,0.10), transparent 70%)' }}
      />

      <div className="max-w-[1160px] mx-auto relative z-10">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-10 border-b border-grey-150 mb-7">
          {/* Brand */}
          <div>
            <div className="font-maxwell text-2xl text-grey-900 mb-4">
              eq
              <span
                style={{
                  background: 'linear-gradient(135deg, #38b97a, #2e8fd4)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                u
              </span>
              po
            </div>
            <p className="font-body text-sm leading-[1.7] text-grey-400 max-w-[260px]">
              Una plataforma para equipos que quieren colaborar bien, crecer juntos y ver el impacto
              de su trabajo.
            </p>

            {/* Social icons */}
            <div className="flex gap-3 mt-5">
              {[
                { grad: 'linear-gradient(135deg,#9CEDC1,#60AFFF)', label: 'tw' },
                { grad: 'linear-gradient(135deg,#60AFFF,#86F0FD)', label: 'in' },
                { grad: 'linear-gradient(135deg,#d99aee,#5961F9)', label: 'gh' },
              ].map(({ grad, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold no-underline hover:-translate-y-0.5 transition-all"
                  style={{ background: grad }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav cols */}
          {NAV_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-body text-xs font-semibold tracking-[.1em] uppercase text-grey-400 mb-4">
                {col.title}
              </h4>
              <ul className="list-none flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-body text-sm text-grey-500 no-underline hover:text-grey-900 transition-colors"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'linear-gradient(90deg, #38b97a, #2e8fd4)';
                        e.currentTarget.style.webkitBackgroundClip = 'text';
                        e.currentTarget.style.webkitTextFillColor = 'transparent';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                        e.currentTarget.style.webkitBackgroundClip = 'unset';
                        e.currentTarget.style.webkitTextFillColor = 'unset';
                      }}
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
              className="font-body text-sm text-grey-300 no-underline hover:text-grey-600 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <p className="font-body text-sm text-grey-400">
            <strong className="text-grey-600 font-semibold">equpo</strong> - Trabajo real. Impacto
            compartido.
          </p>
          <p className="font-body text-xs text-grey-300">
            © 2025 equpo. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
