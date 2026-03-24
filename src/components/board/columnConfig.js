// src/utils/columnConfig.js
// Maps accent keys → Tailwind class strings
// All classes must be complete (no dynamic construction) so Tailwind can scan them.

export const COLUMN_CONFIG = {
    todo: {
        border: 'border-kanban-todo/40',
        shadow: 'shadow-col-todo',
        topBar: 'bg-kanban-todo/60',
        indicator: 'bg-kanban-todo shadow-neonGrey',
        indicatorAnim: '',
        title: 'text-kanban-todo',
        // card
        cardBorder: 'border-kanban-todo/30',
        cardShadow: 'shadow-card-todo',
        cardBorderHover: 'hover:border-kanban-todo/75',
        cardShadowHover: 'hover:shadow-card-todo-hover',
        // progress fill
        progressFill: 'bg-gradient-to-r from-grey-400 to-grey-300',
        progressColor: 'text-kanban-todo',
    },
    progress: {
        border: 'border-blue/45',
        shadow: 'shadow-col-progress',
        topBar: 'bg-blue',
        indicator: 'bg-blue shadow-neonBlue animate-pulse-neon',
        indicatorAnim: 'animate-pulse-neon',
        title: 'text-blue',
        cardBorder: 'border-blue/30',
        cardShadow: 'shadow-card-progress',
        cardBorderHover: 'hover:border-blue/75',
        cardShadowHover: 'hover:shadow-card-progress-hover',
        progressFill: 'bg-gradient-blue-bg',
        progressColor: 'text-blue',
    },
    qa: {
        border: 'border-kanban-qa/45',
        shadow: 'shadow-col-qa',
        topBar: 'bg-kanban-qa',
        indicator: 'bg-kanban-qa shadow-neonCyan',
        indicatorAnim: 'animate-pulse-neon-fast',
        title: 'text-kanban-qa',
        cardBorder: 'border-kanban-qa/30',
        cardShadow: 'shadow-card-qa',
        cardBorderHover: 'hover:border-kanban-qa/75',
        cardShadowHover: 'hover:shadow-card-qa-hover',
        progressFill: 'bg-gradient-progress-bg',
        progressColor: 'text-kanban-qa',
    },
    done: {
        border: 'border-green/45',
        shadow: 'shadow-col-done',
        topBar: 'bg-green',
        indicator: 'bg-green shadow-neonGreen',
        indicatorAnim: '',
        title: 'text-green',
        cardBorder: 'border-green/30',
        cardShadow: 'shadow-card-done',
        cardBorderHover: 'hover:border-green/75',
        cardShadowHover: 'hover:shadow-card-done-hover',
        progressFill: 'bg-gradient-green-bg',
        progressColor: 'text-green',
    },
};

export const PRIORITY_CONFIG = {
    high: {label: 'Alta', bg: 'bg-red/10', text: 'text-red', border: 'border-red/30'},
    medium: {label: 'Media', bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30'},
    low: {label: 'Baja', bg: 'bg-green/10', text: 'text-green', border: 'border-green/30'},
};

export const TAG_COLOR_CONFIG = {
    blue: {bg: 'bg-blue/10', text: 'text-blue', border: 'border-blue/30'},
    green: {bg: 'bg-green/10', text: 'text-green', border: 'border-green/30'},
    cyan: {bg: 'bg-[#86F0FD]/10', text: 'text-[#0891b2]', border: 'border-[#86F0FD]/30'},
    red: {bg: 'bg-red/10', text: 'text-red', border: 'border-red/30'},
    orange: {bg: 'bg-orange/10', text: 'text-orange', border: 'border-orange/30'},
    purple: {bg: 'bg-purple/10', text: 'text-purple', border: 'border-purple/30'},
};

// Map tag label → color key
export const TAG_LABEL_TO_COLOR = {
    Frontend: 'blue',
    Backend: 'green',
    API: 'cyan',
    Bug: 'red',
    Urgente: 'orange',
    Diseño: 'purple',
    Mobile: 'blue',
    Testing: 'green',
    Crítico: 'red',
    Research: 'orange',
};

// User avatar gradients (mapped to Tailwind background classes)
export const USER_GRADIENT = {
    AT: 'bg-avatar-at',
    JR: 'bg-avatar-jr',
    ML: 'bg-avatar-ml',
    CS: 'bg-avatar-cs',
    LV: 'bg-avatar-lv',
    DM: 'bg-avatar-dm',
    SR: 'bg-avatar-sr',
};
