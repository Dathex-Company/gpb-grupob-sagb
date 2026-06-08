import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { CrudModal } from '../components/CrudModal';
import { FormField } from '../components/FormField';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { Toast } from '../components/Toast';
import { useCentralPadroes } from '../hooks/useCentralPadroes';
import { centralPadroesCrudService } from '../services/centralPadroesCrudService';

const dominioMap: Record<string, { name: string; owner: string }> = {
  'DM-00-GOV': { name: 'Governança da Central de Padrões', owner: 'Pietro Carboni' },
  'DM-01-TEC-LOZE': { name: 'Padrões Técnicos da Loze', owner: 'Sávio Codare' },
  'DM-02-PROC': { name: 'Processos, Execução e Registros Operacionais', owner: 'Yuri Sague' },
  'DM-03-SEG': { name: 'Segurança Digital, Risco e Proteção', owner: 'Pedro Gazan' },
  'DM-04-UX': { name: 'UX/UI, Experiência e Interface', owner: 'Alice Montini' },
  'DM-05-AGT': { name: 'Agentes Autônomos, IA e Orquestração', owner: 'Pierre Zanulli' },
  'DM-06-IA': { name: 'Modelos de IA, Radar Tecnológico e Governança de IA', owner: 'Klaus Wagen' },
  'DM-07-NAM': { name: 'Naming, Disponibilidade e Banco de Marcas', owner: 'Noah Verdili' },
  'DM-08-IDE': { name: 'Exploração e Classificação Inicial de Ideias', owner: 'Dante Montoya' },
  'DM-09-MET': { name: 'Metodologias, Frameworks e Estruturas Intelectuais', owner: 'Nilo Barret' },
  'DM-10-EDU': { name: 'Educação, Mentorias, Cursos, Trilhas e Programas de Formação', owner: 'Júlio Mosqueira' },
  'DM-11-NEG': { name: 'Marcas, Empresas, Ventures e Planos de Negócio', owner: 'César Tulli' }
};

const DocumentosMestresPage: React.FC = () => {
  const { snapshot, refetch } = useCentralPadroes();
  const [selectedDm, setSelectedDm] = React.useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [dmForm, setDmForm] = React.useState({ title: '', summary: '', owner: '', areaId: '' });
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [viewingDm, setViewingDm] = React.useState<string | null>(null);

  const dms = (snapshot?.standards || []).filter(
    (s) => s.key.startsWith('DM-') && s.type === 'documentacao_tecnica'
  ).sort((a, b) => a.key.localeCompare(b.key));

  const openEdit = (id: string) => {
    const dm = dms.find((d) => d.id === id);
    if (!dm) return;
    setSelectedDm(id);
    setDmForm({ title: dm.title, summary: dm.summary, owner: dm.owner, areaId: dm.areaId });
    setEditModalOpen(true);
  };

  const submitEdit = async () => {
    if (!selectedDm) return;
    try {
      await centralPadroesCrudService.updateStandard(selectedDm, {
        title: dmForm.title,
        summary: dmForm.summary,
        owner: dmForm.owner,
        areaId: dmForm.areaId
      });
      await refetch();
      setEditModalOpen(false);
      setToast({ message: 'Documento Mestre atualizado.', type: 'success' });
    } catch (err) {
      setToast({ message: String((err as Error)?.message || err), type: 'error' });
    }
  };

  const selectedDmData = viewingDm ? dms.find((d) => d.id === viewingDm) : null;

  return (
    <CentralPageShell title="Documentos Mestres v3.0" subtitle="Os 12 Documentos Mestres da Central de Padrões — subidos de MD-central-de-padroes como acervo em curadoria.">
      <SectionPanel title="Documentos Mestres">
        <div className="cp-docs-table">
          <div className="cp-docs-table-head">
            <span>Código</span>
            <span>Domínio</span>
            <span>Responsável</span>
            <span>Status</span>
            <span>Versão</span>
            <span>Ações</span>
          </div>
          {dms.map((dm) => {
            const info = dominioMap[dm.key];
            return (
              <div key={dm.id} className="cp-docs-doc-row">
                <div className="cp-docs-doc-name">
                  <span>📄</span>
                  <span><strong>{dm.key}</strong></span>
                </div>
                <span>{info?.name || dm.areaId}</span>
                <span className="cp-docs-person">
                  <span className="cp-docs-owner-dot">{info?.owner?.charAt(0) || '?'}</span>
                  {info?.owner || dm.owner}
                </span>
                <span><StatusBadge value={dm.status} /></span>
                <span>v{dm.version}.0</span>
                <span className="flex gap-2">
                  <button onClick={() => setViewingDm(dm.id)} className="rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-black text-blue-600">Ver</button>
                  <button onClick={() => openEdit(dm.id)} className="rounded-lg bg-sagb-bg-2 px-2 py-1 text-[10px] font-black text-sagb-text">Editar</button>
                </span>
              </div>
            );
          })}
          {dms.length === 0 && (
            <div className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>∅</span><span>Nenhum Documento Mestre encontrado</span></div>
              <span>—</span><span>—</span><span>—</span><span>—</span><span>—</span>
            </div>
          )}
        </div>
      </SectionPanel>

      {/* Visualizador de detalhes do DM */}
      {selectedDmData && (
        <SectionPanel title={`${selectedDmData.key} — ${selectedDmData.title}`}>
          <div className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div><strong>Código:</strong> {selectedDmData.key}</div>
              <div><strong>Status:</strong> <StatusBadge value={selectedDmData.status} /></div>
              <div><strong>Responsável:</strong> {selectedDmData.owner}</div>
              <div><strong>Versão:</strong> v{selectedDmData.version}.0</div>
              <div><strong>Tipo:</strong> {selectedDmData.type.replace(/_/g, ' ')}</div>
              <div><strong>Risco:</strong> <StatusBadge value={selectedDmData.risk} /></div>
            </div>
            <div className="mt-4 text-[12px]">
              <strong>Resumo:</strong>
              <p className="mt-1 text-sagb-muted whitespace-pre-wrap">{selectedDmData.summary}</p>
            </div>
            {selectedDmData.dependencies.length > 0 && (
              <div className="mt-4 text-[12px]">
                <strong>Dependências:</strong>
                <p className="mt-1 text-sagb-muted">{selectedDmData.dependencies.join(', ')}</p>
              </div>
            )}
            <div className="mt-4 text-[12px]">
              <strong>Módulos relacionados:</strong>
              <p className="mt-1 text-sagb-muted">{selectedDmData.relatedModules.join(', ')}</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => openEdit(selectedDmData.id)} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Editar metadados</button>
              <button onClick={() => setViewingDm(null)} className="rounded-xl bg-sagb-bg-2 px-4 py-2 text-[12px] font-black text-sagb-text">Fechar</button>
            </div>
          </div>
        </SectionPanel>
      )}

      {/* Modal de edição */}
      <CrudModal title="Editar Documento Mestre" open={editModalOpen} onClose={() => setEditModalOpen(false)} footer={<button onClick={submitEdit} className="rounded-xl bg-blue-600 px-4 py-2 text-[12px] font-black text-white">Salvar alterações</button>}>
        <div className="grid grid-cols-1 gap-3">
          <FormField label="Título" value={dmForm.title} onChange={(value) => setDmForm((prev) => ({ ...prev, title: value }))} />
          <FormField label="Resumo" value={dmForm.summary} onChange={(value) => setDmForm((prev) => ({ ...prev, summary: value }))} textarea />
          <FormField label="Responsável" value={dmForm.owner} onChange={(value) => setDmForm((prev) => ({ ...prev, owner: value }))} />
          <FormField label="Área" value={dmForm.areaId} onChange={(value) => setDmForm((prev) => ({ ...prev, areaId: value }))} />
        </div>
      </CrudModal>

      <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[12px] text-sagb-muted">
        <strong>⚠ Atenção:</strong> Nenhum Documento Mestre v3.0 está marcado como canônico oficial.
        Todos estão em <strong>em_curadoria</strong>. Validação final pendente: Pietro Carboni.
        Origem: <code>MD-central-de-padroes</code>.
      </div>
      <Toast message={toast?.message || null} type={toast?.type} onClose={() => setToast(null)} />
    </CentralPageShell>
  );
};

export default DocumentosMestresPage;
