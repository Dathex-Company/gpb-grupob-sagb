import React, { useState } from 'react';
import { Agent, BusinessUnit, GovernanceCulture, ComplianceRule, VaultItem, KnowledgeNode } from '../../../../types';
import { ShieldCheckIcon, BookIcon, ScaleIcon, LockIcon, SearchIcon, CubeIcon, BackIcon } from '../../../../components/Icon';
import { moduleDoc } from '../module-doc';
import { manifest } from '../manifest';

// Interface base - será expandida conforme a integração
interface BaseDosAgentesViewProps {
  onBack?: () => void;
  agents?: Agent[];
  onUpdateAgent?: (agent: Agent) => Promise<void> | void;
  businessUnits?: BusinessUnit[];
  onAddUnit?: (unit: BusinessUnit) => void;
  cultureEntry?: GovernanceCulture | null;
  complianceMarkdown?: string;
  onSaveCulture?: (payload: { contentMd: string; title?: string; summary?: string }) => Promise<void> | void;
  onSaveCompliance?: (markdown: string) => Promise<void> | void;
  vaultItems?: VaultItem[];
  onCreateVaultItem?: (input: any) => Promise<void> | void;
  onDeleteVaultItem?: (id: string) => Promise<void> | void;
  knowledgeNodes?: KnowledgeNode[];
  onCreateKnowledgeNode?: (input: any) => Promise<string | void> | void;
  onUpdateKnowledgeNode?: (id: string, updates: Partial<KnowledgeNode>) => Promise<void> | void;
  onDeleteKnowledgeNode?: (id: string) => Promise<void> | void;
}

// Definição das 7 camadas estruturais
const CAMADAS = [
  {
    id: 'escopo-acessos',
    numero: '01',
    titulo: 'Escopo e Acessos',
    descricao: 'Onde o agente atua e o que pode acessar',
    cor: 'bg-blue-500',
    icon: <CubeIcon className="w-6 h-6" />,
    status: 'Oficial'
  },
  {
    id: 'cultura-oficial',
    numero: '02',
    titulo: 'Cultura Oficial',
    descricao: 'Identidade, tom de voz e valores',
    cor: 'bg-purple-500',
    icon: <BookIcon className="w-6 h-6" />,
    status: 'Oficial'
  },
  {
    id: 'base-institucional',
    numero: '03',
    titulo: 'Base Institucional',
    descricao: 'Protocolos, padrões e estruturas oficiais',
    cor: 'bg-indigo-500',
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    status: 'Oficial'
  },
  {
    id: 'diretrizes-compliance',
    numero: '04',
    titulo: 'Diretrizes & Compliance',
    descricao: 'Regras de segurança, LGPD e bloqueios',
    cor: 'bg-green-500',
    icon: <ScaleIcon className="w-6 h-6" />,
    status: 'Oficial'
  },
  {
    id: 'protocolos-oficiais',
    numero: '05',
    titulo: 'Protocolos Oficiais',
    descricao: 'Regras operacionais e decisórias',
    cor: 'bg-amber-500',
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    status: 'Homologado'
  },
  {
    id: 'nucleo-inteligencia',
    numero: '06',
    titulo: 'Núcleo de Inteligência',
    descricao: 'DNA, conhecimento e permissões dos agentes',
    cor: 'bg-red-500',
    icon: <SearchIcon className="w-6 h-6" />,
    status: 'Homologado'
  },
  {
    id: 'memoria-agentes',
    numero: '07',
    titulo: 'Memória dos Agentes',
    descricao: 'Cofre Black e memória contínua',
    cor: 'bg-slate-500',
    icon: <LockIcon className="w-6 h-6" />,
    status: 'Homologado'
  }
];

