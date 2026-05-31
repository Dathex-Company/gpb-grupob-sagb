# SagB | Inventário Geral dos Módulos | Auditoria Técnica, Funcional e Estratégica | 30-05-2026

## Escopo e método

Auditoria executada sobre [`src/modules`](../src/modules) conforme plano em [`sagb-auditoria-geral-sistema-modulos-documentacao-30-05-2026.md`](sagb-auditoria-geral-sistema-modulos-documentacao-30-05-2026.md).  
Não foram alterados códigos de negócio, tabelas, rotas ou módulos. Este documento registra o que foi identificado por leitura de estrutura, manifests, module-docs e referências técnicas.

Módulos/pastas identificados em [`src/modules`](../src/modules): 28 entradas, sendo 26 módulos/fronts evidentes e 2 pastas técnicas/ocultas.

---

## Orquestração Principal | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Orquestração Principal.
- Nome interno: `_orquestracao-principal`.
- Rota: `/orquestracao`, conforme [`manifest.ts`](../src/modules/_orquestracao-principal/manifest.ts).
- Status: ativo, conforme [`module-doc.ts`](../src/modules/_orquestracao-principal/module-doc.ts).
- Responsável: Pierre Zanulli, conforme [`module-doc.ts`](../src/modules/_orquestracao-principal/module-doc.ts).
- Tipo: módulo oficial/orquestração.

### 2. Função do módulo
- Atua como camada de coordenação principal do SagB.
- Papel: organizar visão macro, frentes e decisões operacionais.
- Pode ser destacável: não recomendado; depende do contexto SagB.

### 3. Estrutura técnica
- Pasta: [`_orquestracao-principal`](../src/modules/_orquestracao-principal).
- Arquivos: [`index.ts`](../src/modules/_orquestracao-principal/index.ts), [`manifest.ts`](../src/modules/_orquestracao-principal/manifest.ts), [`routes.tsx`](../src/modules/_orquestracao-principal/routes.tsx), [`module-doc.ts`](../src/modules/_orquestracao-principal/module-doc.ts), [`changelog.md`](../src/modules/_orquestracao-principal/changelog.md), [`decisions.md`](../src/modules/_orquestracao-principal/decisions.md).
- Page principal: [`OrquestracaoPrincipalPage.tsx`](../src/modules/_orquestracao-principal/pages/OrquestracaoPrincipalPage.tsx).
- Agent files presentes em [`agent`](../src/modules/_orquestracao-principal/agent).

### 4. Supabase e dados
- Supabase/storage: registrado como N/A no module-doc.
- Dados próprios: principalmente configuração/visão de orquestração.

### 5. Regras, cálculos e lógicas
- Regras de apresentação e organização estratégica; não foram encontrados cálculos centrais.

### 6. Integrações
- Integração indireta com demais módulos do ecossistema.

### 7. Padrões utilizados
- Segue padrão modular: manifest, routes, module-doc, changelog, decisions e agent.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Risco de virar módulo guarda-chuva sem contrato claro com os demais.

### 10. Reaproveitamentos possíveis
- Padrão de módulo com agent e documentação pode ser usado como referência.

### 11. Recomendações
- Documentar fronteiras com Monitoramento, NAGI e Sala Dev.

---

## .centro_de_estudos | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: não encontrado.
- Nome interno: `.centro_de_estudos`.
- Rota: não encontrada.
- Status: não encontrado.
- Tipo: pasta oculta/técnica ou frente experimental.

### 2. Função do módulo
- Não foi possível inferir com segurança sem arquivos listados relevantes.

### 3. Estrutura técnica
- Pasta identificada: [`.centro_de_estudos`](../src/modules/.centro_de_estudos).
- Manifest/module-doc/routes: não encontrados no inventário coletado.

### 4. Supabase e dados
- Não encontrado.

### 5. Regras, cálculos e lógicas
- Não encontrado.

### 6. Integrações
- Não encontrado.

### 7. Padrões utilizados
- Fora do padrão modular oficial, por ausência de manifest/module-doc/routes no inventário.

### 8. Maturidade atual
- Conceitual/não iniciado.

### 9. Lacunas e riscos
- Pasta oculta dentro de módulos pode confundir catálogo e automações.

### 10. Reaproveitamentos possíveis
- Não identificado.

### 11. Recomendações
- Decidir se vira módulo oficial, documentação interna ou se deve sair de [`src/modules`](../src/modules).

---

## Agentes Comerciais | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Agentes Comerciais, conforme [`manifest.ts`](../src/modules/agentes_comerciais/manifest.ts).
- Nome interno: `agentes_comerciais`.
- Rota: `/agentes-comerciais`.
- Status: active, conforme [`module-doc.ts`](../src/modules/agentes_comerciais/module-doc.ts).
- Responsável: Oton Lacerda (Diretor), conforme manifest.
- Tipo: módulo oficial/frente comercial.

### 2. Função do módulo
- Governar ou operacionalizar agentes comerciais.
- Problema: organizar frente comercial com agentes e automações.
- Destacável: possível como frente comercial, mas depende de dados compartilhados de agentes.

### 3. Estrutura técnica
- Pasta: [`agentes_comerciais`](../src/modules/agentes_comerciais).
- Manifest/module-doc existentes.
- Estrutura detalhada não expandida no inventário truncado; requer varredura específica se virar frente prioritária.

### 4. Supabase e dados
- Não foram identificadas tabelas específicas no trecho coletado.

### 5. Regras, cálculos e lógicas
- Não encontrado em detalhe.

### 6. Integrações
- Provável integração com agentes e CRM; não confirmado por module-doc.

### 7. Padrões utilizados
- Possui manifest/module-doc; documentação parece genérica.

### 8. Maturidade atual
- Base criada/parcial.

### 9. Lacunas e riscos
- Module-doc genérico; pode não refletir implementação real.

### 10. Reaproveitamentos possíveis
- Pode reaproveitar `agents`/Quadro de Elite.

### 11. Recomendações
- Revisar module-doc e mapear tabelas reais.

---

## API SagB | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: API SagB.
- Nome interno: `api_sagb`.
- Rota: `/api-sagb`, conforme [`manifest.ts`](../src/modules/api_sagb/manifest.ts).
- Status: active.
- Responsável: Dante Conec, conforme manifest.
- Tipo: camada técnica/API oficial.

