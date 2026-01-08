import { SiteNav } from "@/components/site-nav";
import { ITINERARY_DATA, DayPage, FlowItem } from "@/lib/itinerary-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, ExternalLink, Clock, Sun } from "lucide-react";

function CoverSection() {
  const cover = ITINERARY_DATA.find(p => 'type' in p && p.type === 'cover');
  if (!cover || !('type' in cover) || cover.type !== 'cover') return null;

  return (
    <section id="cover" className="relative h-screen flex items-center justify-center" data-testid="section-cover">
      <div className="absolute inset-0">
        <img src={cover.image} alt={cover.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="font-serif text-5xl md:text-7xl font-light tracking-wide mb-4">{cover.title}</h1>
        <p className="text-xl md:text-2xl tracking-widest font-light opacity-90">{cover.subtitle}</p>
        <p className="mt-8 text-sm italic opacity-75">{cover.caption}</p>
      </div>
    </section>
  );
}

function RhythmSection() {
  const intro = ITINERARY_DATA.find(p => 'type' in p && p.type === 'intro');
  if (!intro || !('type' in intro) || intro.type !== 'intro') return null;

  return (
    <section id="rhythm" className="py-20 px-4 bg-[#fafaf9] dark:bg-background" data-testid="section-rhythm">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-10">{intro.title}</h2>
        <div className="space-y-6">
          {intro.body.map((paragraph: string, i: number) => (
            <p key={i} className="text-muted-foreground leading-relaxed">{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  const days = ITINERARY_DATA.filter((p): p is DayPage => 'day' in p);
  
  return (
    <section id="overview" className="py-20 px-4 bg-stone-100 dark:bg-stone-900/50" data-testid="section-overview">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-12">OVERVIEW</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {days.map((day) => (
            <a 
              key={day.id} 
              href={`#day-${day.day}`}
              className="block p-6 bg-white dark:bg-card rounded-md hover-elevate transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <Badge variant="secondary">Day {day.day}</Badge>
                <span className="text-xs text-muted-foreground">{day.date.split(',')[0]}</span>
              </div>
              <h3 className="font-serif text-lg font-medium mb-1">{day.location}</h3>
              <p className="text-sm text-muted-foreground italic">{day.mantra}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function TravelNotesSection() {
  const notes = ITINERARY_DATA.find(p => 'type' in p && p.type === 'field-notes-global');
  if (!notes || !('type' in notes) || notes.type !== 'field-notes-global') return null;

  return (
    <section id="travel-notes" className="py-20 px-4 bg-[#fafaf9] dark:bg-background" data-testid="section-travel-notes">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl tracking-wide text-center mb-12">{notes.title}</h2>
        <div className="space-y-6">
          {notes.notes.map((note: { title: string; text: string }, i: number) => (
            <div key={i} className="border-l-2 border-stone-300 dark:border-stone-700 pl-6">
              <h3 className="font-medium mb-1">{note.title}</h3>
              <p className="text-muted-foreground text-sm">{note.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowItemCard({ item }: { item: FlowItem }) {
  return (
    <Card className="overflow-hidden" data-testid={`flow-item-${item.id}`}>
      <div className="aspect-video relative bg-stone-200 dark:bg-stone-800">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <Badge className="absolute top-3 left-3" variant="secondary">{item.heading}</Badge>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{item.time}</span>
        </div>
        <h4 className="font-serif text-lg font-medium">{item.title}</h4>
        {item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
        {item.wardrobe && (
          <p className="text-xs text-muted-foreground italic border-t border-border pt-3 mt-3">
            {item.wardrobe}
          </p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground pt-2">
          {item.address && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {item.address}
            </span>
          )}
          {item.contact && (
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {item.contact}
            </span>
          )}
          {item.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {item.email}
            </span>
          )}
          {item.map && (
            <a href={item.map} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <ExternalLink className="w-3 h-3" />
              Map
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function DaySection({ day }: { day: DayPage }) {
  return (
    <section id={`day-${day.day}`} className="py-20 px-4" data-testid={`section-day-${day.day}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">Day {day.day}</Badge>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-2">{day.location}</h2>
          <p className="text-muted-foreground mb-2">{day.date}</p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Sun className="w-4 h-4" />
            <span>{day.weather.temp}°F · {day.weather.cond}</span>
          </div>
          <p className="italic text-muted-foreground max-w-xl mx-auto">{day.mantra}</p>
        </div>
        
        {day.fieldNotes && (
          <div className="bg-stone-100 dark:bg-stone-900/50 rounded-md p-6 mb-10">
            <h3 className="font-medium text-sm uppercase tracking-widest text-muted-foreground mb-2">Field Notes</h3>
            <p className="text-sm">{day.fieldNotes}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {day.flow.map((item) => (
            <FlowItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Itinerary() {
  const days = ITINERARY_DATA.filter((p): p is DayPage => 'day' in p);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <SiteNav variant="light" />
      
      <CoverSection />
      <RhythmSection />
      <OverviewSection />
      <TravelNotesSection />
      
      {days.map((day) => (
        <DaySection key={day.id} day={day} />
      ))}
    </div>
  );
}
