# 🧪 Auditoria — Falhas de Testes do Shell SagB — 12-06-2026

## 📌 Escopo autorizado
Correção mínima fora de central_padroes apenas para os testes do shell SagB que falharam após validação geral.

## 🔴 Falhas registradas
| Teste | Arquivo | Erro | Escopo |
|---|---|---|---|
| programmers room module is wired into the SagB shell | Z:\00_sagb\tests\configuration.test.mjs | Espera `id: 'programmers-room'` no sidebar | Shell SagB |
| missions module is wired into the SagB shell | Z:\00_sagb\tests\configuration.test.mjs | Espera `case 'missions'` no App | Shell SagB |

## 🟡 Diagnóstico inicial
Os testes não apontam falha da Central de Padrões. Eles validam wiring global do shell SagB para módulos externos: programmers-room e missions. A correção deve ser mínima, sem mexer em Supabase, sem alterar secrets, sem refatorar o shell inteiro e sem afetar central_padroes.

## ✅ Regra de intervenção
1. Ler o teste para confirmar strings esperadas.
2. Ler os arquivos do shell citados pelo teste.
3. Adicionar apenas o wiring mínimo que o teste exige.
4. Rodar `npm run test` e `npm run build`.

## 🛡️ Risco
| Item | Classificação |
|---|---|
| Leitura dos testes | R0 |
| Ajuste mínimo de shell | R3 |
| Build/test local | R2 |
| Deploy | Não autorizado |
