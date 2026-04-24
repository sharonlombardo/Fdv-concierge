import { useState } from 'react';
import { Link } from 'wouter';
// GlobalNav removed — TopBar is now app-level in App.tsx
import { useJournal, JournalEntries } from '@/hooks/use-journal';
import { ITINERARY_DATA, DayPage, FlowItem } from '@shared/itinerary-data';
import { Camera, MapPin, ChevronRight, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStoryImage, shareImage } from '@/lib/share-utils';

function generateDiaryPrintWindow(dayPages: DayPage[], entries: JournalEntries) {
  const sealUrl = `${window.location.origin}/fdv-concierge-seal.png`;

  const dayHtml = dayPages.map(day => {
    const entryCards = day.flow.map(flowItem => {
      const entry = entries[flowItem.id];
      if (!entry) return '';
      const hasNote = entry.note && entry.note.trim().length > 0;
      const hasPhotos = entry.logImages && entry.logImages.length > 0;
      if (!hasNote && !hasPhotos) return '';

      const photosHtml = hasPhotos ? `
        <div class="photo-grid ${entry.logImages!.length === 1 ? 'single' : 'multi'}">
          ${entry.logImages!.map((img, i) => `
            <div class="photo-item">
              <img src="${img.src}" alt="${img.caption || `Photo ${i + 1}`}" loading="eager" />
              ${img.caption ? `<p class="photo-caption">${img.caption}</p>` : ''}
            </div>
          `).join('')}
        </div>` : '';

      return `
        <div class="entry-card">
          <div class="entry-meta">Day ${day.day} &mdash; ${flowItem.time}</div>
          <h3 class="entry-title">${flowItem.title}</h3>
          <div class="entry-location">&#x25BE; ${day.location}</div>
          ${hasNote ? `<blockquote class="entry-note">&ldquo;${entry.note}&rdquo;</blockquote>` : ''}
          ${photosHtml}
        </div>`;
    }).filter(Boolean).join('');

    if (!entryCards.trim()) return '';

    return `
      <div class="day-section">
        <div class="day-header">
          <div class="day-number">${day.day}</div>
          <div class="day-info">
            <h2 class="day-title">${day.title}</h2>
            <p class="day-date">${day.date}</p>
          </div>
        </div>
        ${entryCards}
      </div>`;
  }).filter(Boolean).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Travel Diary — FIL DE VIE Morocco 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Lora', Georgia, serif;
      background: #fafaf9;
      color: #2c2416;
      padding: 56px 48px 72px;
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.6;
    }

    /* ── HEADER ── */
    .diary-header {
      text-align: center;
      padding-bottom: 40px;
      margin-bottom: 48px;
    }
    .seal {
      width: 88px;
      height: 88px;
      display: block;
      margin: 0 auto 20px;
      opacity: 0.9;
    }
    .brand-name {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #2c2416;
      margin-bottom: 10px;
    }
    .destination-label {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 26px;
      font-weight: 400;
      color: #5a5147;
      margin-bottom: 28px;
    }
    .header-rule {
      width: 48px;
      height: 1px;
      background: #c9a84c;
      margin: 0 auto;
    }

    /* ── DAY SECTIONS ── */
    .day-section {
      margin-bottom: 56px;
    }
    .day-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(201,168,76,0.35);
    }
    .day-number {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #2c2416;
      color: #faf8f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 15px;
      font-family: 'Inter', sans-serif;
      flex-shrink: 0;
    }
    .day-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 21px;
      font-weight: 500;
      color: #2c2416;
      margin-bottom: 3px;
    }
    .day-date {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #8a7e6b;
      letter-spacing: 0.04em;
    }

    /* ── ENTRY CARDS ── */
    .entry-card {
      background: #fff;
      border: 1px solid #f0ece4;
      border-radius: 10px;
      padding: 28px 28px 24px;
      margin-bottom: 20px;
      box-shadow: 0 1px 4px rgba(44,36,22,0.06);
    }
    .entry-meta {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #8a7e6b;
      margin-bottom: 8px;
    }
    .entry-title {
      font-family: 'Lora', Georgia, serif;
      font-size: 20px;
      font-weight: 500;
      color: #2c2416;
      margin-bottom: 4px;
    }
    .entry-location {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: #8a7e6b;
      margin-bottom: 16px;
    }
    .entry-note {
      font-family: 'Lora', Georgia, serif;
      font-size: 15px;
      font-style: italic;
      color: #2c2416;
      line-height: 1.65;
      padding-left: 16px;
      border-left: 2px solid #c9a84c;
      margin-bottom: 20px;
    }

    /* ── PHOTOS ── */
    .photo-grid { margin-top: 4px; }
    .photo-grid.single .photo-item { text-align: center; }
    .photo-grid.single img {
      width: 65%;
      border-radius: 6px;
      box-shadow: 0 2px 12px rgba(44,36,22,0.1);
      display: block;
      margin: 0 auto;
    }
    .photo-grid.multi {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .photo-grid.multi img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(44,36,22,0.08);
    }
    .photo-caption {
      font-family: 'Lora', Georgia, serif;
      font-size: 12px;
      font-style: italic;
      color: #8a7e6b;
      margin-top: 6px;
      text-align: center;
    }

    /* ── FOOTER ── */
    .diary-footer {
      text-align: center;
      padding-top: 40px;
      margin-top: 24px;
    }
    .footer-rule {
      width: 48px;
      height: 1px;
      background: #c9a84c;
      margin: 0 auto 24px;
    }
    .tagline {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 14px;
      color: #8a7e6b;
      letter-spacing: 0.02em;
    }

    /* ── PRINT OVERRIDES ── */
    @media print {
      @page {
        margin: 0.75in 0.85in;
        size: letter portrait;
      }
      body {
        background: white;
        padding: 0;
        font-size: 10.5pt;
        max-width: none;
      }
      .diary-header {
        padding-bottom: 28px;
        margin-bottom: 36px;
      }
      .day-section {
        page-break-inside: avoid;
        margin-bottom: 40px;
      }
      .entry-card {
        page-break-inside: avoid;
        box-shadow: none;
        border: 1px solid #e8e4dc;
      }
      .photo-grid.single img {
        width: 62%;
      }
    }
  </style>
