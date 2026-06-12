# SagB | Central de Padrões | Auditoria Documental, Técnica e Arquitetural | 31-05-2026

> **Frase-guia obrigatória:** Antes de construir, verificar o que já existe. Antes de criar módulo novo, consultar a Biblioteca de Módulos Base. Antes de oficializar padrão, passar pela Central de Padrões.

---

## 1. Objetivo da auditoria

Produzir diagnóstico completo e comparável entre IAs sobre a Central de Padrões do SagB, cobrindo três camadas:

1. **Auditoria documental** — todo o material das pastas indicadas.
2. **Auditoria técnica** — o módulo como existe hoje no código.
3. **Auditoria arquitetural** — proposta de evolução para portal vivo de governança.

**Não implementar nada nesta etapa.** Nenhum código, migration, tabela, bucket, componente, rota, commit, push ou deploy deve ser alterado.

---

## 2. Escopo recebido

- `Z:\00_sagb\src\modules\central_padroes`
- `Z:\01_empresasb\grupob\central_de_padroes\02_documentos_atuais`

Mais rastreamento obrigatório de: migrations Supabase, funções Netlify, registros de módulo, services de governança, agent docs e qualquer artefato de Storage.

---

## 3. Caminhos analisados

| # | Caminho | Existe? | Conteúdo |
|---|---------|---------|----------|
| 1 | `Z:\00_sagb\src\modules\central_padroes` | ✅ Sim | 68 entradas (48 .md, 4 .ts, 3 .tsx, 13 diretórios) |
| 2 | `Z:\00_sagb\src\modules\central_padroes\pages` | ✅ Sim | 1 arquivo: CentralPadroesPage.tsx |
| 3 | `Z:\00_sagb\src\modules\central_padroes\layout` | ✅ Sim | 1 arquivo: CentralPadroesLayout.tsx |
| 4 | `Z:\00_sagb\src\modules\central_padroes\services` | ✅ Sim | 1 arquivo: governanceRulesService.ts |
| 5 | `Z:\00_sagb\src\modules\central_padroes\components` | ❌ Não | Diretório não existe |
| 6 | `Z:\00_sagb\src\modules\central_padroes\hooks` | ❌ Não | Diretório não existe |
| 7 | `Z:\00_sagb\src\modules\central_padroes\types` | ❌ Não | Diretório não existe |
| 8 | `Z:\00_sagb\src\modules\central_padroes\store` | ❌ Não | Diretório não existe |
| 9 | `Z:\00_sagb\src\modules\central_padroes\docs` | ✅ Sim | 48 arquivos .md (subpastas 00-07) |
| 10 | `Z:\00_sagb\src\modules\central_padroes\agent` | ✅ Sim | 4 arquivos (persona, prompt, falas, session_log) |
| 11 | `Z:\01_empresasb\grupob\central_de_padroes\02_documentos_atuais` | ✅ Sim | 13 entradas (12 .md + diretório v1) |
| 12 | `Z:\00_sagb\supabase\migrations` | ✅ Sim | governance_rules migration presente |
| 13 | `Z:\00_sagb\netlify\functions` | ✅ Sim | governance-sync-doc.mjs presente |
| 14 | `Z:\00_sagb\src\core\modules` | ✅ Sim | moduleRegistry.ts + module.types.ts |
| 15 | `Z:\00_sagb\services` | ✅ Sim | supabase.ts (restFetch, auth) |

---

## 4. Caminhos não encontrados ou inacessíveis

| Caminho esperado | Status | Observação |
|---|---|---|
| `netlify/functions/governance-sync-doc.ts` | ❌ Inexistente | Equivalente `.mjs` encontrado em produção |
| `src/modules/central_padroes/components` | ❌ Inexistente | Será necessário criar para evolução futura |
| `src/modules/central_padroes/hooks` | ❌ Inexistente | Hooks estão inline na página |
| `src/modules/central_padroes/types` | ❌ Inexistente | Types definidos no próprio service |
| `src/modules/central_padroes/store` | ❌ Inexistente | Sem estado global dedicado |

---

## 5. Metodologia da análise

A análise foi conduzida em 25 fases lógicas, combinando:

1. **Varredura estrutural**: `dir /s` e `Get-ChildItem -Recurse` para inventário completo.
2. **Leitura dirigida**: arquivos-chave abertos com `read_file` para inspeção de conteúdo.
3. **Rastreamento de dependências**: busca de referências cruzadas entre módulos, services, migrations e funções serverless.
4. **Análise do artefato documental**: extração de headings e trechos estruturais dos 12 docs v1 via PowerShell e filtragem.
5. **Separação rigorosa** entre:
   - **Fato** (observado diretamente no código/arquivo)
   - **Inferência** (conclusão lógica baseada em evidências observadas)
   - **Recomendação** (proposição para etapa futura)
6. **Validação mínima**: `npm run dev` executado para verificar estado atual de compilação.

---

## 6. Inventário geral de arquivos encontrados

### 6.1 Módulo Central de Padrões (68 entradas)

**Arquivos de código (7):**

| Arquivo | Tipo | Tamanho aprox. | Função |
|---------|------|----------------|--------|
| `manifest.ts` | TypeScript | 16 linhas | Contrato do módulo (id, rota, owner) |
| `module-doc.ts` | TypeScript | 26 linhas | Propósito, boundaries, integrações |
| `routes.tsx` | TSX | 8 linhas | Rota `/central_padroes/*` |
| `index.ts` | TypeScript | 3 linhas | Barrel exports |
| `layout/CentralPadroesLayout.tsx` | TSX | 121 linhas | Layout com sidebar |
| `pages/CentralPadroesPage.tsx` | TSX | 310 linhas | Página principal com CRUD de regras |
| `services/governanceRulesService.ts` | TypeScript | 120 linhas | Service Supabase + lógica de governança |

**Documentos do módulo (48):**

| Subpasta | Qtde | Temas |
|----------|------|-------|
| `docs/` (raiz) | 15 | Design system, stack, deploy, supabase, ADR, validações |
| `docs/00_indice` | 2 | Mapa geral, auditoria de estrutura |
| `docs/01_padroes_loze` | 5 | Loze mestre, governança, OPP, matriz, revisão |
| `docs/02_sagb_canonico` | 1 | README |
| `docs/03_inventarios_tecnicos` | 1 | README |
| `docs/04_quarentena_e_riscos` | 1 | README (quarentena técnica) |
| `docs/05_decisoes_adr` | 9 | ADRs 001-008 + decisões pendentes + matriz |
| `docs/06_templates` | 1 | README |
| `docs/07_validacoes` | 4 | Validações ET-03 (base, ADRs, pendentes) |
| `agent/` | 4 | Persona, prompt, falas, session_log |

**Arquivos de governança (3):**

| Arquivo | Função |
|---------|--------|
| `README.md` | Visão geral e instruções de uso |
| `DECISIONS.md` | Registro de decisões estruturais (13 registros) |
| `PLANNED.md` | Plano de evolução em fases |
| `CHANGELOG.md` | Histórico de versões |

### 6.2 Pasta documental externa (13 entradas)

| Arquivo | Responsável | Domínio |
|---------|-------------|---------|
| `00_pietro_carboni_...v1.0.md` | Pietro Carboni | Governança geral / curadoria normativa |
| `01_savio_codare_...v1.0.md` | Sávio Codare | Sistemas, arquitetura técnica, programação |
| `02_alice_montini_...v1.0.md` | Alice Montini | UX/UI, experiência, interface |
| `03_pedro_gazan_...v1.0.md` | Pedro Gazan | Segurança digital, risco, proteção |
| `04_pierre_zanulli_...v1.0.md` | Pierre Zanulli | Agentes autônomos, IA, orquestração |
| `05_klaus_wagen_...v1.0.md` | Klaus Wagen | Modelos de IA, RAI, radar tecnológico |
| `06_yuri_sague_...v1.0.md` | Yuri Sague | Processos, execução, registros, TaskZei |
| `07_noah_verdili_...v1.0.md` | Noah Verdili | Naming, disponibilidade, banco de marcas |
| `08_dante_montoya_...v1.0.md` | Dante Montoya | Exploração, classificação inicial de ideias |
| `09_nilo_barret_...v1.0.md` | Nilo Barret | Metodologias, frameworks, estruturas intelectuais |
| `10_julio_mosqueira_...v1.0.md` | Júlio Mosqueira | AcadB, mentorias, cursos, trilhas |
| `11_cesar_tulli_...v1.0.md` | César Tulli | Negócios, ventures, planos |

---

## 7. Classificação dos documentos encontrados (30 categorias)

| # | Categoria | Documentos encontrados | Observação |
|---|-----------|----------------------|------------|
| 1 | Padrões técnicos | `stack-e-infra.md`, `arquitetura-modulos-plugaveis-sagb.md`, `01_savio_codare` | Forte candidato a entidade estruturada |
| 2 | Padrões visuais/UI/UX | `design-system.md`, `02_alice_montini` | Referência de design tokens |
| 3 | Padrões de módulos plugáveis | `arquitetura-modulos-plugaveis-sagb.md`, `modelo-module-doc-loze-das.md` | Documentação madura |
| 4 | Padrões de módulos base | Não encontrado explicitamente | **Lacuna** — não há documento mapeando módulos base |
| 5 | Padrões de governança | `00_pietro_carboni`, `loze_gov_governanca_dos_padroes.md`, ADRs | Material canônico |
| 6 | Padrões de documentação | `_readme.md`, `modelo-module-doc`, `matriz-canonica-modulos` | Template e índices |
| 7 | Padrões de Supabase | `inventario-supabase-sagb.md`, migration `governance_rules_phase1` | Opera em produção |
| 8 | Padrões de Netlify/deploy | `deploy-ambientes-e-esteira.md`, `inventario-netlify-functions-sagb.md` | Documentação presente |
| 9 | Padrões de GitHub/repositório | `ADR-005-github-fonte-tecnica-oficial.md` | Referenciado em ADR |
| 10 | Padrões de agentes | `agent/persona.md`, `agent/prompt_ativacao_cline.md`, `04_pierre_zanulli` | Persona e prompt definidos |
| 11 | Padrões de IA/modelos/RAI | `05_klaus_wagen`, `02_rai_core.sql` | Material em evolução |
| 12 | Padrões de segurança | `03_pedro_gazan`, ADRs relacionados | Esboço de protocolos |
| 13 | Padrões de permissões/acessos | Não encontrado explicitamente | **Lacuna** — política de acesso não documentada |
| 14 | Padrões de arquitetura | `00_pietro_carboni` (mestra), `arquitetura-modulos-plugaveis` | Eixo central do módulo |
| 15 | Padrões de nomenclatura/naming | `07_noah_verdili`, `loze_opp_organizacao_pastas` | Domínio específico |
| 16 | Padrões de metodologias/frameworks | `09_nilo_barret`, `metodologias` (várias migrations) | Bloco independente |
| 17 | Padrões de produtos/ventures | `11_cesar_tulli`, ventures (migration/seed) | Relacionado a StartyB |
| 18 | Padrões de AcadB/cursos/trilhas | `10_julio_mosqueira`, `create_mentorias_tables` | AcadB como entidade |
| 19 | Documentos canônicos | `README`, `DECISIONS.md`, `PLANNED.md`, `00_pietro_carboni`, ADRs 001-008 | **Fortes candidatos** |
| 20 | Documentos em revisão | `validacao_et_03*`, `revisao_04_padroes_tecnicos` | Status intermediário |
| 21 | Documentos brutos | Docs v1 (auditorias de missão) | Material de consolidação |
| 22 | Documentos duplicados | Potencial entre revisões e matrizes | **Inferência** — requer detecção semântica |
| 23 | Documentos legados | `QUARENTENA_TECNICA.md`, revisões antigas | Marcar após curadoria |
| 24 | Documentos que viram padrão oficial | Blocos v1 (12), `stack-e-infra`, `design-system` | **Recomendação** |
| 25 | Documentos para arquivo morto | Nada identificado como descartável | Manter quarentena |
| 26 | Documentos a dividir | `00_pietro_carboni` (muito denso) | Separar em vários padrões |
| 27 | Documentos a consolidar | ADRs + `DECISIONS.md` + `decisoes_para_adr` | Unificar trilha decisória |
| 28 | Risco de conflito | Sobreposição entre docs v1 e docs do módulo | Cruzar após classificação |
| 29 | Valor para agentes | ADRs, regras obrigatórias, checklists | Permitir consumo controlado |
| 30 | Valor para programadores | Stack, deploy, supabase, padrão de módulo | Alto valor prático |

