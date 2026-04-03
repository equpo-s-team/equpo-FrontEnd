import {ConnectedUser} from "@/features/enviroment/types/hud.ts";

const USERS: ConnectedUser[] = [
    {id: 'AT', name: 'Ana Torres', gradient: 'bg-avatar-at'},
    {id: 'JR', name: 'Jhon Ríos', gradient: 'bg-avatar-jr'},
    {id: 'ML', name: 'María López', gradient: 'bg-avatar-ml'},
    {id: 'LV', name: 'Laura Vélez', gradient: 'bg-avatar-lv'},
];

interface AvatarClusterProps {
    connected: number;
    max: number;
}

export default function AvatarCluster({connected, max}: AvatarClusterProps) {
    const shown = USERS.slice(0, 4);
    const extra = connected - shown.length;

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex">
                {shown.map((u, i) => (
                    <div
                        key={u.id}
                        title={u.name}
                        className={`
              w-[22px] h-[22px] rounded-full
              text-[7.5px] font-bold text-white
              flex items-center justify-center
              border-[1.5px] border-black/40
              ${u.gradient}
            `}
                        style={{marginLeft: i > 0 ? '-5px' : 0}}
                    >
                        {u.id}
                    </div>
                ))}
                {extra > 0 && (
                    <div
                        className="w-[22px] h-[22px] rounded-full text-[7.5px] font-bold text-white flex items-center justify-center border-[1.5px] border-black/40 bg-grey-700"
                        style={{marginLeft: '-5px'}}
                    >
                        +{extra}
                    </div>
                )}
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.5px] text-white/50">
        Jugadores
      </span>
            <span className="text-[13px] font-bold text-kanban-done">
        {connected}
      </span>
            <span className="text-[11px] text-white/30">/ {max}</span>
        </div>
    );
}
