# SagB | Inventário Geral de Sistemas e Repositórios | Auditoria por Caminho | 30-05-2026

## Finalidade deste documento

Este documento serve como **arquivo mestre único** para executar e registrar uma auditoria geral de sistemas, aplicativos, repositórios e projetos encontrados dentro de um caminho principal.

A auditoria deve identificar pastas com sinais de sistema, analisar o que existe nelas e registrar tudo **neste mesmo documento**, sem criar arquivos dentro dos sistemas analisados.

---

## Regra principal

**Não alterar, criar, mover, apagar ou instalar nada dentro dos sistemas encontrados.**

A auditoria deve apenas:

1. ler estruturas;
2. identificar sinais de sistema;
3. analisar arquivos técnicos;
4. registrar achados neste documento;
5. gerar uma visão geral do que existe.

---

## Caminho principal da auditoria

Preencher antes de executar:

```txt
[COLE AQUI O CAMINHO PRINCIPAL A SER VASCULHADO]
```

Exemplo:

```txt
d:\DATHEX_STACK
```

---

## Prompt de execução para o agente auditor

Use este documento como comando e destino da auditoria.

Você deve analisar o caminho principal informado acima e vasculhar suas subpastas procurando sinais de que existe um sistema, aplicativo, site, API, automação, pacote, repositório ou projeto técnico.

### Objetivo

Criar um inventário geral de todos os sistemas encontrados no caminho analisado, registrando neste mesmo documento:

- quais sistemas existem;
- onde estão;
- o que parecem ser;
- qual tecnologia utilizam;
- em que nível de maturidade estão;
- se usam Git;
- se usam Supabase, Netlify, Vite, React, Node, Python, APIs ou outras ferramentas;
- quais rotas, páginas, scripts, estruturas e integrações aparecem;
- quais projetos parecem ativos, parciais, abandonados ou duplicados;
- o que pode ser reaproveitado no ecossistema SagB/GrupoB.

---

## Sinais de que uma pasta pode ser um sistema

Considere como possíveis sistemas as pastas que contenham um ou mais destes sinais:

- `.git/`
- `package.json`
- `pnpm-lock.yaml`
- `package-lock.json`
- `yarn.lock`
- `vite.config.*`
- `next.config.*`
- `netlify.toml`
- `supabase/`
- `src/`
- `app/`
- `pages/`
- `public/`
- `server/`
- `api/`
- `routes/`
- `components/`
- `.env.example`
- `README.md`
- `Dockerfile`
- `docker-compose.yml`
- `requirements.txt`
- `pyproject.toml`
- `main.py`
- `manage.py`
- `dist/`
- `build/`
- `vercel.json`
- `firebase.json`

Não trate `node_modules`, `.git`, `dist`, `build`, `.next`, `.vite`, `.cache` e pastas de dependências como sistemas próprios.

---

## Regras de varredura

1. Não instalar dependências.
2. Não rodar comandos destrutivos.
3. Não alterar código.
4. Não criar documentação dentro dos projetos encontrados.
5. Não criar arquivos em cada sistema.
6. Registrar tudo apenas neste documento.
7. Diferenciar achado confirmado de inferência.
8. Não expor chaves, tokens, secrets ou valores de `.env`.
9. Se encontrar `.env`, registrar apenas que existe, sem revelar conteúdo.
10. Se houver muitos sistemas, priorizar primeiro os que têm `.git` e `package.json`.
11. Se a varredura for longa, registrar progresso por blocos.
12. Se for necessário usar script auxiliar, criar temporariamente fora dos projetos analisados e não deixar lixo nos repositórios.

---

## Para cada sistema encontrado, registrar

Use exatamente este modelo para cada sistema:

