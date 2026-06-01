# SagB | Quadro de Elite | Auditoria, renomeacao e base do sistema de nomes

Data: 2026-06-01  
Agente responsavel: Helen Dravet  
Escopo analisado: `src/modules/quadro_de_elite`

---

## 1. Auditoria objetiva do estado atual

### Funcao real do modulo hoje

O modulo ainda se chama **Quadro de Elite**, mas sua funcao real ja deixou de ser apenas uma vitrine de agentes. Hoje ele opera como **cadastro estrutural central de humanos, agentes de IA e entidades hibridas do SagB**.

Ele concentra:

- cadastro e edicao de entidades operacionais;
- classificacao por tipo: humano, agente ou hibrido;
- identidade canonica imutavel;
- associacao com venture, unidade, area e funcao;
- status estrutural, status operacional e status de DNA;
- dados de acesso, e-mail e vinculo com usuario autenticado;
- mentor IA, responsavel humano e relacoes hierarquicas;
- configuracoes de modelo/stack para agentes;
- importacao em lote;
- persistencia principal na tabela `agents` via shim Supabase.

### Estrutura atual

Arquivos principais:

- `manifest.ts`: declara id, nome exibido, rota, icone e owner do modulo.
- `pages/QuadroDeElitePage.tsx`: pagina de entrada, cabecalho padrao e injecao do contexto runtime.
- `components/AgentFactory.tsx`: componente central de listagem, filtro, abertura de formulario, validacao, persistencia e importacao.
- `components/agent-factory/AgentFactoryFormModal.tsx`: formulario estrutural em blocos.
- `components/agent-factory/AgentFactoryTable.tsx`: tabela operacional com colunas basicas e avancadas.
- `components/agent-factory/constants.ts`: taxonomias locais de tipo, nivel, unidade, area, papel, status, DNA e stack.
- `store/runtimeBridge.ts`: ponte de contexto entre app e modulo.
- `module-doc.ts`, `decisions.md`, `changelog.md`, `agent/session_log.md`: governanca documental.

### Campos existentes no cadastro estrutural

Campos centrais identificados:

- Identidade: `id`, `universalId`, `canonicalId`, `name`, `entityType`, `shortDescription`, `avatarUrl`.
- Organizacao: `company`, `buId`, `ventureId`, `unitName`, `area`, `functionName`, `baseRoleUniversal`, `division`, `sector`.
- Papel e ciclo de vida: `tier`, `roleType`, `status`, `active`, `structuralStatus`, `operationalStatus`, `operationalActivation`.
- Inteligencia/DNA: `dnaStatus`, `operationalClass`, `allowedStacks`, `preferredModel`, `modelProvider`, `fullPrompt`, `dnaIndividualPrompt`, `effectivePrompt`.
- Relacionamentos: `aiMentor`, `humanOwner`, `projectId`.
- Acesso: `email`, `usesEmail`, `authUserId`.
- Governanca/extra: `origin`, `customFields`, `docCount`, `createdAt`, `updatedAt`, `createdBy`, `updatedBy`, `workspaceId`.

### O que esta coerente

- A decisao de centralizar o cadastro no modulo e coerente com a necessidade de fonte unica de identidade.
- `canonicalId` imutavel e validado ja cria uma camada forte de rastreabilidade.
- A separacao entre cadastro estrutural, DNA e operacionalidade evita liberar agentes sem configuracao cognitiva suficiente.
- O formulario por blocos organiza bem a complexidade.
- A tabela com colunas avancadas permite leitura operacional sem transformar tudo em tela obrigatoria.
- A persistencia em `agents` e a consulta via runtime evitam uma tela totalmente isolada do restante do sistema.

### O que esta excessivo

- O nome **Quadro de Elite** comunica status/prestigio, mas o modulo hoje faz cadastro estrutural e governanca de identidade. O nome ficou menor que a funcao.
- O formulario mistura cadastro basico, organograma, acesso, DNA, stack e operacao avancada. Para usuario comum, isso pode parecer um cadastro pesado demais.
- Alguns campos tecnicos aparecem cedo demais para uma primeira criacao: `canonicalId`, `operationalActivation`, `operationalClass`, `allowedStacks`, `preferredModel`.
- `customFields` pode virar deposito sem padrao se nao houver governanca de chaves aceitas.

### O que esta confuso

