import {
  BlocoTela,
  BlueprintTela,
  ExportacaoTela,
  ProjectVisualConfig,
  ProjetoTela,
  ReferenciaTela,
  TelaAvancada,
} from '../../types/telasAvancadas.types';

type CentralPayload = {
  projetos: ProjetoTela[];
  blueprints: BlueprintTela[];
  visuais: ProjectVisualConfig[];
  referencias: ReferenciaTela[];
  blocos: BlocoTela[];
  exportacoes: ExportacaoTela[];
};

const CENTRAL_KEY = 'sagb_telas_avancadas_central_v1';

const parseDate = (value: string | Date) => new Date(value);

const emptyPayload = (): CentralPayload => ({
  projetos: [],
  blueprints: [],
  visuais: [],
  referencias: [],
  blocos: [],
  exportacoes: [],
});

export const loadCentralData = (): CentralPayload => {
  try {
    const raw = localStorage.getItem(CENTRAL_KEY);
    if (!raw) return emptyPayload();

    const data = JSON.parse(raw);
    return {
      projetos: (data.projetos || []).map((p: ProjetoTela) => ({
        ...p,
        createdAt: parseDate(p.createdAt),
        updatedAt: parseDate(p.updatedAt),
      })),
      blueprints: data.blueprints || [],
      visuais: data.visuais || [],
      referencias: (data.referencias || []).map((r: ReferenciaTela) => ({
        ...r,
        createdAt: parseDate(r.createdAt),
      })),
      blocos: data.blocos || [],
      exportacoes: (data.exportacoes || []).map((e: ExportacaoTela) => ({
        ...e,
        createdAt: parseDate(e.createdAt),
      })),
    };
  } catch {
    return emptyPayload();
  }
};

export const saveCentralData = (payload: CentralPayload) => {
  localStorage.setItem(CENTRAL_KEY, JSON.stringify(payload));
};

export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

export const buildHtmlFromProject = (
  projeto: ProjetoTela,
  blueprint: BlueprintTela | undefined,
  blocos: BlocoTela[]
): string => {
  const blocks = blocos
    .filter((b) => b.visivel)
    .sort((a, b) => a.ordem - b.ordem)
    .map(
      (b) => `<section class="bloco bloco-${b.tipo}"><h3>${b.tipo}</h3><p>${JSON.stringify(b.config)}</p></section>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projeto.nome}</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; background: #0d1117; color: #fff; margin: 0; padding: 24px; }
    .card { background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 16px; margin-bottom: 16px; }
    .bloco { background: #1f2630; border: 1px solid #3a4555; border-radius: 10px; padding: 12px; margin-bottom: 8px; }
    .muted { color: #9aa4b2; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${projeto.nome} <span class="muted">v${projeto.versao}</span></h1>
    <p>${projeto.objetivo}</p>
    <p class="muted">Categoria: ${projeto.categoria} | Público: ${projeto.publico}</p>
  </div>
  <div class="card">
    <h2>Blueprint</h2>
    <p><strong>Narrativa:</strong> ${blueprint?.narrativa || '-'}</p>
    <p><strong>Fluxo Principal:</strong> ${blueprint?.fluxoPrincipal || '-'}</p>
    <p><strong>Zonas:</strong> ${(blueprint?.zonas || []).join(', ') || '-'}</p>
    <p><strong>Efeitos:</strong> ${(blueprint?.efeitos || []).join(', ') || '-'}</p>
  </div>
  <div class="card">
    <h2>Blocos</h2>
    ${blocks || '<p class="muted">Sem blocos visíveis.</p>'}
  </div>
</body>
</html>`;
};

export const toLibraryFromExport = (
  projeto: ProjetoTela,
  exportacao: ExportacaoTela
): TelaAvancada => ({
  id: makeId(),
  type: 'html_code',
  title: projeto.nome,
  htmlContent: exportacao.htmlGerado,
  category: projeto.categoria,
  status: 'publicado',
  source: 'studio_export',
  projectId: projeto.id,
  version: exportacao.versao,
  createdAt: new Date(),
  updatedAt: new Date(),
});
