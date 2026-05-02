import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const CATEGORY_COLORS = [
  { bg: 'bg-kanban-todo/20', border: 'border-kanban-todo/40', dot: 'bg-kanban-todo' },
  { bg: 'bg-blue/20', border: 'border-blue/40', dot: 'bg-blue' },
  { bg: 'bg-kanban-qa/20', border: 'border-kanban-qa/40', dot: 'bg-kanban-qa' },
  { bg: 'bg-green/20', border: 'border-green/40', dot: 'bg-green' },
  { bg: 'bg-purple/20', border: 'border-purple/40', dot: 'bg-purple' },
  { bg: 'bg-red/20', border: 'border-red/40', dot: 'bg-red' },
];

function getCategoryColor(label: string) {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = label.charCodeAt(i) + ((hash << 5) - hash);
  }
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

interface CategoryFilterProps {
  allCategories: string[];
  activeCategories: Set<string>;
  onToggle: (category: string) => void;
  onSelectAll: () => void;
}

export default function CategoryFilter({
  allCategories,
  activeCategories,
  onToggle,
  onSelectAll,
}: CategoryFilterProps) {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return allCategories;
    const lower = search.toLowerCase();
    return allCategories.filter((c) => c.toLowerCase().includes(lower));
  }, [allCategories, search]);

  const allSelected = activeCategories.size === 0; // empty means "show all"

  return (
    <div className="h-full rounded-2xl bg-white dark:bg-gray-800 border border-grey-150 dark:border-gray-700 shadow-card p-4 overflow-hidden">
      <h3 className="text-sm font-bold text-grey-800 dark:text-gray-300 font-body mb-3">Categorías</h3>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-grey-400 dark:text-grey-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="
            w-full pl-8 pr-3 py-2 rounded-xl text-xs font-body
            bg-grey-50 dark:bg-gray-800 border border-grey-150 dark:border-gray-600
            text-grey-700 dark:text-gray-300 placeholder:text-grey-400 dark:placeholder:text-grey-500
            focus:outline-none focus:border-blue/50 focus:ring-1 focus:ring-blue/20
            transition-all duration-200
          "
        />
      </div>

      {/* Select All */}
      <button
        onClick={onSelectAll}
        className={`
          w-full flex items-center gap-2.5 px-3 py-2 rounded-xl mb-1
          text-xs font-medium font-body transition-all duration-200
          ${
            allSelected
              ? 'bg-blue/10 text-blue border border-blue/20'
              : 'text-grey-600 dark:text-grey-400 hover:bg-grey-50 dark:hover:bg-gray-800 border border-transparent'
          }
        `}
      >
        <span
          className={`
            w-3 h-3 rounded-full border-2 flex-shrink-0
            ${allSelected ? 'bg-blue border-blue' : 'border-grey-300 dark:border-gray-600'}
          `}
        />
        Seleccionar Todo
      </button>

      {/* Category chips */}
      <div className="flex flex-col gap-0.5 max-h-28 overflow-y-auto scrollbar-hide">
        {filteredCategories.map((cat) => {
          const color = getCategoryColor(cat);
          const isActive = activeCategories.has(cat);

          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
              className={`
                flex items-center gap-2.5 px-3 py-2 rounded-xl
                text-xs font-medium font-body transition-all duration-200
                ${
                  isActive
                    ? `${color.bg} text-grey-800 border ${color.border}`
                    : 'text-grey-600 dark:text-grey-400 hover:bg-grey-50 dark:hover:bg-gray-800 border border-transparent'
                }
              `}
            >
              <span
                className={`
                  w-3 h-3 rounded-full flex-shrink-0
                  ${isActive ? color.dot : 'bg-grey-300 dark:bg-gray-600'}
                `}
              />
              {cat}
            </button>
          );
        })}

        {filteredCategories.length === 0 && (
          <p className="text-xs text-grey-400 dark:text-grey-500 text-center py-3">Sin categorías</p>
        )}
      </div>
    </div>
  );
}
