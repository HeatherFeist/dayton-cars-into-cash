-- Migration 006 — track phone/text link clicks, for real call-volume numbers.
--
-- HOW TO RUN: Supabase project → SQL Editor → paste this whole file → Run.
-- Safe to run more than once.
--
-- This is a click counter, not proof a call actually happened (we can't know
-- that from a website) — but it's the same "click-to-call" metric most
-- lead-gen sites use to report call volume, and it's real, not a guess.

create table if not exists call_clicks (
  id uuid primary key default gen_random_uuid(),
  kind text not null, -- 'call' or 'text'
  source text,         -- where on the site the link was clicked, e.g. 'header', 'footer', 'quote-success'
  created_at timestamptz default now()
);

alter table call_clicks enable row level security;

drop policy if exists "Allow public inserts" on call_clicks;
create policy "Allow public inserts"
  on call_clicks for insert
  to anon
  with check (true);

-- So the admin panel can show totals.
drop policy if exists "Allow anon reads for admin panel" on call_clicks;
create policy "Allow anon reads for admin panel"
  on call_clicks for select
  to anon
  using (true);
