# Cadastro de Empresas — Semântica Oficial (ET 02)

## 1) Entidade principal oficial

- **Empresa** é a entidade principal oficial do módulo.
- No código canônico, a entidade é representada por `EmpresaCadastro` (alias `Empresa`) em:
  - `src/modules/cadastro-empresas/types/empresa.types.ts`

## 2) Classificações oficiais (não são entidade principal)

- `tipo`: `MARCA | PROJETO | UNIDADE_NEGOCIO | OUTRO`
- `status`: `IDEIA | DESENVOLVIMENTO | APROVADA | ATIVA | INATIVA`
- `esfera`: `GRUPOB | MERCADO | INTERNA | NAO_DEFINIDA`

## 3) Termos legados aceitos temporariamente

Estes termos/campos ainda são aceitos **somente por compatibilidade**:

- `venture` / `ventures`
- `business unit`
- campos legados de payload: `name`, `type`, `sphere`, `segment`, `niche`, `statusLab`, `logo`, `logo_url`, `url`

Mapeamento e rastreabilidade estão em:

- `services/empresaMapper.ts`
  - `normalizeEmpresa`
  - `normalizeEmpresas`
  - `toLegacyVentureCompat`

## 4) Campos-base oficiais da empresa

- `id`
- `nome`
- `nomeCurto?`
- `slug?`
- `status`
- `tipo`
- `esfera`
- `segmento?`
- `nicho?`
- `logoUrl`
- `descricaoCurta?`
- `siteUrl?`
- `createdAt`
- `updatedAt`
- `timestamp` (legado transitório para ordenação/compatibilidade)
- `camposAuxiliares?` (uso estritamente cadastral)

## 5) UI oficial

A interface principal do módulo adota **Empresa** como linguagem principal.
Termos legados não devem aparecer como nomenclatura dominante da UI.

## 6) Pendências para migração futura (banco)

1. Migrar coleção/tabela legada `ventures` para contrato canônico de Empresa.
2. Remover dependência de campos legados duplicados (`name`/`nome`, `type`/`tipo`, etc.).
3. Eliminar `timestamp` quando `createdAt`/`updatedAt` estiverem totalmente consolidados.
4. Revisar integrações externas que ainda dependem de `Venture` como tipo principal.

## 7) Separação de contexto

Esta padronização mantém o escopo do módulo **Cadastro de Empresas** separado do contexto amplo do ecossistema GrupoB.
O módulo recebe dados por bridge de runtime, mas mantém seu modelo canônico próprio e explícito.
