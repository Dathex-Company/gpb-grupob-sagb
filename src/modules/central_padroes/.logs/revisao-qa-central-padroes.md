# QA — Central de Padrões ET-02 a ET-07

## Validações

- `npm run build`: OK em todos os blocos A-E.
- CRUD UI: formulários e ações renderizam.
- Approval UI: listagem, modal e ações disponíveis.
- Relacionamentos: grafo visual e painel de impacto renderizam.
- Triagem: fila com fallback e ações aceitar/ignorar.
- Busca: debounce, abas, score e fallback textual.

## Warnings conhecidos

- Circular chunk vendor/react-vendor.
- Chunk principal acima de 500 kB.
- Import estático/dinâmico de `services/supabase.ts`.

## Blockers

Nenhum blocker de build identificado.

