import { useEffect, useMemo, useState } from 'react';
import { advanceBlock, createSalaDevState, deactivateRunAgent, summonAgentToRun, updateGateStatus, updateHandoffStatus, updateRunAgentStatus } from '../store/salaDev.store';
import { DomainDecision } from '../types/salaDev.status';
import { SalaDevRepositoryAdapter } from '../services/salaDevRepository';
import { Agent } from '../../../../types';
import { salaDevAgentCatalogAdapter } from '../services/salaDevAgentCatalogAdapter';
import { salaDevTechnicalExportService } from '../services/salaDevTechnicalExportService';
import { TechnicalExecutionPackage } from '../types/salaDev.technicalExport';
import { salaDevTechnicalBridgeService } from '../services/salaDevTechnicalBridgeService';
import { GeneratedInitialBriefing, NewProjectBriefingForm } from '../components/NewProjectEntryPanel';
import { BlockNumber } from '../types/salaDev.agentConstants';
import { createSalaDevLlmService } from '../services/SalaDevLlmService';
import { quadroDeEliteConnector } from '../services/quadroDeEliteConnector';

interface UseSalaDevRunOptions {
  officialAgents?: Agent[];
}

export function useSalaDevRun(options: UseSalaDevRunOptions = {}) {
  const { officialAgents = [] } = options;
  const emptyProjectEntryForm: NewProjectBriefingForm = {
    projectName: '',
    idea: '',
    objective: '',
    audience: '',
    constraints: ''
  };

  const initialState = useMemo(() => createSalaDevState({
    run: {
      id: 'loading',
      projectId: 'loading',
      projectName: 'Carregando Sala Dev',
      briefingSummary: 'Inicializando repositório de execução...',
      status: 'PLANNING',
      currentStage: 'Bootstrap',
      progressPercent: 0,
      nextSteps: []
    },
    agents: [],
    events: [],
    files: [],
    domain: {
      run: {
        id: 'loading',
        projectId: 'loading',
        title: 'Carregando...',
        status: 'pending',
        currentMacroLayerId: 'loading',
        riskLevel: 'low',
        progress: 0,
        updatedAt: new Date(),
        executionEnvironment: 'sagb_ui'
      },
      blocks: [],
      macroLayers: [],
      handoffs: [],
      gates: [],
      artifacts: [],
      runAgents: [],
      availableAgents: [],
      recommendedAgents: [],
      artifactVersions: [],
      gateChecklists: [],
      finalAudit: {
        id: 'loading',
        runId: 'loading',
        status: 'draft',
        risksFound: 0,
        gatesApproved: 0,
        gatesPending: 0,
        officialArtifacts: 0,
        finalNotes: 'Aguardando dados...',
        finalDecision: 'revisao_necessaria'
      },
      logs: [],
      decisions: [],
      risks: [],
      technicalBridge: salaDevTechnicalBridgeService.createPlannedContract('loading', 'vscode'),
      executionBridge: {
        source: 'vscode',
        mode: 'future_only',
        notes: 'Preparação arquitetural sem integração real nesta etapa.'
      }
    }
  }), []);

  const [state, setState] = useState(initialState);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedMacroLayerId, setSelectedMacroLayerId] = useState<string | null>(
    state.domain.run.currentMacroLayerId || state.domain.blocks[0]?.id || state.domain.macroLayers[0]?.id || null
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(
    state.domain.run.currentMacroLayerId || state.domain.blocks[0]?.id || null
  );
  const [selectedHandoffId, setSelectedHandoffId] = useState<string | null>(null);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [lastTechnicalPackage, setLastTechnicalPackage] = useState<TechnicalExecutionPackage | null>(null);
  const [projectEntryForm, setProjectEntryForm] = useState<NewProjectBriefingForm>(emptyProjectEntryForm);
  const [generatedBriefing, setGeneratedBriefing] = useState<GeneratedInitialBriefing | null>(null);
  const [isGeneratingBriefingWithAi, setIsGeneratingBriefingWithAi] = useState(false);
  const [briefingAiError, setBriefingAiError] = useState<string | null>(null);
  const [pipelineStarted, setPipelineStarted] = useState(false);
  const selectedEvent = state.events.find(e => e.id === selectedEventId) || null;

  useEffect(() => {
    const load = async () => {
      const repository = SalaDevRepositoryAdapter.getProvider();
      const payload = await repository.getInitialRunPayload();

      // Log da origem dos agentes: QE (real) vs mock
      const salaDevQeAgents = quadroDeEliteConnector.filterSalaDevAgents(officialAgents);
      const sourceLabel = salaDevQeAgents.length > 0
        ? `Quadro de Elite (${salaDevQeAgents.length} agentes CA-01 a CA-18)`
        : 'Mock local (constantes CA-01 a CA-18 da AGENT_18_MAP)';
      console.log(`[sala-dev] Origem dos agentes: ${sourceLabel}`);

      const availableAgents = salaDevAgentCatalogAdapter.adaptFromOfficial(officialAgents);
      const statePayload = {
        ...payload,
        domain: {
          ...payload.domain,
          availableAgents
        }
      };

      setState(createSalaDevState(statePayload));
      const initialSelection = statePayload.domain.run.currentMacroLayerId || statePayload.domain.blocks[0]?.id || statePayload.domain.macroLayers[0]?.id || null;
      setSelectedMacroLayerId(initialSelection);
      setSelectedBlockId(initialSelection);
    };
    void load();
  }, [officialAgents]);

  useEffect(() => {
    if (state.run.id === 'loading') return;

    const persist = async () => {
      const repository = SalaDevRepositoryAdapter.getProvider();
      await repository.saveRunState(
        state.domain.run,
        state.domain.macroLayers,
        state.domain.handoffs,
        state.domain.gates,
        state.domain.artifacts,
        state.domain.artifactVersions,
        state.domain.logs,
        state.domain.decisions,
        state.domain.gateChecklists,
        state.domain.finalAudit
      );
    };

    void persist();
  }, [state.domain.run, state.domain.macroLayers, state.run.id]);

  const handleHandoffStatusChange = (handoffId: string, status: typeof state.domain.handoffs[number]['status']) => {
    setState(prev => updateHandoffStatus(prev, handoffId, status));
  };

  const handleGateStatusChange = (gateId: string, status: typeof state.domain.gates[number]['status'], decision?: DomainDecision) => {
    setState(prev => updateGateStatus(prev, gateId, status, decision));
  };

  const handleSummonAgent = (agentId: string) => {
    setState(prev => summonAgentToRun(prev, agentId, selectedBlockId || selectedMacroLayerId || undefined));
  };

  const handleAdvanceBlock = (blockId: string) => {
    setState(prev => advanceBlock(prev, blockId));
    const currentBlock = state.domain.blocks.find(b => b.id === blockId);
    const nextBlock = currentBlock ? state.domain.blocks.find(b => b.block === currentBlock.block + 1) : undefined;
    if (nextBlock) {
      setSelectedBlockId(nextBlock.id);
      setSelectedMacroLayerId(nextBlock.id);
    }
  };

  const handleSummonBlockAgent = (_blockNumber: BlockNumber, agentId: string) => {
    const targetBlock = state.domain.blocks.find(block => block.block === _blockNumber);
    setState(prev => summonAgentToRun(prev, agentId, targetBlock?.id || selectedBlockId || undefined));
  };

  const getActiveBlock = () => state.domain.blocks.find(block => block.id === state.domain.run.currentMacroLayerId) || state.domain.blocks.find(block => block.status === 'running');

  const getBlockAgents = (blockNumber: BlockNumber) => {
    const block = state.domain.blocks.find(item => item.block === blockNumber);
    if (!block) return [];
    return state.domain.runAgents.filter(agent => agent.macroLayerId === block.id);
  };

  const handleRunAgentStatusChange = (agentId: string, status: typeof state.domain.runAgents[number]['status']) => {
    setState(prev => updateRunAgentStatus(prev, agentId, status));
  };

  const handleDeactivateRunAgent = (agentId: string) => {
    setState(prev => deactivateRunAgent(prev, agentId));
  };

  const handleGenerateTechnicalPackage = () => {
    const pkg = salaDevTechnicalExportService.generatePackage(state, 'sala-dev-human-approved');
    setLastTechnicalPackage(pkg);

    setState(prev => {
      const now = new Date();
      const exportArtifactId = `artifact-export-${now.getTime()}`;
      return {
        ...prev,
        domain: {
          ...prev.domain,
          artifacts: [
            ...prev.domain.artifacts,
            {
              id: exportArtifactId,
              runId: prev.domain.run.id,
              macroLayerId: prev.domain.run.currentMacroLayerId,
              title: 'Pacote Técnico Auditável (Onda 3B)',
              type: 'technical_export_package',
              status: 'generated',
              version: pkg.packageVersion,
              contentPreview: JSON.stringify({
                packageId: pkg.packageId,
                generatedAt: pkg.generatedAt,
                checksum: pkg.packageChecksum
              }),
              createdAt: now,
              updatedAt: now
            }
          ],
          logs: [
            ...prev.domain.logs,
            {
              id: `log-export-${now.getTime()}`,
              runId: prev.domain.run.id,
              macroLayerId: prev.domain.run.currentMacroLayerId,
              eventType: 'TECHNICAL_PACKAGE_EXPORTED',
              severity: 'info',
              message: `Pacote técnico ${pkg.packageId} gerado com checksum ${pkg.packageChecksum}. Execução remota permanece desabilitada.`,
              createdAt: now
            }
          ]
        }
      };
    });
  };

  const handleProjectEntryFieldChange = (field: keyof NewProjectBriefingForm, value: string) => {
    setProjectEntryForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateInitialBriefing = () => {
    const normalizedProjectName = projectEntryForm.projectName.trim() || 'Novo Projeto';
    const normalizedIdea = projectEntryForm.idea.trim() || 'Escopo inicial em definição.';
    const normalizedObjective = projectEntryForm.objective.trim() || 'Definir objetivo operacional da run.';
    const normalizedAudience = projectEntryForm.audience.trim() || 'Público ainda não definido.';
    const normalizedConstraints = projectEntryForm.constraints.trim() || 'Sem restrições adicionais informadas.';

    const briefing: GeneratedInitialBriefing = {
      summary: `${normalizedProjectName}: ${normalizedIdea} Objetivo: ${normalizedObjective} Público: ${normalizedAudience}.`,
      scope: [
        `Projeto: ${normalizedProjectName}`,
        `Objetivo principal: ${normalizedObjective}`,
        `Público alvo: ${normalizedAudience}`
      ],
      risks: [
        'Escopo inicial pode estar incompleto.',
        'Dependências técnicas precisam validação na macrocamada de arquitetura.',
        `Restrições declaradas: ${normalizedConstraints}`
      ],
      firstSteps: [
        'Revisar briefing e validar premissas do negócio.',
        'Iniciar macrocamada de Planejamento na esteira oficial.',
        'Designar agentes recomendados para descoberta e arquitetura.'
      ]
    };

    setGeneratedBriefing(briefing);
    setState(prev => ({
      ...prev,
      run: {
        ...prev.run,
        projectName: normalizedProjectName,
        briefingSummary: briefing.summary
      }
    }));
  };

  const handleGenerateInitialBriefingWithAi = async () => {
    setIsGeneratingBriefingWithAi(true);
    setBriefingAiError(null);

    try {
      const llmService = createSalaDevLlmService();
      const briefing = await llmService.generateBriefing(projectEntryForm);
      setGeneratedBriefing(briefing);
      setState(prev => ({
        ...prev,
        run: {
          ...prev.run,
          projectName: projectEntryForm.projectName.trim() || 'Novo Projeto',
          briefingSummary: briefing.summary
        }
      }));
    } catch (error) {
      setBriefingAiError((error as Error).message || 'Falha ao gerar briefing com IA. Usando fallback local.');
      handleGenerateInitialBriefing();
    } finally {
      setIsGeneratingBriefingWithAi(false);
    }
  };

  const handleStartPipeline = () => {
    if (!generatedBriefing) return;
    setPipelineStarted(true);
  };

  const handleStartNewProject = () => {
    setPipelineStarted(false);
    setGeneratedBriefing(null);
    setProjectEntryForm(emptyProjectEntryForm);
  };

  return {
    ...state,
    selectedEventId,
    setSelectedEventId,
    selectedMacroLayerId,
    setSelectedMacroLayerId,
    selectedBlockId,
    setSelectedBlockId,
    selectedHandoffId,
    setSelectedHandoffId,
    selectedGateId,
    setSelectedGateId,
    handleHandoffStatusChange,
    handleGateStatusChange,
    handleSummonAgent,
    handleAdvanceBlock,
    handleSummonBlockAgent,
    getActiveBlock,
    getBlockAgents,
    handleRunAgentStatusChange,
    handleDeactivateRunAgent,
    selectedEvent,
    handleGenerateTechnicalPackage,
    lastTechnicalPackage,
    projectEntryForm,
    generatedBriefing,
    isGeneratingBriefingWithAi,
    briefingAiError,
    pipelineStarted,
    handleProjectEntryFieldChange,
    handleGenerateInitialBriefing,
    handleGenerateInitialBriefingWithAi,
    handleStartPipeline,
    handleStartNewProject
  };
}
