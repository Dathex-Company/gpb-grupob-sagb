import React, { useState } from 'react';
import { TabId, BusinessUnit, UserProfile } from '../types';
import { getRegisteredModules } from '../src/core/modules/moduleRegistry';
import { SearchIcon, MessageSquareIcon, FolderIcon, BookIcon, ShieldCheckIcon, CubeIcon, LockIcon, FileTextIcon, PlayIcon, MicIcon, VideoIcon, UserPlusIcon, AlertCircleIcon, PencilIcon, HomeIcon, BriefcaseIcon, ClipboardIcon, NetworkIcon, LayoutIcon, CalendarIcon, CompassIcon, TerminalIcon, BotIcon } from './Icon';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    comando: true,
    operacao: true,
    sistema: true,
    ia: true
  });

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };
  const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=200&h=200";
  const displayName = userProfile?.name || userProfile?.nickname || "Neuro Command";
  const displayAvatar = userProfile?.avatarUrl || DEFAULT_AVATAR;

  // Mapeamento de ícones para os itens do menu
  const getIconForItem = (id: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'home': <HomeIcon className="w-4 h-4" />,
      'nic': <CompassIcon className="w-4 h-4" />,
      'intelligence-flow': <NetworkIcon className="w-4 h-4" />,
      'nagi': <CubeIcon className="w-4 h-4" />,
      'management': <LayoutIcon className="w-4 h-4" />,
      'nucleo_de_agentes': <ShieldCheckIcon className="w-4 h-4" />,
      'central_padroes': <ShieldCheckIcon className="w-4 h-4" />,
      'ecosystem': <BriefcaseIcon className="w-4 h-4" />,
      'cadastro-empresas': <ClipboardIcon className="w-4 h-4" />,
      'conversations': <MessageSquareIcon className="w-4 h-4" />,
      'team': <UserPlusIcon className="w-4 h-4" />,
      'programmers-room': <TerminalIcon className="w-4 h-4" />,
      'vault': <LockIcon className="w-4 h-4" />,
      'cid': <FileTextIcon className="w-4 h-4" />,
      'continuous-memory': <BookIcon className="w-4 h-4" />,
      'studio': <VideoIcon className="w-4 h-4" />,
      'monitoramento': <AlertCircleIcon className="w-4 h-4" />,
      'missions': <PlayIcon className="w-4 h-4" />,
      'fabrica-ca': <BotIcon className="w-4 h-4" />,
      'quadro_de_elite': <BotIcon className="w-4 h-4" />,
      'foco-total': <BotIcon className="w-4 h-4" />,
      'agenda': <CalendarIcon className="w-4 h-4" />,
      'mentorias': <MicIcon className="w-4 h-4" />,
    };
    return iconMap[id] || <FolderIcon className="w-4 h-4" />;
  };

  // Definição clara dos status possíveis para um item de menu (ET 02)
  type MenuStatus = 'official' | 'technical' | 'provisional' | 'dynamic' | 'hidden';

  interface MenuItem {
    id: string;
    label: string;
    color: string;
    status: MenuStatus;
    tooltip?: string;
  }

  // Bloco 1: Comando (Apenas itens oficiais e estratégicos)
  const comandoItems: MenuItem[] = [
    { id: 'home', label: 'Início', color: 'bg-blue-500', status: 'official' },
    { id: 'ecosystem', label: 'Mapa do Ecossistema', color: 'bg-cyan-500', status: 'official', tooltip: 'Visão geral das integrações e ecossistema' },
    { id: 'nic', label: 'NIC', color: 'bg-green-500', status: 'official', tooltip: 'Núcleo de Inteligência e Comando' },
    { id: 'intelligence-flow', label: 'Fluxo de Inteligência', color: 'bg-orange-500', status: 'official', tooltip: 'Fluxo Vivo de Monitoramento' },
    { id: 'nagi', label: 'NAGI', color: 'bg-indigo-500', status: 'official', tooltip: 'Núcleo de Apoio à Gestão' },
    { id: 'missions', label: 'Missões', color: 'bg-orange-400', status: 'official' }
  ];

  // Bloco 2: Operação (Áreas de trabalho e hubs principais)
  const operacaoItems: MenuItem[] = [
    { id: 'management', label: 'Painel de Gestão', color: 'bg-purple-500', status: 'official', tooltip: 'Gestão de Backlog (Futuro Módulo RAI)' },
    { id: 'vault', label: 'Cofre de Pautas', color: 'bg-rose-500', status: 'official', tooltip: 'Repositório Seguro de Pautas' },
    { id: 'agenda', label: 'taskzei', color: 'bg-emerald-400', status: 'official' },
    { id: 'mentorias', label: 'Central de Mentorias', color: 'bg-teal-400', status: 'official' },
    { id: 'cadastro-empresas', label: 'Cadastro de Empresas', color: 'bg-emerald-500', status: 'official' },
    { id: 'conversations', label: 'Conversas', color: 'bg-blue-400', status: 'official' },
    { id: 'team', label: 'Equipe Global', color: 'bg-violet-400', status: 'official' },
    { id: 'studio', label: 'Studio', color: 'bg-red-500', status: 'official' }
  ];

  // Bloco 3: Sistema e Controle (Infraestrutura, governança, dados)
  const sistemaEControleItems: MenuItem[] = [
    { id: 'monitoramento', label: 'Monitoramento', color: 'bg-green-400', status: 'official' },
    { id: 'cid', label: 'CID', color: 'bg-sky-500', status: 'official', tooltip: 'Centro de Inteligência de Dados' },
    { id: 'central_padroes', label: 'Central de Padrões', color: 'bg-indigo-500', status: 'official' },
    { id: 'nucleo_de_agentes', label: 'Núcleo de Agentes', color: 'bg-slate-400', status: 'official' },
    { id: 'continuous-memory', label: 'Memória da IA', color: 'bg-teal-500', status: 'provisional', tooltip: 'Memória Contínua do Sistema' },
    { id: 'programmers-room', label: 'Sala Dev', color: 'bg-amber-500', status: 'technical' },
    { id: 'telas-avancadas', label: 'Telas Avançadas', color: 'bg-gray-500', status: 'technical' }
  ];

  // Bloco 4: IA e Estrutura (Core de Agentes)
  const iaEEstruturaItems: MenuItem[] = [
    { id: 'quadro_de_elite', label: 'Quadro de Elite', color: 'bg-purple-600', status: 'official' }
  ];

  // Regra clara para módulos dinâmicos (ET 02)
  // Evitar duplicidades: Módulos registrados não devem colidir com hardcoded.
  const staticItemIds = new Set([
    ...comandoItems.map(i => i.id),
    ...operacaoItems.map(i => i.id),
    ...sistemaEControleItems.map(i => i.id),
    ...iaEEstruturaItems.map(i => i.id)
  ]);

  const normalizeLabel = (value: string) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

  const staticLabelSet = new Set(
    [...comandoItems, ...operacaoItems, ...sistemaEControleItems, ...iaEEstruturaItems].map((item) => normalizeLabel(item.label))
  );

  const excludedDynamicIds = new Set(['configuracoes-sistema']);

  const dynamicModules = getRegisteredModules()
    .filter(mod => !excludedDynamicIds.has(mod.manifest.id))
    .filter(mod => !staticItemIds.has(mod.manifest.id)) // Se já existe fixo por ID, não duplica
    .filter(mod => !staticLabelSet.has(normalizeLabel(mod.manifest.displayName))) // Se já existe fixo por label, não duplica
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
      <div key={item.id} className="relative group w-full">
        <button
          onClick={() => {
            setActiveTab(item.id as TabId);
            setIsMobileMenuOpen(false); // Fecha o menu no mobile ao clicar
          }}
          className={`
            group flex items-center w-full px-3 py-1.5 rounded-md transition-colors duration-200 relative text-[12px]
            ${isActive 
              ? 'bg-blue-50/50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-semibold' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-[#F3F8FF] dark:hover:bg-blue-950/20 font-normal hover:text-blue-700 dark:hover:text-blue-300'}
          `}
        >
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 dark:bg-blue-500 rounded-r-md"></div>
          )}
          
          {/* ÍCONE PADRONIZADO */}
          <div className={`w-5 h-5 flex items-center justify-center mr-3 shrink-0 transition-colors duration-200 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>
            {getIconForItem(item.id)}
          </div>
          
          {/* TEXTO DO MENU */}
          <span className="flex-1 text-left tracking-normal truncate">
            {item.label}
          </span>
        </button>

        {/* Custom Tooltip */}
        {item.tooltip && (
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[11px] font-medium rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap pointer-events-none">
            {item.tooltip}
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Botão Hambúrguer Mobile */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed bottom-6 right-6 z-[60] p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Toggle Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMobileMenuOpen ? (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay Escurecido Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[40] transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Principal */}
      <aside className={`
        fixed inset-y-0 left-0 z-[50] transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
        w-[260px] bg-white dark:bg-[#111111] flex-col h-full border-r border-gray-100 dark:border-white/5 shrink-0 font-sans py-6 text-gray-900 dark:text-gray-200 overflow-hidden
      `}>
      
      {/* INSTITUTIONAL BRANDING - GRUPO B */}
      <div className="flex flex-col items-center mb-6 px-2 shrink-0">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 flex-shrink-0 relative mb-2 bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-900 dark:text-white font-black text-xs">GB</div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight tracking-tight">Grupo B</h2>
          <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-0.5 uppercase tracking-wider font-medium">Sistema Avançado de Gestão</p>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4">
        {/* Lista única de itens (sem subdivisões) */}
        <nav className="flex flex-col gap-0">
          {comandoItems.map(renderMenuItem)}
          {finalOperacaoItems.map(renderMenuItem)}
          {sistemaEControleItems.map(renderMenuItem)}
          {iaEEstruturaItems.map(renderMenuItem)}
        </nav>
      </div>

      {/* BLOCO 5 - SISTEMA (RODAPÉ) */}
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 px-6 pb-4 shrink-0">
        <div className="flex flex-col text-[10px] text-gray-400 font-medium space-y-1">
          <span>SagB v{version}</span>
          <span>by Dathex</span>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;