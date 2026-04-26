import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { useState } from 'react';

import { GroupAvatar } from '@/components/ui/GroupAvatar.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { db } from '@/firebase.ts';
import { getInitials } from '@/lib/avatar/avatarInitials.ts';

interface AssignedUser {
  uid: string;
  displayName: string | null;
}

interface MemberInfo {
  uid: string;
  displayName: string | null;
  photoUrl?: string | null;
}

interface AssignedGroup {
  id: string;
  groupName: string;
  photoUrl?: string | null;
}

interface TaskAssigneesPreviewProps {
  assignedUsers?: AssignedUser[];
  members?: MemberInfo[];
  assignedGroup?: AssignedGroup | null;
  usersPerPage?: number;
  teamId?: string;
}

export function TaskAssigneesPreview({
  assignedUsers = [],
  members = [],
  assignedGroup = null,
  usersPerPage = 10,
  teamId,
}: TaskAssigneesPreviewProps) {
  const [page, setPage] = useState(0);

  const { data: groupMemberUids = [] } = useQuery({
    queryKey: ['groupMembers', teamId, assignedGroup?.id],
    queryFn: async () => {
      if (!teamId || !assignedGroup) return [];
      const snapshot = await getDocs(
        collection(db, 'teams', teamId, 'chatRooms', assignedGroup.id, 'members'),
      );
      return snapshot.docs.map((doc) => doc.id);
    },
    enabled: !!teamId && !!assignedGroup,
    staleTime: 5 * 60 * 1000,
  });

  const allUserUids = Array.from(new Set([...assignedUsers.map((u) => u.uid), ...groupMemberUids]));
  // Resolve full member info (photoUrl, displayName) for each assigned user
  const resolved = allUserUids
    .map((uid) => {
      const passedIn = assignedUsers.find((u) => u.uid === uid);
      const found = members.find((m) => m.uid === uid);
      if (!found) return null; // If not in the provided members array (e.g. spectator filtered out), don't render them
      return {
        uid,
        displayName: passedIn?.displayName ?? found.displayName ?? `Usuario ${uid.slice(0, 6)}`,
        photoUrl: found.photoUrl ?? null,
      };
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  const hasUsers = resolved.length > 0;
  const hasGroup = !!assignedGroup;

  if (!hasUsers && !hasGroup) {
    return <p className="text-sm font-body text-grey-400">Sin asignar</p>;
  }

  const totalPages = Math.ceil(resolved.length / usersPerPage);
  const pageItems = resolved.slice(page * usersPerPage, (page + 1) * usersPerPage);

  return (
    <div className="flex flex-col gap-3">
      {/* Users section */}
      {hasUsers && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400 mb-2">
            {resolved.length === 1 ? 'Usuario asignado' : 'Usuarios asignados'}
          </p>

          <div className="flex flex-col gap-2">
            {pageItems.map((user) => (
              <div key={user.uid} className="flex items-center gap-2.5">
                <UserAvatar
                  src={user.photoUrl}
                  alt={user.displayName}
                  initials={getInitials(user.displayName, 'U')}
                  className="w-7 h-7"
                />
                <p className="text-sm font-body text-grey-700 truncate">{user.displayName}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1 rounded-lg text-grey-400 hover:text-grey-700 hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-[10px] text-grey-400 font-body">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1 rounded-lg text-grey-400 hover:text-grey-700 hover:bg-grey-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Group section */}
      {hasGroup && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.7px] text-grey-400 mb-2">
            Grupo asignado
          </p>
          <div className="flex items-center gap-2.5">
            <GroupAvatar
              src={assignedGroup.photoUrl}
              name={assignedGroup.groupName}
              className="w-7 h-7"
            />
            <div className="flex items-center gap-1.5 min-w-0">
              <Users size={11} className="text-grey-400 flex-shrink-0" />
              <p className="text-sm font-body text-grey-700 truncate">{assignedGroup.groupName}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
