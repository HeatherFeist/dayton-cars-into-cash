create table leads (
  id uuid primary key default gen_random_uuid(),
  year text,
  make text,
  model text,
  condition text,
  zip text,
  name text,
  phone text,
  email text,
  created_at timestamptz default now()
);

alter table leads enable row level security;

create policy "Allow public inserts"
  on leads for insert
  to anon
  with check (true);
