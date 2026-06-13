# Documento Base Padrão para Criação de Documentos Mestres — v1.0 — 07-06-2026

## Cabeçalho interno

| Campo | Informação |
|---|---|
| Código do documento | GOV-PAD-002 |
| Documento | Documento Base Padrão para Criação de Documentos Mestres |
| Tipo normativo | Padrão |
| Domínio normativo | Governança da Central de Padrões |
| Versão | v1.0 |
| Data da versão | 07-06-2026 |
| Status | em_curadoria |
| Formato | Markdown .md |
| Pasta de destino | MD-central-de-padroes/ |
| Validação final | Pietro Carboni |
| Uso principal | Orientar a criação dos Documentos Mestres v3.0 dos domínios normativos |
| Fonte operacional futura | Supabase |
| Acervo auditável | Pasta MD-central-de-padroes |

---

## 1. Objetivo deste documento

Este documento define o padrão obrigatório para criação dos **Documentos Mestres dos Domínios Normativos** da Central de Padrões.

Ele deve ser usado como régua para transformar documentos antigos, rascunhos, versões anteriores, auditorias e materiais de curadoria em documentos novos, organizados, neutros, rastreáveis e prontos para alimentar a Central de Padrões.

Este documento não é um modelo de contrato, plano de negócio, relatório técnico, PRD, ata ou checklist específico.

Ele é o **padrão-base para criação de Documentos Mestres**.

## 2. Regra resumida

```text
Fontes antigas v1.0 / v2.0
↓
Análise comparativa
↓
Consolidação
↓
Documento Mestre v3.0
↓
Subdocumentos derivados futuros
↓
Carga estruturada na Central de Padrões
```

## 3. Domínios normativos oficiais

| Nº | Código do Documento Mestre | Domínio normativo | Responsável atual |
|---|---|---|---|
| 00 | DM-00-GOV | Governança da Central de Padrões | Pietro Carboni |
| 01 | DM-01-TEC-LOZE | Padrões Técnicos da Loze | Sávio Codare |
| 02 | DM-02-PROC | Processos, Execução e Registros Operacionais | Yuri Sague |
| 03 | DM-03-SEG | Segurança Digital, Risco e Proteção | Pedro Gazan |
| 04 | DM-04-UX | UX/UI, Experiência e Interface | Alice Montini |
| 05 | DM-05-AGT | Agentes Autônomos, IA e Orquestração | Pierre Zanulli |
| 06 | DM-06-IA | Modelos de IA, Radar Tecnológico e Governança de IA | Klaus Wagen |
| 07 | DM-07-NAM | Naming, Disponibilidade e Banco de Marcas | Noah Verdili |
| 08 | DM-08-IDE | Exploração e Classificação Inicial de Ideias | Dante Montoya |
| 09 | DM-09-MET | Metodologias, Frameworks e Estruturas Intelectuais | Nilo Barret |
| 10 | DM-10-EDU | Educação, Mentorias, Cursos, Trilhas e Programas de Formação | Júlio Mosqueira |
| 11 | DM-11-NEG | Marcas, Empresas, Ventures e Planos de Negócio | César Tulli |

## 4. Estrutura obrigatória de cada Documento Mestre v3.0

Cada Documento Mestre deve conter as seções 1 a 30:

1. Objetivo do documento
2. Escopo do domínio normativo
3. O que este domínio define
4. O que este domínio não define
5. Fontes analisadas
6. Síntese executiva
7. Mapa visual do domínio
8. Princípios
9. Políticas
10. Regras centrais
11. Padrões oficiais e candidatos a padrão
12. Protocolos reais
13. Processos
14. Procedimentos operacionais
15. Checklists obrigatórios
16. Matrizes obrigatórias
17. Registros e evidências obrigatórias
18. Fluxos Mermaid
19. Dependências com outros domínios
20. Conflitos de escopo
21. Riscos se os padrões não forem seguidos
22. O que deve ser monitorado pela Central de Monitoramento
23. Relação com Biblioteca de Módulos Base, se aplicável
24. Relação com módulos executores, se aplicável
25. Lacunas e validações pendentes
26. Decisões já tomadas
27. Subdocumentos oficiais previstos para extração
28. Padrões atômicos sugeridos para o módulo SagB
29. Ordem recomendada de canonização
30. Síntese final

## 5. Status dos Documentos Mestres v3.0

Todos os Documentos Mestres gerados nesta tarefa devem usar:

```text
em_curadoria
```

Nenhum Documento Mestre v3.0 deve ser marcado como `canonico_oficial` sem validação final de Pietro Carboni.

## 6. Critério de pronto

Um Documento Mestre v3.0 está pronto para curadoria quando:

1. está na pasta correta;
2. tem nome correto;
3. tem código interno;
4. tem cabeçalho completo;
5. usa domínio neutro;
6. preserva o melhor das fontes v1.0 e v2.0;
7. remove ruídos de chat;
8. usa recursos visuais;
9. lista subdocumentos futuros;
10. registra riscos, lacunas e dependências;
11. não marca nada como canônico oficial;
12. está em Markdown `.md`.

## 7. Nota de preservação

O arquivo original `99-documento-base-padrao-para-criacao-de-documentos-mestres.md` foi preservado como fonte bruta de origem nesta execução. Este arquivo normalizado é a versão operacional v1.0 usada como régua.
