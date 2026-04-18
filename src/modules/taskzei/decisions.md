# decisions — modulo taskzei

## 2026_04_17

### decisao_001
- modulo `taskzei` passa a operar tambem como `agenda_inteligente`.

### decisao_002
- responsavel oficial do modulo: `dani_freitas`.
- agente diretor oficial: `dani_freitas_diretora`.

### decisao_003
- padrao de nomenclatura do modulo e agentes: lowercase com `_`.

### decisao_004
- fluxo de ativacao autonoma sera iniciado por `agent/prompt_ativacao_cline.md`.

### decisao_005
- persistencia oficial do taskzei sera feita via supabase com provider dedicado selecionado por env (`VITE_TASKZEI_PROVIDER`).

### decisao_006
- enquanto o taskzei estiver no banco compartilhado do SagB, toda a estrutura de dados deve permanecer identificada por prefixo `taskzei_` e com plano formal de migracao futura documentado.
