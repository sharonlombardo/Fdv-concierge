import { useEffect, useState } from 'react';
import { MOROCCO_DIARY, type DiaryDay } from './DiaryData';
import { MobileDayPage } from './MobileDayPage';
import { MobileDayDetail } from './MobileDayDetail';
import '@/styles/diary-keepsake.css';

export function PassageTravelDiarySection() {
  const data = MOROCCO_DIARY;
  const [activeDay, setActiveDay] = useState<DiaryDay | null>(null);

  // Lock body scroll while detail is open and respond to Escape.
  useEffect(() => {
    if (!activeDay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDay(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [activeDay]);

  return (
    <div className="fdv-diary ptd-root">
      <div className="ptd-chrome-top">
        <span className="ptd-chrome-brand">FDV CONCIERGE</span>
        <span className="ptd-chrome-dot">·</span>
        <span className="ptd-chrome-trip">{data.destination.toUpperCase()} {data.year}</span>
      </div>

      <div className="ptd-list">
        {data.days.map((day) => (
          <div key={day.n} className="ptd-card-shell" role="group" aria-label={`${day.day_label}: ${day.location}`}>
            <MobileDayPage
              data={data}
              day={day}
              onPhotoTap={() => setActiveDay(day)}
            />
          </div>
        ))}
      </div>

      <div className="ptd-chrome-foot">
        <span className="ptd-foot-brand">FIL DE VIE</span>
        <span className="ptd-foot-tag">· {data.tagline}</span>
        <span className="ptd-foot-count">{String(data.days.length).padStart(2, '0')} days</span>
      </div>

      {activeDay && (
        <div
          className="mdd-overlay ptd-detail-overlay"
          onClick={() => setActiveDay(null)}
        >
          <div className="mdd-overlay-anim ptd-detail-anim">
            <MobileDayDetail
              data={data}
              day={activeDay}
              variant="fullscreen"
              onClose={() => setActiveDay(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PassageTravelDiarySection;
