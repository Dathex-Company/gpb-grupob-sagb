import React from 'react';
import { CentralTab } from '../../types/telasAvancadas.types';

interface CentralTabsProps {
  activeTab: CentralTab['id'];
  onChange: (tab: CentralTab['id']) => void;
}

const tabs: (CentralTab & { icon: string; subtitle: string })[] = [
  { id: 'biblioteca', label: 'Biblioteca', icon: '📚', subtitle: 'Acervo de telas' },
  { id: 'estudio', label: 'Estúdio', icon: '🎨', subtitle: 'Criação guiada' },
  { id: 'referencias', label: 'Referências', icon: '📌', subtitle: 'Apoio visual' },
  { id: 'preview', label: 'Preview', icon: '🚀', subtitle: 'Exportar & Publicar' },
];

export const CentralTabs: React.FC<CentralTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-white/10 bg-black/30">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
              active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg scale-105'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.label}</span>
            {active && <span className="text-[10px] text-blue-200 ml-1 hidden sm:inline">{tab.subtitle}</span>}
          </button>
        );
      })}
    </div>
  );
};
