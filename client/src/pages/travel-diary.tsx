import { useState } from 'react';
import { Link } from 'wouter';
import { GlobalNav } from '@/components/global-nav';
import { useJournal } from '@/hooks/use-journal';
import { ITINERARY_DATA, DayPage, FlowItem } from '@shared/itinerary-data';
import { BookOpen, Camera, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  
  return (
    <div className="border-b border-border pb-8 mb-8 last:border-b-0">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <Calendar className="w-3 h-3" />
          <span>Day {dayPage.day} — {flowItem.time}</span>
        </div>
        <h3 className="font-serif text-lg font-medium mb-1">{flowItem.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{dayPage.location}</span>
        </div>
      </div>
      
      {hasNote && (
        <div className="mt-4">
          <p className="font-serif italic text-muted-foreground leading-relaxed">
            "{entry.note}"
          </p>
        </div>
      )}
      
      {hasPhotos && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {entry.logImages?.map((img: { src: string; caption?: string }, idx: number) => (
            <div key={idx} className="aspect-square rounded-md overflow-hidden bg-muted">
              <img 
                src={img.src} 
                alt={img.caption || `Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
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
    <div className="min-h-screen pb-[80px] bg-background">
      <GlobalNav variant="fixed" />
      
      <div className="pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <BookOpen className="w-7 h-7 text-muted-foreground" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-normal mb-3">Travel Diary</h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Your personal notes and photos from Morocco 2026
            </p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border">
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
          
          {isLoading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading entries...</div>
            </div>
          ) : allEntriesCount === 0 ? (
            <div className="text-center py-20">
              <Camera className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-2">No entries yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start adding notes and photos to your itinerary. Tap any activity in the concierge to begin journaling.
              </p>
              <Link href="/concierge">
                <Button data-testid="button-go-to-concierge">
                  Go to Concierge
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
                  <div key={day.day} className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                        {day.day}
                      </div>
                      <div>
                        <h2 className="font-serif text-xl font-medium">{day.title}</h2>
                        <p className="text-xs text-muted-foreground">{day.date}</p>
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
      
      <footer className="border-t border-border py-10 text-center">
        <p className="text-xs text-muted-foreground tracking-widest uppercase">
          FDV Concierge — Morocco 2026
        </p>
      </footer>
    </div>
  );
}
