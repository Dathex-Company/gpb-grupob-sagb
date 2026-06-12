# Central de Padrões | Loze Docs (embrião oficial)

Este diretório é a **base documental canônica** da Loze dentro do SagB by Loze.

## O que é esta Central

- **Definido:** Central de Padrões é o cérebro documental oficial do ecossistema técnico.
- **Definido:** Loze Docs é a camada de organização desses padrões e documentos canônicos.
- **Em validação:** nome final de branding público entre "Central de Padrões" e "Loze Docs".

## Relação entre tipos de documento

- **Padrão canônico:** regra estrutural de tecnologia e organização (fica centralizado aqui).
- **Documentação de módulo:** contexto, limites e evidências de um módulo específico (fica no próprio módulo e referenciado aqui).
- **Inventário técnico:** mapeamento de ativos (tabelas, functions, integrações etc.).
- **ADR:** decisão estrutural registrada com contexto e impacto.
- **Validação:** revisão crítica de etapa antes de avançar.

## Frase-guia (obrigatória)

**Padrão fica centralizado.  
Execução fica no módulo.  
Evidência fica no módulo.  
Decisão estrutural vira ADR.**

## Navegação por pastas

```text
docs/
├── _readme.md
├── 00_indice/
├── 01_padroes_loze/
├── 02_sagb_canonico/
├── 03_inventarios_tecnicos/
├── 04_quarentena_e_riscos/
├── 05_decisoes_adr/
├── 06_templates/
└── 07_validacoes/
```

## Documentos já existentes (legado + canônico inicial)

- `design-system.md` (legado útil)
- `stack-e-infra.md` (legado útil)
- `deploy-ambientes-e-esteira.md` (legado útil)
- `loze-docs-indice-canonico-sagb.md` (canônico inicial ET-02)
- `matriz-canonica-modulos-sagb.md` (canônico inicial ET-02)
- `matriz-rotas-tabs-sagb.md` (canônico inicial ET-02)
- `inventario-supabase-sagb.md` (inventário inicial ET-02)
- `inventario-netlify-functions-sagb.md` (inventário inicial ET-02)
- `arquitetura-modulos-plugaveis-sagb.md` (canônico LOZE-DEV inicial)
- `modelo-module-doc-loze-das.md` (template LOZE-DAS inicial)
- `QUARENTENA_TECNICA.md` (controle de risco ET-02)
- `decisoes-para-adr-et-02.md` (backlog ADR ET-02)
- `validacao-et-02.md` (validação crítica ET-02)

## Status documental

- **Definido:** base ET-02 está registrada e validada para avanço com complementos.
- **Em validação:** granularidade de inventários técnicos (Supabase/Functions).
- **Sugestão:** consolidar toda navegação a partir de `00_indice/`.
- **Dúvida:** nomenclatura pública final e política completa de precedência.
- **Legado:** documentos antigos continuam válidos como histórico técnico.
- **Pendente de decisão:** regra final de oficialização de templates e ADR workflow.

## Regras de não duplicação e precedência

1. Não duplicar padrão em múltiplos arquivos com conteúdos conflitantes.
2. Quando houver conflito, prevalece:
   - ADR aprovado > padrão canônico > validação > documento legado.
3. Se a regra ainda não estiver aprovada em ADR, marcar como **em validação**.
4. Sem remoção de legado nesta etapa; apenas organizar e referenciar.

---

## 🔒 Protocolo de Histórico Sistêmico (Dathex/GrupoB)

Todo projeto corporativo do GrupoB DEVE manter uma fonte dupla de histórico auditável, garantida de forma automatizada.

### 1. As duas fontes oficiais
* **`DEV_LOG.md`** na raiz do projeto: changelog executivo focado no impacto de negócio e na evolução das versões (visão Macro).
* **`docs/modular-map/HISTORICO_MODULOS.md`**: log detalhado focado em arquivos modificados, módulos afetados e tipos de alteração (visão Micro).

### 2. Definition of Done (DoD)
Nenhuma PR ou commit que altere `components/`, `services/`, banco de dados, ou arquivos de entrada deve ser fechado sem registrar a mudança em ao menos um dos arquivos de histórico.

### 3. Automação e Auditoria
O repositório está blindado por automações que impedem esquecimento:
* **Script local (`tools/check-history.mjs`)**: lê o `git diff --cached` no pre-commit e recusa o commit se detectar alterações nos diretórios core sem atualização nos arquivos de histórico.
* **Husky (`.husky/pre-commit`)**: trava o desenvolvedor localmente se não obedecer a regra.
* **GitHub Actions (`.github/workflows/history-check.yml`)**: último gatekeeper em CI/CD. Trava Pull Requests não aderentes ao protocolo.

**Template obrigatório para entrada no histórico:**
- Data (ex: 2026-03-21)
- Módulo / Contexto (ex: 05-cadastro-e-dna-de-agentes)
- Mudança (descrição direta do que foi feito e por que)
- Tipo (`ui`, `fluxo`, `dados`, `correcao`, `arquitetura`)
- Arquivos/tabelas afetados (ex: `components/AgentFactory.tsx`, tabela `agents`)
- Status (`concluido`, `em andamento`)