- O termo **Agente Factory** permanece nos componentes, enquanto a interface fala em Quadro de Elite e a funcao real e cadastro estrutural.
- `humanOwner` e usado como nome do gestor direto, nao como id. Isso fragiliza relacoes futuras se houver nomes repetidos ou alteracao de nome.
- `aiMentor` tambem salva nome, nao id, criando a mesma fragilidade.
- `canonicalId` e fortemente validado, mas `name` ainda nao possui validacao formal contra repeticao exata ou nomes muito parecidos.
- O modulo esta pronto para governanca de identidade, mas ainda nao possui uma ferramenta propria de criacao/validacao de nomes.

### O que precisa evoluir

- Renomear conceitualmente o modulo para refletir cadastro, identidade e governanca de humanos/agentes.
- Criar uma camada explicita de **Nome Operacional** com validacao, sugestao e reserva.
- Validar duplicidade de `name` no cadastro antes do `persistAgent`.
- Evoluir relacionamentos `humanOwner` e `aiMentor` para ids, mantendo nome apenas como label denormalizado.
- Separar formulario em modo simples e modo avancado.
- Criar uma area propria para explorar, validar, reservar e aprovar nomes antes do cadastro.

---

## 2. O que o modulo e hoje vs. o que deveria ser

### Hoje

O modulo e um **cadastro estrutural operacional** com forte heranca de "factory". Ele ja controla mais do que agentes: controla entidades humanas, agentes e hibridas, com estrutura organizacional, acesso, status e elementos de inteligencia.

### Deveria ser

O modulo deveria amadurecer para ser o **registro mestre de identidades operacionais do SagB**.

Em outras palavras:

> Um nucleo de governanca para criar, validar, nomear, classificar, vincular e ativar humanos e agentes no ecossistema SagB.

---

## 3. Propostas de novo nome

### Opcao A — Nucleo de Identidades

- Nome interno: `nucleo_de_identidades`
- Nome no menu: **Nucleo de Identidades**
- Leitura curta: **Identidades**
- Forca: muito claro, institucional e escalavel.
- Risco: menos emocional/forte que Quadro de Elite.

### Opcao B — Registro Operacional

- Nome interno: `registro_operacional`
- Nome no menu: **Registro Operacional**
- Leitura curta: **Registro**
- Forca: comunica fonte oficial e controle.
- Risco: pode parecer generico ou administrativo demais.

### Opcao C — Cadastro Mestre

- Nome interno: `cadastro_mestre`
- Nome no menu: **Cadastro Mestre**
- Leitura curta: **Mestre**
- Forca: deixa claro que e a fonte de verdade.
- Risco: expressao comum, menos marca SagB.

### Opcao D — Central de Identidade Operacional

- Nome interno: `central_identidade_operacional`
- Nome no menu: **Central de Identidade**
- Leitura curta: **Identidade**
- Forca: explica bem o papel de governanca.
- Risco: nome exibido um pouco longo se usado completo.

### Opcao E — Matriz de Identidades

- Nome interno: `matriz_de_identidades`
- Nome no menu: **Matriz de Identidades**
- Leitura curta: **Matriz**
- Forca: tem marca, sugere estrutura, organizacao e relacoes.
- Risco: pode exigir explicacao inicial.

### Opcao F — Nucleo Humano-Agente

- Nome interno: `nucleo_humano_agente`
- Nome no menu: **Nucleo Humano-Agente**
- Leitura curta: **Humano-Agente**
- Forca: explicita o diferencial do SagB: humanos e agentes no mesmo cadastro.
- Risco: pode ficar menos elegante como marca de longo prazo.

---

## 4. Sugestao principal recomendada

### Recomendacao: Nucleo de Identidades

Recomendo seguir com **Nucleo de Identidades**.

Motivos:

1. **Clareza:** qualquer pessoa entende que ali ficam as identidades do sistema.
2. **Coerencia com o SagB:** o SagB esta amadurecendo como sistema operacional de negocios, agentes e humanos. "Identidades" e mais preciso que "Elite".
3. **Escala futura:** comporta humanos, agentes, hibridos, times, papeis, credenciais, nomes reservados e relacoes.
4. **Leitura organizacional:** deixa o modulo como fonte mestre, nao como vitrine.
5. **Interface curta:** no menu pode aparecer como **Identidades**, forte e direto.

Modelo recomendado:

- Nome interno do modulo: `nucleo_de_identidades`
- Nome exibido no menu: **Nucleo de Identidades**
- Nome curto na interface: **Identidades**
- Subtitulo: **Cadastro mestre de humanos, agentes e identidades operacionais do SagB**

