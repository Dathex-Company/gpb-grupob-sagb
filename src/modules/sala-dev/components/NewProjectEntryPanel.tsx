import React from 'react';

export interface NewProjectBriefingForm {
  projectName: string;
  idea: string;
  objective: string;
  audience: string;
  constraints: string;
}

export interface GeneratedInitialBriefing {
  summary: string;
  scope: string[];
  risks: string[];
  firstSteps: string[];
}

interface NewProjectEntryPanelProps {
  form: NewProjectBriefingForm;
  briefing: GeneratedInitialBriefing | null;
  onChange: (field: keyof NewProjectBriefingForm, value: string) => void;
  onGenerateBriefing: () => void;
  onGenerateBriefingWithAi?: () => void;
  onStartPipeline: () => void;
  isGeneratingBriefingWithAi?: boolean;
  briefingAiError?: string | null;
}

export const NewProjectEntryPanel: React.FC<NewProjectEntryPanelProps> = ({
  form,
  briefing,
  onChange,
  onGenerateBriefing,
  onGenerateBriefingWithAi,
  onStartPipeline,
  isGeneratingBriefingWithAi = false,
  briefingAiError = null
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0B1121]">
      <div className="max-w-4xl mx-auto space-y-6">
        <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 md:p-8 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">Novo Projeto</p>
          <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Qual projeto você quer criar?</h2>
          <p className="text-sm text-slate-300 mt-3 leading-relaxed">
            Comece pelo briefing inicial. Depois você revisa e inicia a esteira de desenvolvimento com os painéis técnicos.
          </p>
          <p className="mt-4 inline-flex rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-300">
            1. Ideia → 2. Briefing → 3. Esteira
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Nome do projeto</label>
            <input
              value={form.projectName}
              onChange={(e) => onChange('projectName', e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-[#0B1121] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              placeholder="Ex: Plataforma de gestão comercial com IA"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Ideia do projeto</label>
            <textarea
              value={form.idea}
              onChange={(e) => onChange('idea', e.target.value)}
              className="w-full min-h-[110px] rounded-xl border border-slate-700 bg-[#0B1121] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              placeholder="Descreva o que você quer construir."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Objetivo principal</label>
              <input
                value={form.objective}
                onChange={(e) => onChange('objective', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0B1121] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="Qual resultado precisa entregar?"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Público / usuário</label>
              <input
                value={form.audience}
                onChange={(e) => onChange('audience', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0B1121] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                placeholder="Quem vai usar?"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Alguma limitação importante?</label>
            <textarea
              value={form.constraints}
              onChange={(e) => onChange('constraints', e.target.value)}
              className="w-full min-h-[90px] rounded-xl border border-slate-700 bg-[#0B1121] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
              placeholder="Ex.: prazo, orçamento, ferramenta que já usa, plataforma obrigatória ou alguma regra importante."
            />
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={onGenerateBriefing}
              className="w-full md:w-auto inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-100 font-black text-xs uppercase tracking-wider px-5 py-3 transition-colors"
            >
              Gerar briefing local
            </button>
            {onGenerateBriefingWithAi && (
              <button
                onClick={onGenerateBriefingWithAi}
                disabled={isGeneratingBriefingWithAi}
                className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 transition-colors"
              >
                {isGeneratingBriefingWithAi ? 'Gerando com IA...' : '✨ Gerar briefing com IA'}
              </button>
            )}
          </div>

          {briefingAiError && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 text-xs font-semibold text-yellow-200">
              IA indisponível: {briefingAiError}. Um briefing local foi gerado como fallback.
            </div>
          )}
        </section>

        {briefing && (
          <section className="rounded-2xl border border-cyan-700/60 bg-cyan-900/30 p-6 md:p-8 space-y-4 shadow-[0_0_0_1px_rgba(34,211,238,0.12)]">
            <h3 className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Briefing inicial gerado</h3>
            <p className="text-sm text-slate-100 leading-relaxed">{briefing.summary}</p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Escopo inicial</p>
                <ul className="space-y-1 text-xs text-slate-200">
                  {briefing.scope.map((item, idx) => <li key={idx}>• {item}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Riscos mapeados</p>
                <ul className="space-y-1 text-xs text-slate-200">
                  {briefing.risks.map((item, idx) => <li key={idx}>• {item}</li>)}
                </ul>
              </div>
              <div className="rounded-xl border border-slate-700 bg-[#0F172A] p-4">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">Próximos passos</p>
                <ul className="space-y-1 text-xs text-slate-200">
                  {briefing.firstSteps.map((item, idx) => <li key={idx}>• {item}</li>)}
                </ul>
              </div>
            </div>

            <button
              onClick={onStartPipeline}
              className="w-full md:w-auto inline-flex items-center justify-center rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider px-5 py-3 transition-colors"
            >
              Iniciar esteira de desenvolvimento
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
