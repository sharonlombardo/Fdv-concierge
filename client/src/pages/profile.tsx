export default function Profile() {
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
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "rgba(44, 36, 22, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(44, 36, 22, 0.4)" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      </div>
      <h1
        style={{
          fontFamily: "Lora, serif",
          fontSize: 32,
          fontWeight: 500,
          color: "#2c2416",
          marginBottom: 12,
        }}
      >
        Profile
      </h1>
      <p
        style={{
          fontFamily: "Lora, serif",
          fontSize: 15,
          fontStyle: "italic",
          color: "rgba(44, 36, 22, 0.55)",
          maxWidth: 360,
          lineHeight: 1.6,
          marginBottom: 32,
        }}
      >
        Your account, preferences, and subscription tier.
      </p>

      {/* Tier badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 20px",
          borderRadius: 999,
          background: "rgba(201, 168, 76, 0.1)",
          border: "1px solid rgba(201, 168, 76, 0.25)",
          marginBottom: 32,
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#c9a84c",
          }}
        >
          Free Tier
        </span>
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
