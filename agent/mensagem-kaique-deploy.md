# Mensagem para Kaique Zambram — Deploy pendente

## O que aconteceu

Implementamos o card de **WhatsApp via QR Code (Baileys)** dentro do Hub de Integrações do SagB. O código está completo, compilado e funcional no ambiente local, **mas não apareceu no site publicado**.

## Causa

O branch `main` local está **4 commits à frente do `origin/main`**. O Netlify deploya a partir do remoto (`origin/main`), então o site ainda está servindo a versão **sem o card de QR**.

## Commits que precisam ser enviados

1. `888390d` — chore: commit geral de atualizacoes multi-modulo
2. `2c92a2d` — feat: commit multi-modulo (email OAuth2 refresh, infra whatsapp-qr, etc.)
3. `9e26f69` — feat(hub-integracao): WhatsApp QR Code session management (Baileys)
4. `e665458` — chore: update agent logs (falas_user, session_log)

## O que fazer

```bash
git push origin main
```

Isso enviará os 4 commits para o remoto. O Netlify detectará a mudança automaticamente e iniciará um novo deploy (leva ~2-3 minutos).

## Como verificar se funcionou

1. Após o deploy, acessar o Hub de Integrações (`/hub-integracao`)
2. O card **"WhatsApp via QR Code (Baileys)"** deve aparecer na página inicial, com os botões:
   - **Gerar QR** — inicia a sessão Baileys e exibe o QR Code
   - **Atualizar Status** — consulta estado atual da sessão
   - **Logout** — encerra a sessão ativa
3. Clicar em **Gerar QR** e escanear o código com o WhatsApp do celular

## Observações importantes

- A função serverless `whatsapp-qr` usa armazenamento em `/tmp` (efêmero). A sessão será perdida se a função ficar inativa por alguns minutos ou em novo deploy.
- O QR só funciona em produção com domínio HTTPS (Netlify já provê isso).
- A chave `HUB_WHATSAPP_QR_API_KEY` precisa estar configurada nas variáveis de ambiente do Netlify (já está no `netlify.toml` com placeholder `@@HUB_WHATSAPP_QR_API_KEY@@`).

Qualquer dúvida, me avise.
