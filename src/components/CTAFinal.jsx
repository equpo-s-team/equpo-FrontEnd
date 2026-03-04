import { SectionLabel } from './WhatIsEqupo';

export default function CTAFinal() {
  return (
    <section
      id="cta-final"
      className="relative py-28 px-[5vw] overflow-hidden"
      style={{ background: 'linear-gradient(150deg, #0f1a14 0%, #0d2117 60%, #102520 100%)' }}
    >
      {/* Glow blobs */}
      <div className="absolute -top-48 -right-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(137,217,157,.12), transparent 70%)' }} />
      <div className="absolute -bottom-36 -left-36 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(105,232,240,.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-[820px] mx-auto text-center">
        <SectionLabel color="text-green" barColor="bg-green" className="justify-center">
          Haz que colaborar se sienta bien
        </SectionLabel>

        <h2 className="font-maxwell text-display-md text-white mb-4">
          Crea un equipo que se mueve en la misma dirección.
        </h2>

        <p className="font-body text-[1.05rem] leading-[1.75] text-white/60 max-w-[580px] mx-auto mb-9">
          Dale a tu equipo un espacio donde organizarse sea fácil, colaborar sea natural y el progreso
          se vea —literalmente— reflejado en el ambiente compartido.
        </p>

        <a
          href="#"
          className="font-maxwell text-dark text-[1.05rem] px-9 py-4 rounded-xl no-underline inline-block mb-4 shadow-green-glow hover:-translate-y-0.5 hover:shadow-green-glow-lg transition-all"
          style={{ background: 'linear-gradient(135deg, #89D99D, #69E8F0)' }}
        >
          Crear mi primer equipo
        </a>

        <p className="font-body text-[.82rem] text-white/40 mb-10">
          "Empieza hoy. Ajusta detalles después. Tu equipo lo agradecerá."
        </p>

        {/* Trust list */}
        <ul className="list-none flex justify-center flex-wrap gap-6">
          {['Configuración rápida', 'Para equipos pequeños o grandes', 'Diseñado para mejorar hábitos colectivos'].map(
            (item) => (
              <li key={item} className="flex items-center gap-2 font-body text-[.85rem] text-white/55">
                <span className="text-green text-[.8rem]">✔</span>
                {item}
              </li>
            )
          )}
        </ul>
      </div>
    </section>
  );
}
