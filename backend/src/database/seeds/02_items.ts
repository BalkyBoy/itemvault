import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

const SEED_USER = {
  email: 'seed@dufil.dev',
  password: 'password123',
  first_name: 'Seed',
  last_name: 'User',
};

const ITEMS_BY_CATEGORY: Record<string, { name: string; description: string }[]> = {
  Electronics: [
    { name: 'Wireless Mechanical Keyboard', description: 'Compact 75% layout with tactile switches, RGB backlight, and 3-mode connectivity.' },
    { name: 'Noise-Cancelling Headphones', description: '40-hour battery life, active noise cancellation, foldable design for travel.' },
    { name: '4K USB-C Monitor', description: '27-inch IPS panel with 144Hz refresh rate and USB-C power delivery.' },
    { name: 'Portable SSD 1TB', description: 'NVMe speeds up to 1050MB/s in a pocket-sized aluminium enclosure.' },
    { name: 'Smart Home Hub', description: 'Controls up to 100 devices via Wi-Fi, Zigbee, and Z-Wave protocols.' },
    { name: 'Wireless Charging Pad', description: '15W fast wireless charging compatible with Qi-enabled devices.' },
    { name: 'Mechanical Numpad', description: 'Standalone numpad with hot-swap sockets and per-key RGB lighting.' },
    { name: 'Webcam 4K', description: 'Auto-focus 4K webcam with built-in ring light and privacy shutter.' },
    { name: 'USB-C Docking Station', description: '12-in-1 hub with dual HDMI, Ethernet, SD card, and 100W PD.' },
    { name: 'Smart LED Strip 5m', description: 'RGBIC addressable LED strip with music sync and app control.' },
    { name: 'Bluetooth Speaker', description: 'IPX7 waterproof portable speaker with 360° sound and 24h battery.' },
    { name: 'Graphic Tablet', description: 'A5 drawing tablet with 8192 pressure levels and tilt recognition.' },
  ],
  Furniture: [
    { name: 'Standing Desk Converter', description: 'Adjustable sit-stand riser with dual monitor support and cable management.' },
    { name: 'Ergonomic Office Chair', description: 'Lumbar support, adjustable armrests, breathable mesh back for long sessions.' },
    { name: 'Floating Wall Shelf Set', description: 'Set of 3 oak-finish shelves with invisible brackets, holds up to 15kg each.' },
    { name: 'Foldable Laptop Stand', description: 'Aluminium adjustable stand with 6 height levels and ventilation slots.' },
    { name: 'Bookcase 5-Tier', description: 'Industrial-style open bookcase in black metal and walnut wood finish.' },
    { name: 'Monitor Arm Dual', description: 'Full-motion dual monitor arm with cable management and VESA 75/100 support.' },
    { name: 'Bean Bag Chair', description: 'Extra-large memory foam bean bag with washable velvet cover.' },
    { name: 'Bedside Table', description: 'Minimalist nightstand with wireless charging pad and USB port built in.' },
    { name: 'TV Stand with Storage', description: 'Low-profile media console for TVs up to 75 inches with tempered glass doors.' },
    { name: 'Folding Desk', description: 'Wall-mounted fold-down desk ideal for small spaces, 90×45cm surface.' },
  ],
  Books: [
    { name: 'Clean Code', description: 'Robert C. Martin\'s guide to writing readable, maintainable software.' },
    { name: 'The Pragmatic Programmer', description: 'Timeless advice for software craftspeople from Hunt and Thomas.' },
    { name: 'Designing Data-Intensive Applications', description: 'Deep dive into distributed systems, databases, and data engineering.' },
    { name: 'Atomic Habits', description: 'James Clear\'s framework for building good habits and breaking bad ones.' },
    { name: 'Deep Work', description: 'Cal Newport on the value of focused, distraction-free professional work.' },
    { name: 'The Lean Startup', description: 'Eric Ries on building products iteratively with validated learning.' },
    { name: 'System Design Interview Vol. 2', description: 'Advanced system design patterns and interview preparation guide.' },
    { name: 'JavaScript: The Good Parts', description: 'Douglas Crockford\'s concise guide to the best features of JavaScript.' },
    { name: 'You Don\'t Know JS', description: 'Kyle Simpson\'s deep-dive series into JavaScript\'s core mechanisms.' },
    { name: 'The Psychology of Money', description: 'Morgan Housel on timeless lessons about wealth, greed, and happiness.' },
  ],
  Clothing: [
    { name: 'Merino Wool Hoodie', description: 'Lightweight 100% merino wool hoodie, odour-resistant and temperature-regulating.' },
    { name: 'Slim Fit Chinos', description: 'Stretch cotton chinos in a modern slim fit, available in 6 colours.' },
    { name: 'Linen Button-Down Shirt', description: 'Breathable linen shirt perfect for warm weather, relaxed fit.' },
    { name: 'Waterproof Softshell Jacket', description: '3-layer softshell with DWR coating, windproof and breathable.' },
    { name: 'Graphic Tee Pack (3)', description: 'Set of 3 premium cotton graphic tees with minimalist designs.' },
    { name: 'Fleece Quarter-Zip', description: 'Anti-pill fleece quarter-zip in a relaxed fit, ideal for layering.' },
    { name: 'Cargo Shorts', description: 'Durable ripstop cargo shorts with 6 pockets and adjustable waistband.' },
    { name: 'Thermal Base Layer Set', description: 'Moisture-wicking thermal top and bottom for cold weather activities.' },
    { name: 'Denim Jacket', description: 'Classic washed denim jacket with a slightly oversized fit.' },
    { name: 'Polo Shirt', description: 'Piqué cotton polo with embroidered logo, wrinkle-resistant fabric.' },
  ],
  'Shoes & Footwear': [
    { name: 'Trail Running Shoes', description: 'Aggressive lugged outsole, rock plate, and breathable mesh upper.' },
    { name: 'Leather Chelsea Boots', description: 'Full-grain leather Chelsea boots with elastic side panels and stacked heel.' },
    { name: 'Minimalist Sneakers', description: 'Zero-drop sole, wide toe box, and recycled canvas upper.' },
    { name: 'Waterproof Hiking Boots', description: 'Gore-Tex lined mid-cut boots with Vibram outsole for all-terrain grip.' },
    { name: 'Slip-On Loafers', description: 'Suede loafers with memory foam insole and flexible rubber sole.' },
    { name: 'High-Top Basketball Shoes', description: 'Ankle support, responsive cushioning, and herringbone traction pattern.' },
    { name: 'Sandals with Arch Support', description: 'Orthopedic footbed sandals with adjustable straps and cork midsole.' },
    { name: 'Wool Slippers', description: 'Machine-washable merino wool slippers with non-slip rubber sole.' },
  ],
  'Sports & Outdoors': [
    { name: 'Adjustable Dumbbell Set', description: 'Quick-select 5–52.5 lb adjustable dumbbells replacing 15 pairs.' },
    { name: 'Yoga Mat Premium', description: '6mm thick non-slip natural rubber yoga mat with alignment lines.' },
    { name: 'Resistance Band Set', description: 'Set of 5 fabric resistance bands with door anchor and carry bag.' },
    { name: 'Camping Hammock', description: 'Lightweight nylon hammock with tree straps, holds up to 150kg.' },
    { name: 'Hydration Backpack 15L', description: '2L water bladder, multiple pockets, and reflective strips for trail running.' },
    { name: 'Foam Roller', description: 'High-density EVA foam roller for myofascial release and recovery.' },
    { name: 'Trekking Poles', description: 'Collapsible carbon fibre poles with cork grips and tungsten tips.' },
    { name: 'Pull-Up Bar Doorframe', description: 'No-screw doorframe pull-up bar with multiple grip positions.' },
    { name: 'Cycling Helmet', description: 'MIPS-equipped road helmet with 18 vents and magnetic buckle.' },
    { name: 'Sleeping Bag -10°C', description: 'Down-filled mummy sleeping bag rated to -10°C, 800g packed weight.' },
  ],
  'Home & Kitchen': [
    { name: 'Pour-Over Coffee Set', description: 'Borosilicate glass dripper, gooseneck kettle, and server set.' },
    { name: 'Cast Iron Skillet 12"', description: 'Pre-seasoned cast iron skillet compatible with all cooktops including induction.' },
    { name: 'Air Purifier HEPA', description: 'True HEPA + activated carbon filter, covers 50m², whisper-quiet at night.' },
    { name: 'Sous Vide Precision Cooker', description: '1200W immersion circulator with Wi-Fi control and ±0.1°C accuracy.' },
    { name: 'Bamboo Cutting Board Set', description: 'Set of 3 end-grain bamboo boards with juice groove and non-slip feet.' },
    { name: 'Espresso Machine', description: '15-bar pump espresso machine with steam wand and PID temperature control.' },
    { name: 'Knife Set 8-Piece', description: 'German high-carbon steel knives with full-tang handles and wooden block.' },
    { name: 'Instant Pot 7-in-1', description: 'Multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, and more.' },
    { name: 'Ceramic Non-Stick Pan Set', description: 'PFOA-free ceramic coating, oven-safe to 260°C, dishwasher safe.' },
    { name: 'Smart Thermostat', description: 'Learning thermostat with geofencing, energy reports, and voice control.' },
  ],
  'Toys & Games': [
    { name: 'LEGO Architecture Set', description: '1,500-piece skyline set with detailed miniature buildings from world cities.' },
    { name: 'Board Game: Catan', description: 'Classic resource-trading strategy game for 3–4 players, ages 10+.' },
    { name: 'RC Drone with Camera', description: '4K stabilised camera drone with 30-min flight time and obstacle avoidance.' },
    { name: 'Puzzle 1000 Pieces', description: 'High-quality jigsaw puzzle with a detailed world map illustration.' },
    { name: 'Card Game: Exploding Kittens', description: 'Fast-paced strategic card game for 2–5 players, ages 7+.' },
    { name: 'Wooden Chess Set', description: 'Handcrafted walnut and maple chess set with weighted pieces.' },
    { name: 'Magnetic Building Tiles', description: '110-piece magnetic tile set for open-ended creative building.' },
    { name: 'Tabletop RPG Starter Set', description: 'Complete beginner\'s kit with rulebook, dice, and pre-made adventure.' },
  ],
  'Health & Beauty': [
    { name: 'Electric Toothbrush', description: 'Sonic toothbrush with 5 modes, pressure sensor, and 3-week battery.' },
    { name: 'Vitamin D3 + K2 Supplement', description: '5000 IU D3 with 100mcg K2 MK-7 for optimal absorption, 180 capsules.' },
    { name: 'Facial Gua Sha Set', description: 'Rose quartz gua sha and jade roller set for lymphatic drainage.' },
    { name: 'Resistance Training Gloves', description: 'Padded palm gloves with wrist support for weightlifting.' },
    { name: 'Aromatherapy Diffuser', description: 'Ultrasonic essential oil diffuser with 7-colour LED and timer.' },
    { name: 'Collagen Peptides Powder', description: 'Unflavoured hydrolysed collagen powder, mixes instantly in hot or cold drinks.' },
    { name: 'Massage Gun', description: 'Percussive therapy device with 6 attachments and 5 speed settings.' },
    { name: 'Sunscreen SPF 50+', description: 'Lightweight mineral sunscreen with zinc oxide, reef-safe formula.' },
  ],
  Automotive: [
    { name: 'Dash Cam 4K', description: 'Front and rear 4K dash cam with night vision, GPS, and parking mode.' },
    { name: 'Car Phone Mount', description: 'MagSafe-compatible magnetic vent mount with 15W wireless charging.' },
    { name: 'Tyre Inflator Portable', description: 'Cordless digital tyre inflator with auto shut-off and LED light.' },
    { name: 'Car Vacuum Cleaner', description: 'Handheld 12V wet/dry car vacuum with HEPA filter and 5m cord.' },
    { name: 'Jump Starter Pack', description: '2000A peak portable jump starter with USB-C PD and air compressor.' },
    { name: 'Seat Back Organiser', description: 'Multi-pocket car seat organiser with tablet holder and foldable tray.' },
    { name: 'OBD2 Bluetooth Scanner', description: 'Wireless OBD2 adapter for real-time diagnostics and fault code reading.' },
    { name: 'Microfibre Car Cloths (10)', description: 'Pack of 10 ultra-soft 400gsm microfibre cloths for scratch-free detailing.' },
  ],
  'Garden & Tools': [
    { name: 'Cordless Drill Set', description: '20V brushless drill/driver with 2 batteries, charger, and 100-piece bit set.' },
    { name: 'Garden Hose 30m', description: 'Expandable kink-free garden hose with 8-pattern spray nozzle.' },
    { name: 'Raised Garden Bed Kit', description: 'Cedar wood raised bed kit, 120×60×30cm, easy tool-free assembly.' },
    { name: 'Pruning Shears', description: 'Bypass pruning shears with SK5 steel blades and ergonomic grip.' },
    { name: 'Soil Moisture Meter', description: 'Digital 3-in-1 soil tester for moisture, pH, and light levels.' },
    { name: 'Compost Bin 300L', description: 'UV-stabilised plastic compost bin with sliding base panel and lid.' },
    { name: 'Laser Level Self-Levelling', description: '360° self-levelling cross-line laser with magnetic mount and carry case.' },
    { name: 'Stud Finder', description: 'Electronic stud finder with AC wire detection and deep scan mode.' },
  ],
  'Office Supplies': [
    { name: 'Desk Organiser Set', description: 'Bamboo desk organiser with pen holder, file tray, and phone stand.' },
    { name: 'Ergonomic Mouse Pad', description: 'Extended XXL mouse pad with memory foam wrist rest, 90×40cm.' },
    { name: 'Label Maker', description: 'Wireless label maker with QWERTY keyboard and 180dpi print resolution.' },
    { name: 'Whiteboard 90×60cm', description: 'Magnetic dry-erase whiteboard with aluminium frame and ghost-free surface.' },
    { name: 'Stapler Heavy Duty', description: 'Heavy-duty stapler handles up to 100 sheets with jam-clear mechanism.' },
    { name: 'Sticky Notes Bulk Pack', description: '24-pack of 76×76mm sticky notes in 6 assorted neon colours.' },
    { name: 'Document Scanner', description: 'Portable duplex document scanner, 25ppm, Wi-Fi and USB connectivity.' },
    { name: 'Mechanical Pencil Set', description: 'Set of 3 drafting pencils (0.3/0.5/0.7mm) with lead refills.' },
  ],
  'Musical Instruments': [
    { name: 'Classical Guitar 3/4', description: 'Spruce top, mahogany back and sides, ideal for beginners and students.' },
    { name: 'MIDI Keyboard 49-Key', description: 'Semi-weighted 49-key MIDI controller with aftertouch and arpeggiator.' },
    { name: 'Cajon Drum Box', description: 'Birch plywood cajon with snare wires and adjustable sound hole.' },
    { name: 'Ukulele Soprano', description: 'Mahogany soprano ukulele with aquila strings and gig bag.' },
    { name: 'Digital Metronome', description: 'Clip-on chromatic tuner and metronome with vibration sensor.' },
    { name: 'Guitar Pedal Tuner', description: 'True-bypass chromatic pedal tuner with high-visibility display.' },
    { name: 'Drum Practice Pad', description: '12-inch dual-zone practice pad with realistic rebound feel.' },
    { name: 'Violin 4/4 Outfit', description: 'Solid spruce top violin with bow, rosin, and shaped case.' },
  ],
  'Art & Crafts': [
    { name: 'Watercolour Set 48 Colours', description: 'Professional-grade watercolour pan set with two brushes and mixing palette.' },
    { name: 'Acrylic Paint Set 24', description: 'Heavy-body acrylic paints in 24 colours with palette knife and brushes.' },
    { name: 'Sketchbook A4 200gsm', description: 'Spiral-bound sketchbook with 80 sheets of acid-free 200gsm paper.' },
    { name: 'Calligraphy Pen Set', description: 'Dip pen set with 6 nibs, 2 ink bottles, and practice guide.' },
    { name: 'Cricut Cutting Mat Set', description: 'Set of 4 cutting mats (light, standard, strong, fabric grip).' },
    { name: 'Embroidery Hoop Set', description: 'Set of 7 bamboo embroidery hoops from 10cm to 30cm diameter.' },
    { name: 'Resin Art Kit', description: 'Epoxy resin starter kit with pigments, moulds, and mixing tools.' },
    { name: 'Linocut Printing Set', description: 'Lino block printing set with 5 gouges, roller, and water-based ink.' },
  ],
  'Pet Supplies': [
    { name: 'Automatic Pet Feeder', description: 'Wi-Fi smart feeder with portion control, scheduling, and HD camera.' },
    { name: 'Orthopedic Dog Bed', description: 'Memory foam orthopedic bed with waterproof liner and washable cover.' },
    { name: 'Cat Tree 150cm', description: 'Multi-level cat tree with sisal scratching posts, hammock, and perches.' },
    { name: 'Pet GPS Tracker', description: 'Lightweight GPS collar tracker with live location and activity monitoring.' },
    { name: 'Self-Cleaning Litter Box', description: 'Automatic self-cleaning litter box with odour control and app alerts.' },
    { name: 'Dog Harness No-Pull', description: 'Reflective no-pull harness with front and back clip, padded chest plate.' },
    { name: 'Interactive Puzzle Feeder', description: 'Slow-feeder puzzle bowl with 5 difficulty levels for mental stimulation.' },
    { name: 'Pet Grooming Kit', description: 'Cordless pet clipper set with 4 guide combs and cleaning brush.' },
  ],
  'Baby & Kids': [
    { name: 'Baby Monitor 1080p', description: 'Split-screen video baby monitor with night vision, temperature sensor, and lullabies.' },
    { name: 'Convertible Car Seat', description: 'Rear and forward-facing car seat for 2–36kg with side-impact protection.' },
    { name: 'Wooden Activity Cube', description: 'Six-sided activity cube with shape sorter, abacus, and spinning gears.' },
    { name: 'Stroller Lightweight', description: 'One-hand fold umbrella stroller with UV50+ canopy and carry bag.' },
    { name: 'Baby Food Maker', description: 'All-in-one steamer and blender for homemade baby food, 800ml capacity.' },
    { name: 'Kids Coding Robot', description: 'Programmable robot toy teaching block coding for ages 5–10.' },
    { name: 'Toddler Backpack', description: 'Anti-lost safety harness backpack with cute animal design, 3L capacity.' },
    { name: 'Foam Play Mat 2×2m', description: 'Interlocking EVA foam play mat tiles, non-toxic and easy to clean.' },
  ],
  'Jewelry & Watches': [
    { name: 'Minimalist Field Watch', description: 'Japanese quartz movement, sapphire crystal, 100m water resistance.' },
    { name: 'Sterling Silver Necklace', description: '925 sterling silver chain with geometric pendant, 45cm length.' },
    { name: 'Titanium Wedding Band', description: 'Comfort-fit titanium band with brushed finish, available in 4–12mm width.' },
    { name: 'Smart Watch Fitness', description: 'AMOLED always-on display, ECG, SpO2, GPS, and 14-day battery.' },
    { name: 'Pearl Stud Earrings', description: 'Freshwater pearl studs with 14k gold posts, 7–8mm pearls.' },
    { name: 'Leather Watch Strap', description: 'Genuine Italian leather NATO strap, 20mm, quick-release spring bars.' },
    { name: 'Gemstone Bracelet Set', description: 'Set of 5 natural stone stretch bracelets: amethyst, tiger eye, and more.' },
    { name: 'Pocket Watch Vintage', description: 'Mechanical skeleton pocket watch with open-face case and chain.' },
  ],
  'Food & Beverages': [
    { name: 'Cold Brew Coffee Kit', description: 'Mason jar cold brew kit with fine mesh filter and recipe guide.' },
    { name: 'Loose Leaf Tea Sampler', description: '20-variety loose leaf tea sampler with 10g of each variety.' },
    { name: 'Hot Sauce Collection', description: 'Set of 6 artisan hot sauces ranging from mild to extra hot.' },
    { name: 'Protein Powder Vanilla', description: 'Whey isolate protein powder, 25g protein per serving, 1kg bag.' },
    { name: 'Olive Oil Extra Virgin', description: 'Cold-pressed single-origin EVOO from Crete, 500ml tin.' },
    { name: 'Specialty Coffee Beans 1kg', description: 'Single-origin Ethiopian Yirgacheffe, light roast, whole bean.' },
    { name: 'Matcha Ceremonial Grade', description: 'First-harvest ceremonial matcha from Uji, Japan, 30g tin.' },
    { name: 'Fermentation Crock 3L', description: 'Stoneware fermentation crock with water seal lid for kimchi and sauerkraut.' },
  ],
  'Travel & Luggage': [
    { name: 'Carry-On Hardshell Suitcase', description: 'Polycarbonate carry-on with TSA lock, spinner wheels, and USB port.' },
    { name: 'Packing Cubes Set 6', description: 'Lightweight mesh packing cubes in 3 sizes with compression zips.' },
    { name: 'Travel Pillow Memory Foam', description: 'Ergonomic memory foam neck pillow with machine-washable cover.' },
    { name: 'Passport Holder RFID', description: 'Slim RFID-blocking passport wallet with card slots and pen loop.' },
    { name: 'Universal Travel Adapter', description: 'All-in-one adapter for 150+ countries with 4 USB-A and 1 USB-C port.' },
    { name: 'Packable Rain Jacket', description: 'Ultralight packable rain jacket, packs into its own pocket, 200g.' },
    { name: 'Toiletry Bag Hanging', description: 'Water-resistant hanging toiletry bag with mirror and multiple compartments.' },
    { name: 'Luggage Scale Digital', description: 'Portable digital luggage scale up to 50kg with tare function.' },
  ],
  Other: [
    { name: 'Minimalist Wallet', description: 'Slim RFID-blocking aluminium card holder with elastic band.' },
    { name: 'Reusable Water Bottle 1L', description: 'Double-wall insulated stainless steel bottle, keeps cold 24h / hot 12h.' },
    { name: 'Beeswax Candle Set', description: 'Set of 6 hand-poured beeswax pillar candles with cotton wicks.' },
    { name: 'Desk Plant Succulent Set', description: 'Set of 3 low-maintenance succulents in ceramic pots with drainage.' },
    { name: 'Personalised Notebook', description: 'A5 hardcover dot-grid notebook with lay-flat binding and ribbon marker.' },
    { name: 'Cable Management Kit', description: 'Velcro cable ties, clips, and sleeves for a clean desk setup.' },
    { name: 'Bento Lunch Box', description: 'Leakproof 4-compartment bento box, microwave and dishwasher safe.' },
    { name: 'Scented Soy Candle', description: 'Hand-poured soy wax candle in amber glass jar, 50-hour burn time.' },
  ],
};

