-- Migration 005 — pickup date/time per lead.
-- Safe to run more than once.

alter table dayton_cars_leads
  add column if not exists pickup_at timestamptz;