### 2. Função do módulo
- Camada oficial de API para consumo interno/externo com segurança, permissão e rastreabilidade, conforme [`module-doc.ts`](../src/modules/api_sagb/module-doc.ts).

### 3. Estrutura técnica
- Pasta: [`api_sagb`](../src/modules/api_sagb).
- Subpastas: [`audit`](../src/modules/api_sagb/audit), [`contracts`](../src/modules/api_sagb/contracts), [`endpoints`](../src/modules/api_sagb/endpoints), [`integration`](../src/modules/api_sagb/integration), [`security`](../src/modules/api_sagb/security), [`versioning`](../src/modules/api_sagb/versioning), [`pages`](../src/modules/api_sagb/pages).
- Arquivos de governança: [`CHANGELOG_API.md`](../src/modules/api_sagb/CHANGELOG_API.md), [`changelog.md`](../src/modules/api_sagb/changelog.md), [`decisions.md`](../src/modules/api_sagb/decisions.md).

### 4. Supabase e dados
- Usa tabela `api_audit_log` em [`auditLogger.ts`](../src/modules/api_sagb/audit/auditLogger.ts).
- Usa tabela `api_keys` em [`authMiddleware.ts`](../src/modules/api_sagb/security/authMiddleware.ts).

### 5. Regras, cálculos e lógicas
- Autenticação por API key.
- Rate limiting token bucket em [`rateLimiter.ts`](../src/modules/api_sagb/security/rateLimiter.ts).
- Auditoria e versionamento.

### 6. Integrações
- Supabase REST/PostgREST.
- Sistemas internos/externos consumidores da API.

### 7. Padrões utilizados
- Estrutura técnica robusta, com security, audit, endpoints e contracts.

### 8. Maturidade atual
- Funcional/maduro em arquitetura.

### 9. Lacunas e riscos
- Module-doc é curto em relação à complexidade real.
- Risco de divergência entre contratos e endpoints se documentação não for mantida.

### 10. Reaproveitamentos possíveis
- Rate limiter, auth middleware e audit logger são reutilizáveis.

### 11. Recomendações
- Ampliar module-doc com tabelas, endpoints, contratos e riscos de segurança.

---

## Cadastro de Empresas | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Cadastro de Empresas.
- Nome interno: `cadastro-empresas`.
- Rota: `/cadastro-empresas`.
- Status: active.
- Responsável: não encontrado no trecho.
- Tipo: módulo oficial de cadastro/base empresarial.

### 2. Função do módulo
- Cadastro e persistência de empresas/ventures.
- Papel central como fonte de entidades empresariais.

### 3. Estrutura técnica
- Pasta: [`cadastro-empresas`](../src/modules/cadastro-empresas).
- Serviços identificados: [`logoStorage.ts`](../src/modules/cadastro-empresas/services/logoStorage.ts), [`empresaPersistence.ts`](../src/modules/cadastro-empresas/services/empresaPersistence.ts).
- View: [`CadastroEmpresasView.tsx`](../src/modules/cadastro-empresas/components/CadastroEmpresasView.tsx).

### 4. Supabase e dados
- Usa tabela `ventures` via [`CadastroEmpresasView.tsx`](../src/modules/cadastro-empresas/components/CadastroEmpresasView.tsx).
- Usa storage para logos com bucket de empresas em [`logoStorage.ts`](../src/modules/cadastro-empresas/services/logoStorage.ts).
- Há compatibilidade legada em tipos e persistência.

### 5. Regras, cálculos e lógicas
- Normalização de logo/path e compatibilidade com campos legados (`createdAt`, `updatedAt`, `timestamp`).

### 6. Integrações
- Supabase DB e Supabase Storage.

### 7. Padrões utilizados
- Manifest/module-doc existem; module-doc aparenta genérico.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Risco de legado na tabela `ventures` e compatibilidade duplicada.
- Necessário definir se `ventures` é fonte única para empresas.

### 10. Reaproveitamentos possíveis
- Storage de logos e normalização de entidades empresariais.

### 11. Recomendações
- Documentar contrato canônico de empresa e deprecar campos legados gradualmente.

---

## Central de Padrões | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Central de Padrões.
- Nome interno: `central_padroes`.
- Rota: `/central_padroes`.
- Responsável/agente: Zico Padron.
- Tipo: módulo oficial de governança.

### 2. Função do módulo
- Consolidar, validar e publicar padrões oficiais de código, design, nomenclatura e arquitetura, conforme [`module-doc.ts`](../src/modules/central_padroes/module-doc.ts).

### 3. Estrutura técnica
- Pasta: [`central_padroes`](../src/modules/central_padroes).
- Serviço de regras: [`governanceRulesService.ts`](../src/modules/central_padroes/services/governanceRulesService.ts).

### 4. Supabase e dados
- Module-doc registra dependências vazias, mas serviço usa Supabase/restFetch.
- Risco de documentação incompleta em relação ao serviço real.

### 5. Regras, cálculos e lógicas
- Hash SHA-256, versionamento e sync status de regras.

### 6. Integrações
- Supabase via [`services/supabase`](../src/services/supabase.ts).

### 7. Padrões utilizados
- Tem ModuleDoc tipado.

### 8. Maturidade atual
- Parcial/funcional.

### 9. Lacunas e riscos
- `dataDependencies` vazio apesar de existir serviço com persistência.

### 10. Reaproveitamentos possíveis
- Serviço de governança de regras pode ser usado por todos os módulos.

### 11. Recomendações
- Atualizar module-doc com tabelas reais de governança.

---

## C.I.D. | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: C.I.D.
- Nome interno: `cid`.
- Rota: `/cid`.
- Status: Ativo.
- Responsável técnico: A DEFINIR.
- Tipo: módulo oficial.

### 2. Função do módulo
- Centro de Inteligência Documental: upload, extração, transcrição, resumo e busca documental.

### 3. Estrutura técnica
- Pasta: [`cid`](../src/modules/cid).
- Page: [`CIDPage.tsx`](../src/modules/cid/pages/CIDPage.tsx).
- Store/runtime bridge em [`store`](../src/modules/cid/store).

### 4. Supabase e dados
- Usa bucket `cid-storage` ou infraestrutura de storage documentada como CID.
- Processamento por Netlify Functions (`cid-processor.mjs`, `cid-search.mjs`) citado em [`module-doc.ts`](../src/modules/cid/module-doc.ts).

