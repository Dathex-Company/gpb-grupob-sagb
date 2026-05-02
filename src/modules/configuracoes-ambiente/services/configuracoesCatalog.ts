/**
 * Catálogo de categorias de configuração do sistema.
 * Cada categoria vira um botão no sub-sidebar e renderiza um painel específico na direita.
 * Segue o mesmo padrão de monitoramentoSubmodulos (Monitoramento).
 */

export type ConfiguracaoCategoria = {
  id: string;
  label: string;
  slug: string;
  descricao: string;
};

export const configuracoesCategorias: ConfiguracaoCategoria[] = [
  {
    id: 'tema',
    label: 'Tema do Sistema',
    slug: 'tema',
    descricao: 'Claro ou escuro para toda a interface',
  },
  {
    id: 'modulos',
    label: 'Ativação de Módulos',
    slug: 'modulos',
    descricao: 'Liga/desliga módulos do menu principal',
  },
  {
    id: 'idioma',
    label: 'Idioma e Região',
    slug: 'idioma',
    descricao: 'Idioma, fuso horário, formato de data',
  },
  {
    id: 'notificacoes',
    label: 'Notificações',
    slug: 'notificacoes',
    descricao: 'Som, push, e-mail e canais',
  },
  {
    id: 'perfil',
    label: 'Perfil do Usuário',
    slug: 'perfil',
    descricao: 'Nome, avatar e preferências pessoais',
  },
  {
    id: 'privacidade',
    label: 'Privacidade e Dados',
    slug: 'privacidade',
    descricao: 'Retenção, analytics e exportação',
  },
  {
    id: 'atalhos',
    label: 'Atalhos de Teclado',
    slug: 'atalhos',
    descricao: 'Hotkeys do sistema',
  },
];
