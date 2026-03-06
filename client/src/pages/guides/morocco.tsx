import { useState, FormEvent } from 'react';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { PinButton } from '@/components/pin-button';
import './morocco-guide.css';

const IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco';
const BLOB = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2';
const CAROUSEL = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/carousel-morocco';

type CarouselProduct = {
  id: string;
  brand: string;
  name: string;
  price: string | null;
  shopUrl: string;
  imageUrl: string;
};

const DAY_PRODUCTS: CarouselProduct[] = [
  { id: 'guide-day-1', brand: 'Fil de Vie', name: 'Juno Blouse & Marrakech Pants', price: null, shopUrl: 'http://www.fildevie.com', imageUrl: `${CAROUSEL}/01_fdv_juno.jpg` },
  { id: 'guide-day-2', brand: 'Bottega Veneta', name: 'Kalimero Bag', price: '$4,100', shopUrl: 'https://www.bottegaveneta.com/en-us/small-kalimero-citta-fondant-813744715.html', imageUrl: `${CAROUSEL}/02_bottega_kalimero.jpg` },
  { id: 'guide-day-3', brand: 'A Emery', name: 'Kir Sandal', price: '$185', shopUrl: 'https://aemery.com/products/the-kir-sandal-black', imageUrl: `${CAROUSEL}/03_aemery_kir_sandal.jpg` },
  { id: 'guide-day-4', brand: 'Bulgari via 1st Dibs', name: 'Lapis Cabachon Necklace', price: '$50,000', shopUrl: 'https://www.1stdibs.com/jewelry/necklaces/pendant-necklaces/bvlgari-1980s-unheated-sapphire-gold-necklace/id-j_28202612/', imageUrl: `${CAROUSEL}/04_bulgari_necklace.jpg` },
  { id: 'guide-day-5', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: `${CAROUSEL}/05_loewe_sunglasses.jpg` },
  { id: 'guide-day-6', brand: 'Saint Jane', name: 'Sunscreen', price: '$38', shopUrl: 'https://saintjanebeauty.com/collections/sun-protection-spf/products/luxury-sun-ritual', imageUrl: `${CAROUSEL}/06_saintjane_sunscreen.jpg` },
];

const EVE_PRODUCTS: CarouselProduct[] = [
  { id: 'guide-eve-1', brand: 'FDV', name: 'Isadora Dress', price: '$795', shopUrl: 'http://www.fildevie.com', imageUrl: `${CAROUSEL}/07_fdv_isadora.jpg` },
  { id: 'guide-eve-2', brand: 'Ala\u00efa', name: 'Velvet Thongs', price: '$1,450', shopUrl: 'https://www.bergdorfgoodman.com/p/alaia-velvet-kitten-heel-thong-sandals-prodt196740019', imageUrl: `${CAROUSEL}/08_alaia_thongs.jpg` },
  { id: 'guide-eve-3', brand: 'Chlo\u00e9', name: 'Wristlette Bag', price: '$4,200', shopUrl: 'https://www.chloe.com/en-us/p/bags/shoulder-bag/CH5US623P57001.html', imageUrl: `${CAROUSEL}/09_chloe_bag.jpg` },
  { id: 'guide-eve-4', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: `${CAROUSEL}/10_phoebephilo_hoops.jpg` },
  { id: 'guide-eve-5', brand: 'Hildegard', name: 'Immortelle Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: `${CAROUSEL}/11_hildegard_oil.jpg` },
  { id: 'guide-eve-6', brand: 'PoppyKing', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: `${CAROUSEL}/12_poppyking_lipstick.jpg` },
];

function CarouselItem({ product, onOpenModal }: { product: CarouselProduct; onOpenModal: (p: CarouselProduct) => void }) {
  return (
    <div className="carousel-item" onClick={() => onOpenModal(product)} style={{ cursor: 'pointer' }}>
      <div className="item-image" style={{ position: 'relative' }}>
        <img src={product.imageUrl} alt={`${product.brand} ${product.name}`} />
        <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 6, right: 6 }}>
          <PinButton
            itemType="style"
            itemId={product.id}
            itemData={{
              title: `${product.brand} — ${product.name}`,
              imageUrl: product.imageUrl,
              storyTag: 'morocco',
            }}
            sourceContext="morocco-guide-carousel"
            aestheticTags={['wardrobe', 'style', 'morocco']}
            size="sm"
          />
        </div>
      </div>
      <div className="item-brand">{product.brand}</div>
      <div className="item-name">{product.name}</div>
      {product.price && <div className="item-price">{product.price}</div>}
      <div className="shop-link">View</div>
    </div>
  );
}

