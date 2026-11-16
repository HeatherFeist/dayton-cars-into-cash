-- Migration 006 — count taps on Call / Text links.
-- This is a click count, not a guarantee someone completed a call.
-- Safe to run more than once.

create table if not exists call_clicks (
  id uuid primary key default gen_random_uuid(),
  kind text,
  source text,
  yard text,
  created_at timestamptz default now()
);

alter table call_clicks enable row level security;

drop policy if exists "Allow public call click inserts" on call_clicks;
create policy "Allow public call click inserts"
  on call_clicks for insert
  to anon
  with check (true);

drop policy if exists "Allow anon reads of call clicks" on call_clicks;
create policy "Allow anon reads of call clicks"
  on call_clicks for select
  to anon
  using (true);
