# SagB by Loze | Validação crítica da ET-02

**Escopo:** revisão dos documentos criados em `src/modules/central_padroes/docs/` para validar qualidade antes da ET-03.  
**Regra:** não implementar código, não refatorar módulo, não apagar arquivos e não alterar lógica de negócio.

---

## 1. Avaliação documento a documento

| Arquivo | Função | Completude | Conteúdo real ou genérico | Coerência com ET-01 | Falta informação importante | Contradições | Precisa complementar antes da ET-03 | Recomendação |
|---|---|---|---|---|---|---|---|---|
| `_readme.md` | Índice operacional da pasta de padrões | parcial | real, mas simples | coerente | Falta reposicionar título de Standards GrupoB para SagB by Loze / Loze Docs; cita `historico-e-auditoria.md`, mas o arquivo não apareceu na listagem atual | possível referência a documento inexistente | sim, ajuste leve de índice e nomenclatura | complementar |
| `loze-docs-indice-canonico-sagb.md` | Ponto de entrada do Loze Docs no SagB | parcial | real, porém sintético | coerente | Falta árvore de navegação mais explícita, owners e relação com documentos antigos | sem contradição grave | sim, antes de virar índice definitivo | complementar |
| `matriz-canonica-modulos-sagb.md` | Classificação inicial dos módulos | parcial | real e útil | coerente | Falta granularidade por owner, rota, tabela principal, dependências e evidências por módulo | algumas classificações misturam dois status na mesma célula | não bloqueia ET-03, mas precisa refinamento | complementar |
| `matriz-rotas-tabs-sagb.md` | Mapear tabs internas, rotas e aliases | parcial/boa | real | coerente | Falta referência direta a `App.tsx`, `Sidebar.tsx` e `moduleRegistry.ts` por linha/trecho; falta status de “rota efetivamente navegável” | sem contradição grave | sim, para normalização futura | complementar |
| `inventario-supabase-sagb.md` | Inventariar tabelas, buckets e riscos Supabase | parcial/superficial | real, mas ainda agregado | coerente | Falta mapear tabela por migration, service consumidor, RLS, policy e status remoto | pode misturar tabelas existentes em service com migrations não confirmadas | sim, mas idealmente na ET-04, não ET-03 | complementar |
| `inventario-netlify-functions-sagb.md` | Inventariar functions serverless por domínio | parcial | real, mas mínimo | coerente | Falta método HTTP, variáveis de ambiente, tabelas tocadas, consumidor front e criticidade | sem contradição grave | não bloqueia ET-03; complementar na ET-04 | complementar |
| `arquitetura-modulos-plugaveis-sagb.md` | Explicar registry, manifest, routes, module-doc e navegação | boa | real e aplicável | coerente | Falta exemplo concreto completo de módulo já existente e alerta sobre `manifest.id` vs `baseRoute` com mais destaque | sem contradição grave | não bloqueia ET-03 | aprovado com complementos |
| `modelo-module-doc-loze-das.md` | Propor template padrão para documentação viva de módulos | boa | real e acionável | coerente | Falta tipagem TypeScript formal e exemplo preenchido com um módulo real | sem contradição grave | não bloqueia ET-03; ideal para piloto | aprovado com complementos |
| `QUARENTENA_TECNICA.md` | Impedir remoções perigosas e classificar itens suspeitos | boa/parcial | real e útil | coerente | Falta evidência de uso/referência por item; faltam services/hooks/utils não utilizados em profundidade | sem contradição grave | não bloqueia; deve ser expandida continuamente | aprovado com complementos |
| `decisoes-para-adr-et-02.md` | Listar decisões estruturais que devem virar ADR | boa | real e objetiva | coerente | Falta template ADR e critérios de aprovação/rejeição | sem contradição grave | não bloqueia ET-03 | aprovado com complementos |

---

## 2. Validações específicas solicitadas

### 2.1 Índice canônico orienta o Loze Docs?

**Avaliação:** parcialmente.  
Ele orienta a documentação inicial e lista os documentos centrais, mas ainda funciona mais como índice de entregáveis da ET-02 do que como portal completo do Loze Docs.

**Complementos necessários:**

- renomear conceitualmente a pasta de Standards GrupoB para Central de Padrões / Loze Docs, sem quebrar histórico;
- incluir hierarquia por camadas: visão, módulos, dados, integrações, segurança, ADRs e quarentena;
- apontar quais documentos antigos permanecem fonte histórica e quais passam a ser fonte canônica.

### 2.2 Matriz de módulos está útil?

**Avaliação:** sim, útil para ET-03.  
Ela separa módulos registrados e áreas fora do registry, classifica status e recomendações.

**Limitação:** ainda é uma matriz macro. Para ET-03, precisa virar matriz operacional com campos padronizados por módulo: owner, `manifest.id`, `baseRoute`, docs, provider, tabelas, functions, riscos e decisão de próxima ação.

### 2.3 Matriz de rotas/tabs está clara?

**Avaliação:** sim, clara o suficiente para orientar ET-03.  
Ela evidencia o principal problema: mistura entre tab interna e rota URL.

**Limitação:** falta diferenciar “rota declarada”, “tab renderizada no shell”, “alias legado” e “rota efetivamente acessível por URL”.

### 2.4 Inventário Supabase está confiável ou superficial?

**Avaliação:** superficial, mas honesto.  
O próprio documento declara que é inventário inicial pendente de validação contra banco remoto.

