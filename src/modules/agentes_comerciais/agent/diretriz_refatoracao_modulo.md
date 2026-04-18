# diretriz_refatoracao_modulo — agentes_atendendes

## objetivo
orientar a criacao e evolucao tecnica do modulo `agentes_atendendes` com execucao autonoma em novo chat.

## ordem de leitura obrigatoria
1. `src/modules/agentes_atendendes/decisions.md`
2. `src/modules/agentes_atendendes/changelog.md`
3. `src/modules/agentes_atendendes/history_chat.md`
4. `src/modules/agentes_atendendes/agent/oton_lacerda_diretor/persona.md`
5. `src/modules/agentes_atendendes/agent/oton_lacerda_diretor/owner.md`
6. `src/modules/agentes_atendendes/agent/prompt_ativacao_cline.md`

## comandos sugeridos para iniciar implementacao
1. mapear arquivos existentes:
   - `list_files src/modules/agentes_atendendes recursive=true`
2. criar base tecnica do modulo (quando ausente):
   - `manifest.ts`
   - `index.ts`
   - `routes.tsx`
   - `module-doc.ts`
   - `pages/agentes_atendendes_page.tsx`
3. conectar no registry central de modulos.
4. registrar decisoes e evolucao no `changelog.md`.

## regras
- usar somente nomes em lowercase com `_`.
- separar crm de `agentes_atendendes` (integracao por contrato, sem acoplamento).
- responder sempre em: diagnostico -> recomendacao -> proximos_passos.
