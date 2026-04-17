import { CalendarDays, Clock, Edit3, Tag, X, Zap } from 'lucide-react';

import type { TeamTask } from '@/features/board/types';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  todo: {
    label: 'Por Hacer',
    bg: 'bg-kanban-todo/15',
    text: 'text-kanban-todo',
    border: 'border-kanban-todo/30',
  },
  'in-progress': {
    label: 'En Progreso',
    bg: 'bg-blue/15',
    text: 'text-blue',
    border: 'border-blue/30',
  },
  'in-qa': {
    label: 'En QA',
    bg: 'bg-kanban-qa/15',
    text: 'text-kanban-qa',
    border: 'border-kanban-qa/30',
  },
  done: {
    label: 'Completada',
    bg: 'bg-green/15',
    text: 'text-green',
    border: 'border-green/30',
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; dot: string; color: string }> = {
  high: { label: 'Alta', dot: 'bg-red', color: 'text-red' },
  medium: { label: 'Media', dot: 'bg-orange-dark', color: 'text-orange-dark' },
  low: { label: 'Baja', dot: 'bg-green', color: 'text-green' },
};

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #60AFFF, #5961F9)',
  'linear-gradient(135deg, #9CEDC1, #86F0FD)',
  'linear-gradient(135deg, #F65A70, #FF94AE)',
  'linear-gradient(135deg, #FF94AE, #FCE98D)',
  'linear-gradient(135deg, #9b7fe1, #5961F9)',
];

interface TaskDetailPanelProps {
  task: TeamTask | null;
  onClose: () => void;
  onEdit: (task: TeamTask) => void;
  members?: { uid: string; displayName: string | null }[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskDetailPanel({
  task,
  onClose,
  onEdit,
  members = [],
}: TaskDetailPanelProps) {
  if (!task) {
    return (
      <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-grey-100 flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-grey-300" />
          </div>
          <p className="text-sm font-medium text-grey-400 font-body">Selecciona una tarea</p>
          <p className="text-xs text-grey-300 font-body mt-1">Haz clic en una tarea del timeline</p>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;

  return (
    <div className="rounded-2xl bg-white border border-grey-150 shadow-card flex flex-col overflow-hidden animate-fade-down">
      {/* Close / actions header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-xs font-bold uppercase tracking-widest text-grey-400 font-body">
          Detalle
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-grey-100 transition-colors text-grey-400 hover:text-grey-700"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
        {/* Status badge */}
        <div className="mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${status.bg} ${status.text} ${status.border}`}
          >
            {status.label}
          </span>
        </div>

        {/* Task name */}
        <h2 className="text-base font-bold text-grey-800 font-body leading-snug mb-1">
          {task.name}
        </h2>

        {/* Categories */}
        {task.categories?.length > 0 && (
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            <Tag size={12} className="text-grey-400 flex-shrink-0" />
            {task.categories.map((cat) => (
              <span
                key={cat}
                className="text-xs font-semibold text-purple bg-purple/10 px-2 py-0.5 rounded-md border border-purple/20"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <hr className="border-grey-100 my-3" />

        {/* Priority */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-grey-400" />
            <span className="text-xs text-grey-500 font-body">Prioridad</span>
          </div>
          <span className={`flex items-center gap-1.5 text-xs font-bold font-body ${priority.color}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${priority.dot}`} />
            {priority.label}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-grey-400" />
                <span className="text-xs text-grey-500 font-body">Hora</span>
              </div>
              <span className="text-xs font-bold text-grey-700 font-body">
                {formatTime(task.dueDate)}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-grey-400" />
                <span className="text-xs text-grey-500 font-body">Fecha</span>
              </div>
              <span className="text-xs font-bold text-grey-700 font-body">
                {formatDate(task.dueDate)}
              </span>
            </div>
          </>
        )}

        <hr className="border-grey-100 my-3" />

        {/* Description */}
        {task.description && (
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-grey-400 mb-1.5 font-body">
              Descripción
            </p>
            <p className="text-xs text-grey-600 font-body leading-relaxed">{task.description}</p>
          </div>
        )}

        {/* Edit button */}
        <button
          onClick={() => onEdit(task)}
          className="
            w-full flex items-center justify-center gap-2
            py-2.5 rounded-xl font-body text-xs font-bold
            bg-gradient-to-r from-blue to-purple text-white
            hover:shadow-[0_4px_20px_rgba(89,97,249,0.4)]
            active:scale-[0.98]
            transition-all duration-200
          "
        >
          <Edit3 size={14} />
          Editar Tarea
        </button>

        <hr className="border-grey-100 my-3" />

        {/* Assigned users */}
        {task.assignedUsers?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-grey-400 mb-2 font-body">
              Asignados
            </p>
            <div className="flex flex-col gap-2">
              {task.assignedUsers.map((user, i) => {
                const realMember = members.find((m) => m.uid === user.uid);
                const displayName =
                  realMember?.displayName ?? user.displayName ?? `Usuario ${user.uid.slice(0, 6)}`;
                return (
                  <div key={user.uid} className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{
                        background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length],
                      }}
                    >
                      {displayName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-grey-700 font-body">{displayName}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recurring info */}
        {task.isRecurring && (
          <div className="mt-3 p-2.5 rounded-xl bg-purple/5 border border-purple/15">
            <p className="text-xs font-bold text-purple font-body">🔄 Tarea Recurrente</p>
            <p className="text-xs text-grey-500 font-body mt-0.5">
              Cada {task.recurringCount ?? 1}{' '}
              {task.recurringInterval === 'days'
                ? 'día(s)'
                : task.recurringInterval === 'weeks'
                  ? 'semana(s)'
                  : task.recurringInterval === 'months'
                    ? 'mes(es)'
                    : 'año(s)'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
