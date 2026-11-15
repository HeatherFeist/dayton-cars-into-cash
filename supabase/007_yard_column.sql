-- Migration 007 — tag each lead (and click) with the yard subdomain.
-- The dashboard only shows rows for the yard whose site you opened.
-- This is a query filter in the app, not a cryptographic wall: the anon
-- key can still read other yards' rows if someone inspects the page.
-- Safe to run more than once.

alter table dayton_cars_leads add column if not exists yard text;
alter table dayton_cars_leads add column if not exists page text;
alter table call_clicks add column if not exists yard text;
alter table call_clicks add column if not exists source text;

-- Optional: attach older Dayton sample rows to the sample subdomain.
-- Skip this if those rows belong to a different yard.
-- update dayton_cars_leads set yard = 'wepay4cars' where yard is null;
