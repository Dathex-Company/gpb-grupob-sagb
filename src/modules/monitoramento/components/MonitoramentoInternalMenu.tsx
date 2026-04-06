import React from 'react';
import { MonitoramentoSubmodulo } from '../types';

interface MonitoramentoInternalMenuProps {
  submodulos: MonitoramentoSubmodulo[];
  ativoSlug: string;
  onSelect: (slug: string) => void;
}

export const MonitoramentoInternalMenu: React.FC<MonitoramentoInternalMenuProps> = ({
  submodulos,
  ativoSlug,
  onSelect
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0F172A] p-5 shadow-sm">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">
        Submódulos
      </h3>

      <nav className="flex flex-col gap-2" aria-label="Submódulos de monitoramento">
        {submodulos.map((submodulo) => {
          const isActive = submodulo.slug === ativoSlug;

          return (
            <button
              key={submodulo.id}
              onClick={() => onSelect(submodulo.slug)}
              className={`w-full text-left rounded-xl px-3 py-2.5 text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_10px_24px_rgba(6,182,212,0.35)]'
                  : 'bg-gray-50 dark:bg-[#111827] text-gray-600 dark:text-gray-300 border-gray-100 dark:border-white/10 hover:border-cyan-300 hover:text-cyan-600'
              }`}
            >
              {submodulo.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
