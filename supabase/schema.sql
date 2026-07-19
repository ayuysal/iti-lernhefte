-- ============================================================================
-- iti-lernhefte · Supabase-Schema für den Fortschritt-Sync
-- ----------------------------------------------------------------------------
-- Einmalig im Supabase-Dashboard unter  SQL Editor  ausführen.
-- Danach in assets/config.js die Project-URL und den anon-Key eintragen und
-- unter  Authentication → Providers → Email  "Email OTP / Magic Link" aktivieren.
-- Unter  Authentication → URL Configuration  die Site-URL auf die
-- GitHub-Pages-Adresse setzen (z. B. https://ayuysal.github.io/iti-lernhefte/).
-- ============================================================================

create table if not exists public.progress (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  heft       text        not null,                    -- z. B. 'iti21:state'
  state      jsonb       not null default '{}'::jsonb, -- read[], band, theme, base, font
  updated_at timestamptz not null default now(),
  primary key (user_id, heft)
);

-- Row Level Security: jeder sieht und ändert ausschließlich die eigenen Zeilen
alter table public.progress enable row level security;

drop policy if exists "progress_select_own" on public.progress;
drop policy if exists "progress_insert_own" on public.progress;
drop policy if exists "progress_update_own" on public.progress;
drop policy if exists "progress_delete_own" on public.progress;

create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "progress_delete_own" on public.progress
  for delete using (auth.uid() = user_id);
