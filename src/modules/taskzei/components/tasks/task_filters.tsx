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
    <div className="mb-4 p-3" style={{ borderRadius: 'var(--sagb-radius-xl)', border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)' }}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                onClick={() => onFilterChange(filter.key)}
                className="inline-flex h-8 items-center rounded-[var(--sagb-radius-sm)] border px-3 text-xs font-semibold transition-colors"
                style={{
                  borderColor: isActive ? 'var(--sagb-primary-soft)' : 'var(--sagb-line)',
                  backgroundColor: isActive ? 'var(--sagb-primary-soft)' : 'var(--sagb-surface)',
                  color: isActive ? 'var(--sagb-text)' : 'var(--sagb-muted)',
                }}
                onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; } }}
                onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)'; } }}
              >
                {filter.label}
                <span
                  className="ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: isActive ? 'color-mix(in srgb, var(--sagb-primary) 20%, transparent)' : 'var(--sagb-bg)',
                    color: isActive ? 'var(--sagb-primary)' : 'var(--sagb-muted)',
                  }}
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
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--sagb-muted)' }}
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
              className="h-8 w-full rounded-[var(--sagb-radius-sm)] pl-9 pr-3 text-xs"
              style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)', color: 'var(--sagb-text)' }}
            />
          </div>

          <button
            onClick={onClearFilters}
            className="inline-flex h-8 items-center rounded-[var(--sagb-radius-sm)] px-3 text-xs font-semibold transition-colors"
            style={{ border: '1px solid var(--sagb-line)', backgroundColor: 'var(--sagb-surface)', color: 'var(--sagb-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-bg)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--sagb-surface)'; }}
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
};
