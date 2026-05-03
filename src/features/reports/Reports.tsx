import { useMemo, useState } from 'react';

import { useTeam } from '@/context/TeamContext.tsx';
import { KpiStrip, MemberList, OverdueTable, StatusDonut } from '@/features/reports/components';
import AppHeader from '@/features/reports/components/AppHeader.tsx';
import FilterBar from '@/features/reports/components/FilterBar.tsx';
import { useReportsKpi, useReportsOverview, useReportsTaskSync } from '@/features/reports/hooks';
import type { ReportsMember, ReportsOverdueTask } from '@/features/reports/types';
import type { KpiData, OverdueTaskRow, ReportMemberRow } from '@/features/reports/types';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { getInitials } from '@/lib/utils/avatar/avatarInitials.ts';

const EMPTY_KPI: KpiData = {
  todo: 0,
  progress: 0,
  qa: 0,
  done: 0,
  overdue: 0,
  total: 0,
};

const AVATAR_CLASSES: string[] = [
  'av-at',
  'av-jr',
  'av-ml',
  'av-cs',
  'av-lv',
  'av-dm',
  'av-rp',
  'av-kn',
  'av-so',
];
const BAR_GRADIENTS: string[] = [
  'linear-gradient(90deg,#60AFFF,#5961F9)',
  'linear-gradient(90deg,#9CEDC1,#86F0FD)',
  'linear-gradient(90deg,#F65A70,#FF94AE)',
  'linear-gradient(90deg,#FF94AE,#FCE98D)',
  'linear-gradient(90deg,#9b7fe1,#5961F9)',
  'linear-gradient(90deg,#86F0FD,#60AFFF)',
  'linear-gradient(90deg,#F65A70,#9b7fe1)',
  'linear-gradient(90deg,#9CEDC1,#5961F9)',
  'linear-gradient(90deg,#FCE98D,#FF94AE)',
];
const BAR_GLOWS: string[] = [
  '0 0 14px rgba(96,175,255,0.45)',
  '0 0 14px rgba(134,240,253,0.45)',
  '0 0 14px rgba(246,90,112,0.45)',
  '0 0 14px rgba(255,148,174,0.45)',
  '0 0 14px rgba(155,127,225,0.45)',
  '0 0 14px rgba(134,240,253,0.45)',
  '0 0 14px rgba(246,90,112,0.4)',
  '0 0 14px rgba(89,97,249,0.4)',
  '0 0 14px rgba(252,233,141,0.45)',
];
const PCT_COLORS: string[] = ['#5961F9', '#60AFFF', '#F65A70', '#FF94AE', '#9b7fe1', '#2e9660'];

function mapMembersToRows(
  members: ReportsMember[],
  memberPhotoByUid: Map<string, string | null>,
): ReportMemberRow[] {
  return members.map((member, index) => ({
    id: member.uid,
    initials: getInitials(member.displayName ?? member.uid, member.uid),
    name: member.displayName ?? `Usuario ${member.uid.slice(0, 6)}`,
    photoUrl: memberPhotoByUid.get(member.uid) ?? null,
    role: member.role,
    completed: member.completed,
    total: member.total,
    avatarClass: AVATAR_CLASSES[index % AVATAR_CLASSES.length],
    barGradient: BAR_GRADIENTS[index % BAR_GRADIENTS.length],
    barGlow: BAR_GLOWS[index % BAR_GLOWS.length],
    pctColor: PCT_COLORS[index % PCT_COLORS.length],
  }));
}

function mapOverdueToRows(tasks: ReportsOverdueTask[]): OverdueTaskRow[] {
  return tasks.map((task) => ({
    id: task.taskId,
    task: task.categories[0] ?? `Tarea ${task.taskId.slice(0, 8)}`,
    assignee: task.assignee,
    daysOverdue: task.daysOverdue,
    priority: task.priorityLabel,
  }));
}

export default function Reports() {
  const { teamId } = useTeam();
  const [activeDays, setActiveDays] = useState(30);
  const { data: teamMembers = [] } = useTeamMembers(teamId ?? '');

  const kpiQuery = useReportsKpi(teamId, { days: activeDays });
  const overviewQuery = useReportsOverview(teamId, {
    days: activeDays,
    overdueLimit: 10,
  });

  useReportsTaskSync(teamId);

  const memberPhotoByUid = useMemo(
    () => new Map(teamMembers.map((member) => [member.uid, member.photoUrl ?? null])),
    [teamMembers],
  );

  const kpi = kpiQuery.data?.kpi ?? EMPTY_KPI;
  const members = useMemo(
    () =>
      mapMembersToRows(
        (overviewQuery.data?.members ?? []).filter((m) => m.role !== 'spectator'),
        memberPhotoByUid,
      ),
    [memberPhotoByUid, overviewQuery.data?.members],
  );
  const overdueTasks = useMemo(
    () => mapOverdueToRows(overviewQuery.data?.overdueTasks ?? []),
    [overviewQuery.data?.overdueTasks],
  );

  const isLoading = kpiQuery.isPending || overviewQuery.isPending;
  const isError = kpiQuery.isError || overviewQuery.isError;
  const errorMessage =
    kpiQuery.error instanceof Error
      ? kpiQuery.error.message
      : overviewQuery.error instanceof Error
        ? overviewQuery.error.message
        : 'No se pudieron cargar los reportes.';

  return (
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-white dark:bg-gray-900 text-grey-800 dark:text-gray-300 font-body">
      <AppHeader />
      <FilterBar setActiveDays={setActiveDays} />
      <main className="relative z-10 mx-1 flex flex-1 flex-col overflow-y-auto px-4 py-4 sm:px-6 lg:px-9 pb-20 lg:pb-4">
        <p className="mb-3.5 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-grey-400 dark:text-grey-500">
          Resumen de estados
        </p>

        {isError && (
          <div className="mb-3 rounded-lg border border-[#f6d2da] bg-[#fff4f7] dark:bg-red/10 dark:border-red/30 px-3 py-2 text-sm text-[#c94155] dark:text-red">
            {errorMessage}
          </div>
        )}

        <div
          className={`relative flex flex-col lg:flex-row gap-2 lg:gap-4 ${isLoading ? 'opacity-70' : ''}`}
        >
          <div className="flex w-full lg:w-3/5 flex-col gap-2 min-w-0">
            <KpiStrip data={kpi} />
            <div className="flex-1 min-h-[300px] lg:min-h-0">
              <MemberList members={members} />
            </div>
          </div>

          <div className="flex w-full lg:w-2/5 flex-col gap-5 min-w-0">
            <div className="flex-shrink-0">
              <StatusDonut data={kpi} />
            </div>
            <div className="flex-1 min-h-[300px] lg:min-h-0">
              <OverdueTable tasks={overdueTasks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
