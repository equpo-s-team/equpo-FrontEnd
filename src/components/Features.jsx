import {SectionLabel} from './WhatIsEqupo';

const FEATURES = [
    {
        icon: '📋',
        title: 'Tablero colaborativo',
        desc: 'Organiza tareas con claridad y flujo.',
        micro: 'Arrastra, prioriza, avanza.',
    },
    {
        icon: '🌐',
        title: 'Equipos con espacio virtual propio',
        desc: 'Cada equipo tiene su "mundo" y su dinámica.',
        micro: 'Contexto compartido, identidad real.',
    },
    {
        icon: '👥',
        title: 'Gestión de miembros',
        desc: 'Invita, asigna roles, ajusta permisos.',
        micro: 'Orden sin burocracia.',
    },
    {
        icon: '💬',
        title: 'Chat integrado',
        desc: 'Conversaciones por equipo o por tema.',
        micro: 'Menos "¿en qué iba esto?"',
    },
    {
        icon: '📞',
        title: 'Llamadas rápidas',
        desc: 'Conecta cuando el texto no alcanza.',
        micro: 'Una reunión breve, un gran avance.',
    },
    {
        icon: '⭐',
        title: 'Puntos y niveles',
        desc: 'Logros por constancia y colaboración.',
        micro: 'Progreso medible, motivación sana.',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 px-[5vw] bg-white">
            <div className="max-w-[1160px] mx-auto">

                {/* Header */}
                <div className="text-center max-w-[600px] mx-auto mb-14">
                    <SectionLabel color="text-green" barColor="bg-green" className="justify-center">
                        Funcionalidades
                    </SectionLabel>
                    <h2 className="font-maxwell text-display-lg text-dark">
                        Todo lo que tu equipo necesita para moverse como uno solo.
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((feat, i) => (
                        <FeatureCard key={feat.title} feat={feat} delay={i % 3}/>
                    ))}
                </div>

            </div>
        </section>
    );
}

function FeatureCard({feat, delay}) {
    const delayClass = ['reveal-d1', 'reveal-d2', 'reveal-d3'][delay] ?? 'reveal-d1';

    return (
        <div
            className={`feat-card-hover bg-offwhite border border-border rounded-[18px] p-7 cursor-default reveal ${delayClass}`}>
            <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[1.35rem] mb-4"
                style={{background: 'linear-gradient(135deg, rgba(137,217,157,.12), rgba(105,232,240,.10))'}}
            >
                {feat.icon}
            </div>
            <h3 className="font-maxwell text-[1rem] text-dark mb-1.5">{feat.title}</h3>
            <p className="font-body text-[.87rem] leading-[1.6] text-muted mb-3">{feat.desc}</p>
            <span className="font-body text-[.78rem] font-medium text-green flex items-center gap-1">
        <span>→</span> {feat.micro}
      </span>
        </div>
    );
}
