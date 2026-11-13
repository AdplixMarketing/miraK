/*
  THE CATALOG. This is the only file you edit to add, change or sell a piece.

  Newest piece goes FIRST. The first piece in the list is the big one on the home page.

  For each piece:
    id        short name used in the web address, lowercase with hyphens, never reuse one
    title     the title of the piece
    year      year it was finished
    subject   which gallery room the piece hangs in. Must match one of the room names
              in SITE.rooms below: "Landscapes", "Portraits" or "Icons"
    medium    for example "Oil on canvas"
    size      width and height of the original in inches
    image     path to the photo, put photos in images/works/
    alt       one sentence describing the picture for people who cannot see it
    pigments  the five main paint colors in the piece, each with its name and color code.
              These are the swatches shown beside the painting, and the darkest one
              colors the buttons on that painting's page.
    story     a few sentences from the artist about the piece
    original  price in dollars, sold true or false, and the Stripe Payment Link
              (remove the whole "original" block if only prints are for sale)
    prints    list of print sizes, each with a price and its own Stripe Payment Link
              (use [] if there are no prints)

  When an original sells, change sold to true. Until a Stripe link is pasted in,
  the Buy button sends people to the contact form with the piece filled in.
*/

window.SITE = {
  artist: "Mira K",
  // The contact form sends to this address through formsubmit.co. Leave "" until she has one.
  email: "",
  instagram: "",
  // true shows the "sample artwork" strip at the top of every page. Set false at launch.
  preview: true,

  // The rooms of the 3D gallery on the home page, in walking order. Each painting's
  // "subject" puts it in one of these rooms. A room holds up to 10 paintings (newest first);
  // any beyond that still appear on the Paintings page.
  rooms: ["Landscapes", "Portraits", "Icons"],

  // Gallery lighting: "dim" lowers the room lights and puts a spotlight on every painting.
  // "bright" gives an evenly lit white room.
  galleryLights: "dim",

  // SAMPLE SALES CLAIMS. Confirm each one with the artist or rewrite it before launch.
  originalNote: "One of a kind and signed by the artist.",
  originalsBlurb: "Each original is the one and only. It is signed, packed by hand and shipped insured. Once it sells, it is gone.",
  printsBlurb: "Many paintings also come as prints in a few sizes, made on heavy archival paper so the colors hold for decades."
};

