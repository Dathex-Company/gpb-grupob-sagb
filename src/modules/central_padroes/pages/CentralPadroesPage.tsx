import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookIcon, CalendarIcon } from '../../../../components/Icon';
import { manifest } from '../manifest';
import { moduleDoc } from '../module-doc';
import governancaReadmeMd from '../../../../docs/governanca_sagb/_readme.md?raw';
import padraoModulosPlugaveisMd from '../../../../docs/governanca_sagb/padrao_modulos_plugaveis.md?raw';
import padraoPosturaCondutaMd from '../../../../docs/governanca_sagb/padrao_postura_e_conduta_agentes.md?raw';
import protocoloLogContinuoMd from '../../../../docs/governanca_sagb/protocolo_log_continuo_agentes.md?raw';
import catalogoUnicoGovernancaMd from '../../../../docs/governanca_sagb/catalogo_unico_governanca.md?raw';
import mapaEquivalenciaMd from '../../../../docs/governanca_sagb/mapa_equivalencia_runtime_docs.md?raw';
import ownersAccountabilityMd from '../../../../docs/governanca_sagb/owners_e_accountability.md?raw';
import decisoesPendenciasMd from '../../../../docs/governanca_sagb/decisoes_e_pendencias.md?raw';
import templateSessionLogMd from '../../../../docs/governanca_sagb/template_session_log_agente.md?raw';
import qgModulosVendaveisMd from '../../../../docs/governanca_sagb/qg_modulos_vendaveis_template.md?raw';
import relacaoMonitoramentosExistentesMd from '../../../../docs/governanca_sagb/relacao_monitoramentos_existentes.md?raw';

import metadataJson from '../../../../docs/governanca_sagb/metadata.json';

type GovernanceDocStatus = 'ativo' | 'parcial' | 'pendente';
type GovernanceDocCategory = 'normas' | 'operacional' | 'templates';

interface GovernanceDoc {
  id: string;
  fileName: string;
  nomeBonito: string;
  description: string;
  category: GovernanceDocCategory;
  status: GovernanceDocStatus;
  content: string;
  criadoEm: string;
  ultimaAlteracao: string;
}