```md
## [Nome da pasta/sistema] | Inventário Técnico | 30-05-2026

### 1. Identificação
- Nome provável:
- Caminho completo:
- Tipo provável:
- Status/maturidade:
- Possui Git:
- Últimos sinais de atividade, se identificáveis:

### 2. Função provável do sistema
- Para que parece servir:
- Produto, módulo, site, API, app, automação ou experimento:
- Relação possível com SagB/GrupoB:

### 3. Stack e tecnologias
- Front-end:
- Back-end:
- Banco de dados:
- Deploy:
- Linguagens:
- Frameworks:
- Bibliotecas principais:

### 4. Estrutura técnica encontrada
- Pastas principais:
- Arquivos principais:
- Configurações encontradas:
- Scripts disponíveis no package.json, se houver:

### 5. Rotas, páginas e fluxos
- Rotas/páginas identificadas:
- Fluxos importantes:
- Menus ou módulos aparentes:

### 6. Dados, Supabase e integrações
- Usa Supabase:
- Tabelas ou referências encontradas:
- Buckets/storage:
- APIs externas:
- Webhooks:
- Netlify/Vercel/Firebase/outros:
- Variáveis de ambiente encontradas, sem expor valores:

### 7. Documentação existente
- README:
- Docs:
- Changelog:
- Decisões:
- Planejamento:
- Comentários relevantes:

### 8. Maturidade técnica
Classifique como:
- Não iniciado
- Conceitual
- Base criada
- Parcial
- Funcional
- Maduro
- Abandonado/incerto

Justificativa curta:

### 9. Riscos e pendências
- Riscos técnicos:
- Pendências aparentes:
- Possíveis duplicidades:
- Pontos fora do padrão:

### 10. Potencial de reaproveitamento
- O que pode ser reaproveitado:
- Relação com módulos do SagB:
- Se deve ser incorporado, arquivado, revisado ou mantido separado:

### 11. Recomendação
- Próximo passo recomendado:
```

---

## Síntese geral obrigatória ao final

Ao terminar a varredura, inclua uma seção final com este modelo:

```md
# Síntese Geral da Auditoria de Sistemas | 30-05-2026

## 1. Caminho analisado
- Caminho principal:

## 2. Quantidade geral
- Total de pastas analisadas:
- Total de possíveis sistemas encontrados:
- Total com Git:
- Total com package.json:
- Total com Supabase:
- Total com Netlify:
- Total com documentação mínima:

## 3. Sistemas mais relevantes encontrados
1.
2.
3.
4.
5.

## 4. Sistemas possivelmente ativos
1.
2.
3.

## 5. Sistemas parciais ou incompletos
1.
2.
3.

## 6. Sistemas possivelmente abandonados ou incertos
1.
2.
3.

## 7. Sistemas com potencial de reaproveitamento no SagB
1.
2.
3.

## 8. Possíveis duplicidades encontradas
1.
2.
3.

## 9. Maiores riscos identificados
1.
2.
3.

## 10. Recomendações gerais
1.
2.
3.

## 11. Próxima etapa sugerida
- [descrever]
```

---

## Critério de maturidade

Use este critério para classificar cada sistema:

- **Não iniciado:** só existe pasta ou arquivos soltos.
- **Conceitual:** existem documentos/ideias, mas pouco ou nenhum código funcional.
- **Base criada:** estrutura técnica existe, mas ainda sem fluxo principal completo.
- **Parcial:** há telas, rotas ou funções, mas o produto ainda está incompleto.
- **Funcional:** roda localmente ou tem partes úteis operando.
- **Maduro:** possui estrutura clara, documentação, deploy, dados e fluxo consistente.
- **Abandonado/incerto:** há sinais de projeto antigo, quebrado, duplicado ou sem direção clara.

---

## Observação de segurança

Se encontrar arquivos `.env`, credenciais, chaves, tokens ou dados sensíveis:

- não copiar valores;
- não expor conteúdo;
- registrar apenas a existência;
- alertar sobre o risco;
- sugerir revisão de segurança.

---

## Área de resultados da auditoria

A partir daqui, registre os sistemas encontrados e a síntese final.

---
