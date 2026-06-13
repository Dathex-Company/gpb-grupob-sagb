# 🧨 Auditoria Total de Uso Real — Central de Documentos e Padrões — 12-06-2026

## Resumo executivo

Auditoria operacional em três passadas: visual/manual orientada por usuário, técnica por código e fluxo de documento. A Central está utilizável hoje **com ressalvas controladas**: CRUDs principais existem, Supabase/RLS já estão seguros, dark mode está integrado ao tema global, build/test passam. A principal ressalva é que a busca global ainda não indexa automaticamente relatórios, auditorias, curadoria e LOZE-TRACE; essas áreas têm busca própria por tela.

## Passada A — Auditoria visual/manual orientada

| Tela | Abre? | Título/guia | Ação principal | Estado vazio | Erro amigável | Dark | Botão morto | Status |
|---|---|---|---|---|---|---|---|---|
| Início | Sim | Sim | Ver métricas | Sim | Sim | Sim | Não | 🟢 |
| Buscar | Sim | Sim | Buscar | Sim | Sim parcial | Sim | Não | 🟡 |
| Pergunte ao Pietro | Sim | Sim | Enviar pergunta | Sim | Sim | Sim | Não | 🟢 |
| Painel de Governança | Sim | Sim | Atualizar | Sim | Console apenas em falha repo | Sim | Não | 🟢 |
| Documentos | Sim | Sim | Registrar/visualizar | Sim | Sim | Sim | Não | 🟡 |
| Padrões | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Decisões | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Checklists | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Auditorias | Sim | Sim | Criar registro | Sim | Sim | Sim | Não | 🟢 |
| Relatórios | Sim | Sim | Criar registro | Sim | Sim | Sim | Não | 🟢 |
| Curadoria | Sim | Sim | Criar registro | Sim | Sim | Sim | Não | 🟢 |
| LOZE-TRACE / Execuções | Sim | Sim | Registrar LOZE-TRACE | Sim | Sim | Sim | Não | 🟢 |
| Evidências | Sim | Placeholder claro | Abrir Auditorias | Sim | N/A | Sim | Não | 🟡 |
| Módulos Base | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Links de Módulos | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Dependências | Sim | Sim | Visualizar | Sim | Sim | Sim | Não | 🟡 |
| Tags | Sim | Placeholder claro | Abrir Documentos | Sim | N/A | Sim | Não | 🟡 |
| Aprovações Pendentes | Sim | Sim | Aprovar/rejeitar quando houver | Sim | Sim | Sim | Não | 🟡 |
| Configurações | Sim | Sim | Ajustar config | Sim | Sim | Sim | Não | 🟡 |
| Modo Dev | Sim | Sim | Diagnóstico | Sim | Sim | Sim | Não | 🟡 |

## Passada B — Auditoria técnica por código

### Rotas, layout e navegação

- `CentralPadroesLayout.tsx` centraliza todos os `case` de tela.
- `sidebarConfig.ts` cobre todas as entradas visíveis.
- `breadcrumbLabels` cobre as entradas reais.
- Existem placeholders planejados para `tags`, `ingestion` e `evidence`, mas não são botões mortos: têm mensagem e CTA para área relacionada.
- Botão “Voltar ao SagB” dispara `sagb:navigate` para `ecosystem`; depende do shell global, mas é intencional.

### CRUDs reais

- `CentralGovernanceRecordsPage.tsx` atende Relatórios, Auditorias e Curadoria.
- Campos: título, tipo, categoria, status, risco, owner, caminho absoluto, caminho relativo, tags, resumo e conteúdo.
- Filtros: status e risco.
- Busca local após carregar linhas.
- Correção feita nesta auditoria: busca passou a considerar tipo, categoria, status, risco, conteúdo, source, tags, datas e caminhos.
- Correção feita nesta auditoria: copiar caminho vazio agora exibe erro amigável, não sucesso falso.

