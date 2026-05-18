-- ET D23 — Hierarquia de subtarefas (até 5 níveis no app)

ALTER TABLE public.taskzei_tasks
  ADD COLUMN IF NOT EXISTS parent_task_id UUID NULL REFERENCES public.taskzei_tasks(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_taskzei_tasks_parent_task_id
  ON public.taskzei_tasks(parent_task_id);

