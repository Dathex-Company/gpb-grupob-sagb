# Plano de Correções e Melhorias — Módulo Metodologias

> **Data:** 2026-05-19  
> **Versão:** 1.0  
> **Status:** Proposto  

---

## Sumário Executivo

O módulo `metodologias` está operacional no modo **"assistido operacional"** — funciona com supervisão humana, mas ainda não entrega a promessa de "ponte" (input → metodologia pronta) de forma automatizada. Este plano endereça os **gargalos reais** que impedem o uso fluido e a automação do fluxo completo.

**Problema central:** O módulo tem o esqueleto completo (9 migrations, 8 páginas, 6 serviços de persistência, fluxo de promoção), mas:
1. As migrations **não foram executadas** → módulo roda em fallback local
2. O fluxo exige **5+ intervenções manuais** entre input e metodologia pronta
3. A qualidade do código tem **18 vazamentos de tipo** (`item: any`) e **4 bypasses de error handling**
4. O HubPage é um **monólito de 1492 linhas**
5. A experiência tem **excesso de filtros** e telas densas

---

## Lote 1 — Provisionamento de Banco (P0)

**Objetivo:** Sair do modo degradado e ter persistência real.

### 1.1 Aplicar migrations pendentes

**Arquivos:** [`supabase/migrations/20260405000001_metodologias_fluxo_estruturacao.sql`](supabase/migrations/20260405000001_metodologias_fluxo_estruturacao.sql) até [`20260407000009_metodologias_relacoes_estruturacao.sql`](supabase/migrations/20260407000009_metodologias_relacoes_estruturacao.sql) (9 migrations)

**O quê:** Executar `supabase migration up` ou aplicar os SQLs manualmente no banco de produção.

**Tabelas criadas:**
| Migration | Tabela | Finalidade |
|-----------|--------|------------|
| 00001 | `metodologias_entradas_brutas` | Input bruto de documentos |
| 00001 | `metodologias_ativos_em_estruturacao` | Rascunhos em andamento |
| 00002 | `metodologias_blocos_estruturacao` | Blocos internos do rascunho |
| 00003 | `metodologias_catalogo_canonico` | Catálogo de metodologias oficiais |
| 00004 | `metodologias_blocos_canonicos` | Blocos canônicos |
| 00005 | `metodologias_versoes_canonicas` | Versionamento |
| 00005 | `metodologias_eventos_manutencao_canonica` | Eventos de manutenção |
| 00006 | `snapshot` column | Snapshot JSON em versões |
| 00007 | `snapshot_status`, `snapshot_validado_em` columns | Integridade de snapshots |
| 00008 | `metodologias_relacoes_canonicas` | Relações entre oficiais |
| 00009 | `metodologias_relacoes_estruturacao` | Relações durante estruturação |

**Critério de aceite:** Ao recarregar o módulo, o banner amarelo "modo degradado" some e os dados persistem entre recarregamentos.

