import React, { useState, useEffect } from 'react';
import { XIcon, MicIcon, MessageSquareIcon } from '../../../../components/Icon';
import { Agente } from '../types';

interface AgentSupervisionModalProps {
  agente: Agente;
  onClose: () => void;
}

const AgentSupervisionModal: React.FC<AgentSupervisionModalProps> = ({ agente, onClose }) => {
  const [messages, setMessages] = useState<Array<{ sender: 'lead' | 'bot', text: string }>>([
    { sender: 'lead', text: 'Olá, gostaria de saber os preços para implante.' },
    { sender: 'bot', text: 'Olá! Sou o Ricardo, especialista da Clínica Sorriso. Com certeza posso te ajudar com isso. Qual o seu nome?' },
    { sender: 'lead', text: 'Me chamo Marcos.' }
  ]);

  // Simular chat em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Prazer Marcos! Para implantes, temos opções que variam conforme a tecnologia usada. Você já realizou algum raio-X recentemente?' 
      }]);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[110] p-4">
      <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">
        
        {/* Header de Supervisão High-Tech */}
        <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="relative">
               <img src={agente.foto_url} className="w-16 h-16 rounded-2xl border-2 border-blue-500 shadow-lg shadow-blue-500/40" alt="" />
               <div className="absolute -top-2 -right-2 bg-rose-600 text-[8px] font-black px-2 py-1 rounded-full animate-pulse uppercase">LIVE</div>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tighter">MODO SUPERVISÃO (SHADOWING)</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{agente.funcao}</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="text-[10px] font-bold text-slate-400">ID: {agente.id}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Chat Feed */}
          <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-8 space-y-6">
             {messages.map((msg, idx) => (
               <div key={idx} className={`flex ${msg.sender === 'lead' ? 'justify-start' : 'justify-end animate-in slide-in-from-right-2'}`}>
                  <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${msg.sender === 'lead' ? 'bg-white text-slate-700' : 'bg-blue-600 text-white'}`}>
                    {msg.text}
                  </div>
               </div>
             ))}
             <div className="flex justify-center italic text-slate-400 text-[10px] py-4">Agente está digitando...</div>
          </div>

          {/* Right Panel: Metrics in Real Time */}
          <div className="w-80 border-l border-slate-100 p-8 bg-white space-y-10">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sentimento do Lead</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 w-[85%]"></div>
                  </div>
                  <span className="text-xs font-black text-emerald-600">POSITIVO</span>
                </div>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IA Decision Flow</h4>
                <div className="space-y-2">
                   {['Deteção de Intenção', 'Consulta Knowledge Base', 'Geração de Contexto'].map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 p-2 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        {step}
                      </div>
                   ))}
                </div>
             </div>

             <button className="w-full py-4 bg-orange-500 text-white font-black text-xs rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 hover:bg-orange-600 transition-all uppercase tracking-widest">
                Assumir Conversa
             </button>
          </div>
        </div>

        {/* Supervision Controls */}
        <div className="p-6 border-t border-slate-100 flex justify-center gap-4 bg-white">
           <button className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all">
              <MicIcon className="w-4 h-4" /> MONITORAR ÁUDIO
           </button>
           <button className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all">
              <MessageSquareIcon className="w-4 h-4" /> SUGERIR RESPOSTA
           </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSupervisionModal;
