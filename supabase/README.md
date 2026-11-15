# Lead database

The quote form can save requests here. The private dashboard reads them.

The table is still named `dayton_cars_leads` so an existing Dayton project keeps working. Each row has a `yard` column (the subdomain, such as `wepay4cars` or `sandys`). The dashboard only lists that yard's rows.

## One-time setup

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the files in this folder, in order:
   - `leads_table.sql` (skip if the table already exists)
   - `002_wizard_columns_and_admin_read.sql`
   - `003_lead_status_and_notes.sql`
   - `004_lead_delete_policy.sql`
   - `005_pickup_at.sql`
   - `006_call_clicks.sql`
   - `007_yard_column.sql`
3. In **Project Settings → API**, copy the project URL and the **anon** public key.
4. In Cloudflare Pages → Settings → Environment variables, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redeploy. These names start with `VITE_`, so they are baked into the JavaScript at build time.
6. In `site.config.js`, set `inboxPassword` for that yard. Leave it blank to hide the dashboard.

Without these variables the quote form still shows a ballpark and can text or email the yard. The dashboard will say the database is not configured.

## Security

The inbox password lives in `site.config.js` and ships in the page. The anon key is public by design. Together they hide leads from casual visitors. They do not stop a technical person who inspects the page. For a small local yard that is usually enough. A later upgrade is a real Supabase login.
