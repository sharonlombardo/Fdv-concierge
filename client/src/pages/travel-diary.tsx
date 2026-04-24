// Force redeploy
import { useState } from 'react';
import { Link } from 'wouter';
// GlobalNav removed — TopBar is now app-level in App.tsx
import { useJournal, JournalEntries } from '@/hooks/use-journal';
import { ITINERARY_DATA, DayPage, FlowItem } from '@shared/itinerary-data';
import { Camera, MapPin, ChevronRight, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStoryImage, shareImage } from '@/lib/share-utils';

function generateDiaryPrintWindow(dayPages: DayPage[], entries: JournalEntries) {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const truncate = (s: string, n: number) =>
    s.length <= n ? s : s.slice(0, n - 1).trimEnd() + '…';

  // Gather one tile of content per day (first photo + first note)
  const tiles = dayPages
    .map(day => {
      let firstPhoto = '';
      let firstNote = '';
      for (const flowItem of day.flow) {
        const entry = entries[flowItem.id];
        if (!entry) continue;
        if (!firstPhoto && entry.logImages && entry.logImages.length > 0) {
          firstPhoto = entry.logImages[0].src;
        }
        if (!firstNote && entry.note && entry.note.trim().length > 0) {
          firstNote = entry.note.trim();
        }
        if (firstPhoto && firstNote) break;
      }
      return {
        day: day.day,
        title: day.title,
        location: day.location,
        firstPhoto,
        firstNote,
      };
    })
    .filter(t => t.firstPhoto || t.firstNote);

  const count = tiles.length;
  const isMagazine = count > 4;
  const heroTiles = isMagazine ? tiles.slice(0, 2) : tiles;
  const smallTiles = isMagazine ? tiles.slice(2) : [];
  const heroCols = Math.min(Math.max(heroTiles.length, 1), 2);
  const smallCols = smallTiles.length === 4 ? 4 : 3;

  const renderTile = (t: typeof tiles[number], variant: 'hero' | 'small') => {
    const snippetLen = variant === 'hero' ? 110 : 60;
    const snippet = t.firstNote ? escapeHtml(truncate(t.firstNote, snippetLen)) : '';
    const photoStyle = t.firstPhoto
      ? `background-image: url('${t.firstPhoto.replace(/'/g, "\\'")}');`
      : 'background: linear-gradient(135deg,#e8e1d4,#d6cdb9);';
    return `
      <div class="tile tile-${variant}" style="${photoStyle}">
        <div class="tile-overlay"></div>
        <div class="day-badge">${t.day}</div>
        <div class="tile-text">
          <h3 class="tile-title">${escapeHtml(t.title)}</h3>
          ${snippet ? `<p class="tile-snippet">${snippet}</p>` : ''}
        </div>
      </div>`;
  };

  const heroHtml = heroTiles.length
    ? `<div class="grid hero-grid" style="grid-template-columns: repeat(${heroCols}, 1fr);">
         ${heroTiles.map(t => renderTile(t, 'hero')).join('')}
       </div>`
    : '';

  const smallHtml = smallTiles.length
    ? `<div class="grid small-grid" style="grid-template-columns: repeat(${smallCols}, 1fr);">
         ${smallTiles.map(t => renderTile(t, 'small')).join('')}
       </div>`
    : '';

  const emptyHtml = `
    <div class="empty-state">
      <p>No diary entries yet.</p>
    </div>`;

  const gridsHtml = count === 0 ? emptyHtml : `${heroHtml}${smallHtml}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Travel Diary — FIL DE VIE Morocco 2026</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    body {
      font-family: 'Lora', Georgia, serif;
      background: #fafaf9;
      color: #2c2416;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .spread {
      width: 100%;
      max-width: 800px;
      max-height: 600px;
      aspect-ratio: 4 / 3;
      background: #fafaf9;
      padding: 24px 28px 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* ── HEADER ── */
    .spread-header {
      text-align: center;
      flex-shrink: 0;
    }
    .brand-name {
      font-family: 'Inter', sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: #2c2416;
      margin-bottom: 4px;
    }
    .destination-label {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 22px;
      font-weight: 400;
      color: #2c2416;
      margin-bottom: 8px;
      line-height: 1.1;
    }
    .header-rule {
      width: 36px;
      height: 1px;
      background: #c9a84c;
      margin: 0 auto;
    }

    /* ── GRID AREA ── */
    .grids {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
    }
    .grid {
      display: grid;
      gap: 8px;
      min-height: 0;
    }
    .hero-grid { flex: 2; }
    .small-grid { flex: 1; }

    /* When only hero grid exists (≤4 days), let it fill all space */
    .grids:not(:has(.small-grid)) .hero-grid { flex: 1; }

    /* ── TILES ── */
    .tile {
      position: relative;
      background-size: cover;
      background-position: center;
      background-color: #2c2416;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      min-height: 0;
    }
    .tile-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0,0,0,0) 40%,
        rgba(0,0,0,0.55) 85%,
        rgba(0,0,0,0.75) 100%
      );
      pointer-events: none;
    }
    .day-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #c9a84c;
      color: #2c2416;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      font-size: 11px;
      letter-spacing: 0.02em;
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      z-index: 2;
    }
    .tile-text {
      position: relative;
      padding: 12px 14px 12px;
      color: #fff;
      z-index: 1;
    }
    .tile-title {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-weight: 500;
      color: #fff;
      text-shadow: 0 1px 4px rgba(0,0,0,0.5);
      line-height: 1.15;
      margin-bottom: 4px;
    }
    .tile-snippet {
      font-family: 'Lora', Georgia, serif;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 1px 3px rgba(0,0,0,0.5);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Hero variant — larger type */
    .tile-hero .tile-title { font-size: 18px; }
    .tile-hero .tile-snippet { font-size: 12px; }

    /* Small variant — compact type */
    .tile-small .tile-title { font-size: 13px; margin-bottom: 2px; }
    .tile-small .tile-snippet { font-size: 10.5px; -webkit-line-clamp: 1; }
    .tile-small .day-badge {
      width: 22px;
      height: 22px;
      font-size: 10px;
      top: 8px;
      left: 8px;
    }
    .tile-small .tile-text { padding: 8px 10px; }

    /* ── FOOTER ── */
    .spread-footer {
      text-align: center;
      flex-shrink: 0;
    }
    .tagline {
      font-family: 'Lora', Georgia, serif;
      font-style: italic;
      font-size: 11px;
      color: #c9a84c;
      letter-spacing: 0.04em;
    }

    /* ── EMPTY STATE ── */
    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #8a7e6b;
      font-style: italic;
      font-size: 14px;
    }

    /* ── PRINT OVERRIDES ── */
    @media print {
      @page {
        margin: 0.4in;
        size: letter landscape;
      }
      html, body { overflow: visible; }
      body { padding: 0; background: white; }
      .spread {
        max-width: none;
        max-height: none;
        width: 100%;
        height: 100vh;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="spread">
    <header class="spread-header">
      <p class="brand-name">FIL DE VIE</p>
      <p class="destination-label">Morocco 2026</p>
      <div class="header-rule"></div>
    </header>

    <div class="grids">${gridsHtml}</div>

    <footer class="spread-footer">
      <p class="tagline">FIL DE VIE &mdash; the thread of life.</p>
    </footer>
  </div>

  <script>
    // Wait for background images to load before printing.
    var tiles = document.querySelectorAll('.tile');
    var urls = [];
    tiles.forEach(function(t) {
      var bg = t.style.backgroundImage;
      var m = bg && bg.match(/url\\(['"]?(.+?)['"]?\\)/);
      if (m && m[1]) urls.push(m[1]);
    });

    function fireprint() { setTimeout(function() { window.print(); }, 300); }

    if (urls.length === 0) {
      fireprint();
    } else {
      var loaded = 0;
      var done = false;
      function check() {
        loaded++;
        if (!done && loaded >= urls.length) { done = true; fireprint(); }
      }
      urls.forEach(function(u) {
        var img = new Image();
        img.onload = check;
        img.onerror = check;
        img.src = u;
      });
      // Safety fallback in case some images stall
      setTimeout(function() { if (!done) { done = true; window.print(); } }, 3500);
    }
  </script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=720');
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
