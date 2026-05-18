# Plano de Consolidação — QG 3forB

Objetivo: Unificar todos os fragmentos de módulo, agente e governança espalhados pela `Z:\empresas_b\3forb` em uma única estrutura dentro de `Z:\empresas_b\3forb\qg_3forb`.

---

## Diagnóstico — O Estado Atual (Coisas Picadas)

### 📍 Foco 1: Duplicação de Módulos

Os mesmos módulos existem em **2 lugares diferentes** com conteúdo idêntico ou divergente:

| Módulo | `modules/` (raiz) | `qg_3forb/src/modules/` | Status |
|--------|------------------|------------------------|--------|
| **gestao-midias-pagas** | ✅ Completo (services, types, components, pages, agent no formato `owner.md`) | ✅ Completo (services, types, components, pages, agent canônico 4 arquivos) | 🔴 **DUPLICADO** — conteúdo igual, formato de agente diferente |
| **valuation** | ✅ Completo (src/ com components, services, types, pages, agent `owner.md`) | ✅ Completo (src/ com components, services, types, pages, agent canônico 4 arquivos + session.md extra) | 🔴 **DUPLICADO** — com divergências (qg_3forb tem STYLE_GUIDE.md, PLANNED.md que o modules/ não tem) |
| **sites-landing-pages** | ⚠️ Básico (manifest, module-doc, changelog, agent `owner.md`) | ⚠️ Básico (manifest, module-doc, CHANGELOG, DECISIONS, agent canônico 4 arquivos, pages/Index.tsx) | 🔴 **DUPLICADO** — qg_3forb tem mais arquivos (DECISIONS, routes) |
| **vendas** | ⚠️ Básico (manifest, module-doc, changelog, agent `owner.md`) | ⚠️ Básico (manifest, module-doc, CHANGELOG, DECISIONS, agent canônico 4 arquivos, pages/Index.tsx) | 🔴 **DUPLICADO** — qg_3forb tem mais arquivos |
| **evaluation** | ❌ Não existe | ⚠️ Existe mas **não registrado** no moduleRegistry (órfão) | 🟡 **ÓRFÃO** |

**Conclusão:** Cada módulo existe em 2 lugares. O `qg_3forb` é a versão mais evoluída (agentes canônicos, DECISIONS, CHANGELOG). O `modules/` raiz é uma fonte anterior/legada.

### 📍 Foco 2: Agentes Fragmentados em 3 Lugares

| Local | Formato | Agentes |
|-------|---------|---------|
| `_agentes/` | ✅ Canônico (4 arquivos) | ✅ Zara Bittencourt |
| `agents/` (legado em árvore) | ❌ Old format (persona.md + README.md apenas) | Zara, Bia Fanel, Anton Borselli, Rian Mercer, Max Guerra, Alec Ross, Henri Milan, Murilo Zago, Tarian Wolfe, Zoren White |
| Dentro de módulos (`modules/*/agent/`) | ⚠️ Misto — `owner.md` ou canônico | gestao-midias-pagas, valuation, sites-landing-pages, vendas |

**Conclusão:** A `agents/` legada tem personas mesmo que incompletas que NÃO estão replicadas em nenhum lugar canônico. Rian Mercer, Bia Fanel, Anton Borselli etc. têm arquivos lá.

### 📍 Foco 3: Governança em 2 Lugares

| Documento | `governance/` (raiz) | `qg_3forb/governance/` | `_ventures/3forb/` |
|-----------|---------------------|----------------------|-------------------|
| `padrao_unificado_governanca.md` | ✅ | ✅ | ❌ |
| `padrao_modulos_plugaveis.md` | ❌ | ✅ | ❌ |
| `nomenclatura_agentes.md` | ✅ | ❌ | ❌ |
| `organograma.md` | ✅ (antigo, 18 agentes) | ❌ | ✅ (v1_completo, 180 agentes) |
| `organograma_marketing.md` | ✅ | ❌ | ❌ |
| `diretriz_operacao_agentes.md` | ✅ | ❌ | ❌ |
| `decisions.md` | ✅ | ✅ | ❌ |
| `pending.md` | ✅ | ❌ | ❌ |
| `README.md` | ✅ | ❌ | ❌ |
| `_agentes_oficiais/rian_merce_cro/` | ⚠️ Pasta vazia | ❌ | ❌ |
| `documentos_oficiais/` | 📄 7 documentos txt/html/md | ❌ | ❌ |

