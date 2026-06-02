import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Agent, BusinessUnit, ModelProvider, Venture } from '../../../types';
import { auth, db } from '../../../../services/supabase';
import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from '../../../../services/supabase';
import { authAdminService } from '../../../../services/authAdmin';
import { AgentFactoryHeader } from './agent-factory/AgentFactoryHeader';
import { AgentFactoryToolbar } from './agent-factory/AgentFactoryToolbar';
import { AgentFactoryTable } from './agent-factory/AgentFactoryTable';
import { AgentFactoryFormModal } from './agent-factory/AgentFactoryFormModal';
import { NameCreatorPanel } from './agent-factory/NameCreatorPanel';
import { DEFAULT_WORKSPACE_ID } from './agent-factory/constants';
import {
  BatchPreviewRow,
  buildOfficialImportTemplateCsv,
  parseBatchImportRows,
  validateBatchImportRows
} from './agent-factory/batchImportValidator';
import {
  agentToForm,
  createEmptyForm,
  isUuid,
  mapEntityToCollaboratorType,
  normalizeCanonicalIdInput,
  normalizeText,
  parseCanonicalId,
  resolveAgentStatus,
  toCustomFieldObject,
  validateAgentNameAvailability,
  validateDraft
} from './agent-factory/helpers';
import { AgentFormState, EntityType, FormCustomField } from './agent-factory/types';

interface AgentFactoryProps {
  onNavigateToEcosystem: () => void;
  onActivate: (agentData: any) => void;
  onRemove?: (agentId: string) => void;
  activeBU: BusinessUnit;
  activeWorkspaceId?: string | null;
  businessUnits: BusinessUnit[];
  ventures: Venture[];
  agents: Agent[];
  initialAgent?: Agent | null;
  onManageIntelligence?: (agent: Agent) => void;
  authUsersByEmail?: Record<string, { id: string; email: string }>;
  activeSessionEmail?: string | null;
}

