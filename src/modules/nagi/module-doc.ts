export const moduleDoc = {
  nomeOficial: 'NAGI — Núcleo Avançado de Gestão de Ideias',
  objetivo:
    'Governar o pipeline completo de recepção, classificação, qualificação, priorização, decisão e encaminhamento de ideias e itens estratégicos do ecossistema SagB, atuando como hub central entre as camadas de preparação (CID, RAI, NIC) e os módulos especialistas.',
  responsavelTecnico: 'Cássio Mendes',
  status: 'V2 — Ativo (repo + promoção + handoff + Alice UI)',
  tipo: 'Módulo Oficial — Núcleo de Governança',

  divisoesInternas: {
    catalogoGovernado:
      'Itens oficiais e reconhecidos do ecossistema: empresas, ventures, metodologias, programas, frameworks, planos, iniciativas consolidadas e estruturas oficiais. Cada item possui score, responsável, handoffRecord com status de recebimento, vínculo com especialista e trilha de governança.',
    triagemIdeias:
      'Itens em qualificação: ideias avulsas, saídas do NIC, hipóteses, propostas e frentes em análise. Cada item percorre estágios de maturidade (entrada → classificação → qualificação → priorização → decisão → encaminhada/catalogada) com score, evidências, promotionStatus e histórico de decisão.',
  },

  tipoCentral: {
    nome: 'NagiItem',
    camposAgrupados: [
      'Identidade (id, title, summary, createdAt, updatedAt)',
      'Origem (avulsa, nic, catalogo) com originRefId e originSnapshot',
      'Classificação (itemType, category, tags)',
      'Maturidade (maturityStage com 7 estágios)',
      'Prioridade (alta, media, baixa)',
      'Score (impacto, esforço, risco, alinhamento, final 0-100)',
      'Status operacional (não iniciado → concluído)',
      'Status de governança (em triagem → arquivada)',
      'Status de promoção (nao_elegivel, elegivel, promovida, rejeitada_catalogo)',
      'Handoff record (target, status encaminhado/recebido/processado/finalizado, timestamps)',
      'Destino especialista (legado: tab + label + motivo)',
      'Responsável (ownerUserId, ownerName)',
      'Evidências (lista com tipo, label, uri, excerpt)',
      'Histórico de decisão (trilha auditável completa)',
    ],
  },

  fluxoArquitetural: 'CID + RAI → NIC → NAGI → Módulos Especialistas',

  descricaoFluxo: [
    '1. CID prepara material documental interno.',
    '2. RAI observa e capta sinais externos.',
    '3. NIC cruza, interpreta e amadurece leituras estratégicas.',
    '4. NAGI recebe ideias maduras (via NicBridge) e avulsas, governa, organiza, qualifica, prioriza e decide.',
    '5. Módulos especialistas formalizam e executam as iniciativas encaminhadas.',
  ],

  tabelasSupabase: [
    'Nenhuma migração ativa. Dados V2 operam via LocalStorageNagiRepository com interface INagiRepository preparada para swap futuro para Supabase.',
  ],

  bucketsStorage: [
    'Não é storage primário; gerencia evidências referenciadas por uri.',
  ],

  integracoes: [
    'CID (fonte documental estratégica)',
    'RAI (radar de inteligência externa)',
    'NIC (camada interpretativa — NicBridge para entrada de saídas estratégicas)',
    'Memória Contínua (fonte operacional)',
    'Hub de Ventures (gestão de ventures)',
    'Governança (políticas e decisões)',
    'Módulos especialistas (destino de encaminhamento com handoff tracking)',
  ],

  estruturasExclusivas: [
    'src/modules/nagi/domain/types.ts (NagiItem + enums V2 com promotionStatus, handoffRecord)',
    'src/modules/nagi/repository/nagi.repository.ts (INagiRepository + LocalStorageNagiRepository)',
    'src/modules/nagi/services/nagiService.ts (CRUD + governança V2 com repo pattern)',
    'src/modules/nagi/services/nagiPromotionService.ts (regra de promoção triagem → catálogo)',
    'src/modules/nagi/services/nagiNicBridge.ts (recepção de saídas do NIC)',
    'src/modules/nagi/services/nagiHandoffService.ts (tracking de handoff para especialistas)',
    'src/modules/nagi/components/NAGIView.tsx (hub orquestrador com abas, criação, import NIC)',
    'src/modules/nagi/components/CatalogSection.tsx (catálogo governado — Alice UI)',
    'src/modules/nagi/components/TriageSection.tsx (triagem com pipeline visual — Alice UI)',
    'src/modules/nagi/components/NagiItemDetail.tsx (detalhe + ações de governança, promoção, handoff)',
    'src/modules/nagi/data/nagiBlueprint.ts (dados seed V2 com promotionStatus e handoffRecord)',
    'src/modules/nagi/pages/NAGIPage.tsx',
    'src/modules/nagi/agent/',
    'src/modules/nagi/changelog.md',
  ],

  fluxosPrincipais: [
    '1. Visualizar Catálogo Governado com filtros por tipo, status operacional e busca.',
    '2. Visualizar Triagem com filtros por origem, estágio, prioridade, governança e busca.',
    '3. Pipeline visual por colunas de maturidade (7 estágios) com indicador ★ Elegível para catálogo.',
    '4. Criar ideia avulsa — entra em triagem com maturityStage=entrada e governanceStatus=em_triagem.',
    '5. Importar do NIC — formulário com title, summary, originRefId, snapshot, tipo e categoria.',
    '6. Classificar item — definir itemType, categoria e tags.',
    '7. Qualificar item — preencher score de impacto, esforço, risco e alinhamento com cálculo de final.',
    '8. Priorizar item — toggle cíclico alta/média/baixa.',
    '9. Decidir — aprovar, rejeitar, incubar ou arquivar com justificativa.',
    '10. Promover para catálogo — item aprovado com score ≥ 50 e tipo ≠ ideia.',
    '11. Encaminhar para especialista — selecionar módulo destino, registrar motivo obrigatório.',
    '12. Handoff tracking — atualizar status (recebido → processado → finalizado) no detalhe.',
    '13. Navegar para módulo especialista via botão no detalhe do item encaminhado.',
  ],

  pendenciasPrincipais: [
    'Persistência real (SupabaseNagiRepository) em vez de localStorage.',
    'Integração viva com NIC para recebimento automático de saídas (webhook/RxJS).',
    'Integração viva com RAI para captura de sinais externos.',
    'Automação de recomendação de score via IA.',
    'Métricas de funil (entradas, aprovadas, descartadas, encaminhadas, retornos).',
    'Notificações e SLA de governança.',
    'Vinculação bidirecional com módulos especialistas.',
    'Modo escuro Alice UI.',
    'Testes unitários para regras de promoção e handoff.',
  ],
};
