import React, { useState } from 'react';
import { AgendaInteligenteHomePage } from '../pages/home/AgendaInteligenteHomePage';
import { AgendaInteligenteTasksPage } from '../pages/tasks/AgendaInteligenteTasksPage';
import { AgendaInteligenteInboxPage } from '../pages/inbox/AgendaInteligenteInboxPage';
import { AgendaInteligenteMeetingsPage } from '../pages/meetings/AgendaInteligenteMeetingsPage';
import { AgendaInteligenteMonitorPage } from '../pages/monitor/AgendaInteligenteMonitorPage';
import { AgendaInteligenteProjectsPage } from '../pages/projects/AgendaInteligenteProjectsPage';
import { AgendaInteligenteProcessesPage } from '../pages/processes/AgendaInteligenteProcessesPage';
import { AgendaInteligenteSettingsPage } from '../pages/settings/AgendaInteligenteSettingsPage';
import { MockModeBanner } from '../components/MockModeBanner';

// Sub-rotas internas do módulo TaskZei simuladas por estado (Shell isolado)
type TaskZeiView = 'home' | 'tasks' | 'inbox' | 'meetings' | 'monitor' | 'projects' | 'processes' | 'settings';

export const AgendaInteligenteLayout: React.FC = () => {
  // A aba inicial com destaque é Tarefas
  const [currentView, setCurrentView] = useState<TaskZeiView>('tasks');

  const navigationItems: { id: TaskZeiView; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Visão Geral',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
    },
    {
      id: 'tasks',
      label: 'Tarefas',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    },
    {
      id: 'meetings',
      label: 'Reuniões',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      id: 'monitor',
      label: 'Monitor',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    {
      id: 'projects',
      label: 'Projetos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    },
    {
      id: 'processes',
      label: 'Processos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    }
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home': return <AgendaInteligenteHomePage />;
      case 'inbox': return <AgendaInteligenteInboxPage />;
      case 'tasks': return <AgendaInteligenteTasksPage />;
      case 'meetings': return <AgendaInteligenteMeetingsPage />;
      case 'monitor': return <AgendaInteligenteMonitorPage />;
      case 'projects': return <AgendaInteligenteProjectsPage />;
      case 'processes': return <AgendaInteligenteProcessesPage />;
      case 'settings': return <AgendaInteligenteSettingsPage />;
      default: return <AgendaInteligenteTasksPage />;
    }
  };

  return (
    <div className="m-3 flex h-full overflow-hidden rounded-[1.4rem] border border-[#d9dee5] bg-[#f5f6f7] shadow-sm">
      {/* Shell Sidebar Módulo */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-[#d9dee5] bg-[#f0f2f4]">
        <div className="h-16 shrink-0 border-b border-[#e1e6ec] px-5">
          <div className="flex h-full items-center gap-3">
            <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-[#68c7be] to-[#87a8cf] text-[10px] font-semibold text-white">
              TZ
            </div>
            <div>
              <h2 className="text-[14px] font-semibold tracking-tight text-[#414854]">TaskZei</h2>
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#95a0b1]">industrial pastel</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          <div>
            <p className="mb-2 pl-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#95a0b1]">Main</p>
          {navigationItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                  className={`mb-1 flex h-9 w-full items-center gap-3 rounded-[10px] border px-3 text-[13px] font-medium transition-colors ${
                  isActive 
                      ? 'border-[#d7ece8] bg-[#eaf7f5] text-[#414854]'
                      : 'border-transparent text-[#6f7887] hover:bg-[#fafbfc] hover:text-[#414854]'
                }`}
              >
                  <div className={`${isActive ? 'text-[#68c7be]' : 'text-[#95a0b1]'}`}>
                  {item.icon}
                </div>
                {item.label}
              </button>
            );
          })}
          </div>

          <div className="rounded-[10px] border border-[#d9dee5] bg-white/80 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#95a0b1]">Workspace</p>
            <p className="mt-1 text-[12px] font-medium text-[#414854]">Demanda Geral</p>
            <p className="text-[11px] text-[#6f7887]">Operação • 28 tarefas</p>
          </div>
        </nav>
      </aside>

      {/* Conteúdo Principal do Módulo */}
      <main className="relative flex flex-1 flex-col overflow-hidden bg-[#f5f6f7]">
        <MockModeBanner />
        {renderCurrentView()}
      </main>
    </div>
  );
};
