import { Check, ChevronLeft, ChevronRight, Lock, Plus, Shield, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { toastError } from '@/components/ui/toast.ts';
import { useSoundEffects } from '@/hooks/useSoundEffects.ts';

import { useTaskStepsRealtime } from '../../hooks/useTaskStepsRealtime.ts';
import { useToggleTaskStep } from '../../hooks/useToggleTaskStep.ts';
import type { TaskStep } from '../../types/taskSchema.ts';

const STEPS_PER_PAGE = 5;

/**
 * A step under local edit. `originalStep` is the step's text on the server at
 * the time we entered edit (null if newly added in this session).
 */
export type LocalStepDraft = {
  originalStep: string | null;
  step: string;
};

interface TaskStepsSectionProps {
  teamId: string;
  taskId: string;
  taskStatus: string;
  /** UID of the currently logged-in user */
  currentUserUid: string | null;
  /** Role of the current user in the team */
  myRole: string;
  /** Whether the current user is assigned to the task (directly or via group) */
  isAssigned: boolean;
  /** Whether to show the add-step input (create/edit mode) */
  canEdit: boolean;
  /** In create mode we receive the steps locally (not from API) */
  createMode?: boolean;
  localSteps?: string[];
  onLocalStepsChange?: (steps: string[]) => void;
  /** Edit-mode drafts (non-create); add/edit/delete operate on these locally and
   * are flushed to the API only when the parent commits the form. */
  editDrafts?: LocalStepDraft[];
  onEditDraftsChange?: (drafts: LocalStepDraft[]) => void;
  /** Whether the task has at least one assigned user or group; used to gate the
   * status-auto-transitioning toggle when the task is still in 'todo'. */
  taskHasAssignment?: boolean;
}

function StepRow({
  step,
  isSupero,
  isBlocked,
  canEdit,
  canToggle,
  onToggle,
  onDelete,
  onEdit,
}: {
  step: TaskStep;
  isSupero: boolean;
  isBlocked: boolean;
  canEdit: boolean;
  canToggle: boolean;
  onToggle: (isDone: boolean) => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(step.step);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editMode) inputRef.current?.focus();
  }, [editMode]);

  const handleEditSave = () => {
    if (editText.trim() && editText.trim() !== step.step) {
      onEdit(editText.trim());
    }
    setEditMode(false);
  };

  return (
    <div
      className={`flex items-center gap-2.5 py-2 px-3 rounded-[8px] group transition-colors
        ${isSupero ? 'bg-purple/20 border border-purple/20' : 'hover:bg-secondary/60'}`}
    >
      {/* Checkbox */}
      <button
        disabled={!canToggle || isBlocked}
        onClick={() => onToggle(!step.isDone)}
        className={`shrink-0 w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-all duration-200
          ${
            step.isDone
              ? 'bg-green border-green text-white'
              : isBlocked
                ? 'border-grey-200 bg-grey-100 cursor-not-allowed'
                : canToggle
                  ? 'border-grey-300 hover:border-green cursor-pointer'
                  : 'border-grey-200 cursor-not-allowed'
          }`}
      >
        {step.isDone && <Check size={10} strokeWidth={3} />}
      </button>

      {/* Label / edit input */}
      <div className="flex-1 min-w-0">
        {editMode ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleEditSave();
              if (e.key === 'Escape') setEditMode(false);
            }}
            maxLength={200}
            className="w-full text-[13px] bg-transparent border-b border-blue outline-none font-body text-grey-800"
          />
        ) : (
          <button
            type="button"
            className={`text-left text-[13px] font-body leading-snug break-words w-full
              ${step.isDone ? 'line-through text-grey-400' : 'text-grey-800'}
              ${isSupero ? 'font-semibold text-purple' : ''}
              ${canEdit && !isSupero ? 'cursor-text' : 'cursor-default'}`}
            onClick={() => canEdit && !isSupero && setEditMode(true)}
          >
            {step.step}
          </button>
        )}
      </div>

      {/* Supero Review indicators */}
      {isSupero && (
        <div className="flex items-center gap-1 shrink-0">
          {isBlocked ? (
            <span className="flex items-center gap-1 text-[10px] text-purple-foreground font-semibold">
              <Lock size={10} />
              Bloqueado
            </span>
          ) : (
            <Shield size={13} className="text-purple-foreground" />
          )}
        </div>
      )}

      {/* Delete button */}
      {canEdit && !isSupero && (
        <button
          onClick={onDelete}
          className="shrink-0 opacity-0 group-hover:opacity-100 text-grey-400 hover:text-red transition-all duration-150 cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function TaskStepsSection({
  teamId,
  taskId,
  taskStatus,
  myRole,
  isAssigned,
  canEdit,
  createMode = false,
  localSteps = [],
  onLocalStepsChange,
  editDrafts,
  onEditDraftsChange,
  taskHasAssignment = true,
}: TaskStepsSectionProps) {
  const [page, setPage] = useState(0);
  const [newStepText, setNewStepText] = useState('');

  const { data, isLoading } = useTaskStepsRealtime(
    createMode ? '' : teamId,
    createMode ? '' : taskId,
  );
  const { play } = useSoundEffects();
  const toggleStep = useToggleTaskStep();

  const isSpectator = myRole === 'spectator';
  const isLeaderOrCollab = myRole === 'leader' || myRole === 'collaborator';

  // Edit task (add/delete/edit steps): reviewers + leadership can edit, assigned workers cannot.
  const canEditTask = !isSpectator && (isLeaderOrCollab || !isAssigned);
  // Toggle regular steps: the assigned worker + leadership can mark progress.
  const canToggleRegularStep = !isSpectator && (isLeaderOrCollab || isAssigned);

  // In create mode, work with localSteps; otherwise with API steps
  const allApiSteps: TaskStep[] = data?.steps ?? [];

  if (createMode) {
    // Show local steps + a locked "Supero Review" placeholder
    const superoPlaceholder: TaskStep = {
      taskId: taskId ?? '',
      step: 'Supero Review',
      isDone: false,
      position: localSteps.length,
    };
    const displaySteps = [
      ...localSteps.map((s, i) => ({
        taskId: taskId ?? '',
        step: s,
        isDone: false,
        position: i,
      })),
      superoPlaceholder,
    ];

    const handleAddLocal = () => {
      const text = newStepText.trim();
      if (!text || localSteps.length >= 14) return;
      onLocalStepsChange?.([...localSteps, text]);
      setNewStepText('');
    };

    const handleDeleteLocal = (index: number) => {
      onLocalStepsChange?.(localSteps.filter((_, i) => i !== index));
    };

    const totalLocal = displaySteps.length;
    const totalPages = Math.ceil(totalLocal / STEPS_PER_PAGE);
    const pageSteps = displaySteps.slice(page * STEPS_PER_PAGE, (page + 1) * STEPS_PER_PAGE);
    return (
      <div className="flex flex-col mt-4 gap-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-grey-400">
            Pasos de la misión
          </span>
          <span className="text-[11px] font-semibold text-grey-400 bg-secondary px-2 py-0.5 rounded-full">
            0%
          </span>
        </div>

        {/* Add step input */}
        {localSteps.length < 14 && (
          <div className="flex gap-2 mt-2">
            <input
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLocal()}
              placeholder="Escribe un paso en orden…"
              maxLength={200}
              className="flex-1 px-3 py-1.5 rounded-[8px] border-[1.5px] border-grey-200 bg-secondary text-[13px] font-body text-grey-800 placeholder:text-grey-400 outline-none focus:border-blue transition-colors"
            />
            <button
              onClick={handleAddLocal}
              disabled={!newStepText.trim()}
              className="px-3 py-1.5 rounded-[8px] bg-blue text-white text-[12px] font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-blue/90 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1 mb-2">
          {pageSteps.map((step, i) => {
            const isSupero = step.step === 'Supero Review';
            const globalIndex = page * STEPS_PER_PAGE + i;
            return (
              <div
                key={step.step}
                className={`flex items-center gap-2.5 py-2 px-3 rounded-[8px] transition-colors
                  ${isSupero ? 'bg-violet-50 border border-violet-200/60' : 'bg-secondary/40'}`}
              >
                <div className="w-4 h-4 rounded border-[1.5px] border-grey-200 bg-grey-100 shrink-0" />
                <span
                  className={`flex-1 text-[13px] font-body leading-snug
                    ${isSupero ? 'font-semibold text-violet-700' : 'text-grey-700'}`}
                >
                  {step.step}
                </span>
                {isSupero && (
                  <span className="text-[10px] text-violet-400 font-semibold flex items-center gap-1">
                    <Lock size={10} /> Auto
                  </span>
                )}
                {!isSupero && (
                  <button
                    onClick={() => handleDeleteLocal(globalIndex)}
                    className="text-grey-400 hover:text-red cursor-pointer transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-[11px] text-grey-400 mb-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-0.5 hover:text-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={13} /> Anterior
            </button>
            <span>
              Pág. {page + 1} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-0.5 hover:text-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              Siguiente <ChevronRight size={13} />
            </button>
          </div>
        )}

        {localSteps.length >= 14 && (
          <p className="text-[11px] text-grey-400 italic mt-1">
            Máximo 14 pasos alcanzado (sin contar Supero Review)
          </p>
        )}
      </div>
    );
  }

  // ── View / edit mode ───────────────────────────────────────────────────────
  // In edit mode (canEdit && !createMode), the regular-step list is sourced from
  // `editDrafts` (parent-owned). All add/edit/delete operations mutate that
  // local draft and are flushed by the parent on form submit.
  // In view (read-only) mode, regular steps come from realtime (`allApiSteps`)
  // and toggle uses immediate API mutation.
  const isDraftEditing = canEdit && !createMode;
  const apiNonSupero = allApiSteps.filter((s) => s.step !== 'Supero Review');
  const superoStep = allApiSteps.find((s) => s.step === 'Supero Review');

  const draftSteps: TaskStep[] = (editDrafts ?? []).map((d, i) => ({
    taskId: taskId ?? '',
    step: d.step,
    isDone: false,
    position: i,
  }));

  const nonSupero = isDraftEditing ? draftSteps : apiNonSupero;
  const totalSteps = allApiSteps.length;
  const stepsDone = allApiSteps.filter((s) => s.isDone).length;
  const totalPages = Math.ceil(nonSupero.length / STEPS_PER_PAGE);
  const pageSteps = nonSupero.slice(page * STEPS_PER_PAGE, (page + 1) * STEPS_PER_PAGE);

  const handleToggle = (step: TaskStep, isDone: boolean) => {
    const isSuperoStep = step.step === 'Supero Review';
    // Toggling a regular step done while task is 'todo' would auto-transition
    // it to 'in-progress' on the backend; require an assignment first.
    if (!isSuperoStep && taskStatus === 'todo' && isDone && !taskHasAssignment) {
      toastError(
        'No se puede iniciar',
        'Asigna un usuario o grupo a la misión antes de marcar pasos.',
      );
      return;
    }
    play('stepChecked');
    toggleStep.mutate({ teamId, taskId, stepId: step.step, isDone });
  };

  const handleDelete = (step: TaskStep) => {
    if (!isDraftEditing || !onEditDraftsChange || !editDrafts) return;
    onEditDraftsChange(editDrafts.filter((d) => d.step !== step.step));
  };

  const handleEdit = (step: TaskStep, text: string) => {
    if (!isDraftEditing || !onEditDraftsChange || !editDrafts) return;
    onEditDraftsChange(editDrafts.map((d) => (d.step === step.step ? { ...d, step: text } : d)));
  };

  const handleAdd = () => {
    if (!isDraftEditing || !onEditDraftsChange || !editDrafts) return;
    const text = newStepText.trim();
    if (!text || editDrafts.length >= 14) return;
    if (editDrafts.some((d) => d.step === text)) return;
    onEditDraftsChange([...editDrafts, { originalStep: null, step: text }]);
    setNewStepText('');
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-grey-400">
          Pasos de la misión
        </span>
        {isLoading && !isDraftEditing ? (
          <span className="text-[11px] text-grey-300">Cargando…</span>
        ) : (
          <span className="text-[11px] font-semibold text-grey-400 bg-secondary px-2 py-0.5 rounded-full">
            {totalSteps > 0 ? Math.round((stepsDone / totalSteps) * 100) : 0}%
          </span>
        )}
      </div>

      {(!isLoading || isDraftEditing) && (
        <>
          {/* Regular steps (paginated) */}
          <div className="flex flex-col gap-1 mb-2">
            {pageSteps.map((step) => (
              <StepRow
                key={step.step}
                step={step}
                isSupero={false}
                isBlocked={false}
                canEdit={canEdit && canEditTask}
                canToggle={!canEdit && canToggleRegularStep}
                onToggle={(isDone) => handleToggle(step, isDone)}
                onDelete={() => handleDelete(step)}
                onEdit={(text) => handleEdit(step, text)}
              />
            ))}
            {nonSupero.length === 0 && !superoStep && (
              <p className="text-[12px] text-grey-400 italic py-2">No hay pasos definidos.</p>
            )}
          </div>

          {/* Pagination (regular steps only) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-[11px] text-grey-400 mb-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-0.5 hover:text-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={13} /> Anterior
              </button>
              <span>
                Pág. {page + 1} de {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-0.5 hover:text-blue disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed transition-colors"
              >
                Siguiente <ChevronRight size={13} />
              </button>
            </div>
          )}

          {/* Add step input — above Supero Review */}
          {canEdit && canEditTask && nonSupero.length < 14 && (
            <div className="flex gap-2 mt-1 mb-2">
              <input
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Agregar nuevo paso…"
                maxLength={200}
                className="flex-1 px-3 py-1.5 rounded-[8px] border-[1.5px] border-grey-200 bg-secondary text-[13px] font-body text-grey-800 placeholder:text-grey-400 outline-none focus:border-blue transition-colors"
              />
              <button
                onClick={handleAdd}
                disabled={!newStepText.trim()}
                className="px-3 py-1.5 rounded-[8px] bg-blue text-white text-[12px] font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed hover:bg-blue/90 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          )}

          {/* Supero Review — always at bottom */}
          {superoStep &&
            (() => {
              const isBlocked = taskStatus !== 'in-qa';
              const canToggle = !isBlocked && canEditTask;
              return (
                <StepRow
                  key={superoStep.step}
                  step={superoStep}
                  isSupero={true}
                  isBlocked={isBlocked}
                  canEdit={false}
                  canToggle={canToggle}
                  onToggle={(isDone) => handleToggle(superoStep, isDone)}
                  onDelete={() => {}}
                  onEdit={() => {}}
                />
              );
            })()}
        </>
      )}
    </div>
  );
}
