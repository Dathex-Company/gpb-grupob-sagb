import {
  StudioPreset,
  TelaTemplate,
} from '../types/telasAvancadas.types';

export const STUDIO_TEMPLATES: TelaTemplate[] = [
  {
    id: 'esteira_agentes',
    nome: 'Esteira de Agentes',
    descricao: 'Fluxo operacional entre agentes com handoffs visíveis.',
    categoria: 'esteira_agentes',
    layout: 'esteira_horizontal',
    paletaBase: 'Dark Azul',
    orientacao: 'Priorize leitura linear do fluxo e pontos de decisão.',
    objetivoBase: 'Acompanhar passagem de contexto entre agentes.',
    fluxoBase: 'Entrada → Triagem → Execução → Validação → Entrega',
    blocosSugeridos: ['entrada_ideia', 'card_agente', 'conector', 'gates', 'bloco_final_entrega'],
    efeitosSugeridos: ['linha_viva', 'bolha_handoff', 'pausa_gate'],
  },
  {
    id: 'mapa_termico', nome: 'Mapa Térmico Operacional', descricao: 'Visão de calor por zonas.', categoria: 'mapa_termico', layout: 'mapa_central_paineis', paletaBase: 'Dark Laranja', orientacao: 'Use mapa como núcleo e painéis laterais de contexto.', objetivoBase: 'Detectar concentração de atividade e anomalias.', fluxoBase: 'Coleta → Agregação → Heatmap → Ações', blocosSugeridos: ['mapa_termico', 'indicadores', 'painel_lateral', 'logs'], efeitosSugeridos: ['glow_ativo', 'particulas_sutis'],
  },
  {
    id: 'network_avancado', nome: 'Network Avançado', descricao: 'Rede de entidades e conexões vivas.', categoria: 'network', layout: 'centro_orbitais', paletaBase: 'Dark Ciano', orientacao: 'Conectores e nós devem manter hierarquia de importância.', objetivoBase: 'Visualizar relações e propagação de eventos.', fluxoBase: 'Origem → Nós intermediários → Impacto', blocosSugeridos: ['nucleo_central', 'conector', 'card_agente', 'capsula'], efeitosSugeridos: ['linha_viva', 'giro_orbital', 'zoom_foco'],
  },
  {
    id: 'cockpit_dashboard', nome: 'Cockpit / Dashboard', descricao: 'Painel executivo de monitoramento.', categoria: 'cockpit', layout: 'dashboard_grid', paletaBase: 'Dark Premium', orientacao: 'KPIs no topo, detalhes em blocos secundários.', objetivoBase: 'Apoiar decisão com indicadores e status.', fluxoBase: 'Resumo KPI → Diagnóstico → Ação', blocosSugeridos: ['indicadores', 'painel_lateral', 'logs', 'artefatos'], efeitosSugeridos: ['spotlight', 'card_respirando'],
  },
  {
    id: 'timeline_dinamica', nome: 'Timeline Dinâmica', descricao: 'Evolução temporal de eventos.', categoria: 'timeline', layout: 'fluxo_vertical', paletaBase: 'Dark Roxo', orientacao: 'Destaque eventos críticos e transições.', objetivoBase: 'Entender sequência temporal de operações.', fluxoBase: 'Evento inicial → Marcos → Conclusão', blocosSugeridos: ['timeline', 'capsula', 'logs', 'bloco_final_entrega'], efeitosSugeridos: ['pulso', 'flash_conclusao'],
  },
  {
    id: 'demo_comercial', nome: 'Demo Comercial', descricao: 'Narrativa visual para apresentação.', categoria: 'demo_comercial', layout: 'lateral_direita', paletaBase: 'Dark Cinematográfica', orientacao: 'Foco em storytelling com modo demo.', objetivoBase: 'Convencer stakeholders em demonstração.', fluxoBase: 'Problema → Solução → Resultado', blocosSugeridos: ['nucleo_central', 'card_agente', 'capsula', 'bloco_final_entrega'], efeitosSugeridos: ['demo_mode', 'spotlight', 'zoom_foco'],
  },
  {
    id: 'fluxo_operacional', nome: 'Fluxo Operacional', descricao: 'Pipeline de execução fim a fim.', categoria: 'dashboard', layout: 'lateral_esquerda', paletaBase: 'Dark Verde', orientacao: 'Combine execução central e auditoria lateral.', objetivoBase: 'Orquestrar etapas e checkpoints.', fluxoBase: 'Entrada → Processamento → QA → Entrega', blocosSugeridos: ['entrada_ideia', 'gates', 'logs', 'bloco_final_entrega'], efeitosSugeridos: ['pausa_gate', 'linha_viva'],
  },
  {
    id: 'mapa_geografico', nome: 'Mapa Geográfico / Territorial', descricao: 'Visão territorial com overlays operacionais.', categoria: 'outro', layout: 'mapa_central_paineis', paletaBase: 'Dark Territorial', orientacao: 'Mapa central com clusters e painéis de drilldown.', objetivoBase: 'Acompanhar cobertura e eventos por região.', fluxoBase: 'Região → Cluster → Detalhe', blocosSugeridos: ['mapa_termico', 'painel_lateral', 'indicadores', 'conector'], efeitosSugeridos: ['particulas_sutis', 'glow_ativo'],
  },
];

