# SagB | Central de Monitoramento | Mapa 100% em Fases

**Documento:** Mapa estrutural completo da Central de Monitoramento do SagB  
**Status:** base estratégica para evolução do módulo  
**Versão:** v1.0  
**Responsável conceitual:** Léo Sentinel / Rodrigues  
**Executor técnico futuro:** Cássio Mendes  
**Base de referência:** conversas sobre o módulo Monitoramento, Central de Padrões, análise de Pietro, relatório geral de auditoria de módulos e referência visual LIS Central de Monitoramento v4 leve

---

## 1. Decisão central

A **Central de Monitoramento** deve ser o lugar oficial de observabilidade do SagB.

A regra é:

```text
Tudo que for monitoramento deve alimentar a Central de Monitoramento.
Nem todo dado bruto precisa morar nela.
```

Ou seja:

```text
Módulo de origem gera evento, log, métrica ou alerta.
Central de Monitoramento consolida, interpreta, exibe e aciona.
TaskZei transforma desvio em ação.
Agentes responsáveis analisam e respondem.
Pierre orquestra a visão geral do SagB.
Central de Padrões define critérios, limites e regras.
```

A Central de Monitoramento não deve virar depósito bruto infinito.
Ela deve ser o painel vivo de:

- observabilidade;
- alertas;
- incidentes;
- responsáveis;
- notificações;
- ações;
- riscos;
- saúde do ecossistema;
- conformidade;
- operação local;
- custos;
- execução;
- infraestrutura;
- módulos;
- agentes;
- dados;
- segurança.

---

## 2. Estratégia de implantação

A estrutura completa chega a 100%, mas não precisa ser implementada toda de uma vez.

A decisão recomendada é:

```text
Fase 1 = consolidar os 75% operacionais principais.
Fase 2 = adicionar saúde modular, padrões e governança profunda.
Fase 3 = adicionar ação inteligente, notificações, war room e layout configurável.
Fase 4 = integrar dados reais, contrato de observabilidade e event bus.
```

---

# 3. Mapa 100% da Central de Monitoramento

