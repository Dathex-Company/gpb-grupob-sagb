import React from 'react';
import { BackIcon, PlusIcon } from '../../../../../components/Icon';

interface AgentFactoryHeaderProps {
  onNavigateToEcosystem: () => void;
  onOpenNew: () => void;
}

export const AgentFactoryHeader: React.FC<AgentFactoryHeaderProps> = ({
  onNavigateToEcosystem,
  onOpenNew
}) => {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white dark:bg-sagb-panel px-8 transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onNavigateToEcosystem} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100">
          <BackIcon className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-bitrix-nav">Quadro de Elite</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">Cadastro estrutural de humanos e agentes</p>
        </div>
      </div>
      <button onClick={onOpenNew} className="inline-flex items-center gap-2 rounded-xl bg-bitrix-nav px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-black">
        <PlusIcon className="h-3.5 w-3.5" />
        Novo cadastro
      </button>
    </header>
  );
};
