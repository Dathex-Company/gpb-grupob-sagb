import React, { useMemo, useState } from 'react';
import { ProjetoTela, ReferenciaTela, ReferenciaTipo } from '../../types/telasAvancadas.types';

interface ReferenciasPanelProps {
  projetos: ProjetoTela[];
  referencias: ReferenciaTela[];
  selectedProjectId: string | null;
  onAddReferencia: (ref: Omit<ReferenciaTela, 'id' | 'createdAt'>) => Promise<void>;
}

const REF_TYPE_GROUPS: { group: string; types: { tipo: ReferenciaTipo; label: string; icon: string }[] }[] = [
  {
    group: 'Estrutura',
    types: [
      { tipo: 'layout', label: 'Layout', icon: '📐' },
      { tipo: 'painel', label: 'Painel', icon: '📦' },
      { tipo: 'mapa', label: 'Mapa', icon: '🗺️' },
    ],
  },
  {
    group: 'Movimento',
    types: [
      { tipo: 'motion', label: 'Motion', icon: '🎬' },
      { tipo: 'conector', label: 'Conector', icon: '🔗' },
    ],
  },
  {
    group: 'Componentes',
    types: [
      { tipo: 'card', label: 'Card', icon: '🃏' },
      { tipo: 'cor_paleta', label: 'Cor/Paleta', icon: '🎨' },
    ],
  },
  {
    group: 'Outros',
    types: [
      { tipo: 'demo_comercial', label: 'Demo Comercial', icon: '📺' },
      { tipo: 'outro', label: 'Outro', icon: '📌' },
    ],
  },
];

const TYPE_ICONS: Record<ReferenciaTipo, string> = {
  layout: '📐', motion: '🎬', conector: '🔗', card: '🃏',
  painel: '📦', mapa: '🗺️', cor_paleta: '🎨', demo_comercial: '📺', outro: '📌',
};

export const ReferenciasPanel: React.FC<ReferenciasPanelProps> = ({ projetos, referencias, selectedProjectId, onAddReferencia }) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<ReferenciaTipo>('layout');
  const [tagsInput, setTagsInput] = useState('');

  const projetoId = selectedProjectId || projetos[0]?.id || '';
  const projetoAtual = useMemo(() => projetos.find((p) => p.id === projetoId), [projetos, projetoId]);

  const refs = useMemo(() => referencias.filter((r) => r.projetoId === projetoId), [referencias, projetoId]);

  // Group by type
  const grouped = useMemo(() => {
    const groups: Record<string, ReferenciaTela[]> = {};
    for (const r of refs) {
      if (!groups[r.tipo]) groups[r.tipo] = [];
      groups[r.tipo].push(r);
    }
    return groups;
  }, [refs]);

  const handleAdd = () => {
    if (!titulo.trim() || !projetoId) return;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    onAddReferencia({ projetoId, tipo, origem: 'texto', titulo: titulo.trim(), descricao, conteudo, tags });
    setTitulo(''); setConteudo(''); setDescricao(''); setTagsInput('');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">📚 Referências</h3>
          <p className="text-xs text-gray-400 mt-0.5">Referências visuais e conceituais para apoiar a criação das telas.</p>
        </div>
        {projetoAtual && (
          <span className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
            Projeto: {projetoAtual.nome}
          </span>
        )}
      </div>

      {/* New Reference Form */}
      <details className="group">
        <summary className="text-sm font-bold text-white cursor-pointer hover:text-blue-300 transition-colors">
          ✚ Adicionar referência
        </summary>
        <div className="mt-3 p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
          {/* Type selector by groups */}
          <div className="space-y-2">
            {REF_TYPE_GROUPS.map((g) => (
              <div key={g.group}>
                <p className="text-[10px] text-gray-500 uppercase mb-1">{g.group}</p>
                <div className="flex flex-wrap gap-2">
                  {g.types.map((t) => (
                    <button key={t.tipo} onClick={() => setTipo(t.tipo)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        tipo === t.tipo
                          ? 'bg-blue-600 text-white'
                          : 'bg-black/30 text-gray-300 border border-white/10 hover:border-blue-500/30'
                      }`}
                    >{t.icon} {t.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título da referência"
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm" />
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="Tags (separadas por vírgula)"
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm" />
          </div>
          <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição curta"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm" />
          <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={3}
            placeholder="Link, HTML, observação ou referência visual"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm resize-none" />
          <button onClick={handleAdd} disabled={!projetoId || !titulo.trim()}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold disabled:opacity-40">
            Salvar referência
          </button>
        </div>
      </details>

      {/* No references */}
      {refs.length === 0 && (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <p className="text-4xl">📭</p>
          <h3 className="text-lg font-bold text-white mt-3">Nenhuma referência ainda</h3>
          <p className="text-sm text-gray-400 mt-1">Adicione referências para apoiar o blueprint e a direção visual do projeto.</p>
        </div>
      )}

      {/* Grouped references */}
      {refs.length > 0 && (
        <div className="space-y-4">
          {REF_TYPE_GROUPS.map((g) => {
            const allTypes = g.types.map((t) => t.tipo);
            const items = refs.filter((r) => allTypes.includes(r.tipo));
            if (items.length === 0) return null;
            return (
              <div key={g.group}>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">{g.group} ({items.length})</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {items.map((r) => (
                    <div key={r.id} className="p-3 rounded-xl border border-white/10 bg-black/20 space-y-1.5 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-300 uppercase flex items-center gap-1">
                          <span>{TYPE_ICONS[r.tipo]}</span> {r.tipo.replace(/_/g, ' ')}
                        </span>
                        {r.tags.length > 0 && (
                          <div className="flex gap-1">
                            {r.tags.slice(0, 3).map((tag) => (
                              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      <h5 className="text-sm font-semibold text-white">{r.titulo}</h5>
                      {r.descricao && <p className="text-xs text-gray-400">{r.descricao}</p>}
                      <p className="text-[11px] text-gray-500 break-all line-clamp-2">{r.conteudo}</p>
                      <p className="text-[9px] text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
