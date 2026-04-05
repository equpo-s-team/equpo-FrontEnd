import { useState } from 'react';

import { useTeam } from '@/context/TeamContext.jsx';

import AppHeader from './components/AppHeader.jsx';
import BoardColumn from './components/BoardColumn.jsx';
import FilterBar from './components/FilterBar.jsx';
import { COLUMNS } from './components/kanbanData.js';
import TaskSidebar from './components/TaskSidebar.jsx';
import { useTasks } from './hooks/useTasks';
import { useUpdateTask } from './hooks/useUpdateTask';

/** Map backend status values to column IDs used in the UI */
const STATUS_TO_COLUMN = {
  todo: 'todo',
  'in-progress': 'progress',
  'in-qa': 'qa',
  done: 'done',
};

const COLUMN_TO_STATUS = {
  todo: 'todo',
  progress: 'in-progress',
  qa: 'in-qa',
  done: 'done',
};

/**
 * Transform flat API task list into column-grouped cards.
 * Falls back to mock data when the API hasn't returned results yet.
 */
function groupTasksByColumn(tasks) {
  const grouped = { todo: [], progress: [], qa: [], done: [] };

  for (const task of tasks) {
    const col = STATUS_TO_COLUMN[task.status] ?? 'todo';
    grouped[col].push({
      id: task.id,
      name: task.name ?? '',
      description: task.description ?? '',
      priority: task.priority,
      categories: task.categories ?? [],
      assignees: (task.assignedUsers ?? []).map(
        (u) => u.displayName?.substring(0, 2).toUpperCase() ?? u.uid.substring(0, 2).toUpperCase(),
      ),
      status: task.status,
      // preserve full task for edit sidebar
      _raw: task,
    });
  }

  return grouped;
}

export default function TeamBoard() {
  const { teamId } = useTeam();
  const { data, isLoading } = useTasks(teamId);

  // Use real synced data, or return empty columns when fetching/empty
  const apiTasks = data?.tasks;
  const cards = apiTasks?.length ? groupTasksByColumn(apiTasks) : { todo: [], progress: [], qa: [], done: [] };

  // ── local drag-and-drop state (operates on top of API data or mock) ──
  const [localCards, setLocalCards] = useState(null);
  const displayCards = localCards ?? cards;

  // Reset local overrides whenever API data changes
  const [prevApiTasks, setPrevApiTasks] = useState(apiTasks);
  if (apiTasks !== prevApiTasks) {
    setPrevApiTasks(apiTasks);
    setLocalCards(null);
  }

  const updateTask = useUpdateTask();

  const moveCard = async (cardId, fromColumnId, toColumnId, position) => {
    if (fromColumnId === toColumnId && position === 0) return;

    const source = { ...displayCards };
    const fromCards = [...(source[fromColumnId] ?? [])];
    const cardIndex = fromCards.findIndex((c) => c.id === cardId);
    const card = fromCards[cardIndex];
    if (!card) return;

    fromCards.splice(cardIndex, 1);

    const toCards = [...(source[toColumnId] ?? [])];
    const clampedPosition = Math.max(0, Math.min(position, toCards.length));

    let adjustedPosition = clampedPosition;
    if (fromColumnId === toColumnId && cardIndex < clampedPosition) {
      adjustedPosition = clampedPosition - 1;
    }

    const nextStatus = COLUMN_TO_STATUS[toColumnId] ?? 'todo';
    const nextCard = {
      ...card,
      status: nextStatus,
      _raw: {
        ...(card._raw ?? {}),
        status: nextStatus,
      },
    };

    toCards.splice(adjustedPosition, 0, nextCard);

    setLocalCards({
      ...source,
      [fromColumnId]: fromCards,
      [toColumnId]: toCards,
    });

    // If the column changed, sync the new status to the backend
    if (fromColumnId !== toColumnId) {
      try {
        await updateTask.mutateAsync({
          teamId,
          taskId: cardId,
          payload: { status: nextStatus },
        });
      } catch (err) {
        console.error('Failed to update task status:', err);
      }
    }
  };

  // ── Sidebar state ──
  const [sidebar, setSidebar] = useState({
    isOpen: false,
    mode: 'create',
    task: null,
    defaultStatus: 'todo',
  });

  const openCreate = (columnId) => {
    setSidebar({
      isOpen: true,
      mode: 'create',
      task: null,
      defaultStatus: COLUMN_TO_STATUS[columnId] ?? 'todo',
    });
  };

  const openEdit = (card) => {
    // Use raw API task data if available, otherwise use the card object
    const taskData = card._raw ?? card;
    setSidebar({
      isOpen: true,
      mode: 'edit',
      task: taskData,
      defaultStatus: taskData.status ?? 'todo',
    });
  };

  const closeSidebar = () => {
    setSidebar((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-offwhite font-body">
      <AppHeader />
      <FilterBar />

      {isLoading && (
        <div className="px-8 py-6 text-center text-grey-400 text-sm">Cargando tareas...</div>
      )}

      <div
        className="
             px-4 md:px-8  pt-3 pb-10 flex gap-4 md:gap-5 overflow-x-auto md:overflow-x-visible md:grid md:grid-cols-4
             snap-x snap-mandatory md:snap-none scroll-px-4
             "
      >
        {COLUMNS.map((col, index) => (
          <div key={col.id} className="snap-start">
            <BoardColumn
              column={col}
              cards={displayCards[col.id] ?? []}
              onMoveCard={moveCard}
              onCreateTask={openCreate}
              onCardClick={openEdit}
              columnIndex={index}
            />
          </div>
        ))}
      </div>

      <TaskSidebar
        isOpen={sidebar.isOpen}
        onClose={closeSidebar}
        mode={sidebar.mode}
        task={sidebar.task}
        teamId={teamId}
        defaultStatus={sidebar.defaultStatus}
      />
    </div>
  );
}