**Risco:** não deve ser usado ainda para executar alterações de RLS, remoções de tabela ou migrações. Deve servir apenas como mapa de partida para ET-04.

### 2.5 Inventário Netlify Functions está suficiente?

**Avaliação:** suficiente como inventário inicial, insuficiente para auditoria técnica.  
Ele lista functions e domínios, mas não documenta contratos, env vars, métodos, consumidores ou tabelas.

**Recomendação:** complementar na ET-04 com matriz function -> endpoint -> env vars -> Supabase -> consumidor -> risco.

### 2.6 Arquitetura de módulos plugáveis ficou bem explicada?

**Avaliação:** sim.  
O documento explica registry, manifests, routes, module-doc, navegação, tipos de módulos, riscos e regra antes de criar módulo.

**Complemento recomendado:** adicionar um exemplo real usando CID, TaskZei ou Central de Padrões como módulo modelo.

### 2.7 Modelo de `module-doc.ts` LOZE-DAS está pronto para virar padrão?

**Avaliação:** quase pronto.  
O modelo é bom como v0.1 e pode ser usado em piloto.

**Antes de virar padrão definitivo:**

- criar tipo TypeScript `ModuleDocLozeDas` ou equivalente;
- preencher um exemplo real;
- decidir se será aplicado diretamente nos arquivos `module-doc.ts` ou documentado primeiro como guideline.

### 2.8 Quarentena Técnica está boa o suficiente para impedir remoções perigosas?

**Avaliação:** sim, para impedir remoções perigosas iniciais.  
Ela lista Golden Seal, duplicidades, localStorage sensível, policies e módulos confusos.

**Limitação:** não prova uso real dos itens. Portanto, impede remoção, mas não autoriza limpeza.

### 2.9 Decisões para ADR estão bem formuladas?

**Avaliação:** sim, como backlog inicial.  
As decisões são objetivas e alinhadas com a auditoria.

**Complemento recomendado:** priorizar ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-009, ADR-010 e ADR-011 antes de mudanças técnicas sensíveis.

---

## 3. Principais pendências encontradas

1. O `_readme.md` ainda se apresenta como “Standards GrupoB” e precisa ser reposicionado para “Central de Padrões / Loze Docs” preservando histórico.
2. O `_readme.md` cita `historico-e-auditoria.md`, mas o arquivo não foi listado na pasta atual; precisa validação.
3. A matriz de módulos é útil, mas precisa normalização de status único por módulo ou campo separado para status secundário.
4. O inventário Supabase é bom como partida, mas ainda não é confiável para decisão técnica de banco.
5. O inventário de functions precisa detalhar contratos, env vars e consumidores.
6. A Quarentena Técnica precisa, em uma próxima rodada, evidências por item: referência, importação, rota, service ou migration.
7. O modelo LOZE-DAS precisa de piloto em 1 a 3 módulos antes de aplicação em massa.

---

## 4. Contradições ou pontos de atenção

- **Contradição leve:** `_readme.md` mantém identidade “Standards GrupoB”, enquanto ET-02 consolidou “SagB by Loze / Loze Docs”. Não é erro crítico, mas precisa harmonização.
- **Possível referência quebrada:** `historico-e-auditoria.md` aparece no índice, mas não foi confirmado na listagem atual.
- **Classificação híbrida:** algumas células usam `parcial/core`, `lab/parcial`, `confuso/parcial`; isso é útil na auditoria, mas para ET-03 deve virar campos separados: `status_oficial` e `observacao_de_maturidade`.
- **Inventário Supabase:** mistura achados de migrations, services e inferência; está corretamente marcado como pendente, mas não deve ser tratado como fonte final.

---

## 5. Complementos recomendados antes ou durante ET-03

### Antes da ET-03

- Não é obrigatório refazer ET-02.
- É recomendável apenas registrar esta validação e aceitar ET-02 como base com complementos.

### Durante ET-03

1. Atualizar `_readme.md` para virar índice da Central de Padrões / Loze Docs.
2. Criar matriz operacional de módulos com campos normalizados.
3. Escolher 1 módulo piloto para aplicar `modelo-module-doc-loze-das.md`.
4. Transformar status híbridos em classificação padronizada.
5. Adicionar evidência por item crítico da Quarentena Técnica.

### Durante ET-04

1. Validar Supabase contra banco remoto.
2. Auditar RLS, grants, buckets e policies.
3. Mapear Netlify Functions por endpoint, env var, tabela e consumidor.
4. Revisar localStorage sensível.

---

## 6. Decisão sobre avanço para ET-03

**Classificação:** aprovada com complementos.

**Motivo objetivo:** a ET-02 criou a estrutura documental correta, coerente com a ET-01 e suficiente para orientar a ET-03. Porém, alguns documentos ainda são inventários iniciais e não podem ser tratados como fonte técnica definitiva, principalmente Supabase, Netlify Functions e evidências de uso na Quarentena Técnica.

**Condição para avançar:** ET-03 pode começar desde que seja entendida como etapa de normalização documental e classificação, não como refatoração de código nem alteração de lógica.

---

## 7. Próximas 3 opções numeradas

1. Executar ET-03 focada em normalizar `_readme.md`, matriz operacional de módulos e piloto LOZE-DAS em módulos selecionados.
2. Complementar ET-02 antes da ET-03, refinando matrizes e adicionando evidências na Quarentena Técnica.
3. Pular para ET-04 técnica, auditando Supabase, RLS, buckets, localStorage sensível e Netlify Functions.
