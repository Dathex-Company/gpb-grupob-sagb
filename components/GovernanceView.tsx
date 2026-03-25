
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Agent, BusinessUnit, GovernanceCulture, ComplianceRule, VaultItem, KnowledgeNode } from '../types';
import { BackIcon, BookIcon, CloudUploadIcon, CloudDownloadIcon, LockIcon, ScaleIcon, SearchIcon, FolderIcon, PlusIcon, FileTextIcon, TrashIcon, CheckIcon, XIcon, ShieldCheckIcon, CubeIcon } from './Icon';

import MethodologyView from './MethodologyView';
import { Avatar } from './Avatar'; // IMPORTAÇÃO DO AVATAR
import { PremiumSurface, PremiumHeader, PremiumCard, PremiumBadge, PremiumButton, PremiumInput, PremiumSelect, BadgeStatus } from './ui/Premium';
import { OfficialProtocol, OfficialPattern } from '../types';
import { fetchOfficialProtocols, createOfficialProtocol, updateOfficialProtocol, deleteOfficialProtocol, fetchOfficialPatterns, createOfficialPattern, updateOfficialPattern, deleteOfficialPattern } from '../services/officialBase';

type VaultItemInput = {
  name: string;
  provider: string;
  env: string;
  itemType: string;
  ownerEmail?: string;
  storagePath?: string;
  secretRef?: string;
  rotatePolicy?: string;
  payload?: Record<string, any>;
};

type KnowledgeNodeInput = {
  title: string;
  nodeType: KnowledgeNode['nodeType'];
  parentId?: string | null;
  contentMd?: string;
  linkUrl?: string;
};

interface GovernanceViewProps {
  onBack: () => void;
  agents: Agent[];
  onUpdateAgent: (agent: Agent) => Promise<void> | void;
  businessUnits: BusinessUnit[];
  onAddUnit: (unit: BusinessUnit) => void;
  targetAgentId?: string | null;
  onClearTarget?: () => void;
  cultureEntry: GovernanceCulture | null;
  complianceMarkdown: string;
  onSaveCulture: (payload: { contentMd: string; title?: string; summary?: string }) => Promise<void> | void;
  onSaveCompliance: (markdown: string) => Promise<void> | void;
  vaultItems: VaultItem[];
  onCreateVaultItem: (input: VaultItemInput) => Promise<void> | void;
  onDeleteVaultItem: (id: string) => Promise<void> | void;
  knowledgeNodes: KnowledgeNode[];
  onCreateKnowledgeNode: (input: KnowledgeNodeInput) => Promise<string | void> | void;
  onUpdateKnowledgeNode: (id: string, updates: Partial<KnowledgeNode>) => Promise<void> | void;
  onDeleteKnowledgeNode: (id: string) => Promise<void> | void;
}




type GovernanceViewMode = 'dashboard' | 'constitution' | 'backup' | 'black-vault' | 'compliance' | 'intelligence' | 'context' | 'methodology' | 'padroes' | 'protocolos';

// Interface para Documento Global
interface VaultDocument {
    id: string;
    title: string;
    content: string; // Text content OR Base64 Data URL
    uploadedAt: string;
    type?: 'FILE' | 'METHODOLOGY'; 
    mimeType?: string; // Para distinguir renderização
    payload?: Record<string, any>;
    source?: 'vault' | 'methodology';
}

const DEFAULT_METHODLOGY_ROOT_TITLE = 'Metodologias Gerais';
const DEFAULT_METHODOLOGY_BLUEPRINT = [
  {
    folderTitle: 'Jornada U.A.U',
    docTitle: 'Metodologia: Jornada U.A.U (Completa)',
    content: '# Jornada U.A.U (Completa)\n\nMapeie aqui os rituais, etapas e checkpoints da jornada U.A.U.'
  },
  {
    folderTitle: 'M.A.V',
    docTitle: 'Metodologia: M.A.V (Máquina de Vendas)',
    content: '# M.A.V (Máquina de Vendas)\n\nDefina funil, ritos comerciais, critérios de passagem e playbooks.'
  },
  {
    folderTitle: 'GERAC',
    docTitle: 'Framework: GERAC (Gestão)',
    content: '# Framework GERAC (Gestão)\n\nDocumente princípios, rotinas, indicadores e governança de execução.'
  },
  {
    folderTitle: 'Decisão & Resultado',
    docTitle: 'Método: Decisão & Resultado',
    content: '# Método Decisão & Resultado\n\nDescreva critérios decisórios, impacto esperado e medição de resultado.'
  },
  {
    folderTitle: 'Clientologia',
    docTitle: 'Árvore Clientológica (Estrutura)',
    content: '# Árvore Clientológica (Estrutura)\n\nEstruture ICP, segmentações, personas e árvore de valor do cliente.'
  }
] as const;


