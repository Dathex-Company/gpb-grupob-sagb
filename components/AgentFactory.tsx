import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Agent, AgentStatus, AgentTier, BusinessUnit, ModelProvider, Venture } from '../types';
import { Avatar } from './Avatar';
import { BackIcon, BotIcon, CloudUploadIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon, XIcon, CheckIcon, MailIcon, UserPlusIcon } from './Icon';
import { auth, db } from '../services/supabase';
import { addDoc, collection, deleteDoc, doc, Timestamp, updateDoc } from '../services/supabase';
import { deriveOperationalStatus, getOperationalStatusLabel, isAgentOperationallyBlocked } from '../utils/agentOperational';
import { getAgentAuthEmail, getHumanAccessStatusLabel, isHumanStructuralEntity, resolveHumanAccessStatus } from '../utils/humanIdentity';
import { authAdminService } from '../services/authAdmin';

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

type EntityType = 'HUMANO' | 'AGENTE' | 'HIBRIDO';
type RoleType = 'LIDERANCA' | 'CONSULTORIA' | 'AUDITORIA' | 'EXECUCAO' | 'MENTORIA' | 'APOIO';
type StructuralStatus = 'ESTRUTURAL' | 'EM_CONFIGURACAO' | 'HOMOLOGACAO' | 'ATIVO' | 'ARQUIVADO';
type OperationalStatus = 'ESTRUTURAL' | 'DISPONIVEL' | 'ATIVO';
type OperationalActivation = 'ATIVO_NASCIMENTO' | 'PREVISTO_GATILHO' | 'RESERVADO_FUTURO' | 'COMPARTILHADO';
type DnaStatus = 'SEM_DNA' | 'DNA_BASE' | 'DNA_PARCIAL' | 'DNA_COMPLETO' | 'REVISAR';
type OperationalClass = 'ECONOMICA' | 'BALANCEADA' | 'PREMIUM' | 'CRITICA';

interface FormCustomField {
    key: string;
    value: string;
}

interface AgentFormState {
    name: string;
    entityType: EntityType;
    email: string;
    usesEmail: boolean;
    shortDescription: string;
    avatarUrl: string;
    origin: string;
    ventureId: string;
    unitName: string;
    area: string;
    functionName: string;
    baseRoleUniversal: string;
    level: AgentTier;
    roleType: RoleType;
    structuralStatus: StructuralStatus;
    operationalStatus: OperationalStatus;
    operationalActivation: OperationalActivation;
    dnaStatus: DnaStatus;
    operationalClass: OperationalClass;
    allowedStacks: ModelProvider[];
    preferredModel: ModelProvider | '';
    aiMentor: string;
    humanOwner: string;
    projectId: string;
    authUserId: string;
    customFields: FormCustomField[];
}

const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';

const ENTITY_TYPE_OPTIONS: Array<{ value: EntityType; label: string }> = [
    { value: 'HUMANO', label: 'Humano' },
    { value: 'AGENTE', label: 'Agente' },
    { value: 'HIBRIDO', label: 'Hibrido' }
];

const LEVEL_OPTIONS: Array<{ value: AgentTier; label: string }> = [
    { value: 'ESTRATÉGICO', label: 'Estrategico' },
    { value: 'TÁTICO', label: 'Tatico' },
    { value: 'OPERACIONAL', label: 'Operacional' }
];

const ROLE_TYPE_OPTIONS: Array<{ value: RoleType; label: string }> = [
    { value: 'LIDERANCA', label: 'Lideranca' },
    { value: 'CONSULTORIA', label: 'Consultoria' },
    { value: 'AUDITORIA', label: 'Auditoria' },
    { value: 'EXECUCAO', label: 'Execucao' },
    { value: 'MENTORIA', label: 'Mentoria' },
    { value: 'APOIO', label: 'Apoio' }
];

const STRUCTURAL_STATUS_OPTIONS: Array<{ value: StructuralStatus; label: string }> = [
    { value: 'ESTRUTURAL', label: 'Estrutural' },
    { value: 'EM_CONFIGURACAO', label: 'Em configuracao' },
    { value: 'HOMOLOGACAO', label: 'Homologacao' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'ARQUIVADO', label: 'Arquivado' }
];

const OPERATIONAL_ACTIVATION_OPTIONS: Array<{ value: OperationalActivation; label: string }> = [
    { value: 'ATIVO_NASCIMENTO', label: 'Ativo no nascimento' },
    { value: 'PREVISTO_GATILHO', label: 'Previsto por gatilho' },
    { value: 'RESERVADO_FUTURO', label: 'Reservado para futuro' },
    { value: 'COMPARTILHADO', label: 'Compartilhado' }
];

const OPERATIONAL_STATUS_OPTIONS: Array<{ value: OperationalStatus; label: string }> = [
    { value: 'ESTRUTURAL', label: 'Estrutural' },
    { value: 'DISPONIVEL', label: 'Disponível' },
    { value: 'ATIVO', label: 'Ativo' }
];

const DNA_STATUS_OPTIONS: Array<{ value: DnaStatus; label: string }> = [
    { value: 'SEM_DNA', label: 'Sem DNA' },
    { value: 'DNA_BASE', label: 'DNA base' },
    { value: 'DNA_PARCIAL', label: 'DNA parcial' },
    { value: 'DNA_COMPLETO', label: 'DNA completo' },
    { value: 'REVISAR', label: 'Revisar' }
];

const OPERATIONAL_CLASS_OPTIONS: Array<{ value: OperationalClass; label: string }> = [
    { value: 'ECONOMICA', label: 'Economica' },
    { value: 'BALANCEADA', label: 'Balanceada' },
    { value: 'PREMIUM', label: 'Premium' },
    { value: 'CRITICA', label: 'Critica' }
];

const STACK_OPTIONS: Array<{ value: ModelProvider; label: string }> = [
    { value: 'llama_local', label: 'Llama' },
    { value: 'gemini', label: 'Gemini' },
    { value: 'deepseek', label: 'Deepseek' },
    { value: 'openai', label: 'Openai' },
    { value: 'claude', label: 'Claude' },
    { value: 'qwen', label: 'Qwen' }
];

const STRUCTURAL_TO_AGENT_STATUS: Record<StructuralStatus, AgentStatus> = {
    ESTRUTURAL: 'PLANNED',
    EM_CONFIGURACAO: 'PLANNED',
    HOMOLOGACAO: 'STAGING',
    ATIVO: 'ACTIVE',
    ARQUIVADO: 'BLOCKED'
};