const AgentFactory: React.FC<AgentFactoryProps> = ({
  onNavigateToEcosystem,
  onActivate,
  onRemove,
  activeBU,
  activeWorkspaceId,
  businessUnits,
  ventures,
  agents,
  initialAgent,
  onManageIntelligence,
  authUsersByEmail = {},
  activeSessionEmail
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState<AgentFormState>(() => createEmptyForm(activeBU, ventures));
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showAdvancedColumns, setShowAdvancedColumns] = useState(false);
  const [batchOrigin, setBatchOrigin] = useState('Importacao StartyB');
  const [batchVentureId, setBatchVentureId] = useState('');
  const [importFeedback, setImportFeedback] = useState('');
  const [batchPreview, setBatchPreview] = useState<BatchPreviewRow[]>([]);
  const [pendingBatchOrigin, setPendingBatchOrigin] = useState('');
  const [isLoadingAuthPermissions, setIsLoadingAuthPermissions] = useState(false);
  const [authAdminPermissions, setAuthAdminPermissions] = useState({
    inviteUser: false,
    createUser: false,
    linkUser: false,
    listUsers: false
  });

  const canInviteUsers = authAdminPermissions.inviteUser;

  const shouldRequireEmail = useMemo(() => {
    if (form.entityType === 'HUMANO' || form.entityType === 'HIBRIDO') return true;
    return form.usesEmail;
  }, [form.entityType, form.usesEmail]);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!batchVentureId && ventures.length > 0) {
      setBatchVentureId(ventures[0].id);
    }
  }, [batchVentureId, ventures]);

  useEffect(() => {
    if (!initialAgent) return;
    setEditingAgentId(initialAgent.id);
    setForm(agentToForm(initialAgent, activeBU, ventures));
    setIsFormOpen(true);
  }, [initialAgent, activeBU, ventures]);

  useEffect(() => {
    let cancelled = false;

    const loadPermissions = async () => {
      setIsLoadingAuthPermissions(true);
      const permissions = await authAdminService.getPermissions(activeWorkspaceId || undefined);
      if (!cancelled) {
        setAuthAdminPermissions(permissions);
        setIsLoadingAuthPermissions(false);
      }
    };

    loadPermissions();

    return () => {
      cancelled = true;
    };
  }, [activeWorkspaceId]);

  const filteredAgents = useMemo(() => {
    const term = normalizeText(searchTerm);
    const list = [...agents].sort((a, b) => a.name.localeCompare(b.name));
    if (!term) return list;

    return list.filter((agent) => {
      const ventureName = ventures.find((venture) => venture.id === agent.ventureId)?.name || '';
      const haystack = [
        agent.canonicalId,
        agent.name,
        agent.functionName,
        agent.officialRole,
        agent.area,
        agent.unitName,
        ventureName,
        agent.origin
      ]
        .map((value) => normalizeText(String(value || '')))
        .join(' ');

      return haystack.includes(term);
    });
  }, [agents, searchTerm, ventures]);

  const mentorCandidates = useMemo(
    () => agents.filter((agent) => agent.id !== editingAgentId),
    [agents, editingAgentId]
  );

  const currentEditingAgent = useMemo(
    () => agents.find((agent) => agent.id === editingAgentId),
    [agents, editingAgentId]
  );

  const nameValidation = useMemo(
    () => validateAgentNameAvailability(form.name, agents, editingAgentId),
    [agents, editingAgentId, form.name]
  );

  const handleOpenNew = () => {
    setEditingAgentId(null);
    setForm(createEmptyForm(activeBU, ventures));
    setIsFormOpen(true);
  };

  const handleUseGeneratedName = (name: string) => {
    setEditingAgentId(null);
    setForm({
      ...createEmptyForm(activeBU, ventures),
      name
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditingAgentId(agent.id);
    setForm(agentToForm(agent, activeBU, ventures));
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      window.alert('Avatar acima de 1MB. Use um arquivo menor.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatarUrl: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const setFormField = <K extends keyof AgentFormState>(key: K, value: AgentFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEntityTypeChange = (entityType: EntityType) => {
    setForm((prev) => {
      const forceEmail = entityType === 'HUMANO' || entityType === 'HIBRIDO';
      return {
        ...prev,
        entityType,
        usesEmail: forceEmail ? true : prev.usesEmail
      };
    });
  };

  const handleUsesEmailChange = (usesEmail: boolean) => {
    setForm((prev) => ({
      ...prev,
      usesEmail,
      email: usesEmail ? prev.email : ''
    }));
  };

  const toggleStack = (stack: ModelProvider) => {
    setForm((prev) => {
      const hasStack = prev.allowedStacks.includes(stack);
      const allowedStacks = hasStack
        ? prev.allowedStacks.filter((item) => item !== stack)
        : [...prev.allowedStacks, stack];
      let preferredModel = prev.preferredModel;
      if (preferredModel && !allowedStacks.includes(preferredModel)) {
        preferredModel = allowedStacks[0] || '';
      }
      return { ...prev, allowedStacks, preferredModel };
    });
  };

  const upsertCustomField = (index: number, patch: Partial<FormCustomField>) => {
    setForm((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field, fieldIndex) => (
        fieldIndex === index ? { ...field, ...patch } : field
      ))
    }));
  };

  const removeCustomField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      customFields: prev.customFields.filter((_, fieldIndex) => fieldIndex !== index)
    }));
  };

  const addCustomField = () => {
    setForm((prev) => ({
      ...prev,
      customFields: [...prev.customFields, { key: '', value: '' }]
    }));
  };

  const buildAgentPayload = (draft: AgentFormState, originOverride?: string) => {
    const selectedVenture = ventures.find((venture) => venture.id === draft.ventureId);
    const selectedBu = businessUnits.find((unit) => unit.id === activeBU.id);
    const userId = (auth as any)?.currentUser?.id;
    const normalizedStacks = draft.allowedStacks.length > 0 ? draft.allowedStacks : ['deepseek'];
    const preferredModel = (draft.preferredModel || normalizedStacks[0] || 'deepseek') as ModelProvider;
    const structuralStatus = draft.structuralStatus;
    const status = resolveAgentStatus(structuralStatus);
    const operationalStatus = draft.dnaStatus === 'DNA_COMPLETO'
      ? (draft.operationalStatus === 'ATIVO' ? 'ATIVO' : 'DISPONIVEL')
      : 'ESTRUTURAL';

    return {
      canonicalId: normalizeCanonicalIdInput(draft.canonicalId),
      name: draft.name.trim(),
      entityType: draft.entityType,
      email: draft.email.trim() || undefined,
      usesEmail: draft.usesEmail,
      shortDescription: draft.shortDescription.trim(),
      origin: (originOverride || draft.origin || 'Cadastro manual').trim(),
      ventureId: selectedVenture?.id,
      company: selectedVenture?.name || selectedBu?.name || activeBU.name,
      buId: activeBU.id,
      unitName: draft.unitName.trim(),
      area: draft.area.trim(),
      functionName: draft.functionName.trim(),
      baseRoleUniversal: draft.baseRoleUniversal.trim() || undefined,
      officialRole: draft.functionName.trim(),
      tier: draft.level,
      roleType: draft.roleType,
      structuralStatus,
      operationalStatus,
      operationalActivation: draft.operationalActivation,
      dnaStatus: draft.dnaStatus,
      operationalClass: draft.operationalClass,
      allowedStacks: normalizedStacks,
      preferredModel,
      modelProvider: preferredModel,
      aiMentor: draft.aiMentor || undefined,
      humanOwner: draft.humanOwner || undefined,
      projectId: draft.projectId || undefined,
      authUserId: draft.authUserId || undefined,
      division: draft.unitName.trim() || undefined,
      sector: draft.area.trim() || undefined,
      collaboratorType: mapEntityToCollaboratorType(draft.entityType),
      avatarUrl: draft.avatarUrl || undefined,
      customFields: toCustomFieldObject(draft.customFields),
      status,
      active: operationalStatus !== 'ESTRUTURAL' && (status === 'ACTIVE' || status === 'STAGING'),
      workspaceId: activeWorkspaceId || DEFAULT_WORKSPACE_ID,
      updatedAt: Timestamp.now(),
      updatedBy: userId || undefined
    };
  };

  const validateCanonicalIntegrity = (draft: AgentFormState) => {
    const normalizedCanonicalId = normalizeCanonicalIdInput(draft.canonicalId);
    const parsedCanonicalId = parseCanonicalId(normalizedCanonicalId);
    if (!parsedCanonicalId) {
      throw new Error('ID canônico inválido. Use o padrão nome_empresa3_setor3_nivel1_seq3.');
    }

    const persistedCanonicalId = normalizeCanonicalIdInput(currentEditingAgent?.canonicalId || '');
    if (editingAgentId && persistedCanonicalId && persistedCanonicalId !== normalizedCanonicalId) {
      throw new Error('ID canônico é imutável após o cadastro inicial.');
    }

    const duplicatedCanonical = agents.find((agent) => (
      agent.id !== editingAgentId
      && normalizeCanonicalIdInput(agent.canonicalId || '') === normalizedCanonicalId
    ));
    if (duplicatedCanonical) {
      throw new Error(`ID canônico já utilizado por ${duplicatedCanonical.name}.`);
    }

    const duplicatedSeqInVenture = agents.find((agent) => {
      if (agent.id === editingAgentId) return false;
      if ((agent.ventureId || '') !== (draft.ventureId || '')) return false;
      const parsedExisting = parseCanonicalId(agent.canonicalId || '');
      return parsedExisting?.seq3 === parsedCanonicalId.seq3;
    });

    if (duplicatedSeqInVenture) {
      throw new Error(`Sequencial ${parsedCanonicalId.seq3} já está em uso na venture selecionada.`);
    }
  };

  const persistAgent = async (draft: AgentFormState, originOverride?: string) => {
    validateDraft(draft);
    const currentNameValidation = validateAgentNameAvailability(draft.name, agents, editingAgentId);
    if (currentNameValidation.status === 'duplicate') {
      throw new Error(currentNameValidation.message);
    }
    validateCanonicalIntegrity(draft);
    const payload = buildAgentPayload(draft, originOverride);

    if (editingAgentId && isUuid(editingAgentId)) {
      await updateDoc(doc(db, 'agents', editingAgentId), payload);
      const hydrated = {
        ...(currentEditingAgent || {}),
        ...payload,
        id: editingAgentId,
        universalId: currentEditingAgent?.universalId || editingAgentId
      };
      onActivate(hydrated);
      return hydrated as Agent;
    }

    const userId = (auth as any)?.currentUser?.id;
    const createPayload = {
      ...payload,
      createdAt: Timestamp.now(),
      createdBy: userId || undefined
    };

    const docRef = await addDoc(collection(db, 'agents'), createPayload);
    await updateDoc(docRef, {
      id: docRef.id,
      universalId: docRef.id,
      updatedAt: Timestamp.now(),
      updatedBy: userId || undefined
    });

    const hydrated = { ...payload, id: docRef.id, universalId: docRef.id };
    onActivate(hydrated);
    return hydrated as Agent;
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const requiresSystemAccess = Boolean(form.usesEmail && form.email.trim());

      const savedAgent = await persistAgent(form);
      let postSaveAccessMessage = '';

      if (requiresSystemAccess && !savedAgent.authUserId) {
        if (canInviteUsers) {
          const inviteResult = await authAdminService.inviteUser({
            email: form.email.trim(),
            name: form.name.trim(),
            agentId: savedAgent.id,
            ...(activeWorkspaceId ? { workspaceId: activeWorkspaceId } : {})
          });

          if (!inviteResult.success || !inviteResult.userId) {
            throw new Error(inviteResult.error || inviteResult.message || 'Falha ao criar/vincular conta de acesso automaticamente.');
          }

          await updateDoc(doc(db, 'agents', savedAgent.id), {
            authUserId: inviteResult.userId,
            updatedAt: Timestamp.now(),
            updatedBy: (auth as any)?.currentUser?.id
          });

          onActivate({
            ...savedAgent,
            authUserId: inviteResult.userId
          });

          postSaveAccessMessage = ' Conta vinculada e convite enviado com sucesso.';
        } else {
          console.warn('[AgentFactory] Cadastro salvo sem convite automático por falta de permissão de invite_user no workspace atual.');
          postSaveAccessMessage = ' Cadastro salvo. O vínculo de acesso ficará pendente até permissão de autorização estar disponível.';
        }
      }

      setIsFormOpen(false);
      setEditingAgentId(null);
      setForm(createEmptyForm(activeBU, ventures));
      window.alert(`Cadastro salvo com sucesso.${postSaveAccessMessage}`);
    } catch (error: any) {
      console.error('Erro ao salvar cadastro estrutural:', error);
      window.alert(error?.message || 'Falha ao salvar cadastro estrutural.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (agent: Agent) => {
    if (!onRemove) return;
    const confirmed = window.confirm(`Excluir ${agent.name} do cadastro estrutural?`);
    if (!confirmed) return;
    try {
      if (isUuid(agent.id)) {
        await deleteDoc(doc(db, 'agents', agent.id));
      }
      onRemove(agent.id);
    } catch (error: any) {
      console.error('Erro ao excluir agente:', error);
      window.alert(error?.message || 'Falha ao excluir cadastro.');
    }
  };

  const hasBatchErrors = batchPreview.some((row) => row.errors.length > 0);

  const handleDownloadTemplate = () => {
    const blob = new Blob([buildOfficialImportTemplateCsv()], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template_importacao_nucleo_identidades.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleBatchFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsImporting(true);
    setImportFeedback('Validando lote antes de importar...');
    try {
      const content = await file.text();
      const rows = parseBatchImportRows(file.name, content);
      if (rows.length === 0) throw new Error('Arquivo sem registros validos para importar.');
      const preview = validateBatchImportRows({ rows, agents, activeBU, ventures, batchOrigin, batchVentureId });
      setBatchPreview(preview);
      setPendingBatchOrigin(`${batchOrigin} (Lote ${new Date().toISOString()})`);
      const errorCount = preview.filter((row) => row.errors.length > 0).length;
      const warningCount = preview.filter((row) => row.warnings.length > 0).length;
      setImportFeedback(`Pré-validação concluída: ${preview.length} linha(s), ${errorCount} com erro(s), ${warningCount} com alerta(s).`);
    } catch (error: any) {
      console.error('Erro na importacao em lote:', error);
      setImportFeedback(`Falha na pré-validação: ${error?.message || 'erro desconhecido'}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleConfirmBatchImport = async () => {
    if (batchPreview.length === 0 || hasBatchErrors || isImporting) return;
    setIsImporting(true);
    setImportFeedback('Importando lote validado...');
    let successCount = 0;
    let failCount = 0;
    for (const previewRow of batchPreview) {
      try {
        await persistAgent(previewRow.draft, pendingBatchOrigin || batchOrigin);
        successCount += 1;
      } catch (error) {
        console.warn('Falha ao importar linha validada:', error);
        failCount += 1;
      }
    }
    setImportFeedback(`Lote finalizado: ${successCount} importado(s), ${failCount} com falha.`);
    setBatchPreview([]);
    setIsImporting(false);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50 dark:bg-sagb-bg font-nunito transition-colors duration-300">
      <AgentFactoryHeader onNavigateToEcosystem={onNavigateToEcosystem} onOpenNew={handleOpenNew} />
      <NameCreatorPanel agents={agents} onUseName={handleUseGeneratedName} />

      <div className="grid flex-1 gap-0 overflow-hidden grid-cols-1">
        <section className="flex min-w-0 flex-col overflow-hidden bg-white dark:bg-sagb-panel transition-colors duration-300">
          <AgentFactoryToolbar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            batchVentureId={batchVentureId}
            onBatchVentureIdChange={setBatchVentureId}
            batchOrigin={batchOrigin}
            onBatchOriginChange={setBatchOrigin}
            ventures={ventures}
            batchInputRef={batchInputRef}
            onBatchFile={handleBatchFile}
            onDownloadTemplate={handleDownloadTemplate}
            isImporting={isImporting}
            showAdvancedColumns={showAdvancedColumns}
            onToggleAdvancedColumns={() => setShowAdvancedColumns((prev) => !prev)}
            importFeedback={importFeedback}
          />

          {batchPreview.length > 0 && (
            <div className="border-b border-gray-100 bg-white px-6 py-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Prévia do lote</p>
                  <p className="text-[11px] font-semibold text-gray-500">Revise erros e alertas antes de salvar qualquer registro.</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setBatchPreview([])} className="rounded-lg border border-gray-200 px-3 py-2 text-[10px] font-black uppercase text-gray-600">Cancelar</button>
                  <button onClick={handleConfirmBatchImport} disabled={hasBatchErrors || isImporting} className="rounded-lg bg-indigo-600 px-3 py-2 text-[10px] font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-50">Confirmar importação</button>
                </div>
              </div>
              <div className="max-h-72 overflow-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[920px] border-collapse text-left text-[11px]">
                  <thead className="sticky top-0 bg-gray-50 text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                    <tr><th className="px-3 py-2">Linha</th><th className="px-3 py-2">Nome</th><th className="px-3 py-2">Tipo</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Erros</th><th className="px-3 py-2">Alertas</th></tr>
                  </thead>
                  <tbody>
                    {batchPreview.map((row) => (
                      <tr key={row.line} className="border-t border-gray-100">
                        <td className="px-3 py-2 font-bold text-gray-500">{row.line}</td>
                        <td className="px-3 py-2 font-bold text-gray-800">{row.name || '-'}</td>
                        <td className="px-3 py-2">{row.entityType || '-'}</td>
                        <td className="px-3 py-2"><span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${row.status === 'error' ? 'bg-red-100 text-red-700' : row.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.status === 'error' ? 'Erro' : row.status === 'warning' ? 'Alerta' : 'OK'}</span></td>
                        <td className="px-3 py-2 text-red-600">{row.errors.join(' | ') || '-'}</td>
                        <td className="px-3 py-2 text-amber-600">{row.warnings.join(' | ') || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <AgentFactoryTable
            filteredAgents={filteredAgents}
            ventures={ventures}
            showAdvancedColumns={showAdvancedColumns}
            authUsersByEmail={authUsersByEmail}
            activeSessionEmail={activeSessionEmail}
            onOpenEdit={handleOpenEdit}
            onManageIntelligence={onManageIntelligence}
            onDelete={onRemove ? handleDelete : undefined}
          />
        </section>

        <AgentFactoryFormModal
          isOpen={isFormOpen}
          form={form}
          editingAgentId={editingAgentId}
          ventures={ventures}
          mentorCandidates={mentorCandidates}
          currentEditingAgent={currentEditingAgent}
          nameValidation={nameValidation}
          authUsersByEmail={authUsersByEmail}
          shouldRequireEmail={shouldRequireEmail}
          isSaving={isSaving}
          avatarInputRef={avatarInputRef}
          onClose={handleCloseForm}
          onSave={handleSave}
          onAvatarUpload={handleAvatarUpload}
          onSetFormField={setFormField}
          onEntityTypeChange={handleEntityTypeChange}
          onUsesEmailChange={handleUsesEmailChange}
          onToggleStack={toggleStack}
          onUpsertCustomField={upsertCustomField}
          onRemoveCustomField={removeCustomField}
          onAddCustomField={addCustomField}
        />
      </div>
    </div>
  );
};

export default AgentFactory;