</head>
<body>
  <header class="diary-header">
    <img class="seal" src="${sealUrl}" alt="FIL DE VIE" />
    <p class="brand-name">FIL DE VIE</p>
    <p class="destination-label">Morocco 2026</p>
    <div class="header-rule"></div>
  </header>

  <main>${dayHtml || '<p style="text-align:center;color:#8a7e6b;font-style:italic;padding:48px 0">No diary entries yet.</p>'}</main>

  <footer class="diary-footer">
    <div class="footer-rule"></div>
    <p class="tagline">FIL DE VIE &mdash; the thread of life.</p>
  </footer>

  <script>
    // Wait for images to load before printing
    var images = document.querySelectorAll('img');
    var total = images.length;
    if (total === 0) {
      setTimeout(function() { window.print(); }, 300);
    } else {
      var loaded = 0;
      function checkDone() {
        loaded++;
        if (loaded >= total) setTimeout(function() { window.print(); }, 300);
      }
      images.forEach(function(img) {
        if (img.complete) { checkDone(); }
        else { img.onload = checkDone; img.onerror = checkDone; }
      });
      // Fallback in case some events don't fire
      setTimeout(function() { window.print(); }, 3000);
    }
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=800');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

function isDayPage(page: any): page is DayPage {
  return 'day' in page;
}

interface DiaryEntryCardProps {
  flowItem: FlowItem;
  dayPage: DayPage;
  entry: {
    note?: string;
    logImages?: Array<{ src: string; caption?: string }>;
  };
}

