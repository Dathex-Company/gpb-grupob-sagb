import React from 'react';
import { useNide } from '../hooks/useNide';
import { NIDE_FULL_NAME } from '../core/constants';

export const NideHomePage: React.FC = () => {
  const { version } = useNide();

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        {/* Identidade visual mínima */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-xl font-black tracking-tight">N</span>
        </div>

        {/* Título */}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          NIDE
        </h1>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {NIDE_FULL_NAME}
        </p>

        {/* Status */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Base modular criada
          </span>
        </div>

        {/* Mensagem */}
        <p className="text-sm text-slate-400 dark:text-slate-500 leading-relaxed max-w-sm mx-auto">
          Esta é a base inicial do módulo NIDE. Os domínios internos serão incorporados nas próximas etapas.
        </p>

        {/* Informações técnicas */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Versão</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{version}</span>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
            <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Status</span>
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">Ativo</span>
          </div>
        </div>

        {/* Próximos domínios (placeholder) */}
        <div className="pt-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Domínios planejados
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Metodologias', 'Mentorias', 'Treinamentos', 'Cursos',
              'Programas', 'Jornadas', 'Frameworks', 'Processos',
              'Protocolos', 'Ferramentas', 'Padrões de Entrega',
              'Arquitetura de Negócios'
            ].map((domain) => (
              <span
                key={domain}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[10px] font-semibold text-slate-400 dark:text-slate-500"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
