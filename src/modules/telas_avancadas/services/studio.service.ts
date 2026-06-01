import {
  BlocoTela,
  BlueprintTela,
  ExportacaoTela,
  ProjetoTela,
  ReferenciaTela,
  TelaAvancada,
  TelaCategoria,
} from '../types/telasAvancadas.types';
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

export const addBloco = (projetoId: string, tipo: BlocoTela['tipo']) => {
  const data = loadCentralData();
  const ordem = data.blocos.filter((b) => b.projetoId === projetoId).length + 1;
  const bloco: BlocoTela = { id: makeId(), projetoId, tipo, ordem, visivel: true, config: {} };
  data.blocos.push(bloco);
  saveCentralData(data);
  return bloco;
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
