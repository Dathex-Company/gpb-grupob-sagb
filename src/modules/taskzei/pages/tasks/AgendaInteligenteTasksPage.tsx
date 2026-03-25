import React from 'react';

export const AgendaInteligenteTasksPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Cabecalho Interno de Tarefas */}
      <div className="h-16 px-6 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">Todas as Tarefas</h1>
          <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold">0</span>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
            Filtros
          </button>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-bold shadow-sm shadow-cyan-600/20 hover:bg-cyan-700 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nova Tarefa
          </button>
        </div>
      </div>

      {/* Lista de Tarefas (Zero State) */}
      <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mb-4 border border-cyan-100">
            <svg className="w-8 h-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Nenhuma tarefa criada ainda</h2>
          <p className="text-sm text-gray-500 mb-6">
            O TaskZei é o seu centro de execução. Crie sua primeira tarefa para organizar seu fluxo de trabalho e ter clareza sobre seus próximos passos.
          </p>
          <button className="px-5 py-2.5 bg-cyan-600 text-white rounded-xl text-sm font-bold shadow-md shadow-cyan-600/20 hover:bg-cyan-700 transition-transform active:scale-95">
            Adicionar primeira tarefa
          </button>
        </div>
      </div>
    </div>
  );
};
