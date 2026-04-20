import type { DragEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useRef } from 'react';

import type { TaskPriority, TaskStatus } from '../types';
import { markdownToEditorHtml } from '../utils/markdownUtils';
import { STATUS_TO_PROGRESS } from '../utils/taskUtils';
import { COLUMN_CONFIG, PRIORITY_CONFIG, USER_GRADIENT } from './columnConfig';
import { TagChip } from './TagChip';

type BoardColumnId = 'todo' | 'progress' | 'qa' | 'done';

type BoardCardData = {
  id: string;
  name: string;
  description?: string;
  priority?: TaskPriority;
  categories?: string[];
  assignees?: string[];
};

type BoardCardProps = {
  card: BoardCardData;
  accent: BoardColumnId;
  columnId: BoardColumnId;
  onMoveCard?: (
    draggedCardId: string,
    fromColumnId: BoardColumnId,
    toColumnId: BoardColumnId,
    position: number,
  ) => void;
  onCardClick?: (card: BoardCardData) => void;
  position: number;
};

type PointerTracking = {
  x: number;
  y: number;
  t: number;
  dragged: boolean;
};

const COLUMN_TO_STATUS: Record<BoardColumnId, TaskStatus> = {
  todo: 'todo',
  progress: 'in-progress',
  qa: 'in-qa',
  done: 'done',
};

function UserAvatar({ userId, size = 'sm' }: { userId: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-5.5 h-5.5 text-[7.5px]' : 'w-7 h-7 text-[10px]';
  return (
    <div
      className={`${dim} rounded-full font-bold text-white flex items-center justify-center border-2 border-primary`}
      style={{ background: USER_GRADIENT[userId] }}
      title={userId}
    >
      {userId}
    </div>
  );
}

export default function BoardCard({ card, accent, columnId, onMoveCard, onCardClick, position }: BoardCardProps) {
  const cfg = COLUMN_CONFIG[accent];
  const prio = PRIORITY_CONFIG[card.priority ?? 'medium'];
  const progress = STATUS_TO_PROGRESS[COLUMN_TO_STATUS[columnId]];

  const pointerRef = useRef<PointerTracking>({ x: 0, y: 0, t: 0, dragged: false });

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement> | ReactMouseEvent<HTMLDivElement>) => {
    pointerRef.current = { x: e.clientX, y: e.clientY, t: Date.now(), dragged: false };
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    pointerRef.current.dragged = true;
    e.dataTransfer.setData('text/card-id', card.id);
    e.dataTransfer.setData('text/from-column', columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement> | ReactMouseEvent<HTMLDivElement>) => {
    const { x, y, t, dragged } = pointerRef.current;
    if (dragged) {
      return;
    }

    const dx = Math.abs(x - e.clientX);
    const dy = Math.abs(y - e.clientY);
    const dt = Date.now() - t;

    if (dx < 6 && dy < 6 && dt < 300) {
      onCardClick?.(card);
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const draggedCardId = e.dataTransfer.getData('text/card-id');
    const fromColumnId = e.dataTransfer.getData('text/from-column') as BoardColumnId;

    if (fromColumnId === columnId && onMoveCard) {
      onMoveCard(draggedCardId, columnId, columnId, position);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue/5');
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-blue/5');
  };

  const descriptionHtml = card.description ? markdownToEditorHtml(card.description) : '';
  const categories = card.categories ?? [];

  return (
    <div
      role="button"
      tabIndex={0}
      draggable
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        bg-primary rounded-[10px] p-3.5 cursor-grab active:cursor-grabbing
        border-[1.5px] transition-all duration-200
        ${cfg.cardBorder} ${cfg.cardShadow}
        ${cfg.cardBorderHover} ${cfg.cardShadowHover}
        hover:-translate-y-0.5 hover:shadow-lg
        group
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-maxwell text-[10px] text-grey-400 tracking-[0.3px]">{card.id}</span>
          <span className={`flex items-center gap-1.5 text-[10px] font-bold ${prio.text}`}>
          <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
          {prio.label}
        </span>
      </div>

      <p className="text-[13.5px] font-semibold text-grey-800 leading-snug mb-1.5 line-clamp-2">
        {card.name}
      </p>

      {descriptionHtml ? (
        <div
          className="text-[12px] text-grey-500 leading-relaxed mb-2.5 line-clamp-2 [&_p]:inline [&_ul]:inline [&_ol]:inline [&_li]:inline [&_li]:mr-1.5 [&_strong]:font-bold [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : (
        <p className="text-[12px] text-grey-400 italic mb-2.5 line-clamp-2">
          Sin descripción
        </p>
      )}

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((tag: string) => (
            <TagChip key={tag} label={tag} />
          ))}
        </div>
      )}

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400">
            Progreso
          </span>
          <span className={`font-maxwell text-[10px] font-bold ${cfg.progressColor}`}>
            {progress}%
          </span>
        </div>
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full relative ${cfg.progressFill} transition-[width] duration-500 ease-out`}
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

      <div className="flex items-center justify-between">
        <div className="flex">
          {card.assignees?.map((uid: string, i: number) => (
            <div key={uid} style={{ marginLeft: i > 0 ? '-5px' : 0 }}>
              <UserAvatar userId={uid} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
