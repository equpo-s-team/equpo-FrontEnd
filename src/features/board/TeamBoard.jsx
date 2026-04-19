import { useMemo, useState } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

import AppHeader from './components/AppHeader.tsx';
import BoardColumn from './components/BoardColumn.jsx';
import FilterBar from './components/FilterBar.jsx';
import { COLUMNS } from './components/kanbanData.js';
import TaskSidebar from './components/TaskSidebar.tsx';
import { useTaskFilters } from './hooks/useTaskFilters';
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
  const { data: members = [] } = useTeamMembers(teamId);
  const { data: groups = [] } = useTeamGroups(teamId);

  // ── Filter logic ──
  const { filters, setFilter, resetFilters, activeFilterCount, applyFilters } = useTaskFilters();

  const apiTasks = data?.tasks;

  // Extract unique categories from ALL tasks (before filtering) so the filter
  // dropdown always shows the full list of available categories.
  const allCategories = useMemo(() => {
    if (!apiTasks?.length) return [];
    const set = new Set();
    for (const task of apiTasks) {
      for (const cat of task.categories ?? []) set.add(cat);
    }
    return [...set].sort();
  }, [apiTasks]);

  // Apply filters → group into columns
  const filteredTasks = useMemo(
    () => (apiTasks?.length ? applyFilters(apiTasks) : []),
    [apiTasks, applyFilters],
  );
  const cards = useMemo(
    () =>
      filteredTasks.length
        ? groupTasksByColumn(filteredTasks)
        : { todo: [], progress: [], qa: [], done: [] },
    [filteredTasks],
  );

  // ── local drag-and-drop state (operates on top of API data or mock) ──
  const [localCards, setLocalCards] = useState(null);
  const displayCards = localCards ?? cards;

  // Reset local overrides whenever the underlying data / filters change
  const [prevFilteredTasks, setPrevFilteredTasks] = useState(filteredTasks);
  if (filteredTasks !== prevFilteredTasks) {
    setPrevFilteredTasks(filteredTasks);
    setLocalCards(null);
  }

  const updateTask = useUpdateTask();

  const moveCard = async (cardId, fromColumnId, toColumnId, position) => {
    const source = { ...displayCards };
    const fromCards = [...(source[fromColumnId] ?? [])];
    const cardIndex = fromCards.findIndex((c) => c.id === cardId);
    const card = fromCards[cardIndex];
    if (!card) return;

    const nextStatus = COLUMN_TO_STATUS[toColumnId] ?? 'todo';
    const nextCard = {
      ...card,
      status: nextStatus,
      _raw: {
        ...(card._raw ?? {}),
        status: nextStatus,
      },
    };

    // Remove the card from its current position
    fromCards.splice(cardIndex, 1);

    if (fromColumnId === toColumnId) {
      // Same-column reorder: use the SAME array (card already removed above)
      const clampedPosition = Math.max(0, Math.min(position, fromCards.length));
      // If the card was before the target position, the target shifts down by 1
      const adjustedPosition = cardIndex < clampedPosition ? clampedPosition - 1 : clampedPosition;

      // Skip if the card would land back in the same spot
      if (adjustedPosition === cardIndex) return;

      fromCards.splice(adjustedPosition, 0, nextCard);
      setLocalCards({ ...source, [fromColumnId]: fromCards });
    } else {
      // Cross-column move: insert into a separate target array
      const toCards = [...(source[toColumnId] ?? [])];
      const clampedPosition = Math.max(0, Math.min(position, toCards.length));
      toCards.splice(clampedPosition, 0, nextCard);

      setLocalCards({
        ...source,
        [fromColumnId]: fromCards,
        [toColumnId]: toCards,
      });
    }

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
      <FilterBar
        filters={filters}
        setFilter={setFilter}
        resetFilters={resetFilters}
        activeFilterCount={activeFilterCount}
        allCategories={allCategories}
        members={members}
        groups={groups}
      />

      {isLoading && (
        <div className="px-8 py-6 text-center text-grey-400 text-sm">Cargando tareas...</div>
      )}

      <div
        className="
             px-3 sm:px-4 md:px-8 pt-2 sm:pt-3 pb-6 sm:pb-10 flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto md:overflow-x-visible md:grid md:grid-cols-4
             snap-x snap-mandatory md:snap-none scroll-px-3 sm:scroll-px-4
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
