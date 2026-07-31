# Junkyard Partner Program — Pricing, Sales Page & Ad Copy

Productized version of this site (We Pay 4 Cars), rebranded and resold to
junkyard/auto-recycling owners in other markets. Your current client (the
founding/pilot client, given the build for free per your agreement) is the
one relationship-selling this to other owners; you split revenue 50/50 with
them on every sale, per your plan.

**Read the notes at the bottom before sending any of this out** — there's a
real legal consideration on the revenue-share structure.

---

## 1. The three packages

| | Starter | Done-For-You (core offer) | Growth Partner |
|---|---|---|---|
| **One-time setup** | $2,500–$3,500 | $5,000–$8,000 | $10,000–$15,000 |
| **Monthly (optional/required)** | $0, or $99/mo self-serve hosting | $150–$250/mo hosting & care | $750–$1,500/mo growth retainer |
| **Who it's for** | Owner is comfortable managing their own domain/hosting, just wants the site | Owner wants it fully handled, ongoing | Owner wants us actively driving and growing lead volume |

### Starter — $2,500–$3,500 one-time
- Full rebrand: their business name, logo, colors, phone number, service-area
  cities swapped in.
- Their own domain connected, their own Supabase project (leads stay theirs,
  private).
- Deployed and handed off. They own hosting/domain from day one.
- No ongoing support included — docs only (same docs this repo already has:
  `PUSHOVER_SETUP.md`, `ADMIN_PANEL.md`, etc., rebranded).
- Optional $99/mo if they'd rather we keep managing hosting for them.

### Done-For-You — $5,000–$8,000 one-time + $150–250/mo
*(This is the tier that matches what you already built and priced once —
see `PROPOSAL_EMAIL.md` for the comparable founding-client numbers.)*
- Everything in Starter, but we do all the setup work: domain, hosting,
  Supabase, Pushover lead alerts wired to their phone, admin leads dashboard
  configured with their own password, pickup-scheduling calendar link,
  service-area copy tailored to their actual region, one round of revisions.
- Monthly retainer: uptime monitoring, backups, small copy/content edits,
  a monthly leads report. Cancel anytime — this is recurring income, protect
  it the way the notes in `PROPOSAL_EMAIL.md` already say to.

### Growth Partner — $10,000–$15,000 one-time + $750–1,500/mo
This is the "charge max" tier — priced higher because it includes real
ongoing labor (video, SEO, ad management), not just a website.
- Everything in Done-For-You, plus:
  - **Two branded lead-gen videos** (see §3) built into funnel landing pages.
  - Initial SEO audit + on-page optimization for their market.
  - Google Business Profile setup/optimization (see your earlier question
    about this — same idea, applied per-market).
  - Social ad account setup (Meta/Google), first campaign built.
- Monthly retainer covers: new monthly content/ad creative, SEO upkeep,
  funnel performance reporting, priority support. Ad spend itself is billed
  separately/pass-through — don't fold media budget into your retainer.

---

## 2. Sales page copy (send this after initial interest)

**Subject: A lead-generating website, already proven, built for your yard**

You're not buying a template — you're buying a system that's already live
and taking real leads for a junkyard in the Dayton, OH market: an instant
online cash-offer estimator, free-towing messaging that removes the biggest
objection sellers have, a private lead dashboard, and same-day pickup
scheduling — all built to turn "I need to get rid of this car" searches into
phone calls and booked pickups.

We rebrand the entire thing for your business — your name, your logo, your
phone number, your service area — and connect it to your own private lead
database. You're never sharing customer data with another yard.

**Three ways to start:**
- **Starter ($2,500–3,500):** the rebranded site, handed off, you run it.
- **Done-For-You ($5,000–8,000 + $150–250/mo):** we handle everything,
  ongoing.
- **Growth Partner ($10,000–15,000 + $750–1,500/mo):** the above, plus
  custom video ads, funnels, SEO, and ongoing growth work — for owners who
  want us actively driving lead volume, not just hosting a page.

Reply and we'll walk you through the live site in about 10 minutes.

---

## 3. The two lead-gen videos (Growth Partner deliverable)

Same ~40-second spokesperson format as the existing site video
(`VIDEO_SCRIPT.md`), rebranded per client. Two angles, because sellers come
for different reasons — "I need money" vs. "I just need this gone" — and
they respond to different messaging.

**Video 1 — "Cash Fast"** (already built, reuse `VIDEO_SCRIPT.md` Option A/B
rebranded per client)
- Hook: got an old car, need money now.
- Emphasizes: instant offer, no lowballing, paid on the spot.

**Video 2 — "Clear the Clutter" (new script needed)**
> Got a car just sitting there taking up space? You don't need it to be
> worth a fortune — you just want it gone.
>
> Here's how we make that easy. **One:** tell us about it right on this
> page — doesn't matter if it runs, has a title, or's been sitting for
> years. **Two:** get an instant offer, because yes, we still pay you, even
> for something you were ready to scrap. **Three:** we come pick it up,
> free towing included, and you get paid on the spot.
>
> No hauling it yourself, no calling five different places. Get your
> driveway back — get your instant offer now.

