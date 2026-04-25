import type { CSSProperties } from 'react';
import type { DiaryData, DiaryDay } from './DiaryData';

interface MobileDayDetailProps {
  data: DiaryData;
  day: DiaryDay;
  onClose: () => void;
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

export function MobileDayDetail({ data, day, onClose }: MobileDayDetailProps) {
  const heroBodyStyle: CSSProperties = day.hero
    ? {}
    : { background: 'var(--paper-warm)' };

  return (
    <div
      className="mdd-sheet"
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      {/* Hero */}
      <div className="mdd-hero" style={heroBodyStyle}>
        {day.hero ? (
          <img className="photo" src={day.hero} alt={day.hero_alt} />
        ) : (
          <div className="photo-placeholder" style={{ position: 'absolute', inset: 0 }}>
            <span>{day.hero_alt}</span>
          </div>
        )}
        <button className="mdd-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <div className="mdd-hero-veil" />
        <div className="mdd-hero-meta">
          <span
            className="brand-mark"
            style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)' }}
          >
            FIL DE VIE · {data.destination.toUpperCase()} {data.year}
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
          <hr
            className="gold-rule"
            style={{ margin: '0 auto 14px', width: 32, background: 'var(--gold)' }}
          />
          <p className="serif-italic mdd-mantra">&ldquo;{day.mantra}&rdquo;</p>
        </div>

        <p className="mdd-journal">{day.journal}</p>

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
                Kasbah Bab Ourika
              </span>
              <span className="mdd-conf">✓ confirmed</span>
            </div>
            <div className="mdd-booking-meta">
              3 nights · check-in {day.date} · ref FDV-04173-A
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