const BaseDosAgentesView: React.FC<BaseDosAgentesViewProps> = ({
  onBack = () => window.history.back(),
  agents = [],
  vaultItems = [],
  knowledgeNodes = []
}) => {
  const [camadaSelecionada, setCamadaSelecionada] = useState<string | null>(null);
  const [docsAberto, setDocsAberto] = useState(false);

  const renderCardCamada = (camada: typeof CAMADAS[0]) => {
    const isSelecionada = camadaSelecionada === camada.id;
    
    return (
      <div
        key={camada.id}
        onClick={() => setCamadaSelecionada(camada.id)}
        className={`
          bg-white rounded-2xl border-2 p-6 cursor-pointer transition-all duration-300
          ${isSelecionada ? 'border-blue-500 shadow-xl scale-[1.02]' : 'border-gray-100 hover:border-gray-300 hover:shadow-lg'}
          flex flex-col h-full
        `}
      >
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 ${camada.cor} rounded-xl flex items-center justify-center text-white`}>
            {camada.icon}
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Camada {camada.numero}</span>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 ${
              camada.status === 'Oficial' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {camada.status}
            </span>
          </div>
        </div>
        
        <h3 className="text-[12px] font-bold text-gray-800 mb-2">{camada.titulo}</h3>
        <p className="text-[12px] text-gray-600 mb-4 flex-1">{camada.descricao}</p>
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-[10px] text-gray-400 font-medium">
            {camada.id === 'nucleo-inteligencia' ? `${agents.length} agentes` : 'Clique para explorar'}
          </span>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isSelecionada ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
          }`}>
            <div className="w-2 h-2 rounded-full bg-current"></div>
          </div>
        </div>
      </div>
    );
  };

  const renderDetalheCamada = () => {
    if (!camadaSelecionada) return null;
    
    const camada = CAMADAS.find(c => c.id === camadaSelecionada);
    if (!camada) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-msg">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCamadaSelecionada(null)}
                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
              >
                <BackIcon className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-black text-gray-800">{camada.titulo}</h2>
                <p className="text-[12px] text-gray-500">Camada {camada.numero} • {camada.status}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full ${camada.cor} text-white text-[12px] font-bold`}>
              Base dos Agentes
            </div>
          </div>
          
          <div className="p-8 overflow-y-auto flex-1">
            <div className="mb-8">
              <h3 className="text-[12px] font-bold text-gray-800 mb-4">Descrição da Camada</h3>
              <p className="text-[12px] text-gray-600 leading-relaxed">
                Esta camada define {camada.descricao.toLowerCase()}. É responsável por estruturar 
                os limites e capacidades dos agentes dentro do ecossistema SagB.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-[12px] font-bold text-gray-800 mb-3">Funcionalidades Principais</h4>
                {camada.id === 'escopo-acessos' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Definição de escopo operacional
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Controle de acessos e permissões
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      Auditoria e rastreabilidade
                    </li>
                  </ul>
                )}
                {camada.id === 'cultura-oficial' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Identidade e tom de voz oficiais
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Valores e cultura organizacional
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Padronização de comportamento
                    </li>
                  </ul>
                )}
                {camada.id === 'base-institucional' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Protocolos e estruturas oficiais
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Padrões de governança
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      Estrutura de tomada de decisão
                    </li>
                  </ul>
                )}
                {camada.id === 'diretrizes-compliance' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Regras de segurança e LGPD
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Controles de compliance
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Auditoria regulatória
                    </li>
                  </ul>
                )}
                {camada.id === 'protocolos-oficiais' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      Regras operacionais
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      Procedimentos decisórios
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                      Fluxos de aprovação
                    </li>
                  </ul>
                )}
                {camada.id === 'nucleo-inteligencia' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      DNA e conhecimento dos agentes
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Permissões e capacidades
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      Atualização de inteligência
                    </li>
                  </ul>
                )}
                {camada.id === 'memoria-agentes' && (
                  <ul className="space-y-2">
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                      Cofre Black e segredos
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                      Memória contínua
                    </li>
                    <li className="flex items-center text-[12px] text-gray-600">
                      <div className="w-2 h-2 bg-slate-500 rounded-full mr-3"></div>
                      Histórico de operações
                    </li>
                  </ul>
                )}
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-[12px] font-bold text-gray-800 mb-3">Status Atual</h4>
                <div className="space-y-3">
                  {camada.id === 'nucleo-inteligencia' && (
                    <>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">Agentes Cadastrados</span>
                          <span className="font-bold text-blue-600">{agents.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (agents.length / 10) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">DNA Completo</span>
                          <span className="font-bold text-green-600">{agents.filter(a => a.dnaStatus === 'DNA_COMPLETO').length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${agents.length > 0 ? (agents.filter(a => a.dnaStatus === 'DNA_COMPLETO').length / agents.length) * 100 : 0}%` }}></div>
                        </div>
                      </div>
                    </>
                  )}
                  {camada.id === 'memoria-agentes' && (
                    <>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">Itens no Cofre</span>
                          <span className="font-bold text-blue-600">{vaultItems?.length || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((vaultItems?.length || 0) / 20) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">Nós de Conhecimento</span>
                          <span className="font-bold text-green-600">{knowledgeNodes?.length || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((knowledgeNodes?.length || 0) / 50) * 100)}%` }}></div>
                        </div>
                      </div>
                    </>
                  )}
                  {!['nucleo-inteligencia', 'memoria-agentes'].includes(camada.id) && (
                    <>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">Implementação</span>
                          <span className="font-bold text-green-600">100%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full w-full"></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="text-gray-600">Integração</span>
                          <span className="font-bold text-blue-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full w-[85%]"></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="text-[12px] font-bold text-gray-800 mb-4">Próximos Passos</h4>
              <p className="text-[12px] text-gray-600">
                Esta camada será totalmente integrada com o módulo existente de Governança,
                mantendo toda a funcionalidade atual enquanto evolui para o novo padrão estrutural.
              </p>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button
              onClick={() => setCamadaSelecionada(null)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDocsModal = () => {
    if (!docsAberto) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Docs do Módulo</h2>
              <p className="text-[12px] text-gray-500">{moduleDoc.nome_oficial} • v{moduleDoc.versao}</p>
            </div>
            <button
              onClick={() => setDocsAberto(false)}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
            >
              Fechar
            </button>
          </div>

          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-800 mb-2">Resumo</h3>
              <p className="text-[12px] text-gray-600">{moduleDoc.resumo}</p>
            </section>

            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-800 mb-2">Tabelas Supabase</h3>
              <ul className="text-[12px] text-gray-700 list-disc pl-5 space-y-1">
                {moduleDoc.fontes_de_dados.supabase_tabelas.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-800 mb-2">Storage / Local</h3>
              <div className="space-y-2 text-[12px] text-gray-700">
                <div><span className="font-semibold">Buckets:</span> {moduleDoc.fontes_de_dados.storage_buckets.join(', ')}</div>
                <div><span className="font-semibold">LocalStorage:</span> {moduleDoc.fontes_de_dados.local_storage_keys.join(', ')}</div>
                <div><span className="font-semibold">IndexedDB:</span> {moduleDoc.fontes_de_dados.indexeddb_stores.join(', ')}</div>
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12px] font-bold text-gray-800 mb-2">Serviços e integrações</h3>
              <ul className="text-[12px] text-gray-700 list-disc pl-5 space-y-1 mb-2">
                {moduleDoc.servicos_e_integracoes.servicos_internos.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <div className="text-[12px] text-gray-700">
                <span className="font-semibold">APIs:</span> {moduleDoc.servicos_e_integracoes.apis_externas.join(', ')}
              </div>
            </section>

            <section className="bg-gray-50 rounded-xl p-4 lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-2">Ativos reutilizáveis (anti-duplicação)</h3>
              <div className="space-y-3">
                {moduleDoc.ativos_reutilizaveis.map((item) => (
                  <div key={`${item.modulo_origem}-${item.ativo}`} className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="text-[12px] font-semibold text-gray-800">{item.ativo} <span className="text-[12px] text-gray-500">({item.tipo})</span></div>
                    <div className="text-[12px] text-gray-500">Origem: {item.modulo_origem}</div>
                    <p className="text-[12px] text-gray-600 mt-1">{item.forma_de_uso}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-start">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4"
            >
              <BackIcon className="w-5 h-5" />
              <span className="text-[12px] font-medium">Voltar</span>
            </button>
            <h1 className="text-3xl font-black text-gray-900">Base dos Agentes</h1>
            <p className="text-gray-600 mt-2">
              As 7 camadas estruturais que definem o comportamento, limites, conhecimento e memória dos agentes do SagB.
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Módulo Oficial</div>
            <div className="text-lg font-bold text-gray-800">Núcleo de Agentes</div>
            <div className="mt-2 text-[12px] text-gray-500">
              Responsável: <span className="font-semibold text-gray-800">{manifest.owner?.displayName || 'A definir'}</span>
            </div>
            <button
              onClick={() => setDocsAberto(true)}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-[12px] font-semibold"
            >
              <BookIcon className="w-4 h-4" />
              Docs
            </button>
          </div>
        </div>
      </div>

      {/* Grid das 7 Camadas */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {CAMADAS.slice(0, 4).map(renderCardCamada)}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {CAMADAS.slice(4).map(renderCardCamada)}
        </div>
        
        {/* Legenda */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-[12px] text-gray-600">Camada Oficial</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-[12px] text-gray-600">Camada Homologada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-[12px] text-gray-600">Selecionada</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {renderDetalheCamada()}
      {renderDocsModal()}

      {/* Nota de Transição */}
      <div className="max-w-7xl mx-auto mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-[12px] font-bold text-blue-900 mb-2">Transição em Andamento</h3>
            <p className="text-blue-800 text-[12px]">
              Este módulo está em processo de transição do antigo "Governança" para o novo "Núcleo de Agentes". 
              Todas as funcionalidades originais estão preservadas e serão gradualmente reorganizadas nas 7 camadas estruturais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseDosAgentesView;