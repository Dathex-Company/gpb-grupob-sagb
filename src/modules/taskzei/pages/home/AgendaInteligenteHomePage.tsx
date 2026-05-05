import React, { useEffect, useMemo } from 'react';
import { useTaskzeiStore } from '../../store/taskzei.store';
import { useMeetingStore } from '../../store/meeting.store';
import { useInboxStore } from '../../store/inbox.store';
import { taskzeiFacade } from '../../services/taskzei.facade';
import { metricsService } from '../../services/taskzei.metrics';

export const AgendaInteligenteHomePage: React.FC = () => {
  const tasks = useTaskzeiStore((s) => s.tasks);
  const meetings = useMeetingStore((s) => s.meetings);
  const inboxItems = useInboxStore((s) => s.inboxItems);

  useEffect(() => {
    taskzeiFacade.loadTasks();
    taskzeiFacade.loadMeetings();
    taskzeiFacade.loadInboxItems();
  }, []);

  const metrics = useMemo(
    () => metricsService.computeOverall(tasks, meetings, inboxItems),
    [tasks, meetings, inboxItems]
  );

  const kpis = useMemo(() => {
    const createdToday = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      const now = new Date();
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    const completedToday = tasks.filter((t) => {
      if (t.status !== 'concluida') return false;
      const d = new Date(t.updatedAt);
      const now = new Date();
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return [
      { label: 'criadas hoje', value: String(createdToday), hint: `${tasks.length} no total` },
      { label: 'concluídas hoje', value: String(completedToday), hint: `${metrics.tasks.byStatus.concluida} concluídas` },
      { label: 'pendentes', value: String((metrics.tasks.byStatus.aberta || 0) + (metrics.tasks.byStatus.em_andamento || 0)), hint: 'abertas + andamento' },
      { label: 'taxa de conclusão', value: `${(metrics.tasks.completionRate * 100).toFixed(0)}%`, hint: 'base do módulo' }
    ];
  }, [tasks, metrics]);

  const trend7d = useMemo(() => {
    const days: { label: string; created: number; done: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const base = new Date();
      base.setHours(0, 0, 0, 0);
      base.setDate(base.getDate() - i);
      const next = new Date(base);
      next.setDate(next.getDate() + 1);
      const created = tasks.filter((t) => {
        const d = new Date(t.createdAt);
        return d >= base && d < next;
      }).length;
      const done = tasks.filter((t) => {
        const d = new Date(t.updatedAt);
        return t.status === 'concluida' && d >= base && d < next;
      }).length;
      days.push({ label: base.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), created, done });
    }
    return days;
  }, [tasks]);

  const maxTrend = Math.max(1, ...trend7d.map((d) => Math.max(d.created, d.done)));

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
              <h2 className="text-sm font-semibold text-[#414854]">Tendência (7 dias)</h2>
              <span className="text-xs font-semibold text-[#87a8cf]">Criadas x Concluídas</span>
            </header>
            <div className="space-y-2">
              {trend7d.map((d) => (
                <div key={d.label} className="rounded-lg border border-[#e8ecf1] bg-[#fafbfc] px-3 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#6f7887]">
                    <span>{d.label}</span>
                    <span>Criadas {d.created} • Concluídas {d.done}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2 rounded bg-[#dfeaf6]">
                      <div className="h-2 rounded bg-[#87a8cf]" style={{ width: `${(d.created / maxTrend) * 100}%` }} />
                    </div>
                    <div className="h-2 rounded bg-[#dcf3ef]">
                      <div className="h-2 rounded bg-[#68c7be]" style={{ width: `${(d.done / maxTrend) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-[#d9dee5] bg-white p-4 shadow-sm">
            <header className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#414854]">Resumo operacional</h2>
              <span className="text-xs font-semibold text-[#87a8cf]">Dados reais</span>
            </header>

            <div className="space-y-2">
              {[
                `Reuniões agendadas: ${metrics.meetings.byStatus['agendada'] || 0}`,
                `Itens no inbox pendentes: ${metrics.inbox.byStatus['pending'] || 0}`,
                `Checklist em tarefas: ${metrics.tasks.withChecklist}`
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
