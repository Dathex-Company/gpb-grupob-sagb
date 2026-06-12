# Observabilidade — Central de Padrões

## Logs implementados

- `centralPadroesApprovalService`: request, approve, reject, publish e deprecate.
- `centralPadroesSearchService`: reindex fallback.

## Métricas disponíveis

- Dashboard normativo: padrões, documentos, checklists, decisões, módulos vinculados, riscos e aprovações pendentes.
- Search UI exibe score de relevância textual.
- Relationship UI exibe score de risco e breaking changes.

## Health check operacional

1. Abrir Central.
2. Verificar dashboard.
3. Executar busca textual.
4. Abrir aprovações.
5. Abrir triagem.

