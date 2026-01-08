import { useState, useRef } from "react";
import { useJournal, JournalEntry } from "@/hooks/use-journal";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Check, Loader2, Share2, ChevronDown, ChevronUp } from "lucide-react";

const TRIP_DAYS = [
  {
    id: "day-1",
    date: "Friday, April 3, 2026",
    title: "Arrival",
    subtitle: "Atlas Mountains",
    mantra: "Today is about arrival and decompression. No need to do more.",
  },
  {
    id: "day-2",
    date: "Saturday, April 4, 2026",
    title: "Atlas Mountains",
    subtitle: "Kasbah Bab Ourika",
    mantra: "Follow the light and your energy. This day is intentionally unstructured.",
  },
  {
    id: "day-3",
    date: "Sunday, April 5, 2026",
    title: "Marrakech",
    subtitle: "El Fenn",
    mantra: "Spend time wandering the riad before going out. El Fenn reveals itself slowly.",
  },
  {
    id: "day-4",
    date: "Monday, April 6, 2026",
    title: "Marrakech",
    subtitle: "Culture & Architecture",
    mantra: "This is a full day. Rest in the afternoon so the evening feels effortless.",
  },
  {
    id: "day-5",
    date: "Tuesday, April 7, 2026",
    title: "Essaouira",
    subtitle: "Day Trip",
    mantra: "Essaouira is about air and openness. Let the pace stay loose.",
  },
  {
    id: "day-6",
    date: "Wednesday, April 8, 2026",
    title: "Marrakech",
    subtitle: "Culture & Food",
    mantra: "This is a sensory day. Eat well, rest between moments.",
  },
  {
    id: "day-7",
    date: "Thursday, April 9, 2026",
    title: "Agafay Desert",
    subtitle: "Sunset & Stars",
    mantra: "Dress simply but beautifully. The desert does the rest.",
  },
  {
    id: "day-8",
    date: "Friday, April 10, 2026",
    title: "Return",
    subtitle: "Journey Home",
    mantra: "The journey continues, just in a different rhythm.",
  },
];

function DayEntry({ 
  day, 
  entry, 
  onSave,
  status,
}: { 
  day: typeof TRIP_DAYS[0]; 
  entry: JournalEntry;
  onSave: (data: Partial<JournalEntry>) => void;
  status: 'idle' | 'saving' | 'saved';
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [note, setNote] = useState(entry?.note || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNoteChange = (value: string) => {
    setNote(value);
  };

  const handleNoteBlur = () => {
    if (note !== (entry?.note || "")) {
      onSave({ note });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSave({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${day.title} - Morocco 2026`,
          text: note || day.mantra,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    }
  };

  return (
    <Card className="overflow-hidden" data-testid={`diary-entry-${day.id}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover-elevate"
        data-testid={`button-expand-${day.id}`}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              {day.date.split(",")[0]}
            </Badge>
            {entry?.note && (
              <Badge variant="outline" className="text-xs">
                <Check className="w-3 h-3 mr-1" />
                Note added
              </Badge>
            )}
            {entry?.image && (
              <Badge variant="outline" className="text-xs">
                <Camera className="w-3 h-3 mr-1" />
                Photo
              </Badge>
            )}
          </div>
          <h3 className="font-serif text-lg font-medium">{day.title}</h3>
          <p className="text-sm text-muted-foreground">{day.subtitle}</p>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          <p className="text-sm italic text-muted-foreground">{day.mantra}</p>

          {entry?.image && (
            <div className="aspect-video rounded-md overflow-hidden bg-stone-100 dark:bg-stone-900">
              <img
                src={entry.image}
                alt={`${day.title} memory`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Notes</label>
            <Textarea
              value={note}
              onChange={(e) => handleNoteChange(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Write about your experience..."
              className="min-h-[100px] resize-none"
              data-testid={`textarea-note-${day.id}`}
            />
            {status === 'saving' && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            )}
            {status === 'saved' && (
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <Check className="w-3 h-3" />
                Saved
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              data-testid={`button-upload-${day.id}`}
            >
              <Camera className="w-4 h-4 mr-2" />
              {entry?.image ? "Change Photo" : "Add Photo"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              data-testid={`button-share-${day.id}`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function TravelDiary() {
  const { entries, saveEntry, status, isLoading } = useJournal();

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-4 py-8 pt-20">
        <header className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight mb-2" data-testid="text-diary-title">
            TRAVEL DIARY
          </h1>
          <p className="text-muted-foreground" data-testid="text-diary-subtitle">
            Morocco 2026
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Capture your memories, notes, and photos from each day
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-stone-200 dark:bg-stone-800 rounded-md animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {TRIP_DAYS.map((day) => (
              <DayEntry
                key={day.id}
                day={day}
                entry={entries[day.id] || {}}
                onSave={(data) => saveEntry(day.id, data)}
                status={status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
