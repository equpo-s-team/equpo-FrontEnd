import { useCallback, useMemo, useState } from 'react';

import { INITIAL_FILTERS, type TaskFilters, type TeamTask } from '../types';

export function useTaskFilters() {
  const [filters, setFilters] = useState<TaskFilters>(INITIAL_FILTERS);

  const setFilter = useCallback(<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.priorities.length > 0) count++;
    if (filters.dueDateBefore) count++;
    if (filters.isRecurring !== null) count++;
    if (filters.recurringInterval !== null) count++;
    if (filters.recurringCount !== null) count++;
    if (filters.assignedUserUids.length > 0) count++;
    if (filters.assignedGroupIds.length > 0) count++;
    return count;
  }, [filters]);

  const applyFilters = useCallback(
    (tasks: TeamTask[]): TeamTask[] => {
      return tasks.filter((task) => {
        // ── Categories (any overlap) ──
        if (
          filters.categories.length > 0 &&
          !task.categories.some((c) => filters.categories.includes(c))
        ) {
          return false;
        }

        // ── Priority ──
        if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
          return false;
        }

        // ── Due date ──
        if (filters.dueDateBefore && task.dueDate) {
          const taskDate = new Date(task.dueDate);
          const limitDate = new Date(filters.dueDateBefore);
          // Set limit to end of day so "before 2026-04-10" includes tasks on that date
          limitDate.setHours(23, 59, 59, 999);
          if (taskDate > limitDate) return false;
        }

        // ── Recurring toggle ──
        if (filters.isRecurring !== null && task.isRecurring !== filters.isRecurring) {
          return false;
        }

        // ── Recurring interval (only when filtering recurring tasks) ──
        if (
          filters.isRecurring === true &&
          filters.recurringInterval !== null &&
          task.recurringInterval !== filters.recurringInterval
        ) {
          return false;
        }

        // ── Recurring count (only when filtering recurring tasks) ──
        if (
          filters.isRecurring === true &&
          filters.recurringCount !== null &&
          task.recurringCount !== filters.recurringCount
        ) {
          return false;
        }

        // ── Assigned users (multi-select, any match) ──
        if (filters.assignedUserUids.length > 0) {
          const taskUserUids = task.assignedUsers.map((u) => u.uid);
          if (!filters.assignedUserUids.some((uid) => taskUserUids.includes(uid))) {
            return false;
          }
        }

        // ── Assigned groups (multi-select, any match) ──
        if (
          filters.assignedGroupIds.length > 0 &&
          (!task.assignedGroupId || !filters.assignedGroupIds.includes(task.assignedGroupId))
        ) {
          return false;
        }

        return true;
      });
    },
    [filters],
  );

  return { filters, setFilter, resetFilters, activeFilterCount, applyFilters };
}
