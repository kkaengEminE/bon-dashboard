alter table public.projects add column if not exists title text;
alter table public.projects add column if not exists repository_name text;
alter table public.projects add column if not exists repository_url text;
update public.projects set title = coalesce(title, name), repository_name = coalesce(repository_name, name) where title is null or repository_name is null;
