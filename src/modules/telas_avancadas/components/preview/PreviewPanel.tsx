import React from 'react';
import { ExportacaoTela, ProjetoTela } from '../../types/telasAvancadas.types';

interface PreviewPanelProps {
  projetos: ProjetoTela[];
  selectedProjectId: string | null;
  exportacoes: ExportacaoTela[];
  onGerarExportacao: (projetoId: string) => Promise<void>;
  onPublicar: (exportacaoId: string) => Promise<void>;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ projetos, selectedProjectId, exportacoes, onGerarExportacao, onPublicar }) => {
  const projeto = projetos.find((p) => p.id === selectedProjectId) || null;
  const lista = exportacoes.filter((e) => e.projetoId === selectedProjectId);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
        <h3 className="text-sm font-bold text-white">Preview / Exportação / Publicação</h3>
        <p className="text-xs text-gray-400 mt-1">Fluxo: criação → estruturação → preview → exportação → biblioteca</p>
        <button
          disabled={!projeto}
          onClick={() => projeto && onGerarExportacao(projeto.id)}
          className="mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-bold disabled:opacity-40"
        >
          Gerar exportação HTML
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lista.map((e) => (
          <div key={e.id} className="p-3 rounded-xl border border-white/10 bg-black/20 space-y-2">
            <p className="text-sm text-white font-semibold">{e.nomeArquivo}</p>
            <p className="text-xs text-gray-400">Versão: {e.versao} • Status: {e.status}</p>
            <textarea value={e.htmlGerado.slice(0, 600)} readOnly rows={6} className="w-full text-xs rounded-lg bg-black/40 border border-white/10 text-gray-300 p-2" />
            <button onClick={() => onPublicar(e.id)} className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold">
              Publicar na Biblioteca
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