const STATUSES: ('active' | 'draft')[] = ['active', 'active', 'active', 'draft'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d;
}

export async function seed(knex: Knex): Promise<void> {
  // ── Clean up ──────────────────────────────────────────────────────────────
  await knex('items').del();
  await knex('users').where('email', SEED_USER.email).del();

  // ── Seed user ─────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash(SEED_USER.password, 10);

  const [user] = await knex('users')
    .insert({
      email: SEED_USER.email,
      password_hash: passwordHash,
      first_name: SEED_USER.first_name,
      last_name: SEED_USER.last_name,
      email_verified: true,
    })
    .returning('id');

  const userId = typeof user === 'object' ? user.id : user;

  // ── Build 200 items ───────────────────────────────────────────────────────
  const allItems: {
    name: string;
    description: string;
    category: string;
  }[] = [];

  for (const [category, items] of Object.entries(ITEMS_BY_CATEGORY)) {
    for (const item of items) {
      allItems.push({ ...item, category });
    }
  }

  // Shuffle so categories are interleaved
  for (let i = allItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
  }

  // Pad to exactly 200 by cycling through the list again
  const TARGET = 200;
  const padded: typeof allItems = [...allItems];
  let idx = 0;
  while (padded.length < TARGET) {
    const base = allItems[idx % allItems.length];
    padded.push({
      ...base,
      name: `${base.name} (${Math.floor(padded.length / allItems.length) + 1})`,
    });
    idx++;
  }

  const rows = padded.slice(0, TARGET).map((item) => {
    const createdAt = randomDate(90);
    return {
      user_id: userId,
      name: item.name,
      description: item.description,
      category: item.category,
      status: pick(STATUSES),
      created_at: createdAt,
      updated_at: createdAt,
    };
  });

  await knex('items').insert(rows);

  console.log(`✓ Seeded 1 user (${SEED_USER.email}) and ${rows.length} items`);
}