/* ── Day data for itinerary teaser ── */
const DAY_THEMES: Record<number, string> = {
  1: 'ARRIVAL',
  2: 'THE ATLAS',
  3: 'ATLAS TO MARRAKECH',
  4: 'THE MEDINA',
  5: 'THE SOUKS',
  6: 'CULTURE & REST',
  7: 'THE DESERT',
  8: 'DEPARTURE',
};

type TimeSlot = {
  time: string;
  title: string;
  description: string;
  wardrobeKey: string; // e.g. "d1-1" → used to build blob URLs
};

const DAY1_SLOTS: TimeSlot[] = [
  { time: 'Morning', title: 'Arrival at Marrakech Menara Airport', description: 'Arrival at Menara — a masterpiece of modern Islamic architecture. Private transfer to the Atlas Mountains.', wardrobeKey: 'd1-1' },
  { time: 'Afternoon', title: 'Check-in at Kasbah Bab Ourika', description: 'Perched above the Ourika Valley with 360-degree Atlas views. Explore the grounds, organic gardens.', wardrobeKey: 'd1-3' },
  { time: 'Evening', title: 'Dinner at the Kasbah', description: 'Organic cuisine from the Kasbah gardens. A quiet evening as the temperature drops in the valley.', wardrobeKey: 'd1-6' },
];

const DAY2_SLOTS: TimeSlot[] = [
  { time: 'Morning', title: 'Breakfast & Village Walk', description: 'Fresh breakfast with Atlas views. Optional gentle hike through nearby Berber villages.', wardrobeKey: 'd2-1' },
  { time: 'Afternoon', title: 'Lunch & Unstructured Time', description: 'Lunch from the gardens. The mountain midday sun is best enjoyed by the infinity pool.', wardrobeKey: 'd2-4' },
  { time: 'Evening', title: 'Dinner at the Kasbah', description: 'Another quiet evening with mountain views and organic cuisine. Rest well before Marrakech.', wardrobeKey: 'd2-7' },
];

function WardrobeThumbs({ wardrobeKey }: { wardrobeKey: string }) {
  const keys = [
    `${wardrobeKey}-wardrobe`,
    `${wardrobeKey}-extra-0`,
    `${wardrobeKey}-extra-1`,
    `${wardrobeKey}-extra-2`,
  ];
  return (
    <div className="teaser-thumbs">
      {keys.map((k) => (
        <img key={k} src={`${BLOB}/${k}`} alt="" className="teaser-thumb" loading="lazy" />
      ))}
    </div>
  );
}

function DaySection({ day, theme, slots }: { day: number; theme: string; slots: TimeSlot[] }) {
  return (
    <div className="teaser-day">
      <div className="teaser-day-header">DAY {day} &middot; {theme}</div>
      {slots.map((slot, i) => (
        <div key={i} className="teaser-slot">
          <div className="teaser-time">{slot.time}</div>
          <div className="teaser-event-title">{slot.title}</div>
          <div className="teaser-event-desc">{slot.description}</div>
          <WardrobeThumbs wardrobeKey={slot.wardrobeKey} />
        </div>
      ))}
    </div>
  );
}

function ItineraryTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'itinerary_gate' }),
      });
      setSubmitted(true);
    } catch {
      // silently handle
    }
  };

  return (
    <div className="itinerary-teaser">
      <div className="teaser-label">The Full Journey</div>
      <h3>Your 8-Day Morocco Itinerary</h3>

      {/* Day 1 — fully visible */}
      <DaySection day={1} theme={DAY_THEMES[1]} slots={DAY1_SLOTS} />

      {/* Day 2 — fully visible */}
      <DaySection day={2} theme={DAY_THEMES[2]} slots={DAY2_SLOTS} />

      {/* Days 3-8 — blurred gate */}
      <div className="teaser-gate-wrapper">
        <div className="teaser-blurred">
          <div className="teaser-day">
            <div className="teaser-day-header">DAY 3 &middot; {DAY_THEMES[3]}</div>
            <div className="teaser-slot">
              <div className="teaser-time">Morning</div>
              <div className="teaser-event-title">Final Breakfast &amp; Departure</div>
              <div className="teaser-event-desc">One last walk through the grounds before the journey to Marrakech.</div>
              <WardrobeThumbs wardrobeKey="d3-1" />
            </div>
            <div className="teaser-slot">
              <div className="teaser-time">Afternoon</div>
              <div className="teaser-event-title">Arrive at El Fenn</div>
              <div className="teaser-event-desc">Check in to Marrakech&rsquo;s most storied riad. Explore the courtyards and rooftop.</div>
              <WardrobeThumbs wardrobeKey="d3-3" />
            </div>
            <div className="teaser-slot">
              <div className="teaser-time">Evening</div>
              <div className="teaser-event-title">Dinner at Dar Yacout</div>
              <div className="teaser-event-desc">Traditional Moroccan fine dining in a centuries-old palace.</div>
              <WardrobeThumbs wardrobeKey="d3-9" />
            </div>
          </div>
        </div>

        <div className="teaser-gate-overlay">
          <div className="teaser-gate-label">THE FULL JOURNEY</div>
          <div className="teaser-gate-headline">Your complete 8-day Morocco itinerary</div>
          <div className="teaser-gate-sub">Day-by-day packing, reservations, and the details no one tells you.</div>

          {!submitted ? (
            <form className="teaser-gate-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="teaser-gate-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <a href="/packing" className="teaser-gate-button" onClick={(e) => {
                if (email) {
                  e.preventDefault();
                  handleSubmit(e as unknown as FormEvent);
                  setTimeout(() => { window.location.href = '/packing'; }, 500);
                }
              }}>Go Gold to Unlock</a>
            </form>
          ) : (
            <div className="teaser-gate-confirmed">
              <span>We&rsquo;ll let you know.</span>
              <a href="/packing" className="teaser-gate-button" style={{ marginTop: 16 }}>Go Gold to Unlock</a>
            </div>
          )}

          <a href="/packing" className="teaser-bypass">For pilot testers: Continue without unlocking &rarr;</a>
        </div>
      </div>
    </div>
  );
}

