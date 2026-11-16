-- Migration 004 — allow deleting leads from the dashboard.
-- Safe to run more than once.

drop policy if exists "Allow anon deletes for admin panel" on dayton_cars_leads;
create policy "Allow anon deletes for admin panel"
  on dayton_cars_leads for delete
  to anon
  using (true);
