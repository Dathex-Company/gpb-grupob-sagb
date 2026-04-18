# Standards GrupoB

Padroes corporativos que devem ser reutilizados em todos os novos sistemas conectados ao SagB.

## Conteudo

- `design-system.md` -> fontes, cores, tokens visuais e diretrizes de interface.
- `stack-e-infra.md` -> padrao tecnico (frontend, backend, banco, deploy e CI/CD).
- `deploy-ambientes-e-esteira.md` -> padrao oficial de ambientes (local/preview/producao), fluxo de publicacao, variaveis por ambiente, checklist pos-deploy e rollback.
- `historico-e-auditoria.md` -> padrao de versionamento, dev log e rastreabilidade de mudanças (Golden Seal).

## Como usar

1. Ler estes padroes antes de iniciar qualquer novo projeto.
2. Copiar as secoes aplicaveis para o repositorio do novo sistema.
3. Registrar desvios explicitamente com justificativa tecnica.

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
