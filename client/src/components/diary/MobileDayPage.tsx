import type { DiaryData, DiaryDay } from './DiaryData';

interface MobileDayPageProps {
  data: DiaryData;
  day?: DiaryDay;
  onPhotoTap?: () => void;
}

export function MobileDayPage({ data, day, onPhotoTap }: MobileDayPageProps) {
  const d = day ?? data.days[0];
  if (!d) return null;

  return (
    <div className="diary mob-card mob-day">
      <header className="mob-day-mast">
        <span className="brand-mark" style={{ fontSize: 8 }}>FIL DE VIE</span>
        <span className="label--muted" style={{ fontSize: 8 }}>
          {data.destination.toUpperCase()} · {data.year}
        </span>
      </header>

      <div className="mob-day-numline">
        <span className="day-numeral" style={{ fontSize: 40 }}>0{d.n}</span>
        <div className="mob-day-locblock">
          <div className="serif-italic" style={{ fontSize: 16, color: 'var(--ink)' }}>
            {d.location}
          </div>
          <div className="sub-location" style={{ fontStyle: 'italic', fontSize: 11 }}>
            / {d.sub_location}
          </div>
        </div>
        <span className="label--muted" style={{ fontSize: 8 }}>{d.date}</span>
      </div>

      <div
        className="mob-day-photo"
        onClick={onPhotoTap}
        role={onPhotoTap ? 'button' : undefined}
        tabIndex={onPhotoTap ? 0 : undefined}
        onKeyDown={
          onPhotoTap
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onPhotoTap();
                }
              }
            : undefined
        }
      >
        {d.hero ? (
          <img className="photo" src={d.hero} alt={d.hero_alt} />
        ) : (
          <div className="photo-placeholder" style={{ position: 'absolute', inset: 0 }}>
            <span>{d.hero_alt}</span>
          </div>
        )}
        {onPhotoTap && (
          <span className="tap-hint">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path d="M2 2H7V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M7 2L2 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            TAP TO OPEN
          </span>
        )}
      </div>

      <p className="serif-italic mob-day-mantra">&ldquo;{d.mantra}&rdquo;</p>

      <p className="mob-day-journal">{d.journal}</p>

      <footer className="mob-day-foot">
        <span className="fdv-footer" style={{ fontSize: 8 }}>FIL DE VIE</span>
        <span className="label--muted" style={{ fontSize: 8 }}>
          {String(d.n * 2).padStart(2, '0')} / {String(data.days.length * 2 + 2).padStart(2, '0')}
        </span>
      </footer>
    </div>
  );
}

export default MobileDayPage;
