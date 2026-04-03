export interface KpiMetrics {
    todo: number;
    progress: number;
    qa: number;
    done: number;
    overdue: number;
    total: number;
}

export interface Member {
    id: string;
    initials: string;
    name: string;
    role: string;
    completed: number;
    total: number;
    gradient: string;
    color: string;
}

export interface OverdueTask {
    id: string;
    title: string;
    owner: string;
    daysOverdue: number;
    priority: 'Alta' | 'Media' | 'Baja';
}

export interface VelocityData {
    weekLabel: string;
    value: number;
}