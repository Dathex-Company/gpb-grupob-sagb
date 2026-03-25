import React from 'react';

export const AgendaInteligenteSettingsPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-8">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Configurações</h1>
          <p className="text-gray-500 mt-2 font-medium">Ajustes do módulo Agenda Inteligente.</p>
        </div>
        
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 flex items-center justify-center h-48 border-dashed">
          <p className="text-gray-400 font-medium">[ Configurações Placeholder ]</p>
        </div>
      </div>
    </div>
  );
};
