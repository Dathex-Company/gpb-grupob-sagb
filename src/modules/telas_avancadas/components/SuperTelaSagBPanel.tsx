import React from 'react';

type SuperBloco = {
  id: string;
  titulo: string;
  subtitulo: string;
  destaque: string;
  acoes: string[];
};

const BLOCOS_SUPER_TELA: SuperBloco[] = [
  {
    id: 'panorama',
    titulo: 'Panorama Operacional',
    subtitulo: 'Visão macro do ecossistema SagB',
    destaque: 'Status Geral: Estável',
    acoes: ['Abrir visão 360°', 'Atualizar Snapshot', 'Análise Situacional']
  },
  {
    id: 'empresas',
    titulo: 'Empresas',
    subtitulo: 'Frentes e unidades em destaque',
    destaque: '15 unidades monitoradas',
    acoes: ['Mapa de Empresas', 'Ritmo Comercial', 'Prioridades do Dia']
  },
  {
    id: 'monitoramento',
    titulo: 'Monitoramento',
    subtitulo: 'Eventos, filas e integridade operacional',
    destaque: '3 alertas requerem atenção',
    acoes: ['Painel de Saúde', 'Eventos Críticos', 'Logs em Tempo Real']
  },
  {
    id: 'agentes',
    titulo: 'Agentes',
    subtitulo: 'Coordenação dos agentes ativos',
    destaque: '42 agentes online',
    acoes: ['Estado dos Agentes', 'Missões Ativas', 'Escalar Orquestração']
  },
  {
    id: 'automacoes',
    titulo: 'Automações',
    subtitulo: 'Fluxos e execuções automáticas',
    destaque: '87 execuções em andamento',
    acoes: ['Disparar Fluxo', 'Fila de Processos', 'Diagnóstico de Falhas']
  },
  {
    id: 'alertas',
    titulo: 'Alertas',
    subtitulo: 'Incidentes e gatilhos prioritários',
    destaque: 'Prioridade Alta: 2',
    acoes: ['Ver Alertas', 'Plano de Resposta', 'Silenciar Não Críticos']
  },
  {
    id: 'ferramentas',
    titulo: 'Ferramentas',
    subtitulo: 'Utilitários de decisão e execução',
    destaque: '12 utilitários disponíveis',
    acoes: ['Abrir Ferramentas', 'Checklist Estratégico', 'Matriz de Impacto']
  },
  {
    id: 'comandos',
    titulo: 'Comandos Rápidos',
    subtitulo: 'Ações de alta frequência',
    destaque: 'Centro de comando instantâneo',
    acoes: ['Comando Global', 'Atalho de Missão', 'Acionar Modo Crítico']
  }
];

interface SuperTelaSagBPanelProps {
  onClose: () => void;
}

export const SuperTelaSagBPanel: React.FC<SuperTelaSagBPanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[80] bg-[#05070d] text-white">
      <div className="h-full w-full overflow-auto">
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#05070d]/90 backdrop-blur-md px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-300/80">Super Tela</p>
              <h1 className="text-3xl md:text-4xl font-black mt-1">Super Tela SagB</h1>
              <p className="text-sm text-gray-400 mt-1">Centro de comando expandido para leitura ampla e operação visual.</p>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold transition-colors"
            >
              Fechar Super Tela
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 xl:p-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">
            {BLOCOS_SUPER_TELA.map((bloco, index) => {
              const spanClass = index === 0
                ? 'md:col-span-12 xl:col-span-8'
                : index === 1
                  ? 'md:col-span-6 xl:col-span-4'
                  : 'md:col-span-6 xl:col-span-4';

              return (
                <section
                  key={bloco.id}
                  className={`${spanClass} rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}
                >
                  <header className="mb-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-gray-400">Bloco Estratégico</p>
                    <h2 className="text-xl md:text-2xl font-black mt-2">{bloco.titulo}</h2>
                    <p className="text-sm text-gray-300 mt-1">{bloco.subtitulo}</p>
                  </header>

                  <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 mb-5">
                    <p className="text-sm font-semibold text-cyan-200">{bloco.destaque}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {bloco.acoes.map((acao) => (
                      <button
                        key={`${bloco.id}-${acao}`}
                        className="h-12 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-sm font-bold text-left px-4 transition-all"
                      >
                        {acao}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

