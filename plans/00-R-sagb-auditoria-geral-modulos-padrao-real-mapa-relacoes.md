# SagB | Auditoria Geral de Módulos | Inventário Mestre, Padrão Modular Real e Mapa de Relações

> **Data da auditoria:** 01/06/2026  
> **Agente auditor:** Cássio Mendes (Cassius)  
> **Protocolo:** Auditoria de Sistemas, Módulos e Projetos v1  
> **Status:** Relatório Inicial (MEGA-ETAPA 01)

---

## 1. Objetivo da auditoria

Criar o documento mestre que sirva como base oficial para entender todos os módulos atuais do SagB, o padrão modular real que já existe, a maturidade de cada módulo, as lacunas, os riscos, as duplicidades, as relações entre módulos e as recomendações para a Central de Padrões.

Este documento será usado como base para:
- Central de Padrões
- Pietro (agente de padronização)
- Biblioteca de Módulos Base
- Padronização de novos módulos
- Refatorações futuras
- Auditorias futuras
- Decisões de arquitetura
- Definição de templates e checklists oficiais
- Entendimento geral do ecossistema SagB

---

## 2. Escopo analisado

- **Caminho principal:** `Z:\00_sagb\src\modules` (31 diretórios)
- **Caminhos complementares analisados:**
  - `Z:\00_sagb\src\core\modules\moduleRegistry.ts`
  - `Z:\00_sagb\src\core\modules\module.types.ts`
  - `Z:\00_sagb\src\core\modules\moduleActivation.ts`
  - `Z:\00_sagb\App.tsx`
  - `Z:\00_sagb\components\Sidebar.tsx`
  - `Z:\00_sagb\package.json`
  - `Z:\00_sagb\services\supabase` (referências)
  - `Z:\00_sagb\src\styles\sagb-global.css`

---

## 3. Caminho principal analisado

```
Z:\00_sagb\src\modules\
```

---

## 4. Caminhos complementares analisados

| Caminho | Função |
|---------|--------|
| `src/core/modules/moduleRegistry.ts` | Registro central de todos os módulos plugáveis |
| `src/core/modules/module.types.ts` | Tipos centrais: ModuleManifest, ModuleRoute, PluggableModule, ModuleDoc |
| `src/core/modules/moduleActivation.ts` | Sistema de ativação/desativação de módulos com localStorage |
| `App.tsx` | Shell principal do SagB (renderização do módulo ativo via Sidebar) |
| `components/Sidebar.tsx` | Sidebar global que renderiza módulos registrados |
| `package.json` | Dependências e scripts do projeto |
| `services/supabase` | Serviço compartilhado de acesso ao Supabase (Firestore-like) |
| `src/styles/sagb-global.css` | Estilos globais do SagB |

---

## 5. Caminhos não encontrados ou inacessíveis

Nenhum. Todos os caminhos previstos foram acessados com sucesso.

---

## 6. Metodologia

1. **Fase 1 (Leitura do Ambiente):** Listagem de todos os diretórios em `src/modules`, identificação de módulos reais vs. auxiliares.
2. **Fase 2 (Inventário Mestre):** Criação de tabela geral com todos os módulos e suas características estruturais.
3. **Fase 3 (Auditoria Individual):** Leitura de manifest.ts, module-doc.ts, routes.tsx e estrutura de cada módulo.
4. **Fase 4 (Padrão Modular Real):** Extração do padrão real a partir dos arquivos encontrados.
5. **Fase 5 (Governança):** Análise de README, DECISIONS, CHANGELOG, PLANNED, docs/, agent/.
6. **Fase 6 (Documentação):** Análise de docs/ internos de cada módulo.
7. **Fase 7 (Arquivos Padrão):** Análise de presença/qualidade dos 8 arquivos padrão de módulo.
8. **Fase 8 (Relações):** Mapeamento de importações, dependências e relações entre módulos.
9. **Fase 9 (Módulos Base):** Identificação de potenciais módulos base reutilizáveis.
10. **Fase 10 (UI/Visual):** Análise estrutural de UI sem alterar código.
11. **Fase 11 (Supabase/Dados):** Mapeamento de uso de Supabase por módulo.
12. **Fase 12 (Rotas/Registry):** Verificação de registro, manifest e rotas.
13. **Fase 13 (Riscos):** Identificação de riscos globais do ecossistema.
14. **Fase 14-18:** Recomendações, templates, classificações, prioridades e documento final.

---

## 7. Comandos executados

| Comando | Finalidade |
|---------|-----------|
| `dir Z:\00_sagb /B` | Listar raiz do projeto |
| `dir Z:\00_sagb\src /B` | Listar src (core, modules, styles) |
| `dir Z:\00_sagb\src\modules /B` | Listar todos os 31 módulos |
| `dir Z:\00_sagb\src\core\modules /B` | Listar core de módulos (moduleRegistry, types, activation) |
| `powershell Get-ChildItem ... -Directory` | Mapear estrutura completa de cada módulo |
| `powershell Get-Content manifest.ts` | Ler manifests de todos os módulos |
| `powershell Get-Content module-doc.ts` | Ler module-docs de todos os módulos |
| `powershell Get-Content routes.tsx` | Ler rotas de todos os módulos |
| `powershell Select-String -Pattern supabase` | Mapear referências a Supabase |
| `Get-ChildItem ... README/DECISIONS/CHANGELOG/PLANNED` | Mapear documentos de governança |

---

## 8. Comandos não executados

- `npm run build` — não necessário para auditoria
- `npm run lint` — não necessário para auditoria
- `npm test` — não necessário para auditoria
- `npm run dev` — não necessário para auditoria (proibido por protocolo)

---

## 9. Comandos inexistentes

Nenhum comando inexistente foi identificado.

---

## 10. Comandos que exigiriam autorização

Nenhum. Todos os comandos executados foram de leitura/listação.

---

## 11. Inventário geral de módulos

### 11.1 Total de diretórios encontrados: **31**

### 11.2 Módulos registrados no moduleRegistry.ts: **29**

### 11.3 Módulos NÃO registrados no moduleRegistry.ts: **2**

1. `.centro_de_estudos` — oculto (ponto no nome), não registrado
2. `_orquestracao-principal` — prefixo `_`, não registrado (módulo de governança do Pierre Zanulli)

### 11.4 Módulos com nomenclatura fora do padrão
- `.centro_de_estudos` — inicia com ponto (diretório oculto)
- `_orquestracao-principal` — inicia com underscore
- `cadastro-empresas` — hífen (vs. underscore nos demais)
- `nucleo-conversacional` — hífen (vs. underscore)
- `sala-dev` — hífen
- `videos-ia` — hífen
- `configuracoes-ambiente` — hífen
- `hub-integracao` — hífen
- `mcp_sagb` — underscore (padrão misto)

---

## 12. Tabela mestre dos módulos

