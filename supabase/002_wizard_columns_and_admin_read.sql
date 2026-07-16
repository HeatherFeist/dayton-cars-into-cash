-- Migration 002 — bring the leads table in line with the multi-step wizard,
-- and let the admin panel read rows.
--
-- HOW TO RUN: open your Supabase project → SQL Editor → paste this whole file
-- → Run. It is safe to run more than once (IF NOT EXISTS / drop-then-create).
--
-- Two things happen here:
--   1. Add the columns the wizard now submits (trim, mileage, the seven
--      condition answers). Without these, form inserts of those fields fail.
--   2. Add a SELECT policy so the site's anon key can read leads for the
--      in-page admin dashboard.
--
-- ⚠️ SECURITY NOTE: this SELECT policy makes every lead readable by anyone
-- holding the public anon key (which ships in the site's JS). The admin panel's
-- "Admin" password only hides the UI; it is NOT a real access control. For a
-- small local business this is usually an acceptable trade-off. To lock it down
-- properly later, replace this policy with one gated on Supabase Auth
-- (auth.role() = 'authenticated') and put the dashboard behind a real login.

-- 1. Columns the wizard writes -------------------------------------------------
-- Quoted identifiers preserve exact case so they match the JSON keys the form
-- sends (notably "bodyDamage", which is camelCase in the form state).
alter table dayton_cars_leads add column if not exists "trim"       text;
alter table dayton_cars_leads add column if not exists "mileage"    integer;
alter table dayton_cars_leads add column if not exists "starts"     text;
alter table dayton_cars_leads add column if not exists "wheels"     text;
alter table dayton_cars_leads add column if not exists "whole"      text;
alter table dayton_cars_leads add column if not exists "catalytic"  text;
alter table dayton_cars_leads add column if not exists "bodyDamage" text;
alter table dayton_cars_leads add column if not exists "interior"   text;
alter table dayton_cars_leads add column if not exists "title"      text;

-- estimate columns (harmless if a prior migration already added them)
alter table dayton_cars_leads add column if not exists estimate_low  integer;
alter table dayton_cars_leads add column if not exists estimate_high integer;

-- The original "condition" column is no longer written by the form. We leave it
-- in place so older rows keep their data; drop it later if you don't need it.

-- 2. Read policy for the admin dashboard --------------------------------------
drop policy if exists "Allow anon reads for admin panel" on dayton_cars_leads;
create policy "Allow anon reads for admin panel"
  on dayton_cars_leads for select
  to anon
  using (true);
