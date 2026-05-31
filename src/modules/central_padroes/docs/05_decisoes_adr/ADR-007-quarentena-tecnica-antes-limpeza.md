# ADR-007 — Quarentena Técnica antes de limpeza

## 1. Título
Quarentena Técnica obrigatória antes de limpeza/remoção.

## 2. Status
aprovado com ajustes

## 3. Contexto
O SagB possui legado, duplicidades, mocks e áreas sensíveis. Remoções sem triagem causam risco alto.

## 4. Decisão
Instituir a Quarentena Técnica como etapa obrigatória antes de qualquer remoção de arquivo, rota, service, integração ou estrutura técnica sensível.

## 5. Motivo
- prevenir perda de ativos em uso;
- reduzir regressão;
- garantir validação técnica e decisória.

## 6. Consequências
- itens suspeitos devem ser classificados antes de remover;
- remoção só ocorre após validação explícita.

## 7. Impacto
alto (segurança de evolução e manutenção).

## 8. Responsáveis
- Proponente: Cássio
- Validação principal: Rodrigues
- Validação de governança: Kane

## 9. Relação com documentos
- `04_quarentena_e_riscos/README.md`
- `QUARENTENA_TECNICA.md`
- `07_validacoes/validacao_et_03_1_base_institucional_loze.md`

## 10. Data
2026-05-29

## 11. Próxima revisão
2026-06-15