### 1.2 Remover fallback local após confirmação

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx:326-333`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:326)

**O quê:** Após confirmar que as migrations rodaram, remover ou tornar opcional o fallback para `entradasBrutasBase` (dados mockados). O módulo deve exigir banco real para operar ou mostrar uma tela de "configuração pendente" clara.

**Critério de aceite:** Sem tabelas, o módulo mostra tela de erro clara ("Banco não configurado — contate o administrador") em vez de operar com dados fictícios.

---

## Lote 2 — Simplificação do Fluxo ("Ponte" Automática) (P1)

**Objetivo:** Reduzir de 5+ passos manuais para 2-3 cliques no cenário ideal.

### 2.1 Criar fluxo "Publicação Rápida"

**Arquivos:** 
- [`src/modules/metodologias/services/metodologiasPromocaoAssistida.ts`](src/modules/metodologias/services/metodologiasPromocaoAssistida.ts)
- [`src/modules/metodologias/services/metodologiasCatalog.ts`](src/modules/metodologias/services/metodologiasCatalog.ts)
- [`src/modules/metodologias/pages/MetodologiasMesaPage.tsx`](src/modules/metodologias/pages/MetodologiasMesaPage.tsx)

**O quê:** Adicionar função `publicarEntradaDiretamente()` que:
1. Recebe um `conteudo_bruto` 
2. Executa `gerarConversaoAssistidaDeEntrada` em modo completo (não preview)
3. Cria o ativo em estruturação com `salvarAtivoEmEstruturacaoFromPreview`
4. Se a qualidade do preview for alta (diagnosticada por heurística: nome + resumo + definicao + objetivo preenchidos + ao menos 1 bloco), pula edição guiada e vai direto para `promoverAtivoEmEstruturacaoParaCanonico`
5. Retorna o ativo canônico finalizado

**Impacto:** Reduz o fluxo de **5 passos** (registrar → abrir preview → editar → revisar diagnóstico → promover) para **2 passos** (colar texto + clicar "Publicar diretamente").

**Critério de aceite:** Um texto bem formatado colado na mesa gera uma metodologia oficial em menos de 3 cliques.

### 2.2 Adicionar input de texto livre direto (sem formulário)

**Arquivos:**
- [`src/modules/metodologias/pages/MetodologiasMesaPage.tsx:506-583`](src/modules/metodologias/pages/MetodologiasMesaPage.tsx:506)

**O quê:** No topo da MesaPage, além do formulário de "Novo documento" com campos (título, tipo, origem, conteúdo), adicionar uma **caixa de texto única** onde o usuário pode colar qualquer conteúdo e clicar em "Interpretar e estruturar". O sistema infere título, tipo, origem automaticamente.

**Critério de aceite:** Usuário cola um texto de 3 parágrafos, clica em um botão, e o sistema extrai título, classifica o tipo, e gera o preview sem nenhum campo manual.

### 2.3 Input em lote (upload múltiplo)

**Arquivos:**
- [`src/modules/metodologias/pages/MetodologiasHubPage.tsx:547-603`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:547)
- [`src/modules/metodologias/pages/MetodologiasMesaPage.tsx`](src/modules/metodologias/pages/MetodologiasMesaPage.tsx)

**O quê:** Permitir upload de múltiplos documentos de uma vez (já existe suporte a `arquivosBrutos` no estado do HubPage, mas não está exposto na UI como multi-lote). Criar uma fila de processamento que itera sobre cada entrada e gera os previews em paralelo.

**Critério de aceite:** Usuário faz upload de 5 PDFs/textos de uma vez e vê todos processados na fila de trabalho.

---

## Lote 3 — Correções de Tipo e Qualidade (P1)

**Objetivo:** Eliminar `any` e padronizar error handling.

### 3.1 Tipar `item: any` nas iterações de snapshot

**Arquivo:** [`src/modules/metodologias/services/metodologiasPersistencia.ts`](src/modules/metodologias/services/metodologiasPersistencia.ts)

**Ocorrências (18 no total):**

| Linha | Local | Tipo correto |
|-------|-------|-------------|
| 240 | `listarBlocosCanonicosPorAtivosIds` | `QueryDocumentSnapshot` |
| 265 | `listarVersoesCanonicasPorAtivosIds` | `QueryDocumentSnapshot` |
| 288 | `listarRelacoesCanonicasPorAtivosIds` | `QueryDocumentSnapshot` |
| 311 | `listarEventosManutencaoCanonicaPorAtivosIds` | `QueryDocumentSnapshot` |
| 332 | `listarBlocosPorAtivosIds` | `QueryDocumentSnapshot` |
| 355 | `listarRelacoesEstruturacaoPorAtivosIds` | `QueryDocumentSnapshot` |
| 371 | `listarBlocosInternosDoAtivoPersistido` | `QueryDocumentSnapshot` |
| 577 | `listarEntradasBrutasPersistidas` | `QueryDocumentSnapshot` |
| 618 | `listarAtivosEmEstruturacaoPersistidos` | `QueryDocumentSnapshot` |
| 624 | `listarAtivosEmEstruturacaoPersistidos` (row) | `BaseRow & Record<string, unknown>` |
| 637 | `listarAtivosCanonicosPersistidos` | `QueryDocumentSnapshot` |
| 646 | `listarAtivosCanonicosPersistidos` (row) | `BaseRow & Record<string, unknown>` |
| 665 | `salvarRelacoesCanonicasPersistidas` | `QueryDocumentSnapshot` |

**O quê:** Criar tipo genérico `SnapshotDoc<T>` que mapeia `QueryDocumentSnapshot` para `T & { id: string }`, e substituir todas as ocorrências de `item: any`.

```typescript
type SnapshotDoc<T> = QueryDocumentSnapshot & { id: string; data(): T };
```

**Critério de aceite:** `npx tsc --noEmit` no módulo não acusa nenhum `any` implícito.

### 3.2 Substituir `console.error` por `registrarErroPersistencia`

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx)

**Ocorrências (4):**

| Linha | Handler |
|-------|---------|
| 1141 | `handlePromoverAssistido` — `console.error('Falha na promoção...')` |
| 1161 | `handleAbrirEdicaoGuiada` — `console.error('Falha ao salvar...')` |
| 1182 | `carregarBlocosOrigemCanonica` — `console.error('Falha ao carregar blocos...')` |
| (buscar) | Outros handlers sem `registrarErroPersistencia` |

**O quê:** Substituir todos os `console.error` por chamadas a `registrarErroPersistencia(contexto, error)` para que erros apareçam no banner da UI em vez de apenas no console.

**Critério de aceite:** Qualquer falha de persistência no módulo exibe um banner visível ao usuário.

---

## Lote 4 — Decomposição do HubPage (P2)

**Objetivo:** Reduzir o monólito de 1492 linhas para < 800 linhas.

### 4.1 Extrair hooks customizados

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx)

**O quê:** Extrair a lógica de estado e handlers para hooks separados:

| Hook | Estado/Handler | Linhas atuais |
|------|---------------|---------------|
| `useEntradasBrutas` | `entradasBrutasLocal`, `handleRegistrarEntradaBruta`, `handleSelecionarEntrada` | 341-603 |
| `useAtivosEstruturacao` | `ativoEmEstruturacaoLocal`, blocos, relações, handlers | 605-802 |
| `useAtivosCanonicos` | `ativosCanonicosPersistidos`, handlers de bloco canônico, versões | 799-1123 |
| `usePromocaoAssistida` | Diagnóstico, preview, `handlePromoverAssistido` | 1125-1166 |
| `useNavegacaoInterna` | Rota hash, navegação, ativo selecionado | 130-150, 374-377, 521-545 |

**Impacto:** HubPage cai de ~1492 para ~500-600 linhas de renderização pura.

### 4.2 Extrair sidebar para componente próprio

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx:1215-1267`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:1215)