---

## 8. Documentos canônicos identificados

**Fato (classificação baseada em conteúdo e posicionamento)**

1. **`README.md`** — Documento de entrada do módulo. Posiciona a Central como "fonte única da verdade".
2. **`DECISIONS.md`** — 13 decisões registradas com data, descrição e motivo. Trilha auditável.
3. **`PLANNED.md`** — Plano de evolução com fases e entregas. Norte arquitetural.
4. **`00_pietro_carboni_...v1.0.md`** — Arquitetura mestra e governança. Define papéis, taxonomia e regras centrais.
5. **ADRs 001-008** — Decisões arquiteturais registradas no formato ADR. Padrão maduro.
6. **`design-system.md`** — Referência de tokens visuais.
7. **`stack-e-infra.md`** — Padrão técnico fundamental.
8. **`matriz-canonica-modulos-sagb.md`** — Visão macro do ecossistema de módulos.

---

## 9. Documentos brutos identificados

**Inferência**

Os 12 documentos da pasta v1 (`01_savio` a `11_cesar`) são auditorias de missão com estrutura comum:
- objetivo da auditoria
- escopo / fora de escopo
- lacunas identificadas
- riscos
- documentos derivados propostos
- versão revisada

**Status provável**: material de consolidação para conversão em objetos normativos. Ainda não são padrões oficiais — são diagnósticos que apontam **o que precisa virar padrão**.

---

## 10. Documentos duplicados ou semelhantes

**Inferência**

Possíveis sobreposições identificadas:

| Documento A | Documento B | Risco de duplicidade |
|-------------|-------------|---------------------|
| `README.md` (módulo) | `_readme.md` (docs/) | Parcial. Um é visão geral, outro é índice de docs |
| `decisoes-para-adr-et-02.md` | `DECISIONS.md` | Alto. Ambos registram decisões |
| `decisoes_para_adr_et_03.md` | `decisoes-para-adr-et-02.md` | Provável continuidade |
| `validacao_et_02.md` | `validacao_et_03*.md` | Evolução cronológica |
| `matriz_onde_mora.md` | `matriz-canonica-modulos-sagb.md` | Médio. Matrizes diferentes mas sobreponíveis |
| `loze_gov_governanca_dos_padroes.md` | `00_pietro_carboni` (v1) | Alto. Ambos tratam de governança de padrões |

**Recomendação**: incluir detector de duplicidade semântica como requisito futuro (Fase 8).

---

## 11. Documentos legados ou possivelmente obsoletos

**Inferência**

| Documento | Suspeita |
|-----------|----------|
| `QUARENTENA_TECNICA.md` | Conteúdo sob suspeita técnica; manter como quarentena |
| `deploy-ambientes-e-esteira.md` | Pode estar desatualizado vs. Netlify atual |
| `revisao_04_padroes_tecnicos_loze_grupob.md` | Revisão anterior, pode estar substituída |
| `validacao_et_02.md` | Substituída por `validacao_et_03*` |

**Recomendação**: marcar status `legado` ou `substituído_por` após curadoria manual.

---

## 12. Documentos que deveriam virar padrões oficiais

**Recomendação (prioridade decrescente)**

| Documento | Justificativa |
|-----------|---------------|
| `00_pietro_carboni` (v1) | Arquitetura mestra — deve virar padrão fundacional |
| `stack-e-infra.md` | Padrão técnico de stack |
| `design-system.md` | Padrão visual de tokens |
| `arquitetura-modulos-plugaveis-sagb.md` | Padrão de construção de módulos |
| `01_savio_codare` (v1) | Padrão de sistemas/programação |
| `03_pedro_gazan` (v1) | Padrão de segurança |
| `04_pierre_zanulli` (v1) | Padrão de agentes |
| `05_klaus_wagen` (v1) | Padrão de modelos/RAI |
| `06_yuri_sague` (v1) | Padrão de processos/TaskZei |
| `07_noah_verdili` (v1) | Padrão de naming |
| `08_dante_montoya` (v1) | Padrão de exploração de ideias |
| `09_nilo_barret` (v1) | Padrão de metodologias |
| `10_julio_mosqueira` (v1) | Padrão de AcadB |
| `11_cesar_tulli` (v1) | Padrão de ventures |

---

## 13. Documentos que deveriam virar checklists, matrizes ou registros

**Recomendação**

**Checklists obrigatórios:**
- Checklist para criação de novo módulo
- Checklist para criação de nova tabela Supabase
- Checklist para criação de nova API
- Checklist para deploy
- Checklist para criação de agente técnico
- Checklist para criação de integração
- Checklist para refatoração de legado

**Matrizes obrigatórias:**
- Matriz padrão ↔ módulo (qual módulo segue qual padrão)
- Matriz padrão ↔ agente (qual agente pode consultar qual padrão)
- Matriz risco ↔ impacto (classificação de risco por domínio)
- Matriz domínio ↔ responsável (quem é dono de cada área)
- Matriz dependência entre padrões (qual padrão depende de outro)

**Registros obrigatórios:**
- Registro de exceção (desvio de padrão com justificativa)
- Registro de evidência (comprovação de conformidade)
- Registro de aprovação (quem aprovou, quando, qual versão)
- Registro de substituição (padrão A substituído por padrão B)

---

## 14. Leitura por domínio/responsável (12 blocos)

### 14.1 Pietro Carboni — Governança geral / curadoria normativa

**Documentos**: `00_pietro_carboni_...v1.0.md`
**Papel**: Guardião dos Padrões. Consolida, classifica, cruza dependências, aprova.
**O que está claro**: taxonomia normativa (princípio → registro), regra central do Pietro, o que ele não faz.
**Lacunas**: como a aprovação acontece na prática; critérios objetivos de "padrão aprovado".
**Dependências**: com todos os 11 domínios.
**Artefatos necessários**: matriz de aprovação, fluxo de curadoria, critérios de conflito.
**Pode virar seção própria**: sim — é a seção "Arquitetura Mestra".
**Pode virar entidade estruturada**: sim — tabela `standard_approvals` ou similar.

### 14.2 Sávio Codare — Sistemas / arquitetura / programação

**Documentos**: `01_savio_codare_...v1.0.md`
**Papel**: Dono técnico do bloco de sistemas.
**Escopo**: arquitetura, repositórios, APIs, Supabase, deploy, logs, migração.
**O que está claro**: estrutura de pastas técnicas, stacks, padrões de código.
**Lacunas**: checklist de criação de tabela/módulo/API não formalizado no runtime.
**Dependências**: Alice (UX), Pedro Gazan (segurança), Pierre (agentes), Klaus (modelos).
**Riscos**: duplicidade de padrão técnico entre docs e código.
**Pode virar entidade**: sim — `standards` com domain=`sistemas`.

### 14.3 Alice Montini — UX/UI / design / experiência

**Documentos**: `02_alice_montini_...v1.0.md`
**Papel**: Dono de UX/UI.
**Escopo**: design system, tokens, componentes, fluxos de usuário.
**O que está claro**: Alice UI Standard referenciada.
**Lacunas**: relação entre design system e Central de Padrões ainda não formalizada em entidade.
**Conflitos**: com Nilo (metodologias) sobre frameworks conceituais de UX.
**Dependências**: Sávio (implementação técnica), Pedro Gazan (segurança de UI).

### 14.4 Pedro Gazan — Segurança / acessos / riscos

**Documentos**: `03_pedro_gazan_...v1.0.md`
**Papel**: Dono de segurança digital.
**Escopo**: risco, proteção, acessos, RAI, privacidade.
**O que está claro**: estrutura de riscos e controles.
**Lacunas**: política de permissões da Central de Padrões não documentada.
**Dependências**: Klaus (RAI), Pierre (agentes), Sávio (segurança técnica).
**Artefatos**: matriz de risco, checklist de segurança pré-deploy.

### 14.5 Pierre Zanulli — Agentes / IA operacional / orquestração

**Documentos**: `04_pierre_zanulli_...v1.0.md`
**Papel**: Dono de agentes autônomos e orquestração.
**Escopo**: ciclo de vida de agentes, memória, ferramentas, governança.
**O que está claro**: necessidade de padronizar criação de agente.
**Lacunas**: padrão de consumo de documentos da Central por agentes.
**Dependências**: Klaus (modelos), Sávio (infra), Pedro Gazan (segurança).
**Pode virar entidade**: sim — tabela `agent_standard_permissions`.

### 14.6 Klaus Wagen — Modelos de IA / RAI / radar tecnológico

**Documentos**: `05_klaus_wagen_...v1.0.md`
**Papel**: Dono de modelos de IA, RAI e radar.
**Escopo**: avaliação de modelo, risco de fornecedor, curadoria.
**O que está claro**: estrutura de avaliação e radar.
**Lacunas**: integração com pipeline de deploy; critérios de "modelo aprovado".
**Dependências**: Pierre (agentes consomem modelos), Pedro Gazan (RAI), Sávio (infra).

### 14.7 Yuri Sague — Processos / execução / registros / TaskZei

**Documentos**: `06_yuri_sague_...v1.0.md`
**Papel**: Dono de processos e execução.
**Escopo**: separação entre decisão/tarefa/rotina/processo/protocolo.
**O que está claro**: necessidade de registros operacionais.
**Lacunas**: integração TaskZei ↔ Central de Padrões não implementada.
**Dependências**: todos os domínios (processos são transversais).

### 14.8 Noah Verdili — Naming / marcas / nomenclatura

**Documentos**: `07_noah_verdili_...v1.0.md`
**Papel**: Dono de naming e marcas.
**Escopo**: disponibilidade, banco de marcas, risco de confusão, INPI.
**O que está claro**: ciclo completo de naming.
**Lacunas**: integração com sistema de marcas externo/INPI.
**Dependências**: César (ventures/nomes de empresa), Dante (ideias precisam de nome).

### 14.9 Dante Montoya — Exploração de ideias / incubação

**Documentos**: `08_dante_montoya_...v1.0.md`
**Papel**: Dono de exploração inicial de ideias.
**Escopo**: funil de ideias, classificação, fronteira com execução.
**O que está claro**: estrutura de triagem.
**Lacunas**: fronteira com César (quando vira venture) e Nilo (metodologia aplicada).
**Dependências**: Noah (naming da ideia), César (viabilidade), Nilo (framework).

### 14.10 Nilo Barret — Metodologias / frameworks / propriedade intelectual

**Documentos**: `09_nilo_barret_...v1.0.md`
**Papel**: Dono de metodologias e frameworks.
**Escopo**: origem, autoria, uso, versão, validação intelectual.
**O que está claro**: estrutura de curadoria de metodologias.
**Lacunas**: relação com ADRs e decisões metodológicas.
**Dependências**: Dante (ideias usam metodologias), Julio (AcadB usa metodologias de ensino).

### 14.11 Júlio Mosqueira — AcadB / trilhas / cursos / mentorias

**Documentos**: `10_julio_mosqueira_...v1.0.md`
**Papel**: Dono da AcadB.
**Escopo**: trilhas, cursos, mentorias, certificações, jornada do aluno.
**O que está claro**: estrutura educacional completa.
**Lacunas**: padrão de conteúdo educacional vs. padrão técnico ainda não separado.
**Dependências**: Nilo (metodologias), Alice (UX educacional).

### 14.12 César Tulli — Ventures / planos de negócio / empresas B

**Documentos**: `11_cesar_tulli_...v1.0.md`
**Papel**: Dono de negócios e ventures.
**Escopo**: criação de empresas, planos de negócio, organogramas.
**O que está claro**: estrutura de ventures.
**Lacunas**: padrão de integração ventures ↔ Loze ↔ SagB.
**Dependências**: Dante (ideia → venture), Noah (naming da venture).

