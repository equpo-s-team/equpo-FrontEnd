import { motion } from 'framer-motion';
import { Activity, CheckCircle, MessageCircle, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import HeroVisual from '@/features/presentation/components/HeroVisual.jsx';

export default function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ['colaborativo', 'vivo', 'responsable', 'motivador', 'interactivo'],
    [],
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative overflow-hidden min-h-screen bg-white">
      <div className="animated-gradient-bg-new" />

      <div
        className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(156,237,193,0.22) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(96,175,255,0.15) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(246,90,112,0.10) 0%, transparent 70%)' }}
      />

      <div className="max-w-full mx-auto px-16 grid md:grid-cols-2 gap-0 items-center pt-8 pb-0 min-h-[90vh] relative z-10">
        {/* ── LEFT COPY ── */}
        <div className="hero-copy-enter py-16 pr-8">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="block w-8 h-1 rounded"
              style={{ background: 'linear-gradient(90deg, #9CEDC1, #60AFFF)' }}
            />
            <span
              className="font-body text-sm font-bold tracking-[0.2em] uppercase"
              style={{
                background: 'linear-gradient(90deg, #38b97a, #2e8fd4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tu equipo, un mundo compartido
            </span>
          </div>

          <h1 className="font-maxwell text-5xl md:text-6xl text-grey-900 mb-6 leading-[1.08]">
            Organiza tareas. <br />
            <span className="relative inline-block overflow-hidden md:pb-2 md:pt-1 min-w-[900px]">
              &nbsp;
              {titles.map((title, index) => (
                <motion.em
                  key={index}
                  className=" absolute not-italic font-bold left-0 top-3.5 pr-5
                                        bg-gradient-to-r from-[#9CEDC1] via-[#60AFFF] to-[#F65A70]
                                        bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: '-100' }}
                  transition={{ type: 'spring', stiffness: 50 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                  }
                >
                  {title}
                </motion.em>
              ))}
            </span>
            <br />
            Haz que el equipo prospere.
          </h1>

          <p className="font-body text-lg leading-[1.65] text-grey-600 max-w-[480px] mb-8">
            Con equpo, cada tarea completada no solo avanza proyectos: mejora el bienestar del
            espacio virtual del equipo. Trabajo real, impacto visible, motivación compartida.
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <a
              href="#"
              className="font-maxwell text-white px-[2.2rem] py-[1.1rem] rounded-[14px] text-base no-underline hover:-translate-y-1 transition-all"
              style={{
                background: 'linear-gradient(135deg, #38b97a 0%, #2e8fd4 100%)',
                boxShadow: '0 8px 28px rgba(56,185,122,0.35)',
              }}
            >
              Crear mi primer equipo
            </a>
            <a
              href="#what"
              className="font-maxwell text-grey-700 border border-grey-200 bg-white/70 backdrop-blur px-[2.2rem] py-[1.1rem] rounded-[14px] text-base no-underline hover:-translate-y-1 hover:border-grey-300 transition-all"
            >
              Ver cómo funciona
            </a>
          </div>

          <div className="flex flex-col gap-2.5 mb-8">
            {['Empieza en minutos.', 'Diseñado para equipos colaborativos.'].map((txt) => (
              <p key={txt} className="font-body text-sm text-grey-500 flex items-center gap-2">
                <Activity size={15} className="text-green-DEFAULT flex-shrink-0" />
                {txt}
              </p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              {
                label: 'Tablero colaborativo',
                grad: 'from-green-50 to-cyan-50',
                border: 'border-green-200',
                text: 'text-green-700',
              },
              {
                label: 'Chat + llamadas',
                grad: 'from-blue-50 to-cyan-50',
                border: 'border-blue-200',
                text: 'text-blue-700',
              },
              {
                label: 'Puntos y niveles',
                grad: 'from-purple-50 to-pink-50',
                border: 'border-purple-200',
                text: 'text-purple-700',
              },
              {
                label: 'Responsabilidad colectiva',
                grad: 'from-orange-50 to-red-50',
                border: 'border-red-200',
                text: 'text-red-600',
              },
            ].map((badge) => (
              <span
                key={badge.label}
                className={`font-body bg-gradient-to-r ${badge.grad} border ${badge.border} ${badge.text} text-xs font-semibold px-[1rem] py-[0.45rem] rounded-full hover:-translate-y-px transition-all cursor-default`}
              >
                {badge.label}
              </span>
            ))}
          </div>

          <p className="font-body text-sm text-grey-400 italic border-t border-grey-150 pt-5">
            "Cuando todos aportan, el equipo lo siente."
          </p>
        </div>

        <div
          className="hero-visual-enter relative h-full min-h-screen -mr-[5vw] overflow-visible"
          style={{ marginRight: 'calc(-5vw)' }}
        >
          <HeroVisual />

          {/* Floating cards */}
          <FloatCard
            className="absolute top-[10%] -left-[6%] z-20"
            icon={<TrendingUp size={18} />}
            title="Mundo activo"
            label="+12% esta semana"
            accentColor="rgba(156,237,193,1)"
            iconBg="linear-gradient(135deg, #9CEDC1, #60AFFF)"
          />
          <FloatCard
            className="absolute top-[22%] right-[6%] z-20"
            icon={<CheckCircle size={18} />}
            title="3 tareas completadas"
            label="Hoy"
            accentColor="rgba(96,175,255,1)"
            iconBg="linear-gradient(135deg, #60AFFF, #86F0FD)"
          />
          <div className="absolute bottom-[32%] -left-[8%] z-20">
            <FloatCardRing title="Nivel 7" label="75% al siguiente" />
          </div>
          <FloatCard
            className="absolute bottom-[22%] right-[5%] z-20"
            icon={<MessageCircle size={18} />}
            title="Chat activo"
            label="4 miembros en línea"
            accentColor="rgba(246,90,112,1)"
            iconBg="linear-gradient(135deg, #FF94AE, #F65A70)"
          />
        </div>
      </div>

      <style>{`
                .animated-gradient-bg-new {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        120deg,
                        #ffffff 0%,
                        #f0fdf6 25%,
                        #eff8ff 55%,
                        #fff5f7 80%,
                        #fdf8ff 100%
                    );
                    background-size: 400% 400%;
                    animation: gradShift 12s ease infinite;
                }
                @keyframes gradShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
    </section>
  );
}

function FloatCard({ className = '', icon, title, label, iconBg }) {
  return (
    <motion.div
      className={`backdrop-blur-xl border rounded-2xl px-5 py-3.5 flex items-center gap-3.5 shadow-xl font-body text-sm font-medium text-grey-800 whitespace-nowrap transition-all duration-500 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.88)',
        borderColor: 'rgba(255,255,255,0.6)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.5)`,
      }}
      whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-grey-900 text-sm">{title}</span>
        <span className="text-grey-400 text-xs font-normal">{label}</span>
      </div>
    </motion.div>
  );
}

function FloatCardRing({ title, label }) {
  return (
    <motion.div
      className="backdrop-blur-xl rounded-2xl px-5 py-3.5 flex items-center gap-3.5 shadow-xl font-body text-sm font-medium text-grey-800 whitespace-nowrap"
      style={{
        background: 'rgba(255,255,255,0.88)',
        border: '1px solid rgba(255,255,255,0.6)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
      }}
      whileHover={{ scale: 1.05, y: -3, transition: { duration: 0.25 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #9CEDC1, #CEFB7C)' }}
      >
        <svg width="36" height="36" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r="16"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="75 100"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-grey-900 text-sm">{title}</span>
        <span className="text-grey-400 text-xs font-normal">{label}</span>
      </div>
    </motion.div>
  );
}
