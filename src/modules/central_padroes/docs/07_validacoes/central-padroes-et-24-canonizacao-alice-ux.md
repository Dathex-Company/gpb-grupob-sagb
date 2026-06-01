# ET-24 — Canonização Alice/UX

**Data:** 2026-06-01  
**Divisão:** Alice / UX UI  
**Objetivo:** transformar Alice/UX na primeira divisão-piloto com matriz de canonicidade dirigida.

---

## 1. Critérios usados

Um item Alice/UX foi classificado considerando:

1. unicidade da chave;
2. coerência com `CP-GOV-001`;
3. relação com `CP-GOV-003` — classificação normativa oficial;
4. relação com `CP-TEC-013` — documentação pública, interna, restrita e sensível;
5. clareza do tipo normativo;
6. dependências explícitas;
7. vínculo com `ui_shell_core`;
8. capacidade de virar modelo replicável para outras divisões;
9. necessidade ou não de validação final Pietro;
10. necessidade ou não de decisão Rodrigues.

---

## 2. Status final dos itens CP-UX

| Código | Item | Tipo | Status operacional | Canonicidade ET-24 | Decisão |
|---|---|---|---|---|---|
| `CP-UX-001` | Design System SagB | Padrão | aprovado | **Canônico operacional** | Mantido como base visual SagB. |
| `CP-UX-002` | Loze UI Standard e Design System | Padrão | curadoria | **Homologado em curadoria** | Complementa `CP-UX-001`, não substitui. |
| `CP-UX-003` | Gate visual de tela | Protocolo | aprovado | **Canônico operacional** | Virou protocolo obrigatório para telas novas/relevantes. |
| `CP-UX-004` | Matriz tipo de tela x padrão visual | Matriz | curadoria | **Homologado em curadoria** | Precisa detalhar tipos de tela. |
| `CP-UX-005` | Checklist de release visual | Checklist | aprovado | **Canônico operacional** | Checklist oficial de release visual. |
| `CP-UX-006` | Evidência visual por release | Evidência | curadoria | **Homologado como evidência** | Permanece evidência, não registro. |
| `CP-UX-007` | Variação visual real não é troca de cor | Princípio | aprovado | **Canônico operacional** | Princípio visual canônico. |

---

## 3. Resolução de conflitos conceituais

### `CP-UX-001` x `CP-UX-002`

Decisão:

- `CP-UX-001` é o padrão visual operacional do SagB.
- `CP-UX-002` é a ponte Loze UI Standard + Design System, ainda em curadoria.

Logo, `CP-UX-002` não substitui `CP-UX-001`; ele amplia a visão para Loze/GrupoB e deve ser validado contra o documento UI Standard aberto em governança.

### `CP-UX-003`

Decisão: protocolo obrigatório para novas telas, telas críticas e mudanças visuais relevantes.

### `CP-UX-005`

Decisão: checklist oficial de release visual.

### `CP-UX-006`

Decisão: permanece como evidência. Não deve voltar a ser `registro`.

### `CP-UX-007`

Decisão: princípio visual canônico. Impede a falsa variação baseada apenas em troca superficial de cor.

---

## 4. Pendências Pietro

Pietro precisa validar:

1. se `CP-UX-002` pode virar canônico Loze/GrupoB;
2. se `CP-UX-004` já está suficientemente detalhada para canonicidade;
3. se `CP-UX-006` será evidência obrigatória em todo release ou apenas em release visual relevante;
4. se a matriz de canonicidade Alice/UX pode virar modelo oficial para as próximas divisões.

---

## 5. Pendências Rodrigues

Rodrigues precisa decidir:

1. se todo módulo novo deve obrigatoriamente passar pelo Gate Visual (`CP-UX-003`);
2. se `ui_shell_core` será módulo base obrigatório para novos módulos plugáveis;
3. se releases visuais precisam de evidência visual formal (`CP-UX-006`) em todos os casos;
4. se a assinatura visual Alice/UX vale apenas para SagB ou para Loze/GrupoB inteiro.

---

## 6. Modelo replicável de canonização por divisão

### Etapas

1. Inventariar itens por prefixo.
2. Verificar duplicidade de chave.
3. Classificar por tipo normativo.
4. Separar canônico, homologado, revisão e experimental.
5. Validar dependências.
6. Conectar com módulos base.
7. Conectar com checklist/protocolo/evidência.
8. Registrar pendências Pietro.
9. Registrar decisões Rodrigues.
10. Atualizar status operacional sem apagar histórico.

### Matriz mínima

| Campo | Obrigatório |
|---|---|
| Código | Sim |
| Título | Sim |
| Tipo normativo | Sim |
| Status operacional | Sim |
| Canonicidade | Sim |
| Dependências | Sim |
| Módulo base relacionado | Quando houver |
| Checklist relacionado | Quando houver |
| Evidência relacionada | Quando houver |
| Validação Pietro | Sim |
| Decisão Rodrigues | Quando afetar operação |

---

## 7. Próxima recomendação

Depois da ET-24, recomenda-se **ET-25 — Aplicação do Gate Visual Alice/UX no módulo Central de Padrões e nos próximos módulos plugáveis**.

Chat Pietro e embedding devem vir depois de pelo menos duas divisões canonizadas ou uma divisão canonizada + Biblioteca de Módulos Base aplicada.

