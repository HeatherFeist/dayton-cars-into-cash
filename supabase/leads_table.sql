create table dayton_cars_leads (
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

create policy "Allow public inserts"
  on dayton_cars_leads for insert
  to anon
  with check (true);
