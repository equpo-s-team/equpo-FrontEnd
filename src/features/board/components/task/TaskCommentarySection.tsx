import { Edit2, MessageSquarePlus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers.ts';
import { useAuth } from '@/hooks/useAuth';

import { useCreateTaskCommentary } from '../../hooks/useCreateTaskCommentary.ts';
import { useDeleteTaskCommentary } from '../../hooks/useDeleteTaskCommentary.ts';
import { useTaskCommentariesRealtime } from '../../hooks/useTaskCommentariesRealtime.ts';
import { useUpdateTaskCommentary } from '../../hooks/useUpdateTaskCommentary.ts';
import type { TaskCommentary } from '../../types/taskSchema.ts';
import { markdownToEditorHtml } from '../../utils/markdownUtils.ts';
import { MarkdownDescriptionEditor } from '../MarkdownDescriptionEditor.tsx';

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

function getInitialsFrom(name: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

interface AuthorInfo {
  displayName: string | null;
  photoURL: string | null;
}

interface CommentaryItemProps {
  commentary: TaskCommentary;
  currentUserUid: string | null;
  resolveAuthor: (uid: string) => AuthorInfo;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function CommentaryItem({
  commentary,
  currentUserUid,
  resolveAuthor,
  onEdit,
  onDelete,
}: CommentaryItemProps) {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(commentary.commentary);
  const isOwner = commentary.userUid === currentUserUid;
  const author = resolveAuthor(commentary.userUid);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onEdit(commentary.commentary, editText.trim());
    }
    setEditMode(false);
  };

  const renderedHtml = markdownToEditorHtml(commentary.commentary);

  return (
    <div className="flex gap-2.5 group">
      <div className="shrink-0 mt-0.5">
        <UserAvatar
          src={author.photoURL ?? null}
          alt={author.displayName ?? commentary.userUid}
          initials={getInitialsFrom(author.displayName)}
          className="w-7 h-7 text-[10px]"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[12px] font-semibold text-grey-800 dark:text-gray-300 truncate">
            {author.displayName ?? commentary.userUid}
          </span>
          <span className="text-[11px] text-grey-400 dark:text-grey-500 shrink-0">
            {timeAgo(commentary.createdAt)}
          </span>
          {commentary.updatedAt !== commentary.createdAt && (
            <span className="text-[10px] text-grey-300 dark:text-grey-500 italic">(editado)</span>
          )}
        </div>

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
                className="px-3 py-1 rounded-[7px] border border-grey-200 dark:border-gray-600 text-grey-500 dark:text-grey-400 text-[12px] hover:border-blue hover:text-blue cursor-pointer transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-[13px] text-grey-700 dark:text-gray-300 leading-relaxed [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>

      {isOwner && !editMode && (
        <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
          <button
            onClick={() => setEditMode(true)}
            className="p-1 rounded text-grey-400 dark:text-grey-500 hover:text-blue transition-colors cursor-pointer"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(commentary.commentary)}
            className="p-1 rounded text-grey-400 dark:text-grey-500 hover:text-red transition-colors cursor-pointer"
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
  myRole?: string;
}

export default function TaskCommentarySection({
  teamId,
  taskId,
  currentUserUid,
  myRole = 'member',
}: TaskCommentarySectionProps) {
  const [newText, setNewText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement | null>(null);

  const { user: authUser } = useAuth();
  const { data: members } = useTeamMembers(teamId);

  const { data, isLoading } = useTaskCommentariesRealtime(teamId, taskId);
  const createCommentary = useCreateTaskCommentary();
  const updateCommentary = useUpdateTaskCommentary();
  const deleteCommentary = useDeleteTaskCommentary();

  const commentaries: TaskCommentary[] = data?.commentaries ?? [];
  const canPost = myRole !== 'spectator';

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [showForm]);

  function resolveAuthor(uid: string): AuthorInfo {
    if (authUser?.uid === uid) {
      return {
        displayName: authUser.displayName ?? null,
        photoURL: (authUser.photoURL as string | null | undefined) ?? null,
      };
    }
    const member = members?.find((m) => m.uid === uid);
    return {
      displayName: member?.displayName ?? null,
      photoURL: (member as { photoUrl?: string } | undefined)?.photoUrl ?? null,
    };
  }

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
    <div className="mt-5 border-t border-grey-100 dark:border-gray-700 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-grey-400 dark:text-grey-500">
            Comentarios
          </span>
          {!isLoading && (
            <span className="text-[11px] font-semibold text-grey-400 dark:text-grey-500 bg-secondary dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {commentaries.length}
            </span>
          )}
        </div>
        {canPost && (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[7px] border border-grey-200 dark:border-gray-600 text-grey-500 dark:text-grey-400 text-[12px] font-semibold hover:border-blue hover:text-blue cursor-pointer transition-colors"
          >
            <MessageSquarePlus size={13} />
            Comentar
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-[12px] text-grey-300 dark:text-grey-500 py-2">Cargando comentarios…</p>
      ) : commentaries.length === 0 ? (
        <p className="text-[12px] text-grey-400 dark:text-grey-500 italic py-2">
          No hay comentarios aún.
        </p>
      ) : (
        <div className="flex flex-col gap-3 mb-4">
          {commentaries.map((c) => (
            <CommentaryItem
              key={c.createdAt}
              commentary={c}
              currentUserUid={currentUserUid}
              resolveAuthor={resolveAuthor}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && canPost && (
        <div ref={formRef} className="mt-3">
          <MarkdownDescriptionEditor
            value={newText}
            onChange={setNewText}
            maxLength={MAX_COMMENTARY_LENGTH}
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[11px] text-grey-400 dark:text-grey-500">
              {newText.length}/{MAX_COMMENTARY_LENGTH}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowForm(false);
                  setNewText('');
                }}
                className="px-3 py-1.5 rounded-[8px] border border-grey-200 dark:border-gray-600 text-grey-500 dark:text-grey-400 text-[12px] hover:border-blue hover:text-blue cursor-pointer transition-colors"
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
