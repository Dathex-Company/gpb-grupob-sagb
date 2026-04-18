# Catálogo Único de Governança de Módulos — SagB

## Objetivo

Consolidar classificação, contexto e rastreabilidade dos itens do SagB em camada única de governança, sem duplicar a base documental já existente.

## Tabela mestre

| governance_id | tipo | nome_oficial | nome_exibicao | status_item | status_completude | contexto_oficial | historico_oficial | runtime_ref | docs_ref | observacoes |
|---|---|---|---|---|---|---|---|---|---|---|
| GOV-MOD-001 | modulo_oficial | Agenda Inteligente | Agenda Inteligente | ativo | PARCIAL | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/taskzei` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` | Runtime existe; documentação aparece de forma adjacente em Operação/Frentes |
| GOV-MOD-002 | modulo_oficial | NIC | NIC | ativo | PARCIAL | `docs/modular-map/modules/12-ric.md` (alias histórico) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/nic` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/12-ric.md` | Normalizar nomenclatura oficial NIC x RIC |
| GOV-MOD-003 | modulo_oficial | RAI | RAI | ativo | PARCIAL | `docs/modular-map/modules/12-ric.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/rai` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/12-ric.md` | Definir separação formal entre RAI e RIC/NIC no mapa macro |
| GOV-MOD-004 | modulo_oficial | Central de Mentorias | Central de Mentorias | ativo | PARCIAL | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/mentorias` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` | Módulo runtime ativo ainda sem ficha macro dedicada explícita |
| GOV-MOD-005 | modulo_oficial | Configurações do Ambiente | Configurações do Ambiente | ativo | PARCIAL | `docs/modular-map/modules/01-plataforma-base-e-shell.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/configuracoes-ambiente` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/01-plataforma-base-e-shell.md` | Decidir enquadramento final como módulo oficial ou camada técnica |
| GOV-MOD-006 | modulo_oficial | Telas Avançadas | Telas Avançadas | ativo | PARCIAL | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/telas-avancadas` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` | Definir permanência como módulo oficial ou frente interna |
| GOV-MOD-007 | modulo_oficial | Monitoramento | Monitoramento | ativo | PARCIAL | `docs/modular-map/modules/10-sensor-de-qualidade.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/monitoramento` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/10-sensor-de-qualidade.md` | Definir fronteira oficial entre Monitoramento e Sensor de Qualidade |
| GOV-MOD-008 | modulo_oficial | Núcleo de Metodologias | Núcleo de Metodologias | ativo | PARCIAL | `docs/modular-map/modules/04-governanca-black-vault-e-metodologia.md` | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/metodologias` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/04-governanca-black-vault-e-metodologia.md` | Definir limite entre módulo oficial e frente interna de Governança |
| GOV-MOD-009 | modulo_oficial | Missões | Missões | ativo | PARCIAL | `docs/ESTRATEGIA_MISSOES_MOTOR_OFICIAL.md` + `docs/modular-map/modules/06-operacao-e-frentes-de-negocio.md` (adjacência) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `src/modules/missoes` + `src/core/modules/moduleRegistry.ts` | `docs/ESTRATEGIA_MISSOES_MOTOR_OFICIAL.md` | Runtime existe; consolidar posição macro dedicada no modular-map |
| GOV-MOD-010 | modulo_oficial | Núcleo Conversacional | Núcleo Conversacional | ativo | EXISTE | `docs/modular-map/modules/03-nucleo-conversacional.md` | `src/modules/nucleo-conversacional/changelog.md` | `src/modules/nucleo-conversacional` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/03-nucleo-conversacional.md` | Manifesto base documentado. Código ainda pendente de migração para a nova pasta. |
| GOV-MOD-011 | modulo_oficial | C.I.D. | C.I.D. | ativo | EXISTE | `docs/modular-map/modules/07-cid.md` | `src/modules/cid/changelog.md` | `src/modules/cid` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/modules/07-cid.md` | Manifesto base e Ficha documentada. Código e componentes pendentes de refatoração. |
| GOV-FRT-001 | frente_interna | Backup e Segurança | Backup e Segurança | ativo | PARCIAL | `docs/modular-map/modules/04-governanca-black-vault-e-metodologia.md` | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `components/GovernanceView.tsx` | `docs/modular-map/modules/04-governanca-black-vault-e-metodologia.md` | Frente interna vinculada à Governança, não módulo oficial |
| GOV-CAM-001 | camada_tecnica | Runtime Modular | Runtime Modular | ativo | EXISTE | `src/core/modules/module.types.ts` + `src/core/modules/moduleRegistry.ts` | `docs/modular-map/HISTORICO_MODULOS.md` | `src/core/modules/*` | `docs/modular-map/_readme.md` | Contrato de módulo plugável já formalizado em código |
| GOV-CAM-002 | camada_tecnica | Camada de Histórico e Auditoria | Histórico e Auditoria | ativo | EXISTE | `src/modules/central_padroes/docs/_readme.md` + `tools/check-history.mjs` | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | `tools/check-history.mjs` | `src/modules/central_padroes/docs/_readme.md` | Protocolo de histórico sistêmico já definido e operacional |
| GOV-CAM-003 | camada_tecnica | Protocolo de Log Contínuo de Agentes | Log Contínuo de Agentes | ativo | EXISTE | `docs/governanca/protocolo_log_continuo_agentes.md` | Logs por agente/módulo (`agent/session-log.md`) | `src/modules/*/agent/session-log.md` | `docs/governanca/protocolo_log_continuo_agentes.md` | Define o padrão de registro turno a turno para conversas operacionais de agentes |
| GOV-PAP-001 | papel_institucional | Orquestração Sistêmica | Pierre Zanulli | ativo | PARCIAL | Diretriz executiva de governança (conversa e catálogo) | `DEV_LOG.md` (quando aplicável) | N/A | `docs/governanca/*` | Formalizar escopo decisório e integração com owners de módulo |
| GOV-PAP-002 | papel_institucional | Execução Técnica | Cássio Mendes | ativo | PARCIAL | `DEV_LOG.md` (responsável técnico) | `DEV_LOG.md` + `docs/modular-map/HISTORICO_MODULOS.md` | N/A | `DEV_LOG.md` | Papel já citado; falta matriz formal owner por item |
| GOV-PAP-003 | papel_institucional | Direção Estratégica | Douglas Rodrigues | ativo | PARCIAL | `DEV_LOG.md` (chairman) | `DEV_LOG.md` | N/A | `DEV_LOG.md` | Papel estratégico existe; falta vínculo formal com decisões por item |

## Legenda de tipo

- `modulo_oficial`
- `frente_interna`
- `camada_tecnica`
- `papel_institucional`

## Legenda de status_item

- `ativo`
- `scaffoldado`
- `legado`
- `descontinuado`

## Legenda de status_completude

- `EXISTE`
- `PARCIAL`
- `NAO_EXISTE`

## Nota operacional da Sprint 0

Este catálogo é de consolidação por referência. Owners principal/backup, decisões, pendências e logs contínuos auditáveis devem ser detalhados sem quebrar as fontes oficiais já vigentes.