---

## Plano de Consolidação

### Fase 0: Preparação

Antes de qualquer movimento, fazer backup de tudo que será afetado.

### Fase 1: Unificar Módulos em `qg_3forb/src/modules/`

**1.1. gestao-midias-pagas**
- **Ação:** Manter `qg_3forb/src/modules/gestao-midias-pagas/` como fonte da verdade (já está com agentes canônicos)
- **Migrar:** Nada a migrar — as versões são idênticas em conteúdo
- **Remover:** `modules/gestao-midias-pagas/` após confirmação de que nada foi perdido (manter backup)

**1.2. valuation**
- **Ação:** Manter `qg_3forb/src/modules/valuation/` como fonte da verdade
- **Migrar:** Verificar se `modules/valuation/src/services/` tem algo que `qg_3forb` não tem. Exemplo: `modules/valuation/src/services/` tem `capTableEngine.ts`, `dataLayer.ts`, `evaluationBridge.ts`, `investmentRoundService.ts`, `proposalComparisonEngine.ts`, `simulationWorkbenchService.ts`, `valuationEngine.ts`, `valuationScenarioService.ts`, `valuationSimulacoesService.ts`, mappers/, mocks/, `__tests__/`.
  - ❓ **Verificar** se `qg_3forb/src/modules/valuation/src/services/` tem os mesmos arquivos
- **Corrigir:** Remover `session.md` extra do `valuation/agent/` (viola Regra 1.1)
- **Remover:** `modules/valuation/` após verificação

**1.3. sites-landing-pages**
- **Ação:** Manter `qg_3forb/src/modules/sites-landing-pages/` como fonte da verdade
- **Migrar:** Se `modules/sites-landing-pages/agent/owner.md` tiver informações não presentes nos canônicos do qg_3forb, extrair antes de remover
- **Remover:** `modules/sites-landing-pages/` após extração

**1.4. vendas**
- **Ação:** Manter `qg_3forb/src/modules/vendas/` como fonte da verdade
- **Migrar:** Mesma verificação de `owner.md`
- **Remover:** `modules/vendas/` após extração

**1.5. evaluation (órfão)**
- **Ação:** Registrar no `moduleRegistry.ts` — adicionar import e entry no array de módulos
- **Verificar:** Se o módulo está funcional (tem rota, página, etc.)
- **Adicionar:** Agent folder canônico (4 arquivos) para o módulo evaluation

### Fase 2: Unificar Agentes em `qg_3forb/agents/` (ou `_agentes/`)

**2.1. Extrair agentes da `agents/` legada**
- A `agents/` legada tem personas em formato antigo. Extrair o conteúdo útil de cada `persona.md` e converter para o formato canônico (4 arquivos) dentro de `qg_3forb/agents/`:

| Agente | Origem | Arquivo | Ação |
|--------|--------|---------|------|
| Rian Mercer | `agents/zara-bittencourt/rian-mercer/persona.md` | "Em consolidação." (vazio) | Criar prompt do zero (baseado no ChatGPT Zara linhas 12500-13300) |
| Bia Fanel | `agents/zara-bittencourt/bia-fanel/persona.md` | Verificar conteúdo | Converter para canônico |
| Anton Borselli | `agents/zara-bittencourt/bia-fanel/anton-borselli/persona.md` | Verificar conteúdo | Converter para canônico |
| Max Guerra | `agents/zara-bittencourt/rian-mercer/max-guerra/persona.md` | Verificar conteúdo | Converter para canônico |
| Alec Ross | `agents/alec-ross/persona.md` | Verificar conteúdo | Converter para canônico |
| Henri Milan | `agents/henri-milan/persona.md` | Verificar conteúdo | Converter para canônico |
| Murilo Zago | `agents/murilo-zago/persona.md` | Verificar conteúdo | Converter para canônico |
| Tarian Wolfe | `agents/tarian-wolfe/persona.md` | Verificar conteúdo | Converter para canônico |
| Zoren White | `agents/zoren-white/persona.md` | Verificar conteúdo | Converter para canônico |

