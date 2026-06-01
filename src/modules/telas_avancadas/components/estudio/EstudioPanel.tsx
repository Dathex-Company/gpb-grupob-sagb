import React, { useMemo, useState } from 'react';
import {
  BlocoMeta,
  BlocoTelaTipo,
  BlockInspectorData,
  BlueprintEditorFields,
  ComposerBlockState,
  ComposerState,
  EfeitoGroup,
  EfeitoGroupId,
  EfeitoMeta,
  EfeitoVisualPreset,
  EstudioProjetoStatus,
  IntensidadeMotion,
  IntensidadeVisual,
  LayoutModelo,
  LayoutZone,
  PapelBloco,
  ProjetoTela,
  StudioPresetId,
  StudioStep,
  StudioStepId,
  TelaTemplateId,
  VisualDirectionConfig,
} from '../../types/telasAvancadas.types';
import { STUDIO_PRESETS, STUDIO_TEMPLATES } from '../../data/studioCatalogs';
import { LAYOUT_OPTIONS } from '../../data/layouts';
import { ComposerCanvas } from '../composer/ComposerCanvas';
import { BlockInspector } from '../composer/BlockInspector';

// ── Constants ──

const STEPS: StudioStep[] = [
  { id: 'informacoes', label: 'Informações', subtitle: 'Nome, slug e categoria', icon: '📋' },
  { id: 'objetivo', label: 'Objetivo', subtitle: 'Propósito e público', icon: '🎯' },
  { id: 'blueprint', label: 'Blueprint', subtitle: 'Estrutura e direção', icon: '📐' },
  { id: 'blocos', label: 'Blocos', subtitle: 'Adicionar e organizar', icon: '🧱' },
  { id: 'composicao', label: 'Composição', subtitle: 'Layout e zonas', icon: '🎨' },
  { id: 'efeitos', label: 'Efeitos', subtitle: 'Motion e feedback', icon: '✨' },
  { id: 'direcao_visual', label: 'Visual', subtitle: 'Paleta, vidro, demo', icon: '🎨' },
  { id: 'preview_exportacao', label: 'Preview', subtitle: 'Revisão e exportar', icon: '🚀' },
];

const ALL_BLOCOS: BlocoMeta[] = [
  { tipo: 'entrada_ideia', nome: 'Entrada de Ideia', descricao: 'Campo de input para ideação colaborativa', ajuda: 'Use para capturar contribuições rápidas dos operadores', icone: '💡', categoria: 'entrada' },
  { tipo: 'card_agente', nome: 'Card de Agente', descricao: 'Exibe informações resumidas de um agente', ajuda: 'Ideal para dashboards de monitoramento', icone: '🤖', categoria: 'exibicao' },
  { tipo: 'conector', nome: 'Conector', descricao: 'Liga visualmente dois blocos ou zonas', ajuda: 'Use para mostrar fluxo entre componentes', icone: '🔗', categoria: 'conexao' },
  { tipo: 'painel_lateral', nome: 'Painel Lateral', descricao: 'Painel auxiliar com informações contextuais', ajuda: 'Ótimo para detalhes sem ocupar centro', icone: '📦', categoria: 'processamento' },
  { tipo: 'logs', nome: 'Logs', descricao: 'Exibe logs em tempo real ou históricos', ajuda: 'Use para depuração ou auditoria', icone: '📝', categoria: 'exibicao' },
  { tipo: 'artefatos', nome: 'Artefatos', descricao: 'Biblioteca de artefatos gerados pelo sistema', ajuda: 'Exibe outputs de processamento', icone: '📎', categoria: 'exibicao' },
  { tipo: 'gates', nome: 'Gates', descricao: 'Pontos de decisão ou aprovação', ajuda: 'Use para fluxos com validação humana', icone: '🚧', categoria: 'processamento' },
  { tipo: 'nucleo_central', nome: 'Núcleo Central', descricao: 'Elemento principal da tela', ajuda: 'O coração visual da interface', icone: '⚡', categoria: 'processamento' },
  { tipo: 'mapa_termico', nome: 'Mapa Térmico', descricao: 'Visualização de calor por área/dado', ajuda: 'Ideal para densidade de atividade', icone: '🔥', categoria: 'exibicao' },
  { tipo: 'timeline', nome: 'Timeline', descricao: 'Linha do tempo com eventos', ajuda: 'Mostre progressão cronológica', icone: '⏱️', categoria: 'exibicao' },
  { tipo: 'indicadores', nome: 'Indicadores', descricao: 'KPI cards com métricas', ajuda: 'Resumo numérico de performance', icone: '📊', categoria: 'exibicao' },
  { tipo: 'capsula', nome: 'Cápsula', descricao: 'Bloco compacto de informação', ajuda: 'Use para dados auxiliares agrupados', icone: '💊', categoria: 'exibicao' },
  { tipo: 'bloco_final_entrega', nome: 'Entrega Final', descricao: 'Bloco de conclusão do fluxo', ajuda: 'Indica finalização ou resultado', icone: '🏁', categoria: 'entrega' },
];

