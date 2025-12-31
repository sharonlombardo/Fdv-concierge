import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useCustomImages } from '@/hooks/use-custom-images';
import { 
  ITINERARY_DATA, 
  type DayPage 
} from '@/lib/itinerary-data';

interface WardrobeItem {
  key: string;
  dayNumber: number;
  itemTitle: string;
  time: string;
  suggestedImage: string;
}

function extractWardrobeItems(): WardrobeItem[] {
  const items: WardrobeItem[] = [];
  
  ITINERARY_DATA.forEach((page) => {
    if ('day' in page) {
      const dayPage = page as DayPage;
      dayPage.flow.forEach((item) => {
        if (item.commercialWardrobe) {
          items.push({
            key: `${item.id}-wardrobe`,
            dayNumber: dayPage.day,
            itemTitle: item.title,
            time: item.time,
            suggestedImage: item.commercialWardrobe,
          });
        }
      });
    }
  });
  
  return items;
}

function WardrobeCard({ 
  item,
  getImageUrl,
  hasCustomImage,
}: { 
  item: WardrobeItem;
  getImageUrl: (key: string, defaultUrl: string) => string;
  hasCustomImage: (key: string) => boolean;
}) {
  const displayUrl = getImageUrl(item.key, item.suggestedImage);
  const isCustom = hasCustomImage(item.key);

  return (
    <div className="group">
      <div className="aspect-[3/4] relative overflow-hidden rounded-md bg-muted">
        <img 
          src={displayUrl} 
          alt={item.itemTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=400';
          }}
        />
        {isCustom && (
          <div className="absolute top-2 right-2 bg-foreground/80 text-background text-xs px-2 py-0.5 rounded-full font-medium">
            Custom
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Day {item.dayNumber} · {item.time}
        </p>
        <p className="text-sm font-medium leading-tight">
          {item.itemTitle}
        </p>
      </div>
    </div>
  );
}

export default function PackingList() {
  const { getImageUrl, hasCustomImage, isLoading } = useCustomImages();
  const wardrobeItems = extractWardrobeItems();

  const groupedByDay = wardrobeItems.reduce((acc, item) => {
    if (!acc[item.dayNumber]) {
      acc[item.dayNumber] = [];
    }
    acc[item.dayNumber].push(item);
    return acc;
  }, {} as Record<number, WardrobeItem[]>);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back-home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-xl font-medium">Packing List</h1>
            <p className="text-sm text-muted-foreground">Wardrobe suggestions for Morocco</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-md" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedByDay).map(([day, items]) => (
              <section key={day}>
                <h2 className="font-serif text-lg mb-6 pb-2 border-b">
                  Day {day}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <WardrobeCard
                      key={item.key}
                      item={item}
                      getImageUrl={getImageUrl}
                      hasCustomImage={hasCustomImage}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Customize wardrobe images in the{' '}
            <Link href="/images">
              <span className="underline hover:text-foreground cursor-pointer">Image Management</span>
            </Link>
            {' '}page.
          </p>
        </div>
      </main>
    </div>
  );
}
