import React, { useState } from 'react';
import { BackIcon, CheckIcon, FileTextIcon, SearchIcon, FilterIcon, ClockIcon, SaveIcon } from '../../../../components/Icon';
import {
  nicMetrics,
  nicLenses,
  nicMotorComponents,
  nicStrategicOutputs,
  nicHistoryExamples
} from '../data/nicBlueprint';

interface NICPageProps {
  onBack?: () => void;
}

const NICPage: React.FC<NICPageProps> = ({ onBack }) => {
  const [selectedLens, setSelectedLens] = useState<string | null>(null);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'motor' | 'history'>('motor');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const toggleDoc = (id: string) => {
    setSelectedDocs(prev => 
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleStartAnalysis = () => {
    if (selectedDocs.length < 2) {
      alert('Selecione ao menos 2 documentos para cruzamento.');
      return;
    }
    if (!selectedLens) {
      alert('Escolha uma lente de análise.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const mockDocs = [
    { id: 'doc1', title: 'Estratégia 3forB 2026', type: 'PDF', date: '2026-02-10' },
    { id: 'doc2', title: 'Roadmap de Tecnologia StartyB', type: 'DOCX', date: '2026-03-01' },
    { id: 'doc3', title: 'Transcrição Reunião Nuexus', type: 'Audio', date: '2026-03-15' },
    { id: 'doc4', title: 'Metodologia GERAC V2', type: 'PDF', date: '2025-11-20' },
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 space-y-8">
        
        {/* HEADER: POSICIONAMENTO */}
        <header className="rounded-[32px] border border-white/80 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_40%)]" />
          <div className="relative px-8 md:px-10 py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                {onBack && (
                  <button onClick={onBack} className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <BackIcon className="w-5 h-5 text-cyan-400" />
                  </button>
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">Módulo Interpretativo</span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">NIC</h1>
                </div>
              </div>
              <p className="text-lg text-slate-300 font-medium">Núcleo de Inteligência Conectiva</p>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                O motor interpretativo do SagB. O NIC cruza documentos internos preparados pelo CID para encontrar conexões, padrões e oportunidades que sustentam a governança do NAGI.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  MOTOR OPERACIONAL ATIVO
                </div>
                <div className="text-xs text-slate-500 font-medium tracking-wide">FASE 1: APENAS MATERIAIS INTERNOS</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-[400px]">
              {nicMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.label}</span>
                  <div className="text-xl font-black text-cyan-100">{metric.value}</div>
                  <p className="text-[10px] leading-relaxed text-slate-400">{metric.note}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* NAVEGAÇÃO INTERNA */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-2xl w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('motor')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'motor' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Análise Ativa
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'history' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Histórico de Leituras
          </button>
        </div>

        {activeTab === 'motor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
            
            {/* COLUNA ESQUERDA: CONFIGURAÇÃO */}
            <aside className="space-y-6">
              
              {/* 2. FONTES DE ANÁLISE */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Fontes de Análise</h3>
                  <span className="bg-cyan-50 text-cyan-700 text-[10px] font-black px-2 py-1 rounded-md">
                    {selectedDocs.length} SELECIONADOS
                  </span>
                </div>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar no CID..." 
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {mockDocs.map(doc => (
                    <button 
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${selectedDocs.includes(doc.id) ? 'border-cyan-500 bg-cyan-50/50 ring-1 ring-cyan-500' : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'}`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg ${selectedDocs.includes(doc.id) ? 'bg-cyan-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                        <FileTextIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-xs font-bold truncate ${selectedDocs.includes(doc.id) ? 'text-cyan-900' : 'text-slate-700'}`}>{doc.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{doc.type} • {doc.date}</p>
                      </div>
                      {selectedDocs.includes(doc.id) && <CheckIcon className="w-4 h-4 text-cyan-600 ml-auto shrink-0" />}
                    </button>
                  ))}
                </div>
                <button className="w-full py-3 rounded-xl border border-dashed border-slate-300 text-slate-500 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
                  + Criar Conjunto de Análise
                </button>
              </section>

              {/* 3. OBJETIVO E LENTE */}
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Lente de Leitura</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nicLenses.map(lens => (
                    <button 
                      key={lens.id}
                      onClick={() => setSelectedLens(lens.id)}
                      className={`p-3 rounded-2xl border text-left transition-all space-y-2 ${selectedLens === lens.id ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:border-slate-200'}`}
                    >
                      <svg className={`w-5 h-5 ${selectedLens === lens.id ? 'text-cyan-400' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={lens.icon} />
                      </svg>
                      <div className="text-[11px] font-black uppercase tracking-wider leading-tight">{lens.name}</div>
                    </button>
                  ))}
                </div>
                <div className="pt-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Foco Específico (Opcional)</label>
                  <textarea 
                    placeholder="O que você quer descobrir neste cruzamento?"
                    className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs outline-none focus:ring-2 focus:ring-cyan-500/20 min-h-[100px] resize-none"
                  />
                </div>
                <button 
                  onClick={handleStartAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-black uppercase tracking-[0.15em] text-xs shadow-[0_12px_24px_rgba(6,182,212,0.25)] hover:bg-cyan-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      PROCESSANDO CONEXÕES...
                    </>
                  ) : (
                    <>
                      <SearchIcon className="w-4 h-4" />
                      EXECUTAR INTERPRETAÇÃO
                    </>
                  )}
                </button>
              </section>
            </aside>

            {/* COLUNA DIREITA: MOTOR E RESULTADOS */}
            <main className="space-y-6">
              {!showResults && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[40px] p-12 text-center space-y-4 bg-white/50">
                  <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                    <FilterIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-slate-900">Motor Interpretativo Aguardando</h4>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
                      Selecione documentos no painel lateral e escolha uma lente para iniciar a produção de inteligência conectiva.
                    </p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center border-2 border-slate-200 rounded-[40px] p-12 text-center space-y-8 bg-white shadow-inner">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-cyan-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-black text-cyan-600">NIC</div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-2xl font-black text-slate-900 animate-pulse">Cruzando Informações</h4>
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Atividade do Motor:</div>
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showResults && !isAnalyzing && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  
                  {/* 4. MOTOR DE ANÁLISE & 5. EVIDÊNCIAS */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Interpretação do Motor</h3>
                        <span className="bg-cyan-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">CONCLUÍDO</span>
                      </div>
                      <div className="space-y-6">
                        {nicMotorComponents.map(block => (
                          <div key={block.title} className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-cyan-600">{block.title}</h4>
                            <div className="grid gap-2">
                              {block.items.map(item => (
                                <div key={item} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed font-medium">
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-slate-900 p-8 shadow-xl text-white space-y-6">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h3 className="text-lg font-black tracking-tight">Evidências Encontradas</h3>
                        <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">RASTREABILIDADE</span>
                      </div>
                      <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                            <FileTextIcon className="w-3 h-3" /> ESTRATÉGIA 3FORB 2026
                          </div>
                          <p className="text-xs leading-relaxed text-slate-300 italic font-medium">
                            "...a prioridade absoluta no primeiro semestre é a consolidação da base de clientes High-End através de parcerias com escritórios de advocacia..."
                          </p>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                            <FileTextIcon className="w-3 h-3" /> ROADMAP AUDACUS
                          </div>
                          <p className="text-xs leading-relaxed text-slate-300 italic font-medium">
                            "...identificada demanda reprimida para assessoria preventiva em grupos que operam no regime de lucro real..."
                          </p>
                        </div>
                        <div className="p-4 bg-cyan-400/10 border border-cyan-400/20 rounded-2xl text-cyan-200 text-xs font-bold text-center">
                          CONEXÃO IDENTIFICADA: ALINHAMENTO COMERCIAL AUDACUS + 3FORB
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* 6. SAÍDAS ESTRATÉGICAS */}
                  <section className="rounded-[40px] border border-slate-200 bg-white p-10 shadow-2xl space-y-8">
                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Saídas Estratégicas</h3>
                      <p className="text-slate-500 font-medium">Direcionamentos gerados pelo NIC para ação imediata no NAGI</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {nicStrategicOutputs.map(block => (
                        <div key={block.title} className="space-y-4">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">{block.title}</h4>
                          <div className="space-y-3">
                            {block.items.map(item => (
                              <div key={item} className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                <p className="text-sm text-slate-700 font-bold leading-relaxed">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-4 pt-4">
                      <button className="px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                        <SaveIcon className="w-4 h-4" /> SALVAR ANÁLISE NA MEMÓRIA
                      </button>
                      <button className="px-8 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                        <BackIcon className="w-4 h-4 rotate-180" /> ENCAMINHAR PARA NAGI
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </main>
          </div>
        ) : (
          
          /* 7. MEMÓRIA DE ANÁLISE (HISTÓRICO) */
          <div className="grid grid-cols-1 gap-6 max-w-5xl">
            <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Histórico de Inteligência Conectiva</h3>
                <div className="flex items-center gap-2">
                  <FilterIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500 font-bold">FILTRAR POR DATA</span>
                </div>
              </div>
              <div className="space-y-4">
                {nicHistoryExamples.map(item => (
                  <div key={item.id} className="group p-6 rounded-[24px] border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-cyan-200 hover:bg-white transition-all hover:shadow-md">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-cyan-500 group-hover:border-cyan-100 transition-colors">
                        <ClockIcon className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-slate-400 font-black uppercase tracking-widest">{item.date}</div>
                        <h4 className="text-lg font-black text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium">Lente: <span className="text-cyan-600 font-bold">{item.lens}</span> • {item.documents} documentos cruzados</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-black hover:bg-slate-50 transition-colors">REABRIR</button>
                      <button className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors">COMPARAR</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default NICPage;
