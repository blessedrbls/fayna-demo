# Fayna Gostyna: catering & BBQ demo site

A one-page demo website for **Fayna Gostyna**, a catering and BBQ service
([Instagram](https://www.instagram.com/fayna_gostyna_cateringbbq/)).
The site UI is in Ukrainian.

Plain HTML + CSS + JavaScript: no frameworks, no build step, no external APIs, no trackers.

## Features

- Dark theme with warm “fire & embers” accents; mobile-first and responsive (tested at 375 px and 1280 px)
Two services, based on the business's Instagram profile:

- **Shashlyk to order**: pick items by kg or by piece with +/− steppers, see the total, choose pickup or delivery
- **Event catering**: live calculator with guests (5–500, slider and number input stay in sync), event format and dish checkboxes

Also:

- Menu cards with category filter (meat, vegetables & sides, bakery, sauces), prices per kg or per piece
- Gallery with a dependency-free lightbox (keyboard arrows, Esc, swipe)
- One order form with a switch between the two services, client-side validation and a thank-you screen
- Orders are sent as a pre-filled Telegram message via a `t.me` link (no bot token in the frontend)

## File structure

```
index.html        page markup, SEO meta tags
styles.css        all styles
script.js         settings (prices, menu, gallery, Telegram) + logic
assets/
  favicon.svg
  og-image.png    social preview image (1200×630)
  menu/           put dish photos here
  gallery/        put gallery photos here
README.md
```

## How to open

Double-click `index.html`. It works straight from the file system.

To run a local server (optional):

```bash
python3 -m http.server 8765
```

Then open http://localhost:8765.

## Where to change things

All settings are at the top of **`script.js`**:

| What | Where |
|---|---|
| Prices (UAH per kg or per piece) | `PRICES` |
| Format surcharge (fixed UAH per event) | `FORMATS[].fee` |
| Items, unit (`кг`/`шт`), order step, photos | `MENU` (`img: 'assets/menu/file.jpg'` or `null` for a placeholder) |
| Amount per guest in the catering calculator | `MENU[].portion` (e.g. `0.25` kg of meat) |
| Dishes pre-selected in the calculator | `MENU[].default: true` |
| Gallery photos | `GALLERY` (`src: 'assets/gallery/file.jpg'` or `null`) |
| Telegram username that receives orders | `TELEGRAM_USERNAME` (without `@`) |
| Guest limits | `GUESTS_MIN`, `GUESTS_MAX` |

Catering formula: `price per guest × guests + format surcharge`,
where price per guest is the sum of `price × portion` for every selected item.

**Contacts** are in the `<footer>` of `index.html`. The phone number is taken from the business's Instagram bio.
**Reviews** are in the `#reviews` section of `index.html`.
**Hero photo**: replace the `.ph--hero` placeholder in `index.html` with
`<img src="assets/hero.jpg" alt="...">`.

If an image path is wrong, the site automatically shows a “фото” placeholder instead of a broken image.

### Telegram orders

On submit, the form builds the order text and opens
`https://t.me/<TELEGRAM_USERNAME>?text=<encoded text>`.
The customer only needs to press “Send” in Telegram.
While `TELEGRAM_USERNAME` is `YOUR_USERNAME`, Telegram is **not** opened (demo mode);
the link is logged to the browser console and the thank-you screen is shown.

## Publish on GitHub Pages

1. Create a new repository on GitHub and push these files to the `main` branch
   (`index.html` must be in the repository root).
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<user>.github.io/<repo>/`.
5. Update `og:image` in `index.html` to the full URL, e.g.
   `https://<user>.github.io/<repo>/assets/og-image.png`.

## What to replace before launch

- [ ] **Prices**: all values in `PRICES` are approximate (`// TODO`), no price list was provided
- [ ] **Menu**: items in `MENU` were inferred from Instagram videos (pork, ribs, steaks, shashlyk, grilled vegetables, bakery); sauces are examples
- [ ] **Portions per guest** (`MENU[].portion`) for the catering calculator
- [ ] **Delivery**: confirm it exists and add the delivery area and price
- [ ] **Format surcharges** in `FORMATS` (banquet 3000, BBQ buffet 2500 are approximate)
- [ ] **Photos**: every `img: null` in `MENU`, every `src: null` in `GALLERY`, and the hero placeholder
- [ ] **`og:image`**: swap for a real food photo (JPG 1200×630) and use an absolute URL
- [ ] **`TELEGRAM_USERNAME`** in `script.js`
- [ ] **Contacts** in the footer: add the city (phone is already real)
- [ ] **Reviews**: 3 placeholder cards in `#reviews`, replace with real ones (with the clients' consent)
- [ ] **Demo bar**: remove the block marked `<!-- remove before launch -->` at the top of `index.html`
