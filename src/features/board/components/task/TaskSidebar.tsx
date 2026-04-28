import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Layers, Repeat, Settings, Tag, Type, Users, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AppProgress } from '@/components/ui/AppProgress.tsx';
import { AppSelect } from '@/components/ui/AppSelect.tsx';
import { DateTimePicker } from '@/components/ui/date-time-picker.tsx';
import { FieldLabel } from '@/components/ui/FieldLabel.tsx';
import { Input } from '@/components/ui/input.tsx';
import { SidebarSheet } from '@/components/ui/sidebar-sheet.tsx';
import { TagChip } from '@/components/ui/TagChip.tsx';
import type { TaskStatus, TeamTask } from '@/features/board/types';
import { useSidebar } from '@/features/navbar/SidebarContext.jsx';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups.ts';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers.ts';
import { useSoundEffects } from '@/hooks/useSoundEffects.ts';
import { toastError, toastSuccess } from '@/lib/toast.ts';

import { useCreateTask } from '../../hooks/useCreateTask.ts';
import { useCreateTaskStep } from '../../hooks/useCreateTaskStep.ts';
import { useDeleteTask } from '../../hooks/useDeleteTask.ts';
import { useDeleteTaskStep } from '../../hooks/useDeleteTaskStep.ts';
import { UseGenerateDescription } from '../../hooks/useGenerateDescription.ts';
import { useRecurringRollover } from '../../hooks/useRecurringRollover.ts';
import { useUpdateTask } from '../../hooks/useUpdateTask.ts';
import { useUpdateTaskStep } from '../../hooks/useUpdateTaskStep.ts';
import type { TaskStep } from '../../types/taskSchema.ts';
import { markdownToEditorHtml } from '../../utils/markdownUtils.ts';
import { needsRollover } from '../../utils/recurringRollover.ts';
import {
  DESCRIPTION_MAX_LENGTH,
  INTERVAL_OPTIONS,
  PRIORITY_OPTIONS,
  READONLY_PRIORITY_STYLE,
  STATUS_TO_PROGRESS,
  toInputDatetime,
} from '../../utils/taskUtils.ts';
import { COLUMN_CONFIG } from '../columnConfig';
import { MarkdownDescriptionEditor } from '../MarkdownDescriptionEditor.tsx';
import { TaskAssigneesPreview } from './TaskAssigneesPreview';
import TaskCommentarySection from './TaskCommentarySection';
import type { LocalStepDraft } from './TaskStepsSection';
import TaskStepsSection from './TaskStepsSection';

type BoardColumnId = 'todo' | 'progress' | 'qa' | 'done';

const STATUS_TO_COLUMN: Record<TaskStatus, BoardColumnId> = {
  todo: 'todo',
  'in-progress': 'progress',
  'in-qa': 'qa',
  done: 'done',
};

interface TaskSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view' | 'readonly';
  task?: TeamTask | null;
  teamId: string;
  defaultStatus?: string;
  onTaskCreated?: () => void;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
  /** Current user's role in the team */
  myRole?: string;
  /** Current user's Firebase UID */
  currentUserUid?: string | null;
}