window.WORKS = [
  {
    id: "juniper",
    title: "Juniper",
    year: 2026,
    subject: "Portraits",
    medium: "Oil on panel",
    size: { w: 16, h: 20 },
    image: "images/works/juniper.svg",
    alt: "Portrait of a golden dog with soft ears against a deep green background.",
    pigments: [
      { name: "Viridian deep", hex: "#23463B" },
      { name: "Sap green", hex: "#3C6A58" },
      { name: "Yellow ochre", hex: "#C98F3C" },
      { name: "Raw sienna", hex: "#A66E2A" },
      { name: "Naples yellow", hex: "#E9C98C" }
    ],
    story: "Juniper sat for about four minutes in total, spread across an afternoon. The rest came from photographs and from knowing exactly how she looks when someone opens the treat drawer.",
    original: { price: 950, sold: true, link: "" },
    prints: [
      { size: "8 x 10 in", price: 40, link: "" },
      { size: "11 x 14 in", price: 65, link: "" }
    ]
  },
  {
    id: "ridge-above-the-treeline",
    title: "Ridge Above the Treeline",
    year: 2026,
    subject: "Landscapes",
    medium: "Oil on canvas",
    size: { w: 36, h: 24 },
    image: "images/works/ridge-above-the-treeline.svg",
    alt: "Layered blue and green mountain ridges under a pale morning sky.",
    pigments: [
      { name: "Buff titanium", hex: "#F1E3CF" },
      { name: "Cerulean gray", hex: "#A9BEC6" },
      { name: "Cobalt teal", hex: "#5B7F8A" },
      { name: "Viridian gray", hex: "#3F6465" },
      { name: "Perylene green", hex: "#1D332B" }
    ],
    story: "Painted from sketches made on a cold morning after the climb out of the trees. The ridges kept stacking up behind each other until the farthest one was barely darker than the sky.",
    original: { price: 1800, sold: false, link: "" },
    prints: [
      { size: "12 x 8 in", price: 45, link: "" },
      { size: "18 x 12 in", price: 80, link: "" },
      { size: "30 x 20 in", price: 160, link: "" }
    ]
  },
  {
    id: "still-water-early",
    title: "Still Water, Early",
    year: 2026,
    subject: "Landscapes",
    medium: "Acrylic on canvas",
    size: { w: 24, h: 18 },
    image: "images/works/still-water-early.svg",
    alt: "A calm lake below dark spruce hills with a low sun in a peach sky.",
    pigments: [
      { name: "Naples yellow light", hex: "#F6DDB8" },
      { name: "Cadmium orange tint", hex: "#E9B48C" },
      { name: "Cobalt teal", hex: "#6F8E93" },
      { name: "Terre verte", hex: "#55706A" },
      { name: "Perylene green", hex: "#1B3229" }
    ],
    story: "The lake was flat for about ten minutes before the wind found it. This is those ten minutes.",
    original: { price: 1200, sold: false, link: "" },
    prints: [
      { size: "12 x 9 in", price: 45, link: "" },
      { size: "16 x 12 in", price: 70, link: "" }
    ]
  },
  {
    id: "old-biscuit-waiting",
    title: "Old Biscuit, Waiting",
    year: 2025,
    subject: "Portraits",
    medium: "Oil on panel",
    size: { w: 11, h: 14 },
    image: "images/works/old-biscuit-waiting.svg",
    alt: "Portrait of a black and white dog with upright ears against a rust background.",
    pigments: [
      { name: "Burnt sienna", hex: "#A9532F" },
      { name: "Raw sienna", hex: "#C97A4B" },
      { name: "Titanium white", hex: "#EFEAE0" },
      { name: "Ivory black", hex: "#22201F" },
      { name: "Mars black", hex: "#151413" }
    ],
    story: "Biscuit waits by the door from about three o'clock every day. He is fourteen and has earned the right to be early.",
    original: { price: 700, sold: false, link: "" },
    prints: [
      { size: "8 x 10 in", price: 40, link: "" }
    ]
  },
  {
    id: "burn-scar-second-spring",
    title: "Burn Scar, Second Spring",
    year: 2025,
    subject: "Landscapes",
    medium: "Oil on canvas",
    size: { w: 20, h: 20 },
    image: "images/works/burn-scar-second-spring.svg",
    alt: "Rust and ochre hills with new green growth along the nearest slope.",
    pigments: [
      { name: "Yellow ochre", hex: "#B98A5E" },
      { name: "Burnt sienna", hex: "#9A5B3A" },
      { name: "Indian red", hex: "#6E3B2A" },
      { name: "Burnt umber", hex: "#4A2B24" },
      { name: "Sap green", hex: "#5E7B3A" }
    ],
    story: "Two years after the fire the hillside was still mostly rust and charcoal, and then all this green was coming up through it.",
    original: { price: 1100, sold: false, link: "" },
    prints: []
  },
  {
    id: "first-snow-on-the-pass",
    title: "First Snow on the Pass",
    year: 2025,
    subject: "Landscapes",
    medium: "Acrylic on canvas",
    size: { w: 30, h: 20 },
    image: "images/works/first-snow-on-the-pass.svg",
    alt: "Pale snow covered ridges in gray and blue under an overcast sky.",
    pigments: [
      { name: "Titanium white", hex: "#F2F4F2" },
      { name: "Davy gray", hex: "#C6CED1" },
      { name: "Cerulean gray", hex: "#9FB0B8" },
      { name: "Payne gray", hex: "#6F8590" },
      { name: "Indigo", hex: "#2A3A3F" }
    ],
    story: "The first snow came overnight in September and was gone by lunch. I had the whole pass to myself.",
    original: { price: 1500, sold: true, link: "" },
    prints: [
      { size: "12 x 8 in", price: 45, link: "" },
      { size: "18 x 12 in", price: 80, link: "" }
    ]
  },
  {
    id: "icon-study-vermilion",
    title: "Icon Study in Vermilion",
    year: 2026,
    subject: "Icons",
    medium: "Egg tempera and gold leaf on panel",
    size: { w: 12, h: 16 },
    image: "images/works/icon-study-vermilion.svg",
    alt: "A haloed figure in a red robe on a gold ground with a dark red border.",
    pigments: [
      { name: "Gold ochre", hex: "#C9A24A" },
      { name: "Vermilion", hex: "#9B2D20" },
      { name: "Ultramarine", hex: "#1F3A5C" },
      { name: "Raw umber", hex: "#4A2F22" },
      { name: "Flesh ochre", hex: "#B9854F" }
    ],
    story: "Painted the traditional way, in thin layers of egg tempera over a gessoed panel, with gold leaf laid first.",
    original: { price: 1400, sold: false, link: "" },
    prints: []
  },
  {
    id: "icon-study-ultramarine",
    title: "Icon Study in Ultramarine",
    year: 2025,
    subject: "Icons",
    medium: "Egg tempera and gold leaf on panel",
    size: { w: 12, h: 16 },
    image: "images/works/icon-study-ultramarine.svg",
    alt: "A haloed figure in a deep blue robe on a gold ground with a dark red border.",
    pigments: [
      { name: "Gold ochre", hex: "#C9A24A" },
      { name: "Ultramarine", hex: "#1F3A5C" },
      { name: "Vermilion", hex: "#9B2D20" },
      { name: "Raw umber", hex: "#3A2A22" },
      { name: "Flesh ochre", hex: "#B9854F" }
    ],
    story: "The blue is built up from dark to light, the way icon painters have worked for centuries.",
    original: { price: 1400, sold: false, link: "" },
    prints: [
      { size: "9 x 12 in", price: 50, link: "" }
    ]
  },
  {
    id: "icon-study-olive",
    title: "Small Icon Study in Olive",
    year: 2025,
    subject: "Icons",
    medium: "Egg tempera and gold leaf on panel",
    size: { w: 9, h: 12 },
    image: "images/works/icon-study-olive.svg",
    alt: "A haloed figure in an olive green robe on a gold ground with a dark red border.",
    pigments: [
      { name: "Gold ochre", hex: "#C9A24A" },
      { name: "Olive green", hex: "#4E5A32" },
      { name: "Red ochre", hex: "#7A2B1D" },
      { name: "Raw umber", hex: "#5A4A3A" },
      { name: "Flesh ochre", hex: "#B9854F" }
    ],
    story: "A small panel made for a shelf or a prayer corner.",
    original: { price: 850, sold: true, link: "" },
    prints: []
  }
];
