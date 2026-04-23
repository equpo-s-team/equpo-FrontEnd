import { Edit2, MessageSquarePlus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar';
import { useCreateTaskCommentary } from '../hooks/useCreateTaskCommentary';
import { useDeleteTaskCommentary } from '../hooks/useDeleteTaskCommentary';
import { useTaskCommentariesRealtime } from '../hooks/useTaskCommentariesRealtime';
import { useUpdateTaskCommentary } from '../hooks/useUpdateTaskCommentary';
import type { TaskCommentary } from '../types/taskSchema';
import { markdownToEditorHtml } from '../utils/markdownUtils';
import { MarkdownDescriptionEditor } from './MarkdownDescriptionEditor';

const MAX_COMMENTARY_LENGTH = 500;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days} d`;
}

function authorInitials(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

interface CommentaryItemProps {
  commentary: TaskCommentary;
  currentUserUid: string | null;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function CommentaryItem({ commentary, currentUserUid, onEdit, onDelete }: CommentaryItemProps) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(commentary.commentary);
  const isOwner = commentary.userUid === currentUserUid;

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(commentary.commentary, editText.trim());
    }
    setEditMode(false);
  };

  const renderedHtml = markdownToEditorHtml(commentary.commentary);

  return (
    <div className="flex gap-2.5 group">
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        <UserAvatar
          src={commentary.photoURL ?? null}
          alt={commentary.displayName ?? commentary.userUid}
          initials={authorInitials(commentary.displayName)}
          className="w-7 h-7 text-[10px]"
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-grey-800 truncate">
            {commentary.displayName ?? commentary.userUid}
          </span>
          <span className="text-[11px] text-grey-400 shrink-0">
            {timeAgo(commentary.createdAt)}
          </span>
          {commentary.updatedAt !== commentary.createdAt && (
            <span className="text-[10px] text-grey-300 italic">(editado)</span>
          )}
        </div>

        {/* Body */}
        {editMode ? (
          <div className="mt-1">
            <MarkdownDescriptionEditor
              value={editText}
              onChange={setEditText}
              maxLength={MAX_COMMENTARY_LENGTH}
            />
            <div className="flex gap-2 mt-1.5">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded-[7px] bg-blue text-white text-[12px] font-semibold hover:bg-blue/90 cursor-pointer transition-colors"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setEditText(commentary.commentary);
                  setEditMode(false);
                }}
                className="px-3 py-1 rounded-[7px] border border-grey-200 text-grey-500 text-[12px] hover:border-blue hover:text-blue cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-[13px] text-grey-700 leading-relaxed [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>

      {/* Edit / Delete (own comments only) */}
      {isOwner && !editMode && (
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
          <button
            onClick={() => setEditMode(true)}
            className="p-1 rounded text-grey-400 hover:text-blue transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(commentary.commentary)}
            className="p-1 rounded text-grey-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

interface TaskCommentarySectionProps {
  teamId: string;
  taskId: string;
  currentUserUid: string | null;
}

export default function TaskCommentarySection({
  teamId,
  taskId,
  currentUserUid,
}: TaskCommentarySectionProps) {
  const [newText, setNewText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { data, isLoading } = useTaskCommentariesRealtime(teamId, taskId);
  const createCommentary = useCreateTaskCommentary();
  const updateCommentary = useUpdateTaskCommentary();
  const deleteCommentary = useDeleteTaskCommentary();

  const commentaries: TaskCommentary[] = data?.commentaries ?? [];

  const handlePublish = () => {
    if (!newText.trim()) return;
    createCommentary.mutate({ teamId, taskId, commentary: newText.trim() });
    setNewText('');
    setShowForm(false);
  };

  const handleEdit = (commentaryId: string, commentary: string) => {
    updateCommentary.mutate({ teamId, taskId, commentaryId, commentary });
  };

  const handleDelete = (commentaryId: string) => {
    deleteCommentary.mutate({ teamId, taskId, commentaryId });
  };

  return (
    <div className="mt-5 border-t border-grey-100 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-grey-400">
            Comentarios
          </span>
          {!isLoading && (
            <span className="text-[11px] font-semibold text-grey-400 bg-secondary px-2 py-0.5 rounded-full">
              {commentaries.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-grey-200 text-grey-500 text-[12px] font-semibold hover:border-blue hover:text-blue cursor-pointer transition-colors"
        >
          <MessageSquarePlus size={13} />
          Agregar comentario
        </button>
      </div>

      {/* Existing commentaries */}
      {isLoading ? (
        <p className="text-[12px] text-grey-300 py-2">Cargando comentarios…</p>
      ) : commentaries.length === 0 ? (
        <p className="text-[12px] text-grey-400 italic py-2">
          No hay comentarios aún. ¡Sé el primero!
        </p>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {commentaries.map((c) => (
            <CommentaryItem
              key={c.createdAt}
              commentary={c}
              currentUserUid={currentUserUid}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* New commentary form — shown only when toggled */}
      {showForm && (
        <div className="mt-3">
          <MarkdownDescriptionEditor
            value={newText}
            onChange={setNewText}
            maxLength={MAX_COMMENTARY_LENGTH}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-grey-400">
              {newText.length}/{MAX_COMMENTARY_LENGTH}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewText('');
                }}
                className="px-3 py-1.5 rounded-[8px] border border-grey-200 text-grey-500 text-[12px] hover:border-blue hover:text-blue cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={!newText.trim() || createCommentary.isPending}
                className="px-4 py-1.5 rounded-[8px] bg-blue text-white text-[12px] font-semibold
                  hover:bg-blue/90 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