### Supabase

- `centralPadroesGovernanceService.ts` usa `restFetch` com token de sessão quando existe.
- Sem service role no frontend.
- Sem policy anon aberta no código.
- Tabelas corretas: `central_padroes_reports`, `central_padroes_audits`, `central_padroes_curadoria`, `central_padroes_trace_logs`.

### Dark mode

- `CentralPadroesLayout.tsx` agora usa `useTheme()` global do SagB.
- `centralDocs.css` usa variáveis `--cp-*` com bloco `[data-mode="dark"]`.
- Classes novas `.cp-chat-*` e `.cp-governance-*` usam variáveis.

## Passada C — Fluxo de documento

| Etapa | Status | Observação |
|---|---|---|
| Criar documento operacional | 🟡 | Documentos legados/fallback; para registro real imediato usar Relatórios/Curadoria/Auditorias conforme tipo |
| Classificar | 🟢 | Tipo, categoria, status, risco, tags disponíveis nos CRUDs |
| Salvar | 🟢 | POST/PATCH via Supabase para CRUDs novos |
| Encontrar depois | 🟢 por tela / 🟡 busca global | Busca por tela cobre metadados; busca global ainda não indexa novas tabelas |
| Filtrar | 🟢 | Status/risco nos CRUDs; abas na busca global |
| Abrir detalhe | 🟢 | Clique na linha abre modal de edição nos CRUDs |
| Editar metadado | 🟢 | Modal PATCH |
| Copiar caminho | 🟢 | Caminho absoluto ou relativo; erro se vazio |
| Ver status/risco/owner | 🟢 | Colunas visíveis |
| Ver data/origem | 🟡 | Data/origem existem no serviço e busca; não aparecem como colunas principais |

## Teste — Não perder documentos

| Pergunta | Resposta atual |
|---|---|
| Onde eu salvei? | 🟢 caminho absoluto/relativo no registro |
| Qual categoria? | 🟢 campo category |
| Qual tipo? | 🟢 campo type |
| Qual status? | 🟢 campo status + filtro |
| Qual risco? | 🟢 campo riskLevel + filtro |
| Quem é o dono? | 🟢 campo owner |
| Qual tag? | 🟢 campo tags |
| Qual data? | 🟡 criada/atualizada no banco e busca, mas não coluna principal |
| Como encontro de novo? | 🟢 busca da tela por metadados + filtro |
| Busca global encontra? | 🟡 só padrões/documentos/decisões fallback; não indexa CRUDs novos |

## Problemas críticos encontrados

Nenhum problema 🔴 que impeça uso hoje nas áreas CRUD novas.

## Problemas corrigidos nesta auditoria

1. Busca dos CRUDs ampliada para tipo, categoria, status, risco, tags, conteúdo, source e datas.
2. Copiar caminho vazio deixou de exibir sucesso falso e agora mostra erro amigável.

## Problemas pendentes

| Prioridade | Problema | Impacto | Correção recomendada |
|---|---|---|---|
| P1 | Busca global não indexa relatórios/auditorias/curadoria/trace | Usuário precisa entrar na área correta para encontrar registros novos | Integrar `centralPadroesGovernanceService` ao `centralPadroesSearchService` |
| P2 | Data/origem não aparecem como colunas nos CRUDs | Usuário vê menos contexto na listagem | Adicionar coluna/linha secundária com data e source |
| P2 | Smoke authenticated real não executado nesta sessão | Persistência auth não comprovada por usuário real | Executar com login real no navegador |
| P3 | Placeholders Tags/Evidências/Ingestão são planejados | Usuário pode esperar funcionalidade completa | Manter microcopy clara ou implementar módulos |

## Status operacional

Pode usar hoje com ressalvas: **sim**. Usar Relatórios, Auditorias, Curadoria e LOZE-TRACE para registros reais com caminho, owner, status, risco e tags. Para busca global total, ainda há ressalva.