```text
CENTRAL DE MONITORAMENTO
│
├── 01. Painel Principal / Visão Geral
│   ├── Score geral de saúde
│   ├── Cards fixados
│   ├── Alertas críticos
│   ├── Incidentes ativos
│   ├── Notificações pendentes
│   ├── Modo TV
│   ├── Layout arrastável
│   ├── Cards redimensionáveis
│   ├── Presets de tela
│   ├── Tela 1 / Tela 2 / Tela 3 / Tela 4
│   └── Modo operação dedicada
│
├── 02. Infraestrutura e Rede
│   ├── Máquinas
│   │   ├── CPU
│   │   ├── GPU
│   │   ├── RAM
│   │   ├── Disco
│   │   ├── Temperatura
│   │   └── Uptime
│   │
│   ├── Internet
│   │   ├── Download
│   │   ├── Upload
│   │   ├── Ping
│   │   ├── Jitter
│   │   ├── Perda de pacote
│   │   ├── Picos de latência
│   │   └── Última queda
│   │
│   └── Tailscale / VPN
│       ├── Status da VPN
│       ├── Máquinas conectadas
│       ├── Máquinas offline
│       ├── Latência da malha
│       ├── Qualidade da rota
│       └── Última desconexão
│
├── 03. Execução Local
│   ├── Processos ativos
│   │   ├── PID
│   │   ├── Nome do processo
│   │   ├── Comando executado
│   │   ├── Pasta/projeto de origem
│   │   ├── CPU
│   │   ├── Memória
│   │   └── Tempo rodando
│   │
│   ├── Servidores locais
│   │   ├── Vite
│   │   ├── Netlify Dev
│   │   ├── Node
│   │   ├── npx
│   │   ├── Supabase CLI
│   │   └── Portas ocupadas
│   │
│   ├── Scripts
│   │   ├── Python
│   │   ├── PowerShell
│   │   ├── Scripts recorrentes
│   │   ├── Scripts de diagnóstico
│   │   ├── Scripts de limpeza
│   │   └── Scripts de monitoramento
│   │
│   └── Anomalias
│       ├── Processos órfãos
│       ├── Processos duplicados
│       ├── Processos travados
│       ├── Consumo alto
│       └── Processo sem origem identificada
│
├── 04. Backend e Supabase
│   ├── Banco de dados
│   │   ├── Leituras
│   │   ├── Escritas
│   │   ├── Latência
│   │   ├── Integridade de gravação
│   │   └── Tabelas relevantes
│   │
│   ├── Storage
│   │   ├── Arquivos no storage
│   │   ├── Buckets
│   │   ├── Uso total
│   │   ├── Últimos arquivos enviados
│   │   └── Crescimento do acervo
│   │
│   └── Jobs
│       ├── Em fila
│       ├── Processando
│       ├── Concluídos
│       ├── Com erro
│       └── Tempo médio de processamento
│
├── 05. Dados, Memória e Acervo
│   ├── Memórias
│   │   ├── Total de memórias
│   │   ├── Memórias brutas
│   │   ├── Memórias refinadas
│   │   ├── Pendências de refinamento
│   │   └── Integridade de escrita
│   │
│   ├── Acervo documental
│   │   ├── Assets brutos
│   │   ├── Assets derivados
│   │   ├── Outputs
│   │   ├── Ativos no CID
│   │   └── Arquivos por tipo
│   │
│   └── Pipeline documental
│       ├── Entrada
│       ├── Bruto
│       ├── Processando
│       ├── Derivado
│       ├── Memória
│       ├── Output
│       └── Erro
│
├── 06. IA e Agentes
│   ├── Provedores de IA
│   │   ├── Gemini
│   │   ├── DeepSeek
│   │   ├── OpenAI
│   │   ├── Modelos locais
│   │   └── Latência por provedor
│   │
│   ├── Consumo de IA
│   │   ├── Tokens
│   │   ├── Custo
│   │   ├── Consumo por modelo
│   │   └── Consumo por agente
│   │
│   └── Agentes
│       ├── Agentes ativos
│       ├── Agentes pausados
│       ├── Agentes com falha
│       ├── Travamentos
│       ├── Jobs por agente
│       └── Última atividade
│
├── 07. Sensor de Qualidade
│   ├── Saúde das APIs
│   ├── Tokens por conversa
│   ├── Custo por conversa
│   ├── Top agentes
│   ├── Top tipos de erro
│   ├── Eventos cognitivos
│   ├── Erros e acertos
│   └── Últimos eventos
│
├── 08. Automações e Integrações
│   ├── n8n
│   │   ├── Workflows ativos
│   │   ├── Execuções
│   │   ├── Filas
│   │   ├── Falhas
│   │   └── Workflows órfãos
│   │
│   ├── Webhooks
│   │   ├── Webhooks ativos
│   │   ├── Webhooks com erro
│   │   ├── Retries
│   │   └── Última chamada
│   │
│   └── Bridges / MCPs
│       ├── Hub de Integração
│       ├── API SagB
│       ├── MCP SagB
│       ├── SagB Bridge
│       └── Sincronizações
│
├── 09. Frontend e Deploys
│   ├── Netlify
│   ├── Deploys
│   ├── Builds
│   ├── Versões publicadas
│   ├── Ambientes ativos
│   ├── Falhas de publicação
│   └── Último deploy
│
├── 10. Custos e Consumo
│   ├── Custo do dia
│   ├── Custo do mês
│   ├── Custo acumulado
│   ├── Google Cloud
│   ├── APIs pagas
│   ├── Storage
│   ├── Banco
│   ├── IA
│   ├── Uso por agente
│   ├── Uso por fluxo
│   ├── Picos de consumo
│   └── Comparação com orçamento
│
├── 11. Segurança e Backup
│   ├── Segurança
│   │   ├── Logs de segurança
│   │   ├── Acessos suspeitos
│   │   ├── Bloqueios
│   │   ├── RLS
│   │   ├── Permissões
│   │   └── Credenciais em risco
│   │
│   └── Backup
│       ├── Último backup
│       ├── Status do backup
│       ├── Backup local
│       ├── Backup em nuvem
│       ├── Teste de restore
│       ├── Retenção
│       └── Plano de recuperação
│
├── 12. Central de Padrões e Conformidade
│   ├── Central de Padrões
│   │   ├── Padrões vencidos
│   │   ├── Padrões sem revisão
│   │   ├── Documentos sem responsável
│   │   ├── Padrões em conflito
│   │   └── Exceções vencidas
│   │
│   ├── Conformidade modular
│   │   ├── Módulos sem padrão vinculado
│   │   ├── Módulos com versão obsoleta
│   │   ├── Agentes sem documento canônico
│   │   ├── Deploy sem checklist
│   │   ├── Deploy sem evidência
│   │   └── Decisão sem registro
│   │
│   └── Conformidade visual
│       ├── Alice UI / LIS
│       ├── Rubik
│       ├── Robust Clean
│       ├── Dark mode
│       ├── Tokens visuais
│       └── Inconsistências visuais
│
├── 13. Saúde Modular do SagB
│   ├── Inventário Modular
│   │   ├── Total de módulos
│   │   ├── Módulos registrados
│   │   ├── Módulos não registrados
│   │   ├── Módulos inativos
│   │   ├── Módulos sem owner
│   │   └── Maturidade por módulo
│   │
│   ├── Registro e Rotas
│   │   ├── Registry
│   │   ├── Manifest
│   │   ├── Routes
│   │   ├── Base route
│   │   ├── Rotas inconsistentes
│   │   ├── Wildcards
│   │   └── Fullscreen
│   │
│   ├── Governança dos Módulos
│   │   ├── README ausente
│   │   ├── PLANNED ausente
│   │   ├── Docs ausentes
│   │   ├── DECISIONS fora do padrão
│   │   ├── CHANGELOG fora do padrão
│   │   └── module-doc incompleto
│   │
│   └── Módulos críticos
│       ├── Central de Padrões
│       ├── Monitoramento
│       ├── TaskZei
│       ├── Hub de Integração
│       ├── Orquestração Principal
│       ├── Sala Dev
│       └── CID
│
├── 14. Relações e Dependências
│   ├── Mapa de dependências
│   │   ├── Módulo origem
│   │   ├── Módulo destino
│   │   ├── Tipo de relação
│   │   ├── Status da relação
│   │   └── Risco da relação
│   │
│   ├── Duplicidades
│   │   ├── Gestão de agentes
│   │   ├── Inteligência / análise
│   │   ├── Processamento de mídia
│   │   ├── Integração externa
│   │   └── Monitoramento vs Orquestração
│   │
│   └── Módulos base / cores
│       ├── api_core
│       ├── governance_core
│       ├── integration_core
│       ├── monitoring_core
│       ├── document_core
│       ├── devtools_core
│       └── mcp_core
│
├── 15. Esteira e Metodologia
│   ├── Saúde da Esteira
│   │   ├── CID
│   │   ├── NICO
│   │   ├── NAGI
│   │   ├── AJUP
│   │   ├── Biblioteca de Módulos
│   │   ├── Central de Padrões
│   │   └── Sala Dev
│   │
│   ├── Gargalos da Esteira
│   │   ├── Tempo por etapa
│   │   ├── Etapas puladas
│   │   ├── Demandas sem gate
│   │   ├── Demandas paradas
│   │   └── Retrabalho por etapa
│   │
│   └── Qualidade Decisória
│       ├── Decisões sem responsável
│       ├── Decisões sem prazo
│       ├── Decisões sem tarefa
│       ├── Decisões contraditórias
│       ├── Decisões reabertas
│       └── Decisões vencidas
│
├── 16. Alertas, Incidentes e Eventos
│   ├── Alertas
│   │   ├── Críticos
│   │   ├── Altos
│   │   ├── Médios
│   │   ├── Baixos
│   │   ├── Sem responsável
│   │   └── Sem origem
│   │
│   ├── Incidentes
│   │   ├── Incidentes ativos
│   │   ├── Incidentes sem dono
│   │   ├── Incidentes vencidos
│   │   ├── Status de resolução
│   │   └── Linha do tempo
│   │
│   └── Eventos
│       ├── Reinícios
│       ├── Falhas
│       ├── Deploys
│       ├── Quedas
│       ├── Erros
│       ├── Gravações iniciadas
│       ├── Gravações encerradas
│       └── Eventos de agentes
│
├── 17. Central de Notificações
│   ├── Notificações abertas
│   ├── Notificações críticas
│   ├── Notificações enviadas
│   ├── Notificações não lidas
│   ├── Notificações sem responsável
│   ├── Notificações escaladas
│   ├── Canal usado
│   ├── Agente acionado
│   └── Status da notificação
│
├── 18. Responsáveis e Ação Inteligente
│   ├── Mapa de Responsáveis
│   │   ├── Área
│   │   ├── Agente responsável
│   │   ├── Backup
│   │   ├── Status do agente
│   │   ├── Última resposta
│   │   └── Tempo médio de resposta
│   │
│   ├── Roteador de Alertas
│   │   ├── Origem do alerta
│   │   ├── Severidade
│   │   ├── Responsável primário
│   │   ├── Responsável secundário
│   │   ├── Canal de envio
│   │   └── Regra de escalonamento
│   │
│   ├── BO Automático
│   │   ├── O que aconteceu
│   │   ├── Quando começou
│   │   ├── Módulo afetado
│   │   ├── Severidade
│   │   ├── Responsável
│   │   ├── Impacto
│   │   └── Ação recomendada
│   │
│   └── Ações rápidas
│       ├── Abrir reunião
│       ├── Criar task no TaskZei
│       ├── Enviar BO
│       ├── Encaminhar responsável
│       └── Registrar decisão
│
├── 19. Silêncio Operacional
│   ├── Agentes sem evento recente
│   ├── Módulos sem atualização
│   ├── Backups sem reporte
│   ├── Webhooks sem recebimento
│   ├── Scripts que pararam sem erro
│   ├── Processos mortos silenciosamente
│   └── Integrações sem sinal
│
└── 20. Fadiga de Alertas
    ├── Alertas irrelevantes
    ├── Alertas repetidos
    ├── Alertas sem ação
    ├── Alertas ignorados
    ├── Alertas falsos positivos
    ├── Excesso por módulo
    ├── Excesso por agente
    ├── Alertas sem fechamento
    └── Ruído operacional
```

