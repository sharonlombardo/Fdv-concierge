import { useState } from 'react';
import { Link } from 'wouter';
// GlobalNav removed — TopBar is now app-level in App.tsx
import { useJournal } from '@/hooks/use-journal';
import { ITINERARY_DATA, DayPage, FlowItem } from '@shared/itinerary-data';
import { Camera, MapPin, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateStoryImage, shareImage } from '@/lib/share-utils';

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
    if (!firstImage) return;

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
            }}>
              Morocco 2026
            </p>
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
