# SagB by Loze | Inventário Netlify Functions por domínio

**Etapa:** ET-02  
**Fonte:** pasta `netlify/functions/`  
**Status:** inventário inicial.

---

| Function | Domínio | Módulo relacionado | Status inicial | Observação |
|---|---|---|---|---|
| `ai.mjs` | IA/proxy | Core IA | core | Usada como camada serverless para IA. |
| `api-sagb-audit.mjs` | API/auditoria | API SagB | core | Auditar persistência e autenticação. |
| `api-sagb-router.mjs` | API/router | API SagB | core | Router serverless autocontido. |
| `auth-admin.mjs` | Autenticação/admin | Auth/Supabase | sensível | Requer revisão de permissões e env vars. |
| `cid-apply-prompt-background.mjs` | CID/prompts | CID | parcial | Job background para prompts. |
| `cid-processor.mjs` | CID/processamento | CID | core | Pipeline documental. |
| `cid-search.mjs` | CID/busca | CID/NIC | core | Busca documental. |
| `email-sync-background.ts` | E-mail | Hub Integração/CRM | parcial | Sync assíncrono. Validar runtime TS na Netlify. |
| `email-titan-driver.ts` | E-mail Titan | Hub Integração/CRM | parcial | Integração sensível por credenciais. |
| `governance-sync-doc.mjs` | Governança/docs | Central/Governance | parcial | Precisa documentação de fluxo. |
| `rai-rss-fetch.mjs` | RSS/inteligência externa | RAI | parcial | Coletor externo. |
| `taskzei-send-notification.mjs` | Notificações | TaskZei | parcial/core | Relacionada a notifications. |
| `whatsapp-qr.mjs` | WhatsApp QR | Hub Integração/CRM | parcial | Integração Baileys/QR. |
| `whatsapp-webhook.mjs` | WhatsApp webhook | Hub Integração/CRM | core | Entrada externa sensível. |

## Riscos e recomendações

1. Separar funções por domínio no índice Loze Docs.
2. Documentar variáveis de ambiente obrigatórias por function.
3. Classificar functions sensíveis com checklist de segurança.
4. Validar quais functions estão efetivamente deployadas e chamadas pelo front.
5. Criar matriz function -> tabela Supabase -> módulo consumidor na ET-04.
