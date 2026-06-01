/**
 * BlockInspector — MEGA-ETAPA 06
 *
 * Painel de inspeção de bloco selecionado no ComposerCanvas.
 * Exibe: nome, tipo, zona atribuída, ordem, PapelVisual, visibilidade, grupo, efeito sugerido.
 * Permite: alterar zona, reordenar, definir PapelVisual.
 */
import React from 'react';
import {
  BlockInspectorData,
  LayoutZone,
  PapelBloco,
} from '../../types/telasAvancadas.types';

/* ── Opções de PapelVisual ── */
const PAPEL_OPTIONS: { value: PapelBloco; label: string; descricao: string }[] = [
  { value: 'principal', label: 'Principal', descricao: 'Bloco central da tela' },
  { value: 'secundario', label: 'Secundário', descricao: 'Apoia o bloco principal' },
  { value: 'auxiliar', label: 'Auxiliar', descricao: 'Informação complementar' },
  { value: 'suporte', label: 'Suporte', descricao: 'Contexto técnico ou metadados' },
  { value: 'fechamento', label: 'Fechamento', descricao: 'Conclusão do fluxo' },
];

/* ── Props ── */
interface BlockInspectorProps {
  data: BlockInspectorData;
  zonasDisponiveis: LayoutZone[];
  onAssignZona: (blocoId: string, zonaId: string) => void;
  onReorder: (blocoId: string, newOrdem: number) => void;
  onSetPapelVisual: (blocoId: string, papel: PapelBloco) => void;
  onToggleVisibility: (blocoId: string) => void;
  onRemove: (blocoId: string) => void;
  onClose: () => void;
}

/* ── Componente ── */
export const BlockInspector: React.FC<BlockInspectorProps> = ({
  data,
  zonasDisponiveis,
  onAssignZona,
  onReorder,
  onSetPapelVisual,
  onToggleVisibility,
  onRemove,
  onClose,
}) => {
  const { bloco, meta, zona, ordem, papelVisual, efeitoAplicado, grupo } = data;

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4 space-y-4">
      {/* Cabeçalho */}
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-lg">{meta?.icone || '📦'}</span>
            <h4 className="text-sm font-semibold text-white">
              {meta?.nome || bloco.tipo.replace(/_/g, ' ')}
            </h4>
          </div>
          <p className="text-[10px] text-gray-400 ml-8">
            <code className="text-blue-300">{bloco.tipo}</code>
            {meta?.categoria && (
              <span className="ml-2 px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                {meta.categoria}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors text-sm leading-none"
          title="Fechar inspetor"
        >
          ✕
        </button>
      </div>

      {/* Descrição */}
      {meta?.descricao && (
        <p className="text-[11px] text-gray-400 leading-relaxed">
          {meta.descricao}
        </p>
      )}
      {meta?.ajuda && (
        <p className="text-[10px] text-blue-300/60 italic">
          💡 {meta.ajuda}
        </p>
      )}

      {/* Separador */}
      <hr className="border-white/5" />

      {/* Zona Atual */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          🗺️ Zona
        </label>
        <select
          value={zona?.id || ''}
          onChange={(e) => {
            if (e.target.value) onAssignZona(bloco.id, e.target.value);
          }}
          className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-xs"
        >
          {zonasDisponiveis.map((z) => (
            <option key={z.id} value={z.id}>
              {z.label} ({z.posicao})
            </option>
          ))}
        </select>
        {zona && (
          <p className="text-[9px] text-gray-500">
            {zona.descricao}
          </p>
        )}
      </div>

      {/* Ordem */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          🔢 Ordem na Zona
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onReorder(bloco.id, Math.max(1, ordem - 1))}
            disabled={ordem <= 1}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          >
            ↑
          </button>
          <span className="text-sm font-mono text-white min-w-[2ch] text-center">
            {ordem}
          </span>
          <button
            onClick={() => onReorder(bloco.id, ordem + 1)}
            className="px-2 py-1 rounded bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 text-xs"
          >
            ↓
          </button>
        </div>
      </div>

      {/* Papel Visual */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          🎭 Papel Visual
        </label>
        <div className="grid grid-cols-1 gap-1">
          {PAPEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onSetPapelVisual(bloco.id, opt.value)}
              className={`
                text-left px-3 py-1.5 rounded-lg text-xs transition-all duration-150
                ${papelVisual === opt.value
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-200'
                  : 'bg-black/20 border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-[9px] ml-2 text-gray-500">{opt.descricao}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grupo */}
      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          📁 Grupo
        </label>
        <input
          type="text"
          value={grupo || ''}
          readOnly
          placeholder="Nenhum grupo"
          className="w-full px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-xs placeholder:text-gray-600"
        />
      </div>

      {/* Efeito Aplicado */}
      {efeitoAplicado && (
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            ✨ Efeito Sugerido
          </label>
          <span className="inline-block px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] text-purple-300">
            {efeitoAplicado.replace(/_/g, ' ')}
          </span>
        </div>
      )}

      {/* Ações */}
      <hr className="border-white/5" />
      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleVisibility(bloco.id)}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            bloco.visivel
              ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              : 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
          }`}
        >
          {bloco.visivel ? '👁️ Visível' : '👁️‍🗨️ Oculta'}
        </button>
        <button
          onClick={() => onRemove(bloco.id)}
          className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium hover:bg-red-500/20"
        >
          🗑️ Remover
        </button>
      </div>
    </div>
  );
};
