function clampPercentage(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function computeEnvironmentHealth(
  totalTasks: number,
  doneTasks: number,
  overdueTasks: number,
): number {
  if (totalTasks <= 0) return 60;
  const base: number = totalTasks < 20 ? 20 : totalTasks;

  const completedPercent = (doneTasks / base) * 100;
  const overduePercent = (overdueTasks / base) * 100;

  return Math.round(clampPercentage(60 + completedPercent - overduePercent * 2));
}
