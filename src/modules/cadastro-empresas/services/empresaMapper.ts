import {
  Empresa,
  EmpresaCadastro,
  EmpresaEsfera,
  EmpresaFonteLegada,
  EmpresaNormalizada,
  EmpresaStatus,
  EmpresaTipo
} from '../types';

const lc = (v: unknown) => String(v ?? '').toLowerCase();
const txt = (v: unknown) => String(v ?? '').trim();

export const includesCI = (hay: unknown, needle: unknown) => lc(hay).includes(lc(needle));

export const asDate = (value: unknown) => {
  if (!value) return new Date(0);
  if (value instanceof Date) return value;
  if (typeof (value as any)?.toDate === 'function') return (value as any).toDate();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? new Date(0) : d;
};

const STATUS_MAP: Record<string, EmpresaStatus> = {
  ideia: 'IDEIA',
  desenvolvimento: 'DESENVOLVIMENTO',
  aprovado: 'APROVADA',
  aprovada: 'APROVADA',
  ativa: 'ATIVA',
  inativa: 'INATIVA'
};

const TIPO_MAP: Record<string, EmpresaTipo> = {
  marca: 'MARCA',
  projeto: 'PROJETO',
  'unidade de negócio': 'UNIDADE_NEGOCIO',
  'unidade de negocio': 'UNIDADE_NEGOCIO',
  'business unit': 'UNIDADE_NEGOCIO',
  venture: 'OUTRO'
};

const ESFERA_MAP: Record<string, EmpresaEsfera> = {
  grupob: 'GRUPOB',
  mercado: 'MERCADO',
  interna: 'INTERNA',
  'não definida': 'NAO_DEFINIDA',
  'nao definida': 'NAO_DEFINIDA'
};

const normalizarStatus = (value: unknown): EmpresaStatus => STATUS_MAP[lc(value)] ?? 'DESENVOLVIMENTO';
const normalizarTipo = (value: unknown): EmpresaTipo => TIPO_MAP[lc(value)] ?? 'OUTRO';
const normalizarEsfera = (value: unknown): EmpresaEsfera => ESFERA_MAP[lc(value)] ?? 'NAO_DEFINIDA';

export const empresaNome = (empresa: Partial<EmpresaFonteLegada>) =>
  txt((empresa as any)?.nome ?? (empresa as any)?.name ?? (empresa as any)?.brandName ?? (empresa as any)?.brand_name ?? (empresa as any)?.brand);

export const empresaLogo = (empresa: Partial<EmpresaFonteLegada>) =>
  txt((empresa as any)?.logoUrl ?? (empresa as any)?.logo_url ?? (empresa as any)?.logo);

export const empresaStatus = (empresa: Partial<EmpresaFonteLegada>) =>
  normalizarStatus((empresa as any)?.status);

export const empresaTipo = (empresa: Partial<EmpresaFonteLegada>) =>
  normalizarTipo((empresa as any)?.tipo ?? (empresa as any)?.type);

export const empresaEsfera = (empresa: Partial<EmpresaFonteLegada>) =>
  normalizarEsfera((empresa as any)?.esfera ?? (empresa as any)?.sphere);

export const empresaSegmento = (empresa: Partial<EmpresaFonteLegada>) =>
  txt((empresa as any)?.segmento ?? (empresa as any)?.segment);

export const empresaNicho = (empresa: Partial<EmpresaFonteLegada>) =>
  txt((empresa as any)?.nicho ?? (empresa as any)?.niche);

export const empresaStatusValidacao = (empresa: Partial<EmpresaFonteLegada>) =>
  txt((empresa as any)?.camposAuxiliares?.statusValidacao ?? (empresa as any)?.statusLab ?? 'Pendente');

export const normalizeEmpresa = (fonte: EmpresaFonteLegada): EmpresaNormalizada => {
  const nome = empresaNome(fonte);
  const logoUrl = empresaLogo(fonte);
  const createdAt = asDate((fonte as any)?.createdAt ?? (fonte as any)?.created_at ?? (fonte as any)?.timestamp);
  const updatedAt = asDate((fonte as any)?.updatedAt ?? (fonte as any)?.updated_at ?? (fonte as any)?.timestamp);
  const timestamp = asDate((fonte as any)?.timestamp ?? (fonte as any)?.createdAt ?? (fonte as any)?.updatedAt);

  const termosLegadosDetectados: string[] = [];
  const camposOrigem: Record<string, string> = {};

  if ((fonte as any)?.name) {
    termosLegadosDetectados.push('venture.name');
    camposOrigem.nome = 'name';
  } else if ((fonte as any)?.nome) {
    camposOrigem.nome = 'nome';
  }

  if ((fonte as any)?.type) {
    termosLegadosDetectados.push(`tipo_legacy:${String((fonte as any)?.type)}`);
    camposOrigem.tipo = 'type';
  } else if ((fonte as any)?.tipo) {
    camposOrigem.tipo = 'tipo';
  }

  if ((fonte as any)?.sphere) {
    termosLegadosDetectados.push('sphere');
    camposOrigem.esfera = 'sphere';
  } else if ((fonte as any)?.esfera) {
    camposOrigem.esfera = 'esfera';
  }

  if (String(logoUrl || '').startsWith('data:image/')) {
    termosLegadosDetectados.push('logo_base64_legacy');
  }

  const empresa: EmpresaCadastro = {
    id: txt((fonte as any)?.id),
    nome,
    nomeCurto: txt((fonte as any)?.nomeCurto ?? (fonte as any)?.shortName) || undefined,
    slug: txt((fonte as any)?.slug) || undefined,
    status: empresaStatus(fonte),
    tipo: empresaTipo(fonte),
    esfera: empresaEsfera(fonte),
    segmento: empresaSegmento(fonte) || undefined,
    nicho: empresaNicho(fonte) || undefined,
    logoUrl,
    descricaoCurta: txt((fonte as any)?.descricaoCurta ?? (fonte as any)?.description) || undefined,
    siteUrl: txt((fonte as any)?.siteUrl ?? (fonte as any)?.url) || undefined,
    createdAt,
    updatedAt,
    timestamp,
    camposAuxiliares: {
      statusValidacao: empresaStatusValidacao(fonte)
    }
  };

  return {
    empresa,
    rastro: {
      termosLegadosDetectados,
      camposOrigem
    }
  };
};

export const normalizeEmpresas = (fontes: EmpresaFonteLegada[]): EmpresaNormalizada[] =>
  (fontes || []).map(normalizeEmpresa);

/**
 * Adapter temporário para persistência em coleção legada `ventures`.
 * Mantém campos oficiais e legados enquanto a migração de banco não ocorre.
 */
export const toLegacyVentureCompat = (empresa: Empresa): Record<string, unknown> => ({
  id: empresa.id,
  nome: empresa.nome,
  name: empresa.nome,
  nomeCurto: empresa.nomeCurto,
  slug: empresa.slug,
  status: empresa.status === 'APROVADA' ? 'APROVADO' : empresa.status,
  tipo: empresa.tipo,
  type:
    empresa.tipo === 'MARCA'
      ? 'Marca'
      : empresa.tipo === 'PROJETO'
        ? 'Projeto'
        : empresa.tipo === 'UNIDADE_NEGOCIO'
          ? 'Business Unit'
          : 'Venture',
  esfera: empresa.esfera,
  sphere: empresa.esfera,
  segmento: empresa.segmento,
  segment: empresa.segmento,
  nicho: empresa.nicho,
  niche: empresa.nicho,
  logoUrl: empresa.logoUrl,
  logo_url: empresa.logoUrl,
  logo: empresa.logoUrl,
  descricaoCurta: empresa.descricaoCurta,
  siteUrl: empresa.siteUrl,
  url: empresa.siteUrl,
  statusLab: (empresa.camposAuxiliares?.statusValidacao as string) || 'Pendente',
  createdAt: empresa.createdAt,
  updatedAt: empresa.updatedAt,
  timestamp: empresa.timestamp,
  camposAuxiliares: empresa.camposAuxiliares
});
