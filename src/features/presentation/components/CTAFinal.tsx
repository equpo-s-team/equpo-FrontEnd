import { Check } from 'lucide-react';

import { SectionLabel } from './WhatIsEqupo.tsx';

export default function CTAFinal() {
  return (
    <section
      id="cta-final"
      className="relative py-28 px-[5vw] overflow-hidden bg-final-gradient dark:bg-final-gradient-dark"
    >
      <div
        className="absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full pointer-events-none bg-cta-blob-green"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full pointer-events-none bg-cta-blob-blue"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none bg-cta-blob-purple"
      />


      <div className="relative z-10 max-w-[820px] mx-auto text-center">
        <SectionLabel
          gradient="linear-gradient(90deg, #9CEDC1, #60AFFF)"
          textGrad="linear-gradient(90deg, #38b97a, #2e8fd4)"
          className="justify-center"
        >
          Haz que colaborar se sienta bien
        </SectionLabel>

        <h2 className="font-maxwell text-display-md text-grey-900 dark:text-white mb-4">
          Crea un equipo que se mueve en la misma dirección.
        </h2>

        <p className="font-body text-[1.05rem] leading-[1.75] text-grey-500 dark:text-gray-400 max-w-[560px] mx-auto mb-9">
          Dale a tu equipo un espacio donde organizarse sea fácil, colaborar sea natural y el
          progreso se vea —literalmente— reflejado en el ambiente compartido.
        </p>

        <a
          href="#"
          className="font-maxwell text-white text-[1.05rem] px-10 py-4 rounded-2xl no-underline inline-block mb-4 hover:-translate-y-1 transition-all bg-gradient-blue-bg shadow-cta-button-shadow hover:shadow-cta-button-shadow-hover bg-[length:200%_100%]"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundPosition = '100% 0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundPosition = '0% 0';
          }}
        >
          Crear mi primer equipo
        </a>

        <p className="font-body text-[.82rem] text-grey-400 dark:text-gray-500 mb-10">
          "Empieza hoy. Ajusta detalles después. Tu equipo lo agradecerá."
        </p>

        <ul className="list-none flex justify-center flex-wrap gap-6">
          {[
            { label: 'Configuración rápida', grad: 'linear-gradient(135deg,#9CEDC1,#60AFFF)' },
            {
              label: 'Para equipos pequeños o grandes',
              grad: 'linear-gradient(135deg,#60AFFF,#86F0FD)',
            },
            {
              label: 'Diseñado para mejorar hábitos colectivos',
              grad: 'linear-gradient(135deg,#d99aee,#5961F9)',
            },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-2 font-body text-[.85rem] text-grey-600 dark:text-gray-300"
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0 bg-gradient-purple-bg"
              >
                <Check size={12} />
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
