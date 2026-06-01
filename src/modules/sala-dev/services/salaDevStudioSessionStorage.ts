import type {
  SalaDevStudioApproval,
  SalaDevStudioCommandLog,
  SalaDevStudioDiffBlock,
  SalaDevStudioEvent,
  SalaDevStudioImpactedFile,
  SalaDevStudioPlanStep,
  SalaDevStudioSession,
} from '../types/salaDev.studio';

const STORAGE_PREFIX = 'sala_dev_studio_session:';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const nowIso = () => new Date().toISOString();

const defaultPlanSteps = (): SalaDevStudioPlanStep[] => [
  {
    id: createId('step'),
    title: 'Entender objetivo e escopo',
    description: 'Consolidar pedido do usuário, restrições, riscos e critérios de aceite.',
    ownerAgent: 'CA-01 / CA-02 / CA-03',
    status: 'pending',
  },
  {
    id: createId('step'),
    title: 'Mapear arquivos e impacto',
    description: 'Identificar arquivos prováveis, módulos afetados e dependências da alteração.',
    ownerAgent: 'CA-04 / CA-05 / CA-06',
    status: 'pending',
  },
  {
    id: createId('step'),
    title: 'Gerar diff controlado',
    description: 'Propor alterações em formato revisável antes de qualquer aplicação real.',
    ownerAgent: 'CA-06 / CA-07 / CA-12',
    status: 'pending',
  },
  {
    id: createId('step'),
    title: 'Revisar qualidade e segurança',
    description: 'Validar riscos técnicos, regressões, segurança e aderência ao padrão SagB.',
    ownerAgent: 'CA-08 / CA-10 / CA-15',
    status: 'pending',
  },
  {
    id: createId('step'),
    title: 'Simular build, preview e auditoria',
    description: 'Registrar logs, resultado simulado e parecer final da sessão.',
    ownerAgent: 'CA-09 / CA-11 / CA-18',
    status: 'pending',
  },
];

const defaultImpactedFiles = (): SalaDevStudioImpactedFile[] => [
  {
    id: createId('file'),
    path: 'src/modules/sala-dev/components/SalaDevStudioPanel.tsx',
    action: 'create',
    reason: 'Criar a experiência visual de Studio dentro da Sala Dev.',
    risk: 'medium',
  },
  {
    id: createId('file'),
    path: 'src/modules/sala-dev/types/salaDev.studio.ts',
    action: 'create',
    reason: 'Definir contrato de sessão, plano, diff, aprovações e eventos.',
    risk: 'low',
  },
  {
    id: createId('file'),
    path: 'src/modules/sala-dev/components/DevRoomView.tsx',
    action: 'update',
    reason: 'Adicionar alternância entre esteira operacional e Studio.',
    risk: 'medium',
  },
];

const defaultDiffs = (): SalaDevStudioDiffBlock[] => [
  {
    id: createId('diff'),
    filePath: 'src/modules/sala-dev/components/SalaDevStudioPanel.tsx',
    title: 'Novo painel Studio',
    before: '// painel inexistente',
    after: 'export const SalaDevStudioPanel = () => {\n  return <div>Studio operacional da Sala Dev</div>;\n};',
    status: 'proposed',
  },
];

const defaultApprovals = (): SalaDevStudioApproval[] => [
  {
    id: createId('approval'),
    label: 'Aprovar plano de execução',
    status: 'pending',
    createdAt: nowIso(),
  },
  {
    id: createId('approval'),
    label: 'Aprovar diff simulado',
    status: 'pending',
    createdAt: nowIso(),
  },
];

const defaultCommandLogs = (): SalaDevStudioCommandLog[] => [
  {
    id: createId('cmd'),
    command: 'npm run build',
    status: 'idle',
    output: 'Aguardando aprovação para simulação de build.',
    createdAt: nowIso(),
  },
];

const defaultEvents = (projectName: string): SalaDevStudioEvent[] => [
  {
    id: createId('event'),
    type: 'session',
    message: `Sessão Studio criada para ${projectName || 'projeto atual'}.`,
    createdAt: nowIso(),
  },
];

export function createStudioSession(input: {
  runId: string;
  projectName: string;
  objective?: string;
}): SalaDevStudioSession {
  const createdAt = nowIso();
  return {
    id: createId('studio'),
    runId: input.runId,
    projectName: input.projectName || 'Projeto Sala Dev',
    objective: input.objective || 'Transformar a Sala Dev em Studio operacional autônomo.',
    status: 'draft',
    createdAt,
    updatedAt: createdAt,
    planSteps: defaultPlanSteps(),
    impactedFiles: defaultImpactedFiles(),
    diffs: defaultDiffs(),
    approvals: defaultApprovals(),
    events: defaultEvents(input.projectName),
    commandLogs: defaultCommandLogs(),
    previewUrl: 'about:blank',
  };
}

export function loadStudioSession(runId: string): SalaDevStudioSession | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${runId}`);
    if (!raw) return null;
    return JSON.parse(raw) as SalaDevStudioSession;
  } catch (error) {
    console.warn('[SalaDevStudio] Falha ao carregar sessão:', error);
    return null;
  }
}

export function saveStudioSession(session: SalaDevStudioSession): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${session.runId}`, JSON.stringify({
      ...session,
      updatedAt: nowIso(),
    }));
  } catch (error) {
    console.warn('[SalaDevStudio] Falha ao salvar sessão:', error);
  }
}

export function clearStudioSession(runId: string): void {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${runId}`);
  } catch (error) {
    console.warn('[SalaDevStudio] Falha ao limpar sessão:', error);
  }
}

export function appendStudioEvent(
  session: SalaDevStudioSession,
  event: Omit<SalaDevStudioEvent, 'id' | 'createdAt'>,
): SalaDevStudioSession {
  return {
    ...session,
    updatedAt: nowIso(),
    events: [
      {
        id: createId('event'),
        createdAt: nowIso(),
        ...event,
      },
      ...session.events,
    ].slice(0, 80),
  };
}

