# Política Oficial de Nomenclatura de Agentes — GrupoB

Esta diretriz define o padrão canônico e estrutural para a criação de identidade (ID) de todos os agentes operacionais vinculados ao ecossistema GrupoB.  
O padrão é inspirado na governança do QG 3forB, adaptado à realidade do GrupoB, e garante legibilidade técnica, rastreabilidade e governança estrutural.

## 1. Padrão Canônico
A identidade estrutural (ID) de um agente do GrupoB deve seguir rigorosamente a sintaxe:

`<nome_agente>_grb_<setor3>_<nivel1>_<seq3>`

### Regras de Sintaxe
*   **Letras Minúsculas:** O ID inteiro deve ser escrito com letras minúsculas. Sem acentuação ou caracteres especiais.
*   **Separador Único:** Apenas o `_` (underscore) deve ser utilizado como separador entre os blocos de nomenclatura. Nunca utilizar `-` (hífen) ou espaços.
*   **Empresa Fixa:** O código da empresa é sempre `grb` (GrupoB).

> Regra transversal de nomenclatura de arquivos e pastas: consultar [`padrao_unificado_governanca.md`](docs/governanca_sagb/padrao_unificado_governanca.md:19).

---

## 2. Composição do ID

1.  **`<nome_agente>`**: Nome ou denominação chave principal. (ex: `pedro_nassar`, `julio_mosqueira`)
2.  **`grb`**: Código fixo do GrupoB.
3.  **`<setor3>`**: Código de 3 letras do departamento, unidade ou macroárea responsável.
    *   `ceo` = Chief Executive Officer (apenas para CEO do GrupoB)
    *   `mtd` = Metodologias (Diretor de Metodologias, guardião de metodologias)
    *   `qgx` = QG específico (ex: `qga` = AcadB, `qgi` = InstitutoB, `qgp` = PapoB, `qgs` = StartyB, `qgc` = AceleraB, `qg3` = 3forB)
    *   `mkt` = Marketing
    *   `vnd` = Vendas
    *   `ops` = Operações
    *   `eng` = Engenharia/Orquestração
    *   `crm` = CRM
    *   `edu` = Educação/Acadêmico
    *   `soc` = Social/Instituto
4.  **`<nivel1>`**: Nível da tomada de decisão e atuação. (Letra única)
    *   `e` = **Estratégico** (líderes, responsáveis por negócio, risco, margem).
    *   `t` = **Tático** (gestores de otimização, analistas de campanha e coordenadores).
    *   `o` = **Operacional** (executores e validadores do dia a dia).
5.  **`<seq3>`**: Número sequencial global único (Ex: `001`, `002`, `105`).

*Exemplos de ID Finalizados:*
*   `pedro_nassar_grb_ceo_e_001`
*   `julio_mosqueira_grb_qga_e_002`
*   `pierre_zanulli_grb_eng_e_003`

---

## 3. Governança e Regras Críticas do Cadastro Estrutural

### 3.1. Imutabilidade do ID
*   Uma vez que o ID estrutural é gerado e registrado no SagB, ele **não pode ser alterado**.
*   O Nome Visual/Humano (ex: "Pedro Nassar | CEO GrupoB") e metadados adicionais do agente podem mudar de acordo com o crescimento ou necessidades do negócio, porém, a chave primária (`agent_id`) manterá seu código gerado até a desativação ou obsolescência desse agente.

### 3.1.1. Código Curto Operacional

Além do ID canônico estrutural, cada colaborador deve possuir um **Código Curto Operacional** para uso em sistema, cadastro, CRM, dashboards, planilhas, filtros e interfaces visuais.

O código curto não substitui o ID canônico. Ele é uma identificação auxiliar, mais curta e legível.

Sintaxe oficial:

`<VENTURE>-<TIPO>-<SETOR>-<SEQ3>`

Onde:

*   **`<VENTURE>`**: código da venture/unidade operacional. Exemplos: `GRB`, `3FB`, `DAT`, `ZIP`, `ACB`, `INS`, `PAP`, `STB`, `ACL`.
*   **`<TIPO>`**: tipo de colaborador.
    *   `CA` = Colaborador Agente.
    *   `CH` = Colaborador Humano.
