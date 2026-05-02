
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Agent, Message, Sender, BusinessUnit, AgentTier, AgentStatus, Topic, PersonaConfig, UserProfile, ModelProvider, VaultItem, ChatAttachment } from '../types';
import { startAgentSession, generateTitleOptions, transcribeAudio, generateTaskSuggestions, consolidateChatMemory } from '../services/gemini';
import { streamDeepSeekResponse, DeepSeekMessage } from '../services/deepseek';
import { streamLlamaLocalResponse, LlamaMessage } from '../services/llamaLocal';
import { streamProxyProviderResponse, ProxyProviderMessage } from '../services/providerProxy';
import { getProvidersHealth, providerHealthToBadge, ProvidersHealthMap } from '../services/providerHealth';
import { resolveAgentBasePrompt } from '../services/agentDna';
import { createMessageTelemetry, detectBotQualityEvents, detectUserQualityEvents, getTurnIdFromMessages, persistQualityEvent, persistQualityEventsBatch } from '../services/qualitySensor';
import {
    appendIntelligenceFlowStep,
    createTaskGenerationFlow,
    finalizeIntelligenceFlow,
    inferFlowFinalAction,
    startIntelligenceFlow
} from '../services/intelligenceFlow';
import { retrieveRelevantContext, retrieveLearnedMemory } from '../services/knowledge';
import { buildChatStoragePath, getSupabasePublicUrl, uploadBlobToSupabaseStorage } from '../services/storage';
import { db, collection, query, where, orderBy, limit, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs } from '../services/supabase';
import { SendIcon, NewChatIcon, MicIcon, StopCircleIcon, BackIcon, FolderIcon, PlusIcon, FileTextIcon, CloudUploadIcon, PaperclipIcon, XIcon, BookIcon, BotIcon, PencilIcon, CheckIcon, TrashIcon, SearchIcon } from './Icon';
import { Avatar } from './Avatar';
import ChatMessage from '../src/modules/nucleo-conversacional/components/ChatMessage';
import ChatAttachmentCard from '../src/modules/nucleo-conversacional/components/ChatAttachmentCard';
import { ncLog } from '../src/modules/nucleo-conversacional/utils/observability';
import { persistBotPlaceholder, touchChatSessionMetadata } from '../src/modules/nucleo-conversacional/services/chatPersistence';


interface SystemicVisionProps {
    dynamicAgents: Agent[];
    onUpdateAgents: (agents: Agent[]) => void;
    activeBU: BusinessUnit;
    onAddAgent?: (agent: Agent) => void;
    onApproveAgent?: (agentId: string) => void;
    onPlanAgent?: (agent: Agent) => void;
    onEnterRoom?: (buId: string) => void;
    businessUnits?: BusinessUnit[];
    totalGlobalAgents?: number;
    forcedAgent?: Agent | null;
    forcedSessionId?: string | null;
    onBack?: () => void;
    onConvertToTopic?: (topic: Partial<Topic>) => void;
    viewMode?: 'bu' | 'global';
    userProfile?: UserProfile | null;
    activeWorkspaceId?: string | null;
    vaultItems?: VaultItem[];
}

// Interface para Sessão
interface ChatSession {
    id: string;
    agentId: string;
    title: string;
    createdAt: number;
    lastMessageAt: number;
    participantIds?: string[];
    selectedVaultDocumentIds?: string[];
}

type VaultDocumentOption = {
    id: string;
    title: string;
    content: string;
    mimeType: string;
    payload?: Record<string, any>;
    uploadedAt?: string;
};

