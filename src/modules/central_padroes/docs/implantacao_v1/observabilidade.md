# Observabilidade — Central de Padrões V1

## Estado atual

- Erros de carregamento são capturados no hook `useCentralPadroes`.
- Fallback local evita tela vazia quando Supabase não responde.
- Publicador legado mantém feedback visual de save/publish.

## Futuro

- Criar `central_padroes_audit_logs` ou usar núcleo de audit logs do SagB.
- Registrar consulta de agente a padrão canônico.
- Alertar padrão sem owner, módulo sem padrão e dependência crítica.

