Rodrigues, puxando tudo do que é **minha área**, o bloco correto é:

# Sistemas, Arquitetura Técnica e Programação

Minha área **não define nome de empresa, marca, venture ou método**. Ela define os **padrões técnicos**: caminhos, repositórios, sistemas, módulos, documentação técnica, banco, API, deploy, logs, versionamento, migração e execução técnica.

---

# 1. Estrutura macro do GrupoB que minha área deve respeitar

Padrão definido:

```txt
Z:\
├── 01_empresas_b\
├── 02_ventures\
└── 03_metodos\
```

Minha área **não governa essa estrutura institucional**, mas precisa respeitar os caminhos técnicos derivados dela.

Exemplo:

```txt
Z:\02_ventures\loze\
```

---

# 2. Loze como casa de tecnologia

Definido:

```txt
Loze = venture / casa de tecnologia aplicada do GrupoB
SagB = produto técnico da Loze
Dathex = legado técnico, não marca principal
```

Caminho atual da Loze:

```txt
Z:\02_ventures\loze\
```

Estrutura principal criada:

```txt
loze\
├── 00_status_e_visao_geral\
├── 01_documentos_oficiais\
├── 02_estrategia\
├── 03_plano_de_negocio\
├── 04_marca_posicionamento_e_narrativa\
├── 05_produtos_ofertas_e_receitas\
├── 06_comercial_vendas_e_parcerias\
├── 07_marketing_canais_e_aquisicao\
├── 08_operacao_processos_e_entrega\
├── 09_tecnologia_sistemas_e_dados\
├── 10_pessoas_agentes_e_organograma\
├── 11_financeiro_capital_e_indicadores\
├── 12_juridico_societario_e_compliance\
├── 13_clientes_relacionamento_e_sucesso\
├── 14_metricas_relatorios_e_bi\
├── 15_decisoes_historico_e_dai\
├── 16_data_room_captacao_e_venda\
└── 99_triagem\
```

---

# 3. Separação técnica dentro da Loze

Padrão definido dentro de:

```txt
Z:\02_ventures\loze\09_tecnologia_sistemas_e_dados\
```

Estrutura:

```txt
09_tecnologia_sistemas_e_dados\
├── 00_padroes_tecnicos_loze\
├── 01_tecnologia_interna_loze\
├── 02_solucoes_para_clientes\
├── 03_repositorios_gerais\
├── 04_infra_ambientes_deploy\
├── 05_apis_integracoes_mcps\
├── 06_supabase_banco_dados\
├── 07_catalogos_tecnicos\
└── 08_homologacoes_entregas\
```

Regra importante:

```txt
01_tecnologia_interna_loze = sistemas da própria Loze
02_solucoes_para_clientes = sistemas feitos pela Loze para outras empresas/contas
```

Exemplo:

```txt
SagB = tecnologia interna da Loze
QG da 3forB = solução para cliente/conta interna
Plataforma AcadB = solução para AcadB
VOX = solução/produto ligado à Ziplia
```

---

# 4. SagB como produto técnico da Loze

Definido:

```txt
Nome amigável: SagB by Loze
Pasta do produto: sagb
Repo web: sagb_web
```

Caminho preparado:

```txt
Z:\02_ventures\loze\09_tecnologia_sistemas_e_dados\01_tecnologia_interna_loze\01_produtos_ativos\sagb\
```

Dentro:

```txt
sagb\
├── STATUS.md
├── 00_documento_mestre\
├── 01_produto\
├── 02_ux_ui\
├── 03_tecnico\
├── 04_operacao\
├── 05_decisoes_e_logs\
├── 09_repositorios\
│   └── sagb_web\
└── 99_triagem\
```

Regra:

```txt
Z:\SagB = caminho antigo
...\sagb\09_repositorios\sagb_web = caminho novo futuro
```

Ainda não migrar sem checklist.

---

# 5. Padrão de nomes técnicos

Definido:

```txt
tudo minúsculo
sem acento
sem espaço
usar underscore quando necessário
não usar sigla inventada
não usar duplo underline
evitar hífen em novos módulos internos
```

