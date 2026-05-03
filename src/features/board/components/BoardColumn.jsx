import { EmptyState } from '@/components/ui/EmptyState';

import BoardCard from './BoardCard.tsx';
import { COLUMN_CONFIG, COLUMN_EMPTY } from './columnConfig.js';

function ColIndicator({ accent }) {
  const cfg = COLUMN_CONFIG[accent];
  return <div className={`w-2 h-2 rounded-full ${cfg.indicator} ${cfg.indicatorAnim}`} />;
}

function DropZone({ onDrop, position }) {
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const cardId = e.dataTransfer.getData('text/card-id');
    const fromColumnId = e.dataTransfer.getData('text/from-column');

    if (cardId && fromColumnId) {
      onDrop(cardId, fromColumnId, position);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue/10');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue/10');
  };

  return (
    <button
      className="h-0 w-full border-none border-dashed rounded-lg transition-all duration-200 "
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    />
  );
}

export default function BoardColumn({
  column,
  cards,
  onMoveCard,
  onCardClick,
  canMoveCard = true,
}) {
  const { id, label, accent } = column;
  const cfg = COLUMN_CONFIG[accent];
  const emptyConfig = COLUMN_EMPTY[accent] ?? COLUMN_EMPTY.todo;

  const handleExternalDrop = (cardId, fromColumnId, position) => {
    onMoveCard(cardId, fromColumnId, id, position);
  };

  return (
    <div
      className={`
        bg-primary rounded-[14px] flex flex-col
        border-[1.5px] ${cfg.border} ${cfg.shadow}
        min-h-104 md:min-h-120
        relative overflow-hidden
        transition-all duration-300
        shrink-0 w-[82vw] sm:w-[72vw] md:w-auto
      `}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] opacity-80`}
        style={{
          background: `linear-gradient(90deg, transparent, var(--col-accent, #fff), transparent)`,
        }}
      >
        <div
          className={`w-full h-full ${cfg.topBar} opacity-60`}
          style={{ maskImage: 'linear-gradient(90deg, transparent, white, transparent)' }}
        />
      </div>

      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <ColIndicator accent={accent} />
          <span
            className={`font-maxwell text-[12px] font-bold tracking-[0.6px] uppercase ${cfg.title}`}
          >
            {label}
          </span>
          <span className="text-[10px] font-semibold text-grey-400 bg-secondary px-2 py-0.5 rounded-[9px]">
            {cards.length}
          </span>
        </div>
      </div>

      <div
        role="button"
        className="flex flex-col gap-3 px-3 pb-3 flex-1"
        onDrop={(e) => {
          e.preventDefault();
          if (!canMoveCard) return;
          const cardId = e.dataTransfer.getData('text/card-id');
          const fromColumnId = e.dataTransfer.getData('text/from-column');

          if (cardId && fromColumnId && fromColumnId !== id) {
            const rect = e.currentTarget.getBoundingClientRect();
            const y = e.clientY - rect.top + e.currentTarget.scrollTop;
            const cardHeight = 120;
            const position = Math.floor(y / cardHeight);
            handleExternalDrop(cardId, fromColumnId, position);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add('bg-blue/5');
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove('bg-blue/5');
        }}
      >
        {cards.length === 0 ? (
          <EmptyState
            icon={emptyConfig.icon}
            title={emptyConfig.title}
            description={emptyConfig.description}
            size="sm"
            className="flex-1"
          />
        ) : (
          cards.map((card, index) => (
            <div key={card.id}>
              <BoardCard
                card={card}
                accent={accent}
                columnId={id}
                onMoveCard={onMoveCard}
                onCardClick={onCardClick}
                position={index}
                canMoveCard={canMoveCard}
              />
              {canMoveCard && <DropZone onDrop={handleExternalDrop} position={index + 1} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
