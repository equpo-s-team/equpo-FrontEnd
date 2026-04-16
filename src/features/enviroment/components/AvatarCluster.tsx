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
      <div className="flex">
        {shown.map((u, i) => (
          <div
            key={u.uid}
            title={u.name}
            className={`
              w-[22px] h-[22px] rounded-full
              text-[7.5px] font-bold text-white
              flex items-center justify-center
              border-[1.5px] border-black/40
              ${u.gradient}
            `}
            style={{ marginLeft: i > 0 ? '-5px' : 0 }}
          >
            {u.id}
          </div>
        ))}
        {extra > 0 && (
          <div
            className="w-[22px] h-[22px] rounded-full text-[7.5px] font-bold text-white flex items-center justify-center border-[1.5px] border-black/40 bg-grey-700"
            style={{ marginLeft: '-5px' }}
          >
            +{extra}
          </div>
        )}
      </div>
      <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-grey-700">
        Jugadores
      </span>
      <span className="text-[13px] font-bold text-grey-800">{connected}</span>
      <span className="text-[11px] text-grey-600">/ {max}</span>
    </div>
  );
}
