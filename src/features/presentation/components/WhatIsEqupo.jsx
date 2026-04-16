import { TrendingUp } from 'lucide-react';

export default function WhatIsEqupo() {
  return (
    <section
      id="what"
      className="relative py-24 px-[5vw] overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,175,255,0.10) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(156,237,193,0.14) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1160px] mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        {/* ── CARD VISUAL ── */}
        <div className="relative">
          {/* Main card */}
          <div className="bg-white border border-grey-150 rounded-[24px] p-6 shadow-card-lg">
            {/* Board header */}
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #9CEDC1, #60AFFF)' }}
                >
                  <span className="text-white text-[.6rem] font-bold">e</span>
                </div>
                <span className="font-maxwell text-[.9rem] text-grey-800">Sprint Q2 — equpo</span>
              </div>
              <div className="flex">
                {[
                  { letter: 'A', bg: 'linear-gradient(135deg,#9CEDC1,#60AFFF)' },
                  { letter: 'B', bg: 'linear-gradient(135deg,#60AFFF,#86F0FD)' },
                  { letter: 'C', bg: 'linear-gradient(135deg,#FF94AE,#FCE98D)' },
                ].map(({ letter, bg }, i) => (
                  <div
                    key={letter}
                    className={`w-[26px] h-[26px] rounded-full border-2 border-white flex items-center justify-center text-[.6rem] font-bold text-white ${i > 0 ? '-ml-[7px]' : ''}`}
                    style={{ background: bg }}
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
                dotGrad="linear-gradient(135deg,#FCE98D,#FF94AE)"
                tasks={[
                  {
                    tag: 'Diseño',
                    tagBg: 'rgba(252,233,141,0.25)',
                    tagColor: '#c48c00',
                    text: 'Wireframes v2',
                  },
                  {
                    tag: 'Dev',
                    tagBg: 'rgba(156,237,193,0.25)',
                    tagColor: '#1a7a4a',
                    text: 'Setup API',
                  },
                ]}
              />
              <KanbanCol
                title="En curso"
                dotGrad="linear-gradient(135deg,#60AFFF,#86F0FD)"
                tasks={[
                  {
                    tag: 'Collab',
                    tagBg: 'rgba(134,240,253,0.25)',
                    tagColor: '#1a7a8a',
                    text: 'Revisión docs',
                  },
                  {
                    tag: 'Dev',
                    tagBg: 'rgba(156,237,193,0.25)',
                    tagColor: '#1a7a4a',
                    text: 'Auth module',
                  },
                ]}
              />
              <KanbanCol
                title="Listo ✓"
                dotGrad="linear-gradient(135deg,#9CEDC1,#CEFB7C)"
                tasks={[
                  {
                    tag: 'Dev',
                    tagBg: 'rgba(156,237,193,0.25)',
                    tagColor: '#1a7a4a',
                    text: 'DB schema',
                  },
                  {
                    tag: 'Diseño',
                    tagBg: 'rgba(252,233,141,0.25)',
                    tagColor: '#c48c00',
                    text: 'Style guide',
                  },
                ]}
              />
            </div>
          </div>

          {/* World widget */}
          <div className="absolute -bottom-6 -right-6 bg-white border border-grey-150 rounded-2xl px-5 py-4 shadow-card-lg flex items-center gap-3 min-w-[190px]">
            <div
              className="w-11 h-11 rounded-xl flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #9CEDC1, #60AFFF)',
                animation: 'floatOrb 4s ease-in-out infinite',
              }}
            />
            <div className="font-body text-[.75rem]">
              <strong className="block font-semibold text-grey-800 text-[.82rem]">
                Mundo prosperando
              </strong>
              <span className="text-grey-400 flex items-center gap-1">
                Equipo en racha <TrendingUp size={13} style={{ color: '#38b97a' }} />
              </span>
            </div>
          </div>
        </div>

        {/* ── TEXT ── */}
        <div>
          <SectionLabel
            gradient="linear-gradient(90deg, #60AFFF, #86F0FD)"
            textGrad="linear-gradient(90deg, #2e8fd4, #1a9fb0)"
          >
            Qué es equpo
          </SectionLabel>

          <h2 className="font-maxwell text-display-lg text-grey-900 mb-5">
            Un tablero colaborativo… con un giro que sí se nota.
          </h2>

          <p className="font-body text-[.97rem] leading-[1.75] text-grey-500 mb-5 ">
            equpo es una plataforma para equipos de cualquier rubro que combina todo lo que
            necesitas para trabajar bien y juntos.
          </p>

          <ul className="list-none flex flex-col gap-3 mb-7 ">
            {[
              {
                text: 'Organización clara — tableros, tareas, prioridades',
                grad: 'linear-gradient(135deg,#9CEDC1,#CEFB7C)',
              },
              {
                text: 'Colaboración en tiempo real — chat, llamadas, miembros',
                grad: 'linear-gradient(135deg,#60AFFF,#86F0FD)',
              },
              {
                text: 'Gamificación útil — puntos, niveles, registro de desempeño',
                grad: 'linear-gradient(135deg,#d99aee,#5961F9)',
              },
              {
                text: 'Bienestar colectivo — un ambiente virtual que responde al trabajo del equipo',
                grad: 'linear-gradient(135deg,#FF94AE,#FCE98D)',
              },
            ].map((item) => (
              <li
                key={item.text}
                className="flex items-start gap-3 font-body text-[.93rem] text-grey-700"
              >
                <span
                  className="w-[18px] h-[18px] rounded-full flex-shrink-0 mt-0.5"
                  style={{ background: item.grad }}
                />
                {item.text}
              </li>
            ))}
          </ul>

          <div
            className="border-l-4 rounded-r-xl px-5 py-4 font-maxwell text-[1.05rem] text-grey-800"
            style={{
              borderImage: 'linear-gradient(180deg, #9CEDC1, #60AFFF) 1',
              background: 'linear-gradient(135deg, rgba(156,237,193,0.10), rgba(96,175,255,0.08))',
            }}
          >
            No es "hacer por hacer". Es construir juntos.
          </div>
        </div>
      </div>
    </section>
  );
}

function KanbanCol({ title, dotGrad, tasks }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotGrad }} />
        <span className="font-body text-[.68rem] font-semibold uppercase tracking-[.08em] text-grey-400">
          {title}
        </span>
      </div>
      {tasks.map(({ tag, tagBg, tagColor, text }) => (
        <div
          key={text}
          className="bg-grey-50 border border-grey-150 rounded-[10px] px-[.65rem] py-[.55rem] text-[.72rem] text-grey-700 mb-[.45rem]"
        >
          <span
            className="inline-block text-[.6rem] font-semibold px-[.4rem] py-[.15rem] rounded mb-1"
            style={{ background: tagBg, color: tagColor }}
          >
            {tag}
          </span>
          <br />
          {text}
        </div>
      ))}
    </div>
  );
}

export function SectionLabel({ children, gradient, textGrad, barColor, color, className = '' }) {
  const barStyle = gradient ? { background: gradient } : {};
  const textStyle = textGrad
    ? {
        background: textGrad,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }
    : {};

  return (
    <div
      className={`flex items-center gap-2 mb-3 font-body text-[.75rem] font-semibold tracking-[.14em] uppercase ${color || ''} ${className}`}
    >
      <span className={`block w-5 h-0.5 rounded ${barColor || ''}`} style={barStyle} />
      <span style={textStyle}>{children}</span>
    </div>
  );
}
