import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PinButton } from "@/components/pin-button";

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
  imageUrl?: string;
  assetKey: string;
  bucket: string;
  pinType: string;
  isOpening?: boolean;
  subhead?: string;
};

type QuoteCardProps = {
  quote: string;
  id: string;
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
};

type ClosingLineProps = {
  text: string;
  id: string;
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
  { id: "morocco", label: "Morocco" },
  { id: "hydra", label: "Hydra" },
  { id: "slow-travel", label: "Slow Travel" },
  { id: "retreat", label: "Retreat" },
  { id: "new-york", label: "New York" },
];

function StickyNav({ activeSection }: { activeSection: string }) {
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
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-xs tracking-widest uppercase whitespace-nowrap transition-colors ${
                activeSection === item.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`nav-${item.id}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function PageTurnHero({ title, stateOfMind, paragraph, assetKey, bucket, pinType, isOpening, subhead }: PageTurnHeroProps) {
  return (
    <div className="relative w-full min-h-[70vh] md:min-h-[80vh] flex items-end" data-testid={`hero-${assetKey}`}>
      <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 flex items-center justify-center">
        <span className="text-muted-foreground text-sm uppercase tracking-widest">Image Placeholder</span>
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
      <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl">
        {isOpening && subhead && (
          <p className="text-white/60 text-sm tracking-widest uppercase mb-2">{subhead}</p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-4" data-testid="hero-title">
          {title}
        </h1>
        <p className="text-white/80 text-lg md:text-xl italic mb-4">{stateOfMind}</p>
        {paragraph && (
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-2xl">
            {paragraph}
          </p>
        )}
      </div>
    </div>
  );
}

function QuoteCard({ quote, id, sourceStory }: QuoteCardProps & { sourceStory?: string }) {
  return (
    <div className="relative py-16 md:py-24 px-8 md:px-16 max-w-3xl mx-auto text-center" data-testid={`quote-${id}`}>
      <div className="absolute top-4 right-4 z-10">
        <PinButton
          itemType="quote"
          itemId={id}
          itemData={{ title: quote, bucket: "State of Mind", sourceStory: sourceStory || "The Current", issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={["quote", "state-of-mind"]}
          size="md"
        />
      </div>
      <p className="font-serif text-2xl md:text-3xl lg:text-4xl italic leading-relaxed text-foreground/90">
        "{quote}"
      </p>
    </div>
  );
}

function MomentBlock({ title, paragraphs, assetKey, bucket, pinType, sourceStory, imagePosition = "left" }: MomentBlockProps) {
  const imageBlock = (
    <div className="relative aspect-[4/5] md:aspect-square bg-stone-200 dark:bg-stone-800 rounded-md flex items-center justify-center">
      <span className="text-muted-foreground text-xs uppercase tracking-widest">Image Placeholder</span>
      <div className="absolute top-3 right-3 z-10">
        <PinButton
          itemType={pinType as any}
          itemId={assetKey}
          itemData={{ 
            title, 
            bucket,
            sourceStory,
            issueNumber: 1
          }}
          sourceContext="the_current_issue_1"
          aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase(), sourceStory.toLowerCase()]}
          size="md"
        />
      </div>
    </div>
  );

  const textBlock = (
    <div className="flex flex-col justify-center">
      <h3 className="font-serif text-xl md:text-2xl font-medium mb-4">{title}</h3>
      <div className="space-y-4">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="text-muted-foreground leading-relaxed">{para}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto" data-testid={`moment-${assetKey}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {imagePosition === "left" ? (
          <>
            {imageBlock}
            {textBlock}
          </>
        ) : (
          <>
            {textBlock}
            {imageBlock}
          </>
        )}
      </div>
    </div>
  );
}

