# Auditoria Estratégica do Estado Atual — CID
## Plano Mestre Mega Estruturado para a Próxima Fase

**Data:** 04/06/2026  
**Responsável:** Cássio Mendes (Engenharia Consultiva)  
**Módulo:** Centro de Inteligência Documental (CID)  
**Documento:** ET 02 — Auditoria + Plano Mestre  
**Status:** Proposta para aprovação

---

## Índice

1. [Leitura Executiva do CID Hoje](#1-leitura-executiva-do-cid-hoje)
2. [O que Existe de Verdade](#2-o-que-existe-de-verdade)
3. [O que Está Forte](#3-o-que-está-forte)
4. [O que Está Frágil](#4-o-que-está-frágil)
5. [O que Está Fora de Posição](#5-o-que-está-fora-de-posição)
6. [Papel Ideal do CID daqui para Frente](#6-papel-ideal-do-cid-daqui-para-frente)
7. [Ideias Suas (Cássio)](#7-ideias-suas-cássio)
8. [Plano Mestre Mega Estruturado](#8-plano-mestre-mega-estruturado)
9. [Perguntas que Ainda Precisam ser Respondidas](#9-perguntas-que-ainda-precisam-ser-respondidas)
10. [Reflexão Crítica Final](#10-reflexão-crítica-final)

---

## 1. Leitura Executiva do CID Hoje

O CID é hoje um módulo semi-estruturado que **já faz mais do que deveria** e **ao mesmo tempo não completa o básico**.

Ele foi reposicionado estrategicamente como **camada de preparação documental** (store now, process later), mas o código ainda carrega o DNA antigo de "inteligência profunda". O resultado é um módulo que:

- **Ingere bem** — upload, armazenamento, fragmentação funcionam > 70%
- **Processa com risco** — extração de texto/PDF/DOCX via Gemini é funcional mas frágil
- **Busca de forma limitada** — full-text search via Supabase textSearch, sem vetores
- **Tem uma camada de "inteligência" prematura** — prompts reutilizáveis, runs, consolidated, que deveriam estar em outra camada
- **Está híbrido** — front-end usa padrão Firestore (`onSnapshot`, `addDoc`), back-end usa Supabase SQL nativo
- **Tem governance mínima** — changelog, decisions, agent, module-doc existem, mas README e owner não
- **Está desalinhado com o próprio posicionamento que definiu** — o module-doc ainda diz "inteligência", o componente ainda tem aba de "inteligência", as funções ainda geram derivados operacionais com LLM

**Nota crítica:** O CID não é um módomo. Ele tem potencial para ser a **base de preparação do ecossistema SagB**. Mas precisa de uma cirurgia clara: cortar o que é inteligência profunda, fortalecer o que é pipeline de preparação, e definir fronteiras duras.

---

## 2. O que Existe de Verdade

### 2.1 Estrutura do Módulo (Front-end)

| Arquivo | Propósito | Estado |
|---------|-----------|--------|
| [`manifest.ts`](Z:/00_sagb/src/modules/cid/manifest.ts) | Registro do módulo no sistema de governança | ✅ Funcional |
| [`routes.tsx`](Z:/00_sagb/src/modules/cid/routes.tsx) | Rota `/cid` | ✅ Funcional |
| [`index.ts`](Z:/00_sagb/src/modules/cid/index.ts) | Barrel export | ✅ Funcional |
| [`module-doc.ts`](Z:/00_sagb/src/modules/cid/module-doc.ts) | Ficha técnica do módulo | ✅ Funcional, mas desatualizada |
| [`pages/CIDPage.tsx`](Z:/00_sagb/src/modules/cid/pages/CIDPage.tsx) | Página que monta o CIDView com runtime context | ✅ Funcional |
| [`pages/index.ts`](Z:/00_sagb/src/modules/cid/pages/index.ts) | Barrel export | ✅ Funcional |
| [`store/runtimeBridge.ts`](Z:/00_sagb/src/modules/cid/store/runtimeBridge.ts) | Bridge de contexto (workspaceId, userProfile) | ✅ Funcional |
| [`store/index.ts`](Z:/00_sagb/src/modules/cid/store/index.ts) | Barrel export | ✅ Funcional |
| **`CIDView.tsx`** (em `Z:/00_sagb/components/`) | Componente monolítico principal (~1056 linhas) | ⚠️ Funcional, mas legado |

### 2.2 Estrutura de Dados (Supabase)

**Migration 1:** [`20260312000101_cid_center.sql`](Z:/00_sagb/supabase/migrations/20260312000101_cid_center.sql)
- 12 tabelas: `cid_assets`, `cid_asset_files`, `cid_batches`, `cid_batch_items`, `cid_processing_jobs`, `cid_chunks`, `cid_outputs`, `cid_tags`, `cid_asset_tags`, `cid_links`, `cid_prompts`, `cid_prompt_runs`
- 5 enums: `cid_material_type`, `cid_desired_action`, `cid_status`, `cid_output_type`
- Bucket `cid-assets` (100MB inicial)
- RLS policies por workspace para todas as tabelas
- Índices abrangentes

**Migration 2:** [`20260314000102_cid_storage_large_files.sql`](Z:/00_sagb/supabase/migrations/20260314000102_cid_storage_large_files.sql)
- Bucket `cid-assets` atualizado para 2GB
- Policies de storage (select, insert, update, delete) vinculadas a workspace_members

**Migration 3:** [`20260323000101_cid_prompts.sql`](Z:/00_sagb/supabase/migrations/20260323000101_cid_prompts.sql)
- Tabelas: `cid_prompts`, `cid_prompt_runs`, `cid_prompt_run_items`
- RLS para `cid_prompt_run_items` via join com runs (já que não tem workspace_id)
- Índices para performance

**Migration 4:** [`20260512000102_taskzei_documents_cid_bridge.sql`](Z:/00_sagb/supabase/migrations/20260512000102_taskzei_documents_cid_bridge.sql)
- Ponte TaskZei → CID: coluna `cid_ref_id` em `taskzei_doc_attachments`
- Indica que o CID já está sendo integrado como storage externo

### 2.3 Funções Serverless (Netlify)

| Função | Arquivo | Propósito |
|--------|---------|-----------|
| **cid-processor** | [`cid-processor.mjs`](Z:/00_sagb/netlify/functions/cid-processor.mjs) (702 linhas) | Pipeline principal de processamento |
| **cid-search** | [`cid-search.mjs`](Z:/00_sagb/netlify/functions/cid-search.mjs) (135 linhas) | Busca full-text em assets, chunks e outputs |
| **cid-apply-prompt-background** | [`cid-apply-prompt-background.mjs`](Z:/00_sagb/netlify/functions/cid-apply-prompt-background.mjs) (227 linhas) | Geração de derivados operacionais (background) |

### 2.4 Serviços Compartilhados

| Serviço | Arquivo | Propósito |
|---------|---------|-----------|
| **storage.ts** | [`Z:/00_sagb/services/storage.ts`](Z:/00_sagb/services/storage.ts) | Upload/download via REST API Supabase (não client lib) |

### 2.5 Governança do Módulo

| Artefato | Existe? | Estado |
|----------|---------|--------|
| [`agent/persona.md`](Z:/00_sagb/src/modules/cid/agent/persona.md) | ✅ | Bem definido |
| [`agent/prompt_ativacao_cline.md`](Z:/00_sagb/src/modules/cid/agent/prompt_ativacao_cline.md) | ✅ | Canônico |
| [`agent/session_log.md`](Z:/00_sagb/src/modules/cid/agent/session_log.md) | ✅ | Vazio (sem registros) |
| [`agent/falas_user.md`](Z:/00_sagb/src/modules/cid/agent/falas_user.md) | ✅ | Vazio (sem registros) |
| [`agent/owner.md`](Z:/00_sagb/src/modules/cid/agent/owner.md) | ❌ | Referenciado no module-doc mas ausente |
| [`changelog.md`](Z:/00_sagb/src/modules/cid/changelog.md) | ✅ | Até v1.0.1 |
| [`decisions.md`](Z:/00_sagb/src/modules/cid/decisions.md) | ✅ | 1 decisão registrada |
| [`README.md`](Z:/00_sagb/src/modules/cid/README.md) | ❌ | Ausente |
| [`docs/`](Z:/00_sagb/src/modules/cid/docs/) | ✅ | Diretório vazio |
| [`plans/`](Z:/00_sagb/src/modules/cid/plans/) | ✅ | Diretório vazio |

### 2.6 Fluxos Reais do Pipeline

**Fluxos identificados no `cid-processor.mjs`:**

1. **`store_only`** — apenas armazena o arquivo, sem processamento adicional
2. **`store_transcribe`** — armazena + transcrição de áudio/vídeo via Gemini
3. **`store_summarize`** — armazena + extração de texto + sumarização
4. **`store_transcribe_summarize`** — armazena + transcrição + sumarização
5. **`store_consolidate`** — armazena + extração + sumarização (consolidado)

**Sub-fluxos de extração de texto:**
- TXT → leitura UTF-8 direta
- PDF → heurística Tj/TJ parser + fallback Gemini + fallback OCR Gemini
- DOCX/DOC → extração Gemini primária + fallback binário UTF-8
- Áudio/Vídeo → transcrição Gemini
- Outros → retorna vazio

**Fluxo de fragmentação:** split por caractere em chunks de 12.000 chars (`splitChunks`)

**Fluxo de busca:** full-text search via Supabase `textSearch` em 3 tabelas (assets, chunks, outputs) + merge + ordenação por data

**Fluxo de derivados (prompts):**
- Single: 1 asset → 1 prompt → 1 resultado
- Consolidated: N assets → merge texto → 1 prompt → 1 resultado
- Batch: modo não implementado (rejeitado com erro)

---

## 3. O que Está Forte

### 3.1 Decisões Corretas

1. **Estrutura de módulo plugável** — `manifest.ts`, `routes.tsx`, barrel exports seguem o padrão do SagB
2. **Module-doc tipado em TS** — a ficha técnica como objeto TypeScript é mais útil que markdown solto
3. **Separação front-end/back-end** — processamento via Netlify Functions evita travar o cliente
4. **Migrations bem estruturadas** — enums, constraints, índices, RLS policies, tudo em SQL versionado
5. **RLS consistente** — todas as tabelas protegidas por workspace_members
6. **Bucket privado** — `cid-assets` não é público, acesso controlado por workspace
7. **Queue guard** — detecção de jobs órfãos/encalhados com retry automático
8. **Timeout e resiliência** — `withTimeout`, `safeUpdate` (não quebra pipeline), retry com max_retries
9. **Versionamento de prompt snapshot** — `prompt_snapshot` + `prompt_snapshot_version` no run
10. **Rastreabilidade financeira** — `estimated_cost_usd`, `tokens_in`, `tokens_out` nos runs
11. **Logging de extração** — metadata com `extractor_used`, `chars_extracted`, `extraction_confidence`
12. **Ponte TaskZei** — já existe integração entre módulos (taskzei_documents_cid_bridge)
13. **RuntimeBridge** — contexto de workspace injetado sem acoplamento direto
14. **3 Netlify Functions separadas** — cada uma com responsabilidade única (processar, buscar, aplicar prompt)
15. **Fluxo de upload em lote** — suporte a batches com items

### 3.2 Fundações Boas para Preservar

- O esquema de banco de dados (12 tabelas) é **bem projetado** e pode ser a base definitiva
- As funções serverless têm **tratamento de erro decente** (failJob, safeUpdate, retry)
- O serviço de storage (`services/storage.ts`) é **limpo e direto**, sem abstração desnecessária
- A estrutura de agent (`persona.md`, `prompt_ativacao_cline.md`) segue o padrão canônico do SagB
- O changelog local do módulo é uma boa prática de governança

---

## 4. O que Está Frágil

### 4.1 Gargalos Técnicos

1. **Componente monolítico CIDView (1056 linhas)** — mistura UI, estado, lógica de negócio, chamadas de API, formatação, e 8 listeners `onSnapshot` simultâneos em um único arquivo
2. **8 listeners Firestore em tempo real** — `onSnapshot` em `cid_assets`, `cid_asset_files`, `cid_processing_jobs`, `cid_chunks`, `cid_outputs`, `cid_tags`, `cid_prompts`, `cid_prompt_runs` **ao mesmo tempo**. Isso é pesado e pode causar problemas de performance
3. **Bucket `cid-assets` com 2GB** — parece o limite, mas o `cid-processor.mjs` tem constante `MAX_FILE_SIZE_BYTES = 100MB`. O front-end também verifica `CID_STORAGE_LIMIT_BYTES = 2147483648` (2GB). Inconsistência de limites
4. **Extrair texto de PDF via heurística Tj/TJ é frágil** — funciona apenas para PDFs com texto simples, não para PDFs escaneados ou complexos. O fallback Gemini funciona mas adiciona latência e custo
5. **DOCX sem parser real** — usa Gemini como extrator primário, sem `mammoth.js` ou `docx` library. Fallback binário UTF-8 com confidence 0.22 é praticamente inútil
6. **Fragmentação ingênua** — split por caractere fixo de 12K, sem consciência de boundaries semânticas (parágrafos, frases, tópicos)
7. **Debounce de busca no front-end** — 500ms + chamada Netlify Function para cada digitação. Sem cache local, sem paginação real (limite 100 resultados)
8. **`sliceUtf16Safe` está incompleto** — o código no processor tem comentário "// ... (implementação completa seria necessária aqui)" mas usa `value.slice(start, end)` que não é UTF-16 safe

### 4.2 Riscos

1. **Firestore vs Supabase inconsistência** — O front-end (`CIDView.tsx`) importa de `../services/supabase` e usa `collection(db, ...)`, `addDoc`, `onSnapshot`. O back-end (`cid-processor.mjs`) usa `createClient` do `@supabase/supabase-js`. Isso sugere que:
   - Ou o front-end está usando Supabase via Firestore-compat API (improvável)
   - Ou o front-end está usando Firestore mesmo e o back-end Supabase (grave inconsistência)
   - Ou há uma camada de abstração no `services/supabase.ts` que traduz chamadas
   
   **Isso precisa ser verificado urgentemente. Se for inconsistência real, é o maior risco do módulo.**

2. **Dependência total de Gemini** — transcrição, extração de texto, sumarização, e geração de derivados dependem exclusivamente do Gemini 2.5 Flash. Sem fallback para outro modelo ou método offline
3. **Custo operacional imprevisível** — `cid-apply-prompt-background` já calcula custo estimado, mas não há budget control, alerta de gasto, ou limite por workspace
4. **Background Function pode morrer** — Netlify Background Functions têm timeout de 15 minutos. Para documentos grandes com consolidated mode (200K chars), pode exceder
5. **Sem autenticação nas funções** — as Netlify Functions não validam token JWT. Qualquer um que saiba a URL pode chamar `cid-processor`, `cid-search`, `cid-apply-prompt-background`

### 4.3 Pontos Mal Resolvidos

1. **module-doc referencia `owner.md` que não existe** — linha 28: `'src/modules/cid/agent/owner.md'` — arquivo ausente
2. **module-doc referencia `components/CIDView.tsx`** — linha 25, mas o CIDView está em `Z:\00_sagb\components\CIDView.tsx` (fora do módulo)
3. **docs/ e plans/ diretórios vazios** — estrutura criada mas nunca populada
4. **`agent/session_log.md` e `agent/falas_user.md` vazios** — estrutura de logging do agente nunca usada
5. **Sem testes** — não há indícios de testes unitários, de integração ou e2e para o módulo
6. **Sem README** — módulo sem documentação de entrada para novos desenvolvedores
7. **Changelog parou na v1.0.1** — sem registro de mudanças posteriores (se houveram)

---

## 5. O que Está Fora de Posição

### 5.1 Inteligência Profunda que Deveria Sair do CID

Com o novo posicionamento (CID = preparação documental), os seguintes itens estão **fora de posição** e deveriam migrar para camadas posteriores (NAGI, Radar de Conexões, camada de inteligência):

| Item | Localização | Problema |
|------|-------------|----------|
| **Prompts Reutilizáveis** (`cid_prompts`) | Migration 3 + CIDView + cid-apply-prompt-background | Isso é transformação inteligente, não preparação |
| **Prompt Runs** (`cid_prompt_runs`) | Migration 3 + CIDView | Histórico de execução inteligente |
| **Derivados Operacionais** | UI na library tab: "Gerar Derivado" | Geração de derivados é inteligência, não ingestão |
| **Consolidated Mode** | cid-apply-prompt-background | Merge de múltiplos documentos + LLM é inteligência |
| **Resultados de Prompt na UI** | CIDView (linhas 891-935) | Visualização de runs de prompt no detail do asset |
| **Nome "Centro de Inteligência Documental"** | module-doc | O nome ainda carrega "Inteligência" |
| **Aba "library" com funcionalidade de transformação** | CIDView (linhas 838-1015) | A biblioteca deveria ser só consulta, não transformação |

### 5.2 O que Ainda Está Confuso

1. **O papel do `store_consolidate`** — se o CID não faz inteligência, qual o sentido de consolidar?
2. **A função `cid-search.mjs`** — busca full-text em outputs (resumos, transcrições) é preparação ou inteligência? Buscar em outputs de preparação faz sentido, buscar em "resultados de prompt" (derivados inteligentes) não.
3. **A UI de "Transformação Operacional"** — o modal de prompt (linhas 957-1013) é bonito, bem construído, mas está no lugar errado. Deveria estar em um módulo de inteligência.
4. **O que é um "derivado"** — se extração de texto é derivado de preparação, e resumo é derivado de inteligência, a linha é tênue e precisa ser explicitada.

---

## 6. Papel Ideal do CID daqui para Frente

### 6.1 Definição

> **CID — Centro de Ingestão Documental**  
> Camada de preparação, armazenamento e estruturação de ativos documentais brutos para consumo por camadas superiores do ecossistema SagB.

### 6.2 Fronteiras Claras

| O CID FAZ | O CID NÃO FAZ |
|-----------|---------------|
| Upload e armazenamento seguro | Inteligência profunda |
| Extração de texto bruto | Cruzamento estratégico |
| Transcrição de áudio/vídeo | Radar de Conexões |
| Fragmentação em chunks | RAG (recuperação aumentada) |
| Detecção de tipo e formato | Geração de insights |
| Organização (tags, metadados) | Recomendações |
| Preparação para busca | Decisões autônomas |
| Versionamento de ativos | Agentes autônomos |
| Store now, process later | Análise preditiva |
| Geração de outputs operacionais (texto bruto, transcrição, chunks indexados) | Geração de derivados inteligentes (resumos executivos, classificações, estruturas) |

### 6.3 Cadeia de Valor no SagB

```
[Dados Brutos] → CID (preparação) → [Matéria-Prima Estruturada] → NAGI / Radar / Agentes (inteligência)
```

O CID produz **matéria-prima**: chunks indexados, texto extraído, transcrições, metadados organizados.
Quem consome: NAGI (cruzamento), NICO (contexto), Agentes (RAG), Radar de Conexões (insights).

### 6.4 Princípios Operacionais

1. **Store first** — o arquivo original é sempre preservado antes de qualquer processamento
2. **Process later** — o processamento é assíncrono, desacoplado, em fila
3. **Non-destructive** — nenhuma operação altera ou remove o original
4. **Traceable** — cada output tem metadata de origem (extractor, confidence, data)
5. **Workspace-scoped** — todos os dados são isolados por workspace
6. **Cost-conscious** — operações que geram custo (Gemini) devem ser opt-in e rastreáveis
7. **Pluggable** — o módulo pode ser ativado/desativado sem afetar o núcleo do SagB

---

## 7. Ideias Suas (Cássio)

### 7.1 O que está bom e deve ser preservado

- A **arquitetura de módulo** (manifest, routes, page, store, barrel exports) está correta e deve ser mantida
- O **esquema de banco** (12 tabelas) é bem pensado e robusto — só precisa de ajustes
- As **Netlify Functions** com responsabilidades separadas é o padrão certo
- O **storage service** (`services/storage.ts`) é limpo, direto, sem overengineering
- O **tratamento de erro** no processor (failJob, safeUpdate, retry) é maduro para uma V1
- A **ponte TaskZei** mostra que o CID já está sendo usado como storage externo — isso é um bom sinal de adoção

### 7.2 O que está errado ou torto

1. **CIDView.tsx monolítico** — 1056 linhas com 8 listeners simultâneos. Isso precisa ser fatiado em subcomponentes antes de qualquer evolução
2. **Dependência única de Gemini** — sem fallback para extração de texto local (ex: `pdf.js`, `mammoth`, `tesseract`). Um módulo de preparação não pode depender 100% de uma API externa para sua função principal
3. **A camada de prompts está prematura** — prompts reutilizáveis, runs, consolidated mode são features de inteligência que foram implementadas antes do pipeline básico estar sólido
4. **Inconsistência front-end/back-end** — o front-end usa Firestore API, o back-end usa Supabase SQL nativo. Isso é uma dívida técnica grave que precisa ser investigada e resolvida
5. **Sem testes** — zero evidência de testes. Um módulo base do ecossistema precisa de testes.

### 7.3 O que pode ser simplificado

1. **Remover a camada de prompts** do CID e mover para um módulo de inteligência dedicado (ou NAGI)
2. **Simplificar CIDView** em 3-4 subcomponentes: UploadForm, AssetList, AssetDetail, ProcessingQueue
3. **Reduzir listeners** — em vez de 8 `onSnapshot`, usar dados on-demand com paginação
4. **Eliminar `store_consolidate`** — consolidar não é papel de preparação
5. **Renomear o módulo** de "Centro de Inteligência Documental" para "Centro de Ingestão Documental" ou manter "CID" como sigla apenas

### 7.4 O que pode ser mais robusto

1. **Adicionar extractors locais** — `pdf.js` para PDF, `mammoth` para DOCX, `tesseract.js` para OCR básico
2. **Adicionar fila real** — em vez de depender de jobs no banco, usar Supabase MQ ou fila externa
3. **Adicionar busca vetorial** — `pgvector` para busca semântica nos chunks
4. **Adicionar rate limiting e budget control** — controle de gasto por workspace nas chamadas Gemini
5. **Adicionar autenticação nas Netlify Functions** — validar JWT em cada função
6. **Adicionar webhook de saída** — quando um processamento termina, notificar módulos consumidores

### 7.5 O que pode ser mais vendável

1. **CID como módulo base reutilizável** — se for bem separado, pode ser empacotado e reutilizado em outros projetos (não só SagB)
2. **Pipeline de extração multi-formato** — ser capaz de extrair texto de qualquer formato é um produto por si só
3. **API de busca documental** — a `cid-search` pode evoluir para uma API pública de busca full-text + vetorial
4. **Adapter pattern** — cada tipo de fonte (upload, email, webhook, API) vira um adapter, tornando o CID extensível

### 7.6 Contrato Oficial do CID (Proposta de Boundaries)

```typescript
interface CIDContract {
  // INPUT: O que o CID aceita
  ingest: {
    formats: ['pdf', 'docx', 'txt', 'audio', 'video', 'image', 'csv', 'json', 'xml', 'md'],
    sources: ['upload', 'api', 'webhook', 'email', 'integration'],
    maxSizeBytes: 2 * 1024 * 1024 * 1024 // 2GB
  },
  
  // OUTPUT: O que o CID produz
  outputs: {
    extractedText: { confidence: number, chars: number, extractor: string },
    transcription: { language: string, duration: number },
    chunks: Array<{ index: number, text: string, charRange: [number, number] }>,
    metadata: { originalName: string, mimeType: string, size: number, checksum?: string }
  },
  
  // BOUNDARIES: O que o CID NÃO faz
  notResponsibleFor: [
    'semantic analysis',
    'cross-referencing',
    'insight generation',
    'decision making',
    'agent context assembly',
    'strategic recommendations'
  ],
  
  // EVENTS: Notificações que o CID emite
  events: {
    assetCreated: { assetId, workspaceId },
    assetProcessed: { assetId, status, outputs },
    assetFailed: { assetId, error }
  }
}
```

### 7.7 O que eu faria diferente se estivesse redesenhando hoje

1. **Separaria radicalmente preparação de inteligência** — duas pipelines distintas, dois módulos, duas equipes
2. **Usaria fila dedicada** (Supabase MQ ou Redis) — não jobs no banco com polling de status
3. **Faria extractors modulares** — cada formato com seu próprio módulo, testável isoladamente
4. **Adicionaria busca vetorial desde o início** — `pgvector` + embedding generation
5. **Faria o CIDView componentizado** — no máximo 200 linhas por componente
6. **Adicionaria testes de integração** — especialmente para o pipeline de extração (mockando Gemini)
7. **Definiria o contrato de output primeiro** — antes de implementar qualquer funcionalidade

---

## 8. Plano Mestre Mega Estruturado

### 8.1 Visão Geral

**Objetivo:** Transformar o CID de um módulo híbrido (preparação + inteligência prematura) em uma **camada de preparação documental madura, robusta e modular**, que sirva como base do ecossistema SagB.

**Resultado Esperado:** Um pipeline de ingestão que qualquer módulo do SagB pode usar para transformar matéria-prima bruta em ativos processáveis, sem dependência de inteligência profunda.

---

### 8.2 Princípios do Módulo (Refinados)

1. **Store first, process later** — o original é soberano
2. **Non-destructive** — nada altera o arquivo original
3. **Traceable** — cada operação deixa metadata
4. **Pluggable** — pode ser ativado/desativado sem quebrar o sistema
5. **Cost-aware** — operações pagas são opt-in e rastreáveis
6. **Testable** — cada extractor é testável isoladamente
7. **Event-driven** — o CID emite eventos que outros módulos consomem
8. **Workspace-isolated** — dados nunca vazam entre workspaces

---

### 8.3 Fronteiras Definitivas

```
┌──────────────────────────────────────────────────────────────┐
│                        CID                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐ │
│  │ Ingestão │→ │ Extração │→ │ Chunking │→ │ Indexação     │ │
│  │ Upload   │  │ TXT/PDF  │  │ 12K char │  │ Full-text     │ │
│  │ API      │  │ DOCX     │  │ boundaries│ │ Vetorial (v2) │ │
│  │ Webhook  │  │ Áudio    │  │          │  │               │ │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘ │
│                                                               │
│  Outputs: texto bruto, transcrição, chunks, metadados         │
│  Events: asset.created, asset.processed, asset.failed         │
└──────────────────────────┬────────────────────────────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │  Camadas de Inteligência  │
              │  (NAGI, Radar, Agentes)   │
              └──────────────────────────┘
```

---

### 8.4 MEGA-ETAPA 01: Cirurgia de Fronteiras e Limpeza

**Objetivo:** Cortar o que não pertence ao CID, corrigir inconsistências, documentar.

| # | Tarefa | Descrição | Dependência | Risco |
|---|--------|-----------|-------------|-------|
| 1.1 | **Remover camada de prompts do CID** | Mover `cid_prompts`, `cid_prompt_runs`, `cid_prompt_run_items` para módulo de inteligência (ou descontinuar) | Decisão do Rodrigues | Médio — dados existentes precisam de migração |
| 1.2 | **Remover UI de "Transformação Operacional"** | Eliminar modal de prompts, checkbox de seleção, runs display do CIDView | 1.1 | Baixo |
| 1.3 | **Remover função `cid-apply-prompt-background`** | Descontinuar ou mover para módulo de inteligência | 1.1 | Médio |
| 1.4 | **Remover `store_consolidate`** | Eliminar ação de consolidar do schema e do processor | 1.1 | Baixo |
| 1.5 | **Criar `owner.md`** | Definir responsável técnico do módulo | Nenhuma | Baixo |
| 1.6 | **Criar `README.md`** | Documentar propósito, arquitetura, como contribuir | 1.5 | Baixo |
| 1.7 | **Corrigir `module-doc.ts`** | Atualizar nome, propósito, estruturas, remover referências a inteligência | 1.1-1.4 | Baixo |
| 1.8 | **Investigar inconsistência Firestore/Supabase** | Verificar `services/supabase.ts` e confirmar se há inconsistência real | Nenhuma | **Alto** |
| 1.9 | **Limpar `docs/` e `plans/`** | Adicionar documentos iniciais nos diretórios vazios | 1.6 | Baixo |

**Critério de conclusão:** O módulo CID não tem mais referências a prompts, runs, inteligência ou derivados. A UI mostra apenas upload, library (consulta) e fila de processamento.

---

### 8.5 MEGA-ETAPA 02: Refatoração do Front-end

**Objetivo:** Transformar o CIDView monolítico em uma arquitetura de componentes.

| # | Tarefa | Descrição | Dependência | Risco |
|---|--------|-----------|-------------|-------|
| 2.1 | **Mover CIDView para dentro do módulo** | Criar `src/modules/cid/components/` e mover/refatorar | 1.8 | Médio |
| 2.2 | **Criar `UploadForm` componente** | Extrair formulário de upload (linhas 714-835) | 2.1 | Baixo |
| 2.3 | **Criar `AssetList` componente** | Extrair lista de ativos na library tab (linhas 853-876) | 2.1 | Baixo |
| 2.4 | **Criar `AssetDetail` componente** | Extrair detalhe do ativo com outputs (linhas 880-953) | 2.1 | Baixo |
| 2.5 | **Criar `ProcessingQueue` componente** | Extrair tabela de fila de processamento (linhas 1018-1048) | 2.1 | Baixo |
| 2.6 | **Criar `SearchBar` componente** | Extrair busca full-text (linhas 260-303) | 2.1 | Baixo |
| 2.7 | **Reduzir listeners onSnapshot** | Substituir 8 listeners simultâneos por dados on-demand com paginação | 2.1 | **Alto** — impacto na UX |
| 2.8 | **Adicionar estados de loading/erro/vazio** | Garantir que cada subcomponente trata estados de UI completos | 2.2-2.6 | Baixo |
| 2.9 | **Adicionar testes de componentes** | Testes unitários para cada subcomponente | 2.2-2.8 | Médio |

**Critério de conclusão:** `CIDView.tsx` não existe mais. O módulo tem componentes separados, cada um com sua responsabilidade, testados e com tratamento de estados.

---

### 8.6 MEGA-ETAPA 03: Pipeline de Extração Robusto

**Objetivo:** Tornar a extração de texto multi-formato resiliente, com fallbacks locais e métricas de qualidade.

| # | Tarefa | Descrição | Dependência | Risco |
|---|--------|-----------|-------------|-------|
| 3.1 | **Adicionar `pdf.js` como extrator primário** | Extração de PDF local via `pdfjs-dist` antes do fallback Gemini | 1.8 | Médio — tamanho da lib |
| 3.2 | **Adicionar `mammoth` para DOCX** | Extração de DOCX local, sem depender de Gemini | 1.8 | Baixo |
| 3.3 | **Adicionar fallback Gemini como camada final** | Gemini vira fallback para PDF escaneado/DOCX complexo, não primário | 3.1, 3.2 | Médio |
| 3.4 | **Melhorar fragmentação semântica** | Chunks respeitam boundaries de parágrafo/frase, não split fixo de 12K | 3.1-3.3 | Médio |
| 3.5 | **Adicionar detecção de idioma** | Usar `franc` ou similar para detectar idioma do texto extraído | 3.1-3.3 | Baixo |
| 3.6 | **Adicionar checksum dos arquivos** | Calcular SHA256 no upload para detectar duplicatas | Nenhuma | Baixo |
| 3.7 | **Testes de integração para extractors** | Pipeline de testes que mocka arquivos de cada formato e verifica extração | 3.1-3.3 | **Alto** — essencial |
| 3.8 | **Métrica de qualidade de extração** | Refinar `extraction_confidence` com heurísticas reais | 3.1-3.3 | Médio |

**Critério de conclusão:** PDF, DOCX, TXT, áudio e vídeo são extraídos localmente. Gemini é fallback para casos complexos. Cada extração tem metadata de qualidade.

---

### 8.7 MEGA-ETAPA 04: Infraestrutura e Integração

**Objetivo:** Tornar o CID um módulo de infraestrutura confiável para o ecossistema.

| # | Tarefa | Descrição | Dependência | Risco |
|---|--------|-----------|-------------|-------|
| 4.1 | **Adicionar autenticação JWT nas Netlify Functions** | Validar token de acesso em `cid-processor`, `cid-search`, `cid-apply-prompt-background` | 1.8 | **Alto** — breaking change |
| 4.2 | **Adicionar Supabase MQ para fila de jobs** | Substituir polling de jobs por fila real com notificação | 2.7 | **Alto** — mudança arquitetural |
| 4.3 | **Adicionar webhook de saída** | Notificar módulos consumidores quando asset é processado | 4.2 | Médio |
| 4.4 | **Adicionar `pgvector` para busca semântica** | Gerar embeddings dos chunks, permitir busca por similaridade | 3.4 | Médio |
| 4.5 | **Adicionar cache de busca** | Cache local no front-end para evitar chamadas repetidas ao search | 2.7 | Baixo |
| 4.6 | **Rate limiting por workspace** | Limitar chamadas Gemini por workspace para controle de custo | 3.1-3.3 | Médio |
| 4.7 | **Budget control e alertas** | Notificar quando workspace atinge X% do budget mensal | 4.6 | Médio |
| 4.8 | **Adapter pattern para fontes** | Upload, API, webhook, email, integração — cada fonte como adapter | 2.1 | Médio |

**Critério de conclusão:** O CID é chamado por outros módulos via API segura. Jobs são processados em fila. Busca é full-text + vetorial. Custos são controlados.

---

### 8.8 MEGA-ETAPA 05: Documentação e Governança

**Objetivo:** Governança de módulo base do ecossistema.

| # | Tarefa | Descrição | Dependência | Risco |
|---|--------|-----------|-------------|-------|
| 5.1 | **README completo** | Propósito, arquitetura, setup, como contribuir, fronteiras | 1.6 | Baixo |
| 5.2 | **DECISIONS atualizado** | Registrar decisões de fronteira (o que ficou, o que saiu) | 1.1-1.4 | Baixo |
| 5.3 | **CHANGELOG atualizado** | Registrar as mudanças das mega-etapas | Todas | Baixo |
| 5.4 | **PLANNED (este documento)** | Este plano mestre como documento de referência | — | Baixo |
| 5.5 | **Agente CID operacional** | Popular `session_log.md` e `falas_user.md` | Nenhuma | Baixo |
| 5.6 | **Definir owner humano** | Nomear responsável técnico no `owner.md` | Decisão do Rodrigues | Baixo |
| 5.7 | **Diagrama de arquitetura** | Documentar fluxo ponta a ponta com diagrama | 2.1, 3.4, 4.4 | Baixo |

---

### 8.9 Ordem Recomendada

```
MEGA-ETAPA 01 (Cirurgia de Fronteiras)
  │
  ├── 1.8 (Investigar inconsistência) ← PRIORIDADE MÁXIMA
  ├── 1.1 a 1.4 (Remover inteligência)
  ├── 1.5 a 1.7 (Documentação básica)
  └── 1.9 (Limpeza)
  │
  ▼
MEGA-ETAPA 02 (Refatoração Front-end)
  │
  ├── 2.1 (Mover CIDView para módulo)
  ├── 2.2 a 2.6 (Subcomponentes)
  ├── 2.7 (Reduzir listeners) ← CRÍTICO
  ├── 2.8 (Estados de UI)
  └── 2.9 (Testes)
  │
  ▼
MEGA-ETAPA 03 (Pipeline Robusto)
  │
  ├── 3.1 a 3.3 (Extractors locais)
  ├── 3.4 (Fragmentação semântica)
  ├── 3.5 (Detecção de idioma)
  └── 3.7 (Testes de integração) ← CRÍTICO
  │
  ▼
MEGA-ETAPA 04 (Infraestrutura)
  │
  ├── 4.1 (Autenticação JWT)
  ├── 4.2 (Fila real)
  ├── 4.4 (Busca vetorial)
  └── 4.6-4.7 (Controle de custo)
  │
  ▼
MEGA-ETAPA 05 (Governança)
  │
  ├── 5.1 a 5.7 (Documentação)
  └── 5.6 (Owner definido)
```

---

### 8.10 Dependências entre MEGA-ETAPAS

| Etapa | Depende de | É dependência para |
|-------|------------|-------------------|
| 01 | Decisão do Rodrigues (o que cortar) | 02, 03, 04, 05 |
| 02 | 01 | 03, 04 |
| 03 | 01, 02 | 04 |
| 04 | 01, 02, 03 | 05 |
| 05 | Todas | — |

### 8.11 Riscos do Plano

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Inconsistência Firestore/Supabase ser grave | **Catastrófico** | Média | Investigar antes de qualquer outra ação (1.8) |
| Remover camada de prompts quebrar módulos consumidores | Alto | Média | Mapear dependências antes de remover |
| Mudar de 8 listeners para on-demand causar regressão de UX | Médio | Alta | Implementar gradualmente, com fallback |
| Adicionar extractors locais aumentar tamanho do bundle | Médio | Alta | Usar lazy loading, webpack chunks |
| Adicionar autenticação JWT quebrar clientes existentes | Alto | Média | Versão com suporte a token opcional primeiro |
| Implementar fila real (Supabase MQ) ser complexo demais | Alto | Média | Começar com versão simplificada, evoluir |

### 8.12 Critérios de Maturidade

| Nível | Critério |
|-------|----------|
| **Funcional** (atual) | Upload, extração, busca funcionam. Componente monolítico. Sem testes |
| **Estruturado** (pós ET01) | Fronteiras claras. Sem inteligência no módulo. Subcomponentes separados |
| **Robusto** (pós ET02-03) | Extractores locais. Testes de integração. Fragmentação semântica. Estados de UI |
| **Confiável** (pós ET04) | Autenticação. Fila real. Busca vetorial. Controle de custo. Eventos |
| **Base do Ecossistema** (pós ET05) | Documentação completa. Owner definido. Adapters. API estável |

---

## 9. Perguntas que Ainda Precisam ser Respondidas

### 9.1 Para o Rodrigues (decisões estratégicas)

1. **O owner do CID será definido agora ou podemos seguir com "A DEFINIR"?** — Isso impacta a prioridade de 1.5/5.6
2. **O que fazer com os prompts existentes?** — Mover para NAGI? Descontinuar? Manter como legado?
3. **O que fazer com o nome "Centro de Inteligência Documental"?** — Manter CID como sigla apenas e mudar significado para "Centro de Ingestão Documental"? Ou "Centro de Preparação Documental"?
4. **Qual o budget mensal aceitável para chamadas Gemini no CID?** — Impacta 4.6/4.7
5. **O CID deve ser módulo base reutilizável (open source) ou interno ao SagB?** — Impacta a estratégia de vendabilidade (7.5)

### 9.2 Para validação técnica

6. **O `services/supabase.ts` realmente traduz chamadas Firestore para Supabase, ou o front-end está falando com Firestore e o back-end com Supabase em bancos diferentes?** — **Urgente: isso precisa ser verificado antes de qualquer mudança.**
7. **Qual o volume real de assets no banco?** — Quantos registros em `cid_assets`, `cid_chunks`, `cid_outputs`? Isso impacta a estratégia de listeners vs paginação.
8. **Existem integrações além da TaskZei que consomem dados do CID?** — Preciso saber quem mais depende do CID para planejar a remoção de funcionalidades.
9. **O bucket `cid-assets` está populado?** — Quantos arquivos, qual tamanho total?

### 9.3 Para validação humana

10. **UX atual é suficiente ou precisa de redesign?** — A UI do CIDView é funcional mas o contraste e legibilidade poderiam ser melhores. Vale a pena investir em Alice UI Standard?
11. **Quem são os usuários reais do CID hoje?** — Usuários reais usando? Apenas testes? Isso dita o ritmo das mudanças.

---

## 10. Reflexão Crítica Final

### 10.1 Riscos Reais

1. **O maior risco é a inconsistência Firestore/Supabase.** Se o front-end escreve em Firestore e o back-end lê de Supabase, os dados estão em bancos diferentes. Isso explica jobs que nunca processam, assets que somem, outputs que não aparecem. **Isso precisa ser a primeira coisa a investigar.**

2. **O segundo maior risco é remover a camada de prompts e quebrar algo.** A UI de prompts (linhas 956-1013 no CIDView) é bem integrada. Remover sem mapear dependências pode causar regressão.

3. **O terceiro risco é que o CID tem mais linhas de "inteligência prematura" do que de pipeline básico.** As tabelas de prompts (3 tabelas + funções) são complexas e bem feitas, mas estão no módulo errado. Desfazer isso custa caro.

### 10.2 Limitações

1. **Netlify Functions não são o ambiente ideal para processamento pesado** — timeout de 10s (síncrono) / 15min (background), limite de memória, sem GPU. Para extração de PDFs grandes ou processamento de vídeos, isso vai ser um gargalo.
2. **Gemini 2.5 Flash é rápido mas caro** — cada chamada custa dinheiro real. Um módulo de preparação que depende de API paga para sua função principal não escala sem controle de custo.
3. **A fragmentação por split fixo de 12K chars é ingênua** — chunks sem contexto semântico são ruins para busca e para RAG.

### 10.3 Pontos Fracos do Plano

1. **O plano é grande (5 mega-etapas, ~30 tarefas)** — risco de nunca ser completo. Talvez seja melhor priorizar as etapas 01 e 02 primeiro e reavaliar.
2. **A etapa 04 (infraestrutura) pode ser overengineering** — se o CID tem poucos usuários hoje, adicionar fila real, busca vetorial e webhooks pode ser cedo demais.
3. **O plano não considera migração de dados** — se decidirmos mover prompts para outro módulo, os dados existentes em `cid_prompt_runs` precisam de migração.

### 10.4 Alternativas

1. **Alternativa conservadora:** Fazer apenas a ET01 (cirurgia de fronteiras) + ET02 (refatoração front-end) e parar. O CID já funciona para o básico.
2. **Alternativa radical:** Reescrever o CID do zero como um serviço separado (microserviço de ingestão), com API REST, fila dedicada, sem dependência do front-end do SagB.
3. **Alternativa híbrida:** Manter o CID como está, mas criar um novo módulo (ex: "NX" — Núcleo de Extração) que herda as funções de preparação, e deixar o CID morrer como legado.

### 10.5 O que eu atacaria primeiro

**Ordem realista de execução (priorizando impacto vs esforço):**

1. **Investigação (1.8)** — Verificar Firestore vs Supabase. Isso é crítico e barato.
2. **Documentação mínima (1.5, 1.6, 1.7)** — README + owner.md + corrigir module-doc. Rápido e deixa o módulo mais profissional.
3. **Subcomponentes (2.2-2.6)** — Fatiar CIDView. Dá para fazer em paralelo com outras tarefas, pois é puramente refatoração.
4. **Remover inteligência (1.1-1.4)** — Só depois de mapear dependências e confirmar que nenhum outro módulo consome.
5. **Extractors locais (3.1-3.3)** — Adicionar pdf.js e mammoth. Reduz custo e melhora resiliência.
6. **Testes (2.9, 3.7)** — Adicionar testes à medida que as refatorações acontecem.
7. **Infraestrutura (4.x)** — Só se houver necessidade real. Pode ficar para V2.

### 10.6 O que deixaria para depois (ou talvez não valha a pena)

1. **Busca vetorial (4.4)** — Isso é legal mas não essencial. Full-text search já cobre 80% dos casos.
2. **Adapter pattern para fontes (4.8)** — Só vale a pena se houver demanda de múltiplas fontes de ingestão.
3. **Rate limiting e budget control (4.6, 4.7)** — Essencial se o CID for usado em produção com muitos workspaces. Se for uso interno apenas, pode esperar.
4. **Webhook de saída (4.3)** — Só necessário quando outros módulos precisarem reagir em tempo real ao processamento.
5. **Fila real com Supabase MQ (4.2)** — O sistema atual de jobs no banco com polling funciona para volume baixo. Substituir por fila real é melhoria, não necessidade.

### 10.7 Reflexão Final

> **O CID é um dos módulos mais importantes do SagB, mas hoje ele sofre de "síndrome de faz-tudo".**
>
> Ele tenta ser pipeline de preparação E motor de inteligência E busca E transformação. O resultado é que ele faz várias coisas razoavelmente bem, mas nenhuma excepcionalmente bem.
>
> A cirurgia de fronteiras (ET01) é a coisa mais importante que pode acontecer com este módulo. Cortar o que não é preparação documental vai:
> - Reduzir complexidade
> - Clarear o propósito
> - Tornar o módulo testável
> - Permitir que a inteligência profunda floresça em módulos especializados
> - Tornar o CID reutilizável como módulo base
>
> **Minha recomendação pessoal:** Faça a ET01 e ET02 primeiro. Não toque em ET03, ET04 ou ET05 até que o módulo esteja limpo, documentado e componentizado. Depois disso, reavalie se vale a pena investir em extractores locais, fila real e busca vetorial — ou se o SagB precisa de outra abordagem para preparação documental.
>
> *Uma base limpa é melhor que uma fundação complexa.*
>
> — Cássio Mendes, 04/06/2026

---

**Fim do Documento**  
[ 📝 Auto-log: OK ]
