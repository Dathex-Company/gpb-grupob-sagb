# 05. Cadastro e DNA de Agentes

## Escopo

Modulo responsavel por criar e dar personalidade aos agentes do sistema. Abrange desde o cadastro estrutural de pessoas/agentes (Quadro de Elite) ate a edicao profunda de comportamento e vinculos operacionais.

## Arquivos Principais

- `components/AgentFactory.tsx` -> Interface do Quadro de Elite (cadastro estrutural e importacao).
- `services/agentDna.ts` -> Logica de montagem e composicao de DNA (base + contexto + regras).
- Tabelas:
  - `agents` -> Registro mestre (estrutural) do agente.
  - `agent_dna_profiles` -> Configuracao de prompt individual (personalidade base).
  - `agent_dna_effective` -> Versao final e compilada do prompt (incluindo Governanca), usada em runtime.

## Principais Mecanicas

### 1. Quadro de Elite (Cadastro Estrutural)

A tela `AgentFactory` foi projetada para ser o registro unificado do ciclo de vida de colaboradores (humanos, agentes, hibridos). Ela possui as seguintes logicas operacionais:

- **Listagem Otimizada**: Visao em tabela com a capacidade de intercalar colunas essenciais e avancadas para reduzir sobrecarga cognitiva no uso diario.
- **Validacoes Criticas**: E impossivel salvar um agente sem Nome, Venture, Funcao Principal e, pelo menos, uma Stack LLM associada. Se houver um "Modelo Preferencial", ele **deve** pertencer a lista de Stacks Permitidas do agente.
- **Clareza Semantica**: A persistencia foi ajustada para evitar cruzamento falso entre *funcao* e *cargo-base universal*. A UI deixa explicito os impactos no roteamento do agente atraves da mudanca do "Status Estrutural".
- **Importacao em Lote**: Suporte robusto para criar varios agentes via arquivo CSV/JSON.

### 2. Edicao de DNA (Via Governanca)

O conteudo do DNA do agente **nao e exposto diretamente** no Quadro de Elite.

- A UI indica o status do DNA (ex: "Sem DNA", "Revisar") no grid principal do cadastro.
- Existe um redirecionamento direto (deep link) para a tela de Governanca (`GovernanceView.tsx`) sempre que o gestor decide editar a "Inteligencia" do agente.

### 3. As 3 Camadas de Identidade

1. **Constituicao (Global)**: Cultura e restricoes master do GrupoB. Vem da colecao `governance_global_culture`.
2. **Contexto (Venture/Macro)**: O que o agente precisa saber sobre onde atua.
3. **Identidade (Micro)**: O "Quem sou eu" do agente (Tone of voice, regras especificas da funcao). Fica na tabela `agent_dna_profiles`.

Ao carregar o agente na memoria (runtime), o arquivo `services/agentDna.ts` funde essas 3 camadas em um unico **Effective Prompt**. O resultado combinado e guardado temporariamente na `agent_dna_effective` para auditoria e logica rapida de inferencia nas conversas.

## Fluxo de Estado de IA

`Agent (Quadro de Elite) -> AgentConfig (DNA) -> EffectiveDNA -> Inferencia (Gemini/Proxy)`
