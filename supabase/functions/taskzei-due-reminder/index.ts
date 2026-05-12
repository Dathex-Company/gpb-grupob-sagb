// supabase/functions/taskzei-due-reminder/index.ts
// Edge Function: Cron job para inserir lembretes de prazo na tabela taskzei_notifications
// Executa a cada 30 minutos. Verifica tarefas com due_date próximo e insere registros
// com scheduled_for = now() para a Netlify Function taskzei-send-notification processar.
//
// Deploy:
//   supabase functions deploy taskzei-due-reminder --no-verify-jwt
// Agendamento (config.toml ou dashboard):
//   [functions.taskzei-due-reminder]
//   schedule = "*/30 * * * *"

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

interface TaskRow {
  id: string;
  workspace_id: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assignee_name: string | null;
  assignee_id: string | null;
}

interface NotificationInsert {
  workspace_id: string;
  task_id: string;
  assignee_id: string | null;
  event_type: string;
  event_subtype: string;
  notification_status: string;
  deduplication_hash: string;
  subject: string;
  body_text: string;
  variables: Record<string, unknown>;
  scheduled_for: string;
}

// Janelas de lembrete: { chave, label, diasAntesDoVencimento }
const REMINDER_WINDOWS = [
  { key: "7d",  label: "Faltam 7 dias",  daysBefore: 7 },
  { key: "3d",  label: "Faltam 3 dias",  daysBefore: 3 },
  { key: "1d",  label: "Faltam 1 dia",   daysBefore: 1 },
  { key: "0d",  label: "Vence hoje",     daysBefore: 0 },
] as const;

async function createDedupHash(taskId: string, windowKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${taskId}:due_reminder:${windowKey}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function formatDate(iso: string | null): string {
  if (!iso) return "Sem data";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

async function buildNotification(
  task: TaskRow,
  windowKey: string,
  dueInDays: number,
): Promise<NotificationInsert> {
  const dedupHash = await createDedupHash(task.id, windowKey);
  const dueDateStr = formatDate(task.due_date);
  const dueLabel =
    dueInDays === 0
      ? "Vence hoje"
      : dueInDays === 1
        ? "Vence amanhã"
        : `Faltam ${dueInDays} dias`;

  const priorityLabel = mapPriority(task.priority);
  const statusLabel = mapStatus(task.status);

  return {
    workspace_id: task.workspace_id,
    task_id: task.id,
    assignee_id: task.assignee_id,
    event_type: "due_reminder",
    event_subtype: `due_reminder:${windowKey}`,
    notification_status: "pending",
    deduplication_hash: dedupHash,
    subject: `⏰ Lembrete: ${task.title} — ${dueLabel}`,
    body_text: `Lembrete: a tarefa "${task.title}" ${dueLabel} (${dueDateStr}). Prioridade: ${priorityLabel}. Status: ${statusLabel}.`,
    variables: {
      task_title: task.title,
      due_date_formatted: dueDateStr,
      due_in_days: dueLabel,
      priority_label: priorityLabel,
      status_label: statusLabel,
    },
    scheduled_for: new Date().toISOString(),
  };
}

function mapPriority(p: string): string {
  switch (p) {
    case "alta": return "Alta";
    case "media": return "Média";
    case "baixa": return "Baixa";
    default: return p;
  }
}

function mapStatus(s: string): string {
  switch (s) {
    case "aberta": return "Aberta";
    case "em_andamento": return "Em andamento";
    case "concluida": return "Concluída";
    case "cancelada": return "Cancelada";
    default: return s;
  }
}

serve(async (_req: Request) => {
  try {
    // Cria cliente Supabase admin com service_role
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const results: { window: string; inserted: number; skipped: number }[] = [];

    for (const window of REMINDER_WINDOWS) {
      // Calcula a data alvo: now + daysBefore (considerando UTC)
      const targetDate = new Date(now);
      targetDate.setUTCDate(targetDate.getUTCDate() + window.daysBefore);

      // Limites: início e fim do dia alvo
      const dayStart = new Date(Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        0, 0, 0, 0,
      ));
      const dayEnd = new Date(Date.UTC(
        targetDate.getUTCFullYear(),
        targetDate.getUTCMonth(),
        targetDate.getUTCDate(),
        23, 59, 59, 999,
      ));

      // Busca tarefas com due_date na janela e não concluídas/canceladas
      const { data: tasks, error: queryError } = await supabase
        .from("taskzei_tasks")
        .select("id, workspace_id, title, status, priority, due_date, assignee_name, assignee_id")
        .gte("due_date", dayStart.toISOString())
        .lte("due_date", dayEnd.toISOString())
        .not("status", "in", '("concluida","cancelada")');

      if (queryError) {
        console.error(`[taskzei-due-reminder] Query error for window ${window.key}:`, queryError);
        continue;
      }

      if (!tasks || tasks.length === 0) {
        results.push({ window: window.key, inserted: 0, skipped: 0 });
        continue;
      }

      let inserted = 0;
      let skipped = 0;

      for (const task of tasks as TaskRow[]) {
        const dedupHash = await createDedupHash(task.id, window.key);

        // Verifica deduplicação: já existe notificação com mesmo hash nas últimas 24h
        const { data: existing } = await supabase
          .from("taskzei_notifications")
          .select("id")
          .eq("deduplication_hash", dedupHash)
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .limit(1);

        if (existing && existing.length > 0) {
          skipped++;
          continue;
        }

        const dueInDays = window.daysBefore;
        const notification = await buildNotification(task, window.key, dueInDays);

        const { error: insertError } = await supabase
          .from("taskzei_notifications")
          .insert(notification);

        if (insertError) {
          console.error(
            `[taskzei-due-reminder] Insert error for task ${task.id}:`,
            insertError,
          );
        } else {
          inserted++;
        }
      }

      results.push({ window: window.key, inserted, skipped });
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: now.toISOString(),
        results,
        totalInserted: results.reduce((sum, r) => sum + r.inserted, 0),
        totalSkipped: results.reduce((sum, r) => sum + r.skipped, 0),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("[taskzei-due-reminder] Unhandled error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
