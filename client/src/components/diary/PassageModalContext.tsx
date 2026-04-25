import { useState, type ReactNode } from 'react';
import type { DiaryData, DiaryDay } from './DiaryData';
import { MobileDayPage } from './MobileDayPage';
import { MobileDayDetail } from './MobileDayDetail';

interface PassageModalContextProps {
  children: ReactNode;
  sampleLabel?: string;
  price?: string;
  onCurate?: () => void;
  onSave?: () => void;
}

export function PassageModalContext({
  children,
  sampleLabel = 'Sample Travel Diary',
  price = '$750',
  onCurate,
  onSave,
}: PassageModalContextProps) {
  return (
    <div className="pm-frame">
      <div className="pm-scroll">
        <p className="pm-eyebrow">TRIP CURATION</p>
        <h2 className="pm-title">THE PASSAGE</h2>
        <p className="pm-deck">Your trip. Your bookings. Your wardrobe. Your story.</p>

        <p className="pm-list-label">WHAT&rsquo;S INCLUDED:</p>
        <ul className="pm-list">
          <li>
            <span className="pm-bullet">✦</span>Personalized day-by-day itinerary
          </li>
          <li>
            <span className="pm-bullet">✦</span>Curated wardrobe edit for every day
          </li>
          <li>
            <span className="pm-bullet">✦</span>Complete packing list tailored to your trip
          </li>
          <li>
            <span className="pm-bullet">✦</span>All reservations and bookings handled
          </li>
          <li>
            <span className="pm-bullet">✦</span>
            <strong>Personal travel diary — a shareable keepsake</strong>
          </li>
          <li>
            <span className="pm-bullet">✦</span>Upload your own wardrobe
          </li>
          <li>
            <span className="pm-bullet">✦</span>Booking confirmations delivered to your Suitcase
          </li>
        </ul>

        <div className="pm-sample-block">
          <p className="pm-sample-label">{sampleLabel}</p>
          <div className="pm-sample-slot">{children}</div>
        </div>

        <div className="pm-divider" />

        <div className="pm-price-row">
          <span className="pm-price">{price}</span>
          <span className="pm-price-sub"> one-time</span>
        </div>
        <button type="button" className="pm-cta" onClick={onCurate}>
          CURATE MY PASSAGE
        </button>
        <button type="button" className="pm-cta-ghost" onClick={onSave}>
          ♡&nbsp;&nbsp;SAVE FOR LATER
        </button>
      </div>
    </div>
  );
}

interface InteractiveDayInModalProps {
  data: DiaryData;
  day?: DiaryDay;
  initialOpen?: boolean;
}

export function InteractiveDayInModal({
  data,
  day,
  initialOpen = false,
}: InteractiveDayInModalProps) {
  const [open, setOpen] = useState(initialOpen);
  const activeDay = day ?? data.days[0];

  return (
    <div className="pm-stage">
      <PassageModalContext>
        <MobileDayPage
          data={data}
          day={activeDay}
          onPhotoTap={() => setOpen(true)}
        />
      </PassageModalContext>
      {open && activeDay && (
        <div className="mdd-overlay" onClick={() => setOpen(false)}>
          <div className="mdd-overlay-anim">
            <MobileDayDetail
              data={data}
              day={activeDay}
              onClose={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PassageModalContext;
