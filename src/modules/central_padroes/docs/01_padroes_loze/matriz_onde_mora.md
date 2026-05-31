# Matriz Onde Mora

| Item | Onde fica | Exemplo | Tipo | Status | Observação |
|---|---|---|---|---|---|
| Código | Loze/Produtos (repositórios) | `Loze/.../09_Repositorios/nome_do_repo/` | técnico | definido | fonte principal de execução |
| Repositório Git | GitHub da Loze | `github.com/org/repo` | técnico | definido | versionamento oficial |
| Documentação técnica do repo | próprio repo + Central de Padrões | `README.md`, `docs/` | técnico | definido | sem duplicar regra canônica |
| Padrão canônico | Central de Padrões Loze | `src/modules/central_padroes/docs/01_padroes_loze/` | governança | definido | regra oficial |
| Documento de produto | pasta de produto da Loze | PRD / visão do produto | produto | em validação | depende do padrão LOZE-OPP |
| Escopo | Conta Interna + produto | backlog/escopo | gestão | em validação | separar escopo técnico x comercial |
| Demanda | Conta Interna | TaskZei/ClickUp | gestão | em validação | entrada da operação |
| SLA | Conta Interna | contrato de atendimento | governança | em validação | precisa padrão único |
| Suporte | Conta Interna + operação | fila de suporte | operação | em validação | definir níveis |
| Faturamento interno | Conta Interna | centro de custo | financeiro | em validação | fora do repo técnico |
| Conta Interna | estrutura de contas Loze | `Loze/02_Clientes/Nome_da_Conta/` | relacionamento | definido | camada de entrega |
| Uso diário | empresa atendida | `empresas_b/nome_da_empresa/` | operação | definido | rotina de negócio |
| Reunião interna empresa atendida | operação da empresa | atas internas | operação | em validação | não é padrão canônico técnico |
| Reunião cliente-fornecedor | Conta Interna | atas de alinhamento | relacionamento | em validação | trilha de decisão comercial |
| Decisão estrutural | ADR | `05_decisoes_adr/` | governança | definido | sem ADR não oficializa regra |
| ADR | Central de Padrões | `05_decisoes_adr/` | governança | definido | histórico de decisão |
| Erro | módulo + inventário de risco | issues/logs | técnico | em validação | registrar criticidade |
| Bug | módulo | issue/pull request | técnico | em validação | evidência no módulo |
| Incidente | runbook + operação | playbook de incidente | operação | em validação | precisa template oficial |
| Quarentena Técnica | pasta de riscos | `04_quarentena_e_riscos/` | governança técnica | definido | antes de remover qualquer item |
| Logs | módulo/infra observabilidade | logs runtime | técnico | em validação | definir stack oficial |
| Runbooks | templates + operação | runbook deploy/incidente | operação técnica | em validação | padronizar em `06_templates/` |
| Documentos Dathex antigos | legado referenciado | docs legados | legado | definido | não apagar sem validação |
| Templates | Central de Padrões | `06_templates/` | governança | definido | base reutilizável |
| Assets de marca | repositório/design oficial | logo, identidade | design | em validação | separar do código |
| Jurídico | estrutura corporativa adequada | contratos/políticas | jurídico | em validação | fora do repo técnico principal |
| Financeiro | estrutura corporativa adequada | DRE, faturamento | financeiro | em validação | fora do repo técnico principal |
| Backups | plataforma de infra | backups db/storage | infraestrutura | em validação | política de retenção pendente |
| API | módulo + docs canônicas | `api_sagb`, docs API | técnico | em validação | precisa padrão de contrato |
| MCP | módulo MCP + padrão Loze | `mcp_sagb`, docs MCP | técnico | em validação | separar LOZE-MCP x LOZE-AI |
| Agente | módulo de agentes + docs | `quadro_de_elite`, `nucleo_de_agentes` | técnico | em validação | fonte única pendente ADR |
| Módulo plugável | `src/modules/<modulo>/` | `cid`, `taskzei` | arquitetura | definido | registrar no registry |
| Supabase/migrations | repo técnico | `supabase/migrations/` | dados | definido | governado por revisão técnica |
| Netlify Functions | repo técnico | `netlify/functions/` | integração/backend | definido | inventário canônico |
| Integrações | módulo + hub integração | `hub-integracao` | integração | em validação | credenciais sensíveis sob revisão |

## Exemplos obrigatórios

- **Código:** `Loze/01_Produtos/01_Ativos/Nome_do_Produto/09_Repositorios/nome_do_repo/`
- **Padrão canônico:** `src/modules/central_padroes/docs/01_padroes_loze/`
- **Conta Interna:** `Loze/02_Clientes/Nome_da_Conta/`
- **Uso diário:** `empresas_b/nome_da_empresa/`

