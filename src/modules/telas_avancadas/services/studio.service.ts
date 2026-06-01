import {
  BlocoTela,
  BlueprintTela,
  EfeitoVisualPreset,
  ExportacaoTela,
  ProjectVisualConfig,
  ProjetoTela,
  ReferenciaTela,
  StudioPresetId,
  TelaTemplateId,
  TelaAvancada,
  TelaCategoria,
  VisualDirectionConfig,
} from '../types/telasAvancadas.types';
import { STUDIO_PRESETS, STUDIO_TEMPLATES } from '../data/studioCatalogs';
import {
  buildHtmlFromProject,
  loadCentralData,
  makeId,
  saveCentralData,
  toLibraryFromExport,
} from './repository/central.repository';
import { addTela, updateTela } from './telasAvancadas.service';

export const createProjeto = (input: Omit<ProjetoTela, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'versao'>): ProjetoTela => {
  const data = loadCentralData();
  const now = new Date();
  const projeto: ProjetoTela = {
    ...input,
    id: makeId(),
    status: 'rascunho',
    versao: '1.0.0',
    layout: input.layout || 'dashboard_grid',
    createdAt: now,
    updatedAt: now,
  };
  data.projetos.push(projeto);
  data.blueprints.push({
    projetoId: projeto.id,
    narrativa: '',
    fluxoPrincipal: '',
    zonas: [],
    blocos: [],
    efeitos: [],
    densidade: 'media',
    modoDemo: projeto.modoDemo,
    observacoes: '',
  });
  data.visuais.push({
    projetoId: projeto.id,
    paleta: 'escura',
    densidadeVisual: projeto.intensidadeVisual,
    intensidadeMotion: projeto.intensidadeMotion,
    estiloBorda: 'arredondada',
    grid: 'ativa',
    glass: true,
    modoDemo: projeto.modoDemo,
    tomVisual: projeto.tomVisual,
  });
  saveCentralData(data);
  return projeto;
};

export const getStudioSnapshot = () => loadCentralData();

export const saveBlueprint = (blueprint: BlueprintTela) => {
  const data = loadCentralData();
  const i = data.blueprints.findIndex((b) => b.projetoId === blueprint.projetoId);
  if (i >= 0) data.blueprints[i] = blueprint;
  else data.blueprints.push(blueprint);
  saveCentralData(data);
};

export const saveProjectVisual = (projetoId: string, visual: VisualDirectionConfig, presetId?: StudioPresetId) => {
  const data = loadCentralData();
  const i = data.visuais.findIndex((v) => v.projetoId === projetoId);
  const entity: ProjectVisualConfig = { projetoId, ...visual, presetId };
  if (i >= 0) data.visuais[i] = entity;
  else data.visuais.push(entity);
  const projeto = data.projetos.find((p) => p.id === projetoId);
  if (projeto) {
    projeto.intensidadeVisual = visual.densidadeVisual;
    projeto.intensidadeMotion = visual.intensidadeMotion;
    projeto.tomVisual = visual.tomVisual;
    projeto.modoDemo = visual.modoDemo;
    projeto.updatedAt = new Date();
  }
  saveCentralData(data);
};

export const addBloco = (projetoId: string, tipo: BlocoTela['tipo']) => {
  const data = loadCentralData();
  const ordem = data.blocos.filter((b) => b.projetoId === projetoId).length + 1;
  const bloco: BlocoTela = { id: makeId(), projetoId, tipo, ordem, visivel: true, config: {} };
  data.blocos.push(bloco);
  saveCentralData(data);
  return bloco;
};

export const duplicateBloco = (blocoId: string) => {
  const data = loadCentralData();
  const source = data.blocos.find((b) => b.id === blocoId);
  if (!source) throw new Error('Bloco não encontrado');
  const siblings = data.blocos.filter((b) => b.projetoId === source.projetoId);
  const ordem = siblings.length + 1;
  const clone: BlocoTela = { ...source, id: makeId(), ordem };
  data.blocos.push(clone);
  saveCentralData(data);
  return clone;
};

