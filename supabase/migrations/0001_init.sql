-- BON Dashboard — 스키마 재구성 (schema reconstruction)
--
-- 이 파일은 삭제된 Supabase DB를 복원한다. src/lib/storage.ts 가 기대하는
-- 테이블/컬럼/RPC/RLS 를 그대로 재생성한다.
--
-- 실행 방법: Supabase Dashboard → SQL Editor 에 전체를 붙여넣고 Run.
-- (재실행 안전: create ... if not exists / create or replace / 정책은 drop 후 재생성)
--
-- 배경: 이 앱은 GitHub Pages 정적 배포이며 서버 런타임이 없다. 브라우저에서
-- 공개 anon 키로 직접 Supabase 를 호출한다. 인증(Supabase Auth)은 없고,
-- 사용자는 브라우저에 저장된 표시 이름(user_name)일 뿐이다. 따라서 RLS 는
-- anon 역할에 전체 접근을 허용한다 (실질적으로 공개 읽기/쓰기 — 기존 설계 그대로).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  tech_spec   text not null default '',
  usage_guide text not null default '',
  status      text not null default 'developing'
              check (status in ('developing', 'testable', 'completed')),
  test_url    text,
  view_count  integer not null default 0,
  like_count  integer not null default 0,
  created_by  text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- comments (self-referential; 한 단계 대댓글은 앱 로직에서 강제)
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  user_name  text not null default '',
  content    text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists comments_project_id_idx on public.comments(project_id);

-- ---------------------------------------------------------------------------
-- likes (프로젝트 x 사용자 당 1개)
-- ---------------------------------------------------------------------------
create table if not exists public.likes (
  id         uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_name  text not null,
  created_at timestamptz not null default now(),
  unique (project_id, user_name)
);
create index if not exists likes_project_id_idx on public.likes(project_id);

-- ---------------------------------------------------------------------------
-- RPC: increment_view_count(p_id) — 상세 진입 시 조회수 +1 (storage.ts:144)
-- ---------------------------------------------------------------------------
create or replace function public.increment_view_count(p_id uuid)
returns void
language sql
as $$
  update public.projects set view_count = view_count + 1 where id = p_id;
$$;

-- ---------------------------------------------------------------------------
-- RLS: 인증 없음 + 공개 anon 키 → anon 역할에 전체 허용
-- ---------------------------------------------------------------------------
alter table public.projects enable row level security;
alter table public.comments enable row level security;
alter table public.likes    enable row level security;

drop policy if exists "anon all projects" on public.projects;
drop policy if exists "anon all comments" on public.comments;
drop policy if exists "anon all likes"    on public.likes;

create policy "anon all projects" on public.projects
  for all to anon using (true) with check (true);
create policy "anon all comments" on public.comments
  for all to anon using (true) with check (true);
create policy "anon all likes" on public.likes
  for all to anon using (true) with check (true);

-- 테이블/함수 접근 권한 (Supabase 기본 grant 를 명시적으로 보강)
grant usage on schema public to anon;
grant all on public.projects, public.comments, public.likes to anon;
grant execute on function public.increment_view_count(uuid) to anon;
