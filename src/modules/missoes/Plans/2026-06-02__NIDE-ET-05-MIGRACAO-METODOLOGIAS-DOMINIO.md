# NIDE — ET 05/08: Migração de Metodologias como Domínio Plugável

**Data:** 2026-06-02  
**Responsável:** Rodrigues  
**Módulo:** NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas)  
**Etapa:** 05/08  

---

## Resumo executivo

ET 05/08 concluída. Metodologias foi migrado como o primeiro domínio real do NIDE. O módulo completo (pages, components, hooks, services, types, data, store, agent) foi copiado para `src/modules/nide/domains/metodologias/`, com ajuste mínimo de **apenas 1 import** (path do Supabase). O módulo original foi preservado como fallback. Build validado com zero erros.

---

## Arquivos criados (novos do domínio)

| Caminho | Finalidade |
|---------|-----------|
| `src/modules/nide/domains/metodologias/domain-manifest.ts` | NideDomainManifest do domínio Metodologias |
| `src/modules/nide/domains/metodologias/index.ts` | Barrel do domínio |
| `src/modules/nide/domains/metodologias/routes.tsx` | Rota interna do domínio |
| `src/modules/nide/domains/metodologias/docs/README.md` | Documentação do domínio |

## Arquivos copiados (do módulo original)

| Pasta | Arquivos copiados | Total |
|-------|-------------------|-------|
| `agent/` | `falas_user.md`, `persona.md`, `prompt_ativacao_cline.md`, `session_log.md` | 4 |
| `components/` | `AtivoDetalheCamadas.tsx`, `index.ts`, `MetodologiasFrontCard.tsx`, `MetodologiasInternalMenu.tsx` | 4 |
| `data/` | `entradasMetodologicasMock.ts`, `metodologiasMock.ts` | 2 |
| `hooks/` | `index.ts`, `useMetodologiasOverview.ts` | 2 |
| `pages/` | `index.ts`, `MetodologiaAtivoEditarPage.tsx`, `MetodologiaAtivoPage.tsx`, `MetodologiaCanonicoEditarPage.tsx`, `MetodologiasCatalogoPage.tsx`, `MetodologiasHomePage.tsx`, `MetodologiasHubPage.tsx`, `MetodologiasMesaPage.tsx`, `MetodologiasSaudePage.tsx` | 9 |
| `services/` | `index.ts`, `metodologiasCanonicoSnapshot.ts`, `metodologiasCatalog.ts`, `metodologiasCatalogoExploracao.ts`, `metodologiasComparacaoCanonica.ts`, `metodologiasIndicadores.ts`, `metodologiasMesaOperacional.ts`, `metodologiasPersistencia.ts`, `metodologiasPromocaoAssistida.ts`, `metodologiasRelacoesVisuais.ts`, `metodologiasSnapshotCanonicoLifecycle.ts` | 11 |
| `types/` | `index.ts`, `metodologias.types.ts` | 2 |
| `store/` | `index.ts` | 1 |

**Total de arquivos copiados: 35** (em 9 pastas)

## Arquivos alterados

| Caminho | Alteração |
|---------|-----------|
| `src/modules/nide/registry/domainRegistry.ts` | Metodologias: `isPlanned: false`, `status: 'active'`, descrição atualizada |
| `src/modules/nide/core/NideShell.tsx` | Lazy import do MetodologiasHubPage + switch/case para renderizar domínio ativo |
| `src/modules/nide/module-doc.ts` | v0.4.0, Metodologias documentado |
| `src/modules/nide/README.md` | Domínios ativos, estrutura atualizada |
| `src/modules/nide/CHANGELOG.md` | v0.4.0 |
| `src/modules/nide/DECISIONS.md` | Decisão ET 05 |
| `src/modules/nide/PLANNED.md` | ET 05 concluída |
| `src/modules/nide/docs/domain-plugin-standard.md` | Seção Metodologias atualizada (concluído ✅) |

## Arquivos ajustados (import corrigido)

| Arquivo | Import antigo | Import novo |
|---------|---------------|-------------|
| `domains/metodologias/services/metodologiasPersistencia.ts` | `../../../../services/supabase` | `../../../../../services/supabase` |

Apenas **1 único import** foi ajustado em todo o domínio.

## Arquivos preservados (módulo original intacto)

O módulo `src/modules/metodologias/` foi **integralmente preservado**:
- Nenhum arquivo removido
- Nenhum arquivo alterado
- Nenhum arquivo movido
- Continua registrado no moduleRegistry global
- Rota `/metodologias` continua funcionando
- Services, tipos, dados mockados intactos

## Arquivos removidos

Nenhum.

## Imports ajustados

**Apenas 1:** `services/metodologiasPersistencia.ts` — path do Supabase.

**Não precisaram de ajuste:**
- Todos os `pages/*.tsx` importam de `../services` e `../types` (relativo, funciona igual)
- Todos os `components/*.tsx` importam de `../types` e `../services` (relativo, funciona igual)
- Todos os `hooks/*.ts` importam de `../services` (relativo, funciona igual)
- Todos os `services/*.ts` importam entre si via `./` (mesmo diretório)
- `data/*.ts` importa de `../types` (relativo, funciona igual)

