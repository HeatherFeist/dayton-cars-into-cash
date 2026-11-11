# Launch a new yard in 10 minutes

This is a ready-made website for a salvage yard or junk-car buyer. Customers can call, text, or send a short form, and the yard gets the request directly.

The site you see right now is a **sample** (a Dayton, Ohio yard). Nothing about that sample is locked in. You change one file, and the name, phone number, cities, and colors all update together.

You do not need a programmer for the everyday edits. You do need someone who can put the site on the internet the first time. The steps below are the whole job.

## 1. Open the settings file

Open `site.config.js` in any text editor (Notepad, TextEdit, or the editor your web person uses).

Change the words between the quotes. Each line has a note above it that says what it does. Save the file when you are done.

Change these before you show the site to customers:

- **Business name** and the sentence under the big headline
- **Phone number** (the way it looks, and the dialing number that starts with `+1`)
- **Text number**, if texts should go to a different phone
- **Email**, if you want one shown and used as a backup
- **City, state, and how many miles** you will drive for a pickup
- **The list of cities** you actually serve. One page is created for each city. Delete cities you do not serve, and add the ones you do. One city per line, inside quotes.
- **Subdomain.** This is the yard's web address. Use the business name in lowercase with spaces and apostrophes removed. Sandy's Towing becomes `sandys`. Jim's Towing becomes `jimstowing`. The yard is then at `sandys.wepay4cars.com`. The sample name is We Pay 4 Cars, so the sample address is `wepay4cars.wepay4cars.com`.
- **Colors.** `brand` is the dark header color. `accent` is the gold on the buttons. Change those two and the whole site recolors.

Leave a line as `''` (two quotes with nothing between them) when you do not have that item yet. The site hides it. Do not type a street address, hours, license number, star rating, or review count unless it is real and you are happy to publish it.

Only turn on the promises you will keep (`freeTowing`, `paidOnPickup`, `sameDayPickupOften`, `noHiddenFees`). If you do not offer free towing, set `freeTowing` to `false`.

## 2. Swap the logo

The sample uses the business name as the logo.

To use your own logo:

1. Save the image file in the `public` folder. `logo.svg` or `logo.png` is fine.
2. In `site.config.js`, set `logoPath` to `'/logo.svg'` (or whatever you named the file, with the slash at the front).

## 3. Decide where offers go

The form asks for year, make, model, condition, ZIP code, name, and phone.

**Easiest:** leave `leadForm.endpoint` blank. When someone sends the form, their phone opens a text message to you with the details already typed. If a text number is not set, it opens an email instead. You do not pay anyone, and there is no account to create.

**If you want the form to land in an inbox without opening the customer's phone:** paste a form web address into `leadForm.endpoint`. Any service that accepts a normal form submission works. People often use the free tier of Formspree, Getform, or Basin, Netlify's built-in forms, or a Google Sheet script. You create that address on their site and paste it here. Do not put passwords or secret keys in this file.

- Leave `format` as `'form'` unless the service you chose tells you it wants JSON.
- On Netlify only, you can set `netlifyFormName` to `offer` and leave the endpoint blank. Netlify stores the submissions for you.

If the form address is missing or the browser cannot reach it, the site falls back to the text message or email. Test it once before you advertise: send a fake car and confirm you actually receive it.

## 4. Replace the video (or hide it)

The clip at the top of the home page is the **sample yard's** video. It may say the sample city's name.

- To use your own video, replace the file `public/explainer.mp4`.
- To hide the video until you have one, set `videoPath` to `''` in `site.config.js`.

## 5. Put it on the internet

This is a simple static site. Netlify, Vercel, and Cloudflare Pages can all host it. The project is already set up for all three. You do not pick a database.

Ask your web person to connect this project to one of those hosts, or do this yourself:

**Netlify**

1. Go to [netlify.com](https://www.netlify.com) and add a new site from your Git repository.
2. Leave the build command as `npm run build` and the publish folder as `dist`. Those are already saved in `netlify.toml`.
3. Publish. Every time you save a change to `site.config.js` and it is pushed, Netlify rebuilds the site.

**Vercel**

1. Go to [vercel.com](https://vercel.com) and import the repository.
2. Framework: Vite. Build command: `npm run build`. Output folder: `dist`.
3. Deploy.

**Cloudflare Pages**

1. Go to the Cloudflare dashboard, Pages, and create a project from the repository.
2. Build command: `npm run build`. Output folder: `dist`.
3. Save and deploy.

If you would rather hand someone a folder: they run `npm run build` on a computer, then upload the `dist` folder. That folder is the finished website, including one page per city, `sitemap.xml`, and the icon.

After it is live, open the home page and one city page on your phone. Tap the call button. Send a test offer. Click a city in the service-area list and confirm the headline names that city.

## Before you advertise

- [ ] Business name, phone, and text number are yours
- [ ] `subdomain` is the yard's real business name, with no spaces
- [ ] The city list is only places you will pick up
- [ ] Every promise on the page is true (free towing, same-day pickup, how you pay)
- [ ] The sample video is replaced or hidden
- [ ] A test offer reached you by text, email, or your form inbox
- [ ] Address, hours, Google review link, and review numbers are still blank, or they are real

The site will not invent a review count, a star rating, or a price. When you have real Google numbers, paste them into `googleRating`, `googleReviewCount`, and `googleReviewUrl`. Until then, that spot stays a plain sentence.

## The city directory

`wepay4cars.com` starts with all 50 states. Open a state, such as `wepay4cars.com/ohio`, and you get the cities where a yard actually picks up. Open a city, such as `wepay4cars.com/ohio/dayton`, and you get each yard that serves it. Those links leave the main site and open that yard’s own website, such as `https://sandys.wepay4cars.com/areas/denver`. States with nobody listed yet still appear, and they say so. Cities are never made up.

Each yard is one block in `affiliates.config.js`. The sample yard is already there, pulled in from `site.config.js`. To add a yard, copy the sample details into a new block, set `subdomain` from the business name, and add the block to the list. Do not type a phone number or a city the yard does not really serve.

Their pages stay on their subdomain: `sandys.wepay4cars.com` is Sandy's home page, and `sandys.wepay4cars.com/areas/denver` is one town she picks up in.

Before the subdomains work in a browser, the domain settings for `wepay4cars.com` need one extra record so every name in front of the domain (the `*` record) points at the same site as `wepay4cars.com`. The person who handles the domain can add that. Until then, a yard can still be opened at `wepay4cars.com/_aff/sandys/`.

Leave `siteUrl` as `https://example.com` unless the yard has bought a completely separate domain. The subdomain address is used on its own.

## What the site builds for you

- A home page and a page for every city in the list, each with its own title and description
- A call button in the header, in the top section, and a bar stuck to the bottom of the screen on phones
- A sitemap at `/sitemap.xml` for Google
- The business listing info (name, phone, cities, hours if you added them) in the page code search engines read

Colors, the phone number, and the city names all come from `site.config.js`. You should not have to edit any other file.
