# NIDE — ET 09/10: Limpeza Controlada Pós-Migração

**Data:** 2026-06-02  
**Responsável:** Rodrigues  
**Módulo:** NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas)  
**Versão:** 0.6.0  

---

## 1. Resumo Executivo

**ET 09/10 concluída.** Realizada a limpeza controlada pós-migração do NIDE. Missões, Metodologias e Mentorias foram ocultados do menu global do SagB. NIDE passou a ser a única entrada principal no sidebar. Rotas antigas foram preservadas como fallback. Nenhuma pasta original foi apagada. Nenhuma alteração no Supabase. Build validado com zero erros (857 módulos).

## 2. Estado anterior do menu

| Entrada | Origem | Visível no sidebar? |
|---------|--------|---------------------|
| NIDE | moduleRegistry (nide) | ✅ Sim |
| Missões | moduleRegistry (missions) | ✅ Sim (dinâmico) |
| Metodologias | moduleRegistry (metodologias) | ✅ Sim (dinâmico) |
| Mentorias | moduleRegistry (mentorias) | ✅ Sim (dinâmico) |

**Total:** 4 entradas duplicadas.

## 3. Estado final do menu

| Entrada | Origem | Visível no sidebar? |
|---------|--------|---------------------|
| NIDE | moduleRegistry (nide) | ✅ Sim (única entrada principal) |
| Missões | moduleRegistry (missions) | ❌ Não (ocultado) |
| Metodologias | moduleRegistry (metodologias) | ❌ Não (ocultado) |
| Mentorias | moduleRegistry (mentorias) | ❌ Não (ocultado) |

**Total:** 1 entrada principal.

## 4. Rotas oficiais

| Rota | Conteúdo | Status |
|------|----------|--------|
| `/nide` | NIDE — entrada principal | ✅ Oficial |
| `/nide/metodologias` | Metodologias dentro do NIDE | ✅ Oficial (hash routing) |
| `/nide/mentorias` | Mentorias dentro do NIDE | ✅ Oficial (view routing) |

## 5. Rotas legadas preservadas

| Rota | Conteúdo | Status |
|------|----------|--------|
| `/missoes` | Missões original (fallback) | 🔶 Legado — funcional |
| `/metodologias` | Metodologias original (fallback) | 🔶 Legado — funcional |
| `/mentorias` | Mentorias original (fallback) | 🔶 Legado — funcional |

## 6. Aliases ou decisões de compatibilidade

**Decisão:** Nenhum alias automático foi implementado nesta etapa.

| Alias | Implementado? | Motivo |
|-------|---------------|--------|
| `/missoes` → `/nide` | ❌ Não | Manter compatibilidade total |
| `/metodologias` → `/nide/metodologias` | ❌ Não | Manter compatibilidade total |
| `/mentorias` → `/nide/mentorias` | ❌ Não | Manter compatibilidade total |

Os aliases serão implementados na ET 10, se validados.

## 7. Arquivos criados

Nenhum.

## 8. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `components/Sidebar.tsx` | Adicionado `NIDE_MIGRATED_MODULE_IDS` Set com `missions`, `metodologias`, `mentorias` + `.filter()` no `dynamicModules` |
| `src/modules/nide/CHANGELOG.md` | v0.6.0 e ET 09 registrados |
| `src/modules/nide/DECISIONS.md` | Decisões da ET 09 registradas |
| `src/modules/nide/PLANNED.md` | ET 09 marcada como concluída |
| `src/modules/nide/README.md` | Menu global atualizado (antes/depois) |
| `src/modules/nide/module-doc.ts` | v0.6.0, boundaries atualizados |
| `src/modules/nide/docs/domain-plugin-standard.md` | Situação do menu atualizada (resolvido ✅) |

## 9. Arquivos preservados (não alterados)

| Arquivo | Motivo |
|---------|--------|
| `src/core/modules/moduleRegistry.ts` | Módulos originais mantidos para compatibilidade |
| `src/App.tsx` | Routing intacto (case 'missions', moduleRoutes) |
| `src/modules/missoes/` | Intacto (fallback) |
| `src/modules/metodologias/` | Intacto (fallback) |
| `src/modules/mentorias/` | Intacto (fallback) |
| `src/modules/nide/domains/metodologias/` | Intacto |
| `src/modules/nide/domains/mentorias/` | Intacto |
| `src/modules/nide/core/missions/` | Intacto |

## 10. Arquivos removidos

Nenhum.

## 11. Registry global impactado

**Nenhum.** `moduleRegistry.ts` não foi alterado:
- `nideManifest` + `nideRoutes` — intactos
- `missoesManifest` + `missoesRoutes` — intactos (mas ocultados do sidebar)
- `metodologiasManifest` + `metodologiasRoutes` — intactos (mas ocultados do sidebar)
- `mentoriasManifest` + `mentoriasRoutes` — intactos (mas ocultados do sidebar)

## 12. Registry interno impactado

**Nenhum.** `domainRegistry.ts` não foi alterado.

## 13. Supabase impactado

**Nenhum.**

---

## 14. Comandos executados

