import React from 'react';

export type TaskStatusFilter = 'todas' | 'aberta' | 'em_andamento' | 'concluida';

interface TaskFiltersProps {
  activeFilter: TaskStatusFilter;
  onFilterChange: (filter: TaskStatusFilter) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  counts: Record<TaskStatusFilter, number>;
  onClearFilters: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  activeFilter,
  onFilterChange,
  searchTerm,
  onSearchChange,
  counts,
  onClearFilters
}) => {
  const filters: Array<{ key: TaskStatusFilter; label: string }> = [
    { key: 'todas', label: 'Todas' },
    { key: 'aberta', label: 'Abertas' },
    { key: 'em_andamento', label: 'Em Andamento' },
    { key: 'concluida', label: 'Concluídas' }
  ];

  return (
    <div className="mb-4 rounded-xl border border-[#d9dee5] bg-[#ffffff] p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'border-[#d7ece8] bg-[#eaf7f5] text-[#414854]'
                    : 'border-[#d9dee5] bg-[#ffffff] text-[#6f7887] hover:bg-[#f5f6f7]'
                }`}
              >
                {filter.label}
                <span
                  className={`ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    isActive ? 'bg-[#68c7be]/20 text-[#4ea79e]' : 'bg-[#f0f2f4] text-[#95a0b1]'
                  }`}
                >
                  {counts[filter.key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#95a0b1]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por título ou descrição"
              className="h-8 w-full rounded-md border border-[#d9dee5] bg-[#fafbfc] pl-9 pr-3 text-xs text-[#414854] placeholder:text-[#95a0b1] focus:border-[#87a8cf] focus:outline-none focus:ring-2 focus:ring-[#87a8cf]/20"
            />
          </div>

          <button
            onClick={onClearFilters}
            className="inline-flex h-8 items-center rounded-md border border-[#d9dee5] bg-[#ffffff] px-3 text-xs font-semibold text-[#6f7887] hover:bg-[#f5f6f7]"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};