export default function MoroccoGuide() {
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openModal = (p: CarouselProduct) => {
    setSelectedItem({
      id: p.id,
      title: p.name,
      bucket: 'wardrobe',
      pinType: 'style',
      assetKey: p.id,
      storyTag: 'morocco',
      imageUrl: p.imageUrl,
      brand: p.brand,
      price: p.price ?? undefined,
      shopUrl: p.shopUrl,
      shopStatus: 'live',
    });
    setDrawerOpen(true);
  };

  return (
    <div className="morocco-guide">

      {/* ═══ HERO ═══ */}
      <div className="guide-hero">
        <h1>MARRAKECH</h1>
        <div className="curator">A FIL DE VIE GUIDE</div>
        <div className="subtitle">Curated by Sharon Lombardo</div>
      </div>

      <div className="divider-double" />

      {/* HERO IMAGE */}
      <div className="hero-image">
        <img src={`${IMG}/hero.jpg`} alt="Marrakech" />
      </div>

      {/* ═══ INTRO ═══ */}
      <div className="quote-block">
        <div className="intro-text">
          <p>Marrakech is one of my favorite places in the world.</p>
          <p>I&rsquo;ve been coming here for years &mdash; for Fil de Vie shoots, for sourcing, for long conversations in tiled courtyards that somehow stretch into evening. It&rsquo;s a city I return to again and again, and it never feels exhausted. It feels layered.</p>
          <p>There&rsquo;s a rhythm to it I love: the chaos of the medina, the quiet of a riad courtyard, the sharp desert light just outside the city. It&rsquo;s theatrical and intimate at the same time. If you let it.</p>
          <p>These are not the &ldquo;top 10 must-sees.&rdquo; They&rsquo;re the places I go back to &mdash; the gardens I still walk, the rooftops I still book, the shops I still browse, the rooms I still love staying in.</p>
          <p>Marrakech rewards curiosity. And return visits.</p>
        </div>
        <p className="bio">Sharon Lombardo is the founder of Fil De Vie and your host here at Fil De Vie Concierge</p>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: THE EXPERIENCE ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE EXPERIENCE</h2>
      </div>
      <div className="section-sub">Things to see and do</div>
      <div className="divider-double" />

      {/* Experience 1: Badi Palace */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/exp-1-large.jpg`} alt="Badi Palace" /></div>
          <div className="img-small"><img src={`${IMG}/exp-1-small1.jpg`} alt="Badi Palace detail" /></div>
          <div className="img-small"><img src={`${IMG}/exp-1-small2.jpg`} alt="Badi Palace moment" /></div>
        </div>
        <div className="place-info">
          <h3>Badi Palace</h3>
          <div className="tagline">Ruins, scale, silence.</div>
          <div className="description">The 16th-century El Badi Palace is mostly ruins now &mdash; which is exactly why it&rsquo;s powerful. Vast sun-warmed walls, stork nests perched high above, and open courtyards that feel almost surreal against the blue sky. Go late afternoon when the light softens and the crowds thin. It&rsquo;s less about what&rsquo;s left and more about the space it creates.</div>
          <div className="address">Ksibat Nhass, Marrakech 40000</div>
          <div className="icons">
            <a href="http://www.badipalace.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/exp-1-break.jpg`} alt="" /></div>

      {/* Experience 2: Jardin Secret */}
      <div className="place-block reverse">
        <div className="place-images layout-c">
          <div className="img-slot"><img src={`${IMG}/exp-2-left.jpg`} alt="Jardin Secret" /></div>
          <div className="img-slot"><img src={`${IMG}/exp-2-right.jpg`} alt="Jardin Secret" /></div>
        </div>
        <div className="place-info">
          <h3>Jardin Secret</h3>
          <div className="tagline">A quiet medina escape.</div>
          <div className="description">Hidden within the medina walls, Le Jardin Secret feels like stepping into a private courtyard from another century. Islamic architecture, carved cedar ceilings, and restored gardens that feel calm compared to the surrounding chaos. Climb the tower for a panoramic view &mdash; it&rsquo;s one of the most beautiful in the city.</div>
          <div className="address">121 Rue Mouassine, Marrakech 40030</div>
          <div className="icons">
            <a href="http://lejardinsecretmarrakech.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      {/* Experience 3: Agafay Desert Camp */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/exp-3-large.jpg`} alt="Agafay Desert Camp" /></div>
          <div className="img-small"><img src={`${IMG}/exp-3-small1.jpg`} alt="Agafay detail" /></div>
          <div className="img-small"><img src={`${IMG}/exp-3-small2.jpg`} alt="Agafay moment" /></div>
        </div>
        <div className="place-info">
          <h3>Agafay Desert Camp</h3>
          <div className="tagline">Desert drama without the five-hour drive.</div>
          <div className="description">Agafay isn&rsquo;t the Sahara &mdash; it&rsquo;s stone desert &mdash; but that&rsquo;s its appeal. Less clich&eacute;, more lunar landscape. An overnight camp gives you that endless horizon feeling without committing to a multi-day trek. Go for sunset. Stay for dinner under the stars. It&rsquo;s theatrical in the best way.</div>
          <div className="address">Agafay Desert, approx. 45 minutes from Marrakech</div>
          <div className="icons">
            <a href="#" title="Various camps — choose one with smaller capacity for intimacy">&#x2139;&#xFE0F;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/exp-3-break-v2.jpeg`} alt="" /></div>

      {/* Experience 4: Jardin Majorelle */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/exp-4-large.jpg`} alt="Jardin Majorelle" /></div>
          <div className="img-small"><img src={`${IMG}/exp-4-small1.jpg`} alt="Majorelle detail" /></div>
          <div className="img-small"><img src={`${IMG}/exp-4-small2.jpg`} alt="Majorelle moment" /></div>
        </div>
        <div className="place-info">
          <h3>Jardin Majorelle</h3>
          <div className="tagline">Cobalt blue and exquisite beauty with a side of Saint Laurent</div>
          <div className="description">Yes, it&rsquo;s popular. Yes, it&rsquo;s worth it. The Yves Saint Laurent&ndash;owned garden is an immersion in electric Majorelle blue, lush cactus forms, and quiet pathways. Book the first entry time of the day &mdash; it gets crowded quickly. Pair it with the YSL Museum next door if you have even a passing interest in fashion or design.</div>
          <div className="address">Rue Yves St Laurent, Marrakech 40090</div>
          <div className="icons">
            <a href="http://jardinmajorelle.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: EAT & DRINK ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>EAT &amp; DRINK</h2>
      </div>
      <div className="section-sub">Restaurants, caf&eacute;s, bars</div>
      <div className="divider-double" />

      {/* Eat 1: Nomad */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/eat-1-large.jpg`} alt="Nomad" /></div>
          <div className="img-small"><img src={`${IMG}/eat-1-small1.jpg`} alt="Nomad detail" /></div>
          <div className="img-small"><img src={`${IMG}/eat-1-small2.jpg`} alt="Nomad moment" /></div>
        </div>
        <div className="place-info">
          <h3>Nomad</h3>
          <div className="tagline">Rooftop views and modern Moroccan.</div>
          <div className="description">Nomad balances local flavors with modern presentation. It&rsquo;s popular but reliable. Sit upstairs. Order small plates and watch the medina shift into evening.</div>
          <div className="address">1 Derb Aarjane, Rahba Lakdima, Marrakech 40000</div>
          <div className="icons">
            <a href="http://nomadmarrakech.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      {/* Eat 2: Cafe Bacha */}
      <div className="place-block reverse">
        <div className="place-images layout-c">
          <div className="img-slot"><img src={`${IMG}/eat-2-left.jpg`} alt="Cafe Bacha" /></div>
          <div className="img-slot"><img src={`${IMG}/eat-2-right.jpg`} alt="Cafe Bacha" /></div>
        </div>
        <div className="place-info">
          <h3>Caf&eacute; Bacha</h3>
          <div className="tagline">Decadent morning ritual.</div>
          <div className="description">Located inside Dar el Bacha Palace, Caf&eacute; Bacha is all marble, gold accents, and endless coffee options. It&rsquo;s theatrical &mdash; but charming. Go early to avoid lines and sit inside if you can. Order the pastries and commit.</div>
          <div className="address">Dar El Bacha Palace, Rue Fatima Zahra, Medina, Marrakech 40570</div>
          <div className="icons">
            <a href="http://bachacoffee.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/eat-2-break.jpg`} alt="" /></div>

      {/* Eat 3: La Famille */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/eat-3-large.jpg`} alt="La Famille" /></div>
          <div className="img-small"><img src={`${IMG}/eat-3-small1.jpg`} alt="La Famille detail" /></div>
          <div className="img-small"><img src={`${IMG}/eat-3-small2.jpg`} alt="La Famille moment" /></div>
        </div>
        <div className="place-info">
          <h3>La Famille</h3>
          <div className="tagline">Vegetarian and unexpectedly chic.</div>
          <div className="description">Tucked away in the medina, La Famille feels like a secret garden lunch. The menu is seasonal, simple, and beautiful. It&rsquo;s light, fresh, and a welcome pause from heavier meals.</div>
          <div className="address">34 Derb Jdid, Sidi Abdelaziz, Medina, Marrakesh 40500</div>
          <div className="icons">
            <a href="https://instagram.com/lafamillemarrakech" target="_blank" rel="noopener noreferrer">&#x1F4F7;</a>
          </div>
        </div>
      </div>

      {/* Eat 4: Le Jardin de Lotus */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/eat-4-large.jpg`} alt="Le Jardin de Lotus" /></div>
          <div className="img-small"><img src={`${IMG}/eat-4-small1.jpg`} alt="Le Jardin de Lotus detail" /></div>
          <div className="img-small"><img src={`${IMG}/eat-4-small2.jpg`} alt="Le Jardin de Lotus moment" /></div>
        </div>
        <div className="place-info">
          <h3>Le Jardin de Lotus</h3>
          <div className="tagline">Relaxed glamour</div>
          <div className="description">A more contemporary rooftop option with cocktails and Moroccan-Asian fusion plates. Come at sunset. Stay if the mood is right.</div>
          <div className="address">Dar el Bacha District, 9 Derb Sidi Ali Ben Hamdouche, Medina, Marrakesh 40000</div>
          <div className="icons">
            <a href="https://lejardindelotus.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      {/* Eat 5: La Mamounia */}
      <div className="place-block">
        <div className="place-images layout-c">
          <div className="img-slot"><img src={`${IMG}/eat-5-left.jpg`} alt="La Mamounia" /></div>
          <div className="img-slot"><img src={`${IMG}/eat-5-right.jpg`} alt="La Mamounia" /></div>
        </div>
        <div className="place-info">
          <h3>La Mamounia &mdash; Evening Drinks</h3>
          <div className="tagline">Golden hour, perfected.</div>
          <div className="description">You don&rsquo;t have to stay here to enjoy it. Come for a pre-dinner drink in the Churchill Bar or on the terrace. It&rsquo;s polished, yes &mdash; but the atmosphere is undeniable. Lean into it.</div>
          <div className="address">Avenue Bab Jdid, Marrakesh 40040</div>
          <div className="icons">
            <a href="http://www.mamounia.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/eat-5-break.jpg`} alt="" /></div>

      {/* Eat 6: Dar Yacout */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/eat-6-large.jpg`} alt="Dar Yacout" /></div>
          <div className="img-small"><img src={`${IMG}/eat-6-small1.jpg`} alt="Dar Yacout detail" /></div>
          <div className="img-small"><img src={`${IMG}/eat-6-small2.jpg`} alt="Dar Yacout moment" /></div>
        </div>
        <div className="place-info">
          <h3>Dar Yacout</h3>
          <div className="tagline">Traditional Moroccan, done properly.</div>
          <div className="description">A multi-course feast in a traditional riad setting &mdash; lantern light, tiled courtyards, live musicians. It&rsquo;s over-the-top in the very best way. Go hungry. Don&rsquo;t rush.</div>
          <div className="address">79 Derb Sidi Ahmed Soussi, Bab Doukkala, Marrakesh 40000</div>
          <div className="icons">
            <a href="#" title="Reservations typically via concierge or phone">&#x260E;&#xFE0F;</a>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: SHOP LOCAL ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>SHOP LOCAL</h2>
      </div>
      <div className="section-sub">Artisans, boutiques, makers</div>
      <div className="divider-double" />

      {/* Shop 1: The Souks */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/shop-1-large.jpg`} alt="The Souks" /></div>
          <div className="img-small"><img src={`${IMG}/shop-1-small1.jpg`} alt="The Souks detail" /></div>
          <div className="img-small"><img src={`${IMG}/shop-1-small2.jpg`} alt="The Souks moment" /></div>
        </div>
        <div className="place-info">
          <h3>The Souks &mdash; Of Course</h3>
          <div className="tagline">Start here. Then wander.</div>
          <div className="description">
            The souks aren&rsquo;t something to check off &mdash; they&rsquo;re something to get lost in. Brass hammered by hand. Baskets woven floor to ceiling. Leather dyed in colors you&rsquo;ll wish you wore more often. If you want to narrow it down:
            <ul>
              <li>Souk Semmarine for textiles and leather.</li>
              <li>Souk El Attarine for spices and perfume.</li>
              <li>Souk Haddadine for metalwork.</li>
              <li>Souk Cherratine for serious leather goods.</li>
            </ul>
            Don&rsquo;t rush. Don&rsquo;t panic. Let it feel overwhelming for a minute. Then it starts to make sense.
          </div>
          <div className="address">Medina of Marrakesh, near Jemaa el-Fnaa Square</div>
        </div>
      </div>

      {/* Shop 2: El Fenn Gift Shop */}
      <div className="place-block reverse">
        <div className="place-images layout-c">
          <div className="img-slot"><img src={`${IMG}/shop-2-left.jpg`} alt="El Fenn Gift Shop" /></div>
          <div className="img-slot"><img src={`${IMG}/shop-2-right.jpg`} alt="El Fenn Gift Shop" /></div>
        </div>
        <div className="place-info">
          <h3>El Fenn Gift Shop</h3>
          <div className="tagline">Actually chic souvenirs.</div>
          <div className="description">Not the usual tourist trinkets. The El Fenn boutique curates ceramics, textiles, books, and home pieces that feel elevated. It&rsquo;s where you find something you&rsquo;ll genuinely keep &mdash; not just pack.</div>
          <div className="address">2 Derb Moulay Abdellah Ben Hezzian, Medina, Marrakesh 40000</div>
          <div className="icons">
            <a href="http://www.elfenn.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/shop-2-break.jpg`} alt="" /></div>

      {/* Shop 3: Mustapha Blaoui */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/shop-3-large.jpg`} alt="Mustapha Blaoui" /></div>
          <div className="img-small"><img src={`${IMG}/shop-3-small1.jpg`} alt="Mustapha Blaoui detail" /></div>
          <div className="img-small"><img src={`${IMG}/shop-3-small2.jpg`} alt="Mustapha Blaoui moment" /></div>
        </div>
        <div className="place-info">
          <h3>Mustapha Blaoui</h3>
          <div className="tagline">Treasure hunting at scale.</div>
          <div className="description">If you love objects &mdash; lamps, ceramics, carved doors, vintage finds &mdash; this is the place. It&rsquo;s layered and slightly dusty and entirely addictive. You&rsquo;ll want to ship things home. You probably should.</div>
          <div className="address">144 Arset Aouzal Rd, Bab Doukkala, Marrakesh 40000</div>
        </div>
      </div>

      {/* Shop 4: Max & Jan */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/shop-4-large.jpg`} alt="Max & Jan" /></div>
          <div className="img-small"><img src={`${IMG}/shop-4-small1.jpg`} alt="Max & Jan detail" /></div>
          <div className="img-small"><img src={`${IMG}/shop-4-small2.jpg`} alt="Max & Jan moment" /></div>
        </div>
        <div className="place-info">
          <h3>Max &amp; Jan</h3>
          <div className="tagline">Modern Marrakech.</div>
          <div className="description">A contemporary boutique blending Moroccan craftsmanship with European silhouettes. Graphic prints, sharp tailoring, and pieces that travel well. It&rsquo;s a smart edit if you want something local but wearable back home.</div>
          <div className="address">14 Rue Amsefah, Marrakech 40000</div>
          <div className="icons">
            <a href="http://www.maxandjan.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ SECTION: THE STAY ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE STAY</h2>
      </div>
      <div className="section-sub">Hotels, riads, retreats</div>
      <div className="divider-double" />

      {/* Stay 1: El Fenn */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/stay-1-large.jpg`} alt="El Fenn" /></div>
          <div className="img-small"><img src={`${IMG}/stay-1-small1.jpg`} alt="El Fenn detail" /></div>
          <div className="img-small"><img src={`${IMG}/stay-1-small2.jpg`} alt="El Fenn moment" /></div>
        </div>
        <div className="place-info">
          <h3>El Fenn</h3>
          <div className="tagline">Color, art, and rooftop sunsets.</div>
          <div className="description">Owned by Vanessa Branson, El Fenn is Marrakech at its most curated &mdash; bold colors, modern art, layered textiles. The rooftop pool at sunset is reason enough to stay. It&rsquo;s lively but intimate, and the design feels intentional without being overly staged. <em>My favorite place to stay &mdash; close to everything you&rsquo;ll want to do.</em></div>
          <div className="address">2 Derb Moulay Abdellah Ben Hezzian, Marrakech 40000</div>
          <div className="icons">
            <a href="http://www.elfenn.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      {/* Stay 2: Riad Jardin Secret */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/stay-2-large.jpg`} alt="Riad Jardin Secret" /></div>
          <div className="img-small"><img src={`${IMG}/stay-2-small1.jpg`} alt="Riad Jardin Secret detail" /></div>
          <div className="img-small"><img src={`${IMG}/stay-2-small2.jpg`} alt="Riad Jardin Secret moment" /></div>
        </div>
        <div className="place-info">
          <h3>Riad Jardin Secret</h3>
          <div className="tagline">Intimate, traditional, serene.</div>
          <div className="description">Tucked inside the medina, this riad offers the opposite of hotel grandeur &mdash; quiet courtyards, carved wood, and a sense of privacy. It feels personal and atmospheric. Perfect if you want immersion over spectacle.</div>
          <div className="address">43-46 Arset Aouzal Road, Bab Doukkala, Medina, Marrakesh 40000</div>
          <div className="icons">
            <a href="http://www.riad-jardinsecret.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <div className="full-image"><img src={`${IMG}/stay-2-break.jpg`} alt="" /></div>

      {/* Stay 3: La Mamounia */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/stay-3-large.jpg`} alt="La Mamounia" /></div>
          <div className="img-small"><img src={`${IMG}/stay-3-small1.jpg`} alt="La Mamounia detail" /></div>
          <div className="img-small"><img src={`${IMG}/stay-3-small2.jpg`} alt="La Mamounia moment" /></div>
        </div>
        <div className="place-info">
          <h3>La Mamounia</h3>
          <div className="tagline">Iconic. Unapologetically grand.</div>
          <div className="description">La Mamounia is not understated &mdash; it&rsquo;s cinematic, historic, and slightly over the top in the best way. The gardens alone are worth walking through. Stay if you want full classic Moroccan luxury. Or just come for drinks at sunset and let the tiled corridors and candlelight do the rest.</div>
          <div className="address">Avenue Bab Jdid, Marrakech 40040</div>
          <div className="icons">
            <a href="http://mamounia.com" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      {/* Full-width break — transition to wardrobe */}
      <div className="full-image"><img src={`${IMG}/wardrobe-break.jpg`} alt="" /></div>

      <hr className="divider" />

      {/* ═══ SECTION: THE WARDROBE ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE WARDROBE</h2>
      </div>
      <div className="section-sub">What to wear &mdash; curated looks + shoppable pieces</div>
      <div className="divider-double" />

      {/* Wardrobe 1: Day in the Medina */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/ward-1-large.jpg`} alt="Day in the Medina look" /></div>
          <div className="img-small"><img src={`${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`} alt="Bottega Veneta Kalimero Bag" /></div>
          <div className="img-small"><img src={`${IMG}/ward-1-small2_bulgari_necklace.jpg`} alt="Bulgari Necklace" /></div>
        </div>
        <div className="place-info">
          <h3>Day in the Medina</h3>
          <div className="tagline">Medina uniform.</div>
          <div className="description">Linen you can breathe in. Stripes that feel intentional but not precious. Flat sandals because you&rsquo;ll be walking more than you expect. Gold, but not too much. Hair slightly undone. It moves with you &mdash; which is the whole point.</div>
        </div>
      </div>

      {/* CAROUSEL: Shop Day Look */}
      <div className="carousel-section">
        <div className="carousel-label">Shop the Look</div>
        <div className="carousel-title">Day in the Medina &mdash; Every Piece</div>
        <div className="carousel-track">
          {DAY_PRODUCTS.map((p) => (
            <CarouselItem key={p.id} product={p} onOpenModal={openModal} />
          ))}
        </div>
      </div>

      {/* Wardrobe 2: Riad Evenings */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large"><img src={`${IMG}/ward-2-large_fdv_isadora_dress.jpg`} alt="Riad Evenings look" /></div>
          <div className="img-small"><img src={`${IMG}/ward-2-small1_chloe_wristless_bag.jpg`} alt="Chloé Wristlette Bag" /></div>
          <div className="img-small"><img src={`${IMG}/ward-2-small2_poppyking_red.jpg`} alt="PoppyKing Lipstick" /></div>
        </div>
        <div className="place-info">
          <h3>Riad Evenings</h3>
          <div className="tagline">Marrakech does drama. You might as well participate.</div>
          <div className="description">Lantern light, warm stone, a drink resting on the table while you lean in. Black feels intentional here. Slightly dangerous in candlelight. In a good way. You&rsquo;ll stay longer than planned. You won&rsquo;t regret it.</div>
        </div>
      </div>

      {/* CAROUSEL: Shop Evening Look */}
      <div className="carousel-section">
        <div className="carousel-label">Shop the Look</div>
        <div className="carousel-title">Riad Evenings &mdash; Every Piece</div>
        <div className="carousel-track">
          {EVE_PRODUCTS.map((p) => (
            <CarouselItem key={p.id} product={p} onOpenModal={openModal} />
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ GUIDE MAP ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>GUIDE MAP</h2>
      </div>
      <div className="divider-double" />

      <div className="guide-map">
        <div className="map-placeholder">
          <span>Interactive map &mdash; all 17 locations pinned</span>
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ ITINERARY TEASER (EXPANDED) ═══ */}
      <ItineraryTeaser />

      {/* ═══ FOOTER ═══ */}
      <div className="guide-footer">
        <div className="closing">Some places don&rsquo;t need to be explained. They need to be felt.</div>
        <div className="brand-mark">FDV Destination Guide &mdash; Fil de Vie Concierge</div>
      </div>

      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="current"
      />
    </div>
  );
}