const STRUCTURAL_STATUS_IMPACT: Record<StructuralStatus, string> = {
    ESTRUTURAL: 'Registro estrutural sem disponibilidade operacional.',
    EM_CONFIGURACAO: 'Cadastro em configuracao e ainda fora da operacao.',
    HOMOLOGACAO: 'Disponivel para testes controlados (staging).',
    ATIVO: 'Disponivel para operacao oficial no ecossistema.',
    ARQUIVADO: 'Registro desativado e bloqueado para uso operacional.'
};

const normalizeText = (value: string) =>
    String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();

const toDisplayOption = (value: any) => {
    const raw = String(value ?? '').trim();
    if (!raw || raw === '-') return '-';
    const normalized = raw.replace(/[_-]+/g, ' ').trim().toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const toCustomFieldObject = (fields: FormCustomField[]) => {
    const out: Record<string, string> = {};
    fields.forEach((field) => {
        const key = field.key.trim();
        if (!key) return;
        out[key] = field.value.trim();
    });
    return out;
};

const fromCustomFieldObject = (record?: Record<string, string>) => {
    if (!record || typeof record !== 'object') return [] as FormCustomField[];
    return Object.entries(record).map(([key, value]) => ({ key, value: String(value ?? '') }));
};

const parseCsvLine = (line: string) => {
    const out: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
            const next = line[i + 1];
            if (inQuotes && next === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
            continue;
        }

        if (char === ',' && !inQuotes) {
            out.push(current);
            current = '';
            continue;
        }

        current += char;
    }

    out.push(current);
    return out.map((value) => value.trim());
};

const parseCsvRecords = (content: string) => {
    const lines = content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length < 2) return [] as Array<Record<string, string>>;

    const headers = parseCsvLine(lines[0]).map((header) => normalizeText(header));

    return lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        return headers.reduce<Record<string, string>>((acc, header, index) => {
            acc[header] = values[index] ?? '';
            return acc;
        }, {});
    });
};

const readByAliases = (row: Record<string, string>, aliases: string[]) => {
    const normalizedAliases = aliases.map((alias) => normalizeText(alias));
    for (const alias of normalizedAliases) {
        const value = row[alias];
        if (value !== undefined && value !== null && String(value).trim() !== '') {
            return String(value).trim();
        }
    }
    return '';
};

const mapEntityToCollaboratorType = (entityType: EntityType) => {
    if (entityType === 'HUMANO') return 'HUMANO';
    if (entityType === 'HIBRIDO') return 'HIBRIDO';
    return 'AGENTE_IA';
};

const normalizeModelValue = (value: string): ModelProvider | '' => {
    const normalized = normalizeText(value);
    if (!normalized) return '';
    if (normalized.includes('llama')) return 'llama_local';
    if (normalized.includes('gemini')) return 'gemini';
    if (normalized.includes('deepseek') || normalized.includes('deep')) return 'deepseek';
    if (normalized.includes('openai') || normalized.includes('gpt')) return 'openai';
    if (normalized.includes('claude')) return 'claude';
    if (normalized.includes('qwen') || normalized.includes('quinn')) return 'qwen';
    return '';
};

const createEmptyForm = (activeBU: BusinessUnit, ventures: Venture[]): AgentFormState => ({
    name: '',
    entityType: 'AGENTE',
    email: '',
    usesEmail: false,
    shortDescription: '',
    avatarUrl: '',
    origin: 'Cadastro manual',
    ventureId: ventures[0]?.id || '',
    unitName: activeBU.name,
    area: '',
    functionName: '',
    baseRoleUniversal: '',
    level: 'TÁTICO',
    roleType: 'EXECUCAO',
    structuralStatus: 'EM_CONFIGURACAO',
    operationalStatus: 'ESTRUTURAL',
    operationalActivation: 'ATIVO_NASCIMENTO',
    dnaStatus: 'SEM_DNA',
    operationalClass: 'BALANCEADA',
    allowedStacks: ['deepseek'],
    preferredModel: 'deepseek',
    aiMentor: '',
    humanOwner: '',
    projectId: '',
    authUserId: '',
    customFields: []
});

const agentToForm = (agent: Agent, activeBU: BusinessUnit, ventures: Venture[]): AgentFormState => {
    const fallback = createEmptyForm(activeBU, ventures);
    const preferredModel = (agent.preferredModel || agent.modelProvider || '') as ModelProvider | '';

    return {
        ...fallback,
        name: agent.name || '',
        entityType: (agent.entityType || (agent.collaboratorType === 'HUMANO' ? 'HUMANO' : 'AGENTE')) as EntityType,
        email: agent.email || '',
        usesEmail: Boolean(agent.usesEmail || (agent.email && !isHumanStructuralEntity(agent))),
        shortDescription: agent.shortDescription || '',
        avatarUrl: agent.avatarUrl || '',
        origin: agent.origin || 'Cadastro manual',
        ventureId: agent.ventureId || fallback.ventureId,
        unitName: agent.unitName || agent.division || activeBU.name,
        area: agent.area || agent.sector || '',
        functionName: agent.functionName || agent.officialRole || '',
        baseRoleUniversal: agent.baseRoleUniversal || agent.officialRole || '',
        level: (agent.tier || 'TÁTICO') as AgentTier,
        roleType: (agent.roleType || 'EXECUCAO') as RoleType,
        structuralStatus: (agent.structuralStatus || (agent.status === 'ACTIVE' ? 'ATIVO' : agent.status === 'STAGING' ? 'HOMOLOGACAO' : agent.status === 'BLOCKED' ? 'ARQUIVADO' : 'EM_CONFIGURACAO')) as StructuralStatus,
        operationalStatus: deriveOperationalStatus(agent) as OperationalStatus,
        operationalActivation: (agent.operationalActivation || 'ATIVO_NASCIMENTO') as OperationalActivation,
        dnaStatus: (agent.dnaStatus || 'SEM_DNA') as DnaStatus,
        operationalClass: (agent.operationalClass || 'BALANCEADA') as OperationalClass,
        allowedStacks: Array.isArray(agent.allowedStacks) && agent.allowedStacks.length > 0
            ? agent.allowedStacks
            : preferredModel ? [preferredModel] : fallback.allowedStacks,
        preferredModel,
        aiMentor: agent.aiMentor || '',
        humanOwner: agent.humanOwner || '',
        projectId: agent.projectId || '',
        authUserId: agent.authUserId || '',
        customFields: fromCustomFieldObject(agent.customFields)
    };
};

