---
name: Mira K
description: "Painter's Field Kit: every painting is shown with the paint it was mixed from."
colors:
  spruce: "#27483B"
  on-deep: "#FFFFFF"
  gesso: "#F1F3EF"
  gesso-deep: "#E2E6E0"
  panel: "#FBFCFA"
  ivory-black: "#1C2421"
  graphite: "#4E5A55"
  pencil-line: "#C5CCC6"
  alizarin: "#A3271F"
  dark-ground: "#151B19"
  dark-ground-2: "#1E2623"
  dark-surface: "#232C29"
  dark-text: "#E9ECE6"
  dark-text-2: "#A9B4AE"
  dark-rule: "#37433E"
  dark-input-border: "#8C9892"
  dark-error: "#F0857C"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(2.25rem, 5.4vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.625rem, 3vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.6
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  action:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  pigment-note:
    fontFamily: "Nanum Pen Script, Bradley Hand, Segoe Print, cursive"
    fontSize: "1.4rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0"
spacing:
  s1: "0.25rem"
  s2: "0.5rem"
  s3: "0.75rem"
  s4: "1rem"
  s5: "1.5rem"
  s6: "2rem"
  s7: "3rem"
  s8: "4.5rem"
  gutter: "clamp(1rem, 4vw, 3rem)"
  wrap: "82rem"
components:
  button-primary:
    backgroundColor: "{colors.spruce}"
    textColor: "{colors.on-deep}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-black}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.4rem"
    height: "3rem"
  filter:
    backgroundColor: "transparent"
    textColor: "{colors.ivory-black}"
    rounded: "{rounded.none}"
    padding: "0.4rem 1rem"
    height: "2.75rem"
  filter-pressed:
    backgroundColor: "{colors.ivory-black}"
    textColor: "{colors.gesso}"
    rounded: "{rounded.none}"
    padding: "0.4rem 1rem"
    height: "2.75rem"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ivory-black}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0.65rem 0.8rem"
    height: "3rem"
  band:
    backgroundColor: "{colors.spruce}"
    textColor: "{colors.on-deep}"
    padding: "4.5rem clamp(1rem, 4vw, 3rem)"
  swatch-name:
    textColor: "{colors.graphite}"
    typography: "{typography.pigment-note}"
  painting:
    backgroundColor: "{colors.gesso-deep}"
    rounded: "{rounded.none}"
---

# Design System: Mira K

## Overview

**Creative North Star: "Painter's Field Kit"**

The site is a gessoed panel with a paint box open beside it. The ground is a cool white, the writing is ivory black, and the interface owns no accent of its own. All color on a page comes from the painting in view: its five pigments are laid down next to it as rough brushed swatches, each with its name penciled underneath in a pen script, and the darkest of the five inks the buttons and the home page band. Move to another painting and the page is mixed again from that painting's tubes.

Everything that is not paint stays quiet and square. One grotesque handles all type, from the headline to the price. Corners are sharp, rules are a pencil line, and the only things with depth are the paintings themselves, which lie on the panel with a soft shadow beneath them, and the one button that sells them. Density is low: a painting, its swatches, what it costs, one button.

The world was chosen over the white portfolio grid, where color belongs only to the images. Here the paint leaves the picture and reaches the page.

**Key Characteristics:**
- Cool gesso ground, ivory black ink, no fixed accent
- Five pigment swatches travel with every painting, as large brushed patches on feature views and as a thin chip strip on cards
- The darkest pigment of the painting in view is written to `--deep` and colors primary buttons, the band, the caret and the text selection
- One type family for everything; a pen script reserved for pigment names
- Square corners on all interface elements; only the swatches have a rough brushed edge
- Swatches brush in from left to right, one after another
- Light and dark schemes follow the visitor's system setting

## Colors

A neutral, slightly green gray scale from gesso to ivory black carries the whole interface; saturated color is borrowed from the catalog and never stored in the stylesheet.

