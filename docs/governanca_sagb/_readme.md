# Governança SagB

Esta pasta consolida a governança oficial do SagB sem duplicar documentação existente.

## Princípios

- A fonte de verdade técnica e histórica permanece em:
  - `DEV_LOG.md`
  - `docs/modular-map/HISTORICO_MODULOS.md`
  - `docs/modular-map/modules/*.md`
  - `src/core/modules/moduleRegistry.ts`
- Esta pasta referencia e organiza; não replica conteúdo.

## Arquitetura oficial dos documentos

### 1) Normas oficiais (mandatórias)

1. `padrao_modulos_plugaveis.md` — contrato técnico oficial de módulos plugáveis no runtime SagB.
2. `padrao_postura_e_conduta_agentes.md` — conduta obrigatória dos agentes.
3. `protocolo_log_continuo_agentes.md` — protocolo obrigatório de rastreabilidade por turno.

### 2) Governança operacional (gestão contínua)

1. `catalogo_unico_governanca.md` — inventário macro e classificação dos itens de governança.
2. `mapa_equivalencia_runtime_docs.md` — equivalência runtime x documentação macro.
3. `owners_e_accountability.md` — matriz de responsáveis por item.
4. `decisoes_e_pendencias.md` — trilha executiva de decisões e débitos abertos.

### 3) Templates de apoio (aceleradores)

1. `template_session_log_agente.md` — modelo de início para novos logs de agente.
2. `qg_modulos_vendaveis_template.md` — guia de origem QG -> produto vendável.

## Fronteira de responsabilidade documental (anti-duplicação)

- `padrao_modulos_plugaveis.md`: contrato técnico único para módulos plugáveis no runtime SagB.
- `qg_modulos_vendaveis_template.md`: fluxo de origem e transformação de ativos em `_qgs/` para módulos vendáveis (QG -> produto).
- `catalogo_unico_governanca.md`: inventário macro e classificação oficial dos itens de governança.
- `owners_e_accountability.md`: matriz de responsáveis por item (owner principal/backup).
- `decisoes_e_pendencias.md`: trilha executiva de decisão e débito aberto.
- `template_session_log_agente.md`: apenas template, não substitui protocolo oficial.

## Classificação oficial

- Módulo oficial
- Frente interna
- Camada técnica
- Papel institucional

## Status de completude por item

- EXISTE
- PARCIAL
- NAO_EXISTE

## Regra de atualização

Toda mudança estrutural relevante no SagB deve atualizar:

1. histórico (`DEV_LOG.md` e/ou `HISTORICO_MODULOS.md`)
2. catálogo de governança (quando afetar classificação, equivalência ou responsabilidade)
3. owners/accountability (quando afetar alçada ou responsabilidade)
4. decisões/pendências (quando houver definição executiva ou débito relevante)
5. protocolo de log contínuo de agentes (quando afetar registro de conversa, sessão ou rastreabilidade operacional)
