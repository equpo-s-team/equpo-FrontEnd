import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle, MessageCircle, Activity } from 'lucide-react';

export default function Hero() {
    const [titleNumber, setTitleNumber] = useState(0);
    const titles = useMemo(
        () => ["colaborativo", "vivo", "responsable", "motivador", "interactivo"],
        []
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
        <section className="relative overflow-hidden min-h-screen">
            <div className="animated-gradient-bg"/>

            <div
                className="absolute -top-20 -left-28 w-[500px] h-[500px] rounded-full bg-radial-green pointer-events-none"/>

            <div
                className="max-w-[90vw] mx-auto px-[5vw] grid md:grid-cols-2 gap-12 items-center pt-[120px] pb-20 min-h-screen relative z-10">
                <div className="hero-copy-enter">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="block w-8 h-1 bg-green rounded"/>
                        <span className="font-body text-[0.95rem] font-bold tracking-[0.2em] uppercase text-green">
              Tu equipo, un mundo compartido
            </span>
                    </div>

                    <h1 className="font-maxwell text-[3.5rem] md:text-[4rem] text-dark mb-8 leading-[1.1]">
                        Organiza tareas.{' '} <br/>
                        <span className="relative inline-block overflow-hidden md:pb-2 md:pt-1 min-w-[1000px]">
                            &nbsp;
                            {titles.map((title, index) => (
                                <motion.em
                                    key={index}
                                    className="absolute not-italic font-bold left-0 top-3.5 pr-5"
                                    style={{
                                        background: 'linear-gradient(120deg, #89D99D 0%, #69E8F0 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                    initial={{ opacity: 0, y: "-100" }}
                                    transition={{ type: "spring", stiffness: 50 }}
                                    animate={
                                        titleNumber === index
                                            ? {
                                                y: 0,
                                                opacity: 1,
                                            }
                                            : {
                                                y: titleNumber > index ? -150 : 150,
                                                opacity: 0,
                                            }
                                    }
                                >
                                    {title}
                                </motion.em>
                            ))}
                        </span>
                        <br/>
                        Haz que el equipo prospere.
                    </h1>

                    <p className="font-body text-[1.3rem] leading-[1.6] text-muted max-w-[520px] mb-10">
                        Con equpo, cada tarea completada no solo avanza proyectos: mejora el bienestar del
                        espacio virtual del equipo. Trabajo real, impacto visible, motivación compartida.
                    </p>

                    <div className="flex flex-wrap gap-6 mb-10">
                        <a
                            href="#"
                            className="font-maxwell text-white bg-dark px-[2.5rem] py-[1.2rem] rounded-[12px] text-[1.1rem] no-underline shadow-[0_6px_25px_rgba(15,26,20,.2)] hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(15,26,20,.25)] transition-all"
                        >
                            Crear mi primer equipo
                        </a>
                    </div>

                    <div className="flex flex-col gap-3 mb-12">
                        {[
                            'Empieza en minutos.',
                            'Diseñado para equipos colaborativos.',
                        ].map((txt) => (
                            <p key={txt} className="font-body text-[0.95rem] text-muted flex items-center gap-2">
                                <Activity size={16} className="text-cyan" />
                                {txt}
                            </p>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-10">
                        {['Tablero colaborativo', 'Chat + llamadas', 'Progreso con puntos y niveles', 'Responsabilidad colectiva'].map(
                            (badge) => (
                                <span
                                    key={badge}
                                    className="font-body bg-green-light border border-green/25 text-green-deep text-[0.85rem] font-semibold px-[1.2rem] py-[0.6rem] rounded-full hover:bg-green/20 hover:-translate-y-px transition-all cursor-default"
                                >
                  {badge}
                </span>
                            )
                        )}
                    </div>

                    <p className="font-body text-[0.9rem] text-muted italic border-t border-border pt-6">
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
                            className="world-orb absolute top-1/2 left-1/2 w-[280px] h-[280px]"
                        />

                        <FloatCard className="float-card float-card-d1 top-[3%] -left-[8%] hover:scale-110 hover:rotate-1" icon={<TrendingUp size={20} />}
                                   title="Mundo activo" label="+12% esta semana" iconBg="bg-green/20"/>
                        <FloatCard className="float-card float-card-d2 top-[12%] -right-[5%] hover:scale-110 hover:-rotate-1" icon={<CheckCircle size={20} />}
                                   title="3 tareas completadas" label="Hoy" iconBg="bg-cyan/20"/>
                        <div className="float-card float-card-d3 float-card absolute bottom-[28%] -left-[10%] hover:scale-110 hover:rotate-1">
                            <FloatCardRing title="Nivel 7" label="75% al siguiente"/>
                        </div>
                        <FloatCard className="float-card float-card-d4 bottom-[18%] right-0 hover:scale-110 hover:-rotate-1" icon={<MessageCircle size={20} />}
                                   title="Chat activo" label="4 miembros en línea" iconBg="bg-yellow-100"/>
                    </div>
                </div>
            </div>
        </section>
    );
}

function FloatCard({className = '', icon, title, label, iconBg = 'bg-green/10'}) {
    return (
        <motion.div
            className={`absolute bg-white/95 backdrop-blur-md border border-border/50 rounded-3xl px-6 py-4 flex items-center gap-4 shadow-xl font-body text-base font-medium text-dark whitespace-nowrap transition-all duration-500 hover:shadow-2xl hover:bg-white hover:border-green/30 ${className}`}
            whileHover={{ 
                scale: 1.05, 
                rotate: [0, 1, -1, 0],
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.div 
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors duration-300 ${iconBg}`}
                whileHover={{ backgroundColor: "#7a8f7e" }}
            >
                {typeof icon === 'string' ? icon : icon}
            </motion.div>
            <div className="flex flex-col">
                <motion.span 
                    className="font-bold text-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    {title}
                </motion.span>
                <motion.span 
                    className="text-muted text-sm font-normal"
                    whileHover={{ scale: 1.05 }}
                >
                    {label}
                </motion.span>
            </div>
        </motion.div>
    );
}

function FloatCardRing({title, label}) {
    return (
        <motion.div
            className="bg-white/95 backdrop-blur-md border border-border/50 rounded-3xl px-6 py-4 flex items-center gap-4 shadow-xl font-body text-base font-medium text-dark whitespace-nowrap transition-all duration-500 hover:shadow-2xl hover:bg-white hover:border-green/30"
            whileHover={{ 
                scale: 1.05, 
                rotate: [0, -1, 1, 0],
                transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-green/20 transition-colors duration-300"
                whileHover={{ backgroundColor: "#7a8f7e" }}
            >
                <svg width="40" height="40" viewBox="0 0 40 40" style={{transform: 'rotate(-90deg)'}}>
                    <circle className="ring-bg" cx="20" cy="20" r="16"/>
                    <circle className="ring-fill" cx="20" cy="20" r="16"/>
                </svg>
            </motion.div>
            <div className="flex flex-col">
                <motion.span 
                    className="font-bold text-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    {title}
                </motion.span>
                <motion.span 
                    className="text-muted text-sm font-normal"
                    whileHover={{ scale: 1.05 }}
                >
                    {label}
                </motion.span>
            </div>
        </motion.div>
    );
}
