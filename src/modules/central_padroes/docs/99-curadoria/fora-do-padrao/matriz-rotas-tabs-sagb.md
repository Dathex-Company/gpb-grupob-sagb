# SagB by Loze | Matriz de rotas e tabs

**Etapa:** ET-02  
**Objetivo:** registrar o estado atual da navegação sem alterar rotas.

---

## 1. Regra operacional

O SagB usa uma combinação de tabs internas em `App.tsx` e rotas declaradas em módulos plugáveis. Nesta etapa nenhuma rota foi alterada.

## 2. Tabs principais do shell

| Tab | Função | Status | Arquivo principal | Observação |
|---|---|---|---|---|
| `home` | Dashboard inicial | core | `components/DashboardHome.tsx` | Shell core |
| `ecosystem` | Hub de unidades | core/parcial | `components/HubView.tsx` | Alias de `hub` |
| `hub` | Alias legado | legado | `App.tsx` | Redireciona conceitualmente para ecosystem |
| `management` | Gestão legada | legado-protegido | `components/ManagementView.tsx` | Golden Seal |
| `programmers-room` | Fallback Sala Dev | legado | `App.tsx` | Renderiza Sala Dev nova |
| `unit-room` | Sala de unidade | parcial | `components/UnitView.tsx` | Depende de BU ativa |
| `nucleo-conversacional` | Conversas | parcial | `src/modules/nucleo-conversacional/pages/ConversationsView.tsx` | Tab nova |
| `conversations` | Conversas legado/registry id | confuso | `src/modules/nucleo-conversacional/` | Deve virar alias documentado |
| `governance` | Governança | confuso/core legado | `components/GovernanceView.tsx` | Sobrepõe Central/Núcleo |
| `intelligence-flow` | Fluxos IA | parcial | `components/IntelligenceFlowView.tsx` | Candidato a módulo formal |
| `missions` | Missões | parcial | `components/AgentMissionsView.tsx` | Também existe módulo `missoes` |
| `nagi` | NAGI | parcial | `src/modules/nagi/` | Também há componente legado |
| `nic` | NIC | lab | `src/modules/nic/` | Docs mockadas |
| `cid` | CID | core | `components/CIDView.tsx`, `src/modules/cid/` | Duplicidade componente/módulo |
| `continuous-memory` | Memória contínua | parcial | `components/ContinuousMemoryView.tsx` | Fora do registry |
| `monitoramento` | Monitoramento | parcial | `components/MonitoramentoView.tsx`, `src/modules/monitoramento/` | Duplicidade shell/módulo |
| `alignment` | Alinhamento | parcial | `components/AlignmentView.tsx` | Área BU/Governance |
| `quadro_de_elite` | Gestão oficial de agentes | core | `components/AgentFactory.tsx`, `src/modules/quadro_de_elite/` | Fonte canônica recomendada |
| `team` | Visão global de agentes | legado-protegido | `components/SystemicVision.tsx` | Golden Seal indireto |
| `chat-room` | Chat com agente | legado-protegido | `components/SystemicVision.tsx` | Golden Seal |
| `vault` | Backlog/cofre | parcial/confuso | `components/BacklogView.tsx` | Nome ambíguo |
| `ventures` | Ventures | parcial | `components/VenturesView.tsx` | Relacionar a Cadastro Empresas |
| `redir` | Operação compartilhada | pendente | `App.tsx` | Validar função |
| `requests` | Operação compartilhada | pendente | `App.tsx` | Validar função |
| `3forb-home` | Home 3forB | parcial | `components/ThreeForBView.tsx` | QG/empresa |
| `audacus-home` | Home Audacus | parcial | `components/AudacusView.tsx` | QG/venture |
| `startyb-home` | Home StartyB | parcial | `components/StartyBView.tsx` | QG/unidade tech |

## 3. Rotas base de módulos plugáveis

| Manifest id | Base route | Módulo | Status rota | Observação |
|---|---|---|---|---|
| `api-sagb` | `/api-sagb` | API SagB | ativa | Usa wildcard em routes |
| `hub-integracao` | `/hub-integracao` | Hub Integração | ativa | Sem wildcard |
| `agentes_comerciais` | `/agentes-comerciais` | Agentes Comerciais | lab | Naming id vs route difere |
| `cadastro-empresas` | `/cadastro-empresas` | Cadastro Empresas | ativa | Kebab-case |
| `conversations` | `/conversas` | Núcleo Conversacional | confusa | Id difere de tab `nucleo-conversacional` |
| `nucleo_de_agentes` | `/nucleo_de_agentes` | Núcleo de Agentes | ativa | Snake_case em rota |
| `central_padroes` | `/central_padroes` | Central de Padrões | ativa | Snake_case em rota |
| `monitoramento` | `/monitoramento` | Monitoramento | ativa | Também há componente legado |
| `nagi` | `/nagi` | NAGI | ativa | OK |
| `nic` | `/nic` | NIC | ativa | OK |
| `quadro_de_elite` | `/quadro_de_elite` | Quadro de Elite | ativa | Snake_case |
| `sala-dev` | `/sala-dev` | Sala Dev | ativa | OK |
| `mentorias` | `/mentorias` | Mentorias | ativa | OK |
| `metodologias` | `/metodologias` | Metodologias | ativa | OK |
| `missions` | `/missoes` | Missões | confusa | Id inglês, rota PT-BR |
| `rai` | `/rai` | RAI | ativa | OK |
| `karaoke` | `/karaoke` | Karaokê | ativa | OK |
| `studio` | `/studio` | Studio | ativa | OK |
| `cid` | `/cid` | CID | ativa | OK |
| `agenda` | `/agenda-inteligente` | TaskZei | confusa | Id difere do nome do módulo |
| `crm-ziplia` | `/crm-ziplia` | CRM Ziplia | ativa | OK |
| `configuracoes-sistema` | `/configuracoes` | Configurações | hidden | Item oculto no Sidebar |
| `gestao-financeira` | `/gestao-financeira` | Financeiro | ativa | OK |
| `telas-avancadas` | `/telas-avancadas` | Telas Avançadas | lab | OK |
| `videos-ia` | `/videos-ia` | Vídeos IA | lab | OK |
| `foco-total` | `/foco-total` | Foco Total | lab | Wildcard |
| `sagb_bridge` | `/sagb_bridge` | SagB Bridge | lab | Snake_case |
| `mcp_sagb` | `/mcp_sagb` | MCP SagB | lab | Snake_case |
| `fluxob` | `/fluxob` | FluxoB | lab | Wildcard |

## 4. Itens para decisão futura

1. Definir padrão de id de módulo: kebab-case, snake_case ou manter compatibilidade.
2. Separar formalmente tab interna de rota URL.
3. Documentar aliases legados aceitos.
4. Evitar criação de novas tabs sem registro documental.
5. Avaliar modularização de Continuous Memory e Intelligence Flow.
