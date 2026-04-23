import { useState, FormEvent, useRef, useEffect, useCallback, Children, cloneElement, isValidElement, type ReactNode } from 'react';
import { Link } from 'wouter';
import { ItemModal, type ItemModalData } from '@/components/item-modal';
import { PinButton } from '@/components/pin-button';
import { EditorialProductOverlay, ShoppableIndicator, type EditorialProduct } from '@/components/editorial-product-overlay';
import { useUser } from '@/contexts/user-context';
import { getProductByKey, isShoppable, getShopImageUrl } from '@/lib/brand-genome';
import { useScrollDepth } from '@/hooks/use-scroll-depth';
import './morocco-guide.css';

const BLOB = 'https://dzjf7ytng5vblbwy.public.blob.vercel-storage.com';

/* ── Day on the Island — clothing, footwear, accessories ── */
const HYDRA_DAY_PRODUCTS: EditorialProduct[] = [
  { id: 'hydra-day-lillith', brand: 'FIL DE VIE', name: 'Lilith Caftan', price: '$475', shopUrl: 'https://fildevie.com/collections/shop-all/products/lilith-caftan', imageUrl: '', genomeKey: 'STYLE_FDV_LILITHCAFTAN_CRM.JPEG' },
  { id: 'hydra-day-cybel', brand: 'FIL DE VIE', name: 'Cybel Blouse', price: '$395', shopUrl: 'https://fildevie.com/collections/tops-auto/products/cybele-blouse', imageUrl: '', genomeKey: 'STYLE_FDV_CYBEL_BLOUSE_STRIPE.JPEG' },
  { id: 'hydra-day-diana', brand: 'FIL DE VIE', name: 'Diana Dress', price: '$475', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'STYLE_FDV_DIANA_DRESS_STRIPE.JPEG' },
  { id: 'hydra-day-loewe', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: '', genomeKey: 'ACCESS_LOEWE_INFLATED_SUNGLASSES_BLK.JPEG' },
  { id: 'hydra-day-sandal', brand: 'A Emery', name: 'Kir Sandal', price: '$185', shopUrl: 'https://aemery.com/products/the-kir-sandal-black', imageUrl: '', genomeKey: 'FOOTWEAR_AEMERY_KIR_SANDAL_BLK.JPEG' },
  { id: 'hydra-day-hoops', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'Jewelry_phoebephilo_mini_hoops_studs_gold' },
  { id: 'hydra-day-immortelle', brand: 'Hildegaard', name: 'Immortelle Oil', price: '$375', shopUrl: 'https://hildegaard.com/products/immortelle', imageUrl: '', genomeKey: 'BEAUTY_HILDEGAARD_IMMORTELLEOIL.JPEG', bucket: 'Objects of Desire', pinType: 'object' },
];

/* ── Evening at the Harbor — dresses, shoes, jewelry, beauty ── */
const HYDRA_EVE_PRODUCTS: EditorialProduct[] = [
  { id: 'hydra-eve-isadora', brand: 'FIL DE VIE', name: 'Isadora Dress', price: '$795', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'STYLE_FDV_ISADORA_DRESS_BLK.JPEG' },
  { id: 'hydra-eve-alaia', brand: 'Alaïa', name: 'Heel Thong Sandals', price: '$1,450', shopUrl: 'https://www.bergdorfgoodman.com/p/alaia-velvet-kitten-heel-thong-sandals-prodt196740019', imageUrl: '', genomeKey: 'FOOTWEAR_ALAIA_THONG_SANDAL_VELVET_BLK.JPEG' },
  { id: 'hydra-eve-calypso', brand: 'FIL DE VIE', name: 'Calypso Dress', price: '$600', shopUrl: 'https://fildevie.com/collections/dresses/products/calypso-dress', imageUrl: '', genomeKey: 'LOOK:FDV:CALYPSODRESS:BLACK.jpg' },
  { id: 'hydra-eve-silkset', brand: 'FIL DE VIE', name: 'Crepe Silk Set', price: '$498', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'STYLE_FDV_SILK_SET_BLK.jpg' },
  { id: 'hydra-eve-bulgari', brand: 'Bulgari', name: 'Serpenti Watch', price: '$13,200', shopUrl: 'https://www.bulgari.com/en-us/watches/', imageUrl: '', genomeKey: 'ACCESSORY:BULGAR:SERPENTI:BLK.jpg' },
  { id: 'hydra-eve-paco', brand: 'Paco Rabanne', name: 'Gold Pailette Handbag', price: '$1,490', shopUrl: 'https://fashion.rabanne.com/en-us/', imageUrl: '', genomeKey: 'ACCESS_PACORABANNE_HANDBAG_GOLD.JPEG' },
  { id: 'hydra-eve-poppy', brand: 'PoppyKing', name: 'Original Sin Lipstick', price: '$34', shopUrl: 'https://www.modaoperandi.com/beauty/p/poppy-king/original-sin-lipstick/618622', imageUrl: '', genomeKey: 'BEAUTY_POPPYKING_ORIGINALSIN_LIPSTICK.JPEG', bucket: 'Objects of Desire', pinType: 'object' },
];

/* ── What Travels Well — accessories, beauty, objects ── */
const HYDRA_TRAVEL_PRODUCTS: EditorialProduct[] = [
  { id: 'hydra-trv-atlasscarf', brand: 'FIL DE VIE', name: 'Atlas Scarf', price: '$275', shopUrl: 'http://www.fildevie.com', imageUrl: '', genomeKey: 'LOOK:FDV:ATLASSCARF:IVORY.jpg' },
  { id: 'hydra-trv-kalimero', brand: 'Bottega Veneta', name: 'Kalimero Bag', price: '$4,100', shopUrl: 'https://www.bottegaveneta.com', imageUrl: '', genomeKey: 'ACCESSORY:BAG:BOTTEGA:KALIMERO:BLACK.jpg' },
  { id: 'hydra-trv-loewe', brand: 'Loewe', name: 'Inflated Cat Eye Sunglasses', price: '$440', shopUrl: 'https://www.saksfifthavenue.com/product/loewe-inflated-46mm-cat-eye-sunglasses-0400019603124.html', imageUrl: '', genomeKey: 'ACCESS_LOEWE_INFLATED_SUNGLASSES_BLK.JPEG' },
  { id: 'hydra-trv-hoops', brand: 'Phoebe Philo', name: 'Gold Studded Mini Hoops', price: '$550', shopUrl: 'https://us.phoebephilo.com/products/beaded-hoop-earrings-small-in-gold-plated-sterling-silver', imageUrl: '', genomeKey: 'Jewelry_phoebephilo_mini_hoops_studs_gold' },
  { id: 'hydra-trv-slides', brand: 'Phoebe Philo', name: 'Robe Slide', price: '$890', shopUrl: 'https://us.phoebephilo.com', imageUrl: '', genomeKey: 'ACCESSORY:FOOTWEAR:PHOEBEPHILO_ROBE_SLIPPERS_IVORY' },
  { id: 'hydra-trv-sunscreen', brand: 'Le Prunier', name: 'Plumscreen Sunscreen', price: '$80', shopUrl: 'https://www.leprunier.com', imageUrl: '', genomeKey: 'BEAUTY_LEPRUNIER_SUNSCREEN', bucket: 'Objects of Desire', pinType: 'object' },
];

