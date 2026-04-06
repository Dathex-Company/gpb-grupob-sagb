import React, { useMemo, useState } from 'react';
import { MonitoramentoInternalMenu } from '../components';
import { monitoramentoSubmodulos } from '../services';

const MonitoramentoPage: React.FC = () => {
  const firstSlug = monitoramentoSubmodulos[0]?.slug || 'infraestrutura';
  const [activeSlug, setActiveSlug] = useState(firstSlug);

  const activeSubmodulo = useMemo(
    () => monitoramentoSubmodulos.find((submodulo) => submodulo.slug === activeSlug) || monitoramentoSubmodulos[0],
    [activeSlug]
  );

  if (!activeSubmodulo) return null;

  return (
    <section className="flex-1 h-full overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F19] custom-scrollbar">
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-8 space-y-8">
        <header className="rounded-[32px] border border-white/80 bg-slate-950 text-white shadow-[0_30px_80px_rgba(15,23,42,0.22)] overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.15),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.12),_transparent_40%)]" />
          <div className="relative px-8 md:px-10 py-10 flex flex-col gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">QG · Comando</span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Monitoramento</h1>
            <p className="text-sm md:text-base text-slate-300 font-medium">Submódulo ativo: {activeSubmodulo.label}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <MonitoramentoInternalMenu
            submodulos={monitoramentoSubmodulos}
            ativoSlug={activeSubmodulo.slug}
            onSelect={setActiveSlug}
          />

          <section className="rounded-3xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0F172A] p-6 md:p-8 shadow-sm space-y-6">
            <header className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">{activeSubmodulo.label}</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                {activeSubmodulo.items.length} itens
              </span>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {activeSubmodulo.items.map((item) => (
                <article
                  key={item}
                  className="rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#111827] p-5 min-h-24 flex items-center"
                >
                  <strong className="text-sm text-gray-800 dark:text-gray-100">{item}</strong>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default MonitoramentoPage;
