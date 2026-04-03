import React from 'react';
import {KpiMetrics} from "@/features/reports/components/types.ts";

interface DonutStatusProps {
    metrics: KpiMetrics;
}

const DonutStatus: React.FC<DonutStatusProps> = ({metrics}) => {
    const total = metrics.total;
    const percentages = {
        done: (metrics.done / total) * 100,
        progress: (metrics.progress / total) * 100,
        todo: (metrics.todo / total) * 100,
        qa: (metrics.qa / total) * 100,
        overdue: (metrics.overdue / total) * 100,
    };

    // Circunferencia: 2 * π * radio (radio = 52) ≈ 326.73
    const circumference = 2 * Math.PI * 52;
    const getDashArray = (percent: number) => {
        const length = (percent / 100) * circumference;
        return `${length} ${circumference - length}`;
    };

    // Acumulamos offset para apilar los segmentos (el orden importa)
    let offset = 0;
    const slices = [
        {key: 'done', percent: percentages.done, color: 'url(#gD)', gradientId: 'gD'},
        {key: 'progress', percent: percentages.progress, color: 'url(#gP)', gradientId: 'gP'},
        {key: 'qa', percent: percentages.qa, color: 'url(#gQ)', gradientId: 'gQ'},
        {key: 'todo', percent: percentages.todo, color: 'url(#gT)', gradientId: 'gT'},
        {key: 'overdue', percent: percentages.overdue, color: 'url(#gO)', gradientId: 'gO'},
    ].filter(s => s.percent > 0);

    // Orden de apilamiento: done, progress, qa, todo, overdue
    // Para stroke-dashoffset, necesitamos que el primer segmento empiece en 0
    // El offset para cada slice = suma de longitudes de los anteriores
    const getDashOffset = (index: number) => {
        let sum = 0;
        for (let i = 0; i < index; i++) {
            sum += (slices[i].percent / 100) * circumference;
        }
        return -sum;
    };

    return (
        <div className="panel neon-green">
            <div className="panel-header">
                <span className="panel-title">Estado general</span>
                <span style={{fontSize: '.71rem', color: 'var(--grey-400)'}}>{total} tareas</span>
            </div>
            <div className="donut-wrap">
                <div className="donut-svg-wrap">
                    <svg viewBox="0 0 156 156" width="156" height="156" style={{transform: 'rotate(-90deg)'}}>
                        <circle cx="78" cy="78" r="52" fill="none" stroke="var(--grey-100)" strokeWidth="20"/>
                        {slices.map((slice, idx) => (
                            <circle
                                key={slice.key}
                                cx="78"
                                cy="78"
                                r="52"
                                fill="none"
                                stroke={slice.color}
                                strokeWidth="20"
                                strokeDasharray={getDashArray(slice.percent)}
                                strokeDashoffset={getDashOffset(idx)}
                                strokeLinecap="round"
                            />
                        ))}
                        <defs>
                            <linearGradient id="gD" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#9CEDC1"/>
                                <stop offset="100%" stopColor="#CEFB7C"/>
                            </linearGradient>
                            <linearGradient id="gP" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#86F0FD"/>
                                <stop offset="100%" stopColor="#60AFFF"/>
                            </linearGradient>
                            <linearGradient id="gQ" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FF94AE"/>
                                <stop offset="100%" stopColor="#F65A70"/>
                            </linearGradient>
                            <linearGradient id="gT" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#9b7fe1"/>
                                <stop offset="100%" stopColor="#5961F9"/>
                            </linearGradient>
                            <linearGradient id="gO" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#F65A70"/>
                                <stop offset="100%" stopColor="#FFAF93"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="donut-center">
                        <span className="donut-val">{Math.round(percentages.done)}%</span>
                        <span className="donut-lbl">completado</span>
                    </div>
                </div>

                <div className="status-grid">
                    <div className="status-card">
                        <div className="s-dot"
                             style={{background: '#9CEDC1', boxShadow: '0 0 10px rgba(156,237,193,0.9)'}}></div>
                        <div>
                            <div className="s-label">Done</div>
                            <div className="s-val">{metrics.done} <span
                                className="s-pct">({Math.round(percentages.done)}%)</span></div>
                        </div>
                    </div>
                    <div className="status-card">
                        <div className="s-dot"
                             style={{background: '#86F0FD', boxShadow: '0 0 10px rgba(134,240,253,0.9)'}}></div>
                        <div>
                            <div className="s-label">In Progress</div>
                            <div className="s-val">{metrics.progress} <span
                                className="s-pct">({Math.round(percentages.progress)}%)</span></div>
                        </div>
                    </div>
                    <div className="status-card">
                        <div className="s-dot"
                             style={{background: '#9b7fe1', boxShadow: '0 0 10px rgba(155,127,225,0.8)'}}></div>
                        <div>
                            <div className="s-label">To Do</div>
                            <div className="s-val">{metrics.todo} <span
                                className="s-pct">({Math.round(percentages.todo)}%)</span></div>
                        </div>
                    </div>
                    <div className="status-card">
                        <div className="s-dot"
                             style={{background: '#FF94AE', boxShadow: '0 0 10px rgba(255,148,174,0.8)'}}></div>
                        <div>
                            <div className="s-label">In QA</div>
                            <div className="s-val">{metrics.qa} <span
                                className="s-pct">({Math.round(percentages.qa)}%)</span></div>
                        </div>
                    </div>
                    <div className="status-card warn">
                        <div className="s-dot"
                             style={{background: '#F65A70', boxShadow: '0 0 12px rgba(246,90,112,0.9)'}}></div>
                        <div style={{flex: 1}}>
                            <div className="s-label">Vencidas</div>
                            <div className="s-val" style={{color: '#c94155'}}>{metrics.overdue} <span
                                className="s-pct">({Math.round(percentages.overdue)}%)</span></div>
                        </div>
                        <span style={{fontSize: '.67rem', color: '#c94155', fontWeight: 500}}>⚠ atención</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonutStatus;