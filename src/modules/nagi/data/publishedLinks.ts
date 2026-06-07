export type PublishedAppLinkStatus = 'published' | 'review' | 'legacy';

export interface PublishedAppLink {
  id: string;
  company: string;
  siteName: string;
  title: string;
  url: string;
  netlifyRepo?: string;
  githubRepo?: string;
  status: PublishedAppLinkStatus;
  source: 'netlify-audit' | 'netlify-sync';
  publishedAt?: string;
  notes?: string;
  tags?: string[];
}

export const PUBLISHED_APP_LINKS: PublishedAppLink[] = [
  { id: 'sagbapp', company: 'GrupoB', siteName: 'sagbapp', title: 'SagB', url: 'https://sagb.grupob.com.br', netlifyRepo: 'Dathex-Company/gpb-grupob-sagb', status: 'review', source: 'netlify-audit', publishedAt: '2026-06-07T01:41:00Z', notes: 'Netlify aponta repo não listado no GitHub exportado.' },

  { id: '3forb', company: '3forB', siteName: '3forb', title: 'Site 3forB', url: 'https://3forb.com.br', netlifyRepo: 'GtegasB/3forb_Site', githubRepo: 'GtegasB/3forb_site', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-04T22:37:00Z' },
  { id: 'eda-360', company: '3forB', siteName: 'eda-360', title: 'EDA 360', url: 'https://eda.3forb.com.br', netlifyRepo: 'GtegasB/eda_360', githubRepo: 'GtegasB/eda_360', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-26T13:27:00Z', tags: ['duplicidade'] },
  { id: 'eda360', company: '3forB', siteName: 'eda360', title: 'EDA 360 Netlify', url: 'https://eda360.netlify.app', netlifyRepo: 'GtegasB/eda_360', githubRepo: 'GtegasB/eda_360', status: 'review', source: 'netlify-audit', publishedAt: '2026-05-12T19:38:00Z', notes: 'Possível duplicidade com eda.3forb.com.br.', tags: ['duplicidade'] },
  { id: 'qg-3forb-novo', company: '3forB', siteName: 'qg-3forb-novo', title: 'QG 3forB', url: 'https://qg.3forb.com.br', netlifyRepo: 'GtegasB/qg_3forb', githubRepo: 'GtegasB/qg_3forb', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-03T02:16:00Z', tags: ['duplicidade'] },
  { id: 'qg-3forb', company: '3forB', siteName: 'qg-3forb', title: 'QG 3forB Netlify', url: 'http://qg-3forb.netlify.app', netlifyRepo: 'GtegasB/qg_3forb', githubRepo: 'GtegasB/qg_3forb', status: 'review', source: 'netlify-audit', publishedAt: '2026-05-16T04:32:00Z', notes: 'Possível duplicidade com qg.3forb.com.br.', tags: ['duplicidade'] },
  { id: 'site-3forb-testes', company: '3forB', siteName: 'site-3forb-testes', title: 'Site 3forB Testes', url: 'http://site-3forb-testes.netlify.app', netlifyRepo: 'GtegasB/3forb_site', githubRepo: 'GtegasB/3forb_site', status: 'review', source: 'netlify-audit', publishedAt: '2026-06-03T21:08:00Z', tags: ['testes'] },

  { id: 'capscan-loze', company: 'Loze', siteName: 'capscan-loze', title: 'Capscan Loze', url: 'https://capscan.loze.com.br', netlifyRepo: 'GtegasB/capscan-loze', githubRepo: 'GtegasB/capscan-loze', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-07T02:10:00Z' },
  { id: 'crm-loze', company: 'Loze', siteName: 'crm-loze', title: 'CRM Loze', url: 'https://crm.loze.com.br', status: 'review', source: 'netlify-audit', publishedAt: '2026-06-04T02:46:00Z', notes: 'Sem GitHub identificado na auditoria.' },
  { id: 'dna-loze', company: 'Loze', siteName: 'dna-loze', title: 'DNA Loze', url: 'https://dna.loze.com.br', netlifyRepo: 'GtegasB/dna_loze', githubRepo: 'GtegasB/dna_loze', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-04T03:37:00Z' },
  { id: 'loze-logitrace', company: 'Loze', siteName: 'loze-logitrace', title: 'Loze Logitrace', url: 'http://loze-logitrace.netlify.app', netlifyRepo: 'GtegasB/loze_logitrace', githubRepo: 'GtegasB/loze_logitrace', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-28T17:48:00Z' },
  { id: 'loze-nexo-web', company: 'Loze', siteName: 'loze-nexo-web', title: 'NEXO Loze', url: 'https://nexo.loze.com.br', netlifyRepo: 'GtegasB/loze_nexo_web', githubRepo: 'GtegasB/loze_nexo_web', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-05T18:21:00Z' },
  { id: 'loze-taskzei-web', company: 'Loze', siteName: 'loze-taskzei-web', title: 'Taskzei Loze', url: 'https://taskzei.loze.com.br', netlifyRepo: 'GtegasB/loze-taskzei-web', githubRepo: 'GtegasB/loze-taskzei-web', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-04T03:28:00Z', tags: ['duplicidade'] },
  { id: 'taskzei-loze-web', company: 'Loze', siteName: 'taskzei-loze-web', title: 'Taskzei Loze Netlify', url: 'http://taskzei-loze-web.netlify.app', githubRepo: 'GtegasB/Taskzei', status: 'review', source: 'netlify-audit', publishedAt: '2026-06-04T03:28:00Z', notes: 'Deploy sem Git explícito; match apenas por nome parecido.', tags: ['duplicidade'] },
  { id: 'verdade-na-cara-loze', company: 'Loze', siteName: 'verdade-na-cara-loze', title: 'Verdade na Cara Loze', url: 'https://verdade.loze.com.br', netlifyRepo: 'GtegasB/verdade-na-cara-loze', githubRepo: 'GtegasB/verdade-na-cara-loze', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-06T23:27:00Z' },
  { id: 'loze-viedry', company: 'Loze', siteName: 'loze-viedry', title: 'Viedry Loze', url: 'https://viedry.loze.com.br', netlifyRepo: 'GtegasB/loze_viedry', githubRepo: 'GtegasB/loze_viedry', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-23T00:47:00Z' },

  { id: 'zipliachat', company: 'Ziplia', siteName: 'zipliachat', title: 'Ziplia Chat', url: 'https://chat.ziplia.com.br', netlifyRepo: 'GtegasB/Ziplia_Chat', githubRepo: 'GtegasB/Ziplia_Chat', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-03T01:00:00Z' },
  { id: 'zipliacrm', company: 'Ziplia', siteName: 'zipliacrm', title: 'Ziplia CRM', url: 'https://crm.ziplia.com.br', netlifyRepo: 'GtegasB/Ziplia_CRM', githubRepo: 'GtegasB/Ziplia_CRM', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-12T21:34:00Z' },
  { id: 'simuladorresultado', company: 'Ziplia', siteName: 'simuladorresultado', title: 'Simulador de Resultado', url: 'https://simula.ziplia.com.br', netlifyRepo: 'GtegasB/SimuladorR', status: 'review', source: 'netlify-audit', publishedAt: '2026-03-03T01:46:00Z', notes: 'Netlify aponta repo não listado no GitHub exportado.' },
  { id: 'sireplataforma', company: 'Ziplia', siteName: 'sireplataforma', title: 'SIRE Plataforma', url: 'https://sire.ziplia.com.br', netlifyRepo: 'GtegasB/SIRE', githubRepo: 'GtegasB/SIRE', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-12T21:27:00Z' },
  { id: 'taskzei', company: 'Ziplia', siteName: 'taskzei', title: 'Taskzei', url: 'https://taskzei.ziplia.com.br', netlifyRepo: 'GtegasB/Taskzei', githubRepo: 'GtegasB/Taskzei', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-03T01:03:00Z' },
  { id: 'ziplia-vox', company: 'Ziplia', siteName: 'ziplia-vox', title: 'Ziplia Vox', url: 'https://vox.ziplia.com.br', netlifyRepo: 'GtegasB/zpl-ziplia-vox', githubRepo: 'GtegasB/zpl-ziplia-vox', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-25T21:53:00Z' },
  { id: 'zipliaodonto', company: 'Ziplia', siteName: 'zipliaodonto', title: 'Ziplia Odonto', url: 'https://ziplia.com.br', githubRepo: 'GtegasB/Ziplia', status: 'review', source: 'netlify-audit', publishedAt: '2025-11-26T02:34:00Z', notes: 'Match por nome parecido, exige validação humana.' },

  { id: 'audacus', company: 'Piblo', siteName: 'audacus', title: 'Audacus', url: 'https://audacus.piblo.com.br', netlifyRepo: 'GtegasB/Audacus', githubRepo: 'GtegasB/Audacus', status: 'published', source: 'netlify-audit', publishedAt: '2026-06-05T21:17:00Z' },
  { id: 'menugrupob', company: 'Piblo', siteName: 'menugrupob', title: 'Menu GrupoB', url: 'https://hub.piblo.com.br', netlifyRepo: 'GtegasB/MenuGrupoB', githubRepo: 'GtegasB/MenuGrupoB', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-07T22:09:00Z' },
  { id: 'lecriza', company: 'Piblo', siteName: 'lecriza', title: 'Lecriza', url: 'https://lecriza.piblo.com.br', netlifyRepo: 'GtegasB/Lecriza', githubRepo: 'GtegasB/Lecriza', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-08T00:42:00Z' },
  { id: 'piblo', company: 'Piblo', siteName: 'piblo', title: 'Piblo', url: 'https://piblo.com.br', netlifyRepo: 'GtegasB/Piblo', githubRepo: 'GtegasB/Piblo', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-03T02:54:00Z' },
  { id: 'tegasqg', company: 'Piblo', siteName: 'tegasqg', title: 'Tegas QG', url: 'https://tegas.piblo.com.br', netlifyRepo: 'GtegasB/TegasQG', githubRepo: 'GtegasB/TegasQG', status: 'published', source: 'netlify-audit', publishedAt: '2026-03-03T01:21:00Z' },

  { id: 'startyb', company: 'StartyB', siteName: 'startyb', title: 'StartyB', url: 'https://startyb.com.br', netlifyRepo: 'GtegasB/StartyB_QG', githubRepo: 'GtegasB/StartyB_QG', status: 'published', source: 'netlify-audit', publishedAt: '2026-05-04T23:36:00Z' },
  { id: 'institutob-site', company: 'InstitutoB', siteName: 'institutob-site', title: 'InstitutoB', url: 'https://institutob.com.br', netlifyRepo: 'GtegasB/InstitutoB_Site', githubRepo: 'GtegasB/InstitutoB_Site', status: 'published', source: 'netlify-audit', publishedAt: '2026-02-28T23:33:00Z' },
  { id: 'acadb', company: 'AcadB', siteName: 'acadb', title: 'AcadB', url: 'https://acadb.com.br', netlifyRepo: 'GtegasB/AcadB', githubRepo: 'GtegasB/AcadB', status: 'published', source: 'netlify-audit', publishedAt: '2026-02-28T23:26:00Z' },
  { id: 'osocio', company: 'O Sócio', siteName: 'osocio', title: 'O Sócio', url: 'http://osocio.netlify.app', netlifyRepo: 'GtegasB/PedroNassar_O_Socio', githubRepo: 'GtegasB/PedroNassar_O_Socio', status: 'published', source: 'netlify-audit' },
];

export const getPublishedLinksByCompany = (links: PublishedAppLink[] = PUBLISHED_APP_LINKS) => {
  return links.reduce<Record<string, PublishedAppLink[]>>((acc, link) => {
    if (!acc[link.company]) acc[link.company] = [];
    acc[link.company].push(link);
    return acc;
  }, {});
};

export const getPublishedLinksCompanies = (links: PublishedAppLink[] = PUBLISHED_APP_LINKS) => {
  return Array.from(new Set(links.map((link) => link.company))).sort((a, b) => a.localeCompare(b));
};
