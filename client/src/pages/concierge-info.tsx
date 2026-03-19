export default function ConciergeInfo() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 70,
        paddingBottom: 80,
        background: "#faf9f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "70px 24px 80px",
      }}
    >
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(44, 36, 22, 0.4)",
          marginBottom: 16,
        }}
      >
        Premium Service
      </p>
      <h1
        style={{
          fontFamily: "Lora, serif",
          fontSize: 32,
          fontWeight: 500,
          color: "#2c2416",
          marginBottom: 12,
        }}
      >
        Your FDV Concierge
      </h1>
      <p
        style={{
          fontFamily: "Lora, serif",
          fontSize: 15,
          fontStyle: "italic",
          color: "rgba(44, 36, 22, 0.55)",
          maxWidth: 400,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        Style, travel, and the details in between — with someone who already knows what you love.
      </p>

      {/* Service features */}
      <div
        style={{
          maxWidth: 360,
          textAlign: "left",
          marginBottom: 40,
        }}
      >
        {[
          "Customize any itinerary",
          "Swap restaurants, add days, adjust pace",
          "Pre-built packing lists for every trip",
          "24/7 AI concierge access",
          "Morning alerts with your daily schedule",
          "Shop for you — sourced, reserved, delivered",
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              padding: "8px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ color: "#c9a84c", fontSize: 14 }}>&#10033;</span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                color: "rgba(44, 36, 22, 0.7)",
                lineHeight: 1.5,
              }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 24px",
          borderRadius: 999,
          border: "1px solid rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#c9a84c",
          }}
        />
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(44, 36, 22, 0.5)",
          }}
        >
          Coming Soon
        </span>
      </div>
    </div>
  );
}
