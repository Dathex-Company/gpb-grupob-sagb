# Validação ET-03.3 | ADRs pendentes

## 1. Resumo executivo

Os ADRs `ADR-003`, `ADR-004` e `ADR-006` foram revisados contra `LOZE-000`, `matriz_onde_mora`, `LOZE-GOV`, `LOZE-OPP` e `Revisão 04`.

Resultado: **coerentes e sustentados pela base institucional**, sem contradições críticas. Recomendação de status: **aprovado com ajustes** para os três.

## 2. Análise do ADR-003

**Tema:** separação Produto, Conta Interna e Operação.  
**Avaliação:** coerente com `LOZE-000` e com a matriz de custódia da `matriz_onde_mora`.

**Ajustes recomendados:**
- explicitar fronteiras em casos híbridos (produto com operação assistida);
- anexar exemplos operacionais no `LOZE-OPP`.

## 3. Análise do ADR-004

**Tema:** código na Loze, relacionamento na Conta Interna, uso diário na empresa atendida.  
**Avaliação:** consistente com `LOZE-000` e derivado direto da separação do ADR-003.

**Ajustes recomendados:**
- definir exceções permitidas;
- registrar fluxo de exceção e aprovação.

## 4. Análise do ADR-006

**Tema:** Central de Padrões como embrião do Loze Docs.  
**Avaliação:** coerente com ET-03 e com o `_readme.md` canônico; compatível com LOZE-GOV.

**Ajustes recomendados:**
- definir nomenclatura final (Loze Docs x Central de Padrões);
- definir estratégia de publicação interna/externa.

## 5. Contradições encontradas

- Não foram encontradas contradições estruturais entre ADR-003, ADR-004 e ADR-006.
- Há somente pendências de detalhamento operacional e de nomenclatura final.

## 6. Status recomendado

- ADR-003: **aprovado com ajustes**
- ADR-004: **aprovado com ajustes**
- ADR-006: **aprovado com ajustes**

## 7. Responsáveis que precisam validar

- Rodrigues: validação final de fronteiras e regra operacional.
- Kane: validação institucional da camada Loze e governança.
- Pietro: validação de aplicabilidade estrutural no LOZE-OPP.
- Cássio: consolidação técnica e precedência documental.
- Alice: coerência de linguagem e nomenclatura para consumo amplo.
- Pedro Gazan: aderência operacional de uso diário.

## 8. Documentos impactados

- `05_decisoes_adr/ADR-003-separacao-produto-conta-operacao.md`
- `05_decisoes_adr/ADR-004-regra-codigo-relacionamento-uso.md`
- `05_decisoes_adr/ADR-006-central-padroes-embriao-loze-docs.md`
- `05_decisoes_adr/matriz_adrs_loze.md`
- `01_padroes_loze/loze_000_documento_mestre_da_loze.md`
- `01_padroes_loze/matriz_onde_mora.md`
- `01_padroes_loze/loze_opp_organizacao_pastas_produtos_contas.md`

## 9. Decisão recomendada

Promover os três ADRs para **aprovado com ajustes**, mantendo revisão de ajustes finos antes de “aprovado” definitivo.

## 10. Próximos passos

1. Consolidar ajustes finos de fronteira e exceções.
2. Confirmar nomenclatura final Loze Docs.
3. Avançar para ET-04 com base institucional travada.

