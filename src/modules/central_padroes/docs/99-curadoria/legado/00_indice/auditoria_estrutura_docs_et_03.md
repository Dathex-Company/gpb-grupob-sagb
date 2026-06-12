# ET-03 | Auditoria rápida da estrutura de documentação

**Escopo:** `src/modules/central_padroes/docs/`  
**Objetivo:** classificar estrutura atual e recomendar organização sem quebrar links.

---

## 1) Estrutura encontrada

Arquivos existentes na raiz de `docs/`:

- `_readme.md`
- `design-system.md`
- `stack-e-infra.md`
- `deploy-ambientes-e-esteira.md`
- `loze-docs-indice-canonico-sagb.md`
- `matriz-canonica-modulos-sagb.md`
- `matriz-rotas-tabs-sagb.md`
- `inventario-supabase-sagb.md`
- `inventario-netlify-functions-sagb.md`
- `arquitetura-modulos-plugaveis-sagb.md`
- `modelo-module-doc-loze-das.md`
- `QUARENTENA_TECNICA.md`
- `decisoes-para-adr-et-02.md`
- `validacao-et-02.md`

## 2) Diagnóstico

- Há base boa de ET-02, porém **documentos estão soltos na raiz**.
- Mover arquivos agora pode quebrar referências externas e histórico.
- Estratégia segura para ET-03: **preservar originais na raiz e criar documentos canônicos nas novas pastas**, apontando referência.

## 3) Destino recomendado por arquivo

| Arquivo atual | Destino lógico na nova estrutura | Ação recomendada agora | Risco de quebrar link | Observação |
|---|---|---|---|---|
| `_readme.md` | raiz (`_readme.md`) | atualizar como porta de entrada | baixo | já atualizado na ET-03 |
| `design-system.md` | `01_padroes_loze/` | referenciar no mapa; não mover | médio | possível uso em links existentes |
| `stack-e-infra.md` | `01_padroes_loze/` | referenciar; não mover | médio | histórico útil |
| `deploy-ambientes-e-esteira.md` | `01_padroes_loze/` | referenciar; não mover | médio | documento operacional ativo |
| `loze-docs-indice-canonico-sagb.md` | `00_indice/` | manter e referenciar | baixo | base ET-02 |
| `matriz-canonica-modulos-sagb.md` | `02_sagb_canonico/` | manter e referenciar | baixo | canônico SagB |
| `matriz-rotas-tabs-sagb.md` | `02_sagb_canonico/` | manter e referenciar | baixo | canônico SagB |
| `inventario-supabase-sagb.md` | `03_inventarios_tecnicos/` | manter e referenciar | baixo | inventário inicial |
| `inventario-netlify-functions-sagb.md` | `03_inventarios_tecnicos/` | manter e referenciar | baixo | inventário inicial |
| `arquitetura-modulos-plugaveis-sagb.md` | `02_sagb_canonico/` | manter e referenciar | baixo | documento central ET-02 |
| `modelo-module-doc-loze-das.md` | `06_templates/` ou `02_sagb_canonico/` | manter e referenciar | baixo | template-base |
| `QUARENTENA_TECNICA.md` | `04_quarentena_e_riscos/` | manter e referenciar | baixo | risco técnico crítico |
| `decisoes-para-adr-et-02.md` | `05_decisoes_adr/` | manter e referenciar | baixo | base de ADR |
| `validacao-et-02.md` | `07_validacoes/` | manter e referenciar | baixo | validação oficial ET-02 |

## 4) Classificação por natureza

- **Histórico/legado útil:** `design-system.md`, `stack-e-infra.md`, `deploy-ambientes-e-esteira.md`.
- **Canônicos ET-02:** índice, matrizes, arquitetura plugável, quarentena, decisões ADR, validação.
- **Inventários iniciais:** Supabase e Netlify Functions.
- **Template:** modelo LOZE-DAS para `module-doc.ts`.

## 5) Regra aplicada nesta ET-03

- Não mover arquivos com risco de quebra de link.
- Não apagar documentos antigos.
- Criar estrutura de pastas e novos documentos canônicos.
- Consolidar navegação via `00_indice/mapa_geral_documentacao.md`.

## 6) Recomendação final

**Aplicar reorganização por referência (sem deslocamento físico de arquivos antigos) e revisar movimentações apenas em etapa futura com validação de links.**

