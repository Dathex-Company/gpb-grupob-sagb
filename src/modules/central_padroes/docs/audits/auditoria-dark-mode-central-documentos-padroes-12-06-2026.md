# 🌙 Auditoria Dark Mode — Central de Documentos e Padrões — 12-06-2026

## Resumo

A Central possui seu próprio toggle de dark mode (`data-mode` no `.cp-docs-root`), completamente isolado do tema global do SagB (`ThemeContext` com `classList.add('dark')` no `<html>`). A camada de CSS variables já está correta e pronta para dark mode, mas o trigger está desconectado.

---

## 1. Padrão Global SagB

| Aspecto | Implementação |
|---|---|
| Provider | `ThemeContext.tsx` → `ThemeProvider` |
| Wrapper | `index.tsx` — envolve todo o `<App />` |
| Tema armazenado | `localStorage['sagb-theme']` = `'light'` \| `'dark'` |
| Toggle global | `document.documentElement.classList.add/remove('dark')` |
| CSS vars | `generateCssVariables(theme)` injeta `<style id="sagb-theme-variables">` |
| Hook público | `useTheme()` → `{ theme, setTheme, toggleTheme }` |

## 2. Padrão Atual da Central (incorreto)

| Aspecto | Implementação | Problema |
|---|---|---|
| Toggle | `useState<'light' \| 'dark'>('light')` local | **Isolado** — não lê tema global |
| Atributo | `data-mode={mode}` no `.cp-docs-root` | Funcional, mas desconectado |
| Botão | `onClick={() => setMode(prev => ...)}` | **Não afeta tema global SagB** |
| CSS dark | `[data-mode="dark"]` redefine `--cp-*` vars | ✅ Correto |

## 3. Cores Fixas (Hardcoded)

| Linha | Arquivo | Cor | Contexto | Impacto Dark |
|---|---|---|---|---|
| 182 | centralDocs.css | `color: #fff` | Texto em gradient button | 🟢 OK (branco em botão) |
| 516 | centralDocs.css | `#139a8e, #1b6e78` | Gradient avatar circle | 🟢 OK (decorativo) |
| 517 | centralDocs.css | `color: #fff` | Texto em avatar | 🟢 OK |
| 798 | centralDocs.css | `color: #fff` | Texto em gradient button | 🟢 OK |
| 1670 | centralDocs.css | `color: #fff` | Texto em send button | 🟢 OK |

**Conclusão**: Nenhuma cor fixa que cause problemas de legibilidade no dark mode.

## 4. CSS Variables — Cobertura Dark

| Variável | Light | Dark | Status |
|---|---|---|---|
| `--cp-bg` | `#fbfaf8` | `#141414` | ✅ |
| `--cp-sidebar` | `#f7f6f3` | `#191919` | ✅ |
| `--cp-surface` | `#ffffff` | `#1f1f1f` | ✅ |
| `--cp-text` | `#2f2d28` | `#f0eeea` | ✅ |
| `--cp-muted` | `#5f5a54` | `#c2bdb6` | ✅ |
| `--cp-soft` | `#8c877f` | `#96918a` | ✅ |
| `--cp-primary` | `#5b5bd6` | `#8b8bff` | ✅ |
| `--cp-green` | `#2d8f67` | `#68d391` | ✅ |
| `--cp-orange` | `#c86b2c` | `#f6a56a` | ✅ |
| `--cp-blue` | `#2f6fbd` | `#7db4ff` | ✅ |
| `--cp-purple` | `#7a4dd8` | `#b99aff` | ✅ |
| `--cp-yellow` | `#b7791f` | `#f6d365` | ✅ |
| `--cp-red` | `#c53030` | `#fc8181` | ✅ |
| `--cp-line` | `rgba(55,53,47,0.09)` | `rgba(255,255,255,0.095)` | ✅ |
| `--cp-hover` | `#f1f0ed` | `#252525` | ✅ |
| `--cp-active` | `#edebe7` | `#2a2a2a` | ✅ |

**Conclusão**: 100% das variáveis CSS têm equivalente dark. Todas as classes de governance e chat usam `var(--cp-*)` corretamente.

## 5. Telas Auditadas no Contexto Dark

| Tela | Usa vars? | Background | Texto | Bordas | Inputs | Badges |
|---|---|---|---|---|---|---|
| Dashboard | ✅ `var(--cp-*)` | OK | OK | OK | OK | ✅ `.cp-visual-badge` |
| Governance Panel | ✅ `var(--cp-*)` | OK | OK | OK | N/A | OK |
| Chat Pietro | ✅ `var(--cp-*)` | OK | OK | OK | OK | OK |
| CRUDs (via CentralGovernanceRecordsPage) | ✅ `var(--cp-*)` | OK | OK | OK | OK | ✅ `.cp-visual-badge` |
| Sidebar | ✅ `var(--cp-*)` | OK | OK | OK | N/A | N/A |
| Topbar/Breadcrumb | ✅ `var(--cp-*)` | OK | OK | OK | N/A | N/A |

## 6. Correção Necessária

| Arquivo | Alteração | Risco |
|---|---|---|
| `layout/CentralPadroesLayout.tsx` | Importar `useTheme`, substituir `mode` local por `theme` global, botão toggle → `toggleTheme()` | R3 |

**Impacto**: 1 arquivo, ~5 linhas alteradas.
