import {useState, useRef, useEffect} from 'react';
import {ChevronDown, Search, X} from 'lucide-react';
import {USER_GRADIENT} from './columnConfig';
import {USERS as USERS_DATA} from './kanbanData';

export default function UserDropdown({selected, onChange}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const ref = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const toggle = (id) => onChange(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
    const clearAll = () => onChange([]);

    const filtered = USERS_DATA.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.role.toLowerCase().includes(query.toLowerCase())
    );

    const isActive = selected.length > 0;
    const shownAvatars = USERS_DATA.filter(u => selected.includes(u.id)).slice(0, 3);
    const label = selected.length === 0 ? 'Usuarios'
        : selected.length === USERS_DATA.length ? 'Todos'
            : `${selected.length} seleccionado${selected.length > 1 ? 's' : ''}`;

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
                {shownAvatars.length > 0 && (
                    <div className="flex">
                        {shownAvatars.map((u, i) => (
                            <div
                                key={u.id}
                                className="w-4.5 h-4.5 rounded-full text-[7px] font-bold text-white flex items-center justify-center border-[1.5px] border-primary"
                                style={{background: USER_GRADIENT[u.id], marginLeft: i > 0 ? '-4px' : 0}}
                            >
                                {u.id}
                            </div>
                        ))}
                    </div>
                )}
                <span>{label}</span>
                <ChevronDown size={12}
                             className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}/>
            </button>

            {/* Panel */}
            {open && (
                <div className="
          absolute top-[calc(100%+8px)] left-0 z-[300]
          bg-primary border-[1.5px] border-grey-200
          rounded-[10px] shadow-card-lg
          min-w-[240px] overflow-hidden
          animate-fade-down
        ">
                    {/* Search */}
                    <div className="px-3 pt-3 pb-2 border-b border-grey-100">
                        <div
                            className="flex items-center gap-2 bg-secondary rounded-[7px] px-2.5 py-2 border-[1.5px] border-transparent focus-within:border-blue focus-within:bg-blue/5 transition-all duration-200">
                            <Search size={13} className="text-grey-400 shrink-0"/>
                            <input
                                ref={inputRef}
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="Buscar usuario…"
                                className="border-none outline-none bg-transparent text-[13px] font-body text-grey-800 w-full placeholder:text-grey-400"
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="text-grey-400 hover:text-grey-600">
                                    <X size={12}/>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-[210px] overflow-y-auto py-1.5">
                        {filtered.length === 0 ? (
                            <p className="text-center text-[12px] text-grey-400 py-4">Sin resultados</p>
                        ) : filtered.map(u => {
                            const checked = selected.includes(u.id);
                            return (
                                <div
                                    key={u.id}
                                    onClick={() => toggle(u.id)}
                                    className={`flex items-center gap-2.5 px-3.5 py-2 cursor-pointer transition-colors duration-150 ${checked ? 'bg-blue/6' : 'hover:bg-grey-50'}`}
                                >
                                    <div
                                        className="w-7 h-7 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                                        style={{background: USER_GRADIENT[u.id]}}
                                    >
                                        {u.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-grey-800 leading-tight">{u.name}</p>
                                        <p className="text-[11px] text-grey-400">{u.role}</p>
                                    </div>
                                    <div className={`
                    w-4 h-4 rounded-[4px] border-[1.5px] flex items-center justify-center text-[10px] shrink-0 transition-all duration-150
                    ${checked ? 'bg-blue border-blue text-white' : 'border-grey-300'}
                  `}>
                                        {checked && '✓'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
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