---

# 4. Fase 1 | Implementar os 75% principais

A Fase 1 deve consolidar o que já está mais claro e mais urgente.

## 4.1 Objetivo da Fase 1

Criar uma Central de Monitoramento forte, navegável, visual e operacional, mesmo que ainda com dados simulados ou placeholders onde for necessário.

## 4.2 Blocos da Fase 1

```text
01. Painel Principal / Visão Geral
02. Infraestrutura e Rede
03. Execução Local
04. Backend e Supabase
05. Dados, Memória e Acervo
06. IA e Agentes
07. Sensor de Qualidade
08. Automações e Integrações
09. Frontend e Deploys
10. Custos e Consumo
11. Segurança e Backup
16. Alertas, Incidentes e Eventos
17. Central de Notificações
18. Responsáveis e Ação Inteligente
```

## 4.3 Por que estes entram primeiro

Esses blocos respondem às perguntas mais críticas:

- a máquina está saudável?
- a internet está funcionando?
- o que está rodando localmente?
- o Supabase está íntegro?
- os dados e memórias estão preservados?
- os agentes estão ativos?
- as APIs estão saudáveis?
- os custos estão sob controle?
- existe risco de segurança?
- existem backups?
- quem precisa ser avisado?
- quem é responsável?
- o que virou BO?
- o que precisa virar tarefa?

