import type { CSSProperties } from 'react';
import type { DiaryData, DiaryDay } from './DiaryData';

interface PhotoBookPagesProps {
  data: DiaryData;
}

function CoverSpreadInner({ data }: { data: DiaryData }) {
  const heroSrc = data.days[0]?.hero ?? null;
  return (
    <section className="pb-spread pb-cover">
      <div className="pb-cover-left">
        <div className="pb-cover-mark">
          <div className="brand-mark" style={{ fontSize: 10 }}>FIL DE VIE</div>
          <hr className="gold-rule" style={{ marginTop: 12 }} />
        </div>
        <div className="pb-cover-title">
          <p className="label--muted" style={{ fontSize: 10 }}>{data.dateline}</p>
          <h1
            className="serif-italic"
            style={{
              fontSize: 96,
              lineHeight: 0.95,
              marginTop: 16,
              letterSpacing: '-0.02em',
            }}
          >
            {data.destination}
          </h1>
          <p
            className="serif-italic"
            style={{ fontSize: 18, marginTop: 14, color: 'var(--ink-soft)' }}
          >
            A travel diary by {data.traveler}.
          </p>
        </div>
        <div className="pb-cover-foot">
          <span className="label--muted">Vol. 01</span>
          <span className="fdv-footer">FDV Concierge</span>
        </div>
      </div>

      <div className="pb-cover-right">
        {heroSrc ? (
          <div className="photo-frame" style={{ position: 'absolute', inset: 0 }}>
            <img
              className="photo"
              src={heroSrc}
              alt={data.days[0]?.hero_alt ?? data.destination}
            />
          </div>
        ) : (
          <div
            className="photo-placeholder"
            style={{ position: 'absolute', inset: 0, color: 'rgba(255,255,255,0.6)' }}
          >
            <span>{data.destination}</span>
          </div>
        )}
        <div className="pb-cover-quote">
          <p
            className="serif-italic"
            style={{ fontSize: 16, color: '#fff', lineHeight: 1.4 }}
          >
            &ldquo;{data.cover.pullquote}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

function DaySpreadInner({ day, idx, destination }: { day: DiaryDay; idx: number; destination: string }) {
  const leftPageNum = String(idx * 2 + 2).padStart(2, '0');
  const rightPageNum = String(idx * 2 + 3).padStart(2, '0');
  const photoFrameStyle: CSSProperties = { aspectRatio: '4 / 5' };

  return (
    <section className="pb-spread pb-day">
      {/* Left page — full-bleed hero */}
      <div className="pb-page pb-page-left">
        {day.hero ? (
          <div className="photo-frame" style={{ position: 'absolute', inset: 0 }}>
            <img className="photo" src={day.hero} alt={day.hero_alt} />
          </div>
        ) : (
          <div
            className="photo-placeholder"
            style={{ position: 'absolute', inset: 0 }}
          >
            <span>{day.hero_alt}</span>
          </div>
        )}
        <div className="pb-page-num pb-page-num-left">
          <span className="label--muted" style={{ fontSize: 9 }}>{leftPageNum}</span>
        </div>
      </div>

      {/* Right page — text + small photos */}
      <div className="pb-page pb-page-right">
        <header className="pb-day-head">
          <span className="day-numeral" style={{ fontSize: 92 }}>
            0{day.n}
          </span>
          <div className="pb-day-meta">
            <div className="label">{day.day_label}</div>
            <div className="label--muted" style={{ marginTop: 6, fontSize: 9 }}>
              {day.date}
            </div>
            <hr className="gold-rule" style={{ margin: '14px 0' }} />
            <div className="serif-italic" style={{ fontSize: 22 }}>{day.location}</div>
            <div
              className="sub-location"
              style={{ fontStyle: 'italic', fontSize: 14, marginTop: 2 }}
            >
              / {day.sub_location}
            </div>
          </div>
        </header>

        <p className="pb-mantra serif-italic">&ldquo;{day.mantra}&rdquo;</p>

        <div className="pb-journal-block">
          <p className="label--gold" style={{ fontSize: 9, marginBottom: 12 }}>
            Field Notes
          </p>
          <p className="pb-journal">{day.journal}</p>
        </div>

        <div className="pb-moments">
          <p className="label--muted" style={{ fontSize: 9, marginBottom: 10 }}>
            Moments
          </p>
          {day.moments.map((moment, i) => (
            <div key={i} className="pb-moment">
              <span className="label--gold" style={{ fontSize: 8, minWidth: 70 }}>
                {moment.time}
              </span>
              <span className="serif-italic" style={{ fontSize: 14 }}>
                {moment.title}
              </span>
            </div>
          ))}
        </div>

        {day.photos.length > 0 && (
          <div className="pb-photos">
            {day.photos.map((photo, i) => (
              <figure key={i} className="pb-photo">
                <div className="photo-frame" style={photoFrameStyle}>
                  <img className="photo" src={photo.src} alt={photo.caption} />
                </div>
                <figcaption className="caption" style={{ marginTop: 6 }}>
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="pb-page-num pb-page-num-right">
          <span className="label--muted" style={{ fontSize: 9 }}>{rightPageNum}</span>
          <span className="label--muted" style={{ fontSize: 9, marginLeft: 12 }}>
            FIL DE VIE · {destination.toUpperCase()}
          </span>
        </div>
      </div>
    </section>
  );
}

export function PhotoBookPages({ data }: PhotoBookPagesProps) {
  return (
    <div className="diary pb-book">
      <CoverSpreadInner data={data} />
      {data.days.map((day, idx) => (
        <DaySpreadInner
          key={day.n}
          day={day}
          idx={idx}
          destination={data.destination}
        />
      ))}
    </div>
  );
}

export default PhotoBookPages;
