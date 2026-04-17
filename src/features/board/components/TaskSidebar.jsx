import { CalendarDays, Layers, List, Repeat, Tag, Type, Users, X, Zap } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

import { useCreateTask } from '../hooks/useCreateTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import { useUpdateTask } from '../hooks/useUpdateTask';

const PRIORITY_OPTIONS = [
  { value: 'high', label: 'Alta', dot: 'bg-red' },
  { value: 'medium', label: 'Media', dot: 'bg-orange-dark' },
  { value: 'low', label: 'Baja', dot: 'bg-green' },
];

const INTERVAL_OPTIONS = [
  { value: 'days', label: 'Días' },
  { value: 'weeks', label: 'Semanas' },
  { value: 'months', label: 'Meses' },
  { value: 'years', label: 'Años' },
];

const STATUS_TO_PROGRESS = {
  todo: 0,
  'in-progress': 40,
  'in-qa': 85,
  done: 100,
};

const TAG_COLORS = [
  'bg-blue/10 text-[10.5px] text-blue border-blue/50 shadow-[0_0_8px_rgba(96,175,255,0.4)]',
  'bg-kanban-qa/10 text-[10.5px] text-kanban-qa border-kanban-qa/50 shadow-[0_0_8px_rgba(255,148,174,0.4)]',
  'bg-green/10 text-[10.5px] text-green border-green/50 shadow-[0_0_8px_rgba(156,237,193,0.4)]',
  'bg-kanban-todo/10 text-[10.5px] text-kanban-todo border-kanban-todo/50 shadow-[0_0_8px_rgba(155,127,225,0.4)]',
  'bg-red/10 text-[10.5px] text-red border-red/50 shadow-[0_0_8px_rgba(246,90,112,0.4)]',
  'bg-kanban-progress/10 text-[10.5px] text-kanban-progress border-kanban-progress/50 shadow-[0_0_8px_rgba(134,240,253,0.4)]',
];

const READONLY_PRIORITY_STYLE = {
  high: { text: 'text-red', dot: 'bg-red' },
  medium: { text: 'text-orange-dark', dot: 'bg-orange-dark' },
  low: { text: 'text-green', dot: 'bg-green' },
};

const DESCRIPTION_MAX_LENGTH = 2000;

function getTagColorClass(label = '') {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % TAG_COLORS.length;
  return TAG_COLORS[index];
}

function ReadOnlyTagChip({ label }) {
  const colorClass = getTagColorClass(label);
  return (
    <span
      className={`px-2 py-[2.5px] rounded-[8px] font-semibold tracking-wide border-[1px] ${colorClass}`}
    >
      {label}
    </span>
  );
}

function getMinDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function toInputDatetime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    // Adjust to local timezone for the datetime-local input
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().slice(0, 16);
  } catch {
    return '';
  }
}

function FieldLabel({ children, required }) {
  return (
    <label className="block text-xs font-semibold text-grey-600 mb-1.5 tracking-wide uppercase">
      {children}
      {required && <span className="text-red ml-0.5">*</span>}
    </label>
  );
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  return html;
}

function markdownToEditorHtml(markdown) {
  if (!markdown?.trim()) return '<p><br></p>';

  const lines = markdown.split('\n');
  const chunks = [];
  let inList = false;

  const openList = () => {
    if (!inList) {
      chunks.push('<ul>');
      inList = true;
    }
  };

  const closeList = () => {
    if (inList) {
      chunks.push('</ul>');
      inList = false;
    }
  };

  for (const line of lines) {
    const bulletMatch = line.match(/^\s*-\s*(.*)$/);

    if (bulletMatch) {
      openList();
      const content = renderInlineMarkdown(bulletMatch[1]);
      chunks.push(`<li class=" text-grey-700">${content || '<br>'}</li>`);
      continue;
    }

    closeList();

    if (!line.trim()) {
      chunks.push('<p><br></p>');
      continue;
    }

    chunks.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }

  closeList();
  return chunks.join('');
}

function nodeToMarkdown(node) {
  if (!node) return '';

  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return '';
  }

  const el = node;
  const tag = el.tagName.toLowerCase();

  if (tag === 'br') return '\n';

  if (tag === 'strong' || tag === 'b') {
    return `**${Array.from(el.childNodes).map(nodeToMarkdown).join('')}**`;
  }

  if (tag === 'em' || tag === 'i') {
    return `*${Array.from(el.childNodes).map(nodeToMarkdown).join('')}*`;
  }

  return Array.from(el.childNodes).map(nodeToMarkdown).join('');
}

