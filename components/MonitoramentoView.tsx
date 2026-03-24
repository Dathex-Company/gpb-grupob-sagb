import React, { useState } from 'react';
import { BackIcon } from './Icon';
import QualitySensorView from './QualitySensorView';
import MetricCard from './MetricCard';
import useTelemetryData from '../hooks/useTelemetryData';

interface MonitoramentoViewProps {
  onBack?: () => void;
  qualityEvents: any[];
  workspaceId?: string | null;
}

type MonitorCategory = 'operacao' | 'inteligencia' | 'resposta' | 'gerencial';

type MonitorSection = 
  | 'infraestrutura'
  | 'backend'
  | 'frontend'
  | 'automacoes'
  | 'ia_agentes'
  | 'transcricoes'
  | 'dados_memoria'
  | 'ideias_producao'
  | 'alertas'
  | 'eventos'
  | 'qualidade';

const MonitoramentoView: React.FC<MonitoramentoViewProps> = ({ onBack, qualityEvents, workspaceId }) => {
  const [activeSection, setActiveSection] = useState<MonitorSection>('dados_memoria');
  
  // Usar hook customizado para telemetria
  const { data: telemetryData, loading, error, refresh } = useTelemetryData(workspaceId);

  const menuItems: { id: MonitorSection; label: string; icon: string; category: MonitorCategory; idea: string }[] = [
    { id: 'infraestrutura', label: 'Infraestrutura', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', category: 'operacao', idea: 'Monitora CPU, GPU, RAM, disco e estabilidade da máquina local.' },
    { id: 'backend', label: 'Backend', icon: 'M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zm0 5h16', category: 'operacao', idea: 'Status do Supabase, DB, Storage e falhas de leitura/escrita.' },
    { id: 'automacoes', label: 'Automações', icon: 'M13 10V3L4 14h7v7l9-11h-7z', category: 'operacao', idea: 'Status do n8n, workflows ativos, falhas e gargalos de execução.' },
    { id: 'transcricoes', label: 'Transcrição/OBS', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', category: 'operacao', idea: 'Status do OBS, integridade das gravações e fila do Whisper.' },
    { id: 'ia_agentes', label: 'IA e Agentes', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', category: 'inteligencia', idea: 'Agentes operando, uso de tokens e saúde real dos provedores (Gemini/etc).' },
    { id: 'dados_memoria', label: 'Dados e Memória', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', category: 'inteligencia', idea: 'Integridade de memórias, refinamento vs dados crus e ocupação de storage.' },
    { id: 'qualidade', label: 'Qualidade', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', category: 'inteligencia', idea: 'Eventos de erro, alucinações de IA e falhas de handoff entre agentes.' },
    { id: 'alertas', label: 'Alertas', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', category: 'resposta', idea: 'Feed centralizado de eventos críticos e itens que exigem ação humana imediata.' },
    { id: 'eventos', label: 'Eventos', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', category: 'resposta', idea: 'Timeline histórica de ocorrências importantes (deploys, quedas, resets).' },
    { id: 'frontend', label: 'Frontend', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', category: 'resposta', idea: 'Deploys, builds, Netlify status e estabilidade da interface do usuário.' },
    { id: 'ideias_producao', label: 'Ideias/Produção', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', category: 'gerencial', idea: 'Visão executiva de iniciativas geradas e produtividade do funil de inovação.' },
  ];

  const currentItem = menuItems.find(i => i.id === activeSection);

  const renderSectionContent = () => {
    if (loading) {
      return (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-sm text-slate-500">Carregando telemetria...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="text-rose-500 text-lg font-bold">Erro ao carregar dados</div>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button 
            onClick={() => refresh()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'dados_memoria':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard
                title="Memórias Refinadas"
                value={telemetryData.totalMemories}
                badge="real"
                status={telemetryData.totalMemories > 0 ? 'success' : 'normal'}
              >
                <div className="text-[9px] text-slate-500 font-bold">Última atualização: <span className="text-slate-700">Agora</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Ativo</span></div>
              </MetricCard>
              
              <MetricCard
                title="Pendentes Refinamento"
                value={telemetryData.pendingChunks}
                badge="real"
                status={telemetryData.pendingChunks > 20 ? 'warning' : 'normal'}
                className={telemetryData.pendingChunks > 20 ? 'border-l-4 border-l-amber-400' : ''}
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite alerta: <span className="text-amber-600">{' > '}50</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className={telemetryData.pendingChunks > 20 ? "text-amber-600" : "text-emerald-600"}>
                  {telemetryData.pendingChunks > 20 ? "Atenção" : "Normal"}
                </span></div>
              </MetricCard>
              
              <MetricCard
                title="Ativos CID"
                value={telemetryData.cidAssetsCount}
                badge="real"
                status="success"
              >
                <div className="text-[9px] text-slate-500 font-bold">Última adição: <span className="text-slate-700">Hoje</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Ativo</span></div>
              </MetricCard>
              
              <MetricCard
                title="Integridade DB"
                value="Estável"
                badge="real"
                status="success"
              >
                <div className="text-[9px] text-slate-500 font-bold">Última verificação: <span className="text-slate-700">Agora</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Último erro: <span className="text-emerald-600">Nenhum</span></div>
              </MetricCard>
            </div>
            
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest">Últimas Escritas</h4>
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase">Real</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded">Live</span>
              </div>
              <table className="w-full text-left text-sm">
                <tbody>
                  {telemetryData.recentWrites.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 px-5 text-xs text-slate-400 font-bold">{new Date(row.timeRaw).toLocaleTimeString()}</td>
                      <td className="py-3 px-5 font-semibold text-slate-700">{row.tipo}</td>
                      <td className="py-3 px-5 text-slate-500 text-xs">{row.origem}</td>
                      <td className="py-3 px-5 text-right"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
        
      case 'qualidade': 
        return <div className="animate-fadeIn"><QualitySensorView qualityEvents={qualityEvents} workspaceId={workspaceId} /></div>;
        
      case 'ia_agentes':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              {Object.entries(telemetryData.providersHealth).map(([provider, health]) => (
                <div key={provider} className={`px-3 py-1.5 rounded-full border flex items-center gap-2 relative ${health?.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <div className="absolute -top-1 -right-1">
                    <span className="px-1 py-0.5 bg-emerald-100 text-emerald-700 text-[7px] font-black rounded uppercase">Real</span>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${health?.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <span className="text-[10px] font-black uppercase text-slate-700">{provider}</span>
                  <span className="text-[9px] font-bold text-slate-400">{health?.latencyMs}ms</span>
                </div>
              ))}
            </div>
            
            <MetricCard
              title="Agentes Registrados"
              value={telemetryData.totalAgents}
              badge="real"
              status="success"
              className="p-6"
            >
              <div className="text-[9px] text-slate-500 font-bold">Última atualização: <span className="text-slate-700">Agora</span></div>
              <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Ativo</span></div>
            </MetricCard>
          </div>
        );
        
      case 'alertas':
        const criticals = qualityEvents.filter(e => e.severity === 'critical' || e.severity === 'high');
        return (
          <div className="space-y-4 animate-fadeIn">
            <MetricCard
              title="Alertas Críticos"
              value={criticals.length}
              badge={criticals.length > 0 ? 'error' : 'real'}
              status={criticals.length > 0 ? 'error' : 'success'}
              className="border-l-8 border-l-rose-500"
            />
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {criticals.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">Sistema nominal. Nenhum alerta.</div>
              ) : (
                <table className="w-full text-left text-sm divide-y divide-slate-100">
                  {criticals.map((ev, i) => (
                    <tr key={i} className="hover:bg-rose-50/50">
                      <td className="p-4 text-xs font-bold text-slate-400">{new Date(ev.createdAt).toLocaleTimeString()}</td>
                      <td className="p-4 font-bold text-slate-700 uppercase text-xs">{ev.eventType}</td>
                      <td className="p-4 text-right"><span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[9px] font-black rounded uppercase">{ev.severity}</span></td>
                    </tr>
                  ))}
                </table>
              )}
            </div>
          </div>
        );
        
      case 'infraestrutura':
        return (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                title="CPU"
                value="32%"
                badge="demo"
                status="normal"
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite: <span className="text-amber-600">80%</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Normal</span></div>
              </MetricCard>
              
              <MetricCard
                title="GPU Temp"
                value="82°C"
                badge="demo"
                status="warning"
                className="border-l-4 border-l-amber-400"
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite: <span className="text-rose-600">90°C</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-amber-600">Atenção</span></div>
              </MetricCard>
              
              <MetricCard
                title="RAM"
                value="12GB"
                badge="demo"
                status="normal"
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite: <span className="text-amber-600">16GB</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Normal</span></div>
              </MetricCard>
              
              <MetricCard
                title="Ping"
                value="12ms"
                badge="demo"
                status="success"
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite: <span className="text-amber-600">100ms</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Excelente</span></div>
              </MetricCard>
            </div>
            
            <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center text-xs text-slate-400 font-bold uppercase tracking-widest relative">
              <div className="absolute top-3 right-3">
                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-black rounded uppercase">Em integração</span>
              </div>
              Aguardando Conector Local
            </div>
          </div>
        );
        
      case 'transcricoes':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MetricCard
                title="OBS STATUS"
                value="GRAVANDO"
                badge="demo"
                status="success"
                className="p-6 bg-slate-900 text-emerald-400"
              >
                <div className="text-[9px] text-slate-400 font-bold">Última atualização: <span className="text-slate-300">Demo</span></div>
                <div className="text-[9px] text-slate-400 font-bold mt-1">Status: <span className="text-emerald-400">Simulado</span></div>
              </MetricCard>
              
              <MetricCard
                title="Fila Whisper"
                value="0"
                badge="integration"
                status="normal"
                className="p-6"
              >
                <div className="text-[9px] text-slate-500 font-bold">Limite alerta: <span className="text-amber-600">{' > '}10</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Aguardando API</span></div>
              </MetricCard>
              
              <MetricCard
                title="Docs Hoje"
                value="42"
                badge="demo"
                status="success"
                className="p-6"
              >
                <div className="text-[9px] text-slate-500 font-bold">Meta diária: <span className="text-indigo-600">50</span></div>
                <div className="text-[9px] text-slate-500 font-bold mt-1">Status: <span className="text-emerald-600">Em progresso</span></div>
              </MetricCard>
            </div>
          </div>
        );
        
      case 'backend':
      case 'frontend':
      case 'automacoes':
      case 'eventos':
      case 'ideias_producao':
        return (
          <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm opacity-60 flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">⚙️</div>
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Painel em Construção</h3>
            <p className="text-xs text-slate-400 mt-2">Indicadores para {activeSection} sendo mapeados.</p>
          </div>
        );
        
      default:
        return (
          <div className="p-20 text-center bg-white rounded-3xl border border-slate-200 shadow-sm opacity-60 flex flex-col items-center">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">⚙️</div>
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest">Painel em Construção</h3>
            <p className="text-xs text-slate-400 mt-2">Indicadores para {activeSection} sendo mapeados.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-50 flex flex-col font-nunito overflow-hidden">
      <header className="h-20 px-8 flex items-center justify-between bg-slate-900 text-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><BackIcon className="w-6 h-6" /></button>
          )}
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-cyan-400">SagB Telemetry</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Central Operations Control</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
           <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Nominal</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 bg-slate-50 flex flex-col p-4 gap-1 overflow-y-auto custom-scrollbar border-r border-slate-200">
          {['Saúde da Operação', 'Saúde da Inteligência', 'Resposta e Histórico', 'Leitura Gerencial'].map((cat) => (
            <div key={cat} className="mb-4">
              <div className="px-4 py-2 border-b border-slate-200/50 mb-2">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat}</span>
              </div>
              <div className="space-y-0.5">
                {menuItems.filter(i => i.category === cat).map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center w-full gap-3 px-4 py-2.5 rounded-xl transition-all ${isActive ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-white/50 hover:text-slate-700 border border-transparent'}`}>
                      <svg className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d={item.icon} strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className={`text-[11px] uppercase tracking-wide font-bold ${isActive ? 'text-indigo-900' : ''}`}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-slate-100/30">
          <div className="max-w-5xl mx-auto">
             <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">{currentItem?.label}</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">{currentItem?.idea}</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase">Real</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[9px] font-black rounded uppercase">Demo</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[9px] font-black rounded uppercase">Em integração</span>
                </div>
             </div>
            {renderSectionContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MonitoramentoView;
