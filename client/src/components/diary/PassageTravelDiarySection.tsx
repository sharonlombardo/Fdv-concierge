import { useEffect, useState } from 'react';
import { MOROCCO_DIARY, type DiaryDay } from './DiaryData';
import { MobileDayDetail } from './MobileDayDetail';
import '@/styles/diary-keepsake.css';

function teaserFromJournal(journal: string): string {
  const first = journal.split(/(?<=[.?!])\s+/)[0] ?? journal;
  return first.length > 92 ? first.slice(0, 89).trimEnd() + '…' : first;
}

interface DayCardProps {
  day: DiaryDay;
  totalDays: number;
  onTap: () => void;
}

function DayCard({ day, totalDays, onTap }: DayCardProps) {
  const teaser = teaserFromJournal(day.journal);
  return (
    <button
      type="button"
      className="ptd-card"
      onClick={onTap}
      aria-label={`Open ${day.day_label}: ${day.location}`}
    >
      <div className="ptd-card-photo">
        {day.hero ? (
          <img className="photo" src={day.hero} alt={day.hero_alt} />
        ) : (
          <div className="photo-placeholder ptd-card-placeholder">
            <span>{day.day_label.toUpperCase()}</span>
          </div>
        )}
        <div className="ptd-card-veil" />
        <div className="ptd-card-numchip">
          <span>0{day.n}</span>
          <span className="ptd-card-total">/ 0{totalDays}</span>
        </div>
      </div>
      <div className="ptd-card-meta">
        <p className="ptd-card-loc">{day.location}</p>
        <p className="ptd-card-sub">/ {day.sub_location} · {day.date}</p>
        <p className="ptd-card-mantra">&ldquo;{day.mantra}&rdquo;</p>
        <p className="ptd-card-teaser">{teaser}</p>
      </div>
    </button>
  );
}

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
          <DayCard
            key={day.n}
            day={day}
            totalDays={data.days.length}
            onTap={() => setActiveDay(day)}
          />
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
