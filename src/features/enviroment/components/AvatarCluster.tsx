import {Users} from "lucide-react";

import { UserAvatar } from '@/components/ui/UserAvatar.tsx';
import { type ConnectedUser } from '@/features/enviroment/types/hud.ts';

interface AvatarClusterProps {
  connected: number;
  max: number;
  users: ConnectedUser[];
}

export default function AvatarCluster({ connected, max, users }: AvatarClusterProps) {
  const shown = users.slice(0, 4);
  const extra = Math.max(connected - shown.length, 0);

  return (
    <div className="flex items-center gap-2.5">

      <div className="flex w-12">
        {shown.map((u, i) => (
          <div key={u.uid} title={u.name} style={{ marginLeft: i > 0 ? '-5px' : 0 }}>
            <UserAvatar
              src={u.photoUrl}
              alt={u.name}
              className="w-[22px] h-[22px] border-[1.5px] border-black/40"
              fallbackClassName={`text-xs text-white border-[1.5px] border-black/40 ${u.gradient}`}
            />
          </div>
        ))}
        {extra > 0 && (
          <div
            className="w-[22px] h-[22px] rounded-full text-xs font-bold text-white flex items-center justify-center border-[1.5px] border-black/40 bg-grey-700"
            style={{ marginLeft: '-5px' }}
          >
            +{extra}
          </div>
        )}
      </div>
      <span className="text-xs font-bold uppercase tracking-[0.5px] text-grey-700"><Users size={16} strokeWidth={3}/></span>
      <span className="text-sm font-bold text-grey-800">{connected}</span>
      <span className="text-xs text-grey-600">/ {max}</span>
    </div>
  );
}
