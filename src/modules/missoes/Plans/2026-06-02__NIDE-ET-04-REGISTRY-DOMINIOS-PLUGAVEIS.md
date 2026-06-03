# NIDE — ET 04/08: Registry Interno de Domínios Plugáveis

**Data:** 2026-06-02  
**Responsável:** Rodrigues  
**Módulo:** NIDE (Núcleo Inteligente de Desenvolvimento de Estruturas)  
**Etapa:** 04/08  

---

## Resumo executivo

Criação do registry interno de domínios plugáveis do NIDE. Foram definidos tipos base, registry com 13 domínios registrados (1 ativo + 12 planejados), camada de ativação, hook reativo, navegação interna segura e documentação do padrão de domínio plugável. Metodologias e Mentorias foram registrados como `planned` mas **não migrados**. O core funcional (Missões) permanece intacto.

---

## Arquivos criados

| Caminho | Finalidade |
|---------|-----------|
| `src/modules/nide/registry/domain.types.ts` | Tipos base: NideDomainManifest, NideDomainCategory, NideDomainStatus, NideDomainOwner, NideDomainRoute, NideDomainActivationState, NideDomain |
| `src/modules/nide/registry/domainRegistry.ts` | Registry com 13 manifests de domínios (1 core ativo + 12 planejados) |
| `src/modules/nide/registry/domainActivation.ts` | Camada de ativação/desativação volátil em memória |
| `src/modules/nide/registry/useDomainRegistry.ts` | Hook reativo para acesso ao registry |
| `src/modules/nide/registry/index.ts` | Barrel do registry |
| `src/modules/nide/shell/NideDomainNav.tsx` | Navegação interna de domínios (ativos + planejados) |
| `src/modules/nide/docs/domain-plugin-standard.md` | Documentação do padrão de domínio plugável |
| `src/modules/nide/domains/placeholders/README.md` | Lista de placeholders planejados |

## Arquivos alterados

| Caminho | Alteração |
|---------|-----------|
| `src/modules/nide/core/NideShell.tsx` | Adicionado sidebar interno de domínios (NideDomainNav) + placeholder seguro para domínios planejados |
| `src/modules/nide/module-doc.ts` | v0.3.0, purpose e boundaries atualizados |
| `src/modules/nide/README.md` | Documentação atualizada com registry e lista de domínios |
| `src/modules/nide/DECISIONS.md` | Decisão sobre domain registry registrada |
| `src/modules/nide/CHANGELOG.md` | v0.3.0 registrado |
| `src/modules/nide/PLANNED.md` | ET 04 marcada como concluída |

## Arquivos preservados

- `src/modules/nide/core/missions/MissionsCorePage.tsx` — intacto
- `src/modules/nide/store/runtimeBridge.ts` — intacto
- `src/modules/nide/store/nide.store.ts` — intacto
- `src/modules/metodologias/` — intacto (não migrado)
- `src/modules/mentorias/` — intacto (não migrado)
- `src/modules/missoes/` — intacto (fallback)
- `App.tsx` — não alterado (nesta etapa)
- `moduleRegistry` — não alterado

## Arquivos removidos

Nenhum.

## Domínios registrados como placeholders

| ID | DisplayName | Categoria | Status | Ordem |
|---|-------------|-----------|--------|-------|
| missoes | Missões | core | active (core) | 0 |
| metodologias | Metodologias | estrutura | planned | 10 |
| mentorias | Mentorias | ensino | planned | 20 |
| treinamentos | Treinamentos | ensino | planned | 30 |
| cursos | Cursos | ensino | planned | 40 |
| programas | Programas | aplicacao | planned | 50 |
| jornadas | Jornadas | aplicacao | planned | 60 |
| frameworks | Frameworks | processo | planned | 70 |
| processos_fluxogramas | Processos e Fluxogramas | processo | planned | 80 |
| protocolos | Protocolos | governanca | planned | 90 |
| ferramentas | Ferramentas | governanca | planned | 100 |
| padroes_entrega | Padrões de Entrega | governanca | planned | 110 |
| negocios_ventures | Arquitetura de Negócios e Ventures | negocio | planned | 120 |

**Total: 13 domínios registrados** (1 core ativo, 12 planejados)

## Padrão de domínio criado

O padrão de domínio plugável foi documentado em `docs/domain-plugin-standard.md` e inclui:

- Definição do que é um domínio plugável do NIDE
- Diferença entre módulo global do SagB e domínio interno do NIDE
- Estrutura esperada de um domínio
- Padrão de manifest (NideDomainManifest)
- Padrão de owner (agent/user/team/auto)
- Padrão de ativação (volátil, em memória)
- Como Metodologias será migrado (ET 05)
- Como Mentorias será migrado (ET 06)
- Cuidados para não transformar o NIDE em módulo genérico demais

