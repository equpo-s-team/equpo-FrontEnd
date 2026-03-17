import { useRef, useState } from 'react';
import { SectionLabel } from './WhatIsEqupo';
import { Heart, Rocket, Zap, Globe, TrendingUp, User } from 'lucide-react';

const SLIDES = [
  {
    num: '01',
    icon: <Heart size={24} className="text-white" />,
    title: 'Lo que haces, se siente.',
    text: 'Completar tareas y colaborar mejora el entorno del equipo. El resultado es compartido: el progreso también.',
  },
  {
    num: '02',
    icon: <Rocket size={24} className="text-white" />,
    title: 'Progreso que impulsa, no que agobia.',
    text: 'Puntos y niveles como guía, no como castigo. Reconocimiento constante y metas claras para cada quien.',
  },
  {
    num: '03',
    icon: <Zap size={24} className="text-white" />,
    title: 'Menos fricción, más ritmo.',
    text: 'Todo en un solo lugar: tareas, comunicación, decisiones y seguimiento. Sin saltar entre herramientas.',
  },
  {
    num: '04',
    icon: <Globe size={24} className="text-white" />,
    title: 'Un ambiente que evoluciona contigo.',
    text: 'El espacio virtual cambia con el desempeño colectivo: una forma simple y visual de ver cómo va el equipo.',
  },
  {
    num: '05',
    icon: <TrendingUp size={24} className="text-white" />,
    title: 'Tu perfil cuenta tu historia.',
    text: 'Registro de desempeño en el tiempo: niveles, puntos y constancia. Ideal para objetivos personales y de equipo.',
  },
];

const CARD_W = 320 + 16; // card width + gap

export default function Nucleus() {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const updateDots = () => {
    const scrollLeft = trackRef.current.scrollLeft;
    const idx = Math.round(scrollLeft / CARD_W*4);
    setActiveIdx(Math.min(idx, SLIDES.length - 1));
  };

  const onMouseDown = (e) => {
    isDown.current = true;
    trackRef.current.classList.add('dragging');
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMouseLeave = () => { isDown.current = false; trackRef.current.classList.remove('dragging'); };
  const onMouseUp = () => { isDown.current = false; trackRef.current.classList.remove('dragging'); };
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
    <section id="nucleus" className="py-24 px-[5vw] overflow-hidden" style={{ background: '#0f1a14' }}>
      <div className="max-w-[1160px] mx-auto">

        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-14">
          <SectionLabel color="text-green" barColor="bg-green" className="justify-center">El núcleo</SectionLabel>
          <h2 className="font-maxwell text-display-lg text-white mb-4">
            Tu equipo comparte un espacio.<br />Tus acciones dejan huella.
          </h2>
          <p className="font-body text-[.97rem] leading-[1.7] text-white/55">
            Aquí la productividad no es fría: se traduce en bienestar visible. Cuando alguien avanza,
            el equipo lo celebra; cuando el equipo se organiza, el mundo mejora.
          </p>
        </div>

        {/* Carousel */}
        <div
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
                className="slide-card-inner bg-dark-mid border border-green/10 rounded-[20px] p-8 h-full"
              >
                <span className="font-maxwell text-[3rem] text-green/10 absolute top-5 right-6 leading-none select-none">
                  {slide.num}
                </span>
                <div className="w-[46px] h-[46px] rounded-xl flex items-center justify-center text-[1.3rem] bg-green/10 mb-5">
                  {slide.icon}
                </div>
                <h3 className="font-maxwell text-[1.15rem] text-white mb-3">{slide.title}</h3>
                <p className="font-body text-[.88rem] leading-[1.7] text-white/55">{slide.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full border-none cursor-pointer transition-all ${
                i === activeIdx ? 'bg-green scale-125' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
