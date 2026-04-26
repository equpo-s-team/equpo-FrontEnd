import { collection, getDocs } from 'firebase/firestore';
import { Phone, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { GroupAvatar } from '@/components/ui/GroupAvatar.tsx';
import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { teamsApi } from '@/features/team/api/teamsApi';
import { useTeamMembers } from '@/features/team/hooks/useTeamMembers';
import { db } from '@/firebase';
import { getInitials } from '@/components/ui/avatar/avatarInitials.ts';

import { useActiveCalls } from '../hooks/useActiveCalls';
import { useChatContext } from './ChatContext';

interface ChatUserInfo {
  uid: string;
  displayName?: string | null;
  photoURL?: string | null;
}

interface ChatInfoModalProps {
  onClose: () => void;
  usersInfo?: ChatUserInfo[];
}

interface ChatModalMember {
  uid: string;
  role: string;
  name: string;
  photoURL?: string | null;
}

export default function ChatInfoModal({ onClose, usersInfo = [] }: ChatInfoModalProps) {
  const { activeRoom, teamId } = useChatContext();
  const activeCalls = useActiveCalls(teamId || '');
  const { data: teamMembers = [] } = useTeamMembers(teamId || '');
  const [members, setMembers] = useState<ChatModalMember[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const isCallActive = activeCalls.some((c) => c.roomId === activeRoom?.id);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (!activeRoom || !teamId) return;

    let isCancelled = false;

    const fetchMembers = async () => {
      const snapshot = await getDocs(
        collection(db, 'teams', teamId, 'chatRooms', activeRoom.id, 'members'),
      );

      const baseMembers: Array<{ uid: string; role: string }> = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as { role?: string };
        baseMembers.push({ uid: doc.id, role: data.role ?? 'member' });
      });

      const providedByUid = new Map(usersInfo.map((u) => [u.uid, u]));
      const teamMembersByUid = new Map(teamMembers.map((m) => [m.uid, m]));

      const enrichedMembers = await Promise.all(
        baseMembers.map(async (member) => {
          const provided = providedByUid.get(member.uid);
          const teamMember = teamMembersByUid.get(member.uid);

          let displayName =
            provided?.displayName ?? teamMember?.displayName ?? `Usuario ${member.uid.slice(0, 6)}`;
          let photoURL = provided?.photoURL;

          // If the profile is incomplete, fetch canonical user data from backend.
          if (!displayName || !photoURL) {
            try {
              const { user } = await teamsApi.getUser(member.uid);
              displayName = user.displayName ?? displayName;
              photoURL = user.photoURL ?? photoURL;
            } catch {
              // Keep local fallback data when profile lookup fails.
            }
          }

          return {
            uid: member.uid,
            role: member.role,
            name: displayName,
            photoURL,
          };
        }),
      );

      if (!isCancelled) {
        setMembers(enrichedMembers);
      }
    };

    void fetchMembers();

    return () => {
      isCancelled = true;
    };
  }, [activeRoom, teamId, teamMembers, usersInfo]);

  if (!activeRoom) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div ref={modalRef} className="bg-white rounded-2xl w-[400px] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-grey-150">
          <h3 className="font-semibold text-grey-900">Informacion del chat</h3>
          <button onClick={onClose} className="text-grey-400 hover:text-grey-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <GroupAvatar
            src={activeRoom.photoUrl}
            name={activeRoom.name}
            className="w-16 h-16 mb-4"
            fallbackClassName="text-2xl"
          />
          <h4 className="font-body font-bold text-grey-900 text-base">{activeRoom.name}</h4>

          {isCallActive ? (
            <div className="mt-2 flex items-center gap-2 text-green font-medium text-sm">
              <Phone size={14} /> Videollamada en curso
            </div>
          ) : (
            <p className="text-xs text-grey-500">Sin videollamada activa</p>
          )}
        </div>

        <div className="p-4 border-t border-grey-150">
          <div className="flex items-center gap-2 mb-3">
            <Users size={16} className="text-grey-400" />
            <span className="text-sm font-semibold text-grey-800">Miembros ({members.length})</span>
          </div>
          <div className="max-h-[200px] overflow-y-auto flex flex-col gap-2">
            {members.map((m) => (
              <div key={m.uid} className="flex items-center gap-3 text-sm text-grey-700">
                <UserAvatar
                  src={m.photoURL}
                  alt={m.name}
                  initials={getInitials(m.name, m.uid)}
                  className="w-8 h-8 border border-grey-200"
                  fallbackClassName="text-xs"
                />
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
