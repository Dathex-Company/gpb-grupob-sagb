import React from 'react';

export const AgendaInteligenteHomePage: React.FC = () => {
  const kpis = [
    { label: 'tarefas concluídas', value: '24', hint: '+12% na semana' },
    { label: 'eficiência operacional', value: '94%', hint: 'dentro da meta' },
    { label: 'foco diário médio', value: '6.5h', hint: 'últimos 7 dias' },
    { label: 'projetos ativos', value: '12', hint: '3 squads' }
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-[#d9dee5] bg-[#f5f6f7] p-4">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-[#414854]">Visão Geral</h1>
            <p className="mt-1 text-sm text-[#6f7887]">Resumo operacional compacto da execução diária.</p>
          </div>
          <span className="inline-flex h-7 items-center rounded-full border border-[#d9dee5] bg-white px-3 text-[11px] font-semibold text-[#6f7887]">
            Atualizado agora
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-xl border border-[#d9dee5] bg-white p-4 shadow-sm">
              <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#95a0b1]">{kpi.label}</p>
              <p className="mt-2 text-2xl font-semibold text-[#414854]">{kpi.value}</p>
              <p className="mt-1 text-[11px] text-[#6f7887]">{kpi.hint}</p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-xl border border-[#d9dee5] bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#414854]">Agenda do dia</h2>
              <button className="text-xs font-semibold text-[#87a8cf]">Ver calendário</button>
            </header>
            <div className="space-y-2">
              {[
                { hour: '09:00', title: 'Sync de design executivo', note: 'Revisão de identidade de marca', tag: 'alta prioridade' },
                { hour: '11:30', title: 'Revisão de roadmap', note: 'OKRs do trimestre', tag: 'interno' },
                { hour: '14:00', title: 'Onboarding de cliente', note: 'Workshop de estrutura operacional', tag: 'externo' }
              ].map((event) => (
                <div key={event.hour} className="grid grid-cols-[60px_1fr_auto] items-center gap-3 rounded-lg border border-[#e8ecf1] bg-[#fafbfc] px-3 py-2.5">
                  <span className="text-xs font-semibold text-[#414854]">{event.hour}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#414854]">{event.title}</p>
                    <p className="truncate text-[11px] text-[#6f7887]">{event.note}</p>
                  </div>
                  <span className="rounded-full border border-[#d9dee5] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6f7887]">
                    {event.tag}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#d9dee5] bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#414854]">Atividade recente</h2>
              <button className="text-xs font-semibold text-[#87a8cf]">Ver tudo</button>
            </header>

            <div className="space-y-2">
              {[
                'Pietra comentou em "Relatório Dulcini" há 2 min',
                'Você adicionou 3 anexos no projeto Oral Platinum',
                'Douglas concluiu a validação de QA'
              ].map((item) => (
                <div key={item} className="rounded-lg border border-[#e8ecf1] bg-[#fafbfc] px-3 py-2 text-[12px] text-[#6f7887]">
                  {item}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
