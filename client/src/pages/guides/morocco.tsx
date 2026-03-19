import { useState, FormEvent } from 'react';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { PinButton } from '@/components/pin-button';
import { EditorialDaySection, extractEditorialData } from '@/components/editorial-sections';
import { useCustomImages } from '@/hooks/use-custom-images';
import { getProductByKey, getProductDisplayName, isShoppable, getShopImageUrl, FLOW_LOOK_GENOME_KEY, SECTION_LOOK_GENOME_KEY } from '@/lib/brand-genome';
import './morocco-guide.css';

const IMG = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/images-v2/guide-morocco';
const CAROUSEL = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com/carousel-morocco';

type CarouselProduct = {
  id: string;
  brand: string;
  name: string;
  price: string | null;
  shopUrl: string;
  imageUrl: string;
  genomeKey?: string;
};

const DAY_PRODUCTS: CarouselProduct[] = [
  { id: 'guide-day-1', brand: 'Fil de Vie', name: 'Juno Blouse & Marrakech Pants', price: null, shopUrl: 'http://www.fildevie.com', imageUrl: `${CAROUSEL}/01_fdv_juno.jpg`, genomeKey: 'look:fdv:junoblouse:marrakechpant:stripe.jpg' },
  { id: 'guide-day-2', brand: 'Bottega Veneta', name: 'Kalimero Bag', price: '$4,100', shopUrl: 'https://www.bottegaveneta.com/en-us/small-kalimero-citta-fondant-813744715.html', imageUrl: `${CAROUSEL}/02_bottega_kalimero.jpg`, genomeKey: 'accessory:bag:bottega:kalimero:black.jpg' },
  { id: 'guide-day-3', brand: 'A Emery', name: 'Kir Sandal', price: '$185', shopUrl: 'https://aemery.com/products/the-kir-sandal-black', imageUrl: `${CAROUSEL}/03_aemery_kir_sandal.jpg`, genomeKey: 'footwear, amery kit sandal.jpg' },
  { id: 'guide-day-4', brand: 'Bulgari via 1st Dibs', name: 'Lapis Cabachon Necklace', price: '$50,000', shopUrl: 'https://www.1stdibs.com/jewelry/necklaces/pendant-necklaces/bvlgari-1980s-unheated-sapphire-gold-necklace/id-j_28202612/', imageUrl: `${CAROUSEL}/04_bulgari_necklace.jpg`, genomeKey: 'accessory:jewelry:bulgari:cabachon necklace.jpg' },
  { id: 'guide-day-5', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: `${CAROUSEL}/05_loewe_sunglasses.jpg`, genomeKey: 'access:sugnlasses:loewe:black.jpg' },
  { id: 'guide-day-6', brand: 'Saint Jane', name: 'Sunscreen', price: '$38', shopUrl: 'https://saintjanebeauty.com/collections/sun-protection-spf/products/luxury-sun-ritual', imageUrl: `${CAROUSEL}/06_saintjane_sunscreen.jpg`, genomeKey: 'beauty:sainjane:sunritual.jpg' },
];

