# Verificação do Diretório QG 3forB

Data: 18/05/2026
Diretório analisado: `Z:\empresas_b\3forb\qg_3forb`

---

## 1. Estrutura Geral

| Item | Status | Observação |
|------|--------|------------|
| `package.json` | ✅ OK | React 19, Vite 8, TypeScript 6 |
| `README.md` | ✅ OK | Documentação básica presente |
| `PLANNED.md` | ✅ OK | Roadmap de evolução |
| `CHANGELOG.md` | ✅ OK | Histórico de mudanças |
| `DECISIONS.md` | ✅ OK | Decisões arquiteturais |
| `index.html` / `netlify.toml` | ✅ OK | Entry point e deploy config |
| `_triagem/` | ⚠️ Vazio | Diretório existe mas sem conteúdo |
| `src/App.tsx` / `src/main.tsx` | ✅ OK | Estrutura base funcional |

---

## 2. Agentes

| Agente | Pasta | Arquivos Canônicos | Status |
|--------|-------|-------------------|--------|
| Zara Bittencourt (CEO) | `agent/` | persona, prompt, session_log, falas_user | ✅ OK |
| Rian Mercer (CRO) | ❌ Ausente | — | 🔴 Crítico |
| Bia Fanel (CMO) | ❌ Ausente | — | 🔴 Crítico |
| Paula Zurik (QG) | ❌ Ausente | — | 🔴 Crítico |
| Anton Borselli (Dir. Marketing) | ❌ Ausente | — | 🔴 Crítico |
| Max Guerra (Dir. Vendas) | ❌ Ausente | — | 🔴 Crítico |
| Liora Blake (Dir. Expansão) | ❌ Ausente | — | 🔴 Crítico |
| Nolan Krev (Head Tráfego) | ❌ Ausente | — | 🔴 Crítico |
| Maikon Bell (Google) | ❌ Ausente | — | 🔴 Crítico |
| Jason Fod (Meta Ads) | ❌ Ausente | — | 🔴 Crítico |
| Sandro Zanelli (Valuation) | ❌ Ausente como agente raiz | ⚠️ Tem agent folder dentro do módulo `valuation/agent/` com ID `c-ssio-mendes-conversa-tecnica` (fora do padrão) | 🟡 Pendente |
| 150+ agentes CA.XX | ❌ Ausentes | — | 🔴 Longo prazo |

---

## 3. Módulos Plugáveis

### 3.1. Módulos Existentes

| Módulo | Status | Registrado? | Agente próprio? | Observação |
|--------|--------|-------------|-----------------|------------|
| `gestao-midias-pagas` | ✅ `hibrido` | Sim | ✅ Completo (4 canônicos) | Mais completo — ~80 componentes, services, types |
| `valuation` | ✅ `migrating` | Sim | ⚠️ Tem agent folder com 5 arquivos (session.md extra = não-canônico) | Completo com types, context, pages, utils |
| `sites-landing-pages` | ✅ `draft` | Sim | ✅ Completo | Básico — só Index.tsx |
| `vendas` | ✅ `draft` | Sim | ✅ Completo | Básico — só Index.tsx |
| `evaluation` | ✅ `active` | **Não** | ❌ Sem agent folder | Órfão — não está no moduleRegistry |

### 3.2. Módulos Faltantes (vs. QG Architecture de 6 Macrocamadas)

#### Macrocamada 1 — COMANDO
| Módulo | Status | Prioridade |
|--------|--------|------------|
| Dashboard Executivo | ❌ Ausente | 🔴 Alta |
| Inteligência e RAMP | ❌ Ausente | 🔴 Alta |
| Reuniões e Decisões | ❌ Ausente | 🟡 Média |

#### Macrocamada 2 — ENTRADA
| Módulo | Status | Prioridade |
|--------|--------|------------|
| Diagnóstico | ❌ Ausente | 🔴 Alta |
| Comercial | ❌ Ausente | 🔴 Alta |
| Propostas | ❌ Ausente | 🟡 Média |
| Contratos | ❌ Ausente | 🟡 Média |
| Onboarding | ❌ Ausente | 🟡 Média |

#### Macrocamada 3 — OPERAÇÃO
| Módulo | Status | Prioridade |
|--------|--------|------------|
| Clientes | ❌ Ausente | 🔴 Alta |
| Entregáveis | ❌ Ausente | 🟡 Média |
| Tarefas e Produção | ❌ Ausente | 🟡 Média |

#### Macrocamada 4 — NÚCLEOS ESPECIALISTAS
| Módulo | Status | Prioridade |
|--------|--------|------------|
| Marketing (completo) | ❌ Ausente | 🔴 Alta |
| Expansão | ❌ Ausente | 🔴 Alta |
| Mídias Pagas | ✅ Presente | — |

#### Macrocamada 5 — ESTRUTURA DA MÁQUINA
| Módulo | Status | Prioridade |
|--------|--------|------------|
| E.D.A | ❌ Ausente | 🟡 Média |
| MAV | ❌ Ausente | 🟡 Média |
| Automações | ❌ Ausente | 🟡 Média |
| Agentes e IA | ❌ Ausente | 🟡 Média |
| Playbooks e Base de Conhecimento | ❌ Ausente | 🟡 Média |

#### Macrocamada 6 — GESTÃO
| Módulo | Status | Prioridade |
|--------|--------|------------|
| Financeiro | ❌ Ausente | 🟡 Média |
| Configurações | ❌ Ausente | 🟡 Baixa |

---

## 4. Documentos de Governança

| Documento | Presente? | Observação |
|-----------|-----------|------------|
| `governance/padrao_unificado_governanca.md` | ✅ Sim | — |
| `governance/padrao_modulos_plugaveis.md` | ✅ Sim | — |
| `governance/decisions.md` | ✅ Sim | — |
| `governance/organograma.md` | ❌ Ausente | O canônico está em `_ventures/3forb/organogramas_3forb/` |
| `governance/nomenclatura_agentes.md` | ❌ Ausente | Está em `governance/nomenclatura_agentes.md` (fora do qg) |
| `governance/padrao_agentes_responsaveis.md` | ❌ Ausente | Está no SagB docs |

---

## 5. Problemas Identificados

1. **🔴 Somente 1 agente (Zara) no diretório raiz** — todos os demais agentes da liderança (Rian, Bia, Paula, Anton, Max, Liora) não têm pasta nem prompt aqui. Apenas `valuation` e `gestao-midias-pagas` têm agentes embutidos nos módulos, mas com IDs fora do padrão canônico.

2. **🔴 Módulo `evaluation` órfão** — está em `src/modules/evaluation/` com manifest próprio (status: active), mas não é importado pelo `moduleRegistry.ts`. Nunca será carregado em runtime.

3. **🟡 Arquivo não-canônico em `valuation/agent/`** — existe `session.md` além dos 4 canônicos, violando a Regra 1.1 do padrão unificado.

4. **🟡 ID de agente fora do padrão** — o agente do módulo valuation usa `c-ssio-mendes-conversa-tecnica` (hífens + acento), enquanto o padrão exige `cassio_mendes_3fb_tec_e_158` (underscores, sem acentos, setor+nível+sequencial).

5. **🟡 Apenas 4 módulos de ~25 necessários** — a arquitetura do QG prevê 6 macrocamadas com dezenas de módulos. Atualmente temos 4 módulos, sendo que 2 (sites-landing-pages e vendas) estão em estado `draft` com apenas página inicial.

6. **🟡 Sem testes automatizados** — `PLANNED.md` menciona Vitest, mas não há test files.

7. **⚪ `_triagem/` vazio** — diretório existe mas sem propósito definido atualmente.

---

## 6. Resumo

| Categoria | Existentes | Faltantes | Completude |
|-----------|-----------|-----------|------------|
| Agentes (raiz) | 1 | ~15 líderes | 6% |
| Módulos QG | 4 | ~20 módulos | 17% |
| Docs Governança | 3 | 3+ | 50% |
| Infraestrutura | Básica | CI, Auth, Testes, PWA | 30% |

**Conclusão:** O diretório `qg_3forb` está em estágio inicial de estruturação. Tem a base técnica (React 19, Vite, TypeScript) e 1 módulo completo (gestao-midias-pagas). Faltam a maioria dos agentes de liderança, ~20 módulos do QG, integração com o organograma canônico e documentos de governança essenciais.
