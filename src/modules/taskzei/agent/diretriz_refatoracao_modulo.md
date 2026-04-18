# diretriz_refatoracao_modulo — taskzei

## objetivo
orientar a evolucao tecnica do modulo `taskzei` (`agenda_inteligente`) com execucao autonoma em novo chat.

## ordem de leitura obrigatoria
1. `src/modules/taskzei/decisions.md`
2. `src/modules/taskzei/changelog.md`
3. `src/modules/taskzei/history_chat.md`
4. `src/modules/taskzei/agent/dani_freitas_diretora/persona.md`
5. `src/modules/taskzei/agent/dani_freitas_diretora/owner.md`
6. `src/modules/taskzei/agent/prompt_ativacao_cline.md`

## comandos sugeridos
1. mapear estado atual:
   - `list_files src/modules/taskzei recursive=true`
2. validar contratos e fronteiras:
   - `read_file src/modules/taskzei/types/taskzei.contracts.ts`
   - `read_file src/modules/taskzei/services/taskzei.facade.ts`
3. registrar decisoes e evolucao:
   - atualizar `decisions.md` e `changelog.md`

## regras
- usar somente lowercase com `_`.
- manter rastreabilidade em `agent/session_log.md`.
- responder sempre em: diagnostico -> recomendacao -> proximos_passos.