**O quê:** Mover `<aside>` com navegação interna e branding para [`MetodologiasSidebar.tsx`](src/modules/metodologias/components/MetodologiasSidebar.tsx) (a criar).

**Critério de aceite:** Navegação e aparência permanecem idênticas, mas o código está separado.

---

## Lote 5 — Melhorias de UX (P2)

**Objetivo:** Reduzir densidade de informação e melhorar orientação do usuário.

### 5.1 Reduzir filtros no Catálogo

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasCatalogoPage.tsx:83-214`](src/modules/metodologias/pages/MetodologiasCatalogoPage.tsx:83)

**O quê:** Atualmente o catálogo tem **12 filtros** (linha 95-183) mais ordenação e agrupamento. Proposta:
- Manter apenas **5 filtros essenciais** na linha principal (tipo, status editorial, maturidade, texto de busca, ordenação)
- Mover os filtros avançados (possui blocos, snapshot, vindo de promoção, manutenção recente, etc.) para um painel colapsável "Filtros avançados"
- Agrupar ordenação e agrupamento em um único seletor combinado

### 5.2 Simplificar indicadores da Mesa

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasMesaPage.tsx:148-214`](src/modules/metodologias/pages/MetodologiasMesaPage.tsx:148)

**O quê:** Atualmente a Mesa tem 9 cartões de indicadores + 5 filtros + 5 seletores de ordenação. Proposta:
- Reduzir para **3 indicadores principais** (Documentos recebidos, Rascunhos, Publicados)
- Consolidar filtros: "Tipo de entrada" + "Status" + "Busca textual"
- Unificar ordenação e agrupamento num único dropdown

### 5.3 Adicionar micro-animações e estados de loading

**Arquivos:** Todas as páginas

**O quê:**
- Skeleton loader enquanto dados carregam (substituir o texto "Carregando dados da área de trabalho...")
- Toast de confirmação após ações (entrada registrada, promoção concluída)
- Transição suave entre rotas internas

