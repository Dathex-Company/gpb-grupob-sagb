# 00-A — Mega Etapa | Central de Padrões 100% Funcional — 02-06-2026

## Nome do arquivo

`00-a-mega-etapa-central-padroes-100-funcional-02-06-2026.md`

## Caminho principal

`Z:\00_sagb\src\modules\central_padroes`

## Contexto

A Central de Padrões foi auditada e recebeu status **aprovado com ajustes**, com nível de completude estimado em aproximadamente **75% operacional**.

Ela já possui estrutura técnica madura, build limpo, 21 páginas implementadas, fallback offline, approval workflow, busca textual e separação por áreas.

Porém, ainda não deve ser considerada **fonte oficial única e plena dos padrões do SagB** enquanto não forem resolvidos os pontos críticos de segurança, testes, reconciliação, canonicidade, busca semântica, governança e experiência de uso.

Esta tarefa tem como objetivo transformar a Central de Padrões no **módulo mais confiável, funcional e estratégico do SagB**, funcionando como o sistema nervoso dos padrões do GrupoB / Loze / SagB.

---

# Missão principal

Executar uma mega etapa de evolução da Central de Padrões para deixá-la **100% funcional, confiável, segura, pesquisável, auditável, canônica e utilizável por humanos e agentes**.

A Central deve permitir que qualquer usuário autorizado consiga:

- encontrar padrões facilmente;
- conversar com a inteligência da Central;
- pesquisar documentos mesmo sem lembrar o nome exato;
- receber sugestões inteligentes de documentos relacionados;
- entender o que é oficial, pendente, rascunho ou obsoleto;
- saber quem é o responsável por cada padrão;
- acompanhar aprovações;
- consultar histórico de decisões;
- validar evidências;
- auditar alterações;
- usar a Central como fonte confiável para agentes do SagB.

---

# Resultado esperado

Ao final desta tarefa, a Central de Padrões deve estar apta a operar como:

1. Fonte oficial dos padrões do SagB.
2. Base canônica dos protocolos do GrupoB.
3. Repositório pesquisável de documentos, padrões, matrizes, checklists, evidências e decisões.
4. Interface de consulta inteligente com Chat Pietro.
5. Módulo seguro, com permissões granulares.
6. Módulo testado, com proteção contra regressões.
7. Módulo auditável, com logs de operações críticas.
8. Módulo integrado com Supabase, fallback, Central de Monitoramento, agentes e TaskZei.
9. Módulo fácil de usar por humanos não técnicos.
10. Base de consulta confiável para agentes de IA.

---

# Escopo da mega tarefa

Esta tarefa deve ser executada em 10 frentes obrigatórias.

---

## FRENTE 1 — Correções críticas da auditoria

### Objetivo

Resolver todos os bloqueadores identificados na auditoria anterior.

### Ações obrigatórias

1. Criar testes automatizados.
2. Corrigir políticas RLS permissivas.
3. Criar reconciliação entre fallback local e Supabase.
4. Corrigir views `architecture` e `registry`.
5. Unificar `navigationItems` e `treeSections`.
6. Expandir busca para `BaseModule` e `AgentRun`.
7. Criar serviço de auditoria completo.
8. Revisar CSS monolítico.
9. Alinhar fonte ao Alice UI Standard.
10. Corrigir acessibilidade básica.

### Critérios de aceite

- Nenhum item crítico da auditoria original deve permanecer sem plano ou correção.
- A auditoria deve ser reexecutada ao final.
- O novo relatório deve comparar “antes” e “depois”.

---

## FRENTE 2 — Segurança, RLS e permissões

### Objetivo

Garantir que a Central de Padrões não possa ser alterada indevidamente por qualquer usuário autenticado.

### Ações obrigatórias

Criar perfis mínimos:

- leitor;
- editor;
- curador;
- aprovador;
- administrador;
- agente autorizado;
- auditor.

Definir permissões por operação:

| Operação | Leitor | Editor | Curador | Aprovador | Admin | Agente | Auditor |
|---|---|---|---|---|---|---|---|
| Visualizar padrão | Sim | Sim | Sim | Sim | Sim | Condicional | Sim |
| Criar rascunho | Não | Sim | Sim | Sim | Sim | Condicional | Não |
| Editar rascunho próprio | Não | Sim | Sim | Sim | Sim | Condicional | Não |
| Editar padrão oficial | Não | Não | Não | Condicional | Sim | Não | Não |
| Aprovar padrão | Não | Não | Não | Sim | Sim | Não | Não |
| Publicar padrão | Não | Não | Não | Sim | Sim | Não | Não |
| Excluir padrão | Não | Não | Não | Não | Sim | Não | Não |
| Ver logs | Não | Não | Sim | Sim | Sim | Condicional | Sim |

### Ações técnicas

- Remover políticas `ALL for authenticated`.
- Criar RLS granular por tabela.
- Criar verificação de owner antes de edição.
- Criar proteção contra delete sem log.
- Criar soft delete para itens normativos.
- Criar log obrigatório para create, update, status change, publish, archive e delete.
- Criar alerta para alteração em item canônico.

### Critérios de aceite

- Nenhum usuário autenticado comum pode editar ou excluir padrão oficial.
- Todo delete precisa gerar log.
- Toda alteração em item canônico precisa registrar autor, data, motivo e diff.
- Agentes não podem aprovar o próprio output.

---

## FRENTE 3 — Testes automatizados e qualidade

### Objetivo

Criar barreira contra regressões.

### Testes mínimos obrigatórios

Criar pasta:

`src/modules/central_padroes/__tests__/`

Testar:

1. Renderização do layout principal.
2. Navegação entre páginas.
3. Busca textual.
4. Busca semântica, se implementada.
5. CRUD de padrões.
6. Approval workflow.
7. Mudança de status.
8. Regras de validação.
9. Repositório Supabase/fallback.
10. Reconciliação fallback ↔ Supabase.
11. Permissões básicas.
12. Logs de auditoria.
13. Renderização de documentos.
14. Filtros por área, tipo, status e responsável.
15. Chat Pietro retornando fontes.

### Critérios de aceite

- Build sem erros.
- Testes críticos passando.
- Smoke test da Central passando.
- Não pode quebrar rotas existentes.
- Qualquer alteração em approval workflow deve ter teste.

---

## FRENTE 4 — Reconciliação fallback ↔ Supabase

### Objetivo

Evitar divergência entre o fallback local e o banco Supabase.

### Ações obrigatórias

Criar mecanismo de reconciliação com:

- comparação por ID;
- comparação por título;
- comparação por tipo;
- comparação por status;
- comparação por updated_at;
- identificação de itens apenas no fallback;
- identificação de itens apenas no Supabase;
- identificação de versões divergentes;
- relatório de drift;
- opção de exportar relatório em Markdown/JSON.

### Arquivos/serviços sugeridos

- `services/centralPadroesReconciliationService.ts`
- `scripts/reconcile-central-padroes.ts`
- `docs/07_validacoes/00-r-reconciliacao-central-padroes-dd-mm-aaaa.md`

### Critérios de aceite

- O sistema deve apontar divergências antes de publicar.
- O fallback não pode virar “verdade paralela”.
- Deve existir relatório claro para revisão humana.

---

## FRENTE 5 — Busca inteligente, busca semântica e Chat Pietro

### Objetivo

Permitir que o usuário converse com a Central de Padrões e encontre documentos mesmo sem lembrar o nome exato.

### Visão desejada

Dentro da Central, o usuário deve ter uma área como:

**“Conversar com Pietro”**

ou

**“Buscar com IA”**

O usuário poderá escrever algo como:

- “Pietro, não lembro o nome do documento sobre gate visual.”
- “Quero ver os padrões de agentes.”
- “Me mostra tudo que fala sobre canonicidade.”
- “Qual documento define quem pode aprovar um padrão?”
- “Quais padrões ainda estão pendentes de validação?”
- “Onde está o protocolo de criação de agentes?”
- “Quais documentos falam sobre Loze?”
- “O que existe sobre segurança e RLS?”
- “Mostre padrões relacionados à Jornada UAU.”
- “Quais itens dependem do Rodrigues?”

A Central deve interpretar a intenção, buscar nos documentos e retornar resultados organizados.

### 5.1 Busca híbrida

Implementar busca em três camadas:

1. Busca textual tradicional.
2. Busca por metadados.
3. Busca semântica por embeddings.

A busca deve considerar:

- título;
- resumo;
- conteúdo;
- tipo normativo;
- área;
- responsável;
- status;
- tags;
- relações;
- documentos vinculados;
- decisões relacionadas;
- evidências;
- data de atualização;
- canonicidade.

### 5.2 Embeddings e pgvector

Implementar, se a stack permitir:

- geração de embeddings dos documentos;
- armazenamento em Supabase com pgvector;
- atualização de embedding quando documento mudar;
- busca por similaridade;
- ranking por score;
- fallback textual caso embeddings estejam indisponíveis.

### 5.3 Resposta com fontes

O Chat Pietro deve sempre retornar:

- resposta direta;
- documentos encontrados;
- por que esses documentos foram sugeridos;
- tipo de cada documento;
- status de canonicidade;
- responsável;
- trecho relevante;
- link/rota interna;
- ações possíveis.

Exemplo de resposta esperada:

```text
Encontrei 4 documentos relacionados ao que você pediu:

1. CP-UX-003 — Gate visual de tela
Status: canônico operacional
Responsável: Alice
Por que apareceu: fala sobre aprovação visual obrigatória antes de release.

2. CP-UX-006 — Evidência visual por release
Status: homologado em curadoria
Responsável: Alice/Pietro
Por que apareceu: trata da obrigação de evidência visual antes da publicação.

3. DEC-024 — Decisão sobre gate visual obrigatório
Status: pendente Rodrigues
Responsável: Rodrigues/Kane
Por que apareceu: depende de decisão final de governança.

Deseja abrir o documento, comparar padrões ou criar uma tarefa de ajuste?
```

### 5.4 Chat Pietro como agente interno

O Chat Pietro deve operar com o seguinte comportamento:

- não inventar documento;
- não tratar rascunho como oficial;
- sempre informar status;
- sempre mostrar fonte;
- diferenciar “encontrado” de “interpretação”;
- sugerir próximos passos;
- indicar se algo depende de Pietro, Rodrigues, Alice, Sávio, Pedro Gazan ou outro responsável;
- explicar em linguagem simples;
- responder com foco em decisão e ação.

### 5.5 Modos do Chat Pietro

Criar modos:

1. **Buscar documento**
2. **Explicar padrão**
3. **Comparar padrões**
4. **Encontrar lacunas**
5. **Criar tarefa**
6. **Checar canonicidade**
7. **Checar responsável**
8. **Checar riscos**
9. **Gerar relatório**
10. **Preparar validação Pietro**

### 5.6 Segurança do Chat Pietro

O Chat não pode:

- revelar documento sem permissão;
- aprovar padrão sozinho;
- alterar status sem autorização;
- editar padrão canônico sem fluxo de aprovação;
- responder com base em documento não indexado sem avisar;
- esconder incerteza;
- misturar rascunho com oficial.

### Critérios de aceite

- O usuário consegue pesquisar de forma natural.
- O Chat Pietro retorna documentos relevantes mesmo com pedido aproximado.
- Toda resposta possui fonte interna.
- Toda resposta diferencia oficial, rascunho, pendente e obsoleto.
- O Chat não inventa item.
- O Chat consegue sugerir tarefa a partir de uma lacuna encontrada.
- O Chat respeita permissões.

---

## FRENTE 6 — Canonicidade, status e curadoria Pietro

### Objetivo

Transformar a Central em fonte confiável, separando claramente o que é oficial do que ainda está em construção.

### Status obrigatórios

Padronizar status:

- bruto;
- rascunho;
- em revisão;
- em curadoria;
- homologado;
- canônico operacional;
- canônico oficial;
- publicado;
- obsoleto;
- arquivado;
- bloqueado.

### Campos obrigatórios por padrão

Cada item normativo deve ter:

- ID único;
- título;
- tipo;
- área;
- responsável;
- dono humano;
- status;
- nível de canonicidade;
- data de criação;
- data de última revisão;
- origem;
- documentos relacionados;
- decisões relacionadas;
- evidências relacionadas;
- riscos;
- histórico;
- tags;
- próxima ação;
- quem pode aprovar;
- dependência atual.

### Ações obrigatórias

