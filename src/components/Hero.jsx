export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-white min-h-screen">
            <div
                className="absolute -top-20 -left-28 w-[500px] h-[500px] rounded-full bg-radial-green pointer-events-none"/>

            <div
                className="max-w-[90vw] mx-auto px-[5vw] grid md:grid-cols-2 gap-12 items-center pt-[120px] pb-20 min-h-screen">
                <div className="hero-copy-enter">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="block w-6 h-0.5 bg-green rounded"/>
                        <span className="font-body text-[0.78rem] font-semibold tracking-[0.15em] uppercase text-green">
              Tu equipo, un mundo compartido
            </span>
                    </div>

                    <h1 className="font-maxwell text-display-xl text-dark mb-5">
                        Organiza tareas.{' '} <br/>
                        <em
                            className="not-italic"
                            style={{
                                background: 'linear-gradient(120deg, #89D99D 0%, #69E8F0 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Sube de nivel.
                        </em>{' '}
                        <br/>
                        Haz que el equipo prospere.
                    </h1>

                    <p className="font-body text-[1.05rem] leading-[1.7] text-muted max-w-[480px] mb-8">
                        Con equpo, cada tarea completada no solo avanza proyectos: mejora el bienestar del
                        espacio virtual del equipo. Trabajo real, impacto visible, motivación compartida.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-5">
                        <a
                            href="#"
                            className="font-maxwell text-white bg-dark px-[1.8rem] py-[.85rem] rounded-[10px] text-[.95rem] no-underline shadow-[0_4px_20px_rgba(15,26,20,.18)] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(15,26,20,.22)] transition-all"
                        >
                            Crear mi primer equipo
                        </a>
                    </div>

                    <div className="flex flex-col gap-[.45rem] mb-8">
                        {[
                            'Empieza en minutos. No requiere configuración pesada.',
                            'Diseñado para equipos que quieren colaborar sin perder el ritmo.',
                        ].map((txt) => (
                            <p key={txt} className="font-body text-[.82rem] text-muted flex items-center gap-1.5">
                                <span className="text-cyan text-[.65rem]">✦</span>
                                {txt}
                            </p>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-7">
                        {['Tablero colaborativo', 'Chat + llamadas', 'Progreso con puntos y niveles', 'Responsabilidad colectiva'].map(
                            (badge) => (
                                <span
                                    key={badge}
                                    className="font-body bg-green-light border border-green/25 text-green-deep text-[.78rem] font-medium px-[.9rem] py-[.4rem] rounded-full hover:bg-green/20 hover:-translate-y-px transition-all cursor-default"
                                >
                  {badge}
                </span>
                            )
                        )}
                    </div>

                    <p className="font-body text-[.8rem] text-muted italic border-t border-border pt-4">
                        "Cuando todos aportan, el equipo lo siente."
                    </p>
                </div>

                <div className="hero-visual-enter flex items-center justify-center h-[520px]">
                    <div className="relative w-[420px] h-[420px]">

                        <div className="orbit-ring orbit-ring-1">
                            <div className="orbit-dot"/>
                        </div>
                        <div className="orbit-ring orbit-ring-2">
                            <div className="orbit-dot orbit-dot-cyan"/>
                        </div>

                        <div
                            className="world-orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px]"/>

                        <FloatCard className="float-card float-card-d1 top-[8%] -left-[5%]" icon="🌿"
                                   title="Mundo activo" label="+12% esta semana" iconBg="bg-green/20"/>
                        <FloatCard className="float-card float-card-d2 top-[14%] -right-[2%]" icon="⚡"
                                   title="3 tareas completadas" label="Hoy" iconBg="bg-cyan/20"/>
                        <div className="float-card float-card-d3 float-card absolute bottom-[18%] -left-[8%]">
                            <FloatCardRing title="Nivel 7" label="75% al siguiente"/>
                        </div>
                        <FloatCard className="float-card float-card-d4 bottom-[10%] right-0" icon="💬"
                                   title="Chat activo" label="4 miembros en línea" iconBg="bg-yellow-100"/>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FloatCard({className = '', icon, title, label, iconBg = 'bg-green/10'}) {
    return (
        <div
            className={`absolute bg-white border border-border rounded-2xl px-4 py-[.7rem] flex items-center gap-3 shadow-card font-body text-[.8rem] font-medium text-dark whitespace-nowrap ${className}`}
        >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[.9rem] ${iconBg}`}>
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-[.82rem]">{title}</span>
                <span className="text-muted text-[.68rem] font-normal">{label}</span>
            </div>
        </div>
    );
}

function FloatCardRing({title, label}) {
    return (
        <div
            className="bg-white border border-border rounded-2xl px-4 py-[.7rem] flex items-center gap-3 shadow-card font-body text-[.8rem] font-medium text-dark whitespace-nowrap">
            <div className="w-9 h-9 relative">
                <svg width="36" height="36" viewBox="0 0 36 36" style={{transform: 'rotate(-90deg)'}}>
                    <circle className="ring-bg" cx="18" cy="18" r="14"/>
                    <circle className="ring-fill" cx="18" cy="18" r="14"/>
                </svg>
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-[.82rem]">{title}</span>
                <span className="text-muted text-[.68rem] font-normal">{label}</span>
            </div>
        </div>
    );
}