*   **`<SETOR>`**: setor em letras maiúsculas, derivado do `<setor3>` do ID canônico. Exemplos: `MKT`, `VND`, `OPS`, `QG3`, `MTD`, `ENG`, `CRM`.
*   **`<SEQ3>`**: mesmo sequencial de 3 dígitos do ID canônico.

Exemplos:

| ID Canônico | Código Curto Operacional | Tipo |
|---|---|---|
| `anton_borselli_grb_mkt_e_032` | `3FB-CA-MKT-032` | Colaborador Agente |
| `max_guerra_grb_vnd_e_054` | `3FB-CA-VND-054` | Colaborador Agente |
| `zara_bittencourt_grb_qg3_e_018` | `3FB-CA-QG3-018` | Colaborador Agente |
| `douglas_rodrigues_grb_mkt_e_090` | `3FB-CH-MKT-090` | Colaborador Humano |

**Regra importante:** `CA` e `CH` não entram no ID canônico estrutural para evitar quebra de padrão, renomeação de pastas e perda de rastreabilidade. Eles devem ser armazenados como campo de cadastro e refletidos no Código Curto Operacional.

Documento canônico específico: [`codigo_curto_colaboradores_grupob.md`](codigo_curto_colaboradores_grupob.md).

### 3.2. Governança do Sequencial Global
*   O sequencial `<seq3>` (de `001` a `999`) é emitido globalmente por GrupoB, e **NÃO** por setor. 
*   Se o último agente emitido do GrupoB foi o `015` de um QG, o próximo agente de outro QG receberá obrigatoriamente o código `016`.
*   O SagB (centro de comando) armazena e incrementa esta sequência em controle unificado, para impedir duplicidade de código.

### 3.3. Categorizações Adicionais (Fora do ID)
*   Dados variáveis que caracterizam contextos mutáveis ou metadados de apoio, como "Domínio de Ação" (ex: "Mídias Pagas", "Automação"), "Status de Prontidão" (ex: `estrutural`, `em_consolidacao`, `operacional`), não devem ser incluídos no ID. Esses dados devem permanecer como campos de cadastro na plataforma.

### 3.4. Registro no SagB
*   Todos os IDs canônicos devem ser registrados no documento `docs/governanca_grupob/organograma_grupob.md`.
*   Cada agente deve ter sua pasta correspondente em `_qgs/[qg]/_agentes/[nome_agente]_[cargo]/` ou `_metodologias_e_programas/.../_agentes/`.

---

## 4. Tabela de Setores Predefinidos

| Código | Descrição | Exemplo de Uso |
|--------|-----------|----------------|
| `ceo` | CEO do GrupoB | Pedro Nassar |
| `mtd` | Metodologias | Pietro Carboni (Diretor de Metodologias) |
| `qga` | QG AcadB | Júlio Mosqueira |
| `qgi` | QG InstitutoB | Karen Montiel |
| `qgp` | QG PapoB | Carina Mazo |
| `qgs` | QG StartyB | César Tulli |
| `qgc` | QG AceleraB | Jorge Perse |
| `qg3` | QG 3forB | Zara Bittencourt |
| `mkt` | Marketing | (Futuros agentes de marketing) |
| `vnd` | Vendas | (Futuros agentes de vendas) |
| `eng` | Engenharia/Orquestração | Pierre Zanulli |
| `crm` | CRM | Denic Celmi |
| `edu` | Educação | (Subordinados da AcadB) |
| `soc` | Social | (Subordinados do InstitutoB) |

---

## 5. Processo de Criação de um Novo Agente

1.  **Definir o setor (`<setor3>`)** conforme tabela acima.
2.  **Definir o nível (`<nivel1>`)** conforme responsabilidade (e, t, o).
3.  **Consultar o sequencial global** no `organograma_grupob.md` para obter o próximo `<seq3>` disponível.
4.  **Gerar o ID canônico** seguindo a sintaxe.
5.  **Criar a pasta do agente** com o slug humano (ex: `jorge-perse`).
6.  **Registrar no organograma** com ID, nome visual, cargo e hierarquia.
7.  **Criar documentos base canônicos** (`persona.md`, `session_log.md`, `falas_user.md`, `prompt_ativacao_cline.md`).

---

> *Decisão aprovada por Douglas Rodrigues e validada pelo Orquestrador SagB (Pierre Zanulli).*  
> *Data de implementação: 20/04/2026*
