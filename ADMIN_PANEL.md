# Hidden Admin Panel — how it works & setup

A private leads dashboard is built into the site. It's not linked anywhere —
you open it with a secret gesture.

## How to open it

1. On the live site, **tap/click the "Dayton Cars into Cash" logo (top-left)
   6 times quickly** (within about 2 seconds).
2. A password box appears. Enter the password: **`Admin`**
3. You'll see the Leads Dashboard: total leads, today's count, a per-day
   breakdown, a by-zip (location) breakdown, and a table of every lead with
   name, phone, email, zip, vehicle, and estimate.

Press **Esc** or click **×** to close it. Click **↻ Refresh** to reload the
latest leads.

## One-time Supabase setup (required)

The dashboard reads from the `dayton_cars_leads` table, and the multi-step
form now saves extra fields. Run the migration once so both work:

1. Open your project at https://supabase.com → **SQL Editor**.
2. Open `supabase/002_wizard_columns_and_admin_read.sql` from this repo,
   paste the whole thing in, and click **Run**.

That adds the columns the form submits (trim, mileage, and the condition
answers) and a read policy so the dashboard can load leads. It's safe to run
more than once.

## ⚠️ Important security note — please read

This panel is a **convenience screen, not a security wall.**

- The password (`Admin`) lives in the site's front-end code, and the Supabase
  public key ships in the page too. A technical person who inspects the page
  could bypass the password and read leads. It keeps the data out of casual
  sight; it does not truly protect customer PII.
- For a small local business this is often an acceptable trade-off. If you
  want real protection later, the upgrade is: turn on **Supabase Auth**, give
  the owner a real login, and change the table's read policy to require an
  authenticated user (`auth.role() = 'authenticated'`). I can wire that up
  when you're ready — it's a moderate change, not a rewrite.

## Changing the password

Edit `ADMIN_PASSWORD` at the top of `src/components/AdminPanel.jsx`. (Same
caveat as above — it's still client-side.)
