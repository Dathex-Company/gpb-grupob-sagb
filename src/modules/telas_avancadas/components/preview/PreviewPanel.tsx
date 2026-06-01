/**
 * PreviewPanel — MEGA-ETAPA 06
 *
 * Preview Estrutural Forte:
 * - Layout model visualization
 * - Zone-based composition preview
 * - Block order visual with PapelVisual
 * - Template/preset metadata
 * - Visual direction impacts
 * - View mode toggle (estrutural/demo)
 */
import React, { useMemo } from 'react';
import {
  BlocoTela,
  BlueprintTela,
  ComposerState,
  ExportacaoTela,
  LayoutModelo,
  PapelBloco,
  ProjetoTela,
  ProjectVisualConfig,
  StudioPresetId,
  TelaTemplateId,
  VisualDirectionConfig,
} from '../../types/telasAvancadas.types';
import { LAYOUT_OPTIONS, getZonasForLayout } from '../../data/layouts';
import { STUDIO_TEMPLATES, STUDIO_PRESETS } from '../../data/studioCatalogs';

/* ── Helpers ── */

const BLOCK_ICONS: Record<string, string> = {
  entrada_ideia: '💡', card_agente: '🤖', conector: '🔗', painel_lateral: '📦',
  logs: '📝', artefatos: '📎', gates: '🚧', nucleo_central: '⚡',
  mapa_termico: '🔥', timeline: '⏱️', indicadores: '📊', capsula: '💊', bloco_final_entrega: '🏁',
};

const PAPEL_CORES: Record<PapelBloco, string> = {
  principal: 'border-l-blue-400 bg-blue-500/10',
  secundario: 'border-l-emerald-400 bg-emerald-500/10',
  auxiliar: 'border-l-amber-400 bg-amber-500/10',
  suporte: 'border-l-purple-400 bg-purple-500/10',
  fechamento: 'border-l-rose-400 bg-rose-500/10',
};

const PAPEL_LABEL: Record<PapelBloco, string> = {
  principal: 'Principal',
  secundario: 'Secundário',
  auxiliar: 'Auxiliar',
  suporte: 'Suporte',
  fechamento: 'Fechamento',
};

/* ── Props ── */

interface PreviewPanelProps {
  projetos: ProjetoTela[];
  blueprints: BlueprintTela[];
  blocos: BlocoTela[];
  visuais: ProjectVisualConfig[];
  selectedProjectId: string | null;
  exportacoes: ExportacaoTela[];
  composer: ComposerState | null;
  composerViewMode: 'estrutural' | 'demo';
  onGerarExportacao: (projetoId: string) => Promise<void>;
  onPublicar: (exportacaoId: string) => Promise<void>;
}

