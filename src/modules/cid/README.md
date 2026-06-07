# CID — Centro de Ingestão Documental

## Propósito

O CID é a camada de preparação documental do SagB. Sua responsabilidade é receber matéria-prima documental, armazenar originais, extrair texto quando aplicável, transcrever mídia, fragmentar conteúdos e expor ativos preparados para consumo por camadas posteriores.

## Fronteira oficial

### O CID faz

- Upload e armazenamento de documentos.
- Registro de ativos documentais.
- Organização de arquivos e metadados.
- Extração técnica de texto.
- Transcrição de áudio e vídeo quando aplicável.
- Fragmentação em chunks.
- Controle de jobs de processamento.
- Busca operacional em ativos, chunks e outputs.
- Dashboard geral do acervo e operação.
- Exploração local de raízes autorizadas para importação segura.

### O CID não faz

- Inteligência profunda.
- Cruzamento estratégico entre documentos.
- Recomendações consultivas.
- Leitura de negócio.
- Radar de Conexões.
- NICO.
- NAGI.
- Consolidação estratégica por prompts.

Essas responsabilidades pertencem a módulos ou camadas posteriores do ecossistema SagB.

## Princípios

1. Store first, process later.
2. Original soberano e não destrutivo.
3. Todo processamento deve ser rastreável.
4. Operações caras devem ser explícitas e controláveis.
5. Outputs do CID são matéria-prima preparada, não conclusão estratégica.
6. Integrações externas devem ser tratadas como fallback ou adapter, não como dependência invisível.

## Estrutura atual relevante

- `components/CIDView.tsx` — shell principal atual do módulo no app.
- `src/modules/cid/components/CidDashboard.tsx` — dashboard geral do CID.
- `src/modules/cid/components/CidLocalExplorer.tsx` — explorador local de raízes autorizadas.
- `src/modules/cid/module-doc.ts` — manifest/documentação programática do módulo.
- `netlify/functions/cid-processor.mjs` — processamento principal.
- `netlify/functions/cid-search.mjs` — busca operacional.
- `services/supabase.ts` — shim Supabase/PostgREST usado pelo CID e outros módulos.
- `services/storage.ts` — upload para storage.

## Tabelas principais

- `cid_assets`
- `cid_asset_files`
- `cid_processing_jobs`
- `cid_chunks`
- `cid_outputs`
- `cid_tags`
- `cid_asset_tags`
- `cid_batches`
- `cid_batch_items`

## Estado atual

O módulo está funcional, mas ainda em evolução técnica. Já existem upload, registro de ativos, jobs, outputs, chunks, dashboard geral e explorador local. A camada de prompts/derivados foi removida do CID para preservar a fronteira com inteligência profunda. A próxima fase é reduzir a concentração de responsabilidades em `CIDView.tsx` e robustecer extractors/chunking.

## Plano mestre

O plano aprovado está em `src/modules/cid/plans/ET02_AUDITORIA_ESTRATEGICA_PLANO_MESTRE_CID.md`.