**2.2. Padronizar agentes dentro de módulos**
- Módulos têm agentes com formatos mistos (owner.md, session.md extra)
- Padronizar todos para 4 arquivos canônicos

**2.3. Decidir localização central dos agentes**
- Opção A: `qg_3forb/agents/` (dentro do QG)
- Opção B: `qg_3forb/_agentes/` (seguindo padrão SagB)
- Recomendação: Opção A para manter QG autocontido

### Fase 3: Unificar Documentos de Governança

Copiar para `qg_3forb/governance/` os documentos que estão faltando:

| Documento | Origem | Ação |
|-----------|--------|------|
| `nomenclatura_agentes.md` | `governance/nomenclatura_agentes.md` | Copiar para `qg_3forb/governance/` |
| `organograma.md` (canônico consolidado) | `_ventures/3forb/organogramas_3forb/organograma_3forb_v1_completo.md` | Copiar como `qg_3forb/governance/organograma.md` |
| `diretriz_operacao_agentes.md` | `governance/diretriz_operacao_agentes.md` | Copiar para `qg_3forb/governance/` |
| `pending.md` | `governance/pending.md` | Copiar para `qg_3forb/governance/` |
| `documentos_oficiais/` | `governance/documentos_oficiais/` | Copilar inteiro para `qg_3forb/governance/documentos_oficiais/` |

### Fase 4: Remover Estruturas Duplicadas e Vazias

Após migração, remover ou arquivar:

| Diretório | Ação |
|-----------|------|
| `modules/` | Remover (conteúdo migrado para qg_3forb) |
| `agents/` | Remover (conteúdo extraído ou já vazio) |
| `raw/` | Remover (vazio) |
| `pendencias/` | Remover (vazio) |
| `insights/` | Remover (vazio) |
| `decisoes/` | Remover (vazio) |
| `_agentes/` (raiz) | Manter ou remover — decisão de arquitetura |

---

## Riscos e Cuidados

1. 🔴 **Duplicação real** — services, types e componentes de `gestao-midias-pagas` e `valuation` estão em 2 lugares. A consolidação precisa escolher 1 fonte da verdade e garantir que nada se perca no caminho.

2. 🟡 **Personas da `agents/` legada** — estão em formato antigo e muitas incompletas ("Em consolidação."). O valor real está nos prompts definidos no ChatGPT Zara (linhas que já analisamos). A `agents/` legada pode ser ignorada seguramente.

3. 🟡 **Evaluation órfão** — precisa de verificação de dependências (depende de `valuation`). Pode quebrar se valuation for movido sem atualizar os imports.

4. ⚪ **`_agentes_oficiais/` vazio** — diretório fantasma, pode ser removido.

---

## Ordem de Execução Sugerida

```
1. Backup de toda a árvore Z:\empresas_b\3forb
2. Fase 1.5: Registrar módulo evaluation no moduleRegistry (mais seguro, baixo risco)
3. Fase 1.1-1.4: Verificar duplicação e remover modules/ (conteúdo já em qg_3forb)
4. Fase 2: Extrair agentes legados e criar pastas canônicas em qg_3forb/agents/
5. Fase 3: Copiar documentos de governança faltantes para qg_3forb/governance/
6. Fase 4: Limpar diretórios vazios e duplicados
7. Atualizar README.md do qg_3forb com a nova estrutura consolidada
8. Rodar build para confirmar que nada quebrou
```
