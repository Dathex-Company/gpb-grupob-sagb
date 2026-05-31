# Revisão de Código — Central de Padrões ET-02 a ET-06

## Escopo revisado

- Services CRUD, approval, relationships, triagem, search e storage.
- Páginas de padrões, documentos, decisões, checklists, aprovações, relacionamentos, dev mode e busca.
- Migrations ET-02 a ET-07.

## Achados

- Sem blocker de build.
- Services usam `restFetch`, mantendo padrão existente do módulo.
- Fallback textual cobre indisponibilidade de Supabase/pgvector.

## Dívidas técnicas

- RLS ainda precisa evoluir de `authenticated` para papéis admin/owner.
- Grafo é visual V1, sem biblioteca de força direcionada.
- Busca semântica real depende de geração de embeddings.

