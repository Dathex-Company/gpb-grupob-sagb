# ET-22 — Saneamento Crítico, Consolidação da Base e Preparação para Busca Inteligente

**Data:** 2026-06-01  
**Responsável técnico:** Cássio Mendes  
**Módulo:** Central de Padrões — SagB  
**Escopo:** Correção crítica, consolidação, UI/UX funcional e preparação de arquitetura futura.

---

## 1. Saneamento crítico

### Conflito identificado

Foi encontrada duplicidade da chave `CP-UX-001` em `fallbackData.ts`:

1. `CP-UX-001` — **Design System SagB**  
   - origem: carga base preservada;
   - status: aprovado;
   - função: padrão canônico/operacional de Design System.

2. `CP-UX-001` — **Variação visual real não é troca de cor**  
   - origem: Curadoria Geral das Divisões;
   - status: revisão;
   - função: princípio novo da divisão Alice/UX.

### Decisão tomada

Foi preservado `CP-UX-001` para **Design System SagB**, por ser conteúdo anterior e já aprovado.

O item novo da Curadoria Geral foi renumerado para `CP-UX-007`, mantendo:

- conteúdo;
- status de revisão;
- área Alice;
- dependências;
- rastreabilidade como item derivado da curadoria.

Também foi atualizado o vínculo do módulo `central_padroes` para incluir `CP-UX-007`.

### Validação

Foi executada varredura de duplicidades por chave no arquivo de fallback. Resultado:

```text
Nenhuma chave duplicada encontrada.
```

---

## 2. FallbackData e Supabase

### Ajuste feito

O repositório foi alterado para tratar fallback como contingência:

- se houver dados reais em Supabase, a leitura usa `onlineSnapshot` como base;
- `standards`, `documents`, `checklists`, `decisions` e `modules` deixam de ser completados silenciosamente pelo fallback quando há base online;
- fallback completo só é retornado quando não há dados reais disponíveis;
- `areas` e `agents` continuam usando fallback quando a base online ainda não fornece essas entidades.

### Pendência técnica

Ainda não existe estrutura persistente dedicada para `areas` e `agents` no snapshot online atual. Essas duas coleções permanecem como fallback controlado até criação/mapeamento de tabelas próprias ou reaproveitamento de tabelas existentes.

---

## 3. Busca textual e preparação semântica

### Ajustes feitos

A comunicação técnica da busca foi corrigida:

- a página agora se chama **Busca Textual da Central**;
- `textSearch()` foi criado como método honesto para o modo atual;
- `semanticSearch()` permanece como compatibilidade, mas registra que ainda retorna fallback textual;
- `centralPadroesSearchRoadmap` documenta os estágios futuro híbrido e semântico.

### Campos ampliados

A busca textual agora considera:

- chave;
- título;
- resumo;
- responsável;
- área;
- status;
- tipo normativo;
- risco;
- dependências;
- módulos relacionados;
- metadados disponíveis de documentos e decisões.

### Preparação futura

Ficou explicitado no código que a busca semântica real exigirá:

- embeddings;
- pgvector;
- reranking;
- RAG;
- integração futura com o agente Pietro Carbone.

---

## 4. SearchPage

### Ajustes feitos

A tela foi removida do padrão visual antigo do SagB e passou a usar classes `cp-*`:

- hero de busca;
- input premium;
- tabs com padrão da Central;
- cards de resultado;
- box de roadmap técnico.

---

## 5. Dashboard

### Ajustes feitos

Foram adicionados gráficos e indicadores sem dependência externa:

- donut SVG por status;
- barras por divisão;
- barras por tipo normativo;
- pendentes de canonização;
- decisões abertas;
- dependências transversais;
- cobertura geral por divisão.

---

## 6. Sidebar / menu interno

### Ajustes feitos

A navegação foi reorganizada por grupos recolhíveis:

- Visão Geral;
- Padrões;
- Protocolos;
- Documentos-Mãe;
- Checklists;
- Matrizes;
- Validações;
- Biblioteca de Módulos Base;
- Configurações.

O objetivo foi reduzir excesso de itens no mesmo nível e preparar a Central para crescer sem perder legibilidade.

---

## 7. BaseModulesPage

### Ajustes feitos

`BaseModulesPage` deixou de ser placeholder e recebeu primeira versão real como **Biblioteca de Módulos Base / Gate Modular Pré-Dev**.

Inclui:

- narrativa do gate;
- fluxo CID + RAI → NICO → NAGI → AJUP/Audacus → Biblioteca → Pietro/Central → Sala Dev;
- listagem dos módulos base reutilizáveis já presentes no snapshot;
- recomendação de evolução para entidade dedicada.

---

## 8. Chat Pietro Carbone

### Recomendação técnica registrada

O chat completo não foi implementado nesta ET.

Recomendação para próxima fase:

1. MVP como página dedicada ou drawer direito;
2. reaproveitar núcleo conversacional existente;
3. usar busca textual ampliada como fonte inicial;
4. evoluir depois para RAG com embeddings e pgvector;
5. considerar contexto do usuário logado para permissões, divisão e histórico.

---

## 9. Build e validação

Comandos executados:

```text
Varredura de chaves duplicadas: OK
npm run build: OK
```

Resultado do build:

```text
✓ built in 38.32s
```

Warnings não bloqueantes permanecem:

- circular chunk vendor/react-vendor;
- import dinâmico/estático de Supabase;
- chunk principal acima de 500 kB.

---

## 10. Pendências

1. Criar persistência real para `areas` e `agents`.
2. Criar entidade dedicada para Biblioteca de Módulos Base.
3. Separar `registro` e `evidencia` nos dados normativos.
4. Evoluir busca para índice próprio/embedding.
5. Implementar Pietro Carbone apenas após estabilizar busca e base.

---

## 11. Recomendação de próxima ET

Próxima frente recomendada: **Biblioteca de Módulos Base + Canonização por Divisão**.

Justificativa: antes de Chat Pietro com IA, a base normativa precisa estar mais estruturada. O chat será mais útil quando houver entidades estáveis, relações claras e dados persistidos sem dependência de fallback.

