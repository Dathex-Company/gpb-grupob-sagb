import React, { useState } from 'react';
import { TelaAvancada, TelaCategoria, TelaStatus, QuickEditData } from '../../types/telasAvancadas.types';
import { TelaAvancadaCard } from '../TelaAvancadaCard';

interface BibliotecaPanelProps {
  telas: TelaAvancada[];
  search: string;
  filterStatus: string;
  filterCategory: string;
  filterOrigin: string;
  editingTelaId: string | null;
  onSearch: (value: string) => void;
  onFilterStatus: (value: string) => void;
  onFilterCategory: (value: string) => void;
  onFilterOrigin: (value: string) => void;
  onOpenHtmlViewer: (htmlContent: string, title: string) => void;
  onArchive: (tela: TelaAvancada) => void;
  onQuickEdit: (id: string, data: QuickEditData) => Promise<void>;
  onSetEditingTelaId: (id: string | null) => void;
}

const STATUS_OPTIONS: { value: TelaStatus; label: string }[] = [
  { value: 'rascunho', label: 'Rascunho' },
  { value: 'em_construcao', label: 'Em construção' },
  { value: 'em_teste', label: 'Em teste' },
  { value: 'publicado', label: 'Publicado' },
  { value: 'arquivado', label: 'Arquivado' },
];

const CATEGORY_OPTIONS: { value: TelaCategoria; label: string }[] = [
  { value: 'mapa_termico', label: 'Mapa térmico' },
  { value: 'esteira_agentes', label: 'Esteira de agentes' },
  { value: 'network', label: 'Network' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'cockpit', label: 'Cockpit' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'demo_comercial', label: 'Demo comercial' },
  { value: 'laboratorio', label: 'Laboratório' },
  { value: 'outro', label: 'Outro' },
];

export const BibliotecaPanel: React.FC<BibliotecaPanelProps> = ({
  telas, search, filterStatus, filterCategory, filterOrigin, editingTelaId,
  onSearch, onFilterStatus, onFilterCategory, onFilterOrigin,
  onOpenHtmlViewer, onArchive, onQuickEdit, onSetEditingTelaId,
}) => {
  const [editData, setEditData] = useState<QuickEditData>({});

  const filtered = telas.filter((t) => {
    const passSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const passStatus = filterStatus === 'todos' || (t.status || 'rascunho') === filterStatus;
    const passCategory = filterCategory === 'todos' || (t.category || 'outro') === filterCategory;
    const passOrigin = filterOrigin === 'todos' || (t.source || 'biblioteca_manual') === filterOrigin;
    return passSearch && passStatus && passCategory && passOrigin;
  });

  const stats = {
    total: telas.length,
    published: telas.filter((t) => t.status === 'publicado').length,
    draft: telas.filter((t) => t.status === 'rascunho' || !t.status).length,
    archived: telas.filter((t) => t.status === 'arquivado').length,
    studio: telas.filter((t) => t.source === 'studio_export').length,
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">📚 Total: {stats.total}</span>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">✅ Publicados: {stats.published}</span>
        <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">📝 Rascunhos: {stats.draft}</span>
        <span className="px-3 py-1.5 rounded-lg bg-gray-500/10 border border-gray-500/20 text-gray-300">📦 Arquivados: {stats.archived}</span>
        <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">🎨 Do Estúdio: {stats.studio}</span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar por título..."
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500" />
        <select value={filterStatus} onChange={(e) => onFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          <option value="todos">Todos os status</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => onFilterCategory(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          <option value="todos">Todas categorias</option>
          {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={filterOrigin} onChange={(e) => onFilterOrigin(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white">
          <option value="todos">Todas origens</option>
          <option value="biblioteca_manual">📁 Biblioteca manual</option>
          <option value="studio_export">🎨 Exportado do Estúdio</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
          <p className="text-4xl">📭</p>
          <h3 className="text-lg font-bold text-white mt-3">Nenhum item encontrado</h3>
          <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou adicione uma nova tela.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tela) => (
            <div key={tela.id} className="space-y-2">
              <TelaAvancadaCard tela={tela} onOpenHtmlViewer={onOpenHtmlViewer} />

              {/* Quick metadata display */}
              <div className="px-2 py-1 rounded-lg bg-black/20 border border-white/10">
                <p className="text-[11px] text-gray-300">
                  Status: <span className={`font-semibold ${
                    tela.status === 'publicado' ? 'text-emerald-300' :
                    tela.status === 'arquivado' ? 'text-gray-400' :
                    tela.status === 'em_teste' ? 'text-purple-300' :
                    'text-yellow-300'
                  }`}>{tela.status || 'rascunho'}</span>
                </p>
                <p className="text-[11px] text-gray-300">Categoria: <span className="text-white font-semibold">{tela.category || 'outro'}</span></p>
                <p className="text-[11px] text-gray-300">Origem: <span className="text-white font-semibold">{tela.source === 'studio_export' ? '🎨 Estúdio' : '📁 Manual'}</span></p>
                {tela.version && <p className="text-[11px] text-gray-300">Versão: <span className="text-white font-semibold">{tela.version}</span></p>}
              </div>

              {/* Quick Edit */}
              {editingTelaId === tela.id ? (
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <input value={editData.title ?? tela.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Título" className="w-full text-xs px-2 py-1.5 rounded bg-black/30 border border-white/10 text-white" />
                  <select value={editData.status ?? tela.status ?? 'rascunho'} onChange={(e) => setEditData({ ...editData, status: e.target.value as TelaStatus })}
                    className="w-full text-xs px-2 py-1.5 rounded bg-black/30 border border-white/10 text-white">
                    {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <select value={editData.category ?? tela.category ?? 'outro'} onChange={(e) => setEditData({ ...editData, category: e.target.value as TelaCategoria })}
                    className="w-full text-xs px-2 py-1.5 rounded bg-black/30 border border-white/10 text-white">
                    {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <input value={editData.version ?? tela.version ?? ''} onChange={(e) => setEditData({ ...editData, version: e.target.value })}
                    placeholder="Versão" className="w-full text-xs px-2 py-1.5 rounded bg-black/30 border border-white/10 text-white" />
                  <div className="flex gap-2">
                    <button onClick={() => onQuickEdit(tela.id, editData)}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-bold">Salvar</button>
                    <button onClick={() => { onSetEditingTelaId(null); setEditData({}); }}
                      className="flex-1 px-2 py-1.5 rounded-lg bg-white/10 text-gray-300 text-[10px] font-bold">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditData({}); onSetEditingTelaId(tela.id); }}
                    className="flex-1 text-[10px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                    ✏️ Editar metadados
                  </button>
                  <button onClick={() => onArchive(tela)}
                    className="text-[10px] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10">
                    📦 Arquivar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
