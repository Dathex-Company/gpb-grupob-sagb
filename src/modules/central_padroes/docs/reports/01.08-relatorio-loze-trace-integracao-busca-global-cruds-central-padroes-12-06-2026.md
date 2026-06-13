# LOZE-TRACE — Integração da busca global com CRUDs da Central de Padrões — 12/06/2026

## 1. Identificação

- Execução: integração da busca global da Central de Documentos e Padrões com os CRUDs operacionais novos.
- Data: 12/06/2026.
- Escopo: frontend local da Central de Padrões.
- Risco máximo executado: R3 — alteração local de UI, tipos e serviços de leitura.

## 2. Objetivo

Permitir que a busca global da Central encontre registros reais das tabelas operacionais:

- `central_padroes_reports`
- `central_padroes_audits`
- `central_padroes_curadoria`
- `central_padroes_trace_logs`

Também foi solicitado corrigir o botão superior “Registrar”, removendo o fallback genérico para documentos e oferecendo um menu explícito de destinos de cadastro.

## 3. Arquivos alterados

- `src/modules/central_padroes/types/index.ts`
- `src/modules/central_padroes/services/centralPadroesSearchService.ts`
- `src/modules/central_padroes/pages/SearchPage.tsx`
- `src/modules/central_padroes/layout/CentralPadroesLayout.tsx`
- `src/modules/central_padroes/styles/centralDocs.css`
- `src/modules/central_padroes/docs/reports/relatorio-loze-trace-integracao-busca-global-cruds-central-padroes-12-06-2026.md`
- `src/modules/central_padroes/docs/reports/relatorio-integracao-busca-global-cruds-central-padroes-12-06-2026.md`

## 4. Alterações técnicas executadas

### 4.1 Tipagem da busca

A tipagem dos resultados foi ampliada para aceitar novas origens:

- relatório
- auditoria
- curadoria
- LOZE-TRACE

Também foram adicionados metadados opcionais para exibição operacional na tela de busca:

- título
- tipo
- categoria
- status
- risco
- owner
- tags
- caminho absoluto
- caminho relativo
- resumo

### 4.2 Serviço de busca

O serviço de busca passou a consultar, além do snapshot/fallback já existente, os serviços reais dos CRUDs:

- `centralPadroesGovernanceService.listRecords('central_padroes_reports')`
- `centralPadroesGovernanceService.listRecords('central_padroes_audits')`
- `centralPadroesGovernanceService.listRecords('central_padroes_curadoria')`
- `centralPadroesGovernanceService.listTraceLogs()`

Cada resultado recebe:

- `entityType`
- `originLabel`
- `routeId`
- `excerpt`
- `score`
- `meta`

### 4.3 Interface de busca

A página de busca agora exibe abas específicas para:

- Todos
- Padrões
- Documentos
- Decisões
- Relatórios
- Auditorias
- Curadoria
- LOZE-TRACE

A tela também exibe chips de metadados e botão “Abrir origem”, que navega para a tela correspondente.

### 4.4 Layout e topbar

O layout passou a enviar callback de navegação para a busca. O botão “Registrar” foi transformado em menu com quatro opções:

- Registrar relatório
- Registrar auditoria
- Registrar item de curadoria
- Registrar LOZE-TRACE

## 5. Comandos executados

### 5.1 Tentativas iniciais com caminho absoluto

As primeiras tentativas com caminho absoluto falharam porque o terminal executado a partir do workspace atual não encontrou `Z:\00_sagb` via comando informado. Não houve alteração de código nessas tentativas.

### 5.2 Teste automatizado

Comando executado no diretório correto:

```bash
npm run test
```

Resultado:

- 12 testes executados.
- 12 testes aprovados.
- 0 falhas.

### 5.3 Build de produção

Comando executado no diretório correto:

```bash
npm run build
```

Resultado:

- Build concluído com sucesso.
- 947 módulos transformados.
- Avisos existentes de chunk/circularidade foram emitidos pelo Vite, sem impedir o build.

## 6. Restrições respeitadas

- Nenhuma migration foi criada ou alterada.
- Nenhuma policy Supabase foi alterada.
- Nenhuma credencial ou secret foi acessada.
- Nenhum deploy foi executado.
- Nenhum commit foi realizado.
- Nenhum service role foi usado.

## 7. Riscos e mitigação

| Risco | Classificação | Mitigação |
|---|---:|---|
| Busca ficar limitada ao fallback antigo | R2 | Serviço passou a consultar os CRUDs reais. |
| Usuário abrir destino genérico ao registrar | R2 | Botão foi substituído por menu com destinos explícitos. |
| Resultado sem contexto operacional | R2 | Metadados foram exibidos em chips na tela de busca. |
| Quebra de build TypeScript | R3 | `npm run build` executado com sucesso. |

## 8. Status LOZE-TRACE

Status: concluído.

A integração foi implementada e validada por teste automatizado e build de produção.