- Hook: decluttering / getting an eyesore gone, not urgency for cash.
- Emphasizes: convenience, "we do the hauling," still getting paid even for
  something they'd nearly given up on.
- Both videos get cut into a ~25-sec social/ad version too, same as the
  existing `VIDEO_SCRIPT.md` Option B pattern.
- Plan: share both organically on social first to see which pulls more
  leads per market before putting ad spend behind either one.

---

## 3b. Social content funnel (no landing page — just the posts)

Goal: turn each video into a self-contained lead funnel on the social
platform itself — hook → caption CTA → click straight to the site's
instant-offer form. No separate funnel page needed; the existing homepage
quote form is the destination for every link.

**Funnel logic (same for both videos):**
1. Video hook stops the scroll (cash fast, or clear the clutter).
2. Caption CTA drives one action: comment a keyword, or tap the bio link.
3. Link goes straight to the site → quote form → Pushover alert to the
   owner the moment a lead comes in.

### Facebook / Instagram Reels

**Video 1 — Cash Fast**
> Old car just sitting there? Turn it into cash — today. 💵
> Tell us about it, get an instant offer, we tow it free and pay you on
> the spot. Running or not, title or no title.
> 👉 Comment "CASH" and we'll send you the link, or tap the link in bio.
> #JunkCarsForCash #CashForCars #[CityName]

**Video 2 — Clear the Clutter**
> That car's not getting any easier to look at. 🚗📦
> You don't need top dollar — you just want it gone. We'll still pay you,
> and we do all the hauling.
> 👉 Comment "SPACE" and we'll send you the link, or tap the link in bio.
> #ClearTheClutter #JunkRemoval #CashForCars #[CityName]

### TikTok (same footage, faster cut / captions burned in)
> POV: that car's been sitting in your driveway for 2 years 👀
> Get an instant offer, free tow, cash on the spot. Link in bio.
> #JunkCar #CashForCars #DrivewayCleanOut #[CityName]

### Nextdoor (hyper-local, worth a try — free)
> Neighbors: if you've got an old car taking up space, we'll come get it
> and pay you cash — free towing included. Link in the post.

**"Comment the keyword" mechanic:** Facebook/Instagram both support
auto-DM tools (Meta's native automated responses, or ManyChat) that reply
to a comment keyword with the site link automatically — worth setting up
once volume justifies it, since it also boosts the post's engagement/reach.

**Posting cadence to start:** 2–3 posts/week per platform, alternating
Video 1 and Video 2 (plus the 25-sec cuts as separate posts), tagged with
which video/platform/city each lead came from (via `trackClick`-style
tagging already used on the site, so results are comparable per market).

---

## 4. Recruitment ad (to find junkyard owners to sell the package to)

**Short version (social/DM outreach):**
> We built the website that's already generating cash-offer leads for a
> junkyard in Dayton, OH — instant online estimates, free-towing messaging,
> leads landing straight on the owner's phone. Now offering the same system,
> fully rebranded, to yards in other markets. Starts at $2,500. Reply for a
> 10-minute walkthrough of the live site.

**Slightly longer version (industry forum / Facebook group post):**
> If you run a junkyard or auto-recycling business and your website is just
> a phone number and an address, you're leaving leads on the table. We built
> a system that's live right now for a yard in Dayton, OH: instant online
> cash offers, a private lead dashboard, same-day pickup scheduling, and
> automatic phone alerts the second a lead comes in. We're opening it up to
> a handful of other markets, fully rebranded for your business — packages
> start at $2,500 one-time, with done-for-you and full-growth options
> available. Comment or DM and I'll send a walkthrough of the live site.

---

## Notes for you (not part of anything you'd send out)

- **The 50/50 reseller split is the part to get in writing before scaling
  past your first outside sale.** Once your pilot client is selling this to
  strangers nationwide and splitting recurring revenue with you, this starts
  to resemble a business-opportunity/franchise-style arrangement under FTC
  and some state laws — especially if any pitch claims specific lead volume
  or income results. That's not something I can clear for you; a short
  consult with a lawyer before the second or third sale is the cheap
  insurance here.
- **Write a simple partner agreement with your pilot client** before they
  start selling: who owns the codebase/IP, what "50/50" is measured against
  (gross one-time fee only? the monthly retainer too? forever, or for a set
  term?), what happens if they stop performing, and whether they can sell
  outside a defined territory or to a competitor of an existing customer.
- **Anchor high, don't discount by default.** Same principle as
  `PROPOSAL_EMAIL.md` — the Growth Partner number is priced to include real
  recurring labor (video, SEO, ads), so don't let it get negotiated down to
  Done-For-You pricing with Growth Partner scope.
- **Protect the monthly, not the one-time**, if a prospect wants a discount —
  the retainer is the compounding value for both you and your client.
- Numbers above are a starting estimate based on comparable custom-web-app
  pricing (see `PROPOSAL_EMAIL.md`'s $8,500 standard-value anchor for this
  exact codebase) — adjust once you see what markets and owners actually
  say yes to.
