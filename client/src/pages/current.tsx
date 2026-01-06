import { PinButton } from "@/components/pin-button";

const currentFeedContent = [
  {
    id: "current-1",
    type: "feature",
    title: "Hotel Weekend",
    subtitle: "On the Beachside",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=1200",
    tags: ["travel", "coastal", "escape"],
    size: "large"
  },
  {
    id: "current-2", 
    type: "feature",
    title: "Welcome to Spain",
    subtitle: "A Journey Through Light",
    imageUrl: "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&q=80&w=1200",
    tags: ["travel", "spain", "architecture"],
    size: "large"
  },
  {
    id: "current-3",
    type: "style",
    title: "The New Neutrals",
    subtitle: "Effortless layers for any journey",
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800",
    tags: ["style", "minimal", "neutral"],
    size: "medium"
  },
  {
    id: "current-4",
    type: "scene",
    title: "Morning Light",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=600",
    tags: ["scene", "texture", "minimal"],
    size: "small"
  },
  {
    id: "current-5",
    type: "scene", 
    title: "Dried Botanicals",
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=80&w=800",
    tags: ["scene", "natural", "texture"],
    size: "medium"
  },
  {
    id: "current-6",
    type: "scene",
    title: "Desert Architecture",
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1200",
    tags: ["scene", "architecture", "desert"],
    size: "large"
  },
  {
    id: "current-7",
    type: "quote",
    title: "Travel is not about the destination, but how you feel when you arrive.",
    tags: ["inspiration", "travel"],
    size: "medium"
  },
  {
    id: "current-8",
    type: "style",
    title: "Linen Layers",
    subtitle: "From coast to city",
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800",
    tags: ["style", "linen", "summer"],
    size: "medium"
  },
  {
    id: "current-9",
    type: "scene",
    title: "Garden Terrace",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    tags: ["scene", "outdoor", "calm"],
    size: "small"
  },
  {
    id: "current-10",
    type: "feature",
    title: "The Art of Slow Travel",
    subtitle: "Why presence matters more than planning",
    imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200",
    tags: ["travel", "philosophy", "slow"],
    size: "large"
  }
];

function FeatureCard({ item }: { item: typeof currentFeedContent[0] }) {
  return (
    <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-md" data-testid={`card-feature-${item.id}`}>
      <img 
        src={item.imageUrl} 
        alt={item.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-2">{item.subtitle}</p>
        <h3 className="font-serif text-2xl md:text-3xl text-white font-medium">{item.title}</h3>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <PinButton
          itemType={item.type as any}
          itemId={item.id}
          itemData={{
            title: item.title,
            subtitle: item.subtitle,
            imageUrl: item.imageUrl
          }}
          sourceContext="current_feed"
          aestheticTags={item.tags}
          size="md"
        />
      </div>
    </div>
  );
}

function StyleCard({ item }: { item: typeof currentFeedContent[0] }) {
  return (
    <div className="col-span-1 relative group" data-testid={`card-style-${item.id}`}>
      <div className="aspect-[3/4] overflow-hidden rounded-md mb-3">
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <PinButton
            itemType={item.type as any}
            itemId={item.id}
            itemData={{
              title: item.title,
              subtitle: item.subtitle,
              imageUrl: item.imageUrl
            }}
            sourceContext="current_feed"
            aestheticTags={item.tags}
            size="md"
          />
        </div>
      </div>
      <h3 className="font-serif text-lg font-medium">{item.title}</h3>
      {item.subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{item.subtitle}</p>
      )}
    </div>
  );
}

function SceneCard({ item }: { item: typeof currentFeedContent[0] }) {
  const isSmall = item.size === "small";
  return (
    <div 
      className={`relative group ${isSmall ? 'col-span-1' : 'col-span-1 row-span-1'}`}
      data-testid={`card-scene-${item.id}`}
    >
      <div className={`${isSmall ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden rounded-md relative`}>
        <img 
          src={item.imageUrl} 
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 z-10">
          <PinButton
            itemType={item.type as any}
            itemId={item.id}
            itemData={{
              title: item.title,
              imageUrl: item.imageUrl
            }}
            sourceContext="current_feed"
            aestheticTags={item.tags}
            size="md"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm font-medium">{item.title}</p>
        </div>
      </div>
    </div>
  );
}

function QuoteCard({ item }: { item: typeof currentFeedContent[0] }) {
  return (
    <div 
      className="col-span-1 relative bg-[#f5f1ed] dark:bg-[#2a2825] rounded-md p-8 flex items-center justify-center min-h-[200px]"
      data-testid={`card-quote-${item.id}`}
    >
      <div className="absolute top-3 right-3 z-10">
        <PinButton
          itemType={item.type as any}
          itemId={item.id}
          itemData={{
            title: item.title
          }}
          sourceContext="current_feed"
          aestheticTags={item.tags}
          size="md"
        />
      </div>
      <p className="font-serif text-lg md:text-xl text-center italic leading-relaxed text-foreground/80">
        "{item.title}"
      </p>
    </div>
  );
}

export default function CurrentFeed() {
  const features = currentFeedContent.filter(item => item.type === "feature");
  const styles = currentFeedContent.filter(item => item.type === "style");
  const scenes = currentFeedContent.filter(item => item.type === "scene");
  const quotes = currentFeedContent.filter(item => item.type === "quote");

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight mb-4" data-testid="text-current-title">
            THE CURRENT
          </h1>
          <p className="text-muted-foreground text-lg" data-testid="text-current-subtitle">
            Discover what resonates
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features[0] && <FeatureCard item={features[0]} />}
          
          {styles[0] && <StyleCard item={styles[0]} />}
          
          {scenes[0] && <SceneCard item={scenes[0]} />}
          
          {scenes[1] && <SceneCard item={scenes[1]} />}
          
          {quotes[0] && <QuoteCard item={quotes[0]} />}
          
          {features[1] && <FeatureCard item={features[1]} />}
          
          {styles[1] && <StyleCard item={styles[1]} />}
          
          {scenes[2] && <SceneCard item={scenes[2]} />}
          
          {scenes[3] && <SceneCard item={scenes[3]} />}
          
          {features[2] && <FeatureCard item={features[2]} />}
          
          {features[3] && <FeatureCard item={features[3]} />}
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            More to discover soon
          </p>
        </div>
      </div>
    </div>
  );
}
