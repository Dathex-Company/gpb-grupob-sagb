# API SagB — Visão

A API SagB é a borda oficial do ecossistema SagB para sistemas.

Fronteiras:

- API SagB: contrato HTTP, autenticação, autorização, auditoria e normalização.
- Hub de Integrações: providers, conectores, credenciais e execução externa.
- Supabase: persistência, Auth, Storage, logs e dados operacionais.
- MCP SagB: ferramentas para agentes.
- FluxoB: orquestração futura, sem bloquear integrações iniciais.

Princípio central: nenhum sistema externo acessa Supabase diretamente como contrato público; ele passa pela API.

