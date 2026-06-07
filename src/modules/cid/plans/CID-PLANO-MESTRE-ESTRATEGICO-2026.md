# PLANO MESTRE MEGA ESTRUTURADO — CID 2026

**Centro de Inteligência Documental — Camada de Preparação Documental do SagB**

---

## ÍNDICE

1. [Leitura Executiva do CID Hoje](#1-leitura-executiva-do-cid-hoje)
2. [O que Existe de Verdade](#2-o-que-existe-de-verdade)
3. [O que Está Forte](#3-o-que-está-forte)
4. [O que Está Frágil](#4-o-que-está-frágil)
5. [O que Está Fora de Posição](#5-o-que-está-fora-de-posição)
6. [Papel Ideal do CID daqui para Frente](#6-papel-ideal-do-cid-daqui-para-frente)
7. [Ideias e Hipóteses](#7-ideias-e-hipóteses)
8. [Plano Mestre Mega Estruturado](#8-plano-mestre-mega-estruturado)
9. [Perguntas Pendentes](#9-perguntas-pendentes)
10. [Reflexão Crítica Final](#10-reflexão-crítica-final)

---

## 1. LEITURA EXECUTIVA DO CID HOJE

O CID está **funcional, operacional e coerente** com seu posicionamento estratégico revisado de camada de preparação documental. O pipeline de upload → store → process → output está completo e funcionando. A UI tem 3 abas (Upload, Library, Processing) que cobrem o ciclo de vida do ativo documental.

**O que ele entrega hoje (pontos reais):**
- Upload de múltiplos formatos (TXT, PDF, DOCX, DOC, áudio, vídeo, imagens)
- Armazenamento em bucket Supabase com registro em tabelas relacionais
- Processamento assíncrono via Netlify Function (store now, process later)
- Extração de texto de documentos
- Transcrição de áudio/vídeo via Gemini
- Fragmentação em chunks
- Geração de resumos
- Aplicação de prompts reutilizáveis para transformação
- Busca full-text

**O que ele NÃO entrega ainda:**
- Owner definido
- README do módulo (criado nesta rodada)
- OCR dedicado para PDFs escaneados
- Busca semântica vetorial
- Monitoramento administrativo da fila
- Testes automatizados

**Diagnóstico geral:** O CID tem uma estrutura técnica boa, com pipeline funcional e código limpo. As fragilidades estão mais em governança e em gaps de funcionalidades específicas do que em arquitetura.

---

## 2. O QUE EXISTE DE VERDADE

### Código Fonte

| Item | Status | Detalhes |
|------|--------|----------|
| `components/CIDView.tsx` | ✅ Completo | 3 abas, upload, library, processing |
| `services/supabase.ts` (shim) | ✅ Completo | Normalização para todas as tabelas do CID |
| `netlify/functions/cid-processor.mjs` | ✅ Completo | Pipeline de extração, transcrição, fragmentação, resumo |
| `netlify/functions/cid-search.mjs` | ✅ Completo | Busca full-text |
| `netlify/functions/cid-prompt-apply.mjs` | ✅ Completo | Aplicação de prompts |
| `src/modules/cid/module-doc.ts` | ✅ Atualizado | Documentação do módulo |
| `src/modules/cid/README.md` | ✅ Novo | README do módulo |
| `src/modules/cid/agent/owner.md` | ✅ Novo | Owner definido como pendente |
| `src/modules/cid/changelog.md` | ✅ Atualizado | Histórico de mudanças |

### Tabelas no Banco

| Tabela | Status | Campos-chave |
|--------|--------|-------------|
| `cid_assets` | ✅ Ativa | workspace_id, title, material_type, desired_action, status, progress_pct |
| `cid_asset_files` | ✅ Ativa | asset_id, bucket, path, size_bytes, mime_type |
| `cid_processing_jobs` | ✅ Ativa | asset_id, status, progress_pct, retries, error_message |
| `cid_chunks` | ✅ Ativa | asset_id, chunk_index, text_content, status |
| `cid_outputs` | ✅ Ativa | asset_id, output_type, content_text, language |
| `cid_tags` | ✅ Ativa | workspace_id, name |
| `cid_links` | ✅ Ativa | asset_id, link_type, linked_id |
| `cid_prompts` | ✅ Ativa | workspace_id, title, system_prompt, is_active |
| `cid_prompt_runs` | ✅ Ativa | prompt_id, execution_scope, status, result_text |
| `cid_prompt_run_items` | ✅ Ativa | run_id, asset_id, status, result_text |
| `cid_batches` | ✅ Ativa | workspace_id, status, total_items |
| `cid_batch_items` | ✅ Ativa | batch_id, asset_id, status |

### Fluxos

| Fluxo | Status | Observação |
|-------|--------|------------|
| Store Only | ✅ Funciona | Mark as completed sem processamento |
| TXT → Extração | ✅ Funciona | Leitura direta do texto |
| PDF → Extração | ✅ Funciona | Heurística para extrair texto de PDF |
| DOCX → Extração | ✅ Funciona | Leitura via xml2js |
| DOC → Extração | ✅ Funciona | Leitura via antiword/docx2txt |
| Áudio → Transcrição | ✅ Funciona | Via Gemini API (chave necessária) |
| Vídeo → Transcrição | ✅ Funciona | Via Gemini API (chave necessária) |
| Resumo | ✅ Funciona | Via Gemini API (chave necessária) |
| Derivado Single | ✅ Funciona | Prompt único sobre 1 asset |
| Derivado Consolidado | ✅ Funciona | Prompt sobre múltiplos assets |
| Derivado Batch | ❌ Não implementado | Placeholder na UI |
| Busca Full-text | ✅ Funciona | Via cid-search.mjs |

---

## 3. O QUE ESTÁ FORTE

### Arquitetura

1. **Store now, process later** — Decisão correta. O upload é imediato e o processamento é assíncrono. Isso desacopla a experiência do usuário da latência do processamento.

2. **Firestore shim com normalização** — O `services/supabase.ts` tem normalização completa para todas as tabelas do CID (incluindo as de prompts, agora). Isso permite usar APIs Firestore-like (`collection`, `doc`, `addDoc`, `updateDoc`, `onSnapshot`) sobre o Supabase.

3. **Pipeline em Netlify Function** — Bom uso de serverless. A função faz download do arquivo, extrai texto, fragmenta e resume em uma única execução.

4. **Queue guard automático** — O processor tem lógica para detectar jobs órfãos (presos em `processing` por muito tempo) e re-enfileirá-los automaticamente.

5. **Separação de responsabilidades** — Upload (front-end) ≠ Processamento (back-end). O front-end não precisa saber como o texto é extraído.

6. **Normalização de tabelas de prompts** — Adicionada nesta rodada, garante que `cid_prompts`, `cid_prompt_runs` e `cid_prompt_run_items` funcionem corretamente com o shim.

### UI

7. **3 abas bem separadas** — Upload, Library, Processing. A navegação é clara e o usuário entende onde está.

8. **Feedback em tempo real** — `onSnapshot` (Firestore) + polling de jobs ativos. O usuário vê o progresso sem precisar recarregar.

9. **Estado de vazio** — Adicionado nesta rodada para Library e Processing.

10. **Contraste melhorado** — Labels em `text-gray-700` (antes `text-gray-500`), bordas em `border-gray-200` (antes `border-gray-100`), inputs com `bg-white` e foco visível.

### Dados

11. **Esquema de tabelas bem definido** — `cid_assets`, `cid_asset_files`, `cid_processing_jobs`, `cid_chunks`, `cid_outputs` cobrem o ciclo de vida completo.

12. **Metadados ricos** — `payload` (JSONB) permite armazenar metadados extras sem alterar schema.

13. **Tags e links** — `cid_tags` e `cid_links` permitem categorização e relacionamento entre ativos.

---

## 4. O QUE ESTÁ FRÁGIL

### Crítico (impede uso real)

1. **`GEMINI_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` são placeholders no `.env.local`** — O processor (cid-processor.mjs) depende dessas chaves para extrair texto, transcrever e resumir. Sem elas, o processor falha silenciosamente porque o fetch no front-end não é awaitado — o upload parece funcionar, mas o processamento não acontece.

2. **`fetch` do processor não era awaitado (CORRIGIDO nesta rodada)** — Antes, o `initiateCidProcessing` chamava `fetch(...)` sem `await` e sem verificar `response.ok`. Agora é awaitado e a resposta é verificada. Se o Netlify dev server não estiver rodando, o erro é logado mas não quebra o fluxo — o asset fica em `queued` e o queue guard pode recuperar depois.

### Médio (impacta experiência)

3. **Busca semântica vetorial não existe** — A busca atual é full-text apenas. Não há busca por similaridade semântica.

4. **PDF escaneado sem OCR** — A extração usa heurística (busca por `Tj` no PDF). PDFs escaneados (imagem) não são processados.

5. **Limite de 30MB no processamento** — Netlify Function tem limite de payload/invocação. Arquivos maiores que 30MB falham no download dentro da função.

6. **Sem monitoramento administrativo** — Não há dashboard para ver jobs travados, taxas de erro, tempo médio de processamento.

7. **Sem testes automatizados** — Nem unitários, nem de integração.

### Leve (cosmético/governança)

8. **Owner não definido** — O módulo não tem dono formal. `owner.md` criado nesta rodada mas aguardando confirmação.

9. **`state.ts` existe mas vazio** — O módulo CID declara `state.ts` mas não usa. As stores são gerenciadas via hooks no CIDView.

10. **Alguns labels de UI em português parcial** — Mistura de português e inglês nos labels (ex: "Assets" vs "Ativos"). Corrigido parcialmente nesta rodada.

---

## 5. O QUE ESTÁ FORA DE POSIÇÃO

### Conteúdo que deveria estar em outro lugar

1. **Inteligência de fluxo** — O CIDView tem lógica de `promptRunItems` que filtra `selectedAssetRuns`. Essa lógica é de visualização e faz sentido aqui, mas a execução de prompts (`cid-prompt-apply.mjs`) deveria ser um serviço separado (já é, como Netlify Function).

2. **`cid-links` como entidade separada** — Links entre assets poderiam ser um campo JSONB em `cid_assets` (`links: { linkedId, linkType }[]`) em vez de tabela separada. Mas a tabela separada é mais flexível para consultas.

### O que NÃO está fora de posição (reforço)

3. **Prompts e derivados** — `cid_prompts`, `cid_prompt_runs`, `cid_prompt_run_items` estão corretamente no CID. Eles são transformações operacionais, não inteligência profunda.

4. **Busca full-text** — A busca via `cid-search.mjs` está correta no CID, pois busca sobre o conteúdo preparado. Busca semântica vetorial seria uma camada acima.

---

## 6. PAPEL IDEAL DO CID DAQUI PARA FRENTE

### Definição Clara

O CID é a **camada zero** do ecossistema SagB para dados não-estruturados.

```
Documentos → CID → Dados Estruturados → Camadas Superiores
                                            ├── Radar de Conexões
                                            ├── NICO
                                            ├── NAGI
                                            └── Agentes
```

### Responsabilidades

1. **Ingerir** — Receber qualquer tipo de documento
2. **Armazenar** — Guardar com segurança e metadados
3. **Extrair** — Obter texto de qualquer formato
4. **Fragmentar** — Dividir em chunks gerenciáveis
5. **Transformar** — Aplicar prompts para gerar derivados
6. **Indexar** — Disponibilizar para busca
7. **Servir** — Fornecer dados prontos para as camadas superiores

### Não Responsabilidades

1. ❌ Análise estratégica
2. ❌ Decisões de negócio
3. ❌ Cruzamento de informações entre fontes
4. ❌ Geração de insights
5. ❌ RAG (recuperação para agentes)

---

## 7. IDEIAS E HIPÓTESES

### Melhorias de Curto Prazo

1. **Modo offline/local** — Permitir store_only sem depender de Netlify Function. O upload e armazenamento já funcionam sem o processor. A UI já deixa claro quando o processamento é opcional.

2. **Download de outputs** — Botão para baixar o texto extraído, transcrição ou resumo como arquivo `.txt`.

3. **Preview de PDF inline** — Já existe lógica de `INLINE_PREVIEW_MAX_BYTES` para imagens/PDFs. Poderia ser expandido.

4. **Upload via drag & drop** — Melhoraria significativamente a UX.

### Melhorias de Médio Prazo

5. **OCR para PDFs escaneados** — Usar Tesseract.js (client-side) ou Gemini Vision (server-side) para extrair texto de PDFs-imagem.

6. **Processamento assíncrono com fila** — Em vez de Netlify Function síncrona, usar Supabase MQ ou类似 para enfileirar jobs e processar em background.

7. **Compactação de chunks grandes** — Para chunks > 200k chars, comprimir ou truncar antes de armazenar.

8. **Tags inteligentes** — Sugerir tags automaticamente baseado no conteúdo extraído.

### Simplificações

9. **Unificar `cid_asset_files` e `cid_assets`** — Os metadados do arquivo poderiam ser um campo JSONB em `cid_assets`. Mas a separação é válida para assets com múltiplos arquivos.

10. **Remover `cid_batches` se não usado** — Batch items parecem não ter sido implementados no front-end. Seriam remanescentes de um plano anterior.

### Oportunidades

11. **CID como módulo base reutilizável** — O CID poderia ser empacotado como um pacote npm (`@sagb/cid`) para outros projetos do ecossistema usarem.

12. **Webhook de conclusão** — Quando um asset termina o processamento, disparar webhook para outros módulos (ex: notificar NICO que há novo material).

13. **Integração com Vault** — Assets processados poderiam ser promovidos a itens no Vault automaticamente.

### Hipóteses a Validar

14. **O Netlify Function é suficiente?** — Para uso moderado (dezenas de documentos/dia), sim. Para centenas, precisaria de fila + worker dedicado.

15. **O Gemini é a melhor opção para transcrição?** — Whisper local (`local_whisper`) já está configurado como provider alternativo. Validar qualidade vs custo.

16. **O CID deve ter API própria?** — Hoje o front-end acessa direto o Supabase (via shim). Uma API formal daria mais controle e auditabilidade.

---

## 8. PLANO MESTRE MEGA ESTRUTURADO

### MEGA-ETAPA 01: Fundação e Governança (Agora — Junho/2026)

**Objetivo:** Estabilizar o que existe, definir dono, documentar e garantir que o pipeline básico funciona.

| # | Ação | Prioridade | Dependência | Risco |
|---|------|-----------|-------------|-------|
| 1.1 | ✅ Definir owner do módulo (@Rodrigues) | 🔴 Alta | Decisão humana | Baixo |
| 1.2 | ✅ Criar README do módulo | 🔴 Alta | Nenhuma | Baixo |
| 1.3 | ✅ Atualizar module-doc com posicionamento | 🔴 Alta | Nenhuma | Baixo |
| 1.4 | ✅ Adicionar normalização de prompts no shim | 🔴 Alta | Nenhuma | Baixo |
| 1.5 | ✅ Melhorar contraste/legibilidade da UI | 🔴 Alta | Nenhuma | Baixo |
| 1.6 | ✅ Tratar fetch do processor (await + response check) | 🔴 Alta | Nenhuma | Baixo |
| 1.7 | 🔄 Configurar chaves de API reais (GEMINI_API_KEY, SERVICE_ROLE_KEY) | 🔴 Alta | Acesso às chaves | Médio |
| 1.8 | 🔄 Validar upload TXT/PDF/DOCX de ponta a ponta | 🔴 Alta | Chaves configuradas | Médio |

**Critério de sucesso:** Um documento TXT é enviado, processado e o texto extraído aparece na Library em menos de 2 minutos.

---

### MEGA-ETAPA 02: Pipeline Robusto (Julho/2026)

**Objetivo:** Tornar o pipeline resiliente, testado e preparado para produção real.

| # | Ação | Prioridade | Dependência | Risco |
|---|------|-----------|-------------|-------|
| 2.1 | Adicionar OCR para PDFs escaneados (Tesseract.js ou Gemini Vision) | 🟡 Média | 1.7 | Médio |
| 2.2 | Implementar fila de processamento assíncrona (Supabase MQ ou Bull) | 🟡 Média | 1.7 | Alto |
| 2.3 | Adicionar testes de integração do pipeline | 🟡 Média | Nenhuma | Baixo |
| 2.4 | Limitar chunks a 200k chars com truncamento seguro | 🟡 Média | Nenhuma | Baixo |
| 2.5 | Adicionar monitoramento de jobs (dashboard de fila) | 🟡 Média | Nenhuma | Médio |
| 2.6 | Tratar arquivos >30MB com processamento em partes | 🟡 Média | 2.2 | Alto |
| 2.7 | Adicionar rate limiting no processor (evitar abuso) | 🟢 Baixa | Nenhum | Baixo |

**Critério de sucesso:** Pipeline processa 50 documentos de diferentes formatos sem falha em sequência.

---

### MEGA-ETAPA 03: Inteligência Operacional (Agosto/2026)

**Objetivo:** Adicionar funcionalidades que aumentam o valor do CID sem desviar do papel de preparação.

| # | Ação | Prioridade | Dependência | Risco |
|---|------|-----------|-------------|-------|
| 3.1 | Adicionar busca semântica vetorial (embeddings + pgvector) | 🟡 Média | 2.2 | Alto |
| 3.2 | Sugestão automática de tags baseada em conteúdo | 🟢 Baixa | 3.1 | Médio |
| 3.3 | Download de outputs (txt, json) | 🟢 Baixa | Nenhuma | Baixo |
| 3.4 | Webhook de conclusão para outros módulos | 🟢 Baixa | 2.2 | Médio |
| 3.5 | Upload drag & drop | 🟢 Baixa | Nenhuma | Baixo |
| 3.6 | Preview inline de PDF e imagens | 🟢 Baixa | Nenhuma | Baixo |
| 3.7 | Batch API funcional (1 saída por asset, não apenas consolidado) | 🟢 Baixa | 2.2 | Médio |

**Critério de sucesso:** Um usuário consegue pesquisar "contrato de prestação de serviços" e encontrar documentos relevantes mesmo sem a palavra exata.

---

### MEGA-ETAPA 04: Maturidade e Ecossistema (Setembro/2026+)

**Objetivo:** Transformar o CID em um módulo maduro, confiável e integrado ao ecossistema SagB.

| # | Ação | Prioridade | Dependência | Risco |
|---|------|-----------|-------------|-------|
| 4.1 | API formal do CID (endpoints REST) | 🟢 Baixa | 3.4 | Médio |
| 4.2 | CID como pacote npm reutilizável (@sagb/cid) | 🟢 Baixa | 4.1 | Médio |
| 4.3 | Integração com Vault (promoção de assets) | 🟢 Baixa | 3.4 | Médio |
| 4.4 | Dashboard de métricas do CID (volume, taxa de erro, tempo médio) | 🟢 Baixa | 2.5 | Baixo |
| 4.5 | Testes de carga e performance | 🟢 Baixa | 2.3 | Baixo |
| 4.6 | Documentação de integração para outros módulos | 🟢 Baixa | 4.1 | Baixo |
| 4.7 | Estratégia de backup e retenção dos assets | 🟢 Baixa | Nenhuma | Baixo |

**Critério de sucesso:** O CID é referido como "camada zero" na documentação do SagB e é usado por pelo menos 3 outros módulos.

---

### Mapa de Dependências

```
1.1 (Owner)
  └── 1.7 (Chaves API)
       ├── 1.8 (Validação E2E)
       ├── 2.1 (OCR)
       │    └── 3.1 (Busca semântica)
       └── 2.2 (Fila assíncrona)
            ├── 2.6 (Arquivos grandes)
            ├── 3.4 (Webhook)
            │    ├── 4.1 (API formal)
            │    │    └── 4.2 (Pacote npm)
            │    └── 4.3 (Integração Vault)
            └── 3.7 (Batch)
```

---

## 9. PERGUNTAS PENDENTES

### Para @Rodrigues

1. **Quem é o owner do CID?** — O `owner.md` aponta para @Rodrigues como candidato. Confirmar ou redirecionar.
2. **O CID deve ter API própria?** — Hoje o front-end acessa Supabase diretamente. Uma API formal seria mais segura e auditável, mas adiciona complexidade.
3. **Qual o SLA esperado para processamento?** — Store only é instantâneo. Extração+transcrição pode levar minutos. Qual o aceitável?
4. **O CID deve integrar com NICO/NAGI nesta fase?** — Ou apenas preparar os dados e deixar a integração para depois?

### Para @Equipe Técnica

5. **Temos budget para Gemini API?** — A transcrição e resumo dependem de API key com créditos. Quanto podemos gastar por mês?
6. **Temos Tesseract.js ou outra solução de OCR?** — Para PDFs escaneados, precisamos de OCR. Tesseract.js roda no browser, mas é lento. Gemini Vision é pago.
7. **Devemos usar Whisper local para transcrição?** — Já configurado como `VITE_TRANSCRIBE_PROVIDER=local_whisper`. Validar qualidade.

### Decisões Arquiteturais

8. **Fila síncrona (Netlify Function) vs assíncrona (MQ)?** — Para uso atual, Netlify Function é suficiente. Para escala, precisamos de fila.
9. **pgvector ou outro para busca semântica?** — Supabase tem extensão pgvector. Usar ou considerar serviço externo?
10. **O CID deve expor webhooks?** — Para outros módulos saberem quando um asset está pronto.

---

## 10. REFLEXÃO CRÍTICA FINAL

### Riscos Reais

1. **Dependência de API key externa** — O CID inteiro para de processar se a GEMINI_API_KEY expirar ou ficar sem crédito. **Mitigação:** Configurar alerta de saldo, ter fallback para DeepSeek, e garantir que `store_only` sempre funcione independente de API key.

2. **Netlify Function como gargalo** — A função precisa baixar o arquivo, extrair, transcrever, fragmentar e resumir em uma única execução de 10 segundos (limite da Netlify). Arquivos grandes ou áudios longos podem estourar o timeout. **Mitigação:** 2.2 (fila assíncrona) é crítico.

3. **Custo de transcrição** — Gemini API para transcrição de áudio/vídeo pode ficar caro se usado em volume. **Mitigação:** Priorizar Whisper local, usar Gemini apenas como fallback.

4. **Falsa sensação de funcionamento** — O upload funciona sempre. Se o processor falha silenciosamente, o usuário acha que o documento está processado mas não está. **Mitigação:** Já corrigido (fetch awaitado + feedback na UI). Mas ainda depende de o usuário olhar o status.

### Limitações Honestas

5. **OCR de PDF é complexo** — Extrair texto de PDF escaneado não é trivial. Tesseract.js no browser é lento (pode travar a UI). Server-side OCR via Gemini Vision funciona mas é pago.

6. **Busca semântica não é trivial** — Embeddings + pgvector é o caminho, mas exige infraestrutura, indexação e manutenção. Não é feature para "semana que vem".

7. **O CID não substitui um DMS** — Não tem versionamento de documentos, workflow de aprovação, ou controle de acesso granulado. Não tente fazer o CID virar um SharePoint.

### O que Atacar Primeiro

**Ordem recomendada (pós-owner definido):**

1. **Chaves de API reais** — Sem isso, nada funciona. É o passo mais crítico.
2. **Validação E2E com TXT** — Confirmar que o pipeline completo funciona.
3. **Validação E2E com PDF e DOCX** — Confirmar extração de texto.
4. **Monitoramento básico** — Saber quando um job falha.
5. **OCR e busca semântica** — Só depois que o básico estiver sólido.

### O que Deixar para Depois

- ✅ **API formal** — Não precisa agora. O shim do Supabase é suficiente.
- ✅ **Pacote npm** — Só quando outro projeto precisar.
- ✅ **Integração com Vault** — Depois que o Vault estiver maduro.
- ✅ **Batch por asset** — Placeholder na UI está ok por enquanto.

### O que Eu Faria Diferente

1. **Teria colocado o processor como Edge Function do Supabase** em vez de Netlify Function. O Supabase tem melhor integração com o banco, menos latência e sem limite de 10s. Mas a decisão de usar Netlify foi tomada antes, e está funcionando.

2. **Teria criado testes desde o início** — A ausência de testes torna cada refatoração um risco. Mas entendo que o contexto era de prototipação rápida.

3. **Teria separado o CIDView em componentes menores** — Hoje o arquivo tem 1100+ linhas. Funciona, mas é difícil de manter. Uma refatoração em `CIDUploadPanel`, `CIDLibraryPanel`, `CIDProcessingPanel` seria mais limpa.

### Conclusão

O CID está **no caminho certo**. A arquitetura é sólida, o pipeline é funcional, e as correções desta rodada (normalização de prompts, contraste de UI, tratamento do processor fetch, documentação) endereçam os principais gaps imediatos.

**O próximo passo crítico é colocar as chaves de API reais e validar o pipeline de ponta a ponta.** Depois disso, o CID estará pronto para uso real como camada de preparação documental do SagB.

---

*Documento gerado em 04/06/2026 como parte da ET 02 — Auditoria estratégica e plano mestre do CID.*
