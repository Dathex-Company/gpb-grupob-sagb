/**
 * ComposerCanvas — MEGA-ETAPA 06
 *
 * Visualiza o layout do projeto como zonas espaciais,
 * com blocos posicionados dentro de cada zona.
 *
 * Modo estrutural: mostra zonas como áreas delimitadas com labels
 * Modo demo: mostra uma prévia mais próxima do resultado final
 */
import React from 'react';
import {
  BlocoTela,
  LayoutComZonas,
  LayoutZone,
  PapelBloco,
} from '../../types/telasAvancadas.types';

/* ── Helpers de cor por PapelVisual ── */
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

/* ── Layout visual mapping: CSS grid areas ── */
const LAYOUT_GRID_MAP: Record<string, string> = {
  dashboard_grid: `
    "header_kpis header_kpis header_kpis"
    "grid_principal grid_principal grid_principal"
    "rodape rodape rodape"
  `,
  lateral_esquerda: `
    "topo topo topo"
    "lateral_esquerda centro centro"
    "rodape rodape rodape"
  `,
  lateral_direita: `
    "topo topo topo"
    "centro centro lateral_direita"
    "rodape rodape rodape"
  `,
  centro_orbitais: `
    "nucleo nucleo nucleo"
    "orbital orbital painel_tecnico"
    "trilha_inferior trilha_inferior trilha_inferior"
  `,
  esteira_horizontal: `
    "entrada esteira esteira painel_apoio"
    "conclusao conclusao conclusao conclusao"
  `,
  mapa_central_paineis: `
    "mapa_central mapa_central painel_apoio"
    "mapa_central mapa_central painel_tecnico"
    "faixa_progresso faixa_progresso faixa_progresso"
  `,
  fluxo_vertical: `
    "entrada entrada"
    "trilha_vertical painel_tecnico"
    "saida saida"
  `,
};

const getGridTemplate = (layout: string): string =>
  LAYOUT_GRID_MAP[layout] || LAYOUT_GRID_MAP.dashboard_grid;

/* ── Props ── */
interface ZoneBlock {
  blocoId: string;
  tipo: string;
  ordemZona: number;
  visivel: boolean;
  papelVisual?: PapelBloco;
}

interface ZoneWithBlocks {
  zona: LayoutZone;
  blocos: ZoneBlock[];
}

interface ComposerCanvasProps {
  layout: string;
  zonasComBlocos: ZoneWithBlocks[];
  blocosDisponiveis: BlocoTela[];
  viewMode: 'estrutural' | 'demo';
  selectedBlockId: string | null;
  onSelectBlock: (blocoId: string | null) => void;
  onAssignBlock: (blocoId: string, zonaId: string) => void;
  onRemoveBlock: (blocoId: string) => void;
}

