import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AppHeader } from '@/components/ui/app-header';
import { MissionsScopeSwitch } from '@/components/ui/MissionsScopeSwitch';
import { useAuth } from '@/context/AuthContext';
import { useTeam } from '@/context/TeamContext.tsx';
import TaskSidebar from '@/features/board/components/task/TaskSidebar';
import type { TeamTask } from '@/features/board/types';
import { useSidebar } from '@/features/navbar/SidebarContext';
import { useTeamGroups } from '@/features/team/hooks/useTeamGroups';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { cn } from '@/lib/utils/utils';

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

const XL_BREAKPOINT = '(max-width: 1279px)';

export default function MyMissions() {
  const { teamId, myRole } = useTeam();
  const { setActiveItem } = useSidebar();
  const { user } = useAuth();
  const currentUserUid = user?.uid ?? null;
  const { myTasks, tasksByDate, allCategories, isLoading } = useMyTasks(teamId);

  const { data: teamMembers = [] } = useTeamMembers(teamId ?? '');
  const { data: teamGroups = [] } = useTeamGroups(teamId ?? '');

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

  // ── Mobile left-panel collapse state (mirroring TeamBoard column collapse) ──
  const [collapsedLeft, setCollapsedLeft] = useState({
    calendar: true,
    categories: true,
    stats: true,
  });
  const toggleLeft = useCallback((k: keyof typeof collapsedLeft) => {
    setCollapsedLeft((p) => ({ ...p, [k]: !p[k] }));
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

  // ── Refs for mobile auto-scroll ──
  const timelineRef = useRef<HTMLElement>(null);
  const detailRef = useRef<HTMLElement>(null);

  // Scroll to detail panel when a task is selected on mobile
  useEffect(() => {
    if (selectedTask && window.matchMedia(XL_BREAKPOINT).matches) {
      requestAnimationFrame(() => {
        detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [selectedTask?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close detail + scroll back to timeline (mobile-aware)
  const handleCloseDetail = useCallback(() => {
    const wasMobile = window.matchMedia(XL_BREAKPOINT).matches;
    setSelectedTask(null);
    if (wasMobile) {
      requestAnimationFrame(() => {
        timelineRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, []);

  const dayTasks = useMemo(() => {
    const dateKey = toDateKey(selectedDate);
    const tasksForDay = tasksByDate.get(dateKey) ?? [];

    if (activeCategories.size === 0) return tasksForDay;

    return tasksForDay.filter((t) => t.categories?.some((c) => activeCategories.has(c)));
  }, [selectedDate, tasksByDate, activeCategories]);

  return (
    <div className="min-h-screen bg-offwhite dark:bg-gray-900 font-body pb-[64px] lg:pb-0">
      {/* Header */}
      <AppHeader title="Mis Misiones" variant="purple" />
      <MissionsScopeSwitch
        value="mine"
        onChange={(v) => setActiveItem(v === 'team' ? 'missiones' : 'my-missions')}
      />

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

      {/* ── 3-panel container ── */}
      {/* Mobile: stacked flex-col + natural page scroll */}
      {/* Desktop (lg+): side-by-side row with fixed 92vh height */}
      <div className="flex flex-col lg:flex-row lg:h-[92vh] lg:overflow-hidden dark:bg-gray-900">
        {/* ── Left panel: Calendar + Categories + Stats ── */}
        <aside className="flex flex-col w-full lg:w-1/5 lg:h-full border-b lg:border-b-0 lg:border-r border-grey-150 dark:border-grey-700 bg-grey-50/50 dark:bg-gray-900 p-4 gap-4 lg:overflow-hidden">
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            tasksByDate={tasksByDate}
            isCollapsed={collapsedLeft.calendar}
            onToggleCollapse={() => toggleLeft('calendar')}
          />
          <div className="lg:max-h-[28%] w-full">
            <CategoryFilter
              allCategories={allCategories}
              activeCategories={activeCategories}
              onToggle={toggleCategory}
              onSelectAll={selectAllCategories}
              isCollapsed={collapsedLeft.categories}
              onToggleCollapse={() => toggleLeft('categories')}
            />
          </div>
          <div className="lg:max-h-[20%] w-full">
            <MissionStats
              tasks={myTasks}
              isCollapsed={collapsedLeft.stats}
              onToggleCollapse={() => toggleLeft('stats')}
            />
          </div>
        </aside>

        {/* ── Center panel: Timeline ── */}
        <main ref={timelineRef} className="flex-1 w-full lg:w-3/5 p-4 h-[75vh] lg:h-full">
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

        {/* ── Right panel: Task detail ── */}
        {/* Mobile (< xl): only visible when a task is selected; auto-scrolls into view */}
        {/* Desktop (xl+): always mounted, shows "Selecciona una misión" empty state */}
        <aside
          ref={detailRef}
          className={cn(
            'flex-col w-full xl:w-1/5 xl:h-full',
            'border-t xl:border-t-0 xl:border-l border-grey-150 dark:border-grey-700',
            'bg-grey-50/50 dark:bg-gray-900 p-4 overflow-y-auto custom-scrollbar',
            selectedTask ? 'flex' : 'hidden xl:flex',
          )}
        >
          <TaskDetailPanel
            task={selectedTask}
            onClose={handleCloseDetail}
            onEdit={openEdit}
            members={teamMembers}
            groups={teamGroups}
            currentUserUid={currentUserUid}
            myRole={myRole ?? undefined}
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
        myRole={myRole ?? undefined}
        currentUserUid={currentUserUid}
      />
    </div>
  );
}
