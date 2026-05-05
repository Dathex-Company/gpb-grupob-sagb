# Prompt Mega Blaster: Refatoração Geral do Módulo Metodologias

> **Nome técnico:** Refatoração Completa / Módulo Metodologias
> **Modo de execução:** Code
> **Baseado na auditoria:** [`plans/prompt-modelo-auditoria-codigo.md`](plans/prompt-modelo-auditoria-codigo.md)
> **Módulo alvo:** [`src/modules/metodologias`](src/modules/metodologias)

## Instruções de Uso

1. Copie o prompt abaixo
2. Envie para o agente no modo **Code**
3. O agente deve executar **todas as etapas** em sequência, validando cada uma antes de passar para a próxima
4. Ao final, deve apresentar um resumo do que foi alterado e se houveram bloqueios

---

## INÍCIO DO PROMPT

Você é Roo, um engenheiro de software sênior especializado em refatoração de TypeScript/React. Sua tarefa é executar a **refatoração completa** do módulo Metodologias, corrigindo todos os problemas identificados na auditoria abaixo, em uma única execução sequencial.

### Diagnóstico consolidado

- Módulo: [`src/modules/metodologias`](src/modules/metodologias)
- 7 itens de correção organizados por prioridade e dependência
- Arquivo principal de persistência: [`src/modules/metodologias/services/metodologiasPersistencia.ts`](src/modules/metodologias/services/metodologiasPersistencia.ts) (1143 linhas)
- Arquivo de lifecycle de snapshots: [`src/modules/metodologias/services/metodologiasSnapshotCanonicoLifecycle.ts`](src/modules/metodologias/services/metodologiasSnapshotCanonicoLifecycle.ts) (127 linhas)
- Página Hub central: [`src/modules/metodologias/pages/MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx) (~1408 linhas)
- Rota principal: [`src/modules/metodologias/routes.tsx`](src/modules/metodologias/routes.tsx) (15 linhas)
- Documentação: [`src/modules/metodologias/decisions.md`](src/modules/metodologias/decisions.md), [`src/modules/metodologias/changelog.md`](src/modules/metodologias/changelog.md)

### Regras Gerais

- **Não quebre compatibilidade** com consumidores existentes (outros módulos que importam destes services)
- **Não remova exports** — apenas adicione ou substitua implementações internas
- **Preserve a estrutura de tipos** já definida em [`src/modules/metodologias/types`](src/modules/metodologias/types)
- **Documente cada alteração** no [`changelog.md`](src/modules/metodologias/changelog.md) e [`decisions.md`](src/modules/metodologias/decisions.md)
- Ao final, execute `npm run build` ou `npx tsc --noEmit` para validar que não há quebras de tipo

---

## ETAPA 1 — Corrigir duplicação de relações canônicas

**Arquivo:** [`src/modules/metodologias/services/metodologiasPersistencia.ts`](src/modules/metodologias/services/metodologiasPersistencia.ts)
**Função:** [`salvarRelacoesCanonicasPersistidas()`](src/modules/metodologias/services/metodologiasPersistencia.ts:647)
**Gravidade:** 🔴 ALTA

### Problema
A função sempre faz `addDoc` (insert) para cada relação, sem limpar as relações existentes antes. Isso causa duplicação cumulativa.

### O que fazer

Substituir a implementação de [`salvarRelacoesCanonicasPersistidas()`](src/modules/metodologias/services/metodologiasPersistencia.ts:647) por uma estratégia **replace-set**:

1. **Antes de inserir**, faça uma consulta para obter os IDs das relações existentes para o mesmo `ativo_canonico_id`:
   ```typescript
   const existentesSnapshot = await getDocs(
     query(
       collection(db, RELACOES_CANONICAS_TABLE),
       where('ativo_origem_id', '==', params.ativo_canonico_id)
     )
   );
   const existentesIds = existentesSnapshot.docs.map((doc) => doc.id);
   ```

2. **Delete as existentes** (se houver):
   ```typescript
   if (existentesIds.length > 0) {
     await Promise.all(
       existentesIds.map((id) => deleteDoc(doc(db, RELACOES_CANONICAS_TABLE, id)))
     );
   }
   ```

3. **Insira as novas** (mantendo o `Promise.all` existente para inserção).

4. Retorne as relações recém-criadas (já faz isso, mas ajuste a leitura final).

### Bônus — validação
Adicione validação de `self-loop` (já existe para estruturação, replicar lógica similar):
```typescript
params.relacoes.forEach((relacao) => {
  if (relacao.ativo_origem_id === relacao.ativo_destino_id) {
    throw new Error('Self-loop não permitido em relações canônicas.');
  }
});
```

### Validar
- Chamar a função duas vezes seguidas com os mesmos dados não deve duplicar registros
- A contagem de relações após a segunda chamada deve ser igual à primeira

---

## ETAPA 2 — Reduzir fan-out de queries (N+1 de leitura)

**Arquivo:** [`src/modules/metodologias/services/metodologiasPersistencia.ts`](src/modules/metodologias/services/metodologiasPersistencia.ts)
**Funções:** [`listarAtivosEmEstruturacaoPersistidos()`](src/modules/metodologias/services/metodologiasPersistencia.ts:600), [`listarAtivosCanonicosPersistidos()`](src/modules/metodologias/services/metodologiasPersistencia.ts:625)
**Gravidade:** 🔴 ALTA

### Problema
Para cada ativo, são disparadas múltiplas consultas individuais em lotes separados. Cada função auxiliar (`listarBlocosPorAtivosIds`, `listarRelacoesCanonicasPorAtivosIds`, etc.) usa `Promise.all(ativosIds.map(...))` que gera N consultas para N ativos, cada uma com `where` simples.

### O que fazer

**Estratégia 1** (se o Firestore/Supabase suportar `in` queries com mais de 10 elementos):

Criar uma função auxiliar genérica:
```typescript
const batchQueryInChunks = async <T>(
  collectionName: string,
  field: string,
  values: string[],
  mapFn: (doc: any) => T,
  chunkSize = 30
): Promise<Map<string, T[]>> => {
  const result = new Map<string, T[]>();
  // ... implementar chunking com array-contains-any ou in
  // Firestore: where(field, 'in', chunk) com chunks de 30
  // Supabase/Firebase depende do runtime
  return result;
};
```

**Estratégia 2** (fallback — mesma estrutura, mas documentar):

Se o runtime não suportar `in` queries com arrays grandes, adicione um **cache de janela** (`Map` local estático) com TTL de 30 segundos para consultas repetidas no mesmo ciclo de renderização, evitando reconsultar o mesmo ativo duas vezes.

**Implementação mínima aceitável:**
- Adicione um **comentário de tipagem** indicando a limitação conhecida (N+1)
- Adicione um **guard** para evitar consultas quando `ativosIds` estiver vazio (já existe em alguns, mas verificar todos)
- Adicione **log de performance** (`console.warn` condicional) quando o número de queries ultrapassar 10

```typescript
const PERF_LOG_THRESHOLD = 10;
// ... dentro de cada listar*PorAtivosIds:
if (ativosIds.length > PERF_LOG_THRESHOLD) {
  console.warn(`[PERF] ${funcao}: ${ativosIds.length} consultas individuais disparadas`);
}
```

### Validar
- A função deve continuar funcionando com 0 ativos (edge case)
- Logs de performance não devem aparecer em operações normais (< 10 ativos)

---

## ETAPA 3 — Corrigir concorrência não determinística no backfill de snapshots

**Arquivo:** [`src/modules/metodologias/services/metodologiasSnapshotCanonicoLifecycle.ts`](src/modules/metodologias/services/metodologiasSnapshotCanonicoLifecycle.ts)
**Função:** [`executarBackfillSnapshotsCanonicosDoAtivo()`](src/modules/metodologias/services/metodologiasSnapshotCanonicoLifecycle.ts:66)
**Gravidade:** 🔴 ALTA

### Problema
As variáveis `versoesAtualizadas` e `falhas` (arrays) são mutadas via `push()` dentro de callbacks de `Promise.all()`. Isso é uma **race condition**: múltiplas promessas podem tentar modificar o mesmo array simultaneamente, causando perda de itens ou ordenação imprevisível.

### O que fazer

Refatorar o `Promise.all` para usar padrão **imutável**:

```typescript
const resultados = await Promise.allSettled(
  semSnapshot.map(async (versao) => {
    try {
      const snapshot = criarSnapshotCanonicoFromAtivo(ativo);
      const atualizada = await atualizarSnapshotVersaoCanonicaPersistida({ versao, snapshot });
      return { status: 'fulfilled' as const, value: atualizada };
    } catch (error) {
      return {
        status: 'rejected' as const,
        reason: {
          versao_id: versao.id,
          numero_versao: versao.numero_versao,
          motivo: error instanceof Error ? error.message : 'Falha não identificada'
        }
      };
    }
  })
);

const versoesAtualizadas: AtivoCanonicoVersao[] = [];
const falhas: BackfillSnapshotFalha[] = [];

resultados.forEach((resultado) => {
  if (resultado.status === 'fulfilled') {
    versoesAtualizadas.push(resultado.value);
  } else {
    falhas.push(resultado.reason);
  }
});
```

Use `Promise.allSettled` em vez de `Promise.all` para que uma falha isolada não derrube todo o lote.

### Validar
- Se 2 versões falharem e 3 forem bem-sucedidas, `total_preenchidas` deve ser 3 e `total_falhas` deve ser 2
- A ordenação deve ser estável (a mesma do array de entrada)

---

## ETAPA 4 — Endurecer tipagem no boundary de persistência

**Arquivo:** [`src/modules/metodologias/services/metodologiasPersistencia.ts`](src/modules/metodologias/services/metodologiasPersistencia.ts)
**Gravidade:** 🟡 MÉDIA

### Problema
Uso extensivo de `any` nos mapeadores (`row: any`), o que permite que mudanças no schema do banco não gerem erro de compilação.

### O que fazer

1. **Criar interfaces DTO** no próprio arquivo (ou em [`src/modules/metodologias/types`](src/modules/metodologias/types)):

```typescript
// DTO de leitura do Firestore
interface EntradaBrutaRow {
  id: string;
  titulo?: string | null;
  tipo_de_entrada?: string | null;
  conteudo_bruto?: string | null;
  origem?: string | null;
  status_de_estruturacao?: string | null;
  created_at?: any;
  updated_at?: any;
}
```

2. **Substituir `row: any`** pelos DTOs específicos em cada mapeador:
   - [`mapEntrada(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:65) → `mapEntrada(row: EntradaBrutaRow)`
   - [`mapBlocoInterno(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:76) → `mapBlocoInterno(row: BlocoInternoRow)`
   - [`mapBlocoCanonico(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:88) → `mapBlocoCanonico(row: BlocoCanonicoRow)`
   - [`mapVersaoCanonica(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:101) → `mapVersaoCanonica(row: VersaoCanonicaRow)`
   - [`mapAtivo(row: any, ...)`](src/modules/metodologias/services/metodologiasPersistencia.ts:144) → `mapAtivo(row: AtivoEmEstruturacaoRow, ...)`
   - [`mapAtivoCanonico(row: any, ...)`](src/modules/metodologias/services/metodologiasPersistencia.ts:178) → `mapAtivoCanonico(row: AtivoCanonicoRow, ...)`
   - [`mapEventoManutencaoCanonica(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:115) → `mapEventoManutencaoCanonica(row: EventoManutencaoRow)`
   - [`mapRelacaoCanonica(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:125) → `mapRelacaoCanonica(row: RelacaoCanonicaRow)`
   - [`mapRelacaoEstruturacao(row: any)`](src/modules/metodologias/services/metodologiasPersistencia.ts:133) → `mapRelacaoEstruturacao(row: RelacaoEstruturacaoRow)`

3. **Tipar `toIso`** — substituir `value: any` por `value: unknown` e adicionar guards:
```typescript
const toIso = (value: unknown): string => {
  if (!value) return new Date().toISOString();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as any).toDate === 'function')
    return (value as any).toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return String(value);
};
```

4. **Ajustar todas as referências** internas que usam `snapshot.docs.map((item: any) => ...)` para usar o DTO correspondente com `as` cast.

### Validar
- `npx tsc --noEmit` não deve apontar novos erros de tipo
- Nenhum `any` novo deve ser introduzido (apenas substituído)

---

## ETAPA 5 — Substituir fallbacks silenciosos por estado degradado explícito

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx)
**Gravidade:** 🟡 MÉDIA

### Problema
`catch(() => [])` mascara falhas de persistência. O operador pode tomar decisões baseado em dados vazios achando que "não há nada", quando na verdade o banco está indisponível.

### O que fazer

1. **Adicionar estado de erro no HubPage:**

```typescript
const [erroPersistencia, setErroPersistencia] = React.useState<string | null>(null);
```

2. **Modificar o `useEffect` de carregamento** (linha ~330):

```typescript
React.useEffect(() => {
  let ativo = true;
  const carregar = async () => {
    if (!ativo) return;
    setCarregandoPersistencia(true);
    setErroPersistencia(null);
    try {
      const [persistidas, canonicos, estruturacao] = await Promise.all([
        listarEntradasBrutasPersistidas(),
        listarAtivosCanonicosPersistidos().catch((err) => {
          console.error('Falha ao carregar canônicos', err);
          return [] as AtivoCanonico[];
        }),
        listarAtivosEmEstruturacaoPersistidos().catch((err) => {
          console.error('Falha ao carregar em estruturação', err);
          return [] as AtivoEmEstruturacao[];
        })
      ]);
      // ... resto do código
    } catch (error) {
      console.error('Falha ao carregar entradas metodológicas persistidas. Mantendo fallback local/mock.', error);
      setErroPersistencia('Falha na persistência — operando com dados locais temporários.');
      // manter fallback mocks
    } finally {
      if (ativo) setCarregandoPersistencia(false);
    }
  };
  carregar();
  return () => { ativo = false; };
}, []);
```

3. **Renderizar banner de erro** na UI (próximo ao header canônico):
```tsx
{erroPersistencia && (
  <div className="mb-4 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-semibold">
    ⚠️ {erroPersistencia}
  </div>
)}
```

4. **Repetir padrão similar** em outros `catch` que atualmente silenciam erro:
   - [`buscarAtivoEmEstruturacaoPorEntradaId`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:392): capturar e logar, manter estado local
   - Operações de escrita que usam `.catch()` (ex.: [`atualizarAtivoEmEstruturacaoPersistido`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:582), [`criarBlocoInternoPersistido`](src/modules/metodologias/pages/MetodologiasHubPage.tsx:593), etc.)

Para as operações de escrita, substitua o padrão `.catch(console.error)` por:
```typescript
Promise.resolve(operacao).catch((err) => {
  console.error('Falha na operação de persistência', err);
  setErroPersistencia(`Falha ao salvar: ${err instanceof Error ? err.message : 'erro desconhecido'}`);
});
```

**Importante:** O fallback local/mock (dados mockados) deve continuar sendo usado quando a persistência falha, mas agora com indicador visual claro.

### Validar
- Simular falha de rede: o HubPage deve carregar com dados mockados E exibir o banner âmbar
- Clicar em qualquer ação de escrita com persistência indisponível: deve mostrar erro, não crashar

---

## ETAPA 6 — Centralizar contrato de navegação por evento global

**Arquivo:** [`src/modules/metodologias/routes.tsx`](src/modules/metodologias/routes.tsx)
**Gravidade:** 🟡 MÉDIA

### Problema
O evento `CustomEvent('sagb:navigate', { detail: 'ecosystem' })` não tem contrato de tipo — o payload é um `string` solta. Qualquer módulo que consumir eventos `sagb:navigate` precisa adivinhar os valores válidos.

### O que fazer

1. **Criar tipo centralizado** em [`src/modules/metodologias/routes.tsx`](src/modules/metodologias/routes.tsx) (ou em um arquivo compartilhado, mas mantenha local para evitar quebra):

```typescript
export type SagbNavigateDestination = 'ecosystem' | 'home' | string;

export function dispatchNavigate(destination: SagbNavigateDestination): void {
  window.dispatchEvent(
    new CustomEvent<SagbNavigateDestination>('sagb:navigate', { detail: destination })
  );
}
```

2. **Substituir o uso direto** no `handleBackToSagB`:

```typescript
const handleBackToSagB = () => {
  dispatchNavigate('ecosystem');
};
```

3. **Atualizar [`decisions.md`](src/modules/metodologias/decisions.md)** para registrar a decisão de centralização do contrato (adicione uma nova entrada com data de hoje).

### Validar
- O botão "Voltar ao SagB" deve continuar funcionando após a mudança
- O tipo `SagbNavigateDestination` deve aceitar `'ecosystem'` e `string` genérica para flexibilidade futura

---

## ETAPA 7 — Harmonizar inconsistências documentais

**Arquivos:** [`src/modules/metodologias/decisions.md`](src/modules/metodologias/decisions.md), [`src/modules/metodologias/changelog.md`](src/modules/metodologias/changelog.md)
**Gravidade:** 🔵 BAIXA

### Problema
- [`decisions.md:42`](src/modules/metodologias/decisions.md:42) — item 14 afirma o componente [`MetodologiasInternalMenu`](src/modules/metodologias/components/MetodologiasInternalMenu.tsx) como "reutilizável"
- [`changelog.md:127`](src/modules/metodologias/changelog.md:127) — afirma que o mesmo componente foi substituído por sidebar inline e o arquivo é "órfão"

### O que fazer

1. **Atualizar [`decisions.md`](src/modules/metodologias/decisions.md)** — adicionar entrada de deprecação com data de hoje:
```markdown
## [DATA_ATUAL] — Deprecação do MetodologiasInternalMenu

14. (DEPRECATED) **`MetodologiasInternalMenu`** — O componente foi substituído pela sidebar inline no HubPage (v1.3.0). O arquivo permanece no repositório para referência histórica, mas não é mais importado por nenhuma página. Considere remover em limpeza futura.
```

2. **Adicionar JSDoc** no componente órfão para avisar:
```typescript
/**
 * @deprecated Substituído por sidebar inline em MetodologiasHubPage (v1.3.0-sidebar-refined).
 * Mantido para referência histórica. Não importar em novos códigos.
 */
```

3. **Atualizar [`changelog.md`](src/modules/metodologias/changelog.md)** — adicionar entrada da refatoração atual:
```markdown
## [v1.4.0-refactor-mega-blaster] - [DATA_ATUAL]

### Corrigido
- Duplicação de relações canônicas em `salvarRelacoesCanonicasPersistidas()` — implementado replace-set
- Concorrência não determinística em `executarBackfillSnapshotsCanonicosDoAtivo()` — migrado para `Promise.allSettled` + arrays imutáveis
- Tipagem fraca (`any`) nos mapeadores de persistência — adicionados DTOs `*Row`
- Fallbacks silenciosos de persistência — adicionado estado `erroPersistencia` com banner visual
- Contrato frágil de navegação por evento global — centralizado em `dispatchNavigate()`
- Inconsistência documental entre decisions.md e changelog.md sobre MetodologiasInternalMenu

### Performance
- Adicionado log condicional de performance em consultas N+1 (threshold: 10)
- Adicionado guard para array vazio em todas as funções listar*PorAtivosIds
```

### Validar
- O changelog reflete todas as 6 etapas anteriores
- O decisions.md tem a entrada de deprecação
- Nenhuma referência cruzada aponta para informação contraditória

---

## ETAPA 8 — (Bônus) Acessibilidade — Reforço ARIA em navegação interna

**Arquivo:** [`src/modules/metodologias/pages/MetodologiasHubPage.tsx`](src/modules/metodologias/pages/MetodologiasHubPage.tsx)
**Gravidade:** 🔵 BAIXA

### Problema
A navegação interna (sidebar de itens de menu) não possui `aria-current` na seção ativa, nem `aria-label` contextual.

### O que fazer

No mapeamento dos itens de navegação (buscar o `map` que gera os `<button>` de navegação), adicionar:

```tsx
{item.id === rotaAtiva ? (
  <button
    aria-current="page"
    aria-label={`${item.label} — seção ativa`}
    // ...resto
  >
) : (
  <button
    aria-label={`Ir para ${item.label}`}
    // ...resto
  >
)}
```

### Validar
- A ferramenta de acessibilidade do navegador (ou Lighthouse) deve mostrar `aria-current="page"` no item ativo
- Navegação por teclado (Tab) deve funcionar sem travamentos

---

## Ordem de Execução

```
1 → 2 → 3 → 4 → 5 → 6 → 7 → 8
```

**Dependências:**
- Etapa 1, 2, 3 são independentes entre si e podem ser feitas paralelamente
- Etapa 4 (tipagem) MUDARIA as assinaturas dos mapeadores — verificar se consumidores (outros services) quebram
- Etapa 5 (fallback) depende de saber onde os erros ocorrem (independente)
- Etapa 6 (navegação) é independente
- Etapa 7 (doc) é a última, pois registra todas as mudanças das etapas anteriores
- Etapa 8 (acessibilidade) é independente

## Validação Final

Após TODAS as etapas, execute:

```bash
npx tsc --noEmit
```

- ✅ Zero erros de compilação
- ✅ Zero `any` novo introduzido além dos substituídos
- ✅ Banner de erro de persistência aparece quando banco está offline
- ✅ Relações canônicas não são duplicadas em chamadas consecutivas
- ✅ Snapshot backfill não perde resultados sob falha parcial

## Resumo de Saída

Ao final, produza um relatório com:
1. Quantas funções foram modificadas por arquivo
2. Quantos `any` foram substituídos por DTOs tipados
3. Quantos `catch` silenciosos foram convertidos para estado degradado
4. Se houve algum bloqueio ou impossibilidade técnica em alguma etapa

---

## FIM DO PROMPT
