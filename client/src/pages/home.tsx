import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ThemeToggle } from "@/components/theme-toggle";
import { PinButton } from "@/components/pin-button";
import { useImageSlot } from "@/hooks/use-image-slot";

type PinTile = {
  id: string;
  assetKey: string;
  caption: string;
  bucket: string;
  pinType: string;
  imageUrl?: string;
};

type PageTurnHeroProps = {
  title: string;
  stateOfMind: string;
  paragraph?: string;
  assetKey: string;
  bucket: string;
  pinType: string;
  subhead?: string;
};

type QuoteCardProps = {
  quote: string;
  id: string;
  sourceStory: string;
};

type PinGridProps = {
  title: string;
  tiles: PinTile[];
  sourceStory: string;
};

type TwoUpFeatureProps = {
  title: string;
  image1: { assetKey: string; caption: string; bucket: string; pinType: string };
  image2: { assetKey: string; caption: string; bucket: string; pinType: string };
  sourceStory: string;
};

type MotionLoopBlockProps = {
  overlayText: string;
  bucket: string;
  pinType: string;
  id: string;
  sourceStory: string;
  assetKey: string;
};

type MomentBlockProps = {
  title: string;
  paragraphs: string[];
  assetKey: string;
  bucket: string;
  pinType: string;
  sourceStory: string;
  imagePosition?: "left" | "right";
};

const NAV_ITEMS = [
  { id: "current", label: "The Current", href: "#current-section" },
  { id: "suitcase", label: "Suitcase", href: "/suitcase" },
  { id: "concierge", label: "Concierge", href: "/concierge" },
  { id: "experiences", label: "Experiences", href: "/experiences" },
  { id: "shop", label: "Shop", href: "/shop" },
];

const STORY_NAV = [
  { id: "morocco", label: "Morocco" },
  { id: "hydra", label: "Hydra" },
  { id: "slow-travel", label: "Slow Travel" },
  { id: "retreat", label: "Retreat" },
  { id: "new-york", label: "New York" },
];

function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              item.href.startsWith("/") ? (
                <Link key={item.id} href={item.href}>
                  <span className="text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors cursor-pointer" data-testid={`nav-${item.id}`}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={item.href}
                  className="text-[11px] tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors"
                  data-testid={`nav-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("current-section");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {item.label}
                </a>
              )
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function StickyStoryNav({ activeSection }: { activeSection: string }) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#fafaf9]/95 dark:bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-10 py-3 overflow-x-auto">
          {STORY_NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`story-nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function PageTurnHero({ title, stateOfMind, paragraph, assetKey, bucket, pinType, subhead }: PageTurnHeroProps) {
  const imageUrl = useImageSlot(assetKey);

  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-end" data-testid={`hero-${assetKey}`}>
      <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">Image Placeholder</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="absolute top-4 right-4 z-10">
        <PinButton
          itemType={pinType as any}
          itemId={assetKey}
          itemData={{ title, subtitle: stateOfMind, bucket, sourceStory: title, issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase()]}
          size="md"
        />
      </div>
      <div className="relative z-10 p-8 md:p-16 max-w-3xl">
        {subhead && (
          <p className="text-white/60 text-sm tracking-[0.3em] uppercase mb-4">{subhead}</p>
        )}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium tracking-tight mb-4">
          {title}
        </h2>
        <p className="text-white/80 text-lg md:text-xl font-light italic mb-4">{stateOfMind}</p>
        {paragraph && (
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl">{paragraph}</p>
        )}
      </div>
    </div>
  );
}

function QuoteCard({ quote, id, sourceStory }: QuoteCardProps) {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16 md:py-24 text-center" data-testid={`quote-${id}`}>
      <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl italic text-foreground/90 leading-relaxed">
        "{quote}"
      </blockquote>
      <div className="mt-8 w-12 h-px bg-border mx-auto" />
    </div>
  );
}

