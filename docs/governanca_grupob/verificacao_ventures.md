# Verificação de Ventures - GrupoB

Este documento consolida o mapeamento de responsáveis (CEOs, Diretores) por cada Venture e suas respectivas submarcas/módulos, com base na análise de triagens e estruturas de pastas (`_ventures`).

**Data de atualização:** 20/04/2026
**Status Geral:** Em andamento (Etapa 1: Ventures principais)

---

## Ventures Principais e Responsáveis

| Venture Principal | Responsável Mapeado | Status | Observações / Módulos Internos |
| :--- | :--- | :---: | :--- |
| **Ziplia** | **Ronan York** (CEO) | ✅ | Venture principal com agente formal em `_agentes/ronan_york_ceo`. |
| **Domusys** | **Anton Valois** (CEO Domusè) | ✅ | Encontrado em `_ventures/domusys/_agentes/anton_valois_ceo/owner.md`. |
| **Seddore** | **Cléo Mansure** (CEO Seddore) | ✅ | Encontrado em `_ventures/seddore/_agentes/cleo_mansure_ceo/owner.md`. |
| **TaskZei** | **Dani Freitas** (Responsável, não CEO) | ✅ | Definição informada pelo Douglas para governança da venture. |
| **HumanG** | **Juliana Vigato** (CEO) | ✅ | Venture principal com agente formal em `_agentes/juliana_vigato_ceo`. |
| **Audacus** | **Rubeni Caruso** | ✅ | Definição informada pelo Douglas para governança da venture. |

---

## Cobertura da Etapa 1 - Ventures principais

### Com CEO nominal encontrado em estrutura formal `_agentes`
- **Ziplia** → Ronan York
- **HumanG** → Juliana Vigato
- **Domusys** → Anton Valois
- **Seddore** → Cléo Mansure

### Com estrutura, sem nome nominal confirmado
- Nenhuma no bloco principal (todas as ventures principais já possuem nome informado)

### Sem CEO formal encontrado até agora
- **TaskZei** → definido com responsável operacional (Dani Freitas), sem indicação de cargo CEO

---

## Ziplia - Submarcas e Módulos

| Submarca / Módulo | Responsável Mapeado | Status | Observações |
| :--- | :--- | :---: | :--- |
| Ziplia CRM | **Dan Salure** (Diretor de Automação CRM Ziplia) | ✅ | Evidência direta em `_ventures/ziplia/_agentes/dan_salure_crm/` e em `modules/crm/web/plano-automacoes.md`. |
| Ziplia Odonto | *Verificando triagem...* | ⏳ |
| Ziplia Vox | *Verificando triagem...* | ⏳ |
| Ziplia DAI | *Verificando triagem...* | ⏳ |
| Ziplia Start | *Verificando triagem...* | ⏳ |
| Fórmula de Vendas | *Verificando triagem...* | ⏳ |
| Simulador de Metas | *Verificando triagem...* | ⏳ |

---

## Próximos Passos de Verificação
1.  **Ziplia**: Ler arquivos em `_ventures/ziplia/_triagem` para encontrar responsáveis por Odonto, Vox, DAI, etc. (Não foi encontrado "Denic Celmi" dentro de `_ventures/ziplia`).
2.  **TaskZei**: Analisar diretório raiz da venture e triagens para identificar responsável principal.
3.  **Audacus**: Confirmar nome da pessoa responsável pelo papel de CEO.
4.  **Demais Ventures principais**: continuar varredura por `owner.md`, `perfil-executivo.md`, `persona.md` e triagens.

---

## Achados rápidos desta etapa

- Em `_ventures/ziplia`, o nome **Dan Salure** aparece de forma consistente no agente de CRM (`owner.md`, `perfil-executivo.md`, `persona.md`, `prompt_ativacao_cline.md`).
- Em `_ventures/ziplia`, não houve ocorrência textual de **Denic Celmi**.
- Em `_ventures/taskzei`, ainda não há agente CEO formalizado em `_agentes` (apenas `_agentes/_triagem`).
