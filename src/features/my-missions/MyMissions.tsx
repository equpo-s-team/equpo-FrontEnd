import { useCallback, useMemo, useState } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';
import TaskSidebar from '@/features/board/components/TaskSidebar';
import type { TeamTask } from '@/features/board/types';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';

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

  // Prefetch team members to ensure cache has their displayNames for TaskDetailPanel
  const { data: teamMembers = [] } = useTeamMembers(teamId ?? '');

  // ── Date & View state ──
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('day');

  // ── Category filter state ──
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

  // ── Selected task ──
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null);

  // ── TaskSidebar (edit mode) ──
  const [editSidebar, setEditSidebar] = useState<{
    isOpen: boolean;
    task: TeamTask | null;
  }>({ isOpen: false, task: null });

  const openEdit = useCallback((task: TeamTask) => {
    setEditSidebar({ isOpen: true, task });
  }, []);

  const closeEdit = useCallback(() => {
    setEditSidebar((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // ── Tasks for the selected day, filtered by active categories ──
  const dayTasks = useMemo(() => {
    const dateKey = toDateKey(selectedDate);
    const tasksForDay = tasksByDate.get(dateKey) ?? [];

    if (activeCategories.size === 0) return tasksForDay; // no filter = show all

    return tasksForDay.filter((t) => t.categories?.some((c) => activeCategories.has(c)));
  }, [selectedDate, tasksByDate, activeCategories]);

  return (
    <div className="min-h-screen bg-offwhite font-body">
      {/* Header */}
      <header
        className="
          sticky top-0 z-50
          bg-primary border-b border-grey-200
          shadow-[0_1px_8px_rgba(0,0,0,0.06)]
          h-14 md:h-[62px]
          flex items-center justify-between
          px-4 md:px-8
        "
      >
        <div className="flex items-center gap-2.5 font-maxwell tracking-tight text-grey-900 text-base md:text-lg font-bold select-none">
          <span
            className="w-2.5 h-2.5 rounded-full bg-purple animate-pulse-neon"
            style={{
              boxShadow: '0 0 8px #5961F9, 0 0 18px rgba(89,97,249,0.4)',
            }}
          />
          Mis Misiones
        </div>

        {/* Action icons could go here in the future if needed, removed switcher from top bar */}
      </header>

      {/* Loading overlay */}
      {isLoading && (
        <div className="px-8 py-6 text-center text-grey-400 text-sm">
          <div
            className="w-6 h-6 rounded-full border-2 border-grey-200 animate-spin mx-auto mb-2"
            style={{ borderTopColor: '#5961F9' }}
          />
          Cargando tus misiones...
        </div>
      )}

      {/* Main 3-panel layout */}
      <div className="flex h-[calc(100dvh-62px)] overflow-hidden">
        {/* Left panel: Calendar + Categories */}
        <aside className="hidden lg:flex flex-col w-64 min-w-[256px] border-r border-grey-150 bg-grey-50/50 p-4 gap-4 overflow-y-auto custom-scrollbar">
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            tasksByDate={tasksByDate}
          />
          <CategoryFilter
            allCategories={allCategories}
            activeCategories={activeCategories}
            onToggle={toggleCategory}
            onSelectAll={selectAllCategories}
          />
          <MissionStats tasks={myTasks} />
        </aside>

        {/* Center: Day Timeline */}
        <main className="flex-1 min-w-0 p-4">
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

        {/* Right panel: Task Detail */}
        <aside className="hidden xl:flex flex-col w-72 min-w-[288px] border-l border-grey-150 bg-grey-50/50 p-4 overflow-y-auto custom-scrollbar">
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onEdit={openEdit}
            members={teamMembers}
          />
        </aside>
      </div>

      {/* TaskSidebar for editing (reuses existing board component) */}
      <TaskSidebar
        isOpen={editSidebar.isOpen}
        onClose={closeEdit}
        mode="edit"
        task={editSidebar.task}
        teamId={teamId ?? ''}
        defaultStatus={editSidebar.task?.status ?? 'todo'}
      />
    </div>
  );
}
