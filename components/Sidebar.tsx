import React from 'react';
import { TabId, BusinessUnit, UserProfile } from '../types';
import { getRegisteredModules } from '../src/core/modules/moduleRegistry';
import { SearchIcon, MessageSquareIcon, FolderIcon, BookIcon, ShieldCheckIcon, CubeIcon, LockIcon, FileTextIcon, PlayIcon, MicIcon, VideoIcon, UserPlusIcon, AlertCircleIcon, PencilIcon } from './Icon';
import { useTheme } from '../src/core/context/ThemeContext';

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  agentCount: number;
  activeBU: BusinessUnit;
  version?: string;
  onReset?: () => void;
  onLogout?: () => void;
  userProfile?: UserProfile | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  agentCount,
  activeBU,
  version = "1.8.1",
  onReset,
  onLogout,
  userProfile
}) => {
  const { theme, toggleTheme } = useTheme();
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200&h=200";
  const displayName = userProfile?.name || userProfile?.nickname || "Neuro Command";
  const displayAvatar = userProfile?.avatarUrl || DEFAULT_AVATAR;

  // Mapeamento de ícones para os itens do menu
  const getIconForItem = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'home': <FolderIcon className="w-4 h-4" />,
      'nic': <UserPlusIcon className="w-4 h-4" />,
      'intelligence-flow': <AlertCircleIcon className="w-4 h-4" />,
      'nagi': <CubeIcon className="w-4 h-4" />,
      'management': <FolderIcon className="w-4 h-4" />,
      'governance': <ShieldCheckIcon className="w-4 h-4" />,
      'ecosystem': <FolderIcon className="w-4 h-4" />,
      'ventures': <FolderIcon className="w-4 h-4" />,
      'conversations': <MessageSquareIcon className="w-4 h-4" />,
      'team': <UserPlusIcon className="w-4 h-4" />,
      'programmers-room': <PencilIcon className="w-4 h-4" />,
      'vault': <LockIcon className="w-4 h-4" />,
      'cid': <FileTextIcon className="w-4 h-4" />,
      'continuous-memory': <BookIcon className="w-4 h-4" />,
      'studio': <VideoIcon className="w-4 h-4" />,
      'monitoramento': <MicIcon className="w-4 h-4" />,
      'missions': <PlayIcon className="w-4 h-4" />,
    };
    return iconMap[id] || <FolderIcon className="w-4 h-4" />;
  };

  // Definição clara dos status possíveis para um item de menu (ET 02)
  type MenuStatus = 'official' | 'technical' | 'provisional' | 'dynamic' | 'hidden';

  interface MenuItem {
    id: string;
    label: string;
    color: string;
    badge?: string;
    status: MenuStatus;
    tooltip?: string;
  }

  // Bloco 1: Comando (Apenas itens oficiais e estratégicos)
  const comandoItems: MenuItem[] = [
    { id: 'home', label: 'Início', color: 'bg-blue-500', status: 'official' },
    { id: 'ecosystem', label: 'Mapa do Ecossistema', color: 'bg-cyan-500', status: 'official', tooltip: 'Visão geral das integrações e ecossistema' },
    { id: 'nic', label: 'NIC', color: 'bg-green-500', badge: '12', status: 'official', tooltip: 'Núcleo de Inteligência e Comando' },
    { id: 'intelligence-flow', label: 'Fluxo de Inteligência', color: 'bg-orange-500', badge: '7', status: 'official', tooltip: 'Fluxo Vivo de Monitoramento' },
    { id: 'nagi', label: 'NAGI (Apoio)', color: 'bg-indigo-500', badge: '10', status: 'official', tooltip: 'Núcleo de Apoio à Gestão' },
    { id: 'missions', label: 'Missões', color: 'bg-orange-400', status: 'official' }
  ];

  // Bloco 2: Operação (Áreas de trabalho e hubs principais)
  const operacaoItems: MenuItem[] = [
    { id: 'management', label: 'Painel de Gestão', color: 'bg-purple-500', badge: '18', status: 'official', tooltip: 'Gestão de Backlog (Futuro Módulo RAI)' },
    { id: 'vault', label: 'Cofre de Pautas', color: 'bg-rose-500', status: 'official', tooltip: 'Repositório Seguro de Pautas' },
    { id: 'agenda', label: 'Agenda Inteligente', color: 'bg-emerald-400', status: 'official' },
    { id: 'mentorias', label: 'Central de Mentorias', color: 'bg-teal-400', status: 'official' },
    { id: 'ventures', label: 'Hub de Ventures', color: 'bg-emerald-500', status: 'official' },
    { id: 'conversations', label: 'Conversas', color: 'bg-blue-400', status: 'official' },
    { id: 'team', label: 'Equipe Global', color: 'bg-violet-400', status: 'official' },
    { id: 'studio', label: 'Studio', color: 'bg-red-500', status: 'official' },
    { id: 'methodologies', label: 'Núcleo de Metodologias', color: 'bg-amber-400', status: 'official' }
  ];

  // Bloco 3: Sistema e Controle (Infraestrutura, governança, dados)
  const sistemaEControleItems: MenuItem[] = [
    { id: 'monitoramento', label: 'Monitoramento', color: 'bg-green-400', status: 'official' },
    { id: 'cid', label: 'CID', color: 'bg-sky-500', status: 'official', tooltip: 'Centro de Inteligência de Dados' },
    { id: 'governance', label: 'Governança', color: 'bg-slate-400', badge: '4', status: 'official' },
    { id: 'configuracoes', label: 'Configurações do Ambiente', color: 'bg-slate-500', status: 'official' },
    // Itens técnicos/provisórios agora recebem status correspondente
    { id: 'continuous-memory', label: 'Memória da IA', color: 'bg-teal-500', status: 'provisional', tooltip: 'Memória Contínua do Sistema' },
    { id: 'programmers-room', label: 'Sala Dev', color: 'bg-amber-500', status: 'technical' },
    { id: 'telas-avancadas', label: 'Telas Avançadas', color: 'bg-gray-500', status: 'technical' }
  ];

  // Bloco 4: IA e Estrutura (Core de Agentes)
  const iaEEstruturaItems: MenuItem[] = [
    { id: 'fabrica-ca', label: 'Fábrica de Agentes', color: 'bg-purple-600', status: 'official' }
  ];

  // Regra clara para módulos dinâmicos (ET 02)
  // Evitar duplicidades: Módulos registrados não devem colidir com hardcoded.
  const staticItemIds = new Set([
    ...comandoItems.map(i => i.id),
    ...operacaoItems.map(i => i.id),
    ...sistemaEControleItems.map(i => i.id),
    ...iaEEstruturaItems.map(i => i.id)
  ]);

  const dynamicModules = getRegisteredModules()
    .filter(mod => !staticItemIds.has(mod.manifest.id)) // Se já existe fixo, não duplica
    .map(mod => ({
      id: mod.manifest.id,
      label: mod.manifest.displayName,
      color: 'bg-slate-500',
      status: 'dynamic' as MenuStatus
    }));

  // Vamos injetar os dinâmicos no bloco Operação por padrão, a não ser que haja uma blacklist (futuro)
  const finalOperacaoItems = [...operacaoItems, ...dynamicModules];

  // Critério de exibição (Visibilidade)
  // Em produção, itens 'technical' só devem aparecer se houver flag de dev ativada.
  // Por enquanto ocultamos ou deixamos condicional ao ambiente (usaremos uma flag simples).
  const isDevContext = process.env.NODE_ENV === 'development' || localStorage.getItem('SAGB_DEV_MODE') === 'true';

  const isVisible = (item: MenuItem) => {
    if (item.status === 'hidden') return false;
    if (item.status === 'technical') return isDevContext; 
    // Itens provisórios ficam visíveis até amadurecerem ou serem descartados
    return true; 
  };

  const renderMenuItem = (item: MenuItem) => {
    if (!isVisible(item)) return null;
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        title={item.tooltip}
        onClick={() => setActiveTab(item.id as TabId)}
        className={`
          group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-300 relative mb-1
          ${isActive ? 'bg-white dark:bg-gradient-menu-active shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5' : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}
        `}
      >
        {/* ÍCONE COM CONTORNO */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
          {getIconForItem(item.id)}
        </div>
        
        {/* TEXTO DO MENU - AUMENTADO PARA 12px E CLAREADO */}
        <span className={`text-xs font-semibold flex-1 text-left tracking-tight ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-sagb-text'}`}>
          {item.label}
        </span>

        {item.badge && !isActive && (
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 ml-2">
            {item.badge}
          </span>
        )}

        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)] ml-auto"></div>
        )}
      </button>
    );
  };

  return (
    <aside className="hidden md:flex w-[260px] bg-white dark:bg-sagb-bg flex-col h-full border-r border-gray-100 dark:border-white/5 shrink-0 z-30 font-nunito py-6 px-4 text-gray-900 dark:text-sagb-text transition-colors duration-300 overflow-hidden">
      
      {/* INSTITUTIONAL BRANDING - GRUPO B */}
      <div className="flex flex-col items-center mb-8 px-2 shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-blue-500/30 dark:border-blue-500/30 flex-shrink-0 relative mb-3 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
          <div className="text-white font-black text-xl">GB</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-lg font-black text-gray-900 dark:text-white leading-tight tracking-tight">Grupo B</h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-[0.1em] font-medium">Sistema Avançado de Gestão</p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative mb-8 px-2 shrink-0">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-sagb-muted" />
        <input 
          type="text" 
          placeholder="Buscar módulo..." 
          className="w-full bg-gray-100 dark:bg-gradient-search border border-gray-200 dark:border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-sagb-blue/50 placeholder:text-gray-400 dark:placeholder:sagb-muted transition-all text-gray-900 dark:text-sagb-text shadow-inner"
        />
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-1 pb-4">
        {/* BLOCO 1 - COMANDO */}
        <div className="px-2 mb-2 mt-2">
            <span className="text-[10px] font-black text-gray-400 dark:text-sagb-muted uppercase tracking-[0.2em]">Comando</span>
        </div>
        <nav className="mb-6">
            {comandoItems.map(renderMenuItem)}
        </nav>

        {/* BLOCO 2 - OPERAÇÃO */}
        <div className="px-2 mb-2">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Operação</span>
        </div>
        <nav className="mb-6">
            {finalOperacaoItems.map(renderMenuItem)}
        </nav>

        {/* BLOCO 3 - SISTEMA E CONTROLE */}
        <div className="px-2 mb-2">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Sistema e Controle</span>
        </div>
        <nav className="mb-6">
            {sistemaEControleItems.map(renderMenuItem)}
        </nav>

        {/* BLOCO 4 - IA E ESTRUTURA */}
        <div className="px-2 mb-2">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">IA e Estrutura</span>
        </div>
        <nav>
            {iaEEstruturaItems.map(renderMenuItem)}
        </nav>
      </div>

      {/* BLOCO 5 - SISTEMA (RODAPÉ) */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 px-2 shrink-0">
        <div className="flex items-center justify-between px-3 py-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-sagb-muted">Ambiente</span>
            <button
                onClick={toggleTheme}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-all duration-500 focus:outline-none shadow-inner ${theme === 'dark' ? 'bg-gradient-switch-on' : 'bg-gradient-switch-off'}`}
                title="Alternar Modo Claro/Escuro"
            >
                <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-gradient-switch-handle shadow-md transition-transform duration-300 ${theme === 'dark' ? 'translate-x-5.5' : 'translate-x-1'}`}
                />
            </button>
        </div>
        {onLogout && (
          <>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2 text-red-400/60 hover:text-red-400 transition-colors text-xs"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-900/40 mr-4"></div>
              Encerrar Sessão
            </button>
            {/* USER NAME IN FOOTER */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-center mb-2">
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium truncate max-w-full px-2">
                {displayName}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;