import {useState} from 'react';
import {SlidersHorizontal} from 'lucide-react';
import UserDropdown from './UserDropdown.jsx';
import FilterDropdown from './FilterDropdown.jsx';
import {PRIORITIES, TAGS} from "@/components/board/kanbanData.js";

export default function FilterBar() {
    const [selectedUsers, setSelectedUsers] = useState(['AT', 'JR', 'ML']);
    const [selectedTags, setSelectedTags] = useState(['Frontend', 'Backend']);
    const [selectedPriority, setSelectedPriority] = useState(['high', 'medium', 'low']);
    const [mobileOpen, setMobileOpen] = useState(false);

    const activeCount = [
        selectedUsers.length > 0,
        selectedTags.length > 0,
        selectedPriority.length < PRIORITIES.length,
    ].filter(Boolean).length;

    return (
        <>
            <div className="
        hidden md:flex
        sticky top-[62px] z-40
        bg-primary border-b border-grey-200
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        px-8 py-2.5 items-center gap-2.5 flex-wrap
      ">
        <span className="text-[11px] font-bold uppercase tracking-[0.9px] text-grey-400 mr-1 shrink-0">
          Filtros
        </span>

                <UserDropdown selected={selectedUsers} onChange={setSelectedUsers}/>

                <div className="w-px h-5 bg-grey-200 shrink-0"/>

                <FilterDropdown
                    icon="🏷"
                    label="Etiquetas"
                    type="tags"
                    items={TAGS}
                    selected={selectedTags}
                    onChange={setSelectedTags}
                />

                <div className="w-px h-5 bg-grey-200 shrink-0"/>

                <FilterDropdown
                    icon="⚡"
                    label="Prioridad"
                    type="check"
                    items={PRIORITIES}
                    selected={selectedPriority}
                    onChange={setSelectedPriority}
                />
            </div>

            {/* Mobile filter toggle */}
            <div className="
        flex md:hidden
        sticky top-14 z-40
        bg-primary border-b border-grey-200
        px-4 py-2 items-center justify-between
      ">
                <span className="text-[12px] font-semibold text-grey-600">Sprint 7 — Módulo de Reportes</span>
                <button
                    onClick={() => setMobileOpen(o => !o)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border-[1.5px] font-body transition-all duration-200
            ${mobileOpen || activeCount > 0 ? 'border-blue text-blue bg-blue/8' : 'border-grey-200 text-grey-500'}
          `}
                >
                    <SlidersHorizontal size={13}/>
                    Filtros
                    {activeCount > 0 && (
                        <span
                            className="bg-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeCount}</span>
                    )}
                </button>
            </div>

            {/* Mobile filter panel */}
            {mobileOpen && (
                <div className="
          flex md:hidden flex-col gap-3
          bg-primary border-b border-grey-200
          px-4 py-3 sticky top-[calc(56px+41px)] z-30
          shadow-[0_4px_12px_rgba(0,0,0,0.06)]
          animate-fade-down
        ">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.9px] text-grey-400">Usuarios</span>
                        <UserDropdown selected={selectedUsers} onChange={setSelectedUsers}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.9px] text-grey-400">Etiquetas</span>
                        <FilterDropdown icon="🏷" label="Etiquetas" type="tags" items={TAGS} selected={selectedTags}
                                        onChange={setSelectedTags}/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <span
                            className="text-[10px] font-bold uppercase tracking-[0.9px] text-grey-400">Prioridad</span>
                        <FilterDropdown icon="⚡" label="Prioridad" type="check" items={PRIORITIES}
                                        selected={selectedPriority} onChange={setSelectedPriority}/>
                    </div>
                </div>
            )}
        </>
    );
}
