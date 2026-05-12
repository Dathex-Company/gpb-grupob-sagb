// netlify/functions/taskzei-send-notification.mjs
// Função server‑side para envio transacional de notificações TaskZei
// Integração com provedor de e‑mail (Resend/SendGrid) e rastreabilidade completa no Supabase

import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

// Configuração do provedor de e‑mail (Resend como padrão)
const EMAIL_PROVIDER = process.env.TASKZEI_EMAIL_PROVIDER || 'resend';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.TASKZEI_FROM_EMAIL || 'notificacoes@taskzei.3forb.com';
const FROM_NAME = process.env.TASKZEI_FROM_NAME || 'TaskZei | 3forB';

// Configuração de Push (OneSignal) — opcional, push é oportunista
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

// Templates padrão por tipo de evento
const DEFAULT_TEMPLATES = {
  task_created: {
    subject: '📋 Nova tarefa atribuída: {{task_title}}',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8ecf1; border-radius: 12px; background: #fcfcfd;">
        <h2 style="color: #2d3748; margin-bottom: 8px;">📋 Nova tarefa atribuída</h2>
        <p style="color: #4a5568; margin-bottom: 24px;">Você foi designado(a) como responsável por uma nova tarefa no TaskZei.</p>
        
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 12px;">{{task_title}}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; width: 120px;">Prioridade:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: {{priority_color}}; color: white;">
                  {{priority_label}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Status:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{status_label}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Vencimento:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{due_date_formatted}}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #4a5568; margin-bottom: 24px;">
          Acesse o TaskZei para visualizar detalhes, adicionar checklist e acompanhar o progresso.
        </p>
        
        <a href="{{task_url}}" style="display: inline-block; background: #4299e1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          👉 Ver tarefa no TaskZei
        </a>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #a0aec0; font-size: 14px;">
          Esta é uma notificação automática do módulo TaskZei. Caso não deva ser o responsável, entre em contato com o gestor do workspace.
        </p>
      </div>
    `,
    text: `Nova tarefa atribuída: {{task_title}}
Prioridade: {{priority_label}}
Status: {{status_label}}
Vencimento: {{due_date_formatted}}
Acesse: {{task_url}}`
  },
  status_changed: {
    subject: '🔄 Status atualizado: {{task_title}}',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8ecf1; border-radius: 12px; background: #fcfcfd;">
        <h2 style="color: #2d3748; margin-bottom: 8px;">🔄 Status da tarefa atualizado</h2>
        <p style="color: #4a5568; margin-bottom: 24px;">A tarefa "{{task_title}}" teve seu status alterado.</p>
        
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 12px;">{{task_title}}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; width: 120px;">Status anterior:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{previous_status}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Novo status:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">
                <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; background: {{new_status_color}}; color: white;">
                  {{new_status}}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Atualizado por:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{updated_by}}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #4a5568; margin-bottom: 24px;">
          Acompanhe o progresso da tarefa no TaskZei.
        </p>
        
        <a href="{{task_url}}" style="display: inline-block; background: #4299e1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          👉 Ver tarefa no TaskZei
        </a>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #a0aec0; font-size: 14px;">
          Esta é uma notificação automática do módulo TaskZei.
        </p>
      </div>
    `,
    text: `Status da tarefa atualizado: {{task_title}}
Status anterior: {{previous_status}}
Novo status: {{new_status}}
Atualizado por: {{updated_by}}
Acesse: {{task_url}}`
  },
  due_reminder: {
    subject: '⏰ Lembrete de vencimento: {{task_title}}',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e8ecf1; border-radius: 12px; background: #fcfcfd;">
        <h2 style="color: #2d3748; margin-bottom: 8px;">⏰ Lembrete de vencimento</h2>
        <p style="color: #4a5568; margin-bottom: 24px;">A tarefa "{{task_title}}" está próxima do prazo de entrega.</p>
        
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-top: 0; margin-bottom: 12px;">{{task_title}}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #718096; width: 120px;">Vencimento:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">
                <strong>{{due_date_formatted}}</strong> ({{due_in_days}})
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Prioridade:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{priority_label}}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #718096;">Status atual:</td>
              <td style="padding: 8px 0; color: #2d3748; font-weight: 500;">{{status_label}}</td>
            </tr>
          </table>
        </div>
        
        <p style="color: #4a5568; margin-bottom: 24px;">
          Certifique‑se de atualizar o status ou negociar uma nova data se necessário.
        </p>
        
        <a href="{{task_url}}" style="display: inline-block; background: #4299e1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500;">
          👉 Ver tarefa no TaskZei
        </a>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #a0aec0; font-size: 14px;">
          Esta é uma notificação automática do módulo TaskZei. Você receberá apenas um lembrete por janela de vencimento.
        </p>
      </div>
    `,
    text: `Lembrete de vencimento: {{task_title}}
Vencimento: {{due_date_formatted}} ({{due_in_days}})
Prioridade: {{priority_label}}
Status: {{status_label}}
Acesse: {{task_url}}`
  }
};

// Utilitários
const pickFirst = (...values) => values.find((value) => String(value || '').trim()) || '';
const normalizeEmail = (value) => String(value || '').trim().toLowerCase();
const hashDeduplication = (taskId, eventType, window = 'default') =>
  crypto.createHash('sha256').update(`${taskId}|${eventType}|${window}`).digest('hex');

const jsonResponse = (statusCode, data) => ({
  statusCode,
  headers: {
    'Content‑Type': 'application/json',
    'Cache‑Control': 'no‑store, no‑cache, must‑revalidate, proxy‑revalidate',
    Pragma: 'no‑cache',
    Expires: '0'
  },
  body: JSON.stringify(data)
});

const resolveSupabaseConfig = () => {
  const supabaseUrl = pickFirst(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_URL);
  const supabaseServiceKey = pickFirst(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SERVICE_KEY,
    process.env.SUPABASE_SECRET_KEY
  );
  const supabaseAnonKey = pickFirst(process.env.VITE_SUPABASE_ANON_KEY, process.env.SUPABASE_ANON_KEY);
  return { supabaseUrl, supabaseServiceKey, supabaseAnonKey };
};

const failIfMisconfigured = (cfg) => {
  const missing = [];
  if (!cfg.supabaseUrl) missing.push('VITE_SUPABASE_URL (ou SUPABASE_URL)');
  if (!cfg.supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
  if (!cfg.supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  if (EMAIL_PROVIDER === 'resend' && !RESEND_API_KEY) missing.push('RESEND_API_KEY');
  if (EMAIL_PROVIDER === 'sendgrid' && !SENDGRID_API_KEY) missing.push('SENDGRID_API_KEY');
  if (!FROM_EMAIL) missing.push('TASKZEI_FROM_EMAIL');

  if (missing.length) {
    console.error('[taskzei‑send‑notification] Missing environment variables:', missing.join(', '));
    return jsonResponse(500, {
      success: false,
      error: 'Environment variables missing',
      missing
    });
  }
  return null;
};

// Resolução de destinatário: assigneeId → users.email
const resolveAssigneeEmail = async (supabaseAdmin, assigneeId) => {
  if (!assigneeId) return { email: null, reason: 'assignee_id_missing' };

  try {
    const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(assigneeId);
    if (error || !userData?.user) {
      return { email: null, reason: 'user_not_found' };
    }
    const email = normalizeEmail(userData.user.email);
    if (!email) return { email: null, reason: 'email_missing_in_user' };
    return { email, reason: null };
  } catch (err) {
    console.error('[taskzei‑send‑notification] Error resolving assignee email:', err);
    return { email: null, reason: 'resolution_error' };
  }
};

// Renderização de template com variáveis
const renderTemplate = (template, variables) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value || '');
  }
  // Limpar placeholders não substituídos
  result = result.replace(/{{\w+}}/g, '');
  return result;
};

// Envio via Resend
const sendViaResend = async (toEmail, subject, html, text) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content‑Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [toEmail],
      subject,
      html,
      text
    })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Resend error: ${data.message || res.statusText}`);
  }
  return { messageId: data.id, provider: 'resend', raw: data };
};

