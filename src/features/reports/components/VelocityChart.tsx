import React from 'react';
import {velocityData} from "@/features/reports/components/data.ts";

const VelocityChart: React.FC = () => {
    const maxValue = Math.max(...velocityData.map(w => w.value));
    const avg = velocityData.reduce((acc, w) => acc + w.value, 0) / velocityData.length;
    const best = maxValue;
    const trend = 18; // mock

    return (
        <div className="panel neon-green">
            <div className="panel-header">
                <span className="panel-title">Velocidad de cierre semanal</span>
                <span style={{fontSize: '.7rem', color: 'var(--grey-400)'}}>tareas / semana</span>
            </div>
            <div className="bar-chart-wrap">
                {velocityData.map(week => {
                    const height = (week.value / maxValue) * 82;
                    const isMax = week.value === maxValue;
                    return (
                        <div key={week.weekLabel} className="bar-col">
                            <div
                                className="bar"
                                data-v={week.value}
                                style={{
                                    height: `${height}px`,
                                    background: isMax
                                        ? 'linear-gradient(180deg,#9CEDC1,#CEFB7C)'
                                        : 'linear-gradient(180deg,var(--grey-200),var(--grey-150))',
                                    boxShadow: isMax ? '0 0 18px rgba(156,237,193,0.65),0 0 6px rgba(206,251,124,0.5)' : 'none',
                                }}
                            ></div>
                            <span className="bar-lbl">{week.weekLabel}</span>
                        </div>
                    );
                })}
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginTop: '18px'}}>
                <div style={{textAlign: 'center'}}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'var(--grey-900)',
                        letterSpacing: '-0.03em'
                    }}>
                        {avg.toFixed(1)}
                    </div>
                    <div style={{fontSize: '.67rem', color: 'var(--grey-400)', marginTop: '2px'}}>promedio / sem.</div>
                </div>
                <div style={{
                    textAlign: 'center',
                    borderLeft: '1px solid var(--grey-150)',
                    borderRight: '1px solid var(--grey-150)'
                }}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: '#2e9660',
                        letterSpacing: '-0.03em',
                        textShadow: '0 0 14px rgba(156,237,193,0.7)'
                    }}>
                        {best}
                    </div>
                    <div style={{fontSize: '.67rem', color: 'var(--grey-400)', marginTop: '2px'}}>mejor semana</div>
                </div>
                <div style={{textAlign: 'center'}}>
                    <div style={{
                        fontSize: '1.2rem',
                        fontWeight: 600,
                        color: 'var(--grey-900)',
                        letterSpacing: '-0.03em'
                    }}>
                        ↑ {trend}%
                    </div>
                    <div style={{fontSize: '.67rem', color: 'var(--grey-400)', marginTop: '2px'}}>vs periodo ant.</div>
                </div>
            </div>
        </div>
    );
};

export default VelocityChart;