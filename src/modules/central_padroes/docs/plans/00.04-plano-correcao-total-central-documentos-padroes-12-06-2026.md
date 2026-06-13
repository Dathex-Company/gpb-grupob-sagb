# 🛠️ Plano de Correção Total — Central de Documentos e Padrões — 12-06-2026

## Objetivo

Eliminar riscos de uso real: perda de documento, navegação confusa, busca incompleta, feedback falso e telas planejadas sem orientação.

## Correções já executadas nesta tarefa

| Item | Risco | Arquivo | Status |
|---|---|---|---|
| Busca dos CRUDs ampliada para metadados completos | R2 | `centralPadroesGovernanceService.ts` | ✅ Feito |
| Feedback correto ao copiar caminho vazio | R2 | `CentralGovernanceRecordsPage.tsx` | ✅ Feito |

## Correções prioritárias pendentes

| Prioridade | Problema | Ação | Risco | Arquivo provável |
|---|---|---|---|---|
| P1 | Busca global não indexa CRUDs novos | Incluir reports/audits/curadoria/trace no `centralPadroesSearchService` | R3 | `centralPadroesSearchService.ts` |
| P1 | Smoke auth real pendente | Rodar navegador logado e criar/editar/listar 4 registros | R1 | Navegador |
| P2 | Data/origem não visíveis na listagem CRUD | Adicionar linha secundária/colunas compactas | R3 | `CentralGovernanceRecordsPage.tsx` |
| P2 | Sem filtro por categoria/tag na UI | Adicionar filtros de categoria/tags | R3 | `CentralGovernanceRecordsPage.tsx` |
| P3 | Tags/Evidências/Ingestão são placeholders | Implementar módulos ou reforçar microcopy | R3 | `CentralPadroesLayout.tsx` |

## Plano de uso seguro hoje

1. Guardar documentos reais como Relatório, Auditoria ou Curadoria.
2. Sempre preencher: título, tipo, categoria, status, risco, owner, caminho absoluto/relativo e tags.
3. Usar a busca da própria tela para encontrar por título, owner, caminho, tag, tipo, categoria, risco ou data.
4. Usar copiar caminho apenas após preencher caminho; UI agora avisa se estiver vazio.
5. Não depender ainda da busca global para encontrar os CRUDs novos.

## Validações obrigatórias após próxima iteração

- Criar 1 relatório auth real.
- Criar 1 auditoria auth real.
- Criar 1 curadoria auth real.
- Criar 1 LOZE-TRACE auth real.
- Recarregar tela e confirmar persistência.
- Buscar por título, tag, owner e caminho.
