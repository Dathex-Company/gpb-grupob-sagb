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

## 2026_05_02

### decisao_007
- owner oficial do modulo declarado em `manifest.ts` no campo `owner`, conforme padrao canonico `padrao_modulos_plugaveis.md` secao 1.1.1.
- `agent/owner.md` nao deve ser criado e foi removido de toda referencia de governanca.

### decisao_008
- displayName do modulo alterado de `taskzei` para `Agenda Inteligente` para alinhar branding com a interface do SagB.
- O nome `TaskZei` permanece como `internalName` (engine/produto destacavel).

### decisao_009
- `module-doc.ts` atualizado: requiredDocs agora lista 7 documentos canonicos (sem `agent/owner.md`, com `plano_modulo.md`).

### decisao_010
- persona do agente atualizada de "Guardiao do Modulo" para "Dani Freitas — Produto TaskZei" com autoridade de decisao de produto.

### decisao_011
- provider mock definido como fallback permanente de desenvolvimento, nao como divida tecnica temporaria.
- Em producao, o padrao sera `VITE_TASKZEI_PROVIDER=supabase`.
- Componente `<MockModeBanner />` deve ser criado para alertar quando em modo mock.

### decisao_012
- `plano_modulo.md` criado como documento oficial de planejamento executivo do modulo, com 10 fases, 28 ETs, KPIs e riscos.

### decisao_013
- Integracoes externas (ClickUp, WhatsApp, e-mail) devem obrigatoriamente passar pelo `hub-integracao`, nunca por conexao direta.
