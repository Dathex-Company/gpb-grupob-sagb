# Documento Canônico — Código Curto de Colaboradores GrupoB

**Status:** aprovado  
**Data de aprovação:** 2026-06-04  
**Escopo:** GrupoB, Ventures, QGs, agentes e colaboradores humanos  
**Documento relacionado:** [`nomenclatura_agentes_grupob.md`](nomenclatura_agentes_grupob.md)  
**Documento relacionado:** [`organograma_grupob.md`](organograma_grupob.md)

---

## 1. Objetivo

Este documento define o padrão canônico do **Código Curto Operacional** para colaboradores do ecossistema GrupoB.

O código curto existe para facilitar:

- cadastro no sistema;
- busca rápida;
- filtros;
- CRM;
- dashboards;
- planilhas;
- telas operacionais;
- diferenciação entre colaborador agente e colaborador humano;
- separação visual por venture, QG ou unidade operacional.

---

## 2. Relação com o ID canônico

O GrupoB possui dois identificadores complementares:

| Identificador | Exemplo | Função |
|---|---|---|
| ID canônico estrutural | `anton_borselli_grb_mkt_e_032` | Governança, pasta, rastreabilidade e chave técnica |
| Código curto operacional | `3FB-CA-MKT-032` | Cadastro, sistema, tela, busca e operação |

O **Código Curto Operacional não substitui o ID canônico**.

O ID canônico permanece como chave estrutural principal, conforme definido em [`nomenclatura_agentes_grupob.md`](nomenclatura_agentes_grupob.md).

---

## 3. Sintaxe oficial

O Código Curto Operacional deve seguir a sintaxe:

```text
<VENTURE>-<TIPO>-<SETOR>-<SEQ3>
```

Exemplo:

```text
3FB-CA-MKT-032
```

---

## 4. Composição do código

### 4.1. Venture / Unidade

O primeiro bloco identifica a venture, QG ou unidade operacional.

| Código | Unidade |
|---|---|
| `GRB` | GrupoB / Holding |
| `3FB` | 3forB |
| `DAT` | Dathex |
| `ZIP` | Ziplia |
| `ACB` | AcadB |
| `INS` | InstitutoB |
| `PAP` | PapoB |
| `STB` | StartyB |
| `ACL` | AceleraB |

### 4.2. Tipo de colaborador

O segundo bloco identifica se o colaborador é agente ou humano.

| Código | Tipo |
|---|---|
| `CA` | Colaborador Agente |
| `CH` | Colaborador Humano |

### 4.3. Setor

O terceiro bloco identifica o setor, em letras maiúsculas.

| Código | Setor |
|---|---|
| `CEO` | CEO / Presidência |
| `QG3` | QG 3forB |
| `QGA` | QG AcadB |
| `QGI` | QG InstitutoB |
| `QGP` | QG PapoB |
| `QGS` | QG StartyB |
| `QGC` | QG AceleraB |
| `MTD` | Metodologias |
| `MKT` | Marketing |
| `VND` | Vendas |
| `OPS` | Operações |
| `ENG` | Engenharia / Orquestração |
| `CRM` | CRM |
| `EDU` | Educação |
| `SOC` | Social / Instituto |

### 4.4. Sequencial

O quarto bloco é o mesmo sequencial de 3 dígitos usado no ID canônico.

Exemplos:

```text
001
018
032
054
```

---

## 5. Exemplos oficiais

| Nome | ID canônico | Código curto |
|---|---|---|
| Anton Borselli | `anton_borselli_grb_mkt_e_032` | `3FB-CA-MKT-032` |
| Max Guerra | `max_guerra_grb_vnd_e_054` | `3FB-CA-VND-054` |
| Zara Bittencourt | `zara_bittencourt_grb_qg3_e_018` | `3FB-CA-QG3-018` |
| Paula Zurick | `paula_zurick_grb_qg3_e_008` | `3FB-CA-QG3-008` |
| Cássio Mendes | `cassio_mendes_grb_eng_e_001` | `DAT-CA-ENG-001` |
| Douglas Rodrigues | `douglas_rodrigues_grb_mkt_e_090` | `3FB-CH-MKT-090` |

---

## 6. Regra de não inclusão de CA/CH no ID canônico

Os marcadores `CA` e `CH` **não devem ser inseridos no ID canônico estrutural**.

Forma correta:

```text
ID canônico: anton_borselli_grb_mkt_e_032
Código curto: 3FB-CA-MKT-032
```

Forma não recomendada:

```text
anton_borselli_grb_ca_mkt_e_032
```

Motivos:

- evita quebra do padrão já aprovado;
- evita renomeação de pastas existentes;
- preserva rastreabilidade;
- mantém o ID canônico limpo;
- deixa `CA` e `CH` como campo operacional de cadastro.

---

## 7. Campos mínimos recomendados no cadastro do sistema

Todo colaborador cadastrado no sistema deve possuir, no mínimo:

| Campo | Exemplo |
|---|---|
| ID canônico | `anton_borselli_grb_mkt_e_032` |
| Código curto | `3FB-CA-MKT-032` |
| Venture | `3FB` |
| Tipo | `CA` |
| Setor | `MKT` |
| Nível | `E` |
| Sequencial | `032` |
| Nome visual | `Anton Borselli` |
| Cargo | `Diretor de Marketing` |
| Status | `ativo`, `em_consolidacao`, `pendente`, `inativo` |

---

## 8. Regras de uso

1. O código curto deve ser exibido em telas, cards, planilhas e sistemas sempre que o ID canônico for grande demais.
2. O código curto deve ser único dentro do ecossistema operacional.
3. O sequencial do código curto deve ser sempre o mesmo do ID canônico.
4. `CA` identifica agentes, automações, personas operacionais e colaboradores digitais.
5. `CH` identifica pessoas humanas vinculadas à operação.
6. A troca de `CA` para `CH`, ou de `CH` para `CA`, não altera o ID canônico; altera apenas o campo de tipo e o código curto operacional.

---

## 9. Decisão aprovada

Fica aprovado o seguinte padrão:

```text
ID canônico = nome_agente_grb_setor_nivel_seq
Código curto = VENTURE-TIPO-SETOR-SEQ
```

Exemplo:

```text
anton_borselli_grb_mkt_e_032
3FB-CA-MKT-032
```

Para colaborador humano:

```text
douglas_rodrigues_grb_mkt_e_090
3FB-CH-MKT-090
```

---

## 10. Governança

Este documento passa a ser a referência canônica para o Código Curto Operacional de colaboradores do GrupoB.

Qualquer novo agente, colaborador humano, venture ou unidade operacional deve seguir este padrão ao ser registrado no SagB.