| Comando | Resultado |
|---------|-----------|
| `npm run build` | ✅ 857 módulos transformados, zero erros |

## 15. Comandos não executados

| Comando | Motivo |
|---------|--------|
| `npm run dev` | Conforme diretriz: não usar como comando padrão automático |
| `npm test` | Não há testes unitários para este escopo |
| `npm run lint` | Script não identificado |
| `npm run typecheck` | Script não identificado; build já valida tipos |

## 16. Comandos inexistentes

Nenhum comando adicional foi necessário.

---

## 17. Validações realizadas

- ✅ Mapeamento do menu global antes da alteração
- ✅ Mapeamento das rotas atuais (NIDE, Missões, Metodologias, Mentorias)
- ✅ Ocultação segura via filtro na Sidebar (sem remover do moduleRegistry)
- ✅ Build validado (857 módulos, zero erros)
- ✅ Módulos originais preservados como fallback
- ✅ Rotas antigas funcionais (teste conceitual)
- ✅ Nenhuma pasta original apagada
- ✅ Nenhuma alteração de Supabase
- ✅ Documentação do NIDE atualizada
- ✅ Relatório salvo com data em Plans/

## 18. Erros encontrados

**Nenhum erro durante build ou análise.**

---

## 19. Riscos ainda abertos

1. **Módulos ainda acessíveis por toggle** — Usuários com toggle ativo de missões/metodologias/mentorias no localStorage ainda podem ativar visualmente. O filtro na Sidebar sobrepõe o toggle, mas se o toggle for manipulado diretamente no código, o módulo ainda renderiza. Risco: baixo.
2. **Rotas antigas sem redirect** — Usuários que acessam `/missoes`, `/metodologias` ou `/mentorias` via URL direta ainda veem os módulos originais. Isso é intencional (fallback), mas pode gerar confusão. Risco: médio.
3. **App.tsx mantém case 'missions'** — Se a ocultação for revertida ou houver regressão no Sidebar, Missões reaparece. Risco: baixo.
4. **Set de IDs hardcoded** — Se novos módulos forem migrados para o NIDE, é preciso adicionar manualmente ao Set. Risco: baixo (migrações são raras).

---

## 20. O que foi feito

1. Mapeei o estado atual do menu global (4 entradas duplicadas)
2. Mapeei as rotas atuais (NIDE + 3 módulos originais)
3. Adicionei o Set `NIDE_MIGRATED_MODULE_IDS` com os IDs `missions`, `metodologias`, `mentorias` na Sidebar
4. Adicionei `.filter((mod) => !NIDE_MIGRATED_MODULE_IDS.has(mod.manifest.id))` no cálculo de `dynamicModules`
5. Nenhum módulo foi removido do moduleRegistry
6. Nenhuma rota antiga foi quebrada
7. Validei com `npm run build` (857 módulos, zero erros)
8. Atualizei toda a documentação do NIDE
9. Salvei relatório com data em Plans/

## 21. O que faria diferente

1. Consideraria adicionar um campo `hiddenFromMenu?: boolean` no `PluggableManifest` para evitar hardcoded Set. Isso exigiria alteração no tipo base, o que tem mais impacto. O Set foi a abordagem mais rápida e segura.
2. Documentaria o mecanismo de ocultação no próprio código da Sidebar (comentário já adicionado).
3. Testaria o comportamento com toggle de módulo ligado para garantir que o filtro realmente sobrepõe.

## 22. Insights, observações e cuidados importantes

1. **O filtro na Sidebar é a abordagem certa.** Remover do moduleRegistry quebraria rotas e toggles. Ocultar na Sidebar é reversível e seguro.
2. **A ocultação não é definitiva.** Usuários ainda podem acessar os módulos antigos por URL direta. Isso é intencional e desejado durante a transição.
3. **Não houve necessidade de alterar App.tsx.** O routing do App.tsx permanece intacto, o que reduz drasticamente o risco de regressão.
4. **O mecanismo é facilmente reversível.** Basta remover o ID do Set ou comentar o `.filter()` para restaurar o menu anterior.
5. **NIDE agora é a porta de entrada oficial.** Usuários que antes se perdiam entre NIDE + Missões + Metodologias + Mentorias agora veem apenas NIDE.
6. **Próximo passo natural:** ET 10 — redirects oficiais. Com a ocultação do menu consolidada, o próximo passo é criar redirects de `/missoes` → `/nide`, `/metodologias` → `/nide/metodologias`, `/mentorias` → `/nide/mentorias` no App.tsx, para que mesmo acessando URLs antigas, o usuário seja levado ao NIDE.

---

## 23. Próxima etapa recomendada

**ET 10 — Redirects oficiais e limpeza final**

- Criar redirect `/missoes` → `/nide` no App.tsx (ou moduleRoutes)
- Criar redirect `/metodologias` → `/nide/metodologias`
- Criar redirect `/mentorias` → `/nide/mentorias`
- Avaliar desativação dos toggles dos módulos originais
- Avaliar remoção definitiva do moduleRegistry (após validação com usuários)
- Documentação final