/* ── Component ── */

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  projetos, blueprints, blocos, visuais, selectedProjectId, exportacoes,
  composer, composerViewMode,
  onGerarExportacao, onPublicar,
}) => {
  const projeto = useMemo(() => projetos.find((p) => p.id === selectedProjectId) || null, [projetos, selectedProjectId]);
  const blueprint = useMemo(() => blueprints.find((b) => b.projetoId === selectedProjectId), [blueprints, selectedProjectId]);
  const blocosProjeto = useMemo(() => blocos.filter((b) => b.projetoId === selectedProjectId).sort((a, b) => a.ordem - b.ordem), [blocos, selectedProjectId]);
  const visual = useMemo(() => visuais.find((v) => v.projetoId === selectedProjectId), [visuais, selectedProjectId]);
  const lista = useMemo(() => exportacoes.filter((e) => e.projetoId === selectedProjectId), [exportacoes, selectedProjectId]);

  const templateInfo = useMemo(() => {
    if (!projeto?.templateId) return null;
    return STUDIO_TEMPLATES.find((t) => t.id === projeto.templateId) || null;
  }, [projeto?.templateId]);

  const presetInfo = useMemo(() => {
    if (!projeto?.presetId) return null;
    return STUDIO_PRESETS.find((p) => p.id === projeto.presetId) || null;
  }, [projeto?.presetId]);

  const layoutInfo = useMemo(() => {
    return LAYOUT_OPTIONS.find((l) => l.value === (composer?.layoutAtual ?? projeto?.layout));
  }, [composer?.layoutAtual, projeto?.layout]);

  const zonas = useMemo(() => {
    return getZonasForLayout(composer?.layoutAtual ?? projeto?.layout ?? 'dashboard_grid');
  }, [composer?.layoutAtual, projeto?.layout]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">🚀 Preview / Exportação / Publicação</h3>
            <p className="text-xs text-gray-400 mt-1">
              {composerViewMode === 'estrutural'
                ? 'Visão estrutural completa: layout, zonas, blocos e papéis visuais.'
                : 'Prévia visual da composição da tela com blocos organizados em zonas.'}
            </p>
          </div>
          <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
            {composerViewMode === 'estrutural' ? '🔲 Estrutural' : '🎬 Demo'}
          </span>
        </div>
      </div>

      {!projeto && (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <p className="text-4xl">🔍</p>
          <h3 className="text-lg font-bold text-white mt-3">Selecione um projeto</h3>
          <p className="text-sm text-gray-400 mt-1">Escolha um projeto no Estúdio para ver o preview completo.</p>
        </div>
      )}

      {projeto && (
        <>
          {/* ── Linha 1: Projeto + Layout + Template/Preset ── */}
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

            {/* Layout + Zonas */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase">🗺️ Layout</h4>
              <p className="text-sm text-white font-semibold">{layoutInfo?.label || projeto.layout}</p>
              <p className="text-[10px] text-gray-400">{layoutInfo?.descricao || ''}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {zonas.map((z) => (
                  <span key={z.id} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">
                    📍 {z.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Template / Preset */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase">📦 Template & Preset</h4>
              {templateInfo ? (
                <div>
                  <p className="text-xs text-white font-semibold">📐 {templateInfo.nome}</p>
                  <p className="text-[10px] text-gray-400">{templateInfo.objetivoBase}</p>
                  <p className="text-[10px] text-gray-500 mt-1">Fluxo: {templateInfo.fluxoBase}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500">Nenhum template aplicado</p>
              )}
              {presetInfo ? (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-white font-semibold">🎨 {presetInfo.nome}</p>
                  <p className="text-[10px] text-gray-400">{presetInfo.descricao}</p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-1">Nenhum preset aplicado</p>
              )}
            </div>
          </div>

          {/* ── Linha 2: Blueprint + Blocos + Visual ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Blueprint */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-purple-300 uppercase">Blueprint</h4>
              {blueprint ? (
                <>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Comunicação:</span> {blueprint.narrativa || '—'}</p>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Fluxo:</span> {blueprint.fluxoPrincipal || '—'}</p>
                  <p className="text-xs text-gray-300"><span className="text-gray-500">Efeitos:</span> {(blueprint.efeitos || []).join(', ') || '—'}</p>
                </>
              ) : (
                <p className="text-xs text-gray-500">Nenhum blueprint registrado.</p>
              )}
            </div>

            {/* Blocos com PapelVisual */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase">Blocos ({blocosProjeto.length})</h4>
              {blocosProjeto.length === 0 ? (
                <p className="text-xs text-gray-500">Nenhum bloco adicionado.</p>
              ) : (
                <div className="space-y-1.5">
                  {blocosProjeto.map((b, i) => {
                    const cs = composer?.blocos.find((c) => c.blocoId === b.id);
                    const zona = composer?.zonas.find((z) => z.id === cs?.zonaId);
                    const papelCor = cs?.papelVisual ? PAPEL_CORES[cs.papelVisual] : 'border-l-gray-500';
                    return (
                      <div
                        key={b.id}
                        className={`flex items-center gap-2 text-xs pl-2 border-l-4 ${papelCor} ${
                          !b.visivel ? 'opacity-40' : ''
                        }`}
                      >
                        <span className="text-gray-500 w-4 shrink-0">{i + 1}.</span>
                        <span className="shrink-0">{BLOCK_ICONS[b.tipo] || '📄'}</span>
                        <span className="text-gray-200 truncate">{b.tipo.replace(/_/g, ' ')}</span>
                        {cs?.papelVisual && (
                          <span className="text-[8px] uppercase px-1 py-0.5 rounded bg-white/10 text-gray-400 shrink-0">
                            {PAPEL_LABEL[cs.papelVisual]}
                          </span>
                        )}
                        {zona && (
                          <span className="text-[8px] text-gray-500 shrink-0">
                            📍{zona.label}
                          </span>
                        )}
                        <span className={`ml-auto w-2 h-2 rounded-full shrink-0 ${b.visivel ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Visual Direction */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-2">
              <h4 className="text-xs font-bold text-emerald-300 uppercase">🎨 Direção Visual</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Densidade</span>
                  <span className="text-gray-200">{visual?.densidadeVisual || projeto.intensidadeVisual}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Motion</span>
                  <span className="text-gray-200">{visual?.intensidadeMotion || projeto.intensidadeMotion}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Borda</span>
                  <span className="text-gray-200">{visual?.estiloBorda || 'arredondada'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Glass</span>
                  <span className="text-gray-200">{visual?.glass ? '✅ Sim' : '❌ Não'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Grid</span>
                  <span className="text-gray-200">{visual?.grid || 'ativa'}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Modo Demo</span>
                  <span className="text-gray-200">{visual?.modoDemo || projeto.modoDemo ? '▶️ Ativo' : '⏸️ Inativo'}</span>
                </div>
                <div className="flex justify-between text-[11px] pt-1 border-t border-white/5">
                  <span className="text-gray-500">Tom</span>
                  <span className="text-gray-200 font-medium">{visual?.tomVisual || projeto.tomVisual}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Composição por Zona ── */}
          {composer && (
            <div className="p-4 rounded-xl border border-white/10 bg-black/20 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 uppercase">
                📍 Composição por Zona ({composer.zonas.length} zonas)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {composer.zonas.map((zona) => {
                  const blocosNaZona = composer.blocos
                    .filter((b) => b.zonaId === zona.id)
                    .sort((a, b) => a.ordemZona - b.ordemZona);
                  return (
                    <div key={zona.id} className="p-3 rounded-lg border border-white/5 bg-black/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          📍 {zona.label}
                        </span>
                        <span className="text-[9px] text-gray-600">{zona.posicao}</span>
                      </div>
                      {blocosNaZona.length === 0 ? (
                        <p className="text-[10px] text-gray-600 italic">Vazia</p>
                      ) : (
                        <div className="space-y-1">
                          {blocosNaZona.map((cs, idx) => {
                            const bloco = blocosProjeto.find((b) => b.id === cs.blocoId);
                            return (
                              <div key={cs.blocoId} className="flex items-center gap-1.5 text-[11px]">
                                <span className="text-gray-600 w-3 shrink-0">{idx + 1}.</span>
                                <span className="shrink-0">{BLOCK_ICONS[bloco?.tipo || ''] || '📄'}</span>
                                <span className="text-gray-300 truncate">
                                  {(bloco?.tipo || '?').replace(/_/g, ' ')}
                                </span>
                                {cs.papelVisual && (
                                  <span className={`text-[8px] px-1 py-0.5 rounded ${PAPEL_CORES[cs.papelVisual]} text-gray-300 shrink-0`}>
                                    {PAPEL_LABEL[cs.papelVisual]}
                                  </span>
                                )}
                                {bloco && !bloco.visivel && (
                                  <span className="text-[9px] text-gray-600">👁️‍🗨️</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Ações ── */}
          <div className="flex items-center gap-3">
            <button onClick={() => onGerarExportacao(projeto.id)}
              className="px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-500 transition-all">
              ⚡ Gerar exportação HTML
            </button>
            <p className="text-xs text-gray-500">Gera um HTML completo com a estrutura atual do projeto.</p>
          </div>

          {/* ── Export List ── */}
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

                    <details className="group">
                      <summary className="text-xs text-gray-400 cursor-pointer hover:text-white transition-colors">👁️ Ver HTML gerado</summary>
                      <div className="mt-2 max-h-40 overflow-auto rounded-lg bg-black/40 border border-white/10 p-2">
                        <pre className="text-[10px] text-gray-300 whitespace-pre-wrap">{e.htmlGerado.slice(0, 800)}{e.htmlGerado.length > 800 ? '...' : ''}</pre>
                      </div>
                    </details>

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
