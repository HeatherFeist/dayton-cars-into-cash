-- Migration 002 — wizard columns + dashboard read policy.
--
-- HOW TO RUN: Supabase → SQL Editor → paste this whole file → Run.
-- Safe to run more than once.

alter table dayton_cars_leads add column if not exists "trim"       text;
alter table dayton_cars_leads add column if not exists "mileage"    integer;
alter table dayton_cars_leads add column if not exists "starts"     text;
alter table dayton_cars_leads add column if not exists "wheels"     text;
alter table dayton_cars_leads add column if not exists "whole"      text;
alter table dayton_cars_leads add column if not exists "catalytic"  text;
alter table dayton_cars_leads add column if not exists "bodyDamage" text;
alter table dayton_cars_leads add column if not exists "interior"   text;
alter table dayton_cars_leads add column if not exists "title"      text;
alter table dayton_cars_leads add column if not exists estimate_low  integer;
alter table dayton_cars_leads add column if not exists estimate_high integer;

-- ⚠️ The SELECT policy lets anyone holding the public anon key (which ships
-- in the site's JavaScript) read leads. The inbox password only hides the UI.
-- For a small local business that is usually an acceptable trade-off. To lock
-- it down later, require Supabase Auth and change this policy to
-- auth.role() = 'authenticated'.

drop policy if exists "Allow anon reads for admin panel" on dayton_cars_leads;
create policy "Allow anon reads for admin panel"
  on dayton_cars_leads for select
  to anon
  using (true);