### 5. Regras, cálculos e lógicas
- Pipeline upload → registro → processamento backend → busca.

### 6. Integrações
- Supabase Storage, Netlify Functions, possivelmente IA/transcrição.

### 7. Padrões utilizados
- Manifest, module-doc, routes, changelog, decisions e agent presentes.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Responsável técnico indefinido.
- Possível divergência entre bucket `cid-storage` e bucket compartilhado `cid-assets` usado por TaskZei.

### 10. Reaproveitamentos possíveis
- Pipeline documental e storage são reaproveitados pelo TaskZei.

### 11. Recomendações
- Definir nomenclatura única de buckets e dono operacional.

---

## Configurações do Sistema | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Configurações do Sistema.
- Nome interno: `configuracoes-ambiente` / `configuracoes-sistema`.
- Rota: não lida no trecho; manifest indica módulo de configurações.
- Responsável: A definir.

### 2. Função do módulo
- Central de configuração de ambiente/sistema.

### 3. Estrutura técnica
- Pasta: [`configuracoes-ambiente`](../src/modules/configuracoes-ambiente).
- Page: [`ConfigAmbientePage.tsx`](../src/modules/configuracoes-ambiente/pages/ConfigAmbientePage.tsx).
- Component: [`ConfiguracoesInternalMenu.tsx`](../src/modules/configuracoes-ambiente/components/ConfiguracoesInternalMenu.tsx).
- Services: [`configuracoesCatalog.ts`](../src/modules/configuracoes-ambiente/services/configuracoesCatalog.ts), [`themeTokens.ts`](../src/modules/configuracoes-ambiente/services/themeTokens.ts).

### 4. Supabase e dados
- Não encontrado no recorte.

### 5. Regras, cálculos e lógicas
- Catálogo de configurações e tokens de tema.

### 6. Integrações
- Integração interna com shell/configurações.

### 7. Padrões utilizados
- Possui manifest/module-doc/routes/agent.

### 8. Maturidade atual
- Base criada/parcial.

### 9. Lacunas e riscos
- Responsável indefinido.
- Naming divergente entre pasta, id e display.

### 10. Reaproveitamentos possíveis
- Catálogo de configurações e tokens.

### 11. Recomendações
- Padronizar id/rota/nome interno.

---

## CRM Ziplia | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: CRM Ziplia.
- Nome interno: `crm_ziplia_modulo_nativo`.
- Rota: `/crm-ziplia`.
- Responsável: Denic Celmi.
- Status: Migração em andamento.

### 2. Função do módulo
- CRM nativo para leads, estágios e conversas.

### 3. Estrutura técnica
- Pasta: [`crm_ziplia`](../src/modules/crm_ziplia).
- Service: [`crmZipliaService.ts`](../src/modules/crm_ziplia/services/crmZipliaService.ts).
- Page: [`CrmZipliaNativePage.tsx`](../src/modules/crm_ziplia/pages/CrmZipliaNativePage.tsx).

### 4. Supabase e dados
- Usa [`restFetch`](../src/services/supabase.ts) via service.
- Page ainda comenta dependência em `localStorage`/inbox messages para manter simplicidade.

### 5. Regras, cálculos e lógicas
- Mescla mensagens WhatsApp/e-mail por conversationId.

### 6. Integrações
- Hub de integração, WhatsApp, e-mail/Gmail/Titan de forma direta ou indireta.

### 7. Padrões utilizados
- Manifest/module-doc existem; migração ainda em andamento.

### 8. Maturidade atual
- Parcial.

### 9. Lacunas e riscos
- Dependência localStorage em fluxo crítico.
- Risco de duplicidade com Hub de Integração.

### 10. Reaproveitamentos possíveis
- Pipeline de conversas pode reaproveitar Hub e Núcleo Conversacional.

### 11. Recomendações
- Consolidar fonte de mensagens no Hub e remover fallback local em produção.

---

## FluxoB | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: FluxoB.
- Nome interno: `fluxob`.
- Rota: `/fluxob`.
- Status: `pre_alpha`.
- Responsável/agente: Alan Flow.

### 2. Função do módulo
- Motor de orquestração de workflows conectando agentes, sistemas e etapas manuais, conforme [`module-doc.ts`](../src/modules/fluxob/module-doc.ts).

### 3. Estrutura técnica
- Pasta: [`fluxob`](../src/modules/fluxob).
- Manifest/module-doc existentes.

### 4. Supabase e dados
- Module-doc registra tabelas vazias.

### 5. Regras, cálculos e lógicas
- Conceitos: workflow, step, trigger, condition, action, contexto e rastro.

### 6. Integrações
- Previstas com agentes e sistemas.

### 7. Padrões utilizados
- Possui documentação conceitual.

### 8. Maturidade atual
- Conceitual/base criada.

### 9. Lacunas e riscos
- Alto risco de overlap com Hub de Integração e Orquestração Principal.

### 10. Reaproveitamentos possíveis
- Modelo de workflow pode ser fundação para automações.

### 11. Recomendações
- Definir contrato com Hub de Integração antes de implementar persistência.

---

## Zen Folk | Foco AI | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Zen Folk | Foco AI.
- Nome interno: `.foco_total`.
- Rota: `/foco-total`.
- Responsável/agente: Zen Folk.

### 2. Função do módulo
- Foco, timer e produtividade individual.

### 3. Estrutura técnica
- Pasta: [`foco_total`](../src/modules/foco_total).
- Page usa [`auth`](../src/services/supabase.ts), conforme [`FocoTotalPage.tsx`](../src/modules/foco_total/pages/FocoTotalPage.tsx).

### 4. Supabase e dados
- Uso de autenticação Supabase identificado.
- Tabelas específicas não encontradas no trecho.

### 5. Regras, cálculos e lógicas
- Timer/foco.

### 6. Integrações
- Supabase Auth.

### 7. Padrões utilizados
- Manifest/module-doc existem.

### 8. Maturidade atual
- Parcial.

### 9. Lacunas e riscos
- `internalName` com ponto inicial sugere inconsistência de naming.

### 10. Reaproveitamentos possíveis
- Componentes de foco/timer podem ser usados por Sala Dev ou TaskZei.

### 11. Recomendações
- Padronizar nome interno e documentar persistência.

---

## Gestão Financeira | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Gestão Financeira.
- Nome interno: `gestao_financeira`.
- Rota: `/gestao-financeira`.
- Responsável: Yasmin Rangel.
- Status: Core Implemented (v2.0).

### 2. Função do módulo
- Gestão financeira, plano de contas, transações, conciliações e integrações financeiras.

### 3. Estrutura técnica
- Pasta: [`gestao_financeira`](../src/modules/gestao_financeira).
- Services: [`financeService.ts`](../src/modules/gestao_financeira/services/financeService.ts), [`webhookEndpoint.ts`](../src/modules/gestao_financeira/services/webhookEndpoint.ts), [`webhookValidator.ts`](../src/modules/gestao_financeira/services/webhookValidator.ts).

### 4. Supabase e dados
- Tabelas documentadas: `plano_de_contas`, `transacoes`, `configuracoes_api`, `conciliacoes`.

### 5. Regras, cálculos e lógicas
- Webhook validation HMAC.
- Conciliação e configurações API.

### 6. Integrações
- Bancos/financeiro via REST/Webhooks; Asaas/Iugu citados.

### 7. Padrões utilizados
- Module-doc específico, testes de validação existem.

### 8. Maturidade atual
- Funcional/maduro.

### 9. Lacunas e riscos
- Segurança de webhooks e credenciais deve ser continuamente auditada.

### 10. Reaproveitamentos possíveis
- Validator HMAC e estrutura de conciliação.

### 11. Recomendações
- Formalizar camada de secrets e auditoria financeira.

---

## Hub de Integrações | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Hub de Integrações.
- Nome interno: `hub_integracao`.
- Rota: `/hub-integracao`.
- Responsável/agente: Alan Flow.

### 2. Função do módulo
- Gerenciar integrações centralizadas com WhatsApp, Email, ClickUp, Meta e Supabase.

### 3. Estrutura técnica
- Pasta: [`hub-integracao`](../src/modules/hub-integracao).
- Services: [`integrationService.ts`](../src/modules/hub-integracao/services/integrationService.ts), [`whatsappService.ts`](../src/modules/hub-integracao/services/whatsappService.ts), [`emailService.ts`](../src/modules/hub-integracao/services/emailService.ts), [`credentialManager.ts`](../src/modules/hub-integracao/services/credentialManager.ts).

### 4. Supabase e dados
- Usa Supabase via `restFetch`.
- CredentialManager ainda usa `localStorage` e registra mock/local.

### 5. Regras, cálculos e lógicas
- Parse inbound, status, logs, credenciais versionadas localmente.

### 6. Integrações
- WhatsApp, Gmail/Titan, Meta, ClickUp, Supabase.

### 7. Padrões utilizados
- Manifest/module-doc; forte papel transversal.

### 8. Maturidade atual
- Funcional/parcial.

### 9. Lacunas e riscos
- Credenciais em localStorage são risco para produção.
- Possível acoplamento com CRM e TaskZei.

### 10. Reaproveitamentos possíveis
- Deve ser hub oficial para integrações externas de todos os módulos.

### 11. Recomendações
- Migrar credenciais para Supabase Vault/Secrets ou backend seguro.

---

## Karaokê SagB | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Karaokê SagB.
- Nome interno: `karaoke`.
- Rota: não lida no trecho; manifest existe.
- Responsável/agente: Nanis Pelta.

### 2. Função do módulo
- Player sincronizado para revisão e leitura guiada de sessões do Studio.

### 3. Estrutura técnica
- Pasta: [`karaoke`](../src/modules/karaoke).
- Module-doc registra sem tabelas/storages próprios.

### 4. Supabase e dados
- Tabelas: nenhuma registrada.
- Consome outputs do Studio por inferência documentada.

### 5. Regras, cálculos e lógicas
- Sincronismo por timestamp/letra.

### 6. Integrações
- Studio.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Base criada/parcial.

### 9. Lacunas e riscos
- Dependência de dados do Studio precisa de contrato.

### 10. Reaproveitamentos possíveis
- Player sincronizado pode servir para revisão de transcrições.

### 11. Recomendações
- Criar contrato formal com Studio.

---

## MCP SagB | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: MCP SagB.
- Nome interno: `mcp_sagb`.
- Rota: `/mcp_sagb`.
- Responsável/agente: Sávio Codare.

### 2. Função do módulo
- Catálogo/configuração de ferramentas MCP, VS Code, terminal, git, Netlify, Supabase.

### 3. Estrutura técnica
- Pasta: [`mcp_sagb`](../src/modules/mcp_sagb).
- Dados de catálogo: [`mcpSagbCatalog.ts`](../src/modules/mcp_sagb/data/mcpSagbCatalog.ts).
- Types: [`mcpSagb.types.ts`](../src/modules/mcp_sagb/types/mcpSagb.types.ts).

### 4. Supabase e dados
- Module-doc registra sem tabelas Supabase e localStorage keys `sagb:mcp-tools-config`, `sagb:mcp-preferences`.

### 5. Regras, cálculos e lógicas
- Catálogo de configurações e categorias técnicas.

### 6. Integrações
- VS Code, terminal, git, Netlify, Supabase.

### 7. Padrões utilizados
- ModuleDoc tipado.

### 8. Maturidade atual
- Parcial/funcional como catálogo.

### 9. Lacunas e riscos
- Configurações sensíveis não devem ficar apenas em localStorage.

### 10. Reaproveitamentos possíveis
- Catálogo técnico para agentes e Sala Dev.

### 11. Recomendações
- Separar preferências locais de credenciais sensíveis.

---

## Central de Mentorias | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Central de Mentorias.
- Nome interno: `mentorias`.
- Rota: `/mentorias`.
- Responsável/agente: Agente de Mentorias.

### 2. Função do módulo
- Governar biblioteca, acompanhamento e operação de mentorias.

### 3. Estrutura técnica
- Pasta: [`mentorias`](../src/modules/mentorias).
- Hooks: [`useMentorias.ts`](../src/modules/mentorias/hooks/useMentorias.ts), [`useMentoriaDetail.ts`](../src/modules/mentorias/hooks/useMentoriaDetail.ts).
- Pages: dashboard, library e detalhe.
- Service: [`mentorias.service.ts`](../src/modules/mentorias/services/mentorias.service.ts).
- Store/types presentes.

