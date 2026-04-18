# Owners e Accountability — SagB

## Objetivo

Formalizar responsabilidade humana por item de governança, com owner principal e owner backup, sem duplicar documentação técnica existente.

## Papéis institucionais (camada transversal)

| papel_id | papel_institucional | titular_atual | escopo_macro | status |
|---|---|---|---|---|
| PAP-001 | Orquestração Sistêmica | Pierre Zanulli | coerência geral do SagB, direcionamento e continuidade executiva | ATIVO |
| PAP-002 | Coordenação Executiva / QG | Efron Torres | coordenação de priorização e integração entre frentes (a formalizar por item) | PARCIAL |
| PAP-003 | Execução Técnica | Cássio Mendes | implementação técnica e entrega operacional | ATIVO |
| PAP-004 | Direção Estratégica | Douglas Rodrigues | validação estratégica de alto impacto e diretrizes de chairman | ATIVO |

## Matriz inicial de owners por item (Sprint 1)

> Convenções:
> - `PARCIAL`: existe referência de papel, mas dono formal por item ainda precisa de confirmação executiva.
> - `A DEFINIR`: sem confirmação explícita na base atual.

| governance_id | item | tipo | owner_principal | owner_backup | apoio_qg | status_accountability | observacoes |
|---|---|---|---|---|---|---|---|
| GOV-MOD-001 | Agenda Inteligente | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente nomeação explícita por módulo |
| GOV-MOD-002 | NIC | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente alinhamento NIC/RAI/RIC |
| GOV-MOD-003 | RAI | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente definição de fronteira com RIC/NIC |
| GOV-MOD-004 | Central de Mentorias | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente nomeação formal |
| GOV-MOD-005 | Configurações do Ambiente | modulo_oficial (a confirmar) | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente classificação final |
| GOV-MOD-006 | Telas Avançadas | modulo_oficial (a confirmar) | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente decisão módulo vs frente |
| GOV-MOD-007 | Monitoramento | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente definição com Sensor de Qualidade |
| GOV-MOD-008 | Núcleo de Metodologias | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | pendente limite com Governança |
| GOV-MOD-009 | Missões | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | runtime ativo; pendente owner formal |
| GOV-MOD-010 | Núcleo Conversacional | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | doc técnica em módulo, falta mover código |
| GOV-MOD-011 | C.I.D. | modulo_oficial | A DEFINIR | A DEFINIR | Efron Torres (QG) | PARCIAL | doc técnica em módulo, falta mover componentes legados |
| GOV-FRT-001 | Backup e Segurança | frente_interna | Pierre Zanulli (orquestração) | A DEFINIR | Efron Torres (QG) | PARCIAL | frente interna dentro de Governança |
| GOV-CAM-001 | Runtime Modular | camada_tecnica | Cássio Mendes | A DEFINIR | Pierre Zanulli | PARCIAL | owner técnico principal identificado; backup pendente |
| GOV-CAM-002 | Histórico e Auditoria | camada_tecnica | Cássio Mendes | A DEFINIR | Pierre Zanulli | PARCIAL | trilha técnica existe; backup pendente |
| GOV-PAP-001 | Orquestração Sistêmica | papel_institucional | Pierre Zanulli | Efron Torres (QG) | N/A | PARCIAL | formalizar escopo decisório em termo único |
| GOV-PAP-002 | Execução Técnica | papel_institucional | Cássio Mendes | A DEFINIR | Pierre Zanulli | PARCIAL | definir backup de execução técnica |
| GOV-PAP-003 | Direção Estratégica | papel_institucional | Douglas Rodrigues | Pierre Zanulli | N/A | PARCIAL | formalizar trilha de validação por impacto |

## Regra mínima de accountability (válida a partir desta versão)

1. Todo item estratégico deve ter `owner_principal` e `owner_backup`.
2. Item sem backup permanece com status `PARCIAL`.
3. Decisão sem responsável explícito não deve ser considerada “fechada”.