// Envio via SendGrid
const sendViaSendGrid = async (toEmail, subject, html, text) => {
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content‑Type': 'application/json',
      Authorization: `Bearer ${SENDGRID_API_KEY}`
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: toEmail }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html }
      ]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }
  const headers = Object.fromEntries(res.headers.entries());
  return { messageId: headers['x‑message‑id'], provider: 'sendgrid', raw: { headers } };
};

// Envio via OneSignal Push (oportunista — não falha se não configurado)
const sendViaOneSignal = async (supabaseAdmin, toUserId, subject, body, data = {}) => {
  if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
    return { skipped: true, reason: 'onesignal_not_configured' };
  }

  // Buscar device tokens do usuário
  const { data: devices, error } = await supabaseAdmin
    .from('taskzei_push_devices')
    .select('device_token, platform')
    .eq('user_id', toUserId);

  if (error) {
    console.error('[taskzei-send-notification] Error fetching push devices:', error);
    return { skipped: true, reason: 'device_query_error' };
  }

  if (!devices || devices.length === 0) {
    return { skipped: true, reason: 'no_device_tokens' };
  }

  const playerIds = devices.map((d) => d.device_token);

  const payload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: playerIds,
    headings: { en: subject },
    contents: { en: body },
    subtitle: { en: '' },
    data,
    ios_badgeType: 'Increase',
    ios_badgeCount: 1,
    priority: 10
  };

  const res = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  const result = await res.json();
  if (!res.ok) {
    console.error('[taskzei-send-notification] OneSignal error:', result);
    return { skipped: true, reason: `onesignal_error:${result.errors?.[0] || res.statusText}`, raw: result };
  }

  return { sent: true, onesignalId: result.id, recipients: result.recipients, raw: result };
};