const HelpTooltip = ({ text }: { text: string }) => {
    return (
        <div className="group relative ml-2 inline-flex items-center justify-center align-middle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-3.5 w-3.5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-50 w-56 p-2 bg-gray-900 text-white text-[10px] font-medium rounded-lg shadow-xl text-center leading-relaxed whitespace-normal break-words">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};

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
    const [isAuthorizing, setIsAuthorizing] = useState(false);
    const [isLoadingAuthPermissions, setIsLoadingAuthPermissions] = useState(false);
    const [authAdminPermissions, setAuthAdminPermissions] = useState({
        inviteUser: false,
        createUser: false,
        linkUser: false,
        listUsers: false
    });
    const [authorizationResult, setAuthorizationResult] = useState<{
        success: boolean;
        message: string;
        userId?: string;
    } | null>(null);

    const canInviteUsers = authAdminPermissions.inviteUser;
    const canCreateUsers = authAdminPermissions.createUser;

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

    const handleOpenNew = () => {
        setEditingAgentId(null);
        setForm(createEmptyForm(activeBU, ventures));
        setAuthorizationResult(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (agent: Agent) => {
        setEditingAgentId(agent.id);
        setForm(agentToForm(agent, activeBU, ventures));
        setAuthorizationResult(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setAuthorizationResult(null);
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
        setAuthorizationResult(null);
    };

    const handleUsesEmailChange = (usesEmail: boolean) => {
        setForm((prev) => ({
            ...prev,
            usesEmail,
            email: usesEmail ? prev.email : ''
        }));
        setAuthorizationResult(null);
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
        const status = STRUCTURAL_TO_AGENT_STATUS[structuralStatus] || 'STAGING';
        const operationalStatus = draft.dnaStatus === 'DNA_COMPLETO'
            ? (draft.operationalStatus === 'ATIVO' ? 'ATIVO' : 'DISPONIVEL')
            : 'ESTRUTURAL';

        return {
            name: draft.name.trim(),
            entityType: draft.entityType,
            email: draft.email.trim() || undefined,
            usesEmail: draft.entityType === 'HUMANO' || draft.entityType === 'HIBRIDO' ? true : draft.usesEmail,
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

    const validateDraft = (draft: AgentFormState) => {
        if (!draft.name.trim()) throw new Error('Nome e obrigatorio.');
        if (!draft.ventureId) throw new Error('Venture e obrigatoria.');
        if (!draft.functionName.trim()) throw new Error('Funcao principal e obrigatoria.');
        const requiresEmail = draft.entityType === 'HUMANO' || draft.entityType === 'HIBRIDO' || draft.usesEmail;
        if (requiresEmail && !draft.email.trim()) throw new Error('E-mail é obrigatório para este cadastro.');
        if (draft.allowedStacks.length === 0) throw new Error('Selecione ao menos uma stack permitida.');
        if (draft.preferredModel && !draft.allowedStacks.includes(draft.preferredModel)) {
            throw new Error('Modelo preferencial precisa estar dentro da stack permitida.');
        }
    };

    const persistAgent = async (draft: AgentFormState, originOverride?: string) => {
        validateDraft(draft);
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
            await persistAgent(form);
            setIsFormOpen(false);
            setEditingAgentId(null);
            setForm(createEmptyForm(activeBU, ventures));
            setAuthorizationResult(null);
            window.alert('Cadastro salvo com sucesso.');
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

    const resolveVentureId = (raw: string) => {
        const value = raw.trim();
        if (!value) return '';
        const byId = ventures.find((venture) => venture.id === value);
        if (byId) return byId.id;
        const byName = ventures.find((venture) => normalizeText(venture.name) === normalizeText(value));
        if (byName) return byName.id;
        return '';
    };

    const mapImportRowToForm = (row: Record<string, string>): AgentFormState => {
        const draft = createEmptyForm(activeBU, ventures);
        const typeRaw = readByAliases(row, ['tipo', 'type', 'entity_type']);
        const normalizedType = normalizeText(typeRaw);
        let entityType: EntityType = 'AGENTE';
        if (normalizedType.includes('human')) entityType = 'HUMANO';
        if (normalizedType.includes('hibr') || normalizedType.includes('hybrid')) entityType = 'HIBRIDO';

        const levelRaw = normalizeText(readByAliases(row, ['nivel', 'level', 'tier']));
        const level = levelRaw.includes('estrateg')
            ? 'ESTRATÉGICO'
            : levelRaw.includes('opera')
                ? 'OPERACIONAL'
                : 'TÁTICO';

        const structuralRaw = normalizeText(readByAliases(row, ['status estrutural', 'structural_status', 'structuralstatus']));
        const structuralStatus: StructuralStatus = structuralRaw.includes('ativo')
            ? 'ATIVO'
            : structuralRaw.includes('homo')
                ? 'HOMOLOGACAO'
                : structuralRaw.includes('arquiv')
                    ? 'ARQUIVADO'
                    : structuralRaw.includes('estrutural')
                        ? 'ESTRUTURAL'
                        : 'EM_CONFIGURACAO';

        const dnaRaw = normalizeText(readByAliases(row, ['status dna', 'dna_status', 'dnastatus']));
        const dnaStatus: DnaStatus = dnaRaw.includes('completo')
            ? 'DNA_COMPLETO'
            : dnaRaw.includes('parcial')
                ? 'DNA_PARCIAL'
                : dnaRaw.includes('base')
                    ? 'DNA_BASE'
                    : dnaRaw.includes('revis')
                        ? 'REVISAR'
                        : 'SEM_DNA';

        const stackRaw = readByAliases(row, ['stack permitida', 'allowed_stacks', 'stack']);
        const parsedStacks = stackRaw
            .split(/[;,|]/)
            .map((part) => normalizeModelValue(part))
            .filter((value): value is ModelProvider => Boolean(value));

        const preferredModel = normalizeModelValue(readByAliases(row, ['modelo preferencial', 'preferred_model', 'model']));
        const ventureRaw = readByAliases(row, ['venture', 'venture_id', 'marca']);
        const roleRaw = normalizeText(readByAliases(row, ['papel', 'role_type'])) || 'execucao';
        const activationRaw = normalizeText(readByAliases(row, ['ativacao operacional', 'operational_activation']));
        const classRaw = normalizeText(readByAliases(row, ['classe operacional', 'operational_class']));

        return {
            ...draft,
            name: readByAliases(row, ['nome', 'name']),
            entityType,
            email: readByAliases(row, ['email', 'e-mail', 'mail']),
            usesEmail: ['HUMANO', 'HIBRIDO'].includes(entityType)
                ? true
                : ['sim', 'yes', 'true', '1'].includes(normalizeText(readByAliases(row, ['usa email', 'uses_email', 'possui email']))),
            shortDescription: readByAliases(row, ['descricao', 'descricao curta', 'short_description', 'description']),
            origin: readByAliases(row, ['origem', 'origin']) || batchOrigin,
            ventureId: resolveVentureId(ventureRaw) || batchVentureId,
            unitName: readByAliases(row, ['unidade', 'unit', 'unit_name']) || activeBU.name,
            area: readByAliases(row, ['area']),
            functionName: readByAliases(row, ['funcao', 'function', 'function_name']),
            baseRoleUniversal: readByAliases(row, ['cargo-base universal', 'base_role_universal', 'base role', 'cargo base']),
            level,
            roleType: roleRaw.includes('lider')
                ? 'LIDERANCA'
                : roleRaw.includes('consult')
                    ? 'CONSULTORIA'
                    : roleRaw.includes('audit')
                        ? 'AUDITORIA'
                        : roleRaw.includes('mentor')
                            ? 'MENTORIA'
                            : roleRaw.includes('apoio')
                                ? 'APOIO'
                                : 'EXECUCAO',
            structuralStatus,
            operationalActivation: activationRaw.includes('gatilho')
                ? 'PREVISTO_GATILHO'
                : activationRaw.includes('reserv')
                    ? 'RESERVADO_FUTURO'
                    : activationRaw.includes('compart')
                        ? 'COMPARTILHADO'
                        : 'ATIVO_NASCIMENTO',
            dnaStatus,
            operationalClass: classRaw.includes('econom')
                ? 'ECONOMICA'
                : classRaw.includes('premium')
                    ? 'PREMIUM'
                    : classRaw.includes('crit')
                        ? 'CRITICA'
                        : 'BALANCEADA',
            allowedStacks: parsedStacks.length > 0 ? parsedStacks : draft.allowedStacks,
            preferredModel: preferredModel || (parsedStacks[0] || draft.preferredModel),
            aiMentor: readByAliases(row, ['mentor ia', 'ai_mentor']),
            humanOwner: readByAliases(row, ['responsavel humano', 'human_owner']),
            projectId: readByAliases(row, ['projeto', 'project_id']),
            customFields: []
        };
    };

    const handleBatchFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        setIsImporting(true);
        setImportFeedback('Processando lote...');
        try {
            const content = await file.text();
            let rows: Array<Record<string, string>> = [];
            if (file.name.toLowerCase().endsWith('.json')) {
                const parsed = JSON.parse(content);
                if (!Array.isArray(parsed)) throw new Error('JSON de importacao precisa ser um array de objetos.');
                rows = parsed.map((item) => {
                    const row: Record<string, string> = {};
                    Object.entries(item || {}).forEach(([key, value]) => {
                        row[normalizeText(key)] = String(value ?? '');
                    });
                    return row;
                });
            } else {
                rows = parseCsvRecords(content);
            }
            if (rows.length === 0) throw new Error('Arquivo sem registros validos para importar.');

            let successCount = 0;
            let failCount = 0;
            for (const row of rows) {
                try {
                    const draft = mapImportRowToForm(row);
                    if (!draft.name) {
                        failCount += 1;
                        continue;
                    }
                    const originLabel = `${batchOrigin} (Lote ${new Date().toISOString()})`;
                    await persistAgent(draft, originLabel);
                    successCount += 1;
                } catch (error) {
                    console.warn('Falha ao importar linha:', error);
                    failCount += 1;
                }
            }
            setImportFeedback(`Lote finalizado: ${successCount} importado(s), ${failCount} com falha.`);
        } catch (error: any) {
            console.error('Erro na importacao em lote:', error);
            setImportFeedback(`Falha na importacao: ${error?.message || 'erro desconhecido'}`);
        } finally {
            setIsImporting(false);
        }
    };

    const handleAuthorizeHuman = async (agent: Agent, method: 'create' | 'invite' = 'invite') => {
        if (isAuthorizing) return;
        if (method === 'invite' && !canInviteUsers) {
            window.alert('Você não possui permissão para enviar convites.');
            return;
        }
        if (method === 'create' && !canCreateUsers) {
            window.alert('Você não possui permissão elevada para criar usuário diretamente.');
            return;
        }
        
        setIsAuthorizing(true);
        setAuthorizationResult(null);
        
        try {
            const result = await authAdminService.authorizeHuman(agent, method, {
                workspaceId: activeWorkspaceId || undefined
            });
            
            setAuthorizationResult(result);
            
            if (result.success && result.userId) {
                // Atualizar o agente com o authUserId
                const updatedAgent = {
                    ...agent,
                    authUserId: result.userId
                };
                
                // Atualizar no banco de dados
                await updateDoc(doc(db, 'agents', agent.id), {
                    authUserId: result.userId,
                    updatedAt: Timestamp.now(),
                    updatedBy: (auth as any)?.currentUser?.id
                });
                
                // Atualizar o formulário se estiver editando este agente
                if (editingAgentId === agent.id && isFormOpen) {
                    setForm(prev => ({
                        ...prev,
                        authUserId: result.userId
                    }));
                }
                
                // Notificar o componente pai
                onActivate(updatedAgent);
                
                window.alert(`Autorização realizada com sucesso! ${result.message}`);
            } else {
                window.alert(`Falha na autorização: ${result.message}`);
            }
        } catch (error: any) {
            console.error('Erro ao autorizar humano:', error);
            setAuthorizationResult({
                success: false,
                message: error?.message || 'Erro desconhecido durante autorização'
            });
            window.alert(`Erro: ${error?.message || 'Falha ao autorizar humano'}`);
        } finally {
            setIsAuthorizing(false);
        }
    };

    const renderBadge = (label: string, tone: 'default' | 'green' | 'yellow' | 'purple' | 'gray' = 'default') => {
        const toneClass = {
            default: 'bg-slate-100 text-slate-700 border-slate-200',
            green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            yellow: 'bg-amber-100 text-amber-700 border-amber-200',
            purple: 'bg-violet-100 text-violet-700 border-violet-200',
            gray: 'bg-gray-100 text-gray-600 border-gray-200'
        }[tone];
        return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${toneClass}`}>{label}</span>;
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-gray-50 dark:bg-sagb-bg font-nunito transition-colors duration-300">
            <header className="flex h-20 shrink-0 items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white dark:bg-sagb-panel px-8 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <button onClick={onNavigateToEcosystem} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100">
                        <BackIcon className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight text-bitrix-nav">Quadro de Elite</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">Cadastro estrutural de humanos e agentes</p>
                    </div>
                </div>
                <button onClick={handleOpenNew} className="inline-flex items-center gap-2 rounded-xl bg-bitrix-nav px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg transition hover:bg-black">
                    <PlusIcon className="h-3.5 w-3.5" />
                    Novo cadastro
                </button>
            </header>

            <div className="grid flex-1 gap-0 overflow-hidden grid-cols-1">
                <section className="flex min-w-0 flex-col overflow-hidden bg-white dark:bg-sagb-panel transition-colors duration-300">
                    <div className="flex flex-wrap items-end gap-3 border-b border-gray-100 dark:border-white/5 px-6 py-4">
                        <label className="relative min-w-[280px] flex-1">
                            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar por nome, area, funcao, origem..." className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 py-2.5 pl-10 pr-3 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
                        </label>
                        <div className="grid min-w-[240px] gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Venture do lote</span>
                            <select value={batchVentureId} onChange={(event) => setBatchVentureId(event.target.value)} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300">
                                <option value="">Selecionar...</option>
                                {ventures.map((venture) => <option key={venture.id} value={venture.id}>{venture.name}</option>)}
                            </select>
                        </div>
                        <div className="grid min-w-[220px] gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">Origem do lote</span>
                            <input value={batchOrigin} onChange={(event) => setBatchOrigin(event.target.value)} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
                        </div>
                        <input ref={batchInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleBatchFile} />
                        <button onClick={() => batchInputRef.current?.click()} disabled={isImporting} className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50">
                            <CloudUploadIcon className="h-4 w-4" />
                            {isImporting ? 'Importando...' : 'Importar lote'}
                        </button>
                        <button
                            onClick={() => setShowAdvancedColumns((prev) => !prev)}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-gray-700 transition hover:bg-gray-50"
                        >
                            {showAdvancedColumns ? 'Colunas essenciais' : 'Colunas avancadas'}
                        </button>
                    </div>
                    {importFeedback && <div className="border-b border-gray-100 bg-gray-50 px-6 py-2 text-[11px] font-semibold text-gray-600">{importFeedback}</div>}

                    <div className="flex-1 overflow-auto">
                        <table className={`${showAdvancedColumns ? 'min-w-[1700px]' : 'min-w-[1120px]'} table-fixed border-collapse`}>
                            <thead className="sticky top-0 z-10 bg-white dark:bg-sagb-panel shadow-sm">
                                <tr className="border-b border-gray-100 dark:border-white/5 text-left text-[10px] font-black uppercase tracking-[0.14em] text-gray-400">
                                    <th className="px-3 py-3">Nome</th>
                                    <th className="px-3 py-3">Tipo</th>
                                    <th className="px-3 py-3">Venture</th>
                                    <th className="px-3 py-3">Unidade</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Area</th>}
                                    <th className="px-3 py-3">Funcao</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Cargo-base</th>}
                                    <th className="px-3 py-3">Nivel</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Papel</th>}
                                    <th className="px-3 py-3">Status estrutural</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Ativacao</th>}
                                    <th className="px-3 py-3">DNA</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Status operacional</th>}
                                    {showAdvancedColumns && <th className="px-3 py-3">Classe</th>}
                                    {showAdvancedColumns && <th className="px-3 py-3">Stack permitida</th>}
                                    {showAdvancedColumns && <th className="px-3 py-3">Modelo preferencial</th>}
                                    <th className="px-3 py-3">Responsavel humano</th>
                                    {showAdvancedColumns && <th className="px-3 py-3">Documentos</th>}
                                    {showAdvancedColumns && <th className="px-3 py-3">Origem</th>}
                                    <th className="px-3 py-3">Ultima atualizacao</th>
                                    <th className="px-3 py-3 text-center">Acoes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAgents.map((agent) => {
                                    const ventureName = ventures.find((venture) => venture.id === agent.ventureId)?.name || agent.company || '-';
                                    const stackText = Array.isArray(agent.allowedStacks) && agent.allowedStacks.length > 0
                                        ? agent.allowedStacks.map((stack) => toDisplayOption(stack)).join(', ')
                                        : toDisplayOption(agent.modelProvider || '-');
                                    const updatedAt = (agent as any).updatedAt || (agent as any).updated_at || (agent as any).createdAt;
                                    const updatedAtText = updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : '-';
                                    const structuralStatus = agent.structuralStatus || (agent.status === 'ACTIVE' ? 'ATIVO' : agent.status === 'STAGING' ? 'HOMOLOGACAO' : 'EM_CONFIGURACAO');
                                    const dnaStatus = agent.dnaStatus || 'SEM_DNA';
                                    const operationalStatus = deriveOperationalStatus(agent);
                                    const isBlocked = isAgentOperationallyBlocked(agent);
                                    const humanAccessStatus = resolveHumanAccessStatus(agent, authUsersByEmail, activeSessionEmail);
                                    return (
                                        <tr key={agent.id} className={`border-b border-gray-100 dark:border-white/5 text-[12px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${isBlocked ? 'opacity-55' : ''}`}>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={agent.name} url={agent.avatarUrl} className="h-9 w-9" />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-[12px] font-bold text-gray-800 dark:text-white">{agent.name}</p>
                                                        <p className="truncate text-[10px] font-semibold text-gray-400 dark:text-gray-500">{agent.shortDescription || agent.officialRole || '-'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-2">{toDisplayOption(agent.entityType || (agent.collaboratorType === 'HUMANO' ? 'HUMANO' : 'AGENTE'))}</td>
                                            <td className="px-3 py-2">{ventureName}</td>
                                            <td className="px-3 py-2">{agent.unitName || agent.division || '-'}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{isHumanStructuralEntity(agent) ? <div className="space-y-1"><div>{renderBadge(getHumanAccessStatusLabel(humanAccessStatus), humanAccessStatus === 'AUTENTICADO' ? 'green' : humanAccessStatus === 'AUTENTICAVEL' ? 'purple' : 'gray')}</div><div className="text-[10px] text-gray-400 truncate">{getAgentAuthEmail(agent) || '-'}</div></div> : '-'}</td>}
                                            {showAdvancedColumns && <td className="px-3 py-2">{agent.area || agent.sector || '-'}</td>}
                                            <td className="px-3 py-2">{agent.functionName || agent.officialRole || '-'}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{agent.baseRoleUniversal || '-'}</td>}
                                            <td className="px-3 py-2">{toDisplayOption(agent.tier || '-')}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.roleType || '-')}</td>}
                                            <td className="px-3 py-2">{renderBadge(toDisplayOption(structuralStatus), structuralStatus === 'ATIVO' ? 'green' : structuralStatus === 'HOMOLOGACAO' ? 'purple' : 'gray')}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.operationalActivation || '-')}</td>}
                                            <td className="px-3 py-2">{renderBadge(dnaStatus === 'DNA_COMPLETO' ? 'DNA Completo' : dnaStatus === 'SEM_DNA' ? 'Sem DNA' : toDisplayOption(dnaStatus), dnaStatus === 'DNA_COMPLETO' ? 'green' : dnaStatus === 'DNA_PARCIAL' ? 'yellow' : 'gray')}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{renderBadge(getOperationalStatusLabel(operationalStatus), operationalStatus === 'ATIVO' ? 'green' : operationalStatus === 'DISPONIVEL' ? 'purple' : 'gray')}</td>}
                                            {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.operationalClass || '-')}</td>}
                                            {showAdvancedColumns && <td className="px-3 py-2">{stackText}</td>}
                                            {showAdvancedColumns && <td className="px-3 py-2">{toDisplayOption(agent.preferredModel || agent.modelProvider || '-')}</td>}
                                            <td className="px-3 py-2">{agent.humanOwner || '-'}</td>
                                            {showAdvancedColumns && <td className="px-3 py-2">{Number(agent.docCount || 0)}</td>}
                                            {showAdvancedColumns && <td className="px-3 py-2">{agent.origin || '-'}</td>}
                                            <td className="px-3 py-2 text-[11px]">{updatedAtText}</td>
                                            <td className="px-3 py-2">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button onClick={() => handleOpenEdit(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600" title="Editar"><PencilIcon className="h-3.5 w-3.5" /></button>
                                                    {onManageIntelligence && <button onClick={() => onManageIntelligence(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-purple-50 hover:text-purple-600" title="Status DNA"><BotIcon className="h-3.5 w-3.5" /></button>}
                                                    {onRemove && <button onClick={() => handleDelete(agent)} className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-red-50 hover:text-red-600" title="Excluir"><TrashIcon className="h-3.5 w-3.5" /></button>}
                                                    {canInviteUsers && isHumanStructuralEntity(agent) && !agent.authUserId && agent.email && (
                                                        <button 
                                                            onClick={() => handleAuthorizeHuman(agent, 'invite')}
                                                            disabled={isAuthorizing || isLoadingAuthPermissions}
                                                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-green-50 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Autorizar Usuário"
                                                        >
                                                            {isAuthorizing ? (
                                                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-green-500"></div>
                                                            ) : (
                                                                <UserPlusIcon className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredAgents.length === 0 && <tr><td colSpan={showAdvancedColumns ? 22 : 11} className="px-6 py-10 text-center text-sm font-semibold text-gray-400">Nenhum cadastro encontrado para o filtro atual.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </section>

                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4 md:p-8 animate-in fade-in duration-200">
                        <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-gray-200/70 dark:border-white/10 bg-white dark:bg-sagb-panel shadow-2xl transition-colors duration-300">
                            <div className="flex items-start justify-between border-b border-gray-100 dark:border-white/10 px-8 py-6 transition-colors duration-300">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight text-bitrix-nav dark:text-sagb-text">{editingAgentId ? 'Editar cadastro' : 'Novo cadastro'}</h2>
                                    <p className="mt-1 text-[11px] font-semibold text-gray-500">Quadro estrutural sem exposição de DNA, cultura ou compliance.</p>
                                </div>
                                <button onClick={handleCloseForm} className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700"><XIcon className="h-6 w-6" /></button>
                            </div>
                            <div className="flex-1 space-y-8 overflow-y-auto px-8 py-6 custom-scrollbar">
                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Identidade</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Nome *<HelpTooltip text="Nome principal de apresentação na plataforma" /></span>
                                            <input value={form.name} onChange={(e) => setFormField('name', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-bg-2 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-sagb-text outline-none focus:border-indigo-300" />
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Tipo *<HelpTooltip text="Define se a entidade é um Agente IA, um Humano da equipe, ou modelo Híbrido" /></span>
                                                <select value={form.entityType} onChange={(e) => handleEntityTypeChange(e.target.value as EntityType)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1F2937] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white outline-none focus:border-indigo-300">{ENTITY_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Origem<HelpTooltip text="Sistema, lote ou fluxo pelo qual este cadastro foi criado" /></span>
                                                <input value={form.origin} onChange={(e) => setFormField('origin', e.target.value)} className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1F2937] px-4 py-3 text-sm font-semibold text-gray-700 dark:text-white outline-none focus:border-indigo-300" />
                                            </label>
                                        </div>
                                        {(form.entityType === 'AGENTE') && (
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Agente usa e-mail próprio?<HelpTooltip text="Agentes que interagem externamente podem precisar de uma conta de e-mail própria" /></span>
                                                <select value={form.usesEmail ? 'sim' : 'nao'} onChange={(e) => handleUsesEmailChange(e.target.value === 'sim')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="nao">Não</option><option value="sim">Sim</option></select>
                                                <p className="text-[10px] font-semibold text-gray-500">Defina se este agente terá identidade operacional por e-mail para ações externas.</p>
                                            </label>
                                        )}
                                        {(form.entityType !== 'AGENTE' || form.usesEmail) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <label className="space-y-1">
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">E-mail {shouldRequireEmail ? '*' : ''}<HelpTooltip text="Obrigatório para Humanos autenticarem no sistema" /></span>
                                                    <input type="email" value={form.email} onChange={(e) => setFormField('email', e.target.value)} placeholder={form.entityType === 'AGENTE' ? 'agente@grupob.com.br' : 'humano@grupob.com.br'} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                                    <p className="text-[10px] font-semibold text-gray-500">{form.entityType === 'AGENTE' ? 'E-mail estrutural para ações externas.' : 'E-mail base. O sistema usa fallback por e-mail caso não haja ID vinculado.'}</p>
                                                </label>
                                                {form.entityType !== 'AGENTE' && (
                                                    <label className="space-y-1 rounded-2xl border border-gray-200/80 dark:border-white/10 bg-gray-50/40 dark:bg-sagb-bg-2/40 p-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Conta de login vinculada<HelpTooltip text="Vínculo interno seguro entre o perfil humano e a conta de acesso" /></span>
                                                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${form.authUserId ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-gray-200 bg-white text-gray-500 dark:border-white/10 dark:bg-sagb-panel dark:text-gray-400'}`}>
                                                                {form.authUserId ? 'Vinculada' : 'Pendente'}
                                                            </span>
                                                        </div>
                                                        <select value={form.authUserId} onChange={(e) => setFormField('authUserId', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">
                                                            <option value="">Sem conta vinculada (usar e-mail como referência)</option>
                                                            {Object.values(authUsersByEmail).map((u) => (
                                                                <option key={u.id} value={u.id}>{u.email} ({u.id.substring(0, 8)}...)</option>
                                                            ))}
                                                        </select>
                                                        <p className="text-[10px] font-semibold text-gray-500">Este vínculo mantém o ID interno e não altera permissões já protegidas no backend.</p>
                                                    </label>
                                                )}
                                            </div>
                                        )}
                                        {form.entityType !== 'AGENTE' && (
                                            <div className="space-y-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-sagb-bg-2/50 p-4">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-600 dark:text-gray-300">Acesso ao sistema</h4>
                                                        <p className="mt-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                                                            {!form.email
                                                                ? 'Informe um e-mail para habilitar o fluxo de autorização.'
                                                                : form.authUserId
                                                                    ? 'Humano autorizado e conta de acesso vinculada com segurança.'
                                                                    : 'Humano ainda sem autorização final. Escolha uma ação para concluir o acesso.'}
                                                        </p>
                                                    </div>
                                                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${!form.email ? 'border-amber-200 bg-amber-50 text-amber-700' : form.authUserId ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-indigo-200 bg-indigo-50 text-indigo-700'}`}>
                                                        {!form.email ? 'Falta e-mail' : form.authUserId ? 'Autorizado' : 'Pendente'}
                                                    </span>
                                                </div>

                                                {!form.email && (
                                                    <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-[11px] font-semibold text-amber-700">
                                                        Sem e-mail não é possível enviar convite nem criar conta de acesso.
                                                    </div>
                                                )}

                                                {form.email && !form.authUserId && (
                                                    <>
                                                        {!canInviteUsers && !isLoadingAuthPermissions && (
                                                            <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-[11px] font-semibold text-amber-700">
                                                                Você não possui permissão para autorizar usuários neste workspace.
                                                            </div>
                                                        )}

                                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                                            <button
                                                                onClick={() => handleAuthorizeHuman(currentEditingAgent || form, 'invite')}
                                                                disabled={isAuthorizing || isLoadingAuthPermissions || !form.email || !canInviteUsers}
                                                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {isAuthorizing ? (
                                                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500"></div>
                                                                ) : (
                                                                    <MailIcon className="h-3.5 w-3.5" />
                                                                )}
                                                                Enviar convite
                                                            </button>
                                                            <button
                                                                onClick={() => handleAuthorizeHuman(currentEditingAgent || form, 'create')}
                                                                disabled={isAuthorizing || isLoadingAuthPermissions || !form.email || !canCreateUsers}
                                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                {isAuthorizing ? (
                                                                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-slate-500"></div>
                                                                ) : (
                                                                    <UserPlusIcon className="h-3.5 w-3.5" />
                                                                )}
                                                                Criar conta
                                                            </button>
                                                        </div>
                                                    </>
                                                )}

                                                {form.authUserId && (
                                                    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 px-3 py-2 text-[11px] font-semibold text-emerald-700">
                                                        Conta de acesso vinculada com referência interna {form.authUserId.substring(0, 8)}...
                                                    </div>
                                                )}

                                                {authorizationResult && (
                                                    <div className={`rounded-xl border px-3 py-2 text-[11px] font-semibold ${authorizationResult.success ? 'border-emerald-200 bg-emerald-50/70 text-emerald-700' : 'border-amber-200 bg-amber-50/70 text-amber-700'}`}>
                                                        {authorizationResult.message}
                                                        {authorizationResult.userId && (
                                                            <div className="mt-1 text-[10px] font-medium text-gray-600 dark:text-gray-300">
                                                                Referência interna: {authorizationResult.userId.substring(0, 8)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="text-[10px] font-medium text-gray-500 dark:text-gray-400 space-y-1">
                                                    <p><strong>Enviar convite:</strong> fluxo recomendado para o usuário configurar a própria senha.</p>
                                                    <p><strong>Criar conta:</strong> ação avançada para perfis com permissão elevada.</p>
                                                </div>
                                            </div>
                                        )}
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Descrição curta<HelpTooltip text="Resumo rápido visível nas listas e headers do chat" /></span>
                                            <textarea value={form.shortDescription} onChange={(e) => setFormField('shortDescription', e.target.value)} rows={2} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                        </label>
                                        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-sagb-bg-2 p-4 transition-colors">
                                            <Avatar name={form.name || 'Novo Cadastro'} url={form.avatarUrl} className="h-16 w-16 shadow-md" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-bold text-gray-800 dark:text-white">Avatar / Foto <HelpTooltip text="A foto aparecerá nos chats e no sistema para Humanos e Agentes" /></p>
                                                <p className="truncate text-[10px] font-semibold text-gray-500 dark:text-gray-400">Imagem pública para visualização de lista</p>
                                            </div>
                                            <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                                            <button onClick={() => avatarInputRef.current?.click()} className="rounded-xl border border-gray-300 dark:border-white/10 bg-white dark:bg-sagb-panel px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 shadow-sm transition hover:bg-gray-50 dark:hover:bg-white/10">Alterar Foto</button>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Estrutura organizacional</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Venture *<HelpTooltip text="A qual negócio/venture o agente/humano pertence principalmente" /></span>
                                            <select value={form.ventureId} onChange={(e) => setFormField('ventureId', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Selecionar...</option>{ventures.map((venture) => <option key={venture.id} value={venture.id}>{venture.name}</option>)}</select>
                                        </label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Unidade<HelpTooltip text="Departamento ou divisão interna" /></span>
                                                <input value={form.unitName} onChange={(e) => setFormField('unitName', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Área<HelpTooltip text="Setor específico de atuação" /></span>
                                                <input value={form.area} onChange={(e) => setFormField('area', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Função principal *<HelpTooltip text="O cargo ou função oficial que será listado" /></span>
                                                <input value={form.functionName} onChange={(e) => setFormField('functionName', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Cargo-base (taxonomia)<HelpTooltip text="Mapeamento universal para cruzamento de dados" /></span>
                                                <input value={form.baseRoleUniversal} onChange={(e) => setFormField('baseRoleUniversal', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                            </label>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Nível<HelpTooltip text="O nível hierárquico define como o motor trata a autoridade desta entidade" /></span>
                                                <select value={form.level} onChange={(e) => setFormField('level', e.target.value as AgentTier)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{LEVEL_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                            </label>
                                            <label className="space-y-1">
                                                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Papel de atuação<HelpTooltip text="A natureza primária das entregas" /></span>
                                                <select value={form.roleType} onChange={(e) => setFormField('roleType', e.target.value as RoleType)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{ROLE_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                            </label>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Status</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status estrutural<HelpTooltip text="O status macro de ciclo de vida do cadastro" /></span>
                                            <select value={form.structuralStatus} onChange={(e) => setFormField('structuralStatus', e.target.value as StructuralStatus)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{STRUCTURAL_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                            <p className="text-[10px] font-semibold text-gray-500">{STRUCTURAL_STATUS_IMPACT[form.structuralStatus]}</p>
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status DNA (indicador)<HelpTooltip text="Reflete a situação atual do DNA na Governança. Se não estiver completo, o operacional ficará bloqueado." /></span>
                                            <select value={form.dnaStatus} onChange={(e) => setFormField('dnaStatus', e.target.value as DnaStatus)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{DNA_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Status operacional<HelpTooltip text="Disponibilidade real para uso nas interfaces de orquestração" /></span>
                                            <select value={form.operationalStatus} onChange={(e) => setFormField('operationalStatus', e.target.value as OperationalStatus)} disabled={form.dnaStatus !== 'DNA_COMPLETO'} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300 disabled:bg-gray-100 disabled:text-gray-400">{OPERATIONAL_STATUS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                            <p className="text-[10px] font-semibold text-gray-500">{form.dnaStatus === 'DNA_COMPLETO' ? 'Com DNA válido, pode operar.' : 'Sem DNA válido, operação bloqueada.'}</p>
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Ativação operacional<HelpTooltip text="Regra que dita como o agente acorda" /></span>
                                            <select value={form.operationalActivation} onChange={(e) => setFormField('operationalActivation', e.target.value as OperationalActivation)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{OPERATIONAL_ACTIVATION_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Operação</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Classe operacional<HelpTooltip text="Determina SLAs de resposta, prioridade de processamento e recursos dedicados" /></span>
                                            <select value={form.operationalClass} onChange={(e) => setFormField('operationalClass', e.target.value as OperationalClass)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300">{OPERATIONAL_CLASS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                        </label>
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Stack permitida (múltiplos)<HelpTooltip text="Quais motores/modelos de IA esta entidade está autorizada a utilizar" /></span>
                                            <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-3">
                                                {STACK_OPTIONS.map((option) => (
                                                    <label key={option.value} className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all">
                                                        <input type="checkbox" checked={form.allowedStacks.includes(option.value)} onChange={() => toggleStack(option.value)} className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500" />
                                                        {option.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Modelo preferencial<HelpTooltip text="O modelo padrão escolhido caso o orquestrador não force uma stack específica" /></span>
                                            <select value={form.preferredModel} onChange={(e) => setFormField('preferredModel', e.target.value as ModelProvider | '')} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Selecionar...</option>{STACK_OPTIONS.filter((option) => form.allowedStacks.includes(option.value)).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Governança e Responsabilidade</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Mentor IA<HelpTooltip text="Agente responsável por on-boarding e correção deste agente" /></span>
                                            <select value={form.aiMentor} onChange={(e) => setFormField('aiMentor', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Nenhum...</option>{mentorCandidates.map((candidate) => <option key={candidate.id} value={candidate.name}>{candidate.name}</option>)}</select>
                                        </label>
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Responsável humano<HelpTooltip text="O humano do time responsável por auditar o DNA e comportamento desta entidade" /></span>
                                            <select value={form.humanOwner} onChange={(e) => setFormField('humanOwner', e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300"><option value="">Nenhum...</option>{mentorCandidates.filter((c) => isHumanStructuralEntity(c)).map((candidate) => <option key={candidate.id} value={candidate.name}>{candidate.name}</option>)}</select>
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400 border-b border-gray-100 pb-2">Integração Operacional</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-400">Projeto Vinculado (Opcional)<HelpTooltip text="Vincula a entidade nativamente a um projeto no sistema para roteamento de memória" /></span>
                                            <input value={form.projectId} onChange={(e) => setFormField('projectId', e.target.value)} placeholder="ID ou Nome do Projeto" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                        </label>
                                    </div>
                                </section>

                                <section className="space-y-4 pb-10">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                        <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-gray-400">Campos customizados</h3>
                                        <button onClick={addCustomField} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-600 shadow-sm transition hover:bg-gray-50">+ Campo</button>
                                    </div>
                                    <div className="space-y-3">
                                        {form.customFields.length === 0 && <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-4 text-center text-[11px] font-semibold text-gray-400">Nenhum campo customizado adicionado.</p>}
                                        {form.customFields.map((field, index) => (
                                            <div key={`${index}-${field.key}`} className="flex items-center gap-3">
                                                <input value={field.key} onChange={(e) => upsertCustomField(index, { key: e.target.value })} placeholder="Chave" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                                <input value={field.value} onChange={(e) => upsertCustomField(index, { value: e.target.value })} placeholder="Valor" className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-indigo-300" />
                                                <button onClick={() => removeCustomField(index)} className="rounded-xl border border-red-100 bg-red-50 p-3 text-red-500 transition hover:bg-red-500 hover:text-white"><TrashIcon className="h-4 w-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            <div className="flex shrink-0 items-center justify-between border-t border-gray-100 dark:border-white/10 px-8 py-5 transition-colors">
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{editingAgentId ? 'Edicao de cadastro estrutural.' : 'Cadastro novo para escalar o ecossistema.'}</p>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleCloseForm} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-sagb-panel px-5 py-2.5 text-xs font-black uppercase tracking-wider text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-all">Cancelar</button>
                                    <button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-bitrix-nav px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md hover:bg-black hover:shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50">{isSaving ? 'Salvando...' : 'Salvar cadastro'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgentFactory;
