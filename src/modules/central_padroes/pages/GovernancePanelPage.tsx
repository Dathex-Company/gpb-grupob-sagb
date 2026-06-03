// ============================================================
// Painel de Governança — Central de Padrões (T3.4)
// ============================================================

import React, { useEffect, useState } from 'react';
import { centralPadroesRepository } from '../services/centralPadroesRepository';
import { CentralStandard, CentralDecision, CentralStandardStatus } from '../types';

interface GovernanceSection {
  title: string;
  icon: string;
  items: GovernanceItem[];
  emptyMessage: string;
}

interface GovernanceItem {
  id: string;
  title: string;
  owner: string;
  status: string;
  areaId: string;
  key?: string;
  detail?: string;
}

const GOVERNANCE_AREAS = [
  { id: 'pietro', name: 'Pietro Carboni', label: 'Pendências Pietro' },
  { id: 'rodrigues', name: 'Rodrigues/Kane', label: 'Pendências Rodrigues/Kane' },
  { id: 'alice', name: 'Alice Montini', label: 'Pendências Alice' },
  { id: 'pedro', name: 'Pedro Gazan', label: 'Pendências Segurança' },
];

const GovernancePanelPage: React.FC = () => {
  const [sections, setSections] = useState<GovernanceSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGovernanceData();
  }, []);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      const snapshot = await centralPadroesRepository.getSnapshot();
      const standards = snapshot.standards;
      const decisions = snapshot.decisions;

      // Pendências por responsável
      const pendingByArea = GOVERNANCE_AREAS.map((area) => {
        const items = standards
          .filter((s) => {
            const isPending = ['bruto', 'rascunho', 'em_revisao', 'em_curadoria'].includes(s.status as string);
            const isOwner = s.owner?.toLowerCase().includes(area.name.toLowerCase()) || s.areaId === area.id;
            return isPending && isOwner;
          })
          .map((s) => ({
            id: s.id,
            title: s.title,
            owner: s.owner,
            status: s.status,
            areaId: s.areaId,
            key: s.key,
            detail: `Tipo: ${s.type} | Risco: ${s.risk}`
          }));

        return {
          title: area.label,
          icon: '⏳',
          items,
          emptyMessage: `Nenhuma pendência para ${area.name}`,
        } as GovernanceSection;
      });

      // Padrões vencidos (sem atualização há >30 dias)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const expiredStandards = standards
        .filter((s) => new Date(s.updatedAt) < thirtyDaysAgo && !['obsoleto', 'arquivado', 'bloqueado'].includes(s.status as string))
        .map((s) => ({
          id: s.id,
          title: s.title,
          owner: s.owner,
          status: s.status as string,
          areaId: s.areaId,
          key: s.key,
          detail: `Última atualização: ${s.updatedAt}`
        }));

      // Padrões sem dono
      const noOwner = standards
        .filter((s) => !s.owner || s.owner === '')
        .map((s) => ({
          id: s.id,
          title: s.title,
          owner: 'Sem dono',
          status: s.status,
          areaId: s.areaId,
          key: s.key,
          detail: '⚠️ Este padrão não possui responsável definido'
        }));

      // Decisões pendentes
      const pendingDecisions = decisions
        .filter((d) => d.status === 'proposta')
        .map((d) => ({
          id: d.id,
          title: d.title,
          owner: d.areaId || 'Não definido',
          status: d.status,
          areaId: d.areaId,
          detail: `Impactos: ${d.impacts.join(', ')}`
        }));

      // Itens aguardando aprovação
      const awaitingApproval = standards
        .filter((s) => s.status === 'em_curadoria' as CentralStandardStatus)
        .map((s) => ({
          id: s.id,
          title: s.title,
          owner: s.owner,
          status: s.status,
          areaId: s.areaId,
          key: s.key,
          detail: 'Aguardando aprovação para homologação'
        }));

      setSections([
        ...pendingByArea,
        {
          title: 'Padrões sem Atualização (>30 dias)',
          icon: '⏰',
          items: expiredStandards,
          emptyMessage: 'Nenhum padrão vencido encontrado',
        },
        {
          title: 'Padrões sem Dono',
          icon: '❓',
          items: noOwner,
          emptyMessage: 'Todos os padrões têm dono definido',
        },
        {
          title: 'Decisões Pendentes',
          icon: '⚖️',
          items: pendingDecisions,
          emptyMessage: 'Nenhuma decisão pendente',
        },
        {
          title: 'Aguardando Aprovação',
          icon: '✓',
          items: awaitingApproval,
          emptyMessage: 'Nenhum item aguardando aprovação',
        },
      ]);
    } catch (err) {
      console.error('[governance-panel] Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cp-governance-panel">
        <h2>📊 Painel de Governança</h2>
        <div className="cp-governance-loading">Carregando dados de governança...</div>
      </div>
    );
  }

  return (
    <div className="cp-governance-panel">
      <div className="cp-governance-header">
        <h2>📊 Painel de Governança</h2>
        <button className="cp-governance-refresh" onClick={loadGovernanceData}>↻ Atualizar</button>
      </div>
      <p className="cp-governance-subtitle">Visão consolidada de pendências, padrões vencidos, decisões e aprovações</p>

      {sections.map((section, idx) => (
        <div key={idx} className="cp-governance-section">
          <h3 className="cp-governance-section-title">
            {section.icon} {section.title}
            <span className="cp-governance-count">{section.items.length}</span>
          </h3>

          {section.items.length === 0 ? (
            <div className="cp-governance-empty">{section.emptyMessage}</div>
          ) : (
            <div className="cp-governance-items">
              {section.items.map((item) => (
                <div key={item.id} className="cp-governance-item">
                  <div className="cp-governance-item-header">
                    {item.key && <span className="cp-governance-item-key">{item.key}</span>}
                    <strong>{item.title}</strong>
                  </div>
                  <div className="cp-governance-item-meta">
                    <span className={`cp-status-badge cp-status-${item.status}`}>{item.status}</span>
                    <span>{item.owner}</span>
                  </div>
                  {item.detail && <div className="cp-governance-item-detail">{item.detail}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GovernancePanelPage;