const EFEITO_GROUPS: EfeitoGroup[] = [
  { id: 'energia', label: '⚡ Energia', descricao: 'Efeitos que transmitem vitalidade e movimento ativo' },
  { id: 'conectores', label: '🔗 Conectores', descricao: 'Efeitos que ligam elementos visualmente' },
  { id: 'foco', label: '🎯 Foco', descricao: 'Efeitos que direcionam atenção do usuário' },
  { id: 'feedback', label: '💬 Feedback', descricao: 'Efeitos que respondem a interações' },
  { id: 'conclusao', label: '✅ Conclusão', descricao: 'Efeitos que marcam finalização' },
  { id: 'demo', label: '🎬 Demo', descricao: 'Efeitos para modo de apresentação' },
];

const ALL_EFEITOS: EfeitoMeta[] = [
  { preset: 'pulso', nome: 'Pulso', descricao: 'Ondulação rítmica no elemento alvo', uso: 'Destacar atualizações ao vivo', intensidade: 'media', group: 'energia' },
  { preset: 'linha_viva', nome: 'Linha Viva', descricao: 'Linha que pulsa como fluxo ativo', uso: 'Conexões entre blocos', intensidade: 'suave', group: 'conectores' },
  { preset: 'glow_ativo', nome: 'Glow Ativo', descricao: 'Brilho pulsátil ao redor do elemento', uso: 'Núcleo central ou elemento principal', intensidade: 'media', group: 'energia' },
  { preset: 'card_respirando', nome: 'Card Respirando', descricao: 'Card com escala suave e cíclica', uso: 'Cards que precisam de presença viva', intensidade: 'suave', group: 'feedback' },
  { preset: 'bolha_handoff', nome: 'Bolha Handoff', descricao: 'Efeito de transferência entre blocos', uso: 'Passagem de contexto entre áreas', intensidade: 'media', group: 'conectores' },
  { preset: 'spotlight', nome: 'Spotlight', descricao: 'Iluminação focal em um elemento', uso: 'Destacar elemento em foco', intensidade: 'forte', group: 'foco' },
  { preset: 'pausa_gate', nome: 'Pausa Gate', descricao: 'Sinal de espera em pontos de decisão', uso: 'Gates que aguardam aprovação', intensidade: 'media', group: 'feedback' },
  { preset: 'flash_conclusao', nome: 'Flash Conclusão', descricao: 'Brilho rápido de finalização', uso: 'Etapa concluída com sucesso', intensidade: 'forte', group: 'conclusao' },
  { preset: 'particulas_sutis', nome: 'Partículas Sutis', descricao: 'Partículas flutuando no fundo', uso: 'Ambiente vivo sem distração', intensidade: 'suave', group: 'energia' },
  { preset: 'giro_orbital', nome: 'Giro Orbital', descricao: 'Elemento orbitando ao redor do centro', uso: 'Indicar processamento ou ciclo', intensidade: 'media', group: 'energia' },
  { preset: 'zoom_foco', nome: 'Zoom Foco', descricao: 'Zoom suave ao selecionar um elemento', uso: 'Transição entre visão geral e detalhe', intensidade: 'suave', group: 'foco' },
  { preset: 'demo_mode', nome: 'Demo Mode', descricao: 'Auto-navegação entre áreas da tela', uso: 'Apresentações e demonstrações', intensidade: 'forte', group: 'demo' },
];

