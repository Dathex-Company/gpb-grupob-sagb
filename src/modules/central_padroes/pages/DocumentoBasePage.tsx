import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { StatusBadge } from '../components/StatusBadge';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

const DocumentoBasePage: React.FC = () => {
  const { snapshot } = useCentralPadroes();
  const docBase = (snapshot?.standards || []).find((s) => s.key === 'GOV-PAD-002');

  return (
    <CentralPageShell title="Documento-base 99" subtitle="Padrão-base documental para orientar a criação de Documentos Mestres na Central de Padrões.">
      <SectionPanel title="Informações do documento">
        {docBase ? (
          <div className="rounded-2xl border border-sagb-line bg-sagb-bg-2 p-4">
            <div className="grid grid-cols-2 gap-4 text-[12px]">
              <div><strong>Código:</strong> {docBase.key}</div>
              <div><strong>Tipo:</strong> {docBase.type}</div>
              <div><strong>Status:</strong> <StatusBadge status={docBase.status} /></div>
              <div><strong>Versão:</strong> v{docBase.version}.0</div>
              <div><strong>Responsável:</strong> {docBase.owner}</div>
              <div><strong>Domínio:</strong> Governança da Central de Padrões</div>
            </div>
            <div className="mt-4 text-[12px] text-sagb-muted">
              <strong>Resumo:</strong> {docBase.summary}
            </div>
            <div className="mt-4 text-[12px] text-sagb-muted">
              <strong>Uso:</strong> Orientar a criação de Documentos Mestres — estrutura de 30 seções, metadados, regras de versionamento e status.
            </div>
          </div>
        ) : (
          <div className="cp-docs-doc-row">
            <div className="cp-docs-doc-name"><span>∅</span><span>Documento-base 99 não encontrado no fallback</span></div>
          </div>
        )}
      </SectionPanel>
      <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[12px] text-sagb-muted">
        <strong>⚠ Origem:</strong> <code>MD-central-de-padroes/99-documento-base-padrao-para-criacao-de-documentos-mestres-v1.0-07-06-2026.md</code>.
        Documento em curadoria. Ainda não é canônico oficial.
      </div>
    </CentralPageShell>
  );
};

export default DocumentoBasePage;
