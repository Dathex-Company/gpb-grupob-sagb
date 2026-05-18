# Plano de Implementação Final — QG 3forB

Objetivo: Executar todos os ajustes para ter a estrutura definitiva 100% consolidada dentro de `Z:\empresas_b\3forb\qg_3forb`, eliminando fontes duplicadas e padronizando agentes, governança e módulos.

---

## Timeline em 3 Fases

### Fase 1 — Fundação (executar primeiro, interdependências mínimas)

**1.1. Copiar organograma canônico para dentro do QG**
- Origem: `_ventures/3forb/organogramas_3forb/organograma_3forb_v1_completo.md`
- Destino: `qg_3forb/governance/organograma.md`
- Ação: `copy` simples (arquivo estático de consulta)

**1.2. Remover `session.md` extra do valuation/agent**
- Arquivo: `qg_3forb/src/modules/valuation/agent/session.md`
- Ação: deletar (viola Regra 1.1 — apenas 4 canônicos)
- Risco: nenhum (é duplicata de session_log.md)

**1.3. Ajustar `evaluation` para contrato ModuleManifest**
- Alvo: `qg_3forb/src/modules/evaluation/`
- Ações:
  a. Renomear `src/` para `src-deprecated/` (estrutura antiga)
  b. Criar `manifest.ts` novo seguindo `ModuleManifest` (id, displayName, status, owner, etc.)
  c. Criar `module-doc.ts` com contexto/objetivo/escopo
  d. Criar `routes.tsx` exportando array vazio (`ModuleRoute[]`)
  e. Criar `index.ts` com exports compatíveis com `moduleRegistry`
  f. Atualizar `moduleRegistry.ts` para consumir direto (sem adaptação)

**1.4. Padronizar agentes dentro dos módulos**
- Verificar cada `modules/*/agent/` dentro de `qg_3forb/src/modules/`:
  - gestao-midias-pagas: ✅ já canônico (4 arquivos)
  - valuation: ⚠️ tem `session.md` extra → deletar
  - sites-landing-pages: ✅ já canônico (4 arquivos)
  - vendas: ✅ já canônico (4 arquivos)
  - evaluation: ❌ não tem agent folder → criar com 4 arquivos canônicos

---

### Fase 2 — Consolidação (requer Fase 1 concluída)

**2.1. Extrair agentes legados da `agents/` para `qg_3forb/agents/`**

Criar pasta `qg_3forb/agents/` com subpastas para cada agente usando o padrão canônico:

| Agente | Origem | Conteúdo existente | Ação |
|--------|--------|-------------------|------|
| rian_mercer_3fb_cro_e_001 | `agents/zara-bittencourt/rian-mercer/persona.md` | "Em consolidação." | Criar prompt baseado no ChatGPT Zara (linhas 12500-13300) |
| bia_fanel_3fb_cmo_e_002 | `agents/zara-bittencourt/bia-fanel/persona.md` | Verificar conteúdo | Se vazio, criar do zero baseado no ChatGPT |
| anton_borselli_3fb_mkt_e_005 | `agents/zara-bittencourt/bia-fanel/anton-borselli/persona.md` | Verificar conteúdo | Se vazio, criar do zero |
| max_guerra_3fb_vnd_e_064 | `agents/max-guerra/persona.md` | Verificar conteúdo | Se vazio, criar do zero |
| alec_ross | `agents/alec-ross/persona.md` | Verificar | Se útil, migrar e converter |
| henri_milan | `agents/henri-milan/persona.md` | Verificar | Se útil, migrar e converter |
| murilo_zago | `agents/murilo-zago/persona.md` | Verificar | Se útil, migrar e converter |
| tarian_wolfe | `agents/tarian-wolfe/persona.md` | Verificar | Se útil, migrar e converter |
| zoren_white | `agents/zoren-white/persona.md` | Verificar | Se útil, migrar e converter |

Estrutura de cada pasta:
```
qg_3forb/agents/nome_agente/
├── persona.md
├── prompt_ativacao_cline.md
├── session_log.md
└── falas_user.md
```

