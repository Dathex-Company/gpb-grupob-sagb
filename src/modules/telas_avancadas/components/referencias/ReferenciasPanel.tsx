import React, { useState } from 'react';
import { ProjetoTela, ReferenciaTela } from '../../types/telasAvancadas.types';

interface ReferenciasPanelProps {
  projetos: ProjetoTela[];
  referencias: ReferenciaTela[];
  selectedProjectId: string | null;
  onAddReferencia: (ref: Omit<ReferenciaTela, 'id' | 'createdAt'>) => Promise<void>;
}

export const ReferenciasPanel: React.FC<ReferenciasPanelProps> = ({ projetos, referencias, selectedProjectId, onAddReferencia }) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [tipo, setTipo] = useState<ReferenciaTela['tipo']>('layout');

  const projetoId = selectedProjectId || projetos[0]?.id || '';
  const refs = referencias.filter((r) => r.projetoId === projetoId);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
        <h3 className="text-sm font-bold text-white">Nova referência</h3>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as ReferenciaTela['tipo'])} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white">
          <option value="layout">Layout</option><option value="motion">Motion</option><option value="conector">Conector</option><option value="card">Card</option><option value="painel">Painel</option><option value="mapa">Mapa</option><option value="cor_paleta">Cor/Paleta</option><option value="demo_comercial">Demo comercial</option><option value="outro">Outro</option>
        </select>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
        <textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} rows={3} placeholder="Link, HTML ou observação" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
        <button
          disabled={!projetoId}
          onClick={() => onAddReferencia({ projetoId, tipo, origem: 'texto', titulo, descricao: '', conteudo, tags: [] })}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold disabled:opacity-40"
        >
          Salvar referência
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {refs.map((r) => (
          <div key={r.id} className="p-3 rounded-xl border border-white/10 bg-black/20">
            <p className="text-xs text-blue-300 uppercase">{r.tipo}</p>
            <h4 className="text-sm font-semibold text-white">{r.titulo}</h4>
            <p className="text-xs text-gray-300 mt-1 break-all">{r.conteudo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

