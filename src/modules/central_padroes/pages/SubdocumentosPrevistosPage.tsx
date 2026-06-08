import React from 'react';
import { CentralPageShell } from '../components/CentralPageShell';
import { SectionPanel } from '../components/SectionPanel';
import { useCentralPadroes } from '../hooks/useCentralPadroes';

interface SubdocumentoPrevisto {
  codigo: string;
  tipo: string;
  nome: string;
  prioridade: string;
  origem: string;
  arquivoFuturo: string;
}

const subdocumentosPrevistos: SubdocumentoPrevisto[] = [
  /* DM-00-GOV */
  { codigo: 'GOV-PRT-001', tipo: 'protocolo', nome: 'Protocolo de Aprovação de Padrão', prioridade: 'Alta', origem: 'DM-00-GOV', arquivoFuturo: 'gov-prt-001-protocolo-aprovacao-padrao-v1.0-07-06-2026.md' },
  { codigo: 'GOV-PRT-002', tipo: 'protocolo', nome: 'Protocolo de Rejeição de Padrão', prioridade: 'Alta', origem: 'DM-00-GOV', arquivoFuturo: 'gov-prt-002-protocolo-rejeicao-padrao-v1.0-07-06-2026.md' },
  { codigo: 'GOV-PRT-003', tipo: 'protocolo', nome: 'Protocolo de Publicação Controlada', prioridade: 'Alta', origem: 'DM-00-GOV', arquivoFuturo: 'gov-prt-003-protocolo-publicacao-controlada-v1.0-07-06-2026.md' },
  { codigo: 'GOV-RGT-001', tipo: 'registro', nome: 'Registro de Fonte e Evidência Normativa', prioridade: 'Alta', origem: 'DM-00-GOV', arquivoFuturo: 'gov-rgt-001-registro-fonte-evidencia-normativa-v1.0-07-06-2026.md' },
  { codigo: 'GOV-PAD-003', tipo: 'padrão', nome: 'Padrão de Status Normativo', prioridade: 'Alta', origem: 'DM-00-GOV', arquivoFuturo: 'gov-pad-003-padrao-status-normativo-v1.0-07-06-2026.md' },

  /* DM-01-TEC-LOZE */
  { codigo: 'TEC-PAD-001', tipo: 'padrão', nome: 'Padrão de Módulo Plugável', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-001-padrao-modulo-plugavel-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-002', tipo: 'padrão', nome: 'Padrão de RPC para Ações Críticas', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-002-padrao-rpc-acoes-criticas-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-003', tipo: 'padrão', nome: 'Padrão de Supabase, RLS e Banco', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-003-padrao-supabase-rls-banco-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-004', tipo: 'padrão', nome: 'Padrão de Deploy e Ambientes', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-004-padrao-deploy-ambientes-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-005', tipo: 'padrão', nome: 'Padrão de Manifesto de Módulo', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-005-padrao-manifesto-modulo-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-006', tipo: 'padrão', nome: 'Padrão de Documentação Técnica de Módulo', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-006-padrao-documentacao-tecnica-modulo-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-007', tipo: 'padrão', nome: 'Padrão de Estrutura de Repositório', prioridade: 'Média', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-007-padrao-estrutura-repositorio-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PAD-008', tipo: 'padrão', nome: 'Padrão de API e Integrações', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-pad-008-padrao-api-integracoes-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PRT-001', tipo: 'protocolo', nome: 'Protocolo Pré-Dev Técnico', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-prt-001-protocolo-pre-dev-tecnico-v1.0-07-06-2026.md' },
  { codigo: 'TEC-PRT-002', tipo: 'protocolo', nome: 'Protocolo de Rollback Técnico', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-prt-002-protocolo-rollback-tecnico-v1.0-07-06-2026.md' },
  { codigo: 'TEC-MTZ-001', tipo: 'matriz', nome: 'Matriz de Reaproveitamento Técnico', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-mtz-001-matriz-reaproveitamento-tecnico-v1.0-07-06-2026.md' },
  { codigo: 'TEC-MTZ-002', tipo: 'matriz', nome: 'Matriz Criar/Reutilizar/Adaptar', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-mtz-002-matriz-criar-reutilizar-adaptar-v1.0-07-06-2026.md' },
  { codigo: 'TEC-RGT-001', tipo: 'registro', nome: 'Relatório de Diagnóstico Técnico Inicial', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-rgt-001-relatorio-diagnostico-tecnico-inicial-v1.0-07-06-2026.md' },
  { codigo: 'TEC-RGT-002', tipo: 'registro', nome: 'Registro de Build/Teste', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-rgt-002-registro-build-teste-v1.0-07-06-2026.md' },
  { codigo: 'TEC-RGT-003', tipo: 'registro', nome: 'Registro de Decisão Técnica', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-rgt-003-registro-decisao-tecnica-v1.0-07-06-2026.md' },
  { codigo: 'TEC-CHK-001', tipo: 'checklist', nome: 'Checklist Pré-Dev Técnico', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-chk-001-checklist-pre-dev-tecnico-v1.0-07-06-2026.md' },
  { codigo: 'TEC-CHK-002', tipo: 'checklist', nome: 'Checklist de Deploy', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-chk-002-checklist-deploy-v1.0-07-06-2026.md' },
  { codigo: 'TEC-CHK-003', tipo: 'checklist', nome: 'Checklist de Segurança Técnica Aplicada', prioridade: 'Alta', origem: 'DM-01-TEC-LOZE', arquivoFuturo: 'tec-chk-003-checklist-seguranca-tecnica-aplicada-v1.0-07-06-2026.md' },

  /* DM-02-PROC */
  { codigo: 'PROC-CHK-001', tipo: 'checklist', nome: 'Checklist de Encerramento de Tarefa', prioridade: 'Alta', origem: 'DM-02-PROC', arquivoFuturo: 'proc-chk-001-checklist-encerramento-tarefa-v1.0-07-06-2026.md' },
  { codigo: 'PROC-RGT-001', tipo: 'registro', nome: 'Registro de Bloqueio Operacional', prioridade: 'Alta', origem: 'DM-02-PROC', arquivoFuturo: 'proc-rgt-001-registro-bloqueio-operacional-v1.0-07-06-2026.md' },
  { codigo: 'PROC-RGT-002', tipo: 'registro', nome: 'Registro de Reabertura de Tarefa', prioridade: 'Média', origem: 'DM-02-PROC', arquivoFuturo: 'proc-rgt-002-registro-reabertura-tarefa-v1.0-07-06-2026.md' },

  /* DM-03-SEG */
  { codigo: 'SEG-PAD-002', tipo: 'padrão', nome: 'Padrão de Cofre e Credenciais', prioridade: 'Alta', origem: 'DM-03-SEG', arquivoFuturo: 'seg-pad-002-padrao-cofre-credenciais-v1.0-07-06-2026.md' },
  { codigo: 'SEG-MTZ-001', tipo: 'matriz', nome: 'Matriz de Criticidade de Acesso', prioridade: 'Alta', origem: 'DM-03-SEG', arquivoFuturo: 'seg-mtz-001-matriz-criticidade-acesso-v1.0-07-06-2026.md' },
  { codigo: 'SEG-RGT-001', tipo: 'registro', nome: 'Registro de Incidente Suspeito', prioridade: 'Alta', origem: 'DM-03-SEG', arquivoFuturo: 'seg-rgt-001-registro-incidente-suspeito-v1.0-07-06-2026.md' },

  /* DM-04-UX */
  { codigo: 'UX-PAD-002', tipo: 'padrão', nome: 'Padrão de Estados de Interface', prioridade: 'Alta', origem: 'DM-04-UX', arquivoFuturo: 'ux-pad-002-padrao-estados-interface-v1.0-07-06-2026.md' },
  { codigo: 'UX-PAD-003', tipo: 'padrão', nome: 'Padrão de Microcopy Operacional', prioridade: 'Média', origem: 'DM-04-UX', arquivoFuturo: 'ux-pad-003-padrao-microcopy-operacional-v1.0-07-06-2026.md' },
  { codigo: 'UX-RGT-001', tipo: 'registro', nome: 'Registro de Evidência Visual', prioridade: 'Alta', origem: 'DM-04-UX', arquivoFuturo: 'ux-rgt-001-registro-evidencia-visual-v1.0-07-06-2026.md' },

  /* DM-05-AGT */
  { codigo: 'AGT-MTZ-001', tipo: 'matriz', nome: 'Matriz de Autonomia de Agentes', prioridade: 'Alta', origem: 'DM-05-AGT', arquivoFuturo: 'agt-mtz-001-matriz-autonomia-agentes-v1.0-07-06-2026.md' },
  { codigo: 'AGT-RGT-001', tipo: 'registro', nome: 'Registro de Execução de Agente', prioridade: 'Alta', origem: 'DM-05-AGT', arquivoFuturo: 'agt-rgt-001-registro-execucao-agente-v1.0-07-06-2026.md' },
  { codigo: 'AGT-POL-001', tipo: 'política', nome: 'Política de Tool Use por Agentes', prioridade: 'Alta', origem: 'DM-05-AGT', arquivoFuturo: 'agt-pol-001-politica-tool-use-agentes-v1.0-07-06-2026.md' },

  /* DM-06-IA */
  { codigo: 'IA-RGT-001', tipo: 'registro', nome: 'Registro de Benchmark de Modelo', prioridade: 'Alta', origem: 'DM-06-IA', arquivoFuturo: 'ia-rgt-001-registro-benchmark-modelo-v1.0-07-06-2026.md' },
  { codigo: 'IA-PRT-001', tipo: 'protocolo', nome: 'Protocolo de Troca de Modelo', prioridade: 'Alta', origem: 'DM-06-IA', arquivoFuturo: 'ia-prt-001-protocolo-troca-modelo-v1.0-07-06-2026.md' },
  { codigo: 'IA-MTZ-002', tipo: 'matriz', nome: 'Matriz de Risco de Uso de IA', prioridade: 'Alta', origem: 'DM-06-IA', arquivoFuturo: 'ia-mtz-002-matriz-risco-uso-ia-v1.0-07-06-2026.md' },

  /* DM-07-NAM */
  { codigo: 'NAM-RGT-001', tipo: 'registro', nome: 'Registro de Decisão de Naming', prioridade: 'Alta', origem: 'DM-07-NAM', arquivoFuturo: 'nam-rgt-001-registro-decisao-naming-v1.0-07-06-2026.md' },
  { codigo: 'NAM-MTZ-002', tipo: 'matriz', nome: 'Matriz de Conflito de Nome', prioridade: 'Alta', origem: 'DM-07-NAM', arquivoFuturo: 'nam-mtz-002-matriz-conflito-nome-v1.0-07-06-2026.md' },
  { codigo: 'NAM-CHK-001', tipo: 'checklist', nome: 'Checklist de Validação de Nome', prioridade: 'Alta', origem: 'DM-07-NAM', arquivoFuturo: 'nam-chk-001-checklist-validacao-nome-v1.0-07-06-2026.md' },

  /* DM-08-IDE */
  { codigo: 'IDE-RGT-001', tipo: 'registro', nome: 'Registro de Maturidade de Ideia', prioridade: 'Alta', origem: 'DM-08-IDE', arquivoFuturo: 'ide-rgt-001-registro-maturidade-ideia-v1.0-07-06-2026.md' },
  { codigo: 'IDE-PRT-001', tipo: 'protocolo', nome: 'Protocolo de Handoff de Ideia', prioridade: 'Alta', origem: 'DM-08-IDE', arquivoFuturo: 'ide-prt-001-protocolo-handoff-ideia-v1.0-07-06-2026.md' },
  { codigo: 'IDE-CHK-001', tipo: 'checklist', nome: 'Checklist de Ideia Pronta para Avaliação', prioridade: 'Alta', origem: 'DM-08-IDE', arquivoFuturo: 'ide-chk-001-checklist-ideia-pronta-avaliacao-v1.0-07-06-2026.md' },

  /* DM-09-MET */
  { codigo: 'MET-RGT-001', tipo: 'registro', nome: 'Registro de Fala Autoral', prioridade: 'Alta', origem: 'DM-09-MET', arquivoFuturo: 'met-rgt-001-registro-fala-autoral-v1.0-07-06-2026.md' },
  { codigo: 'MET-RGT-002', tipo: 'registro', nome: 'Registro de Interpretação de IA', prioridade: 'Alta', origem: 'DM-09-MET', arquivoFuturo: 'met-rgt-002-registro-interpretacao-ia-v1.0-07-06-2026.md' },
  { codigo: 'MET-CHK-001', tipo: 'checklist', nome: 'Checklist de Aplicabilidade Metodológica', prioridade: 'Alta', origem: 'DM-09-MET', arquivoFuturo: 'met-chk-001-checklist-aplicabilidade-metodologica-v1.0-07-06-2026.md' },

  /* DM-10-EDU */
  { codigo: 'EDU-PAD-002', tipo: 'padrão', nome: 'Padrão de Roteiro de Mentoria', prioridade: 'Alta', origem: 'DM-10-EDU', arquivoFuturo: 'edu-pad-002-padrao-roteiro-mentoria-v1.0-07-06-2026.md' },
  { codigo: 'EDU-MTZ-001', tipo: 'matriz', nome: 'Matriz de Progresso de Formação', prioridade: 'Alta', origem: 'DM-10-EDU', arquivoFuturo: 'edu-mtz-001-matriz-progresso-formacao-v1.0-07-06-2026.md' },
  { codigo: 'EDU-RGT-001', tipo: 'registro', nome: 'Registro de Evidência de Aprendizagem', prioridade: 'Alta', origem: 'DM-10-EDU', arquivoFuturo: 'edu-rgt-001-registro-evidencia-aprendizagem-v1.0-07-06-2026.md' },

  /* DM-11-NEG */
  { codigo: 'NEG-RGT-001', tipo: 'registro', nome: 'Registro de Hipótese de Negócio', prioridade: 'Alta', origem: 'DM-11-NEG', arquivoFuturo: 'neg-rgt-001-registro-hipotese-negocio-v1.0-07-06-2026.md' },
  { codigo: 'NEG-MTZ-002', tipo: 'matriz', nome: 'Matriz de Risco de Venture', prioridade: 'Alta', origem: 'DM-11-NEG', arquivoFuturo: 'neg-mtz-002-matriz-risco-venture-v1.0-07-06-2026.md' },
  { codigo: 'NEG-CHK-001', tipo: 'checklist', nome: 'Checklist de Venture Pronta para Execução', prioridade: 'Alta', origem: 'DM-11-NEG', arquivoFuturo: 'neg-chk-001-checklist-venture-pronta-execucao-v1.0-07-06-2026.md' }
];

const dominioGroup = (codigo: string): string => {
  if (codigo.startsWith('GOV')) return 'DM-00-GOV';
  if (codigo.startsWith('TEC')) return 'DM-01-TEC-LOZE';
  if (codigo.startsWith('PROC')) return 'DM-02-PROC';
  if (codigo.startsWith('SEG')) return 'DM-03-SEG';
  if (codigo.startsWith('UX')) return 'DM-04-UX';
  if (codigo.startsWith('AGT')) return 'DM-05-AGT';
  if (codigo.startsWith('IA')) return 'DM-06-IA';
  if (codigo.startsWith('NAM')) return 'DM-07-NAM';
  if (codigo.startsWith('IDE')) return 'DM-08-IDE';
  if (codigo.startsWith('MET')) return 'DM-09-MET';
  if (codigo.startsWith('EDU')) return 'DM-10-EDU';
  if (codigo.startsWith('NEG')) return 'DM-11-NEG';
  return '—';
};

const SubdocumentosPrevistosPage: React.FC = () => {
  const [dominioFilter, setDominioFilter] = React.useState<string>('todos');

  const filtered = dominioFilter === 'todos'
    ? subdocumentosPrevistos
    : subdocumentosPrevistos.filter((s) => s.origem === dominioFilter);

  const dominios = [...new Set(subdocumentosPrevistos.map((s) => s.origem))].sort();

  return (
    <CentralPageShell title="Subdocumentos Previstos" subtitle="Subdocumentos oficiais previstos para extração futura das seções 27 dos Documentos Mestres v3.0. Nenhum foi criado ainda.">
      <section className="cp-docs-panel">
        <div className="cp-docs-toolbar">
          <div className="cp-docs-filters">
            <button type="button" onClick={() => setDominioFilter('todos')} className={`cp-docs-filter ${dominioFilter === 'todos' ? 'active' : ''}`}>Todos</button>
            {dominios.map((d) => (
              <button key={d} type="button" onClick={() => setDominioFilter(d)} className={`cp-docs-filter ${dominioFilter === d ? 'active' : ''}`}>{d}</button>
            ))}
          </div>
        </div>
        <div className="cp-docs-table">
          <div className="cp-docs-table-head">
            <span>Código</span>
            <span>Tipo</span>
            <span>Nome</span>
            <span>Prioridade</span>
            <span>Domínio</span>
          </div>
          {filtered.map((item) => (
            <div key={item.codigo} className="cp-docs-doc-row">
              <div className="cp-docs-doc-name">
                <span>📝</span>
                <span><strong>{item.codigo}</strong></span>
              </div>
              <span>{item.tipo}</span>
              <span>{item.nome}</span>
              <span className={item.prioridade === 'Alta' ? 'text-red-500' : 'text-sagb-muted'}>{item.prioridade}</span>
              <span>{item.origem}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="cp-docs-doc-row">
              <div className="cp-docs-doc-name"><span>∅</span><span>Nenhum subdocumento previsto encontrado</span></div>
              <span>—</span><span>—</span><span>—</span><span>—</span>
            </div>
          )}
        </div>
      </section>
      <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-[12px] text-sagb-muted">
        <strong>⚠ Atenção:</strong> Nenhum subdocumento derivado foi criado. 
        Todos estão como <strong>previstos</strong> nas seções 27 dos Documentos Mestres v3.0.
        A extração ocorrerá em fase posterior.
      </div>
    </CentralPageShell>
  );
};

export default SubdocumentosPrevistosPage;
