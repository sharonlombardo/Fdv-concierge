import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { DiaryData, DiaryDay } from './DiaryData';

interface MobileDayDetailProps {
  data: DiaryData;
  day: DiaryDay;
  onClose: () => void;
  onShare?: () => void;
  variant?: 'card' | 'fullscreen';
}

interface WardrobeTile {
  label: string;
  detail: string;
  swatch: string;
}

const DEFAULT_WARDROBE: WardrobeTile[] = [
  { label: 'linen caftan', detail: 'cream', swatch: '#e8dfd1' },
  { label: 'leather slides', detail: 'tan', swatch: '#c9a172' },
  { label: 'straw hat', detail: 'natural', swatch: '#8a7e6b' },
];

function pullQuoteFromJournal(journal: string): string | null {
  const sentences = journal
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length === 0) return null;
  const candidates = sentences.slice(1).filter((s) => s.length > 28 && s.length < 140);
  return candidates[0] ?? sentences[0] ?? null;
}

export function MobileDayDetail({ data, day, onClose, onShare, variant = 'card' }: MobileDayDetailProps) {
  const heroBodyStyle: CSSProperties = day.hero
    ? {}
    : { background: 'var(--paper-warm)' };

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [parallaxY, setParallaxY] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setParallaxY(el.scrollTop * 0.3);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [day.n]);

  const handleShare = onShare ?? (() => {
    const shareData = {
      title: `${data.destination} — ${day.day_label}`,
      text: day.journal,
    };
    if (typeof navigator !== 'undefined' && (navigator as Navigator & { share?: (d: ShareData) => Promise<void> }).share) {
      (navigator as Navigator & { share: (d: ShareData) => Promise<void> }).share(shareData).catch(() => {});
    }
  });

  const pullQuote = pullQuoteFromJournal(day.journal);

  return (
    <div
      ref={scrollerRef}
      className={`mdd-sheet mdd-sheet--${variant}`}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {/* Hero */}
      <div className="mdd-hero" style={heroBodyStyle}>
        <div
          className="mdd-hero-parallax"
          style={{ transform: `translate3d(0, ${parallaxY}px, 0)` }}
        >
          {day.hero ? (
            <img className="photo" src={day.hero} alt={day.hero_alt} />
          ) : (
            <div className="photo-placeholder" style={{ position: 'absolute', inset: 0 }}>
              <span>{day.hero_alt}</span>
            </div>
          )}
        </div>
        <button
          className="mdd-back"
          onClick={onClose}
          aria-label="Back to diary"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 1L2 7L9 13" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          className="mdd-share"
          onClick={handleShare}
          aria-label="Share this day"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M3.5 4.5L7 1L10.5 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 8V12C2 12.5523 2.44772 13 3 13H11C11.5523 13 12 12.5523 12 12V8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
        <div className="mdd-hero-veil" />
        <div className="mdd-hero-meta">
          <span
            className="brand-mark"
            style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)' }}
          >
            FDV CONCIERGE · {data.destination.toUpperCase()} {data.year}
          </span>
        </div>
        <div className="mdd-hero-title">
          <span
            className="day-numeral"
            style={{ fontSize: 56, color: '#fff', lineHeight: 1 }}
          >
            0{day.n}
          </span>
          <div className="mdd-hero-locblock">
            <div
              className="serif-italic"
              style={{ fontSize: 22, color: '#fff', lineHeight: 1.05 }}
            >
              {day.location}
            </div>
            <div
              style={{
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: 13,
                color: 'rgba(255,255,255,0.78)',
                marginTop: 4,
              }}
            >
              / {day.sub_location} · {day.date}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mdd-body">
        <div className="mdd-mantra-block">
          <p className="serif-italic mdd-pullquote">&ldquo;{day.mantra}&rdquo;</p>
        </div>

        <p className="mdd-journal">{day.journal}</p>

        {pullQuote && pullQuote !== day.mantra && (
          <blockquote className="mdd-pullquote-secondary">
            &ldquo;{pullQuote}&rdquo;
          </blockquote>
        )}

        {day.photos.length > 0 && (
          <div className="mdd-section">
            <p className="mdd-section-label">SNAPSHOTS</p>
            <div className="mdd-gallery">
              {day.photos.map((p, i) => (
                <figure key={i} className="mdd-snap" style={{ margin: 0 }}>
                  <div className="photo-frame mdd-snap-frame">
                    <img className="photo" src={p.src} alt="" />
                  </div>
                  <figcaption className="mdd-snap-caption">{p.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        <div className="mdd-section">
          <p className="mdd-section-label">THE DAY</p>
          <ul className="mdd-moments">
            {day.moments.map((m, i) => (
              <li key={i} className="mdd-moment">
                <span className="mdd-moment-time">{m.time}</span>
                <div className="mdd-moment-body">
                  <div
                    className="serif-italic"
                    style={{ fontSize: 14, color: 'var(--ink)' }}
                  >
                    {m.title}
                  </div>
                  <div className="mdd-moment-note">{m.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mdd-section">
          <p className="mdd-section-label">WARDROBE</p>
          <div className="mdd-wardrobe">
            {DEFAULT_WARDROBE.map((tile, i) => (
              <div key={i} className="mdd-ward-tile">
                <div
                  className="mdd-ward-swatch"
                  style={{ background: tile.swatch }}
                />
                <div className="mdd-ward-label">
                  {tile.label}
                  <br />
                  <em>{tile.detail}</em>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mdd-section">
          <p className="mdd-section-label">BOOKED &amp; CONFIRMED</p>
          <div className="mdd-booking">
            <div className="mdd-booking-row">
              <span className="serif-italic" style={{ fontSize: 13 }}>
                {day.n <= 2 ? 'Kasbah Bab Ourika' : day.n === 5 ? 'Villa Salama, Essaouira' : 'El Fenn, Marrakech'}
              </span>
              <span className="mdd-conf">✓ confirmed</span>
            </div>
            <div className="mdd-booking-meta">
              check-in {day.date} · ref FDV-{String(4173 + day.n).padStart(5, '0')}-{String.fromCharCode(64 + day.n)}
            </div>
          </div>
        </div>

        <div className="mdd-foot">
          <span className="fdv-footer" style={{ fontSize: 9 }}>FIL DE VIE</span>
          <span className="tagline" style={{ fontSize: 9 }}>{data.tagline}</span>
        </div>
      </div>
    </div>
  );
}

export default MobileDayDetail;
