import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SuitcaseButton } from "@/components/suitcase-button";

type CapsuleItem = {
  id: string;
  brand: string;
  name: string;
  price: string;
  imageUrl: string;
  fromSaves: boolean;
};

type CapsuleSection = {
  name: string;
  items: CapsuleItem[];
};

type Capsule = {
  id: string;
  name: string;
  description: string;
  heroImage: string;
  stats: {
    totalPieces: number;
    fromSaves: number;
    suggested: number;
  };
  sections: CapsuleSection[];
};

const desertNeutralsCapsule: Capsule = {
  id: "desert-neutrals",
  name: "Desert Neutrals",
  description: "The system noticed patterns in what you saved: warm earth tones, natural textures, relaxed silhouettes. This capsule brings those elements together into a cohesive collection for your journey.",
  heroImage: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=1600",
  stats: {
    totalPieces: 12,
    fromSaves: 8,
    suggested: 4
  },
  sections: [
    {
      name: "Base Layers",
      items: [
        { id: "cap-1", brand: "Fil de Vie", name: "Linen Wrap Dress", price: "$285", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-2", brand: "Mara Hoffman", name: "Relaxed Linen Trousers", price: "$320", imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-3", brand: "Esse", name: "Silk Cami", price: "$195", imageUrl: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&q=80&w=600", fromSaves: false },
        { id: "cap-11", brand: "Totême", name: "Cotton Poplin Shirt", price: "$240", imageUrl: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=600", fromSaves: true },
      ]
    },
    {
      name: "Statement Pieces", 
      items: [
        { id: "cap-4", brand: "Loewe", name: "Woven Basket Bag", price: "$890", imageUrl: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-5", brand: "Cult Gaia", name: "Crochet Cover-Up", price: "$348", imageUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&q=80&w=600", fromSaves: false },
        { id: "cap-12", brand: "Jacquemus", name: "Le Chiquito Long", price: "$620", imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600", fromSaves: true },
      ]
    },
    {
      name: "Accessories",
      items: [
        { id: "cap-6", brand: "Celine", name: "Triomphe Sunglasses", price: "$450", imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-7", brand: "Agmes", name: "Gold Hoops", price: "$380", imageUrl: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-8", brand: "Johanna Ortiz", name: "Silk Scarf", price: "$225", imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600", fromSaves: false },
      ]
    },
    {
      name: "Evening",
      items: [
        { id: "cap-9", brand: "Fil de Vie", name: "Evening Caftan", price: "$425", imageUrl: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&q=80&w=600", fromSaves: true },
        { id: "cap-10", brand: "Aquazzura", name: "Strappy Sandals", price: "$695", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600", fromSaves: true },
      ]
    }
  ]
};

const capsules: Record<string, Capsule> = {
  "desert-neutrals": desertNeutralsCapsule,
};

function CapsuleItemCard({ item, capsuleId }: { item: CapsuleItem; capsuleId: string }) {
  return (
    <div 
      className="group relative bg-white dark:bg-card rounded-md overflow-visible"
      data-testid={`card-capsule-item-${item.id}`}
    >
      <div className="aspect-[3/4] relative overflow-hidden rounded-md">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <Badge 
            variant="secondary" 
            className={`text-xs ${item.fromSaves 
              ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100' 
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}
          >
            {item.fromSaves ? "From Your Saves" : "Suggested"}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 z-10">
          <SuitcaseButton
            itemId={`${capsuleId}-${item.id}`}
            itemData={{
              title: item.name,
              brand: item.brand,
              imageUrl: item.imageUrl,
              price: item.price,
            }}
            sourceContext={`capsule_${capsuleId}`}
            size="md"
          />
        </div>
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{item.brand}</p>
        <h3 className="font-medium text-sm leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{item.price}</p>
      </div>
    </div>
  );
}

export default function CapsuleDetail() {
  const [, params] = useRoute("/suitcase/capsules/:slug");
  const slug = params?.slug || "desert-neutrals";
  const capsule = capsules[slug];

  if (!capsule) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-2xl mb-4">Capsule not found</h2>
          <Link href="/suitcase">
            <Button variant="outline">Back to Suitcase</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-background">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={capsule.heroImage}
          alt={capsule.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <Link href="/suitcase">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 gap-2" data-testid="button-back-suitcase">
              <ArrowLeft className="w-4 h-4" />
              Back to Suitcase
            </Button>
          </Link>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <p className="text-white/70 text-sm uppercase tracking-widest mb-2">Capsule Collection</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-medium mb-4" data-testid="text-capsule-title">
            {capsule.name}
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            A capsule collection based on your Morocco saves
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-8" data-testid="text-capsule-description">
          {capsule.description}
        </p>

        <div className="flex items-center gap-6 py-4 border-y border-border mb-12" data-testid="stats-capsule">
          <span className="text-sm">
            <span className="font-semibold">{capsule.stats.totalPieces}</span> pieces
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm">
            <span className="font-semibold">{capsule.stats.fromSaves}</span> from your saves
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm">
            <span className="font-semibold">{capsule.stats.suggested}</span> suggested for you
          </span>
        </div>

        {capsule.sections.map((section) => (
          <section key={section.name} className="mb-16">
            <h2 className="font-serif text-2xl font-medium mb-6" data-testid={`section-${section.name.toLowerCase().replace(/\s+/g, '-')}`}>
              {section.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {section.items.map((item) => (
                <CapsuleItemCard key={item.id} item={item} capsuleId={capsule.id} />
              ))}
            </div>
          </section>
        ))}

        <div className="mt-20 mb-12">
          <Link href="/editorial">
            <button
              className="w-full max-w-lg mx-auto block py-6 px-8 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all shadow-lg hover:shadow-xl"
              data-testid="button-turn-into-trip"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-serif text-xl font-medium">Turn into Trip</span>
              </div>
              <p className="text-sm text-white/80">
                Transform this capsule into a complete Morocco journey
              </p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
