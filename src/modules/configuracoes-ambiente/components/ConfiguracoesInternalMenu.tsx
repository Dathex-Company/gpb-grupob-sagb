import React from 'react';
import { ConfiguracaoCategoria } from '../services/configuracoesCatalog';

interface ConfiguracoesInternalMenuProps {
  categorias: ConfiguracaoCategoria[];
  ativoSlug: string;
  onSelect: (slug: string) => void;
}

export const ConfiguracoesInternalMenu: React.FC<ConfiguracoesInternalMenuProps> = ({
  categorias,
  ativoSlug,
  onSelect,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 rounded-3xl border border-sagb-line bg-sagb-panel p-5 shadow-sm">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sagb-muted mb-4">
        Categorias
      </h3>

      <nav className="flex flex-col gap-2" aria-label="Categorias de configuração">
        {categorias.map((cat) => {
          const isActive = cat.slug === ativoSlug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.slug)}
              className={`w-full text-left rounded-xl px-3 py-2.5 text-[12px] font-bold transition-all border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_6px_16px_rgba(37,99,235,0.35)]'
                  : 'bg-sagb-bg text-sagb-text border-sagb-line hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
