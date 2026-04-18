# Diretriz de Refatoração de Módulo — Núcleo Conversacional

## Objetivo
Padronizar o módulo `nucleo-conversacional` ao formato novo oficial do SagB, com foco em:
- topo visual com `Docs + Responsável`;
- tipografia leve (`12px` nas áreas operacionais);
- coerência entre UI e documentação modular.

## Fonte de Verdade
Antes de executar qualquer refatoração, ler obrigatoriamente:
1. `manifest.ts`
2. `module-doc.ts`
3. `agent/persona.md`
4. `agent/owner.md`

## Tarefas Obrigatórias da Refatoração

### 1) Topo do módulo
- Inserir botão `Docs` no topo da view principal do módulo.
- Inserir bloco visível de responsável no formato:
  - `Responsável: Poazi Bellini`

### 2) Modal/Leitura de docs
- O botão `Docs` deve abrir a documentação técnica do módulo baseada em `module-doc.ts`.
- O conteúdo mínimo deve exibir:
  - fontes de dados;
  - integrações;
  - ativos reutilizáveis;
  - riscos de duplicação.

### 3) Padrão visual leve
- Usar tipografia operacional em `12px` nas áreas principais de leitura.
- Evitar sombras pesadas e ruído visual.
- Manter aderência ao layout já consolidado no piloto (`nucleo_de_agentes` e `central_padroes`).

### 4) Governança obrigatória
- Registrar decisões estruturais em `decisions.md`.
- Registrar cada turno de execução em `agent/session-log.md`.
- Atualizar `changelog.md` com resumo objetivo do que foi alterado.

## Critério de Conclusão
Esta diretriz é considerada cumprida quando:
- o topo exibir `Docs + Responsável`;
- o `Docs` abrir dados reais de `module-doc.ts`;
- o visual estiver alinhado ao padrão oficial;
- documentação e log estiverem atualizados.
