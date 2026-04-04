import { Globe, Heart, Rocket, TrendingUp, Zap } from 'lucide-react';
import { useRef, useState } from 'react';

import { SectionLabel } from './WhatIsEqupo.jsx';

const SLIDES = [
  {
    num: '01',
    icon: <Heart size={22} />,
    title: 'Lo que haces, se siente.',
    text: 'Completar tareas y colaborar mejora el entorno del equipo. El resultado es compartido: el progreso también.',
    grad: 'linear-gradient(135deg, #9CEDC1 0%, #60AFFF 100%)',
    lightGrad: 'linear-gradient(135deg, rgba(156,237,193,0.12) 0%, rgba(96,175,255,0.08) 100%)',
    border: 'rgba(156,237,193,0.35)',
    numColor: 'rgba(156,237,193,0.15)',
  },
  {
    num: '02',
    icon: <Rocket size={22} />,
    title: 'Progreso que impulsa, no que agobia.',
    text: 'Puntos y niveles como guía, no como castigo. Reconocimiento constante y metas claras para cada quien.',
    grad: 'linear-gradient(135deg, #d99aee 0%, #5961F9 100%)',
    lightGrad: 'linear-gradient(135deg, rgba(217,154,238,0.10) 0%, rgba(89,97,249,0.08) 100%)',
    border: 'rgba(217,154,238,0.35)',
    numColor: 'rgba(217,154,238,0.15)',
  },
  {
    num: '03',
    icon: <Zap size={22} />,
    title: 'Menos fricción, más ritmo.',
    text: 'Todo en un solo lugar: tareas, comunicación, decisiones y seguimiento. Sin saltar entre herramientas.',
    grad: 'linear-gradient(135deg, #FF94AE 0%, #FCE98D 100%)',
    lightGrad: 'linear-gradient(135deg, rgba(255,148,174,0.10) 0%, rgba(252,233,141,0.08) 100%)',
    border: 'rgba(255,148,174,0.35)',
    numColor: 'rgba(255,148,174,0.15)',
  },
  {
    num: '04',
    icon: <Globe size={22} />,
    title: 'Un ambiente que evoluciona contigo.',
    text: 'El espacio virtual cambia con el desempeño colectivo: una forma simple y visual de ver cómo va el equipo.',
    grad: 'linear-gradient(135deg, #60AFFF 0%, #86F0FD 100%)',
    lightGrad: 'linear-gradient(135deg, rgba(96,175,255,0.10) 0%, rgba(134,240,253,0.08) 100%)',
    border: 'rgba(96,175,255,0.35)',
    numColor: 'rgba(96,175,255,0.15)',
  },
  {
    num: '05',
    icon: <TrendingUp size={22} />,
    title: 'Tu perfil cuenta tu historia.',
    text: 'Registro de desempeño en el tiempo: niveles, puntos y constancia. Ideal para objetivos personales y de equipo.',
    grad: 'linear-gradient(135deg, #F65A70 0%, #FFAF93 100%)',
    lightGrad: 'linear-gradient(135deg, rgba(246,90,112,0.10) 0%, rgba(255,175,147,0.08) 100%)',
    border: 'rgba(246,90,112,0.30)',
    numColor: 'rgba(246,90,112,0.15)',
  },
];

const CARD_W = 320 + 16;

export default function Nucleus() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const updateDots = () => {
    const sl = trackRef.current.scrollLeft;
    const idx = Math.round((sl / CARD_W) * 4);
    setActiveIdx(Math.min(idx, SLIDES.length - 1));
  };

  const onMouseDown = (e) => {
    isDown.current = true;
    trackRef.current.classList.add('dragging');
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMouseLeave = () => {
    isDown.current = false;
    trackRef.current.classList.remove('dragging');
  };
  const onMouseUp = () => {
    isDown.current = false;
    trackRef.current.classList.remove('dragging');
  };
  const onMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
    updateDots();
  };

  const goTo = (idx) => {
    const boundedIdx = Math.min(idx, SLIDES.length - 1);
    trackRef.current.scrollTo({ left: boundedIdx * CARD_W, behavior: 'smooth' });
    setActiveIdx(boundedIdx);
  };

  return (
    <section
      id="nucleus"
      className="relative py-24 px-[5vw] overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #fafffe 0%, #f5f8ff 50%, #fff8fa 100%)' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(89,97,249,0.08), transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(246,90,112,0.08), transparent 70%)' }}
      />

      <div className="max-w-[1160px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-14">
          <SectionLabel
            gradient="linear-gradient(90deg, #d99aee, #5961F9)"
            textGrad="linear-gradient(90deg, #9a3fb5, #4248d4)"
            className="justify-center"
          >
            El núcleo
          </SectionLabel>
          <h2 className="font-maxwell text-display-lg text-grey-900 mb-4">
            Tu equipo comparte un espacio.
            <br />
            Tus acciones dejan huella.
          </h2>
          <p className="font-body text-[.97rem] leading-[1.7] text-grey-500">
            Aquí la productividad no es fría: se traduce en bienestar visible. Cuando alguien
            avanza, el equipo lo celebra; cuando el equipo se organiza, el mundo mejora.
          </p>
        </div>

        {/* Carousel */}
        <button
          className="carousel-track"
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onScroll={updateDots}
        >
          {SLIDES.map((slide) => (
            <div key={slide.num} className="slide-card">
              <div
                className="slide-card-inner rounded-[22px] p-8 h-full relative overflow-hidden"
                style={{
                  background: slide.lightGrad,
                  border: `1.5px solid ${slide.border}`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                {/* Big decorative number */}
                <span
                  className="font-maxwell text-[4rem] absolute top-4 right-5 leading-none select-none"
                  style={{ color: slide.numColor }}
                >
                  {slide.num}
                </span>

                {/* Icon */}
                <div
                  className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-white mb-5"
                  style={{ background: slide.grad, boxShadow: `0 6px 20px ${slide.border}` }}
                >
                  {slide.icon}
                </div>

                <h3 className="font-maxwell text-[1.12rem] text-grey-900 mb-3">{slide.title}</h3>
                <p className="font-body text-[.88rem] leading-[1.7] text-grey-500">{slide.text}</p>
              </div>
            </div>
          ))}
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2.5 mt-7">
          {SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="border-none cursor-pointer transition-all rounded-full"
              style={{
                width: i === activeIdx ? '24px' : '8px',
                height: '8px',
                background: i === activeIdx ? SLIDES[i].grad : 'rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
