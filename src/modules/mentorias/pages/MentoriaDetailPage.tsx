import React, { useState } from 'react';
import { useMentoriaDetail } from '../hooks/useMentoriaDetail';
import { BookIcon, ClockIcon, FileTextIcon, BackIcon, CheckIcon } from '../../../../components/Icon';

interface MentoriaDetailPageProps {
  id?: string;
  onBack: () => void;
}

type TabType = 'estrutura' | 'materiais' | 'sessoes' | 'agentes' | 'historico';

export const MentoriaDetailPage: React.FC<MentoriaDetailPageProps> = ({ id, onBack }) => {
  const { mentoria, loading } = useMentoriaDetail(id);
  const [activeTab, setActiveTab] = useState<TabType>('estrutura');

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-sagb-bg">
      <div className="w-8 h-8 border-4 border-sagb-blue border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!mentoria) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-sagb-bg">
      <p className="text-sagb-muted mb-4 text-[12px]">Mentoria não encontrada.</p>
      <button onClick={onBack} className="text-sagb-blue font-bold uppercase tracking-widest text-[10px]">Voltar</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-sagb-bg text-sagb-text font-inter min-h-full">
      <header className="p-8 border-b border-sagb-line bg-sagb-panel">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black text-sagb-muted uppercase tracking-widest hover:text-sagb-blue transition-colors mb-6"
        >
          <BackIcon className="w-4 h-4" />
          Voltar para a Biblioteca
        </button>

        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-sagb-blue/10 text-sagb-blue text-[8px] font-black rounded uppercase tracking-widest">
                {mentoria.type}
              </span>
              <span className="text-[10px] font-bold text-sagb-muted">v{mentoria.version}</span>
            </div>
            <h1 className="text-3xl font-black text-sagb-text">{mentoria.title}</h1>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2 bg-sagb-bg-2 border border-sagb-line rounded-full text-[10px] font-black uppercase tracking-widest text-sagb-muted hover:bg-sagb-panel transition-all">
                Exportar
             </button>
             <button className="px-6 py-2 bg-sagb-blue text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-sagb-blue-2 transition-all">
                Nova Versão
             </button>
          </div>
        </div>

        <nav className="flex gap-8 mt-10">
          {(['estrutura', 'materiais', 'sessoes', 'agentes', 'historico'] as TabType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                activeTab === tab 
                  ? 'border-sagb-blue text-sagb-blue' 
                  : 'border-transparent text-sagb-muted hover:text-sagb-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'estrutura' && (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-sagb-panel border border-sagb-line rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[12px] font-bold text-sagb-text flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-sagb-bg-2 border border-sagb-line flex items-center justify-center text-[10px]">{i}</span>
                      Módulo {i}: Introdução e Fundamentos
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Completo
                    </span>
                  </div>
                  <p className="text-[12px] text-sagb-muted mb-6 italic">Definição dos pilares essenciais e alinhamento de expectativas para o programa.</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-sagb-bg-2 border border-sagb-line rounded-xl text-[11px] text-sagb-muted hover:border-sagb-blue/30 transition-all cursor-pointer">
                       Aula 1.1: O Mindset do Mentor
                    </div>
                    <div className="p-3 bg-sagb-bg-2 border border-sagb-line rounded-xl text-[11px] text-sagb-muted hover:border-sagb-blue/30 transition-all cursor-pointer">
                       Aula 1.2: Estrutura de Feedback
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'materiais' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="bg-sagb-panel p-4 rounded-2xl border border-sagb-line flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                       <FileTextIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <h5 className="text-[12px] font-bold text-sagb-text group-hover:text-sagb-blue transition-colors">Guia de Implementação v2.pdf</h5>
                       <p className="text-[9px] text-sagb-muted uppercase tracking-tighter">PDF • 2.4 MB</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'sessoes' && (
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="bg-sagb-panel p-6 rounded-2xl border border-sagb-line shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <span className="text-[9px] font-black text-sagb-blue uppercase tracking-widest block mb-1">Próxima Sessão</span>
                          <h4 className="text-[12px] font-bold text-sagb-text">Mentoria em Grupo: Alinhamento de Q1</h4>
                       </div>
                       <div className="text-right text-[10px] font-bold text-sagb-muted">
                          <ClockIcon className="w-3 h-3 inline mr-1" /> 28 Mar, 14:00
                       </div>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                       <div className="flex -space-x-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="w-6 h-6 rounded-full border-2 border-sagb-panel bg-sagb-bg-2 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?u=${j}`} alt="Avatar" />
                            </div>
                          ))}
                       </div>
                       <span className="text-[10px] text-sagb-muted">+12 participantes</span>
                    </div>
                    <button className="w-full py-2 bg-sagb-blue/10 text-sagb-blue rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-sagb-blue/20 transition-all">
                       Entrar na Sala Virtual
                    </button>
                 </div>
               ))}
            </div>
          )}
          
          {/* Outras abas podem ser implementadas conforme a necessidade */}
          {(activeTab === 'agentes' || activeTab === 'historico') && (
            <div className="bg-sagb-panel rounded-3xl p-12 border border-sagb-line text-center">
               <BookIcon className="w-12 h-12 text-sagb-line mx-auto mb-4" />
               <h4 className="text-[12px] font-bold text-sagb-muted uppercase tracking-widest">Em Breve</h4>
               <p className="text-[12px] text-sagb-muted mt-2">Esta seção está sendo preparada para a próxima iteração do módulo.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