### 4. Supabase e dados
- Usa Supabase em [`mentorias.service.ts`](../src/modules/mentorias/services/mentorias.service.ts).
- Upload de material ainda TODO com placeholder.

### 5. Regras, cálculos e lógicas
- Gestão de mentoria, blocos, materiais, sessão, versão, histórico.

### 6. Integrações
- Supabase; futuro storage.

### 7. Padrões utilizados
- Estrutura modular completa.

### 8. Maturidade atual
- Funcional/parcial.

### 9. Lacunas e riscos
- Upload/material usa placeholder.

### 10. Reaproveitamentos possíveis
- Estrutura versionada e histórico podem servir a metodologias.

### 11. Recomendações
- Implementar storage real e documentar tabelas.

---

## Núcleo de Metodologias | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Núcleo de Metodologias.
- Nome interno: `metodologias`.
- Rota: `/metodologias`.
- Responsável/agente: Agente de Metodologias.

### 2. Função do módulo
- Governar catálogo, estruturação, versionamento, saúde e operação das metodologias do SagB.

### 3. Estrutura técnica
- Pasta: [`metodologias`](../src/modules/metodologias).
- Services identificados: persistência, comparação canônica, mesa operacional, catálogo de exploração.

### 4. Supabase e dados
- Usa Supabase em [`metodologiasPersistencia.ts`](../src/modules/metodologias/services/metodologiasPersistencia.ts).

### 5. Regras, cálculos e lógicas
- Facetas, agrupamentos operacionais, comparação canônica, versionamento.

### 6. Integrações
- Supabase e possíveis arquivos brutos.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Precisa garantir que metodologia não duplique Central de Padrões.

### 10. Reaproveitamentos possíveis
- Motor de estruturação e facetas pode ser reutilizado em mentorias e documentação.

### 11. Recomendações
- Definir fronteira: padrões vs metodologias vs mentorias.

---

## Missões | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Missões.
- Nome interno: `missoes`.
- Rota: `/missoes`.
- Status: active.

### 2. Função do módulo
- Módulo de missões/tarefas estratégicas; detalhe não encontrado no trecho.

### 3. Estrutura técnica
- Pasta: [`missoes`](../src/modules/missoes).
- Manifest/module-doc existem, porém module-doc aparenta genérico.

### 4. Supabase e dados
- Não identificado.

### 5. Regras, cálculos e lógicas
- Não identificado.

### 6. Integrações
- Não identificado.

### 7. Padrões utilizados
- Manifest/module-doc, mas documentação insuficiente.

### 8. Maturidade atual
- Base criada.

### 9. Lacunas e riscos
- Pode duplicar TaskZei se não houver fronteira clara.

### 10. Reaproveitamentos possíveis
- Pode consumir TaskZei para execução operacional.

### 11. Recomendações
- Definir diferença entre missão estratégica e tarefa operacional.

---

## Monitoramento | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Monitoramento.
- Nome interno: `monitoramento`.
- Rota: `/monitoramento`.
- Responsável: Noali Kessler.
- Status: ativo.

### 2. Função do módulo
- Monitoramento sistêmico, infraestrutura, custos e saúde de serviços.

### 3. Estrutura técnica
- Pasta: [`monitoramento`](../src/modules/monitoramento).
- Services: [`supabaseTablesService.ts`](../src/modules/monitoramento/services/supabaseTablesService.ts), catálogo de monitoramento.
- Component: [`SupabaseTablesView.tsx`](../src/modules/monitoramento/components/SupabaseTablesView.tsx).

### 4. Supabase e dados
- Tabelas citadas: `system_metrics` e outras em module-doc.
- Também audita documentação dos módulos para tabelas Supabase.

### 5. Regras, cálculos e lógicas
- Agrega uso de tabelas por módulo e estatísticas.

### 6. Integrações
- Supabase, provider health, builds/deploys.

### 7. Padrões utilizados
- ModuleDoc tipado e específico.

### 8. Maturidade atual
- Funcional/parcial.

### 9. Lacunas e riscos
- Dependência da qualidade dos module-docs; se docs estão desatualizados, monitoramento erra.

### 10. Reaproveitamentos possíveis
- Visão de uso de Supabase por módulo é estratégica.

### 11. Recomendações
- Tornar módulo guardião automático de documentação técnica.

---

## NAGI | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: NAGI.
- Nome interno: `nagi`.
- Rota: `/nagi`.
- Responsável técnico: A DEFINIR.
- Status: em estruturação.

### 2. Função do módulo
- Núcleo de Apoio à Gestão Inteligente; portfólio/iniciativas e frentes estratégicas.

### 3. Estrutura técnica
- Pasta: [`nagi`](../src/modules/nagi).
- Blueprint: [`nagiBlueprint.ts`](../src/modules/nagi/data/nagiBlueprint.ts).

### 4. Supabase e dados
- Migration futura/preparada citada: `20260313000102_nagi_radar_core.sql`.
- Não é storage primário.

### 5. Regras, cálculos e lógicas
- Maturidade de portfólio e iniciativas.

### 6. Integrações
- Consome/governa informações de outras camadas.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Conceitual/base criada.

### 9. Lacunas e riscos
- Precisa diferenciar iniciativa conceitual de módulo operacional.

### 10. Reaproveitamentos possíveis
- Pode ser camada estratégica sobre módulos.

### 11. Recomendações
- Definir modelo formal de maturidade.

---

## NIC | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Núcleo de Inteligência Conectiva.
- Nome interno: `nic`.
- Rota: `/nic`.
- Responsável técnico: A DEFINIR.
- Status: em teste.

### 2. Função do módulo
- Inteligência conectiva e consumo de materiais preparados por CID/memória operacional.

### 3. Estrutura técnica
- Pasta: [`nic`](../src/modules/nic).
- Manifest/module-doc.

### 4. Supabase e dados
- Não é storage primário.

### 5. Regras, cálculos e lógicas
- Não detalhado.

### 6. Integrações
- CID e memória operacional.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Parcial/em teste.

### 9. Lacunas e riscos
- Responsável indefinido; dependências com CID precisam contrato.

### 10. Reaproveitamentos possíveis
- Consumo inteligente de documentos/processamentos.