export default function TaskSidebar({
  isOpen,
  onClose,
  mode,
  task,
  teamId,
  defaultStatus,
  myRole = 'member',
  currentUserUid = null,
}: TaskSidebarProps) {
  const queryClient = useQueryClient();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { play } = useSoundEffects();
  const { rollover } = useRecurringRollover();
  const { setActiveItem } = useSidebar() as { setActiveItem: (v: string) => void };

  const { data: members = [] } = useTeamMembers(teamId);
  const { data: groups = [] } = useTeamGroups(teamId);

  const assignableMembers = members.filter((m) => m.role !== 'spectator');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [assignedUserUid, setAssignedUserUid] = useState('');
  const [assignedGroupId, setAssignedGroupId] = useState('');
  const [categories, setCategories] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'days' | 'weeks' | 'months' | 'years'>(
    'days',
  );
  const [recurringCount, setRecurringCount] = useState<number | ''>(1);
  const [isEditView, setIsEditView] = useState(mode === 'create' || mode === 'edit');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  // Steps for create mode
  const [localSteps, setLocalSteps] = useState<string[]>([]);
  // Edit-mode step drafts and the original snapshot at edit-entry. Used to
  // batch step add/edit/delete until the user confirms with Guardar Cambios.
  const [editStepDrafts, setEditStepDrafts] = useState<LocalStepDraft[] | null>(null);
  const [originalEditSteps, setOriginalEditSteps] = useState<TaskStep[]>([]);

  const createTaskStep = useCreateTaskStep();
  const updateTaskStep = useUpdateTaskStep();
  const deleteTaskStep = useDeleteTaskStep();

  useEffect(() => {
    if (isOpen && task && needsRollover(task)) {
      rollover(task);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task?.id, task?.dueDate]);

  useEffect(() => {
    if (!isOpen) return;

    if (mode !== 'create' && task) {
      setName(task.name ?? '');
      setDescription(task.description ?? '');
      setDueDate(toInputDatetime(task.dueDate));
      setPriority(task.priority ?? 'medium');
      setAssignedUserUid(task.assignedUsers?.[0]?.uid ?? '');
      setAssignedGroupId(task.assignedGroupId ?? '');
      setCategories((task.categories ?? []).join(', '));
      setIsRecurring(task.isRecurring ?? false);
      setRecurringInterval(task.recurringInterval ?? 'days');
      setRecurringCount(task.recurringCount ?? 1);
      setIsEditView(mode === 'edit');
    } else {
      setName('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setAssignedUserUid('');
      setAssignedGroupId('');
      setCategories('');
      setIsRecurring(false);
      setRecurringInterval('days');
      setRecurringCount(1);
      setIsEditView(true);
      setLocalSteps([]);
    }
    setErrors({});
    setEditStepDrafts(null);
    setOriginalEditSteps([]);
  }, [isOpen, mode, task]);

  useEffect(() => {
    setErrors((prev) => {
      if (!Object.keys(prev).length) return prev;

      const next = { ...prev };
      const nameTrimmed = name.trim();
      const descriptionTrimmed = description.trim();
      const hasInvalidCategory = categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean)
        .some((c) => c.length > 12);

      if (next.name && nameTrimmed && nameTrimmed.length <= 100) delete next.name;
      if (
        next.description &&
        descriptionTrimmed &&
        descriptionTrimmed.length <= DESCRIPTION_MAX_LENGTH
      ) {
        delete next.description;
      }
      if (next.dueDate && dueDate && new Date(dueDate) > new Date()) delete next.dueDate;
      if (next.priority && priority) delete next.priority;
      if (next.categories && !hasInvalidCategory) delete next.categories;
      if (next.recurringCount && (!isRecurring || (recurringCount !== '' && recurringCount >= 1)))
        delete next.recurringCount;
      const hasSteps =
        mode === 'create' ? localSteps.length > 0 : (editStepDrafts?.length ?? 0) > 0;
      if (next.steps && hasSteps) delete next.steps;
      if (next.form) delete next.form;

      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [
    name,
    description,
    dueDate,
    priority,
    categories,
    isRecurring,
    recurringCount,
    assignedUserUid,
    assignedGroupId,
    recurringInterval,
    localSteps,
    editStepDrafts,
    mode,
  ]);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (name.trim().length > 100) e.name = 'Máximo 100 caracteres';
    if (!description.trim()) e.description = 'La descripción es obligatoria';
    if (description.trim().length > DESCRIPTION_MAX_LENGTH)
      e.description = `Máximo ${DESCRIPTION_MAX_LENGTH} caracteres`;
    if (!dueDate) e.dueDate = 'La fecha es obligatoria';
    else if (new Date(dueDate) <= new Date()) e.dueDate = 'Debe ser una fecha futura';
    if (!priority) e.priority = 'La prioridad es obligatoria';
    if (isRecurring && (recurringCount === '' || recurringCount < 1))
      e.recurringCount = 'Ingresa un número válido';

    // Require at least one step in create mode
    if (mode === 'create' && localSteps.length === 0) {
      e.steps = 'Agrega al menos un paso antes de crear la tarea';
    }
    // Require at least one step in edit mode when drafts are loaded
    if (mode !== 'create' && editStepDrafts !== null && editStepDrafts.length === 0) {
      e.steps = 'La tarea debe tener al menos un paso';
    }

    const catArray = categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);
    if (catArray.some((c) => c.length > 12)) {
      e.categories = 'Cada categoría no puede exceder los 12 caracteres';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function buildPayload() {
    const seenCategories = new Set();
    const catArray = categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .filter((category) => {
        const key = category.toLowerCase();
        if (seenCategories.has(key)) return false;
        seenCategories.add(key);
        return true;
      });

    return {
      name: name.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      priority,
      status: mode === 'create' ? ('todo' as const) : (task?.status ?? 'todo'),
      categories: catArray,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : 'days',
      recurringCount: isRecurring ? Number(recurringCount) || 1 : null,
      assignedUserUid: assignedUserUid || null,
      assignedGroupId: assignedGroupId || null,
      steps: mode === 'create' ? localSteps : undefined,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode !== 'create' && task) {
        // Flush step drafts: deletes → updates → creates
        if (stepsChanged && editStepDrafts !== null) {
          const draftsOriginalSet = new Set(
            editStepDrafts.map((d) => d.originalStep).filter((s): s is string => s !== null),
          );
          for (const orig of originalEditSteps) {
            if (!draftsOriginalSet.has(orig.step)) {
              await deleteTaskStep.mutateAsync({ teamId, taskId: task.id, stepId: orig.step });
            }
          }
          for (const draft of editStepDrafts) {
            if (draft.originalStep !== null && draft.originalStep !== draft.step) {
              await updateTaskStep.mutateAsync({
                teamId,
                taskId: task.id,
                stepId: draft.originalStep,
                step: draft.step,
              });
            }
          }
          for (const draft of editStepDrafts) {
            if (draft.originalStep === null) {
              await createTaskStep.mutateAsync({ teamId, taskId: task.id, step: draft.step });
            }
          }
        }
        if (fieldsChanged) {
          await updateTask.mutateAsync({ teamId, taskId: task.id, payload: buildPayload() });
        }
        play('taskUpdated');
        toastSuccess('Tarea actualizada', 'Los cambios se guardaron correctamente.');
      } else {
        const payload = buildPayload();
        await createTask.mutateAsync({ teamId, payload });
        play('taskCreated');
        toastSuccess('Tarea creada', `"${payload.name}" fue añadida al tablero.`);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la tarea';
      toastError('Error al guardar', msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!task?.id) return;
    setIsSubmitting(true);
    try {
      await deleteTask.mutateAsync({ teamId, taskId: task.id });
      play('taskDeleted');
      toastSuccess('Tarea eliminada', 'La tarea fue eliminada permanentemente.');
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      toastError('Error al eliminar', msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    if (mode === 'view' && isEditView) {
      setName(task?.name ?? '');
      setDescription(task?.description ?? '');
      setDueDate(toInputDatetime(task?.dueDate));
      setPriority(task?.priority ?? 'medium');
      setAssignedUserUid(task?.assignedUsers?.[0]?.uid ?? '');
      setAssignedGroupId(task?.assignedGroupId ?? '');
      setCategories((task?.categories ?? []).join(', '));
      setIsRecurring(task?.isRecurring ?? false);
      setRecurringInterval(task?.recurringInterval ?? 'days');
      setRecurringCount(task?.recurringCount ?? 1);
      setErrors({});
      setEditStepDrafts(null);
      setOriginalEditSteps([]);
      setIsEditView(false);
      return;
    }
    onClose();
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) onClose();
  };

  const handleInteractOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    const isDropdownContent = target.closest('[data-radix-dropdown-menu-content]');
    const isDropdownTrigger = target.closest('[data-radix-dropdown-menu-trigger]');

    if (isDropdownContent || isDropdownTrigger) {
      event.preventDefault();
    }
  };

  async function handleIADescriptionGeneration(inputDescription: string) {
    if (!inputDescription.trim()) return;

    setIsGeneratingDescription(true);
    try {
      const generatedDescription = await UseGenerateDescription(inputDescription);
      setDescription(generatedDescription);
      setErrors((prev) => {
        if (!prev.form) return prev;
        const next = { ...prev };
        delete next.form;
        return next;
      });
    } catch (err: unknown) {
      const form = err instanceof Error ? err.message : 'Error al generar la descripción';
      setErrors((prev) => ({ ...prev, form }));
    } finally {
      setIsGeneratingDescription(false);
    }
  }

  const stepsKey = ['task', teamId, task?.id ?? '', 'steps'] as const;
  const { data: cachedSteps } = useQuery<{ steps: TaskStep[] } | null>({
    queryKey: stepsKey,
    queryFn: () => (queryClient.getQueryData(stepsKey) as { steps: TaskStep[] }) ?? null,
    enabled: Boolean(teamId && task?.id),
    staleTime: Infinity,
  });

  // Seed edit-mode drafts exactly once per edit session, after the first Firestore snapshot.
  useEffect(() => {
    if (!isEditView || mode === 'create' || !isOpen || !task?.id) return;
    if (editStepDrafts !== null) return; // already seeded
    if (!cachedSteps) return; // snapshot not yet received
    const nonSupero = cachedSteps.steps.filter((s) => s.step !== 'Supero Review');
    setEditStepDrafts(nonSupero.map((s) => ({ originalStep: s.step, step: s.step })));
    setOriginalEditSteps(nonSupero);
  }, [isEditView, isOpen, mode, task?.id, cachedSteps, editStepDrafts]);

  const originalDueDate = task?.dueDate ? toInputDatetime(task.dueDate) : '';

  const fieldsChanged =
    mode === 'create' ||
    name.trim() !== (task?.name ?? '') ||
    description.trim() !== (task?.description ?? '') ||
    dueDate !== originalDueDate ||
    priority !== (task?.priority ?? 'medium') ||
    assignedUserUid !== (task?.assignedUsers?.[0]?.uid ?? '') ||
    assignedGroupId !== (task?.assignedGroupId ?? '') ||
    categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
      .join(', ') !== (task?.categories ?? []).join(', ') ||
    isRecurring !== (task?.isRecurring ?? false) ||
    recurringInterval !== (task?.recurringInterval ?? 'days') ||
    recurringCount !== (task?.recurringCount ?? 1);

  const stepsChanged =
    editStepDrafts !== null &&
    (editStepDrafts.length !== originalEditSteps.length ||
      editStepDrafts.some((d) => d.originalStep === null || d.originalStep !== d.step) ||
      originalEditSteps.some((o) => !editStepDrafts.some((d) => d.originalStep === o.step)));
  const hasChanges = fieldsChanged || stepsChanged;

  const isFormValid =
    Boolean(name.trim()) &&
    Boolean(description.trim()) &&
    Boolean(dueDate) &&
    Boolean(priority) &&
    Object.keys(errors).length === 0 &&
    (!isRecurring || (recurringCount !== '' && recurringCount >= 1));

  const isSubmitDisabled = isSubmitting || !isFormValid || !hasChanges;

  const isReadOnlyView =
    mode === 'readonly' || ((mode === 'view' || mode === 'edit') && !isEditView);

  const assignedUserUids = (task?.assignedUsers ?? []).map((u) => u.uid);
  const isSidebarSpectator = myRole === 'spectator';
  const isSidebarLeaderOrCollab = myRole === 'leader' || myRole === 'collaborator';
  const isSidebarAssigned = currentUserUid ? assignedUserUids.includes(currentUserUid) : false;
  const isTaskDone = task?.status === 'done';
  const canEditTask =
    !isSidebarSpectator && (isSidebarLeaderOrCollab || !isSidebarAssigned) && !isTaskDone;

  const selectedPriority =
    PRIORITY_OPTIONS.find((opt) => opt.value === priority)?.label ?? priority;
  const recurringLabel =
    INTERVAL_OPTIONS.find((opt) => opt.value === recurringInterval)?.label?.toLowerCase() ??
    recurringInterval;
  const priorityStyle = READONLY_PRIORITY_STYLE[priority] ?? READONLY_PRIORITY_STYLE.medium;
  const currentStatus = (
    mode !== 'create' ? (task?.status ?? defaultStatus ?? 'todo') : (defaultStatus ?? 'todo')
  ) as 'todo' | 'in-progress' | 'in-qa' | 'done';
  const liveSteps = cachedSteps?.steps ?? [];
  const liveTotal = liveSteps.length;
  const liveDone = liveSteps.filter((s) => s.isDone).length;
  const progress =
    liveTotal > 0
      ? Math.round((liveDone / liveTotal) * 100)
      : task && task.stepsTotal > 0
        ? Math.round((task.stepsDone / task.stepsTotal) * 100)
        : (STATUS_TO_PROGRESS[currentStatus] ?? 0);
  const progressColumn = STATUS_TO_COLUMN[currentStatus];
  const progressCfg = COLUMN_CONFIG[progressColumn];

  const formattedDueDate = (() => {
    if (!dueDate) return 'Sin fecha límite';
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return dueDate;
    return parsed.toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  })();

  const selectedGroup = groups.find((g) => g.id === assignedGroupId) ?? null;
  const readonlyAssignedUsers = task?.assignedUsers?.length ? task.assignedUsers : [];
  const parsedCategories = categories
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <>
      <SidebarSheet
        open={isOpen}
        onOpenChange={handleOpenChange}
        side="right"
        contentClassName="h-full w-full sm:w-[760px] xl:w-[920px] bg-primary border-l-[1.5px] border-grey-200 shadow-card-lg flex flex-col"
        contentProps={{
          onInteractOutside: handleInteractOutside,
          onPointerDownOutside: handleInteractOutside,
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <h2 className="font-maxwell text-base font-bold text-grey-800 tracking-wide">
            {isReadOnlyView
              ? 'Detalle de Tarea'
              : mode === 'edit' || mode === 'view'
                ? 'Editar Tarea'
                : 'Crear Tarea'}
          </h2>
          <div className="flex items-center gap-2">
            {(mode === 'edit' || mode === 'view') && isReadOnlyView && canEditTask && (
              <button
                type="button"
                onClick={() => setIsEditView(true)}
                className="px-3 py-1.5 rounded-[10px] text-xs font-semibold text-blue border border-blue/30 hover:bg-blue/8 transition-all duration-150 cursor-pointer"
              >
                Editar
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-grey-400 hover:text-grey-700 hover:bg-secondary transition-all duration-150 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {isReadOnlyView ? (
          <section className="flex-1 overflow-y-auto px-8 py-7 sm:px-10 sm:py-8">
            <div className="mb-5">
              <h1 className="font-maxwell text-2xl font-bold text-grey-900 tracking-wide">
                {name || 'Sin nombre'}
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
              <div className="sm:col-span-3">
                <FieldLabel required>
                  <Layers size={12} className="inline mr-1 -mt-0.5" />
                  Descripción
                </FieldLabel>
                {description.trim() ? (
                  <div
                    className="min-h-[280px] sm:min-h-[420px] max-h-[560px] overflow-y-auto py-2.5 text-md font-body text-grey-800 leading-relaxed [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: markdownToEditorHtml(description) }}
                  />
                ) : (
                  <p className="py-2.5 text-sm text-grey-400">Sin descripción</p>
                )}
              </div>

              <div className="sm:col-span-1 space-y-5">
                {/* Due Date */}
                <div>
                  <FieldLabel required>
                    <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
                    Fecha Límite
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">{formattedDueDate}</p>
                </div>

                {/* Priority */}
                <div>
                  <FieldLabel required>
                    <Zap size={12} className="inline mr-1 -mt-0.5" />
                    Prioridad
                  </FieldLabel>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${priorityStyle.text}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`} />
                    {selectedPriority}
                  </span>
                </div>

                {/* Assignees (users + group) */}
                <div>
                  <FieldLabel>
                    <Users size={12} className="inline mr-1 -mt-0.5" />
                    Asignación
                  </FieldLabel>
                  <TaskAssigneesPreview
                    assignedUsers={readonlyAssignedUsers}
                    members={assignableMembers}
                    assignedGroup={selectedGroup ?? null}
                    usersPerPage={10}
                    teamId={teamId}
                  />
                </div>

                {/* Categories */}
                <div>
                  <FieldLabel>
                    <Tag size={12} className="inline mr-1 -mt-0.5" />
                    Categorías
                  </FieldLabel>
                  {parsedCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {parsedCategories.map((category) => (
                        <TagChip key={category} label={category} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-body text-grey-800">Sin categorías</p>
                  )}
                </div>

                {/* Recurring */}
                <div>
                  <FieldLabel>
                    <Repeat size={12} className="inline mr-1 -mt-0.5" />
                    Recurrente
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">
                    {isRecurring ? `Cada ${recurringCount} ${recurringLabel}` : 'No'}
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400">
                      Progreso
                    </span>
                    <span
                      className={`font-maxwell text-[10px] font-bold ${progressCfg.progressColor}`}
                    >
                      {progress}%
                    </span>
                  </div>
                  <AppProgress value={progress} gradient={progressCfg.progressFill} />
                </div>
              </div>
            </div>

            {/* Steps section — visible in view mode */}
            {task?.id && (
              <TaskStepsSection
                teamId={teamId}
                taskId={task.id}
                taskStatus={task.status}
                currentUserUid={currentUserUid}
                myRole={myRole}
                assignedUserUids={(task.assignedUsers ?? []).map((u) => u.uid)}
                canEdit={isEditView}
                taskHasAssignment={
                  (task.assignedUsers?.length ?? 0) > 0 || Boolean(task.assignedGroupId)
                }
              />
            )}

            {/* Commentary section — visible in view mode */}
            {task?.id && (
              <TaskCommentarySection
                teamId={teamId}
                taskId={task.id}
                currentUserUid={currentUserUid}
                myRole={myRole}
              />
            )}
          </section>
        ) : (
          <>
            {/* ── Form ── */}
            <form
              onSubmit={(e) => void handleSubmit(e)}
              className="flex-1 overflow-y-auto px-6 py-5"
            >
              {/* Name */}
              <div className="mb-5">
                <FieldLabel required>
                  <Type size={12} className="inline mr-1 -mt-0.5" />
                  Nombre
                </FieldLabel>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Nombre de la tarea"
                  className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-sm font-body bg-primary text-grey-800 placeholder:text-grey-400 outline-none transition-colors duration-150 ${errors.name ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
                />
                {errors.name && <p className="mt-1 text-xs text-red">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                {/* Left: description */}
                <div className="sm:col-span-3">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <FieldLabel required>
                      <Layers size={12} className="inline mr-1 -mt-0.5" />
                      Descripción
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={() => void handleIADescriptionGeneration(description)}
                      disabled={isSubmitting || isGeneratingDescription || !description.trim()}
                      className="px-3 py-1.5 rounded-[10px] text-xs font-semibold text-blue border border-blue/30 hover:bg-blue/8 transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGeneratingDescription ? 'Generando...' : 'Generar con IA'}
                    </button>
                  </div>
                  <MarkdownDescriptionEditor
                    value={description}
                    onChange={setDescription}
                    maxLength={DESCRIPTION_MAX_LENGTH}
                    hasError={Boolean(errors.description)}
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red">{errors.description}</p>
                  )}

                  {/* Steps section in create/edit mode */}
                  <TaskStepsSection
                    teamId={teamId}
                    taskId={task?.id ?? ''}
                    taskStatus={task?.status ?? 'todo'}
                    currentUserUid={currentUserUid}
                    myRole={myRole}
                    assignedUserUids={(task?.assignedUsers ?? []).map((u) => u.uid)}
                    canEdit={true}
                    createMode={mode === 'create'}
                    localSteps={localSteps}
                    onLocalStepsChange={setLocalSteps}
                    editDrafts={mode !== 'create' ? (editStepDrafts ?? []) : undefined}
                    onEditDraftsChange={mode !== 'create' ? setEditStepDrafts : undefined}
                    taskHasAssignment={
                      (task?.assignedUsers?.length ?? 0) > 0 || Boolean(task?.assignedGroupId)
                    }
                  />
                  {errors.steps && <p className="mt-1 text-xs text-red">{errors.steps}</p>}
                </div>

                {/* Right: rest of task attributes */}
                <div className="sm:col-span-1 space-y-5">
                  {/* Due Date */}
                  <div>
                    <FieldLabel required>
                      <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
                      Fecha Límite
                    </FieldLabel>
                    <DateTimePicker
                      value={dueDate}
                      onChange={setDueDate}
                      placeholder="Seleccionar fecha y hora"
                      error={!!errors.dueDate}
                      required={true}
                      showLabel={false}
                    />
                    {errors.dueDate && <p className="mt-1 text-xs text-red">{errors.dueDate}</p>}
                  </div>

                  {/* Priority */}
                  <div>
                    <FieldLabel required>
                      <Zap size={12} className="inline mr-1 -mt-0.5" />
                      Prioridad
                    </FieldLabel>
                    <AppSelect
                      value={priority}
                      onChange={(v) => setPriority(v as 'high' | 'medium' | 'low')}
                      options={[
                        {
                          value: 'high',
                          label: 'Alta',
                          icon: <span className="w-2 h-2 rounded-full bg-red shrink-0" />,
                        },
                        {
                          value: 'medium',
                          label: 'Media',
                          icon: <span className="w-2 h-2 rounded-full bg-orange-dark shrink-0" />,
                        },
                        {
                          value: 'low',
                          label: 'Baja',
                          icon: <span className="w-2 h-2 rounded-full bg-green shrink-0" />,
                        },
                      ]}
                      triggerClassName="w-full"
                    />
                  </div>

                  {/* Assigned User */}
                  <div>
                    <FieldLabel>
                      <Users size={12} className="inline mr-1 -mt-0.5" />
                      Usuario Asignado
                    </FieldLabel>
                    <AppSelect
                      value={assignedUserUid}
                      onChange={setAssignedUserUid}
                      options={[
                        { value: '', label: 'Sin asignar' },
                        ...assignableMembers.map((m) => ({ value: m.uid, label: m.displayName || m.uid })),
                      ]}
                      triggerClassName="w-full"
                    />
                  </div>

                  {/* Assigned Group */}
                  <div>
                    <FieldLabel>
                      <Users size={12} className="inline mr-1 -mt-0.5" />
                      Grupo Asignado
                    </FieldLabel>
                    <AppSelect
                      value={assignedGroupId}
                      onChange={(v) => {
                        if (v === '__more_groups__') {
                          setActiveItem('settings');
                          return;
                        }
                        setAssignedGroupId(v);
                      }}
                      options={[
                        { value: '', label: 'Sin asignar' },
                        ...groups.map((g) => ({ value: g.id, label: g.groupName })),
                        ...(isSidebarLeaderOrCollab
                          ? [
                              {
                                value: '__more_groups__',
                                label: 'Crear grupo',
                                icon: <Settings size={12} className="text-grey-400" />,
                              },
                            ]
                          : []),
                      ]}
                      triggerClassName="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div>
                    <FieldLabel>
                      <Tag size={12} className="inline mr-1 -mt-0.5" />
                      Categorías
                    </FieldLabel>
                    <input
                      type="text"
                      value={categories}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategories(val);
                        const catArray = val
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean);
                        if (catArray.some((c) => c.length > 12)) {
                          setErrors((prev) => ({
                            ...prev,
                            categories: 'Cada categoría no puede exceder los 12 caracteres',
                          }));
                        } else {
                          setErrors((prev) => {
                            const newErr = { ...prev };
                            delete newErr.categories;
                            return newErr;
                          });
                        }
                      }}
                      placeholder="Backend, API, Diseño..."
                      className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-sm font-body bg-primary outline-none transition-colors duration-150 ${
                        errors.categories
                          ? 'border-red/50 text-red focus:border-red'
                          : 'border-grey-200 text-grey-800 placeholder:text-grey-400 focus:border-blue'
                      }`}
                    />
                    {errors.categories ? (
                      <p className="mt-1 text-xs font-medium text-red">{errors.categories}</p>
                    ) : (
                      <p className="mt-1 text-xs text-grey-400">Separadas por coma</p>
                    )}
                  </div>

                  {/* Recurring Toggle */}
                  <div>
                    <FieldLabel>
                      <Repeat size={12} className="inline mr-1 -mt-0.5" />
                      Recurrente
                    </FieldLabel>
                    <button
                      type="button"
                      onClick={() => setIsRecurring((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${isRecurring ? 'bg-blue' : 'bg-grey-300'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isRecurring ? 'translate-x-6' : 'translate-x-1'}`}
                      />
                    </button>

                    {isRecurring && (
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs text-grey-600">Cada</span>
                        <Input
                          type="number"
                          min={1}
                          max={365}
                          value={recurringCount}
                          onChange={(e) =>
                            setRecurringCount(e.target.value === '' ? '' : Number(e.target.value))
                          }
                          className={`w-16 px-2 py-1.5 rounded-[8px] border-[1.5px] text-sm font-body text-center bg-primary text-grey-800 outline-none transition-colors duration-150 ${errors.recurringCount ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
                        />
                        <AppSelect
                          value={recurringInterval}
                          onChange={(v) =>
                            setRecurringInterval(v as 'days' | 'weeks' | 'months' | 'years')
                          }
                          options={INTERVAL_OPTIONS.map((opt) => ({
                            value: opt.value,
                            label: opt.label,
                          }))}
                          triggerClassName="flex-1"
                        />
                      </div>
                    )}
                    {errors.recurringCount && (
                      <p className="mt-1 text-xs text-red">{errors.recurringCount}</p>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* ── Footer ── */}
            <div className="px-6 py-4 border-t border-grey-200 flex items-center gap-3">
              {(mode === 'edit' || mode === 'view') && (
                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-[10px] text-sm font-semibold text-red border-[1.5px] border-red/30 hover:bg-red/8 transition-all duration-150 cursor-pointer disabled:opacity-50"
                >
                  Eliminar
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-[10px] text-sm font-semibold text-grey-500 border-[1.5px] border-grey-200 hover:border-grey-300 transition-all duration-150 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={(e) => void handleSubmit(e)}
                disabled={isSubmitDisabled}
                className="px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white bg-gradient-to-r from-green to-blue shadow-green-glow hover:shadow-green-glow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-green-glow"
              >
                {isSubmitting
                  ? 'Guardando...'
                  : mode === 'edit' || mode === 'view'
                    ? 'Guardar Cambios'
                    : 'Crear Tarea'}
              </button>
            </div>
          </>
        )}
      </SidebarSheet>
    </>
  );
}