// ── Props ──

interface EstudioPanelProps {
  projetos: ProjetoTela[];
  selectedProjectId: string | null;
  studioStep: StudioStepId;
  studioBlueprint: BlueprintEditorFields;
  studioVisual: VisualDirectionConfig;
  onSelectProject: (id: string) => void;
  onCreateProject: (input: Omit<ProjetoTela, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'versao'>) => Promise<void>;
  onApplyTemplate: (projectId: string, templateId: TelaTemplateId) => Promise<void>;
  onApplyPreset: (projectId: string, presetId: StudioPresetId) => Promise<void>;
  onAddBloco: (projectId: string, tipo: BlocoTelaTipo) => Promise<void>;
  onDuplicateBloco: (blocoId: string) => Promise<void>;
  onMoveBloco: (blocoId: string, direction: 'up' | 'down') => Promise<void>;
  onToggleBloco: (blocoId: string) => Promise<void>;
  onUpdateBlocoMeta: (blocoId: string, input: { grupo?: string; presetId?: string }) => Promise<void>;
  onRemoveBloco: (blocoId: string) => Promise<void>;
  onOpenSuperTela: () => void;
  onSetStudioStep: (step: StudioStepId) => void;
  onSetStudioBlueprint: (fields: BlueprintEditorFields) => void;
  onSetStudioVisual: (config: Partial<VisualDirectionConfig>) => void;
  blocosDoProjeto: { id: string; tipo: BlocoTelaTipo; visivel?: boolean; grupo?: string; presetId?: string }[];

  // Composer
  composer: ComposerState | null;
  selectedBlockId: string | null;
  composerViewMode: 'estrutural' | 'demo';
  onLoadComposer: (projetoId: string) => void;
  onChangeLayout: (projetoId: string, layout: LayoutModelo) => void;
  onAssignBlocoToZona: (projetoId: string, blocoId: string, zonaId: string) => void;
  onRemoveBlocoFromComposer: (projetoId: string, blocoId: string) => void;
  onReorderBlocoInZona: (projetoId: string, blocoId: string, newOrdem: number) => void;
  onSetBlocoPapelVisual: (projetoId: string, blocoId: string, papel: PapelBloco) => void;
  onSelectBlockForInspector: (blocoId: string | null) => void;
  onSetComposerViewMode: (mode: 'estrutural' | 'demo') => void;
  onGetInspectorData: (blocoId: string) => BlockInspectorData | null;
}

// ── Component ──

