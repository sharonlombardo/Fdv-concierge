import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { BookOpen, ChevronLeft, Printer } from 'lucide-react';
import {
  MOROCCO_DIARY,
  type DiaryDay,
} from '@/components/diary/DiaryData';
import { MobileCover } from '@/components/diary/MobileCover';
import { MobileDayPage } from '@/components/diary/MobileDayPage';
import { MobileIndex } from '@/components/diary/MobileIndex';
import { MobileDayDetail } from '@/components/diary/MobileDayDetail';
import { PassageModalContext } from '@/components/diary/PassageModalContext';
import { PhotoBookPages } from '@/components/diary/PhotoBookPages';
import '@/styles/diary-keepsake.css';

const BOOK_WIDTH = 1600;

export default function DiaryKeepsake() {
  const data = MOROCCO_DIARY;
  const [activeDay, setActiveDay] = useState<DiaryDay | null>(null);
  const [printing, setPrinting] = useState(false);

  const scaleWrapRef = useRef<HTMLDivElement | null>(null);
  const scaleInnerRef = useRef<HTMLDivElement | null>(null);

  // Fit the 1600px photo-book inside whatever container width we have.
  useLayoutEffect(() => {
    const wrap = scaleWrapRef.current;
    const inner = scaleInnerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      if (printing) {
        inner.style.transform = '';
        wrap.style.height = 'auto';
        return;
      }
      const width = wrap.clientWidth;
      const scale = Math.min(1, width / BOOK_WIDTH);
      inner.style.transform = `scale(${scale})`;
      inner.style.width = `${BOOK_WIDTH}px`;
      // After transform, adjust wrapper height to the scaled book height.
      const innerHeight = inner.getBoundingClientRect().height;
      wrap.style.height = `${innerHeight}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [printing]);

  // Lock body scroll when the day detail sheet is open.
  useEffect(() => {
    if (!activeDay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeDay]);

  // Close sheet on Escape.
  useEffect(() => {
    if (!activeDay) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveDay(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeDay]);

  const handlePrint = () => {
    setPrinting(true);
    // Give the browser a tick to lay out the un-scaled book.
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 150);
  };

  return (
    <div className="fdv-diary" style={{ minHeight: '100vh', background: '#faf8f5' }}>
      {/* Screen-only header */}
      <header
        className="diary-screen-header"
        style={{
          padding: '80px 16px 24px',
          textAlign: 'center',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <Link
          href="/travel-diary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: '#8a7e6b',
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            marginBottom: 24,
          }}
        >
          <ChevronLeft size={14} />
          Back to diary
        </Link>

        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            margin: 0,
          }}
        >
          The Passage
        </p>
        <h1
          style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: 40,
            fontWeight: 400,
            color: '#2c2416',
            margin: '6px 0 4px',
          }}
        >
          Your Travel Diary
        </h1>
        <p
          style={{
            fontFamily: 'Lora, Georgia, serif',
            fontStyle: 'italic',
            fontSize: 16,
            color: '#5a5147',
            margin: '0 auto 24px',
            maxWidth: 520,
          }}
        >
          Eight days in Morocco — a shareable keepsake, printed like a book.
        </p>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#2c2416',
            color: '#faf8f5',
            border: 0,
            borderRadius: 24,
            padding: '12px 22px',
            fontFamily: 'Inter, sans-serif',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          <Printer size={14} />
          Print / Save as PDF
        </button>
      </header>

      {/* Mobile card preview row — hidden in print */}
      <section
        className="diary-screen-only"
        style={{
          padding: '8px 16px 40px',
          maxWidth: 960,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#8a7e6b',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          Preview · tap the hero on Day One
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            justifyItems: 'center',
            alignItems: 'start',
          }}
        >
          <MobileCover data={data} />
          <MobileDayPage
            data={data}
            day={data.days[0]}
            onPhotoTap={() => setActiveDay(data.days[0])}
          />
          <MobileIndex
            data={data}
            onDayTap={(n) => {
              const d = data.days.find((x) => x.n === n);
              if (d) setActiveDay(d);
            }}
          />
        </div>
      </section>

      {/* Passage modal context preview */}
      <section
        className="diary-screen-only"
        style={{
          padding: '24px 16px 56px',
          maxWidth: 720,
          margin: '0 auto',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#8a7e6b',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          In context — The Passage modal
        </p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PassageModalContext>
            <MobileDayPage
              data={data}
              day={data.days[0]}
              onPhotoTap={() => setActiveDay(data.days[0])}
            />
          </PassageModalContext>
        </div>
      </section>

      {/* Photo-book print preview — the canonical print layout */}
      <section style={{ padding: '0 0 80px' }}>
        <p
          className="diary-screen-only"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: '#8a7e6b',
            textAlign: 'center',
            margin: '0 0 16px',
          }}
        >
          Print preview — the keepsake
        </p>
        <div
          ref={scaleWrapRef}
          className="fdv-diary-preview-wrap"
          style={{
            width: '100%',
            maxWidth: 1600,
            margin: '0 auto',
            boxShadow: printing ? 'none' : '0 2px 20px rgba(44,36,22,0.08)',
          }}
        >
          <div
            ref={scaleInnerRef}
            className="fdv-diary-preview-scale"
            style={{ width: BOOK_WIDTH }}
          >
            <PhotoBookPages data={data} />
          </div>
        </div>
      </section>

      {/* Mobile day detail sheet overlay */}
      {activeDay && (
        <div
          className="mdd-overlay mdd-overlay-fixed diary-screen-only"
          onClick={() => setActiveDay(null)}
        >
          <div className="mdd-overlay-anim">
            <MobileDayDetail
              data={data}
              day={activeDay}
              onClose={() => setActiveDay(null)}
            />
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .diary-screen-header,
          .diary-screen-only {
            display: none !important;
          }
          .fdv-diary { background: white !important; }
        }
      `}</style>
    </div>
  );
}
