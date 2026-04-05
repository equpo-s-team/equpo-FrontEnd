import { CalendarDays, Layers, Repeat, Tag, Type, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

import { useCreateTask } from '../hooks/useCreateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { useUpdateTask } from '../hooks/useUpdateTask';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta', dot: 'bg-red' },
  { value: 'medium', label: 'Media', dot: 'bg-orange' },
  { value: 'low', label: 'Baja', dot: 'bg-green' },
];

const INTERVAL_OPTIONS = [
  { value: 'days', label: 'Días' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'months', label: 'Meses' },
  { value: 'years', label: 'Años' },
];

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function toInputDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-[12px] font-semibold text-grey-600 mb-1.5 tracking-wide uppercase">
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  );
}

export default function TaskSidebar({ isOpen, onClose, mode, task, teamId, defaultStatus }) {
  const backdropRef = useRef(null);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const { data: members = [] } = useTeamMembers(teamId);
  const { data: groups = [] } = useTeamGroups(teamId);

  // ── form state ──
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedUserUid, setAssignedUserUid] = useState('');
  const [assignedGroupId, setAssignedGroupId] = useState('');
  const [categories, setCategories] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('days');
  const [recurringCount, setRecurringCount] = useState(1);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Populate / reset form ──
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && task) {
      setName(task.name ?? '');
      setDescription(task.description ?? '');
      setDueDate(toInputDate(task.dueDate));
      setPriority(task.priority ?? 'medium');
      setAssignedUserUid(task.assignedUsers?.[0]?.uid ?? '');
      setAssignedGroupId(task.assignedGroupId ?? '');
      setCategories((task.categories ?? []).join(', '));
      setIsRecurring(task.isRecurring ?? false);
      setRecurringInterval(task.recurringInterval ?? 'days');
      setRecurringCount(task.recurringCount ?? 1);
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
    }
    setErrors({});
  }, [isOpen, mode, task]);

  // ── Validation ──
  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'El nombre es obligatorio';
    if (name.trim().length > 100) e.name = 'Máximo 100 caracteres';
    if (!description.trim()) e.description = 'La descripción es obligatoria';
    if (description.trim().length > 500) e.description = 'Máximo 500 caracteres';
    if (!dueDate) e.dueDate = 'La fecha es obligatoria';
    else if (new Date(dueDate) <= new Date()) e.dueDate = 'Debe ser una fecha futura';
    if (!priority) e.priority = 'La prioridad es obligatoria';
    if (isRecurring && (!recurringCount || recurringCount < 1))
      e.recurringCount = 'Ingresa un número válido';

    const catArray = categories.split(',').map((c) => c.trim()).filter(Boolean);
    if (catArray.some((c) => c.length > 12)) {
      e.categories = 'Cada categoría no puede exceder los 12 caracteres';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Build payload ──
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
      status:
        mode === 'edit' ? (task?.status ?? defaultStatus ?? 'todo') : (defaultStatus ?? 'todo'),
      categories: catArray,
      isRecurring,
      recurringInterval: isRecurring ? recurringInterval : 'days',
      recurringCount: isRecurring ? recurringCount : null,
      assignedUserUid: assignedUserUid || null,
      assignedGroupId: assignedGroupId || null,
    };
  }

  // ── Handlers ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (mode === 'edit' && task) {
        await updateTask.mutateAsync({ teamId, taskId: task.id, payload });
      } else {
        await createTask.mutateAsync({ teamId, payload });
      }
      onClose();
    } catch (err) {
      setErrors({ form: err?.message || 'Error al guardar la tarea' });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!task?.id) return;
    setIsSubmitting(true);
    try {
      await deleteTask.mutateAsync({ teamId, taskId: task.id });
      onClose();
    } catch (err) {
      setErrors({ form: err?.message || 'Error al eliminar la tarea' });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Close on backdrop click ──
  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  // ── Compute changes & validity ──
  const originalDueDate = task?.dueDate
    ? new Date(task.dueDate).toISOString().split('T')[0]
    : '';

  const hasChanges =
    mode !== 'edit' ||
    name.trim() !== (task?.name ?? '') ||
    description.trim() !== (task?.description ?? '') ||
    dueDate !== originalDueDate ||
    priority !== (task?.priority ?? 'medium') ||
    assignedUserUid !== (task?.assignedUsers?.[0]?.uid ?? '') ||
    assignedGroupId !== (task?.assignedGroupId ?? '') ||
    categories.split(',').map(c => c.trim()).filter(Boolean).join(', ') !== (task?.categories ?? []).join(', ') ||
    isRecurring !== (task?.isRecurring ?? false) ||
    recurringInterval !== (task?.recurringInterval ?? 'days') ||
    recurringCount !== (task?.recurringCount ?? 1);

  const isFormValid =
    Boolean(name.trim()) &&
    Boolean(description.trim()) &&
    Boolean(dueDate) &&
    Boolean(priority) &&
    Object.keys(errors).length === 0 &&
    (!isRecurring || (recurringCount >= 1));

  const isSubmitDisabled = isSubmitting || !isFormValid || !hasChanges;

  return (
    <>
      {/* Backdrop */}
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

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 right-0 z-50 h-full w-full sm:w-[420px]
          bg-primary border-l-[1.5px] border-grey-200
          shadow-card-lg flex flex-col
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-grey-200">
          <h2 className="font-maxwell text-[16px] font-bold text-grey-800 tracking-wide">
            {mode === 'edit' ? 'Editar Tarea' : 'Crear Tarea'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-grey-400 hover:text-grey-700 hover:bg-secondary transition-all duration-150 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
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
              className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-body bg-primary text-grey-800 placeholder:text-grey-400 outline-none transition-colors duration-150 ${errors.name ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
            />
            {errors.name && <p className="mt-1 text-[11px] text-red">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <FieldLabel required>
              <Layers size={12} className="inline mr-1 -mt-0.5" />
              Descripción
            </FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Describe la tarea..."
              className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-body bg-primary text-grey-800 placeholder:text-grey-400 outline-none resize-none transition-colors duration-150 ${errors.description ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
            />
            {errors.description && (
              <p className="mt-1 text-[11px] text-red">{errors.description}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <FieldLabel required>
              <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
              Fecha Límite
            </FieldLabel>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={getMinDate()}
              className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-body bg-primary text-grey-800 outline-none transition-colors duration-150 ${errors.dueDate ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
            />
            {errors.dueDate && <p className="mt-1 text-[11px] text-red">{errors.dueDate}</p>}
          </div>

          {/* Priority */}
          <div>
            <FieldLabel required>Prioridad</FieldLabel>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] border-[1.5px] text-[12px] font-semibold transition-all duration-150 cursor-pointer ${
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
              className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
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
              className="w-full px-3 py-2.5 rounded-[10px] border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
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

                // Real-time validation
                const catArray = val.split(',').map((c) => c.trim()).filter(Boolean);
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
              className={`w-full px-3 py-2.5 rounded-[10px] border-[1.5px] text-[13px] font-body bg-primary outline-none transition-colors duration-150 ${
                errors.categories
                  ? 'border-red/50 text-red focus:border-red'
                  : 'border-grey-200 text-grey-800 placeholder:text-grey-400 focus:border-blue'
              }`}
            />
            {errors.categories ? (
              <p className="mt-1 text-[10px] font-medium text-red">{errors.categories}</p>
            ) : (
              <p className="mt-1 text-[10px] text-grey-400">Separadas por coma</p>
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
                <span className="text-[12px] text-grey-600">Cada</span>
                <input
                  type="number"
                  min={1}
                  max={365}
                  value={recurringCount}
                  onChange={(e) => setRecurringCount(Math.max(1, Number(e.target.value)))}
                  className={`w-16 px-2 py-1.5 rounded-[8px] border-[1.5px] text-[13px] font-body text-center bg-primary text-grey-800 outline-none transition-colors duration-150 ${errors.recurringCount ? 'border-red' : 'border-grey-200 focus:border-blue'}`}
                />
                <select
                  value={recurringInterval}
                  onChange={(e) => setRecurringInterval(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-[8px] border-[1.5px] border-grey-200 text-[13px] font-body bg-primary text-grey-800 outline-none focus:border-blue transition-colors duration-150 cursor-pointer"
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
              <p className="mt-1 text-[11px] text-red">{errors.recurringCount}</p>
            )}
          </div>

          {/* Form Error */}
          {errors.form && (
            <div className="px-3 py-2 rounded-[10px] bg-red/10 border border-red/30 text-[12px] text-red">
              {errors.form}
            </div>
          )}
        </form>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-grey-200 flex items-center gap-3">
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-red border-[1.5px] border-red/30 hover:bg-red/8 transition-all duration-150 cursor-pointer disabled:opacity-50"
            >
              Eliminar
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-grey-500 border-[1.5px] border-grey-200 hover:border-grey-300 transition-all duration-150 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-5 py-2.5 rounded-[10px] text-[13px] font-semibold text-white bg-gradient-to-r from-green to-blue shadow-green-glow hover:shadow-green-glow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-green-glow"
          >
            {isSubmitting ? 'Guardando...' : mode === 'edit' ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
        </div>
      </aside>
    </>
  );
}
