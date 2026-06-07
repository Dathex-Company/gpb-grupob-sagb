# DECISIONS — CID

## 2026-04-30 — Módulo alinhado ao padrão canônico de governança

- Pasta `agent` limitada aos arquivos canônicos definidos em `docs/governanca_sagb/padrao_unificado_governanca.md`.

## 2026-06-04 — CID reposicionado como Centro de Ingestão Documental

### Decisão

O CID passa a ser tratado oficialmente como camada de ingestão e preparação documental, não como camada de inteligência profunda.

### Motivo

O módulo estava misturando ingestão, extração, organização, prompts e consolidação. Essa mistura cria fronteiras confusas com Radar de Conexões, NICO, NAGI e futuras camadas estratégicas.

### Implicações

- Prompts, consolidações e leituras estratégicas deixam de ser responsabilidade do CID.
- O CID deve entregar ativos preparados: originais, texto extraído, transcrição, chunks e metadados.
- Dashboards do CID devem mostrar operação, acervo, pipeline e saúde do processamento, não interpretações estratégicas.

## 2026-06-04 — Dashboard geral como primeira tela do CID

### Decisão

Ao abrir o CID pelo SagB, a primeira tela deve ser o dashboard geral do módulo.

### Motivo

O usuário precisa de visão operacional imediata: últimos uploads, últimas transcrições/processamentos, quantidade de arquivos, status, outputs e distribuição do acervo.

## 2026-06-04 — Dashboard local separado do dashboard geral

### Decisão

O sistema de arquivos local deve ter um dashboard próprio para raízes locais autorizadas.

### Motivo

O dashboard geral do CID olha para ativos já registrados no CID. O dashboard local olha para as raízes do disco local antes da importação.

## 2026-06-04 — Remoção definitiva da camada de prompts do CID

### Decisão

Remover do CID a camada de prompts, prompt runs e derivados.

### Motivo

Não há dados a preservar e o objetivo estratégico é consolidar o CID como preparação documental. Prompts e derivados pertencem a camadas posteriores de inteligência.

### Implicações

- `CIDView.tsx` não escuta mais `cid_prompts`, `cid_prompt_runs` ou `cid_prompt_run_items`.
- Tipos `CidPrompt`, `CidPromptRun` e `CidPromptRunItem` foram removidos de `types.ts`.
- Função `cid-apply-prompt-background.mjs` foi removida.
- A UI de detalhe não exibe derivados.
- A seleção de ativos fica preservada apenas como ação operacional futura.

