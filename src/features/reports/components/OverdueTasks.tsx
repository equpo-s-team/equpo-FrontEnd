import React from 'react';
import {overdueTasks} from "@/features/reports/components/data.ts";

const OverdueTasks: React.FC = () => {
    return (
        <div className="panel neon-pink">
            <div className="panel-header">
                <span className="panel-title">Tareas vencidas</span>
                <button className="panel-action" style={{color: '#c94155'}}>Ver todas →</button>
            </div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 90px 34px',
                gap: '12px',
                padding: '0 0 8px',
                borderBottom: '1px solid var(--grey-150)'
            }}>
                <span style={{fontSize: '.65rem', color: 'var(--grey-400)'}}>Tarea</span>
                <span style={{fontSize: '.65rem', color: 'var(--grey-400)'}}>Días</span>
                <span style={{fontSize: '.65rem', color: 'var(--grey-400)'}}>Prio.</span>
            </div>
            <div className="overdue-scroll">
                {overdueTasks.map(task => (
                    <div key={task.id} className="ov-row">
                        <div>
                            <div className="ov-task">{task.title}</div>
                            <div className="ov-who">{task.owner}</div>
                        </div>
                        <div>
                            <span className="ov-days">+{task.daysOverdue} días</span>
                        </div>
                        <div>
              <span className={`prio ${task.priority === 'Alta' ? 'h' : task.priority === 'Media' ? 'm' : 'l'}`}>
                {task.priority}
              </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverdueTasks;