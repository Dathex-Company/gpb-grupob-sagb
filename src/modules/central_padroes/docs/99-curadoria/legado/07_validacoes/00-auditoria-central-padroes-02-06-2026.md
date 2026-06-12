# 00 — Auditoria da Central de Padrões — 02-06-2026

Auditoria executada sobre o caminho:

`Z:\00_sagb\src\modules\central_padroes`

Data da execução: 2026-06-02
Responsável: Cássio Mendes (via script de auditoria)

---

## 1. Resumo executivo

**Status geral: Aprovado com ajustes**

A Central de Padrões está instalada, funcional e coerente com o ecossistema GrupoB/SagB/Loze. O build compila sem erros, a navegação está organizada e os dados de fallback cobrem 12 áreas de responsabilidade com centenas de itens normativos.

**Nível de completude: ~75% operacional**

O módulo tem estrutura de módulo plugável madura (index, manifest, routes, module-doc, CHANGELOG, DECISIONS, PLANNED, README). As 21 páginas estão implementadas. A busca textual funciona. O approval workflow está operacional. O fallback garante disponibilidade offline.

**Principais pontos encontrados:**
- Estrutura técnica adequada: 145 arquivos, 22 pastas, 14 componentes, 21 páginas, 10 serviços, 13 tipos, 1 hook
- Documentação rica: docs organizados em 8 subpastas temáticas com 40+ documentos
- Separação por áreas clara: 12 responsáveis mapeados no fallback e na navegação
- Canonicidade parcial: Alice/UX é a primeira divisão com canonização dirigida; demais divisões aguardam Pietro
- Build limpo sem erros de tipo ou importação

**Principais lacunas:**
- Ausência de testes automatizados
- Fallback massivo (2022 linhas) sem mecanismo automático de reconciliação com Supabase
- Busca puramente client-side, sem suporte a embedding/pgvector ativo
- Mapeamento incorreto de 2 views na navegação (`architecture` e `registry`)
- Duplicação de sistema de menus (navigationItems + treeSections)
- Ausência de auditoria de alterações para operações genéricas
- Inline styles misturados com tokens CSS customizados

**Riscos críticos:**
- Qualquer pessoa autenticada pode criar/editar/excluir padrões via Supabase RLS (policy muito permissiva)
- Dados de fallback podem divergir do Supabase sem reconciliação automática
- Sem testes, regressões podem passar despercebidas

**Recomendação final:**
A Central de Padrões está em estado **aprovado com ajustes**, porque a estrutura está completa, funcional e coerente, mas ainda precisa de testes automatizados, reconciliação de fallback, correção de mapeamento de views e políticas RLS mais granulares para ser considerada fonte oficial de padrões do SagB sem supervisão constante.

---

## 2. Caminho auditado

```
Z:\00_sagb\src\modules\central_padroes\
├── .logs/            (5 arquivos)
├── .specs/           (2 arquivos)
├── agent/            (4 arquivos)
├── components/       (14 componentes)
├── data/             (2 arquivos)
├── docs/             (40+ documentos em 8 subpastas + raiz)
├── hooks/            (1 hook)
├── layout/           (1 layout)
├── pages/            (21 páginas)
├── scripts/          (1 script)
├── services/         (10 serviços)
├── styles/           (1 CSS)
└── types/            (1 arquivo de tipos)
```

Total: 145 arquivos.

---

## 3. Metodologia da auditoria

1. Varredura de arquivos com `dir /s /b`.
2. Leitura de arquivos-chave: index, manifest, routes, types, layout, services, pages representativas, hooks e CSS.
3. Análise de imports, exports, consistência de nomenclatura e padrão de módulo.
4. Comparação com o padrão de módulo plugável do SagB.
5. Verificação de build com `npm run build`.
6. Análise de canonicidade, cobertura de áreas, duplicidades e riscos.
7. Classificação em 19 seções conforme template da auditoria.

---

## 4. Estrutura técnica encontrada

### 4.1 Pastas principais

| Pasta | Existe | Observação |
|---|---|---|
| `components/` | ✅ | 14 componentes, nomenclatura PascalCase |
| `data/` | ✅ | 2 arquivos: fallbackData (2022 linhas) + baseModulesCatalog |
| `docs/` | ✅ | 40+ documentos em 8 subpastas temáticas |
| `hooks/` | ✅ | 1 hook: useCentralPadroes |
| `layout/` | ✅ | 1 layout: CentralPadroesLayout |
| `pages/` | ✅ | 21 páginas |
| `services/` | ✅ | 10 serviços |
| `styles/` | ✅ | 1 CSS: centralDocs.css (1131 linhas) |
| `types/` | ✅ | 1 arquivo: index.ts (180 linhas) |
| `agent/` | ✅ | Persona, prompt, falas e session log |
| `.logs/` | ✅ | Revisões de código e QA |
| `.specs/` | ✅ | Integrações e automações |

### 4.2 Arquivos obrigatórios

| Arquivo | Existe | Observação |
|---|---|---|
| `index.ts` | ✅ | Exporta manifest, routes e module-doc |
| `manifest.ts` | ✅ | Owner: Zico Padron (agent) |
| `module-doc.ts` | ✅ | 35 entradas de Supabase mapeadas |
| `routes.tsx` | ✅ | Usa CentralPadroesLayout |
| `README.md` | ✅ | Documentação de uso |
| `CHANGELOG.md` | ✅ | 8 versões registradas (1.0.0 a 1.6.0) |
| `DECISIONS.md` | ✅ | 31 decisões registradas |
| `PLANNED.md` | ✅ | Próximos passos definidos |

### 4.3 Padrão de nomenclatura

- Pastas: `snake_case`
- Arquivos TSX: `PascalCase.tsx`
- Arquivos TS: `camelCase.ts`
- Serviços: `camelCase.ts` (centralPadroes*Service)
- CSS: `centralDocs.css` (kebab-case para classes `.cp-docs-*`)
- Docs: `kebab-case.md` ou `snake_case.md`

**Padrão consistente.** Não há mistura de estilos.

### 4.4 Imports suspeitos ou quebrados

Nenhum import quebrado encontrado. O build confirma todos os módulos resolvidos (857 módulos transformados).

### 4.5 Arquivos mortos ou duplicados

Nenhum arquivo morto evidente. Todos os imports são usados.

### 4.6 Aderência ao padrão de módulo plugável

✅ Segue o padrão do SagB:
- `index.ts` → exporta `centralPadroesManifest`, `centralPadroesRoutes`, `centralPadroesModuleDoc`
- `manifest.ts` → `ModuleManifest`
- `routes.tsx` → `ModuleRoute`
- `module-doc.ts` → `ModuleDoc`

### 4.7 Pontos de atenção na estrutura

⚠️ `architecture` view renderiza `<StandardsPage />` — deveria ter página própria de Arquitetura Mestra ou ao menos um nome representativo diferente.

⚠️ `registry` view renderiza `<RelationshipsPage />` — nome "Registro Mestre" sugere entidade diferente de relacionamentos/grafo.

⚠️ `agent-mode` view renderiza `<AgentsPage />` — coerente, mas o nome "Modo Agente" pode sugerir interface diferente de apenas listar agentes.

⚠️ `navigationItems` (21 itens flat) e `treeSections` (9 seções aninhadas) coexistem como duas fontes da verdade para labels de menu.

---

## 5. Estrutura documental encontrada

### 5.1 Documentos-mãe

| Documento | Status | Área |
|---|---|---|
| `docs/01_padroes_loze/loze_000_documento_mestre_da_loze.md` | ✅ | Loze |
| `docs/01_padroes_loze/loze_gov_governanca_dos_padroes.md` | ✅ | Loze |
| `docs/arquitetura_mestra_e_governanca_da_central_de_padroes_grupo_b_loze.md` | ✅ | Pietro |
| Documentos ET-09 a ET-20 em `docs/07_validacoes/` | ✅ | Por área |

### 5.2 Padrões atômicos

No `fallbackData.ts`:
- CP-GOV-001 a CP-GOV-007 (Pietro)
- CP-UX-001 a CP-UX-007 (Alice)
- CP-SEC-001 a CP-SEG-006 (Pedro) — nota: CP-SEC-001 existe mas CP-SEG-001 a CP-SEG-006 na curadoria geral
- CP-AGT-001 a CP-AGT-006 (Pierre)
- CP-IA-001 a CP-IA-006 (Klaus)
- CP-PROC-001 a CP-PROC-006 (Yuri)
- CP-NAM-001 a CP-NAM-006 (Noah)
- CP-IDEIA-001 a CP-IDEIA-006 (Dante)
- CP-MET-001 a CP-MET-006 (Nilo)
- CP-ACADB-001 a CP-ACADB-006 (Júlio)
- CP-STARTYB-001 a CP-STARTYB-006 (César)
- CP-TEC-001 a CP-TEC-026 (Sávio)
- CP-MOD-001 (módulos plugáveis)

### 5.3 Tipos normativos presentes

| Tipo | Presente | Observação |
|---|---|---|
| `principio` | ✅ | CP-UX-007, CP-GOV-002 |
| `politica` | ✅ | CP-SEC-001, CP-TEC-001 |
| `regra` | ✅ | CP-GOV-004 |
| `padrao` | ✅ | CP-UX-001, CP-UX-002 |
| `protocolo` | ✅ | CP-UX-003, CP-GOV-006 |
| `processo` | ✅ | CP-PROC-001 |
| `procedimento` | ✅ | (em algumas divisões) |
| `checklist` | ✅ | CP-UX-005 |
| `matriz` | ✅ | CP-UX-004, CP-TEC-016 a CP-TEC-020 |
| `registro` | ✅ | CP-GOV-007, CP-TEC-021 a CP-TEC-025 |
| `decisao` | ✅ | dec-001 a dec-008 |
| `evidencia` | ✅ | CP-TEC-026, CP-UX-006 |
| `template`, `guia`, `manual`, `documentacao_tecnica`, `documentacao_externa`, `prompt_canonico`, `contrato_modulo`, `contrato_agente` | ⚠️ | Tipos definidos no union type mas sem ocorrências no fallback |

### 5.4 Separação por canonicidade

| Categoria | Presente | Observação |
|---|---|---|
| Canônico oficial | ⚠️ | Apenas Alice/UX tem canonização dirigida (ET-24) |
| Aprovado com ajustes | ✅ | CP-UX-001, CP-UX-003, CP-UX-005, CP-UX-007 |
| Candidato a padrão | ✅ | Curadoria geral (revisao/curadoria) |
| Rascunho | ⚠️ | Status `rascunho` definido no tipo mas sem ocorrência no fallback |
| Material bruto | ✅ | Alguns docs em revisão |
| Pendente validação Pietro | ✅ | Todos os itens da curadoria geral |
| Pendente decisão Rodrigues | ✅ | Scope visual Alice/UX, gate obrigatório, evidência |
| Obsoleto | ⚠️ | Nenhum padrão marcado como deprecado/substituído |

---

## 6. Separação por áreas e responsáveis

| Responsável | Área | Existe | O que falta |
|---|---|---|---|
| Pietro Carboni | Governança | ✅ | Validação final de canonicidade |
| Alice Montini | UX/UI | ✅ | Matriz detalhada de tipos de tela (CP-UX-004) |
| Sávio Codare | Técnica | ✅ | Nada crítico |
| Pedro Gazan | Segurança | ✅ | Padrões executivos de implementação |
| Pierre Zanulli | Agentes/IA | ✅ | Regras de autonomia de agente |
| Klaus | Radar de IA/RAI | ✅ | Matriz de risco de IA |
| Yuri Sague | Processos | ✅ | Fluxos executivos integrados |
| Noah Verdii | Naming | ✅ | Regras de naming para agente |
| Dante Montoya | Ideias/StartyB | ✅ | Critérios de aceite de ideia |
| Nilo Barret | Metodologias | ✅ | Protocolos de aplicação |
| Júlio Mosqueira | AcadB | ✅ | Trilhas executivas |
| César Tulli | StartyB | ✅ | Plano de negócio detalhado |
| Tales Inozi | RI/Capital | ⚠️ | Mencionado na auditoria ET-21 mas sem itens no fallback |
| Zico Padron | Guardião (agente) | ✅ | Manifest como owner |

**Separação clara.** Cada área tem seu prefixo, seus itens e seus documentos-mãe.

---

## 7. Análise de canonicidade

### 7.1 Canônico operacional (pós ET-24)

| Código | Item | Justificativa |
|---|---|---|
| CP-UX-001 | Design System SagB | Base visual SagB, sem dependência de decisão externa |
| CP-UX-003 | Gate visual de tela | Protocolo definido como obrigatório para telas novas |
| CP-UX-005 | Checklist de release visual | Checklist operacional de release visual |
| CP-UX-007 | Variação visual real não é troca de cor | Princípio estrutural claro |

### 7.2 Homologado em curadoria (pós ET-24)

| Código | Item | Pendência |
|---|---|---|
| CP-UX-002 | Loze UI Standard e Design System | Pietro precisa validar escopo Loze/GrupoB |
| CP-UX-004 | Matriz tipo de tela x padrão visual | Precisa detalhar tipos de tela |
| CP-UX-006 | Evidência visual por release | Pietro precisa definir obrigatoriedade |

### 7.3 Pendente de validação Pietro

Todos os itens da curadoria geral (ET-10 a ET-20): CP-GOV, CP-SEG, CP-AGT, CP-IA, CP-PROC, CP-NAM, CP-IDEIA, CP-MET, CP-ACADB, CP-STARTYB.

### 7.4 Itens que parecem oficiais sem validação clara

Nenhum. O status `revisao` na curadoria geral deixa claro que não há canonicidade final. O status `aprovado` nos itens Alice/UX está justificado pela ET-24.

---

## 8. Coerência com DR, GERAC e Jornada UAU

### DR (Decisão e Resultado)

✅ Satisfatório. `DECISIONS.md` registra 31 decisões com data, motivo e contexto. O approval workflow segue o princípio de decisão antes de ação.

### GERAC (Gestão, Empreendedorismo, Responsabilidade, Atitude e Cultura)

✅ Presente. Cada padrão tem owner humano. A separação por áreas com responsáveis nomeados segue o princípio de responsabilidade. A cultura de desafio aparece nos itens em revisão e nas decisões propostas.

### Jornada UAU (Experiência, Encantamento, Clareza e Transbordo)

⚠️ Parcial. A Central é clara e organizada para técnicos e agentes, mas a UX ainda pode melhorar:
- Excessos de informação em algumas telas
- Ausência de onboarding visual para novos usuários
- A experiência de "transbordo" (sentir que o sistema é maior que a tela) não está explícita

### Linguagem

✅ Português claro e técnico. Sem inconsistências graves.

### Cultura de desafio

✅ Presente nas decisões propostas (dec-003 a dec-008) e nos padrões em revisão.

---

## 9. UX, UI e usabilidade

### 9.1 Navegação

✅ Sidebar própria com 9 seções colapsáveis. Busca textual no menu. Navegação por abas.

### 9.2 Busca

✅ Busca textual com debounce, filtro por tipo (standard/document/decision), score e excerpt.

⚠️ Não busca em `CentralBaseModule` nem em `CentralAgentRun`.

### 9.3 Cards e tabelas

✅ `StandardTable` com ações inline (editar, excluir, solicitar aprovação). `MetricCard` no dashboard. Cards de módulo base com detalhes.

### 9.4 Diferenciação visual de tipos

✅ Cores por severidade (verde, laranja, azul, roxo). Badges de status. Ícones nas seções.

### 9.5 Estados vazios

✅ `EmptyState` componente com mensagens descritivas.

### 9.6 Clareza para usuário

⚠️ Um usuário encontra um padrão pela sidebar e busca. Mas a diferença entre "Padrões" e "Documentos" pode não ser imediata. A separação entre "Registro Mestre", "Documentação Interna" e "Documentação Externa" pode confundir.

### 9.7 Responsividade

⚠️ O layout usa grid com sidebar fixa de 306px. Em telas menores (<768px), a sidebar colapsa para largura única conforme CSS media query. Funcional mas não ideal para mobile.

### 9.8 Acessibilidade

⚠️ Básica. Labels `aria-label` no SVG do donut chart. Faltam `role`, `aria-expanded` nos botões de seção, contraste de foco visível e suporte a navegação por teclado completo.

---

## 10. Segurança, permissões e governança

### 10.1 Controle de edição

⚠️ As políticas RLS atuais permitem `ALL` para usuário autenticado em `central_padroes_base_modules`. Não há separação entre editor e revisor.

### 10.2 Controle de aprovação

✅ Workflow de aprovação implementado em `centralPadroesApprovalService.ts` com transições de status: rascunho → revisão (review) → curadoria (curation) → aprovado → publicado.

### 10.3 Trilha de auditoria

⚠️ `recordHistory()` existe no CRUD service (registra create/update) mas não há um serviço de auditoria autônomo. Não há log de delete.

### 10.4 Risco de rascunho virar padrão oficial

✅ Mitigado pelo approval workflow. Mas se `createStandard()` for chamado direto via REST sem approval, o padrão nasce como `rascunho` — e pode ser promovido manualmente.

### 10.5 Proteção contra alteração indevida

⚠️ Depende inteiramente do Supabase RLS. A Central em si não tem camada de autorização além do `auth.currentUser`.

### 10.6 Dados sensíveis expostos

Nenhum dado sensível encontrado no código-fonte. Senhas, tokens e chaves não estão no repositório.

---

## 11. Agentes, IA e protocolos

### 11.1 Agente guardião

✅ Zico Padron definido em `manifest.ts` como owner do módulo. Persona documentada em `agent/persona.md`. Prompt de ativação em `agent/prompt_ativacao_cline.md`.

### 11.2 Padrões para agentes

✅ CP-AGT-001 a CP-AGT-006 (Pierre): criação, atualização, dono humano, autonomia, comportamento, linguagem.

### 11.3 Padrões para IA

✅ CP-IA-001 a CP-IA-006 (Klaus): modelos, RAI, boas práticas, validação de outputs, revisão, auditoria.

### 11.4 Protocolo de agente

✅ `agent/session_log.md` para registro de interações. Prompt de ativação com instruções de comportamento.

### 11.5 Lacunas em agentes

- Limites de autonomia: definidos conceitualmente mas sem métricas de execução
- Ferramentas permitidas: não há catálogo de ferramentas por agente
- Memória: não há política de retenção/expurgo de memória de agente
- Comunicação entre agentes: não há protocolo de sala/thread

---

## 12. Integrações com outros módulos

### 12.1 Integrações declaradas em `module-doc.ts`

| Integração | Existe | Observação |
|---|---|---|
| `moduleRegistry.ts` | ✅ | Registro de módulo |
| `governanceRulesService.ts` | ✅ | Publicador legado preservado |
| `centralPadroesRepository.ts` | ✅ | Snapshot central |

### 12.2 Integrações reais

- **Supabase**: ✅ REST via `restFetch` para 6+ tabelas
- **AI Proxy**: ⚠️ Declarado em module-doc mas não implementado
- **Governança SagB**: ✅ Via `governanceRulesService` e `listGovernanceRules()`

### 12.3 Fluxo de ida e volta (A/R)

⚠️ A Central publica padrões para o Supabase. O sync é unidirecional (fallback → online). Não há retorno de outros módulos para a Central a não ser pela leitura dos dados no Supabase.

### 12.4 Integração com tarefas/evidências

⚠️ Tabela `central_padroes_evidence_records` existe declarada em module-doc mas sem serviço CRUD dedicado (apenas `centralPadroesStorageService` para storage).

---

## 13. Lacunas encontradas

### 13.1 Técnicas

| Lacuna | Localização | Impacto | Urgência |
|---|---|---|---|
| Ausência de testes | N/A | Regressão sem barreira | Alta |
| `architecture` view aponta para StandardsPage | `CentralPadroesLayout.tsx:93` | Confusão de navegação | Média |
| `registry` view aponta para RelationshipsPage | `CentralPadroesLayout.tsx:101` | Confusão de navegação | Média |
| Busca não cobre BaseModule e AgentRun | `centralPadroesSearchService.ts` | Lacuna de descoberta | Média |
| Fallback de 2022 linhas sem reconciliação | `data/fallbackData.ts` | Drift com Supabase | Alta |
| Duplicação navigationItems + treeSections | `CentralPadroesLayout.tsx:47-69` vs `137-204` | Duas fontes da verdade | Média |
| CSS monolítico de 1131 linhas | `styles/centralDocs.css` | Dificuldade de manutenção | Baixa |

### 13.2 Documentais

| Lacuna | Localização | Impacto | Urgência |
|---|---|---|---|
| Tipos normativos sem uso | `types/index.ts:18-24` | Poluição de tipo | Baixa |
| Doc de exceção visual não criado | Mencionado na ET-21 | Lacuna de governança visual | Média |
| Matriz autonomia de agente não criada | Mencionado na ET-21 | Lacuna de governança de IA | Média |
| Política de expurgo de evidência | Inexistente | Risco de dados obsoletos | Baixa |

### 13.3 De governança

| Lacuna | Impacto | Urgência |
|---|---|---|
| Canonicidade final pendente de Pietro | Bloqueia oficialização | Alta |
| Decisão Rodrigues sobre gate visual obrigatório | Bloqueia aplicação em novos módulos | Alta |
| RLS permissivo (ALL para authenticated) | Risco de edição indevida | Alta |
| Sem trilha de auditoria para delete | Perda de rastreabilidade | Média |
| Sem separação de perfil (editor vs revisor) | Risco de qualidade | Média |

### 13.4 De segurança

| Lacuna | Impacto | Urgência |
|---|---|---|
| RLS `central_padroes_base_modules: ALL for authenticated` | Qualquer user autenticado pode alterar | Alta |
| Sem validação de owner antes de editar | User pode editar padrão de outro | Média |
| Sem rate limit nas operações CRUD | Risco de spam/abuso | Baixa |

### 13.5 De UX

| Lacuna | Impacto | Urgência |
|---|---|---|
| Font Inter em vez de Rubik (conforme PLANNED.md) | Desalinhamento com Alice UI Standard | Média |
| Falta de onboarding/empty state explicativo | Novos usuários podem se perder | Média |
| Responsividade limitada em mobile | Perda de usabilidade | Baixa |
| Acessibilidade básica incompleta | Exclusão de usuários com deficiência | Média |

---

## 14. Riscos identificados

### 14.1 Críticos

| Risco | Descrição | Probabilidade | Impacto |
|---|---|---|---|
| RLS permissivo | Qualquer user autenticado pode criar/editar/excluir padrões | Média | Alto |
| Drift de fallback | Fallback local de 2022 linhas pode divergir do Supabase | Alta | Médio |
| Ausência de testes | Regressões passam sem detecção | Alta | Alto |

### 14.2 Médios

| Risco | Descrição |
|---|---|
| Mapeamento incorreto de views | Usuário pode achar que "Registro Mestre" é outra página |
| Busca client-side sem limites | Performance degrada com crescimento do dataset |
| Font Inter não compatível com Alice UI Standard | Inconsistência visual com o padrão do módulo |
| Dependência de `restFetch` sem fallback local | Operações CRUD falham sem Supabase |

### 14.3 Baixos

| Risco | Descrição |
|---|---|
| CSS monolítico | Manutenção mais complexa |
| Tipos normativos não usados | Poluição semântica |
| Sem evidência de auditoria de delete | Perda de rastreabilidade |

---

## 15. Duplicidades encontradas

| Tipo | Descrição | Localização | Risco |
|---|---|---|---|
| Menu | `navigationItems` + `treeSections` coexistem | `CentralPadroesLayout.tsx` | Médio — duas fontes para o mesmo label |
| View | `architecture` e `standards` renderizam o mesmo componente | `CentralPadroesLayout.tsx:93,97` | Baixo — apenas nomenclatura |
| View | `registry` e `relationships` renderizam o mesmo componente | `CentralPadroesLayout.tsx:101,124-125` | Baixo — apenas nomenclatura |

Não foram encontradas chaves duplicadas de padrão no `fallbackData.ts`. A validação confirmou unicidade.

---

## 16. Recomendações

### 16.1 Crítico e urgente

1. **Adicionar testes automatizados** — Pelo menos smoke tests para navegação e CRUD, e unit tests para os services.
2. **Aplicar RLS granular** — Separar políticas por operação (SELECT para todos, INSERT/UPDATE/DELETE para admin/editor).
3. **Criar reconciliação automática de fallback** — Script ou serviço que compare fallback com Supabase e alerte sobre divergências.

### 16.2 Importante e estruturante

