import React from 'react';
import { MetricCard } from '../../../../../components/MetricCard';
import { BookIcon, ClockIcon, PlusIcon, ArrowRightIcon, CodeIcon } from '../../../../../components/Icon';
import { mentoriasManifest } from '../domain-manifest';

interface MentoriasDashboardPageProps {
  onNavigate: (view: 'library' | 'detail', id?: string) => void;
}

export const MentoriasDashboardPage: React.FC<MentoriasDashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 overflow-auto p-8">
      {/* Header canônico 2 colunas */}
      <header className="mb-8 flex justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sagb-blue/10 text-sagb-blue border border-sagb-blue/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
              <CodeIcon className="w-3 h-3" />
              Módulo Oficial
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Central de Mentorias
          </h1>
          <p className="text-sagb-muted mt-2 text-[12px] max-w-2xl">
            Hub de estrutura, execução e evolução de programas vivos.
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-1">
            Módulo Oficial
          </div>
          <div className="text-lg font-bold text-sagb-text">
            Central de Mentorias
          </div>
          <div className="mt-2 text-[12px] text-sagb-muted">
            Responsável:{' '}
            <span className="font-semibold text-sagb-text">
              {mentoriasManifest.owner?.displayName || 'A definir'}
            </span>
          </div>
        </div>
      </header>

      {/* Botão "Nova Mentoria" abaixo do header */}
      <div className="flex justify-end mb-6">
        <button 
          onClick={() => onNavigate('library')}
          className="flex items-center gap-2 bg-sagb-blue hover:bg-sagb-blue-2 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
        >
          <PlusIcon className="w-4 h-4" />
          Nova Mentoria
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard title="Total de Mentorias" value={12} unit="ativas" badge="real" trend="up" />
        <MetricCard title="Em Construção" value={4} unit="drafts" badge="demo" status="warning" />
        <MetricCard title="Sessões Realizadas" value={156} unit="total" badge="integration" />
        <MetricCard title="Engajamento" value="88%" badge="real" status="success" />
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-sagb-panel rounded-[2rem] p-8 border border-sagb-line shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[10px] font-black text-sagb-muted uppercase tracking-widest">Atividade Recente</h3>
            <button 
              onClick={() => onNavigate('library')}
              className="text-[10px] font-black text-sagb-blue uppercase tracking-widest hover:underline"
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
                className="bg-sagb-bg-2 border border-sagb-line p-4 rounded-2xl flex items-center justify-between hover:bg-sagb-bg transition-colors cursor-pointer group"
                onClick={() => onNavigate('detail', item.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    <BookIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold text-sagb-text group-hover:text-sagb-blue transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-sagb-muted italic">{item.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-sagb-muted block">{item.time}</span>
                  <ArrowRightIcon className="w-4 h-4 text-sagb-line ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="bg-sagb-panel rounded-[2rem] p-8 border border-sagb-line shadow-sm">
            <h3 className="text-[10px] font-black text-sagb-muted uppercase tracking-widest mb-6">Próximas Sessões</h3>
            <div className="space-y-4">
              {[
                { time: '14:00', title: 'Deep Dive: OKRs', mentor: 'Cassio' },
                { time: '16:30', title: 'Product Review', mentor: 'Aline' },
              ].map((sessao, i) => (
                <div key={i} className="flex items-start gap-3 pb-4 border-b border-sagb-line last:border-0 last:pb-0">
                  <ClockIcon className="w-4 h-4 text-sagb-blue mt-0.5" />
                  <div>
                    <span className="text-[10px] font-bold text-sagb-blue">{sessao.time}</span>
                    <h5 className="text-[12px] font-bold text-sagb-text">{sessao.title}</h5>
                    <p className="text-[9px] text-sagb-muted">Mentor: {sessao.mentor}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-sagb-blue to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-4">Insights de IA</h3>
              <p className="text-[12px] font-medium leading-relaxed mb-6 italic">
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
