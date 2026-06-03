# Changelog — NIDE

## [0.7.0] — 2026-06-02 — ET 10/10 — Redirects oficiais e validação final

### Added
- tabAliases no App.tsx: `'missions' → 'nide'`, `'metodologias' → 'nide'`, `'mentorias' → 'nide'`
- `'missions'` adicionado ao hideSidebar no App.tsx

### Changed
- `App.tsx`: tabAliases estendido com 3 aliases de migração
- `App.tsx`: hideSidebar inclui `'missions'`

### Preserved
- Módulos originais no moduleRegistry — intactos (fallback funcional)
- Rotas antigas via activeTab — intactas
- `case 'missions'` no switch do App.tsx — inalcançável via alias, mas preservado
- `moduleRoutes` para metodologias/mentorias — inalcançáveis via alias, mas preservados
- `src/modules/missoes/` — intacto
- `src/modules/metodologias/` — intacto
- `src/modules/mentorias/` — intacto
- Supabase — não alterado

### Navegação final

| Rota | Comportamento | Status |
|------|---------------|--------|
| `/nide` | Renderiza NIDE | ✅ Oficial |
| `/nide/metodologias` | Domain interno Metodologias | ✅ Oficial |
| `/nide/mentorias` | Domain interno Mentorias | ✅ Oficial |
| `/missoes` | Alias → /nide (via missions → nide) | 🔶 Legado c/ alias |
| `/missions` | Alias → /nide | 🔶 Legado c/ alias |
| `/metodologias` | Alias → /nide | 🔶 Legado c/ alias |
| `/mentorias` | Alias → /nide | 🔶 Legado c/ alias |

## [0.6.0] — 2026-06-02 — ET 09/10 — Limpeza controlada
## [0.5.0] — 2026-06-02 — Megaetapa 06-08/08
## [0.4.0] — 2026-06-02 — ET 05 — Metodologias
## [0.3.0] — 2026-06-02 — ET 04 — Registry
## [0.2.0] — 2026-06-02 — ET 03 — Core Missões
## [0.1.0] — 2025-06-02 — Estrutura inicial
