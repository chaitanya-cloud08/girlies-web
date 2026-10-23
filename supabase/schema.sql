-- ============================================================
--  Chaitanya's Girlies — database schema
--  Run this once in Supabase → SQL Editor → New query → Run
-- ============================================================

-- ---------- Profiles (one per login) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  slug text unique,                       -- e.g. 'shruti' (null for admin)
  display_name text not null,
  role text not null check (role in ('girl', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
drop policy if exists "read own or admin" on public.profiles;
create policy "read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- ---------- Photos ----------
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles on delete cascade,
  storage_path text not null,
  caption text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.photos enable row level security;
drop policy if exists "photos read" on public.photos;
create policy "photos read" on public.photos
  for select using (owner = auth.uid() or public.is_admin());
drop policy if exists "photos admin write" on public.photos;
create policy "photos admin write" on public.photos
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- Secret letters ----------
-- Girls can NOT read this table directly. They go through my_letters(),
-- which only returns a letter's content once its unlock time has passed.
create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles on delete cascade,
  title text not null,
  label text,
  unlock_at timestamptz not null,
  content text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.letters enable row level security;
drop policy if exists "letters admin only" on public.letters;
create policy "letters admin only" on public.letters
  for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.my_letters()
returns table (id uuid, title text, label text, unlock_at timestamptz, is_unlocked boolean, content text)
language sql stable security definer set search_path = public
as $$
  select l.id, l.title, l.label, l.unlock_at,
         now() >= l.unlock_at as is_unlocked,
         case when now() >= l.unlock_at then l.content else null end as content
  from public.letters l
  where l.owner = auth.uid()
  order by l.sort, l.unlock_at;
$$;
revoke all on function public.my_letters() from public, anon;
grant execute on function public.my_letters() to authenticated;

-- ---------- Daily compliment diary ----------
create table if not exists public.compliment_log (
  owner uuid not null references public.profiles on delete cascade,
  day date not null,
  text text not null,
  created_at timestamptz not null default now(),
  primary key (owner, day)
);
alter table public.compliment_log enable row level security;
drop policy if exists "log read" on public.compliment_log;
create policy "log read" on public.compliment_log
  for select using (owner = auth.uid() or public.is_admin());
drop policy if exists "log insert own" on public.compliment_log;
create policy "log insert own" on public.compliment_log
  for insert with check (owner = auth.uid());

-- ---------- Bouquets for Chaitanya (one per girl, forever) ----------
create table if not exists public.bouquets (
  id uuid primary key default gen_random_uuid(),
  sender uuid not null unique references public.profiles on delete cascade,
  flowers jsonb not null,
  wrap text not null,
  ribbon text not null,
  note text,
  created_at timestamptz not null default now()
);
alter table public.bouquets enable row level security;
drop policy if exists "bouquet read" on public.bouquets;
create policy "bouquet read" on public.bouquets
  for select using (sender = auth.uid() or public.is_admin());
drop policy if exists "bouquet send once" on public.bouquets;
create policy "bouquet send once" on public.bouquets
  for insert with check (sender = auth.uid() and not public.is_admin());

-- ---------- Photo storage (private bucket) ----------
insert into storage.buckets (id, name, public)
values ('photos', 'photos', false)
on conflict (id) do nothing;

drop policy if exists "photos bucket read" on storage.objects;
create policy "photos bucket read" on storage.objects
  for select using (
    bucket_id = 'photos'
    and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text)
  );
drop policy if exists "photos bucket admin insert" on storage.objects;
create policy "photos bucket admin insert" on storage.objects
  for insert with check (bucket_id = 'photos' and public.is_admin());
drop policy if exists "photos bucket admin delete" on storage.objects;
create policy "photos bucket admin delete" on storage.objects
  for delete using (bucket_id = 'photos' and public.is_admin());

-- ---------- Mini-game endings (e.g. "Case Study: Love") ----------
create table if not exists public.book_endings (
  owner uuid not null references public.profiles on delete cascade,
  ending_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (owner, ending_id)
);
alter table public.book_endings enable row level security;
drop policy if exists "book endings read" on public.book_endings;
create policy "book endings read" on public.book_endings
  for select using (owner = auth.uid() or public.is_admin());
drop policy if exists "book endings insert own" on public.book_endings;
create policy "book endings insert own" on public.book_endings
  for insert with check (owner = auth.uid());

-- ---------- Mini-game scores (e.g. "Dr. P's ER Dash") ----------
create table if not exists public.er_dash_scores (
  owner uuid primary key references public.profiles on delete cascade,
  best_score int not null default 0,
  badge boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.er_dash_scores enable row level security;
drop policy if exists "er dash read" on public.er_dash_scores;
create policy "er dash read" on public.er_dash_scores
  for select using (owner = auth.uid() or public.is_admin());
drop policy if exists "er dash insert own" on public.er_dash_scores;
create policy "er dash insert own" on public.er_dash_scores
  for insert with check (owner = auth.uid());
drop policy if exists "er dash update own" on public.er_dash_scores;
create policy "er dash update own" on public.er_dash_scores
  for update using (owner = auth.uid()) with check (owner = auth.uid());

-- ---------- Kalesh HQ (group space) ----------
-- Any logged-in girl can see every girl's basic profile (name/slug/role), needed for the group page.
drop policy if exists "profiles read group" on public.profiles;
create policy "profiles read group" on public.profiles
  for select using (auth.uid() is not null);

create table if not exists public.group_stickers (
  owner uuid primary key references public.profiles on delete cascade,
  emoji text not null,
  x numeric not null,
  y numeric not null,
  updated_at timestamptz not null default now()
);
alter table public.group_stickers enable row level security;
drop policy if exists "stickers read" on public.group_stickers;
create policy "stickers read" on public.group_stickers
  for select using (auth.uid() is not null);
drop policy if exists "stickers insert own" on public.group_stickers;
create policy "stickers insert own" on public.group_stickers
  for insert with check (owner = auth.uid());
drop policy if exists "stickers update own" on public.group_stickers;
create policy "stickers update own" on public.group_stickers
  for update using (owner = auth.uid()) with check (owner = auth.uid());

-- Singleton row for the one group photo (admin-uploaded).
create table if not exists public.group_photo (
  id boolean primary key default true,
  storage_path text,
  caption text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id)
);
alter table public.group_photo enable row level security;
drop policy if exists "group photo read" on public.group_photo;
create policy "group photo read" on public.group_photo
  for select using (auth.uid() is not null);
drop policy if exists "group photo admin write" on public.group_photo;
create policy "group photo admin write" on public.group_photo
  for all using (public.is_admin()) with check (public.is_admin());

-- Group photo lives in the same private "photos" bucket, under a group/ prefix.
drop policy if exists "group photo bucket read" on storage.objects;
create policy "group photo bucket read" on storage.objects
  for select using (bucket_id = 'photos' and (storage.foldername(name))[1] = 'group' and auth.uid() is not null);
drop policy if exists "group photo bucket admin insert" on storage.objects;
create policy "group photo bucket admin insert" on storage.objects
  for insert with check (bucket_id = 'photos' and (storage.foldername(name))[1] = 'group' and public.is_admin());
drop policy if exists "group photo bucket admin delete" on storage.objects;
create policy "group photo bucket admin delete" on storage.objects
  for delete using (bucket_id = 'photos' and (storage.foldername(name))[1] = 'group' and public.is_admin());
