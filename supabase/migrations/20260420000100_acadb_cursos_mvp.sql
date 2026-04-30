-- AcadB Cursos MVP (interno B2B)
-- Escopo: trilhas, cursos, módulos, aulas, matrículas e progresso

create table if not exists acadb_tracks (
  id text primary key,
  title text not null,
  type text not null check (type in ('trilha', 'programa')),
  description text not null default '',
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists acadb_courses (
  id text primary key,
  track_id text not null references acadb_tracks(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null default '',
  level text not null check (level in ('iniciante', 'intermediario', 'avancado')),
  workload_hours integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists acadb_modules (
  id text primary key,
  course_id text not null references acadb_courses(id) on delete cascade,
  title text not null,
  order_index integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists acadb_lessons (
  id text primary key,
  module_id text not null references acadb_modules(id) on delete cascade,
  title text not null,
  summary text not null default '',
  kind text not null default 'video' check (kind in ('video', 'artigo', 'material')),
  duration_min integer not null default 1,
  video_url text,
  order_index integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists acadb_enrollments (
  id text primary key,
  user_id text not null,
  company_id text not null,
  course_id text not null references acadb_courses(id) on delete cascade,
  enrolled_at timestamptz not null default now()
);

create table if not exists acadb_lesson_progress (
  id text primary key,
  user_id text not null,
  lesson_id text not null references acadb_lessons(id) on delete cascade,
  percent integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  constraint acadb_progress_percent_check check (percent >= 0 and percent <= 100)
);

create unique index if not exists acadb_enrollments_user_course_unique
  on acadb_enrollments(user_id, course_id);

create unique index if not exists acadb_progress_user_lesson_unique
  on acadb_lesson_progress(user_id, lesson_id);

create index if not exists acadb_courses_track_idx on acadb_courses(track_id);
create index if not exists acadb_modules_course_idx on acadb_modules(course_id);
create index if not exists acadb_lessons_module_idx on acadb_lessons(module_id);