**2.2. Copiar docs de governança restantes**
- `governance/organograma_marketing.md` → `qg_3forb/governance/organograma_marketing.md` (consulta)
- `governance/README.md` → `qg_3forb/governance/README.md`
- `governance/_agentes_oficiais/` → verificar se tem conteúdo útil (provavelmente vazio, ignorar)

---

### Fase 3 — Limpeza e Finalização (maior risco, só após Fase 1+2)

**3.1. Validar que não há perda de conteúdo**
- Comparar arquivo a arquivo `modules/*` vs `qg_3forb/src/modules/*` para cada módulo
- Confirmar que `modules/valuation/src/services/` tem os mesmos arquivos que `qg_3forb/src/modules/valuation/src/services/`
- Se houver diferença, migrar os arquivos faltantes antes de remover

**3.2. Remover diretórios legados da raiz**

| Diretório | Risco | Ação |
|-----------|-------|------|
| `modules/` | 🟡 Médio | Conteúdo duplicado em qg_3forb. Remover após validação |
| `agents/` | 🟢 Baixo | Conteúdo extraído ou irrelevante. Remover |
| `raw/` | 🟢 Baixo | Vazio. Remover |
| `pendencias/` | 🟢 Baixo | Vazio. Remover |
| `insights/` | 🟢 Baixo | Vazio. Remover |
| `decisoes/` | 🟢 Baixo | Vazio. Remover |
| `_agentes/` (raiz) | 🟡 Médio | Só tem Zara, que já está em qg_3forb/agent/. Remover ou manter como fallback |
| `governance/` (raiz) | 🟡 Médio | Conteúdo copiado para qg_3forb/governance/. Remover após confirmação |

**3.3. Atualizar `qg_3forb/README.md`**
- Refletir nova estrutura consolidada
- Listar todos os módulos com status atualizado
- Listar diretório de agentes
- Atualizar referências de governance

**3.4. Build e validação final**
- Executar `npm run build` em `qg_3forb/`
- Verificar se moduleRegistry carrega todos os módulos sem erro
- Corrigir qualquer broken import

---

## Ordem de Execução (sequência exata)

```
 PASSO 1.1 — Copiar organograma.md para qg_3forb/governance/
 PASSO 1.2 — Deletar session.md extra do valuation/agent/
 PASSO 1.3 — Reestruturar evaluation com contrato ModuleManifest
 PASSO 1.4 — Criar agent folder canônico para evaluation

 PASSO 2.1 — Extrair agentes legados → qg_3forb/agents/
 PASSO 2.2 — Copiar docs de governança restantes

 PASSO 3.1 — Validar paridade modules/ vs qg_3forb/src/modules/
 PASSO 3.2 — Remover diretórios legados da raiz
 PASSO 3.3 — Atualizar qg_3forb/README.md
 PASSO 3.4 — npm run build + validação
```

---

## Riscos e Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| evaluation quebrar dependência com valuation | 🟡 Médio | Manter os imports atuais funcionando enquanto cria nova estrutura |
| Perder services do valuation que só existem em `modules/` | 🔴 Alto | Validar arquivo a arquivo antes de remover `modules/` |
| moduleRegistry falhar se evaluation não exportar corretamente | 🔴 Alto | Testar com build antes de prosseguir para Fase 3 |
| Agentes legados terem conteúdo útil não replicado | 🟡 Médio | Ler cada persona.md antes de descartar `agents/` |

---

## Checklist de Verificação Final

- [ ] `qg_3forb/governance/organograma.md` existe
- [ ] `valuation/agent/` tem apenas 4 arquivos canônicos
- [ ] `evaluation/` segue contrato `ModuleManifest` e está no registry
- [ ] `evaluation/agent/` tem 4 arquivos canônicos
- [ ] `qg_3forb/agents/` contém pastas canônicas dos agentes legados
- [ ] `qg_3forb/governance/` tem todos os documentos de governança
- [ ] Raiz de `Z:\empresas_b\3forb` tem apenas `qg_3forb/`, `_clientes_ativos/`, `_reunioes/`, `_triagem/`, `README.md`
- [ ] `npm run build` em qg_3forb passa sem erros
- [ ] `README.md` do qg_3forb reflete estrutura atualizada
