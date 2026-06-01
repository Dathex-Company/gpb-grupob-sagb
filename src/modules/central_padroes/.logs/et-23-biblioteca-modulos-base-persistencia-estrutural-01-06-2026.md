# ET-23 — Biblioteca de Módulos Base e Persistência Estrutural

**Data:** 2026-06-01  
**Responsável técnico:** Cássio Mendes  
**Módulo:** Central de Padrões — SagB  
**Escopo:** Entidade governada de módulos base, redução de fallback em áreas/agentes, separação Registro x Evidência e preparação de canonização Alice/UX.

---

## 1. Biblioteca de Módulos Base

### Estrutura criada

A Biblioteca de Módulos Base deixou de ser apenas tela conceitual e passou a operar com entidade governada no front-end e estrutura Supabase preparada.

Campos mínimos definidos:

- `moduleId`;
- `name`;
- `moduleType`;
- `description`;
- `status`;
- `owner`;
- `areaId`;
- `dependencies`;
- `risks`;
- `recommendedUse`;
- `reuseCriteria`;
- `linkedStandards`;
- `linkedProtocols`;
- `linkedChecklists`;
- `gateChecklistKey`;
- `source`.

### Catálogo inicial ET-23

Foram estruturados quatro módulos base candidatos:

1. `auth_core` — Auth Core;
2. `audit_logs_core` — Audit Logs Core;
3. `ui_shell_core` — UI Shell Core;
4. `supabase_storage_core` — Supabase Storage Core.

Todos vinculados a `CP-TEC-006` como gate obrigatório "Antes de criar módulo".

### Supabase preparado

Criada migration preparatória:

`supabase/migrations/20260601123001_central_padroes_et23_base_modules.sql`

Tabela criada:

`central_padroes_base_modules`

Status: estrutura criada no código/migration, mas não aplicada remotamente nesta ET, pois não houve deploy/push/aplicação de banco remoto.

---

## 2. Persistência de áreas e agentes

### Áreas

Foi confirmado que já existe tabela Supabase:

`central_padroes_areas`

Foi implementada leitura online via CRUD service.

Quando a tabela retorna dados, `areas` deixam de depender do fallback.

### Agentes

Foi confirmado que já existe tabela Supabase:

`central_padroes_agent_runs`

Foi implementada leitura online via CRUD service.

Quando a tabela retorna dados, `agents` deixam de depender do fallback.

### Seed

O seed foi ampliado para tentar enviar:

- áreas;
- agentes;
- módulos base;
- padrões;
- documentos;
- decisões;
- checklists;
- módulos.

Limitação: módulos base dependem da migration ET-23 estar aplicada no Supabase. Se a tabela ainda não existir, a tentativa é tolerante e não quebra o seed.

---

## 3. Registro x Evidência

### Situação anterior

O tipo `evidencia` existia no union type, mas evidências estavam cadastradas como `registro`.

Casos claros identificados:

- `CP-TEC-026` — Evidência de validação;
- item de Alice/UX — Registro de evidência visual por release.

### Ajuste mínimo feito

Sem quebrar dados existentes, foram ajustados os casos mais explícitos:

- `CP-TEC-026` passou de `registro` para `evidencia`;
- `Registro de evidência visual por release` passou a `Evidência visual por release`, tipo `evidencia`.

### Recomendação normativa

- `registro`: ato, evento, decisão, incidente, ocorrência, alteração ou rastreamento.
- `evidencia`: prova documental/visual/técnica que comprova execução, validação, conformidade ou auditoria.

---

## 4. Preparação para canonização Alice/UX

### Base preparada

A divisão Alice/UX agora tem o conflito `CP-UX-001` resolvido desde a ET-22 e novos vínculos estruturais na ET-23.

Itens relevantes para próxima canonização:

- `CP-UX-001` — Design System SagB;
- `CP-UX-002` — Loze UI Standard e Design System;
- `CP-UX-003` — Gate visual de tela;
- `CP-UX-004` — Matriz tipo de tela x padrão visual;
- `CP-UX-005` — Checklist de release visual;
- `CP-UX-006` — Evidência visual por release;
- `CP-UX-007` — Variação visual real não é troca de cor.

### Critérios preparados

Para canonizar Alice/UX na ET-24, recomenda-se validar:

1. unicidade de chaves;
2. coerência entre `CP-UX-001` e `CP-UX-002`;
3. se `CP-UX-003` deve ser protocolo obrigatório;
4. se `CP-UX-005` deve virar checklist oficial de release visual;
5. se `CP-UX-006` deve permanecer como evidência;
6. decisão Pietro sobre canonicidade final;
7. decisão Rodrigues sobre obrigatoriedade do padrão visual em módulos novos.

---

## 5. Fallback remanescente

Ainda dependem de fallback em alguns cenários:

- `areas`, se Supabase não retornar linhas;
- `agents`, se Supabase não retornar linhas;
- catálogo de módulos base, se tabela ET-23 ainda não existir ou estiver vazia;
- conteúdos normativos ainda não validados/canonizados por Pietro.

Fallback agora é contingência ou catálogo inicial controlado, não mais direção conceitual principal.

---

## 6. Validação

Build executado:

```text
npm run build
```

Resultado:

```text
✓ built in 1m 10s
```

Warnings não bloqueantes permanecem:

- circular chunk vendor/react-vendor;
- import dinâmico/estático de Supabase;
- chunk principal acima de 500 kB.

---

## 7. Próxima ET recomendada

Recomendação: **ET-24 Canonização Alice/UX**.

Justificativa:

- a base Alice/UX já teve conflito de chave resolvido;
- a separação de evidência já começou;
- o módulo base `ui_shell_core` foi vinculado aos padrões UX;
- canonizar Alice/UX antes de Chat Pietro/embedding melhora a qualidade semântica da base.

Busca inteligente com embedding e Chat Pietro MVP devem vir depois de pelo menos uma divisão canonizada como modelo.

