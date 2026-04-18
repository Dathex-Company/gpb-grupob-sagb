import React, { useMemo, useState, useEffect } from 'react';
import { Agent, BusinessUnit, Task } from '../types';
import { db, collection, onSnapshot, orderBy, query, where } from '../services/supabase';
import { resolveWorkspaceId } from '../utils/supabaseChat';

interface DashboardHomeProps {
  agents: Agent[];
  tasks: Task[];
  businessUnits: BusinessUnit[];
  onNavigate: (tab: any) => void;
  activeWorkspaceId?: string | null;
  userDisplayName?: string;
}

type CommandFlow = {
  id: string;
  flowType: string;
  status: string;
  origin: string;
  participants: string[];
  finalAction: string;
  createdAt: Date;
};

const toDate = (value: any): Date => {
  if (value instanceof Date) return value;
  const parsed = new Date(value || Date.now());
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const normalizeParticipants = (value: any): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object') return String(item.name || item.label || item.id || '').trim();
      return '';
    })
    .filter(Boolean);
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ agents, tasks, businessUnits, onNavigate, activeWorkspaceId, userDisplayName }) => {
  const [activeTab, setActiveTab] = useState('pulso');
  const [dailyStats, setDailyStats] = useState({ conversations: 0, messages: 0 });
  const [intelligenceFlowRows, setIntelligenceFlowRows] = useState<CommandFlow[]>([]);

  // --- CÁLCULO DE VOLUMETRIA EM TEMPO REAL ---
  useEffect(() => {
    const scopedWorkspaceId = resolveWorkspaceId(activeWorkspaceId);
    let sessionsCache: any[] = [];
    let messagesCache: any[] = [];

    const recalculate = () => {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      const convCount = sessionsCache.filter((session: any) => {
        const createdAt = session.createdAt instanceof Date ? session.createdAt : new Date(session.createdAt || 0);
        return !Number.isNaN(createdAt.getTime()) && createdAt.getTime() >= startOfDay;
      }).length;

      const msgCount = messagesCache.filter((message: any) => {
        const createdAt = message.createdAt instanceof Date ? message.createdAt : new Date(message.createdAt || 0);
        return !Number.isNaN(createdAt.getTime()) && createdAt.getTime() >= startOfDay;
      }).length;

      setDailyStats({ conversations: convCount, messages: msgCount });
    };

    const sessionsQuery = query(collection(db, 'chat_sessions'), where('workspaceId', '==', scopedWorkspaceId));
    const messagesQuery = query(collection(db, 'chat_messages'), where('workspaceId', '==', scopedWorkspaceId));

    const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
      sessionsCache = snapshot.docs.map((row: any) => row.data());
      recalculate();
    });

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      messagesCache = snapshot.docs.map((row: any) => row.data());
      recalculate();
    });

    return () => {
      unsubscribeSessions();
      unsubscribeMessages();
    };
  }, [activeWorkspaceId]);

  useEffect(() => {
    const scopedWorkspaceId = resolveWorkspaceId(activeWorkspaceId);
    const intelligenceFlowQuery = query(
      collection(db, "intelligence_flows"),
      where("workspaceId", "==", scopedWorkspaceId),
      orderBy("createdAt", "desc")
    );

    const unsubscribeFlows = onSnapshot(intelligenceFlowQuery, (snapshot) => {
      const rows = snapshot.docs.map((row: any) => {
        const raw = row.data() as any;
        return {
          id: String(raw.id || row.id),
          flowType: String(raw.flowType || 'conversation'),
          status: String(raw.status || 'pending'),
          origin: String(raw.origin || 'Fluxo de Inteligência'),
          participants: normalizeParticipants(raw.participants),
          finalAction: String(raw.finalAction || 'Sem ação final'),
          createdAt: toDate(raw.createdAt)
        } as CommandFlow;
      });
      setIntelligenceFlowRows(rows);
    });

    return () => unsubscribeFlows();
  }, [activeWorkspaceId]);

  const latestFlows = useMemo(() => intelligenceFlowRows.slice(0, 3), [intelligenceFlowRows]);

  const alerts = [
    { id: 1, title: "1 approval bloqueado", subtitle: "Deploy Dathex aguarda validação humana.", status: "crítico", color: "bg-red-500" },
    { id: 2, title: "Qwen instável", subtitle: "latência acima do desejado nas últimas verificações.", status: "alerta", color: "bg-orange-500" },
    { id: 3, title: "OpenAI estável", subtitle: "respostas dentro da faixa operacional saudável.", status: "ok", color: "bg-green-500" }
  ];

  return (
    <div className="flex-1 h-full bg-gray-50 dark:bg-sagb-bg overflow-y-auto custom-scrollbar p-8 md:p-12 font-sans text-gray-900 dark:text-sagb-text transition-colors duration-300 animate-msg">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Centro de Comando</h1>
          <p className="text-[12px] text-gray-500 dark:text-sagb-muted">Comando executivo, leitura operacional e monitoramento vivo do ecossistema.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-sagb-panel px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-3 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-sagb-muted uppercase tracking-widest">Latência média</span>
            <span className="text-sm font-bold">1.2s</span>
          </div>
          <div className="bg-white dark:bg-sagb-panel px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 flex items-center gap-3 shadow-sm">
            <span className="text-[10px] font-bold text-gray-400 dark:text-sagb-muted uppercase tracking-widest">{agents.filter(a => a.status === 'ACTIVE').length} agentes ativos</span>
          </div>
          <button 
            onClick={() => onNavigate('intelligence-flow')}
            className="bg-sagb-blue dark:bg-gradient-to-br dark:from-[#0a84ff] dark:to-[#005fcc] hover:opacity-90 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(10,132,255,0.3)] active:scale-95 text-white"
          >
            Abrir Fluxo Vivo
          </button>
        </div>
      </header>

      {/* TABS (ON/OFF STYLE) */}
      <nav className="flex gap-2 mb-10 shrink-0">
        {['Pulso do dia', 'Inteligência acumulada', 'Saúde do sistema', 'Operação agora'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 border ${
              activeTab === tab.toLowerCase() 
              ? 'bg-[#1F2937] dark:bg-gradient-to-b dark:from-[#22374f] dark:to-[#1d3045] text-white border-gray-300 dark:border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_0_15px_rgba(10,132,255,0.15)]' 
              : 'bg-transparent text-gray-500 border-transparent hover:text-gray-800 dark:hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PULSO DO DIA (REAL DATA) */}
          <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl">
            <h3 className="text-xs font-black text-gray-400 dark:text-sagb-muted uppercase tracking-widest mb-8">Pulso do dia</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest block mb-2">Conversas</span>
                <span className="text-4xl font-black block mb-1 text-gray-900 dark:text-sagb-text">{dailyStats.conversations}</span>
                <p className="text-[10px] text-gray-500 leading-tight">conversas estratégicas abertas hoje</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest block mb-2">Interações</span>
                <span className="text-4xl font-black block mb-1 text-gray-900 dark:text-white">{dailyStats.messages}</span>
                <p className="text-[10px] text-gray-500 leading-tight">mensagens processadas no período</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest block mb-2">Tokens</span>
                <span className="text-4xl font-black block mb-1 text-gray-900 dark:text-white">{(dailyStats.messages * 0.4).toFixed(1)}K</span>
                <p className="text-[10px] text-gray-500 leading-tight">volume de raciocínio estimado</p>
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest block mb-2">Custo</span>
                <span className="text-4xl font-black block mb-1 text-gray-900 dark:text-white">R$ {(dailyStats.messages * 0.05).toFixed(2)}</span>
                <p className="text-[10px] text-gray-500 leading-tight">custo operacional estimado hoje</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FLUXO VIVO (REAL DATA) */}
            <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl">
              <h3 className="text-xs font-black text-gray-400 dark:text-sagb-muted uppercase tracking-widest mb-6">Fluxo Vivo</h3>
              <div className="space-y-4">
                {latestFlows.length === 0 && (
                    <p className="text-xs text-gray-400 italic">Nenhuma atividade recente no fluxo.</p>
                )}
                {latestFlows.map(item => (
                  <div key={item.id} className="bg-gray-50 dark:bg-[#1F2937]/30 border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-start gap-4 hover:bg-gray-100 dark:hover:bg-[#1F2937]/50 transition-colors group">
                    <div className={`w-2 h-2 rounded-full bg-sagb-blue mt-1.5 shrink-0 shadow-[0_0_10px_currentColor]`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <p className="text-xs font-bold truncate text-gray-900 dark:text-sagb-text">
                          {item.origin}
                        </p>
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 shrink-0">{item.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-relaxed italic truncate">
                        {item.participants.join(' → ')} • {item.finalAction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SAÚDE DO SISTEMA */}
            <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl flex flex-col items-center">
              <h3 className="text-xs font-black text-gray-400 dark:text-sagb-muted uppercase tracking-widest mb-8 self-start">Saúde do sistema</h3>
              <div className="flex flex-col gap-10 items-center justify-center flex-1">
                {/* STACK DONUT */}
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#E5E7EB" className="dark:stroke-[#1F2937]" strokeWidth="8" />
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="var(--sagb-blue)" strokeWidth="8" 
                      strokeDasharray={`${2 * Math.PI * 48}`} 
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - 0.78)}`} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">78%</span>
                    <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Stack principal</span>
                  </div>
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400 dark:text-gray-600 whitespace-nowrap uppercase tracking-tighter">saúde operacional do núcleo</p>
                </div>

                {/* QUALIDADE DONUT */}
                <div className="relative w-28 h-28">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#E5E7EB" className="dark:stroke-[#1F2937]" strokeWidth="8" />
                    <circle cx="56" cy="56" r="48" fill="transparent" stroke="#64748B" strokeWidth="8" 
                      strokeDasharray={`${2 * Math.PI * 48}`} 
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - 0.69)}`} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">69%</span>
                    <span className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Qualidade</span>
                  </div>
                  <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400 dark:text-gray-600 whitespace-nowrap uppercase tracking-tighter">eventos positivos x erros</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* INTELIGÊNCIA ACUMULADA */}
          <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl h-fit">
            <h3 className="text-xs font-black text-gray-400 dark:text-sagb-muted uppercase tracking-widest mb-8">Inteligência acumulada</h3>
            <div className="space-y-6">
              <div>
                <span className="text-5xl font-black block mb-4 text-gray-900 dark:text-sagb-text">{tasks.length + businessUnits.length * 10}</span>
                <p className="text-sm text-gray-600 dark:text-sagb-muted leading-relaxed font-medium">
                  decisões assistidas pelo sistema, com centenas de horas de conhecimento processadas e estruturas estratégicas geradas para as unidades do grupo.
                </p>
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-bold leading-relaxed uppercase tracking-tighter italic">
                  Leitura pensada para parecer um painel tátil premium: escuro, silencioso e com profundidade suave.
                </p>
              </div>
            </div>
          </section>

          {/* ALERTAS E MONITORAMENTO */}
          <section className="bg-white dark:bg-gradient-to-b dark:from-[#24272e] dark:to-[#292d35] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl">
            <h3 className="text-xs font-black text-gray-400 dark:text-sagb-muted uppercase tracking-widest mb-8">Alertas e monitoramento</h3>
            <div className="space-y-4">
              {alerts.map(alert => (
                <div key={alert.id} className="bg-gray-50 dark:bg-[#1F2937]/30 border border-gray-100 dark:border-white/5 p-5 rounded-2xl hover:bg-gray-100 dark:hover:bg-[#1F2937]/50 transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2.5 rounded-full ${alert.color} shadow-[0_0_10px_currentColor]`} style={{ color: alert.color.replace('bg-', '') }}></div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-sagb-text">{alert.title}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gray-200 dark:bg-black/40 text-[8px] font-black text-gray-500 dark:text-sagb-muted uppercase tracking-widest border border-gray-300 dark:border-white/5">{alert.status}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pl-5.5">{alert.subtitle}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PROJECT FOOTER (MOCK) */}
          <div className="px-4">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">NAGI em destaque</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