export const moveBloco = (blocoId: string, direction: 'up' | 'down') => {
  const data = loadCentralData();
  const current = data.blocos.find((b) => b.id === blocoId);
  if (!current) throw new Error('Bloco não encontrado');
  const list = data.blocos
    .filter((b) => b.projetoId === current.projetoId)
    .sort((a, b) => a.ordem - b.ordem);
  const idx = list.findIndex((b) => b.id === blocoId);
  const nextIdx = direction === 'up' ? idx - 1 : idx + 1;
  if (nextIdx < 0 || nextIdx >= list.length) return;
  const a = list[idx];
  const b = list[nextIdx];
  const old = a.ordem;
  a.ordem = b.ordem;
  b.ordem = old;
  saveCentralData(data);
};

export const toggleBlocoVisibility = (blocoId: string) => {
  const data = loadCentralData();
  const block = data.blocos.find((b) => b.id === blocoId);
  if (!block) throw new Error('Bloco não encontrado');
  block.visivel = !block.visivel;
  saveCentralData(data);
  return block;
};

export const updateBlocoMeta = (blocoId: string, input: { grupo?: string; presetId?: string }) => {
  const data = loadCentralData();
  const block = data.blocos.find((b) => b.id === blocoId);
  if (!block) throw new Error('Bloco não encontrado');
  block.grupo = input.grupo ?? block.grupo;
  block.presetId = input.presetId ?? block.presetId;
  saveCentralData(data);
  return block;
};

export const applyTemplateToProjeto = (projetoId: string, templateId: TelaTemplateId) => {
  const template = STUDIO_TEMPLATES.find((t) => t.id === templateId);
  if (!template) throw new Error('Template não encontrado');
  const data = loadCentralData();
  const projeto = data.projetos.find((p) => p.id === projetoId);
  if (!projeto) throw new Error('Projeto não encontrado');

  projeto.templateId = template.id;
  projeto.categoria = template.categoria;
  projeto.layout = template.layout;
  projeto.objetivo = projeto.objetivo || template.objetivoBase;
  projeto.updatedAt = new Date();

  const bpIdx = data.blueprints.findIndex((b) => b.projetoId === projetoId);
  const nextEfeitos = Array.from(new Set(template.efeitosSugeridos));
  const nextBlocos = Array.from(new Set(template.blocosSugeridos));
  if (bpIdx >= 0) {
    data.blueprints[bpIdx] = {
      ...data.blueprints[bpIdx],
      narrativa: data.blueprints[bpIdx].narrativa || template.objetivoBase,
      fluxoPrincipal: data.blueprints[bpIdx].fluxoPrincipal || template.fluxoBase,
      blocos: nextBlocos,
      efeitos: nextEfeitos,
    };
  }

  data.blocos = data.blocos.filter((b) => b.projetoId !== projetoId);
  nextBlocos.forEach((tipo, i) => {
    data.blocos.push({ id: makeId(), projetoId, tipo, config: {}, ordem: i + 1, visivel: true });
  });

  const visualIdx = data.visuais.findIndex((v) => v.projetoId === projetoId);
  const baseVisual: ProjectVisualConfig = {
    projetoId,
    paleta: template.paletaBase,
    densidadeVisual: projeto.intensidadeVisual,
    intensidadeMotion: projeto.intensidadeMotion,
    estiloBorda: 'arredondada',
    grid: 'ativa',
    glass: true,
    modoDemo: projeto.modoDemo,
    tomVisual: projeto.tomVisual,
  };
  if (visualIdx >= 0) data.visuais[visualIdx] = { ...data.visuais[visualIdx], ...baseVisual };
  else data.visuais.push(baseVisual);

  saveCentralData(data);
};

