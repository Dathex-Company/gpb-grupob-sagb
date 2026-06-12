# Relatório final — Integração da busca global com CRUDs da Central de Padrões — 12/06/2026

## 1. Status executivo

Status: concluído com sucesso.

A busca global da Central de Documentos e Padrões foi ampliada para pesquisar os novos CRUDs operacionais e a ação superior “Registrar” deixou de abrir o fallback genérico de documentos.

## 2. Escopo entregue

Foram integradas à busca global as origens:

- `central_padroes_reports`
- `central_padroes_audits`
- `central_padroes_curadoria`
- `central_padroes_trace_logs`

Cada resultado agora pode carregar origem, metadados operacionais e destino de navegação.

## 3. Busca global

### 3.1 Antes

A busca consultava principalmente entidades do snapshot/fallback da Central, como padrões, documentos, decisões, módulos base e execuções antigas.

### 3.2 Depois

A busca passou a consultar também registros reais dos serviços de governança documental:

- Relatórios
- Auditorias
- Curadoria
- LOZE-TRACE

Os campos considerados incluem:

- título
- tipo
- categoria
- status
- risco
- owner/executor
- tags
- caminho absoluto
- caminho relativo
- resumo
- conteúdo
- origem
- datas
- metadados JSON de LOZE-TRACE

## 4. Interface de resultados

A tela de busca agora possui filtros por tipo de resultado:

- Todos
- Padrões
- Documentos
- Decisões
- Relatórios
- Auditorias
- Curadoria
- LOZE-TRACE

Cada card pode exibir:

- origem do registro
- título
- trecho encontrado
- tipo
- categoria
- status
- risco
- owner/executor
- caminho
- tags
- score
- botão “Abrir origem”

## 5. Navegação para origem

Foi conectado callback de navegação no layout da Central. Os destinos utilizados são:

| Tipo de resultado | Destino |
|---|---|
| Relatório | Relatórios |
| Auditoria | Auditorias |
| Curadoria | Curadoria |
| LOZE-TRACE | Agentes / LOZE-TRACE |
| Padrão | Padrões |
| Documento | Documentos |
| Decisão | Decisões |

## 6. Topbar “Registrar”

O botão superior “Registrar” foi convertido em menu simples com quatro opções:

- Registrar relatório
- Registrar auditoria
- Registrar item de curadoria
- Registrar LOZE-TRACE

Com isso, o botão não direciona mais o usuário para a tela genérica de documentos.

## 7. Arquivos alterados

- `src/modules/central_padroes/types/index.ts`
- `src/modules/central_padroes/services/centralPadroesSearchService.ts`
- `src/modules/central_padroes/pages/SearchPage.tsx`
- `src/modules/central_padroes/layout/CentralPadroesLayout.tsx`
- `src/modules/central_padroes/styles/centralDocs.css`

## 8. Validação técnica

### 8.1 Testes

Comando:

```bash
npm run test
```

Resultado:

- 12 testes aprovados.
- 0 falhas.

### 8.2 Build

Comando:

```bash
npm run build
```

Resultado:

- Build finalizado com sucesso.
- Avisos de bundle/chunk já existentes não impediram a geração do build.

## 9. Limites da entrega

Não foram realizadas alterações em:

- Supabase migrations
- RLS policies
- secrets
- deploy
- commit Git
- service role

## 10. Conclusão

A Central passa a ter busca global operacionalmente útil para os quatro novos CRUDs. O usuário consegue pesquisar registros pelos principais campos de trabalho, identificar a origem, ver metadados relevantes e navegar para a tela correspondente. O fluxo de registro no topo também ficou explícito e seguro, sem fallback genérico.