---

## 15. Taxonomia normativa recomendada

### 15.1 Definição de cada tipo

| Tipo | Quando usar | Quando NÃO usar | Exemplo encontrado | Precisa de entidade? | Versionamento? | Aprovação? | Responsável? |
|------|-------------|-----------------|-------------------|---------------------|---------------|------------|--------------|
| **Princípio** | Diretriz imutável do ecossistema | Para regras operacionais | "Antes de construir, verificar o que já existe" | Sim (tabela `standards`) | Sim | Sim (guardião) | Pietro |
| **Política** | Decisão de alto nível com impacto amplo | Para procedimentos específicos | "Documento sensível não pode ser público" | Sim | Sim | Sim (guardião) | Pietro/área |
| **Regra** | Comportamento obrigatório com verificação | Para orientações | "Padrão canônico exige aprovação" | Sim | Sim | Sim (guardião) | Área |
| **Padrão** | Especificação técnica ou de processo | Para registros de exceção | `stack-e-infra.md` | Sim | Sim | Sim (responsável área) | Sávio |
| **Protocolo** | Sequência obrigatória de ações | Para listas de verificação | Protocolo de segurança de deploy | Sim | Sim | Sim | Pedro Gazan |
| **Processo** | Fluxo definido com atores e gates | Para padrões técnicos | Fluxo de criação de padrão | Sim | Sim | Sim (guardião) | Yuri |
| **Procedimento** | Instrução passo a passo operacional | Para princípios | "Como criar tabela Supabase" | Pode ser markdown | Sim | Não | Área |
| **Checklist** | Lista de verificação antes de ação | Para documentação explicativa | Checklist pré-deploy | Sim (tabela `checklists`) | Sim | Não | Área |
| **Matriz** | Relacionamento entre duas ou mais dimensões | Para textos corridos | Matriz módulo ↔ padrão | Sim (JSONB ou tabela) | Sim | Não | Guardião |
| **Registro** | Evidência de que algo aconteceu | Para regras | Registro de aprovação | Sim (tabela `evidence_records`) | Não | N/A | Auditor |
| **Decisão** | Escolha registrada com rationale | Para especificações | ADR-001 a ADR-008 | Sim (tabela `decisions`) | Sim | Sim | Responsável |
| **Exceção** | Desvio autorizado de padrão | Para regras gerais | Exceção de segurança para MVP | Sim (tabela `exceptions`) | Sim | Sim (guardião) | Solicitante |
| **Evidência** | Comprovação de conformidade | Para decisões | Screenshot de auditoria | Sim (Storage + tabela) | Não | N/A | Auditor |
| **Template** | Estrutura reutilizável | Para conteúdo preenchido | `modelo-module-doc-loze-das.md` | Pode ser markdown | Sim | Não | Área |
| **Guia** | Orientação não normativa | Para regras obrigatórias | "Como contribuir com padrões" | Pode ser markdown | Não | Não | Qualquer |
| **Manual** | Documento completo de referência | Para checklists | Manual de operação da Central | Pode ser markdown | Sim | Sim (guardião) | Pietro |
| **Doc. técnica** | Especificação de sistema/API | Para governança | `inventario-supabase-sagb.md` | Pode ser markdown | Sim | Não | Sávio |
| **Doc. externa** | Material para público externo | Para docs internos | Guia de contribuição aberto | Pode ser markdown | Sim | Sim (segurança) | Guardião |
| **Prompt canônico** | Template de prompt validado | Para prompts experimentais | `agent/prompt_ativacao_cline.md` | Sim (tabela + Storage) | Sim | Sim (guardião) | Pierre |
| **Contrato de módulo** | Contrato técnico do módulo | Para documentação geral | `manifest.ts` + `module-doc.ts` | Sim (tabela `module_manifests`) | Sim | Sim (arquitetura) | Sávio |
| **Contrato de agente** | Limites e capacidades do agente | Para agentes experimentais | `agent/persona.md` | Sim (tabela + Storage) | Sim | Sim (guardião) | Pierre |

### 15.2 Regra geral de classificação

- Itens com **impacto de execução e conformidade** → entidade própria no banco + versionamento + aprovação.
- Itens de **apoio operacional** → markdown versionado pode bastar.
- Itens de **consulta rápida** → markdown simples sem versionamento.

---

## 16. Estado atual do módulo Central de Padrões

**Fato**

O módulo está operacional com:
- Módulo registrado no `moduleRegistry` como `centralPadroesManifest`
- Owner: agente Zico Padron
- Rota: `/central_padroes/*`
- Layout: sidebar minimalista com 1 view ("Visão Geral")
- Página principal: cards de status + lista de regras por domínio + editor markdown + preview + publicar
- Service: `governanceRulesService` com ciclo draft/publish/sync
- Supabase como source-of-truth

**Limitação atual**: o módulo funciona como um CRUD de regras genéricas, não como portal de governança com taxonomia, busca, filtros, relações ou approval flow.

---

## 17. Arquivos de código encontrados no módulo

| Arquivo | Localização | Linhas | Função |
|---------|------------|--------|--------|
| `manifest.ts` | Raiz do módulo | 16 | Contrato do módulo |
| `module-doc.ts` | Raiz do módulo | 26 | Propósito e boundaries |
| `routes.tsx` | Raiz do módulo | 8 | Rota pública |
| `index.ts` | Raiz do módulo | 3 | Barrel exports |
| `CentralPadroesLayout.tsx` | `layout/` | 121 | Layout com sidebar |
| `CentralPadroesPage.tsx` | `pages/` | 310 | Página principal |
| `governanceRulesService.ts` | `services/` | 120 | Lógica de governança |

**Não encontrados**: `components/`, `hooks/`, `types/`, `store/` — estruturas para criação futura.

---

## 18. Rotas, páginas e componentes atuais

**Fato**

- **Rota**: `/central_padroes/*` (definida em `routes.tsx`)
- **Layout**: [`CentralPadroesLayout`](Z:/00_sagb/src/modules/central_padroes/layout/CentralPadroesLayout.tsx:1)
  - Sidebar com logo "CP", nome "Central de Padrões", subtítulo "robust clean"
  - Navegação: única view "Visão Geral"
  - Botão "Voltar ao SagB"
  - Uso de tokens CSS (`--sagb-primary`, `--sagb-line`, `--sagb-surface`, etc.)
- **Página**: [`CentralPadroesPage`](Z:/00_sagb/src/modules/central_padroes/pages/CentralPadroesPage.tsx:12)
  - Header com título e owner
  - Seção de responsabilidade/objetivo
  - Cards de status (total, synced, failed, pending)
  - Lista de regras por domínio (normas, operacional, templates)
  - Modal de editor markdown + preview + salvar/publicar
  - Loading/falha tratados

**Limitação**: única view, sem subpáginas, sem busca, sem filtros, sem tags.

---

## 19. Services, hooks, types e stores atuais

**Fato**

**Services**:
- `governanceRulesService.ts` — único service do módulo
- `restFetch` importado de `services/supabase.ts`
- `auth` importado de `services/supabase.ts`

**Hooks**: nenhum custom hook encontrado. Estado gerido com `useState` e `useEffect` diretamente na página.

**Types**: definidos inline no service:
- `GovernanceRuleDomain` — `'normas' | 'operacional' | 'templates' | string`
- `GovernanceRuleSyncStatus` — `'pending' | 'synced' | 'failed'`
- `GovernanceRule` — interface completa com 15 campos

**Store**: nenhum contexto ou store global encontrado.

---

## 20. Análise específica do governanceRulesService

### 20.1 O que existe

**Fato observado diretamente no código:**

| Característica | Existe? | Detalhe |
|---|---|---|
| `GovernanceRule` | ✅ Sim | Interface com 15 campos |
| `GovernanceRuleDomain` | ✅ Sim | `'normas' \| 'operacional' \| 'templates' \| string` |
| `GovernanceRuleSyncStatus` | ✅ Sim | `'pending' \| 'synced' \| 'failed'` |
| `listGovernanceRules()` | ✅ Sim | GET em `governance_rules` com ordenação |
| `saveGovernanceRuleDraft()` | ✅ Sim | PATCH com checksum SHA-256 |
| `publishGovernanceRule()` | ✅ Sim | Incrementa versão + chama sync function |
| Ciclo draft/publish/sync | ✅ Sim | Completo com validação de hash |
| Integração real Supabase | ✅ Sim | Via `restFetch` |
| Versionamento | ✅ Sim | Incremental na publicação |
| Checksum SHA-256 | ✅ Sim | Calculado no cliente e revalidado no sync |
| Controle de erro | ✅ Sim | Try/catch com feedback na UI |
| `sha256Hex()` | ✅ Sim | Função utilitária usando Crypto API |
| `currentUserLabel()` | ✅ Sim | Identifica usuário atual |

### 20.2 O que NÃO existe (lacunas)

| Característica | Existe? | Impacto |
|---|---|---|
| Taxonomia normativa explícita | ❌ Não | `domain` genérico demais |
| Owner de área formal | ❌ Não | Sem campo `area_owner` |
| Risco | ❌ Não | Sem campo `risk_level` |
| Evidência | ❌ Não | Sem campo `evidence_required` ou `evidence_schema` |
| Dependência | ❌ Não | Sem campo `dependencies` |
| Escopo / fora de escopo | ❌ Não | Sem campos `scope_in` / `scope_out` |
| Approval flow | ❌ Não | Sem estados de validação |
| Trilha de auditoria | ❌ Não | Sem tabela `audit_logs` |
| Rollback | ❌ Não | Sem mecanismo de reversão |
| Depreciação/substituição | ❌ Não | Sem campo `replaced_by` ou `deprecated_at` |
| Fallback local | ❌ Não | Sem cache ou fallback offline |
| Validação de conteúdo | ❌ Não | Apenas checksum, sem validação semântica |

### 20.3 Análise crítica: o que fazer com `governance_rules`

**Análise** (não decisão):

| Opção | Descrição | Riscos | Vantagens |
|-------|-----------|--------|-----------|
| **A. Expandir como tabela principal** | Adicionar colunas à tabela existente | Pode virar "entidade genérica demais" (risco 6) | Aproveita migration e dados existentes |
| **B. Subentidade de `standards`** | `governance_rules` como subtipo | Quebra compatibilidade | Modelo mais limpo |
| **C. Migrar para `standards`** | Nova tabela `standards`, migrar dados | Perda de dados se mal planejada | **Recomendado** se fizer transição gradual |
| **D. Manter como legado + novo schema** | Duas tabelas simultâneas | Complexidade operacional | Permite evolução sem risco |
| **E. Separar regras de governança e padrões** | Duas tabelas distintas | Pode ser prematuro | Modelo mais específico |

**Recomendação** (inferência): **Opção C — migração progressiva preservando compatibilidade**.
- Manter `governance_rules` operacional durante Fases 1-2.
- Criar `standards` paralelamente na Fase 3 com schema expandido.
- Migrar dados gradualmente na Fase 4.
- Deprecar `governance_rules` na Fase 5.

---

## 21. Análise do ciclo draft/publish/sync atual

**Fato**

### 21.1 Fluxo atual

```
[Usuário edita markdown]
        ↓
[saveGovernanceRuleDraft()] → PATCH governance_rules (sync_status = pending)
        ↓
   [Usuário clica "Publicar"]
        ↓
[publishGovernanceRule()] → PATCH (version+1, source_of_truth='supabase', sync_status='pending')
        ↓
[POST /.netlify/functions/governance-sync-doc] → lê regra, valida path, escreve .md, atualiza status
        ↓
[refreshRules()] → reload da lista com status atualizado
```

### 21.2 Função de sync ([`governance-sync-doc.mjs`](Z:/00_sagb/netlify/functions/governance-sync-doc.mjs:1))

**Fato:**
- Cria cliente Supabase admin com `SUPABASE_SERVICE_ROLE_KEY`
- Valida `sync_target_path` (deve iniciar com `docs/governanca_sagb/` e terminar com `.md`)
- Bloqueia path traversal (`..`)
- Escrita em arquivo físico + verificação de hash pós-escrita
- Atualiza `sync_status` para `synced` ou `failed`

