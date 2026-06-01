import React, { useMemo } from 'react';
import { BlocoTela, BlueprintTela, ExportacaoTela, ProjetoTela } from '../../types/telasAvancadas.types';

interface PreviewPanelProps {
  projetos: ProjetoTela[];
  blueprints: BlueprintTela[];
  blocos: BlocoTela[];
  selectedProjectId: string | null;
  exportacoes: ExportacaoTela[];
  onGerarExportacao: (projetoId: string) => Promise<void>;
  onPublicar: (exportacaoId: string) => Promise<void>;
}

const BLOCK_ICONS: Record<string, string> = {
  entrada_ideia: '💡', card_agente: '🤖', conector: '🔗', painel_lateral: '📦',
  logs: '📝', artefatos: '📎', gates: '🚧', nucleo_central: '⚡',
  mapa_termico: '🔥', timeline: '⏱️', indicadores: '📊', capsula: '💊', bloco_final_entrega: '🏁',
};

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  projetos, blueprints, blocos, selectedProjectId, exportacoes, onGerarExportacao, onPublicar,
}) => {
  const projeto = useMemo(() => projetos.find((p) => p.id === selectedProjectId) || null, [projetos, selectedProjectId]);
  const blueprint = useMemo(() => blueprints.find((b) => b.projetoId === selectedProjectId), [blueprints, selectedProjectId]);
  const blocosProjeto = useMemo(() => blocos.filter((b) => b.projetoId === selectedProjectId).sort((a, b) => a.ordem - b.ordem), [blocos, selectedProjectId]);
  const lista = useMemo(() => exportacoes.filter((e) => e.projetoId === selectedProjectId), [exportacoes, selectedProjectId]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
        <h3 className="text-sm font-bold text-white">🚀 Preview / Exportação / Publicação</h3>
        <p className="text-xs text-gray-400 mt-1">Fluxo completo: criação → estruturação → preview → exportação → biblioteca</p>
      </div>

      {!projeto && (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <p className="text-4xl">🔍</p>
          <h3 className="text-lg font-bold text-white mt-3">Selecione um projeto</h3>
          <p className="text-sm text-gray-400 mt-1">Escolha um projeto no Estúdio para ver o preview e as exportações.</p>
        </div>
      )}

      {projeto && (
        <>
          {/* Preview Estrutural */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Project Info */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-blue-300 uppercase">Projeto</h4>
              <p className="text-sm text-white font-semibold">{projeto.nome}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">{projeto.categoria}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">v{projeto.versao}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded ${
                  projeto.status === 'rascunho' ? 'bg-yellow-500/20 text-yellow-300' :
                  projeto.status === 'publicado' ? 'bg-emerald-500/20 text-emerald-300' :
                  'bg-blue-500/20 text-blue-300'
                }`}>{projeto.status}</span>
              </div>
              <p className="text-xs text-gray-400">{projeto.objetivo}</p>
              <p className="text-[10px] text-gray-500">Público: {projeto.publico} • Contexto: {projeto.contexto}</p>
            </div>

            {/* Blueprint Summary */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase">Blueprint</h4>
              {blueprint ? (
                <>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Comunicação:</span> {blueprint.narrativa || '—'}</p>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Fluxo:</span> {blueprint.fluxoPrincipal || '—'}</p>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Zonas:</span> {(blueprint.zonas || []).join(', ') || '—'}</p>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Efeitos:</span> {(blueprint.efeitos || []).join(', ') || '—'}</p>
                </>
              ) : (
                <p className="text-xs text-gray-500">Nenhum blueprint registrado.</p>
              )}
            </div>

            {/* Blocos Preview */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase">Blocos ({blocosProjeto.length})</h4>
              {blocosProjeto.length === 0 ? (
                <p className="text-xs text-gray-500">Nenhum bloco adicionado.</p>
              ) : (
                <div className="space-y-1.5">
                  {blocosProjeto.map((b, i) => (
                    <div key={b.id} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 w-4">{i + 1}.</span>
                      <span>{BLOCK_ICONS[b.tipo] || '📄'}</span>
                      <span className="text-gray-200">{b.tipo.replace(/_/g, ' ')}</span>
                      <span className={`ml-auto w-2 h-2 rounded-full ${b.visivel ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Visual Direction Summary */}
          <div className="p-4 rounded-xl border border-white/10 bg-black/20 flex flex-wrap gap-4">
            <div className="text-xs text-gray-300"><span className="text-gray-500">Densidade:</span> {projeto.intensidadeVisual}</div>
            <div className="text-xs text-gray-300"><span className="text-gray-500">Motion:</span> {projeto.intensidadeMotion}</div>
            <div className="text-xs text-gray-300"><span className="text-gray-500">Tom:</span> {projeto.tomVisual}</div>
            <div className="text-xs text-gray-300"><span className="text-gray-500">Demo:</span> {projeto.modoDemo ? '✅ Ativo' : '⏸️ Inativo'}</div>
          </div>

          {/* Export Action */}
          <div className="flex items-center gap-3">
            <button onClick={() => onGerarExportacao(projeto.id)}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all">
              ⚡ Gerar exportação HTML
            </button>
            <p className="text-xs text-gray-500">Gera um HTML completo com a estrutura atual do projeto.</p>
          </div>

          {/* Export List */}
          {lista.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-white mb-3">Exportações geradas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lista.map((e) => (
                  <div key={e.id} className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-semibold">{e.nomeArquivo}</p>
                        <p className="text-[10px] text-gray-400">
                          Versão: {e.versao} • Criado: {new Date(e.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        e.status === 'publicado' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>{e.status === 'publicado' ? '📦 Publicado' : '📄 Gerado'}</span>
                    </div>

                    {/* HTML Preview */}
                    <details className="group">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">👁️ Ver HTML gerado</summary>
                      <div className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/40 border border-white/10 p-2">
                        <pre className="text-[10px] text-gray-300 whitespace-pre-wrap">{e.htmlGerado.slice(0, 800)}{e.htmlGerado.length > 800 ? '...' : ''}</pre>
                      </div>
                    </details>

                    {/* Publish */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <p className="text-[10px] text-gray-500">Projeto: {projeto.nome} • Origem: Estúdio</p>
                      {e.status === 'gerado' && (
                        <button onClick={() => onPublicar(e.id)}
                          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-all">
                          📚 Publicar na Biblioteca
                        </button>
                      )}
                      {e.status === 'publicado' && (
                        <span className="text-xs text-emerald-400 font-semibold">✅ Publicado</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
