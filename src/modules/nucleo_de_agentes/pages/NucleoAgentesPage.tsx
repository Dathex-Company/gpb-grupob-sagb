import React, { useState, useEffect, useMemo } from 'react';
import { Agent, GovernanceCulture, ComplianceRule, VaultItem, KnowledgeNode } from '../../../types';
import { db } from '../../../../services/supabase';
import { collection, onSnapshot, query, orderBy } from '../../../../services/supabase';
import BaseDosAgentesView from '../components/BaseDosAgentesView';

const normalizeStatus = (status: any) => {
  if (!status) return 'active';
  const s = String(status).toLowerCase();
  if (s === 'deleted' || s === 'archived') return s;
  return 'active';
};

const NucleoAgentesPage: React.FC = () => {
  // Estados dos dados reais
  const [agents, setAgents] = useState<Agent[]>([]);
  const [cultureEntries, setCultureEntries] = useState<GovernanceCulture[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [knowledgeNodes, setKnowledgeNodes] = useState<KnowledgeNode[]>([]);

  // Filtros (simplificados, sem workspace por enquanto)
  const latestCultureEntry = useMemo(() => {
    const filtered = cultureEntries.filter(entry => normalizeStatus(entry.status) !== 'deleted');
    if (filtered.length === 0) return null;
    return [...filtered].sort((a, b) => {
      const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime();
      const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime();
      return bTime - aTime;
    })[0];
  }, [cultureEntries]);

  const activeComplianceRule = useMemo(() => {
    const nonDeleted = complianceRules.filter(rule => normalizeStatus(rule.status) !== 'deleted');
    if (nonDeleted.length === 0) return null;
    const GLOBAL_COMPLIANCE_CODE = 'GOVERNANCE.GLOBAL.DEFAULT';
    const preferredByCode = nonDeleted.filter(rule => rule.code === GLOBAL_COMPLIANCE_CODE);
    const sourceRules = preferredByCode.length > 0 ? preferredByCode : nonDeleted;
    return [...sourceRules].sort((a, b) => {
      const aTime = a.updatedAt instanceof Date ? a.updatedAt.getTime() : new Date(a.updatedAt).getTime();
      const bTime = b.updatedAt instanceof Date ? b.updatedAt.getTime() : new Date(b.updatedAt).getTime();
      return bTime - aTime;
    })[0];
  }, [complianceRules]);

  const activeVaultEntries = useMemo(
    () => vaultItems.filter(item => {
      const status = normalizeStatus(item.status);
      return status !== 'deleted' && status !== 'archived';
    }),
    [vaultItems]
  );

  const visibleKnowledgeNodes = useMemo(
    () => knowledgeNodes.filter(node => {
      const status = normalizeStatus(node.status);
      return status !== 'archived' && status !== 'deleted';
    }),
    [knowledgeNodes]
  );

  // Subscrições aos dados em tempo real
  useEffect(() => {
    const unsubscribeAgents = onSnapshot(collection(db, 'agents'), (snapshot) => {
      const remoteAgents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Agent[];
      setAgents(remoteAgents);
    }, (error) => console.error('Erro ao carregar agentes:', error));

    const unsubscribeCulture = onSnapshot(
      query(collection(db, 'governance_global_culture'), orderBy('updated_at', 'desc')),
      (snapshot) => {
        const entries = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as GovernanceCulture[];
        setCultureEntries(entries);
      },
      (error) => console.error('Erro ao carregar cultura:', error)
    );

    const unsubscribeCompliance = onSnapshot(
      query(collection(db, 'governance_compliance_rules'), orderBy('updated_at', 'desc')),
      (snapshot) => {
        const rules = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as ComplianceRule[];
        setComplianceRules(rules);
      },
      (error) => console.error('Erro ao carregar compliance:', error)
    );

    const unsubscribeVault = onSnapshot(
      query(collection(db, 'vault_items'), orderBy('updated_at', 'desc')),
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as VaultItem[];
        setVaultItems(items);
      },
      (error) => console.error('Erro ao carregar vault:', error)
    );

    const unsubscribeKnowledge = onSnapshot(
      query(collection(db, 'knowledge_nodes'), orderBy('updated_at', 'desc')),
      (snapshot) => {
        const nodes = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as KnowledgeNode[];
        setKnowledgeNodes(nodes);
      },
      (error) => console.error('Erro ao carregar knowledge:', error)
    );

    return () => {
      unsubscribeAgents();
      unsubscribeCulture();
      unsubscribeCompliance();
      unsubscribeVault();
      unsubscribeKnowledge();
    };
  }, []);

  // Callbacks (placeholders – futuramente integração com serviços)
  const handleUpdateAgent = async (agent: Agent) => {
    console.log('Atualizar agente (placeholder)', agent);
    // TODO: integrar com services/supabase updateDoc
  };

  const handleAddUnit = () => {
    console.log('Adicionar unidade (placeholder)');
  };

  const handleSaveCulture = async (payload: { contentMd: string; title?: string; summary?: string }) => {
    console.log('Salvar cultura (placeholder)', payload);
  };

  const handleSaveCompliance = async (markdown: string) => {
    console.log('Salvar compliance (placeholder)', markdown);
  };

  const handleCreateVaultItem = async (input: any) => {
    console.log('Criar vault item (placeholder)', input);
  };

  const handleDeleteVaultItem = async (id: string) => {
    console.log('Deletar vault item (placeholder)', id);
  };

  const handleCreateKnowledgeNode = async (input: any) => {
    console.log('Criar knowledge node (placeholder)', input);
  };

  const handleUpdateKnowledgeNode = async (id: string, updates: Partial<KnowledgeNode>) => {
    console.log('Atualizar knowledge node (placeholder)', id, updates);
  };

  const handleDeleteKnowledgeNode = async (id: string) => {
    console.log('Deletar knowledge node (placeholder)', id);
  };

  return (
    <BaseDosAgentesView
      onBack={() => window.history.back()}
      agents={agents}
      onUpdateAgent={handleUpdateAgent}
      businessUnits={[]}
      onAddUnit={handleAddUnit}
      cultureEntry={latestCultureEntry}
      complianceMarkdown={activeComplianceRule?.ruleMd || ''}
      onSaveCulture={handleSaveCulture}
      onSaveCompliance={handleSaveCompliance}
      vaultItems={activeVaultEntries}
      onCreateVaultItem={handleCreateVaultItem}
      onDeleteVaultItem={handleDeleteVaultItem}
      knowledgeNodes={visibleKnowledgeNodes}
      onCreateKnowledgeNode={handleCreateKnowledgeNode}
      onUpdateKnowledgeNode={handleUpdateKnowledgeNode}
      onDeleteKnowledgeNode={handleDeleteKnowledgeNode}
    />
  );
};

export default NucleoAgentesPage;