- Validar CP-GOV.
- Validar CP-SEG.
- Validar CP-AGT.
- Validar CP-IA.
- Validar CP-PROC.
- Validar CP-NAM.
- Validar CP-IDEIA.
- Validar CP-MET.
- Validar CP-ACADB.
- Validar CP-STARTYB.
- Inserir Tales/RI se ainda não existir no fallback.
- Criar painel de pendências Pietro.
- Criar painel de pendências Rodrigues/Kane.

### Critérios de aceite

- Nenhum item pode parecer oficial sem status claro.
- Todos os itens precisam ter dono.
- Toda pendência precisa ter responsável.
- Toda decisão pendente precisa aparecer em painel.

---

## FRENTE 7 — UX, UI e experiência UAU da Central

### Objetivo

A Central precisa ser fácil, clara e agradável de usar. Ela não pode ser apenas técnica.

### Ações obrigatórias

- Criar onboarding inicial.
- Criar tela “Como usar a Central”.
- Criar área “Pergunte ao Pietro”.
- Criar atalhos rápidos:
  - Ver padrões oficiais.
  - Ver pendências Pietro.
  - Ver pendências Rodrigues.
  - Ver padrões por área.
  - Ver documentos recentes.
  - Ver padrões críticos.
  - Ver lacunas.
  - Ver decisões.
- Melhorar diferença visual entre:
  - padrão;
  - protocolo;
  - checklist;
  - matriz;
  - decisão;
  - evidência;
  - documento mestre;
  - rascunho.
- Ajustar fonte conforme Alice UI Standard.
- Melhorar acessibilidade.
- Garantir responsividade.

### Critérios de aceite

- Usuário novo entende a Central em até 3 minutos.
- A busca fica visível.
- O Chat Pietro fica fácil de acessar.
- Status e responsáveis ficam claros.
- Não há confusão entre documentos e padrões.

---

## FRENTE 8 — Integrações com SagB, Loze, TaskZei e Central de Monitoramento

### Objetivo

Fazer a Central conversar com o restante do ecossistema.

### Integrações obrigatórias

1. **Central de Monitoramento**
   - enviar eventos de alteração;
   - enviar riscos;
   - enviar padrões vencidos;
   - enviar pendências críticas.

2. **TaskZei**
   - criar tarefa a partir de lacuna;
   - criar tarefa a partir de decisão pendente;
   - criar tarefa a partir de padrão vencido;
   - criar tarefa a partir de evidência ausente.

3. **Agentes**
   - permitir que agentes consultem padrões;
   - impedir que agentes alterem sem permissão;
   - registrar consultas críticas;
   - vincular resposta de agente ao padrão consultado.

4. **Loze**
   - garantir que padrões da Loze estejam separados dos padrões gerais do SagB;
   - definir escopo Loze/GrupoB/SagB;
   - exibir dependências.

5. **Documentos**
   - vincular documentos Markdown;
   - vincular PDFs, se existirem;
   - vincular atas e decisões;
   - vincular evidências visuais.

### Critérios de aceite

- Uma lacuna pode virar tarefa.
- Um padrão vencido pode virar alerta.
- Um agente pode consultar a Central e citar a fonte interna.
- Uma decisão pendente pode aparecer no painel de governança.

---

## FRENTE 9 — Auditoria, logs e rastreabilidade

### Objetivo

Garantir que toda mudança relevante seja rastreável.

### Eventos obrigatórios

Registrar logs para:

- criação;
- edição;
- exclusão;
- soft delete;
- restauração;
- envio para revisão;
- aprovação;
- publicação;
- arquivamento;
- mudança de responsável;
- mudança de status;
- alteração em padrão canônico;
- consulta por agente;
- resposta gerada pelo Chat Pietro;
- falha de busca;
- divergência fallback/Supabase.

### Campos de log

Cada log deve conter:

- ID do evento;
- tipo de evento;
- usuário/agente;
- data/hora;
- item afetado;
- status anterior;
- status novo;
- motivo;
- diff, quando aplicável;
- origem da ação;
- nível de risco;
- link interno.

### Critérios de aceite

- Toda ação crítica aparece em log.
- Delete nunca é invisível.
- Alteração em padrão canônico exige justificativa.
- Consulta por agente fica rastreável quando envolver decisão crítica.

---

## FRENTE 10 — Reauditoria e validação final

### Objetivo

Validar se a Central atingiu o nível necessário para virar fonte oficial.

### Ações obrigatórias

