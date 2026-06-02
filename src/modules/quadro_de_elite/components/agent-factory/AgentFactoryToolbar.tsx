import React from 'react';
import { CloudUploadIcon, SearchIcon } from '../../../../../components/Icon';
import { Venture } from '../../types';

interface AgentFactoryToolbarProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  batchVentureId: string;
  onBatchVentureIdChange: (value: string) => void;
  batchOrigin: string;
  onBatchOriginChange: (value: string) => void;
  ventures: Venture[];
  batchInputRef: React.RefObject<HTMLInputElement>;
  onBatchFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
  isImporting: boolean;
  showAdvancedColumns: boolean;
  onToggleAdvancedColumns: () => void;
  importFeedback: string;
}

export const AgentFactoryToolbar: React.FC<AgentFactoryToolbarProps> = ({
  searchTerm,
  onSearchTermChange,
  batchVentureId,
  onBatchVentureIdChange,
  batchOrigin,
  onBatchOriginChange,
  ventures,
  batchInputRef,
  onBatchFile,
  onDownloadTemplate,
  isImporting,
  showAdvancedColumns,
  onToggleAdvancedColumns,
  importFeedback
}) => {
  return (
    <>
      <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 dark:border-white/5 px-6 py-4">
        <label className="relative min-w-[280px] flex-1">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={searchTerm} onChange={(event) => onSearchTermChange(event.target.value)} placeholder="Buscar por nome, area, funcao, origem..." className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 py-2.5 pl-10 pr-3 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
        </label>
        <div className="grid min-w-[240px] gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Venture do lote</span>
          <select value={batchVentureId} onChange={(event) => onBatchVentureIdChange(event.target.value)} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300">
            <option value="">Selecionar...</option>
            {ventures.map((venture) => <option key={venture.id} value={venture.id}>{venture.name}</option>)}
          </select>
        </div>
        <div className="grid min-w-[220px] gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Origem do lote</span>
          <input value={batchOrigin} onChange={(event) => onBatchOriginChange(event.target.value)} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
        </div>
        <input ref={batchInputRef} type="file" accept=".csv,.json" className="hidden" onChange={onBatchFile} />
        <button onClick={() => batchInputRef.current?.click()} disabled={isImporting} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50">
          <CloudUploadIcon className="h-4 w-4" />
          {isImporting ? 'Validando...' : 'Selecionar lote'}
        </button>
        <button onClick={onDownloadTemplate} className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-100">
          Template CSV
        </button>
        <button
          onClick={onToggleAdvancedColumns}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-gray-700 transition hover:bg-gray-50"
        >
          {showAdvancedColumns ? 'Colunas essenciais' : 'Colunas avancadas'}
        </button>
      </div>
      {importFeedback && <div className="border-b border-gray-100 bg-gray-50 px-6 py-2 text-[11px] font-semibold text-gray-600">{importFeedback}</div>}
    </>
  );
};