function MomentBlock({ title, paragraphs, assetKey, bucket, pinType, sourceStory, imagePosition = "left" }: MomentBlockProps) {
  const imageUrl = useImageSlot(assetKey);

  const imageContent = (
    <div className="relative aspect-[4/5] bg-stone-200 dark:bg-stone-800 overflow-hidden">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">Image</span>
        </div>
      )}
      <div className="absolute top-3 right-3">
        <PinButton
          itemType={pinType as any}
          itemId={assetKey}
          itemData={{ title, bucket, pinType, sourceStory, issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase()]}
          size="md"
        />
      </div>
    </div>
  );

  const textContent = (
    <div className="flex flex-col justify-center py-8 md:py-0">
      <h3 className="font-serif text-2xl md:text-3xl font-medium mb-6">{title}</h3>
      <div className="space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        {imagePosition === "left" ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    </div>
  );
}

function PinGrid({ title, tiles, sourceStory }: PinGridProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <h3 className="text-center text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {tiles.map((tile) => (
          <PinTileCard key={tile.id} tile={tile} sourceStory={sourceStory} />
        ))}
      </div>
    </div>
  );
}

function PinTileCard({ tile, sourceStory }: { tile: PinTile; sourceStory: string }) {
  const imageUrl = useImageSlot(tile.assetKey);

  return (
    <div className="group relative aspect-square bg-stone-200 dark:bg-stone-800 overflow-hidden" data-testid={`tile-${tile.id}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={tile.caption} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Image</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-white text-xs">{tile.caption}</p>
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <PinButton
          itemType={tile.pinType as any}
          itemId={tile.id}
          itemData={{ title: tile.caption, bucket: tile.bucket, pinType: tile.pinType, sourceStory, issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase()]}
          size="sm"
        />
      </div>
    </div>
  );
}

function TwoUpFeature({ title, image1, image2, sourceStory }: TwoUpFeatureProps) {
  const slot1 = useImageSlot(image1.assetKey);
  const slot2 = useImageSlot(image2.assetKey);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <h3 className="text-center text-sm tracking-[0.3em] uppercase text-muted-foreground mb-8">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative aspect-[4/5] bg-stone-200 dark:bg-stone-800 overflow-hidden">
          {slot1 ? (
            <img src={slot1} alt={image1.caption} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs uppercase tracking-widest">Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <PinButton
              itemType={image1.pinType as any}
              itemId={image1.assetKey}
              itemData={{ title: image1.caption, bucket: image1.bucket, pinType: image1.pinType, sourceStory, issueNumber: 1 }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image1.bucket.toLowerCase()]}
              size="md"
            />
          </div>
          <p className="absolute bottom-3 left-3 text-white text-sm">{image1.caption}</p>
        </div>
        <div className="relative aspect-[4/5] bg-stone-200 dark:bg-stone-800 overflow-hidden">
          {slot2 ? (
            <img src={slot2} alt={image2.caption} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-muted-foreground text-xs uppercase tracking-widest">Image</span>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <PinButton
              itemType={image2.pinType as any}
              itemId={image2.assetKey}
              itemData={{ title: image2.caption, bucket: image2.bucket, pinType: image2.pinType, sourceStory, issueNumber: 1 }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image2.bucket.toLowerCase()]}
              size="md"
            />
          </div>
          <p className="absolute bottom-3 left-3 text-white text-sm">{image2.caption}</p>
        </div>
      </div>
    </div>
  );
}

function MotionLoopBlock({ overlayText, bucket, pinType, id, sourceStory, assetKey }: MotionLoopBlockProps) {
  const imageUrl = useImageSlot(assetKey);

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden" data-testid={`motion-${id}`}>
      <div className="absolute inset-0 bg-stone-300 dark:bg-stone-700">
        {imageUrl ? (
          <img src={imageUrl} alt={overlayText} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-muted-foreground text-sm uppercase tracking-widest">Video Placeholder</span>
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-white text-xl md:text-2xl font-serif italic text-center px-8">{overlayText}</p>
      </div>
      <div className="absolute top-4 right-4">
        <PinButton
          itemType={pinType as any}
          itemId={id}
          itemData={{ title: overlayText, bucket, pinType, sourceStory, issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), "motion"]}
          size="md"
        />
      </div>
    </div>
  );
}

function StoryDivider() {
  return <div className="h-px bg-border/50 max-w-xs mx-auto my-8" />;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const heroSlot = useImageSlot("opening-cover");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);

      const sections = STORY_NAV.map(item => ({
        id: item.id,
        element: document.getElementById(item.id)
      }));

      for (const section of sections) {
        if (section.element) {
          const rect = section.element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <TopNav />

      {/* Full-bleed Hero */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          {heroSlot ? (
            <img 
              src={heroSlot} 
              alt="FDV Concierge" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-stone-300 dark:bg-stone-800 flex items-center justify-center">
              <span className="text-muted-foreground text-sm uppercase tracking-widest">Hero Image</span>
            </div>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </section>

      {/* Centered Copy Block */}
      <section className="bg-[#fafaf9] dark:bg-background py-24 md:py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8" data-testid="text-brand-title">
            FIL DE VIE CONCIERGE
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6" data-testid="text-brand-description">
            A collection of places, experiences, style, and rituals — brought together in one place, so you can explore freely, keep what matters, and return to it over time.
          </p>
          <p className="text-sm text-muted-foreground/70 italic mb-12">
            Some things are meant to be visited once. Others are worth coming back to.
          </p>
          <div className="w-12 h-px bg-border mx-auto mb-8" />
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Explore the current issue below
          </p>
        </div>
      </section>

      {/* THE CURRENT - Issue 1 */}
      <section id="current-section" className="bg-[#fafaf9] dark:bg-background">
        <header className="text-center py-12 md:py-16 px-4 border-t border-border/30">
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2" data-testid="text-current-title">
            THE CURRENT
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-1">Issue 1</p>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            Discover what resonates
          </p>
        </header>

        <StickyStoryNav activeSection={activeSection} />

        <PageTurnHero
          title="THE CURRENT"
          subhead="Issue 1"
          stateOfMind="A magazine of taste, memory, and places"
          assetKey="opening-cover"
          bucket="Inspiration"
          pinType="mood"
        />

        <PinGrid
          title="Today's Edit"
          sourceStory="Opening"
          tiles={[
            { id: "opening-1", assetKey: "opening-edit-1", caption: "Morning Light", bucket: "Inspiration", pinType: "mood" },
            { id: "opening-2", assetKey: "opening-edit-2", caption: "Linen Layers", bucket: "Your Style", pinType: "look" },
            { id: "opening-3", assetKey: "opening-edit-3", caption: "Quiet Moment", bucket: "Daily Rituals", pinType: "ritual" },
            { id: "opening-4", assetKey: "opening-edit-4", caption: "Woven Bag", bucket: "Objects of Desire", pinType: "object" },
            { id: "opening-5", assetKey: "opening-edit-5", caption: "Desert Vista", bucket: "Travel & Experiences", pinType: "place" },
          ]}
        />

        <StoryDivider />

        {/* MOROCCO */}
        <section id="morocco">
          <PageTurnHero
            title="Morocco, In Full Color"
            stateOfMind="Pattern, pleasure, heat, and intention."
            paragraph="Morocco rewards those who look closely. Color layered on color. Texture against texture. Nothing accidental, nothing apologetic. This is a place that asks you to notice, to respond, to be seen noticing."
            assetKey="morocco-hero"
            bucket="Travel & Experiences"
            pinType="place"
          />

          <QuoteCard quote="Beauty doesn't whisper here. It invites." id="morocco-quote-1" sourceStory="Morocco" />

          <MomentBlock
            title="Dressing into the scene"
            paragraphs={[
              "Morocco asks you to dress with confidence. Not loudly — deliberately.",
              "Silhouettes that move when you walk. Fabrics that catch air on a staircase. Pieces that look right against tile, brass, and candlelight.",
              "You dress to belong in the room — and then let the room do the rest."
            ]}
            assetKey="morocco-style-1"
            bucket="Your Style"
            pinType="look"
            sourceStory="Morocco"
            imagePosition="left"
          />

          <MomentBlock
            title="The visual pleasure"
            paragraphs={[
              "Every surface has something to say. Tiles repeat. Textiles soften. Glass refracts.",
              "You don't need to choose one thing. You let the composition hold.",
              "This is where pattern becomes mood."
            ]}
            assetKey="morocco-texture-1"
            bucket="Inspiration"
            pinType="texture"
            sourceStory="Morocco"
            imagePosition="right"
          />

          <PinGrid
            title="Pattern and Pleasure"
            sourceStory="Morocco"
            tiles={[
              { id: "morocco-1", assetKey: "morocco-tile-1", caption: "Tile close-up", bucket: "Inspiration", pinType: "texture" },
              { id: "morocco-2", assetKey: "morocco-tile-2", caption: "Rooftop dinner", bucket: "Travel & Experiences", pinType: "experience" },
              { id: "morocco-3", assetKey: "morocco-tile-3", caption: "Linen look", bucket: "Your Style", pinType: "look" },
              { id: "morocco-4", assetKey: "morocco-tile-4", caption: "Brass detail", bucket: "Objects of Desire", pinType: "object" },
              { id: "morocco-5", assetKey: "morocco-tile-5", caption: "Morning courtyard", bucket: "Daily Rituals", pinType: "ritual" },
              { id: "morocco-6", assetKey: "morocco-tile-6", caption: "Market color", bucket: "Inspiration", pinType: "inspiration" },
            ]}
          />

          <MomentBlock
            title="What travels well here"
            paragraphs={[
              "Choose objects that feel intentional, not precious. Things that look better at night than they did in daylight.",
              "A sandal you can walk up stairs in. A bag that disappears on your body. Jewelry that catches light and then lets it go."
            ]}
            assetKey="morocco-object-1"
            bucket="Objects of Desire"
            pinType="object"
            sourceStory="Morocco"
            imagePosition="left"
          />

          <MomentBlock
            title="Evenings done properly"
            paragraphs={[
              "Dinner doesn't start until the light fades. Rooftops at dusk. Courtyards strung with lanterns.",
              "The table becomes a stage. You dress for it — not because anyone asks, but because it matters.",
              "Time stretches. Conversations linger. Nothing ends when it should."
            ]}
            assetKey="morocco-experience-1"
            bucket="Travel & Experiences"
            pinType="experience"
            sourceStory="Morocco"
            imagePosition="right"
          />

          <MotionLoopBlock
            overlayText="Pattern moving in heat"
            bucket="Inspiration"
            pinType="motion"
            id="morocco-motion-1"
            sourceStory="Morocco"
            assetKey="morocco-motion-1"
          />

          <MomentBlock
            title="Between places"
            paragraphs={[
              "Travel here isn't about arrival. It's about passage.",
              "A staircase at dawn. A courtyard glimpsed through a doorway. Transition becomes the experience.",
              "You start paying attention to thresholds."
            ]}
            assetKey="morocco-ritual-1"
            bucket="Daily Rituals"
            pinType="ritual"
            sourceStory="Morocco"
            imagePosition="left"
          />
        </section>

        <StoryDivider />

        {/* HYDRA */}
        <section id="hydra">
          <PageTurnHero
            title="Hydra: The Art of Arrival"
            stateOfMind="Stone, water, stillness."
            paragraph="No cars. No pretense. Just light on stone and time that bends. Hydra doesn't try to impress you. It waits until you're ready to notice."
            assetKey="hydra-hero"
            bucket="Travel & Experiences"
            pinType="place"
          />

          <QuoteCard quote="Stillness isn't empty. It's where taste deepens." id="hydra-quote-1" sourceStory="Hydra" />

          <MomentBlock
            title="Dressing for stillness"
            paragraphs={[
              "Hydra asks for less. Fewer pieces, better chosen.",
              "White linen. Leather that softens. A single piece of gold.",
              "You don't compete with the landscape — you match its calm."
            ]}
            assetKey="hydra-style-1"
            bucket="Your Style"
            pinType="look"
            sourceStory="Hydra"
            imagePosition="left"
          />

          <MomentBlock
            title="Stone, water, skin"
            paragraphs={[
              "The palette is elemental. Whitewash, deep blue, warm terracotta.",
              "These aren't decoration. They're context. Your clothing becomes part of the composition.",
              "Texture matters more than color."
            ]}
            assetKey="hydra-texture-1"
            bucket="Inspiration"
            pinType="texture"
            sourceStory="Hydra"
            imagePosition="right"
          />

          <PinGrid
            title="Essentials Only"
            sourceStory="Hydra"
            tiles={[
              { id: "hydra-1", assetKey: "hydra-tile-1", caption: "Stone wall", bucket: "Inspiration", pinType: "texture" },
              { id: "hydra-2", assetKey: "hydra-tile-2", caption: "Swim morning", bucket: "Daily Rituals", pinType: "ritual" },
              { id: "hydra-3", assetKey: "hydra-tile-3", caption: "White linen look", bucket: "Your Style", pinType: "look" },
              { id: "hydra-4", assetKey: "hydra-tile-4", caption: "Leather sandal", bucket: "Objects of Desire", pinType: "object" },
              { id: "hydra-5", assetKey: "hydra-tile-5", caption: "Woven bag", bucket: "Objects of Desire", pinType: "object" },
              { id: "hydra-6", assetKey: "hydra-tile-6", caption: "Late lunch table", bucket: "Travel & Experiences", pinType: "experience" },
            ]}
          />

          <MomentBlock
            title="What belongs"
            paragraphs={[
              "Bring what earns its place. A sandal that dries quickly. A bag that holds the essentials.",
              "Nothing fragile. Nothing requiring explanation.",
              "Island logic is about clarity."
            ]}
            assetKey="hydra-object-1"
            bucket="Objects of Desire"
            pinType="object"
            sourceStory="Hydra"
            imagePosition="left"
          />

          <TwoUpFeature
            title="Light and Water"
            image1={{ assetKey: "hydra-light-1", caption: "Morning", bucket: "Inspiration", pinType: "mood" }}
            image2={{ assetKey: "hydra-light-2", caption: "Afternoon", bucket: "Inspiration", pinType: "mood" }}
            sourceStory="Hydra"
          />

          <MomentBlock
            title="The daily cadence"
            paragraphs={[
              "Wake with the sun. Swim before coffee. Eat slowly.",
              "Hydra imposes its own rhythm. You don't schedule — you respond.",
              "By the third day, you forget what day it is. That's the point."
            ]}
            assetKey="hydra-ritual-1"
            bucket="Daily Rituals"
            pinType="ritual"
            sourceStory="Hydra"
            imagePosition="right"
          />
        </section>

        <StoryDivider />

        {/* SLOW TRAVEL */}
        <section id="slow-travel">
          <PageTurnHero
            title="Less, But Longer"
            stateOfMind="The case for staying put."
            paragraph="Slow travel isn't about the number of destinations. It's about the depth of attention. One place, fully inhabited, teaches more than five places rushed through."
            assetKey="slow-travel-hero"
            bucket="Travel & Experiences"
            pinType="philosophy"
          />

          <QuoteCard quote="The best souvenir is knowing a place well enough to miss it." id="slow-quote-1" sourceStory="Slow Travel" />

          <MomentBlock
            title="Editing as intelligence"
            paragraphs={[
              "What you don't bring matters as much as what you do.",
              "A smaller bag forces better choices. Fewer options mean less decision fatigue.",
              "Travel light and you move through the world differently."
            ]}
            assetKey="slow-culture-1"
            bucket="Culture"
            pinType="philosophy"
            sourceStory="Slow Travel"
            imagePosition="left"
          />

          <TwoUpFeature
            title="Time Well Spent"
            image1={{ assetKey: "slow-lunch", caption: "Long lunch", bucket: "Travel & Experiences", pinType: "experience" }}
            image2={{ assetKey: "slow-museum", caption: "Museum stair", bucket: "Culture", pinType: "culture" }}
            sourceStory="Slow Travel"
          />

          <MomentBlock
            title="Repetition with intention"
            paragraphs={[
              "Return to the same café. Walk the same route at different hours.",
              "Repetition isn't boring when you're paying attention. It's where familiarity becomes intimacy.",
              "The place reveals itself to those who stay."
            ]}
            assetKey="slow-style-1"
            bucket="Your Style"
            pinType="philosophy"
            sourceStory="Slow Travel"
            imagePosition="right"
          />

          <PinGrid
            title="Repeat With Intention"
            sourceStory="Slow Travel"
            tiles={[
              { id: "slow-1", assetKey: "slow-tile-1", caption: "Same outfit, day to night", bucket: "Your Style", pinType: "look" },
              { id: "slow-2", assetKey: "slow-tile-2", caption: "Folded garment stack", bucket: "Your Style", pinType: "packing" },
              { id: "slow-3", assetKey: "slow-tile-3", caption: "Notebook", bucket: "Objects of Desire", pinType: "object" },
              { id: "slow-4", assetKey: "slow-tile-4", caption: "Café table", bucket: "Daily Rituals", pinType: "ritual" },
              { id: "slow-5", assetKey: "slow-tile-5", caption: "Walking shot", bucket: "Daily Rituals", pinType: "ritual" },
              { id: "slow-6", assetKey: "slow-tile-6", caption: "Light on wall", bucket: "Inspiration", pinType: "mood" },
            ]}
          />

          <MomentBlock
            title="What earns space"
            paragraphs={[
              "Every object in your bag should serve multiple purposes.",
              "A scarf that's a blanket. A dress that works day and evening. Shoes that walk miles.",
              "Versatility is the highest compliment you can pay a piece."
            ]}
            assetKey="slow-object-1"
            bucket="Objects of Desire"
            pinType="object"
            sourceStory="Slow Travel"
            imagePosition="left"
          />

          <MomentBlock
            title="The daily anchor"
            paragraphs={[
              "Establish one ritual wherever you go. Morning coffee. Evening walk. A moment of stillness.",
              "The anchor creates continuity across changing landscapes.",
              "You carry home with you in habit."
            ]}
            assetKey="slow-ritual-1"
            bucket="Daily Rituals"
            pinType="ritual"
            sourceStory="Slow Travel"
            imagePosition="right"
          />
        </section>

        <StoryDivider />

        {/* RETREAT */}
        <section id="retreat">
          <PageTurnHero
            title="Movement, Then Stillness"
            stateOfMind="The retreat as practice."
            paragraph="A retreat isn't escape. It's return. To the body. To attention. To the quiet that's always available but rarely accessed."
            assetKey="retreat-hero"
            bucket="Daily Rituals"
            pinType="retreat"
          />

          <QuoteCard quote="The body remembers what the mind forgets." id="retreat-quote-1" sourceStory="Retreat" />

          <MomentBlock
            title="Movement as calibration"
            paragraphs={[
              "Movement isn't about achievement. It's about recalibration.",
              "The practice clears what accumulated. The body becomes honest again.",
              "You don't push. You listen."
            ]}
            assetKey="retreat-ritual-1"
            bucket="Daily Rituals"
            pinType="ritual"
            sourceStory="Retreat"
            imagePosition="left"
          />

          <MotionLoopBlock
            overlayText="Breath. Water. Walking."
            bucket="Daily Rituals"
            pinType="motion"
            id="retreat-motion-1"
            sourceStory="Retreat"
            assetKey="retreat-motion-1"
          />

          <MomentBlock
            title="Architecture that supports practice"
            paragraphs={[
              "The best retreat spaces are designed for subtraction, not addition.",
              "Clean lines. Natural materials. Light that changes with the hours.",
              "The architecture doesn't demand attention — it holds space for yours."
            ]}
            assetKey="retreat-place-1"
            bucket="Travel & Experiences"
            pinType="place"
            sourceStory="Retreat"
            imagePosition="right"
          />

          <PinGrid
            title="What Belongs"
            sourceStory="Retreat"
            tiles={[
              { id: "retreat-1", assetKey: "retreat-tile-1", caption: "Wrap", bucket: "Your Style", pinType: "look" },
              { id: "retreat-2", assetKey: "retreat-tile-2", caption: "Oil", bucket: "Objects of Desire", pinType: "object" },
              { id: "retreat-3", assetKey: "retreat-tile-3", caption: "Sandal", bucket: "Objects of Desire", pinType: "object" },
              { id: "retreat-4", assetKey: "retreat-tile-4", caption: "Mat", bucket: "Daily Rituals", pinType: "object" },
              { id: "retreat-5", assetKey: "retreat-tile-5", caption: "Quiet corridor", bucket: "Inspiration", pinType: "mood" },
              { id: "retreat-6", assetKey: "retreat-tile-6", caption: "Post-practice look", bucket: "Your Style", pinType: "look" },
            ]}
          />

          <MomentBlock
            title="What belongs in practice"
            paragraphs={[
              "Bring what supports the work. Nothing that distracts from it.",
              "Natural fibers. Simple closures. Things that move with you.",
              "The uniform creates freedom."
            ]}
            assetKey="retreat-object-1"
            bucket="Objects of Desire"
            pinType="object"
            sourceStory="Retreat"
            imagePosition="left"
          />

          <MomentBlock
            title="Dressing after movement"
            paragraphs={[
              "Post-practice dressing is its own pleasure.",
              "Clean fabrics on worked skin. Soft textures after effort.",
              "The body earned this comfort."
            ]}
            assetKey="retreat-style-1"
            bucket="Your Style"
            pinType="look"
            sourceStory="Retreat"
            imagePosition="right"
          />
        </section>

        <StoryDivider />

        {/* NEW YORK */}
        <section id="new-york">
          <PageTurnHero
            title="The Weekend That Holds"
            stateOfMind="48 hours in New York."
            paragraph="New York doesn't wait. It moves at its own pace and expects you to keep up. But within the rush, pockets of stillness exist for those who know where to look."
            assetKey="newyork-hero"
            bucket="Travel & Experiences"
            pinType="place"
          />

          <QuoteCard quote="The city rewards the prepared and the curious in equal measure." id="ny-quote-1" sourceStory="New York" />

          <MomentBlock
            title="Dressing for the city's pace"
            paragraphs={[
              "New York demands versatility. Gallery to dinner. Meeting to museum.",
              "Layers that add and subtract. Shoes that walk blocks.",
              "You dress for possibility, not a single occasion."
            ]}
            assetKey="newyork-style-1"
            bucket="Your Style"
            pinType="look"
            sourceStory="New York"
            imagePosition="left"
          />

          <MomentBlock
            title="Choosing where to look"
            paragraphs={[
              "The city offers everything. You can't take it all.",
              "Curation becomes essential. One exhibition. One restaurant. One neighborhood walked slowly.",
              "Depth over breadth, even here."
            ]}
            assetKey="newyork-culture-1"
            bucket="Culture"
            pinType="culture"
            sourceStory="New York"
            imagePosition="right"
          />

          <PinGrid
            title="The Night Plan"
            sourceStory="New York"
            tiles={[
              { id: "ny-1", assetKey: "ny-tile-1", caption: "Bar interior", bucket: "Travel & Experiences", pinType: "experience" },
              { id: "ny-2", assetKey: "ny-tile-2", caption: "Dinner table", bucket: "Travel & Experiences", pinType: "experience" },
              { id: "ny-3", assetKey: "ny-tile-3", caption: "Gallery wall", bucket: "Culture", pinType: "culture" },
              { id: "ny-4", assetKey: "ny-tile-4", caption: "Coat look", bucket: "Your Style", pinType: "look" },
              { id: "ny-5", assetKey: "ny-tile-5", caption: "Boot or flat", bucket: "Objects of Desire", pinType: "object" },
              { id: "ny-6", assetKey: "ny-tile-6", caption: "Subway platform", bucket: "Travel & Experiences", pinType: "place" },
            ]}
          />

          <MomentBlock
            title="Evenings done well"
            paragraphs={[
              "New York evenings build. Pre-dinner drinks become dinner become late-night walk.",
              "The best nights aren't planned to the minute. They have a shape, not a schedule.",
              "Leave room for the unexpected door that opens."
            ]}
            assetKey="newyork-experience-1"
            bucket="Travel & Experiences"
            pinType="experience"
            sourceStory="New York"
            imagePosition="left"
          />

          <TwoUpFeature
            title="The Culture Hour"
            image1={{ assetKey: "ny-culture-1", caption: "Museum stair", bucket: "Culture", pinType: "culture" }}
            image2={{ assetKey: "ny-culture-2", caption: "Gallery quiet room", bucket: "Culture", pinType: "culture" }}
            sourceStory="New York"
          />

          <MomentBlock
            title="What carries the weekend"
            paragraphs={[
              "One bag that goes everywhere. Structured enough for work, soft enough for wandering.",
              "The phone for maps and reservations. A notebook for what the phone can't hold.",
              "Travel light even in your home city."
            ]}
            assetKey="newyork-object-1"
            bucket="Objects of Desire"
            pinType="object"
            sourceStory="New York"
            imagePosition="right"
          />

          <PinGrid
            title="Sunday Reset"
            sourceStory="New York"
            tiles={[
              { id: "ny-reset-1", assetKey: "ny-reset-1", caption: "Coffee walk", bucket: "Daily Rituals", pinType: "ritual" },
              { id: "ny-reset-2", assetKey: "ny-reset-2", caption: "Notebook", bucket: "Objects of Desire", pinType: "object" },
              { id: "ny-reset-3", assetKey: "ny-reset-3", caption: "Sunglasses", bucket: "Objects of Desire", pinType: "object" },
              { id: "ny-reset-4", assetKey: "ny-reset-4", caption: "Empty street morning", bucket: "Inspiration", pinType: "mood" },
            ]}
          />

          <MomentBlock
            title="Sunday containment"
            paragraphs={[
              "Sunday is for collecting what the weekend scattered.",
              "A slow breakfast. A museum visit before the crowds. The neighborhood walk that recenters.",
              "You leave on Monday having actually rested."
            ]}
            assetKey="newyork-ritual-1"
            bucket="Daily Rituals"
            pinType="ritual"
            sourceStory="New York"
            imagePosition="left"
          />
        </section>

        {/* Closing */}
        <div className="text-center py-24 md:py-32 px-6">
          <p className="text-sm tracking-[0.3em] uppercase text-muted-foreground mb-4">End of Issue 1</p>
          <p className="font-serif text-xl md:text-2xl italic text-muted-foreground">
            What resonated will find its way to your Suitcase.
          </p>
        </div>
      </section>
    </div>
  );
}
