import type { DiaryData } from './DiaryData';

interface MobileCoverProps {
  data: DiaryData;
}

export function MobileCover({ data }: MobileCoverProps) {
  const heroSrc = data.days[0]?.hero ?? null;
  return (
    <div className="diary mob-card mob-cover">
      <div className="mob-cover-photo">
        {heroSrc ? (
          <img className="photo" src={heroSrc} alt={data.days[0]?.hero_alt ?? ''} />
        ) : (
          <div className="photo-placeholder" style={{ position: 'absolute', inset: 0 }}>
            <span>{data.destination}</span>
          </div>
        )}
        <div className="mob-cover-veil" />
        <div className="mob-cover-corner-tl">
          <span className="brand-mark" style={{ fontSize: 8, color: '#fff' }}>
            FIL DE VIE
          </span>
        </div>
        <div className="mob-cover-corner-tr">
          <span
            className="label"
            style={{
              fontSize: 8,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.3em',
            }}
          >
            VOL. 01
          </span>
        </div>
        <div className="mob-cover-bottom">
          <p
            className="label"
            style={{
              fontSize: 8,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.32em',
              marginBottom: 14,
            }}
          >
            A TRAVEL DIARY
          </p>
          <h1
            className="serif-italic"
            style={{
              fontSize: 56,
              lineHeight: 0.95,
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            {data.destination}
          </h1>
          <hr
            className="gold-rule"
            style={{
              marginTop: 14,
              marginBottom: 12,
              background: 'var(--gold-soft)',
            }}
          />
          <p
            className="label"
            style={{
              fontSize: 8,
              color: 'rgba(255,255,255,0.8)',
              letterSpacing: '0.28em',
            }}
          >
            APRIL · {data.year} &nbsp;·&nbsp; {data.traveler.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileCover;
