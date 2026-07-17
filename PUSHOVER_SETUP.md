# Instant lead alerts to the owner's phone (Pushover)

When someone completes the quote form, the owner's phone gets an instant push
notification with the customer's details and their quote — e.g.:

> **New lead — Dayton Cars into Cash**
> 2015 Honda Civic
> Quoted ~$438 ($375–$500)
> Name: Jane Doe
> Phone: (937) 555-0123
> Zip: 45402

It's a high-priority push, so it rings through even during quiet hours — the
"ring my phone the moment a lead comes in" behavior you wanted. (Voxer can't do
this — it has no way for a website to trigger it — so we use Pushover instead.)

## One-time setup

1. **Install Pushover** on the owner's phone (iOS/Android) and create an
   account: https://pushover.net  (one-time ~$5 per platform after a trial).
2. On https://pushover.net, copy the account's **User Key** (shown on the
   dashboard).
3. Create an application: **Apps & Plugins → Create a New Application/API Token**
   (name it e.g. "Dayton Cars Leads"). Copy the **API Token/Key** it gives you.
4. Put both values into the site's environment:
   - **Local dev:** add to `.env`:
     ```
     VITE_PUSHOVER_TOKEN=your-app-api-token
     VITE_PUSHOVER_USER=your-user-key
     ```
   - **Production (Netlify):** Site settings → Environment variables → add
     `VITE_PUSHOVER_TOKEN` and `VITE_PUSHOVER_USER`, then redeploy.
5. Submit a test lead on the site — the owner's phone should buzz within a few
   seconds.

If the two variables are left blank, the form still works and saves the lead;
the owner simply doesn't get a push. Nothing breaks.

## ⚠️ Security note — please read

The notification is sent from the **browser**, so the Pushover token and user
key ship inside the site's JavaScript and are visible to anyone who views the
page source.

- **Risk:** someone could copy the keys and send the owner spam pushes, or use
  up the monthly message allotment. They could NOT read your leads with these
  keys — they're only for sending pushes to the owner.
- For a small local business this is usually an acceptable trade-off (it's why
  we chose the no-server route). If it's ever abused, the fix is to move this
  call into a **Supabase Edge Function** triggered on new leads, so the keys
  stay server-side and never reach the browser. The message-building logic in
  `src/lib/notifyLead.js` ports over almost as-is.

## Where it lives in the code

- `src/lib/notifyLead.js` — builds and sends the push.
- `src/components/QuoteForm.jsx` — calls `notifyNewLead(form, range)` after a
  lead saves successfully (fire-and-forget; a push failure never affects the
  customer's submission).
