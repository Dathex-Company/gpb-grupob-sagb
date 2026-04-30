# padrao_unificado_governanca

## objetivo

Este é o documento canônico único de padronização de governança do SagB.
Todos os documentos de padrão devem referenciar este arquivo.

## escopo

Este padrão se aplica a:

- criação de pastas e arquivos
- nomenclatura de agentes e módulos
- formatação de data e hora
- estrutura de log contínuo literal (session log)
- trilha separada de falas do usuário (falas user)
- obrigatoriedade de auto-log duplo para agentes

## hierarquia normativa oficial

Este documento é a fonte única de regras transversais de governança.

Classificação oficial dos demais documentos:

1. **norma canônica transversal**
   - `docs/governanca_sagb/padrao_unificado_governanca.md`
2. **especialização temática** (não pode contrariar nem duplicar regra canônica)
   - ex.: `docs/governanca_sagb/padrao_postura_e_conduta_agentes.md`
   - ex.: `docs/governanca_grupob/nomenclatura_agentes_grupob.md`
3. **template operacional**
   - ex.: `docs/governanca_sagb/template_session_log_agente.md`
   - ex.: `docs/governanca_grupob/template_ata_reuniao.md`
4. **documento-ponte legado**
   - deve conter somente referência canônica, sem regra própria concorrente

Regra de ouro: quando um documento especializado tratar tema já coberto aqui, ele deve referenciar a regra canônica em vez de reescrever a mesma norma.

## regra 1 — nomenclatura de pastas e arquivos

- usar somente letras minúsculas
- usar `_` (underscore) como separador
- não usar `-` (hífen)
- não usar espaço
- não usar acentos nem caracteres especiais

### exemplos válidos

- `falas_user.md`
- `session_log.md`
- `padrao_unificado_governanca.md`
- `prompt_ativacao.md`

### exemplos inválidos

- `Falas-User.md`
- `session-log.md`
- `Padrão Governança.md`
- `prompt-ativacao.md`

### regra 1.1 — arquivos canônicos obrigatórios por agente

Cada pasta de agente deve manter, como base mínima oficial, apenas estes arquivos canônicos:

- `persona.md`
- `session_log.md`
- `falas_user.md`
- `prompt_ativacao_cline.md`

Se houver necessidade de documentos complementares, eles devem seguir a Regra 1 e não podem duplicar função dos arquivos canônicos.

### regra 1.2 — deduplicação obrigatória de nomes

É obrigatório eliminar arquivos duplicados que representem a mesma função com variações de nomenclatura.

Critérios obrigatórios:

1. havendo versão com hífen e com underscore, manter somente a versão com underscore
2. remover variações com maiúsculas, espaço, acento ou caractere especial
3. preservar apenas um arquivo canônico por função

Exemplos de deduplicação:

- manter `session_log.md` e remover `session-log.md`
- manter `prompt_ativacao_cline.md` e remover `prompt-ativacao-cline.md`

## regra 2 — padrão de data e hora

- data: `dd/mm/aaaa`
- data e hora: `dd/mm/aaaa hh:mm`
- timezone operacional padrão: `america/sao_paulo`

### exemplo

- `28/04/2026 11:49`

## regra 3 — padrão de log contínuo (session_log.md)

O arquivo `session_log.md` é o espelho exato e portável do chat.

- Não deve conter "resumos" das interações.
- Deve conter a **transcrição literal e completa** do diálogo.

Cada registro deve conter obrigatoriamente:

1. timestamp no formato `dd/mm/aaaa hh:mm` antecedido de `## `
2. autor em negrito (`**usuario:**` ou `**id_do_agente:**`)
3. conteúdo literal da mensagem

### modelo

```md
## 28/04/2026 11:49
**usuario:** mensagem exata do usuário

## 28/04/2026 11:49
**pierre_zanulli:** transcrição exata da resposta do agente
```

## regra 4 — arquivo oficial de falas do usuário (falas_user.md)

Todo agente deve possuir em sua pasta o arquivo `falas_user.md`. Este arquivo garante que a voz, intenção e diretrizes do humano não sejam perdidas ou formatadas pela IA.

Estrutura mínima:

```md
# falas_user

## 28/04/2026 11:49
**usuario:** conteúdo literal e exato da fala do usuário isolada
```

## regra 5 — obrigatoriedade de auto-log duplo (diretriz para agentes)

É **estritamente proibido** a qualquer agente autônomo fornecer uma resposta final no chat sem antes ter registrado a interação.

Em cada turno, o agente DEVE usar as ferramentas de manipulação de arquivo para:
1. Inserir a fala do usuário e a resposta do agente no `session_log.md` (Regra 3).
2. Inserir APENAS a fala do usuário no `falas_user.md` (Regra 4).

**Confirmação Visual:** Para evitar que o agente omita o processo por degradação de contexto, é obrigatório que o agente finalize sua mensagem no chat (para o usuário) com a seguinte tag de confirmação visual:
`[ 📝 Auto-log: OK ]`

Esta regra completa deve estar presente nos prompts de ativação de todos os agentes.

## regra 6 — precedência canônica

Em caso de conflito entre documentos, este arquivo prevalece.

## regra 7 — checklist de validação da pasta de agente

Antes de considerar uma pasta de agente como padronizada, validar:

1. existência dos 4 arquivos canônicos da Regra 1.1
2. ausência de duplicidade por hífen/underscore para mesma função
3. ausência de nomes fora do padrão da Regra 1
4. coerência entre `persona.md` e os artefatos operacionais (`session_log.md`, `falas_user.md`, `prompt_ativacao_cline.md`)

## documentos legados

Documentos legados de padrão devem conter apenas referência para:

- `docs/governanca_sagb/padrao_unificado_governanca.md`
