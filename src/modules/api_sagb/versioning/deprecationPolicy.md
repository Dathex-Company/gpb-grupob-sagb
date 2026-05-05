# Política de Depreciação da API SagB

## Visão Geral

Esta política define o ciclo de vida completo das versões da API SagB, desde o lançamento até o sunset (descontinuação). O objetivo é garantir previsibilidade para consumidores da API enquanto permitimos evolução técnica.

## Ciclo de Vida da Versão

```
Lançamento → Active → Deprecated → Sunset → Removida
```

| Fase | Duração Mínima | Ações do Consumidor |
|------|----------------|---------------------|
| **Active** | Indeterminado | Uso normal, acesso total |
| **Deprecated** | 90 dias | Migrar para versão mais recente |
| **Sunset** | Data específica | Versão ainda funcional mas sem suporte |
| **Removida** | — | Requisições retornam 410 Gone |

## Política de Versionamento

### 1. Versionamento Semântico

Seguimos [SemVer 2.0.0](https://semver.org/):

- **MAJOR** (`v1`, `v2`): Mudanças incompatíveis com versões anteriores
- **MINOR** (`v1.1`): Adição de funcionalidades retrocompatíveis
- **PATCH** (`v1.0.1`): Correções de bugs retrocompatíveis

### 2. Headers de Versão

| Header | Descrição | Exemplo |
|--------|-----------|---------|
| `Accept-Version` | Versão solicitada pelo cliente (request) | `v1` |
| `X-API-Version` | Versão resolvida (response) | `1.0.0` |
| `X-API-Version-Prefix` | Prefixo da versão (response) | `v1` |
| `Sunset` | Data de descontinuação (response) | `Sun, 05 Nov 2026 00:00:00 GMT` |
| `Warning` | Aviso de deprecação (response) | `299 api.sagb.com.br: "Version 'v1' is deprecated"` |

### 3. Regras de Deprecação

1. **Aviso prévio**: Toda versão a ser depreciada receberá aviso com **mínimo de 90 dias** antes do sunset.
2. **Comunicação**: O aviso será enviado via:
   - Header `Warning` em todas as respostas da versão antiga
   - Atualização do changelog da API
   - Comunicação no painel do desenvolvedor
3. **Suporte durante deprecação**: A versão continua recebendo correções críticas de segurança, mas sem novas funcionalidades.
4. **Sunset**: Na data de sunset, a versão para de funcionar e requisições retornam `410 Gone`.

### 4. Migração

Para cada nova versão MAJOR, será publicado um guia de migração específico.

Canais oficiais para anúncios:
- Changelog da API: [`CHANGELOG_API.md`](../CHANGELOG_API.md)
- Painel do desenvolvedor SagB
- Comunicação via e-mail para clientes registrados

### 5. Exceções

Em casos de vulnerabilidade crítica de segurança, uma versão pode ser depreciada com prazo reduzido, mediante comunicação extraordinária.

## Histórico de Revisões

| Data | Versão | Descrição |
|------|--------|-----------|
| 2026-05-05 | 1.0 | Criação da política de depreciação |
