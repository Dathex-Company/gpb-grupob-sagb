# Plano de Evolução — LOZE-MCP-OPS V1

> Documento de planejamento da MEGA-ETAPA 01: LOZE-MCP-OPS | Operações, Ambientes e Segredos.

---

## Macro Etapas

### MEGA-ETAPA 01 ✅ Concluída — LOZE-MCP-OPS V1 (documental + estrutural)
- [x] Auditoria e mapeamento inicial do MCP SagB existente
- [x] Criação de `docs/mapa-ambiente-segredos.md`
- [x] Criação de `docs/loze-mcp-ops-ambientes.md`
- [x] Criação de `docs/registro-operacoes-mcp.md`
- [x] Criação de `docs/checklist-seguranca-ambiente-mcp.md`
- [x] Criação de `docs/matriz-permissoes-mcp.md`
- [x] Criação de `.env.example`
- [x] Atualização de `changelog.md`
- [x] Atualização de `decisions.md`

### MEGA-ETAPA 02 ⏳ Pendente — Implementação das Ferramentas OPS
- [ ] Criar tipos OPS em `types/mcpSagb.types.ts` (permissions, operation logs, environment)
- [ ] Adicionar ferramentas OPS ao `data/mcpSagbCatalog.ts`
- [ ] Implementar `consultar-status-projeto` no service
- [ ] Implementar `listar-variaveis-sem-valores` no service
- [ ] Implementar `validar-variaveis-obrigatorias` no service
- [ ] Implementar `consultar-status-deploy` no service
- [ ] Implementar `consultar-logs-deploy` no service
- [ ] Implementar `acionar-build-preview` no service (protegido)
- [ ] Implementar `verificar-github-status` no service
- [ ] Implementar `verificar-supabase-status` no service
- [ ] Implementar `registrar-evento-operacional` no service
- [ ] Implementar layer de autorização (matriz de permissões)
- [ ] Implementar layer de log obrigatório com `correlation_id`

### MEGA-ETAPA 03 ⏳ Pendente — Auditoria e Segurança
- [ ] Revisar todas as ferramentas existentes contra a matriz de permissões
- [ ] Garantir que nenhuma ferramenta existente expõe segredos
- [ ] Adicionar validação de ambiente nas ferramentas existentes
- [ ] Testar fluxo de autorização para ações protegidas
- [ ] Validar checklist de segurança nos 3 ambientes

### MEGA-ETAPA 04 ⏳ Pendente — Integração com Serviços Reais
- [ ] Conectar `verificar-github-status` com GitHub API (status público)
- [ ] Conectar `verificar-supabase-status` com Supabase API (status público)
- [ ] Conectar `consultar-status-deploy` com Netlify API (deploy status público)
- [ ] Implementar `MCP_INTERNAL_OPS_TOKEN` para operações autenticadas
- [ ] Documentar rotação automática de tokens

### MEGA-ETAPA 05 ⏳ Pendente — Evolução e Melhorias Contínuas
- [ ] Avaliar necessidade de novas ferramentas OPS
- [ ] Integrar com cofre (Bitwarden/Vault) para rotação automatizada
- [ ] Implementar notificações de risco (slack, email)
- [ ] Dashboard de auditoria de operações MCP
- [ ] Relatório periódico de segurança de ambientes

---

## Riscos e Cuidados

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Ferramenta existente expor segredo inadvertidamente | Média | Crítico | Revisão código a código na MEGA-ETAPA 03 |
| Agente solicitar ação bloqueada | Alta | Médio | Matriz de permissões + log de tentativa |
| Vazamento de service role key | Baixa | Crítico | Checklist obrigatório + rotação 30 dias |
| Deploy não autorizado em produção | Baixa | Crítico | Bloqueado na V1, exige dupla validação |
| Log conter segredo por engano | Média | Alto | Template obrigatório + sanitização |

---

## Sugestões para Melhorias Futuras

1. **Dashboard visual de operações MCP** — UI mostrando logs em tempo real com filtros por agente, ação e risco
2. **Notificações proativas** — Se uma ação de alto risco for tentada, notificar owner imediatamente
3. **Rastro de autorização** — Quem autorizou o quê e quando, com prova (hash da aprovação)
4. **Modo de simulação (dry-run)** — Agente pode simular uma ação para ver se seria permitida
5. **Política de expiração de autorização** — Autorizações expiram após X minutos
6. **Integração com cofre para rotação automática** — MCP solicita novo token ao cofre quando o atual expira
7. **Métrica de risco acumulado** — Se um agente tenta muitas ações bloqueadas, alertar
