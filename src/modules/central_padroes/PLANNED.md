# Plano do Módulo: Central de Padrões

## 1. Visão Geral
Módulo responsável por manter, governar e auditar os padrões de desenvolvimento, arquitetura e processos de toda a plataforma SagB.

## 2. Escopo
- Definição de padrões de código
- Definição de regras de interface
- Centralização de componentes de UI padrão
- Auditoria de módulos para conformidade

## 3. Estado Atual
- Implementação inicial base.
- Manifest, Changelog e Decisions em vigor.
- Padrões de estilo sob adequação (DEC-008).

## 4. Próximos Passos
- Refatoração total para tokens semânticos e remoção de inline styles.
- Integração plena da auditoria visual no ciclo de desenvolvimento.

## 5. Fase 1 — Governança SagB-first (Supabase como Source of Truth)

### Objetivo
- Tornar o Supabase a fonte primária de regras de governança.
- Transformar a Central de Padrões em editor/publicador (não apenas leitura).
- Materializar cópia fiel auditável em `docs/governanca_sagb/*.md` após publicação.

### Entregas da Fase 1
- ET-01: schema mínimo `public.governance_rules` com versionamento, checksum, status de sync e trilha de erro.
- ET-02: evolução da UI para edição Markdown + preview + publicação com incremento de versão.
- ET-03: função serverless de sync documental idempotente para copiar conteúdo publicado em arquivos de docs.

### Fora de Escopo nesta fase
- Reconciliação automática 15/15 min.
- SLA formal.
- Consumo runtime pelos módulos externos ao escopo direto da Central de Padrões.
