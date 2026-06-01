import React from 'react';
import { TelaAvancada } from '../../types/telasAvancadas.types';
import { TelaAvancadaCard } from '../TelaAvancadaCard';

interface BibliotecaPanelProps {
  telas: TelaAvancada[];
  search: string;
  filterStatus: string;
  filterCategory: string;
  onSearch: (value: string) => void;
  onFilterStatus: (value: string) => void;
  onFilterCategory: (value: string) => void;
  onOpenHtmlViewer: (htmlContent: string, title: string) => void;
  onArchive: (tela: TelaAvancada) => void;
}

export const BibliotecaPanel: React.FC<BibliotecaPanelProps> = ({
  telas,
  search,
  filterStatus,
  filterCategory,
  onSearch,
  onFilterStatus,
  onFilterCategory,
  onOpenHtmlViewer,
  onArchive,
}) => {
  const filtered = telas.filter((t) => {
    const passSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const passStatus = filterStatus === 'todos' || (t.status || 'rascunho') === filterStatus;
    const passCategory = filterCategory === 'todos' || (t.category || 'outro') === filterCategory;
    return passSearch && passStatus && passCategory;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar por título" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white" />
        <select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          <option value="todos">Todos os status</option>
          <option value="rascunho">Rascunho</option>
          <option value="em_construcao">Em construção</option>
          <option value="em_teste">Em teste</option>
          <option value="publicado">Publicado</option>
          <option value="arquivado">Arquivado</option>
        </select>
        <select value={filterCategory} onChange={(e) => onFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          <option value="todos">Todas categorias</option>
          <option value="mapa_termico">Mapa térmico</option>
          <option value="esteira_agentes">Esteira de agentes</option>
          <option value="network">Network</option>
          <option value="dashboard">Dashboard</option>
          <option value="cockpit">Cockpit</option>
          <option value="timeline">Timeline</option>
          <option value="demo_comercial">Demo comercial</option>
          <option value="laboratorio">Laboratório</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tela) => (
          <div key={tela.id} className="space-y-2">
            <TelaAvancadaCard tela={tela} onOpenHtmlViewer={onOpenHtmlViewer} />
            <div className="px-2 py-1 rounded-lg bg-black/20 border border-white/10">
              <p className="text-[11px] text-gray-300">Status: <span className="text-white font-semibold">{tela.status || 'rascunho'}</span></p>
              <p className="text-[11px] text-gray-300">Categoria: <span className="text-white font-semibold">{tela.category || 'outro'}</span></p>
              <p className="text-[11px] text-gray-300">Origem: <span className="text-white font-semibold">{tela.source || 'biblioteca_manual'}</span></p>
              {tela.version && <p className="text-[11px] text-gray-300">Versão: <span className="text-white font-semibold">{tela.version}</span></p>}
            </div>
            <button onClick={() => onArchive(tela)} className="w-full text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
              Arquivar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
