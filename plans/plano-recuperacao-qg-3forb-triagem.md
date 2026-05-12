# Plano de Recuperação — QG 3forB extraído por engano

## Contexto confirmado

- O log comprova que arquivos do antigo `3forb_QG` foram movidos para backup durante a triagem: [`original_movido|origem=_qgs\3forb\_triagem\3forb_QG\...`](../empresas_b/3forb/_triagem/04_log/processamento.txt:44).
- A pasta de destino desses originais é `Z:\empresas_b\3forb\_triagem\_backup_processados\arquivos_originais`.
- O QG atual operacional está em `Z:\empresas_b\3forb\qg_3forb` e hoje contém apenas 4 módulos prioritários.

## Diagnóstico técnico

1. Houve separação real de artefatos de sistema do QG para a pasta de backup.
2. A pasta de backup está misturada:
   - arquivos do `3forb_QG`
   - arquivos do `3forb_Site`
   - arquivos do `_Site_AIStudio`
   - conteúdo de triagem e conversas
3. O evento `originais_movidos|qtd=16` não representa todo o volume, pois o próprio log mostra centenas de `original_movido` individuais.

## Objetivo da recuperação

Reconstruir um espelho confiável do **QG original extraído** sem contaminar com `3forb_Site` ou `_Site_AIStudio`, e depois decidir o merge controlado no QG atual.

## Checklist de execução

- [ ] Fase 1 — Inventário canônico do que veio de `3forb_QG`
  - [ ] Extrair do log todas as linhas com `origem=_qgs\3forb\_triagem\3forb_QG\`.
  - [ ] Gerar tabela `origem_relativa -> arquivo_no_backup`.

- [ ] Fase 2 — Separação por origem
  - [ ] Classificar em 3 grupos: `QG`, `3forb_Site`, `_Site_AIStudio`.
  - [ ] Marcar conflitos de nome (ex.: `App.tsx`, `index.ts`, `manifest.ts`, `routes.tsx`).

- [ ] Fase 3 — Reconstrução do espelho bruto do QG antigo
  - [ ] Criar pasta alvo: `Z:\empresas_b\3forb\_triagem\recuperacao_qg_bruto`.
  - [ ] Reposicionar cada arquivo de origem `3forb_QG` para seu caminho relativo original.
  - [ ] Não misturar com arquivos de `3forb_Site` e `_Site_AIStudio` nesta fase.

- [ ] Fase 4 — Validação estrutural
  - [ ] Conferir presença mínima: `data/`, `scripts/`, `src/core/modules/`, `src/modules/*`.
  - [ ] Validar módulos esperados: `agentes-ia`, `clientes`, `comercial`, `configuracoes`, `contratos`, `dashboard-executivo`, `eda`, `entregaveis`, `evaluation`, `financeiro`, `gestao-midias-pagas`, `marketing`, `mav`, `monitoramento`, `onboarding`, `playbooks-base-conhecimento`, `propostas`, `sites-landing-pages`, `tarefas-producao`, `vendas`.

- [ ] Fase 5 — Reconciliação com o QG atual
  - [ ] Comparar `recuperacao_qg_bruto` vs `qg_3forb` por módulo.
  - [ ] Definir estratégia por item: `manter atual`, `trazer legado`, `mesclar`.
  - [ ] Priorizar blocos críticos: `moduleRegistry`, `routes`, `manifests`, `services` de domínio.

- [ ] Fase 6 — Evidência e governança
  - [ ] Registrar relatório final de recuperação em `/plans`.
  - [ ] Anexar lista de arquivos recuperados e pendências.

## Critérios de aceite

1. Espelho `recuperacao_qg_bruto` contendo apenas ativos de origem `3forb_QG`.
2. Lista de conflitos por nome resolvida com regra explícita.
3. Matriz de decisão de merge concluída para todos os módulos.
4. QG atual preservado sem sobrescrita cega.