export const applyPresetToProjeto = (projetoId: string, presetId: StudioPresetId) => {
  const preset = STUDIO_PRESETS.find((p) => p.id === presetId);
  if (!preset) throw new Error('Preset não encontrado');
  const data = loadCentralData();
  const projeto = data.projetos.find((p) => p.id === projetoId);
  if (!projeto) throw new Error('Projeto não encontrado');
  projeto.presetId = preset.id;
  projeto.updatedAt = new Date();

  const bpIdx = data.blueprints.findIndex((b) => b.projetoId === projetoId);
  if (bpIdx >= 0) {
    const atual = data.blueprints[bpIdx];
    data.blueprints[bpIdx] = {
      ...atual,
      efeitos: Array.from(new Set([...(atual.efeitos || []), ...preset.efeitos])) as EfeitoVisualPreset[],
      blocos: Array.from(new Set([...(atual.blocos || []), ...preset.blocos])) as BlocoTela['tipo'][],
    };
  }

  const visualIdx = data.visuais.findIndex((v) => v.projetoId === projetoId);
  const currentVisual = visualIdx >= 0 ? data.visuais[visualIdx] : undefined;
  const merged: ProjectVisualConfig = {
    projetoId,
    paleta: currentVisual?.paleta || 'escura',
    densidadeVisual: currentVisual?.densidadeVisual || projeto.intensidadeVisual,
    intensidadeMotion: currentVisual?.intensidadeMotion || projeto.intensidadeMotion,
    estiloBorda: currentVisual?.estiloBorda || 'arredondada',
    grid: currentVisual?.grid || 'ativa',
    glass: currentVisual?.glass ?? true,
    modoDemo: currentVisual?.modoDemo ?? projeto.modoDemo,
    tomVisual: currentVisual?.tomVisual || projeto.tomVisual,
    ...preset.visual,
    presetId,
  };
  if (visualIdx >= 0) data.visuais[visualIdx] = merged;
  else data.visuais.push(merged);

  projeto.intensidadeVisual = merged.densidadeVisual;
  projeto.intensidadeMotion = merged.intensidadeMotion;
  projeto.tomVisual = merged.tomVisual;
  projeto.modoDemo = merged.modoDemo;

  saveCentralData(data);
};

export const addReferencia = (ref: Omit<ReferenciaTela, 'id' | 'createdAt'>) => {
  const data = loadCentralData();
  const entity: ReferenciaTela = { ...ref, id: makeId(), createdAt: new Date() };
  data.referencias.push(entity);
  saveCentralData(data);
  return entity;
};

export const gerarExportacao = (projetoId: string): ExportacaoTela => {
  const data = loadCentralData();
  const projeto = data.projetos.find((p) => p.id === projetoId);
  if (!projeto) throw new Error('Projeto não encontrado');
  const blueprint = data.blueprints.find((b) => b.projetoId === projetoId);
  const blocos = data.blocos.filter((b) => b.projetoId === projetoId);
  const html = buildHtmlFromProject(projeto, blueprint, blocos);
  const exp: ExportacaoTela = {
    id: makeId(),
    projetoId,
    nomeArquivo: `${projeto.slug}.html`,
    htmlGerado: html,
    versao: projeto.versao,
    status: 'gerado',
    createdAt: new Date(),
  };
  data.exportacoes.push(exp);
  saveCentralData(data);
  return exp;
};

export const publicarExportacaoNaBiblioteca = async (exportacaoId: string): Promise<TelaAvancada> => {
  const data = loadCentralData();
  const exportacao = data.exportacoes.find((e) => e.id === exportacaoId);
  if (!exportacao) throw new Error('Exportação não encontrada');
  const projeto = data.projetos.find((p) => p.id === exportacao.projetoId);
  if (!projeto) throw new Error('Projeto não encontrado');

  const tela = toLibraryFromExport(projeto, exportacao);
  const created = await addTela({ type: 'html_code', title: tela.title, htmlContent: exportacao.htmlGerado });
  const published = updateTela(created.id, {
    status: 'publicado',
    category: (projeto.categoria as TelaCategoria) || 'outro',
    source: 'studio_export',
    projectId: projeto.id,
    version: exportacao.versao,
  });

  exportacao.status = 'publicado';
  projeto.status = 'publicado';
  projeto.updatedAt = new Date();
  saveCentralData(data);

  if (!published) throw new Error('Falha ao atualizar item publicado');
  return published;
};
