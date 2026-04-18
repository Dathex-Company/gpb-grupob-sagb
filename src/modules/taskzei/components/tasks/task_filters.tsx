import React from 'react';

interface TaskFiltersProps {
  onFilterChange?: (filter: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = () => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
        Todas
      </button>
      <button className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
        Abertas
      </button>
      <button className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
        Concluídas
      </button>
    </div>
  );
};
