import { useMemo, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext';
import type {BoardColumnId, Card, TaskSidebarMode} from "@/features/board/types/columnTypes";
import { type TeamTask } from '@/features/board/types/taskSchema';
import {COLUMN_TO_STATUS, COLUMNS, STATUS_TO_COLUMN} from "@/features/board/utils/columnConfig";
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toastError } from '@/lib/toast';

import AppHeader from './components/AppHeader';
import BoardColumn from './components/BoardColumn';
import FilterBar from './components/filterBar/FilterBar';
import TaskSidebar from './components/task/TaskSidebar';
import { useTaskFilters } from './hooks/useTaskFilters';
import { useTasks } from './hooks/useTasks';
import { useUpdateTask } from './hooks/useUpdateTask';


function groupTasksByColumn(tasks: TeamTask[]) {
  const grouped: Record<string, Card[]> = { todo: [], progress: [], qa: [], done: [] };

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
      stepsTotal: task.stepsTotal ?? 0,
      stepsDone: task.stepsDone ?? 0,
      _raw: task,
    });
  }

  return grouped;
}

export default function TeamBoard() {
  const { teamId } = useTeam();
  const { user } = useAuth();
  const { data, isLoading } = useTasks(teamId || '');
  const { data: members = [] } = useTeamMembers(teamId);
  const { data: groups = [] } = useTeamGroups(teamId);
  const { play } = useSoundEffects();

  const myRole = useMemo(() => {
    if (!user?.uid || !members.length) return 'member';
    return members.find((m) => m.uid === user.uid)?.role ?? 'member';
  }, [user, members]);


  const canMoveCard = myRole !== 'spectator';

  const assignableMembers = useMemo(
    () => members.filter((m) => m.role !== 'spectator'),
    [members]
  );

  const { filters, setFilter, resetFilters, activeFilterCount, applyFilters } = useTaskFilters();

  const apiTasks = data?.tasks;

  const allCategories = useMemo(() => {
    if (!apiTasks?.length) return [];
    const set = new Set<string>();
    for (const task of apiTasks) {
      for (const cat of task.categories ?? []) set.add(cat);
    }
    return [...set].sort();
  }, [apiTasks]);

  const filteredTasks = useMemo(
    () => (apiTasks?.length ? applyFilters(apiTasks) : []),
    [apiTasks, applyFilters],
  );
  const cards = useMemo(
    () =>
      filteredTasks.length
        ? groupTasksByColumn(filteredTasks)
        : { todo: [], progress: [], qa: [], done: [] } as Record<string, Card[]>,
    [filteredTasks],
  );

  const [localCards, setLocalCards] = useState<Record<string, Card[]> | null>(null);
  const displayCards = localCards ?? cards;

  const [prevFilteredTasks, setPrevFilteredTasks] = useState(filteredTasks);
  if (filteredTasks !== prevFilteredTasks) {
    setPrevFilteredTasks(filteredTasks);
    setLocalCards(null);
  }

  const updateTask = useUpdateTask();

  const moveCard = async (cardId: string, fromColumnId: string, toColumnId: string, position: number) => {
    if (myRole === 'spectator') {
      toastError('Acceso denegado', 'Los espectadores no pueden mover tareas.');
      return;
    }

    if (!teamId) {
      console.error('Team ID is required to move cards');
      return;
    }

    const source = { ...displayCards };
    const fromCards = [...(source[fromColumnId] ?? [])];
    const cardIndex = fromCards.findIndex((c) => c.id === cardId);
    const card = fromCards[cardIndex];
    if (!card) return;

    if (fromColumnId !== toColumnId) {
      if (fromColumnId === 'todo' && toColumnId === 'progress') {
        const raw = (card._raw ?? {}) as Partial<TeamTask>;
        const hasAssignment =
          (raw.assignedUsers?.length ?? 0) > 0 || Boolean(raw.assignedGroupId);
        if (!hasAssignment) {
          toastError(
            'No se puede iniciar',
            'Asigna un usuario o grupo a la tarea antes de moverla a En Progreso.',
          );
          return;
        }
      } else if (fromColumnId === 'progress' && toColumnId === 'todo') {
        if ((card.stepsDone ?? 0) > 0) {
          toastError(
            'No se puede regresar',
            'Desmarca todos los pasos completados antes de mover la tarea a Por Hacer.',
          );
          return;
        }
      } else if (fromColumnId === 'todo' && (toColumnId === 'qa' || toColumnId === 'done')) {
        toastError(
          'Transición no permitida',
          'Las tareas deben pasar por En Progreso antes de ir a QA o Done.',
        );
        return;
      } else if (fromColumnId === 'progress' && (toColumnId === 'qa' || toColumnId === 'done')) {
        toastError(
          'Transición automática',
          'La tarea no puede pasar a revisión sin haber sido terminados todos sus pasos.',
        );
        return;
      } else if (fromColumnId === 'qa' || fromColumnId === 'done') {
        toastError(
          'Transición no permitida',
          'Las tareas en Revisión o Terminadas no se pueden mover manualmente.',
        );
        return;
      } else {
        return;
      }
    }

    const nextStatus = (COLUMN_TO_STATUS[toColumnId as BoardColumnId] ?? 'todo') as TeamTask['status'];
    const nextCard = {
      ...card,
      status: nextStatus,
      _raw: card._raw ? {
        ...card._raw,
        status: nextStatus,
      } : null,
    };

    // Remove the card from its current position
    fromCards.splice(cardIndex, 1);

    if (fromColumnId === toColumnId) {
      const clampedPosition = Math.max(0, Math.min(position, fromCards.length));
      const adjustedPosition = cardIndex < clampedPosition ? clampedPosition - 1 : clampedPosition;
      if (adjustedPosition === cardIndex) return;
      fromCards.splice(adjustedPosition, 0, nextCard);
      setLocalCards({ ...source, [fromColumnId]: fromCards });
    } else {
      const toCards = [...(source[toColumnId] ?? [])];
      const clampedPosition = Math.max(0, Math.min(position, toCards.length));
      toCards.splice(clampedPosition, 0, nextCard);

      setLocalCards({
        ...source,
        [fromColumnId]: fromCards,
        [toColumnId]: toCards,
      });

      if (toColumnId === 'done') {
        play('taskCompleted');
      }
    }

    if (fromColumnId !== toColumnId) {
      try {
        await updateTask.mutateAsync({
          teamId,
          taskId: cardId,
          payload: { status: nextStatus, name: card.name, description: card.description ?? '' },
        });
      } catch (err) {
        console.error('Failed to update task status:', err);
      }
    }
  };

  // ── Sidebar state ──
  const [sidebar, setSidebar] = useState<{
    isOpen: boolean;
    mode: TaskSidebarMode;
    task: TeamTask | null;
    defaultStatus: string;
  }>({
    isOpen: false,
    mode: 'create',
    task: null,
    defaultStatus: 'todo',
  });

  // Single global create — always opens with status 'todo'
  const openCreate = () => {
    setSidebar({
      isOpen: true,
      mode: 'create',
      task: null,
      defaultStatus: 'todo',
    });
  };

  const openEdit = (card: Card) => {
    const taskData = card._raw;
    if (!taskData) return;

    setSidebar({
      isOpen: true,
      mode: myRole === 'spectator' ? 'readonly' : 'view',
      task: taskData,
      defaultStatus: taskData.status ?? 'todo',
    });
  };

  const closeSidebar = () => {
    setSidebar((prev) => ({ ...prev, isOpen: false }));
  };

  const handleTaskCreated = () => {
    play('taskCreated');
  };

  const handleTaskUpdated = () => {
    play('taskUpdated');
  };

  const handleTaskDeleted = () => {
    play('taskDeleted');
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
        members={assignableMembers.map(m => ({ uid: m.uid, displayName: m.displayName ?? undefined }))}
        groups={groups}
        onCreateTask={openCreate}
        canCreateTask={myRole !== 'spectator'}
      />

      {isLoading && (
        <div className="px-8 py-6 text-center text-grey-400 text-sm">Cargando tareas...</div>
      )}

      <div
        className="
             px-4 md:px-8  pt-3 pb-10 flex gap-4 md:gap-5 overflow-x-auto md:overflow-x-visible md:grid md:grid-cols-4
             snap-x snap-mandatory md:snap-none scroll-px-4
             "
      >
        {COLUMNS.map((col) => (
          <div key={col.id} className="snap-start">
            <BoardColumn
              column={col}
              cards={displayCards[col.id] ?? []}
              onMoveCard={moveCard}
              onCardClick={openEdit}
              canMoveCard={canMoveCard}
            />
          </div>
        ))}
      </div>

      <TaskSidebar
        isOpen={sidebar.isOpen}
        onClose={closeSidebar}
        mode={sidebar.mode}
        task={sidebar.task}
        teamId={teamId || ''}
        defaultStatus={sidebar.defaultStatus}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
        myRole={myRole}
        currentUserUid={user?.uid ?? null}
      />
    </div>
  );
}
