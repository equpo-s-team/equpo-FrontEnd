import {useState} from 'react';
import AppHeader from './AppHeader.jsx';
import FilterBar from './FilterBar.jsx';
import KanbanColumn from './KanbanColumn.jsx';
import {COLUMNS, INITIAL_CARDS} from "@/components/board/kanbanData.js";

export default function KanbanBoard() {
    const [cards, setCards] = useState(INITIAL_CARDS);

    const moveCard = (cardId, fromColumnId, toColumnId, position) => {
        if (fromColumnId === toColumnId && position === 0) return;

        const fromCards = [...cards[fromColumnId]];
        const cardIndex = fromCards.findIndex(c => c.id === cardId);
        const card = fromCards[cardIndex];
        if (!card) return;

        fromCards.splice(cardIndex, 1);

        const toCards = [...cards[toColumnId]];

        const clampedPosition = Math.max(0, Math.min(position, toCards.length));

        let adjustedPosition = clampedPosition;
        if (fromColumnId === toColumnId && cardIndex < clampedPosition) {
            adjustedPosition = clampedPosition - 1;
        }

        toCards.splice(adjustedPosition, 0, card);

        setCards(prev => ({
            ...prev,
            [fromColumnId]: fromCards,
            [toColumnId]: toCards
        }));
    };

    return (
        <div className="min-h-screen bg-offwhite font-body">
            <AppHeader/>
            <FilterBar/>
            <div className="
             px-4 md:px-8  pt-3 pb-10 flex gap-4 md:gap-5 overflow-x-auto md:overflow-x-visible md:grid md:grid-cols-4
             snap-x snap-mandatory md:snap-none scroll-px-4
             ">
                {COLUMNS.map((col, index) => (
                    <div key={col.id} className="snap-start">
                        <KanbanColumn
                            column={col}
                            cards={cards[col.id] || []}
                            onMoveCard={moveCard}
                            columnIndex={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
