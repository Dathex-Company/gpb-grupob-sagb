# Convenções da API SagB v1

## 1. Padrões de Resposta e Erro

Todas as respostas de erro devem seguir uma estrutura padronizada para facilitar o tratamento pelo lado do cliente.

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO_EM_SNAKE_UPPER_CASE",
    "message": "Mensagem amigável descrevendo o erro",
    "details": [
      "Detalhe 1 sobre o erro",
      "Detalhe 2 sobre o erro"
    ]
  }
}
```

### Códigos HTTP Padrões
- `200 OK`: Sucesso geral.
- `201 Created`: Recurso criado com sucesso.
- `400 Bad Request`: Erro de validação ou payload malformado.
- `401 Unauthorized`: Falta de credenciais ou credenciais inválidas.
- `403 Forbidden`: Credenciais válidas, mas sem escopo/permissão para a ação.
- `404 Not Found`: Recurso não existente.
- `429 Too Many Requests`: Limite de rate limit excedido.
- `500 Internal Server Error`: Erro interno da API SagB.

## 2. Paginação

Endpoints que retornam listas devem utilizar paginação baseada em cursor (preferencial para performance) ou offset.

Parâmetros de query:
- `limit`: Quantidade máxima de itens a retornar (padrão 20, máximo 100).
- `cursor` ou `offset`: Marcador da próxima página.

Estrutura de resposta:
```json
{
  "data": [ ... ],
  "meta": {
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true
  }
}
```

## 3. Idempotência

Operações de mutação crítica (como `POST`, `PUT`, `PATCH` que criam ou alteram estado financeiro/sensível) devem suportar o cabeçalho `Idempotency-Key`.

- O cliente gera um UUID único para a requisição.
- A API SagB garante que chamadas subsequentes com a mesma `Idempotency-Key` em uma janela de 24 horas não executem a operação novamente, retornando o mesmo status e corpo da resposta original.

## 4. Versionamento

- A versão da API faz parte da URL (`/v1/...`).
- Mudanças não retrocompatíveis exigem uma nova versão da API (`/v2/...`).
- Campos adicionados no response não são considerados quebras de contrato.

## 5. Rastreabilidade

- Cada request receberá um header `X-Request-Id` retornado na resposta, que deve ser utilizado para troubleshooting.
