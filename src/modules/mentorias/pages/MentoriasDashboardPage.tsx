import React from 'react';
import { MetricCard } from '../../../../components/MetricCard';
import { BookIcon, ClockIcon, PlusIcon, ArrowRightIcon } from '../../../../components/Icon';

interface MentoriasDashboardPageProps {
  onNavigate: (view: 'library' | 'detail', id?: string) => void;
}

export const MentoriasDashboardPage: React.FC<MentoriasDashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50 dark:bg-[#0B0F19] transition-colors duration-300">
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Central de Mentorias</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Hub de estrutura, execução e evolução de programas vivos.</p>
        </div>
        <button 
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          Nova Mentoria
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-gray-900">
        <MetricCard title="Total de Mentorias" value={12} unit="ativas" badge="real" trend="up" />
        <MetricCard title="Em Construção" value={4} unit="drafts" badge="demo" status="warning" />
        <MetricCard title="Sessões Realizadas" value={156} unit="total" badge="integration" />
        <MetricCard title="Engajamento" value="88%" badge="real" status="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Atividade Recente</h3>
            <button 
              onClick={() => onNavigate('library')}
              className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:underline"
            >
              Ver Tudo
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: '1', title: 'Mentoria de Liderança Tech', action: 'Nova versão v1.2.0 publicada', time: 'Há 2 horas', status: 'active' },
              { id: '2', title: 'Arquitetura de Sistemas', action: 'Aula 3 adicionada à estrutura', time: 'Há 5 horas', status: 'draft' },
              { id: '3', title: 'Cultura GrupoB', action: 'Documento de onboarding atualizado', time: 'Há 1 dia', status: 'active' },
            ].map(item => (
              <div 
                key={item.id} 
                className="bg-gray-50 dark:bg-[#1F2937]/30 border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-[#1F2937]/50 transition-colors cursor-pointer group"
                onClick={() => onNavigate('detail', item.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600' : 'bg-amber-100 dark:bg-amber-500/10 text-amber-600'}`}>
                    <BookIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 italic">{item.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 block">{item.time}</span>
                  <ArrowRightIcon className="w-4 h-4 text-gray-300 dark:text-gray-700 ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-white dark:bg-[#111827] rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-2xl">
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6 text-gray-900 dark:text-white">Próximas Sessões</h3>
            <div className="space-y-4">
              {[
                { time: '14:00', title: 'Deep Dive: OKRs', mentor: 'Cassio' },
                { time: '16:30', title: 'Product Review', mentor: 'Aline' },
              ].map((sessao, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-gray-50 dark:border-white/5 last:border-0 last:pb-0">
                  <ClockIcon className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-blue-500">{sessao.time}</span>
                    <h5 className="text-xs font-bold text-gray-900 dark:text-white">{sessao.title}</h5>
                    <p className="text-[9px] text-gray-500">Mentor: {sessao.mentor}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-xs font-black text-white/60 uppercase tracking-widest mb-4">Insights de IA</h3>
              <p className="text-sm font-medium leading-relaxed mb-6 italic">
                "Notamos uma queda de engajamento na aula 4 da Mentoria de Liderança. Sugerimos revisar o material prático."
              </p>
              <button className="text-[10px] font-black uppercase tracking-widest bg-white/10 hover:bg-white/20 py-2 px-4 rounded-full transition-colors border border-white/20">
                Ver Sugestão
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <BookIcon className="w-32 h-32" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