**Limitações:**
- Path fixo para `docs/governanca_sagb/`. Sem flexibilidade para outros destinos.
- Sem rollback se a escrita falhar.
- Sem validação de conteúdo além de hash.
- Sem notificação de falha além do campo `last_sync_error`.

---

## 22. Tabelas Supabase atualmente utilizadas

**Fato direto**

### 22.1 Migration atual

`20260505160001_governance_rules_phase1.sql`:

```sql
create table public.governance_rules (
  id uuid primary key default gen_random_uuid(),
  rule_key text not null unique,
  domain text not null,
  title text not null,
  content_md text not null,
  version int not null default 1,
  checksum_sha256 text not null,
  source_of_truth text not null default 'supabase',
  sync_target_path text not null,
  sync_status text not null default 'pending' check (sync_status in ('pending','synced','failed')),
  last_sync_error text null,
  updated_by text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**Políticas RLS**: leitura e escrita para `authenticated`.

**Índices**: `rule_key`, `domain`, `sync_status`.

### 22.2 Avaliação conceitual das 42 tabelas sugeridas

| Grupo | Já existe? | Necessário? | Prioridade | Risco |
|-------|-----------|-------------|------------|-------|
| `standards` | Não (parcial: governance_rules) | Sim | Fase 3 | Superar governance_rules |
| `standard_versions` | Não | Sim | Fase 3 | Version tracking |
| `standard_types` | Não | Sim (como enum) | Fase 2 | Pode ser enum no schema |
| `standard_statuses` | Não | Sim | Fase 2 | Pode ser enum |
| `standard_areas` | Não | Sim | Fase 2 | Pode ser tabela de lookup |
| `standard_tags` | Não | Futuro | Fase 5 | Pode ser JSONB |
| `standard_dependencies` | Não | Sim | Fase 3 | Essencial para grafo |
| `standard_relationships` | Não | Futuro | Fase 5 | Similar a dependências |
| `documents` | Não | Sim | Fase 3 | Ciclo de vida documental |
| `document_versions` | Não | Sim | Fase 3 | Version tracking |
| `document_sources` | Não | Futuro | Fase 5 | Fonte do documento |
| `document_statuses` | Não | Sim (enum) | Fase 2 | Canônico/rascunho/legado |
| `document_attachments` | Não | Futuro | Fase 6 | Storage reference |
| `document_publications` | Não | Futuro | Fase 7 | Publicação externa |
| `decisions` | Não (parcial: ADRs em markdown) | Sim | Fase 3 | Decisões estruturadas |
| `decision_impacts` | Não | Futuro | Fase 5 | Impacto da decisão |
| `change_requests` | Não | Futuro | Fase 6 | Solicitação de mudança |
| `approval_requests` | Não | Sim | Fase 4 | Workflow de aprovação |
| `exceptions` | Não | Sim | Fase 4 | Desvio autorizado |
| `audit_logs` | Não | Sim | Fase 5 | Trilha de auditoria |
| `evidence_records` | Não | Sim | Fase 5 | Evidência de conformidade |
| `checklists` | Não | Sim | Fase 3 | Template de checklist |
| `checklist_items` | Não | Sim | Fase 3 | Itens do checklist |
| `checklist_runs` | Não | Futuro | Fase 5 | Execução de checklist |
| `checklist_run_items` | Não | Futuro | Fase 5 | Status por item |
| `audits` | Não | Futuro | Fase 6 | Auditoria formal |
| `audit_findings` | Não | Futuro | Fase 6 | Achados de auditoria |
| `base_modules` | Não | Sim | Fase 3 | Catálogo de módulos |
| `module_versions` | Não | Sim | Fase 3 | Version tracking |
| `module_manifests` | Não (parcial: `manifest.ts`) | Sim | Fase 3 | Contrato do módulo |
| `module_dependencies` | Não | Sim | Fase 3 | Dependências |
| `module_standard_links` | Não | Sim | Fase 4 | Padrão ↔ módulo |
| `module_usage` | Não | Futuro | Fase 6 | Uso/adoção |
| `module_statuses` | Não | Sim (enum) | Fase 2 | Ativo/em manutenção/deprecado |
| `ingestion_sources` | Não | Futuro | Fase 6 | Fonte de ingestão |
| `ingestion_items` | Não | Futuro | Fase 6 | Item ingerido |
| `triage_batches` | Não | Futuro | Fase 6 | Lote de triagem |
| `triage_destinations` | Não | Futuro | Fase 6 | Destino da triagem |
| `triage_logs` | Não | Futuro | Fase 6 | Log de triagem |
| `area_members` | Não | Sim | Fase 4 | Membros por área |
| `document_access_rules` | Não | Sim | Fase 5 | Permissão documental |
| `standard_access_rules` | Não | Sim | Fase 5 | Permissão de padrão |

**Recomendação geral para schema**: começar com o **mínimo** na Fase 3 (standards, standard_versions, standard_areas, standard_dependencies, decisions, approval_requests) e escalar conforme necessidade comprovada. Evitar 42 tabelas de uma vez.

---

## 23. Buckets/Storage atualmente utilizados

**Fato**: não identificado bucket dedicado da Central de Padrões.

**Buckets existentes no ecossistema** (identificados por migrations):
- `chat_attachments` (migration `20260506000101`)
- `taskzei_documents` (migration `20260512000101`)
- `cid_storage_large_files` (migration `20260314000102`)

**Avaliação dos buckets sugeridos para a Central:**

| Bucket | Finalidade | Público? | Fase | Risco |
|--------|-----------|----------|------|-------|
| `standards-documents` | Documentos canônicos de padrões | Privado | Fase 3 | Baixo |
| `current-documents` | Documentos em edição/revisão | Privado | Fase 3 | Baixo |
| `canonical-documents` | Documentos oficiais publicados | Público (leitura) | Fase 4 | Vazamento de rascunho |
| `source-ingestion` | Documentos brutos de ingestão | Privado | Fase 5 | Médio |
| `triage-files` | Arquivos em triagem | Privado | Fase 5 | Médio |
| `archived-sources` | Fontes arquivadas | Privado | Fase 6 | Baixo |
| `public-docs` | Documentação externa | Público | Fase 7 | Alto (revisão necessária) |
| `evidence-files` | Evidências de auditoria | Privado | Fase 5 | Alto (dados sensíveis) |
| `module-manifests` | Manifests de módulos | Privado | Fase 4 | Baixo |
| `module-docs` | Docs de módulo | Privado | Fase 4 | Baixo |
| `exports` | Exportações geradas | Privado | Fase 7 | Médio |
| `images-and-diagrams` | Diagramas de arquitetura | Público (leitura) | Fase 5 | Baixo |

---

## 24. Dados mockados, locais ou reais encontrados

**Fato**
- Central de Padrões consome **Supabase real** via `restFetch`.
- Não há mock no módulo.
- Fallback: exceção capturada e exibida como feedback na UI.

**Inferência**
- Se o Supabase estiver indisponível, o módulo quebra silenciosamente (sem fallback local).

---

## 25. Fluxos atuais existentes

1. **[Carregar regras]** → `useEffect` chama `listGovernanceRules()` → popula estado
2. **[Selecionar regra]** → clique no card → `openDoc()` → popula `selectedDoc` + `editorContent`
3. **[Editar markdown]** → altera `editorContent` via textarea
4. **[Salvar rascunho]** → `saveGovernanceRuleDraft()` → PATCH no Supabase → `refreshRules()`
5. **[Publicar]** → `publishGovernanceRule()` → PATCH + chamada sync → `refreshRules()`
6. **[Visualizar preview]** → `ReactMarkdown` renderiza `editorContent`

---

## 26. Lacunas técnicas encontradas

| # | Lacuna | Detalhe | Gravidade |
|---|--------|---------|-----------|
| 1 | Arquitetura de entidades normativas | Apenas `governance_rules` genérica | Alta |
| 2 | Busca avançada | Sem busca textual, filtros ou tags | Média |
| 3 | Histórico/comparador de versões | Versão existe no banco mas não há UI de diff | Média |
| 4 | Vínculo com módulos | Sem relação padronizada padrão ↔ módulo | Alta |
| 5 | Vínculo com agentes | Sem relação padronizada padrão ↔ agente | Alta |
| 6 | Vínculo com decisões | ADRs existem em markdown, não vinculados | Média |
| 7 | Checklist formal | Não há entidade de checklist no módulo | Alta |
| 8 | Auditoria de uso | Sem rastreio de quem consultou/quando | Média |
| 9 | Exportação | Sem geração de MD/PDF estruturado | Baixa |
| 10 | Cache/fallback | Sem camada de resiliência offline | Média |

---

## 27. Lacunas de governança encontradas

| # | Lacuna | Detalhe | Gravidade |
|---|--------|---------|-----------|
| 1 | Approval flow | Draft/review/curation/approved não implementado | Alta |
| 2 | Owner formal | `GovernanceRule` não tem `area_owner` | Alta |
| 3 | Escopo / fora de escopo | Sem campos `scope_in` / `scope_out` | Alta |
| 4 | Exceções formalizadas | Sem entidade de exceção | Média |
| 5 | Evidências estruturadas | Sem campo/tabela de evidência | Média |
| 6 | Dependências entre padrões | Sem campo/tabela de dependência | Alta |
| 7 | Risco por padrão | Sem campo de risco/severidade | Média |
| 8 | Depreciação/substituição | Sem campo `replaced_by` | Média |
| 9 | Permissões por papel | RLS genérico (authenticated pode tudo) | Alta |
| 10 | Auditoria de alteração | Sem tabela `audit_logs` | Média |

---

## 28. Lacunas de documentação encontradas

| # | Lacuna | Detalhe | Gravidade |
|---|--------|---------|-----------|
| 1 | Classificação de maturidade | Status canônico/rascunho/legado não formal | Alta |
| 2 | Mapa de documentos | `mapa_geral_documentacao.md` existe, mas sem indicadores | Média |
| 3 | Documentação de permissões | Política de acesso não documentada | Alta |
| 4 | Guia do programador | "Como usar a Central" não formalizado | Média |
| 5 | Guia do agente | "Como agentes consultam padrões" não formalizado | Alta |
| 6 | Documentação externa | Material publicável não identificado | Média |

---

## 29. Lacunas de dados/Supabase encontradas

| # | Lacuna | Detalhe | Gravidade |
|---|--------|---------|-----------|
| 1 | Schema normativo | governance_rules sem taxonomia | Alta |
| 2 | Relações entre entidades | Sem FK entre padrões, módulos, decisões | Alta |
| 3 | Tabela de decisões | ADRs em markdown, não estruturados | Média |
| 4 | Tabela de evidências | Evidências sem local formal | Média |
| 5 | Tabela de exceções | Exceções sem local formal | Média |
| 6 | Tabela de audit | Sem trilha de auditoria | Média |
| 7 | Políticas RLS específicas | Apenas authenticated, sem granularidade | Alta |

---

## 30. Lacunas de Storage encontradas

| # | Lacuna | Detalhe | Gravidade |
|---|--------|---------|-----------|
| 1 | Bucket de documentos | Nenhum bucket dedicado | Média |
| 2 | Bucket de evidências | Evidências sem local de armazenamento | Média |
| 3 | Bucket de exportação | Exportações sem local de geração | Baixa |
| 4 | Política de Storage | Sem definição de público/privado por bucket | Alta |

---

## 31. Riscos da estrutura atual

### 31.1 Matriz de riscos detalhada

| # | Risco | Descrição | Impacto | Prob. | Severidade | Mitigação | Fase |
|---|-------|-----------|---------|-------|------------|-----------|------|
| 1 | Depósito bagunçado | Crescimento de docs sem classificação vira acervo sem índice | Alto | Média | **Crítico** | Taxonomia + classificação obrigatória | F1 |
| 2 | Burocracia excessiva | Exigir aprovação para tudo trava execução | Alto | Média | **Alto** | Níveis de rigor por criticidade | F2 |
| 3 | Padrão bonito sem uso | Documentos aprovados mas ignorados | Alto | Alta | **Crítico** | Integração com fluxo real de desenvolvimento | F3 |
| 4 | Duplicidade documental | Mesmo assunto tratado em vários docs | Médio | Alta | **Alto** | Detector automático + curadoria | F8 |
| 5 | Conflito entre áreas | Dois domínios reivindicam mesmo tema | Alto | Média | **Alto** | Guardião como mediador + precedência | F2 |
| 6 | governance_rules genérica | Entidade única para tudo perde especificidade | Alto | Alta | **Crítico** | Migrar para `standards` com subtipos | F3 |
| 7 | Vazamento de sensível | Documento interno publicado como externo | Alto | Baixa | **Crítico** | Política de classificação + revisão | F2 |
| 8 | Agente consome rascunho | Agente considera rascunho como verdade | Alto | Média | **Crítico** | Flag `agent_available` + policy | F4 |
| 9 | Tabelas demais cedo | 42 tabelas de uma vez sem necessidade comprovada | Médio | Média | **Médio** | Schema mínimo por fase | F3 |
| 10 | Sem versionamento relacional | Versões de padrão sem rastreio de mudança | Alto | Baixa | **Alto** | `standard_versions` com diff | F3 |
| 11 | Sem aprovação | Qualquer um publica qualquer coisa | Alto | Média | **Alto** | Workflow de aprovação | F4 |
| 12 | Sem owner | Padrão órfão sem responsável | Alto | Média | **Alto** | Campo `area_owner` obrigatório | F2 |
| 13 | Sem relação módulo ↔ padrão | Módulos sem padrão vinculado | Alto | Alta | **Crítico** | `module_standard_links` | F4 |
| 14 | Perda de histórico | Substituição sem rastro | Médio | Média | **Médio** | `replaced_by` + `deprecated_at` | F3 |
| 15 | Dependências invisíveis | Padrão A muda, quebra padrão B sem aviso | Alto | Média | **Alto** | Grafo de dependências | F4 |
| 16 | Padrão obsoleto ativo | Padrão substituído continua como referência | Médio | Alta | **Médio** | Status `deprecated` obrigatório | F2 |
| 17 | UX complexa | Interface confusa afasta usuários | Médio | Média | **Médio** | Testes de usabilidade + modo dev | F5 |
| 18 | Supabase inchado | Tabelas demais sem uso real | Médio | Baixa | **Médio** | Revisão periódica de schema | F7 |
| 19 | Storage sem governança | Arquivos órfãos sem owner | Médio | Média | **Médio** | Política de ciclo de vida | F6 |
| 20 | Centralização excessiva | Tudo depende da Central, trava execução | Alto | Baixa | **Alto** | Autonomia local com auditoria periódica | F5 |

---

## 32. O que pode ser reaproveitado

**Fato**

1. **Embrião Supabase-first**: `governance_rules` + sync function = fundação técnica funcional.
2. **Base documental extensa**: 12 docs v1 + ADRs + docs do módulo = riqueza de conteúdo.
3. **Versionamento com checksum**: SHA-256 garante integridade do conteúdo.
4. **Registro de decisão**: `DECISIONS.md` e ADRs 001-008 como trilha decisória.
5. **Modularidade**: registro no `moduleRegistry`, roteamento independente, barrel exports.
6. **Agent docs**: persona, prompt e session_log do Zico Padron.
7. **Sync documental**: função serverless validada em produção.
8. **UX existente**: layout com sidebar e cards de status servem como base.

---

## 33. O que precisa ser preservado

1. **Integridade do conteúdo existente**: migrations, dados Supabase, arquivos de docs.
2. **Estratégia de sync**: `governance-sync-doc.mjs` como padrão de materialização.
3. **Versionamento**: ciclo incremental com checksum.
4. **Modularidade**: `moduleRegistry`, `manifest.ts`, `module-doc.ts`.
5. **ADRs**: decisões arquiteturais registradas.
6. **12 docs v1**: conteúdo cru para conversão em padrões.

---

## 34. O que precisa ser refatorado futuramente

1. **Modelo de dados**: de `governance_rules` genérico para `standards` com taxonomia.
2. **Service**: adicionar approval flow, validação e relações.
3. **Página principal**: de CRUD único para portal com múltiplas views.
4. **Sync function**: suportar múltiplos destinos de sync e rollback.
5. **Auth/permissões**: de RLS genérico para políticas por papel.

---

## 35. O que precisa ser criado futuramente

1. Biblioteca de padrões com taxonomia
2. Biblioteca de documentos com ciclo de vida
3. Workflow de aprovação (draft → review → curation → approved)
4. Entidade de exceção e evidência
5. Relações padrão ↔ módulo ↔ agente ↔ decisão
6. Checklist operacional como entidade
7. Arquivo morto / legado
8. Busca inteligente e grafo
9. Modo Dev e Modo Agente
10. Exportação e publicação externa

---

## 36. Proposta de nova arquitetura da Central de Padrões

```
Central de Padrões (Portal Vivo)
│
├── 1. Camada Normativa (standards)
│   ├── Padrões oficiais (com taxonomia)
│   ├── Regras obrigatórias (check)
│   ├── Protocolos (sequência obrigatória)
│   └── Matrizes (relacionamentos)
│
├── 2. Camada Documental (documents)
│   ├── Documentos canônicos
│   ├── Documentos em revisão
│   ├── Documentos brutos
│   ├── Documentos legados
│   └── Arquivo morto
│
├── 3. Camada Operacional
│   ├── Checklists e matrizes
│   ├── Auditorias e evidências
│   ├── Decisões e exceções
│   └── Aprovações e revisões
│
├── 4. Camada Relacional
│   ├── Padrão ↔ Módulo
│   ├── Padrão ↔ Agente
│   ├── Padrão ↔ Decisão
│   └── Grafo de dependências
│
└── 5. Camada de Acesso
    ├── Modo Humano (completo/resumido)
    ├── Modo Dev (atalhos técnicos)
    ├── Modo Agente (regras + proibições)
    └── Documentação externa (publicável)