/* ── Componente ── */
export const ComposerCanvas: React.FC<ComposerCanvasProps> = ({
  layout,
  zonasComBlocos,
  blocosDisponiveis,
  viewMode,
  selectedBlockId,
  onSelectBlock,
  onAssignBlock,
  onRemoveBlock,
}) => {
  const gridTemplate = getGridTemplate(layout);

  return (
    <div className="space-y-4">
      {/* Cabeçalho do layout */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
          🎨 Layout: <span className="text-blue-300">{layout.replace(/_/g, ' ')}</span>
        </h3>
        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
          {viewMode === 'estrutural' ? '🔲 Modo Estrutural' : '🎬 Modo Demo'}
        </span>
      </div>

      {/* Grid de zonas */}
      {viewMode === 'estrutural' ? (
        <div
          className="grid gap-2"
          style={{
            gridTemplateAreas: gridTemplate,
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          {zonasComBlocos.map(({ zona, blocos }) => {
            const areaName = zona.posicao;
            return (
              <div
                key={zona.id}
                style={{ gridArea: areaName }}
                className={`
                  rounded-xl border border-dashed p-3 min-h-[80px] transition-all duration-200
                  ${blocos.length === 0
                    ? 'border-white/5 bg-black/10'
                    : 'border-white/15 bg-black/20'
                  }
                  ${selectedBlockId && blocos.some((b) => b.blocoId === selectedBlockId)
                    ? 'ring-2 ring-blue-500/40'
                    : ''
                  }
                `}
              >
                {/* Label da zona */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                    📍 {zona.label}
                  </span>
                  <span className="text-[9px] text-gray-600">
                    {zona.posicao}
                  </span>
                </div>

                {/* Blocos na zona */}
                {blocos.length === 0 ? (
                  <p className="text-[10px] text-gray-600 italic">
                    Nenhum bloco atribuído
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {blocos.map((block) => (
                      <button
                        key={block.blocoId}
                        onClick={() => onSelectBlock(block.blocoId)}
                        className={`
                          w-full text-left px-2.5 py-1.5 rounded-lg text-[11px]
                          border-l-4 transition-all duration-150
                          ${block.papelVisual
                            ? PAPEL_CORES[block.papelVisual]
                            : 'border-l-gray-500 bg-white/5 hover:bg-white/10'
                          }
                          ${selectedBlockId === block.blocoId
                            ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/20'
                            : ''
                          }
                          ${!block.visivel ? 'opacity-40' : ''}
                        `}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-medium text-white/80">
                            {block.tipo.replace(/_/g, ' ')}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {block.papelVisual && (
                              <span className="text-[8px] uppercase px-1 py-0.5 rounded bg-white/10 text-gray-400">
                                {PAPEL_LABEL[block.papelVisual]}
                              </span>
                            )}
                            {!block.visivel && (
                              <span className="text-[9px] text-gray-500">👁️‍🗨️</span>
                            )}
                            <span className="text-[9px] text-gray-600">
                              #{block.ordemZona}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Drop zone para blocos disponíveis */}
                <div className="mt-2 pt-2 border-t border-white/5">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        onAssignBlock(e.target.value, zona.id);
                        e.target.value = '';
                      }
                    }}
                    value=""
                    className="w-full text-[10px] px-1.5 py-1 rounded bg-black/30 border border-white/5 text-gray-400"
                  >
                    <option value="">+ Atribuir bloco...</option>
                    {blocosDisponiveis.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.tipo.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ── Modo Demo ── */
        <div className="space-y-3">
          {zonasComBlocos.map(({ zona, blocos }) => (
            <div
              key={zona.id}
              className="rounded-xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/60">
                  {zona.label}
                </span>
                <span className="text-[9px] text-gray-500 uppercase">
                  {zona.posicao}
                </span>
              </div>
              {blocos.length === 0 ? (
                <div className="h-12 rounded-lg bg-white/5 border border-dashed border-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-gray-600">Zona vazia</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {blocos.map((block) => (
                    <div
                      key={block.blocoId}
                      onClick={() => onSelectBlock(block.blocoId)}
                      className={`
                        px-4 py-3 rounded-xl text-sm cursor-pointer transition-all duration-200
                        ${block.papelVisual
                          ? PAPEL_CORES[block.papelVisual]
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                        }
                        ${selectedBlockId === block.blocoId ? 'ring-2 ring-blue-400' : ''}
                        ${!block.visivel ? 'opacity-30' : ''}
                      `}
                    >
                      <div className="font-medium text-white/80">
                        {block.tipo.replace(/_/g, ' ')}
                      </div>
                      {block.papelVisual && (
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          {PAPEL_LABEL[block.papelVisual]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legenda de papéis */}
      <details className="text-[10px] text-gray-500">
        <summary className="cursor-pointer hover:text-gray-300">🎨 Legenda de Papéis Visuais</summary>
        <div className="flex flex-wrap gap-2 mt-1">
          {(Object.entries(PAPEL_LABEL) as [PapelBloco, string][]).map(([key, label]) => (
            <span
              key={key}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${PAPEL_CORES[key]} text-[9px]`}
            >
              {label}
            </span>
          ))}
        </div>
      </details>
    </div>
  );
};
