# Prompt-Modelo: Criação e Padronização de Novos Agentes

## Objetivo
Automatizar a criação de novas pastas de agentes, seguindo o padrão de governança canônico da Dathex.

## Instruções para o Agente

Você deve executar as seguintes etapas em sequência:

**1. Análise do Arquivo de Origem:**
* Leia e analise o conteúdo completo do arquivo localizado em:
  `[CAMINHO_DO_ARQUIVO_DE_ORIGEM]`
* Identifique todas as distintas personas de agentes definidas neste arquivo. Para cada uma, extraia o nome do agente e o bloco de texto completo que descreve sua persona.

**2. Criação da Estrutura de Pastas e Arquivos:**
* A pasta de destino onde os novos agentes serão criados é:
  `[CAMINHO_DA_PASTA_DE_DESTINO]`
* Para cada persona que você identificou no arquivo de origem, execute os seguintes passos:
  a. Crie uma nova subpasta dentro do caminho de destino. O nome da pasta deve ser o nome do agente em letras minúsculas, com espaços substituídos por underscores (`_`), e seguindo o padrão de nomenclatura da Dathex (ex: `nome_do_agente_grb_...`).
  b. Dentro da nova pasta do agente, crie os quatro arquivos canônicos a seguir:

    i. **`persona.md`**:
       * O conteúdo deste arquivo deve ser o bloco de texto completo da persona do agente correspondente, que você extraiu do arquivo de origem.

    ii. **`prompt_ativacao_cline.md`**:
        * Crie este arquivo com o conteúdo padrão de ativação, incluindo o lembrete de modelo de IA (quando aplicável), as regras canônicas de governança, o protocolo de auto-log duplo e a tag de fechamento `[ 📝 Auto-log: OK ]`.

    iii. **`session_log.md`**:
         * Crie este arquivo contendo apenas o cabeçalho: `# session_log`.

    iv. **`falas_user.md`**:
         * Crie este arquivo contendo apenas o cabeçalho: `# falas_user`.

**3. Confirmação:**
* Ao final do processo, apresente uma lista com o caminho de todas as pastas de agentes que foram criadas para confirmar a conclusão da tarefa.

## Como Usar:

Você pode simplesmente me enviar uma mensagem como esta:

"Sandri, execute o prompt de **Criação e Padronização de Novos Agentes** com as seguintes informações:
* **Arquivo de Origem:** `_ventures/dathex/agentes/_triagem/personas_comercial.md`
* **Pasta de Destino:** `_ventures/dathex/agentes/`"