const EVE_PRODUCTS: CarouselProduct[] = [
  { id: 'guide-eve-1', brand: 'FDV', name: 'Isadora Dress', price: '$795', shopUrl: 'http://www.fildevie.com', imageUrl: `${CAROUSEL}/07_fdv_isadora.jpg`, genomeKey: 'look:fdv:isadoradress:blk.jpg' },
  { id: 'guide-eve-2', brand: 'Ala\u00efa', name: 'Velvet Thongs', price: '$1,450', shopUrl: 'https://www.bergdorfgoodman.com/p/alaia-velvet-kitten-heel-thong-sandals-prodt196740019', imageUrl: `${CAROUSEL}/08_alaia_thongs.jpg`, genomeKey: 'footwear:alaia:black.jpg' },
  { id: 'guide-eve-3', brand: 'Chlo\u00e9', name: 'Wristlette Bag', price: '$4,200', shopUrl: 'https://www.chloe.com/en-us/p/bags/shoulder-bag/CH5US623P57001.html', imageUrl: `${CAROUSEL}/09_chloe_bag.jpg`, genomeKey: 'access:bag:chloe:wristlette:black.jpg' },
  { id: 'guide-eve-4', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: `${CAROUSEL}/10_phoebephilo_hoops.jpg`, genomeKey: 'feb 26 prod info pg 1.jpg - item 6' },
  { id: 'guide-eve-5', brand: 'Hildegard', name: 'Immortelle Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: `${CAROUSEL}/11_hildegard_oil.jpg`, genomeKey: 'beauty:imortelle oil.jpg' },
  { id: 'guide-eve-6', brand: 'PoppyKing', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: `${CAROUSEL}/12_poppyking_lipstick.jpg`, genomeKey: 'beauty:poppyking:sinlipstick:red.jpg' },
];

function CarouselItem({ product, onOpenModal }: { product: CarouselProduct; onOpenModal: (p: CarouselProduct) => void }) {
  const studioUrl = product.genomeKey ? getShopImageUrl(product.genomeKey) : '';
  const imgSrc = studioUrl || product.imageUrl;
  return (
    <div className="carousel-item" onClick={() => onOpenModal(product)} style={{ cursor: 'pointer' }}>
      <div className="item-image" style={{ position: 'relative' }}>
        <img src={imgSrc} alt={`${product.brand} ${product.name}`} />
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

/* ── Itinerary Teaser — uses same hooks + components as /concierge ── */

interface ItineraryTeaserProps {
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
  onOpenProductModal: (data: { title: string; imageUrl: string; itemId: string; brand?: string; description?: string; shopUrl?: string; pinType?: string; genomeKey?: string }) => void;
}

function ItineraryTeaser({ getImageUrl, hasCustomImage, onOpenProductModal }: ItineraryTeaserProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const editorialData = extractEditorialData();

  const day1 = editorialData.find(d => d.dayNumber === 1);
  const day2 = editorialData.find(d => d.dayNumber === 2);
  const day3 = editorialData.find(d => d.dayNumber === 3);
  const remainingDays = editorialData.filter(d => d.dayNumber >= 3);

  const handleUnlock = () => setIsUnlocked(true);

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
      handleUnlock();
    } catch {
      handleUnlock();
    }
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

      {/* Days 1 & 2 — always visible, identical to /concierge */}
      <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 16px' }}>
        {day1 && (
          <EditorialDaySection
            day={day1}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
            onOpenProductModal={onOpenProductModal}
          />
        )}
        {day2 && (
          <EditorialDaySection
            day={day2}
            getImageUrl={getImageUrl}
            hasCustomImage={hasCustomImage}
            onOpenProductModal={onOpenProductModal}
          />
        )}
      </div>

      {/* LOCKED: Day 3 blurred + gate overlay (capped at ~1 screen height) */}
      {!isUnlocked && (
        <div style={{ position: 'relative', marginTop: 20, maxHeight: 700, overflow: 'hidden' }}>
          <div style={{ filter: 'blur(8px)', opacity: 0.5, pointerEvents: 'none', userSelect: 'none' }}>
            <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 16px' }}>
              {day3 && (
                <EditorialDaySection
                  day={day3}
                  getImageUrl={getImageUrl}
                  hasCustomImage={hasCustomImage}
                />
              )}
            </div>
          </div>

          {/* Gate overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(250, 249, 246, 0.85)', padding: '40px 20px', textAlign: 'center', zIndex: 10,
          }}>
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
              onClick={handleUnlock}
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
      )}

      {/* UNLOCKED: Days 3-8 fully visible — identical to /concierge */}
      {isUnlocked && (
        <div style={{ maxWidth: 1024, margin: '0 auto', padding: '0 16px' }}>
          {remainingDays.map(day => (
            <EditorialDaySection
              key={day.dayNumber}
              day={day}
              getImageUrl={getImageUrl}
              hasCustomImage={hasCustomImage}
              onOpenProductModal={onOpenProductModal}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function MoroccoGuide() {
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { getImageUrl, hasCustomImage } = useCustomImages();

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
          Build a Marrakech edit from what you've saved.
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

      {/* Full-width break — transition to wardrobe */}
      <div className="full-image" style={{ position: "relative" }}><img src={`${IMG}/wardrobe-break.jpg`} alt="" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-wardrobe-break" itemData={{ title: "Morocco Wardrobe", description: "What to pack.", imageUrl: `${IMG}/wardrobe-break.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>

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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/ward-1-large.jpg`} alt="Day in the Medina look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-day-look-main" itemData={{ title: "Day in the Medina", description: "Medina uniform.", imageUrl: `${IMG}/ward-1-large.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`} alt="Bottega Veneta Kalimero Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-day-look-detail" itemData={{ title: "Day in the Medina", description: "Medina uniform.", imageUrl: `${IMG}/ward-1-small1_bottegaveneta_kalimero_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/ward-1-small2_bulgari_necklace.jpg`} alt="Bulgari Necklace" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-day-look-moment" itemData={{ title: "Day in the Medina", description: "Medina uniform.", imageUrl: `${IMG}/ward-1-small2_bulgari_necklace.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
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
          <div className="img-large" style={{ position: "relative" }}><img src={`${IMG}/ward-2-large_fdv_isadora_dress.jpg`} alt="Riad Evenings look" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-evening-look-main" itemData={{ title: "Riad Evenings", description: "Marrakech does drama.", imageUrl: `${IMG}/ward-2-large_fdv_isadora_dress.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/ward-2-small1_chloe_wristless_bag.jpg`} alt="Chloé Wristlette Bag" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-evening-look-detail" itemData={{ title: "Riad Evenings", description: "Marrakech does drama.", imageUrl: `${IMG}/ward-2-small1_chloe_wristless_bag.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
          <div className="img-small" style={{ position: "relative" }}><img src={`${IMG}/ward-2-small2_poppyking_red.jpg`} alt="PoppyKing Lipstick" /><div style={{ position: "absolute", top: 8, right: 8, zIndex: 10 }}><PinButton itemType="place" itemId="guide-morocco-evening-look-moment" itemData={{ title: "Riad Evenings", description: "Marrakech does drama.", imageUrl: `${IMG}/ward-2-small2_poppyking_red.jpg`, storyTag: "morocco" }} sourceContext="morocco-guide" aestheticTags={["morocco", "travel", "style"]} size="sm" /></div></div>
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

      {/* ═══ ITINERARY TEASER — Real editorial overview from /concierge ═══ */}
      <ItineraryTeaser getImageUrl={getImageUrl} hasCustomImage={hasCustomImage} onOpenProductModal={openProductModal} />

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