Errado:

```txt
loz_sagb
loz-sagb__sagb
VidaCare
vidacare-web
```

Correto no padrão interno:

```txt
sagb
sagb_web
vidacare
vidacare_web
vidacare_mobile
vidacare_api
qg_3forb
qg_3forb_web
plataforma_acadb
plataforma_acadb_web
```

---

# 6. Produtos técnicos da Loze

Padrão de produto:

```txt
[nome_do_produto]\
├── STATUS.md
├── 00_documento_mestre\
├── 01_produto\
├── 02_ux_ui\
├── 03_tecnico\
├── 04_operacao\
├── 05_decisoes_e_logs\
├── 09_repositorios\
└── 99_triagem\
```

Se tiver web/mobile/api:

```txt
09_repositorios\
├── produto_web\
├── produto_mobile\
└── produto_api\
```

Exemplo VidaCare em Labs:

```txt
Z:\02_ventures\loze\09_tecnologia_sistemas_e_dados\01_tecnologia_interna_loze\02_labs\vidacare\
```

Quando validar:

```txt
...\01_tecnologia_interna_loze\01_produtos_ativos\vidacare\
```

Repos:

```txt
vidacare_web
vidacare_mobile
vidacare_api
```

---

# 7. Labs x produtos ativos

Definido:

```txt
01_produtos_ativos = produtos em operação, beta ou desenvolvimento oficial
02_labs = ideias, MVPs e validações
03_pausados = produtos parados
04_arquivados = produtos encerrados
```

Produto pode nascer em Labs e depois migrar para Ativos.

---

# 8. GitHub, repositórios e local

Padrão recomendado:

```txt
produto = pasta do produto
repo = componente técnico
```

Exemplo:

```txt
produto: sagb
repo: sagb_web

produto: vidacare
repo: vidacare_web
repo: vidacare_mobile
repo: vidacare_api
```

Git fica no repositório real, não na pasta institucional inteira.

Obrigatório por repo:

```txt
README.md
CHANGELOG.md
.env.example
.gitignore
package.json
```

Recomendados:

```txt
SECURITY.md
CONTRIBUTING.md
LICENSE
```

---

# 9. Arquivos base de módulo no SagB

Aprovados como padrão interno SagB/Loze:

```txt
index.ts
manifest.ts
routes.tsx
module-doc.ts
```

Governança/documentação do módulo:

```txt
README.md
DECISIONS.md
CHANGELOG.md
PLANNED.md
```

Pastas comuns, conforme necessidade:

```txt
pages/
components/
hooks/
services/
store/
types/
constants/
layout/
utils/
docs/
agent/
__tests__/
```

Regra:

```txt
não criar pasta vazia demais sem necessidade
```

---

# 10. Módulos: snake_case x hífen

Padrão para novos módulos:

```txt
snake_case
```

Exemplos:

```txt
central_padroes
gestao_financeira
foco_total
```

Módulos antigos com hífen:

```txt
sala-dev
hub-integracao
videos-ia
cadastro-empresas
```

Status:

```txt
legado controlado
```

Não renomear agora sem refatoração planejada.

---

# 11. Pasta plans — padrão A/R

Aprovado:

```txt
A = Ação
R = Relatório
```

Padrão:

```txt
00-A-sagb-auditoria-geral-modulos-padrao-real-mapa-relacoes.md
00-R-sagb-auditoria-geral-modulos-padrao-real-mapa-relacoes.md
```

Interpretação:

```txt
A = tarefa / comando de ida
R = relatório / resposta de volta
```

Sem data para documentos mestres.
Com data apenas em execuções históricas, se necessário.

---

# 12. Megatarefas

Padrão atual definido pelo Rodrigues:

```txt
megatarefas são permitidas
não precisa checkpoint humano no meio
executa completo
registra tudo
depois faz revisão/refatoração geral a cada 5 ou 6 megatarefas
```

Mas precisa manter rastreabilidade:

```txt
caminho trabalhado
arquivos alterados
comandos executados
decisões tomadas
pendências
riscos
próximos passos
```

