# Automações de Triagem — Central de Padrões ET-05

## Pipeline

Documento bruto → `central_padroes_ingestion_queue` → heurística de área/destino → `central_padroes_triagem` → aceite/reclassificação/ignore.

## Heurísticas

- Caminho contendo `savio` → área `savio`.
- Caminho contendo `pietro` → área `pietro`.
- Título contendo `checklist` → destino `checklist`.
- Título contendo `adr` ou `decisão` → destino `registro`.
- Título contendo `padrão` → destino `padrao`.

## Segurança

Execução deve ocorrer com usuário autenticado. Conteúdo bruto sensível não deve ser enviado para logs.