### 11. Recomendações
- Formalizar inputs/outputs com CID e Studio.

---

## Núcleo de Agentes | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Núcleo de Agentes.
- Nome interno: `nucleo_de_agentes`.
- Rota: `/nucleo_de_agentes`.
- Responsável/agente: Brene Sagore.

### 2. Função do módulo
- Visualização das camadas dos agentes e governança de arquitetura cognitiva/operacional.

### 3. Estrutura técnica
- Pasta: [`nucleo_de_agentes`](../src/modules/nucleo_de_agentes).
- Page: [`NucleoAgentesPage.tsx`](../src/modules/nucleo_de_agentes/pages/NucleoAgentesPage.tsx).
- Component: [`BaseDosAgentesView.tsx`](../src/modules/nucleo_de_agentes/components/BaseDosAgentesView.tsx).

### 4. Supabase e dados
- Tabelas: `agents`, `governance_global_culture`, `governance_compliance_rules`, `vault_items`, `knowledge_nodes`.
- Storage/local: `continuous-memory`, localStorage e IndexedDB citados.

### 5. Regras, cálculos e lógicas
- Subscriptions realtime/onSnapshot.

### 6. Integrações
- Supabase, memória contínua.

### 7. Padrões utilizados
- Estrutura modular completa.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Risco explícito de cadastro paralelo de agentes; usar `agents` como fonte única.

### 10. Reaproveitamentos possíveis
- Fonte de identidade de agentes para todo SagB.

### 11. Recomendações
- Consolidar Quadro de Elite e Núcleo de Agentes sem duplicidade.

---

## Núcleo Conversacional | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Conversas.
- Nome interno: `nucleo-conversacional`.
- Rota: `/conversas`.
- Responsável técnico: Cássio Mendes.
- Status: ativo.

### 2. Função do módulo
- Conversas multiagente com sessões, mensagens e anexos.

### 3. Estrutura técnica
- Pasta: [`nucleo-conversacional`](../src/modules/nucleo-conversacional).
- Page: [`ConversationsView.tsx`](../src/modules/nucleo-conversacional/pages/ConversationsView.tsx).
- Services: [`chatPersistence.ts`](../src/modules/nucleo-conversacional/services/chatPersistence.ts), [`ncDb.ts`](../src/modules/nucleo-conversacional/services/ncDb.ts), [`ncLlm.ts`](../src/modules/nucleo-conversacional/services/ncLlm.ts).

### 4. Supabase e dados
- Tabelas: `chat_sessions`, `chat_messages`.
- Bucket: `sagb_chat_attachments`.

### 5. Regras, cálculos e lógicas
- Persistência, atualização de sessão, mensagens, anexos, observabilidade.

### 6. Integrações
- Supabase, LLM, anexos.

### 7. Padrões utilizados
- Estrutura própria com package/tailwind preset; parcial em relação ao padrão agent/changelog.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Estrutura diferente dos demais módulos pode ser intencional, mas deve ser documentada.

### 10. Reaproveitamentos possíveis
- Chat e anexos reutilizáveis por agentes e CRM.

### 11. Recomendações
- Padronizar documentação sem quebrar arquitetura própria.

---

## Quadro de Elite | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Quadro de Elite.
- Nome interno: `quadro_de_elite`.
- Rota: `/quadro_de_elite`.
- Responsável/agente: Helen Dravet.

### 2. Função do módulo
- Gestão, cadastro e evolução dos agentes oficiais do ecossistema.

### 3. Estrutura técnica
- Pasta: [`quadro_de_elite`](../src/modules/quadro_de_elite).
- Principal: [`AgentFactory.tsx`](../src/modules/quadro_de_elite/components/AgentFactory.tsx) e subcomponentes em [`agent-factory`](../src/modules/quadro_de_elite/components/agent-factory).

### 4. Supabase e dados
- Tabelas: `agents`, `agent_configs`, `agent_dna_profiles`, `agent_dna_effective`.

### 5. Regras, cálculos e lógicas
- Cadastro e atualização de agentes.

### 6. Integrações
- Supabase Auth/DB, authAdmin.

### 7. Padrões utilizados
- Boa estrutura modular, mas precisa alinhar com Núcleo de Agentes.

### 8. Maturidade atual
- Funcional.

### 9. Lacunas e riscos
- Risco de divergência com Núcleo de Agentes; module-doc já alerta.

### 10. Reaproveitamentos possíveis
- Fonte oficial de agentes e DNA.

### 11. Recomendações
- Definir: Quadro de Elite cadastra; Núcleo de Agentes visualiza/governa.

---

## RAI | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: RAI — Radar Avançado de Inteligência.
- Nome interno: `rai`.
- Rota: `/rai`.
- Responsável/agente: Saleh Malu.

### 2. Função do módulo
- Agentes de inteligência configuráveis para varrer fontes, capturar conteúdo, classificar e gerar alertas/leitura executiva.

### 3. Estrutura técnica
- Pasta: [`rai`](../src/modules/rai).
- Components/panels: agents, alerts, captures, filters, hero, history, readings, stats.
- Services: [`raiServices.ts`](../src/modules/rai/services/raiServices.ts), [`raiSupabaseService.ts`](../src/modules/rai/services/raiSupabaseService.ts).
- Hook/store/types presentes.

### 4. Supabase e dados
- Usa Supabase via `restFetch`.

### 5. Regras, cálculos e lógicas
- Capturas, filtros, histórico, leituras, relevância.

### 6. Integrações
- RSS/sites/APIs por objetivo declarado; Supabase.

### 7. Padrões utilizados
- Estrutura modular completa + triagem.

### 8. Maturidade atual
- Funcional/parcial.

### 9. Lacunas e riscos
- Necessita clareza sobre crawler externo e custos.

### 10. Reaproveitamentos possíveis
- Motor de captura e alerta pode alimentar NAGI/NIC.

### 11. Recomendações
- Documentar tabelas e contratos de fonte externa.

---

## SagB Bridge | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: SagB Bridge.
- Nome interno: `sagb_bridge`.
- Rota: `/sagb_bridge`.
- Responsável/agente: Alan Flow.

### 2. Função do módulo
- Ponte SagB x VS Code com deep link, task runs e relatórios.