```

---

## 37. Proposta de arquitetura de informação/UX

### 37.1 Navegação principal (sidebar)

```
┌─────────────────────────────┐
│ CP  Central de Padrões       │
│     robust clean             │
├─────────────────────────────┤
│ 🏠 Visão Geral / Dashboard  │
│ 📋 Padrões                  │
│ 📄 Documentos               │
│ 🔌 Módulos                  │
│ 🤖 Agentes                  │
│ ⚖️ Decisões / Exceções      │
│ 🔍 Auditorias / Evidências  │
│ 🧪 Modo Dev                 │
│ 🤖 Modo Agente              │
│ ⚙️ Configurações            │
├─────────────────────────────┤
│ 🔙 Voltar ao SagB           │
└─────────────────────────────┘
```

### 37.2 Visões por persona

| Persona | Home | Atalhos | Principal |
|---------|------|---------|-----------|
| Leigo | Dashboard geral | — | Documentos canônicos |
| Programador | Modo Dev | Criar módulo/tabela/API | Padrões técnicos + checklists |
| Gestor | Dashboard de governança | Relatórios | Decisões + exceções |
| Agente | Modo Agente | Consultar regra | Regras obrigatórias + proibições |
| Auditor | Dashboard de auditoria | — | Evidências + achados |
| Responsável de área | Visão por domínio | Checklist da área | Padrões da área + pendências |

---

## 38. Proposta de estrutura de dados/Supabase

### 38.1 Schema mínimo para Fase 3

```sql
-- standards (evolução de governance_rules)
create table standards (
  id uuid primary key default gen_random_uuid(),
  standard_key text not null unique,
  normative_type text not null,  -- principio|politica|regra|padrao|protocolo|...
  domain text not null,          -- sistemas|ux|seguranca|agentes|...
  title text not null,
  content_md text not null,
  version int not null default 1,
  checksum_sha256 text not null,
  status text not null default 'rascunho',  -- rascunho|revisao|curadoria|aprovado|publicado|deprecado|substituido
  area_owner text not null,       -- pietro|savio|alice|...
  risk_level text,                -- baixo|medio|alto|critico
  scope_in text[],
  scope_out text[],
  dependencies uuid[],            -- FK para standards.id
  replaced_by uuid,               -- FK para standards.id
  evidence_required boolean default false,
  agent_available boolean default false,
  sync_target_path text,
  sync_status text default 'pending',
  last_sync_error text,
  created_by text,
  updated_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deprecated_at timestamptz
);

-- standard_versions
create table standard_versions (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid not null references standards(id),
  version int not null,
  content_md text not null,
  checksum_sha256 text not null,
  change_summary text,
  approved_by text,
  created_at timestamptz default now()
);

-- decisions (ADRs estruturados)
create table decisions (
  id uuid primary key default gen_random_uuid(),
  adr_id text unique,           -- ADR-001
  title text not null,
  status text not null,         -- proposta|aceita|deprecada|substituida
  context text not null,
  decision text not null,
  consequences text,
  standards_affected uuid[],    -- FK para standards.id
  area_owner text not null,
  approved_by text,
  created_at timestamptz default now()
);

