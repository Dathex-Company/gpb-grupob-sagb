import React from 'react';
import RAIHero from '../components/RAIHero';
import RAIStatsStrip from '../components/RAIStatsStrip';
import RAIAgentsPanel from '../components/RAIAgentsPanel';
import RAICapturesPanel from '../components/RAICapturesPanel';
import RAIReadingsPanel from '../components/RAIReadingsPanel';
import RAIAlertsPanel from '../components/RAIAlertsPanel';
import RAIFiltersBar from '../components/RAIFiltersBar';
import RAIHistoryPanel from '../components/RAIHistoryPanel';
import { useRAIAgents, useRAICaptures, useRAIInsights } from '../hooks/useRAI';

const RAIPage: React.FC = () => {
  const { agents } = useRAIAgents();
  const { captures } = useRAICaptures();
  const { readings, alerts } = useRAIInsights();

  return (
    <div className="h-full bg-gray-50 dark:bg-[#0B0F19] overflow-y-auto custom-scrollbar">
      <div className="max-w-[1600px] mx-auto p-8">
        
        {/* Header Section */}
        <RAIHero />
        
        {/* Quick Stats */}
        <RAIStatsStrip />

        {/* Filters */}
        <RAIFiltersBar />

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Agents & Captures */}
          <div className="xl:col-span-4 space-y-8">
            <RAIAgentsPanel agents={agents} />
            <RAICapturesPanel captures={captures} />
          </div>

          {/* Middle Column: Readings & Insights */}
          <div className="xl:col-span-5 space-y-8">
            <RAIReadingsPanel readings={readings} />
            <RAIHistoryPanel />
          </div>

          {/* Right Column: Alerts & Opportunities */}
          <div className="xl:col-span-3 space-y-8">
            <RAIAlertsPanel alerts={alerts} />
            
            {/* Call to Action: Future Integration */}
            <div className="p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
               <h4 className="text-sm font-black uppercase mb-2 tracking-widest">Ação Direta</h4>
               <p className="text-[11px] text-blue-100 font-medium leading-relaxed mb-4">
                 Envie qualquer captura ou insight diretamente para o NIC (Inteligência Interna) ou NAGI (Governança).
               </p>
               <button className="w-full py-3 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-colors">
                 Enviar para NIC
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RAIPage;