function DiaryEntryCard({ flowItem, dayPage, entry }: DiaryEntryCardProps) {
  const hasNote = entry.note && entry.note.trim().length > 0;
  const hasPhotos = entry.logImages && entry.logImages.length > 0;

  if (!hasNote && !hasPhotos) return null;

  const handleShare = async () => {
    const firstImage = entry.logImages?.[0]?.src;
    if (!firstImage) {
      alert('No photos to share yet.');
      return;
    }

    try {
      const blob = await generateStoryImage({
        image: firstImage,
        title: flowItem.title,
        note: entry.note || '',
        caption: entry.logImages?.[0]?.caption || '',
        location: dayPage.location,
        day: `Day ${dayPage.day}`,
      });
      await shareImage(blob, flowItem.title);
    } catch (err) {
      console.error('Share failed:', err);
      try {
        const a = document.createElement('a');
        a.href = firstImage;
        a.download = 'fdv-travel-log.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        alert('Unable to share. Try taking a screenshot instead.');
      }
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 24,
      marginBottom: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      border: '1px solid #f0ece4',
    }}>
      {/* Day + Time header + Share button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
      }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          color: '#8a7e6b',
        }}>
          Day {dayPage.day} — {flowItem.time}
        </span>
        {hasPhotos && (
          <button
            onClick={handleShare}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: 'none',
              borderRadius: 24,
              padding: '8px 16px',
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Share2 size={12} /> Share
          </button>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Lora', Georgia, serif",
        fontSize: 22,
        fontWeight: 500,
        color: '#2c2416',
        marginBottom: 4,
        marginTop: 0,
      }}>
        {flowItem.title}
      </h3>

      {/* Location */}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 13,
        color: '#8a7e6b',
        marginBottom: 16,
        marginTop: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        <MapPin size={12} /> {dayPage.location}
      </p>

      {/* User's note — italic serif with gold left border */}
      {hasNote && (
        <p style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: 16,
          fontStyle: 'italic',
          color: '#2c2416',
          lineHeight: 1.6,
          marginBottom: 20,
          marginTop: 0,
          paddingLeft: 16,
          borderLeft: '2px solid #c9a84c',
        }}>
          "{entry.note}"
        </p>
      )}

      {/* Photo grid — single = full width, multiple = 2-col */}
      {hasPhotos && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: entry.logImages!.length === 1 ? '1fr' : 'repeat(2, 1fr)',
          gap: 8,
        }}>
          {entry.logImages!.map((img, i) => (
            <div key={i}>
              <img
                src={img.src}
                alt={img.caption || `Photo ${i + 1}`}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  maxHeight: entry.logImages!.length === 1 ? 400 : undefined,
                  aspectRatio: entry.logImages!.length === 1 ? '4/3' : '1',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {img.caption && (
                <p style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: 13,
                  fontStyle: 'italic',
                  color: '#5a5147',
                  marginTop: 6,
                  marginBottom: 0,
                }}>
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TravelDiary() {
  const { entries, isLoading } = useJournal();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const dayPages = ITINERARY_DATA.filter(isDayPage) as DayPage[];

  const handlePrintDiary = () => {
    generateDiaryPrintWindow(dayPages, entries);
  };

  const getEntriesForDay = (day: DayPage) => {
    const dayEntries: Array<{ flowItem: FlowItem; entry: any }> = [];
    day.flow.forEach(flowItem => {
      const entry = entries[flowItem.id];
      if (entry && (entry.note || (entry.logImages && entry.logImages.length > 0))) {
        dayEntries.push({ flowItem, entry });
      }
    });
    return dayEntries;
  };

  const allEntriesCount = dayPages.reduce((acc, day) => acc + getEntriesForDay(day).length, 0);

  const filteredDays = selectedDay
    ? dayPages.filter(d => d.day === selectedDay)
    : dayPages;

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 80, background: '#fafaf9' }}>
      <div style={{ paddingTop: 80, paddingBottom: 48 }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>

          {/* Page header — editorial feel */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: 28,
              fontWeight: 400,
              color: '#2c2416',
              marginBottom: 4,
              marginTop: 0,
            }}>
              Travel Diary
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: '#8a7e6b',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
              marginTop: 0,
              marginBottom: 20,
            }}>
              Morocco 2026
            </p>
            <button
              onClick={handlePrintDiary}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: '1px solid #c9a84c',
                color: '#2c2416',
                borderRadius: 24,
                padding: '10px 20px',
                fontFamily: "'Inter', sans-serif",
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              <BookOpen size={14} color="#c9a84c" />
              Save This Memory
            </button>
          </div>

          {/* Day filter tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 16,
            marginBottom: 28,
            borderBottom: '1px solid #f0ece4',
          }}>
            <Button
              variant={selectedDay === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedDay(null)}
              className="flex-shrink-0"
              data-testid="button-filter-all"
            >
              All Days
            </Button>
            {dayPages.map(day => {
              const count = getEntriesForDay(day).length;
              return (
                <Button
                  key={day.day}
                  variant={selectedDay === day.day ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedDay(day.day)}
                  className="flex-shrink-0"
                  data-testid={`button-filter-day-${day.day}`}
                >
                  Day {day.day} {count > 0 && `(${count})`}
                </Button>
              );
            })}
          </div>

          {/* Content */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ color: '#8a7e6b' }}>Loading entries...</div>
            </div>
          ) : allEntriesCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Camera size={48} color="rgba(138,126,107,0.3)" style={{ marginBottom: 16 }} />
              <h2 style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: 24,
                fontWeight: 400,
                color: '#2c2416',
                marginBottom: 8,
              }}>
                No entries yet
              </h2>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                color: '#8a7e6b',
                marginBottom: 24,
                maxWidth: 320,
                margin: '0 auto 24px',
              }}>
                Start adding notes and photos to your itinerary. Tap any activity in the Daily Flow to begin journaling.
              </p>
              <Link href="/daily-flow">
                <Button data-testid="button-go-to-concierge">
                  Go to Daily Flow
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {filteredDays.map(day => {
                const dayEntries = getEntriesForDay(day);
                if (dayEntries.length === 0) return null;

                return (
                  <div key={day.day} style={{ marginBottom: 40 }}>
                    {/* Day header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 20,
                    }}>
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: '#2c2416',
                        color: '#faf8f5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "'Inter', sans-serif",
                        flexShrink: 0,
                      }}>
                        {day.day}
                      </div>
                      <div>
                        <h2 style={{
                          fontFamily: "'Lora', Georgia, serif",
                          fontSize: 20,
                          fontWeight: 500,
                          color: '#2c2416',
                          margin: 0,
                        }}>
                          {day.title}
                        </h2>
                        <p style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12,
                          color: '#8a7e6b',
                          margin: 0,
                        }}>
                          {day.date}
                        </p>
                      </div>
                    </div>

                    {dayEntries.map(({ flowItem, entry }) => (
                      <DiaryEntryCard
                        key={flowItem.id}
                        flowItem={flowItem}
                        dayPage={day}
                        entry={entry}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #f0ece4',
        padding: '40px 0',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 11,
          color: '#8a7e6b',
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          margin: 0,
        }}>
          FDV Concierge — Morocco 2026
        </p>
      </footer>
    </div>
  );
}
