import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { useTeam } from '@/context/TeamContext.tsx';
import TaskSidebar from '@/features/board/components/task/TaskSidebar';
import type { TeamTask } from '@/features/board/types';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { useAuth } from '@/hooks/useAuth';

import CategoryFilter from './components/CategoryFilter';
import DayTimeline from './components/DayTimeline';
import MiniCalendar from './components/MiniCalendar';
import MissionStats from './components/MissionStats';
import MonthTimeline from './components/MonthTimeline';
import TaskDetailPanel from './components/TaskDetailPanel';
import WeekTimeline from './components/WeekTimeline';
import YearTimeline from './components/YearTimeline';
import { useMyTasks } from './hooks/useMyTasks';

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function MyMissions() {
  const { teamId } = useTeam();
  const { myTasks, tasksByDate, allCategories, isLoading } = useMyTasks(teamId);
  const { user } = useAuth();

  const { data: teamMembers = [] } = useTeamMembers(teamId ?? '');
  const { data: teamGroups = [] } = useTeamGroups(teamId ?? '');

  const currentUserUid = user?.uid ?? null;
  const myRole = useMemo(() => {
    if (!currentUserUid || !teamMembers.length) return 'member';
    return teamMembers.find((m) => m.uid === currentUserUid)?.role ?? 'member';
  }, [currentUserUid, teamMembers]);

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('day');

  const [activeCategories, setActiveCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const selectAllCategories = useCallback(() => {
    setActiveCategories(new Set());
  }, []);

  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null);

  const [editSidebar, setEditSidebar] = useState<{
    isOpen: boolean;
    task: TeamTask | null;
  }>({ isOpen: false, task: null });

  useEffect(() => {
    if (selectedTask && !myTasks.some((t) => t.id === selectedTask.id)) {
      setSelectedTask(null);
    }
    if (
      editSidebar.isOpen &&
      editSidebar.task &&
      !myTasks.some((t) => t.id === editSidebar.task?.id)
    ) {
      setEditSidebar((prev) => ({ ...prev, isOpen: false }));
    }
  }, [myTasks, selectedTask, editSidebar.isOpen, editSidebar.task]);

  const openEdit = useCallback((task: TeamTask) => {
    const editTask =
      'originalId' in task && typeof task.originalId === 'string'
        ? { ...task, id: task.originalId }
        : task;
    setEditSidebar({ isOpen: true, task: editTask });
  }, []);

  const closeEdit = useCallback(() => {
    setEditSidebar((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const dayTasks = useMemo(() => {
    const dateKey = toDateKey(selectedDate);
    const tasksForDay = tasksByDate.get(dateKey) ?? [];

    if (activeCategories.size === 0) return tasksForDay;

    return tasksForDay.filter((t) => t.categories?.some((c) => activeCategories.has(c)));
  }, [selectedDate, tasksByDate, activeCategories]);

  return (
    <div className="min-h-screen bg-offwhite font-body overflow-hidden">
      {/* Header */}
      <AppHeader title="Mis Misiones" variant="purple" />

      {/* Loading */}
      {isLoading && (
        <div className="px-8 py-6 text-center text-grey-400 text-sm">
          <div
            className="w-6 h-6 rounded-full border-2 border-grey-200 animate-spin mx-auto mb-2"
            style={{ borderTopColor: '#5961F9' }}
          />
          Cargando tus misiones...
        </div>
      )}

      <div className="flex h-[92vh] overflow-hidden">
        {/* Left panel: Calendar + Categories */}
        <aside className="hidden h-full lg:flex flex-col w-1/5 border-r border-grey-150 bg-grey-50/50 p-4 gap-4 overflow-hidden">
          <div className="max-h-[42%] w-full">
            <MiniCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              tasksByDate={tasksByDate}
            />
          </div>
          <div className="max-h-[28%] w-full">
            <CategoryFilter
              allCategories={allCategories}
              activeCategories={activeCategories}
              onToggle={toggleCategory}
              onSelectAll={selectAllCategories}
            />
          </div>
          <div className="max-h-[20%] w-full">
            <MissionStats tasks={myTasks} />
          </div>
        </aside>

        <main className="flex-1 w-3/5 p-4">
          {view === 'day' && (
            <DayTimeline
              selectedDate={selectedDate}
              tasks={dayTasks}
              onDateChange={setSelectedDate}
              onTaskClick={setSelectedTask}
              selectedTaskId={selectedTask?.id ?? null}
              view={view}
              onViewChange={setView}
            />
          )}

          {view === 'week' && (
            <WeekTimeline
              selectedDate={selectedDate}
              tasks={myTasks}
              onDateChange={setSelectedDate}
              onTaskClick={setSelectedTask}
              selectedTaskId={selectedTask?.id ?? null}
              view={view}
              onViewChange={setView}
            />
          )}

          {view === 'month' && (
            <MonthTimeline
              selectedDate={selectedDate}
              tasks={myTasks}
              onDateChange={setSelectedDate}
              onTaskClick={setSelectedTask}
              selectedTaskId={selectedTask?.id ?? null}
              view={view}
              onViewChange={setView}
            />
          )}

          {view === 'year' && (
            <YearTimeline
              selectedDate={selectedDate}
              tasks={myTasks}
              onDateChange={setSelectedDate}
              view={view}
              onViewChange={setView}
            />
          )}
        </main>

        <aside className="hidden xl:flex flex-col w-1/5 border-l border-grey-150 bg-grey-50/50 p-4 overflow-y-auto custom-scrollbar">
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={openEdit}
            members={teamMembers}
            groups={teamGroups}
            currentUserUid={currentUserUid}
            myRole={myRole}
          />
        </aside>
      </div>

      <TaskSidebar
        isOpen={editSidebar.isOpen}
        onClose={closeEdit}
        mode="edit"
        task={editSidebar.task}
        teamId={teamId ?? ''}
        defaultStatus={editSidebar.task?.status ?? 'todo'}
        myRole={myRole}
        currentUserUid={currentUserUid}
      />
    </div>
  );
}
