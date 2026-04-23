/**
 * Centralized environment health calculation.
 *
 * Used by both the 3D environment HUD and the achievement system
 * to compute the "life" of the environment from task metrics.
 *
 * Formula: clamp(60 + completedPercent - overduePercent * 2, 0, 100)
 * - Base health starts at 60%
 * - Completing tasks raises health
 * - Overdue tasks lower health (2x penalty)
 */

function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Compute environment health percentage from task KPIs.
 * @returns health percentage (0-100)
 */
export function computeEnvironmentHealth(
  totalTasks: number,
  doneTasks: number,
  overdueTasks: number,
): number {
  if (totalTasks <= 0) return 60;

  const completedPercent = (doneTasks / totalTasks) * 100;
  const overduePercent = (overdueTasks / totalTasks) * 100;

  return Math.round(clampPercentage(60 + completedPercent - overduePercent * 2));
}
