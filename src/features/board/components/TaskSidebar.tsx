import { CalendarDays, Layers, Repeat, Tag, Type, Users, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { TaskStatus, TeamTask } from '@/features/board/types';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useSoundEffects } from '@/hooks/useSoundEffects';

import { useCreateTask } from '../hooks/useCreateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { UseGenerateDescription } from '../hooks/useGenerateDescription.ts';
import { useUpdateTask } from '../hooks/useUpdateTask';
import { markdownToEditorHtml } from '../utils/markdownUtils';
import {
  DESCRIPTION_MAX_LENGTH,
  getMinDate,
  INTERVAL_OPTIONS,
  PRIORITY_OPTIONS,
  READONLY_PRIORITY_STYLE,
  STATUS_TO_PROGRESS,
  toInputDatetime,
} from '../utils/taskUtils';
import { COLUMN_CONFIG } from './columnConfig';
import { FieldLabel } from './FieldLabel';
import { MarkdownDescriptionEditor } from './MarkdownDescriptionEditor';
import { TagChip } from './TagChip';
import { TaskAssigneesPreview } from './TaskAssigneesPreview';

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
}

export default function TaskSidebar({
  isOpen,
  onClose,
  mode,
  task,
  teamId,
  defaultStatus,
}: TaskSidebarProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const { play } = useSoundEffects();

  const { data: members = [] } = useTeamMembers(teamId);
  const { data: groups = [] } = useTeamGroups(teamId);

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
  const [recurringCount, setRecurringCount] = useState(1);
  const [isEditView, setIsEditView] = useState(mode === 'create' || mode === 'edit');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

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
    }
    setErrors({});
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
      if (next.recurringCount && (!isRecurring || recurringCount >= 1)) delete next.recurringCount;
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
    if (isRecurring && (!recurringCount || recurringCount < 1))
      e.recurringCount = 'Ingresa un número válido';

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
      status: (mode !== 'create'
        ? (task?.status ?? defaultStatus ?? 'todo')
        : (defaultStatus ?? 'todo')) as 'todo' | 'in-progress' | 'in-qa' | 'done',
      categories: catArray,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : 'days',
      recurringCount: isRecurring ? recurringCount : null,
      assignedUserUid: assignedUserUid || null,
      assignedGroupId: assignedGroupId || null,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (mode !== 'create' && task) {
        await updateTask.mutateAsync({ teamId, taskId: task.id, payload });
        play('taskUpdated');
      } else {
        await createTask.mutateAsync({ teamId, payload });
        play('taskCreated');
      }
      onClose();
    } catch (err: unknown) {
      const form = err instanceof Error ? err.message : 'Error al guardar la tarea';
      setErrors({ form });
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
      onClose();
    } catch (err: unknown) {
      const form = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      setErrors({ form });
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
      setIsEditView(false);
      return;
    }
    onClose();
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) onClose();
  }

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

  const originalDueDate = task?.dueDate ? toInputDatetime(task.dueDate) : '';

  const hasChanges =
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

  const isFormValid =
    Boolean(name.trim()) &&
    Boolean(description.trim()) &&
    Boolean(dueDate) &&
    Boolean(priority) &&
    Object.keys(errors).length === 0 &&
    (!isRecurring || recurringCount >= 1);

  const isSubmitDisabled = isSubmitting || !isFormValid || !hasChanges;

  const isReadOnlyView =
    mode === 'readonly' || ((mode === 'view' || mode === 'edit') && !isEditView);

  const selectedPriority =
    PRIORITY_OPTIONS.find((opt) => opt.value === priority)?.label ?? priority;
  const recurringLabel =
    INTERVAL_OPTIONS.find((opt) => opt.value === recurringInterval)?.label?.toLowerCase() ??
    recurringInterval;
  const priorityStyle = READONLY_PRIORITY_STYLE[priority] ?? READONLY_PRIORITY_STYLE.medium;
  const currentStatus = (
    mode !== 'create' ? (task?.status ?? defaultStatus ?? 'todo') : (defaultStatus ?? 'todo')
  ) as 'todo' | 'in-progress' | 'in-qa' | 'done';
  const progress = STATUS_TO_PROGRESS[currentStatus] ?? 0;
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
      <div
        ref={backdropRef}
        role="button"
        aria-label="Cerrar panel"
        tabIndex={-1}
        onClick={handleBackdropClick}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose();
        }}
        className={`
          fixed inset-0 z-50 bg-grey-900/40 backdrop-blur-[2px]
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      />

      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-[760px] xl:w-[920px]
          bg-primary border-l-[1.5px] border-grey-200
          shadow-card-lg flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
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
            {(mode === 'edit' || mode === 'view') && isReadOnlyView && (
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
                    members={members}
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
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full relative ${progressCfg.progressFill} transition-[width] duration-500 ease-out`}
                      style={{ width: `${progress}%` }}
                    >
                      {progress > 0 && (
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1.5 blur-[2px] rounded-full"
                          style={{ background: 'inherit' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                </div>

                {/* Right: rest of task attributes */}
                <div className="sm:col-span-1 space-y-5">
                  {/* Due Date */}
                  <div>
                    <FieldLabel required>
                      <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
                      Fecha Límite
                    </FieldLabel>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      min={getMinDate()}
                      className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-sm font-body bg-primary text-grey-800 outline-none transition-colors duration-150 ${errors.dueDate ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
                    />
                    {errors.dueDate && <p className="mt-1 text-xs text-red">{errors.dueDate}</p>}
                  </div>

                  {/* Priority */}
                  <div>
                    <FieldLabel required>
                      <Zap size={12} className="inline mr-1 -mt-0.5" />
                      Prioridad
                    </FieldLabel>
                    <div className="flex gap-2">
                      {PRIORITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setPriority(opt.value as 'high' | 'medium' | 'low')}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] border-[1.5px] text-xs font-semibold transition-all duration-150 cursor-pointer ${
                            priority === opt.value
                              ? 'border-blue bg-blue/8 text-blue'
                              : 'border-grey-200 text-grey-500 hover:border-grey-300'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Assigned User */}
                  <div>
                    <FieldLabel>
                      <Users size={12} className="inline mr-1 -mt-0.5" />
                      Usuario Asignado
                    </FieldLabel>
                    <select
                      value={assignedUserUid}
                      onChange={(e) => setAssignedUserUid(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-grey-200 text-sm font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
                    >
                      <option value="">Sin asignar</option>
                      {members.map((m) => (
                        <option key={m.uid} value={m.uid}>
                          {m.displayName || m.uid}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Assigned Group */}
                  <div>
                    <FieldLabel>
                      <Users size={12} className="inline mr-1 -mt-0.5" />
                      Grupo Asignado
                    </FieldLabel>
                    <select
                      value={assignedGroupId}
                      onChange={(e) => setAssignedGroupId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-grey-200 text-sm font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
                    >
                      <option value="">Sin asignar</option>
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.groupName}
                        </option>
                      ))}
                    </select>
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
                        <input
                          type="number"
                          min={1}
                          max={365}
                          value={recurringCount}
                          onChange={(e) => setRecurringCount(Math.max(1, Number(e.target.value)))}
                          className={`w-16 px-2 py-1.5 rounded-[8px] border-[1.5px] text-sm font-body text-center bg-primary text-grey-800 outline-none transition-colors duration-150 ${errors.recurringCount ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
                        />
                        <select
                          value={recurringInterval}
                          onChange={(e) =>
                            setRecurringInterval(
                              e.target.value as 'days' | 'weeks' | 'months' | 'years',
                            )
                          }
                          className="flex-1 px-3 py-1.5 rounded-[8px] border-[1.5px] border-grey-200 text-sm font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
                        >
                          {INTERVAL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {errors.recurringCount && (
                      <p className="mt-1 text-xs text-red">{errors.recurringCount}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="mt-5 px-3 py-2 rounded-[10px] bg-red/10 border border-red/30 text-xs text-red">
                  {errors.form}
                </div>
              )}
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
      </aside>
    </>
  );
}
