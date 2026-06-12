# Integrações — Central de Padrões ET-02

## Buckets previstos

- `central-padroes-documents`: documentos normativos e brutos.
- `central-padroes-evidence`: evidências de auditoria.
- `central-padroes-templates`: templates reutilizáveis.

## RPCs

- `central_padroes_ingest_document`: cria item na fila de ingestão e triagem.
- `central_padroes_sync_governance`: placeholder seguro para sincronização futura com `governance_rules`.

## Política de segurança

Buckets devem ser privados. Leitura e escrita apenas para usuários autenticados e futuramente refinada por owner/admin.

