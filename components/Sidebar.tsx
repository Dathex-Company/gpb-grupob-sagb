import React, { useEffect, useMemo, useState } from 'react';
import { TabId, BusinessUnit, UserProfile } from '../types';
import { getRegisteredModules } from '../src/core/modules/moduleRegistry';
import { CurrencyDollarIcon, SearchIcon, MessageSquareIcon, FolderIcon, BookIcon, ShieldCheckIcon, CubeIcon, LockIcon, FileTextIcon, PlayIcon, MicIcon, VideoIcon, UserPlusIcon, AlertCircleIcon, PencilIcon, HomeIcon, BriefcaseIcon, ClipboardIcon, NetworkIcon, LayoutIcon, CalendarIcon, CompassIcon, TerminalIcon, BotIcon } from './Icon';

const MODULE_TOGGLE_STORAGE_KEY = 'sagb:module-toggles:v2';
type ModuleToggleMap = Record<string, boolean>;

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
  agentCount: _agentCount,
  activeBU: _activeBU,
  version = "1.8.1",
  onReset: _onReset,
  onLogout: _onLogout,
  userProfile: _userProfile
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [moduleToggles, setModuleToggles] = useState<ModuleToggleMap>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MODULE_TOGGLE_STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as ModuleToggleMap) : {};
      setModuleToggles(parsed || {});
    } catch (error) {
      console.warn('[Sidebar] Falha ao carregar toggles de módulo:', error);
      setModuleToggles({});
    }
  }, [activeTab]);

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
      'sala-dev': <TerminalIcon className="w-4 h-4" />,
      'programmers-room': <TerminalIcon className="w-4 h-4" />,
      'vault': <LockIcon className="w-4 h-4" />,
      'cid': <FileTextIcon className="w-4 h-4" />,
      'continuous-memory': <BookIcon className="w-4 h-4" />,
      'studio': <VideoIcon className="w-4 h-4" />,
      'karaoke': <PlayIcon className="w-4 h-4" />,
      'monitoramento': <AlertCircleIcon className="w-4 h-4" />,
      'missions': <PlayIcon className="w-4 h-4" />,
      'agentes_comerciais': <BotIcon className="w-4 h-4" />,
      'fabrica-ca': <BotIcon className="w-4 h-4" />,
      'quadro_de_elite': <BotIcon className="w-4 h-4" />,
      'foco-total': <BotIcon className="w-4 h-4" />,
      'agenda': <CalendarIcon className="w-4 h-4" />,
      'mentorias': <MicIcon className="w-4 h-4" />,
      'gestao-financeira': <CurrencyDollarIcon className="w-4 h-4" />,
      'hub-integracao': <NetworkIcon className="w-4 h-4" />,
      'acadb-cursos': <BookIcon className="w-4 h-4" />,
      'configuracoes-sistema': <PencilIcon className="w-4 h-4" />,
      '_orquestracao-principal': <NetworkIcon className="w-4 h-4" />,
      'crm-ziplia': <BriefcaseIcon className="w-4 h-4" />,
    };
    return iconMap[id] || <FolderIcon className="w-4 h-4" />;
  };

  type MenuVisibility = 'always' | 'dev-only' | 'hidden';
  type MenuSource = 'core' | 'dynamic';

  interface MenuItem {
    id: string;
    label: string;
    source: MenuSource;
    visibility: MenuVisibility;
    tooltip?: string;
  }

  const coreMenuItems: MenuItem[] = [
    { id: 'home', label: 'Início', source: 'core', visibility: 'always' },
    { id: 'ecosystem', label: 'Mapa do Ecossistema', source: 'core', visibility: 'always', tooltip: 'Visão geral das integrações e ecossistema' },
    { id: 'nic', label: 'NIC', source: 'core', visibility: 'always', tooltip: 'Núcleo de Inteligência e Comando' },
    { id: 'intelligence-flow', label: 'Fluxo de Inteligência', source: 'core', visibility: 'always', tooltip: 'Fluxo Vivo de Monitoramento' },
    { id: 'nagi', label: 'NAGI', source: 'core', visibility: 'always', tooltip: 'Núcleo de Apoio à Gestão' },
    { id: 'missions', label: 'Missões', source: 'core', visibility: 'always' },
    { id: 'management', label: 'Painel de Gestão', source: 'core', visibility: 'always', tooltip: 'Gestão de Backlog (Futuro Módulo RAI)' },
    { id: 'vault', label: 'Cofre de Pautas', source: 'core', visibility: 'always', tooltip: 'Repositório Seguro de Pautas' },
    { id: 'mentorias', label: 'Central de Mentorias', source: 'core', visibility: 'always' },
    { id: 'cadastro-empresas', label: 'Cadastro de Empresas', source: 'core', visibility: 'always' },
    { id: 'conversations', label: 'Conversas', source: 'core', visibility: 'always' },
    { id: 'team', label: 'Equipe Global', source: 'core', visibility: 'always' },
    { id: 'monitoramento', label: 'Monitoramento', source: 'core', visibility: 'always' },
    { id: 'central_padroes', label: 'Central de Padrões', source: 'core', visibility: 'always' },
    { id: 'nucleo_de_agentes', label: 'Núcleo de Agentes', source: 'core', visibility: 'always' },
    { id: 'continuous-memory', label: 'Memória da IA', source: 'core', visibility: 'always', tooltip: 'Memória Contínua do Sistema' },
    { id: 'quadro_de_elite', label: 'Quadro de Elite', source: 'core', visibility: 'always' },
    { id: 'configuracoes-sistema', label: 'Configurações do Sistema', source: 'core', visibility: 'always' },
    { id: 'sala-dev', label: 'Sala Dev', source: 'core', visibility: 'always' },
    { id: 'acadb-cursos', label: 'AcadB Cursos', source: 'core', visibility: 'always' }
  ];

  const staticItemIds = new Set(coreMenuItems.map(item => item.id));

  const normalizeLabel = (value: string) =>
    String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

  const staticLabelSet = new Set(coreMenuItems.map((item) => normalizeLabel(item.label)));

  const moduleManifestById = useMemo(() => {
    return getRegisteredModules().reduce((acc, mod) => {
      acc[mod.manifest.id] = mod.manifest;
      return acc;
    }, {} as Record<string, { id: string; initialStatus: 'active' | 'inactive' }>);
  }, []);

  const isModuleEnabled = (moduleId: string) => {
    const manifest = moduleManifestById[moduleId];
    if (!manifest) return true;
    if (moduleId in moduleToggles) return !!moduleToggles[moduleId];
    return manifest.initialStatus === 'active';
  };

  const dynamicModules: MenuItem[] = useMemo(() => {
    return getRegisteredModules()
      .filter((mod) => !staticItemIds.has(mod.manifest.id))
      .filter((mod) => !staticLabelSet.has(normalizeLabel(mod.manifest.displayName)))
      .map((mod) => ({
        id: mod.manifest.id,
        label: mod.manifest.displayName,
        source: 'dynamic' as MenuSource,
        visibility: 'always' as MenuVisibility
      }));
  }, [staticItemIds, staticLabelSet]);

  const menuItems = useMemo(() => {
    const merged = [...coreMenuItems, ...dynamicModules];
    const seenIds = new Set<string>();
    const seenLabels = new Set<string>();

    return merged.filter((item) => {
      const normalized = normalizeLabel(item.label);
      if (seenIds.has(item.id)) return false;
      if (seenLabels.has(normalized)) return false;
      seenIds.add(item.id);
      seenLabels.add(normalized);
      return true;
    });
  }, [dynamicModules]);

  // Critério de exibição (Visibilidade)
  // Em produção, itens 'technical' só devem aparecer se houver flag de dev ativada.
  // Por enquanto ocultamos ou deixamos condicional ao ambiente (usaremos uma flag simples).
  const isDevContext = process.env.NODE_ENV === 'development' || localStorage.getItem('SAGB_DEV_MODE') === 'true';

  const isVisible = (item: MenuItem) => {
    if (item.visibility === 'hidden') return false;
    if (item.visibility === 'dev-only') return isDevContext;
    if (!isModuleEnabled(item.id)) return false;
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
        {/* Lista única de itens (fonte canônica + dinâmicos deduplicados) */}
        <nav className="flex flex-col gap-0">
          {menuItems.map(renderMenuItem)}
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
