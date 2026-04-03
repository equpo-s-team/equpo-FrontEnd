import {Paperclip, MessageSquare} from 'lucide-react';
import {
    COLUMN_CONFIG,
    PRIORITY_CONFIG,
    TAG_COLOR_CONFIG,
    TAG_LABEL_TO_COLOR,
    USER_GRADIENT
} from "./columnConfig.js";

const STATUS_TO_PROGRESS = {
    'todo': 0,
    'in-progress': 40,
    'in-qa': 85,
    'done': 100
};

function TagChip({label}) {
    const color = TAG_LABEL_TO_COLOR[label] || 'blue';
    const cfg = TAG_COLOR_CONFIG[color] || TAG_COLOR_CONFIG.blue;
    return (
        <span
            className={`px-2.5 py-[3px] rounded-xl text-[11px] font-medium border-[1.5px] ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {label}
    </span>
    );
}

function UserAvatar({userId, size = 'sm'}) {
    const dim = size === 'sm' ? 'w-[21px] h-[21px] text-[7.5px]' : 'w-7 h-7 text-[10px]';
    return (
        <div
            className={`${dim} rounded-full font-bold text-white flex items-center justify-center border-2 border-primary`}
            style={{background: USER_GRADIENT[userId]}}
            title={userId}
        >
            {userId}
        </div>
    );
}

export default function BoardCard({card, accent, columnId, onMoveCard, position}) {
    const cfg = COLUMN_CONFIG[accent];
    const prio = PRIORITY_CONFIG[card.priority];
    const progress = STATUS_TO_PROGRESS[columnId] ?? 0;

    // Handle drag start to set data
    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/card-id', card.id);
        e.dataTransfer.setData('text/from-column', columnId);
        e.dataTransfer.effectAllowed = 'move';
    };

    // Handle drag end
    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('opacity-50');
    };

    // Handle drop on same column (reordering)
    const handleDrop = (e) => {
        e.preventDefault();
        const draggedCardId = e.dataTransfer.getData('text/card-id');
        const fromColumnId = e.dataTransfer.getData('text/from-column');

        if (fromColumnId === columnId && onMoveCard) {
            // Same column reordering - simple swap
            onMoveCard(draggedCardId, columnId, columnId, position);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-blue/5');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-blue/5');
    };

    return (
        <div
            draggable
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
            {/* Top row */}
            <div className="flex items-start justify-between mb-2">
                <span className="font-maxwell text-[10px] text-grey-400 tracking-[0.3px]">{card.id}</span>
                <span
                    className={`text-[10px] font-semibold px-2 py-[2px] rounded-[6px] border-[1.5px] ${prio.bg} ${prio.text} ${prio.border}`}>
          {prio.label}
        </span>
            </div>

            {/* Title */}
            <p className="text-[13.5px] font-semibold text-grey-800 leading-snug mb-1.5 line-clamp-2">
                {card.name}
            </p>

            {/* Description */}
            <p className="text-[12px] text-grey-500 leading-relaxed mb-2.5 line-clamp-2">
                {card.description}
            </p>

            {/* Tags */}
            {card.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {card.categories.map(tag => <TagChip key={tag} label={tag}/>)}
                </div>
            )}

            {/* Progress bar */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400">Progreso</span>
                    <span className={`font-maxwell text-[10px] font-bold ${cfg.progressColor}`}>{progress}%</span>
                </div>
                <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full relative ${cfg.progressFill} transition-[width] duration-500 ease-out`}
                        style={{width: `${progress}%`}}
                    >
                        {/* glow tip */}
                        {progress > 0 && (
                            <div className="absolute right-0 top-0 bottom-0 w-1.5 blur-[2px] rounded-full"
                                 style={{background: 'inherit'}}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                {/* Assignee avatars */}
                <div className="flex">
                    {card.assignees.map((uid, i) => (
                        <div key={uid} style={{marginLeft: i > 0 ? '-5px' : 0}}>
                            <UserAvatar userId={uid}/>
                        </div>
                    ))}
                </div>

                {/* Meta (Actualizaciones futuras, para agregar el attachments y comments)
                <div className="flex items-center gap-2.5 text-[11px] text-grey-400">
          <span className="flex items-center gap-1">
            <Paperclip size={11}/>
              {card.attachments}
          </span>
                    <span className="flex items-center gap-1">
            <MessageSquare size={11}/>
                        {card.comments}
          </span>
                </div>

                 */}
            </div>
        </div>
    );
}