const SystemicVision: React.FC<SystemicVisionProps> = ({ dynamicAgents, onUpdateAgents, activeBU, onAddAgent, onApproveAgent, onPlanAgent, onEnterRoom, businessUnits = [], totalGlobalAgents = 0, forcedAgent, forcedSessionId, onBack, onConvertToTopic, viewMode = 'bu', userProfile, activeWorkspaceId, vaultItems = [] }) => {

    const createAttachmentId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const attachmentScopeVersionRef = useRef(0);
    const cancelledAttachmentIdsRef = useRef<Set<string>>(new Set());
    const forcedSessionIdRef = useRef(forcedSessionId);
    forcedSessionIdRef.current = forcedSessionId;

    const isAttachmentContextValid = useCallback((localId: string, scopeVersion: number) => {
        return scopeVersion === attachmentScopeVersionRef.current && !cancelledAttachmentIdsRef.current.has(localId);
    }, []);

    const resetAttachmentWorkflow = useCallback(() => {
        attachmentScopeVersionRef.current += 1;
        cancelledAttachmentIdsRef.current = new Set();
        setAttachments([]);
    }, []);

    const extractMediaMetadata = useCallback((file: File) => new Promise<{ durationSec?: number; previewOverride?: string }>((resolve) => {
        const mime = String(file.type || '').toLowerCase();
        if (!mime.startsWith('audio/') && !mime.startsWith('video/')) {
            resolve({});
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const media = document.createElement(mime.startsWith('video/') ? 'video' : 'audio');
        media.preload = 'metadata';
        media.src = objectUrl;
        media.muted = true;

        const cleanup = () => {
            media.pause();
            media.removeAttribute('src');
            media.load();
            URL.revokeObjectURL(objectUrl);
        };

        const resolveAudio = () => {
            const durationSec = Number.isFinite(media.duration) ? Math.round(media.duration) : undefined;
            cleanup();
            resolve({ durationSec });
        };

        const resolveVideo = () => {
            const durationSec = Number.isFinite(media.duration) ? Math.round(media.duration) : undefined;
            const video = media as HTMLVideoElement;

            const finishWithFallback = () => {
                cleanup();
                resolve({ durationSec });
            };

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;

            const context = canvas.getContext('2d');
            if (!context || !video.videoWidth || !video.videoHeight) {
                finishWithFallback();
                return;
            }

            const handleSeeked = () => {
                try {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const previewOverride = canvas.toDataURL('image/jpeg', 0.82);
                    cleanup();
                    resolve({ durationSec, previewOverride });
                } catch {
                    finishWithFallback();
                }
            };

            video.addEventListener('seeked', handleSeeked, { once: true });
            try {
                video.currentTime = Math.min(0.1, Math.max(video.duration || 0, 0.1));
            } catch {
                finishWithFallback();
            }
        };

        media.onloadedmetadata = () => {
            if (mime.startsWith('video/')) {
                resolveVideo();
                return;
            }
            resolveAudio();
        };

        media.onerror = () => {
            cleanup();
            resolve({});
        };
    }), []);

    const buildDocumentSummary = (content: string, title: string) => {
        const normalized = String(content || '').replace(/\r/g, '').trim();
        if (!normalized) return `Arquivo ${title}: sem preview inline disponível.`;

        const lines = normalized
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .slice(0, 6);

        const firstChunk = lines.join(' ').replace(/\s+/g, ' ').trim();
        return firstChunk.length > 420 ? `${firstChunk.slice(0, 420)}...` : firstChunk;
    };

    const renderChatAmbient = () => (
        <>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-[20vw] min-w-[180px] bg-gradient-to-r from-[#EEF2FF]/52 via-white/18 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-[20vw] min-w-[180px] bg-gradient-to-l from-[#ECFEF7]/46 via-white/16 to-transparent" />
                <div className="absolute left-[-10%] top-[12%] h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,_rgba(31,41,55,0.03)_0%,_rgba(31,41,55,0.012)_40%,_transparent_72%)]" />
                <div className="absolute right-[-11%] bottom-[-6%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(16,185,129,0.04)_0%,_rgba(16,185,129,0.014)_42%,_transparent_72%)]" />
                <div className="absolute left-[4%] top-1/2 hidden -translate-y-1/2 xl:block">
                    <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-slate-200/22 bg-white/5 backdrop-blur-[1px]">
                        <div className="absolute inset-6 rounded-full border border-slate-300/18" />
                        <div className="absolute inset-14 rounded-full border border-slate-300/12" />
                        <div className="text-[6.4rem] font-black tracking-[-0.14em] text-slate-900/[0.03]">SB</div>
                    </div>
                </div>
                <div className="absolute right-[5%] top-[18%] hidden xl:block">
                    <div className="grid grid-cols-3 gap-3 opacity-[0.08]">
                        {Array.from({ length: 9 }).map((_, idx) => (
                            <span key={idx} className="h-2 w-2 rounded-full bg-slate-400" />
                        ))}
                    </div>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(15,23,42,0.008)_18%,transparent_32%,transparent_68%,rgba(16,185,129,0.01)_82%,transparent_100%)]" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_0%,_rgba(248,250,252,0.08)_56%,_rgba(241,245,249,0.3)_100%)]" />
        </>
    );

    const CURRENT_USER = useMemo(() => ({
        name: userProfile?.name || "Usuário",
        nickname: userProfile?.nickname || userProfile?.name?.split(' ')[0] || "Líder",
        role: userProfile?.role || "Stakeholder",
        avatar: userProfile?.avatarUrl || "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200&h=200"
    }), [userProfile]);

    const HUMAN_GREETINGS = [
        `Fala ${CURRENT_USER.nickname}. Estou na escuta.`,
        `Opa, ${CURRENT_USER.nickname}. O que temos para agora?`,
        `Bora falar, ${CURRENT_USER.nickname}?`,
        `Na linha. Qual a pauta?`,
        `Pronto. O que manda?`,
        `E aí ${CURRENT_USER.nickname}. Pode falar.`
    ];
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

    // --- SESSION MANAGEMENT STATE ---
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [activeMessages, setActiveMessages] = useState<Message[]>([]);
    const [showHistorySidebar, setShowHistorySidebar] = useState(false);
    const [titleOptions, setTitleOptions] = useState<string[] | null>(null);
    const [taskSuggestions, setTaskSuggestions] = useState<string[] | null>(null);
    const [isSuggestionPanelVisible, setIsSuggestionPanelVisible] = useState(false);

    // --- MULTI-AGENT STATE ---
    const [activeParticipants, setActiveParticipants] = useState<Agent[]>([]);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
    const [vaultSearchTerm, setVaultSearchTerm] = useState('');
    const [selectedVaultDocumentIds, setSelectedVaultDocumentIds] = useState<string[]>([]);
    const [previewVaultDoc, setPreviewVaultDoc] = useState<VaultDocumentOption | null>(null);

    // --- EDITING STATE REMOVED (NOW LOCAL IN COMPONENT) ---
    // A lógica de edição agora é controlada diretamente pelo handleUpdateAndRegenerate

    // --- MODEL SELECTION STATE ---
    const [selectedModelProvider, setSelectedModelProvider] = useState<ModelProvider>('gemini');
    const [providerHealth, setProviderHealth] = useState<Partial<ProvidersHealthMap>>({});
    const [providerHealthError, setProviderHealthError] = useState<string>('');

    // --- KNOWLEDGE BASE STATE (SIDEBAR REMOVIDA - SÓ HISTÓRICO AGORA) ---
    const [isTraining, setIsTraining] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- CHAT ATTACHMENT & DRAG/DROP STATE ---
    const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const chatAttachmentRef = useRef<HTMLInputElement>(null);

    // --- RESIZABLE SIDEBAR STATE ---
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const isResizing = useRef(false);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // --- AUDIO RECORDING STATE ---
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    // --- NEW: TASK MODAL STATE ---
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [taskForm, setTaskForm] = useState({
        title: '',
        assignee: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [sessionSearch, setSessionSearch] = useState('');
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [olderMessages, setOlderMessages] = useState<Message[]>([]);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const messagesScrollRef = useRef<HTMLDivElement>(null);
    const stopStreamingRef = useRef(false);
    const hasSummonedRef = useRef(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const isCreatingSessionRef = useRef(false);
    const appliedForcedSessionRef = useRef<string | null>(null);

    const DEFAULT_WORKSPACE_ID = '00000000-0000-0000-0000-000000000000';
    const workspaceId = activeWorkspaceId || userProfile?.workspaceId || DEFAULT_WORKSPACE_ID;
    const useSupabaseChat = true;
    const ownerUserId = userProfile?.uid || null;

    const resolveProvider = (provider?: ModelProvider | null) => provider || 'gemini';
    const isDeepSeekProvider = (provider?: ModelProvider | null) => resolveProvider(provider) === 'deepseek';
    const isLlamaLocalProvider = (provider?: ModelProvider | null) => resolveProvider(provider) === 'llama_local';
    const isGeminiProvider = (provider?: ModelProvider | null) => resolveProvider(provider) === 'gemini';
    const isProxyProvider = (provider?: ModelProvider | null) => ['openai', 'claude'].includes(resolveProvider(provider));
    const statusFromText = (text: string): 'ok' | 'warning' | 'error' => {
        const normalized = String(text || '').toLowerCase();
        if (
            normalized.includes('erro') ||
            normalized.includes('timeout') ||
            normalized.includes('falha') ||
            normalized.includes('nao foi possivel') ||
            normalized.includes('não foi possível')
        ) return 'error';
        if (
            normalized.includes('atenção') ||
            normalized.includes('atencao') ||
            normalized.includes('verifique') ||
            normalized.includes('revisar')
        ) return 'warning';
        return 'ok';
    };

    const MODEL_PROVIDER_OPTIONS: Array<{ value: ModelProvider; label: string }> = [
        { value: 'llama_local', label: 'Llama' },
        { value: 'gemini', label: 'Gemini' },
        { value: 'deepseek', label: 'DeepSeek' },
        { value: 'openai', label: 'OpenAI' },
        { value: 'claude', label: 'Claude' }
    ];
    const getProviderLabel = (provider?: ModelProvider | null) => {
        const normalized = resolveProvider(provider);
        return MODEL_PROVIDER_OPTIONS.find((item) => item.value === normalized)?.label || 'Gemini';
    };

    const getProviderHealthBadge = (provider?: ModelProvider | null) => {
        return providerHealthToBadge(resolveProvider(provider), providerHealth as any);
    };

    // New Agent Modal State
    const [isAdding, setIsAdding] = useState(false);
    const [newAgentBU, setNewAgentBU] = useState(activeBU.id);

    // --- ECOSYSTEM HUD METRICS ---
    const totalCompanies = businessUnits.length;
    const totalAgents = dynamicAgents.length;

    // --- CALCULATED LISTS ---
    const agentsByBU = useMemo(() => {
        return dynamicAgents.reduce((acc, agent) => {
            const buKey = agent.buId || 'others';
            if (!acc[buKey]) acc[buKey] = [];
            acc[buKey].push(agent);
            return acc;
        }, {} as Record<string, Agent[]>);
    }, [dynamicAgents]);

    const sortAgents = (agents: Agent[]) => {
        const tierOrder: Record<string, number> = { 'ESTRATÉGICO': 0, 'TÁTICO': 1, 'OPERACIONAL': 2, 'CONTROLE': 3 };
        return agents.sort((a, b) => (tierOrder[a.tier || 'OPERACIONAL'] || 99) - (tierOrder[b.tier || 'OPERACIONAL'] || 99));
    };

    // --- EFFECTS ---

    useEffect(() => {
        if (!autoScrollEnabled) return;
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeMessages, autoScrollEnabled]);

    const handleMessagesScroll = () => {
        const el = messagesScrollRef.current;
        if (!el) return;
        const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        setAutoScrollEnabled(distanceToBottom < 120);
    };

    useEffect(() => {
        setNewAgentBU(activeBU.id);
    }, [activeBU.id]);

    // Reset textarea height on input clear
    useEffect(() => {
        if (input === '' && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    }, [input]);

    // --- AUTO-OPEN FORCED AGENT ---
    useEffect(() => {
        if (!forcedAgent) return;
        if (forcedAgent.id === selectedAgent?.id) return;

        // Fluxo explícito para evitar estados intermediários que podem causar tela preta
        setSelectedModelProvider((forcedAgent.modelProvider || 'gemini') as ModelProvider);
        setSelectedAgent(forcedAgent);
        setCurrentSessionId(null);
        setActiveMessages([]);
        setTitleOptions(null);
        setTaskSuggestions(null);
        resetAttachmentWorkflow();
        setActiveParticipants([]);
    }, [forcedAgent, selectedAgent?.id, resetAttachmentWorkflow]);

    useEffect(() => {
        if (!forcedSessionId) {
            appliedForcedSessionRef.current = null;
            return;
        }
        if (!selectedAgent) return;
        if (appliedForcedSessionRef.current === forcedSessionId) return;

        const targetExists = sessions.some((session) => session.id === forcedSessionId);
        if (!targetExists) return;

        setCurrentSessionId(forcedSessionId);
        setShowHistorySidebar(false);
        appliedForcedSessionRef.current = forcedSessionId;
    }, [forcedSessionId, sessions, selectedAgent]);

    // --- RE-INIT SESSION ON MODEL CHANGE ---
    useEffect(() => {
        if (selectedAgent && isGeminiProvider(selectedModelProvider)) {
            initializeSession(selectedAgent);
        }
    }, [selectedModelProvider, selectedAgent?.id]);

    useEffect(() => {
        setAutoScrollEnabled(true);
    }, [selectedAgent?.id, currentSessionId]);

    useEffect(() => {
        setIsSuggestionPanelVisible(false);
    }, [selectedAgent?.id, currentSessionId]);

    useEffect(() => {
        resetAttachmentWorkflow();
    }, [selectedAgent?.id, currentSessionId, resetAttachmentWorkflow]);

    useEffect(() => {
        let cancelled = false;
        let intervalId: number | null = null;

        const refreshProvidersHealth = async () => {
            try {
                const result = await getProvidersHealth();
                if (cancelled) return;
                setProviderHealth(result.providers || {});
                setProviderHealthError('');
            } catch (error: any) {
                if (cancelled) return;
                setProviderHealthError(String(error?.message || 'Falha ao verificar saúde das APIs.'));
            }
        };

        refreshProvidersHealth();
        intervalId = window.setInterval(refreshProvidersHealth, 30000);

        return () => {
            cancelled = true;
            if (intervalId !== null) window.clearInterval(intervalId);
        };
    }, []);

    const initializeSession = (agent: Agent, history: any[] = [], forcedProvider?: ModelProvider) => {
        const modelId = resolveProvider(forcedProvider || selectedModelProvider) === 'gemini'
            ? 'gemini-2.5-flash'
            : 'gemini-2.5-flash';
        const longTerm = retrieveLearnedMemory(agent);
        const docsInventory = buildAgentDocsInventory(agent);

        const gs = startAgentSession(
            agent.id,
            buildSystemInstructionForAgent(agent),
            agent.knowledgeBase || [],
            modelId,
            history.length > 0 ? history : undefined,
            CURRENT_USER,
            undefined,
            longTerm,
            docsInventory
        );
        return gs;
    };

    // --- RESIZING LOGIC ---
    const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
        mouseDownEvent.preventDefault();
        isResizing.current = true;
        const startX = mouseDownEvent.clientX;
        const startWidth = sidebarWidth;

        const doDrag = (mouseMoveEvent: MouseEvent) => {
            if (isResizing.current) {
                const newWidth = startWidth + (mouseMoveEvent.clientX - startX);
                if (newWidth > 260 && newWidth < 460) {
                    setSidebarWidth(newWidth);
                }
            }
        };

        const stopDrag = () => {
            isResizing.current = false;
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.body.style.cursor = 'default';
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.body.style.cursor = 'col-resize';
    }, [sidebarWidth]);

    // --- SESSION LOGIC ---
    const createNewSession = async (agent: Agent) => {
        if (!workspaceId) {
            alert("Workspace não definido para salvar conversa.");
            return;
        }
        if (isCreatingSessionRef.current) return;
        isCreatingSessionRef.current = true;
        try {
            const now = new Date();
            const sessionRef = await addDoc(collection(db, "chat_sessions"), {
                workspaceId,
                agentId: agent.id,
                ownerUserId,
                title: "Nova Conversa",
                status: "active",
                buId: activeBU.id,
                payload: { participantAgentIds: [], selectedVaultDocumentIds: [] },
                createdAt: now,
                updatedAt: now,
                lastMessageAt: now
            });
            setCurrentSessionId(sessionRef.id);
            setTitleOptions(null);
            setTaskSuggestions(null);
            resetAttachmentWorkflow();
            setActiveParticipants([]);

            const randomGreeting = HUMAN_GREETINGS[Math.floor(Math.random() * HUMAN_GREETINGS.length)];
            await addDoc(collection(db, "chat_messages"), {
                workspaceId,
                sessionId: sessionRef.id,
                agentId: agent.id,
                participantName: agent.name,
                sender: Sender.Bot,
                text: randomGreeting,
                buId: activeBU.id,
                hasAttachment: false,
                createdAt: now
            });

            if (isGeminiProvider(selectedModelProvider)) {
                initializeSession(agent);
            }
            setShowHistorySidebar(false);
        } catch (error) {
            console.error("Erro ao criar sessão no Supabase:", error);
            alert("Falha ao criar sessão no banco de dados.");
        } finally {
            isCreatingSessionRef.current = false;
        }
    };

    const selectSession = (sessionId: string, agentContext?: Agent) => {
        const agent = agentContext || selectedAgent;
        if (!agent) return;

        setCurrentSessionId(sessionId);
        setTitleOptions(null);
        setTaskSuggestions(null);
        resetAttachmentWorkflow();
        setActiveParticipants([]);

        setActiveMessages([]);
    };

    const handleManualSuggestTitle = async () => {
        if (activeMessages.length < 2) return;
        setIsLoading(true);
        const context = activeMessages.slice(-10).map(m => m.text).join('\n');
        try {
            const sug = await generateTitleOptions(context);
            setTitleOptions(sug);
        } catch (e) {
            console.error("Erro ao sugerir título:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleSuggestionPanel = async () => {
        const nextVisible = !isSuggestionPanelVisible;
        setIsSuggestionPanelVisible(nextVisible);

        if (!nextVisible || taskSuggestions || activeMessages.length < 2) return;

        try {
            const suggestionsContext = activeMessages.slice(-12).map((message) => message.text).join('\n\n');
            const suggestions = await generateTaskSuggestions(suggestionsContext);
            setTaskSuggestions(suggestions.length > 0 ? suggestions : []);
        } catch (error) {
            console.error('Erro ao gerar sugestões manuais:', error);
            setTaskSuggestions([]);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!window.confirm("Deseja realmente excluir esta conversa?")) return;

        try {
            await deleteDoc(doc(db, "chat_sessions", sessionId));
        } catch (error) {
            console.error("Erro ao excluir sessão:", error);
            alert("Falha ao excluir conversa no banco de dados.");
            return;
        }

        const updatedSessions = sessions.filter(s => s.id !== sessionId);
        setSessions(updatedSessions);

        if (currentSessionId === sessionId) {
            setCurrentSessionId(null);
            setActiveMessages([]);
        }
        setMenuOpenId(null);
    };

    const handleRenameSession = async (sessionId: string) => {
        const session = sessions.find(s => s.id === sessionId);
        const newTitle = window.prompt("Novo nome da conversa:", session?.title);
        if (newTitle && newTitle.trim()) {
            const updatedSessions = sessions.map(s => s.id === sessionId ? { ...s, title: newTitle.trim() } : s);
            setSessions(updatedSessions);
            try {
                await updateDoc(doc(db, "chat_sessions", sessionId), { title: newTitle.trim(), updatedAt: new Date() });
            } catch (error) {
                console.error("Erro ao renomear sessão:", error);
                alert("Falha ao renomear conversa no banco de dados.");
            }
        }
        setMenuOpenId(null);
    };

    const loadOlderMessages = async () => {
        if (!useSupabaseChat || !workspaceId || !currentSessionId || !selectedAgent || isLoadingMore) return;
        
        setIsLoadingMore(true);
        try {
            const allMessages = [...olderMessages, ...activeMessages];
            const oldestTimestamp = allMessages.reduce((min, msg) => 
                msg.timestamp.getTime() < min ? msg.timestamp.getTime() : min, 
                Date.now()
            );
            const oldestDate = new Date(oldestTimestamp);

            const olderQuery = query(
                collection(db, "chat_messages"),
                where("workspaceId", "==", workspaceId),
                where("sessionId", "==", currentSessionId),
                where("createdAt", "<", oldestDate),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const snapshot = await getDocs(olderQuery);
            const newOlder = snapshot.docs.map(docSnap => {
                const data = docSnap.data() as any;
                const senderRaw = String(data.sender || 'bot').toLowerCase();
                const sender = senderRaw === Sender.User ? Sender.User :
                    senderRaw === Sender.System ? Sender.System : Sender.Bot;
                const timestamp = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now());
                const payload = (data.payload && typeof data.payload === 'object') ? data.payload : {};
                const rawAttachment = data.attachment;
                const attachments = Array.isArray(rawAttachment)
                    ? rawAttachment
                    : (rawAttachment && typeof rawAttachment === 'object' ? [rawAttachment] : []);
                const normalizedAttachments = attachments
                    .map((item: any) => ({
                        data: String(item?.data || ''),
                        mimeType: String(item?.mimeType || 'application/octet-stream'),
                        preview: String(item?.preview || ''),
                        name: item?.name ? String(item.name) : undefined,
                        sizeBytes: item?.sizeBytes ? Number(item.sizeBytes) : undefined
                    }))
                    .filter((item: any) => Boolean(item.data));

                return {
                    id: docSnap.id,
                    text: String(data.text || ''),
                    sender,
                    timestamp,
                    buId: String(data.buId || activeBU.id),
                    isStreaming: false,
                    participantName: data.participantName ? String(data.participantName) : undefined,
                    attachment: normalizedAttachments[0],
                    attachments: normalizedAttachments,
                    payload
                } as Message;
            });
            
            if (newOlder.length === 0) {
                setHasMoreMessages(false);
            } else {
                setOlderMessages(prev => {
                    const combined = [...newOlder, ...prev];
                    combined.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                    return combined;
                });
            }
        } catch (error) {
            console.error("Erro ao carregar mensagens anteriores:", error);
        } finally {
            setIsLoadingMore(false);
        }
    };


    const handleOpenAgent = (agent: Agent) => {
        if (agent.status === 'PLANNED') return;

        setSelectedModelProvider((agent.modelProvider || 'gemini') as ModelProvider);
        setSelectedAgent(agent);
        setCurrentSessionId(null);
        setActiveMessages([]);
        setTitleOptions(null);
        setTaskSuggestions(null);
        resetAttachmentWorkflow();
        setActiveParticipants([]);
    };

    useEffect(() => {
        if (!useSupabaseChat || !workspaceId || !selectedAgent || selectedAgent.status === 'PLANNED') return;

        const toMillis = (value: any) => {
            if (value instanceof Date) return value.getTime();
            const parsed = new Date(value);
            return Number.isNaN(parsed.getTime()) ? Date.now() : parsed.getTime();
        };

        const sessionsQuery = query(
            collection(db, "chat_sessions"),
            where("workspaceId", "==", workspaceId),
            where("agentId", "==", selectedAgent.id),
            orderBy("lastMessageAt", "desc")
        );

        const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
            const loaded = snapshot.docs.map((docSnap) => {
                const data = docSnap.data() as any;
                const payload = (data.payload && typeof data.payload === 'object') ? data.payload : {};
                const participantAgentIds = Array.isArray(payload.participantAgentIds)
                    ? payload.participantAgentIds.map((id: any) => String(id))
                    : [];
                return {
                    id: docSnap.id,
                    agentId: String(data.agentId || selectedAgent.id),
                    title: String(data.title || "Nova Conversa"),
                    createdAt: toMillis(data.createdAt),
                    lastMessageAt: toMillis(data.lastMessageAt || data.updatedAt || data.createdAt),
                    participantIds: participantAgentIds,
                    selectedVaultDocumentIds: Array.isArray(payload.selectedVaultDocumentIds)
                        ? payload.selectedVaultDocumentIds.map((id: any) => String(id))
                        : []
                } as ChatSession;
            }).sort((a, b) => b.lastMessageAt - a.lastMessageAt);

            setSessions(loaded);
            setCurrentSessionId((prev) => {
                if (loaded.length === 0) return null;
                if (prev && loaded.some((s) => s.id === prev)) return prev;
                // Se há um forcedSessionId ativo, respeita-o em vez de auto-selecionar o primeiro
                if (forcedSessionIdRef.current && loaded.some((s) => s.id === forcedSessionIdRef.current)) {
                    return forcedSessionIdRef.current;
                }
                return loaded[0].id;
            });

            if (loaded.length === 0 && !isCreatingSessionRef.current) {
                void createNewSession(selectedAgent);
            }
        }, (error) => {
            console.error("Erro ao carregar sessões de chat:", error);
        });

        return () => unsubscribe();
    }, [useSupabaseChat, workspaceId, selectedAgent?.id, selectedAgent?.status]);

    useEffect(() => {
        if (!selectedAgent || !currentSessionId) {
            setActiveParticipants([]);
            return;
        }

        const activeSession = sessions.find((session) => session.id === currentSessionId);
        if (!activeSession || !Array.isArray(activeSession.participantIds)) {
            setActiveParticipants([]);
            return;
        }

        const participantSet = new Set(activeSession.participantIds);
        const hydratedParticipants = dynamicAgents.filter((agent) =>
            agent.id !== selectedAgent.id &&
            participantSet.has(agent.id) &&
            agent.status === 'ACTIVE'
        );
        setActiveParticipants(hydratedParticipants);
    }, [currentSessionId, selectedAgent?.id, sessions, dynamicAgents]);

    useEffect(() => {
        if (!currentSessionId) {
            setSelectedVaultDocumentIds([]);
            return;
        }
        const activeSession = sessions.find((session) => session.id === currentSessionId);
        setSelectedVaultDocumentIds(activeSession?.selectedVaultDocumentIds || []);
    }, [currentSessionId, sessions]);

    useEffect(() => {
        if (!useSupabaseChat || !workspaceId || !selectedAgent || !currentSessionId) return;

        const messagesQuery = query(
            collection(db, "chat_messages"),
            where("workspaceId", "==", workspaceId),
            where("sessionId", "==", currentSessionId),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const loaded = snapshot.docs.map((docSnap) => {
                const data = docSnap.data() as any;
                const senderRaw = String(data.sender || 'bot').toLowerCase();
                const sender =
                    senderRaw === Sender.User ? Sender.User :
                    senderRaw === Sender.System ? Sender.System :
                    Sender.Bot;
                const timestamp = data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt || Date.now());
                const payload = (data.payload && typeof data.payload === 'object') ? data.payload : {};
                const rawAttachment = data.attachment;
                const attachments = Array.isArray(rawAttachment)
                    ? rawAttachment
                    : (rawAttachment && typeof rawAttachment === 'object' ? [rawAttachment] : []);
                const normalizedAttachments = attachments
                    .map((item: any) => ({
                        data: String(item?.data || ''),
                        mimeType: String(item?.mimeType || 'application/octet-stream'),
                        preview: String(item?.preview || ''),
                        name: item?.name ? String(item.name) : undefined,
                        sizeBytes: item?.sizeBytes ? Number(item.sizeBytes) : undefined
                    }))
                    .filter((item: any) => Boolean(item.data));

                return {
                    id: docSnap.id,
                    text: String(data.text || ''),
                    sender,
                    timestamp,
                    buId: String(data.buId || activeBU.id),
                    isStreaming: Boolean(payload.isStreaming),
                    participantName: data.participantName ? String(data.participantName) : undefined,
                    attachment: normalizedAttachments[0],
                    attachments: normalizedAttachments,
                    payload
                } as Message;
            });
            
            setActiveMessages(prev => {
                const newMessages = loaded.map(loadedMsg => {
                    const localMsg = prev.find(m => m.id === loadedMsg.id);
                    if (localMsg && localMsg.isStreaming) {
                        return { ...loadedMsg, text: localMsg.text, isStreaming: true };
                    }
                    return loadedMsg;
                });
                
                const optimisticMessages = prev.filter(m => !loaded.some(l => l.id === m.id));
                const merged = [...newMessages, ...optimisticMessages];
                merged.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
                
                return merged;
            });
        }, (error) => {
            console.error("Erro ao carregar mensagens:", error);
        });

        return () => unsubscribe();
    }, [useSupabaseChat, workspaceId, selectedAgent?.id, currentSessionId, activeBU.id]);

    // --- HANDLER FUNCTIONS ---

    const updateSessionMetadata = async (sessionId: string) => {
        const nowMs = Date.now();
        setSessions(prev => {
            const updated = prev.map(s => s.id === sessionId ? { ...s, lastMessageAt: nowMs } : s);
            updated.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
            return updated;
        });

        try {
            await touchChatSessionMetadata(sessionId, nowMs);
        } catch (error) {
            ncLog.error('chat.session.metadata.update.failed', {
                sessionId,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    };

    const persistSessionParticipants = async (sessionId: string, participantIds: string[]) => {
        const normalizedIds = Array.from(new Set((participantIds || []).map((id) => String(id).trim()).filter(Boolean)));
        await patchSessionPayload(sessionId, { participantAgentIds: normalizedIds });
    };

    const handleCloseChat = () => {
        setSelectedAgent(null);
        setActiveParticipants([]);
        if (forcedAgent && onBack) {
            onBack();
        }
    };

    // --- CORE: LOGICA DE EDIÇÃO E REGENERAÇÃO ---
    const handleUpdateAndRegenerate = async (msg: Message, newText: string, newAttachment?: { data: string, mimeType: string, preview: string, name?: string, sizeBytes?: number } | null) => {
        if (!selectedAgent) return;
        const canPersistChat = Boolean(useSupabaseChat && workspaceId && currentSessionId);

        // 1. Encontrar o índice da mensagem editada
        const msgIndex = activeMessages.findIndex(m => m.id === msg.id);
        if (msgIndex === -1) return;

        // 2. Cortar o histórico: Manter tudo ATÉ a mensagem editada
        const truncatedMessages = activeMessages.slice(0, msgIndex + 1);

        // 3. Atualizar o texto e anexo da mensagem do usuário
        truncatedMessages[msgIndex] = {
            ...truncatedMessages[msgIndex],
            text: newAttachment ? (newText ? newText + " 📎 [Arquivo Anexado]" : "📎 [Arquivo Enviado]") : newText,
            attachment: newAttachment || undefined,
            attachments: newAttachment ? [newAttachment] : []
        };

        if (canPersistChat) {
            try {
                await updateDoc(doc(db, "chat_messages", msg.id), {
                    text: truncatedMessages[msgIndex].text,
                    hasAttachment: Boolean(newAttachment),
                    attachment: newAttachment ? [newAttachment] : null
                });
                const toRemove = activeMessages.slice(msgIndex + 1);
                await Promise.all(
                    toRemove.map((m) => deleteDoc(doc(db, "chat_messages", m.id)).catch(() => null))
                );
            } catch (persistError) {
                console.error("Erro ao persistir edição/regeneração:", persistError);
            }
        }

        // 4. Atualizar estado visual imediatamente
        setActiveMessages(truncatedMessages);
        setIsLoading(true);

        // 5. Preparar para regenerar a resposta
        let botMsgId = `${Date.now()}_bot_regen`;
        let persistedBotId: string | null = null;

        setActiveMessages(prev => [...prev, {
            id: botMsgId,
            text: '',
            sender: Sender.Bot,
            timestamp: new Date(),
            buId: activeBU.id,
            isStreaming: true
        }]);

        if (canPersistChat) {
            persistBotPlaceholder({
                workspaceId: String(workspaceId),
                sessionId: String(currentSessionId),
                agentId: selectedAgent.id,
                buId: activeBU.id,
            }).then(savedBot => {
                setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, id: savedBot.id } : m));
                botMsgId = savedBot.id;
                persistedBotId = savedBot.id;
            }).catch(createBotError => {
                ncLog.error('chat.regeneration.placeholder.create.failed', {
                    sessionId: currentSessionId || null,
                    agentId: selectedAgent.id,
                    error: createBotError instanceof Error ? createBotError.message : String(createBotError)
                });
            });
        }

        try {
            // --- LOGICA DE GERAÇÃO (Cópia da handleSendMessage adaptada) ---
            const { runtimeContext } = buildRuntimeContextForTurn(selectedAgent, newText);
            let finalBotText = '';
            const providerForMessage = resolveProvider(selectedModelProvider);

            if (isDeepSeekProvider(providerForMessage)) {
                const deepSeekHistory = truncatedMessages.map(m => ({
                    role: m.sender === Sender.User ? 'user' : 'assistant',
                    content: m.text
                })) as DeepSeekMessage[];
                const editedAttachmentText = extractTextFromAttachment(newAttachment);
                if (editedAttachmentText) {
                    deepSeekHistory.push({ role: 'user', content: editedAttachmentText });
                }

                if (runtimeContext) {
                    deepSeekHistory.push({ role: 'system', content: runtimeContext });
                }

                const stream = streamDeepSeekResponse(deepSeekHistory, buildSystemInstructionForAgent(selectedAgent));
                let fullText = "";

                for await (const chunk of stream) {
                    fullText += chunk.text;
                    setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
                }
                setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
                finalBotText = fullText;

            } else if (isLlamaLocalProvider(providerForMessage)) {
                const llamaHistory = truncatedMessages.map(m => ({
                    role: m.sender === Sender.User ? 'user' : 'assistant',
                    content: m.text
                })) as LlamaMessage[];
                const editedAttachmentText = extractTextFromAttachment(newAttachment);
                if (editedAttachmentText) {
                    llamaHistory.push({ role: 'user', content: editedAttachmentText });
                }
                if (runtimeContext) {
                    llamaHistory.push({ role: 'system', content: runtimeContext });
                }

                const stream = streamLlamaLocalResponse(llamaHistory, buildSystemInstructionForAgent(selectedAgent) || '');
                let fullText = "";

                for await (const chunk of stream) {
                    fullText += chunk.text;
                    setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
                }
                setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
                finalBotText = fullText;

            } else if (isProxyProvider(providerForMessage)) {
                const proxyHistory = truncatedMessages.map(m => ({
                    role: m.sender === Sender.User ? 'user' : 'assistant',
                    content: m.text
                })) as ProxyProviderMessage[];
                const editedAttachmentText = extractTextFromAttachment(newAttachment);
                if (editedAttachmentText) {
                    proxyHistory.push({ role: 'user', content: editedAttachmentText });
                }
                if (runtimeContext) {
                    proxyHistory.push({ role: 'system', content: runtimeContext });
                }

                const stream = streamProxyProviderResponse(providerForMessage, proxyHistory, buildSystemInstructionForAgent(selectedAgent) || '');
                let fullText = '';

                for await (const chunk of stream) {
                    fullText += chunk.text;
                    setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
                }
                setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
                finalBotText = fullText;

            } else {
                // GEMINI: Precisamos reiniciar a sessão com o histórico cortado para garantir consistência
                // Convertendo histórico para formato Gemini
                const geminiHistory = truncatedMessages.slice(0, -1).map(m => ({ // Remove a última (que é o prompt atual)
                    role: m.sender === Sender.User ? 'user' : 'model',
                    parts: [{ text: m.text }]
                }));

                // Reinicializa sessão com histórico limpo
                const session = initializeSession(selectedAgent, geminiHistory, 'gemini');

                let messagePayload: any = newText;
                if (runtimeContext) {
                    messagePayload = `${runtimeContext}\n\n[MENSAGEM DO USUÁRIO]:\n${newText}`;
                }
                if (activeParticipants.length > 0) {
                    messagePayload = `[MESA: ${activeParticipants.map(p => p.name).join(', ')}]\n${messagePayload}`;
                }

                const result = await session?.sendMessageStream({ message: messagePayload });
                let fullText = '';

                for await (const chunk of result) {
                    const text = (chunk as any).text || '';
                    fullText += text;
                    setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: fullText } : m));
                }
                setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, isStreaming: false } : m));
                finalBotText = fullText;
            }

            if (persistedBotId) {
                await updateDoc(doc(db, "chat_messages", persistedBotId), {
                    text: finalBotText,
                    payload: { isStreaming: false }
                });
            }

            if (currentSessionId) {
                await updateSessionMetadata(currentSessionId);
            }

        } catch (error) {
            console.error(error);
            const regenerationError = "Erro na regeneração.";
            setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, text: regenerationError, isStreaming: false } : m));
            if (persistedBotId) {
                await updateDoc(doc(db, "chat_messages", persistedBotId), {
                    text: regenerationError,
                    payload: { isStreaming: false }
                }).catch(() => null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInviteAgent = (agent: Agent, manual: boolean = true) => {
        if (activeParticipants.some(p => p.id === agent.id)) return;
        setActiveParticipants((prev) => {
            const alreadyInvited = prev.some((participant) => participant.id === agent.id);
            if (alreadyInvited) return prev;
            const nextParticipants = [...prev, agent];
            if (currentSessionId) {
                void persistSessionParticipants(currentSessionId, nextParticipants.map((participant) => participant.id));
            }
            return nextParticipants;
        });
        if (manual) {
            setIsInviteModalOpen(false);
            const systemMessage = {
                id: Date.now().toString(),
                text: `SYSTEM: ${agent.name} entrou na sala.`,
                sender: Sender.System,
                timestamp: new Date(),
                buId: activeBU.id
            };
            setActiveMessages(prev => [...prev, systemMessage]);

            if (useSupabaseChat && workspaceId && currentSessionId && selectedAgent) {
                addDoc(collection(db, "chat_messages"), {
                    workspaceId,
                    sessionId: currentSessionId,
                    agentId: selectedAgent.id,
                    participantName: agent.name,
                    sender: Sender.System,
                    text: systemMessage.text,
                    buId: activeBU.id,
                    hasAttachment: false,
                    createdAt: new Date()
                }).catch((error) => console.error("Erro ao persistir mensagem de sistema:", error));
            }
        }
    };

    const extractLearningItems = (rawLearning: string): string[] => {
        const cleaned = String(rawLearning || '').trim();
        if (!cleaned) return [];
        if (/nenhum aprendizado novo/i.test(cleaned)) return [];

        const lines = cleaned
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => line.replace(/^[-*•\d\.\)\s]+/, '').trim())
            .filter(Boolean);

        if (lines.length === 0) return [];
        if (lines.length === 1) return [lines[0]];
        return Array.from(new Set(lines));
    };

    const handleConsolidateLearning = async () => {
        if (!selectedAgent || activeMessages.length < 5) return;
        setIsTraining(true);
        const historyText = activeMessages.map(m => `${m.sender}: ${m.text}`).join('\n');
        const learnings = await consolidateChatMemory(historyText);

        const learningItems = extractLearningItems(learnings || '');
        if (learningItems.length > 0) {
            const memoryTargets = Array.from(
                new Map(
                    [selectedAgent, ...activeParticipants]
                        .filter((agent) => agent?.id)
                        .map((agent) => [agent.id, agent])
                ).values()
            );

            if (useSupabaseChat && workspaceId) {
                await Promise.all(
                    memoryTargets.flatMap((targetAgent) =>
                        learningItems.map((item) =>
                            addDoc(collection(db, "agent_memories"), {
                                workspaceId,
                                agentId: targetAgent.id,
                                sessionId: currentSessionId,
                                memoryType: 'learning',
                                content: item,
                                confidence: 0.7,
                                status: 'active',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                createdBy: ownerUserId,
                                updatedBy: ownerUserId,
                                payload: {
                                    source: 'consolidate_chat_memory',
                                    primaryAgentId: selectedAgent.id,
                                    participantAgentIds: memoryTargets.map((agent) => agent.id)
                                }
                            }).catch((error) => {
                                console.error("Erro ao persistir aprendizado em agent_memories:", error);
                            })
                        )
                    )
                );
            }

            alert("Memória consolidada e salva no Supabase com sucesso! A sessão será reidratada automaticamente a partir do banco.");
        } else {
            alert("Nada de novo para aprender nesta conversa.");
        }
        setIsTraining(false);
    };

    const openTaskModal = () => setIsTaskModalOpen(true);

    const handleSaveTaskFromModal = () => {
        if (!taskForm.title) return;
        if (onConvertToTopic) {
            onConvertToTopic({
                title: taskForm.title,
                priority: 'Média',
                assignee: taskForm.assignee,
                dueDate: taskForm.date
            });

            void createTaskGenerationFlow({
                workspaceId,
                ventureId: selectedAgent?.ventureId || null,
                conversationId: currentSessionId,
                turnId: getTurnIdFromMessages(activeMessages),
                sourceId: currentSessionId,
                userName: CURRENT_USER.name,
                agent: selectedAgent,
                title: taskForm.title,
                actionType: 'agenda_created',
                note: `Responsável: ${taskForm.assignee || 'não definido'} | Data: ${taskForm.date || 'não definida'}`
            }).catch((error) => {
                console.warn("Falha ao registrar fluxo de geração operacional (modal):", error);
            });
        }
        setIsTaskModalOpen(false);
        setTaskForm({ title: '', assignee: '', date: new Date().toISOString().split('T')[0] });
    };

    const handleApplyTitle = async (title: string) => {
        if (!currentSessionId) return;
        setSessions(prev => {
            return prev.map(s => s.id === currentSessionId ? { ...s, title } : s);
        });
        try {
            await updateDoc(doc(db, "chat_sessions", currentSessionId), { title, updatedAt: new Date() });
        } catch (error) {
            console.error("Erro ao aplicar título:", error);
        }
        setTitleOptions(null);
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (onConvertToTopic) {
            onConvertToTopic({ title: suggestion, priority: 'Média', assignee: selectedAgent?.name });

            void createTaskGenerationFlow({
                workspaceId,
                ventureId: selectedAgent?.ventureId || null,
                conversationId: currentSessionId,
                turnId: getTurnIdFromMessages(activeMessages),
                sourceId: currentSessionId,
                userName: CURRENT_USER.name,
                agent: selectedAgent,
                title: suggestion,
                actionType: 'agenda_created',
                note: 'Pauta criada a partir de sugestão do chat'
            }).catch((error) => {
                console.warn("Falha ao registrar fluxo de sugestão operacional:", error);
            });

            setTaskSuggestions(null);
        } else {
            setInput(suggestion);
        }
    };

    // --- AUDIO & FILES & DRAG DROP ---

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current?.stop();
            setIsRecording(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                audioChunksRef.current = [];

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    setIsTranscribing(true);
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        try {
                            const dataUrl = (reader.result as string) || '';
                            const base64String = dataUrl.split(',')[1] || '';
                            const transcription = await transcribeAudio(base64String, 'audio/webm');
                            const cleaned = String(transcription || '').trim();
                            if (cleaned) {
                                setInput(prev => prev ? `${prev} ${cleaned}` : cleaned);
                                setTimeout(() => {
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = 'auto';
                                        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
                                    }
                                }, 10);
                            } else {
                                setInput(prev => {
                                    const suffix = '(Não foi possível transcrever o áudio. Tente novamente.)';
                                    return prev ? `${prev} ${suffix}` : suffix;
                                });
                            }
                        } catch (e) {
                            console.error("Transcription Failed", e);
                            setInput(prev => {
                                const suffix = '(Erro na transcrição de áudio. Tente novamente.)';
                                return prev ? `${prev} ${suffix}` : suffix;
                            });
                        } finally {
                            setIsTranscribing(false);
                            stream.getTracks().forEach(track => track.stop());
                        }
                    };
                };

                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Mic Access Error", err);
                alert("Permissão de microfone negada. Verifique as configurações do navegador.");
            }
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChatAttachmentSelect(e);
    };

    const uploadAttachmentToStorage = async (file: File, localId: string) => {
        if (!workspaceId || !currentSessionId) {
            throw new Error('Sessão ou Workspace não definido para upload.');
        }

        const bucket = 'sagb_chat_attachments';
        const path = buildChatStoragePath({
            workspaceId,
            sessionId: currentSessionId,
            fileName: file.name
        });

        await uploadBlobToSupabaseStorage({
            bucket,
            path,
            blob: file,
            mimeType: file.type
        });

        return {
            storagePath: path,
            url: getSupabasePublicUrl(bucket, path)
        };
    };

    const readFileAsAttachment = (file: File, localId: string) => new Promise<ChatAttachment>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
            if (!ev.target?.result) {
                reject(new Error('Falha ao ler arquivo'));
                return;
            }
            const dataUrl = ev.target.result as string;
            const metadata = await extractMediaMetadata(file);
            
            try {
                // Realiza o upload real para o Supabase Storage
                const storageInfo = await uploadAttachmentToStorage(file, localId);

                resolve({
                    localId,
                    data: '', // Base64 agora é removido do payload final
                    storagePath: storageInfo.storagePath,
                    url: storageInfo.url,
                    mimeType: file.type || 'application/octet-stream',
                    preview: metadata.previewOverride || dataUrl,
                    name: file.name,
                    sizeBytes: file.size,
                    durationSec: metadata.durationSec,
                    uploadStatus: 'success'
                });
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
        reader.readAsDataURL(file);
    });

    const appendAttachments = async (files: FileList | File[]) => {
        const fileArray = Array.from(files || []);
        if (fileArray.length === 0) return;
        const scopeVersion = attachmentScopeVersionRef.current;

        const staged: ChatAttachment[] = fileArray.map((file) => ({
            localId: createAttachmentId(),
            data: '',
            mimeType: file.type || 'application/octet-stream',
            preview: '',
            name: file.name,
            sizeBytes: file.size,
            uploadStatus: 'pending'
        }));

        setAttachments((prev) => [...prev, ...staged]);

        await Promise.all(staged.map(async (draft, index) => {
            const sourceFile = fileArray[index];

            if (!draft.localId || !isAttachmentContextValid(draft.localId, scopeVersion)) return;

            setAttachments((prev) => prev.map((item) => (
                item.localId === draft.localId ? { ...item, uploadStatus: 'uploading' } : item
            )));

            try {
                const loaded = await readFileAsAttachment(sourceFile, String(draft.localId));
                if (!draft.localId || !isAttachmentContextValid(draft.localId, scopeVersion)) return;
                setAttachments((prev) => prev.map((item) => (
                    item.localId === draft.localId ? loaded : item
                )));
            } catch (error: any) {
                if (!draft.localId || !isAttachmentContextValid(draft.localId, scopeVersion)) return;
                setAttachments((prev) => prev.map((item) => (
                    item.localId === draft.localId
                        ? {
                            ...item,
                            uploadStatus: 'error',
                            uploadError: String(error?.message || 'Falha ao processar arquivo')
                        }
                        : item
                )));
            }
        }));
    };

    const handleChatAttachmentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        void appendAttachments(files);
        e.target.value = '';
    };

    const handleRemoveAttachment = (localId?: string) => {
        if (localId) cancelledAttachmentIdsRef.current.add(localId);
        setAttachments((prev) => prev.filter((item) => item.localId !== localId));
    };

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;
        void appendAttachments(files);
    };

    const handleGlobalDragOver = (e: React.DragEvent) => {
        if (selectedAgent) e.preventDefault();
    };

    const handleGlobalDrop = (e: React.DragEvent) => {
        if (selectedAgent) {
            e.preventDefault();
            handleDrop(e);
        }
    };

    const extractTextFromAttachment = (fileAttachment?: { data: string, mimeType: string, preview: string } | null): string => {
        if (!fileAttachment?.data) return '';

        const mime = String(fileAttachment.mimeType || '').toLowerCase();
        const isTextual =
            mime.startsWith('text/') ||
            mime.includes('json') ||
            mime.includes('xml') ||
            mime.includes('yaml') ||
            mime.includes('csv') ||
            mime.includes('markdown');

        if (!isTextual) {
            return `[ANEXO ENVIADO: ${mime || 'application/octet-stream'}]`;
        }

        try {
            const decoded = atob(fileAttachment.data);
            const excerpt = decoded.slice(0, 12000).trim();
            if (!excerpt) return '';
            return `[CONTEUDO DO ARQUIVO ANEXADO]\n${excerpt}`;
        } catch {
            return `[ANEXO ENVIADO: ${mime || 'text/plain'}]`;
        }
    };

    const extractTextFromAttachments = (items: Array<{ data: string, mimeType: string, preview: string }>) => {
        return (items || [])
            .map((item) => extractTextFromAttachment(item))
            .filter(Boolean)
            .join('\n\n');
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        if (ev.target?.result) {
                            setAttachments((prev) => [...prev, {
                                localId: createAttachmentId(),
                                data: (ev.target.result as string).split(',')[1],
                                mimeType: blob.type,
                                preview: ev.target.result as string,
                                name: `clipboard-image-${Date.now()}.png`,
                                uploadStatus: 'success'
                            }]);
                        }
                    };
                    reader.readAsDataURL(blob);
                }
            }
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((!input.trim() && attachments.filter((item) => item.uploadStatus === 'success').length === 0) || isLoading || !selectedAgent) return;

        if (!workspaceId || !currentSessionId) {
            alert("Workspace ou sessão não definidos. Abra uma nova conversa.");
            return;
        }

        const userText = input.trim();
        const hasPendingUploads = attachments.some((item) => item.uploadStatus === 'pending' || item.uploadStatus === 'uploading');
        if (hasPendingUploads) return;
        const currentAttachments = attachments.filter((item) => item.uploadStatus === 'success');
        const canPersistChat = Boolean(workspaceId && currentSessionId);
        const now = new Date();
        const providerForMessage = resolveProvider(selectedModelProvider);
        const turnId = getTurnIdFromMessages(activeMessages);
        const attachmentTextShared = extractTextFromAttachments(currentAttachments);
        const vaultContextShared = selectedVaultPromptBlock;
        const userDisplayText = currentAttachments.length > 0
            ? (userText ? `${userText} 📎 [${currentAttachments.length} arquivo(s) anexado(s)]` : `📎 [${currentAttachments.length} arquivo(s) enviado(s)]`)
            : userText;
        const flowParticipants = Array.from(new Set([
            CURRENT_USER.name,
            selectedAgent.name,
            ...activeParticipants.map((participant) => participant.name)
        ].filter(Boolean)));
        let intelligenceFlowId: string | null = null;
        let flowStepOrder = 1;
        let flowPersistenceEnabled = canPersistChat;
        let flowHasError = false;
        let flowHasHandoff = activeParticipants.length > 0;
        let flowReplyCount = 0;

        const appendFlowStepSafe = async (input: Omit<Parameters<typeof appendIntelligenceFlowStep>[0], 'flowId' | 'workspaceId' | 'conversationId' | 'turnId'>) => {
            if (!flowPersistenceEnabled || !intelligenceFlowId) return;
            try {
                await appendIntelligenceFlowStep({
                    flowId: intelligenceFlowId,
                    workspaceId,
                    conversationId: currentSessionId,
                    turnId,
                    stepOrder: flowStepOrder++,
                    ...input
                });
            } catch (error) {
                flowPersistenceEnabled = false;
                console.warn("Falha ao persistir intelligence_flow_step:", error);
            }
        };

        if (flowPersistenceEnabled) {
            try {
                intelligenceFlowId = await startIntelligenceFlow({
                    workspaceId,
                    ventureId: selectedAgent.ventureId || null,
                    conversationId: currentSessionId,
                    turnId,
                    flowType: activeParticipants.length > 0 ? 'handoff' : 'conversation',
                    sourceKind: 'conversation',
                    sourceId: currentSessionId,
                    origin: `Chat: ${selectedAgent.name}`,
                    participants: flowParticipants,
                    finalAction: 'Em processamento',
                    status: 'running',
                    payload: {
                        buId: activeBU.id,
                        selectedModel: providerForMessage,
                        participantAgentIds: activeParticipants.map((participant) => participant.id)
                    }
                });
            } catch (error) {
                flowPersistenceEnabled = false;
                console.warn("Falha ao criar intelligence_flow:", error);
            }
        }

        setInput('');
        resetAttachmentWorkflow();
        setAutoScrollEnabled(true);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.focus();
        }

        let userMsgId = `${Date.now()}_user`;
        const userMsg: Message = {
            id: userMsgId,
            text: userDisplayText,
            sender: Sender.User,
            timestamp: now,
            buId: activeBU.id,
            attachment: currentAttachments[0],
            attachments: currentAttachments
        };

        setActiveMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        if (canPersistChat) {
            addDoc(collection(db, "chat_messages"), {
                workspaceId,
                sessionId: currentSessionId,
                agentId: selectedAgent.id,
                sender: Sender.User,
                text: userDisplayText,
                buId: activeBU.id,
                hasAttachment: currentAttachments.length > 0,
                attachment: currentAttachments.length > 0 ? currentAttachments : null,
                createdAt: now,
                payload: {
                    turn_id: turnId,
                    message_kind: 'user_input',
                    ...createMessageTelemetry({
                        provider: providerForMessage,
                        promptText: [userText, attachmentTextShared, vaultContextShared].filter(Boolean).join('\n\n'),
                        completionText: '',
                        latencyMs: 0
                    })
                }
            }).then(savedUser => {
                setActiveMessages(prev => prev.map(m => m.id === userMsgId ? { ...m, id: savedUser.id } : m));
                userMsgId = savedUser.id;
            }).catch(error => {
                console.error("Erro ao persistir mensagem do usuário:", error);
            });
        }

        await appendFlowStepSafe({
            actorType: 'user',
            actorId: ownerUserId,
            actorName: CURRENT_USER.name,
            actionType: 'question',
            status: 'ok',
            modelUsed: providerForMessage,
            tokensIn: Math.ceil(([userText, attachmentTextShared, vaultContextShared].filter(Boolean).join('\n\n').length || 1) / 4),
            tokensOut: 0,
            latencyMs: 0,
            estimatedCost: 0,
            note: userText || `Mensagem com ${currentAttachments.length} anexo(s)`,
            eventTime: now,
            payload: {
                attachmentsCount: currentAttachments.length,
                selectedVaultDocumentsCount: selectedVaultDocuments.length
            }
        });

        if (canPersistChat) {
            const userEvents = detectUserQualityEvents(userText).map((eventDraft) => ({
                ...eventDraft,
                messageRef: userMsgId
            }));

            if (userEvents.length > 0) {
                void persistQualityEventsBatch({
                    workspaceId,
                    ventureId: selectedAgent.ventureId || null,
                    conversationId: currentSessionId,
                    turnId,
                    agent: selectedAgent,
                    modelUsed: providerForMessage,
                    workflowVersion: 'quality-sensor-v1',
                    policyVersion: 'governance-v1'
                }, userEvents);
            }
        }

        try {
            const participantsLabel = activeParticipants.length > 0
                ? `[MESA: ${activeParticipants.map((participant) => participant.name).join(', ')}]`
                : '';
            const speakerQueue = [selectedAgent, ...activeParticipants];
            const generatedReplies: Message[] = [];
            let previousSpeaker: Agent | null = null;

            for (const speaker of speakerQueue) {
                let botMsgId = `${Date.now()}_${speaker.id}`;
                let persistedBotId: string | null = null;
                const speakerStartedAt = Date.now();
                let completionTokensFromProvider: number | null = null;

                if (previousSpeaker && previousSpeaker.id !== speaker.id) {
                    flowHasHandoff = true;
                    await appendFlowStepSafe({
                        actorType: 'system',
                        actorName: 'Sistema',
                        actionType: 'handoff',
                        status: 'ok',
                        note: `${previousSpeaker.name} -> ${speaker.name}`,
                        eventTime: new Date()
                    });
                }

                setActiveMessages((prev) => [...prev, {
                    id: botMsgId,
                    text: '',
                    sender: Sender.Bot,
                    timestamp: new Date(),
                    buId: activeBU.id,
                    isStreaming: true,
                    participantName: speaker.name
                }]);

                if (canPersistChat) {
                    addDoc(collection(db, "chat_messages"), {
                        workspaceId,
                        sessionId: currentSessionId,
                        agentId: speaker.id,
                        participantName: speaker.name,
                        sender: Sender.Bot,
                        text: '',
                        buId: activeBU.id,
                        hasAttachment: false,
                        createdAt: new Date(),
                        payload: {
                            isStreaming: true,
                            turn_id: turnId,
                            model_used: providerForMessage,
                            message_kind: 'assistant_output'
                        }
                    }).then(savedBot => {
                        setActiveMessages(prev => prev.map(m => m.id === botMsgId ? { ...m, id: savedBot.id } : m));
                        botMsgId = savedBot.id;
                        persistedBotId = savedBot.id;
                    }).catch(error => {
                        console.error("Erro ao criar placeholder da resposta no banco:", error);
                    });
                }

                try {
                    const { ragContext, runtimeContext } = buildRuntimeContextForTurn(speaker, userText);
                    let finalBotText = '';
                    let actualProviderExecuted = providerForMessage;
                    let fallbackTriggered = false;
                    let fallbackReason = '';

                    const runModelGeneration = async (targetProvider: ModelProvider): Promise<{ text: string, tokens?: number }> => {
                        let resultText = '';
                        let tokens: number | undefined;

                        if (isDeepSeekProvider(targetProvider)) {
                            const deepSeekHistory = activeMessages
                                .concat(userMsg)
                                .concat(generatedReplies)
                                .map((message) => ({
                                    role: message.sender === Sender.User ? 'user' : 'assistant',
                                    content: message.text
                                })) as DeepSeekMessage[];
                            if (attachmentTextShared) deepSeekHistory.push({ role: 'user', content: attachmentTextShared });
                            if (runtimeContext) deepSeekHistory.push({ role: 'system', content: runtimeContext });
                            if (participantsLabel) deepSeekHistory.push({ role: 'system', content: participantsLabel });

                            const stream = streamDeepSeekResponse(deepSeekHistory, buildSystemInstructionForAgent(speaker));
                            for await (const chunk of stream) {
                                const text = (chunk as any)?.text || '';
                                if (typeof (chunk as any)?.completionTokens === 'number') tokens = Number((chunk as any).completionTokens);
                                resultText += text;
                                setActiveMessages((prev) => prev.map((m) => m.id === botMsgId ? { ...m, text: resultText } : m));
                            }
                        } else if (isLlamaLocalProvider(targetProvider)) {
                            const llamaHistory = activeMessages
                                .concat(userMsg)
                                .concat(generatedReplies)
                                .map((message) => ({ role: message.sender === Sender.User ? 'user' : 'assistant', content: message.text })) as LlamaMessage[];
                            if (attachmentTextShared) llamaHistory.push({ role: 'user', content: attachmentTextShared });
                            if (runtimeContext) llamaHistory.push({ role: 'system', content: runtimeContext });
                            if (participantsLabel) llamaHistory.push({ role: 'system', content: participantsLabel });

                            const stream = streamLlamaLocalResponse(llamaHistory, buildSystemInstructionForAgent(speaker) || '');
                            for await (const chunk of stream) {
                                resultText += chunk.text;
                                setActiveMessages((prev) => prev.map((m) => m.id === botMsgId ? { ...m, text: resultText } : m));
                            }
                        } else if (isProxyProvider(targetProvider)) {
                            const proxyHistory = activeMessages
                                .concat(userMsg)
                                .concat(generatedReplies)
                                .map((message) => ({ role: message.sender === Sender.User ? 'user' : 'assistant', content: message.text })) as ProxyProviderMessage[];
                            if (attachmentTextShared) proxyHistory.push({ role: 'user', content: attachmentTextShared });
                            if (runtimeContext) proxyHistory.push({ role: 'system', content: runtimeContext });
                            if (participantsLabel) proxyHistory.push({ role: 'system', content: participantsLabel });

                            const stream = streamProxyProviderResponse(targetProvider, proxyHistory, buildSystemInstructionForAgent(speaker) || '');
                            for await (const chunk of stream) {
                                resultText += chunk.text;
                                setActiveMessages((prev) => prev.map((m) => m.id === botMsgId ? { ...m, text: resultText } : m));
                            }
                        } else {
                            const modelId = 'gemini-2.5-flash';
                            const historyForSpeaker = activeMessages
                                .concat(userMsg)
                                .concat(generatedReplies)
                                .filter((m) => m.sender !== Sender.System)
                                .map((m) => ({ role: m.sender === Sender.User ? 'user' : 'model', parts: [{ text: m.text }] }));

                            const longTermMemory = retrieveLearnedMemory(speaker);
                            const docsInventory = buildAgentDocsInventory(speaker);
                            const speakerSession = startAgentSession(
                                speaker.id,
                                buildSystemInstructionForAgent(speaker) || '',
                                speaker.knowledgeBase || [],
                                modelId,
                                historyForSpeaker,
                                CURRENT_USER,
                                undefined,
                                longTermMemory,
                                docsInventory
                            );

                            let messagePayload: any = userText;
                            if (runtimeContext) messagePayload = `${runtimeContext}\n\n[MENSAGEM DO USUÁRIO]:\n${userText}`;
                            if (participantsLabel) messagePayload = `${participantsLabel}\n${messagePayload}`;
                            if (currentAttachments.length > 0) {
                                const textPart = { text: typeof messagePayload === 'string' ? messagePayload : userText };
                                const inlineParts = currentAttachments.map((f) => ({ inlineData: { mimeType: f.mimeType, data: f.data } }));
                                messagePayload = [textPart, ...inlineParts];
                            }

                            const result = await speakerSession.sendMessageStream({ message: messagePayload });
                            for await (const chunk of result) {
                                const text = (chunk as any).text || '';
                                resultText += text;
                                setActiveMessages((prev) => prev.map((m) => m.id === botMsgId ? { ...m, text: resultText } : m));
                            }
                        }
                        return { text: resultText, tokens };
                    };

                    try {
                        const primaryResult = await runModelGeneration(providerForMessage);
                        finalBotText = primaryResult.text;
                        completionTokensFromProvider = primaryResult.tokens || null;
                    } catch (primaryError: any) {
                        console.warn(`Falha no provider principal (${providerForMessage}). Iniciando fallback para Gemini...`, primaryError);
                        fallbackTriggered = true;
                        fallbackReason = String(primaryError?.message || 'timeout/unreachable');
                        actualProviderExecuted = 'gemini';

                        const fallbackResult = await runModelGeneration('gemini');
                        finalBotText = fallbackResult.text;
                        completionTokensFromProvider = fallbackResult.tokens || null;
                    }

                    const summonMatch = finalBotText.match(/<<<CALL: (.*?)>>>/);
                    const summonedAgentName = summonMatch?.[1] ? String(summonMatch[1]).trim() : null;
                    let summonedAgent: Agent | null = null;
                    if (summonedAgentName) {
                        const agentName = summonedAgentName;
                        const agentToCall = dynamicAgents.find((agent) => (
                            agent.name.includes(agentName) || agentName.includes(agent.name)
                        ));
                        summonedAgent = agentToCall || null;
                        if (agentToCall && !activeParticipants.some((participant) => participant.id === agentToCall.id)) {
                            handleInviteAgent(agentToCall, false);
                        }
                    }
                    finalBotText = finalBotText.replace(/<<<CALL:\s*.*?>>>/g, '').trim();

                    const promptForTelemetry = [userText, attachmentTextShared, vaultContextShared, ragContext || '', participantsLabel || '']
                        .filter(Boolean)
                        .join('\n\n');
                    const latencyMs = Date.now() - speakerStartedAt;
                    const messageTelemetry = createMessageTelemetry({
                        provider: actualProviderExecuted,
                        providerSelected: providerForMessage,
                        fallbackTriggered,
                        fallbackReason,
                        promptText: promptForTelemetry,
                        completionText: finalBotText,
                        latencyMs,
                        completionTokens: completionTokensFromProvider
                    });
                    flowReplyCount += 1;

                    await appendFlowStepSafe({
                        actorType: 'agent',
                        actorId: speaker.id,
                        actorName: speaker.name,
                        actionType: 'analysis',
                        status: 'ok',
                        modelUsed: providerForMessage,
                        workflowVersion: 'chat-v2',
                        policyVersion: 'governance-v1',
                        dnaVersion: speaker.version || null,
                        latencyMs: Number(messageTelemetry.latency_ms || 0),
                        tokensIn: Number(messageTelemetry.prompt_tokens_estimated || 0),
                        tokensOut: Number(messageTelemetry.completion_tokens_estimated || 0),
                        estimatedCost: Number(messageTelemetry.cost_estimated_usd || 0),
                        note: 'Análise concluída',
                        eventTime: new Date()
                    });

                    await appendFlowStepSafe({
                        actorType: 'agent',
                        actorId: speaker.id,
                        actorName: speaker.name,
                        actionType: 'response',
                        status: statusFromText(finalBotText),
                        modelUsed: actualProviderExecuted,
                        workflowVersion: 'chat-v2',
                        policyVersion: 'governance-v1',
                        dnaVersion: speaker.version || null,
                        latencyMs: Number(messageTelemetry.latency_ms || 0),
                        tokensIn: Number(messageTelemetry.prompt_tokens_estimated || 0),
                        tokensOut: Number(messageTelemetry.completion_tokens_estimated || 0),
                        estimatedCost: Number(messageTelemetry.cost_estimated_usd || 0),
                        note: finalBotText.slice(0, 180),
                        eventTime: new Date()
                    });

                    if (summonedAgentName) {
                        flowHasHandoff = true;
                        await appendFlowStepSafe({
                            actorType: 'agent',
                            actorId: speaker.id,
                            actorName: speaker.name,
                            actionType: 'handoff',
                            status: summonedAgent ? 'ok' : 'warning',
                            modelUsed: providerForMessage,
                            note: summonedAgent
                                ? `Handoff para ${summonedAgent.name}`
                                : `Tentativa de handoff sem alvo válido: ${summonedAgentName}`,
                            eventTime: new Date(),
                            payload: {
                                summonTargetName: summonedAgentName,
                                summonTargetAgentId: summonedAgent?.id || null
                            }
                        });
                    }

                    const previousBotText = [...generatedReplies]
                        .map((message) => message.text)
                        .reverse()
                        .find((text) => Boolean(String(text || '').trim()));
                    const botEvents = detectBotQualityEvents({
                        speaker,
                        finalBotText,
                        previousBotText,
                        summonTargetName: summonedAgentName,
                        summonTargetAgent: summonedAgent
                    }).map((eventDraft) => ({
                        ...eventDraft,
                        messageRef: persistedBotId || botMsgId
                    }));

                    setActiveMessages((prev) => prev.map((message) => (
                        message.id === botMsgId ? { ...message, text: finalBotText, isStreaming: false } : message
                    )));

                    if (persistedBotId) {
                        await updateDoc(doc(db, "chat_messages", persistedBotId), {
                            text: finalBotText,
                            participantName: speaker.name,
                            payload: {
                                isStreaming: false,
                                turn_id: turnId,
                                provider_selected: providerForMessage,
                                provider_executed: actualProviderExecuted,
                                fallback_triggered: fallbackTriggered,
                                fallback_reason: fallbackReason,
                                ...messageTelemetry,
                                quality_events_logged: botEvents.length
                            }
                        });
                    }

                    if (canPersistChat && botEvents.length > 0) {
                        void persistQualityEventsBatch({
                            workspaceId,
                            ventureId: speaker.ventureId || selectedAgent.ventureId || null,
                            conversationId: currentSessionId,
                            turnId,
                            agent: speaker,
                            modelUsed: actualProviderExecuted,
                            workflowVersion: 'quality-sensor-v1',
                            policyVersion: 'governance-v1'
                        }, botEvents);
                    }

                    generatedReplies.push({
                        id: `reply_${speaker.id}_${Date.now()}`,
                        text: finalBotText,
                        sender: Sender.Bot,
                        timestamp: new Date(),
                        buId: activeBU.id,
                        participantName: speaker.name
                    });
                } catch (error: any) {
                    flowHasError = true;
                    const technicalMsg = error?.message || "Conexão Instável";
                    const errorText = `Erro na conexão neural (${technicalMsg}).`;
                    console.error(`Erro ao gerar resposta de ${speaker.name}:`, error);
                    setActiveMessages((prev) => prev.map((message) => (
                        message.id === botMsgId ? { ...message, text: errorText, isStreaming: false } : message
                    )));
                    if (persistedBotId) {
                        await updateDoc(doc(db, "chat_messages", persistedBotId), {
                            text: errorText,
                            participantName: speaker.name,
                            payload: {
                                isStreaming: false,
                                turn_id: turnId,
                                model_used: providerForMessage,
                                error: technicalMsg
                            }
                        }).catch(() => null);
                    }

                    if (canPersistChat) {
                        void persistQualityEvent({
                            workspaceId,
                            ventureId: speaker.ventureId || selectedAgent.ventureId || null,
                            conversationId: currentSessionId,
                            turnId,
                            agent: speaker,
                            modelUsed: providerForMessage,
                            workflowVersion: 'quality-sensor-v1',
                            policyVersion: 'governance-v1'
                        }, {
                            eventType: 'model_error',
                            eventSubtype: 'provider_runtime_failure',
                            severity: 'high',
                            detectedBy: 'system',
                            messageRef: persistedBotId || botMsgId,
                            excerpt: errorText,
                            payload: { technicalMessage: technicalMsg }
                        });
                    }

                    await appendFlowStepSafe({
                        actorType: 'agent',
                        actorId: speaker.id,
                        actorName: speaker.name,
                        actionType: 'analysis',
                        status: 'ok',
                        modelUsed: actualProviderExecuted,
                        workflowVersion: 'chat-v2',
                        policyVersion: 'governance-v1',
                        dnaVersion: speaker.version || null,
                        note: errorText,
                        eventTime: new Date(),
                        payload: { technicalMessage: technicalMsg }
                    });
                }

                previousSpeaker = speaker;
            }

            if (currentSessionId) {
                await updateSessionMetadata(currentSessionId);
            }

            const suggestionsContext = [userText, ...generatedReplies.map((message) => message.text)].join('\n\n');
            const suggestions = await generateTaskSuggestions(suggestionsContext);
            setTaskSuggestions(suggestions.length > 0 ? suggestions : []);
            setIsSuggestionPanelVisible(false);

            if (intelligenceFlowId && flowPersistenceEnabled) {
                const finalAction = inferFlowFinalAction({
                    userText,
                    generatedReplies,
                    suggestionsCount: suggestions.length
                });
                let finalFlowType: 'conversation' | 'handoff' | 'decision' | 'task_generation' | 'cid_processing' = flowHasHandoff ? 'handoff' : 'conversation';
                if (/decis[aã]o registrada/i.test(finalAction)) finalFlowType = 'decision';
                if (/pauta criada|tarefa criada/i.test(finalAction)) finalFlowType = 'task_generation';

                await finalizeIntelligenceFlow({
                    flowId: intelligenceFlowId,
                    flowType: finalFlowType,
                    finalAction,
                    status: flowHasError ? 'error' : 'ok',
                    participants: flowParticipants,
                    payload: {
                        suggestionsCount: suggestions.length,
                        repliesCount: flowReplyCount,
                        selectedModel: providerForMessage,
                        hasError: flowHasError,
                        hasHandoff: flowHasHandoff
                    }
                }).catch((error) => {
                    console.warn("Falha ao finalizar intelligence_flow:", error);
                });
            }
        } catch (error) {
            flowHasError = true;
            if (intelligenceFlowId && flowPersistenceEnabled) {
                await appendFlowStepSafe({
                    actorType: 'system',
                    actorName: 'Sistema',
                    actionType: 'error',
                    status: 'error',
                    modelUsed: providerForMessage,
                    note: `Falha geral de execução: ${String((error as any)?.message || 'erro desconhecido')}`,
                    eventTime: new Date()
                });

                await finalizeIntelligenceFlow({
                    flowId: intelligenceFlowId,
                    flowType: flowHasHandoff ? 'handoff' : 'conversation',
                    finalAction: 'Fluxo encerrado com erro',
                    status: 'error',
                    participants: flowParticipants,
                    payload: {
                        selectedModel: providerForMessage,
                        hasError: true
                    }
                }).catch(() => null);
            }
            console.error("Neural Connection Error Detail:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const directorsList: PersonaConfig[] = [
        {
            id: selectedAgent?.id || 'main',
            name: selectedAgent?.name || '',
            baseRole: selectedAgent?.officialRole || '',
            tier: 'ESTRATÉGICO',
            contextInfo: '',
            tone: '',
            welcomeMessage: '',
            avatarColor: '',
            imageUrl: selectedAgent?.avatarUrl
        },
        ...activeParticipants.map(p => ({
            id: p.id,
            name: p.name,
            baseRole: p.officialRole,
            tier: 'ESTRATÉGICO' as AgentTier,
            contextInfo: '',
            tone: '',
            welcomeMessage: '',
            avatarColor: '',
            imageUrl: p.avatarUrl
        }))
    ];

    const normalizedSessionSearch = sessionSearch.trim().toLowerCase();
    const assigneeOptions = useMemo(() => {
        const base = [selectedAgent?.name, CURRENT_USER.name, ...activeParticipants.map((participant) => participant.name)];
        return Array.from(new Set(base.filter(Boolean)));
    }, [selectedAgent?.name, CURRENT_USER.name, activeParticipants]);

    const visibleSessions = useMemo(() => {
        if (!normalizedSessionSearch) return sessions;
        return sessions.filter((session) => session.title.toLowerCase().includes(normalizedSessionSearch));
    }, [sessions, normalizedSessionSearch]);

    const availableVaultDocuments = useMemo<VaultDocumentOption[]>(() => {
        return (vaultItems || []).map((item) => {
            const payload = (item.payload && typeof item.payload === 'object') ? item.payload : {};
            const previewContent = typeof payload.previewData === 'string' ? payload.previewData : '';
            const updatedAt = item.updatedAt instanceof Date ? item.updatedAt.toISOString() : String(item.updatedAt || '');
            return {
                id: item.id,
                title: item.name,
                content: previewContent || 'Conteúdo protegido. Consulte o Cofre Black.',
                mimeType: String(payload.mimeType || item.itemType || 'text/plain'),
                payload,
                uploadedAt: updatedAt
            };
        });
    }, [vaultItems]);

    const filteredVaultDocuments = useMemo(() => {
        const term = vaultSearchTerm.trim().toLowerCase();
        if (!term) return availableVaultDocuments;
        return availableVaultDocuments.filter((doc) => doc.title.toLowerCase().includes(term));
    }, [availableVaultDocuments, vaultSearchTerm]);

    const selectedVaultDocuments = useMemo(() => {
        const lookup = new Set(selectedVaultDocumentIds);
        return availableVaultDocuments.filter((doc) => lookup.has(doc.id));
    }, [availableVaultDocuments, selectedVaultDocumentIds]);

    const selectedVaultContext = useMemo(() => {
        if (selectedVaultDocuments.length === 0) return '';
        const docs = selectedVaultDocuments.map((doc, index) => {
            const content = String(doc.content || '').trim();
            return `--- ARQUIVO ${index + 1}: ${doc.title} ---\n${content || 'Conteúdo não disponível para preview inline.'}`;
        }).join('\n\n');
        return `[ARQUIVOS DO COFRE BLACK SELECIONADOS PARA ESTA CONVERSA]\nUse estes documentos como contexto prioritário quando forem relevantes.\n\n${docs}`;
    }, [selectedVaultDocuments]);

    const selectedVaultSummary = useMemo(() => {
        if (selectedVaultDocuments.length === 0) return '';
        return selectedVaultDocuments
            .map((doc, index) => `• Arquivo ${index + 1} (${doc.title}): ${buildDocumentSummary(doc.content, doc.title)}`)
            .join('\n');
    }, [selectedVaultDocuments]);

    const selectedVaultPromptBlock = useMemo(() => {
        if (!selectedVaultContext) return '';
        const summaryBlock = selectedVaultSummary
            ? `\n[RESUMO DOS ARQUIVOS SELECIONADOS NESTE CHAT]\n${selectedVaultSummary}\n`
            : '';

        return `
[FONTES EXPLICITAS DO CHAT - PRIORIDADE MAXIMA]
O usuario selecionou ${selectedVaultDocuments.length} arquivo(s) do Cofre Black especificamente para ESTA conversa.
Voce deve usar esses arquivos como fonte principal da resposta.
Antes de recorrer ao DNA do agente, memoria, inventario geral ou outros documentos, consulte primeiro estes arquivos selecionados.
Se houver conflito entre arquivos selecionados no chat e outros contextos gerais, priorize os arquivos selecionados no chat.
Quando a pergunta pedir analise, sintese ou resumo, resuma primeiro os arquivos selecionados e baseie a resposta neles.
${summaryBlock}
${selectedVaultContext}
`.trim();
    }, [selectedVaultContext, selectedVaultDocuments.length, selectedVaultSummary]);

    const buildAgentDocsInventory = useCallback((agent: Agent) => {
        const docs = agent.globalDocuments
            ? agent.globalDocuments.map((doc) => `- ${doc.title}`).join('\n')
            : '';

        if (!docs) {
            return selectedVaultPromptBlock
                ? 'Nenhum documento de DNA listado. Os arquivos escolhidos no chat devem ser tratados como fonte principal.'
                : 'Nenhum documento vinculado.';
        }

        if (!selectedVaultPromptBlock) return docs;

        return [
            'ATENCAO: os documentos abaixo pertencem ao DNA/permissoes gerais do agente e sao contexto secundario nesta conversa.',
            'Priorize primeiro os arquivos explicitamente selecionados no chat pelo usuario.',
            docs
        ].join('\n');
    }, [selectedVaultPromptBlock]);

    const buildSystemInstructionForAgent = useCallback((agent: Agent) => {
        return [selectedVaultPromptBlock, resolveAgentBasePrompt(agent)]
            .filter(Boolean)
            .join('\n\n');
    }, [selectedVaultPromptBlock]);

    const buildRuntimeContextForTurn = useCallback((agent: Agent, userText: string) => {
        const userContextBlock = `[Contexto Sistêmico]: O usuário interagindo nesta conversa é ${CURRENT_USER.name} (${CURRENT_USER.role}). Responda diretamente a ele.`;
        const prioritizedContext = selectedVaultPromptBlock ? [userContextBlock, selectedVaultPromptBlock] : [userContextBlock];
        const ragContext = selectedVaultPromptBlock ? '' : retrieveRelevantContext(agent, userText);
        const runtimeContext = [...prioritizedContext, ragContext].filter(Boolean).join('\n\n');

        return {
            ragContext,
            runtimeContext
        };
    }, [selectedVaultPromptBlock, CURRENT_USER]);

    const patchSessionPayload = async (sessionId: string, partialPayload: Record<string, any>) => {
        const session = sessions.find((item) => item.id === sessionId);
        const nextParticipantIds = Array.isArray(partialPayload.participantAgentIds)
            ? partialPayload.participantAgentIds.map((id: any) => String(id))
            : (session?.participantIds || []);
        const nextSelectedVaultDocumentIds = Array.isArray(partialPayload.selectedVaultDocumentIds)
            ? partialPayload.selectedVaultDocumentIds.map((id: any) => String(id))
            : (session?.selectedVaultDocumentIds || []);

        setSessions((prev) => prev.map((item) => (
            item.id === sessionId
                ? {
                    ...item,
                    participantIds: nextParticipantIds,
                    selectedVaultDocumentIds: nextSelectedVaultDocumentIds
                }
                : item
        )));

        try {
            await updateDoc(doc(db, "chat_sessions", sessionId), {
                payload: {
                    participantAgentIds: nextParticipantIds,
                    selectedVaultDocumentIds: nextSelectedVaultDocumentIds
                },
                updatedAt: new Date()
            });
        } catch (error) {
            console.error("Erro ao persistir payload da sessão:", error);
        }
    };

    const persistSelectedVaultDocuments = async (sessionId: string, documentIds: string[]) => {
        await patchSessionPayload(sessionId, { selectedVaultDocumentIds: documentIds });
    };

    const toggleVaultDocument = (documentId: string) => {
        setSelectedVaultDocumentIds((prev) => {
            const exists = prev.includes(documentId);
            const next = exists ? prev.filter((id) => id !== documentId) : [...prev, documentId];
            if (currentSessionId) {
                void persistSelectedVaultDocuments(currentSessionId, next);
            }
            return next;
        });
    };

    const renderVaultPreview = () => {
        if (!previewVaultDoc) return null;

        const mime = String(previewVaultDoc.mimeType || '').toLowerCase();
        const previewContent = String(previewVaultDoc.content || '');

        const renderContent = () => {
            if (!previewContent) {
                return (
                    <div className="bg-white p-10 rounded-2xl shadow-lg flex flex-col items-center gap-3 max-w-xl">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <FileTextIcon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-700">Nenhum preview disponível</h3>
                        <p className="text-xs text-gray-500 text-center">O documento está registrado no Cofre, mas não possui visualização inline.</p>
                    </div>
                );
            }
            if (mime.startsWith('image/')) {
                return <img src={previewContent} alt={previewVaultDoc.title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-lg" />;
            }
            if (mime.startsWith('audio/')) {
                return <audio controls src={previewContent} className="w-80" />;
            }
            if (mime.startsWith('video/')) {
                return <video controls src={previewContent} className="max-w-full max-h-[80vh] rounded-lg shadow-lg" />;
            }
            if (mime === 'application/pdf' && previewContent.startsWith('data:')) {
                return <iframe src={previewContent} className="w-full h-[80vh] rounded-lg border border-gray-200" title={previewVaultDoc.title}></iframe>;
            }
            return (
                <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-4xl h-[80vh] flex flex-col">
                    <h3 className="text-lg font-black text-bitrix-nav uppercase mb-4 border-b pb-4">{previewVaultDoc.title}</h3>
                    <pre className="flex-1 overflow-auto custom-scrollbar text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed">{previewContent}</pre>
                </div>
            );
        };

        return (
            <div className="fixed inset-0 z-[130] bg-bitrix-nav/90 backdrop-blur-sm flex items-center justify-center p-6 animate-msg" onClick={() => setPreviewVaultDoc(null)}>
                <div className="relative w-full max-w-6xl flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setPreviewVaultDoc(null)} className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors">
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

    return (
        <div
            className="flex-1 h-full bg-[#FAFAFA] overflow-hidden flex flex-col relative font-sans"
            onDragOver={handleGlobalDragOver}
            onDrop={handleGlobalDrop}
        >
            <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.md,.json,.csv,.js,.ts,.tsx,.py,.html,.css,.xml,.env,.yml,.yaml" onChange={handleFileSelect} />
            <input type="file" ref={chatAttachmentRef} className="hidden" multiple accept="image/*,audio/*,application/pdf,.txt,.md,.json,.csv,.xml,.yaml,.yml" onChange={handleChatAttachmentSelect} />
            {renderVaultPreview()}

            {forcedAgent && !selectedAgent && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-sagb-bg dark:bg-sagb-bg-2">
                    <div className="flex flex-col items-center gap-3 text-sagb-text dark:text-sagb-text">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sagb-muted border-t-transparent" />
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sagb-muted">Abrindo conversa...</p>
                    </div>
                </div>
            )}

            {!forcedAgent && (
                <div className="px-6 md:px-12 py-6 border-b border-gray-100 flex justify-between items-end shrink-0 bg-white z-10">
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-bitrix-nav tracking-tighter uppercase">{viewMode === 'global' ? 'Equipe Global' : 'Cluster View'}</h1>
                        <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] mt-1 text-gray-400">{viewMode === 'global' ? 'Todos os Agentes do Ecossistema' : 'Visão Sistêmica'}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        {onAddAgent && (
                            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-bitrix-nav text-white px-4 md:px-5 py-2 md:py-2.5 rounded-xl shadow-lg hover:scale-105 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg>
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest hidden md:inline">Novo Ativo</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {!forcedAgent && (
                <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/50">
                    <div className="px-6 md:px-12 py-6 md:py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                            <div className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border border-white/80 rounded-[20px] p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Estrutura</p>
                                        <h3 className="text-3xl font-black text-indigo-900 tracking-tighter">{totalCompanies}</h3>
                                        <p className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-wide">{totalAgents} Headcount</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 256 256"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,160H40V56H216V200ZM80,148a12,12,0,1,1,12,12A12,12,0,0,1,80,148Zm0-60a12,12,0,1,1,12,12A12,12,0,0,1,80,88Zm60,60a12,12,0,1,1,12,12A12,12,0,0,1,140,148Zm0-60a12,12,0,1,1,12,12A12,12,0,0,1,140,88Zm60,60a12,12,0,1,1,12,12A12,12,0,0,1,200,148Zm0-60a12,12,0,1,1,12,12A12,12,0,1,1,12,12A12,12,0,0,1,200,88Z"></path></svg>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-12 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                            {Object.entries(agentsByBU).map(([buId, rawAgents]) => {
                                const agents = rawAgents as Agent[];
                                const sortedAgents = sortAgents([...agents]);
                                const buName = sortedAgents[0]?.company || buId.toUpperCase();

                                return (
                                    <div key={buId} className="bg-white rounded-[1.5rem] p-4 border border-gray-100 shadow-sm flex flex-col gap-3 hover:shadow-lg transition-all animate-msg relative group">
                                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                                            <div>
                                                <h3 className="text-sm font-black text-bitrix-nav uppercase tracking-tight">{buName}</h3>
                                                <span className="text-[8px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">{agents.length} Agentes</span>
                                            </div>
                                            <button onClick={() => onEnterRoom && onEnterRoom(buId)} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-bitrix-nav hover:text-white transition-all shadow-sm">
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                        <div className="space-y-1">
                                            {sortedAgents.map(agent => {
                                                const isPlanned = agent.status === 'PLANNED';
                                                const isStaging = agent.status === 'STAGING';
                                                const providerLabel = getProviderLabel(agent.modelProvider);

                                                return (
                                                    <button
                                                        key={agent.id}
                                                        onClick={() => handleOpenAgent(agent)}
                                                        className={`flex items-center w-full bg-white border border-gray-100 rounded-lg p-2 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer mb-1 group ${isPlanned ? 'opacity-60 border-dashed bg-gray-50' : ''}`}
                                                    >
                                                        <div className="relative mr-3 shrink-0">
                                                            <Avatar name={agent.name} url={agent.avatarUrl} className="w-8 h-8 rounded-full object-cover border border-gray-100" />
                                                            <span className={`absolute bottom-0 right-0 w-2 h-2 border-2 border-white rounded-full ${isPlanned ? 'bg-gray-300' : isStaging ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></span>
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-left">
                                                            <h4 className={`text-xs font-semibold truncate ${isPlanned ? 'text-gray-500' : 'text-gray-900'}`}>{agent.name}</h4>
                                                            <div className="flex items-center gap-1.5">
                                                                <p className="text-[9px] font-medium text-gray-400 uppercase tracking-wider truncate">{agent.officialRole}</p>
                                                                {isStaging && <span className="text-[7px] font-bold text-yellow-600 bg-yellow-50 px-1 rounded uppercase">Beta</span>}
                                                                <span className="text-[6px] font-black text-gray-700 bg-gray-100 px-1 rounded uppercase ml-auto">{providerLabel}</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {selectedAgent && (
                <div className="fixed inset-0 z-[100] overflow-hidden bg-[linear-gradient(180deg,#F8FAFC_0%,#F4F7FB_100%)]">
                    <div className="relative w-full h-full overflow-hidden flex">
                        {renderChatAmbient()}

                        <div
                            ref={sidebarRef}
                            style={{ width: sidebarWidth }}
                            className={`
                    flex-shrink-0 relative bg-[linear-gradient(180deg,rgba(248,250,252,0.98)_0%,rgba(244,247,251,0.96)_100%)] border-r border-slate-200/80 z-20 flex flex-col transition-all duration-75
                    ${showHistorySidebar ? 'absolute inset-y-0 left-0 shadow-xl w-[88vw] max-w-[380px]' : 'hidden md:flex'}
                `}
                        >
                            <div
                                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-bitrix-accent/30 z-50 transition-colors hidden md:block"
                                onMouseDown={startResizing}
                            />

                            <div className="flex h-full flex-col gap-3 p-4 md:p-5">
                                <div className="flex items-center justify-between pb-1">
                                    <div className="flex gap-4">
                                        <span className="border-b border-bitrix-nav/70 pb-1 text-[10px] font-black uppercase tracking-[0.28em] text-bitrix-nav/90">
                                            Histórico
                                        </span>
                                    </div>
                                    <button onClick={() => setShowHistorySidebar(false)} className="md:hidden text-gray-400">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                <div className="rounded-[1.15rem] border border-white/80 bg-white/72 p-2 shadow-[0_10px_28px_rgba(15,23,42,0.04)] backdrop-blur-md">
                                    <div className="mb-2 px-2 text-[9px] font-black uppercase tracking-[0.26em] text-slate-400">Busca rápida</div>
                                    <input
                                        value={sessionSearch}
                                        onChange={(e) => setSessionSearch(e.target.value)}
                                        placeholder="Buscar conversa..."
                                        className="h-10 w-full rounded-xl border border-slate-200/80 bg-white px-3 text-[12px] font-semibold text-slate-600 outline-none transition-all placeholder:text-slate-300 focus:border-slate-300 focus:ring-2 focus:ring-slate-200/60"
                                    />
                                </div>

                                <div className="px-1 pt-1 text-[9px] font-black uppercase tracking-[0.24em] text-slate-400">Conversas</div>

                                <div className="flex-1 space-y-2 overflow-y-auto pr-1 custom-scrollbar">
                                    {sessions.length === 0 && <p className="mt-10 text-center text-[10px] font-semibold text-slate-300">Nenhum histórico.</p>}
                                    {sessions.length > 0 && visibleSessions.length === 0 && <p className="mt-10 text-center text-[10px] font-semibold text-slate-400">Nenhuma conversa encontrada.</p>}
                                    {visibleSessions.map(session => (
                                        <div key={session.id} className="group/session relative">
                                            <button
                                                onClick={() => selectSession(session.id, selectedAgent)}
                                                className={`w-full rounded-[1rem] border px-3 py-3 pr-9 text-left transition-all ${currentSessionId === session.id
                                                    ? 'border-slate-200 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.06)]'
                                                    : 'border-transparent bg-white/44 hover:border-white/90 hover:bg-white/84 text-gray-500'
                                                    }`}
                                            >
                                                <div className="w-full min-w-0">
                                                    <h4 className={`truncate text-[11px] font-black tracking-[0.01em] ${currentSessionId === session.id ? 'text-slate-800' : 'text-slate-600'
                                                        }`}>
                                                        {session.title}
                                                    </h4>
                                                    <p className={`mt-1 truncate text-[9px] font-semibold uppercase tracking-[0.18em] ${currentSessionId === session.id ? 'text-slate-400' : 'text-slate-300 group-hover/session:text-slate-400'}`}>
                                                        {currentSessionId === session.id ? 'Conversa ativa' : 'Histórico salvo'}
                                                    </p>
                                                </div>
                                            </button>

                                            <div className="absolute right-2 top-2 opacity-0 group-hover/session:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === session.id ? null : session.id); }}
                                                    className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                                                </button>

                                                {menuOpenId === session.id && (
                                                    <div className="absolute right-0 top-7 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] py-1 animate-msg">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleRenameSession(session.id); }}
                                                            className="w-full text-left px-4 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <PencilIcon className="w-3 h-3" /> Renomear
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteSession(session.id); }}
                                                            className="w-full text-left px-4 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"
                                                        >
                                                            <TrashIcon className="w-3 h-3" /> Excluir
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto border-t border-slate-200/80 pt-4">
                                    <button
                                        onClick={() => createNewSession(selectedAgent)}
                                        className="group flex h-11 w-full items-center justify-center gap-2 rounded-[1rem] bg-slate-900 text-white shadow-[0_14px_32px_rgba(15,23,42,0.16)] transition-all hover:-translate-y-[1px] hover:bg-black"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white">Nova Conversa</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col h-full relative w-full min-w-0">
                            <header className={`relative z-10 shrink-0 border-b border-white/70 bg-white/76 px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl md:px-8 md:py-5 lg:px-10 ${selectedAgent.status === 'STAGING' ? 'bg-yellow-50/88' : ''}`}>
                                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <div className="flex min-w-0 items-center gap-3 md:gap-5">
                                    <button onClick={() => setShowHistorySidebar(true)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-bitrix-nav">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                                    </button>

                                    <div className="flex items-center shrink-0">
                                        <div className="relative z-10">
                                            <Avatar name={selectedAgent.name} url={selectedAgent.avatarUrl} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-lg border-2 border-white" />
                                        </div>
                                        {activeParticipants.map((p, idx) => (
                                            <div key={p.id} className="relative -ml-6 z-0 hover:z-20 transition-all hover:scale-110">
                                                <Avatar name={p.name} url={p.avatarUrl} className="w-10 h-10 md:w-12 md:h-12 rounded-2xl shadow-lg border-2 border-white grayscale opacity-90 hover:grayscale-0 hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="truncate text-[1.15rem] font-black leading-none tracking-[-0.03em] text-slate-900 md:text-[1.55rem]">
                                                {activeParticipants.length > 0 ? 'Mesa de Reunião' : selectedAgent.name}
                                            </h2>
                                        </div>

                                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <p className="max-w-[320px] truncate text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 md:max-w-none">
                                                {activeParticipants.length > 0 ? `${activeParticipants.length + 1} Especialistas na Mesa` : selectedAgent.officialRole}
                                            </p>
                                            <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 shadow-[0_6px_18px_rgba(15,23,42,0.04)]">
                                                <span className="text-[8px] font-black uppercase tracking-[0.24em] text-slate-400">Modelo</span>
                                                <select
                                                    value={selectedModelProvider}
                                                    onChange={(e) => setSelectedModelProvider(e.target.value as ModelProvider)}
                                                    className="h-6 min-w-[120px] bg-transparent pr-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-700 outline-none"
                                                >
                                                    {MODEL_PROVIDER_OPTIONS.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {`${getProviderHealthBadge(option.value)} ${option.label}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {!activeParticipants.length && (
                                                <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-[0.22em] ${getProviderHealthBadge(selectedModelProvider) === '🟢' ? 'bg-emerald-100 text-emerald-700' : getProviderHealthBadge(selectedModelProvider) === '🔴' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {getProviderHealthBadge(selectedModelProvider)} {getProviderHealthBadge(selectedModelProvider) === '⚪' ? 'VERIFICANDO' : getProviderHealthBadge(selectedModelProvider) === '🟢' ? 'ONLINE' : 'OFFLINE'}
                                                </span>
                                            )}
                                            {selectedAgent.status === 'STAGING' && <span className="rounded-full bg-yellow-400 px-2 py-1 text-[8px] font-black uppercase tracking-[0.22em] text-yellow-900 animate-pulse">Homologação</span>}
                                        </div>
                                        {providerHealthError && (
                                            <p className="mt-2 text-[8px] font-bold text-red-500">{providerHealthError}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex max-w-full items-center gap-2 overflow-x-auto pb-1 xl:justify-end">
                                    <button
                                        onClick={() => setIsVaultModalOpen(true)}
                                        className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/82 px-3 text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900"
                                        title="Selecionar arquivos do Cofre Black"
                                    >
                                        <FolderIcon className="w-3.5 h-3.5" />
                                        <span className="hidden text-[8px] font-black uppercase tracking-[0.18em] sm:inline">Arquivos do Cofre</span>
                                        {selectedVaultDocumentIds.length > 0 && (
                                            <span className="min-w-5 h-5 px-1 rounded-full bg-bitrix-nav text-white text-[8px] font-black flex items-center justify-center">
                                                {selectedVaultDocumentIds.length}
                                            </span>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setIsInviteModalOpen(true)}
                                        className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:text-slate-800"
                                        title="Convocar Agente para a Sala"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        <span className="hidden text-[8px] font-black uppercase tracking-[0.18em] sm:inline">Participantes</span>
                                    </button>

                                    <button
                                        onClick={handleToggleSuggestionPanel}
                                        className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 text-[8px] font-black uppercase tracking-[0.18em] text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 md:text-[9px]"
                                    >
                                        <BotIcon className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Sugerir pauta</span>
                                    </button>

                                    {onConvertToTopic && (
                                        <button
                                            onClick={() => openTaskModal()}
                                            className="flex h-9 shrink-0 items-center gap-2 rounded-xl border border-slate-200/70 bg-white/60 px-3 text-[8px] font-black uppercase tracking-[0.18em] text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 md:text-[9px]"
                                        >
                                            <BookIcon className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">Gerar Pauta</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={handleCloseChat}
                                        className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-red-600 shadow-sm transition-all hover:bg-red-500 hover:text-white md:px-4"
                                    >
                                        {forcedAgent ? (
                                            <>
                                                <BackIcon className="w-3 h-3" />
                                                <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">Voltar</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-[8px] font-black uppercase tracking-widest hidden md:inline">Encerrar</span>
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12" /></svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                                </div>
                            </header>

                            <div className="flex-1 flex flex-col overflow-hidden relative">
                                {isInviteModalOpen && (
                                    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center animate-msg p-10">
                                        <div className="bg-white w-full max-w-2xl h-[500px] shadow-2xl rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col">
                                            <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                                <div>
                                                    <h3 className="text-lg font-black text-bitrix-nav uppercase tracking-tight">Convocar Especialista</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adicionar inteligência à sessão atual</p>
                                                </div>
                                                <button onClick={() => setIsInviteModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </header>
                                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {dynamicAgents
                                                        .filter(a => a.id !== selectedAgent.id && !activeParticipants.some(p => p.id === a.id) && a.status === 'ACTIVE')
                                                        .map(agent => (
                                                            <button
                                                                key={agent.id}
                                                                onClick={() => handleInviteAgent(agent, true)}
                                                                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-bitrix-nav hover:bg-gray-50 transition-all text-left group"
                                                            >
                                                                <Avatar name={agent.name} url={agent.avatarUrl} className="w-10 h-10 rounded-lg grayscale group-hover:grayscale-0" />
                                                                <div className="min-w-0">
                                                                    <h4 className="text-xs font-bold text-gray-700 truncate">{agent.name}</h4>
                                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">{agent.officialRole}</p>
                                                                </div>
                                                                <div className="ml-auto opacity-0 group-hover:opacity-100">
                                                                    <PlusIcon className="w-4 h-4 text-bitrix-nav" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                </div>
                                                {dynamicAgents.filter(a => a.status === 'ACTIVE').length <= 1 && (
                                                    <p className="text-center text-gray-400 text-xs mt-10">Nenhum outro agente ativo disponível.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isVaultModalOpen && (
                                    <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center animate-msg p-10">
                                        <div className="bg-white w-full max-w-5xl h-[560px] shadow-2xl rounded-[2.5rem] border border-gray-100 overflow-hidden flex flex-col">
                                            <header className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                                <div>
                                                    <h3 className="text-lg font-black text-bitrix-nav uppercase tracking-tight">Arquivos do Cofre Black</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Selecione um ou mais arquivos para usar neste chat</p>
                                                </div>
                                                <button onClick={() => setIsVaultModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </header>
                                            <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between gap-4">
                                                <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-2 w-full max-w-sm">
                                                    <SearchIcon className="w-4 h-4 text-gray-400" />
                                                    <input
                                                        value={vaultSearchTerm}
                                                        onChange={(e) => setVaultSearchTerm(e.target.value)}
                                                        className="bg-transparent outline-none text-xs font-medium w-full"
                                                        placeholder="Pesquisar arquivos..."
                                                    />
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                    {selectedVaultDocumentIds.length} selecionado(s)
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar flex flex-col gap-2 bg-gray-50/30">
                                                {filteredVaultDocuments.length === 0 && (
                                                    <div className="text-center py-16 opacity-50">
                                                        <p className="text-sm font-bold">Nenhum documento encontrado.</p>
                                                    </div>
                                                )}
                                                {filteredVaultDocuments.map((doc) => {
                                                    const isSelected = selectedVaultDocumentIds.includes(doc.id);
                                                    return (
                                                        <div
                                                            key={doc.id}
                                                            className={`flex items-center h-12 px-4 rounded-xl border transition-all gap-4 group ${isSelected ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm'}`}
                                                        >
                                                            <div
                                                                onClick={() => toggleVaultDocument(doc.id)}
                                                                className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all cursor-pointer ${isSelected ? 'bg-green-500 border-green-500 text-white' : 'bg-gray-50 border-gray-300 text-transparent hover:border-green-400'}`}
                                                            >
                                                                <CheckIcon className="w-3 h-3" />
                                                            </div>
                                                            <div
                                                                onClick={() => setPreviewVaultDoc(doc)}
                                                                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-80 bg-gray-100 text-gray-500"
                                                            >
                                                                <FileTextIcon className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setPreviewVaultDoc(doc)}>
                                                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-green-800' : 'text-gray-700'} hover:underline`}>{doc.title}</h4>
                                                            </div>
                                                            <span className="text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest bg-gray-100 text-gray-400">Arquivo</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
                                                <button onClick={() => setIsVaultModalOpen(false)} className="px-6 py-3 bg-bitrix-nav text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg">
                                                    Usar neste chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {isTaskModalOpen && (
                                    <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 w-[320px] md:w-[400px] z-50 animate-msg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-black uppercase tracking-tight text-bitrix-nav">Nova Pauta</h3>
                                            <button onClick={() => setIsTaskModalOpen(false)} className="text-gray-400 hover:text-red-500"><XIcon className="w-4 h-4" /></button>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Nome da Tarefa</label>
                                                <input
                                                    autoFocus
                                                    value={taskForm.title}
                                                    onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-bitrix-nav"
                                                    placeholder="Ex: Revisar contrato..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Responsável</label>
                                                <select
                                                    value={taskForm.assignee}
                                                    onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-bitrix-nav"
                                                >
                                                    {assigneeOptions.map((name) => (
                                                        <option key={name} value={name}>{name}</option>
                                                    ))}
                                                    {dynamicAgents
                                                        .filter((agent) => !assigneeOptions.includes(agent.name))
                                                        .map((agent) => <option key={agent.id} value={agent.name}>{agent.name}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Data</label>
                                                <input
                                                    type="date"
                                                    value={taskForm.date}
                                                    onChange={e => setTaskForm({ ...taskForm, date: e.target.value })}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-bitrix-nav"
                                                />
                                            </div>
                                            <button
                                                onClick={handleSaveTaskFromModal}
                                                className="w-full py-3 bg-bitrix-nav text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all mt-2"
                                            >
                                                Criar Tarefa
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div
                                    ref={messagesScrollRef}
                                    onScroll={handleMessagesScroll}
                                    className="flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8 xl:px-16 custom-scrollbar"
                                >
                                    <div className="mx-auto w-full max-w-[860px]">
                                        <div className="mb-7 rounded-[1.8rem] border border-white/70 bg-white/52 px-5 py-4 shadow-[0_18px_52px_rgba(15,23,42,0.05)] backdrop-blur-xl md:px-7 md:py-5">
                                            <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.32em] text-slate-400">
                                                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                                Ambiente SagB
                                            </div>
                                            <p className="max-w-xl text-[12px] font-semibold leading-6 text-slate-500 md:text-[13px]">
                                                Conversa centralizada para leitura confortável, com laterais tratadas como moldura institucional sutil e foco total na operação.
                                            </p>
                                        </div>
                                        
                                        {hasMoreMessages && olderMessages.length === 0 && (
                                            <div className="flex justify-center my-4">
                                                <button
                                                    onClick={loadOlderMessages}
                                                    disabled={isLoadingMore}
                                                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-bitrix-nav hover:text-bitrix-nav hover:shadow-md transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    {isLoadingMore ? (
                                                        <>
                                                            <div className="w-3 h-3 border-2 border-gray-300 border-t-bitrix-nav rounded-full animate-spin"></div>
                                                            Carregando...
                                                        </>
                                                    ) : (
                                                        'Carregar mensagens anteriores'
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {olderMessages.length > 0 && (
                                            <div className="mb-6">
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Mensagens Anteriores</span>
                                                    <div className="h-px flex-1 bg-gray-200"></div>
                                                </div>
                                                {olderMessages.map(msg => (
                                                    <ChatMessage
                                                        key={msg.id}
                                                        message={msg}
                                                        directors={directorsList}
                                                        agentContext={selectedAgent ? { name: selectedAgent.name, avatarUrl: selectedAgent.avatarUrl } : undefined}
                                                        onEdit={handleUpdateAndRegenerate}
                                                        userProfile={CURRENT_USER}
                                                    />
                                                ))}
                                                {hasMoreMessages && (
                                                    <div className="flex justify-center mt-6">
                                                        <button
                                                            onClick={loadOlderMessages}
                                                            disabled={isLoadingMore}
                                                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-bitrix-nav hover:text-bitrix-nav hover:shadow-md transition-all shadow-sm flex items-center gap-2"
                                                        >
                                                            {isLoadingMore ? (
                                                                <>
                                                                    <div className="w-3 h-3 border-2 border-gray-300 border-t-bitrix-nav rounded-full animate-spin"></div>
                                                                    Carregando...
                                                                </>
                                                            ) : (
                                                                'Carregar mais mensagens anteriores'
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {activeMessages.map(msg => (
                                            <ChatMessage
                                                key={msg.id}
                                                message={msg}
                                                directors={directorsList}
                                                agentContext={selectedAgent ? { name: selectedAgent.name, avatarUrl: selectedAgent.avatarUrl } : undefined}
                                                onEdit={handleUpdateAndRegenerate}
                                                userProfile={CURRENT_USER}
                                            />
                                        ))}

                                        {titleOptions && (
                                            <div className="mt-7 flex flex-col items-center gap-4 border-t border-dashed border-gray-200 pt-6 pb-6 animate-msg">
                                                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-gray-400">Qual destas opções define melhor esta pauta?</p>
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {titleOptions.map((title, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => handleApplyTitle(title)}
                                                            className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-bitrix-nav hover:text-bitrix-nav hover:shadow-md transition-all shadow-sm"
                                                        >
                                                            {title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {isSuggestionPanelVisible && (
                                            <div className="mt-5 flex flex-col items-center gap-4 pt-4 pb-6 animate-msg">
                                                <p className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-green-600">Sugestões acionadas manualmente</p>
                                                {taskSuggestions && taskSuggestions.length > 0 ? (
                                                    <div className="flex flex-wrap justify-center gap-3">
                                                        {taskSuggestions.map((title, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => handleSuggestionClick(title)}
                                                                className="px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-green-500 hover:text-green-600 hover:shadow-md transition-all shadow-sm flex items-center gap-2"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                {title}
                                                            </button>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-5 py-4 text-center text-[11px] font-bold text-gray-400">
                                                        Nenhuma sugestão disponível para este trecho da conversa.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div ref={chatEndRef} />
                                </div>

                                <div className="relative z-10 border-t border-white/70 bg-white/74 backdrop-blur-xl shadow-[0_-12px_28px_rgba(15,23,42,0.04)]">
                                    <div className="mx-auto w-full max-w-[860px] p-3 md:p-4 lg:p-5">
                                    {selectedVaultDocuments.length > 0 && (
                                        <div className="w-full mb-3 flex items-start animate-msg gap-2 flex-wrap">
                                            {selectedVaultDocuments.map((doc) => (
                                                <div key={doc.id} className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-2 rounded-xl shadow-sm">
                                                    <button type="button" onClick={() => setPreviewVaultDoc(doc)} className="text-left text-[10px] font-black uppercase tracking-wider hover:underline">
                                                        {doc.title}
                                                    </button>
                                                    <button type="button" onClick={() => toggleVaultDocument(doc.id)} className="text-blue-400 hover:text-red-500">
                                                        <XIcon className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {selectedVaultSummary && (
                                        <div className="w-full mb-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3">
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Resumo dos arquivos usados neste chat</span>
                                                <button type="button" onClick={() => setIsVaultModalOpen(true)} className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700">
                                                    editar arquivos
                                                </button>
                                            </div>
                                            <pre className="whitespace-pre-wrap text-[11px] leading-5 text-blue-900 font-semibold">{selectedVaultSummary}</pre>
                                        </div>
                                    )}

                                    {attachments.length > 0 && (
                                        <div className="w-full mb-3 flex items-start animate-msg gap-2 flex-wrap">
                                            {attachments.map((file, idx) => (
                                                <ChatAttachmentCard
                                                    key={file.localId || `${file.name || 'file'}-${idx}`}
                                                    attachment={file}
                                                    onRemove={() => handleRemoveAttachment(file.localId)}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    <div
                                        className={`relative w-full flex items-end gap-2 rounded-[1.4rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.95)_100%)] p-2.5 transition-all duration-300 md:gap-3 md:rounded-[1.75rem] md:p-2.5 ${isDragging ? 'shadow-xl ring-2 ring-emerald-100' : ''}`}
                                        style={{ boxShadow: isDragging ? 'none' : '0 18px 45px -18px rgba(15, 23, 42, 0.24), 0 10px 24px -18px rgba(15, 23, 42, 0.16)' }}
                                        onDragOver={handleDragOver}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {isDragging && (
                                            <div className="absolute inset-0 bg-white/95 rounded-[2rem] flex flex-col items-center justify-center z-50 animate-msg backdrop-blur-sm pointer-events-none">
                                                <CloudUploadIcon className="w-8 h-8 text-emerald-600 mb-2" />
                                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Solte o arquivo aqui</p>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => chatAttachmentRef.current?.click()}
                                            className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-300 transition-all hover:text-gray-500"
                                                title="Anexar arquivos (imagem, texto, áudio, PDF)"
                                        >
                                            <PaperclipIcon className="w-5 h-5" />
                                        </button>

                                        <textarea
                                            ref={textareaRef}
                                            value={input}
                                            onChange={e => {
                                                setInput(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            onPaste={handlePaste}
                                            rows={1}
                                            placeholder={isLoading ? "Gerando resposta..." : isTranscribing ? "Transcrevendo áudio..." : "Pode digitar aqui..."}
                                            className="max-h-[140px] flex-1 resize-none overflow-y-auto bg-transparent px-2 py-2.5 text-[13px] font-medium text-gray-700 outline-none placeholder:text-gray-300 disabled:opacity-50 md:px-3 md:text-[14px]"
                                            disabled={isLoading || isTranscribing}
                                        />

                                        <div className="flex flex-col items-center shrink-0">
                                            <button
                                                type="button"
                                                onClick={handleToggleRecording}
                                                disabled={isLoading || isTranscribing}
                                                className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${isRecording
                                                    ? 'text-red-600 bg-red-50 ring-4 ring-red-100 animate-pulse scale-110'
                                                    : 'text-gray-300 hover:text-gray-500'
                                                    } disabled:opacity-30`}
                                                title={isRecording ? "Parar Gravação" : "Gravar Áudio"}
                                            >
                                                {isRecording ? <StopCircleIcon className="w-6 h-6" /> : <MicIcon className="w-5 h-5" />}
                                            </button>
                                            {isRecording && (
                                                <span className="text-[7px] font-black text-red-500 uppercase tracking-widest mt-0.5 animate-pulse">Gravando...</span>
                                            )}
                                        </div>

                                        {isLoading ? (
                                            <div className="mb-1 flex h-9 w-9 items-center justify-center">
                                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleSendMessage}
                                                className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center text-emerald-600 transition-all hover:scale-110 hover:text-emerald-700 disabled:scale-100 disabled:opacity-50"
                                                disabled={(!input.trim() && attachments.filter((item) => item.uploadStatus === 'success').length === 0) || isTranscribing}
                                            >
                                                <SendIcon className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemicVision;
