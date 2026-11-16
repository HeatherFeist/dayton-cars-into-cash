# Lead inbox

Each yard gets a private lead dashboard on **that yard's site** (for the sample: `wepay4cars.wepay4cars.com/inbox`). It is not on the public directory at wepay4cars.com.

The dashboard lists only that yard's requests. Status, notes, pickup time, CSV export, and delete are all there.

## How to open it

1. On the yard site, go to `/inbox`, or tap the logo in the header **6 times quickly**.
2. Enter the password from `inboxPassword` in `site.config.js`. The sample password is **`Admin`**. Change it before a paying yard goes live.
3. Leave `inboxPassword` blank to hide the dashboard for that yard.

Press **Esc** or **×** to close the overlay. **↻ Refresh** reloads the list.

## One-time database setup

The dashboard needs a Supabase project. See `supabase/README.md`.

1. Run the SQL files in `supabase/` in order.
2. In Cloudflare Pages → Settings → Environment variables, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Redeploy. Those names start with `VITE_`, so they are baked in at build time.

Until that is done, the quote form still shows a ballpark range and can text or email the yard. The inbox page will say the database is not configured.

Optional phone alerts: `PUSHOVER_SETUP.md`.

## Security — please read

This inbox is a **convenience screen, not a security wall.**

- The password lives in `site.config.js` and ships in the page. The Supabase anon key is public by design. A technical person who inspects the page could read leads. It keeps data out of casual sight.
- The `yard` filter is applied in the app. It is not a cryptographic lock between yards that share one Supabase project.
- For a small local business this is usually an acceptable trade-off. A later upgrade is a real Supabase login and a policy that requires `auth.role() = 'authenticated'`.
