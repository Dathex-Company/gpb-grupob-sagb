// ============================================================
// Painel de Governança — Central de Padrões (T3.4)
// Refatoração UI/UX — 12-06-2026
// ============================================================

import React, { useEffect, useState } from 'react';
import { centralPadroesRepository } from '../services/centralPadroesRepository';
import { CentralStandard, CentralStandardStatus } from '../types';

interface GovernanceSection {
  title: string;
  icon: string;
  items: GovernanceItem[];
  emptyMessage: string;
  count: number;
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
  { id: 'pietro', name: 'Pietro Carboni', label: 'Pietro Carboni' },
  { id: 'rodrigues', name: 'Rodrigues/Kane', label: 'Rodrigues/Kane' },
  { id: 'alice', name: 'Alice Montini', label: 'Alice Montini' },
  { id: 'pedro', name: 'Pedro Gazan', label: 'Segurança' },
];

const GovernancePanelPage: React.FC = () => {
  const [sections, setSections] = useState<GovernanceSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalPending: 0, expired: 0, noOwner: 0, pendingDecisions: 0, awaitingApproval: 0, totalStandards: 0 });

  useEffect(() => { void loadGovernanceData(); }, []);

  const loadGovernanceData = async () => {
    setLoading(true);
    try {
      const snapshot = await centralPadroesRepository.getSnapshot();
      const standards = snapshot.standards;
      const decisions = snapshot.decisions;

      const pendingByArea = GOVERNANCE_AREAS.map((area) => {
        const items = standards
          .filter((s) => {
            const isPending = ['bruto', 'rascunho', 'em_revisao', 'em_curadoria'].includes(s.status as string);
            const isOwner = s.owner?.toLowerCase().includes(area.name.toLowerCase()) || s.areaId === area.id;
            return isPending && isOwner;
          })
          .map((s) => ({ id: s.id, title: s.title, owner: s.owner, status: s.status, areaId: s.areaId, key: s.key, detail: `Tipo: ${s.type} | Risco: ${s.risk}` }));
        return { title: area.label, icon: '👤', items, count: items.length, emptyMessage: `Nenhuma pendência para ${area.name}` } as GovernanceSection;
      });

      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const expiredStandards = standards.filter((s) => new Date(s.updatedAt) < thirtyDaysAgo && !['obsoleto', 'arquivado', 'bloqueado'].includes(s.status as string))
        .map((s) => ({ id: s.id, title: s.title, owner: s.owner, status: s.status as string, areaId: s.areaId, key: s.key, detail: `Última atualização: ${s.updatedAt}` }));
      const noOwner = standards.filter((s) => !s.owner || s.owner === '')
        .map((s) => ({ id: s.id, title: s.title, owner: 'Sem dono', status: s.status, areaId: s.areaId, key: s.key, detail: '⚠️ Este padrão não possui responsável definido' }));
      const pendingDecisions = decisions.filter((d) => d.status === 'proposta')
        .map((d) => ({ id: d.id, title: d.title, owner: d.areaId || 'Não definido', status: d.status, areaId: d.areaId, detail: `Impactos: ${d.impacts.join(', ')}` }));
      const awaitingApproval = standards.filter((s) => s.status === 'em_curadoria' as CentralStandardStatus)
        .map((s) => ({ id: s.id, title: s.title, owner: s.owner, status: s.status, areaId: s.areaId, key: s.key, detail: 'Aguardando aprovação para homologação' }));

      setSummary({
        totalPending: pendingByArea.reduce((acc, a) => acc + a.count, 0),
        expired: expiredStandards.length,
        noOwner: noOwner.length,
        pendingDecisions: pendingDecisions.length,
        awaitingApproval: awaitingApproval.length,
        totalStandards: standards.length
      });

      setSections([
        ...pendingByArea,
        { title: 'Padrões sem Atualização (>30 dias)', icon: '⏰', items: expiredStandards, count: expiredStandards.length, emptyMessage: 'Nenhum padrão vencido encontrado' },
        { title: 'Padrões sem Dono', icon: '❓', items: noOwner, count: noOwner.length, emptyMessage: 'Todos os padrões têm dono definido' },
        { title: 'Decisões Pendentes', icon: '⚖️', items: pendingDecisions, count: pendingDecisions.length, emptyMessage: 'Nenhuma decisão pendente' },
        { title: 'Aguardando Aprovação', icon: '✓', items: awaitingApproval, count: awaitingApproval.length, emptyMessage: 'Nenhum item aguardando aprovação' },
      ]);
    } catch (err) { console.error('[governance-panel] Erro:', err); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="cp-governance-panel">
      <div className="cp-governance-header"><h2>📊 Painel de Governança</h2></div>
      <div className="cp-governance-loading">Carregando dados de governança...</div>
    </div>
  );

  return (
    <div className="cp-governance-panel">
      <div className="cp-governance-header">
        <div>
          <h2>📊 Painel de Governança</h2>
          <p className="cp-governance-subtitle">Visão consolidada de pendências, padrões vencidos, decisões e aprovações</p>
        </div>
        <button className="cp-governance-refresh" onClick={loadGovernanceData}>↻ Atualizar</button>
      </div>

      <div className="cp-governance-summary-grid">
        <div className="cp-governance-summary-card attention">
          <span className="cp-governance-summary-value">{summary.totalPending}</span>
          <span className="cp-governance-summary-label">Pendências</span>
        </div>
        <div className="cp-governance-summary-card high">
          <span className="cp-governance-summary-value">{summary.expired}</span>
          <span className="cp-governance-summary-label">Vencidos</span>
        </div>
        <div className="cp-governance-summary-card critical">
          <span className="cp-governance-summary-value">{summary.noOwner}</span>
          <span className="cp-governance-summary-label">Sem dono</span>
        </div>
        <div className="cp-governance-summary-card decision">
          <span className="cp-governance-summary-value">{summary.pendingDecisions}</span>
          <span className="cp-governance-summary-label">Decisões</span>
        </div>
        <div className="cp-governance-summary-card info">
          <span className="cp-governance-summary-value">{summary.awaitingApproval}</span>
          <span className="cp-governance-summary-label">Aprovações</span>
        </div>
        <div className="cp-governance-summary-card safe">
          <span className="cp-governance-summary-value">{summary.totalStandards}</span>
          <span className="cp-governance-summary-label">Total padrões</span>
        </div>
      </div>

      <div className="cp-governance-sections-grid">
        {sections.map((section, idx) => (
          <div key={idx} className="cp-governance-section">
            <h3 className="cp-governance-section-title">
              <span>{section.icon}</span>
              <span>{section.title}</span>
              <span className="cp-governance-count">{section.count}</span>
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
    </div>
  );
};

export default GovernancePanelPage;
