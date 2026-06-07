# ET02 — Implementação da Fase 01 — Registro

## Data

04/06/2026

## Plano aprovado

Plano de referência: `ET02_AUDITORIA_ESTRATEGICA_PLANO_MESTRE_CID.md`.

## Escopo executado nesta rodada

### 1.8 — Investigação Firestore/Supabase

Resultado preliminar:

- O projeto usa `services/supabase.ts` como shim Firestore-like sobre Supabase/PostgREST.
- O uso de `collection`, `doc`, `onSnapshot`, `where`, `orderBy`, `addDoc` e `updateDoc` no CID não indica Firebase real; indica API compatível implementada pelo shim.
- O shim possui normalização explícita para tabelas CID, incluindo:
  - `cid_assets`
  - `cid_asset_files`
  - `cid_processing_jobs`
  - `cid_chunks`
  - `cid_outputs`
  - `cid_prompts`
  - `cid_prompt_runs`
- Conclusão: a inconsistência principal é de nomenclatura/legibilidade arquitetural, não necessariamente de backend duplicado.
- Risco: o nome Firestore-like pode induzir leitura errada e dificulta manutenção.

### 1.5 — Owner

Criado `agent/owner.md` com owner provisório e regras de governança.

### 1.6 — README

Criado `README.md` do CID com propósito, fronteiras, princípios, estrutura, tabelas e estado atual.

### 1.7 — module-doc

Atualizado `module-doc.ts` para refletir o CID como Centro de Ingestão Documental.

### 5.2 / 5.3 — Governança

Criados:

- `DECISIONS.md`
- `CHANGELOG.md`

## Itens não executados nesta rodada

- Remoção de prompts.
- Remoção de tabelas legadas.
- Remoção de funções serverless.
- Alteração de schema/migration.
- Alteração de RLS/policies.
- Mudança em storage/buckets.

Esses itens exigem decisão humana específica e plano de migração.

## Validação técnica

Comando executado:

```cmd
cd Z:\00_sagb && npx vite build --mode development 2>&1 | findstr /i "built in\|error"
```

Resultado:

```txt
✓ built in 39.97s
```

Status: sem erro de compilação.

### Validação final

Comando executado novamente após atualização de documentação:

```cmd
cd Z:\00_sagb && npx vite build --mode development 2>&1 | findstr /i "built in\|error\|TS"
```

Resultado:

```txt
✓ built in 37.08s
```

Status: sem erro de compilação.

---

## Rodada adicional — próximas fases em lote seguro

### Escopo executado

#### Contrato oficial

Criado `src/modules/cid/cid-contract.ts` com:

- formatos suportados;
- fontes suportadas;
- ações permitidas;
- ações legadas;
- outputs técnicos;
- responsabilidades que não pertencem ao CID;
- limite oficial de tamanho;
- helpers de validação de ação.

#### Utilitários compartilhados

Criado `src/modules/cid/cid-utils.ts` com funções compartilháveis para:

- data;
- bytes;
- label;
- badge de status;
- ícone de material;
- tamanho de asset.

#### Componentização parcial

Criados componentes:

- `CidBoundaryBanner.tsx` — banner de fronteira do módulo;
- `CidProcessingQueue.tsx` — fila de processamento extraída de `CIDView.tsx`.

#### Fronteira aplicada na UI

- Removida a exposição principal do botão de derivação por prompt.
- Seleção de ativos permanece visível, mas sem CTA de inteligência profunda.
- Opção `store_consolidate` removida do formulário de upload.
- `desiredAction` agora é sanitizado contra `CID_ALLOWED_ACTIONS` antes da criação do asset.
- Formulário de upload exibe banner de fronteira do CID.

### Validação técnica adicional

Comando executado:

```cmd
cd Z:\00_sagb && npx vite build --mode development 2>&1 | findstr /i "built in\|error\|TS"
```

Resultado:

```txt
✓ built in 39.74s
```

Status: sem erro de compilação.

### Rodada definitiva autorizada pelo Rodrigues

Autorização recebida: não há dados a preservar; a remoção da camada de prompts/derivados do CID pode ser definitiva.

Executado:

- Removidos listeners de `cid_prompts`, `cid_prompt_runs` e `cid_prompt_run_items` de `CIDView.tsx`.
- Removidos estados, handler e modal de prompt/derivados de `CIDView.tsx`.
- Removida exibição de derivados no detalhe do asset.
- Removidos tipos `CidPrompt`, `CidPromptRun` e `CidPromptRunItem` de `types.ts`.
- Removida função serverless `netlify/functions/cid-apply-prompt-background.mjs`.
- Atualizados `README.md`, `DECISIONS.md`, `CHANGELOG.md` e `module-doc.ts` para refletir remoção definitiva.

Não executado nesta rodada:

- Alteração de migrations.
- Alteração de RLS/policies.
- Alteração de buckets.

Motivo: ainda que não haja dados, essas mudanças dependem do estado real do Supabase e devem ser feitas em uma rodada SQL/migration própria.

Validação após remoções:

```cmd
cd Z:\00_sagb && npx vite build --mode development 2>&1 | findstr /i "built in\|error\|TS"
```

Resultado:

```txt
✓ built in 37.93s
```

Validação final após limpeza de prop remanescente no dashboard e atualização documental:

```txt
✓ built in 28.00s
```

Busca final por referências removidas:

```cmd
findstr /s /n /i "CidPrompt CidPromptRun CidPromptRunItem cid_prompt_runs cid_prompt_run_items cid_prompts cid-apply-prompt-background showPromptModal handleApplyPrompt selectedPromptId promptRuns promptRunItems" ...
```

Resultado: nenhuma ocorrência compilável restante.

## Correção de landing inicial do CID

Problema reportado: ao entrar no módulo, a tela inicial não aparecia no Dashboard Geral.

Correção aplicada em `components/CIDView.tsx`:

- adicionado efeito de entrada por `scopedWorkspaceId`;
- força `viewMode = 'dashboard'`;
- limpa `localRootName`;
- limpa seleção e busca;
- evita que estado antigo de HMR/cache ou retorno ao módulo mantenha subvisões internas.

Validação:

```txt
✓ built in 36.45s
```
