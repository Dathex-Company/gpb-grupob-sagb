import React from 'react';
import { TabId, BusinessUnit, UserProfile } from '../types';
import { getRegisteredModules } from '../src/core/modules/moduleRegistry';
import { SearchIcon } from './Icon';
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

  const coreItems = [
    { id: 'home', label: 'Início', color: 'bg-blue-500' },
    { id: 'nic', label: 'NIC', color: 'bg-green-500', badge: '12' },
    { id: 'intelligence-flow', label: 'Fluxo Vivo', color: 'bg-orange-500', badge: '7' },
    { id: 'nagi', label: 'NAGI', color: 'bg-indigo-500', badge: '10' },
    { id: 'management', label: 'Mesas e Salas', color: 'bg-purple-500', badge: '18' },
    { id: 'governance', label: 'Governança', color: 'bg-slate-400', badge: '4' }
  ];

  const systemItems = [
    { id: 'ecosystem', label: 'Ecossistema', color: 'bg-cyan-500' },
    { id: 'ventures', label: 'Hub de Ventures', color: 'bg-emerald-500' },
    { id: 'conversations', label: 'Conversas', color: 'bg-blue-400' },
    { id: 'team', label: 'Equipe Global', color: 'bg-violet-400' },
    { id: 'programmers-room', label: 'Sala Dev', color: 'bg-amber-500' },
    { id: 'vault', label: 'Sessão de Pautas', color: 'bg-rose-500' },
    { id: 'cid', label: 'CID', color: 'bg-sky-500' },
    { id: 'continuous-memory', label: 'Memória Contínua', color: 'bg-teal-500' },
    { id: 'studio', label: 'Studio', color: 'bg-red-500' },
    { id: 'monitoramento', label: 'Monitoramento', color: 'bg-green-400' },
    { id: 'missions', label: 'Missões', color: 'bg-orange-400' },
    ...getRegisteredModules().map(mod => ({
        id: mod.manifest.id,
        label: mod.manifest.displayName,
        color: 'bg-slate-500'
    }))
  ];

  const renderMenuItem = (item: any) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id as TabId)}
        className={`
          group flex items-center w-full px-3 py-2.5 rounded-xl transition-all duration-300 relative mb-1
          ${isActive ? 'bg-white dark:bg-gradient-menu-active shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5' : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'}
        `}
      >
        {/* STATUS DOT (LED STYLE) */}
        <div className={`w-2 h-2 rounded-full ${item.color} mr-4 transition-all duration-500 ${isActive ? 'shadow-[0_0_12px_currentColor]' : 'opacity-40'}`} style={{ color: item.color.replace('bg-', '') }}></div>
        
        <span className={`text-[11px] font-bold flex-1 text-left tracking-tight ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 group-hover:text-gray-900 dark:group-hover:text-sagb-text'}`}>
          {item.label}
        </span>

        {item.badge && !isActive && (
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 ml-2">
            {item.badge}
          </span>
        )}

        {isActive && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] ml-auto"></div>
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
      <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
        {/* CORE SECTION */}
        <div className="px-2 mb-4">
            <span className="text-[10px] font-black text-gray-400 dark:text-sagb-muted uppercase tracking-[0.2em]">Centro de Comando</span>
        </div>
        <nav className="mb-8">
            {coreItems.map(renderMenuItem)}
        </nav>

        {/* SYSTEM SECTION */}
        <div className="px-2 mb-4">
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">Módulos e Operação</span>
        </div>
        <nav>
            {systemItems.map(renderMenuItem)}
        </nav>
      </div>

      {/* BOTTOM TOOLS (LOWER OPACITY) */}
      <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 px-2 shrink-0">
        <div className="flex items-center justify-between px-3 py-4">
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
        <button
          onClick={() => setActiveTab('fabrica-ca')}
          className="flex items-center w-full px-3 py-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors text-xs"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600 mr-4"></div>
          Fábrica de Agentes
        </button>
        {onLogout && (
          <>
            <button
              onClick={onLogout}
              className="flex items-center w-full px-3 py-2 text-red-400/60 hover:text-red-400 transition-colors text-xs mt-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-900/40 mr-4"></div>
              Encerrar Sessão
            </button>
            {/* USER NAME IN FOOTER */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-center">
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