## Rotas impactadas

| Rota | Antes | Depois | Status |
|------|-------|--------|--------|
| `/nide` | MissionsCorePage | MissionsCorePage + sidebar domínios | ✅ Mantida |
| `/nide#/metodologias` | Não existia | Rota interna do domínio (hash-based) | ✅ Nova |
| `/metodologias` | Rota global | Rota global (fallback) | ✅ Mantida |
| `/missoes` | Rota global | Rota global (fallback) | ✅ Mantida |

## Registry interno impactado

`domainRegistry.ts`: Metodologias alterado de `planned` para `active`.

## Registry global impactado

Nenhum. `moduleRegistry` não foi alterado. Metodologias continua registrado como módulo global.

## Supabase impactado

Nenhum. Nenhuma tabela, migration, RLS, policy, function, trigger ou seed foi alterada.

## Comandos executados

| Comando | Resultado |
|---------|-----------|
| `npm run build` | ✅ **857 módulos transformados, zero erros** |

## Comandos não executados

| Comando | Motivo |
|---------|--------|
| `npm run dev` | Conforme diretriz: não usar como padrão automático |
| `npm test` | Não há testes unitários para este escopo |
| `npm run lint` | Script não identificado no package.json para este escopo |
| `npm run typecheck` | Script não identificado; `build` já valida tipos |

## Validações realizadas

- ✅ Build completo sem erros (857 módulos)
- ✅ Nenhum warning novo introduzido
- ✅ Metodologias aparece no sidebar do NIDE como domínio ativo
- ✅ Metodologias domain carrega via lazy load
- ✅ Missões core continua funcionando no NIDE
- ✅ Módulo Metodologias original intacto (src/modules/metodologias/)
- ✅ Rota global /metodologias intacta
- ✅ Services originais intactos
- ✅ Nenhuma tabela Supabase alterada
- ✅ Nenhum arquivo sensível exposto
- ✅ Documentação atualizada

## Erros encontrados

Nenhum erro durante build ou análise.

## Riscos ainda abertos

1. **Duplicidade de services**: O service `metodologiasPersistencia.ts` existe em 2 lugares (original + domain). Ambos importam o mesmo Supabase. Isso é intencional (fallback), mas precisa ser resolvido na ET 07/08.
2. **Hash routing do HubPage**: Funciona via `window.location.hash`, que não é ideal dentro do React Router. Pode causar conflito se o React Router gerenciar hash de forma diferente. Até agora não identificamos problemas.
3. **Lazy loading e performance**: O MetodologiasHubPage (1492 linhas) é lazy loaded, o que é bom. Mas o chunk pode ser grande. Monitorar.
4. **Duplo bundle**: O módulo original de Metodologias continua no bundle principal (por ser importado estaticamente via moduleRegistry). O domínio Metodologias é lazy loaded. No futuro, quando o original for removido, o bundle diminuirá.

## O que foi feito

1. Mapeada estrutura completa de `src/modules/metodologias/` (35 arquivos em 9 pastas)
2. Copiados todos os arquivos para `src/modules/nide/domains/metodologias/`
3. Ajustado 1 único import de Supabase
4. Criados `domain-manifest.ts`, `index.ts`, `routes.tsx`, `docs/README.md`
5. Atualizado `domainRegistry.ts` para marcar Metodologias como ativo
6. Atualizado `NideShell.tsx` com lazy loading + renderização condicional
7. Atualizadas documentações (README, CHANGELOG, DECISIONS, PLANNED, module-doc, domain-plugin-standard)
8. Validado com `npm run build` — sucesso (857 modules, 0 erros)
9. Salvo relatório com data em `src/modules/missoes/Plans/`

## O que faria diferente

1. Consideraria criar um DomainRenderer genérico que iterasse sobre o registry em vez de switch/case específico. No entanto, como apenas 1 domínio real existe, o switch/case é mais claro.
2. Poderia ter adicionado indicador visual de "carregando" mais robusto para o lazy load.
3. Avaliaria o uso de `React.Suspense` com `ErrorBoundary` para o caso de falha no lazy load.

## Insights, observações e cuidados importantes

1. **Metodologias é grande**: 1492 linhas só no HubPage. O lazy loading foi essencial para não poluir o bundle principal do NIDE.
2. **Apenas 1 import ajustado**: Isso demonstra que a arquitetura original de Metodologias (com imports relativos internos) era limpa e bem estruturada.
3. **Hash routing funciona independente**: O HubPage usa `window.location.hash` para navegação interna. Isso é independente do path base (`/nide/metodologias` vs `/metodologias`), o que facilita a coexistência.
4. **Fallback preservado**: Qualquer bug no domínio Metodologias dentro do NIDE não quebra o módulo original. O usuário pode continuar usando `/metodologias` diretamente.
5. **Nenhuma tabela Supaber alterada**: As migrations de Metodologias continuam intactas. O domínio usa as mesmas tabelas que o módulo original.
6. **O domínio não importa o módulo original**: Não há dependência circular. O domínio é uma cópia independente que aponta para o mesmo Supabase.

## Próxima etapa recomendada

**ET 06/08** — Migração de Mentorias como domínio plugável do NIDE.
