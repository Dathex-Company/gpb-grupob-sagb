# NIDE — ET 03/08: Migração de Missões para Core do NIDE

**Data:** 2026-06-02  
**Responsável:** Rodrigues  
**Módulo:** NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas)  
**Etapa:** 03/08  

---

## Resumo

Migração da camada funcional do antigo módulo Missões para o core do NIDE, preservando a estrutura existente e garantindo compatibilidade retroativa. O módulo Missões permanece intacto como fallback, e o NIDE passa a exibir o conteúdo de Missões como seu core funcional inicial.

---

## Estrutura revisada antes da migração

### `src/modules/missoes/` (módulo de origem)

| Caminho | Conteúdo | Ação |
|---------|----------|------|
| `index.ts` | Barrel exports | Preservado |
| `manifest.ts` | ModuleManifest (id: 'missions') | Preservado |
| `routes.tsx` | ModuleRoute (/missoes) | Preservado |
| `module-doc.ts` | Doc básica | Preservado |
| `pages/MissoesPage.tsx` | Wrapper do AgentMissionsView | **Copiado** para NIDE |
| `store/runtimeBridge.ts` | Runtime context bridge | **Copiado** para NIDE |
| `store/index.ts` | Barrel | **Copiado** para NIDE |
| `hooks/index.ts` | Vazio (export {}) | Preservado |
| `services/index.ts` | Vazio (export {}) | Preservado |
| `components/index.ts` | Vazio (export {}) | Preservado |
| `types/index.ts` | Vazio (export {}) | Preservado |
| `agent/*` | Persona, prompts, session log | Preservado |
| `changelog.md` | Histórico | Preservado |
| `decisions.md` | Decisões | Preservado |
| `Plans/` | Relatórios de etapa | Preservado |

### `src/modules/nide/` (módulo destino)

| Caminho | Conteúdo | Ação |
|---------|----------|------|
| `index.ts` | Barrel exports | **Atualizado** |
| `manifest.ts` | ModuleManifest (id: 'nide') | Preservado |
| `routes.tsx` | ModuleRoute (/nide, fullscreen) | Preservado |
| `module-doc.ts` | Doc com boundaries | **Atualizado** |
| `core/NideShell.tsx` | Shell principal | **Atualizado** |
| `core/NideProvider.tsx` | Context provider | Preservado |
| `pages/NideHomePage.tsx` | Página placeholder | Preservado |
| `core/missions/` | **NOVO** - core missões | **Criado** |
| `README.md` | Documentação | **Atualizado** |
| `CHANGELOG.md` | Histórico | **Atualizado** |
| `DECISIONS.md` | Decisões | **Atualizado** |
| `PLANNED.md` | Roadmap | **Atualizado** |

---

## O que foi movido

| Origem | Destino | Tipo |
|--------|---------|------|
| `missoes/pages/MissoesPage.tsx` | `nide/core/missions/MissionsCorePage.tsx` | **Copiado e adaptado** |
| `missoes/store/runtimeBridge.ts` | `nide/store/runtimeBridge.ts` | **Copiado e adaptado** |
| `missoes/store/index.ts` | `nide/store/index.ts` | **Copiado e adaptado** |

## O que foi criado

| Caminho | Finalidade |
|---------|-----------|
| `nide/core/missions/index.ts` | Barrel do core de missões |
| `nide/core/missions/MissionsCorePage.tsx` | Página core que renderiza AgentMissionsView dentro do layout NIDE |
| `nide/store/runtimeBridge.ts` | Ponte de contexto runtime para o NIDE (baseada no padrão de Missões) |
| `nide/store/index.ts` | Barrel do store |
| `missoes/Plans/2026-06-02__NIDE-ET-03-MIGRACAO-MISSOES-CORE.md` | Relatório da etapa |

## O que foi alterado

