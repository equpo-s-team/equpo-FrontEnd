import { AlertTriangle, CalendarDays, Clock, Edit3, RefreshCw, Tag, X, Zap } from 'lucide-react';
import { useEffect } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';
import { TaskAssigneesPreview } from '@/features/board/components/TaskAssigneesPreview';
import TaskCommentarySection from '@/features/board/components/TaskCommentarySection';
import TaskStepsSection from '@/features/board/components/TaskStepsSection';
import { useRecurringRollover } from '@/features/board/hooks/useRecurringRollover';
import type { TeamTask } from '@/features/board/types';
import { needsRollover } from '@/features/board/utils/recurringRollover';
import {
  calculateNextRecurrenceDate,
  isTaskOverdue,
  type ProjectedTeamTask,
} from '@/features/board/utils/taskUtils';

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

interface TaskDetailPanelProps {
  task: TeamTask | null;
  onClose: () => void;
  onEdit: (task: TeamTask) => void;
  members?: { uid: string; displayName: string | null; photoUrl?: string | null }[];
  groups?: { id: string; groupName: string; photoUrl?: string | null }[];
  currentUserUid?: string | null;
  myRole?: string;
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
  groups = [],
  currentUserUid = null,
  myRole = 'member',
}: TaskDetailPanelProps) {
  const { teamId } = useTeam();
  const { rollover } = useRecurringRollover();

  useEffect(() => {
    if (task && !(task as ProjectedTeamTask).originalId && needsRollover(task)) {
      rollover(task);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, task?.dueDate]);

  if (!task) {
    return (
      <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-6 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-grey-100 flex items-center justify-center mx-auto mb-3">
            <Zap size={20} className="text-grey-300" />
          </div>
          <p className="text-sm font-medium text-grey-400 font-body">Selecciona una tarea</p>
        </div>
      </div>
    );
  }

  const isProjection = Boolean((task as ProjectedTeamTask).originalId);
  const status = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.todo;
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
  const selectedGroup = groups.find((group) => group.id === task.assignedGroupId) ?? null;
  const isOverdue = isTaskOverdue(task);

  const panelAssignedUids = (task.assignedUsers ?? []).map((u) => u.uid);
  const isPanelSpectator = myRole === 'spectator';
  const isPanelLeaderOrCollab = myRole === 'leader' || myRole === 'collaborator';
  const isPanelAssigned = currentUserUid ? panelAssignedUids.includes(currentUserUid) : false;
  const canEditTask = !isPanelSpectator && (isPanelLeaderOrCollab || !isPanelAssigned);

  return (
    <div className="flex flex-col gap-3">
      {/* ── Detalle bubble ── */}
      <div
        className={`rounded-2xl border shadow-card flex flex-col overflow-hidden animate-fade-down ${isOverdue ? 'bg-red/10 border-red/20' : 'bg-white border-grey-150'}`}
      >
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
          {/* Overdue alert */}
          {isOverdue && (
            <div className="px-3 py-2 mb-2 flex items-center justify-center gap-2">
              <AlertTriangle size={16} className="text-red" />
              <span className="text-xs font-bold text-red font-body uppercase tracking-wider">
                Tarea Vencida
              </span>
            </div>
          )}

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
            <span
              className={`flex items-center gap-1.5 text-xs font-bold font-body ${priority.color}`}
            >
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

          {/* Assignees (users + group) */}
          {(task.assignedUsers?.length > 0 || selectedGroup) && (
            <div className="mb-4">
              <TaskAssigneesPreview
                assignedUsers={task.assignedUsers ?? []}
                members={members}
                assignedGroup={selectedGroup}
                usersPerPage={10}
              />
            </div>
          )}

          {/* Recurring info */}
          {task.isRecurring && (
            <div className="mt-3 p-3 rounded-xl bg-purple/5 border border-purple/15">
              <div className="flex items-start gap-2">
                <RefreshCw size={14} className="text-purple shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-purple font-body">Tarea Recurrente</p>
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
                  {task.dueDate && task.recurringInterval && task.recurringCount && (
                    <p className="text-xs text-purple font-body font-semibold mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-purple/60 shrink-0" />
                      Siguiente:{' '}
                      {formatDate(
                        calculateNextRecurrenceDate(
                          task.dueDate,
                          task.recurringInterval,
                          task.recurringCount,
                        ).toISOString(),
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Edit button */}
          {!isOverdue && canEditTask && (
            <button
              onClick={() => onEdit(task)}
              className="
                mt-4 w-full flex items-center justify-center gap-2
                py-2.5 rounded-xl font-body text-xs font-bold
                bg-gradient-to-r from-blue to-purple text-white
                hover:shadow-[0_4px_20px_rgba(89,97,249,0.4)]
                active:scale-[0.98] transition-all duration-200
              "
            >
              <Edit3 size={13} />
              Editar tarea
            </button>
          )}

          {/* Checklist subsection — only for real (non-projected) tasks */}
          {!isProjection && teamId && (
            <TaskStepsSection
              teamId={teamId}
              taskId={task.id}
              taskStatus={task.status}
              canEdit={false}
              currentUserUid={currentUserUid}
              myRole={myRole}
              assignedUserUids={panelAssignedUids}
            />
          )}
        </div>
      </div>

      {/* ── Comentarios bubble — only for real tasks ── */}
      {!isProjection && teamId && (
        <div className="rounded-2xl bg-white border border-grey-150 shadow-card p-4">
          <TaskCommentarySection
            teamId={teamId}
            taskId={task.id}
            currentUserUid={currentUserUid}
            myRole={myRole}
          />
        </div>
      )}
    </div>
  );
}