### Primary
- **Spruce** (#27483B): the resting value of `--deep`, used for primary buttons, the band, the caret and text selection whenever no painting has claimed the page (About, Policies, Paintings index, Contact without a piece). On Home, a painting page, and Contact opened from a painting, `script.js` replaces it with that painting's darkest pigment.
- **On Deep** (#FFFFFF): text and focus outlines on any `--deep` fill, in both schemes.

### Neutral
- **Gesso** (#F1F3EF): the page ground.
- **Gesso Deep** (#E2E6E0): the second ground. Sits behind a painting while it loads, behind the to scale drawing, and fills the preview strip.
- **Panel** (#FBFCFA): the surface of text inputs and selects only. It is the one place lighter than the ground.
- **Ivory Black** (#1C2421): all primary text, the focus outline, the pressed filter fill, the quiet button border.
- **Graphite** (#4E5A55): secondary text (medium and size, notes, footer, sold state), penciled pigment names, and input borders.
- **Pencil Line** (#C5CCC6): hairline rules, resting filter borders, the footer rule.
- **Alizarin** (#A3271F): form errors only, as text and as a 2px input border.

### Dark scheme
Under `prefers-color-scheme: dark` the same roles are remapped: ground (#151B19), second ground (#1E2623), input surface (#232C29), text (#E9ECE6), secondary text (#A9B4AE), rule (#37433E), input border (#8C9892), error (#F0857C). `--deep` and On Deep do not change; the pigment keeps its true color on the dark ground, and primary buttons gain a 1px hairline (text color at 30 percent) so a near black pigment still reads as a button.

### Named Rules
**The Borrowed Color Rule.** The stylesheet holds neutrals, one error red and one fallback green. Every other color on screen is a pigment from `data/works.js`, and it appears only as a fill: a swatch, a chip, a button, the band. Pigments are never used as text color on the ground.

**The Deepest Pigment Rule.** `--deep` is the pigment with the lowest luminance among the five, and it is accepted only when white text on it reaches a contrast of 4.5 to 1. If no pigment qualifies, Spruce stays. Never set `--deep` by hand to a color that fails this test.

**The Ink For State Rule.** Selected, pressed, focused and checked states are drawn in the text color (Ivory Black in light, its counterpart in dark), not in pigment. Pigment marks the way to a purchase; ink marks where you are.

## Typography

**Display Font:** Bricolage Grotesque, self hosted variable file (weight 200 to 800, width 75 to 100 percent), with ui-sans-serif and system-ui as fallbacks
**Body Font:** Bricolage Grotesque
**Label/Mono Font:** none. Nanum Pen Script (with Bradley Hand, Segoe Print, cursive) is a note hand, used for pigment names only.

**Character:** One warm, slightly irregular grotesque set tight and heavy for headings and open for reading, so the type feels drawn by the same hand as the labels on a paint box without competing with the paintings. The pen script is the pencil in the kit: it writes pigment names and nothing else.

### Hierarchy
- **Display** (600, clamp(2.25rem, 5.4vw, 4.5rem), line height 1.04, tracking -0.028em, balanced wrap): page titles. The home headline scales to its own column (14cqi, capped at 4.75rem); a painting's title on its own page is one step smaller (clamp(2rem, 4vw, 3.25rem)).
- **Headline** (600, clamp(1.625rem, 3vw, 2.5rem), line height 1.04, tracking -0.028em): section headings. Inside the band and beside the hero painting it is reduced by about a fifth; in long policy text it is fixed at 1.5rem.
- **Title** (600, 1.1875rem, tracking -0.015em): a painting's title under its card (1.0625rem on small phones). The same weight at 1.0625rem with no tracking heads small groups such as "The original", "Prints" and "Mixed from".
- **Body** (400, 1.0625rem, line height 1.6, pretty wrap): all running text, capped at 68ch. Prices are body size at weight 500; navigation is weight 500.
- **Label** (400, 0.9375rem, line height 1.45): medium and size lines, buy notes, captions, field errors, the footer. The preview strip is 0.875rem.
- **Action** (600, 1.0625rem, line height 1.2): button text. Filters are 500 at 1rem.
- **Pigment Note** (Nanum Pen Script 400, 1.4rem, line height 1, Graphite): the name under a swatch. In tight five column rows it drops to about 1.2rem and may wrap to two lines.

### Named Rules
**The One Hand Rule.** Bricolage Grotesque sets every word of interface and content. Hierarchy comes from size and from three weights (400, 500, 600, with 700 for the wordmark alone), never from a second family, capitals, or wide tracking.

**The Pencil Rule.** Nanum Pen Script writes pigment names under swatches. It is never used for headings, prices, buttons, quotes or decoration.

## Layout

A single centered column up to 82rem wide with a fluid gutter (clamp(1rem, 4vw, 3rem)). Spacing runs on a nine step rem scale from 0.25rem to 4.5rem in use; sections are separated by 4.5rem of vertical padding (3rem on small phones), headings sit 2rem above their content, and stacked text uses 1rem between paragraphs. Reading pages (About, Contact, Policies) narrow to 44rem and stay left aligned in the column.

- **Painting first compositions.** On Home the painting takes up to 56 percent of the row at a height tied to the viewport (min(66dvh, 42rem) times its aspect ratio), a 9.5rem column of its swatches stands beside it at full painting height, and the headline and piece details fill the rest. On a painting page the picture holds a sticky left column (1.35 to 1 against the details, never taller than 84dvh) while the details scroll.
- **Paintings at true proportion.** Paintings are never cropped to a common ratio. The index is a masonry of CSS columns (three at 17rem minimum, 2rem apart, 3rem between cards), so tall and wide pieces keep their shape.
- **The band.** One full bleed section per page at most, filled with `--deep`, holding two equal text columns.
- **Breakpoints.** Below 60rem the hero and the painting page stack to one column (headline, painting, swatches as a row of five, details) and the sticky figure is released. Below 44rem the masonry drops to two columns 1rem apart, the band and the staples palette go to one and two columns, and buttons may wrap their label.
- **Touch.** Buttons are 3rem tall, filters and the checkbox row 2.75rem, navigation links are padded to a comparable height.

## Elevation & Depth

Flat ground, lifted objects. The page itself has no layers, cards have no panels, and nothing floats above anything else. Depth is reserved for the two things a visitor can take home or press: a painting, which rests on the panel with a contact line and a soft shadow pulled tight underneath it, and the primary button. Shadows are tinted with the ink color in light (28 36 33) and are pure black in dark.

### Shadow Vocabulary
- **Painting at rest** (`box-shadow: 0 1px 0 rgb(var(--shadow) / .18), 0 22px 34px -20px rgb(var(--shadow) / .5)`): every painting image.
- **Painting on hover** (`box-shadow: 0 1px 0 rgb(var(--shadow) / .18), 0 30px 40px -22px rgb(var(--shadow) / .6)`): a card's painting on hover. The shadow deepens; nothing moves.
- **Button at rest** (`box-shadow: 0 8px 16px -10px rgb(var(--shadow) / .55)`): primary buttons.
- **Button hover** (`box-shadow: 0 12px 22px -10px rgb(var(--shadow) / .7)` with a 1px rise); pressed, the button drops 1px and loses its shadow.
- **Swatch edge** (`box-shadow: inset 0 0 0 1px` in the text color at 16 percent): keeps pale pigments visible on the ground. Not elevation.

### Named Rules
**The Only Paintings Lift Rule.** A soft shadow means "this is an object": a painting or the button that buys one. Text blocks, the band, inputs, filters and the footer stay flat on the ground.

## Shapes

Square. Every interface element has a radius of 0: buttons, filters, inputs, selects, paintings, the band, chips. Borders are 1px hairlines (2px only for an invalid input and for underlines on hover or the current page).

The single exception is paint. Each swatch is a pigment fill cut by one of three brush stroke masks in `images/strokes/` (a loaded start, clean long edges, a dry broken tail), with a 1px drop shadow for the thickness of the paint. Swatches sit together on a swatch card: a light paper panel (`--card`) with a hairline border that stays light in the dark scheme, so black and white pigments both read. Every stroke in a row has the same 3 to 2 proportion and names wrap beneath. The stroke masks are drawn stand-ins until real strokes are photographed.

**The Paint Is The Only Rough Edge Rule.** If it is interface, its corners are square and its edges straight. If it is a swatch of paint large enough to hold the filter (2.5rem or taller), its edge is brushed. Nothing is rounded.

## Components

### Buttons
- **Shape:** square (0 radius), 3rem tall, padding 0.7rem by 1.4rem, label in Action type on one line (allowed to wrap below 44rem).
- **Primary:** `--deep` fill with white text and the button shadow. In the dark scheme the fill becomes the text color with ground colored text, because the deepest pigment is often near black.
- **Hover / Active / Disabled:** rises 1px with a deeper shadow; pressed, sinks 1px with no shadow; disabled, 60 percent opacity. The color does not change on hover.
- **Quiet:** transparent with a 1px border and text in the text color, no shadow. Used for secondary actions such as resetting the filters.
- **Labels** say exactly what happens and what it costs: "Buy the original for $1,800", "Ask to buy the 8 x 10 in print for $40", "View painting".

### Filters
- **Style:** square toggle buttons, 2.75rem tall, transparent with a Pencil Line border, weight 500.
- **State:** hover darkens the border to the text color; pressed is a solid text color fill with ground colored text. A native checkbox with the text color as its accent sits in the same row.

### Painting Cards
- **Structure:** one link containing the painting at its true proportion, a strip of five pigment chips 0.6rem tall and 3px apart, the title, a medium and size line in Graphite, and price lines.
- **Background and border:** none. The card is the painting and the words under it.
- **Hover:** the painting's shadow deepens. Nothing moves.
- **Sold:** the price line reads "Original sold" in Graphite. No badge, ribbon or overlay touches the image.

### Swatches (signature)
- **Style:** a brushed patch of the pigment with its name penciled beneath in the Pigment Note hand. Appears as a full height column beside the hero painting, a row of five on a painting page and on small screens, and a four by two grid for the artist's staple palette.
- **Motion, "Loading the palette":** each patch is revealed by a left to right clip wipe (0.55s, cubic-bezier(.16, 1, .3, 1)), staggered 90ms per swatch after a 120ms delay. This is the site's only entrance animation.
- **Data:** five pigments per painting, each a name and a hex, in `data/works.js`.

### Inputs / Fields
- **Style:** Panel fill, 1px Graphite border, square, 3rem minimum height, label above in weight 600. Textareas start at 9rem.
- **Focus:** a 2px outline in the text color, offset 1px (3px on links and buttons). On the band the outline is white.
- **Error:** the border becomes 2px Alizarin and a message in Alizarin at Label size, weight 500, appears under the field.

### Navigation
- **Header:** the wordmark (weight 700, 1.375rem, tracking -0.03em) at left and three text links at right, weight 500, no underline at rest. Hover and the current page get a 2px underline set 0.4em below the text. There is no menu button at any width; the three links always fit.
- **Footer:** a hairline rule, then one row of Graphite text at Label size that wraps on small screens.
- **Links in text** are underlined at 1px and thicken to 2px on hover; they keep the surrounding text color.

### The Band
A full bleed section filled with `--deep`, white text, two columns that stack below 44rem. Selection and focus colors invert inside it.

### Scale Drawing
On a painting page, the painting is placed to scale over a thin line drawing of a 7 foot sofa on a Gesso Deep field, with a one line caption. The drawing is stroked in the text color at hairline weight.

## Do's and Don'ts

### Do:
- **Do** show a painting's five pigments wherever the painting appears: brushed swatches with penciled names on feature views, the chip strip on cards.
- **Do** let `script.js` set `--deep` from the painting in view, and use `--deep` with white text for primary buttons and the band.
- **Do** keep every interface corner at 0 radius and every rule at 1px.
- **Do** show paintings whole, at their true proportion, with the painting shadow beneath them.
- **Do** write button labels that name the item and the price.
- **Do** draw selected, pressed and focused states in the text color.
- **Do** define both schemes for any new neutral, and check a new pigment set on the dark ground as well as the light one.
- **Do** keep entrance motion to the brush wipe, and honor `prefers-reduced-motion`, which turns all animation and transitions off.

### Don't:
- **Don't** add a fixed brand accent to the stylesheet. Spruce is a fallback for pages with no painting, not a brand color to spread.
- **Don't** use pigment colors as text on the ground, or tint the ground itself with them.
- **Don't** set Nanum Pen Script on anything except pigment names.
- **Don't** round corners, and don't apply the brush filter to anything that is not a swatch of paint.
- **Don't** crop paintings to a uniform ratio, or put badges, ribbons or overlays on the image.
- **Don't** give cards, text blocks or sections a panel background or a shadow. Only paintings and the primary button lift.
- **Don't** add scroll reveals, parallax or fades. Apart from the brush wipe, movement is limited to a rise of 1 to 3px on hover.
- **Don't** use Alizarin for anything but form errors.


## Changes after the finish review (Nov 13 2026)

- Motion: the brush wipe is the only motion. Swatch cards and chip rows brush in when they scroll into view (IntersectionObserver in `script.js`); hover lifts were removed.
- Home: the headline runs across the top; the painting, swatch card and details sit beneath. A tall painting is narrower than a wide one so the whole piece always fits above the fold.
- Painting page: the swatch card sits directly under the painting, ahead of the buy panel. The buy panel and the to scale sofa drawing take a tint of the painting's middle pigment (`--mid`, set by `script.js`).
- Sales claims (signed, insured shipping, archival paper) live in `SITE` in `data/works.js`, not in the pages.

## The walk-through gallery (added Nov 13 2026, owner request)

The home page is a 3D gallery: off-white walls (#EFEEEA), a gray floor (#8F908D), a pale ceiling with white light panels, thin charcoal frames (#232423) and a soft shadow behind each frame. Room names are set on the walls in Bricolage Grotesque. Overlay controls (room switcher, painting card, hint) are sharp cornered light panels with Ivory Black for the current room and the primary button. Motion here is the camera: it walks through doorways between rooms and steps up to a painting; with reduced motion it cuts through a short fade instead. The owner asked for a very modern look in off-white and grays, so the gallery uses no pigment color of its own; the paintings supply it.

Realism pass (same day, owner request): walls carry baked light (a warm pool from the track spot over each painting, frame shadows, darker corners, fine plaster grain); the floor is polished concrete with a soft reflection of the room; ceilings have recessed light slots and black track rails with a spot aimed at each painting; paintings sit in dark float frames with a small wall label; each room has skirting and an oak bench on steel legs.