---

## 5. Onde os nomes dos agentes estao hoje no banco

### Fonte principal

A fonte principal e a tabela Supabase/PostgREST:

- Tabela: `agents`
- Campo do nome exibido: `name`
- Campo de identidade canonica: `canonical_id` no banco, normalizado como `canonicalId` no app
- Campo de tipo: `entity_type` no banco, normalizado como `entityType`
- Campo de workspace: `workspace_id` no banco, normalizado como `workspaceId`

### Consulta atual no sistema

O modulo recebe `agents` pelo `runtimeBridge` e trabalha com essa lista em memoria. Na persistencia, usa:

- Criacao: `addDoc(collection(db, 'agents'), payload)`
- Edicao: `updateDoc(doc(db, 'agents', editingAgentId), payload)`
- Exclusao: `deleteDoc(doc(db, 'agents', agent.id))`

### Normalizacao no shim Supabase

O arquivo `services/supabase.ts` normaliza registros de `agents`, mapeando campos snake_case e camelCase para o contrato `Agent` usado no frontend.

Para consulta direta de nomes, a base minima e:

```ts
const snapshot = await getDocs(collection(db, 'agents'));
const existingNames = snapshot.docs.map((doc) => doc.data().name);
```

Em contexto de workspace, o ideal e consultar:

```ts
const snapshot = await getDocs(
  query(collection(db, 'agents'), where('workspaceId', '==', activeWorkspaceId))
);
```

Observacao: como o modulo ja recebe `agents` em memoria, a primeira implementacao pode validar contra a lista local e, antes de salvar, reforcar com consulta real ao banco.

---

## 6. Desenho inicial do sistema de criacao/validacao de nomes

### Objetivo do sistema de nomes

Impedir repeticao de nomes e reduzir risco de confusao por nomes muito parecidos entre agentes/humanos cadastrados.

### Regras iniciais

1. Normalizar todo nome antes da comparacao.
2. Bloquear duplicidade exata.
3. Alertar ou bloquear nomes muito parecidos, conforme severidade.
4. Nunca sugerir um nome ja usado.
5. Considerar escopo por workspace, e opcionalmente por venture.
6. Registrar resultado de validacao no cadastro ou na area de exploracao.

### Normalizacao recomendada

Transformar nomes para uma chave comparavel:

- remover acentos;
- converter para minusculas;
- remover pontuacao;
- normalizar espacos;
- remover titulos opcionais se desejado: `dr`, `dra`, `sr`, `sra`, `prof`;
- gerar `normalizedName`.

Exemplo:

- `Dra. Helen Dravet` -> `helen dravet`
- `Helen   Dravét` -> `helen dravet`

### Camadas de validacao

#### 1. Duplicidade exata normalizada

Bloqueia cadastro se `normalizedCandidate === normalizedExisting`.

Resultado: **bloqueado**.

#### 2. Similaridade forte

Detecta nomes quase iguais por uma combinacao de:

- distancia de Levenshtein;
- comparacao por tokens;
- sobrenome igual + primeiro nome muito parecido;
- fonetica simples para nomes comuns, em evolucao futura.

Resultado: **bloqueado ou exige aprovacao**, dependendo da politica.

#### 3. Similaridade media

Exemplo: mesmo primeiro nome e sobrenome parecido, ou mesmo sobrenome com nome curto.

Resultado: **alerta**, com lista de possiveis conflitos.

#### 4. Nome livre

Sem duplicidade e sem similaridade relevante.

Resultado: **aprovado**.

### Resultado padrao da validacao

```ts
type NameValidationStatus = 'available' | 'duplicate' | 'too_similar' | 'warning';

interface NameValidationResult {
  status: NameValidationStatus;
  normalizedName: string;
  conflicts: Array<{
    agentId: string;
    name: string;
    canonicalId?: string;
    score: number;
    reason: string;
  }>;
  suggestions: string[];
}
```

### Sugestao de nomes

Quando houver conflito, o sistema pode sugerir variacoes sem repetir:

- `Nome + sobrenome funcional`: Helen Dravet Governanca
- `Nome + area`: Helen Dravet Identidades
- `Nome + venture`: Helen Dravet SagB
- `Nome + numero apenas como ultimo recurso`: Helen Dravet 02

Regra: cada sugestao tambem passa pela validacao antes de ser exibida.