---

# 5. Fase 2 | Completar governança, módulos e padrões

A Fase 2 completa a parte que vem do relatório geral de auditoria dos módulos.

## 5.1 Blocos da Fase 2

```text
12. Central de Padrões e Conformidade
13. Saúde Modular do SagB
14. Relações e Dependências
15. Esteira e Metodologia
20. Fadiga de Alertas
```

## 5.2 O que entra nessa fase

- inventário modular completo;
- módulos registrados e não registrados;
- módulos inativos;
- módulos sem owner;
- módulos críticos;
- maturidade por módulo;
- lacunas de README, PLANNED, docs, services, hooks, store e types;
- relações entre módulos;
- duplicidades;
- riscos do ecossistema modular;
- conformidade com a Central de Padrões;
- saúde da esteira;
- qualidade decisória;
- fadiga de alertas.

---

# 6. Fase 3 | Painel montável, telas e modo comando

A Fase 3 transforma a Central de Monitoramento em um painel configurável de operação.

## 6.1 Recursos esperados

- cards arrastáveis;
- cards redimensionáveis;
- múltiplas telas salvas;
- tela 1, tela 2, tela 3 e tela 4;
- presets de monitoramento;
- modo TV;
- modo fullscreen;
- cards fixados;
- visual por severidade;
- modo incidente;
- detalhe lateral ao clicar;
- histórico por card;
- ação rápida por card;
- layout salvo por usuário;
- layout salvo por contexto;
- layout para notebook;
- layout para TV 32";
- layout para TV 50".

## 6.2 Presets recomendados

```text
Preset 1 | Operação Crítica
- Score geral de saúde
- Internet
- Execução local
- Alertas críticos
- Incidentes ativos
- Notificações pendentes
- Responsáveis
- Supabase

Preset 2 | Infraestrutura e Dados
- Infraestrutura
- Internet
- Tailscale/VPN
- Backend/Supabase
- Storage
- Dados e memória
- Backup
- Segurança

Preset 3 | Agentes e IA
- IA e agentes
- Sensor de qualidade
- Atividade dos agentes
- Uso de IA
- Tokens
- Custos de IA
- Agentes pausados
- Silêncio operacional

Preset 4 | Governança e Padrões
- Central de Padrões
- Saúde modular
- Relações e dependências
- Esteira metodológica
- Qualidade decisória
- Conformidade visual
- Fadiga de alertas
- Módulos críticos
```