### 3. Estrutura técnica
- Pasta: [`sagb_bridge`](../src/modules/sagb_bridge).
- Page: [`SagbBridgePage.tsx`](../src/modules/sagb_bridge/pages/SagbBridgePage.tsx).

### 4. Supabase e dados
- Tabelas: `dev_projects`, `dev_tasks`, `dev_task_runs`, `dev_developer_sessions`, `dev_task_launches`.

### 5. Regras, cálculos e lógicas
- Deep link, execução, runs, report final.

### 6. Integrações
- VS Code, API/rotas dev, Supabase.

### 7. Padrões utilizados
- Documentação específica e etapas evolutivas.

### 8. Maturidade atual
- Base criada/parcial.

### 9. Lacunas e riscos
- Extensão VS Code ainda marcada como pendente.

### 10. Reaproveitamentos possíveis
- Fluxo de execução técnica para Sala Dev e agentes programadores.

### 11. Recomendações
- Alinhar com MCP SagB e Sala Dev para evitar três pontes concorrentes.

---

## Sala Dev | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Sala Dev.
- Nome interno: `sala-dev`.
- Rota: `/sala-dev`.
- Responsável/agente: Guardião Sala Dev.

### 2. Função do módulo
- Cockpit técnico para desenvolvimento assistido, orquestração de agentes técnicos e documentação operacional.

### 3. Estrutura técnica
- Pasta: [`sala-dev`](../src/modules/sala-dev).
- Page: [`SalaDevPage.tsx`](../src/modules/sala-dev/pages/SalaDevPage.tsx).
- Services: repository, Supabase repository, agent catalog adapter.
- Governance folders com metodologias/projetos.

### 4. Supabase e dados
- Provider configurável mock/supabase em [`salaDevRepository.ts`](../src/modules/sala-dev/services/salaDevRepository.ts).
- Repositório Supabase em [`salaDevSupabaseRepository.ts`](../src/modules/sala-dev/services/salaDevSupabaseRepository.ts).

### 5. Regras, cálculos e lógicas
- Orquestração de agentes, complexidade, execução assistida.

### 6. Integrações
- Supabase, catálogo de agentes, possivelmente SagB Bridge/MCP.

### 7. Padrões utilizados
- Manifest/module-doc, mas sem agent padrão no inventário listado.

### 8. Maturidade atual
- Parcial/funcional.

### 9. Lacunas e riscos
- Overlap forte com SagB Bridge e MCP SagB.

### 10. Reaproveitamentos possíveis
- Governança multiagentes e cockpit técnico.

### 11. Recomendações
- Definir arquitetura única: Sala Dev (UI), MCP (ferramentas), Bridge (execução VS Code).

---

## Studio | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Studio.
- Nome interno: `studio`.
- Responsável/agente: Fabi Nunes.

### 2. Função do módulo
- Centro de captura inteligente: gravação de áudio/vídeo, chunking, transcrição e geração de ativos para outros módulos.

### 3. Estrutura técnica
- Pasta: [`studio`](../src/modules/studio).
- Service robusto: [`studio.ts`](../src/modules/studio/services/studio.ts).
- Page: [`StudioPage.tsx`](../src/modules/studio/pages/StudioPage.tsx).

### 4. Supabase e dados
- Tabelas: `studio_sessions`, `studio_chunks`, `studio_session_cameras`, `studio_camera_files`, `studio_audio_tracks`, `cid_assets`, `cid_outputs`.
- Bucket: `studio`.

### 5. Regras, cálculos e lógicas
- Gravação, uploads, transcrição, fallback local, downloads, trilhas/câmeras.

### 6. Integrações
- Supabase DB/Storage, Gemini, CID, Karaoke.

### 7. Padrões utilizados
- Module-doc existe, mas estilo difere de ModuleDoc tipado.

### 8. Maturidade atual
- Funcional/maduro em implementação.

### 9. Lacunas e riscos
- Módulo grande e produtor de dados; requer governança de storage/custos.

### 10. Reaproveitamentos possíveis
- Captura/transcrição para NIC, Karaoke, CID e Núcleo Conversacional.

### 11. Recomendações
- Formalizar contratos de outputs consumidos por outros módulos.

---

## TaskZei / Agenda Inteligente | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido atual: Agenda Inteligente.
- Nome interno: TaskZei.
- Manifest id: `agenda`.
- Rota: `/agenda-inteligente`.
- Responsável: Dani Freitas.

### 2. Função do módulo
- Gestão operacional de tarefas, agenda, projetos, processos, documentos, campos personalizados, anexos, notificações e integrações.

### 3. Estrutura técnica
- Pasta: [`taskzei`](../src/modules/taskzei).
- Estrutura completa: components, docs, layout, pages, services, store, types, agent.
- Arquivos: README, changelog, decisions, manifest, module-doc, routes.

### 4. Supabase e dados
- Tabelas: `taskzei_tasks`, `taskzei_doc_nodes`, `taskzei_doc_contents`, `taskzei_entity_links`, `taskzei_doc_attachments`, `taskzei_notifications`, `taskzei_push_devices`, `taskzei_custom_field_definitions`, `taskzei_task_custom_values`, `taskzei_task_attachments`, `taskzei_audit_log`.
- Bucket: `cid-assets`.

### 5. Regras, cálculos e lógicas
- Tarefas, checklist, comentários, reuniões, inbox, documentos, EAV, anexos, audit log.
- Provider mock/supabase.

### 6. Integrações
- Hub de Integração, ClickUp, WhatsApp, Resend/SendGrid, OneSignal, CID.

### 7. Padrões utilizados
- Estrutura muito completa, mas nome exibido ainda acoplado a “Agenda Inteligente”.

### 8. Maturidade atual
- Funcional/parcial avançado.

### 9. Lacunas e riscos
- Acoplamento com SagB/CID/Agenda Inteligente.
- Drawer e anexos têm dívidas identificadas no próprio código.

### 10. Reaproveitamentos possíveis
- Motor de tarefas, EAV, documentos e audit log.

### 11. Recomendações
- Separar TaskZei como produto independente e manter integrações via contratos.

---

## Telas Avançadas | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Telas Avançadas.
- Nome interno: `telas_avancadas`.
- Rota: `/telas-avancadas`.
- Responsável: Cley Scrini.

### 2. Função do módulo
- Cadastro, organização e visualização de telas avançadas em URL externa, HTML e código.

