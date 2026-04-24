import { Link } from "wouter";
import { useScrollDepth } from "@/hooks/use-scroll-depth";

const goldLink: React.CSSProperties = {
  color: "#c9a84c",
  textDecoration: "none",
};

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
            We build destination <Link href="/guides" className="about-link" style={goldLink}>guides</Link> with the kind of detail a good friend gives you — specific restaurants, real opinions, the hotel you actually want. And everything is shoppable. The entire collection — wardrobe, accessories, beauty, home — is here to browse and buy in the <Link href="/shop" className="about-link" style={goldLink}>shop</Link>, whether or not you're planning a trip.
          </p>
          <p>
            We're not a travel agency. We're not a fashion brand. We're the place where travel and wardrobe meet — and we built three ways to let you in.
          </p>
        </div>

        {divider}

        {/* SECTION 2: HOW IT WORKS */}
        <p style={sectionHeader}>How It Works</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            Browse the <Link href="/guides" className="about-link" style={goldLink}>guides</Link>. Save what stops you — a restaurant, a hotel, a dress, a pair of earrings. Everything you save goes to your <Link href="/suitcase" className="about-link" style={goldLink}>Suitcase</Link>.
          </p>
          <p style={{ marginBottom: 20 }}>
            When you're ready, choose how deep you want to go. <Link href="/guides/morocco" className="about-link" style={goldLink}>The Compass</Link> gives you the full itinerary, wardrobe, and packing list — delivered to your <Link href="/suitcase" className="about-link" style={goldLink}>Suitcase</Link> within hours. <Link href="/guides/morocco" className="about-link" style={goldLink}>The Passage</Link> takes it further: real bookings, a travel diary, your own wardrobe uploaded alongside ours. <Link href="/guides/morocco" className="about-link" style={goldLink}>The Trunk</Link> lets you buy every piece we've curated, sourced and shipped before you leave.
          </p>
          <p>
            You just show up.
          </p>
        </div>

        {divider}

        {/* SECTION 3: YOUR CONCIERGE */}
        <p style={sectionHeader}>Your Concierge</p>
        <div style={bodyText}>
          <p style={{ marginBottom: 20 }}>
            The gold circle at the bottom of your screen is your concierge. Tap it anytime.
          </p>
          <p style={{ marginBottom: 20 }}>
            She knows the <Link href="/guides" className="about-link" style={goldLink}>guides</Link> inside and out — every restaurant, every hotel, every product in the collection. Ask her where to eat in Marrakech and she'll tell you Le Jardin, the table under the banana leaves. Ask her what to wear and she'll pull a capsule wardrobe built around where you're going.
          </p>
          <p style={{ marginBottom: 20 }}>
            She remembers your conversations. She reads what you've saved. And she gets better the more you talk to her — not because of an algorithm, but because she's paying attention.
          </p>
          <p style={{ marginBottom: 20 }}>
            When you purchase a trip, she opens immediately — no waiting, no email chain. Your concierge conversation starts the moment you say go.
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
            Start with the <Link href="/shop" className="about-link" style={goldLink}>shop</Link>. The full collection lives there — wardrobe, accessories, beauty, objects — all of it travel-inspired, all of it shoppable right now. No trip required. Just things we love, available to you.
          </p>
          <p style={{ marginBottom: 20 }}>
            And when you are planning a trip:
          </p>
          <p style={{ marginBottom: 20 }}>
            <strong><Link href="/guides/morocco" className="about-link" style={goldLink}>The Compass</Link></strong> — $250. Your destination, decoded. A personalized itinerary, curated wardrobe, and packing list built around where you're going, when, and how you like to travel. Delivered to your <Link href="/suitcase" className="about-link" style={goldLink}>Suitcase</Link> within hours.
          </p>
          <p style={{ marginBottom: 20 }}>
            <strong><Link href="/guides/morocco" className="about-link" style={goldLink}>The Passage</Link></strong> — $750. Your trip, fully realized. Every booking confirmed, every detail handled, a travel diary that captures the whole story. Upload your own wardrobe and we'll style around what you already own.
          </p>
          <p style={{ marginBottom: 20 }}>
            <strong><Link href="/guides/morocco" className="about-link" style={goldLink}>The Trunk</Link></strong> — price based on your selections. Everything we've curated for your trip — sourced, packed, and shipped before you leave. A small gift arrives before departure. The rest is waiting when you get there.
          </p>
          <p>
            And soon: gift cards. For the woman who has everything except someone to plan the trip.
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
