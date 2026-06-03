# Decisões Arquiteturais — NIDE

## 2026-06-02 — ET 10/10 — Redirects oficiais e validação final

### Estratégia de redirect

| Decisão | Opção escolhida | Alternativas | Motivo |
|---------|----------------|--------------|--------|
| Como redirecionar | `tabAliases` no App.tsx | moduleRoutes wrapper, switch redirect | Mecanismo já existe (tabAliases); mínimo código |
| Destino único | Todos (`missions`, `metodologias`, `mentorias`) → `nide` | Cada um para seu domain específico | NIDE não tem deep-link para domains internos via activeTab |
| hideSidebar | `'missions'` adicionado ao OR chain | Usar resolvedActiveTab | Consistência com metodologias/mentorias já existentes |
| Rotas antigas em moduleRegistry | Mantidas intactas | Remover | Fallback preservado; remoção quebraria código externo |
| Module bundles originais | Ainda carregados no build | Tree-shaking se removidos do registry | Não remover do registry = módulos ainda no bundle |

### Por que não deep-link para domain específico?

O NIDE usa `selectedDomain` (estado interno React) para navegação entre domains, não URL-based routing. Deep-link para `/nide/metodologias` exigiria:
- Refatorar NideShell para aceitar initialDomain via prop
- Alterar NIDE routes.tsx para múltiplas rotas
- Coordenar com NideDomainNav para sync

Isso é viável em etapa futura, mas não é necessário agora — o redirect simples para `/nide` é suficiente e seguro.

### Próximos passos (pós-ciclo)

- [ ] Deep-link para domains específicos (opcional)
- [ ] Remoção definitiva de módulos antigos do moduleRegistry
- [ ] Tree-shaking de bundles não utilizados

## Decisões anteriores (preservadas)

### ET 09/10 — Limpeza controlada
- Sidebar filtrada para ocultar missions, metodologias, mentorias
- Filtro via Set (NIDE_MIGRATED_MODULE_IDS)

### ET 06-08/08 — Megaetapa de migração
- Mentorias migrado, lazy loading, duplicidade documentada

### ETs 02/08 a 05/08 — migrações iniciais
