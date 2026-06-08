# Plano de Auditoria de Módulos SagB — Pré-Deploy

## Objetivo
Analisar a saúde de todos os módulos registrados, identificar falhas que impedem o build/deploy e corrigir o nome "NIDE" na sidebar (ainda referenciado como "Missões" em alguns lugares).

---

## 1. Problema Reportado: NIDE com nome "Missões" no sidebar

### Diagnóstico

| Onde | O que acontece | Status |
|------|---------------|--------|
| [`Sidebar.tsx`](00_sagb/components/Sidebar.tsx:200) | `NIDE_MIGRATED_MODULE_IDS = new Set(['missions', ...])` filtra corretamente o módulo antigo | ✅ Correto |
| [`Sidebar.tsx`](00_sagb/components/Sidebar.tsx:206-207) | Módulos dinâmicos usam `mod.manifest.displayName` como label — NIDE tem `displayName: 'NIDE'` | ✅ Correto |
| [`nide/manifest.ts`](00_sagb/src/modules/nide/manifest.ts:6) | `displayName: 'NIDE'` — label correta do módulo | ✅ Correto |
| [`missoes/manifest.ts`](00_sagb/src/modules/missoes/manifest.ts:6) | `displayName: 'Missões'` — módulo legado preservado | ✅ Preservado |
| [`App.tsx`](00_sagb/App.tsx:1724) | `tabAliases: { 'missions': 'nide' }` — redireciona rota legada | ✅ Correto |
| [`App.tsx`](00_sagb/App.tsx:1716) | `hideSidebar` ainda verifica `activeTab === 'missions'` — redundante com `'nide'` | ⚠️ Residual, seguro |

**Conclusão**: No SagB sidebar, o NIDE **já aparece como "NIDE"** e o Missões **está oculto**. O que o usuário pode estar vendo é o nome interno "Missões" DENTRO do módulo NIDE (domain interno), não no sidebar.

---

## 2. Auditoria de Todos os Módulos Registrados

### Módulos no `moduleRegistry.ts`

| Módulo | ID | displayName | Rota | Registrado | Rota exportada | Observação |
|--------|----|-------------|------|-----------|----------------|------------|
| `api_sagb` | `api_sagb` | API SagB | `/api_sagb` | ✅ | ✅ | Backend functions |
| `hub-integracao` | `hub-integracao` | Hub Integração | `/hub-integracao` | ✅ | ✅ | |
| `agentes_comerciais` | `agentes_comerciais` | Agentes Comerciais | `/agentes_comerciais` | ✅ | ✅ | |
| `cadastro-empresas` | `cadastro-empresas` | Cadastro Empresas | `/cadastro-empresas` | ✅ | ✅ | |
| `nucleo-conversacional` | `nucleo-conversacional` | Núcleo Conversacional | `/nucleo-conversacional` | ✅ | ✅ (rota manual) | |
| `nucleo_de_agentes` | `nucleo_de_agentes` | Núcleo de Agentes | `/nucleo_de_agentes` | ✅ | ✅ | Inclui AgentFactory |
| `central_padroes` | `central_padroes` | Central de Padrões | `/central_padroes/*` | ✅ | ✅ | |
| `monitoramento` | `monitoramento` | Monitoramento | `/monitoramento` | ✅ | ✅ | |
| `nagi` | `nagi` | NAGI | `/nagi` | ✅ | ✅ | |
| `nic` | `nic` | NIC | `/nic` | ✅ | ✅ | |
| `sala-dev` | `sala-dev` | Sala Dev | `/sala-dev` | ✅ | ✅ | |
| `mentorias` | `mentorias` | Mentorias | `/mentorias` | ✅ | ✅ | |
| `metodologias` | `metodologias` | Metodologias | `/metodologias` | ✅ | ✅ | |
| `missoes` | **`missions`** | **Missões** | `/missoes` | ✅ | ✅ | **Módulo legado, oculto do sidebar** |
| `rai` | `rai` | RAI | `/rai` | ✅ | ✅ | |
| `karaoke` | `karaoke` | Karaokê | `/karaoke` | ✅ | ✅ | |
| `studio` | `studio` | Studio | `/studio` | ✅ | ✅ | |
| `cid` | `cid` | CID | `/cid` | ✅ | ✅ | |
| `taskzei` | `taskzei` | TaskZei | `/taskzei` | ✅ | ✅ | |
| `crm_ziplia` | `crm-ziplia` | CRM Ziplia | `/crm-ziplia` | ✅ | ✅ | |
| `configuracoes-ambiente` | `configuracoes-ambiente` | Config. Ambiente | `/configuracoes-ambiente` | ✅ | ✅ | |
| `gestao_financeira` | `gestao-financeira` | Gestão Financeira | `/gestao-financeira` | ✅ | ✅ | |
| `telas_avancadas` | `telas-avancadas` | Telas Avançadas | `/telas-avancadas` | ✅ | ✅ | |
| `videos-ia` | `videos-ia` | Vídeos IA | `/videos-ia` | ✅ | ✅ | |
| `foco_total` | `foco-total` | Foco Total | `/foco-total` | ✅ | ✅ | |
| `sagb_bridge` | `sagb-bridge` | SagB Bridge | `/sagb-bridge` | ✅ | ✅ | |
| `mcp_sagb` | `mcp-sagb` | MCP SagB | `/mcp-sagb` | ✅ | ✅ | |
| `fluxob` | `fluxob` | FluxoB | `/fluxob` | ✅ | ✅ | |
| **`nide`** | **`nide`** | **NIDE** | `/nide` | ✅ | ✅ | **Substituto de Missões** |

