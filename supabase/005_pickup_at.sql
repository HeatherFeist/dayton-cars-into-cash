-- Migration 005 — pickup date/time per lead, for the admin panel's scheduling.
--
-- HOW TO RUN: Supabase project → SQL Editor → paste this whole file → Run.
-- Safe to run more than once.
--
-- Adds the pickup_at column the owner sets from the admin panel; the panel
-- then offers a link to add that date/time to Google Calendar (no server-side
-- integration — just a pre-filled Google Calendar URL the owner clicks).

alter table dayton_cars_leads
  add column if not exists pickup_at timestamptz;
