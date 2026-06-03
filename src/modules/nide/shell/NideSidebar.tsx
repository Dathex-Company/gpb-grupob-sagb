import React from 'react';

interface NideSidebarProps {
  /** Placeholder para futura navegação interna do NIDE */
}

export const NideSidebar: React.FC<NideSidebarProps> = () => {
  return (
    <aside className="w-56 h-full border-r border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#0A1628]/50 p-4">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
        Navegação interna
      </p>
      <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 italic">
        Itens de navegação serão adicionados nas próximas etapas.
      </p>
    </aside>
  );
};
