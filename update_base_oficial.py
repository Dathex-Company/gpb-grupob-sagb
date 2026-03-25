import re

with open('components/GovernanceView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Imports
content = content.replace("TrashIcon, CheckIcon, XIcon } from './Icon';", "TrashIcon, CheckIcon, XIcon, ShieldCheckIcon, CubeIcon } from './Icon';")

# 2. ViewMode
content = content.replace("type GovernanceViewMode = 'dashboard' | 'constitution' | 'backup' | 'black-vault' | 'compliance' | 'intelligence' | 'context' | 'methodology';", "type GovernanceViewMode = 'dashboard' | 'constitution' | 'backup' | 'black-vault' | 'compliance' | 'intelligence' | 'context' | 'methodology' | 'padroes' | 'protocolos';")

# 3. Dashboard background
content = content.replace("""  switch(currentView) {
      case 'dashboard': return (
        <div className="flex-1 h-full bg-[#F9FAFB] flex flex-col font-nunito overflow-y-auto custom-scrollbar relative">
             <button onClick={onBack} className="absolute top-8 right-8 text-gray-400 hover:text-bitrix-nav text-[9px] font-black uppercase tracking-widest">Voltar</button>
             {renderDashboard()}
        </div>
      );""", """  switch(currentView) {
      case 'dashboard': return (
        <div className="flex-1 h-full bg-[#0B0F19] text-slate-200 flex flex-col font-nunito overflow-y-auto custom-scrollbar relative">
             <button onClick={onBack} className="absolute top-8 right-8 text-slate-500 hover:text-blue-400 text-[9px] font-black uppercase tracking-widest transition-colors z-10">Voltar</button>
             {renderDashboard()}
        </div>
      );""")

# 4. renderDashboard component
new_dashboard = '''
const DashboardCard = ({ title, desc, icon, count, updated, owner, status, onClick }: any) => {
    let statusColor = "bg-slate-800 text-slate-400 border-slate-700";
    if (status === "Oficial") statusColor = "bg-blue-900/40 text-blue-400 border-blue-800/50";
    if (status === "Homologado") statusColor = "bg-green-900/40 text-green-400 border-green-800/50";
    if (status === "Recomendado") statusColor = "bg-emerald-900/40 text-emerald-400 border-emerald-800/50";
    if (status === "Experimental") statusColor = "bg-purple-900/40 text-purple-400 border-purple-800/50";
    if (status === "Legado") statusColor = "bg-orange-900/40 text-orange-400 border-orange-800/50";
    if (status === "Proibido") statusColor = "bg-red-900/40 text-red-400 border-red-800/50";

    return (
        <button 
            onClick={onClick}
            className="group bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/30 hover:bg-slate-800/80 transition-all text-left relative overflow-hidden flex flex-col justify-between min-h-[180px]"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-blue-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-10 h-10 bg-slate-900/80 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all">
                    {icon}
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded-md border uppercase tracking-widest ${statusColor}`}>
                    {status}
                </span>
            </div>
            
            <div className="relative z-10 flex-1">
                <h3 className="text-base font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">{title}</h3>
                <p className="text-[10px] text-slate-500 leading-relaxed group-hover:text-slate-400">{desc}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center relative z-10">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Itens</span>
                        <span className="text-xs font-mono text-slate-300">{count}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Resp.</span>
                        <span className="text-[10px] font-medium text-slate-300">{owner}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold mb-0.5">Atualizado</span>
                    <span className="text-[10px] text-slate-400 font-medium">{updated}</span>
                </div>
            </div>
        </button>
    );
};

  const renderDashboard = () => (
      <div className="p-10 max-w-7xl mx-auto animate-msg w-full relative z-10">
          <header className="mb-12 border-b border-slate-800 pb-8 relative">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -z-10"></div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
                 BASE OFICIAL
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Verdade Estrutural do SagB</p>
          </header>

          <div className="mb-6 flex justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
             <div className="flex items-center gap-4 flex-1">
                 <SearchIcon className="w-5 h-5 text-slate-500" />
                 <input 
                     type="text" 
                     placeholder="Buscar na Base Oficial..." 
                     className="bg-transparent border-none outline-none text-sm text-slate-200 w-full placeholder:text-slate-600"
                 />
             </div>
             <div className="flex items-center gap-3 ml-4">
                 <select className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none">
                     <option value="">Status</option>
                     <option value="oficial">Oficial</option>
                     <option value="homologado">Homologado</option>
                     <option value="recomendado">Recomendado</option>
                     <option value="experimental">Experimental</option>
                     <option value="legado">Legado</option>
                     <option value="proibido">Proibido</option>
                 </select>
                 <select className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none">
                     <option value="">Área</option>
                     <option value="front">Front-end</option>
                     <option value="back">Back-end</option>
                 </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard 
                  title="Central de Padrões"
                  desc="Stack, fontes, componentes e design system."
                  icon={<CubeIcon className="w-6 h-6" />}
                  count={14}
                  updated="Hoje"
                  owner="Arquitetura"
                  status="Oficial"
                  onClick={() => setCurrentView('padroes')}
              />
              <DashboardCard 
                  title="Protocolos Oficiais"
                  desc="Regras operacionais e decisórias do sistema."
                  icon={<ShieldCheckIcon className="w-6 h-6" />}
                  count={8}
                  updated="Ontem"
                  owner="Governança"
                  status="Homologado"
                  onClick={() => setCurrentView('protocolos')}
              />
              <DashboardCard 
                  title="Governança"
                  desc="Cultura atual, identidade e tom de voz."
                  icon={<BookIcon className="w-6 h-6" />}
                  count={1}
                  updated="2 dias atrás"
                  owner="Diretoria"
                  status="Oficial"
                  onClick={() => setCurrentView('constitution')}
              />
              <DashboardCard 
                  title="Núcleo de Inteligência"
                  desc="Gestão de DNA e permissões de agentes."
                  icon={<SearchIcon className="w-6 h-6" />}
                  count={agents.length}
                  updated="Hoje"
                  owner="AI Ops"
                  status="Homologado"
                  onClick={() => setCurrentView('intelligence')}
              />
              <DashboardCard 
                  title="Metodologias Gerais"
                  desc="Árvore de processos e frameworks corporativos."
                  icon={<FolderIcon className="w-6 h-6" />}
                  count={knowledgeNodes.length}
                  updated="1 semana atrás"
                  owner="Operações"
                  status="Recomendado"
                  onClick={() => setCurrentView('methodology')}
              />
              <DashboardCard 
                  title="Diretrizes & Compliance"
                  desc="Segurança, LGPD e regras de bloqueio."
                  icon={<ScaleIcon className="w-6 h-6" />}
                  count={1}
                  updated="Mês passado"
                  owner="Jurídico"
                  status="Oficial"
                  onClick={() => setCurrentView('compliance')}
              />
              <DashboardCard 
                  title="Cofre Black"
                  desc="Repositório seguro de arquivos críticos."
                  icon={<LockIcon className="w-6 h-6" />}
                  count={vaultItems.length}
                  updated="Ontem"
                  owner="Segurança"
                  status="Homologado"
                  onClick={() => setCurrentView('black-vault')}
              />
              <DashboardCard 
                  title="Backup do Sistema"
                  desc="Rotinas de salvamento e restore estrutural."
                  icon={<CloudDownloadIcon className="w-6 h-6" />}
                  count={0}
                  updated="Semanal"
                  owner="Infra"
                  status="Oficial"
                  onClick={handleExportData}
              />
          </div>
      </div>
  );
'''

# Find the old renderDashboard and replace it
# We'll use regex to match from `const renderDashboard = () => (` until `// Editor Genérico`
pattern_dashboard = re.compile(r'const renderDashboard = \(\) => \((.*?)\);\s*// Editor Genérico', re.DOTALL)
content = pattern_dashboard.sub(new_dashboard + '\n\n  // Editor Genérico', content)

# Now update the switch cases to include padroes and protocolos
switch_cases_old = """      case 'constitution': return renderEditor('Cultura Atual', cultureDraft, setCultureDraft, handleSaveConstitution, "Defina a Cultura...", { isSaving: isSavingCulture });
      case 'compliance': return renderEditor('Diretrizes & Compliance', complianceDraft, setComplianceDraft, handleSaveCompliance, "Defina os Protocolos de Bloqueio...", { isSaving: isSavingCompliance });"""

switch_cases_new = """      case 'constitution': return renderEditor('Cultura Atual', cultureDraft, setCultureDraft, handleSaveConstitution, "Defina a Cultura...", { isSaving: isSavingCulture });
      case 'compliance': return renderEditor('Diretrizes & Compliance', complianceDraft, setComplianceDraft, handleSaveCompliance, "Defina os Protocolos de Bloqueio...", { isSaving: isSavingCompliance });
      case 'padroes': return renderEditor('Central de Padrões', 'Stack oficial, front-end oficial, back-end oficial, deploy oficial, fontes, paletas...', () => { alert('Padrões salvos (Demo)'); }, () => {}, "Defina os Padrões...", { isSaving: false });
      case 'protocolos': return renderEditor('Protocolos Oficiais', 'DAI, identidade estrutural, separação cadastro x DNA, ativação por DNA...', () => { alert('Protocolos salvos (Demo)'); }, () => {}, "Defina os Protocolos...", { isSaving: false });"""

content = content.replace(switch_cases_old, switch_cases_new)

# Dark Premium Adjustments for the rest of the UI (renderEditor, renderBlackVault, renderAgentManager)
content = content.replace(
    '''<div className="flex-1 bg-white rounded-[2rem] border border-gray-100 shadow-sm p-1 overflow-hidden">
                <textarea 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full h-full p-8 bg-white resize-none outline-none font-mono text-xs leading-relaxed text-gray-800 custom-scrollbar"''',
    '''<div className="flex-1 bg-slate-800/50 rounded-[2rem] border border-slate-700/50 shadow-sm p-1 overflow-hidden backdrop-blur-sm">
                <textarea 
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    className="w-full h-full p-8 bg-transparent resize-none outline-none font-mono text-xs leading-relaxed text-slate-300 custom-scrollbar"'''
)

content = content.replace(
    '''<div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden">''',
    '''<div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden bg-[#0B0F19] text-slate-200">'''
)

content = content.replace(
    '''<div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden relative">''',
    '''<div className="flex-1 flex flex-col p-8 animate-msg h-full overflow-hidden relative bg-[#0B0F19] text-slate-200">'''
)

# Titles in Editor
content = content.replace('text-xl font-black text-bitrix-nav uppercase tracking-tighter', 'text-xl font-black text-white uppercase tracking-tighter')

with open('components/GovernanceView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
