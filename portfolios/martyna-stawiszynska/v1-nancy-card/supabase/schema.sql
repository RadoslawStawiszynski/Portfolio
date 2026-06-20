-- Schema v1 for NancyM author website

create extension if not exists pgcrypto;

create table if not exists public.author_profile (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  artistic_alias text not null,
  short_bio text not null,
  full_bio text not null,
  location text,
  official_links jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  series text,
  volume text,
  short_description text not null,
  release_date date,
  publisher text,
  isbn text,
  cover_url text,
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  type text not null check (type in ('image', 'video')),
  alt text not null,
  source text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  status text not null check (status in ('draft', 'published')),
  published_at timestamptz,
  cover_media_id uuid references public.media_assets(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mode text not null check (mode in ('light', 'dark')),
  background text not null,
  text text not null,
  accent text not null,
  button text not null,
  archived boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  source_type text not null check (source_type in ('official', 'store', 'media', 'community')),
  confidence text not null check (confidence in ('high', 'medium', 'low')),
  note text not null,
  accessed_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table public.author_profile enable row level security;
alter table public.books enable row level security;
alter table public.media_assets enable row level security;
alter table public.posts enable row level security;
alter table public.themes enable row level security;
alter table public.sources enable row level security;

-- Public read policies
create policy if not exists "public read author_profile"
on public.author_profile for select
using (true);

create policy if not exists "public read books"
on public.books for select
using (true);

create policy if not exists "public read published posts"
on public.posts for select
using (status = 'published');

create policy if not exists "public read active themes"
on public.themes for select
using (active = true and archived = false);

create policy if not exists "public read media"
on public.media_assets for select
using (true);

create policy if not exists "public read sources"
on public.sources for select
using (true);

-- Admin write policies (email whitelist via ADMIN_EMAIL env should also be checked in app logic)
create policy if not exists "authenticated manage author_profile"
on public.author_profile for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "authenticated manage books"
on public.books for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "authenticated manage posts"
on public.posts for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "authenticated manage themes"
on public.themes for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "authenticated manage media"
on public.media_assets for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create policy if not exists "authenticated manage sources"
on public.sources for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- Storage bucket for media uploads.
insert into storage.buckets (id, name, public)
values ('assets', 'assets', true)
on conflict (id) do nothing;

create policy if not exists "public read assets"
on storage.objects for select
using (bucket_id = 'assets');

create policy if not exists "authenticated upload assets"
on storage.objects for insert
with check (bucket_id = 'assets' and auth.role() = 'authenticated');

create policy if not exists "authenticated update assets"
on storage.objects for update
using (bucket_id = 'assets' and auth.role() = 'authenticated')
with check (bucket_id = 'assets' and auth.role() = 'authenticated');

create policy if not exists "authenticated delete assets"
on storage.objects for delete
using (bucket_id = 'assets' and auth.role() = 'authenticated');