| Arquivo | Alteração |
|---------|-----------|
| `nide/core/NideShell.tsx` | Agora renderiza `MissionsCorePage` como core funcional, mas mantém `NideHomePage` como fallback |
| `nide/module-doc.ts` | Atualizado purpose para refletir que Missões é o core funcional do NIDE |
| `nide/README.md` | Atualizada documentação com core missions |
| `nide/CHANGELOG.md` | Registro da ET 03 |
| `nide/DECISIONS.md` | Decisão sobre Missões como core registrada |
| `nide/PLANNED.md` | Atualizado roadmap |
| `App.tsx` | Injeção de runtime context do NIDE antes do check de moduleRoutes |

## O que foi preservado

- `services/missionService.ts` global — **não movido**
- `src/modules/missoes/` — **mantido intacto** como backup/compatibilidade
- Rotas antigas `/missoes` e módulo `missions` — **mantidas**
- `case 'missions'` no switch do App.tsx — **mantido**
- Metodologias — **não alterado**
- Mentorias — **não alterado**
- Tabelas Supabase — **não alterado**
- RLS/Policies — **não alterado**
- Migration — **não criada**

## Imports ajustados

| Arquivo | Import original | Import ajustado |
|---------|----------------|----------------|
| `nide/core/missions/MissionsCorePage.tsx` | `../../../../components/AgentMissionsView` | `../../../../../components/AgentMissionsView` |
| `nide/store/runtimeBridge.ts` | `../../../../types` | `../../../../../types` |
| `nide/index.ts` | — | `export * from './store'` adicionado |
| `NideShell.tsx` | — | Import de `MissionsCorePage` adicionado |

## Rotas impactadas

| Rota | Antes | Depois |
|------|-------|--------|
| `/nide` | Renderizava `NideHomePage` (placeholder) | Renderiza `MissionsCorePage` (core funcional) |
| `/missoes` | Renderizava `MissoesPage` (via moduleRoutes['missions']) | Mantido intacto |
| `missions` (switch case) | Renderizava `AgentMissionsView` diretamente | Mantido intacto |

## Registry impactado

- `moduleRegistry` contém ambos: `missoesManifest` (id: 'missions') e `nideManifest` (id: 'nide')
- Ambos são módulos independentes
- Nenhum foi removido

## Comandos executados

| Comando | Resultado |
|---------|-----------|
| `npm run build` | ✅ Build bem-sucedido, 855 módulos transformados |

## Comandos não executados

| Comando | Motivo |
|---------|--------|
| `npm run dev` | Conforme diretriz: não usar `npm run dev` como padrão automático; build é suficiente para validar |
| `npm run lint` | Script não identificado no package.json válido para esta etapa |
| `npm test` | Não há testes unitários para este escopo |
| `npm run typecheck` | Script não identificado; build já valida tipos |

## Validações realizadas

- ✅ Build completo sem erros
- ✅ Nenhum warning novo introduzido
- ✅ Sidebar com ambos os ícones (missions + nide)
- ✅ ModuleRegistry com ambos os módulos
- ✅ Rota `/nide` funcional via módulo registrado
- ✅ Rota `/missoes` mantida como fallback
- ✅ Metodologias e Mentorias intactos
- ✅ `services/missionService.ts` não movido

## Erros encontrados

Nenhum erro durante build.

## Riscos ainda abertos

1. **Duplicidade no menu**: Tanto `NIDE` quanto `Missões` aparecem no sidebar. Se o usuário clicar em Missões, vai para `/missoes` (rota antiga). Se clicar em NIDE, vai para `/nide` (rota nova com mesmo conteúdo). Ambos funcionam, mas pode causar confusão até a ET 07/08.
2. **Dois providers ativos**: O NIDEProvider (context) e o runtimeBridge coexistem. O runtimeBridge é um singleton global, enquanto o NIDEProvider é um Context do React. Não há conflito.
3. **Dependência do AgentMissionsView**: Tanto o novo MissionsCorePage quanto o antigo MissoesPage dependem do componente global `AgentMissionsView`. Qualquer alteração nesse componente afeta ambos.

## Próxima etapa recomendada

**ET 04/08** — Migração de Metodologias como domínio interno do NIDE.
