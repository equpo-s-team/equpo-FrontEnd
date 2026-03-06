import { useReveal } from '../../hooks/useReveal';
import { TrendingUp } from 'lucide-react';

export default function WhatIsEqupo() {
  const { ref, classes } = useReveal();

  return (
    <section id="what" className="bg-offwhite py-24 px-[5vw]">
      <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-20 items-center">

        <div className="reveal" ref={ref}>
          <div className="relative">
            <div className="bg-white border border-border rounded-[20px] p-6 shadow-card-lg">
              <div className="flex justify-between items-center mb-5">
                <span className="font-maxwell text-[.9rem] text-dark">Sprint Q2 — equpo</span>
                <div className="flex">
                  {[
                    { letter: 'A', bg: 'bg-green', text: 'text-green-deep' },
                    { letter: 'B', bg: 'bg-cyan', text: 'text-cyan-900' },
                    { letter: 'C', bg: 'bg-yellow-200', text: 'text-yellow-800' },
                  ].map(({ letter, bg, text }, i) => (
                    <div
                      key={letter}
                      className={`w-[26px] h-[26px] rounded-full border-2 border-white flex items-center justify-center text-[.65rem] font-semibold ${bg} ${text} ${i > 0 ? '-ml-[7px]' : ''}`}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              {/* Kanban columns */}
              <div className="grid grid-cols-3 gap-3">
                <KanbanCol
                  title="Por hacer"
                  dotColor="bg-yellow-300"
                  tasks={[
                    { tag: 'Diseño', tagClass: 'bg-yellow-100 text-yellow-800', text: 'Wireframes v2' },
                    { tag: 'Dev', tagClass: 'bg-green-light text-green-deep', text: 'Setup API' },
                  ]}
                />
                <KanbanCol
                  title="En curso"
                  dotColor="bg-cyan"
                  tasks={[
                    { tag: 'Collab', tagClass: 'bg-cyan-light text-cyan-800', text: 'Revisión docs' },
                    { tag: 'Dev', tagClass: 'bg-green-light text-green-deep', text: 'Auth module' },
                  ]}
                />
                <KanbanCol
                  title="Listo ✓"
                  dotColor="bg-green"
                  tasks={[
                    { tag: 'Dev', tagClass: 'bg-green-light text-green-deep', text: 'DB schema' },
                    { tag: 'Diseño', tagClass: 'bg-yellow-100 text-yellow-800', text: 'Style guide' },
                  ]}
                />
              </div>
            </div>

            {/* World widget */}
            <div className="absolute -bottom-6 -right-6 bg-white border border-border rounded-2xl px-5 py-4 shadow-[0_12px_40px_rgba(0,0,0,.10)] flex items-center gap-3 min-w-[180px]">
              <div className="world-mini-orb w-11 h-11 flex-shrink-0 animate-float-orb-fast" />
              <div className="font-body text-[.75rem]">
                <strong className="block font-semibold text-dark text-[.82rem]">Mundo prosperando</strong>
                <span className="text-muted">Equipo en racha <TrendingUp size={14} className="inline text-green ml-1" /></span>
              </div>
            </div>
          </div>
        </div>

        {/* ── TEXT ── */}
        <div>
          <SectionLabel color="text-cyan" barColor="bg-cyan" className="reveal reveal-d1">Qué es equpo</SectionLabel>
          <h2 className="font-maxwell text-display-lg text-dark mb-5 reveal reveal-d1">
            Un tablero colaborativo… con un giro que sí se nota.
          </h2>
          <p className="font-body text-[.97rem] leading-[1.75] accent-gray-400 mb-5 reveal reveal-d2">
            equpo es una plataforma para equipos de cualquier rubro que combina todo lo que necesitas para trabajar bien y juntos.
          </p>
          <ul className="list-none flex flex-col gap-3 mb-7 reveal reveal-d2">
            {[
              'Organización clara — tableros, tareas, prioridades',
              'Colaboración en tiempo real — chat, llamadas, miembros',
              'Gamificación útil — puntos, niveles, registro de desempeño',
              'Bienestar colectivo — un ambiente virtual que responde al trabajo del equipo',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 font-body text-[.93rem] text-dark">
                <span
                  className="w-[18px] h-[18px] rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #89D99D, #69E8F0)' }}
                />
                {item}
              </li>
            ))}
          </ul>
          <div
            className="border-l-4 border-green rounded-r-xl px-5 py-4 font-maxwell text-[1.05rem] text-dark reveal reveal-d3"
            style={{ background: 'linear-gradient(135deg, rgba(137,217,157,.12), rgba(105,232,240,.10))' }}
          >
            No es "hacer por hacer". Es construir juntos.
          </div>
        </div>

      </div>
    </section>
  );
}

/* ── Sub-components ── */
function KanbanCol({ title, dotColor, tasks }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <span className="font-body text-[.7rem] font-semibold uppercase tracking-[.08em] text-muted">{title}</span>
      </div>
      {tasks.map(({ tag, tagClass, text }) => (
        <div key={text} className="mock-task bg-offwhite border border-border rounded-[10px] px-[.65rem] py-[.55rem] text-[.72rem] text-dark mb-[.45rem]">
          <span className={`inline-block text-[.6rem] font-semibold px-[.4rem] py-[.15rem] rounded mb-1 ${tagClass}`}>
            {tag}
          </span>
          <br />
          {text}
        </div>
      ))}
    </div>
  );
}

export function SectionLabel({ children, color = 'text-green', barColor = 'bg-green', className = '' }) {
  return (
    <div className={`flex items-center gap-2 mb-3 font-body text-[.75rem] font-semibold tracking-[.14em] uppercase ${color} ${className}`}>
      <span className={`block w-5 h-0.5 rounded ${barColor}`} />
      {children}
    </div>
  );
}
