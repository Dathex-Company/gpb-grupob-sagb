# Changelog - Núcleo de Agentes

Todas as mudanças relevantes no módulo Núcleo de Agentes serão registradas aqui.

## [Unreleased]
- Criação inicial da estrutura modular do Núcleo de Agentes.
- Implementação da tela `BaseDosAgentesView` com as 7 camadas estruturais.
- Implementação piloto do botão `Docs` com modal de documentação técnica operacional.
- Implementação piloto do padrão de topo com `Docs` + `Responsável`.
- Definição de `Brene Sagore` como responsável visível do módulo.
- Ajuste tipográfico leve piloto com textos operacionais em `12px`.
- Migração do identificador técnico do módulo para `nucleo_de_agentes`.
-
- ## [2.0.0] - 2026-07-07
- ### Fusão: Quadro de Elite → Núcleo de Agentes
- - **Fusão completa** do módulo `quadro_de_elite` (CRUD de agentes) dentro do `nucleo_de_agentes`.
- - **Owner alterado** para `Helen Dravet` (antes: Brene Sagore).
- - **Ícone alterado** para `UsersIcon` (antes: `ShieldCheckIcon`).
- - **Rede de rota**: `quadro_de_elite` → alias → `nucleo_de_agentes` (redirect via App.tsx tabAliases).
- - **ModuleRegistry**: `quadro_de_elite` removido da lista de módulos registrados.
- - **Nova store**: `store/runtimeBridge.ts` injeta contexto de runtime (agents, BUs, ventures) via `setNucleoDeAgentesRuntimeContext`.
- - **Contrato único**: `getAgentRuntimeProfile()` — perfil completo de agente para consumo do Núcleo Conversacional.
- - **Página unificada**: `NucleoAgentesPage.tsx` com abas `Identidades` (AgentFactory CRUD) e `DNA` (BaseDosAgentesView).
- - **Componentes copiados**: `AgentFactory.tsx` + `agent-factory/` (CRUD completo, importação em lote, validação).
- - **Artefatos copiados**: `docs/`, `plans/`, `changelog-qe.md` do antigo módulo.