-- approval_requests
create table approval_requests (
  id uuid primary key default gen_random_uuid(),
  standard_id uuid not null references standards(id),
  requested_by text not null,
  assigned_to text not null,     -- guardiao|responsavel_area
  status text not null default 'pending',  -- pending|approved|rejected
  review_notes text,
  decided_at timestamptz,
  created_at timestamptz default now()
);
```

**Compatibilidade**: manter `governance_rules` operacional durante migração, com trigger/function para espelhar dados em `standards` até a desativação.

---

## 39. Proposta de buckets/arquivos

### Ordem de implantação

| Fase | Bucket | Finalidade | Público? | Política |
|------|--------|-----------|----------|----------|
| F3 | `canonical-documents` | Documentos canônicos publicados | Leitura pública | RLS: authenticated read |
| F3 | `evidence-files` | Evidências de auditoria | Privado | RLS: auditor + admin |
| F4 | `source-ingestion` | Documentos brutos ingeridos | Privado | RLS: ingestão service |
| F5 | `triage-files` | Arquivos em triagem | Privado | RLS: triador |
| F6 | `archived-sources` | Fontes arquivadas | Privado | RLS: admin |
| F7 | `public-docs` | Documentação externa | Público | RLS: anon read |
| F7 | `exports` | Exportações geradas | Privado | RLS: solicitante |

---

## 40. Proposta de divisão interna do módulo

O módulo deve ser reorganizado em diretórios:

```
src/modules/central_padroes/
├── manifest.ts
├── module-doc.ts
├── routes.tsx
├── index.ts
├── README.md
├── DECISIONS.md
├── PLANNED.md
├── CHANGELOG.md
├── agent/                 (mantido)
├── docs/                  (expandido com classificações)
├── layout/                (expandido com navegação completa)
├── pages/
│   ├── DashboardPage.tsx
│   ├── StandardsPage.tsx
│   ├── DocumentsPage.tsx
│   ├── DecisionsPage.tsx
│   ├── ModulesPage.tsx
│   ├── AgentsPage.tsx
│   ├── DevModePage.tsx
│   ├── AgentModePage.tsx
│   └── AdminPage.tsx
├── components/
│   ├── StandardCard.tsx
│   ├── StatusBadge.tsx
│   ├── ApprovalFlow.tsx
│   ├── DependencyGraph.tsx
│   ├── ChecklistViewer.tsx
│   ├── EvidenceUploader.tsx
│   └── SearchBar.tsx
├── services/
│   ├── governanceRulesService.ts   (mantido)
│   ├── standardsService.ts         (novo)
│   ├── decisionsService.ts         (novo)
│   ├── approvalService.ts          (novo)
│   └── searchService.ts            (novo)
├── hooks/
│   ├── useStandards.ts
│   ├── useDecisions.ts
│   └── useApprovalFlow.ts
├── types/
│   ├── standard.types.ts
│   ├── decision.types.ts
│   └── approval.types.ts
└── store/                 (se necessário, contexto global)
```

---

## 41. Relação com módulos plugáveis

**Fato**: o SagB possui **25+ módulos** registrados no `moduleRegistry`.

**Recomendação**:

Cada módulo plugável deve ter, na Central de Padrões:
- **Padrões técnicos aplicáveis** (stack, API, Supabase)
- **Padrões UI aplicáveis** (design tokens)
- **Padrões segurança aplicáveis** (RLS, policies)
- **Padrões documentação aplicáveis** (modelo de doc)
- **Padrões logs/auditoria aplicáveis** (padrão de log)
- **Padrões Supabase aplicáveis** (naming de tabelas)
- **Padrões deploy aplicáveis** (esteira, CI/CD)
- **Checklists obrigatórios** (pré-deploy, pré-criação)

A Central deve responder:
- Quais padrões regem este módulo?
- Quais módulos usam este padrão?
- Quais módulos estão fora do padrão?
- Quais módulos precisam revisão?

**Tabela necessária**: `module_standard_links` (standard_id, module_id, mandatory boolean).

---

## 42. Relação com Biblioteca de Módulos Base Reutilizáveis

**Fato**: não existe biblioteca formalizada de módulos base.

**Recomendação**:

Criar na Central uma seção "Biblioteca de Módulos Base" com:
- Catálogo de módulos base candidatos (auth_core, users_core, permissions_core, etc.)
- Contrato técnico de cada módulo base (tabelas prováveis, buckets, permissões)
- Dependências e status
- Critérios para reutilizar vs. criar novo
- Impedimento de duplicidade: antes de criar módulo novo, consultar a biblioteca

**Tabela necessária**: `base_modules` + `module_dependencies`.

---

## 43. Relação com agentes

**Fato**: o módulo já tem agente definido (Zico Padron) e `agent/persona.md`.

**Recomendação**:

Para cada padrão/documento importante, gerar versões:
1. **Humano completo** — texto completo com rationale
2. **Humano resumido** — bullet points principais
3. **Agente operacional** — instruções diretas para execução
4. **Regras obrigatórias** — checklist do que o agente DEVE seguir
5. **Proibições** — o que o agente NÃO PODE fazer
6. **Quando escalar** — critérios para pedir validação humana
7. **Dependências** — padrões que devem ser consultados antes

**Flag necessária**: `standard.agent_available` + `standard.agent_rules_md`.

---

## 44. Relação com Cássio/programadores

### Modo Dev — atalhos propostos

| Atalho | Padrões aplicáveis | Checklist | Responsável |
|--------|-------------------|-----------|-------------|
| Criar sistema novo | `stack-e-infra`, `arquitetura-modulos-plugaveis` | Checklist sistema | Sávio |
| Criar módulo novo | `modelo-module-doc`, `arquitetura-modulos-plugaveis` | Checklist módulo | Sávio |
| Criar tabela Supabase | `inventario-supabase-sagb`, naming conventions | Checklist tabela | Sávio |
| Criar API | Padrão de API (a definir) | Checklist API | Sávio |
| Criar componente | `design-system` | Checklist componente | Alice |
| Criar integração | Padrão de integração (a definir) | Checklist integração | Sávio |
| Criar agente técnico | `04_pierre_zanulli` | Checklist agente | Pierre |
| Fazer deploy | `deploy-ambientes-e-esteira` | Checklist deploy | Sávio |
| Refatorar legado | `QUARENTENA_TECNICA` | Checklist refatoração | Área |
| Reaproveitar módulo | Biblioteca de módulos base | Checklist consulta | Guardião |

---

## 45. Relação com responsáveis/domínios

Adotar os 12 domínios da v1 como **backbone de ownership**:

| Domínio | Responsável | Papel na Central |
|---------|-------------|------------------|
| Governança geral | Pietro Carboni | Guardião — aprova e classifica |
| Sistemas | Sávio Codare | Dono técnico de padrões de sistema |
| UX/UI | Alice Montini | Dona de padrões visuais |
| Segurança | Pedro Gazan | Dono de padrões de segurança |
| Agentes | Pierre Zanulli | Dono de padrões de agente |
| Modelos/RAI | Klaus Wagen | Dono de padrões de IA |
| Processos | Yuri Sague | Dono de padrões operacionais |
| Naming | Noah Verdili | Dono de padrões de nomenclatura |
| Ideias | Dante Montoya | Dono de padrões de exploração |
| Metodologias | Nilo Barret | Dono de padrões intelectuais |
| AcadB | Júlio Mosqueira | Dono de padrões educacionais |
| Ventures | César Tulli | Dono de padrões de negócio |

---

## 46. Relação com decisões e exceções

**Recomendação**:

- **Decisão aprovada** → deve gerar vínculo com padrão afetado (tabela `decision_impacts`).
- **Exceção** → deve ter:
  - Validade (data de expiração)
  - Owner (quem solicitou)
  - Evidência (por que a exceção é necessária)
  - Aprovação do guardião
  - Padrão afetado (qual padrão está sendo excepcionado)
- **Substituição** → padrão A substituído por padrão B com `replaced_by`.

---

## 47. Relação com auditorias e evidências

**Recomendação**:

- **Achados de auditoria** → formalizar com:
  - Severidade (baixa/média/alta/crítica)
  - Probabilidade
  - Impacto
  - Padrão/documento relacionado
  - Evidência (arquivo no bucket)
  - Plano de ação
- **Evidência** → arquivo + metadado (data, responsável, padrão, status).

---

## 48. Relação com documentação interna e externa

**Classificação obrigatória por documento/padrão**:

| Classificação | Descrição | Quem vê | Exemplo |
|---------------|-----------|---------|---------|
| `internal` | Uso interno do SagB | Todos autenticados | ADRs internos |
| `sensitive` | Dado sensível sem publicação | Área + guardião | Evidências de segurança |
| `externable` | Pode ser publicado após revisão | Revisor | Guias de contribuição |
| `published` | Já revisado e público | Público anônimo | Documentação externa |

---

## 49. Modo Dev recomendado

**Público**: programadores (Cássio, Sávio, equipe técnica)

**Funcionalidades**:
1. Atalhos rápidos (criar módulo, tabela, API, deploy)
2. Checklist contextual antes de cada ação
3. "O que preciso saber antes de X?"
4. Consulta: "Existe módulo parecido?"
5. Consulta: "Existe padrão para isso?"
6. Bloqueio por regras críticas (não pode criar tabela sem padrão de Supabase)

**UX**: página dedicada com cards de ação + barra de busca + resultados filtrados por relevância técnica.

---

## 50. Modo Agente recomendado

**Público**: agentes do ecossistema (Zico Padron, agentes de módulo, assistentes)

**Funcionalidades**:
1. Consulta de padrões canônicos liberados (`agent_available = true`)
2. Regras obrigatórias resumidas
3. Proibições explícitas
4. Quando escalar para humano
5. Dependências entre padrões

**Segurança**:
- Rascunho nunca disponível para agente
- Documento sensível bloqueado por policy
- Acesso auditado (quem consultou o quê)

**Formato de resposta**: JSON estruturado com `{ rule_key, summary, scope_in, scope_out, prohibitions, escalate_when, dependencies }`.

---

## 51. Fluxos recomendados

### 51.1 Fluxo de criação de padrão

```
[Responsável cria rascunho]
        ↓
[Validação automática: campos obrigatórios + escopo]
        ↓
[Rascunho salvo com status 'rascunho']
        ↓
[Notifica revisor da área]
        ↓
[Revisor analisa e envia para curadoria]
        ↓
[Guardião (Pietro) revisa dependências e conflitos]
        ↓
[Se ok → status 'aprovado'; se não → devolve com notas]
        ↓
[Publicação: versiona + sync documental]
```

### 51.2 Fluxo de depreciação/substituição

```
[Identifica padrão obsoleto]
        ↓
[Cria padrão substituto com `replaced_by` apontando para novo]
        ↓
[Padrão antigo → status 'substituido']
        ↓
[Notifica módulos/agentes que usam o padrão antigo]
        ↓
