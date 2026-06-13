import type { ModuleDoc } from '../../../core/modules/module.types';

/**
 * Documentação canônica do módulo Foco Total (Zen Folk | Foco AI).
 * Contrato principal: ModuleDoc (displayName, purpose, version, boundaries, integrations, dataDependencies).
 *
 * Informações estratégicas complementares (ownership, pilares MVP, roadmap, riscos)
 * são mantidas abaixo em campos estruturados, sem quebrar o contrato ModuleDoc.
 */

export const moduleDoc: ModuleDoc & {
  /** Nome do agente operador do módulo */
  agentName: string;
  /** Dono principal e backup */
  ownership: { owner_principal: string; owner_backup: string };
  /** Pilares do MVP atual */
  pilares_mvp: string[];
  /** Roadmap faseado (1 = MVP atual, 2+ = futuro) */
  roadmap_faseado: Record<string, string[]>;
  /** Stack atual em produção */
  stack_atual: string[];
  /** Stack futura planejada (roadmap) */
  stack_futura: string[];
  /** Riscos e cuidados operacionais */
  riscos_e_cuidados: string[];
  /** Fonte de origem da triagem inicial */
  fonte_de_origem: string[];
} = {
  // ── Contrato ModuleDoc ───────────────────────────────────────────
  displayName: 'Zen Folk | Foco AI',
  purpose:
    'Copiloto de execução pessoal guiado por IA. O agente Zen Folk acompanha sprints de foco, sustenta concentração, provoca retomada quando há desvio e fecha cada sessão com registro objetivo de progresso.',
  version: '0.2.0',

  boundaries: [
    'Não realiza tracking de janela, ociosidade, leitura de tela ou contexto avançado (roadmap futuro).',
    'Não armazena dados em Supabase/SQLite (persistência local apenas).',
    'Não substitui ferramentas de produtividade completas — é um complemento de foco.',
    'Não coleta dados do usuário sem consentimento explícito.',
  ],

  integrations: {
    internal: ['taskzei (FocusWidget via facade pública focusSessionFacade)'],
    external: ['Gemini TTS (via aiProxy)', 'Browser SpeechSynthesis (fallback)'],
  },

  dataDependencies: {
    supabaseTables: [],
    storageBuckets: [],
    localStorageKeys: ['sagb:foco_total:sessions:v1'],
  },

  // ── Informações estratégicas complementares ──────────────────────
  agentName: 'Zen Folk',
  ownership: {
    owner_principal: 'Zen Folk',
    owner_backup: 'A DEFINIR',
  },
  pilares_mvp: [
    'Timer de sprint com tarefa e duração',
    'Intervenções motivacionais curtas durante a sessão (checkpoints)',
    'Fechamento obrigatório com registro de resultado',
    'Histórico local de sessões para aprendizado progressivo',
  ],
  roadmap_faseado: {
    fase_1_mvp: [
      'Sprint setup (tarefa + tempo)',
      'Timer operacional por tempo real (focusSessionClock)',
      'Mensagens de reforço por texto (checkpoints locais)',
      'Voz opcional e configurável (browser + Gemini TTS)',
      'Resumo e histórico da sessão (localStorage versionado)',
    ],
    fase_2_agente_inteligente: [
      'Mensagens dinâmicas por IA conforme momento do sprint',
      'Perfis de tom do agente (firme, calmo, parceiro, modo TDAH)',
      'Sugestão de micro-metas e fechamento adaptativo',
    ],
    fase_3_tracking: [
      'Detecção de perda de foco da janela',
      'Detecção de ociosidade',
      'Alertas de retorno e score de permanência',
    ],
    fase_4_contexto_avancado: [
      'Leitura contextual de tela (com consentimento explícito)',
      'Inferência de desvio de tarefa por contexto visual',
    ],
  },
  stack_atual: ['React (SagB Web)', 'TypeScript', 'Zustand', 'localStorage', 'Gemini TTS (via aiProxy)', 'Browser SpeechSynthesis', 'CSS Custom Properties (--sagb-*)'],
  stack_futura: ['Tauri (desktop)', 'OpenAI (agente inteligente)', 'SQLite local (persistência offline)', 'Supabase (sync opcional)'],
  riscos_e_cuidados: [
    'Privacidade e permissões para monitoramento avançado (fases 3-4)',
    'Evitar complexidade excessiva no MVP',
    'Controlar custo de chamadas de IA e voz (Gemini TTS)',
    'Manter alertas firmes sem experiência punitiva',
    'Bloqueio de autoplay do navegador pode impedir voz sem interação do usuário',
  ],
  fonte_de_origem: ['src/modules/foco_total/_triagem/foco ai coach chat gpt'],
};