---

## 7. Funcionamento em dois contextos

### Contexto A — Durante cadastro de novo agente/humano

Fluxo recomendado:

1. Usuario digita o campo `name`.
2. Sistema executa validacao local contra `agents` em memoria com debounce.
3. Interface exibe status abaixo do campo:
   - nome disponivel;
   - nome ja usado;
   - nome muito parecido com X;
   - sugestoes alternativas.
4. Ao clicar em salvar, o sistema revalida contra o banco (`agents`) para evitar corrida entre usuarios.
5. Se duplicado: bloqueia `persistAgent`.
6. Se muito parecido: bloqueia ou exige permissao/justificativa, conforme politica.
7. Se aprovado: segue para validacao de `canonicalId` e persistencia.

Implementacao inicial de baixo risco:

- validar contra `agents` recebido pelo componente;
- bloquear duplicidade exata antes do `persistAgent`;
- exibir alerta para similaridade;
- manter consulta real ao banco como evolucao seguinte.

### Contexto B — Area propria para explorar/criar nomes

Proposta de tela: **Explorador de Nomes** dentro do futuro `Nucleo de Identidades`.

Funcoes:

- campo livre para testar nomes;
- seletor de tipo: humano, agente, hibrido;
- filtros por workspace, venture, area e papel;
- resultado de disponibilidade;
- conflitos encontrados;
- sugestoes aprovadas;
- opcao de reservar nome;
- opcao de iniciar cadastro a partir de um nome aprovado.

Fluxo:

1. Usuario informa ideia de nome.
2. Sistema consulta `agents`.
3. Sistema retorna status e sugestoes.
4. Usuario pode marcar uma sugestao como preferida.
5. Futuramente, o sistema grava uma reserva em tabela propria.
6. Ao criar cadastro, o formulario ja abre com o nome validado/pre-aprovado.

Tabela futura sugerida:

```sql
agent_name_reservations (
  id uuid primary key,
  workspace_id uuid not null,
  name text not null,
  normalized_name text not null,
  entity_type text,
  venture_id uuid,
  status text not null, -- reserved, used, expired, rejected
  reserved_by uuid,
  reserved_at timestamptz,
  expires_at timestamptz,
  agent_id uuid,
  payload jsonb
)
```

---

## 8. O que pode ser implementado ja vs. evolucao futura

### Pode ser implementado ja

- Criar helper `normalizeAgentName`.
- Criar helper `validateAgentNameAvailability`.
- Bloquear duplicidade exata no `persistAgent`.
- Adicionar feedback visual abaixo do campo `Nome` no formulario.
- Incluir `name` na documentacao como identidade operacional validada.
- Registrar decisao de renomeacao conceitual para `Nucleo de Identidades` sem renomear rotas ainda.

### Deve ficar como evolucao futura

- Consulta real ao banco no momento de validar nome, alem da lista em memoria.
- Similaridade avancada por Levenshtein/fonetica.
- Reserva de nomes com tabela propria.
- Tela completa **Explorador de Nomes**.
- Renomeacao fisica do modulo, rota e `TabId` de `quadro_de_elite` para `nucleo_de_identidades` com plano de compatibilidade.
- Relacionamentos por id para `humanOwner` e `aiMentor`.

---

## 9. Cuidados importantes

- Nao renomear rota e pasta diretamente sem plano de migracao, porque `TabId`, manifesto, rotas, imports e historico documental ainda dependem de `quadro_de_elite`.
- Se a tabela `agents` ainda nao tiver coluna fisica `canonical_id`, o shim pode preservar em `payload`, mas o ideal e confirmar schema e criar coluna/index.
- Para impedir repeticao de forma robusta, o banco deve ter coluna `normalized_name` com indice unico por `workspace_id` no futuro.
- Similaridade nao deve ser 100% bloqueante no primeiro momento, porque nomes humanos podem ser legitimamente parecidos.

---

## 10. Conclusao executiva

O modulo esta tecnicamente mais proximo de um **registro mestre de identidades operacionais** do que de um "Quadro de Elite". A recomendacao e evoluir o conceito para **Nucleo de Identidades**, mantendo compatibilidade tecnica no primeiro momento.

A base do sistema de nomes deve nascer simples: normalizacao, bloqueio de duplicidade exata e alerta de similaridade. Depois, pode amadurecer para explorador de nomes, reserva formal e validacao reforcada no banco.
