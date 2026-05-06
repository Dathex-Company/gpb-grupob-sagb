import nodemailer from 'nodemailer';
import imaps from 'imap-simple';
import { simpleParser } from 'mailparser';

const json = (statusCode: number, payload: any) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const route = event.path || '';
  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Invalid JSON body' });
  }

  const { credentials, action, payload } = body;

  if (!credentials || !credentials.email || !credentials.password) {
    return json(400, { ok: false, error: 'Missing Titan credentials (email/password)' });
  }

  // Configurações Titan Mail
  const IMAP_CONFIG = {
    imap: {
      user: credentials.email,
      password: credentials.password,
      host: 'imap.titan.email',
      port: 993,
      tls: true,
      authTimeout: 3000,
    }
  };

  const SMTP_CONFIG = {
    host: 'smtp.titan.email',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: credentials.email,
      pass: credentials.password,
    },
  };

  try {
    if (action === 'health') {
      // Test IMAP Connection
      const connection = await imaps.connect(IMAP_CONFIG);
      connection.end();
      return json(200, { ok: true, status: 'healthy' });
    }

    if (action === 'send') {
      const { to, cc, bcc, subject, textBody, htmlBody, replyTo } = payload;
      
      let transporter = nodemailer.createTransport(SMTP_CONFIG);

      let info = await transporter.sendMail({
        from: credentials.email,
        to: to ? to.join(', ') : undefined,
        cc: cc ? cc.join(', ') : undefined,
        bcc: bcc ? bcc.join(', ') : undefined,
        replyTo: replyTo,
        subject: subject,
        text: textBody,
        html: htmlBody,
      });

      return json(200, { 
        ok: true, 
        messageId: info.messageId,
        acceptedAt: new Date().toISOString()
      });
    }

    if (action === 'sync') {
      const connection = await imaps.connect(IMAP_CONFIG);
      await connection.openBox('INBOX');

      // Busca mensagens (ex: últimas 24h ou não lidas)
      // Para simplificar no serverless, vamos buscar as não lidas mais recentes (limitado a 20)
      const searchCriteria = ['UNSEEN'];
      const fetchOptions = {
        bodies: ['HEADER', 'TEXT', ''],
        struct: true,
        markSeen: false // Não marca como lido automaticamente
      };

      const results = await connection.search(searchCriteria, fetchOptions);
      const messagesToProcess = results.slice(-20).reverse(); // Pega as 20 mais recentes

      const parsedMessages = await Promise.all(messagesToProcess.map(async (res) => {
        const all = res.parts.find((part) => part.which === '');
        const id = res.attributes.uid;
        
        if (!all) return null;

        try {
          const parsed = await simpleParser(all.body);
          
          return {
            id: String(id),
            externalMessageId: parsed.messageId || String(id),
            from: parsed.from?.text || '',
            to: parsed.to?.text ? [parsed.to.text] : [],
            subject: parsed.subject || '',
            snippet: parsed.text ? parsed.text.substring(0, 100) : '',
            receivedAt: parsed.date ? parsed.date.toISOString() : new Date().toISOString()
          };
        } catch (e) {
          console.error('[Titan Sync] Error parsing email', e);
          return null;
        }
      }));

      connection.end();

      return json(200, {
        ok: true,
        messages: parsedMessages.filter(Boolean)
      });
    }

    return json(400, { ok: false, error: 'Invalid action' });

  } catch (error: any) {
    console.error('[Titan Serverless Error]', error);
    return json(500, { ok: false, error: error.message || 'Internal Server Error' });
  }
}