### 5.4 Substituir hash routing por React Router

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx:130-150`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:130)

**O quê:** Atualmente a navegação interna usa `window.location.hash` com `lerRotaHash` e `navegarHash`. Isso impede deep linking e quebra o histórico do navegador. Proposta:
- Usar React Router `<Route>` com paths reais dentro do módulo
- Manter `fullscreen: true` no `routes.tsx` mas substituir hash por rotas aninhadas

**Observação:** Isso exige alteração no contrato de `ModuleRoute` em [`src/core/modules/module.types.ts`](src/core/modules/module.types.ts) se não suportar sub-rotas.

---

## Lote 6 — Correções de Schema e Validação (P1)

**Objetivo:** Alinhar o schema do Firestore/PostgreSQL com as validações do frontend.

### 6.1 Verificar consistência de constraint checks

**Arquivos:**
- [`src/modules/metodologias/types/metodologias.types.ts`](src/modules/metodologias/types/metodologias.types.ts)
- Migrations SQL (9 arquivos)

**O quê:** As migrations definem `CHECK` constraints com listas de valores válidos (tipo_de_ativo, status_editorial, maturidade_pratica, etc.). Os types do frontend devem espelhar exatamente esses valores. Verificar:

| Campo | SQL CHECK | TypeScript | Consistente? |
|-------|-----------|------------|-------------|
| `tipo_de_ativo` | `metodologia, processo, protocolo, checklist, principio, aplicacao, ativo_derivado` | `AtivoMetodologicoTipo` em `metodologias.types.ts:66-73` | ✅ Verificar |
| `status_editorial` | `rascunho, em_estruturacao, em_revisao, aprovada, oficial, arquivada` | `MetodologiaStatusEditorial` em `metodologias.types.ts:1-7` | ✅ Verificar |
| `maturidade_pratica` | `conceitual, modelada, testada, validada, escalavel` | `MetodologiaMaturidadePratica` em `metodologias.types.ts:9-14` | ✅ Verificar |
| `governanca_estado` | `em_desenvolvimento, em_revisao, oficial, arquivado, obsoleto` | `AtivoMetodologicoEstadoGovernanca` em `metodologias.types.ts:16-21` | ✅ Verificar |
| `tipo_de_evento` | `ativo_canonico_atualizado, bloco_canonico_atualizado, bloco_canonico_criado, bloco_canonico_removido, versao_canonica_criada` | `AtivoCanonicoEventoManutencaoTipo` em `metodologias.types.ts:532-537` | ✅ Verificar |

### 6.2 Adicionar validação de slug único no frontend

**Arquivo:** [`src/modules/metodologias/services/metodologiasPersistencia.ts:915-920`](src/modules/metodologias/services/metodologiasPersistencia.ts:915)

**O quê:** A migration 00003 cria `unique (slug)` no catálogo canônico. A função `garantirSlugCanonicoUnico` no frontend já trata isso, mas verificar se o tratamento de colisão é robusto o suficiente.

---

## Resumo de Esforço

| Lote | Prioridade | Itens | Esforço Estimado | Impacto |
|------|-----------|-------|------------------|---------|
| 1 — Provisionamento | P0 | 2 | 30 min | 🟢 Sair do modo degradado |
| 2 — Ponte Automática | P1 | 3 | 4-6h | 🟢🟢 Fluxo de 2 cliques |
| 3 — Qualidade de Código | P1 | 2 | 2-3h | 🟢 Tipagem e error handling |
| 4 — Decomposição HubPage | P2 | 2 | 3-4h | 🟡 Manutenibilidade |
| 5 — UX | P2 | 4 | 4-6h | 🟢🟢 Experiência do usuário |
| 6 — Schema/Validação | P1 | 2 | 1h | 🟢 Consistência |

**Total estimado:** 14-20h de desenvolvimento

---

## Ordem de Execução Recomendada

```
Lote 1 (Provisionar banco)
  → Lote 6 (Verificar schema)
    → Lote 2 (Ponte automática — maior impacto funcional)
      → Lote 3 (Qualidade — low risk, high gain)
        → Lote 4 (Decomposição — pode ser feito em paralelo com Lote 5)
          → Lote 5 (UX — refinamentos finais)
```

---

## Riscos

1. **Lote 1 bloqueia tudo:** Sem banco real, não é possível testar as mudanças de fluxo. Prioridade absoluta.
2. **Lote 4 (decomposição):** Risco de quebrar a orquestração dos handlers. Exige testes manuais após cada extração.
3. **Lote 5.4 (hash → React Router):** Pode exigir mudança no core do SagB (`ModuleRoute`). Investigar antes de implementar.
4. **Lote 2.1 (publicação rápida):** Heurística de "qualidade alta" precisa ser calibrada para não publicar conteúdo incompleto. Sugestão: exigir confirmação visual antes da publicação mesmo no modo rápido.