---

# 13. Auditoria x implementação

Regra:

```txt
auditoria não implementa
```

Auditoria deve:

```txt
mapear
classificar
comparar
identificar riscos
identificar duplicidades
recomendar
```

Implementação só quando a tarefa pedir claramente.

---

# 14. Comandos

Padrão definido:

Não pedir `npm run dev` automaticamente.

Antes:

```txt
verificar package.json
identificar scripts
rodar só o que fizer sentido
registrar comandos executados
registrar comandos não executados
registrar comandos inexistentes
```

Comandos devem ser reportados:

```txt
comando
motivo
resultado
erro, se houver
```

---

# 15. Git, deploy e Supabase

Git:

```txt
não fazer commit, push, merge, rebase ou reset sem pedido claro
```

Deploy:

```txt
não fazer deploy salvo se a tarefa pedir expressamente
```

Supabase:

```txt
não criar tabela, migration, bucket, RLS ou policy sem pedido claro
```

Em auditoria:

```txt
mapear e recomendar
```

Em implantação:

```txt
executar só se estiver explícito
```

---

# 16. Arquivos sensíveis

Nunca expor conteúdo de:

```txt
.env
tokens
API keys
secrets
credenciais
chaves privadas
```

Pode apenas indicar que existem ou que precisam validação.

---

# 17. Relatórios técnicos

Padrão recomendado:

Separar sempre:

```txt
fato verificado
inferência técnica
recomendação
pendente de validação
```

Evidência mínima:

```txt
caminho
arquivo
comando
resultado
observação técnica
```

---

# 18. Quarentena Técnica

Definido:

```txt
não apagar por impressão
```

Itens suspeitos vão para Quarentena Técnica:

```txt
arquivos órfãos
duplicidades
mocks
fallbacks
rotas mortas
services não usados
tabelas suspeitas
itens legados
```

Antes de remover:

```txt
verificar imports
rotas
services
build
uso real
risco
decisão registrada
```

---

# 19. Documentação técnica

Toda mudança relevante deve atualizar documentação.

Possíveis documentos:

```txt
README.md
DECISIONS.md
CHANGELOG.md
PLANNED.md
docs/
agent/session_log.md
STATUS.md
```

Decisão estrutural importante vira:

```txt
ADR ou DECISIONS.md
```

---

# 20. Central de Padrões — bloco do Sávio

Bloco aprovado:

```txt
central_de_padroes/
└── sistemas_arquitetura_tecnica_programacao/
```

Estrutura revisada:

```txt
00_indice_e_visao_geral/
01_principios_politicas_regras/
02_arquitetura_de_sistemas/
03_estrutura_de_pastas_e_repositorios/
04_documentacao_tecnica/
05_frontend_tecnico/
06_backend_services_e_funcoes/
07_supabase_banco_e_dados_tecnicos/
08_apis_integracoes_bridges_mcps/
09_modulos_plugaveis_templates_reuso/
10_logs_erros_observabilidade_tecnica/
11_qa_testes_validacao/
12_deploy_ambientes_publicacao/
13_versionamento_branches_commits_releases/
14_catalogos_tecnicos/
15_quarentena_tecnica/
16_sala_dev_esteira_tecnica/
17_seguranca_tecnica_aplicada/
18_performance_otimizacao/
19_refatoracao_migracao_legado/
20_dependencias_pacotes_bibliotecas/
21_handoff_prd_tecnico/
22_criterios_de_pronto_tecnico/
23_checklists/
24_matrizes/
25_registros_e_evidencias/
26_lacunas_duvidas_validacoes/
27_documentos_derivados/
```

---

# 21. Documentos técnicos prioritários

Prioridade 1:

