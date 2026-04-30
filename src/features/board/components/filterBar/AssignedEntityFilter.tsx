import { ChevronDown, Users } from 'lucide-react';
import { useState } from 'react';

import { CheckRow } from '@/features/board/components/filterBar/CheckRow.tsx';

import { FilterPanelFooter } from '../../../../components/ui/FilterPanelFooter.tsx';
import { Pill } from '../../../../components/ui/Pill.tsx';
import { type assignedGroupFilterProp, type assignedUserFilterProp } from '../../types';
import { DropPanel } from './DropPanel';

export function AssignedUserFilter({ members, selected, onChange }: assignedUserFilterProp) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const toggle = (uid: string) =>
    onChange(selected.includes(uid) ? selected.filter((u) => u !== uid) : [...selected, uid]);

  const filtered = members.filter((m) =>
    (m.displayName || m.uid).toLowerCase().includes(query.toLowerCase()),
  );

  const label =
    selected.length === 0
      ? 'Persona'
      : selected.length === 1
        ? (members.find((m) => m.uid === selected[0])?.displayName ?? selected[0])
        : `${selected.length} personas`;

  return (
    <div className="relative">
      <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        <Users size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)} className="min-w-[240px]">
        <div className="px-3 pt-3 pb-2 border-b border-grey-100">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar usuario…"
            className="w-full px-2.5 py-2 rounded-[7px] bg-secondary border-[1.5px] border-transparent focus:border-blue focus:bg-blue/5 text-[13px] font-body text-grey-800 placeholder:text-grey-400 outline-none transition-all duration-200"
          />
        </div>

        <div className="max-h-[210px] overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="text-center text-[12px] text-grey-400 py-4">Sin resultados</p>
          ) : (
            filtered.map((m) => (
              <CheckRow
                key={m.uid}
                label={m.displayName || m.uid}
                checked={selected.includes(m.uid)}
                onClick={() => toggle(m.uid)}
              />
            ))
          )}
        </div>
        <FilterPanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}

export function AssignedGroupFilter({ groups, selected, onChange }: assignedGroupFilterProp) {
  const [open, setOpen] = useState(false);

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((g) => g !== id) : [...selected, id]);

  const label: string =
    selected.length === 0
      ? 'Grupo'
      : selected.length === 1
        ? (groups.find((g) => g.id === selected[0])?.groupName ?? selected[0])
        : `${selected.length} grupos`;

  return (
    <div className="relative">
      <Pill active={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        <Users size={12} />
        <span>{label}</span>
        <ChevronDown
          size={11}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </Pill>
      <DropPanel open={open} onClose={() => setOpen(false)}>
        <div className="py-1.5">
          {groups.length === 0 ? (
            <p className="text-center text-[12px] text-grey-400 py-4">No hay grupos</p>
          ) : (
            groups.map((g) => (
              <CheckRow
                key={g.id}
                label={g.groupName}
                checked={selected.includes(g.id)}
                onClick={() => toggle(g.id)}
              />
            ))
          )}
        </div>
        <FilterPanelFooter onClear={() => onChange([])} onApply={() => setOpen(false)} />
      </DropPanel>
    </div>
  );
}