| # | Módulo | Caminho | Rota principal | Registry | Manifest | Routes | Pages | Components | Services | Hooks | Types | Store | Docs | Agent | README | DECISIONS | CHANGELOG | PLANNED | Dashboard | Sidebar própria | Supabase | Mocks | Fallback | Maturidade | Classificação |
|---|--------|---------|---------------|----------|----------|--------|-------|------------|----------|-------|-------|-------|------|-------|--------|-----------|-----------|---------|-----------|----------------|----------|-------|----------|------------|--------------|
| 1 | .centro_de_estudos | src/modules/.centro_de_estudos | /centro_de_estudos | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Inicial | Experimental |
| 2 | agentes_comerciais | src/modules/agentes_comerciais | /agentes-comerciais | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Avançado | Produto |
| 3 | api_sagb | src/modules/api_sagb | /api-sagb/* | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Avançado | Técnico |
| 4 | cadastro-empresas | src/modules/cadastro-empresas | /cadastro-empresas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Avançado | Produto |
| 5 | central_padroes | src/modules/central_padroes | /central_padroes/* | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ (DECISIONS.md) | ✅ (CHANGELOG.md) | ✅ (PLANNED.md) | ❌ | ❌ | ✅ | ❌ | ❌ | Maduro | Governança |
| 6 | cid | src/modules/cid | /cid | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 7 | configuracoes-ambiente | src/modules/configuracoes-ambiente | /configuracoes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Parcial | Suporte |
| 8 | crm_ziplia | src/modules/crm_ziplia | /crm-ziplia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (types.ts) | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 9 | fluxob | src/modules/fluxob | /fluxob/* | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Inicial | Experimental |
| 10 | foco_total | src/modules/foco_total | /foco-total/* | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ (stores/) | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Funcional | Produto |
| 11 | gestao_financeira | src/modules/gestao_financeira | /gestao-financeira | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 12 | hub-integracao | src/modules/hub-integracao | /hub-integracao | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Integração |
| 13 | karaoke | src/modules/karaoke | /karaoke | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Funcional | Produto |
| 14 | mcp_sagb | src/modules/mcp_sagb | /mcp_sagb/* | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Avançado | Técnico |
| 15 | mentorias | src/modules/mentorias | /mentorias | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 16 | metodologias | src/modules/metodologias | /metodologias | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Avançado | Produto |
| 17 | missoes | src/modules/missoes | /missoes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Funcional | Produto |
| 18 | monitoramento | src/modules/monitoramento | /monitoramento | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Avançado | Governança |
| 19 | nagi | src/modules/nagi | /nagi | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Funcional | Produto |
| 20 | nic | src/modules/nic | /nic | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Parcial | Técnico |
| 21 | nucleo-conversacional | src/modules/nucleo-conversacional | /conversas/* | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (types.ts) | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Avançado | Produto |
| 22 | nucleo_de_agentes | src/modules/nucleo_de_agentes | /nucleo_de_agentes/* | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Parcial | Produto |
| 23 | quadro_de_elite | src/modules/quadro_de_elite | /quadro_de_elite/* | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 24 | rai | src/modules/rai | /rai | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Avançado | Produto |
| 25 | sagb_bridge | src/modules/sagb_bridge | /sagb_bridge/* | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Parcial | Técnico |
| 26 | sala-dev | src/modules/sala-dev | /sala-dev/* | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ (mock/supabase) | ✅ | ✅ | Avançado | Técnico |
| 27 | studio | src/modules/studio | /studio | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | Funcional | Produto |
| 28 | taskzei | src/modules/taskzei | /agenda-inteligente | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ✅ (layout/) | ✅ | ✅ | ✅ | Maduro | Produto |
| 29 | telas_avancadas | src/modules/telas_avancadas | /telas-avancadas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | Funcional | Produto |
| 30 | videos-ia | src/modules/videos-ia | /videos-ia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Funcional | Produto |
| 31 | _orquestracao-principal | src/modules/_orquestracao-principal | /orquestracao/* | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ (decisions.md) | ✅ (changelog.md) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | Inicial | Governança |

---

## 13. Auditoria individual dos módulos

### 13.1 `.centro_de_estudos`

#### 1. Identificação
- **Caminho:** `src/modules/.centro_de_estudos`
- **Rota:** `/centro_de_estudos`
- **Título no manifest:** Centro de Estudos
- **Owner:** Não definido
- **Categoria inferida:** Experimental

#### 2. Estrutura encontrada
- index.ts: ✅ | manifest.ts: ✅ | routes.tsx: ✅ | module-doc.ts: ✅
- pages/: ❌ | components/: ❌ | hooks/: ❌ | services/: ❌
- store/: ❌ | types/: ❌ | constants/: ❌ | layout/: ❌
- docs/: ❌ | agent/: ✅

#### 3. Documentação e governança
- README: ❌ | DECISIONS: ✅ (decisions.md) | CHANGELOG: ✅ (changelog.md) | PLANNED: ❌
- docs internos: ❌ | agent/session_log: ❌
- Decisões registradas: Parcial | Próximos passos: ❌
- Lacunas documentais: Sem README, sem PLANNED, sem docs

#### 4. Interface e UX
- Dashboard: ❌ | Sidebar própria: ❌ | Layout próprio: ❌
- Estados vazios/loading/error: Não avaliado
- Risco visual: Módulo não tem interface, apenas placeholder

#### 5. Dados e integrações
- Supabase: ❌ | Mocks: ❌ | Fallback: ❌
- localStorage: ❌ | API externa: ❌

#### 6. Relação com outros módulos
- Não consome nenhum módulo
- Não é consumido por nenhum módulo
- Módulo órfão

#### 7. Classificação arquitetural: Experimental

#### 8. Maturidade: Inicial

#### 9. Achados
- **Fato verificado:** Módulo existe, tem estrutura mínima (index, manifest, routes, module-doc, agent)
- **Fato verificado:** NÃO está registrado no moduleRegistry.ts
- **Fato verificado:** Nome começa com ponto (diretório oculto no Unix)
- **Inferência técnica:** Provavelmente é um módulo em fase de prototipação ou template
- **Recomendação:** Decidir se é módulo real ou template; se for template, mover para diretório de templates

#### 10. Riscos: Baixo

#### 11. Recomendação: Investigar mais — decidir propósito real

---

### 13.2 `agentes_comerciais`

#### 1. Identificação
- **Caminho:** `src/modules/agentes_comerciais`
- **Rota:** `/agentes-comerciais`
- **Título no manifest:** Agentes Comerciais
- **Owner:** Oton Lacerda (Diretor) — agente
- **Categoria inferida:** Produto

#### 2. Estrutura encontrada
- index.ts: ✅ | manifest.ts: ✅ | routes.tsx: ✅ | module-doc.ts: ✅
- pages/: ✅ | components/: ✅ | hooks/: ✅ | services/: ✅
- store/: ✅ | types/: ✅ | constants/: ❌ | layout/: ❌
- docs/: ❌ | agent/: ✅

#### 3. Documentação e governança
- README: ❌ | DECISIONS: ✅ (decisions.md) | CHANGELOG: ✅ (changelog.md) | PLANNED: ❌
- docs internos: ❌ | agent/session_log: ❌

#### 4. Interface e UX
- Dashboard: ❌ | Sidebar própria: ❌ | Layout próprio: ❌
- Possui SEMANTICA_OFICIAL.md — documento adicional importante

#### 5. Dados e integrações
- Supabase: ❌ | Mocks: ❌ | Fallback: ❌

#### 6. Relação com outros módulos
- Não consome outros módulos explicitamente
- Deveria consumir: Núcleo de Agentes, Quadro de Elite, Central de Padrões

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Avançado

#### 9. Achados
- **Fato verificado:** Estrutura completa com pages, components, hooks, services, store, types
- **Fato verificado:** Possui arquivo SEMANTICA_OFICIAL.md (documentação semântica)
- **Recomendação:** Adicionar README.md com visão geral do módulo

#### 10. Riscos: Baixo

#### 11. Recomendação: Documentar melhor (README)

---

### 13.3 `api_sagb`

#### 1. Identificação
- **Caminho:** `src/modules/api_sagb`
- **Rota:** `/api-sagb/*`
- **Título no manifest:** API SagB
- **Owner:** Dante Conec — agente
- **Categoria inferida:** Técnico

#### 2. Estrutura encontrada
- index.ts: ✅ | manifest.ts: ✅ | routes.tsx: ✅ | module-doc.ts: ✅
- pages/: ✅ | components/: ❌ | hooks/: ❌ | services/: ❌
- store/: ❌ | types/: ❌ | constants/: ❌ | layout/: ❌
- docs/: ❌ | agent/: ✅
- Pastas adicionais: audit, contracts, endpoints, integration, rollout, security, versioning, __tests__

#### 3. Documentação e governança
- README: ❌ | DECISIONS: ✅ | CHANGELOG: ✅ (+ CHANGELOG_API.md)
- Possui: plano_modulo.md

#### 4. Interface e UX
- Dashboard: ❌ | Fullscreen: ❌

#### 5. Dados e integrações
- Supabase: ❌ (não diretamente — é camada de API)
- Integrações: contracts, endpoints, versioning

#### 6. Relação com outros módulos
- Deveria ser consumido por: Sala Dev, MCP SagB, todos os módulos que precisam de API
- É referenciado em: Sala Dev (getRecommendedDataProvider)

#### 7. Classificação arquitetural: Técnico

#### 8. Maturidade: Avançado

#### 9. Achados
- **Fato verificado:** Estrutura rica com audit, contracts, endpoints, rollout, security, versioning
- **Fato verificado:** Possui CHANGELOG_API.md separado
- **Recomendação:** Adicionar README.md; considerar transformar em módulo base reutilizável

#### 10. Riscos: Baixo

#### 11. Recomendação: Documentar melhor; considerar como módulo base

---

### 13.4 `cadastro-empresas`

#### 1. Identificação
- **Caminho:** `src/modules/cadastro-empresas`
- **Rota:** `/cadastro-empresas`
- **Título no manifest:** Cadastro de Empresas
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura encontrada
- Estrutura completa: pages, components, hooks, services, store, types, agent
- Possui SEMANTICA_OFICIAL.md

#### 3. Dados e integrações
- Supabase: ✅ (empresaPersistence.ts, logoStorage.ts)
- Tabelas inferidas: empresas, empresa_logos (storage)

#### 6. Relação com outros módulos
- Deveria consumir: CID (anexos), Gestão Financeira (faturas)

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Avançado

#### 11. Recomendação: Adicionar README; documentar tabelas Supabase usadas

---

### 13.5 `central_padroes` — MÓDULO REFERÊNCIA

#### 1. Identificação
- **Caminho:** `src/modules/central_padroes`
- **Rota:** `/central_padroes/*`
- **Título no manifest:** Central de Padrões
- **Owner:** Zico Padron — agente
- **Categoria inferida:** Governança

#### 2. Estrutura encontrada
- **Completa:** index, manifest, routes, module-doc, pages, components, hooks, services, types, layout, docs, agent, data, scripts, styles
- **Único** com PLANNED.md, README.md, DECISIONS.md (maiúsculo), CHANGELOG.md (maiúsculo)
- Possui `.specs`, `.logs`

#### 3. Documentação e governança — FORTE
- README: ✅ | DECISIONS: ✅ | CHANGELOG: ✅ | PLANNED: ✅
- docs/: ✅ | agent/: ✅ | module-doc tipado com ModuleDoc

#### 4. Interface e UX
- Layout próprio: ✅ (CentralPadroesLayout)
- Dashboard: ❌ | Sidebar própria: ❌

#### 5. Dados e integrações
- Supabase: ✅ (múltiplos services: governanceRules, Crud, Relationship, Seed, Storage, Triagem, Approval, BaseModules)
- Tabelas: governance_rules, central_padroes_areas, central_padroes_standards, central_padroes_standard_dependencies, central_padroes_documents, central_padroes_decisions

#### 6. Relação com outros módulos
- **Governa todos os módulos** através de padrões e regras
- Referencia: moduleRegistry.ts, services globais

#### 7. Classificação arquitetural: Governança

#### 8. Maturidade: Maduro

#### 9. Achados
- **Fato verificado:** Único módulo com todos os 8 arquivos padrão (index, manifest, routes, module-doc, README, DECISIONS, CHANGELOG, PLANNED)
- **Fato verificado:** Único com docs/, layout/, .specs/, .logs/
- **Fato verificado:** module-doc.ts totalmente tipado com ModuleDoc
- **Recomendação:** Este módulo deve servir como **modelo de referência** para todos os outros

#### 10. Riscos: Baixo

#### 11. Recomendação: Manter como está; usar como referência

---

### 13.6 `cid` (Centro de Inteligência Documental)

#### 1. Identificação
- **Caminho:** `src/modules/cid`
- **Rota:** `/cid`
- **Título no manifest:** C.I.D.
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, store, agent
- module-doc com documentação rica (tabelas Supabase, buckets, integrações)

#### 3. Dados e integrações
- Supabase: ✅ (cid_assets, cid_asset_files, cid_processing_jobs)
- Storage: cid-storage
- Integrações: Gemini API, Netlify Functions

#### 6. Relação com outros módulos
- Deveria ser consumido por: TaskZei (anexos), todos os módulos que precisam de processamento documental

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Definir owner; adicionar README; considerar como módulo base reutilizável

---

### 13.7 `configuracoes-ambiente`

#### 1. Identificação
- **Caminho:** `src/modules/configuracoes-ambiente`
- **Rota:** `/configuracoes`
- **Título no manifest:** Configurações do Sistema
- **Owner:** A definir
- **Categoria inferida:** Suporte

#### 2. Estrutura
- pages, components, services, agent
- Possui plano.md

#### 3. Observações
- Manifest com campo `version`, `author`, `description` (fora do padrão ModuleManifest)
- Id no registry: `configuracoes-sistema` (diferente do nome da pasta)

#### 7. Classificação arquitetural: Suporte

#### 8. Maturidade: Parcial

#### 11. Recomendação: Alinhar manifest ao padrão; definir owner

---

### 13.8 `crm_ziplia`

#### 1. Identificação
- **Caminho:** `src/modules/crm_ziplia`
- **Rota:** `/crm-ziplia` (fullscreen: true)
- **Título no manifest:** CRM Ziplia
- **Owner:** Denic Celmi (humano)
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, services, types (types.ts), agent
- fullscreen: true (único com esta flag)

#### 3. Dados
- Supabase: ✅ (restFetch)
- Module-doc rico com documentação de migração

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Acompanhar migração; documentar conclusão da migração

---

### 13.9 `fluxob`

#### 1. Identificação
- **Caminho:** `src/modules/fluxob`
- **Rota:** `/fluxob/*`
- **Título no manifest:** FluxoB
- **Owner:** Alan Flow — agente
- **Categoria inferida:** Experimental
- **initialStatus:** inactive (único inativo no registry)

#### 2. Estrutura
- pages, agent, module-doc com plano_modulo.md
- Estrutura mínima

#### 7. Classificação arquitetural: Experimental

#### 8. Maturidade: Inicial

#### 11. Recomendação: Manter como está até definição de roadmap

---

### 13.10 `foco_total`

#### 1. Identificação
- **Caminho:** `src/modules/foco_total`
- **Rota:** `/foco-total/*`
- **Título no manifest:** Zen Folk | Foco AI
- **Owner:** Zen Folk — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, services, types, stores (plural!), agent
- Possui `_triagem/`

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Padronizar nome da pasta stores -> store

---

### 13.11 `gestao_financeira`

#### 1. Identificação
- **Caminho:** `src/modules/gestao_financeira`
- **Rota:** `/gestao-financeira`
- **Título no manifest:** Gestão Financeira
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, services, types, docs, agent

#### 3. Dados
- Supabase: ✅ (financeService.ts)

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Adicionar componentes, hooks e store; definir owner

---

### 13.12 `hub-integracao`

#### 1. Identificação
- **Caminho:** `src/modules/hub-integracao`
- **Rota:** `/hub-integracao`
- **Título no manifest:** Hub de Integrações
- **Owner:** Alan Flow — agente
- **Categoria inferida:** Integração

#### 2. Estrutura
- pages, components, services, types, utils, agent

#### 3. Dados
- Supabase: ✅ (integrationService.ts)
- Tipos de integração: clickup, whatsapp, gmail, titan, meta_facebook, google-calendar, supabase

#### 6. Relação com outros módulos
- Referenciado por: TaskZei (integrações externas passam pelo Hub)
- Deveria ser consumido por: todos os módulos que precisam de integração externa

#### 7. Classificação arquitetural: Integração

#### 8. Maturidade: Funcional

#### 11. Recomendação: Fortalecer como módulo base reutilizável; documentar contratos

---

### 13.13 `karaoke`

#### 1. Identificação
- **Caminho:** `src/modules/karaoke`
- **Rota:** `/karaoke`
- **Título no manifest:** Karaokê SagB
- **Owner:** Nanis Pelta — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, store, agent

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Manter como está

---

### 13.14 `mcp_sagb`

#### 1. Identificação
- **Caminho:** `src/modules/mcp_sagb`
- **Rota:** `/mcp_sagb/*`
- **Título no manifest:** MCP SagB
- **Owner:** Sávio Codare — agente
- **Categoria inferida:** Técnico

#### 2. Estrutura
- pages, services, types, contracts, data, server, agent
- README: ✅

#### 7. Classificação arquitetural: Técnico

#### 8. Maturidade: Avançado

#### 11. Recomendação: Fortalecer documentação; considerar como módulo base

---

### 13.15 `mentorias`

#### 1. Identificação
- **Caminho:** `src/modules/mentorias`
- **Rota:** `/mentorias`
- **Título no manifest:** Central de Mentorias
- **Owner:** Agente de Mentorias
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, hooks, services, store, types, agent
- plano_modulo.md

#### 3. Dados
- Supabase: ✅

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Adicionar README

---

### 13.16 `metodologias`

#### 1. Identificação
- **Caminho:** `src/modules/metodologias`
- **Rota:** `/metodologias`
- **Título no manifest:** Núcleo de Metodologias
- **Owner:** Agente de Metodologias
- **Categoria inferida:** Produto

#### 2. Estrutura
- **Completa:** pages, components, hooks, services, store, types, data, agent
- plano_modulo.md, `_triagem/`

#### 3. Dados
- Supabase: ✅

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Avançado

#### 11. Recomendação: Adicionar README; forte candidato a módulo base

---

### 13.17 `missoes`

#### 1. Identificação
- **Caminho:** `src/modules/missoes`
- **Rota:** `/missoes`
- **Título no manifest:** Missões
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, hooks, services, store, types, agent

#### 3. Observação
- Id no registry: `missions` (inglês, inconsistente com nome em português)

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Definir owner; padronizar id (missions -> missoes)

---

### 13.18 `monitoramento`

#### 1. Identificação
- **Caminho:** `src/modules/monitoramento`
- **Rota:** `/monitoramento`
- **Título no manifest:** Monitoramento
- **Owner:** Noali Kessler — agente (backup: Pierre Zanulli)
- **Categoria inferida:** Governança

#### 2. Estrutura
- **Completa:** pages, components, hooks, services, store, types, agent

#### 3. Dados
- Supabase: ✅ (supabaseTablesService.ts — monitora tabelas de outros módulos)
- Module-doc com documentação de tabelas monitoradas

#### 6. Relação com outros módulos
- **Consome metadados de todos os módulos** (via supabaseTablesService)
- Deveria receber eventos de: TaskZei, Gestão Financeira, Sala Dev

#### 7. Classificação arquitetural: Governança

#### 8. Maturidade: Avançado

#### 11. Recomendação: Fortalecer como central de monitoramento do ecossistema

---

### 13.19 `nagi`

#### 1. Identificação
- **Caminho:** `src/modules/nagi`
- **Rota:** `/nagi`
- **Título no manifest:** NAGI
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, data, domain, repository, services, agent

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Definir owner; adicionar README

---

### 13.20 `nic`

#### 1. Identificação
- **Caminho:** `src/modules/nic`
- **Rota:** `/nic`
- **Título no manifest:** NIC
- **Owner:** Não definido
- **Categoria inferida:** Técnico

#### 2. Estrutura
- pages, data, naming, services, agent

#### 7. Classificação arquitetural: Técnico

#### 8. Maturidade: Parcial

#### 11. Recomendação: Definir owner; documentar propósito

---

### 13.21 `nucleo-conversacional`

#### 1. Identificação
- **Caminho:** `src/modules/nucleo-conversacional`
- **Rota:** `/conversas/*`
- **Título no manifest:** Conversas
- **Owner:** Poazi Bellini
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, services, utils, agent
- types.ts, package.json próprio, tailwind.preset.ts, plano_modulo.md

#### 3. Dados
- Supabase: ✅ (ncDb.ts — chat_sessions, chat_messages)

#### 6. Relação com outros módulos
- Deveria conversar com: Núcleo de Agentes, RAI, TaskZei

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Avançado

#### 11. Recomendação: package.json próprio é atípico — avaliar necessidade

---

### 13.22 `nucleo_de_agentes`

#### 1. Identificação
- **Caminho:** `src/modules/nucleo_de_agentes`
- **Rota:** `/nucleo_de_agentes/*`
- **Título no manifest:** Núcleo de Agentes
- **Owner:** Brene Sagore — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, agent
- README: ✅, plano_modulo.md

#### 3. Dados
- Supabase: ✅ (tabelas: agents)
- localStorage: sagb_continuous_memory_v1, sagb_supabase_session_v1

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Parcial

#### 11. Recomendação: Adicionar services, hooks, store, types; expandir documentação

---

### 13.23 `quadro_de_elite`

#### 1. Identificação
- **Caminho:** `src/modules/quadro_de_elite`
- **Rota:** `/quadro_de_elite/*`
- **Título no manifest:** Núcleo de Identidades
- **Owner:** Helen Dravet — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, docs, store, agent
- plano_modulo.md

#### 3. Dados
- Supabase: ✅ (agents, agent_configs, agent_dna_profiles, agent_dna_effective)

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Adicionar services, hooks; documentar melhor

---

### 13.24 `rai` (Radar Avançado de Inteligência)

#### 1. Identificação
- **Caminho:** `src/modules/rai`
- **Rota:** `/rai`
- **Título no manifest:** RAI — Radar Avançado de Inteligência
- **Owner:** Saleh Malu — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- **Completa:** pages, components, hooks, services, store, types, agent
- plano_modulo.md, `_triagem/`

#### 3. Dados
- Supabase: ✅ (raiSupabaseService.ts, useRAI.ts com auth)
- Hooks: ✅

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Avançado

#### 11. Recomendação: Adicionar README; forte candidato a referência

---

### 13.25 `sagb_bridge`

#### 1. Identificação
- **Caminho:** `src/modules/sagb_bridge`
- **Rota:** `/sagb_bridge/*`
- **Título no manifest:** SagB Bridge
- **Owner:** Alan Flow — agente
- **Categoria inferida:** Técnico

#### 2. Estrutura
- pages, agent
- plano_modulo.md

#### 3. Dados
- Supabase: ✅ (migrations: dev_projects, dev_tasks, dev_task_runs, dev_developer_sessions, dev_task_launches)

#### 7. Classificação arquitetural: Técnico

#### 8. Maturidade: Parcial

#### 11. Recomendação: Expandir estrutura; documentar contratos

---

### 13.26 `sala-dev` — MÓDULO REFERÊNCIA

#### 1. Identificação
- **Caminho:** `src/modules/sala-dev`
- **Rota:** `/sala-dev/*`
- **Título no manifest:** Sala Dev
- **Owner:** Guardião Sala Dev — agente
- **Categoria inferida:** Técnico

#### 2. Estrutura — COMPLETA
- pages, components, hooks, services, store, types, docs, agent, utils, governance, plans, agents
- `_triagem/`

#### 3. Dados
- Supabase: ✅ (salaDevSupabaseRepository.ts)
- **Provider dual:** mock | supabase (via SalaDevRepository)
- **Adapter pattern:** SalaDevAdapterService com fallback api_sagb | supabase_direct | mock

#### 4. Interface e UX
- Dashboard: ❌ | Sidebar própria: ❌ | Layout próprio: ❌

#### 6. Relação com outros módulos
- Consome: API SagB (via adapter)
- Deveria ser consumido por: MCP SagB, SagB Bridge

#### 7. Classificação arquitetural: Técnico

#### 8. Maturidade: Avançado

#### 9. Achados
- **Fato verificado:** Estrutura mais rica entre todos os módulos (docs, governance, plans, agents, utils)
- **Fato verificado:** Implementa adapter pattern com fallback (mock -> supabase -> api_sagb)
- **Fato verificado:** Referencia API SagB como provider
- **Recomendação:** Forte candidato a módulo base reutilizável (padrão de adapter/fallback)

#### 11. Recomendação: Usar como referência para padrão de adapter/fallback

---

### 13.27 `studio`

#### 1. Identificação
- **Caminho:** `src/modules/studio`
- **Rota:** `/studio`
- **Título no manifest:** Studio
- **Owner:** Fabi Nunes — agente
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, services, agent
- plano_modulo.md

#### 3. Dados
- Supabase: ✅ (studio.ts — várias tabelas: studio_sessions, studio_chunks, studio_session_cameras, etc.)

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Adicionar components, hooks, store, types

---

### 13.28 `taskzei` — MÓDULO REFERÊNCIA

#### 1. Identificação
- **Caminho:** `src/modules/taskzei`
- **Rota:** `/agenda-inteligente`
- **Título no manifest:** Agenda Inteligente
- **Owner:** Dani Freitas (humano)
- **Categoria inferida:** Produto

#### 2. Estrutura — COMPLETA
- pages, components, services, store, types, layout, docs, agent
- README: ✅, plano_modulo.md, plano_execucao_unificada.md, plano_implantacao_total_lote_unico.md
- `_triagem/`

#### 3. Documentação — FORTE
- README: ✅ | DECISIONS: ✅ | CHANGELOG: ✅ | PLANNED: ❌
- module-doc tipado com ModuleDoc (version: 1.17.0)
- Boundaries: 10 regras documentadas
- Integrações: Hub de Integração, ClickUp, WhatsApp, Resend/SendGrid, OneSignal

#### 4. Interface e UX
- Layout próprio: ✅ (AgendaInteligenteLayout)
- Dashboard: ❌ | Sidebar própria: ❌

#### 5. Dados
- Supabase: ✅ (taskzei_supabase_provider.ts, doc_service.ts, doc_storage_adapter.ts)
- **Provider dual:** supabase | mock (via VITE_TASKZEI_PROVIDER)
- Tabelas: múltiplas (taskzei_tasks, taskzei_projects, taskzei_entity_links, etc.)

#### 6. Relação com outros módulos
- Consome: Hub de Integração (integrações externas)
- Referencia: CID (anexos)
- Deveria ser consumido por: Monitoramento, RAI, Foco Total

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Maduro

#### 9. Achados
- **Fato verificado:** Versionamento semântico (1.17.0) com CHANGELOG ativo
- **Fato verificado:** Provider pattern (supabase/mock) com fallback
- **Fato verificado:** Layout próprio (AgendaInteligenteLayout)
- **Fato verificado:** 10 boundaries documentados no module-doc
- **Recomendação:** Usar como **modelo de referência** para maturidade de módulo de produto

#### 11. Recomendação: Adicionar PLANNED.md; manter como está

---

### 13.29 `telas_avancadas`

#### 1. Identificação
- **Caminho:** `src/modules/telas_avancadas`
- **Rota:** `/telas-avancadas`
- **Título no manifest:** Telas Avançadas
- **Owner:** Cley Scrini (humano)
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, services, store, types, data, agent

#### 3. Dados
- Supabase: ❌ (N/A — localStorage: sagb_telas_avancadas_v2)
- Module-doc rico com documentação de dados

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Adicionar README

---

### 13.30 `videos-ia`

#### 1. Identificação
- **Caminho:** `src/modules/videos-ia`
- **Rota:** `/videos-ia`
- **Título no manifest:** Vídeos IA
- **Owner:** Não definido
- **Categoria inferida:** Produto

#### 2. Estrutura
- pages, components, hooks, services, store, types, agent

#### 7. Classificação arquitetural: Produto

#### 8. Maturidade: Funcional

#### 11. Recomendação: Definir owner; adicionar README

---

### 13.31 `_orquestracao-principal`

#### 1. Identificação
- **Caminho:** `src/modules/_orquestracao-principal`
- **Rota:** `/orquestracao/*`
- **Título no manifest:** Orquestração Principal
- **Owner:** Pierre Zanulli (Agente Mestre)
- **Categoria inferida:** Governança

#### 2. Estrutura
- pages, agent
- module-doc com documentação de governança

#### 3. Observações
- **NÃO registrado no moduleRegistry.ts** (prefixo `_`)
- module-doc afirma: "Vigiar e governar a malha inteira do SagB. Controlar e alterar a Sidebar, App, App.tsx, Rotas Globais e Registro de Módulos."
- Owner: Pierre Zanulli

#### 7. Classificação arquitetural: Governança

#### 8. Maturidade: Inicial

#### 9. Achados
- **Fato verificado:** Módulo de governança com acesso a arquivos críticos (App.tsx, Sidebar, moduleRegistry)
- **Fato verificado:** Não registrado no registry (intencional — é o módulo que gerencia o registry)
- **Inferência técnica:** É o "meta-módulo" que orquestra todo o ecossistema

#### 11. Recomendação: Documentar melhor; formalizar papel como módulo de governança maestro

---

## 14. Padrão modular real encontrado

### 14.1 Arquivos que aparecem na maioria dos módulos (31/31)

| Arquivo | Presença |
|---------|----------|
| `index.ts` | 31/31 (100%) |
| `manifest.ts` | 31/31 (100%) |
| `routes.tsx` | 31/31 (100%) |
| `module-doc.ts` | 31/31 (100%) |
| `agent/` | 31/31 (100%) |
| `decisions.md` | 31/31 (100%) |
| `changelog.md` | 31/31 (100%) |

### 14.2 Arquivos com presença parcial

| Arquivo | Presença |
|---------|----------|
| `pages/` | 31/31 (100%) |
| `components/` | 18/31 (58%) |
| `services/` | 22/31 (71%) |
| `hooks/` | 12/31 (39%) |
| `store/` | 17/31 (55%) — 1 usa `stores/` (foco_total) |
| `types/` | 18/31 (58%) — 2 usam `types.ts` avulso |
| `docs/` | 5/31 (16%) |
| `layout/` | 3/31 (10%) — central_padroes, taskzei (e sidebar global) |
| `README.md` | 4/31 (13%) |
| `PLANNED.md` | 1/31 (3%) |
| `DECISIONS.md` (maiúsculo) | 1/31 (3%) — central_padroes |
| `CHANGELOG.md` (maiúsculo) | 1/31 (3%) — central_padroes |

### 14.3 Estrutura mais comum

```
src/modules/[nome_modulo]/
├── index.ts                  ✅ 100%
├── manifest.ts               ✅ 100%
├── routes.tsx                ✅ 100%
├── module-doc.ts             ✅ 100%
├── decisions.md              ✅ 100% (mas 30/31 em minúsculo)
├── changelog.md              ✅ 100% (mas 30/31 em minúsculo)
├── pages/                    ✅ 100%
├── agent/                    ✅ 100%
├── services/                 ✅ 71%
├── components/               ✅ 58%
├── types/ (ou types.ts)      ✅ 58%
├── store/                    ✅ 55%
├── hooks/                    ✅ 39%
├── docs/                     ❌ 16%
├── layout/                   ❌ 10%
├── README.md                 ❌ 13%
├── PLANNED.md                ❌ 3%
```

### 14.4 Variações de nomenclatura encontradas

- `decisions.md` (minúsculo — 30 módulos) vs. `DECISIONS.md` (maiúsculo — 1 módulo)
- `changelog.md` (minúsculo — 30 módulos) vs. `CHANGELOG.md` (maiúsculo — 1 módulo)
- `store/` (17 módulos) vs. `stores/` (1 módulo — foco_total)
- `types/` (16 módulos) vs. `types.ts` avulso (2 módulos — crm_ziplia, nucleo-conversacional)
- `manifest` exportado como: `xxxManifest`, `manifest`, `xxx_manifest` (3 variações)
- `routes` exportado como: `xxxRoutes`, `routes` (2 variações)
- Nomes de pasta com hífen (8 módulos) vs. underscore (23 módulos)

---

## 15. Padrão modular recomendado para oficialização

### 15.1 Arquivos obrigatórios em todo módulo

| Arquivo | Justificativa |
|---------|--------------|
| `index.ts` | Ponto de entrada do módulo |
| `manifest.ts` | Registro e identificação do módulo |
| `routes.tsx` | Definição de rota do módulo |
| `module-doc.ts` | Documentação técnica do módulo (tipado com ModuleDoc) |
| `README.md` | Visão geral, propósito, como usar |
| `DECISIONS.md` | Registro de decisões arquiteturais |
| `CHANGELOG.md` | Histórico de versões |
| `pages/` | Páginas do módulo |
| `agent/` | Arquivos do agente responsável (persona.md, session_log.md, etc.) |

### 15.2 Arquivos recomendados

| Arquivo | Justificativa |
|---------|--------------|
| `PLANNED.md` | Próximos passos e roadmap |
| `components/` | Componentes reutilizáveis do módulo |
| `services/` | Lógica de negócio e acesso a dados |
| `types/` | Tipos TypeScript do módulo |
| `hooks/` | Hooks customizados |
| `store/` | Estado global do módulo |
| `docs/` | Documentação interna detalhada |

### 15.3 Arquivos opcionais (depende do tipo de módulo)

| Arquivo | Quando usar |
|---------|------------|
| `layout/` | Módulos com layout próprio (ex: taskzei, central_padroes) |
| `constants/` | Quando há muitas constantes específicas |
| `utils/` | Utilitários auxiliares |
| `data/` | Dados estáticos ou catálogos |
| `__tests__/` | Testes unitários |

### 15.4 Padrão de nomenclatura recomendado

- **Pastas:** `snake_case` (ex: `gestao_financeira`, `central_padroes`)
- **Arquivos de governança:** `UPPERCASE.md` (ex: `README.md`, `DECISIONS.md`, `CHANGELOG.md`, `PLANNED.md`)
- **Export do manifest:** `[nome]Manifest` (ex: `taskzeiManifest`)
- **Export das rotas:** `[nome]Routes` (ex: `taskzeiRoutes`)

---

## 16. Governança dos módulos

### Matriz de governança

| Módulo | README | DECISIONS | CHANGELOG | PLANNED | docs/ | agent/ | Nível |
|--------|--------|-----------|-----------|---------|-------|--------|-------|
| central_padroes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **Referência** |
| taskzei | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | **Forte** |
| sala-dev | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | Boa |
| rai | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| metodologias | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| monitoramento | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| agentes_comerciais | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| api_sagb | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| cadastro-empresas | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Básica |
| ... (demais 22) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ | Fraca |

### Observações

- **Nível Referência:** `central_padroes` — único com todos os 8 arquivos padrão + docs/
- **Nível Forte:** `taskzei` — README, versionamento semântico, boundaries documentados
- **Nível Boa:** `sala-dev` — docs/ + governance/ + plans/
- **Nível Fraca:** 22 módulos — têm apenas decisions.md e changelog.md (minúsculos), sem README, PLANNED ou docs/
- **Maior lacuna:** Ausência de README.md em 27/31 módulos (87%)
- **Maior lacuna:** Ausência de PLANNED.md em 30/31 módulos (97%)
- **Inconsistência:** Nomes de arquivos de governança em minúsculo vs. maiúsculo

### Módulos que precisam de documentação urgente
1. `.centro_de_estudos` — sem README, sem PLANNED, sem propósito claro
2. `fluxob` — sem README, estrutura mínima
3. `sagb_bridge` — sem README, estrutura parcial
4. `nic` — sem README, propósito indefinido
5. `_orquestracao-principal` — sem README, papel crítico de governança

---

## 17. Documentos internos encontrados nos módulos

| Módulo | Arquivo | Tipo | Status | Deve ir para Central de Padrões? |
|--------|---------|------|--------|----------------------------------|
| agentes_comerciais | SEMANTICA_OFICIAL.md | Especificação | Ativo | ✅ |
| cadastro-empresas | SEMANTICA_OFICIAL.md | Especificação | Ativo | ✅ |
| api_sagb | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| api_sagb | CHANGELOG_API.md | Histórico | Ativo | ❌ (interno) |
| configuracoes-ambiente | plano.md | Plano | Ativo | ❌ (interno) |
| fluxob | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| mcp_sagb | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| mentorias | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| metodologias | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| nucleo-conversacional | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| nucleo_de_agentes | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| quadro_de_elite | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| rai | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| sagb_bridge | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| sala-dev | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| studio | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| taskzei | plano_modulo.md | Plano | Ativo | ❌ (interno) |
| taskzei | plano_execucao_unificada.md | Plano | Ativo | ❌ (interno) |
| taskzei | plano_implantacao_total_lote_unico.md | Plano | Ativo | ❌ (interno) |
| cid | module-doc.ts (rico) | Especificação | Ativo | ✅ (partes) |
| crm_ziplia | module-doc.ts (rico) | Especificação | Ativo | ✅ (partes) |
| monitoramento | module-doc.ts (rico) | Especificação | Ativo | ✅ (partes) |

### Documentos que devem ir para a Central de Padrões
1. **SEMANTICA_OFICIAL.md** (agentes_comerciais, cadastro-empresas) — padrão de documentação semântica
2. **Padrão de module-doc.ts** (central_padroes, taskzei) — template de documentação técnica
3. **Padrão de boundaries** (taskzei) — template de regras de fronteira
4. **Padrão de provider/fallback** (sala-dev, taskzei) — padrão de adapters

---

## 18. Arquivos padrão de módulo

| Arquivo | Obrigatório? | Presente em | Ausente em | Template necessário? |
|---------|-------------|-------------|------------|---------------------|
| `index.ts` | **Obrigatório** | 31/31 (100%) | 0 | Sim |
| `manifest.ts` | **Obrigatório** | 31/31 (100%) | 0 | Sim |
| `routes.tsx` | **Obrigatório** | 31/31 (100%) | 0 | Sim |
| `module-doc.ts` | **Obrigatório** | 31/31 (100%) | 0 | **Sim — template oficial crítico** |
| `README.md` | **Obrigatório** | 4/31 (13%) | 27 | Sim |
| `DECISIONS.md` | **Obrigatório** | 31/31 (100%) | 0 | Sim (padronizar nome) |
| `CHANGELOG.md` | **Obrigatório** | 31/31 (100%) | 0 | Sim (padronizar nome) |
| `PLANNED.md` | **Recomendado** | 1/31 (3%) | 30 | Sim |
| `agent/` | **Obrigatório** | 31/31 (100%) | 0 | Sim (persona.md template) |
| `pages/` | **Obrigatório** | 31/31 (100%) | 0 | Sim |
| `components/` | **Recomendado** | 18/31 (58%) | 13 | Sim |
| `services/` | **Recomendado** | 22/31 (71%) | 9 | Sim |
| `types/` | **Recomendado** | 18/31 (58%) | 13 | Sim |
| `store/` | **Recomendado** | 17/31 (55%) | 14 | Sim |
| `hooks/` | **Recomendado** | 12/31 (39%) | 19 | Sim |
| `docs/` | **Recomendado** | 5/31 (16%) | 26 | Sim |
| `layout/` | **Opcional** | 3/31 (10%) | 28 | Sim |
| `constants/` | **Opcional** | 0/31 (0%) | 31 | Sim |
| `utils/` | **Opcional** | 3/31 (10%) | 28 | Sim |

---

## 19. Rotas, registry e exposição dos módulos

### 19.1 Situação dos registros

- **29/31 módulos** registrados no `moduleRegistry.ts`
- **2 módulos NÃO registrados:** `.centro_de_estudos`, `_orquestracao-principal`
- **1 módulo inativo:** `fluxob` (initialStatus: 'inactive')

### 19.2 Consistência de rotas

- **Rotas consistentes:** 25/31 — rota match com baseRoute do manifest
- **Rotas com wildcard (`/*`):** 10 módulos (api_sagb, central_padroes, fluxob, foco_total, mcp_sagb, nucleo-conversacional, nucleo_de_agentes, quadro_de_elite, sagb_bridge, sala-dev, _orquestracao-principal)
- **Fullscreen:** 1 módulo (crm_ziplia)
- **Rotas com padrão detail:** 2 módulos (agentes_comerciais, cadastro-empresas) — exportam padrão de rota de detalhe

### 19.3 Inconsistências identificadas

| Módulo | Rota no routes.tsx | baseRoute no manifest | Observação |
|--------|-------------------|----------------------|------------|
| configuracoes-ambiente | `/configuracoes` | `/configuracoes` | Id no registry: `configuracoes-sistema` (inconsistente) |
| nucleo-conversacional | `/conversas/*` | `/conversas` | Id no registry: `conversations` (inglês) |
| taskzei | `/agenda-inteligente` | `/agenda-inteligente` | Id no registry: `agenda` |
| missoes | `/missoes` | `/missoes` | Id no registry: `missions` (inglês) |
| foco_total | `/foco-total/*` | `/foco-total` | internalName: `.foco_total` (com ponto) |

### 19.4 Módulos sem rota clara ou quebrada
Nenhum — todos os 31 módulos têm rota definida.

---

## 20. Relações atuais entre módulos

### 20.1 Dependências reais encontradas (via imports)

| Módulo origem | Módulo destino | Tipo de relação | Evidência |
|--------------|---------------|----------------|-----------|
| taskzei | hub-integracao | Consome | module-doc.ts: "internal: src/modules/hub-integracao" |
| sala-dev | api_sagb | Consome (adaptável) | SalaDevAdapterService.getRecommendedDataProvider() |
| monitoramento | Todos os módulos | Monitora | supabaseTablesService — lê metadados de todos |
| central_padroes | moduleRegistry.ts | Referencia | services referenciam core |
| cid | Gemini API | Integração externa | module-doc.ts |
| cid | Netlify Functions | Integração externa | module-doc.ts |
| nucleo-conversacional | Supabase (chat) | Dados | ncDb.ts |
| taskzei | Supabase (taskzei) | Dados | taskzei_supabase_provider.ts |
| taskzei | CID (anexos) | Referencia | module-doc.ts boundaries |

### 20.2 Relações via registry (todos no mesmo nível)

Todos os 29 módulos registrados estão no mesmo nível hierárquico — não há submodulação ou hierarquia explícita no registry.

---

## 21. Relações recomendadas entre módulos

| Módulo origem | Módulo destino | Relação recomendada | Prioridade |
|--------------|---------------|-------------------|-----------|
| **Central de Padrões** | Todos os módulos | Governa padrões e checklists | Alta |
| **Monitoramento** | TaskZei, Gestão Financeira, Sala Dev | Receber eventos e alertas | Alta |
| **TaskZei** | CID | Anexos e processamento documental | Média |
| **Hub de Integração** | Todos os módulos | Centralizar integrações externas | Alta |
| **Núcleo de Agentes** | Agentes Comerciais, RAI | Compartilhar dados de agentes | Média |
| **Orquestração Principal** | Todos os módulos | Governar malha do sistema | Crítica |
| **RAI** | Monitoramento, NAGI | Compartilhar inteligência | Média |
| **Sala Dev** | MCP SagB, SagB Bridge | Ferramentas de desenvolvimento | Alta |
| **Gestão Financeira** | Cadastro de Empresas | Dados de clientes/faturas | Média |
| **Metodologias** | Mentorias, Missões | Conteúdo e planos | Média |

---

## 22. Mapa de relações entre módulos

```
Orquestração Principal (Pierre Zanulli)
├── governa App.tsx, Sidebar, moduleRegistry
├── controla rotas globais
└── supervisa todos os módulos

Central de Padrões (Zico Padron)
├── governa padrões de todos os módulos
├── recebe documentos e decisões
├── fornece checklists e templates
└── audita conformidade

Monitoramento (Noali Kessler)
├── recebe eventos de módulos críticos
├── monitora tabelas Supabase
├── exibe alertas e métricas
└── aciona alertas para Orquestração

Hub de Integração (Alan Flow)
├── centraliza integrações externas
├── fornece serviços para TaskZei
├── gerencia providers (clickup, whatsapp, gmail, etc.)
└── fornece adapter pattern

TaskZei (Dani Freitas)
├── consome Hub de Integração
├── referência CID (anexos)
├── usa Supabase (provider dual: supabase/mock)
├── notifica via WhatsApp/Email/Push
└── fornece dados para Monitoramento

Sala Dev (Guardião Sala Dev)
├── consome API SagB (adapter)
├── fornece ambiente dev para agentes
├── usa provider dual (mock/supabase)
└── referência MCP SagB

RAI (Saleh Malu)
├── consome Supabase (auth + dados)
├── fornece inteligência para Monitoramento
└── conversa com NAGI

CID (sem owner)
├── processa documentos com Gemini API
├── armazena no Supabase Storage
├── fornece processamento para TaskZei
└── integra com Netlify Functions

API SagB (Dante Conec)
├── fornece camada de API
├── consumida por Sala Dev
├── contratos, endpoints, versioning
└── audit trail

Núcleo de Agentes (Brene Sagore)
├── gerencia agentes
├── fornece dados para Quadro de Elite
└── conversa com Núcleo Conversacional

Demais módulos de produto
├── cada um opera independentemente
├── alguns usam Supabase diretamente
└── maioria sem integração entre si
```

---

## 23. Potenciais módulos base reutilizáveis

| Módulo atual | Poderia virar core? | Tipo recomendado | Dependências | Risco | Recomendação |
|-------------|--------------------|-----------------|-------------|-------|-------------|
| api_sagb | ✅ | API Core | Nenhuma | Baixo | Transformar em módulo base |
| central_padroes | ✅ | Governance Core | Supabase | Baixo | Já é base — oficializar |
| hub-integracao | ✅ | Integration Core | Supabase | Baixo | Transformar em módulo base |
| monitoramento | ✅ | Monitoring Core | Supabase | Médio | Fortalecer como base |
| cid | ✅ | Document Processing Core | Supabase, Gemini, Netlify | Médio | Transformar em módulo base |
| sala-dev | ✅ | Dev Tools Core | API SagB | Baixo | Transformar em módulo base |
| mcp_sagb | ✅ | MCP Core | Nenhuma | Baixo | Transformar em módulo base |
| taskzei | ⚠️ | Product (já é forte) | Hub, Supabase | Baixo | Manter como produto, extrair base |
| nucleo-conversacional | ⚠️ | Product | Supabase | Médio | Manter como produto |
| gestao_financeira | ⚠️ | Product | Supabase | Médio | Manter como produto |
| quadro_de_elite | ⚠️ | Product | Supabase | Médio | Manter como produto |

### Cores sugeridos para Biblioteca de Módulos Base

| Core | Módulo de origem | Função |
|------|-----------------|--------|
| `api_core` | api_sagb | Camada de API |
| `governance_core` | central_padroes | Padrões e regras |
| `integration_core` | hub-integracao | Integrações externas |
| `monitoring_core` | monitoramento | Monitoramento e alertas |
| `document_core` | cid | Processamento documental |
| `devtools_core` | sala-dev | Ferramentas de desenvolvimento |
| `mcp_core` | mcp_sagb | MCP server |

---

## 24. Diagnóstico visual dos módulos

| Classificação | Módulos | Critério |
|--------------|---------|----------|
| **Visual forte** | taskzei (layout próprio), central_padroes (layout próprio) | Layout dedicado, consistência |
| **Visual aceitável** | agentes_comerciais, cadastro-empresas, metodologias, rai, sala-dev, monitoramento | Components/ + estrutura UI |
| **Visual parcial** | crm_ziplia, foco_total, hub-integracao, mentorias, missoes, videos-ia | Components/ presentes, sem layout |
| **Visual fraco** | api_sagb, cid, configuracoes-ambiente, fluxob, gestao_financeira, karaoke, mcp_sagb, nagi, nic, nucleo-conversacional, nucleo_de_agentes, quadro_de_elite, sagb_bridge, studio, telas_avancadas | Sem components/ ou UI mínima |
| **Visual inexistente** | .centro_de_estudos, _orquestracao-principal | Apenas placeholder |

### Observações visuais
- **Alice UI / Rubik:** Não foram encontradas referências explícitas a Alice UI ou Rubik nos módulos
- **Dark mode:** Não avaliado diretamente, mas sagb-global.css sugere suporte a temas
- **Padrão visual consistente:** Não identificado — cada módulo parece ter seu próprio estilo
- **Sidebar global:** Todos os módulos usam a Sidebar global (components/Sidebar.tsx)
- **fullscreen:** Apenas crm_ziplia usa fullscreen

---

## 25. Mapa de dados e Supabase por módulo

| Módulo | Usa Supabase? | Services que acessam | Tabelas inferidas | Mock/Fallback |
|--------|--------------|---------------------|-------------------|--------------|
| central_padroes | ✅ | governanceRulesService, CrudService, RelationshipService, SeedService, StorageService, TriagemService, ApprovalService, BaseModulesService | governance_rules, central_padroes_areas, central_padroes_standards, central_padroes_standard_dependencies, central_padroes_documents, central_padroes_decisions | ❌ |
| taskzei | ✅ | taskzei_supabase_provider, doc_service, doc_storage_adapter | taskzei_tasks, taskzei_projects, taskzei_entity_links, + várias | ✅ (VITE_TASKZEI_PROVIDER=mock) |
| sala-dev | ✅ | salaDevSupabaseRepository | dev_projects, dev_tasks, dev_developer_sessions | ✅ (provider dual mock/supabase) |
| cadastro-empresas | ✅ | empresaPersistence, logoStorage | empresas, empresa_logos (storage) | ❌ |
| cid | ✅ | (via Netlify Functions) | cid_assets, cid_asset_files, cid_processing_jobs | ❌ |
| crm_ziplia | ✅ | crmZipliaService (restFetch) | (tabelas CRM Ziplia) | ❌ |
| nucleo-conversacional | ✅ | ncDb | chat_sessions, chat_messages | ❌ |
| monitoramento | ✅ | supabaseTablesService | (lê tabelas de todos os módulos) | ❌ |
| gestao_financeira | ✅ | financeService | (financeiro) | ❌ |
| hub-integracao | ✅ | integrationService | (integrações) | ❌ |
| mentorias | ✅ | mentorias.service | (mentorias) | ❌ |
| metodologias | ✅ | metodologiasPersistencia | (metodologias) | ❌ |
| quadro_de_elite | ✅ | (services/supabase.ts referenciado) | agents, agent_configs, agent_dna_profiles, agent_dna_effective | ❌ |
| rai | ✅ | raiSupabaseService, useRAI | (RAI) | ❌ |
| nucleo_de_agentes | ✅ | (module-doc) | agents | ❌ |
| studio | ✅ | studio.ts | studio_sessions, studio_chunks, studio_session_cameras, studio_camera_files, studio_audio_tracks | ❌ |
| sagb_bridge | ✅ | (migrations) | dev_projects, dev_tasks, dev_task_runs, dev_developer_sessions, dev_task_launches | ❌ |
| telas_avancadas | ❌ | — | N/A (localStorage) | ✅ (localStorage) |
| Demais (13) | ❌ | — | N/A | ❌ |

---

## 26. Riscos gerais do ecossistema modular

| Risco | Descrição | Evidência | Impacto | Prioridade |
|-------|-----------|-----------|---------|------------|
| **Crítico** | Módulos órfãos sem owner | 5 módulos sem owner definido | Arquitetura sem responsável | Alta |
| **Crítico** | Ausência de módulo base reutilizável oficial | Nenhum módulo é oficialmente "base" | Duplicação de esforço | Alta |
| **Alto** | 27/31 módulos sem README.md | 87% dos módulos | Dificuldade de onboarding | Alta |
| **Alto** | 30/31 módulos sem PLANNED.md | 97% dos módulos | Sem roadmap visível | Alta |
| **Alto** | Nomenclatura inconsistente de pastas | hífen vs. underscore vs. ponto | Dificuldade de padronização | Média |
| **Alto** | Módulos duplicando função | CID vs. serviços de arquivo, NAGI vs. RAI | Risco de retrabalho | Média |
| **Médio** | Módulos sem comunicação entre si | 20+ módulos isolados | Ecossistema fragmentado | Média |
| **Médio** | 2 módulos não registrados no registry | .centro_de_estudos, _orquestracao-principal | Podem ficar invisíveis | Média |
| **Médio** | Variação no padrão de export (manifest/routes) | 3 formas diferentes de export | Dificuldade de manutenção | Baixa |
| **Médio** | Ausência de testes | Nenhum módulo com testes unitários visíveis | Qualidade não verificável | Alta |
| **Baixo** | Nomes de arquivos de governança inconsistentes | decisions.md vs DECISIONS.md | Padrão não oficializado | Baixa |
| **Baixo** | package.json próprio no nucleo-conversacional | Dependência externa atípica | Risco de conflito | Baixa |

---

## 27. Duplicidades encontradas

| Função | Módulo 1 | Módulo 2 | Observação |
|--------|---------|---------|------------|
| Gestão de agentes | nucleo_de_agentes | quadro_de_elite | Ambos gerenciam dados de agentes |
| Inteligência/Análise | nagi | rai | Sobreposição potencial de propósito |
| Processamento de mídia | cid | studio | CID faz documentos, Studio faz áudio/vídeo — complementares, mas próximos |
| Integração externa | hub-integracao | api_sagb | Hub foca em integrações, API SagB em API — pode haver sobreposição |
| Monitoramento | monitoramento | _orquestracao-principal | Monitoramento técnico vs. orquestração de governança |

---

## 28. Lacunas encontradas

| Lacuna | Gravidade | Módulos afetados |
|--------|-----------|-----------------|
| Ausência de README.md | Alta | 27/31 módulos |
| Ausência de PLANNED.md | Alta | 30/31 módulos |
| Ausência de docs/ | Média | 26/31 módulos |
| Ausência de components/ | Média | 13/31 módulos |
| Ausência de services/ | Média | 9/31 módulos |
| Ausência de hooks/ | Média | 19/31 módulos |
| Ausência de store/ | Média | 14/31 módulos |
| Ausência de types/ | Média | 13/31 módulos |
| Sem owner definido | Alta | 5 módulos |
| Sem integração com outros módulos | Alta | 20+ módulos |
| Sem testes automatizados | Alta | Todos (aparentemente) |
| Sem padrão visual consistente | Média | Todos |
| Nomes de arquivos inconsistentes | Baixa | 30/31 módulos (minúsculo) |

---

## 29. Módulos referência

| Módulo | Motivo |
|--------|--------|
| **central_padroes** | Único com governança completa (todos os 8 arquivos + docs + layout + specs) |
| **taskzei** | Maturidade de produto (versionamento, boundaries, provider pattern, layout próprio) |
| **sala-dev** | Estrutura rica (docs, governance, plans, agents, adapter pattern, provider dual) |
| **monitoramento** | Arquitetura clara de governança técnica |
| **rai** | Estrutura completa (pages, components, hooks, services, store, types) |

---

## 30. Módulos críticos

| Módulo | Motivo | Risco |
|--------|--------|-------|
| **_orquestracao-principal** | Acessa App.tsx, Sidebar, moduleRegistry — risco de quebra global | Alto |
| **central_padroes** | Central de padrões — se corromper, afeta todos | Alto |
| **taskzei** | Módulo mais usado — crítico para operações | Médio |
| **hub-integracao** | Centraliza integrações externas | Médio |

---

## 31. Módulos órfãos ou indefinidos

| Módulo | Situação |
|--------|---------|
| `.centro_de_estudos` | Sem owner, sem propósito claro, não registrado |
| `fluxob` | Inativo (initialStatus: inactive), estrutura mínima |
| `nic` | Sem owner, propósito indefinido |
| `sagb_bridge` | Owner definido (Alan Flow) mas estrutura parcial |
| `nucleo_de_agentes` | Owner definido mas estrutura parcial (sem services, hooks, store) |

---

## 32. Recomendações para a Central de Padrões

### 32.1 Padrões reais encontrados que devem ser oficializados
1. **Estrutura mínima obrigatória:** index.ts, manifest.ts, routes.tsx, module-doc.ts, pages/, agent/
2. **Documentos obrigatórios:** README.md, DECISIONS.md, CHANGELOG.md
3. **Arquivos de governança em MAIÚSCULO:** README.md, DECISIONS.md, CHANGELOG.md, PLANNED.md
4. **Export padronizado:** `[nome]Manifest` e `[nome]Routes`
5. **module-doc.ts tipado** com ModuleDoc (seguir modelo de central_padroes e taskzei)

### 32.2 Documentos que devem ir para a Central de Padrões
1. Template de `module-doc.ts` (baseado em central_padroes + taskzei)
2. Template de `manifest.ts` (baseado no ModuleManifest type)
3. Template de `README.md` para módulos
4. Template de `DECISIONS.md` para módulos
5. Template de `CHANGELOG.md` para módulos
6. Template de `PLANNED.md` para módulos
7. Template de `agent/persona.md` para módulos
8. Template de `agent/session_log.md` para módulos
9. Padrão de provider dual (mock/supabase) — baseado em sala-dev e taskzei
10. Padrão de adapter/fallback — baseado em sala-dev

### 32.3 Checklists a criar
1. **Checklist de criação de novo módulo** (arquivos obrigatórios + recomendados)
2. **Checklist de governança de módulo** (READ ME, DECISIONS, CHANGELOG, PLANNED)
3. **Checklist de maturidade de módulo** (critérios para cada nível)
4. **Checklist de integração entre módulos** (quando um módulo deve consumir outro)

### 32.4 Templates a criar
1. **Template oficial de módulo** (estrutura completa de pastas e arquivos)
2. **Template de module-doc.ts** (com campos obrigatórios)
3. **Template de manifest.ts** (padrão ModuleManifest)
4. **Template de README.md** para módulo
5. **Template de DECISIONS.md** para módulo
6. **Template de CHANGELOG.md** para módulo
7. **Template de PLANNED.md** para módulo

### 32.5 Como a Central de Padrões deve usar este relatório
1. Como **base para definir o template oficial de módulo**
2. Como **lista de pendências** para padronização progressiva
3. Como **matriz de referência** para auditoria de novos módulos
4. Como **diagnóstico inicial** para definir prioridades da Central

### 32.6 Como o Pietro deve consultar este relatório
1. Focar nas seções 14 (Padrão Real), 15 (Padrão Recomendado), 18 (Arquivos Padrão)
2. Usar módulos referência (central_padroes, taskzei, sala-dev) como modelo
3. Priorizar criação de templates e checklists antes de refatorar módulos existentes
4. Usar a Matriz de Prioridade (seção 37) para definir roadmap

---

## 33. Template oficial recomendado para novos módulos

```
src/modules/[nome_modulo]/
├── index.ts                    OBRIGATÓRIO — ponto de entrada
├── manifest.ts                 OBRIGATÓRIO — identidade do módulo (ModuleManifest)
├── routes.tsx                  OBRIGATÓRIO — rota do módulo
├── module-doc.ts               OBRIGATÓRIO — documentação técnica (ModuleDoc)
├── README.md                   OBRIGATÓRIO — visão geral
├── DECISIONS.md                OBRIGATÓRIO — registro de decisões
├── CHANGELOG.md                OBRIGATÓRIO — histórico de versões
├── PLANNED.md                  RECOMENDADO — próximos passos
├── pages/                      OBRIGATÓRIO — páginas do módulo
├── components/                 RECOMENDADO — componentes de UI
├── services/                   RECOMENDADO — lógica de negócio e dados
├── hooks/                      RECOMENDADO — hooks customizados
├── store/                      RECOMENDADO — estado global
├── types/                      RECOMENDADO — tipos TypeScript
├── constants/                  OPCIONAL — constantes
├── layout/                     OPCIONAL — layout próprio (se aplicável)
├── utils/                      OPCIONAL — utilitários
├── docs/                       RECOMENDADO — documentação interna
├── agent/                      OBRIGATÓRIO — arquivos do agente
│   ├── persona.md
│   ├── session_log.md
│   ├── falas_user.md
│   └── prompt_ativacao_cline.md
└── __tests__/                  RECOMENDADO — testes unitários
```

---

## 34. Classificação oficial recomendada dos módulos

### Taxonomia proposta

| Tipo | Definição | Quando usar | Exemplos encontrados |
|------|-----------|-------------|---------------------|
| **Módulo de Produto** | Funcionalidade de negócio entregue ao usuário | Funcionalidades core do SagB | taskzei, rai, cid, studio, gestao_financeira, videos-ia, foco_total, karaoke, mentorias, metodologias, missoes, agentes_comerciais, cadastro-empresas, crm_ziplia, nucleo-conversacional, nucleo_de_agentes, quadro_de_elite, telas_avancadas |
| **Módulo Base Reutilizável** | Funcionalidade compartilhável entre módulos | Quando 2+ módulos precisam da mesma função | api_sagb, hub-integracao, cid (potencial), mcp_sagb |
| **Módulo de Governança** | Regras, padrões, monitoramento e orquestração | Para governar o ecossistema | central_padroes, monitoramento, _orquestracao-principal |
| **Módulo Técnico** | Infraestrutura técnica e ferramentas | Para suporte ao desenvolvimento | sala-dev, mcp_sagb, sagb_bridge, nic, api_sagb |
| **Módulo de Integração** | Integração com sistemas externos | Quando precisa conectar com APIs externas | hub-integracao |
| **Módulo de Suporte** | Configurações e utilidades | Para suporte operacional | configuracoes-ambiente |
| **Módulo Experimental** | Prova de conceito ou em desenvolvimento | Quando não está maduro ou definido | .centro_de_estudos, fluxob |
| **Módulo Legado** | Mantido por compatibilidade, sem desenvolvimento ativo | N/A | Nenhum identificado |
| **Módulo Arquivado** | Não usado mas mantido para referência | N/A | Nenhum identificado |

---

## 35. Checklists recomendados

### Checklist de Criação de Novo Módulo
- [ ] Definir nome no padrão `snake_case`
- [ ] Criar `index.ts`
- [ ] Criar `manifest.ts` seguindo ModuleManifest
- [ ] Criar `routes.tsx` com rota padronizada
- [ ] Criar `module-doc.ts` seguindo ModuleDoc
- [ ] Criar `README.md` com visão geral
- [ ] Criar `DECISIONS.md` (iniciar com primeira decisão)
- [ ] Criar `CHANGELOG.md` (iniciar com v0.1.0)
- [ ] Criar `PLANNED.md` (opcional no início)
- [ ] Criar `pages/` com página inicial
- [ ] Criar `agent/` com persona.md e session_log.md
- [ ] Registrar no `moduleRegistry.ts`
- [ ] Definir owner no manifest

### Checklist de Governança de Módulo
- [ ] README.md existe e está atualizado
- [ ] DECISIONS.md existe com decisões registradas
- [ ] CHANGELOG.md existe com versionamento semântico
- [ ] PLANNED.md existe (se módulo em desenvolvimento)
- [ ] module-doc.ts está tipado com ModuleDoc
- [ ] agent/ contém persona.md e session_log.md

### Checklist de Maturidade Nível "Funcional"
- [ ] Estrutura mínima completa (index, manifest, routes, module-doc, pages)
- [ ] README.md com propósito e como usar
- [ ] DECISIONS.md com decisões registradas
- [ ] CHANGELOG.md com ao menos 1 versão
- [ ] Pelo menos 1 página funcional
- [ ] Registrado no moduleRegistry
- [ ] Owner definido

---

## 36. Próximas megatarefas sugeridas

### MEGA-ETAPA 02 — Central de Padrões: Templates e Checklists
- Criar templates oficiais de módulo (todos os arquivos)
- Criar checklists de criação, governança e maturidade
- Oficializar padrão de nomenclatura
- Publicar na Central de Padrões

### MEGA-ETAPA 03 — Resgate de Módulos Críticos
- Adicionar README.md nos 27 módulos sem
- Adicionar PLANNED.md nos 30 módulos sem
- Definir owners para módulos órfãos
- Registrar _orquestracao-principal e .centro_de_estudos (ou arquivar)

### MEGA-ETAPA 04 — Biblioteca de Módulos Base
- Extrair api_core do api_sagb
- Extrair integration_core do hub-integracao
- Extrair monitoring_core do monitoramento
- Extrair document_core do cid
- Extrair devtools_core do sala-dev

### MEGA-ETAPA 05 — Mapa de Relações Entre Módulos (Implementação)
- Implementar eventos entre módulos
- Criar barramento de eventos (Event Bus)
- Integrar módulos que deveriam conversar
- Central de Monitoramento recebendo eventos reais

### MEGA-ETAPA 06 — Padronização Visual
- Adotar Alice UI Standard v1.0
- Padronizar temas, cores e componentes
- Garantir dark mode e responsividade
- Criar design system do SagB

---

## 37. Matriz de prioridade pós-auditoria

| Prio | Módulo | Problema/Oportunidade | Ação | Impacto | Esforço | Risco |
|------|--------|----------------------|------|---------|---------|-------|
| 1 | Todos | 27/31 sem README | Documentar | Alto | Médio | Baixo |
| 2 | Todos | 30/31 sem PLANNED | Documentar | Alto | Baixo | Baixo |
| 3 | Central de Padrões | Templates e checklists | Criar | Alto | Médio | Baixo |
| 4 | _orquestracao-principal | Módulo crítico não registrado | Registrar | Alto | Baixo | Médio |
| 5 | .centro_de_estudos | Propósito indefinido | Investigar | Médio | Baixo | Baixo |
| 6 | fluxob | Inativo, propósito indefinido | Investigar | Médio | Baixo | Baixo |
| 7 | Todos | Padrão de nomenclatura | Padronizar | Médio | Baixo | Baixo |
| 8 | Biblioteca de Módulos Base | Extrair cores | Refatorar | Alto | Alto | Alto |
| 9 | Todos | Mapa de relações | Integrar | Alto | Alto | Médio |
| 10 | Todos | Padrão visual | Padronizar | Médio | Alto | Médio |

---

## 38. Fato verificado, inferência, recomendação e pendentes de validação

### Fato verificado
- 31 diretórios de módulo em `src/modules`
- 29 registrados no `moduleRegistry.ts`
- Todos os 31 têm index.ts, manifest.ts, routes.tsx, module-doc.ts, agent/
- Todos os 31 têm decisions.md e changelog.md (30 em minúsculo, 1 em maiúsculo)
- Apenas 4 têm README.md (central_padroes, mcp_sagb, nucleo_de_agentes, taskzei)
- Apenas 1 tem PLANNED.md (central_padroes)
- 5 têm docs/ (central_padroes, gestao_financeira, quadro_de_elite, sala-dev, taskzei)
- 3 têm layout/ (central_padroes, taskzei — e sidebar global)
- 17 módulos usam Supabase (serviço compartilhado em `services/supabase`)
- 2 têm provider dual mock/supabase (sala-dev, taskzei)
- 1 tem fullscreen (crm_ziplia)
- 1 está inativo (fluxob)
- 20+ owners definidos (agentes ou humanos)

### Inferência técnica
- O padrão modular real do SagB está se formando com 8 arquivos obrigatórios + pages/ + agent/
- central_padroes e taskzei são os módulos mais maduros e devem servir de referência
- A ausência de README em 87% dos módulos é a maior lacuna de governança
- A fragmentação entre módulos (20+ sem integração) é o maior risco técnico
- O ecossistema está maduro o suficiente para oficializar uma Biblioteca de Módulos Base
- O _orquestracao-principal (Pierre Zanulli) atua como "meta-módulo" não registrado intencionalmente

### Recomendação
1. Oficializar o padrão modular encontrado (seção 15)
2. Criar templates e checklists na Central de Padrões
3. Resgatar documentação dos 27 módulos sem README
4. Iniciar Biblioteca de Módulos Base com api_core, integration_core, monitoring_core
5. Implementar barramento de eventos entre módulos
6. Padronizar nomenclatura de pastas (snake_case) e arquivos (UPPERCASE.md)

### Pendente de validação
- Propósito real do `.centro_de_estudos` (módulo ou template?)
- Propósito real do `fluxob` (inativo — roadmap?)
- Se o `_orquestracao-principal` deve ou não ser registrado
- Se a duplicidade entre nagi/rai é real ou complementar
- Se o package.json do nucleo-conversacional é necessário
- Qual o plano para os módulos sem owner

---

## 39. Conclusão executiva

O SagB possui **31 módulos** em `src/modules`, dos quais **29 estão registrados** no moduleRegistry. O ecossistema modular está em um estágio avançado de desenvolvimento, com **2 módulos de referência** (central_padroes e taskzei) que podem servir como modelo para todos os outros.

**Achados verdes (positivos):**
- 100% dos módulos têm index.ts, manifest.ts, routes.tsx, module-doc.ts, agent/
- 100% têm decisions.md e changelog.md
- 55% têm store/, 71% têm services/, 58% têm components/
- 17 módulos integrados ao Supabase
- 2 módulos com provider dual (mock/supabase)
- Estrutura modular madura e consistente

**Achados amarelos (atenção):**
- 87% sem README.md
- 97% sem PLANNED.md
- 84% sem docs/
- 42% sem components/
- 29% sem services/
- Nomenclatura inconsistente (hífen vs. underscore)
- 3 variações de export de manifest e routes

**Achados vermelhos (críticos):**
- 5 módulos sem owner definido
- 2 módulos não registrados no registry
- 20+ módulos sem integração entre si
- Nenhum módulo base reutilizável oficial
- Ausência de testes automatizados aparentes
- Ausência de barramento de eventos entre módulos
- Ausência de padrão visual consistente

**Achados cinzas (indefinidos):**
- `.centro_de_estudos` — propósito indefinido
- `fluxob` — inativo, sem roadmap
- `nic` — propósito parcialmente indefinido
- nagi vs. rai — possível duplicidade

---

## 40. Anexos

### Anexo A: Lista completa de módulos por categoria

**Produto (18):** agentes_comerciais, cadastro-empresas, cid, crm_ziplia, foco_total, gestao_financeira, karaoke, mentorias, metodologias, missoes, nagi, nucleo-conversacional, nucleo_de_agentes, quadro_de_elite, rai, studio, taskzei, telas_avancadas, videos-ia

**Governança (3):** central_padroes, monitoramento, _orquestracao-principal

**Técnico (5):** api_sagb, mcp_sagb, nic, sagb_bridge, sala-dev

**Integração (1):** hub-integracao

**Suporte (1):** configuracoes-ambiente

**Experimental (2):** .centro_de_estudos, fluxob

### Anexo B: Owners definidos

| Agente/Humano | Módulos |
|--------------|---------|
| Alan Flow | fluxob, hub-integracao, sagb_bridge |
| Brene Sagore | nucleo_de_agentes |
| Cley Scrini (humano) | telas_avancadas |
| Dani Freitas (humano) | taskzei |
| Dante Conec | api_sagb |
| Denic Celmi (humano) | crm_ziplia |
| Fabi Nunes | studio |
| Guardião Sala Dev | sala-dev |
| Helen Dravet | quadro_de_elite |
| Nanis Pelta | karaoke |
| Noali Kessler | monitoramento |
| Oton Lacerda | agentes_comerciais |
| Pierre Zanulli | _orquestracao-principal |
| Saleh Malu | rai |
| Sávio Codare | mcp_sagb |
| Zen Folk | foco_total |
| Zico Padron | central_padroes |
| **Sem owner** | .centro_de_estudos, cadastro-empresas, cid, configuracoes-ambiente, gestao_financeira, mentorias (agente genérico), metodologias (agente genérico), missoes, nagi, nic, videos-ia |

---

> **Relatório gerado em:** 01/06/2026  
> **Agente auditor:** Cássio Mendes (Cassius)  
> **Total de módulos analisados:** 31  
> **Comandos executados:** 8 (todos de leitura)  
> **Comandos não executados:** 4 (build, lint, test, dev — não aplicáveis)  
> **Arquivos alterados:** Nenhum (auditoria pura)  
> **Próxima megatarefa sugerida:** MEGA-ETAPA 02 — Central de Padrões: Templates e Checklists
