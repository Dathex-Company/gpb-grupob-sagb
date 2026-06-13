# 🧹 Relatório de Limpeza Estrutural — Central de Padrões — 12-06-2026

## 📌 Resumo
| Critério | Status |
|---|---|
| Base limpa primeiro | 🟢 Feito |
| Documentação depois | 🟢 Feito |
| Relatório no final | 🟢 Feito |
| Código funcional alterado | 🟢 Não |
| Rota alterada | 🟢 Não |
| Banco/migration/deploy | 🟢 Não |

## 🧭 Estrutura encontrada antes
```txt
central_padroes/
  .logs/
  .specs/
  docs/
    00_indice/
    01_padroes_loze/
    02_sagb_canonico/
    03_inventarios_tecnicos/
    04_quarentena_e_riscos/
    05_decisoes_adr/
    06_templates/
    07_validacoes/
    audits/
    implantacao_v1/
    rollbacks/
    runbooks/
    specs/
    standards/
    varios documentos .md soltos
  plan/
  pages/ components/ services/ data/ layout/
```

## 🧱 Estrutura final depois
```txt
central_padroes/
  README.md
  manifest.ts
  module-doc.ts
  routes.tsx
  docs/
    README.md
    overview/
    standards/
    plans/
    reports/
    audits/
    decisions/
    checklists/
    guides/
    templates/
    99-curadoria/
      arquivo-morto/
      legado/
      duplicados/
      fora-do-padrao/
  pages/ components/ services/ data/ layout/
```

## 📁 Pastas criadas
| Pasta | Status |
|---|---|
| docs/overview | 🟢 Criada |
| docs/plans | 🟢 Criada |
| docs/reports | 🟢 Criada |
| docs/decisions | 🟢 Criada |
| docs/checklists | 🟢 Criada |
| docs/guides | 🟢 Criada |
| docs/templates | 🟢 Criada |
| docs/99-curadoria e subpastas | 🟢 Criada |

## 🧾 Arquivos movidos
| Origem | Destino |
|---|---|
| .logs | docs/99-curadoria/legado/logs |
| .specs | docs/99-curadoria/legado/specs |
| plan/*.md | docs/plans/*.md |
| docs/00_indice | docs/99-curadoria/legado/00_indice |
| docs/01_padroes_loze | docs/99-curadoria/legado/01_padroes_loze |
| docs/02_sagb_canonico | docs/99-curadoria/legado/02_sagb_canonico |
| docs/03_inventarios_tecnicos | docs/99-curadoria/legado/03_inventarios_tecnicos |
| docs/04_quarentena_e_riscos | docs/99-curadoria/legado/04_quarentena_e_riscos |
| docs/05_decisoes_adr | docs/99-curadoria/legado/05_decisoes_adr |
| docs/06_templates | docs/99-curadoria/legado/06_templates |
| docs/07_validacoes | docs/99-curadoria/legado/07_validacoes |
| docs/implantacao_v1 | docs/99-curadoria/legado/implantacao_v1 |
| docs/rollbacks | docs/99-curadoria/legado/rollbacks |
| docs/runbooks | docs/99-curadoria/legado/runbooks |
| docs/specs | docs/99-curadoria/legado/specs |
| docs/*.md soltos | docs/99-curadoria/fora-do-padrao/ |

## 🗑️ Arquivos removidos
| Item | Motivo | Status |
|---|---|---|
| plan/ | Pasta vazia após mover documentos | 🟢 Removida |

## 🛡️ Preservados por segurança
README.md, manifest.ts, module-doc.ts, routes.tsx, pages/, components/, services/, data/, layout/, hooks/, integration/, scripts/, styles/, types/, __tests__/ e agent/ foram preservados por serem parte funcional ou apoio do módulo.

## 🟡 Riscos encontrados
| Risco | Status |
|---|---|
| Links internos podem apontar para caminhos antigos | 🟡 Atenção |
| Documentos legados podem conter conteúdo canônico reaproveitável | 🟡 Atenção |
| Possível colisão histórica de specs | 🟠 Revisar em curadoria |

## ➡️ Próximos passos
1. Revisar docs/99-curadoria/fora-do-padrao.
2. Canonizar documentos úteis para as pastas oficiais.
3. Corrigir links internos em tarefa separada.
