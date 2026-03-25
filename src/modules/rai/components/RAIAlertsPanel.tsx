import React from 'react';
import { RAIAlert } from '../types';

interface RAIAlertsPanelProps {
  alerts: RAIAlert[];
}

const RAIAlertsPanel: React.FC<RAIAlertsPanelProps> = ({ alerts }) => {
  return (
    <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-sm overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Alertas & Oportunidades</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-2xl border ${
              alert.type === 'critical' ? 'bg-rose-500/5 border-rose-500/10' : 
              alert.type === 'opportunity' ? 'bg-emerald-500/5 border-emerald-500/10' : 
              'bg-blue-500/5 border-blue-500/10'
            } relative overflow-hidden`}
          >
            <div className={`absolute top-0 left-0 w-1 h-full ${
              alert.type === 'critical' ? 'bg-rose-500' : 
              alert.type === 'opportunity' ? 'bg-emerald-500' : 
              'bg-blue-500'
            }`}></div>
            
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[8px] font-black uppercase tracking-widest ${
                alert.type === 'critical' ? 'text-rose-500' : 
                alert.type === 'opportunity' ? 'text-emerald-500' : 
                'text-blue-500'
              }`}>
                {alert.type}
              </span>
              <span className="text-[8px] text-gray-400 font-medium">
                {new Date(alert.timestamp).toLocaleDateString()}
              </span>
            </div>
            <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{alert.title}</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">{alert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RAIAlertsPanel;
