
import React, { useEffect, useState } from 'react';
import { Agent } from '../types';
import { AlertTriangleIcon, BotIcon, ChevronRightIcon, SearchIcon, XIcon } from '../components/ui/Icon';
import { Avatar } from '../components/ui/Avatar';
import { getDbProvider, resolveWorkspaceId } from '../services/ncDb';
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

    let db: ReturnType<typeof getDbProvider>;
    try {
      db = getDbProvider();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      ncLog.error('conversations.db.provider.missing', { error: msg });
      setError('Provedor de banco de dados não inicializado. Entre em contato com o suporte.');
      setLoading(false);
      return;
    }

    let cancelled = false;
    let unsubRef: (() => void) | null = null;

    db.subscribeToSessions(
      scopedWorkspaceId,
      (docs) => {
        if (cancelled) return;
        const next: Record<string, SessionRowData> = {};
        docs.forEach((row) => {
          const data = row.data();
          next[String((data as any).id || row.id)] = data as SessionRowData;
        });
        ncLog.debug('conversations.snapshot.received', {
          workspaceId: scopedWorkspaceId,
          total: docs.length,
          elapsedMs: Date.now() - startedAt
        });
        setSessionsById(next);
        setLoading(false);
      },
      (err) => {
        if (cancelled) return;
        ncLog.error('conversations.snapshot.failed', {
          workspaceId: scopedWorkspaceId,
          error: err instanceof Error ? err.message : String(err)
        });
        setError('Não foi possível carregar as conversas.');
        setSessionsById({});
        setLoading(false);
      }
    ).then(unsub => {
      if (cancelled) {
        unsub();
        return;
      }
      unsubRef = unsub;
    });

    return () => {
      cancelled = true;
      if (unsubRef) unsubRef();
    };
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
                    <span className="text-[11px] font-bold text-bitrix-nav dark:text-sagb-text">{sessions.length} conversas ativas</span>
                    <span className="text-[10px] text-gray-400 dark:text-sagb-muted">{agents.length} agentes disponíveis</span>
                </div>

                <button
                  onClick={() => setIsDocsModalOpen(!isDocsModalOpen)}
                  className="px-4 py-2 bg-bitrix-nav dark:bg-gray-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-bitrix-nav-hover dark:hover:bg-gray-600 transition-all shadow-sm"
                >
                  Documentação
                </button>
            </div>
        </header>

        {/* SEARCH BAR */}
        <div className="px-6 py-4 md:px-10">
            <div className="flex items-center bg-white dark:bg-sagb-bg-2 border border-gray-200 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm focus-within:border-bitrix-nav/30 dark:focus-within:border-white/20 focus-within:shadow-md transition-all">
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por agente ou conversa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-3 flex-1 bg-transparent text-sm text-bitrix-nav dark:text-sagb-text placeholder-gray-400 dark:placeholder-gray-500 outline-none font-medium"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                    <XIcon className="w-4 h-4" />
                  </button>
                )}
            </div>
        </div>

        {/* CONVERSATIONS LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-10 pb-6 space-y-2">
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
                </div>
            ) : (
                filteredSessions.map(session => (
                    <div
                      key={session.sessionId}
                      onClick={() => {
                        const agent = agents.find(a => a.id === session.agentId);
                        if (agent && onOpenSession) onOpenSession(agent, session.sessionId);
                      }}
                      className="group flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-sagb-bg-2 border border-gray-100 dark:border-white/5 hover:border-bitrix-nav/20 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all cursor-pointer"
                    >
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <Avatar name={session.agentName} url={session.agentAvatar} className="w-12 h-12 rounded-xl" />
                            <div className={`absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-[#111827]`}></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-black text-sm text-bitrix-nav dark:text-sagb-text truncate">{session.agentName}</h3>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">{formatTime(session.lastMessageAt)}</span>
                            </div>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">{session.agentRole}</p>
                            <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1 truncate">{session.preview}</p>
                            {session.title && session.title !== 'Conversa sem título' && (
                                <p className="text-[10px] font-bold text-bitrix-nav/60 dark:text-gray-500 mt-0.5 truncate">{session.title}</p>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-sagb-bg flex items-center justify-center text-gray-300 dark:text-gray-600 group-hover:bg-bitrix-nav dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-gray-900 transition-all shrink-0">
                            <ChevronRightIcon className="w-4 h-4" />
                        </div>
                    </div>
                ))
            )}
        </div>

        {/* DOCS MODAL */}
        {isDocsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white dark:bg-sagb-panel w-full max-w-5xl h-[600px] shadow-2xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col">
              <header className="px-8 py-5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-sagb-bg-2 shrink-0">
                <h2 className="text-lg font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-tight">Documentação do Módulo</h2>
                <button
                  onClick={() => setIsDocsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white dark:bg-sagb-bg-2 border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <XIcon className="w-4 h-4 text-gray-500" />
                </button>
              </header>
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-6 text-[12px] text-gray-600 dark:text-gray-300">
                {/* Product Info */}
                <section>
                  <h3 className="text-sm font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-wider mb-3">📋 Informações do Produto</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome</span>
                      <p className="text-sm font-bold text-bitrix-nav dark:text-sagb-text mt-1">{moduleDoc.nome}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Versão</span>
                      <p className="text-sm font-bold text-bitrix-nav dark:text-sagb-text mt-1">{moduleDoc.versao}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4 col-span-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição</span>
                      <p className="text-sm font-bold text-bitrix-nav dark:text-sagb-text mt-1">{moduleDoc.descricao}</p>
                    </div>
                    {moduleDoc.objetivosProduto && moduleDoc.objetivosProduto.length > 0 && (
                      <div className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4 col-span-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Objetivos de Produto</span>
                        <ul className="mt-2 space-y-1">
                          {moduleDoc.objetivosProduto.map((obj, i) => (
                            <li key={i} className="text-sm font-bold text-bitrix-nav dark:text-sagb-text flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-bitrix-nav dark:bg-white shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>

                {/* Tabelas */}
                <section>
                  <h3 className="text-sm font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-wider mb-3">🗄️ Tabelas no Supabase</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleDoc.tabelasSupabase.map((t, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4">
                        <code className="text-[11px] font-bold text-bitrix-nav dark:text-sagb-text bg-white dark:bg-sagb-bg px-2 py-1 rounded-lg">{t.nome}</code>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2">{t.descricao}</p>
                        {t.campos && t.campos.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {t.campos.map((campo, j) => (
                              <span key={j} className="text-[9px] font-bold text-gray-400 bg-white dark:bg-sagb-bg px-1.5 py-0.5 rounded-md">{campo}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Integrações */}
                <section>
                  <h3 className="text-sm font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-wider mb-3">🔗 Integrações</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moduleDoc.integracoes.map((int, i) => (
                      <div key={i} className="bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{int.tipo}</span>
                        <p className="text-[12px] text-gray-600 dark:text-gray-300 mt-1">{int.descricao}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pendências */}
                <section>
                  <h3 className="text-sm font-black text-bitrix-nav dark:text-sagb-text uppercase tracking-wider mb-3">📌 Pendências Principais</h3>
                  <div className="space-y-3">
                    {moduleDoc.pendenciasPrincipais.map((pend, i) => (
                      <div key={i} className="flex gap-3 items-start bg-gray-50 dark:bg-sagb-bg-2 rounded-2xl p-4">
                        <AlertTriangleIcon className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed text-orange-800 dark:text-orange-200">{pend}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <p className="text-[10px] text-gray-400 text-center pt-4 border-t border-gray-100 dark:border-white/5">
                  Gerado automaticamente por module-doc.ts
                </p>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ConversationsView;