### Problemas Identificados

#### 🔴 Crítico (impede build/deploy)
Nenhum encontrado. Todos os módulos têm manifests e rotas exportadas corretamente.

#### 🟡 Médio
1. **`hideSidebar` referência redundante**: `activeTab === 'missions'` (App.tsx:1716) — seguro, mas residual. Deveria ser apenas `activeTab === 'nide'`.
2. **`renderContent` tem `case 'missions'` legado** (App.tsx:1865-1873) — renderiza `AgentMissionsView`, mas nunca é atingido porque `tabAliases` redireciona.
3. **Internal NIDE domain "Missões"**: No [`domainRegistry.ts`](00_sagb/src/modules/nide/registry/domainRegistry.ts:28-29) o core domain ainda chama `displayName: 'Missões'`. É o nome interno DENTRO do NIDE, não o sidebar. Pode ser renomeado para "NIDE Core" ou "Início" para evitar confusão.
4. **`missoes` module ainda no registry**: Preservado como fallback por design (documentado no NIDE module-doc), mas poderia ser removido quando a migração estiver 100% consolidada.

#### 🟢 Leve / Estético
- Nenhum outro problema encontrado nos manifests, rotas ou tipos.

---

## 3. Fluxo de Renderização Atual

```mermaid
flowchart TD
    A[Sidebar carrega] --> B[getRegisteredModules]
    B --> C{Filtros}
    C -->|staticItemIds| D[Itens fixos: Home, Ecosystem...]
    C -->|staticLabelSet| E[Remove labels duplicados]
    C -->|NIDE_MIGRATED_MODULE_IDS| F[Remove missions, metodologias, mentorias]
    F --> G[sortModulesByOrder]
    G --> H[renderMenuItem com displayName do manifest]
    H --> I[activeTab setada]
    I --> J{tabAliases}
    J -->|missions| K[nide]
    J -->|metodologias| K
    J -->|quadro_de_elite| L[nucleo_de_agentes]
    K --> M[moduleRoutes[nide] = NideShell]
    M --> N[NideShell interno carrega domainRegistry]
    N --> O[Core = Missões domain com displayName interno]
```

---

## 4. Plano de Correções

### Tarefa 1: Limpar referências legadas de "missions" no App.tsx
- Remover `activeTab === 'missions'` de `hideSidebar` (linha 1716)
- Remover `case 'missions'` de `renderContent` (linhas 1865-1873)
- Manter `tabAliases` com `'missions': 'nide'` para compatibilidade de navegação externa

### Tarefa 2: Renomear core domain do NIDE para evitar confusão (opcional)
- Alterar `displayName: 'Missões'` → `displayName: 'NIDE Core'` no [`domainRegistry.ts`](00_sagb/src/modules/nide/registry/domainRegistry.ts:29)
- Isso afeta APENAS o label interno da navegação de domínios dentro do NIDE

### Tarefa 3: Commit completo e deploy
- `git add -A` (tudo incluindo as correções)
- `git commit -m "chore: auditoria pre-deploy sagb - limpeza referencias missions legadas"`
- `git push origin main`
- Netlify deploy automático

---

## 5. Checklist de Verificação Pré-Deploy

- [ ] Todos os módulos têm manifest exportado
- [ ] Todos os módulos têm rota exportada
- [ ] Nenhum import quebrado no moduleRegistry
- [ ] Nenhuma referência a módulo excluído
- [ ] Sidebar filtra módulos migrados corretamente
- [ ] tabAliases redirecionam rotas legadas
- [ ] hideSidebar/hideHeader cobrem todos os módulos fullscreen
- [ ] `npm run dev` compila sem erros