// Atualização do registro de notificação no Supabase
const updateNotificationRecord = async (supabaseAdmin, notificationId, updates) => {
  const { error } = await supabaseAdmin
    .from('taskzei_notifications')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', notificationId);

  if (error) {
    console.error('[taskzei‑send‑notification] Failed to update notification record:', error);
    throw error;
  }
};

// Processamento principal de uma notificação
const processNotification = async (supabaseAdmin, notification) => {
  const {
    id,
    task_id,
    assignee_id,
    event_type,
    template_key,
    variables,
    deduplication_hash,
    scheduled_for
  } = notification;

  // 1. Verificar se já foi processada/duplicada
  if (deduplication_hash) {
    const { data: existing } = await supabaseAdmin
      .from('taskzei_notifications')
      .select('id, notification_status')
      .eq('deduplication_hash', deduplication_hash)
      .not('notification_status', 'in', '(pending,failed)')
      .limit(1);

    if (existing?.length > 0) {
      await updateNotificationRecord(supabaseAdmin, id, {
        notification_status: 'skipped',
        failure_reason: 'duplicated_notification',
        processed_at: new Date().toISOString()
      });
      return { skipped: true, reason: 'duplicated_notification' };
    }
  }

  // 2. Resolver e-mail do responsável
  // Se overrideEmail foi fornecido (ex: test mode), usar diretamente
  const overrideEmail = notification.overrideEmail || null;
  let assigneeEmail = null;
  let assigneeReason = null;

  if (overrideEmail) {
    assigneeEmail = normalizeEmail(overrideEmail);
  } else {
    const resolved = await resolveAssigneeEmail(supabaseAdmin, assignee_id);
    assigneeEmail = resolved.email;
    assigneeReason = resolved.reason;
  }

  if (!assigneeEmail) {
    await updateNotificationRecord(supabaseAdmin, id, {
      notification_status: 'failed',
      failure_reason: `assignee_email_unresolved:${assigneeReason || 'unknown'}`,
      processed_at: new Date().toISOString()
    });
    return { skipped: true, reason: `assignee_email_unresolved:${assigneeReason || 'unknown'}` };
  }

  // 3. Preparar template
  const template = DEFAULT_TEMPLATES[template_key] || DEFAULT_TEMPLATES[event_type] || DEFAULT_TEMPLATES.task_created;
  const templateVars = {
    task_id,
    event_type,
    scheduled_for,
    ...(variables || {})
  };

  const subject = renderTemplate(template.subject, templateVars);
  const html = renderTemplate(template.html, templateVars);
  const text = renderTemplate(template.text, templateVars);

  // 4. Marcar processamento e enviar
  await updateNotificationRecord(supabaseAdmin, id, {
    notification_status: 'processing'
  });

  const sendResult = EMAIL_PROVIDER === 'sendgrid'
    ? await sendViaSendGrid(assigneeEmail, subject, html, text)
    : await sendViaResend(assigneeEmail, subject, html, text);

  // 5. Salvar sucesso
  await updateNotificationRecord(supabaseAdmin, id, {
    notification_status: 'sent',
    provider: sendResult.provider,
    provider_message_id: sendResult.messageId || null,
    delivered_to: assigneeEmail,
    processed_at: new Date().toISOString(),
    failure_reason: null
  });

  // 6. Enviar push notification (oportunista — não falha se não configurado)
  let pushResult = null;
  try {
    pushResult = await sendViaOneSignal(supabaseAdmin, assignee_id, subject, text, {
      task_id,
      event_type,
      url: templateVars.task_url || ''
    });
  } catch (pushErr) {
    console.error('[taskzei-send-notification] Push error (non-fatal):', pushErr);
    pushResult = { skipped: true, reason: 'push_exception' };
  }

  // Se push foi enviado, atualizar provider_response com metadados do push
  if (pushResult?.sent) {
    try {
      await updateNotificationRecord(supabaseAdmin, id, {
        provider_response: { push: { sent: true, onesignalId: pushResult.onesignalId, recipients: pushResult.recipients } }
      });
    } catch (updateErr) {
      console.error('[taskzei-send-notification] Failed to persist push metadata (non-fatal):', updateErr);
    }
  }

  return {
    sent: true,
    provider: sendResult.provider,
    messageId: sendResult.messageId || null,
    push: pushResult
  };
};