### 3. Estrutura técnica
- Pasta: [`telas_avancadas`](../src/modules/telas_avancadas).
- Store: [`telasAvancadas.store.ts`](../src/modules/telas_avancadas/store/telasAvancadas.store.ts).

### 4. Supabase e dados
- Sem Supabase na versão atual.
- LocalStorage: `sagb_telas_avancadas_v2`, `sagb_telas_avancadas`.

### 5. Regras, cálculos e lógicas
- Carregamento/salvamento de telas em storage local.

### 6. Integrações
- URLs externas/HTML.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Parcial.

### 9. Lacunas e riscos
- Sem persistência real em Supabase.

### 10. Reaproveitamentos possíveis
- Galeria/catálogo de telas para Studio/Documentação.

### 11. Recomendações
- Migrar storage local para tabela versionada se virar módulo crítico.

---

## Vídeos IA | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome exibido: Vídeos IA.
- Nome interno: `criador de videos`.
- Rota: `/videos-ia`.
- Status: active.

### 2. Função do módulo
- Criação/gestão de vídeos com IA; detalhes não encontrados no recorte.

### 3. Estrutura técnica
- Pasta: [`videos-ia`](../src/modules/videos-ia).
- Manifest/module-doc existem, mas module-doc aparenta genérico.

### 4. Supabase e dados
- Não identificado.

### 5. Regras, cálculos e lógicas
- Não identificado.

### 6. Integrações
- Provável IA/mídia; não confirmado.

### 7. Padrões utilizados
- Manifest/module-doc.

### 8. Maturidade atual
- Base criada/parcial.

### 9. Lacunas e riscos
- Documentação insuficiente para avaliar escopo real.

### 10. Reaproveitamentos possíveis
- Pode reaproveitar Studio para captura e CID para assets.

### 11. Recomendações
- Documentar pipeline real e relação com Studio.

---

## Síntese Geral do Inventário | 30-05-2026

### 1. Quantidade de módulos analisados
- 28 entradas em [`src/modules`](../src/modules).
- 26 módulos/fronts analisados com conteúdo suficiente.
- 2 entradas técnicas/ocultas com baixa documentação: [`.centro_de_estudos`](../src/modules/.centro_de_estudos) e possivelmente outras pastas truncadas no inventário.

### 2. Módulos maduros
- [`api_sagb`](../src/modules/api_sagb)
- [`gestao_financeira`](../src/modules/gestao_financeira)
- [`studio`](../src/modules/studio)
- [`nucleo_de_agentes`](../src/modules/nucleo_de_agentes)
- [`quadro_de_elite`](../src/modules/quadro_de_elite)

### 3. Módulos parciais/funcionais
- [`taskzei`](../src/modules/taskzei)
- [`hub-integracao`](../src/modules/hub-integracao)
- [`crm_ziplia`](../src/modules/crm_ziplia)
- [`monitoramento`](../src/modules/monitoramento)
- [`rai`](../src/modules/rai)
- [`mentorias`](../src/modules/mentorias)
- [`metodologias`](../src/modules/metodologias)
- [`sala-dev`](../src/modules/sala-dev)
- [`sagb_bridge`](../src/modules/sagb_bridge)

### 4. Módulos fora do padrão ou com documentação fraca
- [`.centro_de_estudos`](../src/modules/.centro_de_estudos)
- [`missoes`](../src/modules/missoes)
- [`videos-ia`](../src/modules/videos-ia)
- [`agentes_comerciais`](../src/modules/agentes_comerciais)
- [`cadastro-empresas`](../src/modules/cadastro-empresas)
- Alguns module-docs são genéricos e não refletem implementação real.

### 5. Módulos sem documentação mínima
- A maioria tem ao menos manifest/module-doc.
- Falta padronização de profundidade em module-docs.

### 6. Tabelas Supabase mais reutilizadas
- `agents` aparece como eixo de Núcleo de Agentes e Quadro de Elite.
- `ventures` aparece como base empresarial no Cadastro de Empresas.
- Tabelas `taskzei_*` formam ecossistema grande e próprio.
- `studio_*` formam pipeline de mídia.
- `chat_sessions` e `chat_messages` sustentam o Núcleo Conversacional.

### 7. Tabelas possivelmente duplicadas ou com sobreposição
- Agentes: `agents`, `agent_configs`, `agent_dna_*`, Núcleo de Agentes vs Quadro de Elite.
- Execução técnica: SagB Bridge, Sala Dev e MCP SagB.
- Mensagens/conversas: Hub de Integração, CRM Ziplia e Núcleo Conversacional.
- Tarefas/missões: TaskZei e Missões.

### 8. Integrações encontradas
- Supabase DB/Auth/Storage.
- Netlify Functions.
- Gemini/LLM.
- WhatsApp, Gmail/Titan, Meta, ClickUp.
- VS Code/deep link/MCP.
- Resend/SendGrid/OneSignal previstos no TaskZei.

### 9. Maiores riscos
- Module-docs genéricos/desatualizados afetando Monitoramento e governança.
- Credenciais ou integrações sensíveis ainda com marcas de localStorage/mock.
- Overlap entre módulos estratégicos e técnicos sem contrato formal.
- Buckets e nomenclaturas de storage não totalmente uniformes.
- Alguns módulos com nomes internos divergentes da pasta/rota.

### 10. Próximos passos recomendados
1. Padronizar todos os [`module-doc.ts`](../src/modules) com schema único.
2. Criar matriz oficial de ownership: módulo, dono, agente, tabelas e rota.
3. Resolver overlaps: Quadro de Elite vs Núcleo de Agentes; Sala Dev vs SagB Bridge vs MCP; CRM vs Hub vs Conversas.
4. Atualizar Monitoramento para validar automaticamente module-docs incompletos.
5. Separar módulos produto de frentes internas.
6. Revisar segurança de credenciais e localStorage.
7. Documentar contratos de dados entre Studio, CID, NIC, Karaokê e TaskZei.

## Conclusão

Auditoria documental concluída em nível macro e funcional, baseada nos manifests, module-docs, serviços e estrutura real disponível. Para auditoria de nível forense, o próximo passo é rodar uma extração automatizada de todos os imports, tabelas por arquivo, rotas finais e dependências cruzadas, gerando CSVs e matriz de acoplamento.