function PinGrid({ title, tiles, sourceStory }: PinGridProps) {
  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {tiles.map((tile) => (
          <div key={tile.id} className="relative group" data-testid={`tile-${tile.id}`}>
            <div className="aspect-square bg-stone-200 dark:bg-stone-800 rounded-md flex items-center justify-center overflow-hidden">
              <span className="text-muted-foreground text-xs uppercase tracking-widest text-center px-2">
                {tile.caption}
              </span>
            </div>
            <div className="absolute top-2 right-2 z-10">
              <PinButton
                itemType={tile.pinType as any}
                itemId={tile.id}
                itemData={{ 
                  title: tile.caption, 
                  bucket: tile.bucket,
                  sourceStory,
                  issueNumber: 1
                }}
                sourceContext="the_current_issue_1"
                aestheticTags={[tile.bucket.toLowerCase(), tile.pinType.toLowerCase(), sourceStory.toLowerCase()]}
                size="sm"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">{tile.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function TwoUpFeature({ title, image1, image2, sourceStory }: TwoUpFeatureProps) {
  return (
    <div className="py-12 md:py-16 px-4 max-w-5xl mx-auto">
      <h3 className="text-xs tracking-widest uppercase text-muted-foreground mb-8 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative group" data-testid={`two-up-${image1.assetKey}`}>
          <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded-md flex items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase tracking-widest">{image1.caption}</span>
          </div>
          <div className="absolute top-2 right-2 z-10">
            <PinButton
              itemType={image1.pinType as any}
              itemId={image1.assetKey}
              itemData={{ title: image1.caption, bucket: image1.bucket, sourceStory, issueNumber: 1 }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image1.bucket.toLowerCase(), image1.pinType.toLowerCase()]}
              size="sm"
            />
          </div>
          <p className="text-sm text-center mt-3 text-muted-foreground">{image1.caption}</p>
        </div>
        <div className="relative group" data-testid={`two-up-${image2.assetKey}`}>
          <div className="aspect-[4/5] bg-stone-200 dark:bg-stone-800 rounded-md flex items-center justify-center">
            <span className="text-muted-foreground text-xs uppercase tracking-widest">{image2.caption}</span>
          </div>
          <div className="absolute top-2 right-2 z-10">
            <PinButton
              itemType={image2.pinType as any}
              itemId={image2.assetKey}
              itemData={{ title: image2.caption, bucket: image2.bucket, sourceStory, issueNumber: 1 }}
              sourceContext="the_current_issue_1"
              aestheticTags={[image2.bucket.toLowerCase(), image2.pinType.toLowerCase()]}
              size="sm"
            />
          </div>
          <p className="text-sm text-center mt-3 text-muted-foreground">{image2.caption}</p>
        </div>
      </div>
    </div>
  );
}

function MotionLoopBlock({ overlayText, bucket, pinType, id, sourceStory }: MotionLoopBlockProps) {
  return (
    <div className="py-12 md:py-16 px-4 max-w-4xl mx-auto">
      <div className="relative aspect-video bg-stone-300 dark:bg-stone-700 rounded-md flex items-center justify-center" data-testid={`motion-${id}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-muted-foreground text-sm uppercase tracking-widest">Video Placeholder</span>
        </div>
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <p className="font-serif text-2xl md:text-3xl text-white italic text-center px-8">{overlayText}</p>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <PinButton
            itemType={pinType as any}
            itemId={id}
            itemData={{ title: overlayText, bucket, sourceStory, issueNumber: 1 }}
            sourceContext="the_current_issue_1"
            aestheticTags={[bucket.toLowerCase(), pinType.toLowerCase()]}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}

function ClosingLine({ text, id, sourceStory }: ClosingLineProps & { sourceStory?: string }) {
  return (
    <div className="relative py-12 md:py-16 px-8 max-w-2xl mx-auto text-center" data-testid={`closing-${id}`}>
      <div className="absolute top-0 right-0 z-10">
        <PinButton
          itemType="quote"
          itemId={id}
          itemData={{ title: text, bucket: "State of Mind", sourceStory: sourceStory || "The Current", issueNumber: 1 }}
          sourceContext="the_current_issue_1"
          aestheticTags={["quote", "closing", "state-of-mind"]}
          size="sm"
        />
      </div>
      <p className="text-sm md:text-base text-muted-foreground italic">{text}</p>
    </div>
  );
}

function StoryDivider() {
  return <div className="h-px bg-border/50 max-w-xs mx-auto my-8" />;
}

export default function CurrentFeed() {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => ({
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
      <div className="p-4">
        <Link href="/">
          <Button variant="ghost" size="sm" data-testid="button-back-home">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>
      <header className="text-center py-8 md:py-12 px-4">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2" data-testid="text-current-title">
          THE CURRENT
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-1" data-testid="text-current-issue">
          Issue 1
        </p>
        <p className="text-sm text-muted-foreground tracking-widest uppercase">
          Discover what resonates
        </p>
      </header>

      <StickyNav activeSection={activeSection} />

      <PageTurnHero
        title="THE CURRENT"
        subhead="Issue 1"
        stateOfMind="A magazine of taste, memory, and places"
        assetKey="opening-cover"
        bucket="Inspiration"
        pinType="mood"
        isOpening
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
            "Evenings unfold slowly here. A drink on the roof. A long table. Shared plates. Warm air.",
            "Nothing rushed. Nothing hidden. The city performs beautifully if you give it time."
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
          pinType="mood"
          id="morocco-motion-1"
          sourceStory="Morocco"
        />

        <MomentBlock
          title="Between places"
          paragraphs={[
            "Afternoons are for pause. Shade. Water. A return to yourself.",
            "This is how the night stays beautiful."
          ]}
          assetKey="morocco-ritual-1"
          bucket="Daily Rituals"
          pinType="ritual"
          sourceStory="Morocco"
          imagePosition="left"
        />

        <ClosingLine text="Save what delights you. You'll want to see it again." id="morocco-closing" sourceStory="Morocco" />
      </section>

      <StoryDivider />

      {/* HYDRA */}
      <section id="hydra">
        <PageTurnHero
          title="The Art of Arrival"
          stateOfMind="White stone. Salt water. Nothing extra."
          paragraph="Hydra does not rush you. There are no cars waiting. No urgency on arrival. You step off the ferry into stillness. The island asks only that you slow down."
          assetKey="hydra-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        <QuoteCard quote="Arrive composed. Let the place do the rest." id="hydra-quote-1" sourceStory="Hydra" />

        <MomentBlock
          title="Dressing for stillness"
          paragraphs={[
            "Hydra favors restraint. Clean lines. Bare ankles. Nothing that competes with light.",
            "You dress once here and repeat it with confidence. The discipline is the luxury."
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
            "Everything important is elemental. Stone underfoot. Salt on skin. Light moving slowly across a wall.",
            "There is no decoration here. Only composition."
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
            { id: "hydra-4", assetKey: "hydra-tile-4", caption: "Leather sandal", bucket: "Objects of Desire", pinType: "item" },
            { id: "hydra-5", assetKey: "hydra-tile-5", caption: "Woven bag", bucket: "Objects of Desire", pinType: "object" },
            { id: "hydra-6", assetKey: "hydra-tile-6", caption: "Late lunch table", bucket: "Travel & Experiences", pinType: "experience" },
          ]}
        />

        <MomentBlock
          title="What belongs"
          paragraphs={[
            "Bring objects that disappear when worn. A sandal you forget you're wearing. A bag that holds only what's necessary.",
            "Hydra edits for you if you let it."
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
            "Morning is for water. Midday belongs to shade and conversation. Evening arrives without ceremony.",
            "You do less. You feel more."
          ]}
          assetKey="hydra-ritual-1"
          bucket="Daily Rituals"
          pinType="ritual"
          sourceStory="Hydra"
          imagePosition="right"
        />

        <ClosingLine text="Save what steadies you. Return when you need it." id="hydra-closing" sourceStory="Hydra" />
      </section>

      <StoryDivider />

      {/* SLOW TRAVEL */}
      <section id="slow-travel">
        <PageTurnHero
          title="Less, But Longer"
          stateOfMind="Stay with what's good."
          paragraph="Slow travel is not about moving less. It's about staying longer with what matters. The same walk every morning. The same table. Familiarity becomes belonging."
          assetKey="slow-travel-hero"
          bucket="State of Mind"
          pinType="mood"
        />

        <QuoteCard quote="The point isn't to see more. It's to stay longer with what feels right." id="slow-travel-quote-1" sourceStory="Slow Travel" />

        <MomentBlock
          title="Editing as intelligence"
          paragraphs={[
            "Slow travel is cultural fluency. Knowing when to sit. When to stay. When to repeat a ritual rather than replace it.",
            "It's choosing one museum room instead of ten. The same café twice. The same walk every morning.",
            "Repetition becomes familiarity. Familiarity becomes belonging."
          ]}
          assetKey="slow-culture-1"
          bucket="Culture"
          pinType="culture"
          sourceStory="Slow Travel"
          imagePosition="left"
        />

        <TwoUpFeature
          title="Editing is Intelligence"
          image1={{ assetKey: "slow-lunch", caption: "Long lunch", bucket: "Culture", pinType: "culture" }}
          image2={{ assetKey: "slow-museum", caption: "Museum stair", bucket: "Culture", pinType: "place" }}
          sourceStory="Slow Travel"
        />

        <MomentBlock
          title="Repetition with intention"
          paragraphs={[
            "The most confident travelers repeat themselves. The same silhouette, refined. The same palette, trusted.",
            "Packing less doesn't limit you. It frees you.",
            "When you stop performing variety, you arrive composed."
          ]}
          assetKey="slow-style-1"
          bucket="Your Style"
          pinType="look"
          sourceStory="Slow Travel"
          imagePosition="right"
        />

        <PinGrid
          title="Repeat With Intention"
          sourceStory="Slow Travel"
          tiles={[
            { id: "slow-1", assetKey: "slow-tile-1", caption: "Same outfit day to night", bucket: "Your Style", pinType: "look" },
            { id: "slow-2", assetKey: "slow-tile-2", caption: "Folded garment stack", bucket: "Objects of Desire", pinType: "object" },
            { id: "slow-3", assetKey: "slow-tile-3", caption: "Notebook", bucket: "Objects of Desire", pinType: "object" },
            { id: "slow-4", assetKey: "slow-tile-4", caption: "Café table", bucket: "Daily Rituals", pinType: "ritual" },
            { id: "slow-5", assetKey: "slow-tile-5", caption: "Walking shot", bucket: "Daily Rituals", pinType: "ritual" },
            { id: "slow-6", assetKey: "slow-tile-6", caption: "Light on wall", bucket: "Inspiration", pinType: "inspiration" },
          ]}
        />

        <MomentBlock
          title="What earns space"
          paragraphs={[
            "In slow travel, objects earn their place. They travel well. They work hard. They feel right in more than one moment.",
            "Nothing disposable. Nothing excess.",
            "Everything chosen."
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
            "A morning walk. The same seat. The same order.",
            "Ritual is what makes time feel generous."
          ]}
          assetKey="slow-ritual-1"
          bucket="Daily Rituals"
          pinType="ritual"
          sourceStory="Slow Travel"
          imagePosition="right"
        />

        <ClosingLine text="Save what you want to stay with. Let go of the rest." id="slow-travel-closing" sourceStory="Slow Travel" />
      </section>

      <StoryDivider />

      {/* RETREAT */}
      <section id="retreat">
        <PageTurnHero
          title="Movement, Then Stillness"
          stateOfMind="Begin in the body. End in quiet."
          paragraph="A ritual retreat is not an escape. It is a return to sequence. Movement, then stillness. Effort, then rest. The body leads. The mind follows."
          assetKey="retreat-hero"
          bucket="Travel & Experiences"
          pinType="place"
        />

        <QuoteCard quote="Move the body. Then listen." id="retreat-quote-1" sourceStory="Retreat" />

        <MomentBlock
          title="Movement as calibration"
          paragraphs={[
            "Movement here is not performance. It is preparation.",
            "Stretching, walking, breathing — done without mirrors or urgency. Enough to wake the body. Never enough to exhaust it.",
            "The point is not intensity. It is clarity."
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
          pinType="ritual"
          id="retreat-motion-1"
          sourceStory="Retreat"
        />

        <MomentBlock
          title="Architecture that supports practice"
          paragraphs={[
            "The best retreats are designed to get out of your way. Rooms feel held, not styled. Paths invite walking, not wandering.",
            "Silence is built into the walls."
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
            { id: "retreat-1", assetKey: "retreat-tile-1", caption: "Wrap", bucket: "Objects of Desire", pinType: "item" },
            { id: "retreat-2", assetKey: "retreat-tile-2", caption: "Oil", bucket: "Objects of Desire", pinType: "object" },
            { id: "retreat-3", assetKey: "retreat-tile-3", caption: "Sandal", bucket: "Objects of Desire", pinType: "item" },
            { id: "retreat-4", assetKey: "retreat-tile-4", caption: "Mat", bucket: "Daily Rituals", pinType: "ritual" },
            { id: "retreat-5", assetKey: "retreat-tile-5", caption: "Quiet corridor", bucket: "Travel & Experiences", pinType: "place" },
            { id: "retreat-6", assetKey: "retreat-tile-6", caption: "Post-practice look", bucket: "Your Style", pinType: "look" },
          ]}
        />

        <MomentBlock
          title="What belongs in practice"
          paragraphs={[
            "Everything here serves a purpose. A wrap for warmth. Oil for skin. Shoes you step out of easily.",
            "Nothing distracts. Nothing performs."
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
            "After practice, dressing becomes instinctive. Soft layers. Neutral tones. Shapes that don't interrupt the body.",
            "You are not dressing to be seen. You are dressing to stay in the state you've entered."
          ]}
          assetKey="retreat-style-1"
          bucket="Your Style"
          pinType="look"
          sourceStory="Retreat"
          imagePosition="right"
        />

        <ClosingLine text="Begin with movement. End with stillness. Remember how it feels." id="retreat-closing" sourceStory="Retreat" />
      </section>

      <StoryDivider />

      {/* NEW YORK */}
      <section id="new-york">
        <PageTurnHero
          title="The Weekend That Holds"
          stateOfMind="Containment, appetite, and momentum."
          paragraph="New York doesn't slow down for you. You learn how to move inside it. The rhythm is relentless, but it holds you if you let it. This is how the weekend sustains."
          assetKey="newyork-hero"
          bucket="Culture"
          pinType="place"
        />

        <QuoteCard quote="New York isn't conquered. It's edited." id="newyork-quote-1" sourceStory="New York" />

        <MomentBlock
          title="Dressing for the city's pace"
          paragraphs={[
            "New York dressing is about stamina. Clothes that hold their shape at midnight. Shoes you can stand in. A coat that finishes the sentence.",
            "Black works here. So does bone, charcoal, deep brown.",
            "Nothing precious. Everything intentional."
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
            "You don't rush culture in this city. You let it meet you.",
            "One exhibition. One room you stay in longer than planned. A moment where time loosens its grip.",
            "New York gives generously — if you don't ask for everything."
          ]}
          assetKey="newyork-culture-1"
          bucket="Culture"
          pinType="culture"
          sourceStory="New York"
          imagePosition="right"
        />

        <PinGrid
          title="Night Plan"
          sourceStory="New York"
          tiles={[
            { id: "ny-1", assetKey: "ny-tile-1", caption: "Bar interior", bucket: "Travel & Experiences", pinType: "experience" },
            { id: "ny-2", assetKey: "ny-tile-2", caption: "Dinner table", bucket: "Travel & Experiences", pinType: "experience" },
            { id: "ny-3", assetKey: "ny-tile-3", caption: "Gallery wall", bucket: "Culture", pinType: "place" },
            { id: "ny-4", assetKey: "ny-tile-4", caption: "Coat look", bucket: "Your Style", pinType: "look" },
            { id: "ny-5", assetKey: "ny-tile-5", caption: "Boot or flat", bucket: "Objects of Desire", pinType: "item" },
            { id: "ny-6", assetKey: "ny-tile-6", caption: "Subway platform", bucket: "Inspiration", pinType: "inspiration" },
          ]}
        />

        <MomentBlock
          title="Evenings done well"
          paragraphs={[
            "The best nights are edited. A bar that understands lighting. A table that doesn't turn. A meal that unfolds slowly.",
            "You don't need to know everyone. You just need to be exactly where you are."
          ]}
          assetKey="newyork-experience-1"
          bucket="Travel & Experiences"
          pinType="experience"
          sourceStory="New York"
          imagePosition="left"
        />

        <TwoUpFeature
          title="Culture Hour"
          image1={{ assetKey: "ny-culture-1", caption: "Museum stair", bucket: "Culture", pinType: "place" }}
          image2={{ assetKey: "ny-culture-2", caption: "Gallery quiet room", bucket: "Culture", pinType: "place" }}
          sourceStory="New York"
        />

        <MomentBlock
          title="What carries the weekend"
          paragraphs={[
            "A bag that stays close. Sunglasses for the morning after. One piece of jewelry that works everywhere.",
            "New York asks for objects that keep up — not slow you down."
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
            { id: "ny-reset-3", assetKey: "ny-reset-3", caption: "Sunglasses", bucket: "Objects of Desire", pinType: "item" },
            { id: "ny-reset-4", assetKey: "ny-reset-4", caption: "Empty street morning", bucket: "Inspiration", pinType: "mood" },
          ]}
        />

        <MomentBlock
          title="Sunday containment"
          paragraphs={[
            "Sunday is for walking. No destination. No performance.",
            "Coffee in hand. Coat open. The city exhales with you.",
            "This is how you stay."
          ]}
          assetKey="newyork-ritual-1"
          bucket="Daily Rituals"
          pinType="ritual"
          sourceStory="New York"
          imagePosition="left"
        />

        <ClosingLine text="Save what sustains you. You'll need it again next week." id="newyork-closing" sourceStory="New York" />
      </section>

      <div className="py-20 text-center">
        <p className="text-xs tracking-widest uppercase text-muted-foreground">End of Issue 1</p>
      </div>
    </div>
  );
}
