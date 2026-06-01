import React from 'react';
import { CentralTab } from '../../types/telasAvancadas.types';

interface CentralTabsProps {
  activeTab: CentralTab['id'];
  onChange: (tab: CentralTab['id']) => void;
}

const tabs: CentralTab[] = [
  { id: 'biblioteca', label: 'Biblioteca' },
  { id: 'estudio', label: 'Estúdio' },
  { id: 'referencias', label: 'Referências' },
  { id: 'preview', label: 'Preview' },
];

export const CentralTabs: React.FC<CentralTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-2xl border border-white/10 bg-black/20">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              active
                ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

