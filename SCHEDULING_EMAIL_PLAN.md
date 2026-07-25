# Plan: Scheduling + Customer Email on "Scheduled"

**Status:** Phase 1 is built, using Google Calendar instead of a custom
calendar view — see below. The customer-email part (Phase 2+) is still just a
proposal.

## The idea (in plain terms)

Today the customer's estimate is only shown on-screen after they submit — no
email is ever sent to them. The email address is just collected so the owner
can follow up.

Instead of auto-emailing every lead the moment they submit, tie the email to
the **owner's action**: when the owner sets a lead's status to **"Scheduled"**
in the admin panel and picks a **pickup date/time**, that confirms and sends the
customer a **"Your pickup is scheduled"** email.

Why this is the right call:
- It mirrors how the business actually works — a human confirms first, *then*
  the customer hears from us. No premature or wrong auto-quotes going out.
- The email is a genuinely useful confirmation (date, time, what to expect),
  not just an estimate the customer already saw on screen.
- Fewer emails sent = better deliverability and lower cost.

---

## What gets built (proposed)

### 1. A pickup date/time on each lead — ✅ Built
Each lead row in the admin panel has a date/time picker (`pickup_at` column in
the DB, see `supabase/005_pickup_at.sql`). Once a pickup time is set, a
**"📅 Add to Calendar"** link appears next to it — it opens Google Calendar
with a pre-filled event (customer, vehicle, phone, estimate, notes); the owner
just clicks **Save** in their own Google Calendar.

This replaces the originally-proposed custom calendar view: no OAuth, no
server-side Google integration, no accounts to manage. The tradeoff is it's a
manual one-click step per lead rather than fully automatic — revisit the
"fully automatic sync" option below if that click becomes a hassle.

### 2. "Scheduled" triggers the email
When the owner:
1. Picks a pickup date/time, and
2. Sets status to **Scheduled** and clicks a **"Confirm & notify customer"**
   button,

...the customer gets an email like:

> **Your pickup is scheduled — We Pay 4 Cars**
> Hi [Name], your 2015 Honda Civic is scheduled for pickup on
> **Tue, July 22 at 10:00 AM**. Our driver will pay you [estimate] in cash or
> check at pickup. Questions? Call (937) 296-6755.

The explicit "Confirm & notify" button matters — it means the owner is always
in control and an email never goes out by accident just from clicking a
dropdown.

### 3. (Optional) Estimate email on submit
Separately, we *could* also email the customer their estimate immediately when
they submit. This is optional and independent of the scheduling flow. My
recommendation: **skip it for now** — the estimate already shows on-screen, and
the "Scheduled" email is the higher-value one. Easy to add later if wanted.

---

## What it requires (the honest setup)

A website can't send email on its own. To send customer emails we need:

1. **An email service — [Resend](https://resend.com) recommended.**
   Free tier ~3,000 emails/month, simple API. (Plenty for this volume.)

2. **A verified sending domain (strongly recommended).**
   So the email comes from e.g. `offers@wepay4cars.com` and lands in the
   inbox, not spam. This needs:
   - The business to own a domain (do they have `wepay4cars.com` or
     similar?).
   - Adding a couple of DNS records Resend provides (SPF/DKIM). ~15 min, one
     time. Without this, email still sends but from a generic address and is
     more likely to hit spam.

3. **A server-side function (Supabase Edge Function).**
   The email send must run server-side so the Resend API key stays secret —
   unlike the Pushover keys, which currently sit in the front-end. This is the
   secure, correct approach and avoids that exposure.

4. **A small DB change** — add `pickup_at` (and reuse the existing `status`),
   plus the Edge Function deploy. I'll provide the SQL and exact deploy steps;
   the client/owner runs the account setup (Resend signup, domain DNS).

---

## Security note

The existing owner phone-alert (Pushover) runs in the browser with public keys —
fine for pushing alerts to the owner, but not something to copy for customer
email. The email flow will instead run in a **Supabase Edge Function** so the
Resend key never reaches the browser. This is the right pattern and also the
groundwork for eventually moving the Pushover alert server-side too.

---

## Suggested phases

| Phase | What | Effort | Needs from client |
|-------|------|--------|-------------------|
| 1 | ✅ Done — `pickup_at` + date/time picker in admin, "Add to Calendar" link to Google Calendar | Low | Run `supabase/005_pickup_at.sql` |
| 2 | Resend account + verified domain; Edge Function that sends the "Scheduled" email; "Confirm & notify" button | Medium | Resend signup, domain DNS records, paste API key |
| 3 (optional) | Estimate email on submit | Low | — |
| 4 (optional, later) | Fully automatic Google Calendar sync (no click) — needs Google OAuth + server-side integration | High | Google account authorization |

---

## Open questions for the client

1. **Do they own a domain** (e.g. wepay4cars.com)? Needed for
   good-looking, inbox-landing email. If not, do they want to get one?
2. **Should the "Scheduled" email include the estimate**, or just the pickup
   date and logistics?
3. **Any second recipient?** e.g. also send the owner a copy of the confirmation
   for their records.
4. **Do they want the optional estimate-on-submit email too**, or just the
   scheduling confirmation?

Once these are answered we can start with Phase 1 (which needs no external
accounts) and line up Phase 2.
