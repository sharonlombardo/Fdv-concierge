import { useScrollDepth } from "@/hooks/use-scroll-depth";

const sectionHeader: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#c9a84c",
  textAlign: "center",
  marginBottom: 24,
};

const bodyText: React.CSSProperties = {
  fontFamily: "'Lora', Georgia, serif",
  fontSize: 18,
  color: "#2c2416",
  lineHeight: 1.75,
  textAlign: "center",
};

const divider = (
  <div style={{ display: "flex", justifyContent: "center", margin: "64px 0" }}>
    <div style={{ width: 50, height: 1, backgroundColor: "#c9a84c" }} />
  </div>
);

export default function About() {
  useScrollDepth("/about");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* SECTION 1: WHAT THIS IS */}
        <p style={sectionHeader}>What This Is</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            FIL DE VIE Concierge is one place for everything that surrounds a trip — where to go, where to stay, where to eat, and what to wear when you get there.
          </p>
          <p style={{ marginBottom: 20 }}>
            We build destination guides with the kind of detail a good friend gives you — specific restaurants, real opinions, the hotel you actually want. And everything in the guides is shoppable. See a dress you love in the Morocco wardrobe? It's yours. A pair of sunglasses for Hydra? Tap and buy.
          </p>
          <p>
            We're not a travel agency. We're not a fashion brand. We're the place where travel and wardrobe meet — because they've always been the same decision.
          </p>
        </div>

        {divider}

        {/* SECTION 2: HOW IT WORKS */}
        <p style={sectionHeader}>How It Works</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            Browse the guides. Save what stops you — a restaurant, a hotel, a dress, a pair of earrings. Everything you save goes to your Suitcase.
          </p>
          <p style={{ marginBottom: 20 }}>
            When you're ready, we build your trip. Not a template. Yours. Based on what you saved, what you told the concierge, and what we know about how you travel. A daily itinerary, a curated wardrobe, a packing list, reservations — every detail considered.
          </p>
          <p>
            You just show up.
          </p>
        </div>

        {divider}

        {/* SECTION 3: THE CONCIERGE */}
        <p style={sectionHeader}>Your Concierge</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            The gold circle at the bottom of your screen is your concierge. Tap it anytime.
          </p>
          <p style={{ marginBottom: 20 }}>
            She knows the guides inside and out — every restaurant, every hotel, every product in the collection. Ask her where to eat in Marrakech and she'll tell you Le Jardin, the table under the banana leaves. Ask her what to wear and she'll pull a capsule wardrobe built around where you're going.
          </p>
          <p style={{ marginBottom: 20 }}>
            She remembers your conversations. She reads what you've saved. And she gets better the more you talk to her — not because of an algorithm, but because she's paying attention.
          </p>
          <p>
            Tell her where you want to go. She'll take it from there.
          </p>
        </div>

        {divider}

        {/* SECTION 4: WHAT YOU CAN BUY */}
        <p style={sectionHeader}>What You Can Buy</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            Everything in the guides is shoppable — wardrobe, accessories, beauty. Tap any product and it's yours.
          </p>
          <p style={{ marginBottom: 20 }}>
            Beyond that, we offer curated trip packages — a fully personalized itinerary, wardrobe edit, packing list, and booking service built around your destination, your dates, and your taste. Tell us when and where, and we'll handle the rest.
          </p>
          <p>
            Individual pieces if you just want the packing list. The full service if you want everything handled. However you travel.
          </p>
        </div>

        {divider}

        {/* SECTION 5: WHO THIS IS FOR */}
        <p style={sectionHeader}>Who This Is For</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            The woman who packs with intention. Who would rather have five perfect things than fifty good-enough ones. Who knows that what you wear is part of where you are — and wants both to feel considered.
          </p>
          <p>
            You don't need another travel app. You don't need another shopping site. You need one place that thinks about all of it the way you already do.
          </p>
        </div>

        {divider}

        {/* CLOSING LINE */}
        <p
          style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: 16,
            fontStyle: "italic",
            color: "rgba(44, 36, 22, 0.4)",
            textAlign: "center",
          }}
        >
          FIL DE VIE — the thread of life.
        </p>

      </div>
    </div>
  );
}