function editorHtmlToMarkdown(html) {
  const root = document.createElement('div');
  root.innerHTML = html;

  const lines = [];

  const parseListItem = (li) => {
    const text = nodeToMarkdown(li).trim();
    return `- ${text}`.trimEnd();
  };

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent ?? '').trim();
      if (text) lines.push(text);
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node;
    const tag = el.tagName.toLowerCase();

    if (tag === 'ul' || tag === 'ol') {
      Array.from(el.children).forEach((child) => {
        if (child.tagName.toLowerCase() === 'li') {
          lines.push(parseListItem(child));
        }
      });
      return;
    }

    if (tag === 'p' || tag === 'div') {
      const line = nodeToMarkdown(el).replace(/\n+/g, ' ').trim();
      lines.push(line);
      return;
    }

    const line = nodeToMarkdown(el).replace(/\n+/g, ' ').trim();
    lines.push(line);
  });

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function MarkdownDescriptionEditor({ value, onChange, maxLength, hasError }) {
  const editorRef = useRef(null);
  const lastValidMarkdownRef = useRef(value || '');

  const baseContainer = hasError ? 'border-red/50' : 'border-grey-200 focus-within:border-blue';

  useEffect(() => {
    if (!editorRef.current) return;

    const currentMarkdown = editorHtmlToMarkdown(editorRef.current.innerHTML);
    if (currentMarkdown === value) return;

    editorRef.current.innerHTML = markdownToEditorHtml(value);
    lastValidMarkdownRef.current = value || '';
  }, [value]);

  function syncEditorToMarkdown() {
    if (!editorRef.current) return;

    const markdown = editorHtmlToMarkdown(editorRef.current.innerHTML);

    if (markdown.length > maxLength) {
      editorRef.current.innerHTML = markdownToEditorHtml(lastValidMarkdownRef.current);
      return;
    }

    lastValidMarkdownRef.current = markdown;
    onChange(markdown);
  }

  function runCommand(command) {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false);
    syncEditorToMarkdown();
  }

  function ensureSelectionInsideEditor() {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection) return;

    const anchorNode = selection.anchorNode;
    const isInsideEditor = anchorNode && editorRef.current.contains(anchorNode);
    if (isInsideEditor) return;

    const range = document.createRange();
    range.selectNodeContents(editorRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function insertBulletItem() {
    if (!editorRef.current) return;
    ensureSelectionInsideEditor();

    const before = editorRef.current.innerHTML;
    const inserted = document.execCommand('insertUnorderedList', false);

    // Fallback for browsers/editors where list command may fail silently.
    if (!inserted || editorRef.current.innerHTML === before) {
      document.execCommand('insertHTML', false, '<ul><li><br></li></ul>');
    }

    syncEditorToMarkdown();
  }

  const charCount = value.length;

  return (
    <div className={`rounded-[10px] border-[1.5px] bg-primary transition-colors duration-150 ${baseContainer}`}>
      <div className="flex items-center justify-between border-b border-grey-150">
        <div className="flex items-center">
        <ToggleGroup type="multiple" className="gap-0">
          <ToggleGroupItem
            value="bold"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand('bold')}
            aria-label="Negrita"
            className="h-9 w-10 px-0 text-sm font-bold text-grey-700 !rounded-none"
          >
            B
          </ToggleGroupItem>
          <ToggleGroupItem
            value="italic"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand('italic')}
            aria-label="Itálica"
            className="h-9 w-10 px-0 text-sm italic text-grey-700 !rounded-none"
          >
            I
          </ToggleGroupItem>
          <ToggleGroupItem
            value="bullet"
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={insertBulletItem}
            aria-label="Viñeta"
            className="h-9 w-10 px-0 text-grey-700 !rounded-none"
          >
            <List size={14} />
          </ToggleGroupItem>
        </ToggleGroup>
         </div>
        <span className="text-[11px] text-grey-400 px-3">{charCount}/{maxLength}</span>
      </div>

      <div
        ref={editorRef}
        role="textbox"
        aria-multiline="true"
        contentEditable
        suppressContentEditableWarning
        onInput={syncEditorToMarkdown}
        onBlur={syncEditorToMarkdown}
        className="min-h-[280px] sm:min-h-[420px] max-h-[560px] overflow-y-auto px-3 py-2.5 text-sm font-body text-grey-800 outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:text-grey-700"
      />
    </div>
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
  const [isEditView, setIsEditView] = useState(mode !== 'edit');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Populate / reset form ──
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && task) {
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
      setIsEditView(false);
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

  // Limpia errores que ya no aplican para evitar bloqueo del botón Guardar.
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
      if (next.description && descriptionTrimmed && descriptionTrimmed.length <= DESCRIPTION_MAX_LENGTH) {
        delete next.description;
      }
      if (next.dueDate && dueDate && new Date(dueDate) > new Date()) delete next.dueDate;
      if (next.priority && priority) delete next.priority;
      if (next.categories && !hasInvalidCategory) delete next.categories;
      if (next.recurringCount && (!isRecurring || recurringCount >= 1)) delete next.recurringCount;

      // El error de submit se limpia cuando el usuario vuelve a editar.
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

  // ── Validation ──
  function validate() {
    const e = {};
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

  function handleCancel() {
    if (mode === 'edit') {
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

  // ── Close on backdrop click ──
  function handleBackdropClick(e) {
    if (e.target === backdropRef.current) onClose();
  }

  // ── Compute changes & validity ──
  const originalDueDate = task?.dueDate ? toInputDatetime(task.dueDate) : '';

  const hasChanges =
    mode !== 'edit' ||
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
  const isReadOnlyView = mode === 'edit' && !isEditView;

  const selectedPriority = PRIORITY_OPTIONS.find((opt) => opt.value === priority)?.label ?? 'Sin prioridad';
  const selectedUser = members.find((member) => member.uid === assignedUserUid);
  const selectedGroup = groups.find((group) => group.id === assignedGroupId);
  const categoriesList = categories
    .split(',')
    .map((category) => category.trim())
    .filter(Boolean);
  const recurringLabel =
    INTERVAL_OPTIONS.find((opt) => opt.value === recurringInterval)?.label?.toLowerCase() ?? recurringInterval;
  const priorityStyle = READONLY_PRIORITY_STYLE[priority] ?? READONLY_PRIORITY_STYLE.medium;
  const currentStatus = mode === 'edit' ? (task?.status ?? defaultStatus ?? 'todo') : (defaultStatus ?? 'todo');
  const progress = STATUS_TO_PROGRESS[currentStatus] ?? 0;
  const formattedDueDate = (() => {
    if (!dueDate) return 'Sin fecha límite';
    const parsed = new Date(dueDate);
    if (Number.isNaN(parsed.getTime())) return dueDate;
    return parsed.toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  })();

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
            {isReadOnlyView ? 'Detalle de Tarea' : mode === 'edit' ? 'Editar Tarea' : 'Crear Tarea'}
          </h2>
          <div className="flex items-center gap-2">
            {isReadOnlyView && (
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
                <div>
                  <FieldLabel required>
                    <CalendarDays size={12} className="inline mr-1 -mt-0.5" />
                    Fecha Límite
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">{formattedDueDate}</p>
                </div>

                <div>
                  <FieldLabel required>
                    <Zap size={12} className="inline mr-1 -mt-0.5" />
                    Prioridad
                  </FieldLabel>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${priorityStyle.text}`}>
                    <span className={`w-2 h-2 rounded-full ${priorityStyle.dot}`} />
                    {selectedPriority}
                  </span>
                </div>

                <div>
                  <FieldLabel>
                    <Users size={12} className="inline mr-1 -mt-0.5" />
                    Usuario Asignado
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">
                    {selectedUser?.displayName || selectedUser?.uid || 'Sin asignar'}
                  </p>
                </div>

                <div>
                  <FieldLabel>
                    <Users size={12} className="inline mr-1 -mt-0.5" />
                    Grupo Asignado
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">{selectedGroup?.groupName || 'Sin asignar'}</p>
                </div>

                <div>
                  <FieldLabel>
                    <Tag size={12} className="inline mr-1 -mt-0.5" />
                    Categorías
                  </FieldLabel>
                  {categoriesList.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {categoriesList.map((category) => (
                        <ReadOnlyTagChip key={category} label={category} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-body text-grey-800">Sin categorías</p>
                  )}
                </div>



                <div>
                  <FieldLabel>
                    <Repeat size={12} className="inline mr-1 -mt-0.5" />
                    Recurrente
                  </FieldLabel>
                  <p className="text-sm font-body text-grey-800">
                    {isRecurring ? `Cada ${recurringCount} ${recurringLabel}` : 'No'}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400">
                      Progreso
                    </span>
                    <span className="font-maxwell text-[10px] font-bold text-blue">{progress}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full relative bg-gradient-to-r from-green to-blue transition-[width] duration-500 ease-out"
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
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          {/* Name spans both columns */}
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
            {/* Left column: description (2/3) */}
            <div className="sm:col-span-3">
              <FieldLabel required>
                <Layers size={12} className="inline mr-1 -mt-0.5" />
                Descripción
              </FieldLabel>
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

            {/* Right column: rest of task attributes (1/3) */}
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
                      onClick={() => setPriority(opt.value)}
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
                      onChange={(e) => setRecurringInterval(e.target.value)}
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
          {mode === 'edit' && (
            <button
              type="button"
              onClick={handleDelete}
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
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white bg-gradient-to-r from-green to-blue shadow-green-glow hover:shadow-green-glow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-green-glow"
          >
            {isSubmitting ? 'Guardando...' : mode === 'edit' ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
