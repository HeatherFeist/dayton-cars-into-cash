-- Migration 003 — lead management: status + notes, editable from the admin panel.
--
-- HOW TO RUN: Supabase project → SQL Editor → paste this whole file → Run.
-- Safe to run more than once.
--
-- Adds two columns the owner can edit per lead to track follow-up, and an
-- UPDATE policy so the admin dashboard (using the public anon key) can save
-- those edits.
--
-- ⚠️ SECURITY NOTE: like migration 002's read policy, this UPDATE policy lets
-- anyone with the public anon key modify these rows. The "Admin" password only
-- hides the UI. To restrict edits to a real login later, gate this policy on
-- auth (auth.role() = 'authenticated') and put the panel behind Supabase Auth.

-- Status of each lead in the owner's follow-up flow. Free text so the app can
-- evolve the options without another migration; the admin UI offers a fixed
-- set (New / Contacted / Scheduled / Paid / Passed) and defaults to 'New'.
alter table dayton_cars_leads
  add column if not exists status text default 'New';

-- Backfill any existing rows that predate this column.
update dayton_cars_leads set status = 'New' where status is null;

-- Free-text notes the owner types (follow-up details, callback times, etc.).
alter table dayton_cars_leads
  add column if not exists notes text;

-- Allow the admin panel to save status/notes edits.
drop policy if exists "Allow anon updates for admin panel" on dayton_cars_leads;
create policy "Allow anon updates for admin panel"
  on dayton_cars_leads for update
  to anon
  using (true)
  with check (true);
