import React, { ReactNode } from 'react';
import { NIDE_FULL_NAME } from '../core/constants';

interface NideFullscreenLayoutProps {
  children: ReactNode;
  onBackToSagB?: () => void;
}

export const NideFullscreenLayout: React.FC<NideFullscreenLayoutProps> = ({ children, onBackToSagB }) => {
  return (
    <section className="flex-1 h-full overflow-hidden bg-[#EDF3FA] dark:bg-[#07111F] custom-scrollbar flex flex-col">
      {/* Header interno do NIDE */}
      <header className="shrink-0 h-14 bg-white/95 dark:bg-[#0A1628]/95 backdrop-blur border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-[10px] font-black">N</span>
          </div>
          <div>
            <h1 className="text-[11px] font-black tracking-tight text-slate-900 dark:text-white">NIDE</h1>
            <p className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 leading-tight">{NIDE_FULL_NAME}</p>
          </div>
        </div>
        {onBackToSagB && (
          <button
            type="button"
            onClick={onBackToSagB}
            className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 hover:border-blue-300/60"
          >
            ← Voltar ao SagB
          </button>
        )}
      </header>

      {/* Conteúdo */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </section>
  );
};
