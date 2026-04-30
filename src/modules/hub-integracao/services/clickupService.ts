export interface ClickUpCredentials {
  apiToken: string;
  listId: string;
}

export interface ClickUpCreateTaskInput {
  title: string;
  description?: string;
  priority?: 'baixa' | 'media' | 'alta';
  status?: 'aberta' | 'em_andamento' | 'concluida';
  assigneeName?: string;
  dueDate?: string;
}

export interface ClickUpTaskResult {
  id: string;
  url?: string;
  status?: string;
}

const CLICKUP_API_BASE = 'https://api.clickup.com/api/v2';

function mapPriority(priority?: ClickUpCreateTaskInput['priority']): number | undefined {
  if (priority === 'alta') return 1;
  if (priority === 'media') return 2;
  if (priority === 'baixa') return 3;
  return undefined;
}

export class ClickUpDriver {
  async createTask(credentials: ClickUpCredentials, taskData: ClickUpCreateTaskInput): Promise<ClickUpTaskResult> {
    const response = await fetch(`${CLICKUP_API_BASE}/list/${credentials.listId}/task`, {
      method: 'POST',
      headers: {
        Authorization: credentials.apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: taskData.title,
        description: taskData.description || '',
        status: taskData.status,
        priority: mapPriority(taskData.priority),
        due_date: taskData.dueDate ? new Date(taskData.dueDate).getTime() : undefined
      })
    });

    if (!response.ok) {
      const raw = await response.text();
      throw new Error(`ClickUp createTask failed (${response.status}): ${raw}`);
    }

    const result = await response.json() as {
      id: string;
      url?: string;
      status?: { status?: string };
    };

    return {
      id: result.id,
      url: result.url,
      status: result.status?.status
    };
  }

  async healthCheck(credentials: ClickUpCredentials): Promise<boolean> {
    const response = await fetch(`${CLICKUP_API_BASE}/user`, {
      method: 'GET',
      headers: {
        Authorization: credentials.apiToken
      }
    });

    return response.ok;
  }
}

export const clickUpDriver = new ClickUpDriver();
