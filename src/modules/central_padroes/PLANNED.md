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

## 4.1 Plano de Continuidade — Módulo Modelo (100%)

### Etapa A — Consolidação do Shell (concluída)
- [x] Sidebar global do SagB oculta para `central_padroes` em [`App.tsx`](00_sagb/App.tsx).
- [x] Sidebar própria do módulo implementada em [`CentralPadroesLayout.tsx`](00_sagb/src/modules/central_padroes/layout/CentralPadroesLayout.tsx).
- [x] Ação "Voltar ao SagB" com evento `sagb:navigate` padronizada.

### Etapa B — Evolução da Navegação Interna (próxima)
- [ ] Substituir visão única (`overview`) por seções internas reais no layout:
  - [ ] `overview`
  - [ ] `normas`
  - [ ] `operacional`
  - [ ] `templates`
  - [ ] `auditoria`
- [ ] Persistir última seção aberta em storage local do módulo.
- [ ] Criar componente reutilizável de item de menu para reduzir duplicação.

### Etapa C — Conformidade Alice UI Standard v1.0
- [ ] Migrar `font-inter` para Rubik no módulo.
- [ ] Revisar tipografia para tokens canônicos (sidebar/menu/cards/listas).
- [ ] Revisar densidade de listas para assinatura de 32px onde aplicável.
- [ ] Padronizar hover/focus/active com tokens `--primary`, `--primary-soft`, `--line`.
- [ ] Revisar dark mode para evitar preto puro e manter contraste aprovado.

### Etapa D — Hardening Técnico
- [ ] Centralizar configuração `hideSidebar` em registro de módulos (evitar condição longa inline no app raiz).
- [ ] Especificar contrato de navegação (evento de entrada/saída do shell do módulo).
- [ ] Adicionar testes de regressão visual para shell do módulo.
- [ ] Adicionar smoke test para fluxo: entrar módulo → trocar seção → voltar ao SagB.

### Etapa E — Governança e Reuso (módulo modelo)
- [ ] Publicar ADR interno do padrão sidebar plugável usando `central_padroes` como módulo referência.
- [ ] Extrair `ModuleSidebar` genérico em `src/core/ui` para reaproveito em novos módulos.
- [ ] Criar checklist operacional "Pronto para produção" para módulos plugáveis.
- [ ] Replicar padrão nos próximos módulos com rastreabilidade em changelog/decisions.

### Critério de “Módulo 100% Modelo”
- [ ] Shell full screen consistente com Alice UI Standard v1.0.
- [ ] Navegação interna estruturada em múltiplas seções.
- [ ] Sidebar global/global return funcionando sem exceções.
- [ ] Tokens e tipografia consolidados (Rubik + paleta + densidade).
- [ ] Testes mínimos de fluxo e regressão visual ativos.
- [ ] Documentação viva em [`CHANGELOG.md`](00_sagb/src/modules/central_padroes/CHANGELOG.md) e [`DECISIONS.md`](00_sagb/src/modules/central_padroes/DECISIONS.md).

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


## 6. Curadoria Geral das Divisões — Central de Padrões

- [x] ET-09 — Sávio / Técnica concluída operacionalmente.
- [x] ET-10 a ET-20 carregadas operacionalmente no fallback do módulo.
- [x] Relatórios por divisão criados em `docs/07_validacoes/`.
- [x] ET-21 — Auditoria de Cobertura da Curadoria Geral concluída.
- [x] ET-21 — Correção de build por filesystem concluída e validada.
- [ ] Validação final de Pietro para canonicidade.
- [ ] Revisão de cada responsável de divisão.
- [ ] Evoluir estrutura própria para matrizes e registros/evidências quando o módulo suportar entidades dedicadas.
- [ ] Sanear numeração do Modelo Padrão para Documentos de Padrões por Área, corrigindo pequenas duplicidades no índice e repetição de numeração em algumas seções.