const GovernanceView: React.FC<GovernanceViewProps> = ({ 
  onBack, 
  agents, 
  onUpdateAgent, 
  businessUnits, 
  onAddUnit,
    targetAgentId,
  onClearTarget,
  cultureEntry,
  complianceMarkdown,
  onSaveCulture,
  onSaveCompliance,
  vaultItems,
  onCreateVaultItem,
  onDeleteVaultItem,
  knowledgeNodes,
  onCreateKnowledgeNode,
  onUpdateKnowledgeNode,
  onDeleteKnowledgeNode
}) => {


  // Gate de senha temporariamente desativado para liberar o acesso ao modulo.
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [currentView, setCurrentView] = useState<GovernanceViewMode>('dashboard');

  // Editor States
    const [cultureDraft, setCultureDraft] = useState('');
  const [complianceDraft, setComplianceDraft] = useState(''); 
  const [padroesDraft, setPadroesDraft] = useState('stack oficial\nfront-end oficial\nback-end oficial\ndeploy oficial\nfontes\npaletas\ncomponentes\ndesign system\nnaming\nestrutura de módulos\nplataformas homologadas');
  const [protocolos, setProtocolos] = useState<OfficialProtocol[]>([]);
  const [padroes, setPadroes] = useState<OfficialPattern[]>([]);
  const [isSavingCulture, setIsSavingCulture] = useState(false);
  const [isSavingCompliance, setIsSavingCompliance] = useState(false);
  const [isLoadingOfficial, setIsLoadingOfficial] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  const activeWorkspaceId = cultureEntry?.workspaceId || '00000000-0000-0000-0000-000000000000'; // Default fallback

  useEffect(() => {
      if (isUnlocked && (currentView === 'dashboard' || currentView === 'protocolos' || currentView === 'padroes')) {
          const loadOfficialData = async () => {
              setIsLoadingOfficial(true);
              try {
                const [prots, pads] = await Promise.all([
                    fetchOfficialProtocols(activeWorkspaceId),
                    fetchOfficialPatterns(activeWorkspaceId)
                ]);
                setProtocolos(prots);
                setPadroes(pads);
              } finally {
                setIsLoadingOfficial(false);
              }
          };
          loadOfficialData();
      }
  }, [isUnlocked, currentView, activeWorkspaceId]);

  const handleSeedInitialData = async () => {
      setIsSeeding(true);
      await createOfficialProtocol({
          workspaceId: activeWorkspaceId,
          code: 'GERAC-G01',
          name: 'DAI (Decisão Artificial Inteligente)',
          family: 'GERAC-G',
          category: 'Autonomia',
          shortDescription: 'Regula a autonomia de decisão e os limites de ação dos agentes nas interações diretas com processos core.',
          fullDescription: 'Define até onde um agente pode atuar sem supervisão humana.',
          objective: 'Garantir controle e segurança',
          criticality: 'Alta',
          mandatory: true,
          priority: 1,
          status: 'Oficial',
          responsibleArea: 'Governança AI',
          impactedModules: ['Missions', 'Studio'],
          lastReviewDate: new Date(),
          isActive: true
      });
      await createOfficialProtocol({
          workspaceId: activeWorkspaceId,
          code: 'GERAC-G02',
          name: 'Rastreabilidade de Decisão',
          family: 'GERAC-G',
          category: 'Auditoria',
          shortDescription: 'Garante que toda ação do sistema seja traçável até a origem da inteligência ou usuário.',
          fullDescription: 'Mantém o log unificado e imutável de quem fez o que.',
          objective: 'Auditoria transparente',
          criticality: 'Crítica',
          mandatory: true,
          priority: 2,
          status: 'Homologado',
          responsibleArea: 'Governança AI',
          impactedModules: ['Core', 'Memory'],
          lastReviewDate: new Date(),
          isActive: true
      });
      await createOfficialPattern({
          workspaceId: activeWorkspaceId,
          patternType: 'Stack',
          name: 'Vite + React',
          category: 'Frontend',
          description: 'Framework base para todas as interfaces web do SagB',
          valueOrDefinition: 'React 18 + Vite 6',
          status: 'Oficial',
          responsibleArea: 'Arquitetura',
          lastReviewDate: new Date(),
          isActive: true
      });
      await createOfficialPattern({
          workspaceId: activeWorkspaceId,
          patternType: 'Paleta',
          name: 'Dark Premium',
          category: 'UI/UX',
          description: 'Paleta base oficial para a interface de cockpit executivo.',
          valueOrDefinition: 'bg-[#0B0F19]',
          status: 'Oficial',
          responsibleArea: 'Design',
          lastReviewDate: new Date(),
          isActive: true
      });
      
      const [prots, pads] = await Promise.all([
          fetchOfficialProtocols(activeWorkspaceId),
          fetchOfficialPatterns(activeWorkspaceId)
      ]);
      setProtocolos(prots);
      setPadroes(pads);
      setIsSeeding(false);
      alert('Dados iniciais inseridos com sucesso!');
  };

  // Vault State
  const [vaultSearchTerm, setVaultSearchTerm] = useState(''); 
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null); // Visualizador
  const [isUploadingVault, setIsUploadingVault] = useState(false);
  const [isBootstrappingMethodology, setIsBootstrappingMethodology] = useState(false);
  const methodologyBootstrapAttemptedRef = useRef(false);

  const vaultDocuments = useMemo<VaultDocument[]>(() => {
    return vaultItems.map(item => {
      const payload = (item.payload || {}) as Record<string, any>;
      const uploadedAt = item.updatedAt instanceof Date ? item.updatedAt.toISOString() : '';
      const previewContent = typeof payload.previewData === 'string' ? payload.previewData : '';
      return {
        id: item.id,
        title: item.name,
        content: previewContent || 'Conteúdo protegido. Consulte o Cofre Black.',
        uploadedAt,
        type: 'FILE',
        mimeType: payload.mimeType || item.itemType,
        payload,
        source: 'vault'
      } as VaultDocument;
    });
  }, [vaultItems]);

  const methodologyDocuments = useMemo<VaultDocument[]>(() => {
    return knowledgeNodes.map((node) => {
      const updatedAt = node.updatedAt instanceof Date ? node.updatedAt.toISOString() : '';
      const previewContent = node.contentMd || '';
      const safeContent = previewContent
        || (node.nodeType === 'folder'
          ? `Pasta de metodologia: ${node.title}`
          : `Documento metodológico: ${node.title}`);

      return {
        id: node.id,
        title: node.title,
        content: safeContent,
        uploadedAt: updatedAt,
        type: 'METHODOLOGY',
        mimeType: 'text/markdown',
        payload: {
          ...(node.payload || {}),
          nodeType: node.nodeType,
          parentId: node.parentId ?? null,
          previewData: previewContent
        },
        source: 'methodology'
      } as VaultDocument;
    });
  }, [knowledgeNodes]);

  const availableKnowledgeDocs = useMemo(() => {
    return [...vaultDocuments, ...methodologyDocuments];
  }, [vaultDocuments, methodologyDocuments]);

  // Intelligence Editor State

  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [activeAgentTab, setActiveAgentTab] = useState<'dna' | 'knowledge'>('dna');
  const [tempPrompt, setTempPrompt] = useState('');
  
  // Search State for Knowledge Selection
  const [knowledgeSearchTerm, setKnowledgeSearchTerm] = useState('');
  
  // Ref para Upload em Massa
  const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
    if (!isUnlocked) return;
    setCultureDraft(cultureEntry?.contentMd || '');
  }, [isUnlocked, cultureEntry]);

  useEffect(() => {
    if (!isUnlocked) return;
    setComplianceDraft(complianceMarkdown || "");
  }, [isUnlocked, complianceMarkdown]);

  useEffect(() => {
    if (!isUnlocked || isBootstrappingMethodology || methodologyBootstrapAttemptedRef.current) return;

    const existingTitles = new Set(
      knowledgeNodes.map((node) => node.title.trim().toLowerCase())
    );
    const missingBlueprintDocs = DEFAULT_METHODOLOGY_BLUEPRINT.filter(
      (item) => !existingTitles.has(item.docTitle.trim().toLowerCase())
    );
    if (missingBlueprintDocs.length === 0) return;

    let cancelled = false;

    const runBootstrap = async () => {
      methodologyBootstrapAttemptedRef.current = true;
      setIsBootstrappingMethodology(true);
      try {
        let rootId: string | null =
          knowledgeNodes.find((node) => node.title === DEFAULT_METHODLOGY_ROOT_TITLE && node.nodeType === 'folder')?.id || null;

        if (!rootId) {
          const createdRoot = await Promise.resolve(onCreateKnowledgeNode({
            title: DEFAULT_METHODLOGY_ROOT_TITLE,
            nodeType: 'folder',
            parentId: null
          }));
          if (typeof createdRoot === 'string') rootId = createdRoot;
        }

        for (const item of DEFAULT_METHODOLOGY_BLUEPRINT) {
          if (cancelled) return;

          let folderId: string | null =
            knowledgeNodes.find((node) =>
              node.nodeType === 'folder'
              && node.title === item.folderTitle
              && (node.parentId ?? null) === (rootId ?? null)
            )?.id || null;

          if (!folderId) {
            const createdFolder = await Promise.resolve(onCreateKnowledgeNode({
              title: item.folderTitle,
              nodeType: 'folder',
              parentId: rootId
            }));
            if (typeof createdFolder === 'string') folderId = createdFolder;
          }

          const docExists = existingTitles.has(item.docTitle.trim().toLowerCase());
          if (docExists) continue;

          await Promise.resolve(onCreateKnowledgeNode({
            title: item.docTitle,
            nodeType: 'doc',
            parentId: folderId ?? rootId,
            contentMd: item.content
          }));
        }
      } catch (error) {
        console.error('Erro ao inicializar metodologias padrão:', error);
      } finally {
        if (!cancelled) setIsBootstrappingMethodology(false);
      }
    };

    void runBootstrap();
    return () => { cancelled = true; };
  }, [isUnlocked, knowledgeNodes, onCreateKnowledgeNode, isBootstrappingMethodology]);


  // AUTO-NAVIGATE TO AGENT EDITOR ON UNLOCK (Deep Link Logic)
  useEffect(() => {
      if (isUnlocked && targetAgentId) {
          const target = agents.find(a => a.id === targetAgentId);
          if (target) {
              setEditingAgent(target);
              setTempPrompt(target.fullPrompt || '');
              setActiveAgentTab('dna');
              setKnowledgeSearchTerm('');
              setCurrentView('intelligence');
              
              // Limpa o target para não reabrir se sair e voltar
              if (onClearTarget) onClearTarget();
          }
      }
  }, [isUnlocked, targetAgentId, agents, onClearTarget]);

  

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8933') {
        setIsUnlocked(true);
        setErrorMsg('');
    } else {
        setErrorMsg('ACESSO NEGADO');
    }
  };

    const handleSaveConstitution = async () => {
      setIsSavingCulture(true);
      try {
          await onSaveCulture({ contentMd: cultureDraft });
          alert('Cultura Global atualizada.');
      } catch (error) {
          console.error('Erro ao salvar cultura global:', error);
          alert('Falha ao salvar Cultura Global.');
      } finally {
          setIsSavingCulture(false);
      }
  };

  const handleSaveCompliance = async () => {
      setIsSavingCompliance(true);
      try {
          await onSaveCompliance(complianceDraft);
          alert('Diretrizes & Compliance atualizadas.');
      } catch (error) {
          console.error('Erro ao salvar compliance:', error);
          alert('Falha ao salvar Diretrizes & Compliance.');
      } finally {
          setIsSavingCompliance(false);
      }
  };


  const handleSaveAgent = async () => {
      if (!editingAgent) return;
      try {
          const updatedAgent = { ...editingAgent, fullPrompt: tempPrompt };
          await Promise.resolve(onUpdateAgent(updatedAgent));
          alert(`DNA de ${editingAgent.name} atualizado.`);
          setEditingAgent(null);
      } catch (error: any) {
          console.error('Erro ao salvar DNA do agente:', error);
          const message = String(error?.message || 'Falha ao salvar DNA no banco de dados.');
          alert(message);
      }
  };

  // --- VAULT OPERATIONS ---
    const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const readFile = (file: File): Promise<{ content: string; mimeType: string; isText: boolean }> => {
          return new Promise((resolve, reject) => {
              const isText = file.type.startsWith('text/') ||
                file.name.endsWith('.md') ||
                file.name.endsWith('.json') ||
                file.name.endsWith('.csv') ||
                file.name.endsWith('.js') ||
                file.name.endsWith('.ts') ||
                file.type === 'application/pdf';

              const reader = new FileReader();

              reader.onload = (e) => {
                  resolve({
                      content: e.target?.result as string,
                      mimeType: file.type || (isText ? 'text/plain' : 'application/octet-stream'),
                      isText
                  });
              };

              reader.onerror = (e) => reject(e);

              if (isText) {
                  reader.readAsText(file);
              } else {
                  reader.readAsDataURL(file);
              }
          });
      };

      setIsUploadingVault(true);
      let processedCount = 0;

      try {
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              try {
                  const { content, mimeType, isText } = await readFile(file);
                  const payload: Record<string, any> = { mimeType };
                  // Apenas anexamos preview inline para arquivos de texto menores
                  if (isText && content.length <= 500_000) {
                      payload.previewData = content;
                  }

                  await onCreateVaultItem({
                      name: file.name,
                      provider: mimeType ? mimeType.split('/')[0] : 'documento',
                      env: 'internal',
                      itemType: mimeType || 'document',
                      payload
                  });
                  processedCount++;
              } catch (err) {
                  console.error(`Erro ao processar arquivo ${file.name}`, err);
              }
          }

          if (processedCount > 0) {
              alert(`${processedCount} arquivo(s) enviados para o Cofre Black.`);
          }
      } catch (error) {
          console.error("Erro no upload do cofre:", error);
          alert("Erro crítico no processamento do Cofre Black.");
      } finally {
          setIsUploadingVault(false);
          event.target.value = '';
      }
  };


    const handleDeleteFromVault = async (docId: string) => {
      if (!window.confirm("ATENÇÃO: Isso removerá este documento do Cofre e de TODOS os agentes que o utilizam. Confirmar?")) return;
      try {
          await onDeleteVaultItem(docId);
          if (previewDoc?.id === docId) setPreviewDoc(null);
      } catch (error) {
          console.error('Erro ao remover item do Cofre Black:', error);
          alert('Falha ao remover item do Cofre Black.');
      }
  };


  // --- AGENT PERMISSIONS ---
  const toggleAgentDocument = (doc: VaultDocument) => {
      if (!editingAgent) return;

      const currentDocs = editingAgent.globalDocuments || [];
      const targetId = String(doc.id || doc.title).trim();
      const exists = currentDocs.some(d =>
        String(d.id || d.title).trim() === targetId || d.title === doc.title
      );

      let updatedDocs;
      if (exists) {
          updatedDocs = currentDocs.filter(d =>
            !(String(d.id || d.title).trim() === targetId || d.title === doc.title)
          );
      } else {
          const tags = Array.from(new Set([
            ...doc.title.toLowerCase().split(' ').filter(Boolean),
            ...(doc.type === 'METHODOLOGY' ? ['core', 'metodologia'] : [])
          ]));
          updatedDocs = [...currentDocs, { 
              id: doc.id, 
              title: doc.title, 
              content: doc.content, 
              tags
          }];
      }

      const updatedAgent = { ...editingAgent, globalDocuments: updatedDocs, docCount: updatedDocs.length };
      onUpdateAgent(updatedAgent);
      setEditingAgent(updatedAgent);
  };

  // --- BACKUP SYSTEM ---
  const handleExportData = () => {
      const backupData: Record<string, any> = {
          timestamp: new Date().toISOString(),
          version: '2.0.0',
          source: 'supabase',
          data: {
              agents,
              businessUnits,
              governance: {
                cultureEntry: cultureEntry || null,
                complianceMarkdown: complianceMarkdown || '',
                vaultItems,
                knowledgeNodes
              }
          }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grupob_full_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const openAgentEditor = (agent: Agent) => {
      setEditingAgent(agent);
      setTempPrompt(agent.fullPrompt || '');
      setActiveAgentTab('dna');
      setKnowledgeSearchTerm(''); 
  };

  // --- RENDERERS ---

  const renderFilePreview = () => {
      if (!previewDoc) return null;

            const payload = previewDoc.payload || {};
      const mime = previewDoc.mimeType || payload.mimeType || '';
      const previewContent = typeof payload.previewData === 'string' ? payload.previewData : previewDoc.content;
      
      const renderContent = () => {
          if (!previewContent) {
              return (
                  <div className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center gap-3 max-w-xl">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                          <FileTextIcon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-gray-700">Nenhum preview disponível</h3>
                      <p className="text-xs text-gray-500 text-center">O documento está registrado no Cofre, mas não possui visualização inline. Consulte o armazenamento seguro para acessar o conteúdo completo.</p>
                  </div>
              );
          }

          if (mime.startsWith('image/')) {
              return <img src={previewContent} alt={previewDoc.title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" />;
          }
          if (mime.startsWith('video/')) {
              return <video controls src={previewContent} className="max-w-full max-h-[80vh] rounded-lg shadow-lg" />;
          }
          if (mime.startsWith('audio/')) {
              return (
                  <div className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                      </div>
                      <h3 className="font-bold text-gray-800">{previewDoc.title}</h3>
                      <audio controls src={previewContent} className="w-80" />
                  </div>
              );
          }
          if (mime === 'application/pdf') {
              return (
                  <iframe src={previewContent} className="w-full h-[80vh] rounded-lg border border-gray-200" title={previewDoc.title}></iframe>
              );
          }
          // Default: Text View
          return (
              <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
                  <h3 className="text-lg font-black text-bitrix-nav uppercase tracking-tight mb-4 border-b pb-4">{previewDoc.title}</h3>
                  <pre className="flex-1 overflow-auto custom-scrollbar text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {previewContent}
                  </pre>
              </div>
          );
      };


      return (
          <div className="fixed inset-0 z-[100] bg-bitrix-nav/90 backdrop-blur-sm flex items-center justify-center p-6 animate-msg" onClick={() => setPreviewDoc(null)}>
              <div className="relative w-full max-w-6xl flex flex-col items-center" onClick={e => e.stopPropagation()}>
                  <button 
                      onClick={() => setPreviewDoc(null)}
                      className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
                  >
                      <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-widest">Fechar</span>
                          <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center"><XIcon className="w-4 h-4" /></div>
                      </div>
                  </button>
                  {renderContent()}
              </div>
          </div>
      );
  };

  const renderLockScreen = () => (
    <div className="flex-1 flex flex-col items-center justify-center animate-msg p-6">
      <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-bitrix-nav"></div>
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-300">
             <LockIcon className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-bitrix-nav uppercase tracking-tight mb-2">Credencial Master</h3>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-8">Acesso Restrito à Diretoria</p>
          
          <form onSubmit={handleUnlock}>
            <input 
                type="password" 
                autoFocus 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="" 
                autoComplete="new-password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-xl font-black tracking-[0.5em] outline-none focus:border-bitrix-nav transition-all mb-4 text-gray-800" 
            />
            {errorMsg && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4 animate-pulse">{errorMsg}</p>}
            <button type="submit" className="w-full py-4 bg-bitrix-nav text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-bitrix-accent transition-all shadow-lg hover:shadow-xl">
                Acessar Painel
            </button>
          </form>
          
          <button onClick={onBack} className="mt-6 text-[9px] font-bold text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors">
              Voltar ao Ecossistema
          </button>
      </div>
    </div>
  );

  
const DashboardCard = ({ title, desc, icon, count, updated, owner, status, onClick }: any) => {
    return (
        <PremiumCard onClick={onClick}>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                    {icon}
                </div>
                <PremiumBadge status={status} />
            </div>
            
            <div className="relative z-10 flex-1">
                <h3 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400">{desc}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center relative z-10">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Itens</span>
                        <span className="text-xs font-mono text-slate-300">{count}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Resp.</span>
                        <span className="text-[10px] font-medium text-slate-300">{owner}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Atualizado</span>
                    <span className="text-[10px] text-slate-400 font-medium">{updated}</span>
                </div>
            </div>
        </PremiumCard>
    );
};

  const renderDashboard = () => (
      <div className="p-10 max-w-7xl mx-auto animate-msg w-full relative z-10">
          <PremiumHeader title="BASE OFICIAL" subtitle="Verdade Estrutural do SagB" />

          <div className="mb-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
             <div className="flex-1 max-w-md">
                 <PremiumInput placeholder="Buscar na Base Oficial..." icon={<SearchIcon className="w-5 h-5" />} />
             </div>
             <div className="flex items-center gap-3 ml-4">
                 <PremiumSelect>
                     <option value="">Status</option>
                     <option value="oficial">Oficial</option>
                     <option value="homologado">Homologado</option>
                     <option value="recomendado">Recomendado</option>
                     <option value="experimental">Experimental</option>
                     <option value="legado">Legado</option>
                     <option value="proibido">Proibido</option>
                 </PremiumSelect>
                 <PremiumSelect>
                     <option value="">Área</option>
                     <option value="front">Front-end</option>
                     <option value="back">Back-end</option>
                 </PremiumSelect>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard 
                  title="Central de Padrões"
                  desc="Stack, fontes, componentes e design system."
                  icon={<CubeIcon className="w-6 h-6" />}
                  count={padroes.length}
                  updated={padroes.length > 0 ? new Date(Math.max(...padroes.map(p => p.updatedAt.getTime()))).toLocaleDateString() : '—'}
                  owner="Arquitetura"
                  status={padroes.some(p => p.status === 'Experimental') ? 'Experimental' : 'Oficial'}
                  onClick={() => setCurrentView('padroes')}
              />
              <DashboardCard 
                  title="Protocolos Oficiais"
                  desc="Regras operacionais e decisórias do sistema."
                  icon={<ShieldCheckIcon className="w-6 h-6" />}
                  count={protocolos.length}
                  updated={protocolos.length > 0 ? new Date(Math.max(...protocolos.map(p => p.updatedAt.getTime()))).toLocaleDateString() : '—'}
                  owner="Governança"
                  status={protocolos.some(p => p.status === 'Experimental') ? 'Experimental' : 'Oficial'}
                  onClick={() => setCurrentView('protocolos')}
              />
              <DashboardCard 
                  title="Governança"
                  desc="Cultura atual, identidade e tom de voz."
                  icon={<BookIcon className="w-6 h-6" />}
                  count={1}
                  updated="2 dias atrás"
                  owner="Diretoria"
                  status="Oficial"
                  onClick={() => setCurrentView('constitution')}
              />
              <DashboardCard 
                  title="Núcleo de Inteligência"
                  desc="Gestão de DNA e permissões de agentes."
                  icon={<SearchIcon className="w-6 h-6" />}
                  count={agents.length}
                  updated="Hoje"
                  owner="AI Ops"
                  status="Homologado"
                  onClick={() => setCurrentView('intelligence')}
              />
              <DashboardCard 
                  title="Metodologias Gerais"
                  desc="Árvore de processos e frameworks corporativos."
                  icon={<FolderIcon className="w-6 h-6" />}
                  count={knowledgeNodes.length}
                  updated="1 semana atrás"
                  owner="Operações"
                  status="Recomendado"
                  onClick={() => setCurrentView('methodology')}
              />
              <DashboardCard 
                  title="Diretrizes & Compliance"
                  desc="Segurança, LGPD e regras de bloqueio."
                  icon={<ScaleIcon className="w-6 h-6" />}
                  count={1}
                  updated="Mês passado"
                  owner="Jurídico"
                  status="Oficial"
                  onClick={() => setCurrentView('compliance')}
              />
              <DashboardCard 
                  title="Cofre Black"
                  desc="Repositório seguro de arquivos críticos."
                  icon={<LockIcon className="w-6 h-6" />}
                  count={vaultItems.length}
                  updated="Ontem"
                  owner="Segurança"
                  status="Homologado"
                  onClick={() => setCurrentView('black-vault')}
              />
              <DashboardCard 
                  title="Backup do Sistema"
                  desc="Rotinas de salvamento e restore estrutural."
                  icon={<CloudDownloadIcon className="w-6 h-6" />}
                  count={0}
                  updated="Semanal"
                  owner="Infra"
                  status="Oficial"
                  onClick={handleExportData}
              />
          </div>
      </div>
  );


  const renderProtocolos = () => (
      <PremiumSurface className="flex flex-col p-8">
          <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
              <PremiumHeader 
                  title="Protocolos Oficiais" 
                  subtitle="Regras, comportamentos, obrigatoriedades e auditoria"
                  rightAction={
                      <div className="flex gap-3">
                          <PremiumButton variant="secondary" onClick={() => setCurrentView('dashboard')} icon={<BackIcon className="w-4 h-4" />}>
                              Voltar
                          </PremiumButton>
                          {protocolos.length === 0 && (
                            <PremiumButton variant="ghost" onClick={handleSeedInitialData} disabled={isSeeding}>
                                Gerar Dados de Exemplo
                            </PremiumButton>
                          )}
                          <PremiumButton icon={<PlusIcon className="w-4 h-4" />}>
                              Novo Protocolo
                          </PremiumButton>
                      </div>
                  }
              />
              
              <div className="mb-6 flex gap-4">
                  <div className="flex-1">
                      <PremiumInput placeholder="Buscar protocolo por código, nome ou família..." icon={<SearchIcon className="w-4 h-4" />} />
                  </div>
                  <PremiumSelect className="w-40">
                      <option value="">Todas as Famílias</option>
                      <option value="GERAC-I">GERAC-I</option>
                      <option value="GERAC-D">GERAC-D</option>
                      <option value="GERAC-G">GERAC-G</option>
                      <option value="GERAC-S">GERAC-S</option>
                      <option value="GERAC-O">GERAC-O</option>
                  </PremiumSelect>
                  <PremiumSelect className="w-40">
                      <option value="">Criticidade</option>
                      <option value="Baixa">Baixa</option>
                      <option value="Média">Média</option>
                      <option value="Alta">Alta</option>
                      <option value="Crítica">Crítica</option>
                  </PremiumSelect>
              </div>

              {isLoadingOfficial ? (
                  <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Carregando protocolos...</div>
              ) : protocolos.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-500">
                      <ShieldCheckIcon className="w-12 h-12 opacity-20" />
                      <p className="text-sm">Nenhum protocolo oficial cadastrado.</p>
                  </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                    {protocolos.map(prot => (
                        <PremiumCard key={prot.id} hoverGlow={false} className="min-h-[250px]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-center text-blue-400">
                                        <ShieldCheckIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-tight">{prot.name}</h3>
                                        <span className="text-[10px] font-mono text-slate-500">{prot.code} • {prot.family}</span>
                                    </div>
                                </div>
                                <PremiumBadge status={prot.status} />
                            </div>
                            
                            <p className="text-xs text-slate-400 mb-6 leading-relaxed flex-1">{prot.shortDescription}</p>
                            
                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 mb-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <ScaleIcon className="w-3 h-3" /> Configuração
                                </h4>
                                <ul className="space-y-2">
                                    <li className="flex justify-between items-center text-xs text-slate-300">
                                        <span className="text-slate-500">Criticidade:</span>
                                        <span className={`font-bold ${prot.criticality === 'Crítica' ? 'text-red-400' : prot.criticality === 'Alta' ? 'text-orange-400' : 'text-slate-300'}`}>{prot.criticality}</span>
                                    </li>
                                    <li className="flex justify-between items-center text-xs text-slate-300">
                                        <span className="text-slate-500">Obrigatório:</span>
                                        <span>{prot.mandatory ? 'Sim' : 'Não'}</span>
                                    </li>
                                    <li className="flex justify-between items-center text-xs text-slate-300">
                                        <span className="text-slate-500">Módulos Impactados:</span>
                                        <span>{prot.impactedModules?.join(', ') || 'Nenhum'}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    Resp: <span className="text-slate-300">{prot.responsibleArea}</span>
                                </div>
                                <PremiumButton variant="ghost" className="!py-1.5 !px-3 text-[10px]">
                                    Detalhes
                                </PremiumButton>
                            </div>
                        </PremiumCard>
                    ))}
                </div>
              )}
          </div>
      </PremiumSurface>
  );

  const renderPadroes = () => (
    <PremiumSurface className="flex flex-col p-8">
        <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
            <PremiumHeader 
                title="Central de Padrões" 
                subtitle="Stack oficial, design tokens, plataformas e nomenclaturas"
                rightAction={
                    <div className="flex gap-3">
                        <PremiumButton variant="secondary" onClick={() => setCurrentView('dashboard')} icon={<BackIcon className="w-4 h-4" />}>
                            Voltar
                        </PremiumButton>
                        {padroes.length === 0 && (
                            <PremiumButton variant="ghost" onClick={handleSeedInitialData} disabled={isSeeding}>
                                Gerar Dados de Exemplo
                            </PremiumButton>
                        )}
                        <PremiumButton icon={<PlusIcon className="w-4 h-4" />}>
                            Novo Padrão
                        </PremiumButton>
                    </div>
                }
            />
            
            <div className="mb-6 flex gap-4">
                <div className="flex-1">
                    <PremiumInput placeholder="Buscar padrão por nome, categoria ou valor..." icon={<SearchIcon className="w-4 h-4" />} />
                </div>
                <PremiumSelect className="w-40">
                    <option value="">Todos os Tipos</option>
                    <option value="Stack">Stack</option>
                    <option value="Paleta">Paleta</option>
                    <option value="Fonte">Fonte</option>
                    <option value="Componente">Componente</option>
                </PremiumSelect>
            </div>

            {isLoadingOfficial ? (
                <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Carregando padrões...</div>
            ) : padroes.length === 0 ? (
                <div className="flex-1 flex items-center justify-center flex-col gap-4 text-slate-500">
                    <CubeIcon className="w-12 h-12 opacity-20" />
                    <p className="text-sm">Nenhum padrão oficial cadastrado.</p>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-20">
                  {padroes.map(pad => (
                      <PremiumCard key={pad.id} hoverGlow={true}>
                          <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{pad.patternType}</span>
                              <PremiumBadge status={pad.status} />
                          </div>
                          
                          <h3 className="text-lg font-bold text-white tracking-tight mb-2">{pad.name}</h3>
                          <p className="text-xs text-slate-400 mb-4 line-clamp-2">{pad.description}</p>
                          
                          <div className="bg-slate-900/80 rounded-lg p-3 font-mono text-[10px] text-green-400 border border-slate-700/50 mb-4 break-all">
                              {pad.valueOrDefinition}
                          </div>

                          <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                  {pad.category}
                              </div>
                          </div>
                      </PremiumCard>
                  ))}
              </div>
            )}
        </div>
    </PremiumSurface>
);

  // Editor Genérico
    const renderEditor = (
      title: string,
      value: string,
      setValue: (v: string) => void,
      onSave: () => void,
      placeholder: string,
      options: { isSaving?: boolean } = {}
  ) => (
      <div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden bg-[#0B0F19] text-slate-200">
          <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
            <header className="mb-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">{title}</h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Edição Global</p>
                    </div>
                </div>
                <button
                  onClick={onSave}
                  disabled={options.isSaving}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all ${options.isSaving ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                >
                    {options.isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </header>
            
            <div className="flex-1 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 shadow-sm p-1 overflow-hidden backdrop-blur-sm">
                <textarea 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full h-full p-8 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-300 custom-scrollbar"
                    spellCheck={false}
                    placeholder={placeholder}
                />
            </div>
          </div>
      </div>
  );


  // Cofre Black (Gerenciador de Documentos) - LIST VIEW UPDATE
  const renderBlackVault = () => {
            const filteredVaultDocs = vaultDocuments.filter(d => 
          d.title.toLowerCase().includes(vaultSearchTerm.toLowerCase())
      );


      return (
      <div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden relative bg-[#0B0F19] text-slate-200">
          {renderFilePreview()}
          
          <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
              <header className="mb-8 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                          <BackIcon className="w-6 h-6" />
                      </button>
                      <div>
                          <h2 className="text-xl font-black text-white uppercase tracking-tighter">Cofre Black</h2>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Repositório Central de Documentos</p>
                      </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                      <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 w-64">
                          <SearchIcon className="w-4 h-4 text-gray-400" />
                          <input 
                              value={vaultSearchTerm}
                              onChange={e => setVaultSearchTerm(e.target.value)}
                              className="bg-transparent outline-none text-xs font-medium w-full"
                              placeholder="Pesquisar arquivos..."
                          />
                      </div>

                      {/* INPUT AGORA ACEITA TUDO (*) */}
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          multiple 
                          accept="*" 
                          onChange={handleVaultUpload}
                      />
                                            <button 
                          onClick={() => !isUploadingVault && fileInputRef.current?.click()}
                          disabled={isUploadingVault}
                          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all ${isUploadingVault ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-bitrix-nav text-white hover:bg-bitrix-accent'}`}
                      >
                          {isUploadingVault ? (
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          ) : (
                            <CloudUploadIcon className="w-4 h-4" />
                          )}
                          {isUploadingVault ? 'Processando...' : 'Ingestão em Massa'}
                      </button>

                  </div>
              </header>

              <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredVaultDocs.length} Arquivos Seguros</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-2">
                                {vaultDocuments.length === 0 && (

                          <div className="flex flex-col items-center justify-center opacity-30 py-20">
                              <LockIcon className="w-16 h-16 mb-4" />
                              <p className="font-bold text-sm">O Cofre está vazio.</p>
                          </div>
                      )}
                      
                      {filteredVaultDocs.map(doc => (
                          <div 
                            key={doc.id} 
                            onClick={() => setPreviewDoc(doc)} // ABRE PREVIEW AO CLICAR
                            className="flex items-center h-14 px-4 bg-white border border-gray-100 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all gap-4 group cursor-pointer"
                          >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                                  <FileTextIcon className="w-4 h-4" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-gray-800 truncate group-hover:text-bitrix-nav">{doc.title}</h4>
                              </div>

                              <span className="text-[9px] text-gray-400 font-mono hidden md:block">
                                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : '—'}
                              </span>

                                                            {doc.source !== 'methodology' && (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleDeleteFromVault(doc.id); }} 
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                              )}

                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>
      );
  };

  const renderAgentManager = () => {
    // Modo de Edição
    if (editingAgent) {
                // COMBINA DOCUMENTOS DO COFRE E METODOLOGIAS DO SISTEMA
        const allAvailableDocs: VaultDocument[] = availableKnowledgeDocs;
        const filteredDocs = allAvailableDocs.filter(d => 
 
            d.title.toLowerCase().includes(knowledgeSearchTerm.toLowerCase())
        );

        return (
            <div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden relative bg-[#0B0F19] text-slate-200">
                {renderFilePreview()}
                
                <div className="max-w-6xl mx-auto w-full flex flex-col h-full bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
                    
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setEditingAgent(null)} className="p-2 hover:bg-gray-200 rounded-lg text-gray-400">
                                <BackIcon className="w-6 h-6" />
                            </button>
                            <div>
                                <h2 className="text-xl font-black text-white uppercase tracking-tighter">Editando: {editingAgent.name}</h2>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Gestão de Inteligência</p>
                            </div>
                        </div>
                        <div className="flex bg-gray-200 p-1 rounded-xl">
                            <button 
                                onClick={() => setActiveAgentTab('dna')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeAgentTab === 'dna' ? 'bg-white text-bitrix-nav shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                DNA (Prompt)
                            </button>
                            <button 
                                onClick={() => setActiveAgentTab('knowledge')}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeAgentTab === 'knowledge' ? 'bg-white text-bitrix-nav shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Permissões (Cofre)
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative">
                        {activeAgentTab === 'dna' && (
                            <div className="flex flex-col h-full">
                                <textarea 
                                    value={tempPrompt}
                                    onChange={e => setTempPrompt(e.target.value)}
                                    // FORCE WHITE BACKGROUND AND DARK GRAY TEXT HERE
                                    className="flex-1 p-8 resize-none outline-none font-mono text-xs leading-relaxed text-gray-800 bg-white custom-scrollbar"
                                    spellCheck={false}
                                    placeholder="Defina o prompt do sistema aqui..."
                                />
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                    <button onClick={handleSaveAgent} className="px-6 py-3 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 shadow-lg">
                                        Salvar Prompt
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeAgentTab === 'knowledge' && (
                            <div className="flex h-full p-8 bg-gray-50/20">
                                <div className="w-full h-full flex flex-col">
                                    <div className="mb-6 flex justify-between items-end">
                                        <div>
                                            <h3 className="text-lg font-black text-bitrix-nav uppercase tracking-tight">Vínculo de Conhecimento</h3>
                                            <p className="text-xs text-gray-500">Selecione quais documentos (Cofre) ou Metodologias este agente pode acessar.</p>
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 w-64">
                                            <SearchIcon className="w-4 h-4 text-gray-400" />
                                            <input 
                                                value={knowledgeSearchTerm}
                                                onChange={e => setKnowledgeSearchTerm(e.target.value)}
                                                className="bg-transparent outline-none text-xs font-medium w-full"
                                                placeholder="Pesquisar..."
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pb-20">
                                        {filteredDocs.length === 0 && (
                                            <div className="text-center py-10 opacity-50">
                                                <p className="text-sm font-bold">Nenhum documento encontrado.</p>
                                            </div>
                                        )}
                                        {filteredDocs.map(doc => {
                                            const hasAccess = editingAgent.globalDocuments?.some(d => d.title === doc.title);
                                            const isMethodology = doc.type === 'METHODOLOGY';
                                            
                                            return (
                                                <div 
                                                    key={doc.id} 
                                                    className={`
                                                        flex items-center h-12 px-4 rounded-xl border transition-all gap-4 group
                                                        ${hasAccess ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}
                                                    `}
                                                >
                                                    {/* Checkbox "Bolinha" - Area de Clique para Seleção */}
                                                    <div 
                                                        onClick={() => toggleAgentDocument(doc)}
                                                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${hasAccess ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 border-gray-300 text-transparent hover:border-green-400'}`}
                                                    >
                                                        <CheckIcon className="w-3 h-3" />
                                                    </div>
                                                    
                                                    {/* Ícone de Tipo */}
                                                    <div 
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 ${isMethodology ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}
                                                    >
                                                        {isMethodology ? <FolderIcon className="w-4 h-4" /> : <FileTextIcon className="w-4 h-4" />}
                                                    </div>

                                                    {/* Título (Linha Única) - Clica para PREVIEW */}
                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                                                        <h4 className={`text-xs font-bold truncate ${hasAccess ? 'text-green-800' : 'text-gray-700'} hover:underline`}>{doc.title}</h4>
                                                    </div>

                                                    {/* Badge de Tipo */}
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${isMethodology ? 'bg-purple-50 text-purple-500' : 'bg-gray-100 text-gray-400'}`}>
                                                        {isMethodology ? 'Metodologia' : 'Arquivo'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // List View (Seleção de Agente)
    const editableAgents = agents.filter(a => a.status === 'ACTIVE' || a.status === 'STAGING');

    return (
        <div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden bg-[#0B0F19] text-slate-200">
            <div className="max-w-5xl mx-auto w-full flex flex-col h-full">
                <header className="mb-8 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                            <BackIcon className="w-6 h-6" />
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Núcleo de Inteligência</h2>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Selecione um agente para gerenciar DNA e Conhecimento</p>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {editableAgents.map(agent => (
                            <button 
                                key={agent.id}
                                onClick={() => openAgentEditor(agent)}
                                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg hover:border-bitrix-nav/20 transition-all text-left flex items-center gap-4 group"
                            >
                                {/* AVATAR SUBSTITUINDO CAIXA DE LETRAS */}
                                <Avatar name={agent.name} url={agent.avatarUrl} className={`w-12 h-12 rounded-xl shadow-sm ${agent.status === 'STAGING' ? 'grayscale opacity-70' : ''}`} />
                                
                                <div>
                                    <h3 className="text-sm font-bold text-gray-800 group-hover:text-bitrix-nav transition-colors">
                                        {agent.name}
                                        {agent.entityType === 'HUMANO' && <span className="ml-2 text-[8px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase inline-block align-middle">Humano</span>}
                                    </h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{agent.officialRole}</p>
                                    {agent.status === 'STAGING' && <span className="text-[8px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">Homologação</span>}
                                    {agent.docCount && agent.docCount > 0 && <span className="ml-2 text-[8px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block">{agent.docCount} Acessos</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  if (!isUnlocked) return renderLockScreen();

  switch(currentView) {
      case 'dashboard': return (
        <PremiumSurface className="flex flex-col overflow-y-auto custom-scrollbar relative">
             <button onClick={onBack} className="absolute top-8 right-8 text-slate-500 hover:text-blue-400 text-[9px] font-black uppercase tracking-widest transition-colors z-10">Voltar</button>
             {renderDashboard()}
        </PremiumSurface>
      );
            case 'constitution': return renderEditor('Cultura Atual', cultureDraft, setCultureDraft, handleSaveConstitution, "Defina a Cultura...", { isSaving: isSavingCulture });
      case 'compliance': return renderEditor('Diretrizes & Compliance', complianceDraft, setComplianceDraft, handleSaveCompliance, "Defina os Protocolos de Bloqueio...", { isSaving: isSavingCompliance });
      case 'padroes': return renderPadroes();
      case 'protocolos': return renderProtocolos();

      case 'black-vault': return renderBlackVault();
      case 'intelligence': return renderAgentManager(); 
            case 'methodology': return (
        <MethodologyView
          onBack={() => setCurrentView('dashboard')}
          nodes={knowledgeNodes}
          onCreateNode={onCreateKnowledgeNode}
          onUpdateNode={onUpdateKnowledgeNode}
          onDeleteNode={onDeleteKnowledgeNode}
        />
      );

      case 'backup': return renderDashboard(); // Fallback, triggered by button directly
      default: return renderDashboard();
  }
};

export default GovernanceView;