Após a implementação, gerar novo documento:

`00-r-reauditoria-central-padroes-100-funcional-02-06-2026.md`

A reauditoria deve comparar:

- status anterior;
- status novo;
- lacunas resolvidas;
- lacunas restantes;
- riscos reduzidos;
- riscos remanescentes;
- funcionalidades novas;
- testes implementados;
- permissões corrigidas;
- busca IA funcionando;
- Chat Pietro funcionando;
- canonicidade atualizada;
- decisão final de status.

### Status final possível

- fonte oficial plena;
- fonte oficial com supervisão;
- homologação assistida;
- aprovado com ajustes;
- não aprovado.

### Critérios de aceite final

A Central só pode ser considerada **fonte oficial plena** se:

1. RLS granular estiver ativo.
2. Testes críticos estiverem passando.
3. Fallback e Supabase tiverem reconciliação.
4. Busca inteligente estiver funcional.
5. Chat Pietro retornar documentos com fonte.
6. Canonicidade estiver clara.
7. Logs críticos estiverem ativos.
8. Menus e views estiverem corrigidos.
9. A experiência de uso estiver clara.
10. Reauditoria final estiver salva em `docs/07_validacoes`.

---

# Entregáveis obrigatórios

Ao final, entregar:

1. Código ajustado.
2. Testes criados.
3. Políticas RLS revisadas.
4. Serviço de reconciliação.
5. Serviço de auditoria/logs.
6. Busca expandida.
7. Busca semântica, se stack permitir.
8. Chat Pietro interno.
9. Painel de canonicidade.
10. Painel de pendências.
11. UX/onboarding ajustado.
12. Integração com TaskZei/Central de Monitoramento, se disponível.
13. Reauditoria final em Markdown.
14. Relatório “antes e depois”.
15. Lista de itens que ainda dependem de decisão humana.

---

# Responsáveis sugeridos

| Frente | Responsável principal | Apoio |
|---|---|---|
| Técnica, testes, views, menus | Sávio Codare | Zico Padron |
| Segurança/RLS | Pedro Gazan | Sávio |
| UX/UI | Alice Montini | Pietro |
| Canonicidade | Pietro Carboni | Rodrigues/Kane |
| Agentes/IA | Pierre Zanulli | Klaus |
| Busca semântica/RAI | Klaus | Sávio |
| Processos/TaskZei | Yuri Sague | Pietro |
| StartyB/Planos | César Tulli | Tales |
| RI/Capital | Tales Inozi | César |
| Decisões finais | Rodrigues/Kane | Pietro/Nassar |

---

# Critérios gerais de qualidade

A entrega precisa ser:

- funcional;
- segura;
- testada;
- rastreável;
- clara;
- fácil de usar;
- alinhada ao GrupoB;
- aderente a DR, GERAC e Jornada UAU;
- útil para humanos;
- útil para agentes;
- sem duplicidade;
- sem fonte da verdade paralela;
- sem padrão oficial sem dono;
- sem IA inventando documento;
- sem rascunho parecendo oficial.

---

# Comando de execução sugerido para o agente

Executar a mega etapa da Central de Padrões no caminho:

`Z:\00_sagb\src\modules\central_padroes`

Objetivo: transformar a Central de Padrões em fonte oficial confiável, segura, testada, pesquisável e inteligente do SagB.

Priorizar:

1. segurança RLS;
2. testes automatizados;
3. reconciliação fallback/Supabase;
4. correção de views e menus;
5. busca expandida;
6. Chat Pietro com IA;
7. canonicidade;
8. logs/auditoria;
9. UX/onboarding;
10. reauditoria final.

Não considerar a tarefa concluída sem gerar o documento:

`00-r-reauditoria-central-padroes-100-funcional-02-06-2026.md`

---

# Parecer Pietro

A Central de Padrões é o módulo mais estratégico do SagB porque sustenta a coerência do ecossistema. Sem ela, padrões ficam espalhados, agentes interpretam regras de forma diferente, decisões perdem rastreabilidade e a cultura do GrupoB vira memória solta.

A meta desta mega etapa não é apenas corrigir bugs. É transformar a Central no lugar onde o GrupoB pergunta:

> “Qual é o padrão oficial disso?”

E recebe uma resposta clara, com fonte, responsável, status, histórico e próximo passo.
