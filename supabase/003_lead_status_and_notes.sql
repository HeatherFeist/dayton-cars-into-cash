-- Migration 003 — status + notes, editable from the dashboard.
-- Safe to run more than once.

alter table dayton_cars_leads
  add column if not exists status text default 'New';

update dayton_cars_leads set status = 'New' where status is null;

alter table dayton_cars_leads
  add column if not exists notes text;

drop policy if exists "Allow anon updates for admin panel" on dayton_cars_leads;
create policy "Allow anon updates for admin panel"
  on dayton_cars_leads for update
  to anon
  using (true)
  with check (true);
