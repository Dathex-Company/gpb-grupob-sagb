# LOZE-OPP | Organização de Pastas, Produtos e Contas (versão inicial)

**Status:** em validação

## 1. Estrutura geral Loze (proposta)

```text
Loze/
├── 01_Produtos/
├── 02_Clientes/
├── 03_Operacao/
├── 04_Governanca/
└── 99_Legado/
```

## 2. Estrutura de produtos

```text
Loze/01_Produtos/
├── 01_Ativos/
├── 02_Labs/
├── 03_Pausados/
└── 04_Arquivados/
```

## 3. Estrutura de contas internas

```text
Loze/02_Clientes/Nome_da_Conta/
```

## 4. Estrutura de empresa atendida

```text
empresas_b/nome_da_empresa/
```

## 5) Produto ativo

- foco em entrega recorrente;
- repositório real obrigatório;
- documentação técnica atualizada.

## 6) Produto em Labs

- hipóteses e protótipos;
- pode usar mock/sandbox;
- não promover sem validação.

## 7) Pausados

- congelados com contexto e motivo documentado.

## 8) Arquivados

- encerrados, somente consulta histórica.

## 9) Regra de Git

- repositório técnico na camada Loze;
- histórico de decisão via ADR;
- sem repositório “solto” fora da governança.

## 10) Relação com `09_Repositorios`

Cada produto ativo deve apontar para seu repositório oficial em:

`Loze/01_Produtos/01_Ativos/Nome_do_Produto/09_Repositorios/nome_do_repo/`

## 11) Exemplos

- QG_3forB (em validação)
- CRM_Loze (em validação)
- SagB by Loze (definido)
- Larissa Assist (em validação)