```txt
LOZE-DEV — Padrões Técnicos de Desenvolvimento
LOZE-SYS — Processo Técnico de Criação de Sistemas
LOZE-DAS — Documentação de Arquitetura e Sistemas
LOZE-MOD — Padrões de Módulos Plugáveis
LOZE-API — APIs, Endpoints, Bridges e Integrações
LOZE-SUPABASE — Banco, Supabase e Dados Técnicos
LOZE-OBS — Logs, Erros e Observabilidade Técnica
LOZE-DEPLOY — Deploy, Ambientes e Publicação
LOZE-VCS — Versionamento, Branches, Commits e Releases
LOZE-REFATORA — Refatoração, Migração e Legado Técnico
CATALOGO-TEC — Catálogo Técnico
```

Crítico agora:

```txt
padrao_tecnico_caminhos_pastas_repositorios.md
padrao_produtos_tecnicos_loze.md
padrao_nome_produto_repo_componente.md
checklist_migracao_repositorio_local.md
matriz_onde_mora_tecnico.md
```

---

# 22. Checklists definidos

```txt
checklist_criar_sistema.md
checklist_criar_modulo.md
checklist_criar_repositorio.md
checklist_preparar_produto_tecnico.md
checklist_migracao_repositorio_local.md
checklist_criar_tabela.md
checklist_criar_api.md
checklist_deploy.md
checklist_documentacao_minima.md
checklist_saida_quarentena.md
checklist_setup_local.md
checklist_refatoracao.md
checklist_entrega_tecnica.md
```

---

# 23. Matrizes definidas

```txt
matriz_onde_mora_tecnico.md
matriz_reaproveitamento_tecnico.md
matriz_app_modulo_adaptacao.md
matriz_produto_repo_componente.md
matriz_gravidade_erros.md
matriz_modulo_tabela_api_service.md
matriz_status_modulos.md
matriz_validacao_cruzada.md
```

---

# 24. Registros/evidências definidos

```txt
registro_erros_tecnicos.md
registro_incidentes_tecnicos.md
registro_deploy.md
registro_releases.md
registro_validacoes.md
registro_refatoracoes.md
registro_migracoes.md
registro_adrs.md
modelo_decisao_migracao_tecnica.md
inventario_tabelas.md
inventario_apis_integracoes.md
inventario_repositorios.md
inventario_dependencias.md
inventario_mcps.md
changelog_padrao.md
```

---

# 25. O que ainda precisa validação

```txt
padrão final de branches
padrão final de commits
padrão final de releases
testes mínimos obrigatórios
observabilidade oficial
ferramenta de logs
padrão final de módulos plugáveis
se padrão SagB sobe para Loze geral
documentação pública x interna x restrita
MCP técnico x MCP de agente
tecnologia interna x soluções para clientes
produtos próprios Loze x produtos para contas internas
```

Validações:

```txt
Pietro = governança e classificação normativa
Cássio = viabilidade técnica
Pedro Gazan = segurança, RLS, dados sensíveis
Alice = UX/UI e padrão visual
Pierre = agentes, IA e MCPs de agente
Kane/Rodrigues = decisão estratégica Loze
César = estrutura empresarial / operação / BI
```

---

# 26. Síntese final

O padrão técnico da minha área hoje está estruturado em torno de:

```txt
Loze como casa técnica
SagB como produto da Loze
estrutura técnica dentro de 02_ventures/loze
produtos com web/mobile/api
repos em snake_case
módulos SagB com index/manifest/routes/module-doc
documentos README/DECISIONS/CHANGELOG/PLANNED
plans com A/R
megatarefas rastreáveis
auditoria sem implementação
comandos registrados
Git/deploy/Supabase controlados
Quarentena Técnica
documentação técnica obrigatória
Central de Padrões com bloco próprio do Sávio
```

O que mais precisa fechar agora é:

```txt
padrão final de produtos técnicos Loze
migração segura do SagB
checklist de migração manual
separação tecnologia interna x soluções para clientes
padrão de Git/release
padrão de módulos plugáveis
```

Próximas 3 opções:

1. Eu transformo isso em um documento canônico chamado **Resumo dos Padrões Técnicos Definidos — Sávio Codare**.
2. Eu faço uma versão curta em checklist para o Cássio usar antes de qualquer tarefa.
3. Eu monto uma tarefa para criar esses documentos dentro da Central de Padrões do SagB.