const fetchPendingNotifications = async (supabaseAdmin, batchSize = 25) => {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAdmin
    .from('taskzei_notifications')
    .select('*')
    .in('notification_status', ['pending', 'failed'])
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(batchSize);

  if (error) {
    throw error;
  }

  return data || [];
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  }

  try {
    const cfg = resolveSupabaseConfig();
    const misconfigured = failIfMisconfigured(cfg);
    if (misconfigured) return misconfigured;

    const supabaseAdmin = createClient(cfg.supabaseUrl, cfg.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const payload = event.body ? JSON.parse(event.body) : {};

    // Modo de criação de notificação (chamado pelo frontend)
    // Se o payload contém eventType, cria uma notificação no banco e processa
    if (payload.eventType) {
      const now = new Date().toISOString();
      const testMode = !payload.taskId || payload.taskId.startsWith('test-');

      const notificationId = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      const { data: inserted, error: insertError } = await supabaseAdmin
        .from('taskzei_notifications')
        .insert({
          id: notificationId,
          workspace_id: payload.workspaceId || 'default',
          task_id: payload.taskId || `synthetic-${Date.now()}`,
          assignee_id: payload.assigneeId || null,
          assignee_email: payload.overrideEmail || null,
          event_type: payload.eventType,
          template_key: payload.templateKey || payload.eventType,
          notification_status: 'pending',
          variables: payload.variables || {},
          scheduled_for: payload.scheduledFor || now,
          deduplication_hash: testMode
            ? `test-${Date.now()}`
            : hashDeduplication(payload.taskId, payload.eventType, payload.deduplicationWindow || 'default')
        })
        .select()
        .single();

      if (insertError) {
        console.error('[taskzei-send-notification] Failed to insert notification:', insertError);
        return jsonResponse(500, { success: false, error: 'Failed to create notification record' });
      }

      // Se há override de email, processa com email personalizado
      try {
        const result = await processNotification(supabaseAdmin, {
          ...inserted,
          overrideEmail: payload.overrideEmail || null
        });
        return jsonResponse(200, {
          success: result?.sent || false,
          testMode,
          notificationId: inserted.id,
          eventType: payload.eventType,
          result
        });
      } catch (procErr) {
        console.error('[taskzei-send-notification] Processing error:', procErr);
        try {
          await updateNotificationRecord(supabaseAdmin, notificationId, {
            notification_status: 'failed',
            failure_reason: String(procErr?.message || procErr || 'processing_error'),
            processed_at: new Date().toISOString()
          });
        } catch (_) { /* ignore */ }
        return jsonResponse(200, {
          success: false,
          testMode,
          notificationId: inserted.id,
          error: String(procErr?.message || procErr || 'processing_error')
        });
      }
    }

    // Modo batch padrão: processa notificações pendentes
    const batchSize = Number(payload.batchSize || 25);

    const pending = await fetchPendingNotifications(supabaseAdmin, batchSize);
    if (!pending.length) {
      return jsonResponse(200, {
        success: true,
        processed: 0,
        sent: 0,
        skipped: 0,
        failed: 0,
        message: 'No pending notifications'
      });
    }

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const notification of pending) {
      try {
        const result = await processNotification(supabaseAdmin, notification);
        if (result?.sent) sent += 1;
        else skipped += 1;
      } catch (err) {
        failed += 1;
        console.error('[taskzei-send-notification] processing error:', err);
        try {
          await updateNotificationRecord(supabaseAdmin, notification.id, {
            notification_status: 'failed',
            failure_reason: String(err?.message || err || 'unknown_error'),
            processed_at: new Date().toISOString()
          });
        } catch (persistErr) {
          console.error('[taskzei-send-notification] failed to persist failure state:', persistErr);
        }
      }
    }

    return jsonResponse(200, {
      success: true,
      processed: pending.length,
      sent,
      skipped,
      failed
    });
  } catch (err) {
    console.error('[taskzei-send-notification] fatal error:', err);
    return jsonResponse(500, {
      success: false,
      error: String(err?.message || err || 'internal_error')
    });
  }
};
