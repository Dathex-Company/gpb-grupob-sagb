import React, { useEffect, useState } from 'react';
import { BibliotecaPanel } from '../components/biblioteca/BibliotecaPanel';
import { EstudioPanel } from '../components/estudio/EstudioPanel';
import { PreviewPanel } from '../components/preview/PreviewPanel';
import { ReferenciasPanel } from '../components/referencias/ReferenciasPanel';
import { CentralTabs } from '../components/shared/CentralTabs';
import { SuperTelaSagBPanel } from '../components/SuperTelaSagBPanel';
import { TelaAvancadaForm } from '../components/TelaAvancadaForm';
import { TelaAvancadaViewer } from '../components/TelaAvancadaViewer';
import { useTelasAvancadasStore } from '../store/telasAvancadas.store';
import { TelaAvancada } from '../types/telasAvancadas.types';

export const TelasAvancadasPage: React.FC = () => {
  const store = useTelasAvancadasStore();
  const [showForm, setShowForm] = useState(false);
  const [showSuperTela, setShowSuperTela] = useState(false);
  const [viewerTela, setViewerTela] = useState<TelaAvancada | null>(null);

  useEffect(() => {
    store.loadAll();
  }, []);

  const handleOpenHtmlViewer = (htmlContent: string, title: string) => {
    setViewerTela({ id: 'preview', type: 'html_code', title, htmlContent, createdAt: new Date(), updatedAt: new Date() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#15151f] p-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-white">Central de Telas Avançadas</h1>
            <p className="text-gray-400 text-sm">Biblioteca + Estúdio + Referências + Preview/Exportação/Publicação</p>
          </div>
          <button onClick={() => setShowForm(true)} className="px-5 py-3 rounded-xl bg-blue-600 text-white font-bold">+ Nova Tela</button>
        </header>

        <CentralTabs activeTab={store.activeTab} onChange={store.setActiveTab} />

        {store.activeTab === 'biblioteca' && (
          <BibliotecaPanel
            telas={store.telas}
            search={store.search}
            filterStatus={store.filterStatus}
            filterCategory={store.filterCategory}
            onSearch={store.setSearch}
            onFilterStatus={store.setFilterStatus}
            onFilterCategory={store.setFilterCategory}
            onOpenHtmlViewer={handleOpenHtmlViewer}
            onArchive={(t) => store.updateTela(t.id, { status: 'arquivado' })}
          />
        )}

        {store.activeTab === 'estudio' && (
          <EstudioPanel
            projetos={store.projetos}
            selectedProjectId={store.selectedProjectId}
            onSelectProject={store.setSelectedProjectId}
            onCreateProject={async (input) => {
              await store.createProjeto(input);
            }}
            onAddBloco={async (projectId, tipo) => {
              await store.addBloco(projectId, tipo);
            }}
            onOpenSuperTela={() => setShowSuperTela(true)}
          />
        )}

        {store.activeTab === 'referencias' && (
          <ReferenciasPanel
            projetos={store.projetos}
            referencias={store.referencias}
            selectedProjectId={store.selectedProjectId}
            onAddReferencia={async (ref) => {
              await store.addReferencia(ref);
            }}
          />
        )}

        {store.activeTab === 'preview' && (
          <PreviewPanel
            projetos={store.projetos}
            selectedProjectId={store.selectedProjectId}
            exportacoes={store.exportacoes}
            onGerarExportacao={async (projectId) => {
              await store.gerarExportacao(projectId);
            }}
            onPublicar={async (exportacaoId) => {
              await store.publicarExportacao(exportacaoId);
            }}
          />
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="w-full max-w-2xl bg-[#1a1a24] border border-white/10 rounded-2xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl text-white font-bold">Nova Tela</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400">Fechar</button>
              </div>
              <TelaAvancadaForm onSubmit={async (data) => { await store.addTela(data); setShowForm(false); }} isLoading={store.isLoading} error={store.error} />
            </div>
          </div>
        )}

        {viewerTela && (
          <div className="fixed inset-0 z-50">
            <TelaAvancadaViewer tela={viewerTela} onClose={() => setViewerTela(null)} />
          </div>
        )}

        {showSuperTela && <SuperTelaSagBPanel onClose={() => setShowSuperTela(false)} />}
      </div>
    </div>
  );
};