[Após período de migração → status 'deprecado']
```

### 51.3 Demais fluxos essenciais

| Fluxo | Etapas chave | Atores | Prioridade |
|-------|-------------|--------|------------|
| Revisão de padrão | Notificar revisor → analisar → aprovar/rejeitar | Revisor + guardião | F4 |
| Publicação de padrão | Validar → versionar → sync → notificar | Guardião | F4 |
| Registro de exceção | Solicitar → justificar → aprovar → expirar | Solicitante + guardião | F4 |
| Triagem documental | Ingerir → classificar → status → destino | Triador | F5 |
| Auditoria de padrão | Selecionar → verificar → evidenciar → relatar | Auditor | F6 |
| Checklist pré-módulo | Consultar biblioteca → verificar padrões → liberar | Programador | F4 |
| Checklist pré-deploy | Verificar padrões → verificar segurança → liberar | Programador + segurança | F4 |
| Vínculo padrão ↔ módulo | Selecionar padrão → selecionar módulo → estabelecer | Guardião | F4 |
| Arquivamento | Mover para legado → manter referência → notificar | Guardião | F6 |

---

## 52. Permissões recomendadas

### 52.1 Papéis

| Papel | Descrição |
|-------|-----------|
| `super_admin` | Acesso irrestrito |
| `guardiao_padroes` | Pietro — aprova, classifica, define taxonomia |
| `responsavel_area` | Sávio, Alice, etc. — dono do domínio |
| `revisor_area` | Revisor designado por área |
| `programador` | Cássio e equipe — consulta e sugere |
| `agente_consultor` | Agentes — consumo controlado |
| `leitor_interno` | Leitura geral (sem criar/editar) |
| `publicador_externo` | Publica documentação externa |
| `auditor` | Auditoria e evidências |

### 52.2 Matriz de permissões

| Ação | super_admin | guardiao | resp_area | revisor | programador | agente | leitor | publicador | auditor |
|------|-------------|----------|-----------|---------|-------------|--------|--------|------------|---------|
| Ver padrão canônico | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ver rascunho | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Ver sensível | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Criar padrão | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Editar padrão | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Revisar padrão | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Aprovar padrão | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Publicar padrão | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Arquivar padrão | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exportar | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Alterar permissões | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 52.3 Regras de governança

1. **Padrão canônico** exige aprovação do guardião.
2. **Documento externo** exige revisão de segurança.
3. **Padrão com dependência** exige validação da área impactada.
4. **Documento sensível** não pode ser público.
5. **Alteração em padrão aprovado** gera nova versão.
6. **Exceção** precisa de registro e aprovação.
7. **Substituição** precisa apontar o padrão novo.
8. **Documento bruto** não pode aparecer como oficial.
9. **Agente** só pode consumir conteúdo liberado para agente.

---

## 53. Recursos inteligentes recomendados

| # | Recurso | Função | Valor | Complexidade | Dependências | Prioridade | Fase |
|---|---------|--------|-------|-------------|--------------|------------|------|
| 1 | Busca inteligente por padrões | Busca textual + filtros por domínio/tipo/status | Alto | Média | Schema de padrões | Alta | F5 |
| 2 | Busca por pergunta natural | "Qual padrão usar para criar módulo?" | Alto | Alta | IA + índice semântico | Média | F8 |
| 3 | Filtros combinados | Área + status + tipo + responsável + módulo | Alto | Baixa | Schema populado | Alta | F5 |
| 4 | Tags | Marcação por tema/categoria | Médio | Baixa | Campo tags | Média | F3 |
| 5 | Alertas de revisão vencida | Notificação se padrão não revisado em N dias | Médio | Média | approval_requests | Média | F7 |
| 6 | Alertas sem responsável | Documento/padrão sem area_owner | Alto | Baixa | Campo area_owner | Alta | F3 |
| 7 | Alertas módulo sem padrão | Módulo sem nenhum padrão vinculado | Alto | Média | module_standard_links | Alta | F6 |
| 8 | Alerta de padrão duplicado | Detecção de conteúdo semelhante | Médio | Alta | Embeddings + IA | Baixa | F8 |
| 9 | Alerta de conflito de escopo | Dois padrões com mesmo escopo | Alto | Média | Análise de scope_in | Alta | F4 |
| 10 | Alerta de dependência crítica | Padrão dependente publicado sem validação | Alto | Média | standard_dependencies | Alta | F4 |
| 11 | Grafo de relacionamento | Visualização de dependências entre padrões/módulos | Alto | Alta | Todas as relações | Média | F6 |
| 12 | Assistente interno | Chat com a Central (pergunta → resposta) | Alto | Alta | IA + índices | Baixa | F8 |
| 13 | Modo auditoria | Painel de conformidade por módulo/domínio | Alto | Média | audits + evidence | Média | F7 |
| 14 | Exportação MD/PDF | Gerar documento formatado | Médio | Média | Templates | Baixa | F7 |
| 15 | Resumo para agente | Gerar versão agente de cada padrão | Alto | Média | agent_available | Alta | F5 |
| 16 | Checklist contextual | Gerar checklist baseado no que o usuário quer fazer | Alto | Alta | Todos os padrões | Média | F6 |
| 17 | Matriz "antes de construir" | Consulta única: o que preciso saber antes de X | Alto | Média | Índice consolidado | Alta | F4 |
| 18 | Validação automática | Bloquear publicação se campos obrigatórios faltando | Alto | Baixa | Schema | Alta | F4 |
| 19 | Comparador de versões | Diff entre versões de padrão | Médio | Média | standard_versions | Média | F5 |
| 20 | Detector de duplicidade | Varredura periódica de docs semelhantes | Médio | Alta | IA | Baixa | F8 |

---

## 54. Matriz estado atual vs estado ideal

| Dimensão | Estado atual | Estado ideal | Lacuna | Risco | Prioridade | Fase |
|----------|-------------|-------------|--------|-------|------------|------|
| Documentos | Acervo extenso sem classificação unificada | Classificados por canônico/rascunho/legado | Falta status formal | Duplicidade e perda de referência | Alta | F1 |
| Padrões | GovernanceRule genérica sem taxonomia | Standards com tipos normativos explícitos | Falta taxonomia | Entidade genérica demais | **Crítica** | F2 |
| Regras | Domain genérico (normas/operacional/templates) | Tipos normativos completos | Falta especificidade | Conflito de classificação | **Crítica** | F2 |
| Taxonomia | Inexistente no runtime | 21 tipos normativos definidos | Inexistente | Tudo vira "documento" | **Crítica** | F2 |
| Versionamento | Incremental + checksum | + standard_versions com diff | Falta histórico de mudança | Perda de rastreabilidade | Média | F3 |
| Aprovação | Inexistente (publicação direta) | Workflow draft/review/curation/approved | Inexistente | Publicação sem controle | **Crítica** | F4 |
| Responsáveis | owner do módulo (Zico) | area_owner por padrão | Falta ownership granular | Padrão órfão | Alta | F2 |
| Supabase | governance_rules + RLS genérico | standards + decisions + approvals + RLS granular | Schema insuficiente | Entidade genérica | Alta | F3 |
| Storage | Nenhum bucket dedicado | Buckets por finalidade com políticas | Inexistente | Sem local para evidências | Média | F3 |
| UI | CRUD único (visão geral) | Portal com 20 áreas | UX limitada | Baixa adoção | Média | F5 |
| UX | Sidebar minimalista | Navegação completa por persona | Pouca usabilidade | Dificuldade de descoberta | Média | F5 |
| Busca | Inexistente | Busca inteligente + filtros | Inexistente | Dificuldade de encontrar padrão | Alta | F5 |
| Filtros | Inexistente (só domain) | Filtros por status/tipo/responsável/módulo | Inexistente | Baixa navegabilidade | Alta | F5 |
| Tags | Inexistente | Tags opcionais por padrão | Inexistente | Sem agrupamento temático | Média | F3 |
| Módulos plugáveis | Sem relação formal | module_standard_links | Inexistente | Módulo sem padrão | **Crítica** | F4 |
| Módulos base | Sem biblioteca | Catálogo de módulos base | Inexistente | Duplicidade de construção | Alta | F4 |
| Agentes | Apenas persona do Zico | agent_available + regras para agente | Parcial | Agente consome rascunho | Alta | F4 |
| Decisões | ADRs em markdown | decisions estruturadas com FK | Parcial | Decisão sem vínculo | Média | F3 |
| Auditorias | Inexistente | audits + audit_findings | Inexistente | Sem rastreio de conformidade | Média | F5 |
| Evidências | Inexistente | evidence_records + Storage | Inexistente | Sem comprovação | Média | F5 |
| Permissões | authenticated (tudo ou nada) | 9 papéis com matriz granular | Genérica demais | Vazamento de sensível | **Crítica** | F4 |
| Doc. interna | Abundante mas não classificada | Classificada por maturidade e escopo | Falta organização | Dificuldade de curadoria | Alta | F1 |
| Doc. externa | Inexistente | Documentos publicáveis com revisão | Inexistente | Sem material público | Baixa | F7 |
| Arquivo morto | Inexistente | Legado com referência preservada | Inexistente | Perda de histórico | Baixa | F6 |
| Exportação | Inexistente | MD/PDF com template | Inexistente | Sem geração de artefato | Baixa | F7 |
| Governança | Draft/publish/sync básico | Workflow completo com papéis e regras | Parcial | Risco operacional | **Crítica** | F4 |

---

## 55. Plano de refatoração em fases

### Fase 0 — Auditoria e congelamento de escopo (atual)

**Objetivo**: mapear o estado atual sem implementar nada.
**Entregável**: este relatório.
**Fora de escopo**: qualquer alteração de código/dados.

### Fase 1 — Organização documental e índice canônico

**Objetivo**: classificar todo o acervo documental.
**Escopo**:
- Classificar cada documento por maturidade (canônico/rascunho/legado)
- Criar índice canônico navegável
- Mapear status de cada documento
**Entregáveis**: documento de classificação + índice unificado
**Riscos**: baixo (apenas markdown)
**Dependências**: nenhuma
**Critério de pronto**: todo documento tem classificação e status
**Envolve código**: ❌
**Envolve Supabase**: ❌
**Prioridade**: **Crítica**

### Fase 2 — Metadados e taxonomia normativa

**Objetivo**: definir taxonomia e metadados obrigatórios.
**Escopo**:
- Definir tipos normativos (princípio → contrato de agente)
- Definir status de maturidade
- Definir owner, escopo, risco, dependência, evidência
**Entregáveis**: documento de taxonomia + dicionário de metadados
**Riscos**: médio (pode gerar atrito entre áreas)
**Dependências**: Fase 1
**Critério de pronto**: schema de metadados fechado e validado com as áreas
**Envolve código**: ❌
**Envolve Supabase**: ❌
**Prioridade**: **Crítica**

### Fase 3 — Modelo de dados Supabase

**Objetivo**: schema mínimo expandido.
**Escopo**:
- Criar `standards` + `standard_versions` + `standard_areas` + `standard_dependencies`
- Criar `decisions` + `approval_requests`
- Compatibilidade com `governance_rules`
**Entregáveis**: migration SQL + types TS
**Riscos**: quebra de compatibilidade se mal planejado
**Dependências**: Fase 2
**Critério de pronto**: migrations aplicáveis sem quebra, dados existentes preservados
**Envolve código**: ✅ (migration + types)
**Envolve Supabase**: ✅ (schema)
**Prioridade**: Alta

### Fase 4 — Workflow de revisão/aprovação/publicação

**Objetivo**: approval flow completo.
**Escopo**:
- Estados: rascunho → revisão → curadoria → aprovado → publicado → deprecado → substituído
- Papéis: guardião, revisor, responsável de área
- Notificações
**Entregáveis**: approval flow funcional + UI de aprovação
**Riscos**: burocracia excessiva se mal dimensionado
**Dependências**: Fase 3
**Critério de pronto**: padrão passa por todas as etapas com registro
**Envolve código**: ✅ (service + UI)
**Envolve Supabase**: ✅ (approval_requests)
**Prioridade**: Alta

### Fase 5 — UX do portal

**Objetivo**: transformar CRUD em portal.
**Escopo**:
- Dashboard
- Biblioteca de padrões
- Filtros e busca básica
- Modo Dev
- Modo Agente (v1)
**Entregáveis**: páginas novas + navegação completa
**Riscos**: UX complexa demais
**Dependências**: Fase 3
**Critério de pronto**: usuário consegue navegar, buscar e encontrar padrões sem ajuda
**Envolve código**: ✅ (pages + components)
**Envolve Supabase**: ❌
**Prioridade**: Alta

### Fase 6 — Relações com módulos e agentes

**Objetivo**: conectar padrões a módulos e agentes.
**Escopo**:
- `module_standard_links`
- Matriz padrão ↔ módulo ↔ agente
- Alertas de módulo sem padrão
**Entregáveis**: tabelas de relação + UI de vínculo
**Riscos**: dados de integração podem estar incompletos
**Dependências**: Fase 3
**Critério de pronto**: todo módulo tem padrões vinculados
**Envolve código**: ✅
**Envolve Supabase**: ✅ (module_standard_links)
**Prioridade**: Média

### Fase 7 — Auditoria, evidência e alertas

**Objetivo**: rastreabilidade e conformidade.
**Escopo**:
- `audit_logs`
- `evidence_records` + Storage
- Alertas programados
**Entregáveis**: painel de auditoria + upload de evidência
**Riscos**: Storage sem política de ciclo de vida
**Dependências**: Fase 5
**Critério de pronto**: toda alteração é auditada, evidências podem ser anexadas
**Envolve código**: ✅
**Envolve Supabase**: ✅ (tabelas + buckets)
**Envolve Storage**: ✅
**Prioridade**: Média

### Fase 8 — Inteligência e busca semântica

**Objetivo**: busca inteligente e assistente.
**Escopo**:
- Busca com embeddings
- Detector de duplicidade
- Assistente interno (chat)
**Entregáveis**: search service + UI de busca avançada
**Riscos**: alto custo de IA se mal dimensionado
**Dependências**: Fase 5
**Critério de pronto**: busca por pergunta natural retorna resultados relevantes
**Envolve código**: ✅
**Envolve Supabase**: ✅ (vector store)
**Prioridade**: Baixa (futuro)

### Fase 9 — Exportação e documentação externa

**Objetivo**: publicar conteúdo externamente.
**Escopo**:
- Geração de MD/PDF
- Política de publicação externa
- Revisão de segurança
**Entregáveis**: exportador + bucket público
**Riscos**: vazamento de conteúdo interno
**Dependências**: Fase 7
**Critério de pronto**: documento externo gerado e publicado com segurança
**Envolve código**: ✅
**Envolve Supabase**: ✅ (bucket público)
**Envolve Storage**: ✅
**Prioridade**: Baixa (futuro)

---

## 56. Backlog técnico sugerido (20 épicos)

### ÉPICO 01 — Auditoria e inventário
**Objetivo**: mapear todo o acervo documental e técnico.
**Tarefas**: inventariar docs, classificar status, mapear código existente.
**Dependências**: nenhuma.
**Prioridade**: **Crítica**.
**Critério de validação**: relatório de auditoria concluído.

### ÉPICO 02 — Taxonomia normativa
**Objetivo**: definir e documentar os 21 tipos normativos.
**Tarefas**: definir cada tipo, quando usar, metadados obrigatórios.
**Dependências**: Épico 01.
**Prioridade**: **Crítica**.
**Critério de validação**: dicionário de taxonomia fechado.

### ÉPICO 03 — Documentos e versões
**Objetivo**: estruturar ciclo de vida documental.
**Tarefas**: classificar docs existentes, criar índice canônico.
**Dependências**: Épico 02.
**Prioridade**: Alta.

### ÉPICO 04 — Padrões e regras
**Objetivo**: migrar governance_rules para standards.
**Tarefas**: criar schema, migrar dados, validar compatibilidade.
**Dependências**: Épico 02.
**Prioridade**: Alta.

### ÉPICO 05 — Responsáveis e áreas
**Objetivo**: formalizar ownership por domínio.
**Tarefas**: criar tabela de áreas, vincular responsáveis.
**Dependências**: Épico 02.
**Prioridade**: Alta.

### ÉPICO 06 — Decisões e exceções
**Objetivo**: estruturar decisões e exceções como entidades.
**Tarefas**: criar `decisions`, migrar ADRs, criar `exceptions`.
**Dependências**: Épico 04.
**Prioridade**: Média.

### ÉPICO 07 — Módulos plugáveis
**Objetivo**: conectar padrões a módulos.
**Tarefas**: criar `module_standard_links`, mapear módulos existentes.
**Dependências**: Épico 04.
**Prioridade**: Alta.

### ÉPICO 08 — Módulos base reutilizáveis
**Objetivo**: criar catálogo de módulos base.
**Tarefas**: listar módulos candidatos, registrar contratos.
**Dependências**: Épico 07.
**Prioridade**: Média.

### ÉPICO 09 — Checklists e matrizes
**Objetivo**: formalizar checklists como entidades.
**Tarefas**: criar tabelas de checklist, criar templates.
**Dependências**: Épico 02.
**Prioridade**: Alta.

### ÉPICO 10 — Auditorias e evidências
**Objetivo**: criar entidade de auditoria.
**Tarefas**: criar `audits`, `evidence_records`, bucket de evidências.
**Dependências**: Épico 04.
**Prioridade**: Média.

### ÉPICO 11 — Permissões
**Objetivo**: implementar RLS granular por papel.
**Tarefas**: definir papéis, criar policies, atualizar service.
**Dependências**: Épico 04.
**Prioridade**: Alta.

### ÉPICO 12 — Storage e anexos
**Objetivo**: criar buckets dedicados.
**Tarefas**: criar buckets, políticas de acesso, ciclo de vida.
**Dependências**: Épico 10.
**Prioridade**: Média.

### ÉPICO 13 — Modo Dev
**Objetivo**: criar página específica para programadores.
**Tarefas**: atalhos, checklists, busca técnica.
**Dependências**: Épico 05.
**Prioridade**: Média.

### ÉPICO 14 — Modo Agente
**Objetivo**: criar interface para agentes consumirem padrões.
**Tarefas**: flag `agent_available`, API de consulta, formato JSON.
**Dependências**: Épico 04.
**Prioridade**: Média.

### ÉPICO 15 — Busca e filtros
**Objetivo**: implementar busca textual e filtros.
**Tarefas**: search service, UI de filtros, índices.
**Dependências**: Épico 04.
**Prioridade**: Alta.

### ÉPICO 16 — Dashboards
**Objetivo**: painéis de status e conformidade.
**Tarefas**: dashboard geral, por domínio, por status.
**Dependências**: Épico 04.
**Prioridade**: Média.

### ÉPICO 17 — Exportações
**Objetivo**: gerar MD/PDF dos padrões.
**Tarefas**: template engine, export service.
**Dependências**: Épico 05.
**Prioridade**: Baixa.

### ÉPICO 18 — Inteligência interna
**Objetivo**: busca semântica e assistente.
**Tarefas**: embeddings, chat interno, detector de duplicidade.
**Dependências**: Épico 15.
**Prioridade**: Baixa.

### ÉPICO 19 — Migração do legado
**Objetivo**: deprecar governance_rules.
**Tarefas**: migrar dados, redirecionar referências, desativar tabela.
**Dependências**: Épico 04.
**Prioridade**: Baixa.

### ÉPICO 20 — QA e validação
**Objetivo**: garantir qualidade da implementação.
**Tarefas**: testes, validação de RLS, auditoria de permissões.
**Dependências**: todos os épicos.
**Prioridade**: Média.

---

## 57. Recomendações de priorização

1. **F0 + F1** (congelamento + classificação) — fazer agora, sem código.
2. **F2** (taxonomia) — fechar antes de qualquer schema.
3. **F3** (schema mínimo) — apenas tabelas essenciais.
4. **F4** (approval flow) — implementar antes de permitir múltiplos publicadores.
5. **F5** (UX portal) — construir após approval flow para ter conteúdo governado.
6. **F6** (relações módulo/agente) — conectar após conteúdo classificado.
7. **F7-F9** (auditoria, busca, exportação) — fases finais, após conteúdo consolidado.

---

## 58. Próxima etapa recomendada

**Workshop de modelagem** (sem implementação) para fechar:

1. Dicionário canônico de entidades (standards, decisions, approvals, etc.)
2. Matriz de permissões por papel
3. Definição de status válidos e transições
4. Critérios de "pronto" por status
5. Estratégia de compatibilidade `governance_rules` ↔ `standards`
6. Definição dos domínios que entram no MVP

**Formato**: 3-4 sessões com as partes interessadas (Pietro/Cássio/Rodrigues) para validar o metamodelo antes de qualquer linha de código.

---

## 59. Perguntas em aberto

1. **Quais domínios entram no MVP de governança obrigatória?** Sistemas? Segurança? Agentes? Todos?
2. **Qual a tolerância a "padrão sem dono"?** Pode existir padrão órfão ou todo padrão precisa de area_owner?
3. **Quais conteúdos podem ser externos/publicáveis?** Há material que pode ser aberto para comunidade?
4. **Qual grau de rigidez inicial para bloqueio de publicação?** Bloquear tudo ou permitir com aviso?
5. **Como lidar com padrões que afetam múltiplas áreas?** Precisa de aprovação de todas as áreas envolvidas?
6. **Qual estratégia de compatibilidade de `governance_rules` durante migração?** Manter ambas ou migrar de uma vez?
7. **Exceções expiram ou são permanentes?** Deve haver data de validade obrigatória?
8. **Agentes podem sugerir padrões ou só consultar?** O Modo Agente é apenas leitura ou permite contribuição?
9. **Quem define o schema final de `standards`?** Deve ser decisão do guardião + arquitetura ou exclusivamente técnica?
10. **Qual o prazo estimado para cada fase?** Depende da capacidade de execução paralela com outras entregas do SagB.

---

## 60. Conclusão executiva

A Central de Padrões já possui um embrião técnico correto e valioso (Supabase + versionamento + sync). O principal gap não é "tecnologia" — é **modelo normativo e governança operacional em escala**.

O módulo atual funciona como CRUD de regras genéricas. Para virar o portal vivo de governança do SagB, precisa evoluir em três eixos:

1. **Eixo normativo**: de `governance_rules` para `standards` com taxonomia, status, owner, escopo, risco, dependência e evidência.
2. **Eixo de governança**: de "publicação direta" para workflow de aprovação com papéis definidos.
3. **Eixo de experiência**: de "CRUD único" para portal com dashboard, busca, modo dev, modo agente e grafo de relacionamentos.

**Recomendação final**: não pular para implementação técnica. Fechar primeiro o metamodelo (taxonomia, papéis, fluxos) com as partes interessadas. Depois, implementar incrementalmente, fase por fase, preservando compatibilidade com o que já existe.

A evolução recomendada é **incremental e compatível**, evitando explosão prematura de tabelas, burocracia excessiva e complexidade desnecessária.

---

## Resumo Executivo Final (FASE 24)

### 1. O que foi analisado

- Documentação externa v1 (12 domínios, 12 arquivos .md)
- Documentação interna do módulo (48 arquivos .md)
- Código do módulo (7 arquivos .ts/.tsx)
- Migration Supabase, função Netlify de sync, módulo registry, service Supabase

### 2. Quantos arquivos foram encontrados

- **68 entradas** no módulo `central_padroes`
- **13 entradas** no diretório documental externo (12 .md + 1 diretório)
- **Total direto do escopo**: 81 entradas

### 3. Caminhos analisados

- `Z:\00_sagb\src\modules\central_padroes` e subdiretórios (pages, layout, services, docs, agent)
- `Z:\01_empresasb\grupob\central_de_padroes\02_documentos_atuais`
- `Z:\00_sagb\supabase\migrations` (especialmente `governance_rules_phase1`)
- `Z:\00_sagb\netlify\functions` (`governance-sync-doc.mjs`)
- `Z:\00_sagb\src\core\modules` (`moduleRegistry.ts`, `module.types.ts`)
- `Z:\00_sagb\services` (`supabase.ts`)

### 4. Caminhos não puderam ser analisados

- `netlify/functions/governance-sync-doc.ts` — inexistente; equivalente `.mjs` em produção.
- `components/`, `hooks/`, `types/`, `store/` — não existem no módulo.

### 5. Como está hoje a Central de Padrões

Funcional como editor/publicador de `governance_rules` com:
- ✅ Supabase como source-of-truth
- ✅ Versionamento com checksum SHA-256
- ✅ Sync documental serverless
- ✅ Registro de decisões (ADRs)
- ✅ Modularidade (moduleRegistry)
- ❌ Sem taxonomia normativa
- ❌ Sem approval flow
- ❌ Sem relações com módulos/agentes
- ❌ Sem busca, filtros, tags
- ❌ Sem Storage dedicado

### 6. 10 maiores lacunas

1. **Taxonomia normativa** — tipos, status, metadados não existem no runtime
2. **Approval flow** — draft/review/curation/approved não implementado
3. **Owner por área** — sem `area_owner` por padrão
4. **Dependências entre padrões** — sem campo/tabela de dependência
5. **Evidências estruturadas** — sem campo/tabela de evidência
6. **Exceções formalizadas** — sem entidade de exceção
7. **Relações módulo ↔ padrão ↔ agente** — sem tabelas de vínculo
8. **Classificação documental** — status canônico/rascunho/legado não formal
9. **Busca inteligente** — sem busca textual ou por pergunta natural
10. **Painel de risco** — sem indicadores de risco por padrão

### 7. 10 maiores riscos

1. **Depósito bagunçado** — docs crescem sem classificação
2. **Burocracia excessiva** — approval flow trava execução
3. **Baixa adoção** — padrão bonito que ninguém usa
4. **Conflito entre áreas** — dois domínios disputam mesmo tema
5. **Consumo de rascunho por agente** — agente considera rascunho como verdade
6. **Vazamento de sensível** — documento interno publicado como externo
7. **Entidade genérica demais** — governance_rules vira "tabela de tudo"
8. **Padrão sem dono** — sem owner, ninguém mantém
9. **Sem versionamento relacional** — versão muda mas ninguém sabe o que mudou
10. **UX complexa** — portal intimidante afasta usuários

### 8. O que já existe e deve ser preservado

- ✅ Embrião Supabase-first (`governance_rules` + sync function)
- ✅ Versionamento com checksum SHA-256
- ✅ Sync documental serverless
- ✅ ADRs e registros de decisão
- ✅ Documentação de base (12 domínios v1)
- ✅ Modularidade (moduleRegistry, manifest, routes, barrel exports)
- ✅ Agent docs (persona, prompt, session_log)
- ✅ UX existente (layout, sidebar, cards de status)

### 9. O que não deve ser implementado ainda

- ❌ Schema completo de 42 tabelas (explosão prematura)
- ❌ Automações avançadas sem taxonomia fechada
- ❌ Publicação externa sem política de segurança
- ❌ Buckets públicos sem revisão de conteúdo
- ❌ Busca com embeddings sem conteúdo classificado
- ❌ Assistente interno sem approval flow estabelecido

### 10. Próxima etapa recomendada

**Workshop de modelagem** para fechar, antes de qualquer implementação:
1. Dicionário canônico de entidades
2. Matriz de permissões
3. Status e transições
4. Critérios de pronto
5. Estratégia de compatibilidade `governance_rules` ↔ `standards`
6. Domínios do MVP

---

## Validação técnica mínima (FASE 25)

Comando executado: `npm run dev` em `Z:\00_sagb`.

**Resultado**:
- **Rodou**: sim
- **Subiu**: não (instância adicional)
- **Erro**: `Port 7000 is already in use`
- **Interpretação**: já existe servidor de desenvolvimento ativo no Terminal 1, coerente com o comando em execução contínua.
- **Conclusão**: o projeto compila e sobe normalmente. O erro de porta é esperado em ambiente com servidor já rodando.

---

*Documento gerado em 31 de maio de 2026.*
*Auditoria documental, técnica e arquitetural — não implementar.*
*Comparável com relatório de outra IA para validação cruzada.*
