# Checklist de Segurança de Ambiente MCP — LOZE-MCP-OPS V1

> Checklist obrigatório para validar a segurança do ambiente MCP em cada estágio (local, preview, produção).
> Deve ser executado antes de colocar qualquer operação em produção e sempre que houver mudança significativa de configuração.

---

## 1. Checklist por Ambiente

### 🖥️ Ambiente Local

| # | Item | Status | Observação |
|---|------|--------|-----------|
| 1 | `.env.example` existe no projeto | ⬜ | Deve conter apenas nomes de variáveis com valores falsos |
| 2 | `docs/mapa-ambiente-segredos.md` existe | ⬜ | Mapa de variáveis sem valores reais |
| 3 | `.env` ou `.env.local` está em `.gitignore` | ⬜ | Nunca versionar segredos |
| 4 | Nenhum segredo real está hardcoded no código | ⬜ | Verificar `process.env`, `import.meta.env` |
| 5 | Logs locais não imprimem valores de variáveis | ⬜ | Console.log sanitizado |
| 6 | Ferramentas MCP locais operam em modo mock | ⬜ | Sem acesso a serviços reais |
| 7 | Código não faz referência a URLs de produção | ⬜ | Usar variáveis de ambiente |

### 🟡 Ambiente Preview

| # | Item | Status | Observação |
|---|------|--------|-----------|
| 1 | `.env.example` existe e está atualizado | ⬜ | Deve refletir as variáveis usadas no preview |
| 2 | `docs/mapa-ambiente-segredos.md` atualizado | ⬜ | Preview pode ter variáveis diferentes de produção |
| 3 | Service role key **não** está em variáveis de frontend | ⬜ | Verificar Netlify > Deploy Contexts |
| 4 | Netlify tem ambientes separados (Preview ≠ Produção) | ⬜ | Variáveis de preview não afetam produção |
| 5 | Build não expõe segredos nos logs de deploy | ⬜ | Verificar logs do Netlify Deploy |
| 6 | Ferramentas críticas do MCP estão desabilitadas no preview | ⬜ | Ferramentas de alteração bloqueadas |
| 7 | Ações de deploy de preview geram log com correlation_id | ⬜ | Obrigatório para rastreabilidade |
| 8 | `MCP_INTERNAL_OPS_TOKEN` está configurado para preview | ⬜ | Token de curta duração |

### 🔴 Ambiente Produção

| # | Item | Status | Observação |
|---|------|--------|-----------|
| 1 | Produção exige autorização explícita para ações críticas | ⬜ | Nenhuma ação sem aprovação |
| 2 | Segredos críticos estão no cofre (Bitwarden/Vault) | ⬜ | Service role, Stripe, OpenAI |
| 3 | Service role key **nunca** está em variável de frontend | ⬜ | **Crítico:** Verificar antes de qualquer deploy |
| 4 | Preview e produção não estão confundidos | ⬜ | Variáveis e ambientes isolados |
| 5 | Ferramentas críticas do MCP têm trava ativada | ⬜ | Dupla validação para ações de alto risco |
| 6 | Operações do MCP são 100% rastreáveis | ⬜ | Logs com correlation_id em banco |
| 7 | Logs não imprimem valores de segredos | ⬜ | Sanitização obrigatória |
| 8 | Existe owner definido para cada variável crítica | ⬜ | Responsável pela rotação |
| 9 | Regra de rotação documentada para cada segredo | ⬜ | Frequência definida |
| 10 | Deploy de produção não é automático | ⬜ | Exige ação manual + autorização |
| 11 | MCP não pode executar ações destrutivas | ⬜ | Reset, delete, force-push bloqueados |
| 12 | Push para `main` não é feito por agente MCP | ⬜ | Apenas PR com review |

---

## 2. Itens de Validação Transversais (todos os ambientes)

| # | Item | Obrigatório | Frequência |
|---|------|------------|-----------|
| 1 | `.env.example` existe | ✅ | Sempre |
| 2 | `docs/mapa-ambiente-segredos.md` existe | ✅ | Sempre |
| 3 | Service role nunca vai para frontend | ✅ | A cada deploy |
| 4 | Produção exige autorização explícita | ✅ | A cada operação |
| 5 | Segredos não são expostos em resposta do MCP | ✅ | A cada operação |
| 6 | Logs não imprimem segredos | ✅ | A cada operação |
| 7 | Preview e produção não estão confundidos | ✅ | A cada deploy |
| 8 | Ferramentas críticas exigem trava | ✅ | Configuração inicial |
| 9 | Operações são rastreáveis | ✅ | A cada operação |
| 10 | Existe owner e regra de rotação | ✅ | Configuração inicial |

---

## 3. Checklist de Pré-Deploy (Produção)

Antes de qualquer deploy em produção, executar:

- [ ] 1. Todos os itens do ambiente Produção estão verificados
- [ ] 2. Service role key não está em variável de frontend
- [ ] 3. Logs de preview não contêm segredos
- [ ] 4. Mapa de ambiente está atualizado
- [ ] 5. Ferramentas críticas do MCP estão com trava ativada
- [ ] 6. Owner aprovou o deploy explicitamente
- [ ] 7. Correlation_id está sendo gerado para todas as operações
- [ ] 8. Última rotação de segredos está dentro do prazo
- [ ] 9. Backup do banco foi realizado (se aplicável)
- [ ] 10. Cofre está acessível para emergências

---

## 4. Checklist de Resposta a Incidentes

Se houver suspeita de vazamento de segredo:

- [ ] 1. **Rotacionar imediatamente** a chave comprometida (Service Role, API Key, Token)
- [ ] 2. Verificar logs de operação do MCP para identificar origem
- [ ] 3. Revisar permissões do agente que solicitou a operação
- [ ] 4. Atualizar `docs/mapa-ambiente-segredos.md` com nova data de rotação
- [ ] 5. Registrar incidente em `docs/registro-operacoes-mcp.md`
- [ ] 6. Notificar owner e equipe de segurança
- [ ] 7. Revisar se alguma resposta do MCP expôs o valor
- [ ] 8. Aplicar patch de segurança (se necessário)

---

## 5. Referências

- [`docs/loze-mcp-ops-ambientes.md`](loze-mcp-ops-ambientes.md) — Arquitetura completa do LOZE-MCP-OPS
- [`docs/mapa-ambiente-segredos.md`](mapa-ambiente-segredos.md) — Mapa de variáveis e segredos
- [`docs/matriz-permissoes-mcp.md`](matriz-permissoes-mcp.md) — Matriz de permissões
- [`docs/registro-operacoes-mcp.md`](registro-operacoes-mcp.md) — Modelo de registro de operações

---

## 6. Histórico de Revisões

| Data | Versão | Alteração | Responsável |
|------|--------|-----------|-------------|
| 2026-06-07 | 1.0 | Criação do documento — Checklist de segurança LOZE-MCP-OPS V1 | Cássio Mendes |

---

*Este documento é parte do padrão **LOZE-MCP-OPS | Operações, Ambientes e Segredos**.
Arquivo: `docs/checklist-seguranca-ambiente-mcp.md`*
