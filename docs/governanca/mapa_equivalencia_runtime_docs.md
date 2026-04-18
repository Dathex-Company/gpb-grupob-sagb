# Mapa de Equivalência Runtime x Documentação — SagB

## Objetivo

Eliminar desalinhamento entre módulos em runtime e módulos de arquitetura/documentação, sem duplicar as fontes já existentes.

## Equivalência

| id_runtime | pasta_runtime | nome_menu | modulo_macro_docs | status_equivalencia | classificacao | acao_recomendada |
|---|---|---|---|---|---|---|
| agenda-inteligente | `src/modules/taskzei` | Agenda Inteligente | `06-operacao-e-frentes-de-negocio.md` (adjacente) | PARCIAL | modulo_oficial | Formalizar equivalência canônica (módulo próprio ou vinculação oficial em Operação) |
| nic | `src/modules/nic` | NIC | `12-ric.md` | PARCIAL | modulo_oficial | Normalizar nomenclatura oficial para NIC e manter RIC como alias histórico |
| rai | `src/modules/rai` | RAI | `12-ric.md` (adjacente) | PARCIAL | modulo_oficial | Definir se RAI é módulo macro próprio ou subdomínio formal de RIC/NIC |
| mentorias | `src/modules/mentorias` | Central de Mentorias | `06-operacao-e-frentes-de-negocio.md` (adjacente) | PARCIAL | modulo_oficial | Criar correspondência macro dedicada para Mentorias |
| configuracoes-ambiente | `src/modules/configuracoes-ambiente` | Configurações do Ambiente | `01-plataforma-base-e-shell.md` (adjacente) | PARCIAL | modulo_oficial (a confirmar) | Decidir classificação final: módulo oficial ou camada técnica |
| telas-avancadas | `src/modules/telas-avancadas` | Telas Avançadas | `06-operacao-e-frentes-de-negocio.md` (adjacente) | PARCIAL | modulo_oficial (a confirmar) | Decidir permanência como módulo oficial ou reclassificar como frente interna |
| monitoramento | `src/modules/monitoramento` | Monitoramento | `10-sensor-de-qualidade.md` (adjacente) | PARCIAL | modulo_oficial | Definir fronteira oficial entre Monitoramento e Sensor de Qualidade |
| metodologias | `src/modules/metodologias` | Núcleo de Metodologias | `04-governanca-black-vault-e-metodologia.md` | PARCIAL | modulo_oficial | Definir limite oficial entre módulo autônomo e frente interna de Governança |
| missions | `src/modules/missoes` | Missões | `06-operacao-e-frentes-de-negocio.md` (adjacente) + `docs/ESTRATEGIA_MISSOES_MOTOR_OFICIAL.md` | PARCIAL | modulo_oficial | Criar/validar posicionamento macro dedicado para Missões no modular-map |
| nucleo-conversacional | `src/modules/nucleo-conversacional` | Núcleo Conversacional | `03-nucleo-conversacional.md` | OK | modulo_oficial | O manifesto base e ficha documental foram consolidados. Código/componentes serão migrados incrementalmente no futuro. |

## Cobertura do mapa macro (13 domínios) versus runtime

| modulo_macro_docs | cobertura_runtime_atual | status |
|---|---|---|
| 01-plataforma-base-e-shell | `configuracoes-ambiente` (adjacente) | PARCIAL |
| 02-home-dashboard-e-hub | sem módulo runtime dedicado | PARCIAL |
| 03-nucleo-conversacional | `nucleo-conversacional` (manifesto e base doc) | OK |
| 04-governanca-black-vault-e-metodologia | `metodologias` (parcial) | PARCIAL |
| 05-cadastro-e-dna-de-agentes | sem módulo runtime dedicado (centrado em components) | PARCIAL |
| 06-operacao-e-frentes-de-negocio | `taskzei`, `mentorias`, `telas-avancadas`, `missoes` (adjacentes) | PARCIAL |
| 07-cid | sem módulo runtime dedicado em `src/modules` | PARCIAL |
| 08-memoria-continua | sem módulo runtime dedicado em `src/modules` | PARCIAL |
| 09-fluxo-de-inteligencia | sem módulo runtime dedicado em `src/modules` | PARCIAL |
| 10-sensor-de-qualidade | `monitoramento` (adjacente) | PARCIAL |
| 11-nagi | sem módulo runtime dedicado em `src/modules` | PARCIAL |
| 12-ric | `nic`, `rai` (adjacentes) | PARCIAL |
| 13-sagb-bridge | sem módulo runtime dedicado em `src/modules` | PARCIAL |

## Regras de equivalência

- `OK`: correspondência 1:1 validada entre runtime e documentação.
- `PARCIAL`: correspondência indireta, provisória ou com ambiguidade de escopo.
- `DESALINHADO`: conflito explícito de nomenclatura, escopo ou classificação.

## Critério de fechamento da Sprint 0

1. 100% dos módulos do runtime (`moduleRegistry.ts`) com linha de equivalência.
2. 100% dos domínios do mapa macro com status de cobertura.
3. Ações recomendadas preenchidas para todos os itens sem status `OK`.
