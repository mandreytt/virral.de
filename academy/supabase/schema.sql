-- ════════════════════════════════════════════════════════════════════
-- virral Academy – Datenbank-Schema
-- Im Supabase-Dashboard unter "SQL Editor" einfügen und ausführen.
-- ════════════════════════════════════════════════════════════════════

-- ── Profile (1:1 zu auth.users, wird per Trigger angelegt) ───────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'member' check (role in ('member', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper: ist der eingeloggte Nutzer Admin?
create or replace function public.is_admin()
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── Kurse / Module / Lektionen ───────────────────────────────────────
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  cover_url text,
  is_published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  sort int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  description text not null default '',
  bunny_video_id text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ── Zugänge (manuell durch Admin vergeben) ───────────────────────────
create table public.enrollments (
  user_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  granted_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

-- ── Lernfortschritt ──────────────────────────────────────────────────
create table public.lesson_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- Helper: hat der eingeloggte Nutzer Zugriff auf den Kurs?
create or replace function public.has_course_access(p_course_id uuid)
returns boolean
language sql security definer set search_path = public stable
as $$
  select public.is_admin() or exists (
    select 1 from public.enrollments
    where user_id = auth.uid() and course_id = p_course_id
  );
$$;

-- ── Row Level Security ───────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;

-- Profile: eigenes Profil lesen/ändern, Admins sehen & verwalten alle
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- Kurse: veröffentlichte Kurse sieht jeder eingeloggte Nutzer (Katalog),
-- Inhalte (Lektionen) nur mit Zugang. Admins dürfen alles.
create policy "courses_select" on public.courses
  for select using (auth.uid() is not null and (is_published or public.is_admin()));
create policy "courses_admin_write" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

create policy "modules_select" on public.modules
  for select using (public.has_course_access(course_id));
create policy "modules_admin_write" on public.modules
  for all using (public.is_admin()) with check (public.is_admin());

create policy "lessons_select" on public.lessons
  for select using (
    public.has_course_access((select m.course_id from public.modules m where m.id = module_id))
  );
create policy "lessons_admin_write" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- Zugänge: Nutzer sehen die eigenen, Admins verwalten alle
create policy "enrollments_select_own" on public.enrollments
  for select using (user_id = auth.uid() or public.is_admin());
create policy "enrollments_admin_write" on public.enrollments
  for all using (public.is_admin()) with check (public.is_admin());

-- Fortschritt: jeder verwaltet nur den eigenen
create policy "progress_select_own" on public.lesson_progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "progress_insert_own" on public.lesson_progress
  for insert with check (user_id = auth.uid());
create policy "progress_delete_own" on public.lesson_progress
  for delete using (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════════════
-- NACH DER REGISTRIERUNG DEINES EIGENEN ACCOUNTS einmalig ausführen,
-- um dich zum Admin zu machen:
--
--   update public.profiles set role = 'admin' where email = 'andre@virral.de';
-- ════════════════════════════════════════════════════════════════════
