-- Base leads table. The name dayton_cars_leads is historical (the Dayton
-- sample). Each row is tagged with `yard` (the subdomain) so one project
-- can hold more than one yard's requests.
--
-- HOW TO RUN: Supabase → SQL Editor → paste → Run.

create table if not exists dayton_cars_leads (
  id uuid primary key default gen_random_uuid(),
  year text,
  make text,
  model text,
  condition text,
  zip text,
  name text,
  phone text,
  email text,
  estimate_low integer,
  estimate_high integer,
  created_at timestamptz default now()
);

alter table dayton_cars_leads enable row level security;

drop policy if exists "Allow public inserts" on dayton_cars_leads;
create policy "Allow public inserts"
  on dayton_cars_leads for insert
  to anon
  with check (true);
