import { Link } from "wouter";

export default function ConciergeInfo() {
  return (
    <div style={{ minHeight: "100vh", paddingTop: 70, paddingBottom: 100, background: "#faf9f6" }}>
      {/* Section 1: What the Concierge does */}
      <section style={{ padding: "60px 24px 48px", maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 20 }}>
          YOUR FDV CONCIERGE
        </p>
        <h1 style={{ fontFamily: "Lora, serif", fontSize: 26, fontWeight: 400, color: "#2c2416", lineHeight: 1.5, marginBottom: 20 }}>
          A taste-aware travel partner.
        </h1>
        <p style={{ fontFamily: "Lora, serif", fontSize: 17, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
          Your FDV Concierge knows what you've saved, what you love, and how you travel. It turns an overview into a fully orchestrated experience — every restaurant, every outfit, every transfer.
        </p>
        <p style={{ fontFamily: "Lora, serif", fontSize: 17, color: "#555", lineHeight: 1.75, marginBottom: 16 }}>
          Think of it as the person you wish you could call when you land. Someone with taste, context, and a plan.
        </p>
      </section>

      <div style={{ height: 1, background: "#e8e0d4", maxWidth: 600, margin: "0 auto" }} />

      {/* Section 2: Day 1 Preview */}
      <section style={{ padding: "48px 24px", maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 20 }}>
          PREVIEW — DAY 1, MOROCCO
        </p>
        <div style={{ background: "#fff", border: "1px solid #e8e0d4", padding: "28px 24px", marginBottom: 24 }}>
          <p style={{ fontFamily: "Lora, serif", fontSize: 15, color: "#2c2416", lineHeight: 1.75, marginBottom: 12 }}>
            Your car arrives at Marrakech Menara Airport at 10am. You're met by Mohammed, who will drive you to Kasbah Bab Ourika. The journey takes 45 minutes through the Atlas foothills.
          </p>
          <p style={{ fontFamily: "Lora, serif", fontSize: 15, color: "#2c2416", lineHeight: 1.75, marginBottom: 12 }}>
            Check in by noon. Lunch on the terrace — the kitchen already knows you prefer vegetables forward. Your afternoon is open: the pool, the gardens, or a walk to the village.
          </p>
          <p style={{ fontFamily: "Lora, serif", fontSize: 15, color: "#555", lineHeight: 1.75, fontStyle: "italic" }}>
            Tonight: dinner at Le Jardin, Medina. Your look is packed. Reservation confirmed.
          </p>
        </div>
        <p style={{ fontFamily: "Lora, serif", fontSize: 14, color: "#999", fontStyle: "italic", textAlign: "center" }}>
          This is the level of detail your Concierge handles for every day.
        </p>
      </section>

      <div style={{ height: 1, background: "#e8e0d4", maxWidth: 600, margin: "0 auto" }} />

      {/* Section 3: Passport Tiers */}
      <section style={{ padding: "48px 24px 60px", maxWidth: 600, margin: "0 auto" }}>
        <p style={{ fontFamily: "Lora, serif", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: "#c9a84c", marginBottom: 24 }}>
          PASSPORT TIERS
        </p>

        {[
          {
            name: "Digital Passport",
            price: "Free",
            features: ["Browse all destinations", "Save to your Suitcase", "Destination guides + editorial", "1 curated Edit per day"],
          },
          {
            name: "Gold Passport",
            price: "$29/month",
            features: ["Everything in Digital", "Full itineraries (all days)", "Complete packing lists", "3 curated Edits per day"],
          },
          {
            name: "Black Passport",
            price: "$59/month",
            features: ["Everything in Gold", "My Wardrobe (your closet)", "Unlimited Edits", "Book the Trip — full concierge booking"],
          },
        ].map((tier) => (
          <div
            key={tier.name}
            style={{
              background: "#fff",
              border: "1px solid #e8e0d4",
              padding: "24px",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <h3 style={{ fontFamily: "Lora, serif", fontSize: 17, fontWeight: 500, color: "#2c2416" }}>{tier.name}</h3>
              <span style={{ fontFamily: "Lora, serif", fontSize: 14, color: "#c9a84c" }}>{tier.price}</span>
            </div>
            {tier.features.map((f, i) => (
              <p key={i} style={{ fontSize: 13, color: "#666", margin: "6px 0", paddingLeft: 16, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#c9a84c" }}>&#10033;</span>
                {f}
              </p>
            ))}
          </div>
        ))}

        <p style={{ fontFamily: "Lora, serif", fontSize: 13, color: "#999", textAlign: "center", fontStyle: "italic", marginTop: 24 }}>
          During the pilot, all tiers are unlocked. Explore everything.
        </p>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: "0 24px 48px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <Link href="/concierge-chat">
          <a style={{
            display: "inline-block",
            background: "#1a1a1a",
            color: "#fff",
            padding: "14px 40px",
            fontFamily: "Lora, serif",
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textDecoration: "none",
          }}>
            Chat with Your Concierge
          </a>
        </Link>
        <div style={{ marginTop: 16 }}>
          <Link href="/guides/morocco">
            <a style={{
              fontFamily: "Lora, serif",
              fontSize: 14,
              color: "#999",
              textDecoration: "underline",
            }}>
              or explore Morocco
            </a>
          </Link>
        </div>
      </section>
    </div>
  );
}