export const STUDIO_PRESETS: StudioPreset[] = [
  {
    id: 'dark_tech_premium',
    nome: 'Dark tech premium',
    descricao: 'Visual escuro, elegante e técnico.',
    visual: { paleta: 'dark_tech', densidadeVisual: 'media', intensidadeMotion: 'moderada', estiloBorda: 'arredondada', glass: true, tomVisual: 'Premium Técnico' },
    efeitos: ['glow_ativo', 'linha_viva', 'zoom_foco'],
    blocos: ['nucleo_central', 'indicadores', 'conector'],
  },
  {
    id: 'demo_cinematografica',
    nome: 'Demo comercial cinematográfica',
    descricao: 'Ênfase em apresentação e impacto.',
    visual: { paleta: 'cinematic', densidadeVisual: 'alta', intensidadeMotion: 'alta', modoDemo: true, tomVisual: 'Cinematográfico' },
    efeitos: ['demo_mode', 'spotlight', 'flash_conclusao'],
    blocos: ['nucleo_central', 'capsula', 'bloco_final_entrega'],
  },
  {
    id: 'mapa_vivo_operacional',
    nome: 'Mapa vivo operacional',
    descricao: 'Operação territorial com leitura contínua.',
    visual: { paleta: 'operacional', densidadeVisual: 'media', intensidadeMotion: 'suave', grid: 'ativa', tomVisual: 'Operacional' },
    efeitos: ['particulas_sutis', 'linha_viva'],
    blocos: ['mapa_termico', 'painel_lateral', 'logs'],
  },
  {
    id: 'fluxo_handoff',
    nome: 'Fluxo de handoff',
    descricao: 'Entrega entre etapas com checkpoints.',
    visual: { paleta: 'handoff', densidadeVisual: 'media', intensidadeMotion: 'moderada', tomVisual: 'Processual' },
    efeitos: ['bolha_handoff', 'pausa_gate'],
    blocos: ['entrada_ideia', 'card_agente', 'gates', 'bloco_final_entrega'],
  },
  {
    id: 'painel_executivo',
    nome: 'Painel executivo',
    descricao: 'Leitura rápida para decisão.',
    visual: { paleta: 'executivo', densidadeVisual: 'baixa', intensidadeMotion: 'suave', estiloBorda: 'minimal', tomVisual: 'Executivo' },
    efeitos: ['card_respirando', 'spotlight'],
    blocos: ['indicadores', 'painel_lateral', 'artefatos'],
  },
];