4. **Corrigir mapeamento de views** — Criar página específica para "Arquitetura Mestra" e "Registro Mestre" ou renomear as views.
5. **Unificar sistema de menus** — Eliminar `navigationItems` e usar apenas `treeSections` como fonte única.
6. **Adicionar busca para BaseModule e AgentRun** — Expandir o search service para cobrir essas entidades.
7. **Migrar Inter para Rubik** — Conforme planejado em PLANNED.md, alinhar ao Alice UI Standard.
8. **Criar serviço de auditoria** — Serviço autônomo que registre todas as operações (create, update, delete) com timestamp e autor.

### 16.3 Relevante, mas pode esperar

9. **Modularizar CSS** — Separar `centralDocs.css` em módulos por seção.
10. **Adicionar onboarding visual** — Página inicial com tutorial rápido para novos usuários.
11. **Melhorar acessibilidade** — Adicionar `role`, `aria-expanded`, foco visível e navegação por teclado.
12. **Expandir critérios de reutilização** — Para a Biblioteca de Módulos Base, adicionar casos de uso concretos.

### 16.4 Oportunidade futura

13. **Busca semântica com pgvector** — Ativar embedding e Chat Pietro.
14. **Catálogo de ferramentas por agente** — Especificar quais ferramentas cada agente pode usar.
15. **Protocolo de comunicação entre agentes** — Salas, threads e registros de interação.
16. **Dashboard de evolução de canonicidade** — Mostrar visualmente o progresso de cada divisão.

---

## 17. Matriz de priorização

| Item | Esforço | Impacto | Prioridade |
|---|---|---|---|
| Testes automatizados | Alto | Alto | 1 |
| RLS granular | Médio | Alto | 2 |
| Reconciliação de fallback | Médio | Alto | 3 |
| Correção de views | Baixo | Médio | 4 |
| Unificar menus | Baixo | Médio | 5 |
| Expandir busca | Baixo | Médio | 6 |
| Serviço de auditoria | Médio | Médio | 7 |
| Migrar Rubik | Médio | Baixo | 8 |
| Modularizar CSS | Alto | Baixo | 9 |
| Onboarding visual | Médio | Baixo | 10 |

---

## 18. Plano de ação

### Passo 1 — Testes e segurança (crítico)
- Criar pasta `__tests__/` com testes unitários para `centralPadroesValidationService`, `centralPadroesSearchService` e `centralPadroesRepository`
- Ajustar políticas RLS para separar SELECT de INSERT/UPDATE/DELETE
- Criar script de reconciliação fallback ↔ Supabase

### Passo 2 — Correções de estrutura (importante)
- Unificar `navigationItems` e `treeSections` em uma única fonte
- Criar página dedicada para "Arquitetura Mestra" ou renomear a view
- Renomear "Registro Mestre" para "Relacionamentos" ou criar página dedicada
- Expandir busca para cobrir BaseModule e AgentRun

### Passo 3 — UX e alinhamento visual (relevante)
- Migrar fonte de Inter para Rubik
- Revisar densidade de listas para 32px
- Adicionar aria-labels e roles nos elementos interativos

### Passo 4 — Governança contínua
- Criar serviço de auditoria com log de todas as operações
- Validar canonicidade com Pietro
- Decisão Rodrigues sobre gate visual obrigatório

---

## 19. Parecer final

> Minha leitura final é que a Central de Padrões está em estado **aprovado com ajustes**, porque a estrutura técnica está madura, o fallback cobre 12 áreas de responsabilidade com centenas de itens normativos, a navegação está organizada e o build compila sem erros. No entanto, para ser considerada fonte oficial de padrões do SagB, ainda precisa evoluir em testes automatizados, segurança RLS granular, reconciliação de fallback com Supabase, correção de mapeamento de views e unificação do sistema de menus, priorizando a adição de testes e o ajuste de permissões como ações críticas.

---

## Anexo: Validação de build

```text
npm run build
✓ built in 28.54s
857 modules transformed.
Nenhum erro de tipo ou importação.
```

Warnings não bloqueantes:
- circular chunk `vendor`/`react-vendor`
- import dinâmico/estático de `supabase.ts`
- chunk principal acima de 500 kB (2.262 kB)
