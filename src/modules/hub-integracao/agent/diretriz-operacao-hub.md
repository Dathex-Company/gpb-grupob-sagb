# Diretrizes de Operação - Hub de Integrações

## 1. Regra de Ouro (Centralização)
NENHUM módulo de negócio do SagB deve implementar conexões diretas (point-to-point) com APIs externas. Toda integração deve passar pelo contrato do `integrationService`.

## 2. Governança de Credenciais
- É expressamente proibido hardcodar chaves de API, tokens ou secrets no código-fonte.
- Credenciais DEVEM ser gerenciadas pelo `credentialManager` e armazenadas criptografadas.
- O acesso às credenciais é feito via injeção segura nos drivers, nunca exposto aos módulos consumidores.

## 3. Catálogo e Aprovação
- Novas integrações só entram no catálogo oficial após validação de segurança e arquitetura por Alan Flow.
- Módulos que precisem de novas APIs devem solicitar a construção de um driver no Hub.

## 4. Estabilidade
- O `integrationService` deve prever fallback e tratamento de erro resiliente. A queda de uma API externa não deve travar o SagB inteiro.
- Drivers devem implementar métodos de health check (ping).
