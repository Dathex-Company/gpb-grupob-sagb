# Diretriz de Refatoração de Módulo — Quadro de Elite

## Objetivo
Conduzir a migração do legado `AgentFactory` para o módulo `quadro_de_elite` no padrão novo oficial do SagB.

## Fonte de Verdade
Antes de executar qualquer refatoração, ler obrigatoriamente:
1. `manifest.ts`
2. `module-doc.ts`
3. `agent/persona.md`
4. `agent/owner.md`

## Tarefas Obrigatórias da Refatoração

### 1) Migrar legado para módulo oficial
- Mapear uso atual de `components/AgentFactory.tsx` e `components/agent-factory/*`.
- Mover a responsabilidade funcional para `src/modules/quadro_de_elite` (sem quebrar o fluxo atual do sistema).

### 2) Topo visual obrigatório
- Inserir no módulo o padrão `Docs + Responsável`.
- Exibir no topo:
  - `Responsável: Helen Dravet`

### 3) Botão Docs
- Botão `Docs` deve consumir informações reais de `module-doc.ts`.
- Exibir minimamente:
  - fontes de dados;
  - integrações;
  - ativos reutilizáveis;
  - riscos de duplicação.

### 4) Padrão visual e governança
- Aplicar tipografia operacional em `12px`.
- Evitar excesso de sombras e ruído visual.
- Registrar decisões em `decisions.md`.
- Registrar turnos em `agent/session-log.md`.
- Atualizar `changelog.md` com resumo objetivo.

## Critério de Conclusão
Diretriz concluída quando:
- o Quadro de Elite estiver em módulo próprio com base funcional ativa;
- o topo exibir `Docs + Responsável`;
- o `Docs` abrir documentação de `module-doc.ts`;
- documentação de governança estiver atualizada.
