import React, { useEffect, useState } from 'react';
import { Mentoria } from '../types/mentorias.types';
import { mentoriasService } from '../services/mentorias.service';
import { BookIcon, ClockIcon, FileTextIcon, ArrowRightIcon, BackIcon, CheckIcon } from '../../../../components/Icon';

interface MentoriaDetailPageProps {
  id?: string;
  onBack: () => void;
}

type TabType = 'estrutura' | 'materiais' | 'sessoes' | 'agentes' | 'historico';

export const MentoriaDetailPage: React.FC<MentoriaDetailPageProps> = ({ id, onBack }) => {
  const [mentoria, setMentoria] = useState<Mentoria | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('estrutura');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      mentoriasService.getMentoriaById(id).then(data => {
        setMentoria(data || null);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!mentoria) return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0B0F19]">
      <p className="text-gray-500 mb-4">Mentoria não encontrada.</p>
      <button onClick={onBack} className="text-blue-500 font-bold uppercase tracking-widest text-[10px]">Voltar</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <header className="p-8 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#111827]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-500 transition-colors mb-6"
        >
          <BackIcon className="w-4 h-4" />
          Voltar para a Biblioteca
        </button>

        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-500/10 text-blue-600 text-[8px] font-black rounded uppercase tracking-widest">
                {mentoria.type}
              </span>
              <span className="text-[10px] font-bold text-gray-400">v{mentoria.version}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{mentoria.title}</h1>
          </div>
          <div className="flex gap-3">
             <button className="px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-200 transition-all">
                Exportar
             </button>
             <button className="px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-all">
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
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
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
                <div key={i} className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-white/5 rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[10px]">{i}</span>
                      Módulo {i}: Introdução e Fundamentos
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <CheckIcon className="w-3 h-3" /> Completo
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-6 italic">Definição dos pilares essenciais e alinhamento de expectativas para o programa.</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-[11px] text-gray-600 dark:text-gray-400 border border-transparent hover:border-blue-500/30 transition-all cursor-pointer">
                       Aula 1.1: O Mindset do Mentor
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-[11px] text-gray-600 dark:text-gray-400 border border-transparent hover:border-blue-500/30 transition-all cursor-pointer">
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
                 <div key={i} className="bg-white dark:bg-[#111827] p-4 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
                       <FileTextIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                       <h5 className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">Guia de Implementação v2.pdf</h5>
                       <p className="text-[9px] text-gray-400 uppercase tracking-tighter">PDF • 2.4 MB</p>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {activeTab === 'sessoes' && (
            <div className="space-y-4">
               {[1, 2].map(i => (
                 <div key={i} className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">Próxima Sessão</span>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">Mentoria em Grupo: Alinhamento de Q1</h4>
                       </div>
                       <div className="text-right text-[10px] font-bold text-gray-500">
                          <ClockIcon className="w-3 h-3 inline mr-1" /> 28 Mar, 14:00
                       </div>
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                       <div className="flex -space-x-2">
                          {[1, 2, 3].map(j => (
                            <div key={j} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#111827] bg-gray-200 overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?u=${j}`} alt="Avatar" />
                            </div>
                          ))}
                       </div>
                       <span className="text-[10px] text-gray-400">+12 participantes</span>
                    </div>
                    <button className="w-full py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                       Entrar na Sala Virtual
                    </button>
                 </div>
               ))}
            </div>
          )}
          
          {/* Outras abas podem ser implementadas conforme a necessidade */}
          {(activeTab === 'agentes' || activeTab === 'historico') && (
            <div className="bg-white dark:bg-[#111827] rounded-3xl p-12 border border-gray-100 dark:border-white/5 text-center">
               <BookIcon className="w-12 h-12 text-gray-200 dark:text-gray-800 mx-auto mb-4" />
               <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Em Breve</h4>
               <p className="text-xs text-gray-500 mt-2">Esta seção está sendo preparada para a próxima iteração do módulo.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
