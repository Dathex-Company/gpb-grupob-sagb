import React from 'react';
import { ProviderBadge, VideosIaInternalMenu } from '../components';
import { usePromptLifecycle } from '../hooks';
import { videosIaProviders, videosIaStyleLibrary } from '../services';

const VideosIaPage: React.FC = () => {
  const promptLifecycle = usePromptLifecycle(
    'Criar vídeo de 30s com foco em conversão para campanha digital.',
    'Aplicar narrativa em 3 atos, CTA final e estilo cinematográfico clean.'
  );

  return (
    <section className="p-6 space-y-6 text-[12px]">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Vídeos IA</h1>
        <p className="text-[12px] text-slate-600 dark:text-slate-300 mt-1">
          Bloco interno: <strong>criador de videos</strong>. Prompt tratado como ativo estruturado, versionado e reutilizável.
        </p>
      </header>

      <VideosIaInternalMenu
        sections={[
          'Briefing',
          'Refino Inteligente',
          'Adaptação por Provider',
          'Receitas Oficiais',
          'Histórico e Versões'
        ]}
      />

      <div className="grid gap-3 md:grid-cols-3">
        {videosIaProviders.map((provider) => (
          <ProviderBadge key={provider.id} provider={provider} />
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <h2 className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">Memória de Prompt (base inicial)</h2>
        <p className="text-[12px] text-slate-600 dark:text-slate-300">
          <strong>Prompt base:</strong> {promptLifecycle.promptBase}
        </p>
        <p className="text-[12px] text-slate-600 dark:text-slate-300">
          <strong>Prompt refinado:</strong> {promptLifecycle.promptRefinado}
        </p>
        <p className="text-[12px] text-slate-600 dark:text-slate-300">
          <strong>Prompt master:</strong> {promptLifecycle.promptMaster}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <h2 className="text-[12px] font-semibold text-slate-800 dark:text-slate-100">Biblioteca inicial de estilos</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {videosIaStyleLibrary.map((style) => (
            <span key={style} className="text-[12px] px-2 py-1 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200">
              {style}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideosIaPage;
