# Planejado — NIDE

## ✅ ET 02/08 — Base modular criada
## ✅ ET 03/08 — Missões como core funcional
## ✅ ET 04/08 — Registry interno de domínios
## ✅ ET 05/08 — Metodologias como domínio
## ✅ ET 06/08 — Mentorias como domínio
## ✅ ET 07/08 — Rotas, aliases, navegação
## ✅ ET 08/08 — Validação, docs, relatório
## ✅ ET 09/10 — Limpeza controlada pós-migração
- Missões, Metodologias, Mentorias ocultados do menu global

## ✅ ET 10/10 — Redirects oficiais e validação final
- [x] tabAliases adicionados no App.tsx:
  - `'missions'` → `'nide'`
  - `'metodologias'` → `'nide'`
  - `'mentorias'` → `'nide'`
- [x] `hideSidebar` atualizado para incluir `'missions'`
- [x] Módulos originais preservados no moduleRegistry
- [x] Rotas antigas funcionam como fallback via alias
- [x] Build validado (857 módulos, zero erros)
- [x] Relatório final salvo em Plans/

## 🔲 Pós-ciclo 01-10 (opcional)
- [ ] Deep-link para domains específicos via initialDomain prop
- [ ] Remoção definitiva de módulos antigos do moduleRegistry (após validação)
- [ ] Tree-shaking de bundles não utilizados (missoes, metodologias, mentorias originais)
