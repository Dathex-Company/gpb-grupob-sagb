# Plano do Módulo — nucleo-conversacional

Este documento estabelece o planejamento executivo e a trilha de evolução do módulo `nucleo-conversacional`.

## 1. Missão do Módulo
Garantir operação estável, rastreabilidade de mudanças e evolução contínua do módulo conversacional do SagB, suportando múltiplos providers, persistência, anexos e qualidade neural.

## 2. Escopo e Fronteiras
- **O que faz:** Gerencia a interface de chat, integração com provedores LLM via proxy/serviços e persistência de histórico de conversas.
- **O que não faz:** Não define as permissões de acesso aos providers (isso é feito pela governança) nem orquestra fluxos complexos de agentes (que pertence à orquestração principal).

## 3. Roadmap e Objetivos

### Fase Atual (v1.x)
- Hardening operacional (segurança em renderização de markdown).
- Observabilidade contínua (ncLog).
- Separação progressiva do monólito `SystemicVision`.

### Fase Futura (v2.x)
- Extração completa de lógica de negócio da interface.
- Conformidade visual total aos novos tokens Tailwind.

## 4. Métricas de Sucesso
- 0 regressões em renderização de mensagens de usuários/agentes.
- Tempo de resposta da UI abaixo de 100ms para mensagens locais.
- 100% de logs de erro capturados no formato padrão de observabilidade.
