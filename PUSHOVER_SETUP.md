# Instant lead alerts (Pushover)

When someone finishes the quote form and the lead is saved, the owner's phone can get a push with the vehicle, the ballpark range, and the customer's name and number.

If the two variables below are blank, the form still works. The owner just does not get a push.

## One-time setup

1. Install Pushover on the owner's phone and create an account: https://pushover.net
2. Copy the account **User Key**.
3. Create an application under **Apps & Plugins** and copy the **API Token**.
4. Put both values in the environment:
   - **Local:** `.env` (see `.env.example`)
   - **Live (Cloudflare Pages):** Settings → Environment variables → `VITE_PUSHOVER_TOKEN` and `VITE_PUSHOVER_USER`, then rebuild
5. Submit a test vehicle. The phone should buzz within a few seconds.

## Security

The push is sent from the **browser**, so the token and user key ship in the site's JavaScript.

Someone could copy them and send extra pushes, or use up the monthly limit. They could not read leads with those keys. For a small local business that is usually acceptable. If it is abused, move the call into a server function so the keys never reach the page.