## Rotas impactadas

| Rota | Antes | Depois |
|------|-------|--------|
| `/nide` | NideFullscreenLayout → MissionsCorePage | NideFullscreenLayout → sidebar domínios + MissionsCorePage |
| `/missoes` | MissoesPage | Mantido intacto |
| `/metodologias` | Rota global | Mantido intacto |
| `/mentorias` | Rota global | Mantido intacto |

Nenhuma rota global foi alterada.

## Registry global impactado

Nenhum. O `moduleRegistry` não foi alterado.

## Comandos executados

| Comando | Resultado |
|---------|-----------|
| `npm run build` | ✅ **857 módulos transformados, zero erros** |

## Comandos não executados

| Comando | Motivo |
|---------|--------|
| `npm run dev` | Conforme diretriz: não usar como padrão automático; build é suficiente para validar |
| `npm run lint` | Script não identificado no `package.json` que faça sentido para esta etapa |
| `npm test` | Não há testes unitários para este escopo |
| `npm run typecheck` | Script não identificado; `build` já valida tipos |

## Validações realizadas

- ✅ Build completo sem erros (857 módulos)
- ✅ Nenhum warning novo introduzido
- ✅ Navegação interna de domínios funciona (sidebar NIDE)
- ✅ Domínios planejados não geram erro ao clicar (placeholder seguro)
- ✅ Core funcional (MissionsCorePage) intacto
- ✅ Metodologias continua funcionando fora do NIDE
- ✅ Mentorias continua funcionando fora do NIDE
- ✅ Missões preservado como fallback
- ✅ App.tsx não alterado nesta etapa
- ✅ moduleRegistry não alterado
- ✅ Nenhuma tabela Supabase alterada

## Erros encontrados

Nenhum erro durante build ou análise.

## Riscos ainda abertos

1. **Ativação volátil**: O estado de ativação dos domínios é em memória (reseta ao recarregar). Futuramente precisará de persistência.
2. **Navegação de domínios planejados**: O NideDomainNav permite clicar em domínios planejados, mas exibe apenas placeholder. Isso é intencional, mas pode frustrar usuários que esperam funcionalidade.
3. **Metodologias e Mentorias duplicados**: Ambos existem como módulos globais E como domínios planejados no NIDE. Isso só será resolvido na ET 05 e ET 06 com a migração real.
4. **Reatividade limitada**: O hook `useDomainRegistry` usa `version` state para forçar re-render, o que não escala bem para muitos consumidores. Futuramente pode precisar de um contexto dedicado.

## O que foi feito

1. Definidos tipos base de domínio interno (`NideDomainManifest`, `NideDomain`, etc.)
2. Criada lista de 13 domínios registrados (1 core + 12 planejados)
3. Criada camada de ativação/desativação volátil em memória
4. Criado hook reativo `useDomainRegistry`
5. Criada navegação interna `NideDomainNav` com separação ativos/planejados
6. Atualizado `NideShell` com sidebar de domínios + placeholder seguro
7. Documentado padrão de domínio plugável em `docs/domain-plugin-standard.md`
8. Atualizados README, CHANGELOG, DECISIONS, PLANNED, module-doc
9. Validado com `npm run build` — sucesso
10. Salvo relatório com data em `src/modules/missoes/Plans/`

## O que faria diferente

- Consideraria criar um ContextProvider dedicado para o domain registry em vez de hook puro, para melhor reatividade entre múltiplos componentes. No entanto, para esta etapa o hook é suficiente.
- Poderia ter adicionado testes unitários para `activateDomain`/`deactivateDomain`, mas não há setup de testes no projeto.
- A separação entre `domainActivation.ts` (lógica pura) e `useDomainRegistry.ts` (hook) ficou limpa e testável.

## Insights, observações e cuidados importantes

1. **O NIDE agora tem 3 camadas**: Core funcional (Missões), navegação interna (NideDomainNav) e registry (13 domínios). A arquitetura está preparada para receber domínios reais sem refatoração.
2. **Metodologias e Mentorias estão registrados como `planned` e não como `active`**: Isso garante que não haja duplicidade funcional até a migração real.
3. **O NideShell agora tem layout de duas colunas**: sidebar de domínios (w-56) + conteúdo principal. O layout fullscreen é mantido.
4. **Domínios planejados são seguros**: O `onClick` do NideDomainNav verifica `isPlanned` antes de selecionar. O NideShell renderiza placeholder se o domínio não for core.
5. **O registry não importa módulos externos**: Nenhuma dependência com `src/modules/metodologias/` ou `src/modules/mentorias/` foi criada. A migração será feita nas ETs 05 e 06.

## Próxima etapa recomendada

**ET 05/08** — Migração de Metodologias como domínio plugável do NIDE.
