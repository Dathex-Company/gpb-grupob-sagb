# ADR-003 — Separação Produto, Conta Interna e Operação

## 1. Título
Separação Produto, Conta Interna e Operação.

## 2. Status
aprovado com ajustes

## 3. Contexto
A ET-03 documentou a necessidade de separar criação de produto, relacionamento de entrega e uso diário da operação para evitar confusão de responsabilidade.

## 4. Decisão
Estabelecer a separação oficial:
- Produto = o que a Loze constrói;
- Conta Interna = para quem a Loze entrega;
- Operação = como a empresa atendida usa.

## 5. Motivo
- clareza de papéis;
- redução de conflito entre técnico e operacional;
- melhor governança de demanda e suporte.

## 6. Consequências
- documentação e fluxos devem mapear explicitamente qual camada cada item pertence;
- matriz “Onde Mora” passa a ser referência operacional de localização.

## 7. Impacto
alto (estrutura de trabalho e governança).

## 8. Responsáveis
- Proponente: Cássio
- Validação principal: Rodrigues
- Validação estrutural: Pietro
- Validação operacional: Pedro Gazan

## 9. Relação com documentos
- `01_padroes_loze/loze_000_documento_mestre_da_loze.md`
- `01_padroes_loze/matriz_onde_mora.md`
- `01_padroes_loze/loze_opp_organizacao_pastas_produtos_contas.md`

## 10. Data
2026-05-29

## 11. Próxima revisão
2026-06-15