export const EstudioPanel: React.FC<EstudioPanelProps> = ({
  projetos, selectedProjectId, studioStep, studioBlueprint, studioVisual,
  onSelectProject, onCreateProject, onAddBloco, onRemoveBloco, onOpenSuperTela,
  onApplyTemplate, onApplyPreset, onDuplicateBloco, onMoveBloco, onToggleBloco, onUpdateBlocoMeta,
  onSetStudioStep, onSetStudioBlueprint, onSetStudioVisual, blocosDoProjeto,
  composer, selectedBlockId, composerViewMode,
  onLoadComposer, onChangeLayout, onAssignBlocoToZona, onRemoveBlocoFromComposer,
  onReorderBlocoInZona, onSetBlocoPapelVisual, onSelectBlockForInspector, onSetComposerViewMode,
  onGetInspectorData,
}) => {
  // Form state for new project
  const [nome, setNome] = useState('');
  const [slug, setSlug] = useState('');
  const [categoria, setCategoria] = useState<ProjetoTela['categoria']>('dashboard');
  const [objetivo, setObjetivo] = useState('');
  const [publico, setPublico] = useState('Interno');
  const [contexto, setContexto] = useState('Operação');
  const [tomVisual, setTomVisual] = useState('Sério');

  const selected = useMemo(() => projetos.find((p) => p.id === selectedProjectId) || null, [projetos, selectedProjectId]);

  const handleCreateProject = () => {
    onCreateProject({ nome, slug, categoria, objetivo, publico, contexto, tomVisual, intensidadeVisual: 'media', intensidadeMotion: 'moderada', modoDemo: false, layout: 'dashboard_grid' });
    setNome(''); setSlug('');
  };

  if (projetos.length === 0) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Estúdio</h2>
          <button onClick={onOpenSuperTela} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-bold">Abrir Super Tela</button>
        </div>
        <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center space-y-4">
          <p className="text-4xl">🎨</p>
          <h3 className="text-lg font-bold text-white">Crie seu primeiro projeto</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">Defina o nome, slug e categoria para começar a estruturar sua tela avançada.</p>
          <div className="max-w-sm mx-auto space-y-3">
            <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do projeto" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
            <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug-do-projeto" className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
            <select value={categoria} onChange={(e) => setCategoria(e.target.value as ProjetoTela['categoria'])} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white">
              <option value="dashboard">Dashboard</option><option value="cockpit">Cockpit</option><option value="timeline">Timeline</option>
              <option value="network">Network</option><option value="mapa_termico">Mapa Térmico</option><option value="esteira_agentes">Esteira de Agentes</option>
              <option value="demo_comercial">Demo Comercial</option><option value="laboratorio">Laboratório</option><option value="outro">Outro</option>
            </select>
            <button onClick={handleCreateProject} className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold">Criar projeto</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Estúdio</h2>
        <button onClick={onOpenSuperTela} className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-sm font-bold">Abrir Super Tela</button>
      </div>

      {/* Project selector */}
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl border border-white/10 bg-black/20">
        {projetos.map((p) => (
          <button key={p.id} onClick={() => { onSelectProject(p.id); onSetStudioStep('informacoes'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedProjectId === p.id ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
          >
            {p.nome} <span className="opacity-60">({p.status})</span>
          </button>
        ))}
      </div>

      {selected && (
        <>
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl border border-white/10 bg-white/5">
            {STEPS.map((step) => {
              const active = step.id === studioStep;
              return (
                <button key={step.id} onClick={() => onSetStudioStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[320px]">
            {studioStep === 'informacoes' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">📋 Informações do Projeto</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <select className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs"
                    defaultValue={selected.templateId || ''}
                    onChange={(e) => e.target.value && onApplyTemplate(selected.id, e.target.value as TelaTemplateId)}>
                    <option value="">Aplicar template...</option>
                    {STUDIO_TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                  </select>
                  <select className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-xs"
                    defaultValue={selected.presetId || ''}
                    onChange={(e) => e.target.value && onApplyPreset(selected.id, e.target.value as StudioPresetId)}>
                    <option value="">Aplicar preset...</option>
                    {STUDIO_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Nome</label>
                    <input value={selected.nome} readOnly className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white/70" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Slug</label>
                    <input value={selected.slug} readOnly className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white/70" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Categoria</label>
                    <input value={selected.categoria} readOnly className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white/70" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Status</label>
                    <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                      selected.status === 'rascunho' ? 'bg-yellow-500/20 text-yellow-300' :
                      selected.status === 'em_construcao' ? 'bg-blue-500/20 text-blue-300' :
                      selected.status === 'em_teste' ? 'bg-purple-500/20 text-purple-300' :
                      selected.status === 'publicado' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>{selected.status}</span>
                  </div>
                </div>
                {/* Layout selector */}
                <div>
                  <label className="text-xs text-gray-400 block mb-1">🗺️ Layout da Tela</label>
                  <div className="flex flex-wrap gap-2">
                    {LAYOUT_OPTIONS.map((opt) => {
                      const isActive = (composer?.layoutAtual ?? selected.layout) === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            onChangeLayout(selected.id, opt.value);
                            onLoadComposer(selected.id);
                          }}
                          className={`px-3 py-2 rounded-lg text-[10px] font-semibold text-left transition-all ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'bg-black/30 text-gray-300 border border-white/10 hover:bg-white/10'
                          }`}
                          title={opt.descricao}
                        >
                          <span className="block">{opt.label}</span>
                          <span className="block text-[8px] opacity-60 mt-0.5">{opt.descricao.slice(0, 40)}...</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p className="text-xs text-gray-500">Versão: {selected.versao} • Criado: {selected.createdAt.toLocaleDateString()}</p>
              </div>
            )}

            {studioStep === 'objetivo' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">🎯 Objetivo e Uso</h3>
                <p className="text-xs text-gray-400">Defina o propósito da tela: para quem é, em que contexto será usada e qual tom visual deve transmitir.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Objetivo da tela</label>
                    <textarea value={selected.objetivo} rows={3} placeholder="O que essa tela precisa realizar?"
                      onChange={() => {}} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Público-alvo</label>
                      <input value={selected.publico} placeholder="Ex: Operadores, Gestores, Clientes"
                        onChange={() => {}} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Contexto de uso</label>
                      <input value={selected.contexto} placeholder="Ex: Monitoramento 24h, Análise semanal"
                        onChange={() => {}} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Tom visual</label>
                      <input value={selected.tomVisual} placeholder="Ex: Sério, Técnico, Criativo"
                        onChange={() => {}} className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {studioStep === 'blueprint' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">📐 Blueprint da Tela</h3>
                <p className="text-xs text-gray-400">Descreva a estrutura conceitual da tela: o que comunica, como flui, quais áreas e elementos vivos.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <BlueprintField label="O que a tela precisa comunicar" value={studioBlueprint.comunicacao} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, comunicacao: v })} placeholder="Ex: Status da operação em tempo real" />
                  <BlueprintField label="Qual é o fluxo principal" value={studioBlueprint.fluxoPrincipal} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, fluxoPrincipal: v })} placeholder="Ex: Entrada → Processamento → Exibição" />
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Quais áreas precisam existir</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {['Cabeçalho', 'Centro', 'Painel', 'Rodapé', 'Sidebar', 'Modal'].map((area) => {
                        const active = studioBlueprint.areas.includes(area);
                        return (
                          <button key={area} onClick={() => onSetStudioBlueprint({
                            ...studioBlueprint,
                            areas: active ? studioBlueprint.areas.filter((a) => a !== area) : [...studioBlueprint.areas, area],
                          })}
                            className={`px-2 py-1 rounded-md text-[10px] font-semibold ${active ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300 border border-white/10'}`}
                          >{area}</button>
                        );
                      })}
                    </div>
                  </div>
                  <BlueprintField label="Elementos que precisam parecer vivos" value={studioBlueprint.elementosVivos} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, elementosVivos: v })} placeholder="Ex: Cards de agente, timeline" />
                  <BlueprintField label="Onde o motion ajuda" value={studioBlueprint.motionAjuda} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, motionAjuda: v })} placeholder="Ex: Transições entre estados" />
                  <BlueprintField label="Efeitos desejados" value={studioBlueprint.efeitosDesejados} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, efeitosDesejados: v })} placeholder="Ex: Feedback visual de ações" />
                  <BlueprintField label="O que deve ser evitado" value={studioBlueprint.evitar} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, evitar: v })} placeholder="Ex: Poluição visual, excesso de cor" />
                  <BlueprintField label="Observações de direção visual" value={studioBlueprint.observacoes} onChange={(v) => onSetStudioBlueprint({ ...studioBlueprint, observacoes: v })} placeholder="Ex: Inspiração em dark mode" />
                </div>
              </div>
            )}

            {studioStep === 'blocos' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">🧱 Blocos da Tela</h3>
                <p className="text-xs text-gray-400">Adicione blocos para compor a estrutura da tela. Cada bloco tem uma função específica.</p>

                {/* Selected blocks */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {blocosDoProjeto.length === 0 && <span className="text-xs text-gray-500">Nenhum bloco adicionado ainda.</span>}
                  {blocosDoProjeto.map((b) => {
                    const meta = ALL_BLOCOS.find((m) => m.tipo === b.tipo);
                    return (
                      <span key={b.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
                        {meta?.icone} {meta?.nome || b.tipo}
                        <button onClick={() => onMoveBloco(b.id, 'up')} className="text-gray-300">↑</button>
                        <button onClick={() => onMoveBloco(b.id, 'down')} className="text-gray-300">↓</button>
                        <button onClick={() => onDuplicateBloco(b.id)} className="text-emerald-300">⎘</button>
                        <button onClick={() => onToggleBloco(b.id)} className="text-yellow-300">{b.visivel === false ? '👁️‍🗨️' : '👁️'}</button>
                        <select className="bg-black/40 border border-white/10 rounded px-1 py-0.5 text-[10px]"
                          value={b.grupo || ''}
                          onChange={(e) => onUpdateBlocoMeta(b.id, { grupo: e.target.value || undefined })}>
                          <option value="">grupo</option>
                          <option value="header">header</option><option value="core">core</option><option value="side">side</option><option value="footer">footer</option>
                        </select>
                        <button onClick={() => onRemoveBloco(b.id)} className="ml-1 text-red-400 hover:text-red-300">✕</button>
                      </span>
                    );
                  })}
                </div>

                {/* Block library */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {ALL_BLOCOS.map((meta) => {
                    const added = blocosDoProjeto.some((b) => b.tipo === meta.tipo);
                    return (
                      <button key={meta.tipo} onClick={() => onAddBloco(selected.id, meta.tipo)}
                        disabled={added}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          added
                            ? 'border-emerald-500/30 bg-emerald-500/10 opacity-60'
                            : 'border-white/10 bg-black/20 hover:border-blue-500/30 hover:bg-blue-500/10'
                        }`}
                      >
                        <p className="text-lg">{meta.icone}</p>
                        <p className="text-xs font-semibold text-white mt-1">{meta.nome}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{meta.descricao}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {studioStep === 'composicao' && selected && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">🎨 Composição Visual</h3>
                    <p className="text-xs text-gray-400">Distribua os blocos nas zonas do layout e defina papéis visuais.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-500">Modo:</span>
                    <button
                      onClick={() => onSetComposerViewMode('estrutural')}
                      className={`px-2 py-1 rounded text-[10px] font-semibold ${
                        composerViewMode === 'estrutural' ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-400'
                      }`}
                    >
                      🔲 Estrutural
                    </button>
                    <button
                      onClick={() => onSetComposerViewMode('demo')}
                      className={`px-2 py-1 rounded text-[10px] font-semibold ${
                        composerViewMode === 'demo' ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-400'
                      }`}
                    >
                      🎬 Demo
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Coluna principal: Canvas */}
                  <div className="lg:col-span-2">
                    {composer && (
                      <ComposerCanvas
                        layout={composer.layoutAtual}
                        zonasComBlocos={composer.zonas.map((zona) => ({
                          zona,
                          blocos: composer.blocos
                            .filter((b) => b.zonaId === zona.id)
                            .sort((a, bb) => a.ordemZona - bb.ordemZona)
                            .map((cs) => {
                              const bloco = blocosDoProjeto.find((bp) => bp.id === cs.blocoId);
                              return {
                                blocoId: cs.blocoId,
                                tipo: bloco?.tipo || 'unknown',
                                ordemZona: cs.ordemZona,
                                visivel: bloco?.visivel ?? true,
                                papelVisual: cs.papelVisual,
                              };
                            }),
                        }))}
                        blocosDisponiveis={blocosDoProjeto
                          .filter((bp) => !composer.blocos.some((c) => c.blocoId === bp.id))
                          .map((bp) => ({ id: bp.id, projetoId: selected.id, tipo: bp.tipo as any, config: {}, ordem: 0, visivel: true }))}
                        viewMode={composerViewMode}
                        selectedBlockId={selectedBlockId}
                        onSelectBlock={onSelectBlockForInspector}
                        onAssignBlock={(blocoId, zonaId) => onAssignBlocoToZona(selected.id, blocoId, zonaId)}
                        onRemoveBlock={(blocoId) => onRemoveBlocoFromComposer(selected.id, blocoId)}
                      />
                    )}
                  </div>

                  {/* Coluna lateral: BlockInspector */}
                  <div className="space-y-3">
                    {selectedBlockId && onGetInspectorData(selectedBlockId) ? (
                      <BlockInspector
                        data={onGetInspectorData(selectedBlockId)!}
                        zonasDisponiveis={composer?.zonas || []}
                        onAssignZona={(blocoId, zonaId) => onAssignBlocoToZona(selected.id, blocoId, zonaId)}
                        onReorder={(blocoId, newOrdem) => onReorderBlocoInZona(selected.id, blocoId, newOrdem)}
                        onSetPapelVisual={(blocoId, papel) => onSetBlocoPapelVisual(selected.id, blocoId, papel)}
                        onToggleVisibility={(blocoId) => onToggleBloco(blocoId)}
                        onRemove={(blocoId) => onRemoveBloco(blocoId)}
                        onClose={() => onSelectBlockForInspector(null)}
                      />
                    ) : (
                      <div className="p-4 rounded-xl border border-dashed border-white/5 bg-black/10 text-center">
                        <p className="text-[11px] text-gray-500">
                          {blocosDoProjeto.length === 0
                            ? 'Adicione blocos primeiro na etapa "Blocos"'
                            : 'Clique em um bloco no canvas para inspecionar'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {studioStep === 'efeitos' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">✨ Efeitos Visuais</h3>
                <p className="text-xs text-gray-400">Selecione efeitos para dar movimento e feedback à tela. Eles estão agrupados por função.</p>
                {EFEITO_GROUPS.map((group) => {
                  const efeitos = ALL_EFEITOS.filter((e) => e.group === group.id);
                  return (
                    <div key={group.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{group.label}</span>
                        <span className="text-[10px] text-gray-500">{group.descricao}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {efeitos.map((efeito) => {
                          const active = studioBlueprint.efeitosDesejados.includes(efeito.preset);
                          return (
                            <button key={efeito.preset} onClick={() => {
                              const current = studioBlueprint.efeitosDesejados.split(',').map((s) => s.trim()).filter(Boolean);
                              const next = active ? current.filter((e) => e !== efeito.preset) : [...current, efeito.preset];
                              onSetStudioBlueprint({ ...studioBlueprint, efeitosDesejados: next.join(', ') });
                            }}
                              className={`px-3 py-2 rounded-xl text-xs border transition-all ${
                                active
                                  ? 'bg-purple-600/20 border-purple-500/40 text-purple-200'
                                  : 'bg-black/20 border-white/10 text-gray-300 hover:border-purple-500/20'
                              }`}
                            >
                              <p className="font-semibold">{efeito.nome}</p>
                              <p className="text-[10px] opacity-60">{efeito.descricao}</p>
                              <p className="text-[10px] opacity-40 mt-0.5">Intensidade: {efeito.intensidade}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {studioStep === 'direcao_visual' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">🎨 Direção Visual</h3>
                <p className="text-xs text-gray-400">Configure a identidade visual da tela: densidade, motion, borda, vidro e modo demo.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <VisualSelect label="Densidade Visual" value={studioVisual.densidadeVisual}
                    options={['baixa', 'media', 'alta'] as IntensidadeVisual[]}
                    onChange={(v) => onSetStudioVisual({ densidadeVisual: v })} />
                  <VisualSelect label="Intensidade de Motion" value={studioVisual.intensidadeMotion}
                    options={['suave', 'moderada', 'alta'] as IntensidadeMotion[]}
                    onChange={(v) => onSetStudioVisual({ intensidadeMotion: v })} />
                  <VisualSelect label="Estilo de Borda" value={studioVisual.estiloBorda}
                    options={['arredondada', 'reto', 'minimal'] as const}
                    onChange={(v) => onSetStudioVisual({ estiloBorda: v })} />
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Grid</label>
                    <div className="flex gap-2">
                      {(['ativa', 'oculta'] as const).map((g) => (
                        <button key={g} onClick={() => onSetStudioVisual({ grid: g })}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${studioVisual.grid === g ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300 border border-white/10'}`}
                        >{g === 'ativa' ? '📐 Ativa' : '🙈 Oculta'}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Efeito Glass (Vidro)</label>
                    <div className="flex gap-2">
                      {([true, false] as const).map((g) => (
                        <button key={String(g)} onClick={() => onSetStudioVisual({ glass: g })}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${studioVisual.glass === g ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300 border border-white/10'}`}
                        >{g ? '✅ Com vidro' : '❌ Sem vidro'}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Modo Demo</label>
                    <div className="flex gap-2">
                      {([true, false] as const).map((d) => (
                        <button key={String(d)} onClick={() => onSetStudioVisual({ modoDemo: d })}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${studioVisual.modoDemo === d ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300 border border-white/10'}`}
                        >{d ? '▶️ Ativo' : '⏸️ Inativo'}</button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-xs text-gray-400 block mb-1">Tom Visual</label>
                    <input value={studioVisual.tomVisual} onChange={(e) => onSetStudioVisual({ tomVisual: e.target.value })}
                      placeholder="Ex: Profissional, Técnico, Criativo, Futurista"
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white" />
                  </div>
                </div>
              </div>
            )}

            {studioStep === 'preview_exportacao' && (
              <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                <h3 className="text-sm font-bold text-white">🚀 Preview e Exportação</h3>
                <p className="text-xs text-gray-400">Revise o resumo do projeto antes de exportar.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-blue-300 uppercase">Projeto</h4>
                    <p className="text-sm text-white">{selected.nome} <span className="text-gray-400">v{selected.versao}</span></p>
                    <p className="text-xs text-gray-400">{selected.categoria} • {selected.publico} • {selected.contexto}</p>
                    <p className="text-xs text-gray-500">{selected.objetivo}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-purple-300 uppercase">Blueprint</h4>
                    <p className="text-xs text-gray-300"><span className="text-gray-500">Comunicação:</span> {studioBlueprint.comunicacao || '—'}</p>
                    <p className="text-xs text-gray-300"><span className="text-gray-500">Fluxo:</span> {studioBlueprint.fluxoPrincipal || '—'}</p>
                    <p className="text-xs text-gray-300"><span className="text-gray-500">Áreas:</span> {studioBlueprint.areas.join(', ') || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-cyan-300 uppercase">Blocos ({blocosDoProjeto.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {blocosDoProjeto.map((b) => {
                        const meta = ALL_BLOCOS.find((m) => m.tipo === b.tipo);
                        return <span key={b.id} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">{meta?.icone} {meta?.nome || b.tipo}</span>;
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-300 uppercase">Visual</h4>
                    <p className="text-xs text-gray-300">Densidade: {studioVisual.densidadeVisual} • Motion: {studioVisual.intensidadeMotion}</p>
                    <p className="text-xs text-gray-300">Borda: {studioVisual.estiloBorda} • Glass: {studioVisual.glass ? 'Sim' : 'Não'} • Demo: {studioVisual.modoDemo ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ── Sub-components ──

const BlueprintField: React.FC<{ label: string; value: string; onChange: (v: string) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="text-xs text-gray-400 block mb-1">{label}</label>
    <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm resize-none" />
  </div>
);

const VisualSelect = <T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[]; onChange: (v: T) => void }) => (
  <div>
    <label className="text-xs text-gray-400 block mb-1">{label}</label>
    <div className="flex gap-2">
      {options.map((opt) => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`px-3 py-2 rounded-lg text-xs font-bold ${value === opt ? 'bg-blue-600 text-white' : 'bg-black/30 text-gray-300 border border-white/10'}`}
        >{opt}</button>
      ))}
    </div>
  </div>
);