/* ══════════════════════════════════════════════
   PlaceImages — infinite-loop snap carousel
   Identical to Morocco guide pattern
══════════════════════════════════════════════ */
type LayoutType = 'a' | 'b' | 'c';

function PlaceImages({ layout, children }: { layout: LayoutType; children: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = Children.toArray(children);
  const count = slides.length;
  const clonedFirst = count > 0 ? cloneElement(slides[0] as React.ReactElement, { key: 'clone-first' }) : null;
  const clonedLast = count > 0 ? cloneElement(slides[count - 1] as React.ReactElement, { key: 'clone-last' }) : null;
  const allSlides = count > 0 ? [clonedLast, ...slides, clonedFirst].filter(Boolean) : slides;

  const scrollToDomIndex = useCallback((domIdx: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.children[domIdx] as HTMLElement | undefined;
    if (slide) el.scrollTo({ left: slide.offsetLeft, behavior });
  }, []);

  useEffect(() => {
    if (count <= 1) return;
    const el = scrollRef.current;
    if (!el || initialized.current) return;
    initialized.current = true;
    requestAnimationFrame(() => scrollToDomIndex(1, 'auto'));
  }, [count, scrollToDomIndex]);

  const handleScroll = useCallback(() => {
    if (count <= 1) return;
    const el = scrollRef.current;
    if (!el) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const domCount = el.children.length;
      const slide0 = el.children[0] as HTMLElement | undefined;
      const slideW = slide0?.offsetWidth || 1;
      const domIdx = Math.round(el.scrollLeft / slideW);
      if (domIdx === 0) scrollToDomIndex(domCount - 2, 'auto');
      else if (domIdx === domCount - 1) scrollToDomIndex(1, 'auto');
    }, 140);
  }, [count, scrollToDomIndex]);

  const prev = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideW = (el.children[0] as HTMLElement)?.offsetWidth || 1;
    const cur = Math.round(el.scrollLeft / slideW);
    scrollToDomIndex(cur - 1);
  }, [scrollToDomIndex]);

  const next = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const slideW = (el.children[0] as HTMLElement)?.offsetWidth || 1;
    const cur = Math.round(el.scrollLeft / slideW);
    scrollToDomIndex(cur + 1);
  }, [scrollToDomIndex]);

  if (count <= 1) {
    return (
      <div className={`place-images layout-${layout}`}>
        {children}
      </div>
    );
  }

  return (
    <div className="place-images-wrap">
      <div
        ref={scrollRef}
        className={`place-images layout-${layout}`}
        onScroll={handleScroll}
      >
        {allSlides}
      </div>
      <button className="carousel-arrow carousel-prev" onClick={prev} aria-label="Previous">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="carousel-arrow carousel-next" onClick={next} aria-label="Next">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F0EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   PlaceContact — address + website + Instagram
   Identical to Morocco guide pattern
══════════════════════════════════════════════ */
function PlaceContact({
  venueName,
  address,
  url,
  instagramHandle,
  phone,
  bookUrl,
}: {
  venueName: string;
  address?: string;
  url?: string;
  instagramHandle?: string;
  phone?: string;
  bookUrl?: string;
}) {
  const linkUrl = url || bookUrl;
  return (
    <div className="place-contact">
      {address && linkUrl ? (
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="place-address-link">
          {address}
        </a>
      ) : address ? (
        <span className="place-address">{address}</span>
      ) : null}
      {instagramHandle && (
        <a
          href={`https://www.instagram.com/${instagramHandle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="place-instagram"
          aria-label={`${venueName} on Instagram`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          @{instagramHandle}
        </a>
      )}
      {phone && (
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="place-phone" aria-label={`Call ${venueName}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.61 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          {phone}
        </a>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   HydraTripTeaserAndBriefForm
   "A Taste of Your Trip" + "Want yours?" form
══════════════════════════════════════════════ */
function HydraTripTeaserAndBriefForm() {
  const { user, email, setShowPassportGate, setPendingSaveCallback } = useUser();
  const [travelDates, setTravelDates] = useState('');
  const [duration, setDuration] = useState('');
  const [travelParty, setTravelParty] = useState('');
  const [priorities, setPriorities] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setPendingSaveCallback(() => () => handleSubmit(e));
      setShowPassportGate(true);
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/trip-briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          destination: 'Hydra',
          travelDates,
          duration,
          travelParty,
          priorities,
          userEmail: email,
        }),
      });
      setSubmitted(true);
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-concierge'));
      }, 2000);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid rgba(44, 36, 22, 0.15)',
    background: '#fff',
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 14,
    color: '#2c2416',
    outline: 'none',
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize: 11,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'rgba(44, 36, 22, 0.5)',
    marginBottom: 6,
    display: 'block',
  };

  return (
    <>
      {/* ═══ TRIP TEASER ═══ */}
      <section style={{ background: '#faf9f6', padding: '64px 24px', margin: '40px 0 0' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c9a84c', textAlign: 'center', marginBottom: 32 }}>
            A Taste of Your Trip
          </p>
          <div style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 16, lineHeight: 1.85, color: '#2c2416' }}>
            <p style={{ fontWeight: 600, fontSize: 18, marginBottom: 20 }}>Your First Afternoon in Hydra</p>
            <p style={{ marginBottom: 16 }}>
              The hydrofoil from Piraeus takes two hours. You'll see the harbor before you see the island. A horseshoe of stone buildings stacked up the hillside, fishing boats and water taxis bobbing in front.
            </p>
            <p style={{ marginBottom: 16 }}>
              Step off the ferry. No taxi rank, no car waiting. A porter with a donkey takes your bags. You walk.
            </p>
            <p style={{ marginBottom: 16 }}>
              Check in at Dimitri's. The stone walls are cool, the shutters are open, and the courtyard is the kind of place where you sit down with a book and look up an hour later wondering where the time went. Unpack slowly.
            </p>
            <p style={{ marginBottom: 16 }}>
              Walk to Spilia. The rocks are warm. The water is absurd. So clear that the bottom looks painted on. Swim. Dry off. Order something cold from the bar. Swim again.
            </p>
            <p style={{ marginBottom: 16 }}>
              Late afternoon: the walk to Kamini. Stop at the Leonard Cohen bench. Keep going. Arrive at Pirofani with salt still in your hair. The almond-crusted sea bass. A glass of cold white wine. Theo brings you something extra because it&rsquo;s that kind of place.
            </p>
            <p style={{ marginBottom: 16 }}>
              Walk back along the water as the light turns gold. The ferries have left. The harbor is almost empty. The lanterns are coming on.
            </p>
            <p style={{ marginBottom: 16 }}>
              Evening: Pirate Bar for an aperitivo. The harbor-facing table if you can get it. Watch the sky change. Then T&eacute;chn&#275; for dinner. You booked this morning. The sea bass. The sunset. The panna cotta with halva.
            </p>
            <p style={{ marginBottom: 0 }}>
              Walk home through empty stone streets. No cars. No music. Just your footsteps and the water and the sound of the island doing what it does when nobody&rsquo;s watching.
            </p>
          </div>
          <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 14, fontStyle: 'italic', color: 'rgba(44, 36, 22, 0.45)', textAlign: 'center', marginTop: 32 }}>
            This is what a Fil De Vie trip looks like. Every detail considered — from the ferry to the dress.
          </p>
        </div>
      </section>

      {/* ═══ TRIP BRIEF FORM ═══ */}
      <section style={{ background: '#faf9f6', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 440, margin: '0 auto' }}>
          {!submitted ? (
            <>
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 28, fontWeight: 400, textAlign: 'center', color: '#2c2416', marginBottom: 8 }}>
                Want yours?
              </h2>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, textAlign: 'center', color: 'rgba(44, 36, 22, 0.6)', lineHeight: 1.7, marginBottom: 36 }}>
                Tell us about your trip. We'll build the rest — your itinerary, your wardrobe, your packing list. Every detail, curated to you.
              </p>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>When are you going?</label>
                  <input type="text" placeholder="June 2026, flexible, etc." value={travelDates} onChange={(e) => setTravelDates(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>How long?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['A long weekend', 'A week', '10+ days', 'Not sure yet'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setDuration(opt)} style={{ padding: '8px 16px', border: duration === opt ? '1px solid #2c2416' : '1px solid rgba(44, 36, 22, 0.15)', background: duration === opt ? '#2c2416' : '#fff', color: duration === opt ? '#fff' : '#2c2416', fontFamily: "'Inter', sans-serif", fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Who with?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {['Just me', 'With a partner', 'With friends', 'Family'].map((opt) => (
                      <button key={opt} type="button" onClick={() => setTravelParty(opt)} style={{ padding: '8px 16px', border: travelParty === opt ? '1px solid #2c2416' : '1px solid rgba(44, 36, 22, 0.15)', background: travelParty === opt ? '#2c2416' : '#fff', color: travelParty === opt ? '#fff' : '#2c2416', fontFamily: "'Inter', sans-serif", fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>What matters most?</label>
                  <textarea placeholder="The swimming, the quiet, the food, the art. Tell us what you're looking for..." value={priorities} onChange={(e) => setPriorities(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
                </div>
                <button type="submit" disabled={submitting} style={{ width: '100%', padding: '14px 0', background: '#1a1a1a', color: '#fff', border: 'none', fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: submitting ? 'default' : 'pointer', opacity: submitting ? 0.5 : 1, marginTop: 8 }}>
                  {submitting ? 'Sending...' : 'Build My Trip'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 22, color: '#2c2416', marginBottom: 12 }}>We're on it.</p>
              <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: 15, color: 'rgba(44, 36, 22, 0.6)', lineHeight: 1.7 }}>
                Your concierge will be in touch to refine the details. In the meantime, keep saving — every heart helps us build a better trip.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ══════════════════════════════════════════════
   HydraGuide — main export
══════════════════════════════════════════════ */
export default function HydraGuide() {
  useScrollDepth('/guides/hydra');
  const [selectedItem, setSelectedItem] = useState<ItemModalData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [overlayData, setOverlayData] = useState<{ imageUrl: string; imageAlt: string; products: EditorialProduct[] } | null>(null);

  const renderProductTile = (p: EditorialProduct) => {
    const studioImg = p.genomeKey ? getShopImageUrl(p.genomeKey) : '';
    const imageUrl = studioImg || p.imageUrl || '';
    const bucket = p.bucket || 'Your Style';
    const pinType = p.pinType || 'style';
    return (
      <div key={p.id} className="product-tile" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => openEditorialProductModal(p)}>
        <div className="product-tile-img">
          {imageUrl ? (
            <img src={imageUrl} alt={`${p.brand} ${p.name}`} />
          ) : (
            <div className="product-tile-placeholder">{p.name}</div>
          )}
          <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }} onClick={(e) => e.stopPropagation()}>
            <PinButton
              itemType={pinType as any}
              itemId={p.id}
              sourceContext="hydra-guide-wardrobe"
              itemData={{
                title: `${p.brand} — ${p.name}`,
                bucket,
                sourceStory: 'Hydra',
                saveType: pinType,
                imageUrl,
                brand: p.brand,
                price: p.price || undefined,
                genomeKey: p.genomeKey,
                assetKey: p.genomeKey,
                storyTag: 'hydra',
              }}
              aestheticTags={[bucket.toLowerCase(), pinType, 'hydra']}
              size="sm"
            />
          </div>
        </div>
        <div className="product-tile-info">
          <p className="product-brand">{p.brand}</p>
          <p className="product-name">{p.name}</p>
          {p.price && <p className="product-price">{p.price}</p>}
        </div>
      </div>
    );
  };

  const openEditorialProductModal = (product: EditorialProduct, editorialContextUrl?: string) => {
    const genome = product.genomeKey ? getProductByKey(product.genomeKey) : undefined;
    const studioUrl = product.genomeKey ? getShopImageUrl(product.genomeKey) : '';
    setSelectedItem({
      id: product.id,
      title: product.name,
      bucket: product.bucket || 'Your Style',
      pinType: product.pinType || 'style',
      assetKey: product.id,
      storyTag: 'hydra',
      imageUrl: studioUrl || product.imageUrl,
      brand: genome?.brand || product.brand,
      price: genome?.price || product.price || undefined,
      shopUrl: genome && isShoppable(genome) ? genome.url : product.shopUrl || undefined,
      description: genome?.description,
      color: genome?.color,
      sizes: genome?.sizes,
      shopStatus: genome?.shop_status,
      genomeKey: product.genomeKey,
      editorialImageUrl: editorialContextUrl || product.imageUrl || undefined,
    });
    setDrawerOpen(true);
  };

  return (
    <div className="morocco-guide">

      {/* ═══ S2: GUIDE HEADER ═══ */}
      <div className="guide-hero">
        <h1>HYDRA</h1>
        <div className="curator">A FIL DE VIE GUIDE</div>
      </div>

      <div className="divider-double" />

      {/* ═══ S1: HERO IMAGE ═══ */}
      <div className="hero-image">
        <img src={`${BLOB}/hydra_coats_villas.jpg`} alt="Hydra harbor" />
      </div>

      {/* ═══ S3: INTRO ═══ */}
      <div className="quote-block">
        <div className="intro-text">
          <p>There&rsquo;s an island two hours from Athens where you can hear your own footsteps.</p>
          <p>No engines. No horns. No construction noise. Hydra banned cars decades ago, and new building is illegal. What&rsquo;s left is stone, water, light, and the sound of donkeys on cobblestones. It&rsquo;s not quiet because someone designed it that way. It&rsquo;s quiet because nothing was allowed to interrupt it.</p>
          <p>Leonard Cohen lived here and wrote &ldquo;Bird on the Wire&rdquo; in a house you can walk past but can&rsquo;t enter. The DESTE Foundation shows world-class contemporary art in a former slaughterhouse every summer. The harbor is a horseshoe-shaped theater where everyone can see everyone. And by evening, when the day-trippers leave on the last ferry, the whole island exhales.</p>
          <p>These are the places we&rsquo;d send a friend. Three restaurants, three hotels, three bars, and the things you shouldn&rsquo;t miss. Everything you need. Nothing you don&rsquo;t.</p>
        </div>
      </div>

      <hr className="divider" />

      {/* ═══ S4: SECTION HEADER — WHAT NOT TO MISS ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>WHAT NOT TO MISS</h2>
      </div>
      <div className="section-sub">The island&rsquo;s essentials</div>
      <div className="divider-double" />

      {/* ═══ S5: DESTE Foundation ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_deste_side_view.jpg`} alt="DESTE Foundation" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-deste-main" itemData={{ title: 'DESTE Foundation', description: 'Where the art world comes to a rock with 2,000 people on it.', imageUrl: `${BLOB}/hydra_deste_side_view.jpg`, storyTag: 'hydra', bookUrl: 'http://deste.gr' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'art', 'culture']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_deste_sun.jpg`} alt="DESTE Foundation sun" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-deste-sun" itemData={{ title: 'DESTE Foundation', imageUrl: `${BLOB}/hydra_deste_sun.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'art']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_deste_interior_statue.jpg`} alt="DESTE interior" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-deste-interior" itemData={{ title: 'DESTE Foundation', imageUrl: `${BLOB}/hydra_deste_interior_statue.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'art']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>DESTE Foundation. The Slaughterhouse</h3>
          <div className="tagline">Where the art world comes to a rock with 2,000 people on it.</div>
          <div className="description">A former abattoir turned into one of the most respected summer exhibition spaces in contemporary art. Collector Dakis Joannou commissions a single artist each year for a site-specific installation. Jeff Koons, George Condo, Kara Walker, Kiki Smith have all shown here. The 2026 exhibition is Nari Ward: &ldquo;Until That Day,&rdquo; opening June 23. Jeff Koons&rsquo; Apollo wind spinner still catches the light above the building. Walk from the port along the water. Check hours before you go. It keeps its own schedule.</div>
          <PlaceContact venueName="DESTE Foundation" address="On the road to Spilia, past the port" url="http://deste.gr" />
        </div>
      </div>

      {/* ═══ S6: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_striped_shirt_relax.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s6" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/hydra_striped_shirt_relax.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Stone paths, no signs. You find things here by walking.</div>

      {/* ═══ S7: The Walk to Kamini ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_kamini_road_cobblestones.jpg`} alt="Kamini walk" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-kamini-main" itemData={{ title: 'The Walk to Kamini', imageUrl: `${BLOB}/hydra_kamini_road_cobblestones.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'experience']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_kamini_beach_path.jpg`} alt="Kamini beach path" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-kamini-path" itemData={{ title: 'The Walk to Kamini', imageUrl: `${BLOB}/hydra_kamini_beach_path.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_kamini_beach_white_tents.jpg`} alt="Kamini beach" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-kamini-beach" itemData={{ title: 'The Walk to Kamini', imageUrl: `${BLOB}/hydra_kamini_beach_white_tents.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>The Walk to Kamini</h3>
          <div className="tagline">Twenty minutes that change your afternoon.</div>
          <div className="description">The cliffside path from the port to Kamini is the single best thing you can do your first day. It&rsquo;s not a hike. It&rsquo;s a walk with the sea on one side and white stone houses stacked above you. Halfway along, you&rsquo;ll find the Leonard Cohen memorial bench overlooking the water. Sit for a minute. Then keep going. End at Pirofani for lunch. You&rsquo;ll understand the island by the time you get there.</div>
          <PlaceContact venueName="Kamini Walk" address="Starts at the west end of the port, past the cannons" />
        </div>
      </div>

      {/* ═══ S8: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_pier_model_white.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s8" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/hydra_pier_model_white.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">The light shifts three times between the port and Kamini. You&rsquo;ll notice.</div>

      {/* ═══ S9: The Harbor at Night ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_port_night_big_overview.jpg`} alt="Hydra harbor at night" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-harbor-night-main" itemData={{ title: 'The Harbor at Night', imageUrl: `${BLOB}/hydra_port_night_big_overview.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'experience']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_harbor_evening_green_chairs.jpeg.webp`} alt="Harbor evening" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-harbor-evening" itemData={{ title: 'The Harbor at Night', imageUrl: `${BLOB}/hydra_harbor_evening_green_chairs.jpeg.webp`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_port_night_lights.webp`} alt="Port night lights" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-harbor-lights" itemData={{ title: 'The Harbor at Night', imageUrl: `${BLOB}/hydra_port_night_lights.webp`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>The Harbor at Night</h3>
          <div className="tagline">After the ferries leave, the island starts.</div>
          <div className="description">Every evening around 7pm, the last day-trippers board the hydrofoil back to Athens. The harbor empties. The noise drops. Lanterns come on along the stone waterfront and the water reflects all of it back. This is what you came for. It&rsquo;s impossible to describe to someone who hasn&rsquo;t seen it. Don&rsquo;t plan anything. Just walk out, sit down, and watch.</div>
          <PlaceContact venueName="Hydra Harbor" address="The harbor, after 7pm" />
        </div>
      </div>

      {/* ═══ S10: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_alcove_marina.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s10" itemData={{ title: 'Hydra harbor', imageUrl: `${BLOB}/hydra_alcove_marina.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">The harbor empties. The island begins.</div>

      <hr className="divider" />

      {/* ═══ S11: SECTION HEADER — EAT & DRINK ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>EAT &amp; DRINK</h2>
      </div>
      <div className="section-sub">Restaurants, bars, the essentials</div>
      <div className="divider-double" />

      {/* ═══ S12: Téchnē ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_techne_cobble_stone.jpg`} alt="Téchnē" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-techne-main" itemData={{ title: 'Téchnē', description: 'The dinner you\'ll book twice.', imageUrl: `${BLOB}/hydra_techne_cobble_stone.jpg`, storyTag: 'hydra', bookUrl: 'http://techne-hydra.com' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_techne_overview.jpg`} alt="Téchnē overview" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-techne-overview" itemData={{ title: 'Téchnē', imageUrl: `${BLOB}/hydra_techne_overview.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/techne_close_up.jpg`} alt="Téchnē dish" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-techne-dish" itemData={{ title: 'Téchnē', imageUrl: `${BLOB}/techne_close_up.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>T&eacute;chn&#275;</h3>
          <div className="tagline">The dinner you&rsquo;ll book twice.</div>
          <div className="description">Set in a converted 1870s boat factory above Avlaki beach, T&eacute;chn&#275; is the most design-forward restaurant on the island. And the food matches the setting. Modern Greek with Mediterranean influence. The sea bass with wild greens, the slow-cooked beef rib, the panna cotta with halva. Come for sunset and stay past it. The crowd is right. Young couples, tanned Europeans, the occasional local who&rsquo;s been coming for years. Book ahead.</div>
          <PlaceContact venueName="Téchnē" address="Avlaki beach, on the road to Kamini" url="http://techne-hydra.com" />
        </div>
      </div>

      {/* ═══ S13: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/Gemini_Generated_Image_31w89131w89131w8.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s13" itemData={{ title: 'Hydra dining', imageUrl: `${BLOB}/Gemini_Generated_Image_31w89131w89131w8.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Fine dining without the pretension. Bare arms, good wine, the Aegean.</div>

      {/* ═══ S14: Omilos ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_omilos_striped_awning.jpg`} alt="Omilos" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-omilos-main" itemData={{ title: 'Omilos', description: 'Sunset here is non-negotiable.', imageUrl: `${BLOB}/hydra_omilos_striped_awning.jpg`, storyTag: 'hydra', bookUrl: 'http://omiloshydra.com' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_omilos_broad_view.jpg`} alt="Omilos view" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-omilos-view" itemData={{ title: 'Omilos', imageUrl: `${BLOB}/hydra_omilos_broad_view.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_mussels_lunch.jpg`} alt="Omilos mussels" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-omilos-food" itemData={{ title: 'Omilos', imageUrl: `${BLOB}/hydra_mussels_lunch.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Omilos</h3>
          <div className="tagline">Sunset here is non-negotiable.</div>
          <div className="description">Perched above the sea among pine trees, Omilos is the restaurant everyone talks about. And for once they&rsquo;re right. It started in the &rsquo;60s as a legendary cosmopolitan hangout, and the setting is still genuinely stunning. White-washed, modern Greek seafood, waves hitting the rocks below your table. This is where you go the night you want to remember. The crab balls and the sea urchin salad are off-menu. Ask.</div>
          <PlaceContact venueName="Omilos" address="On the road to Spilia" url="http://omiloshydra.com" />
        </div>
      </div>

      {/* ═══ S15: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/images/Gemini_Generated_Image_ccik4lccik4lccik.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s15" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/images/Gemini_Generated_Image_ccik4lccik4lccik.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">White on white on blue. The Aegean does the decorating.</div>

      {/* ═══ S16: Pirofani ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_pirofani_taverna_street.jpg`} alt="Pirofani" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirofani-main" itemData={{ title: 'Pirofani', description: 'The one the locals don\'t want you to find.', imageUrl: `${BLOB}/hydra_pirofani_taverna_street.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/pirofani_lamb_chops.jpg`} alt="Pirofani lamb" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirofani-food" itemData={{ title: 'Pirofani', imageUrl: `${BLOB}/pirofani_lamb_chops.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_pirofani_tavern_day.jpg`} alt="Pirofani tavern" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirofani-tavern" itemData={{ title: 'Pirofani', imageUrl: `${BLOB}/hydra_pirofani_tavern_day.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'restaurant']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Pirofani</h3>
          <div className="tagline">The one the locals don&rsquo;t want you to find.</div>
          <div className="description">Hidden in Kamini, a 20-minute walk from the port. White-washed courtyard, blue wooden chairs, a family running the place since 1994. The owner Theo often hosts the evening himself. The almond-crusted sea bass is the dish people text their friends about. Fava beans, crisp house wine, honest prices. This isn&rsquo;t where you go to be seen. It&rsquo;s where you go to eat like you live here.</div>
          <PlaceContact venueName="Pirofani" address="Kamini, 20-minute walk from port" />
        </div>
      </div>

      {/* ═══ S17: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_overview_.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s17" itemData={{ title: 'Hydra overview', imageUrl: `${BLOB}/hydra_overview_.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Blue chairs, white walls, and a sea bass you&rsquo;ll think about for weeks.</div>

      {/* ═══ S18: CURATE FOR ME PROMPT ═══ */}
      <div style={{ textAlign: 'center', padding: '48px 24px', maxWidth: 420, margin: '0 auto' }}>
        <p style={{ fontFamily: "'Lora', Georgia, serif", fontSize: '15px', fontStyle: 'italic', color: 'rgba(26, 26, 22, 0.5)', lineHeight: 1.7, marginBottom: '16px' }}>
          Build a Hydra edit from what you&rsquo;ve saved. Come back anytime &mdash; it changes as your Suitcase grows.
        </p>
        <Link href="/suitcase?curate=true">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'rgba(26, 26, 22, 0.35)', borderBottom: '1px solid rgba(26, 26, 22, 0.15)', paddingBottom: '2px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
            Curate for Me →
          </span>
        </Link>
      </div>

      {/* ═══ S19: Spilia Beach Bar ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_spilia_beach_club.jpg`} alt="Spilia Beach Bar" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-spilia-main" itemData={{ title: 'Spilia Beach Bar', description: 'A drink, a dip, a drink, a dip.', imageUrl: `${BLOB}/hydra_spilia_beach_club.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'bar', 'swimming']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_spilia_bar_yellow.jpg`} alt="Spilia bar" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-spilia-bar" itemData={{ title: 'Spilia Beach Bar', imageUrl: `${BLOB}/hydra_spilia_bar_yellow.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'bar']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_spilia_stone_water.jpg`} alt="Spilia rocks" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-spilia-rocks" itemData={{ title: 'Spilia Beach Bar', imageUrl: `${BLOB}/hydra_spilia_stone_water.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'swimming']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Spilia Beach Bar</h3>
          <div className="tagline">A drink, a dip, a drink, a dip.</div>
          <div className="description">Forget sandy beaches. On Hydra you swim off the rocks, into water so clear it barely looks real. Spilia is carved into the coastline near the port. A bar on the rocks where you alternate between a cocktail and the Aegean. It&rsquo;s not fancy. It doesn&rsquo;t need to be. The water is the whole point. Come in the afternoon when the light is low and gold.</div>
          <PlaceContact venueName="Spilia Beach Bar" address="On the rocks, walking distance from the port toward Kamini" />
        </div>
      </div>

      {/* ═══ S20: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_malgosia_black_swim.JPG`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="style" itemId="hydra-break-s20" itemData={{ title: 'Hydra swimming', imageUrl: `${BLOB}/hydra_malgosia_black_swim.JPG`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'style']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Salt water, bare feet, a cold glass. Repeat.</div>

      {/* ═══ S21: Pirate Bar ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_pirate_bar_chairs_warm.jpg`} alt="Pirate Bar" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirate-main" itemData={{ title: 'Pirate Bar', description: 'Where everyone ends up.', imageUrl: `${BLOB}/hydra_pirate_bar_chairs_warm.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'bar']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_pirate_bar_close_up.jpg`} alt="Pirate Bar detail" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirate-detail" itemData={{ title: 'Pirate Bar', imageUrl: `${BLOB}/hydra_pirate_bar_close_up.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'bar']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_pirate_bar_cocktail.jpg`} alt="Pirate Bar cocktail" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-pirate-cocktail" itemData={{ title: 'Pirate Bar', imageUrl: `${BLOB}/hydra_pirate_bar_cocktail.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'bar']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Pirate Bar</h3>
          <div className="tagline">Where everyone ends up.</div>
          <div className="description">On the corner of the harbor, open all day, impossible to avoid. This is Hydra&rsquo;s people-watching capital. The spot where locals and visitors orbit all evening, drink in hand, watching the harbor do what it does. It&rsquo;s not designed. It&rsquo;s not trying. It just happens to be exactly where you want to be at 7pm with an aperitivo. You&rsquo;ll go once and then go back every night.</div>
          <PlaceContact venueName="Pirate Bar" address="Harbor corner, port of Hydra" />
        </div>
      </div>

      {/* ═══ S22: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_back_float.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s22" itemData={{ title: 'Hydra swimming', imageUrl: `${BLOB}/hydra_back_float.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'swimming']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">The whole island is a swimming pool. You just have to find your rock.</div>

      {/* ═══ S23: Amalour ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_amalour_wide_view.jpg`} alt="Amalour" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-amalour-main" itemData={{ title: 'Amalour', description: 'The one where you got dressed.', imageUrl: `${BLOB}/hydra_amalour_wide_view.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'bar']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_amalour_colorful.jpg`} alt="Amalour colorful" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-amalour-colorful" itemData={{ title: 'Amalour', imageUrl: `${BLOB}/hydra_amalour_colorful.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'bar']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_night_boats_harbor.jpg`} alt="Hydra harbor night boats" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-amalour-harbor" itemData={{ title: 'Amalour', imageUrl: `${BLOB}/hydra_night_boats_harbor.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'bar']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Amalour</h3>
          <div className="tagline">The one where you got dressed.</div>
          <div className="description">Hydra&rsquo;s cocktail bar. This is where the evening shifts. From the casual, salty energy of the afternoon to something more considered. Good drinks, the right crowd, and the feeling that the night is just starting. Come after Pirate Bar, before dinner. Or after dinner, when you&rsquo;re not ready for the day to end.</div>
          <PlaceContact venueName="Amalour" address="Hydra port area" />
        </div>
      </div>

      {/* ═══ S24: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_malgosia_white_blowing_shirt.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="style" itemId="hydra-break-s24" itemData={{ title: 'Hydra style', imageUrl: `${BLOB}/hydra_malgosia_white_blowing_shirt.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Not dressed up. Just dressed right.</div>

      <hr className="divider" />

      {/* ═══ S25: SECTION HEADER — SHOP LOCAL ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>SHOP LOCAL</h2>
      </div>
      <div className="section-sub">Books, gold, the things you&rsquo;ll keep</div>
      <div className="divider-double" />

      {/* ═══ S26: Hydra Book Club ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bookclub_interior_windows.jpg`} alt="Hydra Book Club" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bookclub-main" itemData={{ title: 'Hydra Book Club', description: 'Three floors of books, art, and the island\'s literary soul.', imageUrl: `${BLOB}/hydra_bookclub_interior_windows.jpg`, storyTag: 'hydra', bookUrl: 'http://hydrabookclub.com' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'culture', 'shop']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bookclub_magazine.jpg`} alt="Hydra Book Club magazine" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bookclub-magazine" itemData={{ title: 'Hydra Book Club', imageUrl: `${BLOB}/hydra_bookclub_magazine.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'culture']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bookclub_window_view.jpg`} alt="Hydra Book Club window" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bookclub-window" itemData={{ title: 'Hydra Book Club', imageUrl: `${BLOB}/hydra_bookclub_window_view.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'culture']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Hydra Book Club</h3>
          <div className="tagline">Three floors of books, art, and the island&rsquo;s literary soul.</div>
          <div className="description">This is not a souvenir shop. The Hydra Book Club is a bookstore, gallery, and event space. Three floors of books and culture with a roof terrace for reading. They host visiting writers, publish their own literary journal, and collaborate with the Historical Archives Museum. Open April through November. If you read, if you care about art, if you want to understand why the creative world keeps coming back to this island, start here.</div>
          <PlaceContact venueName="Hydra Book Club" address="Hydra port area" url="http://hydrabookclub.com" />
        </div>
      </div>

      {/* ═══ S27: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_ocean_swim.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s27" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/hydra_ocean_swim.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">The reason the art world keeps coming back isn&rsquo;t the water. It&rsquo;s this.</div>

      {/* ═══ S28: Elena Votsi ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_elena_votsi_water_view.jpeg.webp`} alt="Elena Votsi" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-votsi-main" itemData={{ title: 'Elena Votsi', description: 'The woman who designed the Olympic medals. Her first shop is still here.', imageUrl: `${BLOB}/hydra_elena_votsi_water_view.jpeg.webp`, storyTag: 'hydra', bookUrl: 'https://elenavotsi.gr' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'shop', 'jewelry']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_elena_votsi-close_up.jpg`} alt="Elena Votsi jewelry" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-votsi-jewelry" itemData={{ title: 'Elena Votsi', imageUrl: `${BLOB}/hydra_elena_votsi-close_up.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'jewelry']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_elena_votsi_rings.jpg`} alt="Elena Votsi rings" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-votsi-rings" itemData={{ title: 'Elena Votsi', imageUrl: `${BLOB}/hydra_elena_votsi_rings.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'jewelry']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Elena Votsi</h3>
          <div className="tagline">The woman who designed the Olympic medals. Her first shop is still here.</div>
          <div className="description">Elena Votsi was born on Hydra, studied painting in Athens and jewelry at the Royal College of Art in London, and then designed the medal for the 2004 Athens Olympics. Her signature is on every Summer Olympic medal made since. She&rsquo;s worked with Gucci, Ralph Lauren, the Acropolis Museum, and the Museum of Cycladic Art. And her original shop is still on the Hydra waterfront, where she started in 1991. Bold gold, sculptural silver, evil-eye pendants, objects and ceramics inspired by the island. This isn&rsquo;t souvenir jewelry. It&rsquo;s one of the most important living Greek designers, and she&rsquo;s right here.</div>
          <PlaceContact venueName="Elena Votsi" address="Hydra port area" url="https://elenavotsi.gr" instagramHandle="elenavotsi" />
        </div>
      </div>

      {/* ═══ S29: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_malgosia_water.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="style" itemId="hydra-break-s29" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/hydra_malgosia_water.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Gold that belongs here. Made on the island by someone who never left.</div>

      <hr className="divider" />

      {/* ═══ S30: SECTION HEADER — THE STAY ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE STAY</h2>
      </div>
      <div className="section-sub">Hotels, houses, the right bed</div>
      <div className="divider-double" />

      {/* ═══ S31: ATMOSPHERIC BREAK — Stay intro ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_malgosia_black_dress_stone_sea.jpeg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="style" itemId="hydra-break-s31" itemData={{ title: 'Hydra', imageUrl: `${BLOB}/hydra_malgosia_black_dress_stone_sea.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style', 'hotel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Stone walls thick enough to keep the heat out. Windows that frame the harbor like they were placed by a painter. Hydra doesn&rsquo;t do hotels the way other islands do. It does houses that happen to take guests.</div>

      {/* ═══ S32: Dimitri's Stylish Island House ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_dmitris_house_interior.jpg`} alt="Dimitri's Island House" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-dimitris-main" itemData={{ title: "Dimitri's Stylish Island House", description: 'Live in Hydra, not visit it.', imageUrl: `${BLOB}/hydra_dmitris_house_interior.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'hotel', 'stay']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_dmitiris_interior_couch.jpg`} alt="Dimitri's interior" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-dimitris-interior" itemData={{ title: "Dimitri's Island House", imageUrl: `${BLOB}/hydra_dmitiris_interior_couch.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_dmitiris_house_exterior.jpg`} alt="Dimitri's exterior" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-dimitris-exterior" itemData={{ title: "Dimitri's Island House", imageUrl: `${BLOB}/hydra_dmitiris_house_exterior.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Dimitri&rsquo;s Stylish Island House</h3>
          <div className="tagline">Live in Hydra, not visit it.</div>
          <div className="description">A stone house with deep walls, a working fireplace, bookshelves you&rsquo;ll actually read from, and the kind of quiet that only comes from being off the main path. This is an Airbnb with a 4.98 rating and 101 photos. Every corner is considered. It feels like someone&rsquo;s beautiful home, because it is. You&rsquo;ll cook breakfast in the kitchen, read in the courtyard, and forget you&rsquo;re a tourist by the second morning.</div>
          <PlaceContact venueName="Dimitri's Stylish Island House" address="Hydra town (book via Airbnb)" />
        </div>
      </div>

      {/* ═══ S33: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_harbor_red_building.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s33" itemData={{ title: 'Hydra harbor', imageUrl: `${BLOB}/hydra_harbor_red_building.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">The harbor holds everything. The rest of the island just watches.</div>

      {/* ═══ S34: Bratsera Hotel ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bratsera_pool.jpg`} alt="Bratsera Hotel" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bratsera-main" itemData={{ title: 'Bratsera Hotel', description: 'A sponge factory that became the best hotel on the island.', imageUrl: `${BLOB}/hydra_bratsera_pool.jpg`, storyTag: 'hydra', bookUrl: 'http://bratserahotel.com' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'hotel', 'stay']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bratsera_hotel_lobby.jpg`} alt="Bratsera lobby" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bratsera-lobby" itemData={{ title: 'Bratsera Hotel', imageUrl: `${BLOB}/hydra_bratsera_hotel_lobby.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_bratsera_hotel_stone_wall.jpg`} alt="Bratsera stone wall" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-bratsera-stone" itemData={{ title: 'Bratsera Hotel', imageUrl: `${BLOB}/hydra_bratsera_hotel_stone_wall.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Bratsera Hotel</h3>
          <div className="tagline">A sponge factory that became the best hotel on the island.</div>
          <div className="description">Built in the 19th century as a sponge-processing factory, Bratsera is now a 25-room boutique hotel with the only outdoor pool in Hydra. Stone walls, exposed beams, nautical details that feel earned rather than decorative. The courtyard restaurant is one of the better meals on the island. Close to the port but set back enough to feel like a secret. The bar still feels like a place where sponge divers would drink ouzo after a long day. And they did.</div>
          <PlaceContact venueName="Bratsera Hotel" address="Hydra port area" url="http://bratserahotel.com" />
        </div>
      </div>

      {/* ═══ S35: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_terracotta_pink_bougainvilla.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s35" itemData={{ title: 'Hydra bougainvillea', imageUrl: `${BLOB}/hydra_terracotta_pink_bougainvilla.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Bougainvillea doesn&rsquo;t care about your plans. It just grows where it wants.</div>

      {/* ═══ S36: Mandraki Beach Resort ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_mandraki_beach.jpg`} alt="Mandraki Beach Resort" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-mandraki-main" itemData={{ title: 'Mandraki Beach Resort', description: 'The escape from the escape.', imageUrl: `${BLOB}/hydra_mandraki_beach.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel', 'hotel', 'stay', 'beach']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_mandraki_interior_window.jpg`} alt="Mandraki interior" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-mandraki-interior" itemData={{ title: 'Mandraki Beach Resort', imageUrl: `${BLOB}/hydra_mandraki_interior_window.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_mandraki_hotel_arch_stone_wall_water.jpg`} alt="Mandraki arch" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="place" itemId="hydra-mandraki-arch" itemData={{ title: 'Mandraki Beach Resort', imageUrl: `${BLOB}/hydra_mandraki_hotel_arch_stone_wall_water.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'hotel']} size="sm" />
            </div>
          </div>
        </PlaceImages>
        <div className="place-info">
          <h3>Mandraki Beach Resort</h3>
          <div className="tagline">The escape from the escape.</div>
          <div className="description">The only proper beachfront option on the island. Seven suites and a villa, 25 minutes on foot from the port or a quick water taxi ride. The restaurant is exceptional. The beach is right there. This is for the person who wants to swim and eat and not think about anything else. And then take the water taxi into town when the energy shifts. The simplicity is the luxury.</div>
          <PlaceContact venueName="Mandraki Beach Resort" address="Mandraki area, Hydra — water taxi from port" />
        </div>
      </div>

      {/* ═══ S37: EDITORIAL BREAK ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_coast_line_above.jpg`} alt="" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="place" itemId="hydra-break-s37" itemData={{ title: 'Hydra coastline', imageUrl: `${BLOB}/hydra_coast_line_above.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'travel']} size="sm" />
        </div>
      </div>
      <div className="editorial-caption">Seven suites, one beach, and nothing to decide.</div>

      <hr className="divider" />

      {/* ═══ S38: SECTION HEADER — THE WARDROBE ═══ */}
      <div className="divider-double" />
      <div className="section-header">
        <h2>THE WARDROBE</h2>
      </div>
      <div className="section-sub">What to wear &mdash; curated looks + shoppable pieces</div>
      <div className="divider-double" />

      {/* ═══ S39: FULL BLEED FASHION EDITORIAL ═══ */}
      <div className="full-image" style={{ position: 'relative' }}>
        <img src={`${BLOB}/hydra_malgosia_steps.jpg`} alt="Hydra wardrobe editorial" />
        <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <PinButton itemType="style" itemId="hydra-wardrobe-opener" itemData={{ title: 'Hydra Wardrobe', imageUrl: `${BLOB}/hydra_malgosia_steps.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style', 'travel']} size="sm" />
        </div>
      </div>

      {/* ═══ S40: WARDROBE — Day on the Island ═══ */}
      <div className="place-block">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_wall.jpg`} alt="Day on the Island" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-day-wall" itemData={{ title: 'Day on the Island', imageUrl: `${BLOB}/hydra_malgosia_wall.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_striped_shawl_boat.jpg`} alt="Striped shawl boat" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-day-shawl" itemData={{ title: 'Day on the Island', imageUrl: `${BLOB}/hydra_malgosia_striped_shawl_boat.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_green_swim.jpg`} alt="Green swim" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-day-swim" itemData={{ title: 'Day on the Island', imageUrl: `${BLOB}/hydra_malgosia_green_swim.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
            </div>
          </div>
          {HYDRA_DAY_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>Day on the Island</h3>
          <div className="tagline">Linen, flat shoes, salt in your hair.</div>
          <div className="description">Cobblestones and steep stone steps are the reality. Leave the heels at home. Not as a fashion statement but because you&rsquo;ll actually fall. Cotton dresses, loose pants, a white linen shirt that&rsquo;s lived in. Nothing precious. You&rsquo;ll be climbing hills, swimming off rocks, walking to lunch with wet hair. Flat leather sandals or espadrilles. Gold, but not too much. The island is already a palette. White stone, blue water, green pine, terracotta roof. You&rsquo;re part of it whether you try or not.</div>
        </div>
      </div>

      {/* ═══ S41: WARDROBE — Evening at the Harbor ═══ */}
      <div className="place-block reverse">
        <PlaceImages layout="b">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_silver_bracelet.jpg`} alt="Evening at the Harbor" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-eve-bracelet" itemData={{ title: 'Evening at the Harbor', imageUrl: `${BLOB}/hydra_malgosia_silver_bracelet.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style', 'evening']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_sit_green_door.jpg`} alt="Green door evening" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-eve-door" itemData={{ title: 'Evening at the Harbor', imageUrl: `${BLOB}/hydra_malgosia_sit_green_door.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
            </div>
          </div>
          <div className="img-small" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_model_overlooking_ocean.jpg`} alt="Overlooking ocean" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-eve-ocean" itemData={{ title: 'Evening at the Harbor', imageUrl: `${BLOB}/hydra_model_overlooking_ocean.jpg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style']} size="sm" />
            </div>
          </div>
          {HYDRA_EVE_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>Evening at the Harbor</h3>
          <div className="tagline">Not formal. Just considered.</div>
          <div className="description">Hydra evenings are easy. The restaurants that matter have atmosphere enough. A simple dress, good earrings, bare legs. The kind of thing that works walking through the port to Omilos and still works at Pirate Bar three hours later. Black feels intentional here. White feels right. The breeze off the Saronic Gulf picks up around sunset. One layer, something light, something you&rsquo;ll be glad you brought.</div>
        </div>
      </div>

      {/* ═══ S42: WARDROBE — What Travels Well ═══ */}
      <div className="place-block">
        <PlaceImages layout="a">
          <div className="img-large" style={{ position: 'relative' }}>
            <img src={`${BLOB}/hydra_malgosia_wrap.jpeg`} alt="What Travels Well" />
            <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
              <PinButton itemType="style" itemId="hydra-trv-wrap" itemData={{ title: 'What Travels Well', imageUrl: `${BLOB}/hydra_malgosia_wrap.jpeg`, storyTag: 'hydra' }} sourceContext="hydra-guide" aestheticTags={['hydra', 'style', 'travel']} size="sm" />
            </div>
          </div>
          {HYDRA_TRAVEL_PRODUCTS.map(renderProductTile)}
        </PlaceImages>
        <div className="place-info">
          <h3>What Travels Well</h3>
          <div className="tagline">The pieces between the outfits.</div>
          <div className="description">Sunscreen you&rsquo;ll actually reapply. A scarf that works as a wrap, a cover-up, and a headrest on the ferry. A bag that goes from beach to dinner without changing character. Gold that catches the last light at Spilia. These are the things you&rsquo;ll reach for every day. The ones that make the rest of it work.</div>
        </div>
      </div>

      {/* ═══ S44: SHOP THE FULL EDIT ═══ */}
      <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
        <Link href="/shop?destination=hydra">
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: '#c9a84c', borderBottom: '1px solid #c9a84c', paddingBottom: '2px', cursor: 'pointer' }}>
            Shop the Full Edit →
          </span>
        </Link>
      </div>

      <hr className="divider" />

      {/* ═══ S45 + S46 + S47: A TASTE OF YOUR TRIP + "Want yours?" ═══ */}
      <HydraTripTeaserAndBriefForm />

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

      {overlayData && (
        <EditorialProductOverlay
          editorialImageUrl={overlayData.imageUrl}
          editorialImageAlt={overlayData.imageAlt}
          products={overlayData.products}
          onClose={() => setOverlayData(null)}
          onProductTap={(product) => {
            openEditorialProductModal(product, overlayData.imageUrl);
          }}
        />
      )}
    </div>
  );
}
