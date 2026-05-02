# Plano do Módulo — SagB Bridge

## Objetivo
Tornar o SagB capaz de abrir tasks diretamente no VS Code, com resolução de projeto local,
criação de task runs, sincronização de status e envio de relatório final — sem embutir o VS Code
completo no SagB.

## Etapas de Evolução

### ET-01 ✅ Concluída — Definir arquitetura e contratos da ponte SagB x VS Code
- Documento canônico aprovado (sagbBridgeBlueprint.ts)
- Contratos de API validados (10 endpoints)
- Launch token e consumo definidos
- Modelo de task run e ownership fechado
- Assets: `data/sagbBridgeBlueprint.ts`, `docs/modular-map/modules/13-sagb-bridge.md`

### ET-02 🔄 Pendente — Criar extensão VS Code base
- Bootstrap da extensão `grupob.sagb-bridge`
- Comandos principais (abrir task, copiar prompt, etc.)
- SecretStorage para token
- Binding local por profileType
- Assets: `components/ProgrammersRoomView.tsx` (já existe como view avulsa)

### ET-03 ⏳ Pendente — Implementar deep link, pending launch e operação de runs
- URI handler (`vscode://grupob.sagb-bridge/open?launchToken=...`)
- Consume launch
- PendingLaunch (persistir antes de openFolder)
- Create ou resume run
- Atualização de status e report final

### ET-04 ⏳ Pendente — Criar backend mínimo e Sala dos Programadores
- Projects (listar)
- Tasks (listar, detalhar)
- Task launches (gerar token)
- Task runs (criar, retomar, reportar)
- Histórico técnico visível no SagB
- Assets: `supabase/migrations/20260313000103_sagb_bridge_core.sql` (5 tabelas já criadas)

## Assets Existentes

| Asset | Tipo | Localização |
|-------|------|-------------|
| Blueprint completo | typescript | `data/sagbBridgeBlueprint.ts` |
| View avulsa (Sala dos Programadores) | componente React | `components/ProgrammersRoomView.tsx` |
| Migrations (5 tabelas) | SQL | `supabase/migrations/20260313000103_sagb_bridge_core.sql` |
| Documentação no mapa modular | markdown | `docs/modular-map/modules/13-sagb-bridge.md` |

## Fórmula Operacional
- SagB = sala de comando
- VS Code = base operacional
- SagB Bridge = ponte oficial
- Codex = operador assistido dentro do VS Code
