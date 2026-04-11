import { useState, FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { PinButton } from '@/components/pin-button';
import { EditorialProductOverlay, ShoppableIndicator, type EditorialProduct } from '@/components/editorial-product-overlay';
// editorial-sections only needed by /concierge — ItineraryTeaser is now a slim preview card
import { useCustomImages } from '@/hooks/use-custom-images';
import { getProductByKey, getProductDisplayName, isShoppable, getShopImageUrl, FLOW_LOOK_GENOME_KEY, SECTION_LOOK_GENOME_KEY } from '@/lib/brand-genome';
import { useScrollDepth } from '@/hooks/use-scroll-depth';
import { useImageSlots } from '@/hooks/use-image-slot';
import { IMAGE_SLOTS } from '@shared/image-slots';
import './morocco-guide.css';

const IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco';
const DAY_PRODUCTS: EditorialProduct[] = [
  { id: 'guide-day-1', brand: 'Fil de Vie', name: 'Juno Blouse & Marrakech Pants', price: null, shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fdv:junoblouse:marrakechpant:stripe.jpg' },
  { id: 'guide-day-2', brand: 'Bottega Veneta', name: 'Kalimero Bag', price: '$4,100', shopUrl: 'https://www.bottegaveneta.com/en-us/small-kalimero-citta-fondant-813744715.html', imageUrl: '', genomeKey: 'accessory:bag:bottega:kalimero:black.jpg' },
  { id: 'guide-day-3', brand: 'A Emery', name: 'Kir Sandal', price: '$185', shopUrl: 'https://aemery.com/products/the-kir-sandal-black', imageUrl: '', genomeKey: 'footwear, amery kit sandal.jpg' },
  { id: 'guide-day-4', brand: 'Bulgari via 1st Dibs', name: 'Lapis Cabachon Necklace', price: '$50,000', shopUrl: 'https://www.1stdibs.com/jewelry/necklaces/pendant-necklaces/bvlgari-1980s-unheated-sapphire-gold-necklace/id-j_28202612/', imageUrl: '', genomeKey: 'accessory:jewelry:bulgari:cabachon necklace.jpg' },
  { id: 'guide-day-5', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: '', genomeKey: 'access:sugnlasses:loewe:black.jpg' },
  { id: 'guide-day-6', brand: 'Saint Jane', name: 'Sunscreen', price: '$38', shopUrl: 'https://saintjanebeauty.com/collections/sun-protection-spf/products/luxury-sun-ritual', imageUrl: '', genomeKey: 'beauty:sainjane:sunritual.jpg' },
];

const EVE_PRODUCTS: EditorialProduct[] = [
  { id: 'guide-eve-1', brand: 'FDV', name: 'Isadora Dress', price: '$795', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'look:fdv:isadoradress:blk.jpg' },
  { id: 'guide-eve-2', brand: 'Ala\u00efa', name: 'Velvet Thongs', price: '$1,450', shopUrl: 'https://www.bergdorfgoodman.com/p/alaia-velvet-kitten-heel-thong-sandals-prodt196740019', imageUrl: '', genomeKey: 'footwear:alaia:black.jpg' },
  { id: 'guide-eve-3', brand: 'Chlo\u00e9', name: 'Wristlette Bag', price: '$4,200', shopUrl: 'https://www.chloe.com/en-us/p/bags/shoulder-bag/CH5US623P57001.html', imageUrl: '', genomeKey: 'access:bag:chloe:wristlette:black.jpg' },
  { id: 'guide-eve-4', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'feb 26 prod info pg 1.jpg - item 6' },
  { id: 'guide-eve-5', brand: 'Hildegard', name: 'Immortelle Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: '', genomeKey: 'beauty:imortelle oil.jpg' },
  { id: 'guide-eve-6', brand: 'PoppyKing', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: '', genomeKey: 'beauty:poppyking:sinlipstick:red.jpg' },
];

const BLOB_V2 = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2';

/* ── Editorial product map: image slot key → products shown in that image ── */
const EDITORIAL_PRODUCT_MAP: Record<string, EditorialProduct[]> = {
  "morocco-style-1": [
    { id: "edit-ysl-bikini", brand: "Yves Saint Laurent", name: "LouLou Bikini", price: "$795", shopUrl: "https://www.ysl.com", imageUrl: `${BLOB_V2}/morocco-style-1`, genomeKey: "look:ysl:bikini:black.jpg" },
  ],
  "morocco-tile-1": [
    { id: "edit-pp-gaia", brand: "Phoebe Philo", name: "Gaia Dress", price: "$2,360", shopUrl: "https://us.phoebephilo.com", imageUrl: `${BLOB_V2}/morocco-tile-1`, genomeKey: "look:phoebephilo:gaiadress:black.jpg" },
  ],
  "morocco-tile-3": [
    { id: "edit-alaia-coat", brand: "Alaïa", name: "Souk Coat & Desert Pant", price: "$1,200/$760", shopUrl: "https://www.alaia.com", imageUrl: `${BLOB_V2}/morocco-tile-3`, genomeKey: "Look:alia:soukcoat:desertpants:blush.jpg" },
  ],
  "morocco-tile-5": [
    { id: "edit-fdv-este", brand: "Fil de Vie", name: "Este Dress", price: "$675", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-tile-5`, genomeKey: "look:fildevie:estedress:black.jpg" },
  ],
  "morocco-object-1": [
    { id: "edit-fdv-column", brand: "Fil de Vie", name: "Column Dress", price: "$765", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-object-1`, genomeKey: "look:fildevie:columndress:black.jpg" },
  ],
  "morocco-motion-1": [
    { id: "edit-fdv-caftan", brand: "Fil de Vie", name: "Long Caftan Dress", price: "$825", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-motion-1`, genomeKey: "look:fdv:philomenacaftan:sand.jpg" },
  ],
  // Wardrobe day images → DAY_PRODUCTS
  "ward-1-large": DAY_PRODUCTS,
  "ward-1-small1": [DAY_PRODUCTS[1]], // Bottega Kalimero
  "ward-1-small2": [DAY_PRODUCTS[3]], // Bulgari necklace
  // Wardrobe evening images → EVE_PRODUCTS
  "ward-2-large": EVE_PRODUCTS,
  "ward-2-small1": [EVE_PRODUCTS[2]], // Chloé Wristlette
  "ward-2-small2": [EVE_PRODUCTS[5]], // PoppyKing lipstick
  // Amanjena editorial images
  "amanjena-editorial-1": [
    { id: "edit-alaia-coat-2", brand: "Alaïa", name: "Souk Coat & Desert Pant", price: "$1,200/$760", shopUrl: "https://www.alaia.com", imageUrl: `${BLOB_V2}/morocco-tile-3`, genomeKey: "Look:alia:soukcoat:desertpants:blush.jpg" },
  ],
  "amanjena-editorial-2": [
    { id: "edit-fdv-este-2", brand: "Fil de Vie", name: "Este Dress", price: "$675", shopUrl: "http://www.fildevie.com", imageUrl: `${BLOB_V2}/morocco-tile-5`, genomeKey: "look:fildevie:estedress:black.jpg" },
  ],
};

/* ── Itinerary Teaser — slim preview card that gates access to /concierge ── */

const TEASER_IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco/stay-1-large.jpg';

function ItineraryTeaser() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [, setLocation] = useLocation();

  const navigateToItinerary = () => setLocation('/concierge');

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
      // still navigate on failure
    }
    navigateToItinerary();
  };

  return (
    <section style={{ background: '#faf9f6', borderRadius: 12, overflow: 'hidden', margin: '40px 0' }}>
      {/* Section header */}
      <div style={{ textAlign: 'center', padding: '48px 16px 0' }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: 12 }}>
          The Full Journey
        </p>
        <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 400, fontStyle: 'italic', lineHeight: 1.4, color: '#2c2416', margin: 0 }}>
          Your 8-Day Morocco Itinerary
        </h3>
      </div>

      {/* Hero preview image — blurred teaser */}
      <div style={{ position: 'relative', marginTop: 24, maxHeight: 520, overflow: 'hidden' }}>
        <div style={{ filter: 'blur(4px)', opacity: 0.6, pointerEvents: 'none', userSelect: 'none' }}>
          <img
            src={TEASER_IMG}
            alt="Morocco itinerary preview"
            style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Day glimpse overlay — floating itinerary preview */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(250, 249, 246, 0.82)', padding: '40px 20px', textAlign: 'center', zIndex: 10,
        }}>
          {/* Mini day list — a glimpse of what's inside */}
          <div style={{ marginBottom: 28, maxWidth: 360 }}>
            {[
              { day: 1, title: 'Arrival & the Atlas Mountains' },
              { day: 2, title: 'The Medina, Slowly' },
              { day: 3, title: 'Jardin Majorelle & the Souks' },
            ].map((d, i) => (
              <div key={d.day} style={{
                display: 'flex', alignItems: 'baseline', gap: 12, padding: '6px 0',
                borderBottom: i < 2 ? '1px solid rgba(44, 36, 22, 0.08)' : 'none',
              }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c9a84c', minWidth: 44 }}>
                  Day {d.day}
                </span>
                <span style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, fontStyle: 'italic', color: '#2c2416' }}>
                  {d.title}
                </span>
              </div>
            ))}
            <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(44, 36, 22, 0.4)', marginTop: 8 }}>
              + 5 more days of curated Morocco
            </div>
          </div>

          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, fontStyle: 'italic', color: '#2c2416', marginBottom: 12 }}>
            Unlock your complete Morocco experience.
          </div>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(44, 36, 22, 0.6)', marginBottom: 28, maxWidth: 440, lineHeight: 1.6 }}>
            8 days of curated events, restaurants, and wardrobe — every detail planned so you don't have to.
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  background: 'transparent', border: '1px solid rgba(0,0,0,0.2)', color: '#2c2416',
                  padding: '12px 16px', width: 300, maxWidth: '90vw', fontSize: 14,
                  fontFamily: "'Inter', sans-serif", borderRadius: 0, outline: 'none',
                }}
              />
              <button
                type="submit"
                style={{
                  display: 'inline-block', fontFamily: "'Inter', sans-serif", fontSize: 12,
                  fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
                  background: '#c9a84c', color: '#1a1a1a', padding: '14px 40px',
                  textDecoration: 'none', marginTop: 12, transition: 'opacity 0.3s',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Go Gold to Unlock
              </button>
            </form>
          ) : null}

          <button
            onClick={navigateToItinerary}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(44, 36, 22, 0.4)',
              textDecoration: 'none', marginTop: 20, padding: 0, transition: 'color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(44, 36, 22, 0.7)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(44, 36, 22, 0.4)')}
          >
            For pilot testers: Continue without unlocking →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function MoroccoGuide() {
  useScrollDepth("/guides/morocco");
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getImageUrl, hasCustomImage } = useCustomImages();
  const { data: imageSlotsData } = useImageSlots();

  // Editorial product overlay state
  const [overlayData, setOverlayData] = useState<{ imageUrl: string; imageAlt: string; products: EditorialProduct[] } | null>(null);

  const getSlotImageUrl = (slotKey: string): string => {
    if (imageSlotsData?.slots) {
      const slot = imageSlotsData.slots.find((s: any) => s.key === slotKey);
      if (slot?.currentUrl) return slot.currentUrl;
    }
    const defaultSlot = IMAGE_SLOTS.find((s: any) => s.key === slotKey);
    return defaultSlot?.defaultUrl || `${BLOB_V2}/${slotKey}`;
  };

  const openEditorialOverlay = (slotKey: string, imageUrl: string, imageAlt: string) => {
    const products = EDITORIAL_PRODUCT_MAP[slotKey];
    if (products && products.length > 0) {
      setOverlayData({ imageUrl, imageAlt, products });
    }
  };

  /* Genome-resolving product modal — same pattern as /concierge */
  const openProductModal = (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => {
    let resolvedGenomeKey = data.genomeKey;
    if (!resolvedGenomeKey && data.itemId) {
      const flowId = data.itemId.replace(/-(look|wardrobe)$/, '');
      const mapKey = FLOW_LOOK_GENOME_KEY[flowId] || SECTION_LOOK_GENOME_KEY[flowId];
      if (mapKey) resolvedGenomeKey = mapKey;
    }
    const genome = resolvedGenomeKey ? getProductByKey(resolvedGenomeKey) : undefined;
    const displayName = genome ? getProductDisplayName(genome) : data.title;
    const shopUrlResolved = genome && isShoppable(genome) ? genome.url : data.shopUrl;

    setSelectedItem({
      id: data.itemId,
      title: displayName,
      bucket: 'Your Style',
      pinType: data.pinType || 'look',
      assetKey: data.itemId,
      storyTag: 'morocco',
      imageUrl: data.imageUrl,
      brand: genome?.brand || data.brand,
      price: genome?.price || undefined,
      shopUrl: shopUrlResolved || undefined,
      description: genome?.description || data.description,
      color: genome?.color || undefined,
      sizes: genome?.sizes || undefined,
      shopStatus: genome?.shop_status || undefined,
      genomeKey: resolvedGenomeKey,
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-1-large.jpg`} alt="Badi Palace" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-main" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-large.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-1-small1.jpg`} alt="Badi Palace detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-detail" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-1-small2.jpg`} alt="Badi Palace moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-moment" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/exp-1-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-badi-palace-break" itemData={{ title: "Badi Palace", description: "Ruins, scale, silence.", imageUrl: `${IMG}/exp-1-break.jpg`, storyTag: "morocco", bookUrl: "http://www.badipalace.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>

      {/* Experience 2: Jardin Secret */}
      <div className="place-block reverse">
        <div className="place-images layout-c">
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/exp-2-left.jpg`} alt="Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-secret-left" itemData={{ title: "Jardin Secret", description: "A quiet medina escape.", imageUrl: `${IMG}/exp-2-left.jpg`, storyTag: "morocco", bookUrl: "http://lejardinsecretmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "garden"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/exp-2-right.jpg`} alt="Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-secret-right" itemData={{ title: "Jardin Secret", description: "A quiet medina escape.", imageUrl: `${IMG}/exp-2-right.jpg`, storyTag: "morocco", bookUrl: "http://lejardinsecretmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "garden"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-3-large.jpg`} alt="Agafay Desert Camp" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-main" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-3-small1.jpg`} alt="Agafay detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-detail" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-3-small2.jpg`} alt="Agafay moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-moment" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/exp-3-break-v2.jpeg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-agafay-desert-break" itemData={{ title: "Agafay Desert Camp", description: "Desert drama without the five-hour drive.", imageUrl: `${IMG}/exp-3-break-v2.jpeg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "nature"]} size="sm" /></div></div>

      {/* Experience 4: Jardin Majorelle */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/exp-4-large.jpg`} alt="Jardin Majorelle" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-main" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-large.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-4-small1.jpg`} alt="Majorelle detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-detail" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-small1.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/exp-4-small2.jpg`} alt="Majorelle moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-majorelle-moment" itemData={{ title: "Jardin Majorelle", description: "Cobalt blue and exquisite beauty.", imageUrl: `${IMG}/exp-4-small2.jpg`, storyTag: "morocco", bookUrl: "http://jardinmajorelle.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "experience", "culture"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-1-large.jpg`} alt="Nomad" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-main" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-large.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-1-small1.jpg`} alt="Nomad detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-detail" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-1-small2.jpg`} alt="Nomad moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-nomad-moment" itemData={{ title: "Nomad", description: "Rooftop views and modern Moroccan.", imageUrl: `${IMG}/eat-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://nomadmarrakech.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
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
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-2-left.jpg`} alt="Cafe Bacha" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-left" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-left.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-2-right.jpg`} alt="Cafe Bacha" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-right" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-right.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/eat-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-cafe-bacha-break" itemData={{ title: "Café Bacha", description: "Decadent morning ritual.", imageUrl: `${IMG}/eat-2-break.jpg`, storyTag: "morocco", bookUrl: "http://bachacoffee.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "cafe"]} size="sm" /></div></div>

      {/* Eat 3: La Famille */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-3-large.jpg`} alt="La Famille" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-main" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-3-small1.jpg`} alt="La Famille detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-detail" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-3-small2.jpg`} alt="La Famille moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-famille-moment" itemData={{ title: "La Famille", description: "Vegetarian and unexpectedly chic.", imageUrl: `${IMG}/eat-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-4-large.jpg`} alt="Le Jardin de Lotus" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-main" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-large.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-4-small1.jpg`} alt="Le Jardin de Lotus detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-detail" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-small1.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-4-small2.jpg`} alt="Le Jardin de Lotus moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-jardin-de-lotus-moment" itemData={{ title: "Le Jardin de Lotus", description: "Relaxed glamour", imageUrl: `${IMG}/eat-4-small2.jpg`, storyTag: "morocco", bookUrl: "https://lejardindelotus.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
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
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-5-left.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-left" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-left.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/eat-5-right.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-right" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-right.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/eat-5-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mamounia-drinks-break" itemData={{ title: "La Mamounia — Evening Drinks", description: "Golden hour, perfected.", imageUrl: `${IMG}/eat-5-break.jpg`, storyTag: "morocco", bookUrl: "http://www.mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant", "bar"]} size="sm" /></div></div>

      {/* Eat 6: Dar Yacout */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/eat-6-large.jpg`} alt="Dar Yacout" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-main" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-6-small1.jpg`} alt="Dar Yacout detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-detail" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/eat-6-small2.jpg`} alt="Dar Yacout moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-dar-yacout-moment" itemData={{ title: "Dar Yacout", description: "Traditional Moroccan, done properly.", imageUrl: `${IMG}/eat-6-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "restaurant"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-1-large.jpg`} alt="The Souks" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-main" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-1-small1.jpg`} alt="The Souks detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-detail" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-1-small2.jpg`} alt="The Souks moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-souks-moment" itemData={{ title: "The Souks", description: "Start here. Then wander.", imageUrl: `${IMG}/shop-1-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop", "market"]} size="sm" /></div></div>
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
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/shop-2-left.jpg`} alt="El Fenn Gift Shop" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-left" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-left.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-slot" style={{ position: "relative" }}><img src={`${IMG}/shop-2-right.jpg`} alt="El Fenn Gift Shop" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-right" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-right.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/shop-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-elfenn-shop-break" itemData={{ title: "El Fenn Gift Shop", description: "Actually chic souvenirs.", imageUrl: `${IMG}/shop-2-break.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>

      {/* Shop 3: Mustapha Blaoui */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-3-large.jpg`} alt="Mustapha Blaoui" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-main" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-3-small1.jpg`} alt="Mustapha Blaoui detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-detail" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-small1.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-3-small2.jpg`} alt="Mustapha Blaoui moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-mustapha-blaoui-moment" itemData={{ title: "Mustapha Blaoui", description: "Treasure hunting at scale.", imageUrl: `${IMG}/shop-3-small2.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/shop-4-large.jpg`} alt="Max & Jan" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-main" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-large.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-4-small1.jpg`} alt="Max & Jan detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-detail" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/shop-4-small2.jpg`} alt="Max & Jan moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-max-jan-moment" itemData={{ title: "Max & Jan", description: "Modern Marrakech.", imageUrl: `${IMG}/shop-4-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.maxandjan.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "shop"]} size="sm" /></div></div>
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

      {/* ═══ CURATE PROMPT ═══ */}
      <div style={{
        textAlign: 'center',
        padding: '48px 24px',
        maxWidth: 420,
        margin: '0 auto',
      }}>
        <p style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: '15px',
          fontStyle: 'italic',
          color: 'rgba(26, 26, 22, 0.5)',
          lineHeight: 1.7,
          marginBottom: '16px',
        }}>
          Build a Marrakech edit from what you've saved. Come back anytime — it changes as your Suitcase grows.
        </p>
        <Link href="/suitcase?curate=true">
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase' as const,
            color: 'rgba(26, 26, 22, 0.35)',
            borderBottom: '1px solid rgba(26, 26, 22, 0.15)',
            paddingBottom: '2px',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
          }}>
            Curate for Me →
          </span>
        </Link>
      </div>

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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-1-large.jpg`} alt="El Fenn" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-main" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-large.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-1-small1.jpg`} alt="El Fenn detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-detail" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-1-small2.jpg`} alt="El Fenn moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-el-fenn-moment" itemData={{ title: "El Fenn", description: "Color, art, and rooftop sunsets.", imageUrl: `${IMG}/stay-1-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.elfenn.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-2-large.jpg`} alt="Riad Jardin Secret" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-main" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-large.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-2-small1.jpg`} alt="Riad Jardin Secret detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-detail" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-small1.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-2-small2.jpg`} alt="Riad Jardin Secret moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-moment" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-small2.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
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

      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/stay-2-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-riad-jardin-secret-break" itemData={{ title: "Riad Jardin Secret", description: "Intimate, traditional, serene.", imageUrl: `${IMG}/stay-2-break.jpg`, storyTag: "morocco", bookUrl: "http://www.riad-jardinsecret.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>

      {/* Stay 3: La Mamounia */}
      <div className="place-block">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/stay-3-large.jpg`} alt="La Mamounia" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-main" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-large.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-3-small1.jpg`} alt="La Mamounia detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-detail" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-small1.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/stay-3-small2.jpg`} alt="La Mamounia moment" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-la-mamounia-moment" itemData={{ title: "La Mamounia", description: "Iconic. Unapologetically grand.", imageUrl: `${IMG}/stay-3-small2.jpg`, storyTag: "morocco", bookUrl: "http://mamounia.com" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
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

      {/* Stay 4: Amanjena */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Amanjena poolside"); }}>
            <img src={getSlotImageUrl("morocco-style-1")} alt="Amanjena" />
            <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-main" itemData={{ title: "Amanjena", description: "Aman's Marrakech. Pink marble, reflecting pools, absolute silence.", imageUrl: getSlotImageUrl("morocco-style-1"), storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div>
            <ShoppableIndicator onClick={() => { const url = getSlotImageUrl("morocco-style-1"); openEditorialOverlay("morocco-style-1", url, "Amanjena poolside"); }} />
          </div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${BLOB_V2}/morocco-texture-1`} alt="Amanjena detail" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-detail" itemData={{ title: "Amanjena", description: "Pink marble, reflecting pools, absolute silence.", imageUrl: `${BLOB_V2}/morocco-texture-1`, storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${BLOB_V2}/morocco-experience-1`} alt="Amanjena atmosphere" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-amanjena-moment" itemData={{ title: "Amanjena", description: "Pink marble, reflecting pools, absolute silence.", imageUrl: `${BLOB_V2}/morocco-experience-1`, storyTag: "morocco", bookUrl: "https://www.aman.com/resorts/amanjena" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "hotel", "stay"]} size="sm" /></div></div>
        </div>
        <div className="place-info">
          <h3>Amanjena</h3>
          <div className="tagline">Aman&rsquo;s Marrakech. Pink marble, reflecting pools, absolute silence.</div>
          <div className="description">Ten minutes from the Medina but it feels like another country. Amanjena is where you go when you want to disappear &mdash; in the best way. The pavilions face reflecting pools that mirror the Atlas Mountains. The gardens are almost absurdly peaceful. Everything is rose-toned and unhurried. If you can, book a maison with a private pool. You won&rsquo;t leave the property for the first two days. You won&rsquo;t want to.</div>
          <div className="address">Route de Ouarzazate, Km 12, Marrakech 40000</div>
          <div className="icons">
            <a href="https://www.aman.com/resorts/amanjena" target="_blank" rel="noopener noreferrer">&#x1F310;</a>
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* Amanjena editorial fashion moments — standalone shoppable images */}
      <div className="full-image" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("amanjena-editorial-1", `${BLOB_V2}/morocco-tile-3`, "Blush pink on stairs at Amanjena")}>
        <img src={`${BLOB_V2}/morocco-tile-3`} alt="Blush pink on stairs at Amanjena" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-amanjena-editorial-1" itemData={{ title: "Alaïa at Amanjena", description: "Blush pink against sun-warmed clay.", imageUrl: `${BLOB_V2}/morocco-tile-3`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => openEditorialOverlay("amanjena-editorial-1", `${BLOB_V2}/morocco-tile-3`, "Blush pink on stairs at Amanjena")} />
      </div>
      <div style={{ textAlign: 'center', padding: '10px 24px 0' }}>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 13, fontStyle: 'italic', color: '#8a7d6b', margin: 0 }}>Blush pink against sun-warmed clay.</p>
      </div>

      <div className="full-image" style={{ position: "relative", cursor: "pointer", marginTop: 24 }} onClick={() => openEditorialOverlay("amanjena-editorial-2", `${BLOB_V2}/morocco-tile-5`, "Crisp black cotton against terracotta")}>
        <img src={`${BLOB_V2}/morocco-tile-5`} alt="Crisp black cotton against terracotta" />
        <div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-amanjena-editorial-2" itemData={{ title: "FDV Este Dress at Amanjena", description: "Crisp black cotton against terracotta.", imageUrl: `${BLOB_V2}/morocco-tile-5`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div>
        <ShoppableIndicator onClick={() => openEditorialOverlay("amanjena-editorial-2", `${BLOB_V2}/morocco-tile-5`, "Crisp black cotton against terracotta")} />
      </div>
      <div style={{ textAlign: 'center', padding: '10px 24px 0' }}>
        <p style={{ fontFamily: "'Lora', serif", fontSize: 13, fontStyle: 'italic', color: '#8a7d6b', margin: 0 }}>Crisp black cotton against terracotta.</p>
      </div>

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
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-large", `${IMG}/ward-1-large.jpg`, "Day in the Medina look")}><img src={`${IMG}/ward-1-large.jpg`} alt="Day in the Medina look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-main" itemData={{ title: "Day in the Medina", description: "Medina uniform.", imageUrl: `${IMG}/ward-1-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-large", `${IMG}/ward-1-large.jpg`, "Day in the Medina look")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-small1", `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, "Bottega Veneta Kalimero Bag")}><img src={`${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`} alt="Bottega Veneta Kalimero Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-detail" itemData={{ title: "Bottega Veneta Kalimero Bag", imageUrl: `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-small1", `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, "Bottega Veneta Kalimero Bag")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-1-small2", `${IMG}/ward-1-small2_bulgari_necklace.jpg`, "Bulgari Necklace")}><img src={`${IMG}/ward-1-small2_bulgari_necklace.jpg`} alt="Bulgari Necklace" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-day-look-moment" itemData={{ title: "Bulgari Necklace", imageUrl: `${IMG}/ward-1-small2_bulgari_necklace.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-1-small2", `${IMG}/ward-1-small2_bulgari_necklace.jpg`, "Bulgari Necklace")} /></div>
        </div>
        <div className="place-info">
          <h3>Day in the Medina</h3>
          <div className="tagline">Medina uniform.</div>
          <div className="description">Linen you can breathe in. Stripes that feel intentional but not precious. Flat sandals because you&rsquo;ll be walking more than you expect. Gold, but not too much. Hair slightly undone. It moves with you &mdash; which is the whole point.</div>
        </div>
      </div>

      {/* Wardrobe 2: Riad Evenings */}
      <div className="place-block reverse">
        <div className="place-images layout-b">
          <div className="img-large" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-large", `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, "Riad Evenings look")}><img src={`${IMG}/ward-2-large_fdv_isadora_dress.jpg`} alt="Riad Evenings look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-main" itemData={{ title: "Riad Evenings", description: "Marrakech does drama.", imageUrl: `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-large", `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, "Riad Evenings look")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-small1", `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, "Chloé Wristlette Bag")}><img src={`${IMG}/ward-2-small1_chloe_wristless_bag.jpg`} alt="Chloé Wristlette Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-detail" itemData={{ title: "Chloé Wristlette Bag", imageUrl: `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-small1", `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, "Chloé Wristlette Bag")} /></div>
          <div className="img-small" style={{ position: "relative", cursor: "pointer" }} onClick={() => openEditorialOverlay("ward-2-small2", `${IMG}/ward-2-small2_poppyking_red.jpg`, "PoppyKing Lipstick")}><img src={`${IMG}/ward-2-small2_poppyking_red.jpg`} alt="PoppyKing Lipstick" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="style" itemId="guide-morocco-evening-look-moment" itemData={{ title: "PoppyKing Lipstick", imageUrl: `${IMG}/ward-2-small2_poppyking_red.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div><ShoppableIndicator onClick={() => openEditorialOverlay("ward-2-small2", `${IMG}/ward-2-small2_poppyking_red.jpg`, "PoppyKing Lipstick")} /></div>
        </div>
        <div className="place-info">
          <h3>Riad Evenings</h3>
          <div className="tagline">Marrakech does drama. You might as well participate.</div>
          <div className="description">Lantern light, warm stone, a drink resting on the table while you lean in. Black feels intentional here. Slightly dangerous in candlelight. In a good way. You&rsquo;ll stay longer than planned. You won&rsquo;t regret it.</div>
        </div>
      </div>

      {/* SHOP THE FULL EDIT link */}
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <Link href="/shop">
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: '#c9a84c',
            borderBottom: '1px solid #c9a84c',
            paddingBottom: '2px',
            cursor: 'pointer',
          }}>
            Shop the Full Edit →
          </span>
        </Link>
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

      {/* ═══ ITINERARY TEASER — Real editorial overview from /concierge ═══ */}
      <ItineraryTeaser />

      {/* ═══ FOOTER ═══ */}
      <div className="guide-footer">
        <div className="closing">Some places don&rsquo;t need to be explained. They need to be felt.</div>
        <div style={{ textAlign: 'center', padding: '16px 24px 0', maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lora, serif', fontSize: 14, fontStyle: 'italic', color: '#999', letterSpacing: '0.02em' }}>
            Love this? Tap the share icon above &mdash; your friends will thank you.
          </p>
        </div>
        <div className="brand-mark">FDV Destination Guide &mdash; Fil de Vie Concierge</div>
      </div>

      <ItemModal
        item={selectedItem}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        source="current"
      />

      {/* Editorial Product Overlay — Level 2 */}
      {overlayData && (
        <EditorialProductOverlay
          editorialImageUrl={overlayData.imageUrl}
          editorialImageAlt={overlayData.imageAlt}
          products={overlayData.products}
          onClose={() => setOverlayData(null)}
          onProductTap={(product) => {
            setOverlayData(null);
            const genome = product.genomeKey ? getProductByKey(product.genomeKey) : undefined;
            // Resolve studio shot from genome, fall back to editorial image
            const studioUrl = product.genomeKey ? getShopImageUrl(product.genomeKey) : '';
            setSelectedItem({
              id: product.id,
              title: product.name,
              bucket: 'Your Style',
              pinType: 'style',
              assetKey: product.id,
              storyTag: 'morocco',
              imageUrl: studioUrl || product.imageUrl,
              brand: genome?.brand || product.brand,
              price: genome?.price || product.price || undefined,
              shopUrl: genome && isShoppable(genome) ? genome.url : product.shopUrl || undefined,
              description: genome?.description,
              color: genome?.color,
              sizes: genome?.sizes,
              shopStatus: genome?.shop_status,
              genomeKey: product.genomeKey,
            });
            setDrawerOpen(true);
          }}
        />
      )}
    </div>
  );
}
