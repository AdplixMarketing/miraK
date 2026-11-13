# Mira K

Website for the painter Mira K: a gallery of her paintings where each piece can be bought as an original or a print.

Plain HTML, CSS and JavaScript. No build step. Open `index.html` through any web server, or deploy the folder as is (for example on Vercel).

## The 3D gallery

The home page is a walk-through gallery (`gallery.js`, using the three.js library in `vendor/`). Its rooms are listed in `SITE.rooms` in `data/works.js`, and each painting's `subject` decides which room it hangs in. A room shows up to 10 paintings, newest first; the Paintings page always shows everything. Paintings hang at their true proportions to each other, enlarged so they read on a screen. Lighting is set by `galleryLights` in `data/works.js`: `"dim"` lowers the room and spotlights each painting, `"bright"` is an evenly lit white room. If a browser cannot run 3D, visitors get a link to the Paintings page instead. The wall lighting (spotlight pools, frame shadows, corner shading) is drawn once when the page loads, so it stays fast on phones. The concrete floor texture in `images/gallery/` is from Poly Haven and is free to use (CC0).

## Everyday jobs

Everything about the paintings lives in one file: `data/works.js`. The top of that file explains every field.

**Add a painting**
1. Put the photo in `images/works/`.
2. Copy one block in `data/works.js`, paste it at the top of the list and fill it in. The first painting in the list is the big one on the home page.
3. Pick the five main colors of the painting for `pigments`. They become the swatches beside it, and the darkest one colors the buttons on its page.

**Take payments**
1. In Stripe, create a Payment Link for the piece (for an original, limit the link to 1 payment so it cannot sell twice).
2. Paste the link into `link` for the original or for a print size.
Until a link is pasted in, the button says "Ask to buy" and opens the contact form with the piece filled in.

**Mark an original as sold**: change `sold: false` to `sold: true`.

**Turn on the contact form**: put her email in `SITE.email` in `data/works.js`. The first message triggers a confirmation email from formsubmit.co that she has to click once.

**Before launch**
- Replace the sample paintings, prices and text (About, Shipping and returns).
- Confirm or rewrite the sample sales claims at the top of `data/works.js` (signed, insured shipping, archival paper).
- The brush strokes in `images/strokes/` are drawn stand-ins. Photos of five real strokes she paints on white card would look better.
- Set `preview: false` in `data/works.js` to remove the "Preview site" strip.
- Edit `robots.txt` so search engines are allowed in (it blocks them while the content is sample).

## Files

- `index.html`, `paintings.html`, `work.html`, `about.html`, `contact.html`, `policies.html`: the pages
- `styles.css`: all styling, colors and sizes are named at the top
- `script.js`: draws the pages from the catalog
- `gallery.js`, `vendor/three.module.min.js`: the 3D gallery on the home page
- `PRODUCT.md`, `.impeccable/`: design notes for whoever works on the site next