const CentralPadroesPage: React.FC = () => {
  const [docsAberto, setDocsAberto] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<GovernanceDoc | null>(null);

  const governanceDocs: GovernanceDoc[] = [
    {
      id: 'padrao_modulos_plugaveis',
      fileName: 'padrao_modulos_plugaveis.md',
      nomeBonito: metadataJson['padrao_modulos_plugaveis.md'].nome_bonito,
      description: 'Contrato técnico oficial de módulos plugáveis no runtime SagB.',
      category: 'normas',
      status: 'ativo',
      content: padraoModulosPlugaveisMd,
      criadoEm: metadataJson['padrao_modulos_plugaveis.md'].criado_em,
      ultimaAlteracao: metadataJson['padrao_modulos_plugaveis.md'].ultima_alteracao,
    },
    {
      id: 'padrao_postura_e_conduta_agentes',
      fileName: 'padrao_postura_e_conduta_agentes.md',
      nomeBonito: metadataJson['padrao_postura_e_conduta_agentes.md'].nome_bonito,
      description: 'Define a conduta obrigatória para todos os agentes do ecossistema.',
      category: 'normas',
      status: 'ativo',
      content: padraoPosturaCondutaMd,
      criadoEm: metadataJson['padrao_postura_e_conduta_agentes.md'].criado_em,
      ultimaAlteracao: metadataJson['padrao_postura_e_conduta_agentes.md'].ultima_alteracao,
    },
    {
      id: 'protocolo_log_continuo_agentes',
      fileName: 'protocolo_log_continuo_agentes.md',
      nomeBonito: metadataJson['protocolo_log_continuo_agentes.md'].nome_bonito,
      description: 'Regra mandatória de registro contínuo turno a turno.',
      category: 'normas',
      status: 'ativo',
      content: protocoloLogContinuoMd,
      criadoEm: metadataJson['protocolo_log_continuo_agentes.md'].criado_em,
      ultimaAlteracao: metadataJson['protocolo_log_continuo_agentes.md'].ultima_alteracao,
    },
    {
      id: 'catalogo_unico_governanca',
      fileName: 'catalogo_unico_governanca.md',
      nomeBonito: metadataJson['catalogo_unico_governanca.md'].nome_bonito,
      description: 'Inventário macro dos itens de governança e classificação oficial.',
      category: 'operacional',
      status: 'ativo',
      content: catalogoUnicoGovernancaMd,
      criadoEm: metadataJson['catalogo_unico_governanca.md'].criado_em,
      ultimaAlteracao: metadataJson['catalogo_unico_governanca.md'].ultima_alteracao,
    },
    {
      id: 'mapa_equivalencia_runtime_docs',
      fileName: 'mapa_equivalencia_runtime_docs.md',
      nomeBonito: metadataJson['mapa_equivalencia_runtime_docs.md'].nome_bonito,
      description: 'Mapa de equivalência entre runtime ativo e documentação macro.',
      category: 'operacional',
      status: 'parcial',
      content: mapaEquivalenciaMd,
      criadoEm: metadataJson['mapa_equivalencia_runtime_docs.md'].criado_em,
      ultimaAlteracao: metadataJson['mapa_equivalencia_runtime_docs.md'].ultima_alteracao,
    },
    {
      id: 'owners_e_accountability',
      fileName: 'owners_e_accountability.md',
      nomeBonito: metadataJson['owners_e_accountability.md'].nome_bonito,
      description: 'Matriz oficial de owner principal, backup e accountability.',
      category: 'operacional',
      status: 'parcial',
      content: ownersAccountabilityMd,
      criadoEm: metadataJson['owners_e_accountability.md'].criado_em,
      ultimaAlteracao: metadataJson['owners_e_accountability.md'].ultima_alteracao,
    },
    {
      id: 'decisoes_e_pendencias',
      fileName: 'decisoes_e_pendencias.md',
      nomeBonito: metadataJson['decisoes_e_pendencias.md'].nome_bonito,
      description: 'Trilha executiva de decisões fechadas e pendências em aberto.',
      category: 'operacional',
      status: 'ativo',
      content: decisoesPendenciasMd,
      criadoEm: metadataJson['decisoes_e_pendencias.md'].criado_em,
      ultimaAlteracao: metadataJson['decisoes_e_pendencias.md'].ultima_alteracao,
    },
    {
      id: 'template_session_log_agente',
      fileName: 'template_session_log_agente.md',
      nomeBonito: metadataJson['template_session_log_agente.md'].nome_bonito,
      description: 'Template padrão para iniciar logs de novos agentes e módulos.',
      category: 'templates',
      status: 'ativo',
      content: templateSessionLogMd,
      criadoEm: metadataJson['template_session_log_agente.md'].criado_em,
      ultimaAlteracao: metadataJson['template_session_log_agente.md'].ultima_alteracao,
    },
    {
      id: 'qg_modulos_vendaveis_template',
      fileName: 'qg_modulos_vendaveis_template.md',
      nomeBonito: metadataJson['qg_modulos_vendaveis_template.md'].nome_bonito,
      description: 'Guia de origem QG para módulos vendáveis plugados no SagB.',
      category: 'templates',
      status: 'ativo',
      content: qgModulosVendaveisMd,
      criadoEm: metadataJson['qg_modulos_vendaveis_template.md'].criado_em,
      ultimaAlteracao: metadataJson['qg_modulos_vendaveis_template.md'].ultima_alteracao,
    },
    {
      id: 'governanca_readme',
      fileName: '_readme.md',
      nomeBonito: metadataJson['_readme.md'].nome_bonito,
      description: 'Índice oficial da governança com fronteiras anti-duplicação.',
      category: 'normas',
      status: 'ativo',
      content: governancaReadmeMd,
      criadoEm: metadataJson['_readme.md'].criado_em,
      ultimaAlteracao: metadataJson['_readme.md'].ultima_alteracao,
    },
    {
      id: 'relacao_monitoramentos_existentes',
      fileName: 'relacao_monitoramentos_existentes.md',
      nomeBonito: metadataJson['relacao_monitoramentos_existentes.md'].nome_bonito,
      description: 'Inventário completo dos 132 itens de monitoramento em 13 submódulos do SagB.',
      category: 'operacional',
      status: 'ativo',
      content: relacaoMonitoramentosExistentesMd,
      criadoEm: metadataJson['relacao_monitoramentos_existentes.md'].criado_em,
      ultimaAlteracao: metadataJson['relacao_monitoramentos_existentes.md'].ultima_alteracao,
    },
  ];

  const stats = useMemo(() => {
    const total = governanceDocs.length;
    const ativos = governanceDocs.filter(doc => doc.status === 'ativo').length;
    const parciais = governanceDocs.filter(doc => doc.status === 'parcial').length;
    const pendentes = governanceDocs.filter(doc => doc.status === 'pendente').length;

    return { total, ativos, parciais, pendentes };
  }, [governanceDocs]);

  const categoryMap: Array<{ key: GovernanceDocCategory; title: string; docs: GovernanceDoc[]; accent: string }> = [
    {
      key: 'normas',
      title: 'Normas Oficiais',
      docs: governanceDocs.filter(doc => doc.category === 'normas'),
      accent: 'text-sagb-blue'
    },
    {
      key: 'operacional',
      title: 'Governança Operacional',
      docs: governanceDocs.filter(doc => doc.category === 'operacional'),
      accent: 'text-sagb-text'
    },
    {
      key: 'templates',
      title: 'Templates de Apoio',
      docs: governanceDocs.filter(doc => doc.category === 'templates'),
      accent: 'text-sagb-text'
    }
  ];

  const getStatusBadge = (status: GovernanceDocStatus) => {
    if (status === 'ativo') return 'bg-green-500';
    if (status === 'parcial') return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const openDoc = (doc: GovernanceDoc) => {
    setSelectedDoc(doc);
    setDocsAberto(true);
  };

  const renderDocsModal = () => {
    if (!docsAberto) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-sagb-line flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-sagb-text">{selectedDoc?.nomeBonito || 'Documento de Governança'}</h2>
              <p className="text-[12px] text-sagb-muted">
                docs/governanca_sagb/{selectedDoc?.fileName || '_readme.md'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-sagb-muted">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>Criado: {selectedDoc?.criadoEm || '—'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>Última: {selectedDoc?.ultimaAlteracao || '—'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setDocsAberto(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
            >
              Fechar
            </button>
          </div>

          <div className="p-6 overflow-y-auto">
            <article className="prose prose-sm max-w-none text-[12px] text-sagb-text">
              <ReactMarkdown>{selectedDoc?.content || '_Documento não encontrado._'}</ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-10 bg-sagb-bg text-[12px] text-sagb-text font-inter">
      <header className="mb-10 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Central de Padrões</h1>
          <p className="text-sagb-muted mt-2 text-[12px]">
            A base da verdade oficial de stack, design, naming e arquitetura do SagB.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Módulo Oficial</div>
          <div className="text-lg font-bold text-sagb-text">Central de Padrões</div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável: <span className="font-semibold text-sagb-text">{manifest.owner?.displayName || 'A definir'}</span>
          </div>
          <button
            onClick={() => openDoc(governanceDocs[0])}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[12px] font-semibold"
          >
            <BookIcon className="w-4 h-4" />
            Docs
          </button>
        </div>
      </header>

      <section className="bg-sagb-bg-2 p-6 rounded-2xl border border-sagb-line">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Responsabilidade do Módulo</h2>
            <p className="text-[12px] opacity-80 mb-2">
              <strong>Agente responsável:</strong> {manifest.owner?.displayName || 'A definir'}
            </p>
            <p className="text-[12px] text-sagb-muted">
              Esta central é o ponto oficial para padronização de design system, stack, nomenclaturas e guardrails técnicos do SagB.
            </p>
          </div>

          <div>
            <h2 className="text-[12px] font-bold text-sagb-text mb-2">Objetivo Operacional</h2>
            <p className="text-[12px] text-sagb-muted">
              Evitar duplicação de decisões técnicas e garantir que novos módulos sigam um padrão único, auditável e reutilizável.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="bg-sagb-panel p-4 rounded-xl border border-sagb-line">
          <div className="text-[10px] text-sagb-muted">Documentos</div>
          <div className="text-xl font-black text-sagb-text">{stats.total}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-green-500/20">
          <div className="text-[10px] text-sagb-muted">🟢 Ativos</div>
          <div className="text-xl font-black text-green-600">{stats.ativos}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-yellow-500/20">
          <div className="text-[10px] text-sagb-muted">🟡 Parciais</div>
          <div className="text-xl font-black text-yellow-600">{stats.parciais}</div>
        </article>
        <article className="bg-sagb-panel p-4 rounded-xl border border-red-500/20">
          <div className="text-[10px] text-sagb-muted">🔴 Pendentes</div>
          <div className="text-xl font-black text-red-600">{stats.pendentes}</div>
        </article>
      </section>

      <section id="governanca-docs" className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {categoryMap.map((category) => (
          <article key={category.key} className="bg-sagb-panel p-5 rounded-2xl border border-sagb-line">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-[12px] font-bold ${category.accent}`}>{category.title}</h3>
              <span className="text-[10px] text-sagb-muted">{category.docs.length} docs</span>
            </div>

            <ul className="space-y-2">
              {category.docs.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => openDoc(doc)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-sagb-line hover:bg-sagb-bg transition"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${getStatusBadge(doc.status)}`} />
                      <div className="flex-1">
                        <div className="text-[12px] font-semibold text-sagb-text">{doc.nomeBonito}</div>
                        <div className="text-[10px] text-sagb-muted mt-0.5">{doc.fileName}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-sagb-muted">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-2.5 h-2.5" />
                        <span>{doc.criadoEm}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="w-2.5 h-2.5" />
                        <span>{doc.ultimaAlteracao}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-sagb-muted mt-1">{doc.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      {renderDocsModal()}
    </div>
  );
};

export default CentralPadroesPage;
