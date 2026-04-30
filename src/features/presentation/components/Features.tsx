import { Globe, Layout, MessageCircle, Phone, Star, Users } from 'lucide-react';

import { SectionLabel } from './WhatIsEqupo.jsx';

export interface feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  micro: string;
  grad: string;
  lightGrad: string;
  border: string;
  microColor: string;
}

const FEATURES: feature[] = [
  {
    icon: <Layout size={22} />,
    title: 'Tablero colaborativo',
    desc: 'Organiza tareas con claridad y flujo.',
    micro: 'Arrastra, prioriza, avanza.',
    grad: 'linear-gradient(135deg, #9CEDC1, #60AFFF)',
    lightGrad: 'linear-gradient(135deg, rgba(156,237,193,0.12), rgba(96,175,255,0.08))',
    border: 'rgba(156,237,193,0.4)',
    microColor: '#38b97a',
  },
  {
    icon: <Globe size={22} />,
    title: 'Equipos con espacio virtual propio',
    desc: 'Cada equipo tiene su "mundo" y su dinámica.',
    micro: 'Contexto compartido, identidad real.',
    grad: 'linear-gradient(135deg, #60AFFF, #86F0FD)',
    lightGrad: 'linear-gradient(135deg, rgba(96,175,255,0.12), rgba(134,240,253,0.08))',
    border: 'rgba(96,175,255,0.4)',
    microColor: '#2e8fd4',
  },
  {
    icon: <Users size={22} />,
    title: 'Gestión de miembros',
    desc: 'Invita, asigna roles, ajusta permisos.',
    micro: 'Orden sin burocracia.',
    grad: 'linear-gradient(135deg, #d99aee, #5961F9)',
    lightGrad: 'linear-gradient(135deg, rgba(217,154,238,0.12), rgba(89,97,249,0.08))',
    border: 'rgba(217,154,238,0.4)',
    microColor: '#7c3fbf',
  },
  {
    icon: <MessageCircle size={22} />,
    title: 'Chat integrado',
    desc: 'Conversaciones por equipo o por tema.',
    micro: 'Menos "¿en qué iba esto?"',
    grad: 'linear-gradient(135deg, #FF94AE, #F65A70)',
    lightGrad: 'linear-gradient(135deg, rgba(255,148,174,0.12), rgba(246,90,112,0.08))',
    border: 'rgba(255,148,174,0.4)',
    microColor: '#c43a5c',
  },
  {
    icon: <Phone size={22} />,
    title: 'Llamadas rápidas',
    desc: 'Conecta cuando el texto no alcanza.',
    micro: 'Una reunión breve, un gran avance.',
    grad: 'linear-gradient(135deg, #FF94AE, #FCE98D)',
    lightGrad: 'linear-gradient(135deg, rgba(255,148,174,0.12), rgba(252,233,141,0.08))',
    border: 'rgba(252,233,141,0.5)',
    microColor: '#b87a00',
  },
  {
    icon: <Star size={22} />,
    title: 'Puntos y niveles',
    desc: 'Logros por constancia y colaboración.',
    micro: 'Progreso medible, motivación sana.',
    grad: 'linear-gradient(135deg, #F65A70, #FFAF93)',
    lightGrad: 'linear-gradient(135deg, rgba(246,90,112,0.12), rgba(255,175,147,0.08))',
    border: 'rgba(246,90,112,0.3)',
    microColor: '#d4472a',
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 px-[5vw] overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(156,237,193,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(96,175,255,0.07) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(246,90,112,0.05) 0%, transparent 50%)',
        }}
      />

      <div className="max-w-[1160px] mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-[600px] mx-auto mb-14">
          <SectionLabel
            gradient="linear-gradient(90deg, #9CEDC1, #60AFFF)"
            textGrad="linear-gradient(90deg, #38b97a, #2e8fd4)"
            className="justify-center"
          >
            Funcionalidades
          </SectionLabel>
          <h2 className="font-maxwell text-display-lg text-grey-900">
            Todo lo que tu equipo necesita para moverse como uno solo.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat) => (
            <FeatureCard key={feat.title} feat={feat}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feat }: { feat: feature }) {
  return (
    <button
      className={`group relative rounded-[20px] p-7 cursor-default transition-all duration-300 hover:-translate-y-1`}
      style={{
        background: 'white',
        border: `1.5px solid ${feat.border}`,
        boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 12px 40px ${feat.border}`;
        e.currentTarget.style.background = feat.lightGrad;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.04)';
        e.currentTarget.style.background = 'white';
      }}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white mb-5"
        style={{ background: feat.grad, boxShadow: `0 4px 16px ${feat.border}` }}
      >
        {feat.icon}
      </div>

      <h3 className="font-maxwell text-[1rem] text-grey-900 mb-1.5">{feat.title}</h3>
      <p className="font-body text-[.87rem] leading-[1.6] text-grey-400 mb-3">{feat.desc}</p>
      <span
        className="font-body text-[.78rem] font-semibold flex items-center gap-1"
        style={{ color: feat.microColor }}
      >
        <span>→</span> {feat.micro}
      </span>
    </button>
  );
}
