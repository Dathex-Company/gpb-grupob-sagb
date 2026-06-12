# Revisão 04 | Padrões Técnicos Loze / GrupoB

## 1. O que já é oficial

- Loze como camada oficial de tecnologia aplicada.
- Dathex como legado técnico.
- Separação Produto / Conta Interna / Operação.
- Código fica na Loze.
- Git em repositórios reais.
- GitHub como fonte técnica oficial.
- Erro relevante deve ser registrado.
- Quarentena Técnica antes de apagar.
- Decisão estrutural vira ADR.
- Não chamar tudo de protocolo.

## 2. O que está em validação

- Estrutura raiz da Loze.
- Estrutura de produto ativo.
- Estrutura de produto em Labs.
- Estrutura de módulos plugáveis.
- Loze Docs como central de padrões.
- Owner no manifest.
- Registry modular.
- module-doc LOZE-DAS.
- SemVer por módulo.
- Stack obrigatória ou preferencial.
- Sandbox por módulo.
- Monorepo futuro.

## 3. O que é sugestão técnica

- LOZE-MCP separado de LOZE-AI.
- Sandbox por módulo.
- Monorepo futuro.
- Catálogo central de services/APIs/tabelas.
- Portal público estilo Odoo.
- Auto-log duplo para todos os agentes.
- Versionamento independente por módulo.

## 4. O que é dúvida

- Nome final: Loze Docs ou Central de Padrões.
- Stack obrigatória ou preferencial.
- Padrão de branch.
- Padrão de commit.
- Política de testes mínimos.
- Ferramenta oficial de observabilidade.
- Quem aprova remoção da Quarentena Técnica.
- Quando módulo vira app separado.
- Como separar documentação pública e interna.

## Tabela de classificação

| Item | Tipo | Status | Precisa validação? | Pergunta para Rodrigues |
|---|---|---|---|---|
| Loze camada oficial | princípio | definido | não | confirmar publicação formal em ADR? |
| Dathex legado técnico | princípio | definido | não | há regra formal de arquivamento? |
| Produto/Conta/Operação | política | definido | sim (detalhe) | qual nível de detalhamento operacional? |
| Código na Loze | regra | definido | não | exceções previstas? |
| GitHub fonte oficial | padrão | definido | não | manter espelho secundário? |
| Quarentena antes de apagar | regra | definido | não | quem autoriza saída da quarentena? |
| module-doc LOZE-DAS | padrão | em validação | sim | aplicar em quais módulos piloto? |
| SemVer por módulo | sugestão | sugestão | sim | adotar agora ou ET-04? |
| Stack obrigatória/preferencial | dúvida | dúvida | sim | haverá lista obrigatória? |
| Monorepo futuro | sugestão | sugestão | sim | manter roadmap ou adiar? |