---

# 7. Fase 4 | Integração real e contrato de observabilidade

A Fase 4 deve consolidar a Central como camada oficial de observabilidade entre os módulos.

## 7.1 Contrato de Observabilidade do SagB

Todo módulo relevante deve conseguir emitir um pacote padronizado para a Central de Monitoramento.

Campos esperados:

```text
evento
métrica
alerta
status
incidente
ação recomendada
responsável
origem
severidade
timestamp
link para detalhe
```

## 7.2 Regras do contrato

1. Todo alerta precisa ter severidade.
2. Todo alerta precisa ter origem.
3. Todo alerta precisa ter responsável ou lacuna de responsável.
4. Evento não é alerta.
5. Alerta não é incidente.
6. Incidente exige acompanhamento e fechamento.
7. Logs brutos não devem entupir a Central.
8. A Central guarda resumo, índice, status e link para origem.
9. Ação corretiva vai para o TaskZei.
10. A Central de Padrões define limites e critérios.

---

# 8. Módulos que devem alimentar a Central de Monitoramento

A Central deve receber dados, eventos ou alertas principalmente de:

```text
central_padroes
taskzei
sala-dev
cid
hub-integracao
api_sagb
mcp_sagb
sagb_bridge
nucleo_de_agentes
quadro_de_elite
rai
nagi
studio
gestao_financeira
crm_ziplia
configuracoes-ambiente
monitoramento
_orquestracao-principal
```

A Central não precisa guardar tudo desses módulos.
Ela precisa receber os sinais relevantes.

---

# 9. Regras de responsabilidade

Cada alerta deve ter:

- origem;
- severidade;
- responsável primário;
- responsável secundário, quando existir;
- status;
- horário de abertura;
- último evento;
- ação recomendada;
- link para detalhe;
- opção de abrir tarefa no TaskZei;
- opção de acionar agente responsável;
- opção de registrar decisão.

---

# 10. Tipos de status

```text
online
saudável
atenção
alerta
crítico
offline
desconhecido
pausado
em verificação
sem sinal
em atraso
em execução
travado
resolvido
```

---

# 11. Severidade recomendada

```text
info       = apenas informativo
baixo      = desvio leve, sem impacto imediato
médio      = exige acompanhamento
alto       = exige ação rápida
crítico    = exige ação imediata
```

---

# 12. Matriz de implantação por prioridade

| Prioridade | Bloco | Fase | Tipo |
|---|---|---:|---|
| Crítica | Infraestrutura e Rede | 1 | operacional |
| Crítica | Execução Local | 1 | operacional |
| Crítica | Backend e Supabase | 1 | dados |
| Crítica | Dados, Memória e Acervo | 1 | inteligência |
| Crítica | Alertas, Incidentes e Eventos | 1 | resposta |
| Alta | Central de Notificações | 1 | resposta |
| Alta | Responsáveis e Ação Inteligente | 1 | ação |
| Alta | IA e Agentes | 1 | inteligência |
| Alta | Custos e Consumo | 1 | financeiro operacional |
| Alta | Segurança e Backup | 1 | risco |
| Média | Central de Padrões e Conformidade | 2 | governança |
| Média | Saúde Modular do SagB | 2 | governança |
| Média | Relações e Dependências | 2 | arquitetura |
| Média | Esteira e Metodologia | 2 | metodologia |
| Média | Fadiga de Alertas | 2 | qualidade operacional |
| Média | Painel montável | 3 | UX operacional |
| Alta | Contrato de Observabilidade | 4 | arquitetura sistêmica |

---

# 13. Recomendação final

A Central de Monitoramento deve evoluir em duas linhas ao mesmo tempo:

```text
Linha 1: painel operacional para enxergar e agir agora.
Linha 2: arquitetura de observabilidade para conectar todo o SagB no futuro.
```

A Fase 1 precisa ser forte visualmente e útil operacionalmente.
A Fase 2 fecha os pontos de governança e auditoria modular.
A Fase 3 transforma a tela em painel configurável.
A Fase 4 pluga os módulos via contrato de observabilidade.

A frase final da Central deve ser:

```text
A Central de Monitoramento não mostra apenas se o sistema está ligado.
Ela mostra se o SagB está saudável, seguro, conectado, rastreável, responsável e capaz de agir.
```
