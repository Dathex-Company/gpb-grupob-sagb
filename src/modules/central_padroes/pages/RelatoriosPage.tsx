import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const RelatoriosPage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  const relatorios = (snapshot?.documents || []).filter(
    (doc) => doc.areaId === 'pietro' && doc.category === 'Curadoria'
  ).sort((a, b) => a.title.localeCompare(b.title));

  return (
    <CentralPageShell title="Relatórios de Curadoria" subtitle="Relatórios 98.0 a 98.3 — gerados durante as rodadas de curadoria dos Documentos Mestres v3.0 em MD-central-de-padroes.">
      <SectionPanel title="Relatórios">
        <div className="cp-docs-table">
          <div className="cp-docs-table-head">
            <span>Título</span>
            <span>Caminho de origem</span>
            <span>Status</span>
            <span>Destino</span>
          </div>
          {relatorios.map((doc) => (
            <div key={doc.id} className="cp-docs-doc-row">
              <div className="cp-docs-doc-name">
                <span>📊</span>
                <span>{doc.title}</span>
              </div>
              <span className="text-[11px] text-sagb-muted">{doc.path}</span>
              <span><StatusBadge value={doc.status} /></span>
              <span>{doc.shouldBecome}</span>
            </div>
          ))}
          {relatorios.length === 0 && (
            <div className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>∅</span><span>Nenhum relatório encontrado</span></div>
              <span className="text-sagb-muted">—</span>
              <span><StatusBadge value="previsto" /></span>
              <span>—</span>
            </div>
          )}
        </div>
      </SectionPanel>
      <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[12px] text-sagb-muted">
        <strong>⚠ Origem:</strong> Todos os relatórios foram subidos de <code>MD-central-de-padroes</code>.
        Nenhum é canônico oficial. Status: <strong>registro</strong> de curadoria.
      </div>
    </CentralPageShell>
  );
};

export default RelatoriosPage;
