
import React, { useEffect, useState } from 'react';
import { Agent } from '../../../../types';
import { AlertTriangleIcon, BotIcon, ChevronRightIcon, SearchIcon, XIcon } from '../../../../components/Icon';
import { Avatar } from '../../../../components/Avatar';
import { db, collection, query, where, orderBy, onSnapshot } from '../../../../services/supabase';
import { resolveWorkspaceId } from '../../../../utils/supabaseChat';
import { moduleDoc } from '../module-doc';
import { ncLog } from '../utils/observability';

interface ConversationsViewProps {
  agents?: Agent[];
  onOpenChat?: (agent: Agent) => void;
  onOpenSession?: (agent: Agent, sessionId: string) => void;
  activeWorkspaceId?: string | null;
}

interface ChatSessionSummary {
    sessionId: string;
    agentId: string;
    agentName: string;
    agentRole: string;
    agentAvatar?: string;
    lastMessageAt: number;
    title: string;
    preview: string;
}

interface SessionRowData {
  id?: string;
  agentId?: string;
  lastMessageAt?: Date | string | number;
  updatedAt?: Date | string | number;
  createdAt?: Date | string | number;
  title?: string;
  payload?: {
    latestMessageText?: string;
  };
}

const ConversationsView: React.FC<ConversationsViewProps> = ({ agents = [], onOpenChat, onOpenSession, activeWorkspaceId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionsById, setSessionsById] = useState<Record<string, SessionRowData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const scopedWorkspaceId = resolveWorkspaceId(activeWorkspaceId);
    const startedAt = Date.now();
    const sessionsQuery = query(
      collection(db, 'chat_sessions'),
      where('workspaceId', '==', scopedWorkspaceId),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      sessionsQuery,
      (snapshot) => {
        const next: Record<string, SessionRowData> = {};
        snapshot.docs.forEach((row: { id: string; data: () => SessionRowData }) => {
          const data = row.data();
          next[String(data.id || row.id)] = data;
        });
        ncLog.debug('conversations.snapshot.received', {
          workspaceId: scopedWorkspaceId,
          total: snapshot.docs.length,
          elapsedMs: Date.now() - startedAt
        });
        setSessionsById(next);
        setLoading(false);
      },
      (err) => {
        ncLog.error('conversations.snapshot.failed', {
          workspaceId: scopedWorkspaceId,
          error: err instanceof Error ? err.message : String(err)
        });
        setError('Não foi possível carregar as conversas.');
        setSessionsById({});
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [activeWorkspaceId]);

  useEffect(() => {
    const allSessions: ChatSessionSummary[] = Object.entries(sessionsById)
      .map(([sessionId, sessionData]) => {
        const agentId = String(sessionData.agentId || '');
        const agent = agents.find((a) => a.id === agentId);
        if (!agent) return null;

        const lastMessageAt = sessionData.lastMessageAt instanceof Date
          ? sessionData.lastMessageAt.getTime()
          : new Date(sessionData.lastMessageAt || sessionData.updatedAt || sessionData.createdAt || Date.now()).getTime();

        return {
          sessionId,
          agentId: agent.id,
          agentName: agent.name,
          agentRole: agent.officialRole,
          agentAvatar: agent.avatarUrl,
          lastMessageAt,
          title: String(sessionData.title || 'Conversa sem título'),
          preview: (() => {
            const raw = String(sessionData.payload?.latestMessageText || '').trim();
            if (!raw) return 'Nova conversa iniciada...';
            return raw.length > 60 ? `${raw.slice(0, 60)}...` : raw;
          })()
        } as ChatSessionSummary;
      })
      .filter((session): session is ChatSessionSummary => Boolean(session));

    allSessions.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    setSessions(allSessions);
  }, [agents, sessionsById]);

  const filteredSessions = sessions.filter(s => 
      s.agentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      const now = new Date();
      const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      
      if (isToday) {
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else {
          return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
      }
  };

  return (
    <div className="flex-1 h-full bg-sagb-bg-1 dark:bg-sagb-bg flex flex-col font-sans transition-colors duration-300 overflow-hidden">
        {/* HEADER */}
        <header className="h-24 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 dark:border-white/5 bg-white dark:bg-sagb-panel shrink-0 transition-colors duration-300">
            <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-tighter">Central de Mensagens</h1>
                <p className="text-[10px] font-bold text-gray-400 dark:text-sagb-muted uppercase tracking-[0.3em] mt-1">Histórico de Comunicação</p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end mr-4">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-bold">Responsável</span>
                    <span className="text-xs font-black text-bitrix-nav dark:text-indigo-400">Poazi Bellini</span>
                </div>
                <button 
                    onClick={() => setIsDocsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-sagb-bg-2 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg transition-colors text-xs font-bold"
                >
                    <div className="w-4 h-4 bg-gray-400 mask-icon" />
                    Docs
                </button>
            </div>
        </header>

        {/* SEARCH BAR */}
        <div className="px-8 md:px-12 py-6 shrink-0">
            <div className="flex items-center bg-white dark:bg-sagb-bg-2 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm focus-within:border-bitrix-nav/30 dark:focus-within:border-white/20 focus-within:shadow-md transition-all">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input 
                    type="text" 
                    placeholder="Pesquisar por nome ou assunto..." 
                    className="bg-transparent text-sm font-medium text-gray-700 dark:text-white outline-none w-full ml-3 placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* LISTA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-8 pb-10">
            <div className="max-w-5xl mx-auto space-y-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <BotIcon className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
                        <p className="text-sm font-bold text-gray-400">Carregando conversas...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50 text-red-500">
                        <AlertTriangleIcon className="w-16 h-16 text-red-400 mb-4" />
                        <p className="text-sm font-bold">{error}</p>
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <BotIcon className="w-16 h-16 text-gray-300 mb-4" />
                        <p className="text-sm font-bold text-gray-400">Nenhuma conversa encontrada.</p>
                        <p className="text-xs text-gray-300 mt-1">Inicie um chat através do Ecossistema.</p>
                    </div>
                ) : (
                    filteredSessions.map(session => (
                        <div 
                            key={`${session.agentId}-${session.sessionId}`}
                            onClick={() => {
                                const agent = agents.find(a => a.id === session.agentId);
                                if (!agent) return;
                                if (onOpenSession) {
                                  onOpenSession(agent, session.sessionId);
                                  return;
                                }
                                onOpenChat?.(agent);
                            }}
                            className="bg-white dark:bg-sagb-panel p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md dark:hover:bg-sagb-bg-2 hover:border-gray-200 transition-all cursor-pointer group flex items-center gap-4 animate-msg"
                        >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <Avatar name={session.agentName} url={session.agentAvatar} className="w-12 h-12 rounded-xl" />
                                <div className={`absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-[#111827]`}></div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-[13px] font-black text-gray-800 dark:text-white truncate group-hover:text-bitrix-nav dark:group-hover:text-indigo-400 transition-colors">{session.agentName}</h3>
                                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">{formatTime(session.lastMessageAt)}</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1 truncate">{session.title}</p>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate leading-relaxed">{session.preview}</p>
                            </div>

                            {/* Arrow */}
                            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-sagb-bg flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:bg-bitrix-nav dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all shrink-0">
                                <ChevronRightIcon className="w-4 h-4" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* MODAL DE DOCS */}
        {isDocsModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-sagb-panel w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[80vh] overflow-hidden border border-gray-100 dark:border-white/10">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-sagb-bg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <div className="w-5 h-5 bg-indigo-600 mask-icon" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-800 dark:text-white leading-tight">{moduleDoc.nomeOficial}</h2>
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{moduleDoc.tipo} • Status: {moduleDoc.status}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsDocsModalOpen(false)}
                            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-[12px] text-gray-600 dark:text-gray-300">
                        <section>
                            <h3 className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-wider mb-3">Objetivo</h3>
                            <p className="bg-gray-50 dark:bg-sagb-bg p-4 rounded-xl border border-gray-100 dark:border-white/5 leading-relaxed">
                                {moduleDoc.objetivo}
                            </p>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <section>
                                <h3 className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-wider mb-3">Fontes de Dados (Tabelas)</h3>
                                <ul className="space-y-2">
                                    {moduleDoc.tabelasSupabase.map((t, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            <span className="font-mono text-[11px]">{t}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-wider mb-3">Integrações Externas</h3>
                                <ul className="space-y-2">
                                    {moduleDoc.integracoes.map((int, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                            <span>{int}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>

                        <section>
                            <h3 className="text-[10px] uppercase font-black text-gray-400 dark:text-gray-500 tracking-wider mb-3">Pendências / Riscos Atuais</h3>
                            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-500/20 rounded-xl p-4 space-y-3">
                                {moduleDoc.pendenciasPrincipais.map((pend, i) => (
                                    <div key={i} className="flex gap-3 items-start">
                                        <AlertTriangleIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed text-orange-800 dark:text-orange-200">{pend}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ConversationsView;
