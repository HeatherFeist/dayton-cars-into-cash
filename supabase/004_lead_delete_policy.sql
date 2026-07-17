-- Migration 004 — allow deleting leads from the admin panel.
--
-- HOW TO RUN: Supabase project → SQL Editor → paste this whole file → Run.
-- Safe to run more than once.
--
-- Adds a DELETE policy so the admin dashboard (using the public anon key) can
-- remove leads — e.g. test submissions.
--
-- ⚠️ SECURITY NOTE: like the read/update policies from 002 and 003, this lets
-- anyone with the public anon key delete rows. The "Admin" password only hides
-- the UI. Deletes are permanent (no undo). To restrict deletes to a real login
-- later, gate this policy on auth (auth.role() = 'authenticated') and put the
-- panel behind Supabase Auth.

drop policy if exists "Allow anon deletes for admin panel" on dayton_cars_leads;
create policy "Allow anon deletes for admin panel"
  on dayton_cars_leads for delete
  to anon
  using (true);
