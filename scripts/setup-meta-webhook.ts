#!/usr/bin/env node
/**
 * setup-meta-webhook.ts
 * =============================================================================
 * Script utilitário de configuração do Webhook da Meta (WhatsApp Cloud API)
 * para o ambiente de desenvolvimento do SagB.
 *
 * Uso:
 *   npx tsx scripts/setup-meta-webhook.ts
 *
 * O que faz:
 *   1. Gera um Verify Token aleatório seguro (MOCK_META_VERIFY_TOKEN)
 *   2. Exibe o passo a passo completo para configurar no painel da Meta
 *   3. Atualiza automaticamente .env.local se existir (opcional)
 * =============================================================================
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// ─── Utilitários ────────────────────────────────────────────────────────────

function generateVerifyToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

function generateWhatsAppPhoneNumber(): string {
  // Gera um número de telefone brasileiro fictício (11 9xxxx-xxxx)
  const ddd = String(11 + Math.floor(Math.random() * 20)).padStart(2, '0');
  const prefix = String(9000 + Math.floor(Math.random() * 1000));
  const suffix = String(1000 + Math.floor(Math.random() * 9000));
  return `55${ddd}9${prefix}${suffix}`;
}

// ─── Passo a passo ──────────────────────────────────────────────────────────

function printStepByStep(token: string, phoneNumber: string): void {
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const yellow = '\x1b[33m';
  const red = '\x1b[31m';
  const bold = '\x1b[1m';
  const reset = '\x1b[0m';

  console.log(`
${'='.repeat(70)}
${green}${bold}   SAGB — SETUP DO WEBHOOK WHATSAPP (META CLOUD API)${reset}
${'='.repeat(70)}

${cyan}${bold}✓ Verify Token gerado com segurança via crypto.randomBytes${reset}

  ${bold}MOCK_META_VERIFY_TOKEN=${yellow}${token}${reset}

${cyan}${bold}✓ Número de telefone simulado para teste:${reset}
  ${bold}${phoneNumber}${reset}

${'='.repeat(70)}
${bold}📋 PASSO A PASSO — Configurar Webhook no Painel da Meta${reset}
${'='.repeat(70)}

${bold}1. Acesse o Meta for Developers${reset}
   ➜  https://developers.facebook.com/

${bold}2. Selecione seu App${reset}
   ➜  Vá em "My Apps" e selecione o app da WhatsApp Cloud API
   (Se não tiver um app, crie um novo com o produto "WhatsApp")

${bold}3. Configure o Webhook no produto WhatsApp${reset}
   ➜  No menu lateral: WhatsApp > Configuration
   ➜  Na seção "Webhook", clique em "Edit"

${bold}4. Preencha os campos:${reset}
   ┌─────────────────────────────────────────────────────────────┐
   │  ${bold}Callback URL:${reset}                                        │
   │  https://sagb.netlify.app/.netlify/functions/whatsapp-webhook │
   │                                                             │
   │  ${bold}Verify Token:${reset}                                          │
   │  ${yellow}${token}${reset}                   │
   └─────────────────────────────────────────────────────────────┘

${bold}5. Clique em "Verify and Save"${reset}
   ➜  A Meta enviará uma requisição GET para o callback URL
   ➜  Nossa função verifica: hub.mode === 'subscribe' &&
       hub.verify_token === MOCK_META_VERIFY_TOKEN
   ➜  Se válido, retorna hub.challenge — a Meta confirma a assinatura

${bold}6. Inscreva-se nos eventos (Webhook Fields):${reset}
   ☑  messages                   — Mensagens recebidas
   ☑  message_deliveries         — Relatórios de entrega
   ☑  message_reads              — Confirmações de leitura
   ☑  message_echoes             — Eco de mensagens enviadas
   (Opcional) message_template_status_update — Status de templates)

${bold}7. Teste o fluxo completo:${reset}
   ➜  Envie uma mensagem do seu WhatsApp pessoal para o número
       de teste conectado ao WABA
   ➜  Verifique os logs em:
       https://sagb.netlify.app/.netlify/functions/whatsapp-webhook
   ➜  A mensagem será processada e armazenada no Hub

${'='.repeat(70)}
${bold}🔧 VARIÁVEIS DE AMBIENTE NECESSÁRIAS (adicione ao .env.local)${reset}
${'='.repeat(70)}

  # Meta WhatsApp Cloud API
  VITE_HUB_WABA_ACCESS_TOKEN=${bold}<seu-access-token>${reset}
  VITE_HUB_WABA_PHONE_NUMBER_ID=${bold}<seu-phone-number-id>${reset}
  VITE_HUB_WABA_VERIFY_TOKEN=${yellow}${token}${reset}
  MOCK_META_VERIFY_TOKEN=${yellow}${token}${reset}

${'='.repeat(70)}
${bold}📌 ESTRUTURA DO DATA FLOW${reset}
${'='.repeat(70)}

  ┌──────────────┐     ┌──────────────────────┐     ┌─────────────────┐
  │  Meta Cloud  │────▶│  whatsapp-webhook.mjs │────▶│  Hub Integration │
  │  API (v20.0) │     │  (Netlify Function)   │     │  Service         │
  └──────────────┘     └──────────────────────┘     └────────┬────────┘
                                                             │
                    ┌────────────────────────────────────────┼──────────┐
                    │                                        │          │
                    ▼                                        ▼          │
           ┌──────────────┐                        ┌──────────────┐    │
           │  localStorage │                        │  Supabase    │    │
           │  (dev/mock)   │                        │  (produção)  │    │
           └──────────────┘                        └──────────────┘    │
                    │                                        │          │
                    ▼                                        ▼          │
           ┌─────────────────────────────────────────────────────┐      │
           │           window.dispatchEvent                      │      │
           │    ('hub:inbound-message', { detail: message })      │      │
           └─────────────────────────────────────────────────────┘      │
                    │                                                    │
                    ▼                                                    │
           ┌──────────────┐                                              │
           │   Taskzei    │◀─────────────────────────────────────────────┘
           │  Inbox       │   (ouvia o evento ou consulta via
           │  Inteligente │    integrationHub.getInboxMessages())
           └──────────────┘
                    │
                    ▼
           ┌──────────────┐
           │  CRM Ziplia  │
           │  (WhatsApp)  │
           └──────────────┘

${'='.repeat(70)}
${bold}⚠️  INFORMAÇÕES IMPORTANTES${reset}
${'='.repeat(70)}

  • O Verify Token é gerado com crypto.randomBytes (32 bytes hex = 64 chars)
  • Guarde-o em local seguro — você precisará dele no .env.local
  • O webhook da Meta exige HTTPS. Netlify Functions já fornece.
  • Para testar localmente: use 'netlify dev' ou ngrok
  • Em produção, troque a URL para seu domínio real

${green}${bold}✅ Script concluído com sucesso!${reset}
`);
}

// ─── Auto-update .env.local (opcional) ──────────────────────────────────────

function tryUpdateEnvFile(token: string): void {
  const envPath = path.resolve(process.cwd(), '.env.local');
  const key = 'MOCK_META_VERIFY_TOKEN';

  try {
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf-8');
      const regex = new RegExp(`^${key}=.*`, 'm');
      if (regex.test(content)) {
        content = content.replace(regex, `${key}=${token}`);
        console.log(`  ✔ ${key} atualizado em .env.local`);
      } else {
        content += `\n${key}=${token}\n`;
        console.log(`  ✔ ${key} adicionado ao .env.local`);
      }
    } else {
      content = `${key}=${token}\n`;
      console.log(`  ✔ .env.local criado com ${key}`);
    }
    fs.writeFileSync(envPath, content, 'utf-8');
  } catch {
    console.log(`  ℹ️  Não foi possível atualizar .env.local (ignorado)`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  const token = process.env.MOCK_META_VERIFY_TOKEN || generateVerifyToken();
  const phoneNumber = generateWhatsAppPhoneNumber();

  printStepByStep(token, phoneNumber);
  tryUpdateEnvFile(token);

  // Salva o token em um arquivo para referência (opcional)
  const outPath = path.resolve(process.cwd(), 'scripts/.verify-token');
  try {
    fs.writeFileSync(outPath, token, 'utf-8');
  } catch {
    // ignorado
  }
}

main();
