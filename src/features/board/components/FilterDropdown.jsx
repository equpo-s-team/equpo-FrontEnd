import {useState, useRef, useEffect} from 'react';
import {ChevronDown} from 'lucide-react';
import {TAG_COLOR_CONFIG, TAG_LABEL_TO_COLOR} from "./columnConfig.js";

function TagPill({label, selected, onClick}) {
    const color = TAG_LABEL_TO_COLOR[label] || 'blue';
    const cfg = TAG_COLOR_CONFIG[color] || TAG_COLOR_CONFIG.blue;
    return (
        <button
            onClick={onClick}
            className={`
        px-2.5 py-1 rounded-xl text-[12px] font-medium border-[1.5px]
        transition-all duration-150 cursor-pointer
        ${cfg.bg} ${cfg.text} ${cfg.border}
        ${selected ? 'ring-2 ring-offset-0 ring-current' : 'opacity-70 hover:opacity-100'}
      `}
        >
            {label}
        </button>
    );
}

// ── CheckItem ────────────────────────────────────────────────────────────────
function CheckItem({icon, label, checked, onClick}) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors duration-150 ${checked ? 'bg-blue/6' : 'hover:bg-grey-50'}`}
        >
            {icon && <span className="text-[13px]">{icon}</span>}
            <span className="flex-1 text-[13px] font-medium text-grey-800">{label}</span>
            <div
                className={`w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center text-[10px] shrink-0 transition-all duration-150 ${checked ? 'bg-blue border-blue text-white' : 'border-grey-300'}`}>
                {checked && '✓'}
            </div>
        </div>
    );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function FilterDropdown({
                                           icon,
                                           label,
                                           type = 'check', // 'check' | 'tags'
                                           items = [],
                                           selected,
                                           onChange,
                                       }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const toggle = (val) => onChange(selected.includes(val) ? selected.filter(s => s !== val) : [...selected, val]);
    const clearAll = () => onChange([]);

    const isActive = selected.length > 0;
    const displayLabel = selected.length === 0 ? label
        : selected.length === 1 ? selected[0]
            : `${selected.length} ${label.toLowerCase()}`;

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px]
          font-body text-[13px] cursor-pointer whitespace-nowrap
          transition-all duration-200 select-none
          ${isActive || open
                    ? 'border-blue text-blue bg-blue/8'
                    : 'border-grey-200 text-grey-500 bg-primary hover:border-blue hover:text-blue hover:bg-blue/5'
                }
        `}
            >
                {icon && <span>{icon}</span>}
                <span>{displayLabel}</span>
                <ChevronDown size={12}
                             className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
            </button>

            {open && (
                <div className="
          absolute top-[calc(100%+8px)] left-0 z-[300]
          bg-primary border-[1.5px] border-grey-200
          rounded-[10px] shadow-card-lg
          overflow-hidden animate-fade-down
          min-w-[185px]
        ">
                    {type === 'tags' ? (
                        <div className="p-3">
                            <div className="flex flex-wrap gap-1.5">
                                {items.map(item => (
                                    <TagPill
                                        key={item.label}
                                        label={item.label}
                                        selected={selected.includes(item.label)}
                                        onClick={() => toggle(item.label)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-1.5">
                            {items.map(item => (
                                <CheckItem
                                    key={item.value ?? item.label}
                                    icon={item.icon}
                                    label={item.label}
                                    checked={selected.includes(item.value ?? item.label)}
                                    onClick={() => toggle(item.value ?? item.label)}
                                />
                            ))}
                        </div>
                    )}

                    <div className="px-3 py-2 border-t border-grey-100 flex justify-between items-center">
                        <button onClick={clearAll}
                                className="text-[12px] text-grey-400 hover:text-red transition-colors font-body">Limpiar
                            todo
                        </button>
                        <button onClick={() => setOpen(false)}
                                className="text-[12px] font-semibold text-blue bg-blue/8 border border-blue/25 px-3 py-1 rounded-lg hover:bg-blue/14 transition-colors font-body">Aplicar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
