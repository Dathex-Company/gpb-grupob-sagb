import React, { useMemo, useState } from 'react';
import { BlocoTelaTipo, ProjetoTela } from '../../types/telasAvancadas.types';

interface EstudioPanelProps {
  projetos: ProjetoTela[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (input: Omit<ProjetoTela, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'versao'>) => Promise<void>;
  onAddBloco: (projectId: string, tipo: BlocoTelaTipo) => Promise<void>;
  onOpenSuperTela: () => void;
}

const blocos: BlocoTelaTipo[] = ['entrada_ideia','card_agente','conector','painel_lateral','logs','artefatos','gates','nucleo_central','mapa_termico','timeline','indicadores','capsula','bloco_final_entrega'];

export const EstudioPanel: React.FC<EstudioPanelProps> = ({ projetos, selectedProjectId, onSelectProject, onCreateProject, onAddBloco, onOpenSuperTela }) => {
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [categoria, setCategoria] = useState<ProjetoTela['categoria']>('dashboard');
  const selected = useMemo(() => projetos.find((p) => p.id === selectedProjectId) || null, [projetos, selectedProjectId]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Estúdio V1</h2>
        <button onClick={onOpenSuperTela} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-bold">Abrir Super Tela</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 rounded-2xl border border-white/10 bg-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white">Criar novo projeto</h3>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do projeto" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value as ProjetoTela['categoria'])} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white">
            <option value="dashboard">Dashboard</option><option value="cockpit">Cockpit</option><option value="timeline">Timeline</option><option value="network">Network</option><option value="outro">Outro</option>
          </select>
          <button
            onClick={() => onCreateProject({ nome, slug, categoria, objetivo: 'Definir objetivo', publico: 'Interno', contexto: 'Operação', tomVisual: 'Sério', intensidadeVisual: 'media', intensidadeMotion: 'moderada', modoDemo: true })}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold"
          >
            Criar projeto
          </button>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="text-sm font-bold text-white mb-3">Projetos</h3>
          <div className="space-y-2 max-h-64 overflow-auto">
            {projetos.map((p) => (
              <button key={p.id} onClick={() => onSelectProject(p.id)} className={`w-full text-left p-2 rounded-lg border ${selectedProjectId === p.id ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-black/20'}`}>
                <p className="text-sm text-white font-semibold">{p.nome}</p><p className="text-xs text-gray-400">{p.categoria} • {p.status}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected && (
        <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
          <h3 className="text-sm font-bold text-white mb-2">Biblioteca de blocos • {selected.nome}</h3>
          <div className="flex flex-wrap gap-2">
            {blocos.map((b) => (
              <button key={b} onClick={() => onAddBloco(selected.id, b)} className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-gray-200">{b}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

